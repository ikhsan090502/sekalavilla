import React, { useState, useMemo } from 'react';
import { formatRupiah, PROPERTY_TYPES } from '../data/initialData';

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

export default function SearchFilter({ 
  filters, 
  setFilters, 
  onReset,
  onOpenGateway
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchFacility, setSearchFacility] = useState('');

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

  // Filter fasilitas di dalam Pop-up modal berdasarkan input cari
  const filteredAllFacilities = useMemo(() => {
    if (!searchFacility.trim()) return POPULAR_FACILITIES;
    const q = searchFacility.toLowerCase().trim();
    return POPULAR_FACILITIES.filter(f => 
      f.label.toLowerCase().includes(q) || 
      (f.category && f.category.toLowerCase().includes(q))
    );
  }, [searchFacility]);

  // Hitung fasilitas yang dipilih tapi berada di luar 6 teratas
  const extraSelectedCount = useMemo(() => {
    const topIds = TOP_FACILITIES.map(f => f.id);
    return selectedFacilities.filter(id => !topIds.includes(id)).length;
  }, [selectedFacilities, TOP_FACILITIES]);

  // Hitung berapa kriteria aktif dari landing matcher
  const hasCustomMatcher = (filters.location && filters.location !== 'all') || 
                           (filters.capacity && filters.capacity > 0) || 
                           (filters.maxCapacity && filters.maxCapacity > 0) || 
                           (filters.bedrooms && filters.bedrooms > 0) || 
                           (filters.minPrice && filters.minPrice > 0) || 
                           (filters.budget && filters.budget < 5000000) ||
                           (filters.propertyType && filters.propertyType !== 'all');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-3 sm:-mt-6 relative z-20">
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-sand-200 space-y-4 sm:space-y-5">
        
        {/* BANNER NOTIFIKASI FILTER DARI TRIP MATCHER */}
        {hasCustomMatcher && (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-brand-900 text-amber-300 flex items-center justify-center text-xs shrink-0 shadow-xs">
                <i className="fa-solid fa-sliders"></i>
              </span>
              <div>
                <span className="text-xs font-bold text-brand-900 block">
                  Filter Sesuai Pencarian Anda Aktif
                </span>
                <div className="flex flex-wrap gap-1.5 mt-0.5">
                  {filters.location !== 'all' && (
                    <span className="bg-white text-sand-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-200">
                      📍 {filters.location}
                    </span>
                  )}
                  {filters.propertyType !== 'all' && (
                    <span className="bg-white text-sand-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-200 capitalize">
                      🏡 {filters.propertyType}
                    </span>
                  )}
                  {(filters.capacity > 0 || filters.maxCapacity > 0) && (
                    <span className="bg-white text-sand-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-200">
                      👥 {filters.capacity > 0 && filters.maxCapacity > 0 
                          ? `${filters.capacity} - ${filters.maxCapacity} Orang`
                          : filters.capacity > 0 
                            ? `Min. ${filters.capacity} Orang`
                            : `Maks. ${filters.maxCapacity} Orang`}
                    </span>
                  )}
                  {filters.bedrooms > 0 && (
                    <span className="bg-white text-sand-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-200">
                      🛏️ Min. {filters.bedrooms} Kamar
                    </span>
                  )}
                  {(filters.minPrice > 0 || filters.budget < 5000000) && (
                    <span className="bg-white text-sand-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-200">
                      💰 {filters.minPrice > 0 ? formatRupiah(filters.minPrice) : 'Rp 0'} - {formatRupiah(filters.budget)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              {onOpenGateway && (
                <button
                  onClick={onOpenGateway}
                  className="text-xs font-bold text-brand-900 hover:text-terracotta-600 bg-white hover:bg-sand-100 px-3 py-1.5 rounded-xl border border-sand-300 transition flex items-center gap-1 shadow-xs"
                >
                  <i className="fa-solid fa-arrow-rotate-left text-[10px]"></i> Ubah Kriteria
                </button>
              )}
              <button
                onClick={onReset}
                className="text-xs font-bold text-terracotta-600 hover:underline px-2 py-1"
              >
                Reset Filter
              </button>
            </div>
          </div>
        )}

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
            {/* Tampilkan tombol reset utama di sini hanya jika banner kriteria atas tidak sedang aktif */}
            {!hasCustomMatcher && (
              <button 
                onClick={onReset}
                className="text-xs text-terracotta-600 font-bold hover:underline flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-terracotta-50 transition"
              >
                <i className="fa-solid fa-rotate-left text-[11px]"></i> Reset Filter
              </button>
            )}
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

        {/* BARIS FILTER UTAMA: LOKASI, KAPASITAS ORANG (KETIK), KAMAR (KETIK), RENTANG BUDGET (RP MIN - RP MAX) */}
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

          {/* 2. KAPASITAS TAMU (RANGE MIN - MAX ORANG) */}
          <div>
            <label className="block text-[10px] font-extrabold text-sand-800 uppercase mb-1">
              <i className="fa-solid fa-user-group text-brand-700 mr-1"></i> Kapasitas Orang (Min - Max)
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {/* Min Orang */}
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  placeholder="Min (Misal: 4)"
                  value={filters.capacity > 0 ? filters.capacity : ''}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setFilters(prev => ({ ...prev, capacity: isNaN(val) ? 0 : val }));
                  }}
                  className="w-full bg-sand-50 border border-sand-200 rounded-xl pl-2.5 pr-7 py-2 text-xs font-bold text-sand-900 placeholder-sand-400 focus:outline-none focus:ring-1 focus:ring-brand-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-sand-400 font-semibold pointer-events-none">
                  Min
                </span>
              </div>

              {/* Max Orang */}
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  placeholder="Max (Misal: 10)"
                  value={filters.maxCapacity > 0 ? filters.maxCapacity : ''}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setFilters(prev => ({ ...prev, maxCapacity: isNaN(val) ? 0 : val }));
                  }}
                  className="w-full bg-sand-50 border border-sand-200 rounded-xl pl-2.5 pr-7 py-2 text-xs font-bold text-sand-900 placeholder-sand-400 focus:outline-none focus:ring-1 focus:ring-brand-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-sand-400 font-semibold pointer-events-none">
                  Max
                </span>
              </div>
            </div>
            <div className="text-[9px] text-sand-400 mt-1 font-semibold">
              {filters.capacity > 0 && filters.maxCapacity > 0
                ? `${filters.capacity} s/d ${filters.maxCapacity} Orang`
                : filters.capacity > 0
                  ? `Min. ${filters.capacity} Orang`
                  : filters.maxCapacity > 0
                    ? `Maks. ${filters.maxCapacity} Orang`
                    : 'Semua Kapasitas'}
            </div>
          </div>

          {/* 3. JUMLAH KAMAR TIDUR (KETIK BEBAS) */}
          <div>
            <label className="block text-[10px] font-extrabold text-sand-800 uppercase mb-1">
              <i className="fa-solid fa-bed text-brand-700 mr-1"></i> Kamar Tidur (Ketik)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                placeholder="Semua (Misal: 3)"
                value={filters.bedrooms > 0 ? filters.bedrooms : ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setFilters(prev => ({ ...prev, bedrooms: isNaN(val) ? 0 : val }));
                }}
                className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs font-bold text-sand-900 placeholder-sand-400 focus:outline-none focus:ring-1 focus:ring-brand-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-sand-400 font-semibold pointer-events-none">
                Kamar
              </span>
            </div>
          </div>

          {/* 4. RENTANG BUDGET SEWA (RP MINIMAL - RP MAKSIMAL DENGAN TITIK OTOMATIS) */}
          <div>
            <label className="block text-[10px] font-extrabold text-sand-800 uppercase mb-1">
              <i className="fa-solid fa-tag text-brand-700 mr-1"></i> Rentang Budget / Malam
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {/* Min Rp */}
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-sand-400 font-bold pointer-events-none">
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
                  className="w-full bg-sand-50 border border-sand-200 rounded-xl pl-9 pr-2 py-2 text-xs font-bold text-sand-900 placeholder-sand-400 focus:outline-none focus:ring-1 focus:ring-brand-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              {/* Max Rp */}
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-sand-400 font-bold pointer-events-none">
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
                  className="w-full bg-sand-50 border border-sand-200 rounded-xl pl-9 pr-2 py-2 text-xs font-bold text-sand-900 placeholder-sand-400 focus:outline-none focus:ring-1 focus:ring-brand-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
            <div className="flex justify-between text-[9px] text-sand-400 mt-1 font-semibold">
              <span>{filters.minPrice > 0 ? `Min: ${formatRupiah(filters.minPrice)}` : 'Mulai Rp 0'}</span>
              <span>{filters.budget && filters.budget < 5000000 ? `Max: ${formatRupiah(filters.budget)}` : 'Semua Harga'}</span>
            </div>
          </div>
        </div>

        {/* BARIS FASILITAS: TAMPILKAN 6 UTAMA + TOMBOL MODAL SEMUA FASILITAS */}
        <div className="pt-3 border-t border-sand-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-sand-800 uppercase tracking-wider">
                <i className="fa-solid fa-check-double text-emerald-600 mr-1"></i> 
                Fasilitas Favorit (Bisa Multi-Pilih):
              </span>
              {selectedFacilities.length > 0 && (
                <span className="text-[10px] bg-brand-900 text-amber-300 font-extrabold px-2 py-0.5 rounded-full shadow-xs">
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

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* 6 FASILITAS UTAMA DI TAMPILAN DEPAN */}
            {TOP_FACILITIES.map(fac => {
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

            {/* TOMBOL LIHAT SEMUA FASILITAS (+MODAL POPUP) */}
            <button
              type="button"
              onClick={() => {
                setSearchFacility('');
                setModalOpen(true);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                extraSelectedCount > 0
                  ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm'
                  : 'bg-sand-200/80 hover:bg-sand-300 text-sand-900 border-sand-300'
              }`}
              title="Buka daftar semua fasilitas lengkap"
            >
              <i className="fa-solid fa-sliders text-xs"></i>
              <span>Semua Fasilitas</span>
              {extraSelectedCount > 0 ? (
                <span className="bg-brand-900 text-amber-300 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  +{extraSelectedCount}
                </span>
              ) : (
                <span className="text-[10px] text-sand-500 font-extrabold">
                  ({POPULAR_FACILITIES.length})
                </span>
              )}
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
                  <h3 className="font-serif font-bold text-base sm:text-lg text-brand-900 leading-tight">
                    Pilih Fasilitas Unit
                  </h3>
                  <span className="text-[11px] text-sand-500">
                    Centang fasilitas yang wajib ada di villa / glamping pilihan Anda
                  </span>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-sand-100 hover:bg-sand-200 text-sand-800 flex items-center justify-center transition"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            {/* Pencarian Fasilitas Cepat */}
            <div className="py-3">
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
                    onClick={() => setSearchFacility('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-400 hover:text-sand-700 text-xs"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>
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
                      className={`p-3 rounded-2xl text-xs font-bold text-left transition flex items-center justify-between border ${
                        isSelected 
                          ? 'bg-brand-900 text-amber-300 border-brand-900 shadow-sm' 
                          : 'bg-sand-50 text-sand-800 border-sand-200 hover:bg-sand-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <i className={`fa-solid ${fac.icon || 'fa-tag'} text-sm ${isSelected ? 'text-amber-300' : 'text-emerald-700'}`}></i>
                        <div>
                          <span className="block leading-tight">{fac.label}</span>
                          {fac.category && (
                            <span className={`text-[9px] uppercase tracking-wider block font-medium ${isSelected ? 'text-sand-300' : 'text-sand-400'}`}>
                              {fac.category}
                            </span>
                          )}
                        </div>
                      </div>
                      <i className={`fa-solid ${isSelected ? 'fa-circle-check text-amber-300' : 'fa-circle text-sand-300'} text-base`}></i>
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
                  <span className="font-bold text-brand-900">
                    <strong className="text-terracotta-600">{selectedFacilities.length}</strong> fasilitas dipilih
                  </span>
                ) : (
                  <span className="text-sand-500">Belum ada fasilitas dipilih</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedFacilities.length > 0 && (
                  <button
                    type="button"
                    onClick={clearFacilities}
                    className="text-xs text-terracotta-600 font-bold hover:underline px-2 py-1"
                  >
                    Reset
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-brand-900 hover:bg-brand-800 text-amber-300 font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
                >
                  Terapkan Filter
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
