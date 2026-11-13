import React, { useState } from 'react';

export default function LandingGateway({ onComplete, onSkip, settings }) {
  // Step State
  const [destination, setDestination] = useState('tawangmangu'); // 'tawangmangu' | 'yogyakarta'
  const [capacity, setCapacity] = useState(4); // 2 | 4 | 8 | 12
  const [propertyType, setPropertyType] = useState('all'); // 'all' | 'villa' | 'glamping'

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete({
      location: destination === 'tawangmangu' ? 'Tawangmangu' : 'Yogyakarta',
      capacity: capacity,
      propertyType: propertyType
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
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/90 via-sand-950/80 to-sand-950"></div>
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

      {/* MAIN INTERACTIVE MATCHER CARD */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-2">
          <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] sm:text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
            <i className="fa-solid fa-sparkles text-amber-400"></i> Smart Trip Matcher
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-amber-50 leading-tight">
            Mau Liburan Nyaman Seperti Apa Kali Ini?
          </h1>
          <p className="text-xs sm:text-sm text-sand-300 leading-relaxed max-w-lg mx-auto">
            Bantu kami mengerucutkan pilihan villa & glamping yang pas untuk rombongan Anda hanya dalam 3 langkah singkat.
          </p>
        </div>

        {/* INTERACTIVE FORM CONTAINER */}
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6">
          
          {/* STEP 1: TUJUAN DESTINASI */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black flex items-center justify-center">
                1
              </span>
              <label className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-200">
                Mau Menikmati Suasana Mana?
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDestination('tawangmangu')}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between group ${
                  destination === 'tawangmangu'
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg scale-[1.01]'
                    : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                    destination === 'tawangmangu' ? 'bg-slate-950 text-amber-300' : 'bg-white/10 text-emerald-400'
                  }`}>
                    🏔️
                  </span>
                  <div>
                    <strong className="text-sm sm:text-base font-serif block">
                      Tawangmangu & Kemuning
                    </strong>
                    <span className={`text-[11px] ${destination === 'tawangmangu' ? 'text-slate-800 font-semibold' : 'text-sand-300'}`}>
                      Sejuk Dingin Kaki Lawu & Kebun Teh
                    </span>
                  </div>
                </div>
                <i className={`fa-solid fa-circle-check text-lg ${destination === 'tawangmangu' ? 'text-slate-950' : 'text-transparent'}`}></i>
              </button>

              <button
                type="button"
                onClick={() => setDestination('yogyakarta')}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between group ${
                  destination === 'yogyakarta'
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg scale-[1.01]'
                    : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                    destination === 'yogyakarta' ? 'bg-slate-950 text-amber-300' : 'bg-white/10 text-rose-400'
                  }`}>
                    🏛️
                  </span>
                  <div>
                    <strong className="text-sm sm:text-base font-serif block">
                      Yogyakarta & Sleman
                    </strong>
                    <span className={`text-[11px] ${destination === 'yogyakarta' ? 'text-slate-800 font-semibold' : 'text-sand-300'}`}>
                      Syahdu Kaliurang Merapi & Dekat Kota
                    </span>
                  </div>
                </div>
                <i className={`fa-solid fa-circle-check text-lg ${destination === 'yogyakarta' ? 'text-slate-950' : 'text-transparent'}`}></i>
              </button>
            </div>
          </div>

          {/* STEP 2: KAPASITAS TAMU (BERAPA ORANG) */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black flex items-center justify-center">
                2
              </span>
              <label className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-200">
                Liburan Bersama Siapa & Berapa Orang?
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { pax: 2, icon: '💑', title: 'Pasangan / Duo', desc: '1-2 Orang' },
                { pax: 4, icon: '👨‍👩‍👧', title: 'Keluarga Kecil', desc: '3-5 Orang' },
                { pax: 8, icon: '👨‍👩‍👦‍👦', title: 'Keluarga Besar', desc: '6-9 Orang' },
                { pax: 12, icon: '🎉', title: 'Rombongan / Gathering', desc: '10+ Orang' }
              ].map(opt => {
                const active = capacity === opt.pax;
                return (
                  <button
                    key={opt.pax}
                    type="button"
                    onClick={() => setCapacity(opt.pax)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      active
                        ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-md scale-105'
                        : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{opt.icon}</span>
                    <strong className="text-xs block leading-tight">{opt.title}</strong>
                    <span className={`text-[10px] block mt-0.5 ${active ? 'text-slate-800 font-semibold' : 'text-sand-400'}`}>
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: TIPE PENGALAMAN MENGINAP */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black flex items-center justify-center">
                3
              </span>
              <label className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-200">
                Pilih Konsep Tempat Menginap:
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'all', icon: 'fa-layer-group', label: 'Bebas / Semua Tipe', desc: 'Tampilkan pilihan terbaik' },
                { id: 'villa', icon: 'fa-house-chimney-window', label: 'Villa Privat', desc: 'Kolam renang & privasi penuh' },
                { id: 'glamping', icon: 'fa-campground', label: 'Glamping Alam', desc: 'Tenda mewah & api unggun' }
              ].map(t => {
                const active = propertyType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setPropertyType(t.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                      active
                        ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-md'
                        : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                    }`}
                  >
                    <i className={`fa-solid ${t.icon} text-lg ${active ? 'text-slate-950' : 'text-amber-400'}`}></i>
                    <div>
                      <strong className="text-xs sm:text-sm block leading-tight">{t.label}</strong>
                      <span className={`text-[10px] block ${active ? 'text-slate-800 font-semibold' : 'text-sand-400'}`}>
                        {t.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TOMBOL AKSI UTAMA */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onSkip}
              className="text-xs text-sand-400 hover:text-white transition font-medium order-2 sm:order-1 py-2"
            >
              Atau langsung buka katalog lengkap tanpa filter →
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-slate-950 font-black text-xs sm:text-sm px-8 py-4 rounded-2xl shadow-xl hover:shadow-amber-400/20 transition-all flex items-center justify-center gap-2 order-1 sm:order-2"
            >
              <i className="fa-solid fa-magnifying-glass text-slate-950"></i>
              <span>TEMUKAN UNIT REKOMENDASI SAYA</span>
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </div>

        </form>

        {/* 3 VALUE UNGGULAN SEKALA VILLA (TRUST BADGES) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
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
              <span className="text-[10px] text-sand-400">Harga langsung tanpa mark-up liar & jaminan kebersihan unit</span>
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
