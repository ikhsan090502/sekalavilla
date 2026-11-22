import React, { useState, useMemo } from 'react';
import { formatRupiah } from '../data/initialData';
import { POPULAR_FACILITIES, FACILITY_CATEGORIES } from '../components/SearchFilter';

export default function LandingGateway({ onComplete, onSkip, settings, initialFilters = {}, villas = [] }) {
  // Input State: Destinasi (Default: 'all' / Semua Lokasi, atau sesuai initialFilters)
  const [destination, setDestination] = useState(
    initialFilters.location && initialFilters.location !== 'all'
      ? (initialFilters.location.toLowerCase().includes('tawangmangu') ? 'tawangmangu' : 'yogyakarta')
      : 'all'
  );
  const [subLocations, setSubLocations] = useState(() => {
    if (Array.isArray(initialFilters.subLocations) && initialFilters.subLocations.length > 0) {
      return initialFilters.subLocations;
    }
    if (initialFilters.subLocation && typeof initialFilters.subLocation === 'string') {
      return initialFilters.subLocation.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  });
  const [propertyType, setPropertyType] = useState(initialFilters.propertyType || 'all');
  
  // Custom Typed Inputs (Persist dari history sebelumnya)
  const [minCapacity, setMinCapacity] = useState(initialFilters.capacity > 0 ? initialFilters.capacity : '');
  const [maxCapacity, setMaxCapacity] = useState(initialFilters.maxCapacity > 0 ? initialFilters.maxCapacity : '');
  const [minBedrooms, setMinBedrooms] = useState(initialFilters.bedrooms > 0 ? initialFilters.bedrooms : '');
  const [maxBedrooms, setMaxBedrooms] = useState(initialFilters.maxBedrooms > 0 ? initialFilters.maxBedrooms : '');
  
  // Helper memformat angka dengan pemisah ribuan titik (contoh: 1500000 -> 1.500.000)
  const formatNumberWithDots = (val) => {
    if (!val && val !== 0) return '';
    const cleanDigits = val.toString().replace(/\D/g, '');
    if (!cleanDigits) return '';
    return new Intl.NumberFormat('id-ID').format(parseInt(cleanDigits, 10));
  };

  const getRawNumber = (str) => {
    if (!str) return 0;
    const cleanDigits = str.toString().replace(/\D/g, '');
    return parseInt(cleanDigits, 10) || 0;
  };

  const [minPriceDisplay, setMinPriceDisplay] = useState(
    initialFilters.minPrice > 0 ? formatNumberWithDots(initialFilters.minPrice) : ''
  );
  const [maxPriceDisplay, setMaxPriceDisplay] = useState(
    initialFilters.budget && initialFilters.budget < 5000000 ? formatNumberWithDots(initialFilters.budget) : ''
  );

  // Fasilitas di Landing Page
  const [selectedFacilities, setSelectedFacilities] = useState(initialFilters.facilities || []);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchLocationQuery, setSearchLocationQuery] = useState('');
  const [showFacilityModal, setShowFacilityModal] = useState(false);
  const [facilitySearchQuery, setFacilitySearchQuery] = useState('');
  const [selectedFacilityCategory, setSelectedFacilityCategory] = useState('all');
  const [showFacilityReminder, setShowFacilityReminder] = useState(false);

  // Hitung jumlah villa yang cocok secara LIVE berdasarkan filter saat ini
  const liveCount = useMemo(() => {
    return villas.filter(v => {
      // Location
      if (destination !== 'all') {
        const loc = (v.location || '').toLowerCase();
        const dest = destination === 'tawangmangu' ? 'tawangmangu' : 'yogyakarta';
        if (!loc.includes(dest)) return false;
      }
      // Sub-locations
      if (subLocations.length > 0) {
        const matchAny = subLocations.some(sub => {
          const s = sub.toLowerCase();
          return (v.name||'').toLowerCase().includes(s) || (v.location||'').toLowerCase().includes(s) || (v.subLocation||'').toLowerCase().includes(s) || (v.desc||'').toLowerCase().includes(s);
        });
        if (!matchAny) return false;
      }
      // Property type
      if (propertyType !== 'all') {
        if ((v.propertyType || 'villa').toLowerCase() !== propertyType.toLowerCase()) return false;
      }
      // Capacity
      const minCap = parseInt(minCapacity) || 0;
      const maxCap = parseInt(maxCapacity) || 0;
      if (minCap > 0 && (v.capacity || 0) < minCap) return false;
      if (maxCap > 0 && (v.capacity || 0) > maxCap) return false;
      // Bedrooms
      const minBed = parseInt(minBedrooms) || 0;
      const maxBed = parseInt(maxBedrooms) || 0;
      if (minBed > 0 && (v.bedrooms || 1) < minBed) return false;
      if (maxBed > 0 && (v.bedrooms || 1) > maxBed) return false;
      // Price
      const rawMin = getRawNumber(minPriceDisplay);
      const rawMax = getRawNumber(maxPriceDisplay);
      if (rawMin > 0) {
        const tol = Math.min(rawMin * 0.15, 200000);
        if ((v.price || 0) < rawMin - tol) return false;
      }
      if (rawMax > 0) {
        const tol = Math.min(rawMax * 0.15, 250000);
        if ((v.price || 0) > rawMax + tol) return false;
      }
      // Facilities
      if (selectedFacilities.length > 0) {
        const feats = v.features || [];
        const hasAll = selectedFacilities.every(fac => feats.some(f => f.toLowerCase().includes(fac.toLowerCase())));
        if (!hasAll) return false;
      }
      return true;
    }).length;
  }, [villas, destination, subLocations, propertyType, minCapacity, maxCapacity, minBedrooms, maxBedrooms, minPriceDisplay, maxPriceDisplay, selectedFacilities]);

  const handleMinPriceChange = (e) => {
    const formatted = formatNumberWithDots(e.target.value);
    setMinPriceDisplay(formatted);
  };

  const handleMaxPriceChange = (e) => {
    const formatted = formatNumberWithDots(e.target.value);
    setMaxPriceDisplay(formatted);
  };

  const toggleFacility = (facilityId) => {
    setSelectedFacilities(prev => {
      const exists = prev.includes(facilityId);
      return exists ? prev.filter(id => id !== facilityId) : [...prev, facilityId];
    });
  };

  const selectAllFacilities = () => {
    const allIds = POPULAR_FACILITIES.map(f => f.id);
    setSelectedFacilities(allIds);
  };

  const clearAllFacilities = () => {
    setSelectedFacilities([]);
  };

  // Toggle Pilihan Area (Multi-select)
  const toggleArea = (areaId) => {
    if (!areaId) {
      // Klik 'Semua Area' -> reset subLocations
      setSubLocations([]);
      return;
    }
    setSubLocations(prev => {
      const exists = prev.includes(areaId);
      return exists ? prev.filter(a => a !== areaId) : [...prev, areaId];
    });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (selectedFacilities.length === 0 && !showFacilityReminder) {
      // Langsung buka modal fasilitas jika belum pilih
      setFacilitySearchQuery('');
      setSelectedFacilityCategory('all');
      setShowFacilityModal(true);
      setShowFacilityReminder(true); // tandai sudah pernah diingatkan
      return;
    }
    setShowFacilityReminder(false);
    onComplete({
      location: destination === 'tawangmangu' ? 'Tawangmangu' : destination === 'yogyakarta' ? 'Yogyakarta' : 'all',
      subLocation: subLocations.join(', '),
      subLocations: subLocations,
      propertyType: propertyType,
      capacity: parseInt(minCapacity) || 0,
      maxCapacity: parseInt(maxCapacity) || 0,
      bedrooms: parseInt(minBedrooms) || 0,
      maxBedrooms: parseInt(maxBedrooms) || 0,
      minPrice: getRawNumber(minPriceDisplay),
      maxPrice: getRawNumber(maxPriceDisplay),
      facilities: selectedFacilities
    });
  };

  const waPhone = destination === 'yogyakarta' 
    ? (settings?.whatsappPhoneJogja || settings?.whatsappPhone || '6281381669735')
    : (settings?.whatsappPhoneTawangmangu || settings?.whatsappPhone || '6281381669735');

  // Kirim Kriteria ke WhatsApp Admin sesuai format resmi
  const handleSendToWA = () => {
    const locName = destination === 'tawangmangu' 
      ? 'Tawangmangu' 
      : destination === 'yogyakarta' 
        ? 'Yogyakarta' 
        : 'Tawangmangu & Yogyakarta';

    const detailLoc = subLocations.length > 0 
      ? `${locName} (${subLocations.join(', ')})`
      : (destination !== 'all' ? locName : 'Semua Lokasi');

    let hargaText = 'Semua Rentang Harga';
    if (minPriceDisplay && maxPriceDisplay) {
      hargaText = `Rp ${minPriceDisplay} - Rp ${maxPriceDisplay}`;
    } else if (minPriceDisplay) {
      hargaText = `Mulai Rp ${minPriceDisplay}`;
    } else if (maxPriceDisplay) {
      hargaText = `Maksimal Rp ${maxPriceDisplay}`;
    }

    let capText = 'Bebas';
    if (minCapacity && maxCapacity) {
      capText = `${minCapacity} - ${maxCapacity} orang`;
    } else if (minCapacity) {
      capText = `Min. ${minCapacity} orang`;
    } else if (maxCapacity) {
      capText = `Maks. ${maxCapacity} orang`;
    }

    let bedText = 'Bebas';
    if (minBedrooms && maxBedrooms) {
      bedText = `${minBedrooms} - ${maxBedrooms} kamar`;
    } else if (minBedrooms) {
      bedText = `Min. ${minBedrooms} kamar`;
    } else if (maxBedrooms) {
      bedText = `Maks. ${maxBedrooms} kamar`;
    }

    const facText = selectedFacilities.length > 0 
      ? selectedFacilities.join(', ') 
      : 'Bebas';

    const messageLines = [
      'Halo Admin Sekala Villa',
      `Rekomendasi villa di ${locName}`,
      `- harga : ${hargaText}`,
      `- kapasitas : ${capText}`,
      `- kamar tidur : ${bedText}`,
      `- lokasi : ${detailLoc}`,
      `- fasilitas : ${facText}`,
      'Boleh minta rekomendasi alternatif atau promo terbaru?'
    ];

    const message = encodeURIComponent(messageLines.join('\n'));
    window.open(`https://wa.me/${waPhone}?text=${message}`, '_blank');
  };

  // DAFTAR AREA KHUSUS TAWANGMANGU (SEKIPAN, PANCOT, BLUMBANG, DLL)
  const TAWANGMANGU_AREAS = [
    { id: '', name: 'Semua Area Tawangmangu', desc: 'Tampilkan semua unit di Tawangmangu & Kemuning', icon: '🏔️', keywords: 'semua tawangmangu kemuning' },
    { id: 'Sekipan', name: 'Sekipan', desc: 'Kawasan Wisata Hutan Pinus, Sejuk & Banyak Spot Alam', icon: '🌲', keywords: 'sekipan pinus bukit' },
    { id: 'Tawangmangu Bawah', name: 'Tawangmangu Bawah', desc: 'Akses Mudah, Dekat Jalan Utama & Pasar Wisata', icon: '🏘️', keywords: 'tawangmangu bawah pasar jalan utama' },
    { id: 'Pancot', name: 'Pancot', desc: 'Kawasan Villa Tenang, Asri & Udara Dingin Lereng Lawu', icon: '🏡', keywords: 'pancot kalisoro dingin' },
    { id: 'Blumbang', name: 'Blumbang', desc: 'Dataran Tinggi Lereng Lawu, View Bukit & Ladang Hijau', icon: '⛰️', keywords: 'blumbang tinggi atas bukit' },
    { id: 'Kemuning', name: 'Kemuning / Ngargoyoso', desc: 'Hamparan Kebun Teh, Wisata Jeep Offroad & River Tubing', icon: '🍃', keywords: 'kemuning ngargoyoso teh kebun jeep' },
    { id: 'Grojogan Sewu', name: 'Grojogan Sewu / Kalisoro', desc: 'Dekat Kawasan Air Terjun & Wisata Populer', icon: '🌊', keywords: 'grojogan sewu air terjun kalisoro' },
  ];

  // DAFTAR AREA KHUSUS YOGYAKARTA (KALIURANG, SLEMAN, DLL)
  const YOGYAKARTA_AREAS = [
    { id: '', name: 'Semua Area Yogyakarta', desc: 'Tampilkan semua unit di Yogyakarta & Sleman', icon: '🏛️', keywords: 'semua jogja yogyakarta' },
    { id: 'Kaliurang', name: 'Kaliurang & Pakem', desc: 'Lereng Gunung Merapi, Udara Sejuk Dingin & View Merapi', icon: '🌋', keywords: 'kaliurang pakem merapi dingin' },
    { id: 'Sleman', name: 'Sleman', desc: 'Kawasan Asri, Tenang & Dekat Sentra Kuliner Jogja', icon: '🌿', keywords: 'sleman kuliner asri' },
    { id: 'Kota', name: 'Pusat Kota & Malioboro', desc: 'Akses Dekat Stasiun Tugu, Keraton & Pusat Belanja', icon: '🛍️', keywords: 'kota malioboro stasiun tugu keraton' },
    { id: 'Bantul', name: 'Bantul & Prawirotaman', desc: 'Kawasan Artistik, Kafe Estetik & Suasana Santai', icon: '🎨', keywords: 'bantul prawirotaman kafe kasongan' },
    { id: 'Prambanan', name: 'Prambanan & Kalasan', desc: 'Dekat Kompleks Candi Megah & Akses Solo-Jogja', icon: '🛕', keywords: 'prambanan kalasan candi' },
  ];

  // DAFTAR DESTINASI KETIKA PILIH SEMUA
  const ALL_DESTINATIONS = [
    { id: 'all', name: 'Semua Lokasi', desc: 'Tampilkan semua unit di Tawangmangu & Yogyakarta', icon: '🗺️', keywords: 'semua all tawangmangu yogyakarta jogja' },
    { id: 'tawangmangu', name: 'Tawangmangu & Kemuning', desc: 'Lereng Gunung Lawu, Kebun Teh, Grojogan Sewu, Dingin & Asri', icon: '🏔️', keywords: 'tawangmangu kemuning lawu grojogan karanganyar ngargoyoso' },
    { id: 'yogyakarta', name: 'Yogyakarta & Sleman', desc: 'Kaliurang Merapi View, Prambanan & Dekat Pusat Kota Jogja', icon: '🏛️', keywords: 'yogyakarta jogja kaliurang sleman merapi prambanan bantul kota' },
  ];

  const currentAreaList = destination === 'tawangmangu'
    ? TAWANGMANGU_AREAS
    : destination === 'yogyakarta'
      ? YOGYAKARTA_AREAS
      : ALL_DESTINATIONS;

  const filteredLocations = currentAreaList.filter(l => 
    l.name.toLowerCase().includes(searchLocationQuery.toLowerCase()) || 
    l.desc.toLowerCase().includes(searchLocationQuery.toLowerCase()) ||
    (l.keywords && l.keywords.toLowerCase().includes(searchLocationQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-sand-50 text-sand-900 flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Background Ambience Warm Neutral khas Sekala Villa */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-200/50 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-brand-200/40 rounded-full blur-3xl"></div>
      </div>

      {/* TOP BAR: LOGO & FAST ACTION */}
      <header className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-4 sm:py-5 flex items-center justify-between border-b border-sand-200/80 bg-white/70 backdrop-blur-md">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-900 text-amber-300 flex items-center justify-center text-lg sm:text-xl font-serif font-black shadow-md">
            S
          </div>
          <div>
            <span className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-brand-900 leading-none block">
              SEKALA
            </span>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-terracotta-600 font-extrabold">
              Villa & Stays
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSkip}
            className="text-[11px] sm:text-xs text-sand-700 hover:text-brand-900 font-bold transition flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white hover:bg-sand-100 border border-sand-200 shadow-xs"
          >
            <span>Lewati & Lihat Semua Unit</span>
            <i className="fa-solid fa-arrow-right text-[10px] text-terracotta-600"></i>
          </button>
        </div>
      </header>

      {/* MAIN INTERACTIVE MATCHER FORM */}
      <main className="relative z-10 max-w-3xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-8 space-y-1 sm:space-y-2">
          <span className="bg-amber-100 text-brand-900 border border-amber-300 text-[10px] sm:text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs">
            <i className="fa-solid fa-sliders text-terracotta-600"></i> Smart Trip Matcher
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-brand-900 leading-tight">
            Cari Tempat Menginap Sesuai Kebutuhan Anda
          </h1>
          <p className="text-xs sm:text-sm text-sand-600 leading-relaxed max-w-lg mx-auto">
            Pilih lokasi, kapasitas, jumlah kamar, dan fasilitas. Sistem langsung menyajikan villa atau glamping yang paling cocok.
          </p>
        </div>

        {/* LIVE COUNTER — tampil mencolok di atas form, sticky saat scroll */}
        {villas.length > 0 && (
          <div className="sticky top-0 z-20 -mx-3.5 sm:-mx-6 lg:-mx-8 px-3.5 sm:px-6 lg:px-8 py-2 bg-brand-900/95 backdrop-blur-sm shadow-lg mb-4 flex items-center justify-between gap-2">
            <span className="text-xs text-amber-300 font-bold flex items-center gap-1.5">
              <i className="fa-solid fa-sliders text-amber-400"></i>
              Sesuaikan pilihan untuk hasil terbaik
            </span>
            <span className="flex items-center gap-2">
              <span className="text-xs text-sand-300 font-medium">Ditemukan:</span>
              <span className={`font-black text-sm px-3 py-1 rounded-full border ${liveCount > 0 ? 'bg-amber-400 text-brand-950 border-amber-500' : 'bg-terracotta-600 text-white border-terracotta-700'}`}>
                {liveCount} Villa {liveCount === 0 ? '😔' : '✓'}
              </span>
            </span>
          </div>
        )}

        {/* CARD CONTAINER PUTIH ELEGAN (WARNA PERSIS HALAMAN UTAMA) */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border border-sand-200 space-y-5 sm:space-y-6">
          
          {/* STEP 1: PILIH LOKASI (FOKUS 1 DESTINASI & PILIH AREA WISATA) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-black uppercase tracking-wider text-sand-900 block">
                <i className="fa-solid fa-location-dot text-brand-700 mr-1.5"></i> 1. Pilih Lokasi Liburan
              </label>
              {destination !== 'all' ? (
                <button
                  type="button"
                  onClick={() => {
                    setDestination('all');
                    setSubLocations([]);
                  }}
                  className="text-xs text-brand-950 hover:text-brand-900 font-black flex items-center gap-1.5 transition bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-xl border border-amber-500 shadow-2xs"
                  title="Tampilkan kembali pilihan Jogja & Tawangmangu"
                >
                  <i className="fa-solid fa-rotate-left text-xs"></i> 
                  <span>Ganti Lokasi</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSearchLocationQuery('');
                    setShowLocationModal(true);
                  }}
                  className="text-xs text-brand-900 hover:text-brand-950 font-bold flex items-center gap-1 transition bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-xl border border-amber-300"
                >
                  <i className="fa-solid fa-magnifying-glass text-xs text-amber-700"></i> Cari Daerah Wisata
                </button>
              )}
            </div>

            {/* JIKA BELUM PILIH DESTINASI ('all'): TAMPILKAN 3 PILIHAN (SEMUA, TAWANGMANGU, JOGJA) */}
            {destination === 'all' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 animate-in fade-in">
                {/* 1. SEMUA LOKASI */}
                <button
                  type="button"
                  onClick={() => {
                    setDestination('all');
                    setSubLocations([]);
                  }}
                  className="p-3.5 rounded-2xl border-2 text-left transition-all duration-200 flex items-center justify-between bg-amber-400 text-brand-950 border-amber-500 shadow-sm font-black scale-[1.01]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🗺️</span>
                    <div>
                      <strong className="text-sm sm:text-base block leading-tight">Semua Lokasi</strong>
                      <span className="text-[11px] block text-brand-900 font-semibold">
                        Tawangmangu & Jogja
                      </span>
                    </div>
                  </div>
                  <i className="fa-solid fa-circle-check text-base text-brand-950"></i>
                </button>

                {/* 2. TAWANGMANGU */}
                <button
                  type="button"
                  onClick={() => {
                    setDestination('tawangmangu');
                    setSubLocations([]);
                  }}
                  className="p-3.5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between bg-sand-50 hover:bg-amber-50 hover:border-amber-300 text-sand-900 border-sand-200 hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🏔️</span>
                    <div>
                      <strong className="text-sm sm:text-base block leading-tight">Tawangmangu</strong>
                      <span className="text-[11px] block text-sand-600 font-medium">
                        Dingin Lawu
                      </span>
                    </div>
                  </div>
                  <i className="fa-solid fa-arrow-right text-xs text-sand-400"></i>
                </button>

                {/* 3. YOGYAKARTA */}
                <button
                  type="button"
                  onClick={() => {
                    setDestination('yogyakarta');
                    setSubLocations([]);
                  }}
                  className="p-3.5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between bg-sand-50 hover:bg-amber-50 hover:border-amber-300 text-sand-900 border-sand-200 hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🏛️</span>
                    <div>
                      <strong className="text-sm sm:text-base block leading-tight">Yogyakarta</strong>
                      <span className="text-[11px] block text-sand-600 font-medium">
                        Kaliurang & Kota
                      </span>
                    </div>
                  </div>
                  <i className="fa-solid fa-arrow-right text-xs text-sand-400"></i>
                </button>
              </div>
            )}

            {/* JIKA TAWANGMANGU DIPILIH: JOGJA HILANG AGAR FOKUS, MUNCUL PILIHAN AREA (MULTI-SELECT) */}
            {destination === 'tawangmangu' && (
              <div className="space-y-2 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {/* 1. KOTA TERPILIH: TAWANGMANGU */}
                  <div className="p-3.5 rounded-2xl border-2 text-left bg-amber-400 text-brand-950 border-amber-500 shadow-sm font-black flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">🏔️</span>
                      <div>
                        <strong className="text-sm sm:text-base block leading-tight">Tawangmangu & Kemuning</strong>
                        <span className="text-[11px] block text-brand-900 font-semibold">
                          Destinasi Terpilih (Lereng Lawu)
                        </span>
                      </div>
                    </div>
                    <span className="w-7 h-7 rounded-full bg-brand-950 text-amber-300 flex items-center justify-center text-xs font-bold">
                      <i className="fa-solid fa-check"></i>
                    </span>
                  </div>

                  {/* 2. TOMBOL PILIH AREA SPESIFIK (BISA MULTI-PILIH) */}
                  <button
                    type="button"
                    onClick={() => {
                      setSearchLocationQuery('');
                      setShowLocationModal(true);
                    }}
                    className={`p-3.5 rounded-2xl border-2 text-left transition flex items-center justify-between shadow-xs group ${
                      subLocations.length > 0 
                        ? 'border-amber-500 bg-amber-100 text-brand-950 font-black' 
                        : 'border-dashed border-amber-500 bg-amber-50 hover:bg-amber-100 text-brand-900'
                    }`}
                    title="Klik untuk memilih area di Tawangmangu (bisa pilih lebih dari 1)"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-9 h-9 rounded-xl bg-amber-400 text-brand-950 flex items-center justify-center text-sm font-bold shadow-2xs group-hover:scale-105 transition-transform border border-amber-500">
                        <i className="fa-solid fa-map-pin text-sm"></i>
                      </span>
                      <div>
                        <strong className="text-xs sm:text-sm block leading-tight">
                          {subLocations.length > 0 ? `Pilihan Area (${subLocations.length} dipilih)` : 'Pilih Area Wisata (Bisa >1)'}
                        </strong>
                        <span className="text-[11px] block text-amber-900 font-semibold">
                          {subLocations.length > 0 ? subLocations.join(', ') : 'Sekipan, Pancot, Blumbang, Kemuning...'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-brand-950 text-xs font-bold bg-white/70 px-2 py-1 rounded-lg border border-amber-300">
                      <span>{subLocations.length > 0 ? 'Edit' : 'Pilih'}</span>
                      <i className="fa-solid fa-chevron-right text-[10px]"></i>
                    </div>
                  </button>
                </div>

                {/* TAMPILAN AREA YANG SUDAH DI-SELECT (BADGES CHIPS LENGKAP) */}
                {subLocations.length > 0 && (
                  <div className="p-3 bg-amber-50/90 rounded-2xl border border-amber-300 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-950 flex items-center gap-1.5">
                        <i className="fa-solid fa-circle-check text-emerald-600"></i>
                        <span>Area terpilih ({subLocations.length}):</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setSubLocations([])}
                        className="text-xs text-terracotta-600 hover:text-terracotta-700 hover:underline font-bold"
                      >
                        Reset Pilihan Area
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {subLocations.map(areaName => (
                        <span 
                          key={areaName}
                          className="bg-amber-400 text-brand-950 text-xs sm:text-sm font-extrabold px-3 py-1 rounded-xl border border-amber-500 flex items-center gap-2 shadow-2xs"
                        >
                          <span>📍 {areaName}</span>
                          <button
                            type="button"
                            onClick={() => toggleArea(areaName)}
                            className="w-4 h-4 rounded-full bg-brand-950/20 hover:bg-brand-950 hover:text-amber-300 flex items-center justify-center text-[10px] transition"
                            title={`Hapus ${areaName}`}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* JIKA YOGYAKARTA DIPILIH: TAWANGMANGU HILANG AGAR FOKUS, MUNCUL PILIHAN AREA (MULTI-SELECT) */}
            {destination === 'yogyakarta' && (
              <div className="space-y-2 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {/* 1. KOTA TERPILIH: YOGYAKARTA */}
                  <div className="p-3.5 rounded-2xl border-2 text-left bg-amber-400 text-brand-950 border-amber-500 shadow-sm font-black flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">🏛️</span>
                      <div>
                        <strong className="text-sm sm:text-base block leading-tight">Yogyakarta & Sleman</strong>
                        <span className="text-[11px] block text-brand-900 font-semibold">
                          Destinasi Terpilih (Merapi View & Kota)
                        </span>
                      </div>
                    </div>
                    <span className="w-7 h-7 rounded-full bg-brand-950 text-amber-300 flex items-center justify-center text-xs font-bold">
                      <i className="fa-solid fa-check"></i>
                    </span>
                  </div>

                  {/* 2. TOMBOL PILIH AREA SPESIFIK JOGJA */}
                  <button
                    type="button"
                    onClick={() => {
                      setSearchLocationQuery('');
                      setShowLocationModal(true);
                    }}
                    className={`p-3.5 rounded-2xl border-2 text-left transition flex items-center justify-between shadow-xs group ${
                      subLocations.length > 0 
                        ? 'border-amber-500 bg-amber-100 text-brand-950 font-black' 
                        : 'border-dashed border-amber-500 bg-amber-50 hover:bg-amber-100 text-brand-900'
                    }`}
                    title="Klik untuk memilih area spesifik di Yogyakarta"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-9 h-9 rounded-xl bg-amber-400 text-brand-950 flex items-center justify-center text-sm font-bold shadow-2xs group-hover:scale-105 transition-transform border border-amber-500">
                        <i className="fa-solid fa-map-pin text-sm"></i>
                      </span>
                      <div>
                        <strong className="text-xs sm:text-sm block leading-tight">
                          {subLocations.length > 0 ? `Pilihan Area (${subLocations.length} dipilih)` : 'Pilih Area Wisata (Bisa >1)'}
                        </strong>
                        <span className="text-[11px] block text-amber-900 font-semibold">
                          {subLocations.length > 0 ? subLocations.join(', ') : 'Kaliurang, Sleman, Malioboro...'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-brand-950 text-xs font-bold bg-white/70 px-2 py-1 rounded-lg border border-amber-300">
                      <span>{subLocations.length > 0 ? 'Edit' : 'Pilih'}</span>
                      <i className="fa-solid fa-chevron-right text-[10px]"></i>
                    </div>
                  </button>
                </div>

                {/* TAMPILAN AREA YANG SUDAH DI-SELECT JOGJA */}
                {subLocations.length > 0 && (
                  <div className="p-3 bg-amber-50/90 rounded-2xl border border-amber-300 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-950 flex items-center gap-1.5">
                        <i className="fa-solid fa-circle-check text-emerald-600"></i>
                        <span>Area terpilih ({subLocations.length}):</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setSubLocations([])}
                        className="text-xs text-terracotta-600 hover:text-terracotta-700 hover:underline font-bold"
                      >
                        Reset Pilihan Area
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {subLocations.map(areaName => (
                        <span 
                          key={areaName}
                          className="bg-amber-400 text-brand-950 text-xs sm:text-sm font-extrabold px-3 py-1 rounded-xl border border-amber-500 flex items-center gap-2 shadow-2xs"
                        >
                          <span>📍 {areaName}</span>
                          <button
                            type="button"
                            onClick={() => toggleArea(areaName)}
                            className="w-4 h-4 rounded-full bg-brand-950/20 hover:bg-brand-950 hover:text-amber-300 flex items-center justify-center text-[10px] transition"
                            title={`Hapus ${areaName}`}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* STEP 2: TIPE AKOMODASI (VILLA / GLAMPING) */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-black uppercase tracking-wider text-sand-900 block">
              <i className="fa-solid fa-house-chimney text-brand-700 mr-1.5"></i> 2. Konsep Akomodasi
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'all', label: 'Semua Tipe', icon: 'fa-layer-group' },
                { id: 'villa', label: 'Villa Privat', icon: 'fa-house-chimney-window' },
                { id: 'glamping', label: 'Glamping', icon: 'fa-campground' }
              ].map(t => {
                const active = propertyType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setPropertyType(t.id)}
                    className={`p-2.5 sm:p-3 rounded-2xl border-2 text-center transition flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 ${
                      active
                        ? 'bg-amber-400 text-brand-950 border-amber-500 font-black shadow-sm scale-[1.02]'
                        : 'bg-sand-50 hover:bg-sand-100 text-sand-800 border-sand-200 font-bold text-xs'
                    }`}
                  >
                    <i className={`fa-solid ${t.icon} text-sm ${active ? 'text-brand-950' : 'text-brand-700'}`}></i>
                    <span className="text-xs sm:text-sm font-bold">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: INPUT RANGE KAPASITAS ORANG & RANGE JUMLAH KAMAR */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-black uppercase tracking-wider text-sand-900 block">
              <i className="fa-solid fa-users text-brand-700 mr-1.5"></i> 3. Kapasitas Tamu & Jumlah Kamar (Range)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Range Berapa Orang */}
              <div>
                <label className="text-xs text-sand-700 font-bold block mb-1">
                  Berapa Orang? (Min - Max)
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      placeholder="Min (4)"
                      value={minCapacity}
                      onChange={(e) => setMinCapacity(e.target.value)}
                      className="w-full bg-sand-50 border border-sand-200 rounded-xl pl-2.5 pr-8 py-1.5 sm:py-2 text-xs sm:text-sm text-sand-900 font-bold placeholder-sand-400 focus:outline-none focus:ring-2 focus:ring-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-sand-500 font-bold pointer-events-none">
                      Org
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      placeholder="Max (10)"
                      value={maxCapacity}
                      onChange={(e) => setMaxCapacity(e.target.value)}
                      className="w-full bg-sand-50 border border-sand-200 rounded-xl pl-2.5 pr-8 py-1.5 sm:py-2 text-xs sm:text-sm text-sand-900 font-bold placeholder-sand-400 focus:outline-none focus:ring-2 focus:ring-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-sand-500 font-bold pointer-events-none">
                      Org
                    </span>
                  </div>
                </div>
              </div>

              {/* Range Kamar Tidur */}
              <div>
                <label className="text-xs text-sand-700 font-bold block mb-1">
                  Jumlah Kamar Tidur? (Min - Max)
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      placeholder="Min (2)"
                      value={minBedrooms}
                      onChange={(e) => setMinBedrooms(e.target.value)}
                      className="w-full bg-sand-50 border border-sand-200 rounded-xl pl-2.5 pr-8 py-1.5 sm:py-2 text-xs sm:text-sm text-sand-900 font-bold placeholder-sand-400 focus:outline-none focus:ring-2 focus:ring-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-sand-500 font-bold pointer-events-none">
                      Kmr
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      placeholder="Max (4)"
                      value={maxBedrooms}
                      onChange={(e) => setMaxBedrooms(e.target.value)}
                      className="w-full bg-sand-50 border border-sand-200 rounded-xl pl-2.5 pr-8 py-1.5 sm:py-2 text-xs sm:text-sm text-sand-900 font-bold placeholder-sand-400 focus:outline-none focus:ring-2 focus:ring-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-sand-500 font-bold pointer-events-none">
                      Kmr
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4: RANGE BUDGET HARGA SEWA */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-black uppercase tracking-wider text-sand-900 block">
              <i className="fa-solid fa-tag text-brand-700 mr-1.5"></i> 4. Budget Sewa / Malam (Opsional)
            </label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-sand-400 font-bold">
                  Rp
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Min (500.000)"
                  value={minPriceDisplay}
                  onChange={handleMinPriceChange}
                  className="w-full bg-sand-50 border border-sand-200 rounded-xl pl-8 pr-2.5 py-1.5 sm:py-2 text-xs sm:text-sm text-sand-900 font-bold placeholder-sand-400 focus:outline-none focus:ring-2 focus:ring-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-sand-400 font-bold">
                  Rp
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Max (2.500.000)"
                  value={maxPriceDisplay}
                  onChange={handleMaxPriceChange}
                  className="w-full bg-sand-50 border border-sand-200 rounded-xl pl-8 pr-2.5 py-1.5 sm:py-2 text-xs sm:text-sm text-sand-900 font-bold placeholder-sand-400 focus:outline-none focus:ring-2 focus:ring-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
          </div>

          {/* STEP 5: PILIHAN FASILITAS DI LANDING PAGE */}
          <div className="space-y-2 pt-2 border-t border-sand-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-xs sm:text-sm font-black uppercase tracking-wider text-sand-900 block">
                  <i className="fa-solid fa-check-double text-emerald-600 mr-1.5"></i> 5. Fasilitas yang Diinginkan
                </label>
                {selectedFacilities.length > 0 && (
                  <span className="bg-amber-400 text-brand-950 font-black text-xs px-2 py-0.5 rounded-full shadow-2xs">
                    {selectedFacilities.length} dipilih
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedFacilities.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedFacilities([])}
                    className="text-xs text-terracotta-600 font-bold hover:underline"
                  >
                    Hapus Centang
                  </button>
                )}
              </div>
            </div>
            
            {/* TOMBOL PILIH FASILITAS — 1 CTA Besar */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => {
                  setFacilitySearchQuery('');
                  setSelectedFacilityCategory('all');
                  setShowFacilityModal(true);
                  setShowFacilityReminder(false);
                }}
                className={`w-full py-3 px-4 rounded-2xl border-2 transition flex items-center justify-center gap-2.5 active:scale-95 font-black text-sm ${
                  selectedFacilities.length > 0
                    ? 'border-amber-500 bg-amber-400 text-brand-950 shadow-md'
                    : 'border-dashed border-amber-500 bg-amber-50 hover:bg-amber-100 text-brand-950'
                }`}
              >
                <i className="fa-solid fa-list-check text-amber-700"></i>
                <span>Pilih Fasilitas Sesuai Kebutuhan</span>
                {selectedFacilities.length > 0 ? (
                  <span className="bg-white text-brand-950 font-black text-xs px-2.5 py-1 rounded-full border border-amber-500">
                    {selectedFacilities.length} dipilih ✓
                  </span>
                ) : (
                  <span className="text-xs text-amber-700 font-semibold">({POPULAR_FACILITIES.length} pilihan)</span>
                )}
              </button>
              {selectedFacilities.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedFacilities([])}
                  className="text-xs text-terracotta-600 font-bold hover:underline mx-auto"
                >
                  Hapus Pilihan Fasilitas
                </button>
              )}
            </div>
          </div>

          {/* TOMBOL AKSI: CARI & TERUSKAN KE WA (KIRI & KANAN RAPI DI MOBILE) */}
          <div className="pt-3 grid grid-cols-2 gap-2.5 sm:flex sm:justify-between sm:items-center border-t border-sand-200">
            {/* Tombol Teruskan ke WhatsApp */}
            <button
              type="button"
              onClick={handleSendToWA}
              className="w-full sm:w-auto text-emerald-700 hover:text-white bg-emerald-50 hover:bg-emerald-600 border border-emerald-300 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 active:scale-95 shadow-sm"
              title="Kirim kriteria filter langsung ke WhatsApp CS Sekala Villa"
            >
              <i className="fa-brands fa-whatsapp text-sm sm:text-base text-emerald-600 group-hover:text-white"></i>
              <span className="truncate">Teruskan ke WA</span>
            </button>

            {/* Tombol Cari & Buka Katalog */}
            <button
              type="submit"
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-brand-950 font-black text-xs sm:text-sm px-4 sm:px-7 py-2.5 sm:py-3 rounded-2xl border-2 border-amber-500 shadow-md transition-all flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-magnifying-glass text-xs"></i>
              <span className="truncate">Buka Katalog</span>
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </div>

          {/* NOTE & LIVE COUNT — di bawah tombol aksi, mencolok */}
          {villas.length > 0 && (
            <div className={`rounded-2xl p-3 flex items-center justify-between gap-2 border-2 ${liveCount > 0 ? 'bg-emerald-50 border-emerald-300' : 'bg-terracotta-50 border-terracotta-300'}`}>
              <div className="flex items-start gap-2 flex-1">
                <i className={`fa-solid mt-0.5 text-sm ${liveCount > 0 ? 'fa-circle-check text-emerald-600' : 'fa-circle-exclamation text-terracotta-600'}`}></i>
                <span className="text-xs font-bold text-sand-900">
                  {liveCount > 0
                    ? <>Ditemukan <strong className="text-emerald-700">{liveCount} villa</strong> sesuai pilihan Anda — klik <em>Buka Katalog</em> untuk melihat!</>
                    : <>Belum ada villa yang cocok. <span className="text-terracotta-700">Coba ubah harga, kapasitas, atau lokasi</span> agar pilihan lebih banyak.</>
                  }
                </span>
              </div>
              <span className={`font-black text-lg shrink-0 ${liveCount > 0 ? 'text-emerald-600' : 'text-terracotta-600'}`}>
                {liveCount}
              </span>
            </div>
          )}

          {/* POPUP — jika sudah pernah diingatkan pilih fasilitas & masih kosong → kasih opsi lewati */}
          {showFacilityReminder && selectedFacilities.length === 0 && !showFacilityModal && (
            <div className="p-3 bg-amber-50 border-2 border-amber-400 rounded-2xl text-sm text-brand-950 flex items-center gap-3">
              <i className="fa-solid fa-lightbulb text-amber-500 shrink-0"></i>
              <span className="flex-1 text-xs font-bold">Belum pilih fasilitas — atau langsung buka katalog?</span>
              <button
                type="button"
                onClick={() => {
                  setShowFacilityReminder(false);
                  onComplete({
                    location: destination === 'tawangmangu' ? 'Tawangmangu' : destination === 'yogyakarta' ? 'Yogyakarta' : 'all',
                    subLocation: subLocations.join(', '),
                    subLocations: subLocations,
                    propertyType: propertyType,
                    capacity: parseInt(minCapacity) || 0,
                    maxCapacity: parseInt(maxCapacity) || 0,
                    bedrooms: parseInt(minBedrooms) || 0,
                    maxBedrooms: parseInt(maxBedrooms) || 0,
                    minPrice: getRawNumber(minPriceDisplay),
                    maxPrice: getRawNumber(maxPriceDisplay),
                    facilities: []
                  });
                }}
                className="bg-amber-400 text-brand-950 font-black text-xs px-3 py-1.5 rounded-xl border border-amber-500 hover:bg-amber-300 transition shrink-0 active:scale-95"
              >
                Lewati →
              </button>
            </div>
          )}

        </form>

        {/* 3 VALUE UNGGULAN SEKALA VILLA (TRUST BADGES) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-6">
          <div className="bg-white border border-sand-200 rounded-2xl p-3 flex items-center gap-3 shadow-xs">
            <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-location-crosshairs text-xs sm:text-sm"></i>
            </span>
            <div>
              <strong className="text-xs text-brand-900 block">Free Antar Survey Villa</strong>
              <span className="text-[10px] text-sand-500">Bisa cek villa langsung ke lokasi bersama tim Sekala</span>
            </div>
          </div>

          <div className="bg-white border border-sand-200 rounded-2xl p-3 flex items-center gap-3 shadow-xs">
            <span className="w-8 h-8 rounded-xl bg-amber-100 text-brand-900 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-fire-burner text-xs sm:text-sm"></i>
            </span>
            <div>
              <strong className="text-xs text-brand-900 block">Bonus Alat BBQ Portable</strong>
              <span className="text-[10px] text-sand-500">Peminjaman alat panggangan siap pakai selama menginap</span>
            </div>
          </div>

          <div className="bg-white border border-sand-200 rounded-2xl p-3 flex items-center gap-3 shadow-xs">
            <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-shield-check text-xs sm:text-sm"></i>
            </span>
            <div>
              <strong className="text-xs text-brand-900 block">100% Host Terverifikasi</strong>
              <span className="text-[10px] text-sand-500">Harga langsung tanpa mark-up liar & jaminan kebersihan</span>
            </div>
          </div>
        </div>

      </main>

      {/* FOOTER GATEWAY */}
      <footer className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-4 text-center text-xs text-sand-600 border-t border-sand-200 bg-white/50 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>&copy; 2026 Sekala Villa Management. Tawangmangu & Yogyakarta.</span>
        <a 
          href={`https://wa.me/${waPhone}?text=Halo%20Admin%20Sekala%20Villa,%20mau%20konsultasi%20rekomendasi%20villa`}
          target="_blank"
          rel="noreferrer"
          className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1.5"
        >
          <i className="fa-brands fa-whatsapp text-sm text-emerald-600"></i> Butuh Rekomendasi Cepat? Chat CS WA
        </a>
      </footer>

      {/* POPUP MODAL PILIH DAERAH (MULTI-SELECT CHECKBOX) */}
      {showLocationModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowLocationModal(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-sand-200 space-y-4 max-h-[85vh] flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-sand-200">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-amber-400 text-brand-950 border border-amber-500 flex items-center justify-center text-xs shadow-xs font-black">
                  <i className="fa-solid fa-map-location-dot"></i>
                </span>
                <div>
                  <h3 className="font-serif font-bold text-base text-brand-900 leading-tight">
                    {destination === 'tawangmangu' 
                      ? 'Pilih Area Tawangmangu' 
                      : destination === 'yogyakarta'
                        ? 'Pilih Area Yogyakarta'
                        : 'Pilih Destinasi Liburan'}
                  </h3>
                  <span className="text-xs text-sand-500 font-medium">
                    {destination !== 'all' 
                      ? 'Bisa pilih lebih dari 1 area sekaligus' 
                      : 'Pilih kota tujuan Anda'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                className="w-8 h-8 rounded-full bg-sand-100 hover:bg-sand-200 text-sand-800 flex items-center justify-center transition"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            {/* Input Search Daerah */}
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-400 text-xs"></i>
              <input
                type="text"
                placeholder={
                  destination === 'tawangmangu'
                    ? 'Ketik nama area (misal: Sekipan, Pancot, Blumbang)...'
                    : destination === 'yogyakarta'
                      ? 'Ketik nama area (misal: Kaliurang, Sleman, Malioboro)...'
                      : 'Ketik nama destinasi...'
                }
                value={searchLocationQuery}
                onChange={(e) => setSearchLocationQuery(e.target.value)}
                className="w-full bg-sand-50 border border-sand-200 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm font-semibold text-sand-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Daftar Pilihan Daerah (Multi-select) */}
            <div className="space-y-2 overflow-y-auto max-h-60 pr-1">
              {filteredLocations.map(loc => {
                const isSelected = destination === 'all' 
                  ? destination === loc.id 
                  : (loc.id === '' ? subLocations.length === 0 : subLocations.includes(loc.id));

                return (
                  <button
                    key={loc.name}
                    type="button"
                    onClick={() => {
                      if (destination === 'all') {
                        setDestination(loc.id);
                        setSubLocations([]);
                        setShowLocationModal(false);
                      } else {
                        toggleArea(loc.id);
                      }
                    }}
                    className={`w-full p-3 rounded-2xl border-2 text-left transition flex items-center justify-between ${
                      isSelected 
                        ? 'bg-amber-400 text-brand-950 border-amber-500 shadow-sm font-bold' 
                        : 'bg-sand-50 hover:bg-sand-100 text-sand-900 border-sand-200 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">
                        {loc.icon || (loc.id === 'tawangmangu' ? '🏔️' : loc.id === 'yogyakarta' ? '🏛️' : '🗺️')}
                      </span>
                      <div>
                        <strong className="text-xs sm:text-sm block leading-tight">{loc.name}</strong>
                        <span className={`text-[10px] sm:text-[11px] block ${isSelected ? 'text-brand-900 font-semibold' : 'text-sand-500'}`}>
                          {loc.desc}
                        </span>
                      </div>
                    </div>
                    <i className={`fa-solid ${isSelected ? 'fa-square-check text-brand-950' : 'fa-square text-sand-300'} text-lg`}></i>
                  </button>
                );
              })}
            </div>

            {/* Modal Footer dengan Aksi Terapkan */}
            {destination !== 'all' && (
              <div className="pt-3 border-t border-sand-200 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSubLocations([])}
                  className="text-xs text-terracotta-600 hover:text-terracotta-700 font-bold px-3 py-2 rounded-xl hover:bg-sand-100 transition"
                >
                  Reset / Pilih Semua
                </button>
                <button
                  type="button"
                  onClick={() => setShowLocationModal(false)}
                  className="bg-amber-400 hover:bg-amber-300 text-brand-950 border border-amber-500 font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-sm transition"
                >
                  Terapkan ({subLocations.length > 0 ? `${subLocations.length} Area` : 'Semua Area'})
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* POPUP MODAL PILIH SEMUA FASILITAS */}
      {showFacilityModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowFacilityModal(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-sand-200 space-y-4 max-h-[85vh] flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-sand-200">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-amber-400 text-brand-950 border border-amber-500 flex items-center justify-center text-xs shadow-xs font-black">
                  <i className="fa-solid fa-list-check"></i>
                </span>
                <div>
                  <h3 className="font-serif font-bold text-base text-brand-900 leading-tight">
                    Semua Kategori Fasilitas
                  </h3>
                  <span className="text-xs text-sand-500 font-medium">
                    Pilih fasilitas yang wajib ada di villa Anda
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowFacilityModal(false)}
                className="w-8 h-8 rounded-full bg-sand-100 hover:bg-sand-200 text-sand-800 flex items-center justify-center transition"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            {/* Input Search Fasilitas */}
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-400 text-xs"></i>
              <input
                type="text"
                placeholder="Cari fasilitas (misal: kolam renang, karaoke, biliar)..."
                value={facilitySearchQuery}
                onChange={(e) => setFacilitySearchQuery(e.target.value)}
                className="w-full bg-sand-50 border border-sand-200 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm font-semibold text-sand-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Kategori Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
              {FACILITY_CATEGORIES.map(cat => {
                const isActive = selectedFacilityCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedFacilityCategory(cat.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                      isActive 
                        ? 'bg-amber-400 text-brand-950 border-amber-500 shadow-2xs font-black' 
                        : 'bg-sand-100 hover:bg-sand-200 text-sand-700 border-sand-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Grid Fasilitas */}
            <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-56 pr-1">
              {POPULAR_FACILITIES
                .filter(f => {
                  if (selectedFacilityCategory !== 'all' && f.category !== selectedFacilityCategory) return false;
                  if (facilitySearchQuery.trim()) {
                    const q = facilitySearchQuery.toLowerCase().trim();
                    return f.label.toLowerCase().includes(q) || (f.category && f.category.toLowerCase().includes(q));
                  }
                  return true;
                })
                .map(fac => {
                  const isSelected = selectedFacilities.includes(fac.id);
                  return (
                    <button
                      key={fac.id}
                      type="button"
                      onClick={() => toggleFacility(fac.id)}
                      className={`p-2.5 rounded-xl border-2 text-left transition flex items-center justify-between text-xs font-bold ${
                        isSelected 
                          ? 'bg-amber-400 text-brand-950 border-amber-500 shadow-2xs font-black' 
                          : 'bg-sand-50 hover:bg-sand-100 text-sand-800 border-sand-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <i className={`fa-solid ${fac.icon || 'fa-tag'} ${isSelected ? 'text-brand-950' : 'text-emerald-700'}`}></i>
                        <span className="truncate">{fac.label}</span>
                      </div>
                      <i className={`fa-solid ${isSelected ? 'fa-square-check text-brand-950' : 'fa-square text-sand-300'} text-base shrink-0 ml-1`}></i>
                    </button>
                  );
                })}
            </div>

            {/* Footer Modal Fasilitas */}
            <div className="pt-3 border-t border-sand-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectAllFacilities}
                  className="text-xs text-brand-900 font-bold hover:underline"
                >
                  Pilih Semua
                </button>
                <span className="text-sand-300">•</span>
                <button
                  type="button"
                  onClick={clearAllFacilities}
                  className="text-xs text-terracotta-600 font-bold hover:underline"
                >
                  Hapus Pilihan
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowFacilityModal(false)}
                className="bg-amber-400 hover:bg-amber-300 text-brand-950 border border-amber-500 font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-sm transition"
              >
                Terapkan ({selectedFacilities.length} Fasilitas)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}