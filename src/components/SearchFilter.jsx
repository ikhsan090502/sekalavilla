import React from 'react';
import { formatRupiah, PROPERTY_TYPES } from '../data/initialData';

export const POPULAR_FACILITIES = [
  { id: 'Private Pool', label: 'Private Pool', icon: 'fa-water-ladder' },
  { id: 'View Gunung', label: 'View Gunung', icon: 'fa-mountain-sun' },
  { id: 'View Kebun Teh', label: 'View Kebun Teh', icon: 'fa-leaf' },
  { id: 'Karaoke', label: 'Karaoke', icon: 'fa-microphone' },
  { id: 'Free Water Heater', label: 'Water Heater', icon: 'fa-temperature-arrow-up' },
  { id: 'Wifi 100Mbps', label: 'Wifi Cepat', icon: 'fa-wifi' },
  { id: 'Garden BBQ Area', label: 'Area BBQ', icon: 'fa-fire-burner' },
  { id: 'Dapur Ringkas', label: 'Dapur Masak', icon: 'fa-kitchen-set' },
  { id: 'Api Unggun', label: 'Api Unggun', icon: 'fa-campground' },
  { id: 'Billiard', label: 'Billiard', icon: 'fa-circle-dot' },
];

export default function SearchFilter({ 
  filters, 
  setFilters, 
  onReset,
  regions = [],
  onOpenRegionPage
}) {
  // Toggle pilihan fasilitas (Multi-select)
  const toggleFacility = (facilityId) => {
    setFilters(prev => {
      const current = prev.facilities || [];
      const exists = current.includes(facilityId);
      const nextFacilities = exists 
        ? current.filter(id => id !== facilityId)
        : [...current, facilityId];
      return {
        ...prev,
        facilities: nextFacilities
      };
    });
  };

  const clearFacilities = () => {
    setFilters(prev => ({ ...prev, facilities: [] }));
  };

  const selectedFacilities = filters.facilities || [];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-3 sm:-mt-6 relative z-20">
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-sand-200 space-y-4 sm:space-y-5">
        
        {/* HEADER: PILIH TIPE AKOMODASI (HANYA VILLA & GLAMPING) */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-sand-500 block">
                PILIHAN AKOMODASI
              </span>
              <h3 className="font-serif font-bold text-base sm:text-lg text-brand-900 leading-tight">
                Temukan Villa & Glamping Pilihan
              </h3>
            </div>
            <button 
              onClick={onReset}
              className="text-xs text-terracotta-600 font-bold hover:underline flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-terracotta-50 transition"
            >
              <i className="fa-solid fa-rotate-left text-[11px]"></i> Reset Semua
            </button>
          </div>

          {/* TAB TIPE AKOMODASI: SEMUA / VILLA / GLAMPING */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PROPERTY_TYPES.map(pt => {
              const active = (filters.propertyType || 'all') === pt.id;
              return (
                <button
                  key={pt.id}
                  onClick={() => setFilters(prev => ({ ...prev, propertyType: pt.id }))}
                  className={`py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2.5 border ${
                    active 
                      ? 'bg-brand-900 text-amber-300 border-brand-900 shadow-md scale-[1.01]' 
                      : 'bg-sand-50 text-sand-800 border-sand-200 hover:bg-sand-100 hover:text-brand-900'
                  }`}
                >
                  <i className={`fa-solid ${pt.icon} ${active ? 'text-amber-400' : 'text-brand-700'}`}></i>
                  <span>{pt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* INPUT PENCARIAN KATA KUNCI (SEARCH BAR) */}
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-sand-400 text-sm"></i>
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Cari nama unit (misal: The Noman, Atsiri, Bilby) atau fasilitas..."
            className="w-full bg-sand-50 border border-sand-200 rounded-2xl pl-11 pr-10 py-3 text-xs sm:text-sm font-medium text-sand-900 placeholder-sand-400 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:bg-white transition"
          />
          {filters.search && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sand-400 hover:text-sand-700 text-xs w-6 h-6 flex items-center justify-center rounded-full hover:bg-sand-200"
              title="Hapus pencarian"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        {/* BARIS DROPDOWN & SLIDER HARGA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. LOKASI */}
          <div>
            <label className="block text-[10px] font-extrabold text-sand-800 uppercase mb-1">
              <i className="fa-solid fa-location-dot text-brand-700 mr-1"></i> Lokasi Destinasi
            </label>
            <select
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-sand-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
            >
              <option value="all">Semua Lokasi</option>
              <option value="Tawangmangu">Tawangmangu & Kemuning</option>
              <option value="Yogyakarta">Yogyakarta & Sleman</option>
            </select>
          </div>

          {/* 2. KAPASITAS TAMU */}
          <div>
            <label className="block text-[10px] font-extrabold text-sand-800 uppercase mb-1">
              <i className="fa-solid fa-user-group text-brand-700 mr-1"></i> Kapasitas Tamu (Berapa Orang)
            </label>
            <select
              value={filters.capacity || 0}
              onChange={(e) => setFilters(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
              className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-sand-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
            >
              <option value="0">Semua Kapasitas</option>
              <option value="2">Minimal 2 Orang (Couple/Duo)</option>
              <option value="4">Minimal 4 Orang (Keluarga Kecil)</option>
              <option value="8">Minimal 8 Orang (Keluarga Besar)</option>
              <option value="12">Minimal 12+ Orang (Rombongan)</option>
            </select>
          </div>

          {/* 3. KATEGORI KELAS */}
          <div>
            <label className="block text-[10px] font-extrabold text-sand-800 uppercase mb-1">
              <i className="fa-solid fa-crown text-brand-700 mr-1"></i> Kategori Kelas
            </label>
            <select
              value={filters.category || 'all'}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-sand-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
            >
              <option value="all">Semua Kelas</option>
              <option value="Budget">Budget Friendly</option>
              <option value="Standard">Standard Pool & Camp</option>
              <option value="Premium">Premium / Gathering</option>
            </select>
          </div>

          {/* 4. BATAS BUDGET / HARGA PER MALAM */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] font-extrabold text-sand-800 uppercase">
                <i className="fa-solid fa-tag text-brand-700 mr-1"></i> Batas Budget / Malam
              </label>
              <span className="text-xs font-extrabold text-brand-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                {formatRupiah(filters.budget || 5000000)}
              </span>
            </div>
            <input
              type="range"
              min="300000"
              max="5000000"
              step="100000"
              value={filters.budget || 5000000}
              onChange={(e) => setFilters(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
              className="w-full accent-brand-700 h-2 bg-sand-200 rounded-lg cursor-pointer mt-1"
            />
            <div className="flex justify-between text-[10px] text-sand-400 mt-1 font-semibold">
              <span>Rp 300rb</span>
              <span>Rp 5 Juta+</span>
            </div>
          </div>
        </div>

        {/* BARIS FASILITAS: BISA PILIH BANYAK OPSI SEKALIGUS (MULTI-SELECT) */}
        <div className="pt-3 border-t border-sand-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-sand-800 uppercase tracking-wider">
                <i className="fa-solid fa-check-double text-emerald-600 mr-1"></i> 
                Pilih Fasilitas (Bisa Pilih Banyak Sekaligus):
              </span>
              {selectedFacilities.length > 0 && (
                <span className="text-[10px] bg-brand-900 text-amber-300 font-extrabold px-2 py-0.5 rounded-full">
                  {selectedFacilities.length} dipilih
                </span>
              )}
            </div>
            {selectedFacilities.length > 0 && (
              <button 
                onClick={clearFacilities}
                className="text-[11px] text-sand-500 hover:text-terracotta-600 font-semibold"
              >
                Hapus Centang Fasilitas
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {POPULAR_FACILITIES.map(fac => {
              const isSelected = selectedFacilities.includes(fac.id);
              return (
                <button
                  key={fac.id}
                  type="button"
                  onClick={() => toggleFacility(fac.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                    isSelected 
                      ? 'bg-brand-900 text-amber-300 border-brand-900 shadow-sm scale-105' 
                      : 'bg-sand-100 text-sand-800 border-sand-200 hover:bg-sand-200 hover:text-brand-900'
                  }`}
                >
                  <i className={`fa-solid ${isSelected ? 'fa-square-check text-amber-300' : (fac.icon || 'fa-tag')} text-xs ${!isSelected ? 'text-emerald-700' : ''}`}></i>
                  <span>{fac.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* OPSIONAL AKSES JELAJAHI PER WILAYAH KHUSUS */}
        {regions && regions.length > 0 && onOpenRegionPage && (
          <div className="pt-3 border-t border-sand-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold text-sand-500 uppercase tracking-wider">
                Atau Jelajahi Halaman Khusus per Daerah:
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {regions.map(r => (
                <button 
                  key={r.id} 
                  onClick={() => onOpenRegionPage(r.id)}
                  className="bg-sand-50 hover:bg-brand-900 border border-sand-200 hover:border-brand-900 rounded-2xl p-3 flex items-center justify-between group transition text-left shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-brand-900 group-hover:bg-amber-400 text-amber-300 group-hover:text-slate-950 flex items-center justify-center text-xs transition-colors">
                      <i className="fa-solid fa-location-dot"></i>
                    </span>
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-brand-900 group-hover:text-white block transition-colors">
                        {r.name}
                      </span>
                      <span className="text-[10px] text-sand-500 group-hover:text-amber-200 transition-colors">
                        Lihat Semua Villa & Glamping ({r.badge})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-terracotta-600 group-hover:text-amber-300 transition-colors">
                    <span>Buka Halaman</span>
                    <i className="fa-solid fa-arrow-right text-[11px] group-hover:translate-x-1 transition-transform"></i>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
