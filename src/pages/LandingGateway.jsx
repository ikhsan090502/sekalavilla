import React, { useState } from 'react';
import { formatRupiah } from '../data/initialData';
import { POPULAR_FACILITIES } from '../components/SearchFilter';

export default function LandingGateway({ onComplete, onSkip, settings, initialFilters = {} }) {
  // Input State: Destinasi (Default: 'all' / Semua Lokasi, atau sesuai initialFilters)
  const [destination, setDestination] = useState(
    initialFilters.location && initialFilters.location !== 'all'
      ? (initialFilters.location.toLowerCase().includes('tawangmangu') ? 'tawangmangu' : 'yogyakarta')
      : 'all'
  );
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

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    onComplete({
      location: destination === 'tawangmangu' ? 'Tawangmangu' : destination === 'yogyakarta' ? 'Yogyakarta' : 'all',
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

  // Kirim Kriteria ke WhatsApp Admin
  const handleSendToWA = () => {
    const locText = destination === 'tawangmangu' ? 'Tawangmangu & Kemuning' : destination === 'yogyakarta' ? 'Yogyakarta & Sleman' : 'Semua Lokasi';
    const typeText = propertyType === 'villa' ? 'Villa' : propertyType === 'glamping' ? 'Glamping' : 'Semua Tipe';
    const capText = minCapacity || maxCapacity ? `${minCapacity || '1'} s/d ${maxCapacity || 'bebas'} orang` : 'Bebas';
    const bedText = minBedrooms || maxBedrooms ? `${minBedrooms || '1'} s/d ${maxBedrooms || 'bebas'} kamar` : 'Bebas';
    const budgetText = minPriceDisplay || maxPriceDisplay ? `Rp ${minPriceDisplay || '0'} - Rp ${maxPriceDisplay || '5.000.000'}` : 'Sesuai rekomendasi terbaik';
    const facText = selectedFacilities.length > 0 ? selectedFacilities.join(', ') : 'Standar / Bebas';

    const message = `Halo Admin Sekala Villa,%0A%0ASaya sedang mencari rekomendasi tempat menginap dengan kriteria:%0A- *Lokasi*: ${encodeURIComponent(locText)}%0A- *Tipe*: ${encodeURIComponent(typeText)}%0A- *Kapasitas*: ${encodeURIComponent(capText)}%0A- *Kamar Tidur*: ${encodeURIComponent(bedText)}%0A- *Budget Sewa*: ${encodeURIComponent(budgetText)}%0A- *Fasilitas yang diinginkan*: ${encodeURIComponent(facText)}%0A%0AMohon info unit yang tersedia sesuai kriteria di atas ya kak. Terima kasih!`;

    window.open(`https://wa.me/${waPhone}?text=${message}`, '_blank');
  };

  // Lokasi untuk popup modal search daerah dengan kata kunci lengkap
  const LOCATIONS_LIST = [
    { id: 'all', name: 'Semua Lokasi', desc: 'Tampilkan semua unit di Tawangmangu & Yogyakarta', icon: '🗺️', keywords: 'semua all tawangmangu yogyakarta jogja' },
    { id: 'tawangmangu', name: 'Tawangmangu & Kemuning', desc: 'Lereng Gunung Lawu, Kebun Teh, Grojogan Sewu, Dingin & Asri', icon: '🏔️', keywords: 'tawangmangu kemuning lawu grojogan karanganyar ngargoyoso' },
    { id: 'yogyakarta', name: 'Yogyakarta & Sleman', desc: 'Kaliurang Merapi View, Prambanan & Dekat Pusat Kota Jogja', icon: '🏛️', keywords: 'yogyakarta jogja kaliurang sleman merapi prambanan bantul kota' },
  ];

  const filteredLocations = LOCATIONS_LIST.filter(l => 
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

        {/* CARD CONTAINER PUTIH ELEGAN (WARNA PERSIS HALAMAN UTAMA) */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border border-sand-200 space-y-5 sm:space-y-6">
          
          {/* STEP 1: PILIH LOKASI (3 TOMBOL: SEMUA / PILIH DAERAH, TAWANGMANGU, JOGJA) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-sand-800 block">
                <i className="fa-solid fa-location-dot text-brand-700 mr-1.5"></i> 1. Pilih Lokasi
              </label>
              {destination !== 'all' ? (
                <button
                  type="button"
                  onClick={() => setDestination('all')}
                  className="text-[11px] text-terracotta-600 hover:text-terracotta-700 font-bold flex items-center gap-1 transition"
                  title="Kembalikan pilihan ke Semua Lokasi"
                >
                  <i className="fa-solid fa-rotate-left text-[10px]"></i> Tampilkan Semua
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSearchLocationQuery('');
                    setShowLocationModal(true);
                  }}
                  className="text-[11px] text-terracotta-600 hover:text-terracotta-700 font-bold flex items-center gap-1 transition"
                >
                  <i className="fa-solid fa-magnifying-glass text-[10px]"></i> Cari Daerah Wisata
                </button>
              )}
            </div>

            {/* 3 Tombol Sejajar: 
                - Tombol 1: 'Semua Lokasi' (aktif saat default 'all'), 
                  ketika Tawangmangu/Jogja ditekan, tombol ini BERUBAH menjadi 'Pilih Daerah' 
                  yang bisa langsung diklik untuk popup modal tanpa layar meloncat/bergerak.
                - Tombol 2: Tawangmangu
                - Tombol 3: Yogyakarta (Jogja)
            */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
              
              {/* TOMBOL 1: SEMUA LOKASI (JIKA ALL) ATAU BERUBAH MENJADI 'PILIH DAERAH' (JIKA TAWANGMANGU/JOGJA AKTIF) */}
              {destination === 'all' ? (
                <button
                  type="button"
                  onClick={() => setDestination('all')}
                  className="p-3 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between bg-brand-900 text-amber-300 border-brand-900 shadow-md font-bold scale-[1.01]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🗺️</span>
                    <div>
                      <strong className="text-xs sm:text-sm block leading-tight">Semua Lokasi</strong>
                      <span className="text-[10px] block text-amber-200">
                        Tawangmangu & Jogja
                      </span>
                    </div>
                  </div>
                  <i className="fa-solid fa-circle-check text-sm text-amber-300"></i>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSearchLocationQuery('');
                    setShowLocationModal(true);
                  }}
                  className="p-3 rounded-2xl border-2 border-dashed border-amber-500 bg-amber-50 hover:bg-amber-100 text-brand-900 text-left transition-all duration-200 flex items-center justify-between shadow-xs hover:scale-[1.01] active:scale-95 group"
                  title="Klik untuk memilih atau mencari daerah wisata spesifik"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-amber-400 text-brand-900 flex items-center justify-center text-sm font-bold shadow-2xs group-hover:scale-105 transition-transform">
                      <i className="fa-solid fa-magnifying-glass text-xs"></i>
                    </span>
                    <div>
                      <strong className="text-xs sm:text-sm block leading-tight text-brand-900 font-extrabold flex items-center gap-1">
                        <span>Pilih Daerah</span>
                        <i className="fa-solid fa-arrow-up-right-from-square text-[9px] text-amber-600"></i>
                      </strong>
                      <span className="text-[10px] block text-amber-800 font-medium">
                        Cari Daerah Wisata
                      </span>
                    </div>
                  </div>
                  <i className="fa-solid fa-chevron-right text-xs text-amber-600 group-hover:translate-x-0.5 transition-transform"></i>
                </button>
              )}

              {/* TOMBOL 2: TAWANGMANGU */}
              <button
                type="button"
                onClick={() => setDestination('tawangmangu')}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between ${
                  destination === 'tawangmangu'
                    ? 'bg-brand-900 text-amber-300 border-brand-900 shadow-md font-bold scale-[1.01]'
                    : 'bg-sand-50 hover:bg-sand-100 text-sand-900 border-sand-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🏔️</span>
                  <div>
                    <strong className="text-xs sm:text-sm block leading-tight">Tawangmangu</strong>
                    <span className={`text-[10px] block ${destination === 'tawangmangu' ? 'text-amber-200' : 'text-sand-500'}`}>
                      Dingin Lawu
                    </span>
                  </div>
                </div>
                <i className={`fa-solid fa-circle-check text-sm ${destination === 'tawangmangu' ? 'text-amber-300' : 'text-transparent'}`}></i>
              </button>

              {/* TOMBOL 3: YOGYAKARTA (JOGJA) */}
              <button
                type="button"
                onClick={() => setDestination('yogyakarta')}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between ${
                  destination === 'yogyakarta'
                    ? 'bg-brand-900 text-amber-300 border-brand-900 shadow-md font-bold scale-[1.01]'
                    : 'bg-sand-50 hover:bg-sand-100 text-sand-900 border-sand-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🏛️</span>
                  <div>
                    <strong className="text-xs sm:text-sm block leading-tight">Yogyakarta</strong>
                    <span className={`text-[10px] block ${destination === 'yogyakarta' ? 'text-amber-200' : 'text-sand-500'}`}>
                      Kaliurang & Kota
                    </span>
                  </div>
                </div>
                <i className={`fa-solid fa-circle-check text-sm ${destination === 'yogyakarta' ? 'text-amber-300' : 'text-transparent'}`}></i>
              </button>

            </div>
          </div>

          {/* STEP 2: TIPE AKOMODASI (VILLA / GLAMPING) */}
          <div className="space-y-2">
            <label className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-sand-800 block">
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
                    className={`p-2.5 sm:p-3 rounded-2xl border text-center transition flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 ${
                      active
                        ? 'bg-brand-900 text-amber-300 border-brand-900 font-bold shadow-sm'
                        : 'bg-sand-50 hover:bg-sand-100 text-sand-800 border-sand-200 text-xs'
                    }`}
                  >
                    <i className={`fa-solid ${t.icon} text-sm ${active ? 'text-amber-300' : 'text-brand-700'}`}></i>
                    <span className="text-xs font-bold">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: INPUT RANGE KAPASITAS ORANG & RANGE JUMLAH KAMAR */}
          <div className="space-y-2">
            <label className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-sand-800 block">
              <i className="fa-solid fa-users text-brand-700 mr-1.5"></i> 3. Kapasitas Tamu & Jumlah Kamar (Range)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Range Berapa Orang */}
              <div>
                <label className="text-[10px] sm:text-[11px] text-sand-600 font-bold block mb-1">
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
                      className="w-full bg-sand-50 border border-sand-200 rounded-xl pl-3 pr-8 py-2.5 text-xs sm:text-sm text-sand-900 font-bold placeholder-sand-400 focus:outline-none focus:ring-1 focus:ring-brand-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-sand-400 font-semibold pointer-events-none">
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
                      className="w-full bg-sand-50 border border-sand-200 rounded-xl pl-3 pr-8 py-2.5 text-xs sm:text-sm text-sand-900 font-bold placeholder-sand-400 focus:outline-none focus:ring-1 focus:ring-brand-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-sand-400 font-semibold pointer-events-none">
                      Org
                    </span>
                  </div>
                </div>
              </div>

              {/* Range Kamar Tidur */}
              <div>
                <label className="text-[10px] sm:text-[11px] text-sand-600 font-bold block mb-1">
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
                      className="w-full bg-sand-50 border border-sand-200 rounded-xl pl-3 pr-8 py-2.5 text-xs sm:text-sm text-sand-900 font-bold placeholder-sand-400 focus:outline-none focus:ring-1 focus:ring-brand-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-sand-400 font-semibold pointer-events-none">
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
                      className="w-full bg-sand-50 border border-sand-200 rounded-xl pl-3 pr-8 py-2.5 text-xs sm:text-sm text-sand-900 font-bold placeholder-sand-400 focus:outline-none focus:ring-1 focus:ring-brand-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-sand-400 font-semibold pointer-events-none">
                      Kmr
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4: RANGE BUDGET HARGA SEWA */}
          <div className="space-y-2">
            <label className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-sand-800 block">
              <i className="fa-solid fa-tag text-brand-700 mr-1.5"></i> 4. Budget Sewa / Malam (Opsional)
            </label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-sand-400 font-bold">
                  Rp
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Min (500.000)"
                  value={minPriceDisplay}
                  onChange={handleMinPriceChange}
                  className="w-full bg-sand-50 border border-sand-200 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-sand-900 font-bold placeholder-sand-400 focus:outline-none focus:ring-1 focus:ring-brand-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-sand-400 font-bold">
                  Rp
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Max (2.500.000)"
                  value={maxPriceDisplay}
                  onChange={handleMaxPriceChange}
                  className="w-full bg-sand-50 border border-sand-200 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-sand-900 font-bold placeholder-sand-400 focus:outline-none focus:ring-1 focus:ring-brand-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
          </div>

          {/* STEP 5: PILIHAN FASILITAS DI LANDING PAGE */}
          <div className="space-y-2 pt-2 border-t border-sand-100">
            <div className="flex items-center justify-between">
              <label className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-sand-800 block">
                <i className="fa-solid fa-check-double text-emerald-600 mr-1.5"></i> 5. Fasilitas yang Diinginkan
              </label>
              {selectedFacilities.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedFacilities([])}
                  className="text-[10px] text-terracotta-600 font-bold hover:underline"
                >
                  Hapus Centang ({selectedFacilities.length})
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {POPULAR_FACILITIES.slice(0, 8).map(fac => {
                const isSelected = selectedFacilities.includes(fac.id);
                return (
                  <button
                    key={fac.id}
                    type="button"
                    onClick={() => toggleFacility(fac.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                      isSelected 
                        ? 'bg-brand-900 text-amber-300 border-brand-900 shadow-sm' 
                        : 'bg-sand-50 text-sand-800 border-sand-200 hover:bg-sand-100'
                    }`}
                  >
                    <i className={`fa-solid ${isSelected ? 'fa-square-check text-amber-300' : (fac.icon || 'fa-tag')} text-xs ${!isSelected ? 'text-emerald-700' : ''}`}></i>
                    <span>{fac.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TOMBOL AKSI: CARI & TERUSKAN KE WA */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-sand-200">
            {/* Tombol Teruskan ke WhatsApp */}
            <button
              type="button"
              onClick={handleSendToWA}
              className="w-full sm:w-auto text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 order-2 sm:order-1"
              title="Kirim kriteria filter langsung ke WhatsApp CS Sekala Villa"
            >
              <i className="fa-brands fa-whatsapp text-sm text-emerald-600"></i>
              <span>Teruskan Kriteria ke WA</span>
            </button>

            {/* Tombol Cari & Buka Katalog */}
            <button
              type="submit"
              className="w-full sm:w-auto bg-brand-900 hover:bg-brand-800 active:scale-[0.98] text-amber-300 font-bold text-xs sm:text-sm px-7 py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 order-1 sm:order-2"
            >
              <i className="fa-solid fa-magnifying-glass text-amber-300"></i>
              <span>Cari & Buka Katalog</span>
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </div>

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

      {/* POPUP MODAL PILIH DAERAH (SEARCH DAERAH) */}
      {showLocationModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowLocationModal(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-sand-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-sand-200">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-brand-900 text-amber-300 flex items-center justify-center text-xs shadow-xs">
                  <i className="fa-solid fa-map-location-dot"></i>
                </span>
                <div>
                  <h3 className="font-serif font-bold text-base text-brand-900 leading-tight">
                    Pilih Daerah Wisata
                  </h3>
                  <span className="text-[11px] text-sand-500">Pilih atau cari destinasi liburan Anda</span>
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

            {/* Input Search Daerah (Tanpa autoFocus agar layar mobile tidak meloncat) */}
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-400 text-xs"></i>
              <input
                type="text"
                placeholder="Ketik nama daerah (misal: Lawu, Kaliurang, Jogja)..."
                value={searchLocationQuery}
                onChange={(e) => setSearchLocationQuery(e.target.value)}
                className="w-full bg-sand-50 border border-sand-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold text-sand-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
              />
            </div>

            {/* Daftar Pilihan Daerah */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {filteredLocations.map(loc => {
                const isSelected = destination === loc.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => {
                      setDestination(loc.id);
                      setShowLocationModal(false);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                      isSelected 
                        ? 'bg-brand-900 text-amber-300 border-brand-900 shadow-sm' 
                        : 'bg-sand-50 hover:bg-sand-100 text-sand-900 border-sand-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">
                        {loc.icon || (loc.id === 'tawangmangu' ? '🏔️' : loc.id === 'yogyakarta' ? '🏛️' : '🗺️')}
                      </span>
                      <div>
                        <strong className="text-xs sm:text-sm block leading-tight">{loc.name}</strong>
                        <span className={`text-[10px] block ${isSelected ? 'text-amber-200' : 'text-sand-500'}`}>{loc.desc}</span>
                      </div>
                    </div>
                    <i className={`fa-solid ${isSelected ? 'fa-circle-check text-amber-300' : 'fa-circle text-sand-300'} text-base`}></i>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}