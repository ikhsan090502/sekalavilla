import React, { useState, useMemo } from 'react';
import { formatRupiah, PROPERTY_TYPES, matchFacility, matchVillaSearch } from '../data/initialData';

export const POPULAR_FACILITIES = [
  { id: 'Private Pool', label: 'Private Pool', icon: 'fa-water-ladder', category: 'Utama' },
  { id: 'View Gunung', label: 'View Gunung', icon: 'fa-mountain-sun', category: 'Pemandangan' },
  { id: 'View Kebun Teh', label: 'View Kebun Teh', icon: 'fa-leaf', category: 'Pemandangan' },
  { id: 'Karaoke', label: 'Karaoke', icon: 'fa-microphone', category: 'Hiburan' },
  { id: 'Free Water Heater', label: 'Water Heater', icon: 'fa-temperature-arrow-up', category: 'Kenyamanan' },
  { id: 'Wifi 100Mbps', label: 'Wifi Cepat', icon: 'fa-wifi', category: 'Kenyamanan' },
  { id: 'Garden BBQ Area', label: 'Area BBQ', icon: 'fa-fire-burner', category: 'Outdoor' },
  { id: 'Dapur Ringkas', label: 'Dapur Masak', icon: 'fa-kitchen-set', category: 'Fasilitas' },
  { id: 'Api Unggun', label: 'Api Unggun', icon: 'fa-campground', category: 'Outdoor' },
  { id: 'Billiard', label: 'Billiard', icon: 'fa-circle-dot', category: 'Hiburan' },
  { id: 'Parkir Luas', label: 'Parkir Luas & Bus', icon: 'fa-square-parking', category: 'Akses' },
  { id: 'Playground', label: 'Playground Anak', icon: 'fa-child-reaching', category: 'Hiburan' },
  { id: 'Smart TV & Netflix', label: 'Smart TV / Netflix', icon: 'fa-tv', category: 'Hiburan' },
  { id: 'AC / Pendingin', label: 'AC / Air Conditioner', icon: 'fa-snowflake', category: 'Kenyamanan' },
  { id: 'Balkon Rooftop', label: 'Balkon Rooftop', icon: 'fa-cloud-sun', category: 'Pemandangan' },
];

export const FACILITY_CATEGORIES = [
  { id: 'all', label: 'Semua Kategori' },
  { id: 'Utama', label: 'Utama' },
  { id: 'Pemandangan', label: 'Pemandangan' },
  { id: 'Hiburan', label: 'Hiburan' },
  { id: 'Kenyamanan', label: 'Kenyamanan' },
  { id: 'Outdoor', label: 'Outdoor' },
  { id: 'Fasilitas', label: 'Dapur / Masak' },
  { id: 'Akses', label: 'Akses & Parkir' },
];

export default function SearchFilter({ 
  filters, 
  setFilters, 
  onReset,
  onOpenGateway,
  settings,
  villas = []
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchFacility, setSearchFacility] = useState('');
  const [selectedFacilityCategory, setSelectedFacilityCategory] = useState('all');
  const [showCriteriaForm, setShowCriteriaForm] = useState(false);

  // Hitung jumlah unit yang memiliki fasilitas tertentu
  const getFacilityCount = (facilityId) => {
    return (villas || []).filter(v => {
      if (filters.location && filters.location !== 'all') {
        const loc = (v.location || '').toLowerCase();
        if (!loc.includes(filters.location.toLowerCase())) return false;
      }
      return matchFacility(v.features, facilityId);
    }).length;
  };

  // 6 Fasilitas Favorit Utama yang selalu tampil di baris depan
  const TOP_FACILITIES = POPULAR_FACILITIES.slice(0, 6);

  // Helper memformat angka ribuan dengan pemisah titik otomatis (contoh: 1500000 -> 1.500.000)
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

  const waPhone = filters.location === 'Yogyakarta' 
    ? (settings?.whatsappPhoneJogja || settings?.whatsappPhone || '6281381669735')
    : (settings?.whatsappPhoneTawangmangu || settings?.whatsappPhone || '6281381669735');

  // Kirim Hasil Filter dari Card Putih ke WhatsApp sesuai format resmi yang diminta
  const handleSendFilterToWA = () => {
    const locName = filters.location !== 'all' ? filters.location : 'Tawangmangu & Yogyakarta';
    const subLocText = (filters.subLocations && filters.subLocations.length > 0)
      ? filters.subLocations.join(', ')
      : (filters.subLocation || '');

    const detailLoc = subLocText 
      ? `${locName} (${subLocText})`
      : (filters.location !== 'all' ? filters.location : 'Semua Lokasi');

    let hargaText = 'Semua Rentang Harga';
    if (filters.minPrice > 0 && filters.budget && filters.budget < 5000000) {
      hargaText = `${formatRupiah(filters.minPrice)} - ${formatRupiah(filters.budget)}`;
    } else if (filters.minPrice > 0) {
      hargaText = `Mulai ${formatRupiah(filters.minPrice)}`;
    } else if (filters.budget && filters.budget < 5000000) {
      hargaText = `Maksimal ${formatRupiah(filters.budget)}`;
    }

    let capText = 'Bebas';
    if (filters.capacity > 0 && filters.maxCapacity > 0) {
      capText = `${filters.capacity} - ${filters.maxCapacity} orang`;
    } else if (filters.capacity > 0) {
      capText = `Min. ${filters.capacity} orang`;
    } else if (filters.maxCapacity > 0) {
      capText = `Maks. ${filters.maxCapacity} orang`;
    }

    let bedText = 'Bebas';
    if (filters.bedrooms > 0 && filters.maxBedrooms > 0) {
      bedText = `${filters.bedrooms} - ${filters.maxBedrooms} kamar`;
    } else if (filters.bedrooms > 0) {
      bedText = `Min. ${filters.bedrooms} kamar`;
    } else if (filters.maxBedrooms > 0) {
      bedText = `Maks. ${filters.maxBedrooms} kamar`;
    }

    const facText = (filters.facilities && filters.facilities.length > 0)
      ? filters.facilities.join(', ')
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

  // Filter fasilitas di dalam Pop-up modal berdasarkan Kategori dan Input Pencarian
  const filteredAllFacilities = useMemo(() => {
    let list = POPULAR_FACILITIES;
    if (selectedFacilityCategory !== 'all') {
      list = list.filter(f => f.category === selectedFacilityCategory);
    }
    if (searchFacility.trim()) {
      const q = searchFacility.toLowerCase().trim();
      list = list.filter(f => 
        f.label.toLowerCase().includes(q) || 
        (f.category && f.category.toLowerCase().includes(q))
      );
    }
    return list;
  }, [searchFacility, selectedFacilityCategory]);

  // Hitung fasilitas yang dipilih tapi berada di luar 6 teratas
  const extraSelectedCount = useMemo(() => {
    const topIds = TOP_FACILITIES.map(f => f.id);
    return selectedFacilities.filter(id => !topIds.includes(id)).length;
  }, [selectedFacilities, TOP_FACILITIES]);

  // Hitung berapa kriteria aktif dari landing matcher
  const hasCustomMatcher = (filters.location && filters.location !== 'all') || 
                           (filters.subLocations && filters.subLocations.length > 0) ||
                           (filters.subLocation && filters.subLocation !== '') ||
                           (filters.capacity && filters.capacity > 0) || 
                           (filters.maxCapacity && filters.maxCapacity > 0) || 
                           (filters.bedrooms && filters.bedrooms > 0) || 
                           (filters.maxBedrooms && filters.maxBedrooms > 0) || 
                           (filters.minPrice && filters.minPrice > 0) || 
                           (filters.budget && filters.budget < 5000000) ||
                           (filters.propertyType && filters.propertyType !== 'all') ||
                           (filters.facilities && filters.facilities.length > 0);

  // Fasilitas yang ditampilkan di baris utama: 6 teratas + semua fasilitas yang sedang dipilih user
  const visibleFacilities = useMemo(() => {
    const topIds = TOP_FACILITIES.map(f => f.id);
    const extraSelected = POPULAR_FACILITIES.filter(f => selectedFacilities.includes(f.id) && !topIds.includes(f.id));
    return [...TOP_FACILITIES, ...extraSelected];
  }, [selectedFacilities, TOP_FACILITIES]);

  // Hitung berapa unit villa yang cocok secara LIVE dengan kriteria & fasilitas saat ini
  const modalLiveCount = useMemo(() => {
    return (villas || []).filter(v => {
      // 0. Search keyword & Nomor Villa (Real-time live count)
      if (filters.search && !matchVillaSearch(v, filters.search)) {
        return false;
      }
      // 1. Property type
      if (filters.propertyType && filters.propertyType !== 'all') {
        const pType = (v.propertyType || 'villa').toLowerCase();
        if (pType !== filters.propertyType.toLowerCase()) return false;
      }
      // 2. Location
      if (filters.location && filters.location !== 'all') {
        const loc = (v.location || '').toLowerCase();
        if (!loc.includes(filters.location.toLowerCase())) return false;
      }
      // 3. Sub-locations
      const activeSubLocs = (filters.subLocations && filters.subLocations.length > 0)
        ? filters.subLocations
        : (filters.subLocation ? filters.subLocation.split(',').map(s => s.trim()).filter(Boolean) : []);
      if (activeSubLocs.length > 0) {
        const matchAnySubLoc = activeSubLocs.some(subLoc => {
          const sub = subLoc.toLowerCase().trim();
          return (v.name||'').toLowerCase().includes(sub) || (v.location||'').toLowerCase().includes(sub) || (v.subLocation||'').toLowerCase().includes(sub);
        });
        if (!matchAnySubLoc) return false;
      }
      // 4. Capacity
      if (filters.capacity > 0 && (v.capacity || 0) < filters.capacity) return false;
      if (filters.maxCapacity > 0 && (v.capacity || 0) > filters.maxCapacity) return false;
      // 5. Bedrooms
      if (filters.bedrooms > 0 && (v.bedrooms || 1) < filters.bedrooms) return false;
      if (filters.maxBedrooms > 0 && (v.bedrooms || 1) > filters.maxBedrooms) return false;
      // 6. Price
      if (filters.minPrice > 0 && (v.price || 0) < filters.minPrice * 0.85) return false;
      if (filters.budget < 5000000 && (v.price || 0) > filters.budget * 1.15) return false;
      // 7. Facilities (termasuk yang sedang dicentang)
      if (selectedFacilities.length > 0) {
        const hasMatch = selectedFacilities.some(fac => matchFacility(v.features, fac));
        if (!hasMatch) return false;
      }
      return true;
    }).length;
  }, [villas, filters, selectedFacilities]);

  const activeSubLocations = (filters.subLocations && filters.subLocations.length > 0)
    ? filters.subLocations
    : (filters.subLocation ? filters.subLocation.split(',').map(s => s.trim()).filter(Boolean) : []);

  return (
    <section id="search-filter-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-3 sm:-mt-6 relative z-20">
      
      {/* LIVE FLOATING COUNTER — mengambang / freeze saat scroll mengisi filter katalog */}
      <div className="sticky top-2 z-30 mb-3 bg-brand-900/95 backdrop-blur-md text-white rounded-2xl px-4 py-2.5 shadow-xl border border-brand-800 flex items-center justify-between gap-3 animate-in fade-in">
        <div className="flex items-center gap-2">
          {onOpenGateway && (
            <button
              type="button"
              onClick={onOpenGateway}
              className="bg-amber-400 hover:bg-amber-300 text-brand-950 font-black text-[11px] px-2.5 py-1 rounded-xl transition flex items-center gap-1 shadow-xs border border-amber-500 shrink-0 active:scale-95"
              title="Mundur ke Landing Page Smart Matcher"
            >
              <i className="fa-solid fa-arrow-left text-[10px]"></i>
              <span>Landing</span>
            </button>
          )}
          <span className="w-6 h-6 rounded-lg bg-amber-400 text-brand-950 flex items-center justify-center text-xs font-black shrink-0 hidden sm:flex">
            <i className="fa-solid fa-sliders"></i>
          </span>
          <div>
            <span className="text-xs text-amber-300 font-bold block leading-none">
              Hasil Filter Katalog
            </span>
            <span className="text-[10px] text-sand-200">
              {modalLiveCount > 0 ? `${modalLiveCount} unit cocok tersedia` : 'Belum ada yang cocok, coba ubah kriteria'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-white font-bold hidden sm:inline">Ditemukan:</span>
          <span className={`font-black text-xs sm:text-sm px-3.5 py-1 rounded-full border-2 shadow-sm flex items-center gap-1.5 ${
            modalLiveCount > 0 
              ? 'bg-amber-400 text-brand-950 border-amber-500' 
              : 'bg-terracotta-600 text-white border-terracotta-700'
          }`}>
            <i className={`fa-solid ${modalLiveCount > 0 ? 'fa-check-circle' : 'fa-circle-exclamation'} text-xs`}></i>
            <span>{modalLiveCount} Villa {modalLiveCount > 0 ? '✓' : '😔'}</span>
          </span>
        </div>
      </div>

      {/* CARD PUTIH UTAMA (MEMBUNGKUS SEMUA FILTER TERMASUK STATUS & CARD KUNING) */}
      <div className={`bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-sand-200 space-y-4 sm:space-y-5 transition-all duration-300 ${
        hasCustomMatcher ? 'ring-2 ring-amber-300/50' : ''
      }`}>
        
        {/* BAGIAN FILTER AKTIF: JUDUL & CARD KUNING DIMASUKKAN KE DALAM CARD PUTIH */}
        {hasCustomMatcher && (
          <div className="space-y-2.5 pb-3 border-b border-sand-100">
            {/* 1. Judul Filter Pencarian Anda Sedang Aktif & Live Counter */}
            <div className="flex items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs sm:text-sm font-serif font-bold text-brand-900 tracking-wide">
                  Filter Pencarian Anda Sedang Aktif
                </span>
              </div>
              <span className="text-xs bg-amber-400 text-brand-950 font-black px-3 py-1 rounded-full border border-amber-500 shadow-xs shrink-0">
                {modalLiveCount} Villa Terfilter ✓
              </span>
            </div>

            {/* 2. Card Kuning Kriteria Menginap */}
            <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
                <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-400 text-brand-950 border border-amber-500 flex items-center justify-center text-xs sm:text-sm shrink-0 shadow-xs font-black">
                  <i className="fa-solid fa-sliders"></i>
                </span>
                <div>
                  <span className="text-xs sm:text-sm font-black text-brand-900 block leading-tight">
                    Kriteria Menginap Sesuai Inputan Anda
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {filters.location !== 'all' && (
                      <span className="bg-white text-brand-950 text-xs font-bold px-2.5 py-1 rounded-lg border border-amber-300 shadow-2xs">
                        📍 {filters.location}
                      </span>
                    )}
                    {activeSubLocations.length > 0 && activeSubLocations.map(subLoc => (
                      <span key={subLoc} className="bg-amber-400 text-brand-950 text-xs font-black px-2.5 py-1 rounded-lg border border-amber-500 shadow-2xs">
                        📌 Area: {subLoc}
                      </span>
                    ))}
                    {filters.propertyType !== 'all' && (
                      <span className="bg-white text-brand-950 text-xs font-bold px-2.5 py-1 rounded-lg border border-amber-300 capitalize shadow-2xs">
                        🏡 {filters.propertyType}
                      </span>
                    )}
                    {(filters.capacity > 0 || filters.maxCapacity > 0) && (
                      <span className="bg-white text-brand-950 text-xs font-bold px-2.5 py-1 rounded-lg border border-amber-300 shadow-2xs">
                        👥 {filters.capacity > 0 && filters.maxCapacity > 0 
                            ? `${filters.capacity} - ${filters.maxCapacity} Orang`
                            : filters.capacity > 0 
                              ? `Min. ${filters.capacity} Orang`
                              : `Maks. ${filters.maxCapacity} Orang`}
                      </span>
                    )}
                    {(filters.bedrooms > 0 || filters.maxBedrooms > 0) && (
                      <span className="bg-white text-brand-950 text-xs font-bold px-2.5 py-1 rounded-lg border border-amber-300 shadow-2xs">
                        🛏️ {filters.bedrooms > 0 && filters.maxBedrooms > 0 
                            ? `${filters.bedrooms} - ${filters.maxBedrooms} Kamar`
                            : filters.bedrooms > 0 
                              ? `Min. ${filters.bedrooms} Kamar`
                              : `Maks. ${filters.maxBedrooms} Kamar`}
                      </span>
                    )}
                    {(filters.minPrice > 0 || filters.budget < 5000000) && (
                      <span className="bg-white text-brand-950 text-xs font-bold px-2.5 py-1 rounded-lg border border-amber-300 shadow-2xs">
                        💰 {filters.minPrice > 0 ? formatRupiah(filters.minPrice) : 'Rp 0'} - {formatRupiah(filters.budget)}
                      </span>
                    )}
                    {selectedFacilities.length > 0 && (
                      <span className="bg-amber-400 text-brand-950 text-xs font-black px-2.5 py-1 rounded-lg border border-amber-500 shadow-2xs flex items-center gap-1">
                        ✨ Fasilitas ({selectedFacilities.length}): {selectedFacilities.map(fId => {
                          const f = POPULAR_FACILITIES.find(p => p.id === fId);
                          return f ? f.label : fId;
                        }).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* SATU TEMPAT TOMBOL AKSI: UBAH KRITERIA, KE HALAMAN DEPAN, & HAPUS FILTER */}
              <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-amber-200">
                {/* Tombol Ubah Kriteria Buka Formulir Bawah */}
                <button
                  type="button"
                  onClick={() => setShowCriteriaForm(prev => !prev)}
                  className="text-xs font-bold text-brand-900 hover:text-brand-950 bg-amber-400 hover:bg-amber-300 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-amber-500 transition flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <i className={`fa-solid ${showCriteriaForm ? 'fa-chevron-up' : 'fa-sliders'} text-[11px]`}></i>
                  <span>{showCriteriaForm ? 'Tutup Formulir' : 'Ubah Kriteria'}</span>
                </button>

                {/* Tombol Ke Halaman Depan */}
                {onOpenGateway && (
                  <button
                    type="button"
                    onClick={onOpenGateway}
                    className="text-xs font-bold text-sand-800 hover:text-brand-900 bg-white hover:bg-sand-100 px-3 py-1.5 sm:py-2 rounded-xl border border-sand-300 transition flex items-center gap-1 shadow-2xs"
                    title="Buka kembali Landing Page Matcher dengan data yang sudah Anda isi"
                  >
                    <i className="fa-solid fa-arrow-rotate-left text-[10px]"></i>
                    <span>Ke Halaman Depan</span>
                  </button>
                )}

                {/* SATU-SATUNYA TOMBOL HAPUS FILTER (TIDAK DOBEL) */}
                <button
                  type="button"
                  onClick={onReset}
                  className="text-xs font-bold text-terracotta-600 hover:text-terracotta-700 hover:underline px-2.5 py-1.5 rounded-lg hover:bg-white/80 transition flex items-center gap-1"
                  title="Hapus filter kriteria"
                >
                  <i className="fa-solid fa-trash-can text-[11px]"></i>
                  <span>Hapus Filter</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HEADER: PILIH TIPE AKOMODASI (HANYA VILLA & GLAMPING) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2.5 gap-2">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-sand-500 block">
                PILIHAN AKOMODASI
              </span>
              <h3 className="font-serif font-bold text-base sm:text-lg text-brand-900 leading-tight">
                Temukan Villa & Glamping Pilihan
              </h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {onOpenGateway && (
                <button
                  type="button"
                  onClick={onOpenGateway}
                  className="text-xs font-black text-brand-950 bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-xl border border-amber-500 transition flex items-center gap-1.5 shadow-2xs active:scale-95"
                  title="Mundur ke Landing Page Smart Matcher"
                >
                  <i className="fa-solid fa-arrow-left text-[10px]"></i>
                  <span>Mundur ke Landing Page</span>
                </button>
              )}
              <span className={`text-xs font-black px-3 py-1.5 rounded-xl border-2 shadow-2xs flex items-center gap-1.5 ${
                modalLiveCount > 0 ? 'bg-sand-100 text-brand-950 border-sand-300' : 'bg-sand-200 text-sand-800 border-sand-300'
              }`}>
                <i className="fa-solid fa-house text-xs"></i>
                <span>{modalLiveCount} Unit Tersedia</span>
              </span>
            </div>
          </div>

          {/* TAB TIPE AKOMODASI: SEMUA / VILLA / GLAMPING (WARNA KUNING CERAH AKTIF) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PROPERTY_TYPES.map(pt => {
              const active = (filters.propertyType || 'all') === pt.id;
              return (
                <button
                  key={pt.id}
                  onClick={() => setFilters(prev => ({ ...prev, propertyType: pt.id }))}
                  className={`py-3 px-4 rounded-2xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2.5 border-2 ${
                    active 
                      ? 'bg-amber-400 text-brand-950 border-amber-500 shadow-md scale-[1.01]' 
                      : 'bg-sand-50 text-sand-800 border-sand-200 hover:bg-amber-50 hover:border-amber-300 hover:text-brand-950'
                  }`}
                >
                  <i className={`fa-solid ${pt.icon} ${active ? 'text-brand-950' : 'text-brand-700'}`}></i>
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
            placeholder="Cari no. villa (misal: villa no 3, #03, 3), nama unit, atau fasilitas..."
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

        {/* BARIS FILTER FORMULIR (LOKASI, ORANG, KAMAR, HARGA):
            Jika dari matcher kriteria aktif, bisa dibuka-tutup lewat tombol Ubah Kriteria;
            Jika default tanpa matcher, otomatis selalu terbuka */}
        {(!hasCustomMatcher || showCriteriaForm) && (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 ${
            showCriteriaForm && hasCustomMatcher 
              ? 'p-4 rounded-2xl bg-sand-50 border-2 border-brand-900/30 animate-in fade-in' 
              : ''
          }`}>
            {/* 1. LOKASI */}
            <div>
              <label className="block text-xs sm:text-sm font-black text-sand-900 uppercase mb-1">
                <i className="fa-solid fa-location-dot text-brand-700 mr-1"></i> Lokasi Destinasi
              </label>
              <select
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-sand-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Semua Lokasi</option>
                <option value="Tawangmangu">Tawangmangu & Kemuning</option>
                <option value="Yogyakarta">Yogyakarta & Sleman</option>
              </select>
            </div>

            {/* 2. KAPASITAS TAMU (RANGE MIN - MAX ORANG) */}
            <div>
              <label className="block text-xs sm:text-sm font-black text-sand-900 uppercase mb-1">
                <i className="fa-solid fa-user-group text-brand-700 mr-1"></i> Kapasitas Orang (Min - Max)
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {/* Min Orang */}
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min (4)"
                    value={filters.capacity > 0 ? filters.capacity : ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setFilters(prev => ({ ...prev, capacity: isNaN(val) ? 0 : val }));
                    }}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl pl-2.5 pr-7 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-sand-900 placeholder-sand-400 focus:outline-none focus:ring-2 focus:ring-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-sand-500 font-bold pointer-events-none">
                    Min
                  </span>
                </div>

                {/* Max Orang */}
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    placeholder="Max (10)"
                    value={filters.maxCapacity > 0 ? filters.maxCapacity : ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setFilters(prev => ({ ...prev, maxCapacity: isNaN(val) ? 0 : val }));
                    }}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl pl-2.5 pr-7 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-sand-900 placeholder-sand-400 focus:outline-none focus:ring-2 focus:ring-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-sand-500 font-bold pointer-events-none">
                    Max
                  </span>
                </div>
              </div>
              <div className="text-[10px] text-sand-600 mt-1 font-bold">
                {filters.capacity > 0 && filters.maxCapacity > 0
                  ? `${filters.capacity} s/d ${filters.maxCapacity} Orang`
                  : filters.capacity > 0
                    ? `Min. ${filters.capacity} Orang`
                    : filters.maxCapacity > 0
                      ? `Maks. ${filters.maxCapacity} Orang`
                      : 'Semua Kapasitas'}
              </div>
            </div>

            {/* 3. JUMLAH KAMAR TIDUR (RANGE MIN - MAX KAMAR) */}
            <div>
              <label className="block text-xs sm:text-sm font-black text-sand-900 uppercase mb-1">
                <i className="fa-solid fa-bed text-brand-700 mr-1"></i> Kamar Tidur (Min - Max)
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {/* Min Kamar */}
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min (2)"
                    value={filters.bedrooms > 0 ? filters.bedrooms : ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setFilters(prev => ({ ...prev, bedrooms: isNaN(val) ? 0 : val }));
                    }}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl pl-2.5 pr-7 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-sand-900 placeholder-sand-400 focus:outline-none focus:ring-2 focus:ring-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-sand-500 font-bold pointer-events-none">
                    Min
                  </span>
                </div>

                {/* Max Kamar */}
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    placeholder="Max (4)"
                    value={filters.maxBedrooms > 0 ? filters.maxBedrooms : ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setFilters(prev => ({ ...prev, maxBedrooms: isNaN(val) ? 0 : val }));
                    }}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl pl-2.5 pr-7 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-sand-900 placeholder-sand-400 focus:outline-none focus:ring-2 focus:ring-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-sand-500 font-bold pointer-events-none">
                    Max
                  </span>
                </div>
              </div>
              <div className="text-[10px] text-sand-600 mt-1 font-bold">
                {filters.bedrooms > 0 && filters.maxBedrooms > 0
                  ? `${filters.bedrooms} s/d ${filters.maxBedrooms} Kamar`
                  : filters.bedrooms > 0
                    ? `Min. ${filters.bedrooms} Kamar`
                    : filters.maxBedrooms > 0
                      ? `Maks. ${filters.maxBedrooms} Kamar`
                      : 'Semua Kamar'}
              </div>
            </div>

            {/* 4. RENTANG BUDGET SEWA (RP MINIMAL - RP MAKSIMAL DENGAN TITIK OTOMATIS) */}
            <div>
              <label className="block text-xs sm:text-sm font-black text-sand-900 uppercase mb-1">
                <i className="fa-solid fa-tag text-brand-700 mr-1"></i> Rentang Budget / Malam
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {/* Min Rp */}
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-sand-400 font-bold pointer-events-none">
                    Min
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Rp 0"
                    value={filters.minPrice > 0 ? formatNumberWithDots(filters.minPrice) : ''}
                    onChange={(e) => {
                      const raw = getRawNumber(e.target.value);
                      setFilters(prev => ({ ...prev, minPrice: raw }));
                    }}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl pl-9 pr-2 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-sand-900 placeholder-sand-400 focus:outline-none focus:ring-2 focus:ring-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                {/* Max Rp */}
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-sand-400 font-bold pointer-events-none">
                    Max
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Maksimal"
                    value={filters.budget && filters.budget < 5000000 ? formatNumberWithDots(filters.budget) : ''}
                    onChange={(e) => {
                      const raw = getRawNumber(e.target.value);
                      setFilters(prev => ({ ...prev, budget: raw > 0 ? raw : 5000000 }));
                    }}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl pl-9 pr-2 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-sand-900 placeholder-sand-400 focus:outline-none focus:ring-2 focus:ring-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-sand-600 mt-1 font-bold">
                <span>{filters.minPrice > 0 ? `Min: ${formatRupiah(filters.minPrice)}` : 'Mulai Rp 0'}</span>
                <span>{filters.budget && filters.budget < 5000000 ? `Max: ${formatRupiah(filters.budget)}` : 'Semua Harga'}</span>
              </div>
            </div>
          </div>
        )}

        {/* BARIS FASILITAS: TAMPILKAN 6 UTAMA & BUTTON AKSI KANAN-KIRI TERPISAH (WARNA KUNING CERAH) */}
        <div className="pt-3 border-t border-sand-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-sand-900 uppercase tracking-wider">
                <i className="fa-solid fa-check-double text-emerald-600 mr-1"></i> 
                Fasilitas Favorit (Bisa Multi-Pilih):
              </span>
              {selectedFacilities.length > 0 && (
                <span className="text-xs bg-amber-400 text-brand-950 font-black px-2.5 py-0.5 rounded-full border border-amber-500 shadow-xs">
                  {selectedFacilities.length} dipilih
                </span>
              )}
            </div>
            {selectedFacilities.length > 0 && (
              <button 
                type="button"
                onClick={clearFacilities}
                className="text-xs text-terracotta-600 hover:text-terracotta-700 font-bold hover:underline"
              >
                Hapus Centang Fasilitas
              </button>
            )}
          </div>

          {/* FASILITAS FAVORIT + SEMUA YANG SEDANG TERPILIH (CHIPS AKTIF KUNING CERAH) */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {visibleFacilities.map(fac => {
              const isSelected = selectedFacilities.includes(fac.id);
              const count = getFacilityCount(fac.id);
              return (
                <button
                  key={fac.id}
                  type="button"
                  onClick={() => toggleFacility(fac.id)}
                  className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 border-2 ${
                    isSelected 
                      ? 'bg-amber-400 text-brand-950 border-amber-500 font-black shadow-sm scale-105' 
                      : 'bg-sand-50 text-sand-800 border-sand-200 hover:bg-sand-100'
                  }`}
                >
                  <i className={`fa-solid ${isSelected ? 'fa-square-check text-brand-950' : (fac.icon || 'fa-tag')} text-xs ${!isSelected ? 'text-emerald-700' : ''}`}></i>
                  <span>{fac.label}</span>
                  {count > 0 && (
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-brand-950/80' : 'text-sand-400'}`}>
                      ({count})
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* BARIS TERPISAH KHUSUS BUTTON AKSI: WA (KIRI) & SEMUA FILTER (KANAN) 
              Menyatu 50%-50% di HP sehingga jelas terlihat sebagai button interaktif */}
          <div className="pt-3 border-t border-sand-100 grid grid-cols-2 gap-2.5 sm:flex sm:justify-between sm:items-center">
            {/* KIRI: Kirim Hasil ke WA */}
            <button
              type="button"
              onClick={handleSendFilterToWA}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold py-2.5 px-3.5 rounded-2xl shadow-sm transition flex items-center justify-center gap-2 text-xs sm:text-sm border border-emerald-700"
              title="Kirim hasil filter ini ke WhatsApp CS"
            >
              <i className="fa-brands fa-whatsapp text-base text-white"></i>
              <span className="truncate">Kirim Hasil ke WA</span>
            </button>

            {/* KANAN: Buka Popup Semua Filter Berdasarkan Kategori */}
            <button
              type="button"
              onClick={() => {
                setSearchFacility('');
                setSelectedFacilityCategory('all');
                setModalOpen(true);
              }}
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 active:scale-95 text-brand-950 font-black py-2.5 px-3.5 rounded-2xl shadow-sm transition flex items-center justify-center gap-2 text-xs sm:text-sm border-2 border-amber-500"
              title="Buka popup semua filter fasilitas lengkap berdasarkan kategori"
            >
              <i className="fa-solid fa-sliders text-xs"></i>
              <span className="truncate">Semua Filter</span>
              <span className="bg-white text-brand-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                {modalLiveCount} Villa
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* MODAL POP-UP PILIH SEMUA FASILITAS LENGKAP               */}
      {/* ======================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-sand-200 max-h-[85vh] flex flex-col justify-between">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-sand-200">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-brand-900 text-amber-300 flex items-center justify-center text-xs shadow-xs">
                  <i className="fa-solid fa-list-check"></i>
                </span>
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-brand-900 leading-tight flex items-center gap-2">
                    <span>Pilih Fasilitas Unit</span>
                    <span className="text-xs bg-amber-400 text-brand-950 font-black px-2 py-0.5 rounded-full border border-amber-500 shadow-2xs">
                      {modalLiveCount} Villa Cocok
                    </span>
                  </h3>
                  <span className="text-[11px] text-sand-500">
                    Filter fasilitas berdasarkan kategori atau nama (angka menunjukkan unit tersedia)
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-sand-100 hover:bg-sand-200 text-sand-800 flex items-center justify-center transition"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            {/* Pencarian Fasilitas Cepat */}
            <div className="py-2.5">
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-400 text-xs"></i>
                <input
                  type="text"
                  placeholder="Ketik cari fasilitas (misal: AC, Dapur, Billiard)..."
                  value={searchFacility}
                  onChange={(e) => setSearchFacility(e.target.value)}
                  className="w-full bg-sand-50 border border-sand-200 rounded-xl pl-9 pr-8 py-2 text-xs font-semibold text-sand-900 focus:outline-none focus:ring-1 focus:ring-brand-700 placeholder-sand-400"
                />
                {searchFacility && (
                  <button
                    type="button"
                    onClick={() => setSearchFacility('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-400 hover:text-sand-700 text-xs"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>
            </div>

            {/* TAB VIEW SEMUA KATEGORI FASILITAS */}
            <div className="pb-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {FACILITY_CATEGORIES.map(cat => {
                const isActive = selectedFacilityCategory === cat.id;
                const countSelected = cat.id === 'all'
                  ? selectedFacilities.length
                  : selectedFacilities.filter(id => {
                      const f = POPULAR_FACILITIES.find(item => item.id === id);
                      return f && f.category === cat.id;
                    }).length;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedFacilityCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition flex items-center gap-1.5 border-2 shrink-0 ${
                      isActive
                        ? 'bg-amber-400 text-brand-950 border-amber-500 shadow-xs'
                        : 'bg-sand-50 hover:bg-sand-100 text-sand-800 border-sand-200'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {countSelected > 0 && (
                      <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-brand-950 text-amber-300' : 'bg-sand-200 text-sand-800'
                      }`}>
                        {countSelected}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* List Fasilitas (Scrollable Grid) */}
            <div className="flex-1 overflow-y-auto pr-1 py-1 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredAllFacilities.map(fac => {
                  const isSelected = selectedFacilities.includes(fac.id);
                  return (
                    <button
                      key={fac.id}
                      type="button"
                      onClick={() => toggleFacility(fac.id)}
                      className={`p-3 rounded-2xl text-xs font-bold text-left transition flex items-center justify-between border-2 ${
                        isSelected 
                          ? 'bg-amber-400 text-brand-950 border-amber-500 shadow-sm font-black' 
                          : 'bg-sand-50 text-sand-800 border-sand-200 hover:bg-sand-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <i className={`fa-solid ${fac.icon || 'fa-tag'} text-sm ${isSelected ? 'text-brand-950' : 'text-emerald-700'}`}></i>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="block leading-tight">{fac.label}</span>
                            <span className={`text-[10px] font-bold ${isSelected ? 'text-brand-950' : 'text-sand-500'}`}>
                              ({getFacilityCount(fac.id)} unit)
                            </span>
                          </div>
                          {fac.category && (
                            <span className={`text-[9px] uppercase tracking-wider block font-semibold ${isSelected ? 'text-brand-900' : 'text-sand-400'}`}>
                              {fac.category}
                            </span>
                          )}
                        </div>
                      </div>
                      <i className={`fa-solid ${isSelected ? 'fa-square-check text-brand-950' : 'fa-square text-sand-300'} text-base`}></i>
                    </button>
                  );
                })}
              </div>

              {filteredAllFacilities.length === 0 && (
                <div className="text-center py-8 text-sand-400 text-xs">
                  <i className="fa-solid fa-triangle-exclamation text-xl mb-1 block"></i>
                  Fasilitas "{searchFacility}" tidak ditemukan.
                </div>
              )}
            </div>

            {/* Footer Modal: Ringkasan & Tombol Terapkan */}
            <div className="pt-3 mt-3 border-t border-sand-200 flex items-center justify-between">
              <div className="text-xs">
                {selectedFacilities.length > 0 ? (
                  <span className="font-black text-brand-900">
                    <strong className="text-brand-950">{selectedFacilities.length}</strong> fasilitas dipilih
                  </span>
                ) : (
                  <span className="text-sand-500 font-semibold">Belum ada fasilitas</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const allIds = POPULAR_FACILITIES.map(f => f.id);
                    setFilters(prev => ({ ...prev, facilities: allIds }));
                  }}
                  className="text-xs text-brand-900 font-bold hover:underline px-1.5 py-1"
                >
                  Pilih Semua
                </button>
                <span className="text-sand-300">•</span>
                {selectedFacilities.length > 0 && (
                  <button
                    type="button"
                    onClick={clearFacilities}
                    className="text-xs text-terracotta-600 font-bold hover:underline px-1.5 py-1"
                  >
                    Reset
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-amber-400 hover:bg-amber-300 text-brand-950 font-black text-xs px-5 py-2.5 rounded-xl border border-amber-500 shadow-sm transition active:scale-95"
                >
                  Terapkan ({selectedFacilities.length} Fasilitas)
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
