import React, { useState } from 'react';
import { formatRupiah } from '../data/initialData';

export default function LandingGateway({ onComplete, onSkip, settings }) {
  // Input State
  const [destination, setDestination] = useState('tawangmangu'); // 'tawangmangu' | 'yogyakarta'
  const [propertyType, setPropertyType] = useState('all'); // 'all' | 'villa' | 'glamping'
  
  // Custom Typed Inputs
  const [capacity, setCapacity] = useState(''); // Berapa orang (bebas ketik)
  const [bedrooms, setBedrooms] = useState(''); // Berapa kamar yang diinginkan (bebas ketik)
  const [minPriceDisplay, setMinPriceDisplay] = useState(''); // Teks format titik Rp
  const [maxPriceDisplay, setMaxPriceDisplay] = useState(''); // Teks format titik Rp

  // Helper memformat angka dengan pemisah ribuan titik (contoh: 1500000 -> 1.500.000)
  const formatNumberWithDots = (val) => {
    if (!val) return '';
    const cleanDigits = val.toString().replace(/\D/g, '');
    if (!cleanDigits) return '';
    return new Intl.NumberFormat('id-ID').format(parseInt(cleanDigits, 10));
  };

  const getRawNumber = (str) => {
    if (!str) return 0;
    const cleanDigits = str.toString().replace(/\D/g, '');
    return parseInt(cleanDigits, 10) || 0;
  };

  const handleMinPriceChange = (e) => {
    const formatted = formatNumberWithDots(e.target.value);
    setMinPriceDisplay(formatted);
  };

  const handleMaxPriceChange = (e) => {
    const formatted = formatNumberWithDots(e.target.value);
    setMaxPriceDisplay(formatted);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete({
      location: destination === 'tawangmangu' ? 'Tawangmangu' : 'Yogyakarta',
      propertyType: propertyType,
      capacity: parseInt(capacity) || 0,
      bedrooms: parseInt(bedrooms) || 0,
      minPrice: getRawNumber(minPriceDisplay),
      maxPrice: getRawNumber(maxPriceDisplay)
    });
  };

  const waPhone = settings?.whatsappPhone || '6281381669735';

  return (
    <div className="min-h-screen bg-sand-900 text-white flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Background Ambience & Gradient Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-25 scale-105"
          style={{
            backgroundImage: destination === 'tawangmangu' 
              ? `url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80')`
              : `url('https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1600&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/90 via-sand-950/85 to-sand-950"></div>
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* TOP BAR: LOGO & FAST ACTION */}
      <header className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-brand-900 flex items-center justify-center text-xl font-serif font-black shadow-lg">
            S
          </div>
          <div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-amber-50 leading-none block">
              SEKALA
            </span>
            <span className="text-[9px] uppercase tracking-widest text-amber-300 font-extrabold">
              Villa & Stays
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSkip}
            className="text-xs text-sand-300 hover:text-amber-300 font-bold transition flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-white/5"
          >
            <span>Lewati & Lihat Semua Unit</span>
            <i className="fa-solid fa-arrow-right text-[10px]"></i>
          </button>
        </div>
      </header>

      {/* MAIN INTERACTIVE MATCHER FORM */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-2">
          <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] sm:text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
            <i className="fa-solid fa-sliders text-amber-400"></i> Smart Trip Matcher
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-amber-50 leading-tight">
            Cari Tempat Menginap Sesuai Kebutuhan Anda
          </h1>
          <p className="text-xs sm:text-sm text-sand-300 leading-relaxed max-w-lg mx-auto">
            Ketik kriteria kapasitas, jumlah kamar, dan batas harga Anda. Sistem akan langsung mencocokkan unit di katalog utama.
          </p>
        </div>

        {/* FORM CONTAINER DENGAN INPUT BEBAS KETIK */}
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6">
          
          {/* STEP 1: PILIH DESTINASI */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-amber-200 block">
              1. Pilih Wilayah Destinasi
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDestination('tawangmangu')}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between ${
                  destination === 'tawangmangu'
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🏔️</span>
                  <div>
                    <strong className="text-xs sm:text-sm block">Tawangmangu & Kemuning</strong>
                    <span className={`text-[10px] block ${destination === 'tawangmangu' ? 'text-slate-800' : 'text-sand-400'}`}>
                      Dingin Pegunungan & Kebun Teh Lawu
                    </span>
                  </div>
                </div>
                <i className={`fa-solid fa-circle-check text-base ${destination === 'tawangmangu' ? 'text-slate-950' : 'text-transparent'}`}></i>
              </button>

              <button
                type="button"
                onClick={() => setDestination('yogyakarta')}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between ${
                  destination === 'yogyakarta'
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🏛️</span>
                  <div>
                    <strong className="text-xs sm:text-sm block">Yogyakarta & Sleman</strong>
                    <span className={`text-[10px] block ${destination === 'yogyakarta' ? 'text-slate-800' : 'text-sand-400'}`}>
                      Syahdu Kaliurang Merapi & Dekat Kota
                    </span>
                  </div>
                </div>
                <i className={`fa-solid fa-circle-check text-base ${destination === 'yogyakarta' ? 'text-slate-950' : 'text-transparent'}`}></i>
              </button>
            </div>
          </div>

          {/* STEP 2: TIPE AKOMODASI (VILLA / GLAMPING) */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-amber-200 block">
              2. Konsep Akomodasi
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
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                      active
                        ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow'
                        : 'bg-white/5 hover:bg-white/10 text-white border-white/10 text-xs'
                    }`}
                  >
                    <i className={`fa-solid ${t.icon} text-sm ${active ? 'text-slate-950' : 'text-amber-400'}`}></i>
                    <span className="text-xs">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: INPUT KAPASITAS ORANG & JUMLAH KAMAR (DIKETIK SENDIRI) */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-amber-200 block">
              3. Kapasitas Tamu & Jumlah Kamar (Ketik Sesuai Kebutuhan)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Input Berapa Orang */}
              <div>
                <label className="text-[11px] text-sand-300 font-semibold block mb-1">
                  <i className="fa-solid fa-users text-amber-400 mr-1.5"></i> Kapasitas Berapa Orang?
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    placeholder="Contoh: 8"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full bg-slate-900/80 border border-white/20 rounded-2xl px-4 py-3 text-sm text-amber-300 font-bold placeholder-sand-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-sand-400 font-semibold">
                    Orang
                  </span>
                </div>
              </div>

              {/* Input Berapa Kamar Tidur */}
              <div>
                <label className="text-[11px] text-sand-300 font-semibold block mb-1">
                  <i className="fa-solid fa-bed text-amber-400 mr-1.5"></i> Kamar yang Diinginkan?
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    placeholder="Contoh: 3 (Opsional)"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full bg-slate-900/80 border border-white/20 rounded-2xl px-4 py-3 text-sm text-amber-300 font-bold placeholder-sand-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-sand-400 font-semibold">
                    Kamar
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4: RANGE HARGA SEWA (RP MINIMAL & RP MAKSIMAL DIKETIK SENDIRI DENGAN TITIK OTOMATIS) */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-amber-200 block">
              4. Budget Harga Sewa / Malam (Ketik Range Budget)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Minimal Rp */}
              <div>
                <label className="text-[11px] text-sand-300 font-semibold block mb-1">
                  Budget Minimal (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-sand-400 font-bold">
                    Rp
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="500.000 (Opsional)"
                    value={minPriceDisplay}
                    onChange={handleMinPriceChange}
                    className="w-full bg-slate-900/80 border border-white/20 rounded-2xl pl-11 pr-4 py-3 text-sm text-white font-bold placeholder-sand-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              {/* Maksimal Rp */}
              <div>
                <label className="text-[11px] text-sand-300 font-semibold block mb-1">
                  Budget Maksimal (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-sand-400 font-bold">
                    Rp
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="2.500.000"
                    value={maxPriceDisplay}
                    onChange={handleMaxPriceChange}
                    className="w-full bg-slate-900/80 border border-white/20 rounded-2xl pl-11 pr-4 py-3 text-sm text-white font-bold placeholder-sand-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>
            {maxPriceDisplay && getRawNumber(maxPriceDisplay) > 0 && (
              <span className="text-[11px] text-amber-300 font-semibold block pt-0.5">
                Batas maksimal budget: <strong>Rp {maxPriceDisplay} / malam</strong>
              </span>
            )}
          </div>

          {/* TOMBOL AKSI UTAMA MENUJU HALAMAN UTAMA */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onSkip}
              className="text-xs text-sand-400 hover:text-white transition font-medium order-2 sm:order-1 py-2"
            >
              Atau langsung buka semua katalog unit →
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-slate-950 font-black text-xs sm:text-sm px-8 py-4 rounded-2xl shadow-xl hover:shadow-amber-400/20 transition-all flex items-center justify-center gap-2 order-1 sm:order-2"
            >
              <i className="fa-solid fa-magnifying-glass text-slate-950"></i>
              <span>CARI & BUKA KATALOG UTAMA</span>
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </div>

        </form>

        {/* 3 VALUE UNGGULAN SEKALA VILLA (TRUST BADGES) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-location-crosshairs text-sm"></i>
            </span>
            <div>
              <strong className="text-xs text-white block">Free Antar Survey Villa</strong>
              <span className="text-[10px] text-sand-400">Bisa cek 1-5 villa langsung ke lokasi bersama tim Sekala</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-fire-burner text-sm"></i>
            </span>
            <div>
              <strong className="text-xs text-white block">Bonus Alat BBQ Portable</strong>
              <span className="text-[10px] text-sand-400">Peminjaman alat panggangan siap pakai selama menginap</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-shield-check text-sm"></i>
            </span>
            <div>
              <strong className="text-xs text-white block">100% Host Terverifikasi</strong>
              <span className="text-[10px] text-sand-400">Harga langsung tanpa mark-up liar & jaminan kebersihan</span>
            </div>
          </div>
        </div>

      </main>

      {/* FOOTER GATEWAY */}
      <footer className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-4 text-center text-xs text-sand-400 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>&copy; 2026 Sekala Villa Management. Tawangmangu & Yogyakarta.</span>
        <a 
          href={`https://wa.me/${waPhone}?text=Halo%20Admin%20Sekala%20Villa,%20mau%20konsultasi%20rekomendasi%20villa`}
          target="_blank"
          rel="noreferrer"
          className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5"
        >
          <i className="fa-brands fa-whatsapp text-sm"></i> Butuh Rekomendasi Cepat? Chat CS WA
        </a>
      </footer>

    </div>
  );
}
