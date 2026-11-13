import { storage } from './storage';

// =========================================================================
// 🔗 KONFIGURASI REST API VPS SEKALA VILLA
// =========================================================================
// 1. Jika URL ini masih kosong (''), website otomatis memakai data lokal (offline).
// 2. Saat REST API dari VPS sudah ada, CUKUP MASUKKAN URL VPS DI BAWAH INI:
//    Contoh: 'https://api.domainvpskamu.com/api' atau 'http://103.150.xxx.xxx:8000/api'
// =========================================================================
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Header opsional (misal butuh API Key dari VPS)
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

/**
 * Normalisasi data villa dari API agar sesuai dengan komponen React
 */
function normalizeVilla(item) {
  if (!item) return null;
  return {
    id: item.id || `v-${Math.random()}`,
    name: item.name || item.nama || 'Unit Sekala',
    // Normalisasi Tipe: villa / glamping / homestay
    propertyType: (item.propertyType || item.property_type || item.type || item.tipe || 'villa').toLowerCase(),
    category: item.category || item.kategori || 'Standard',
    location: item.location || item.lokasi || 'Tawangmangu',
    capacity: parseInt(item.capacity || item.kapasitas || 4),
    bedrooms: parseInt(item.bedrooms || item.kamar || 1),
    price: parseInt(item.price || item.harga || item.price_start || 500000),
    rating: parseFloat(item.rating || 4.8),
    badge: item.badge || item.label || '',
    image: item.image || item.foto_utama || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
    images: Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []),
    features: Array.isArray(item.features || item.fasilitas) ? (item.features || item.fasilitas) : [],
    desc: item.desc || item.deskripsi || ''
  };
}

export const villaApi = {
  isConfigured() {
    return Boolean(API_BASE_URL && API_BASE_URL.trim() !== '');
  },

  async getVillas(filters = {}) {
    // 1. JIKA REST API VPS AKTIF
    if (this.isConfigured()) {
      try {
        const query = new URLSearchParams();
        
        if (filters.search && filters.search.trim()) {
          query.append('q', filters.search.trim());
          query.append('search', filters.search.trim());
        }
        if (filters.propertyType && filters.propertyType !== 'all') {
          query.append('type', filters.propertyType);
          query.append('property_type', filters.propertyType);
        }
        if (filters.location && filters.location !== 'all') {
          query.append('location', filters.location);
        }
        if (filters.category && filters.category !== 'all') {
          query.append('category', filters.category);
        }
        if (filters.capacity && filters.capacity > 0) {
          query.append('min_capacity', filters.capacity);
        }
        if (filters.budget) {
          query.append('max_price', filters.budget);
        }
        if (filters.facilities && filters.facilities.length > 0) {
          filters.facilities.forEach(fac => query.append('facility', fac));
        } else if (filters.facility && filters.facility !== 'all') {
          query.append('facility', filters.facility);
        }

        const url = `${API_BASE_URL}/villas${query.toString() ? `?${query.toString()}` : ''}`;
        const res = await fetch(url, { headers: DEFAULT_HEADERS });
        
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        
        const json = await res.json();
        const rawList = Array.isArray(json) ? json : (json.data || []);
        return rawList.map(normalizeVilla);
      } catch (err) {
        console.warn('⚠️ Gagal terhubung ke REST API VPS, menggunakan fallback lokal:', err.message);
      }
    }

    // 2. FALLBACK LOKAL (Jika API belum ada atau gagal dihubungi)
    const all = storage.getVillas();
    return all.filter(v => {
      // Filter Pencarian Teks
      if (filters.search && filters.search.trim() !== '') {
        const q = filters.search.toLowerCase().trim();
        const matchName = (v.name || '').toLowerCase().includes(q);
        const matchDesc = (v.desc || '').toLowerCase().includes(q);
        const matchLoc = (v.location || '').toLowerCase().includes(q);
        const matchFeat = (v.features || []).some(f => f.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchLoc && !matchFeat) return false;
      }

      if (filters.propertyType && filters.propertyType !== 'all') {
        const pType = (v.propertyType || 'villa').toLowerCase();
        if (pType !== filters.propertyType.toLowerCase()) return false;
      }
      if (filters.location && filters.location !== 'all' && v.location !== filters.location) return false;
      if (filters.category && filters.category !== 'all' && (v.category || 'Standard') !== filters.category) return false;
      if (filters.capacity && filters.capacity > 0 && v.capacity < filters.capacity) return false;
      if (filters.bedrooms && filters.bedrooms > 0 && (v.bedrooms || 1) < filters.bedrooms) return false;
      // Toleransi harga mendekati (±15% atau maks 200-250rb)
      if (filters.minPrice && filters.minPrice > 0) {
        const minTolerance = Math.min(filters.minPrice * 0.15, 200000);
        const effectiveMin = Math.max(0, filters.minPrice - minTolerance);
        if (v.price < effectiveMin) return false;
      }
      if (filters.budget && filters.budget > 0) {
        const maxTolerance = Math.min(filters.budget * 0.15, 250000);
        const effectiveMax = filters.budget + maxTolerance;
        if (v.price > effectiveMax) return false;
      }
      
      // Filter Multi-select Facilities (Bisa pilih banyak fasilitas sekaligus)
      if (filters.facilities && Array.isArray(filters.facilities) && filters.facilities.length > 0) {
        const itemFeatures = v.features || [];
        const hasAllSelected = filters.facilities.every(selectedFac =>
          itemFeatures.some(f => f.toLowerCase().includes(selectedFac.toLowerCase()))
        );
        if (!hasAllSelected) return false;
      } else if (filters.facility && filters.facility !== 'all') {
        const hasFac = (v.features || []).some(f => f.toLowerCase().includes(filters.facility.toLowerCase()));
        if (!hasFac) return false;
      }
      return true;
    });
  },

  async getBanners() {
    if (this.isConfigured()) {
      try {
        const res = await fetch(`${API_BASE_URL}/banners`, { headers: DEFAULT_HEADERS });
        if (res.ok) {
          const json = await res.json();
          return Array.isArray(json) ? json : (json.data || []);
        }
      } catch (err) {
        console.warn('⚠️ Gagal fetch banner dari VPS, menggunakan fallback:', err.message);
      }
    }
    return storage.getBanners();
  },

  async getSettings() {
    if (this.isConfigured()) {
      try {
        const res = await fetch(`${API_BASE_URL}/settings`, { headers: DEFAULT_HEADERS });
        if (res.ok) {
          const json = await res.json();
          return json.data || json;
        }
      } catch (err) {
        console.warn('⚠️ Gagal fetch settings dari VPS, menggunakan fallback:', err.message);
      }
    }
    return storage.getSettings();
  }
};
