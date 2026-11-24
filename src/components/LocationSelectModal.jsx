import React from 'react';

/**
 * LocationSelectModal
 * Popup memilih destinasi / tempat menginap (Tawangmangu vs Yogyakarta)
 * Menggantikan popup promo lama, dan wajib dipilih saat melewati landing page.
 */
export default function LocationSelectModal({
  isOpen,
  onClose,
  onSelectLocation,
  villas = [],
  settings = {},
  isMandatory = true
}) {
  if (!isOpen) return null;

  // Hitung villa per daerah secara live
  const countTawangmangu = villas.filter(v => 
    (v.location || '').toLowerCase().includes('tawangmangu')
  ).length;

  const countJogja = villas.filter(v => 
    (v.location || '').toLowerCase().includes('yogyakarta') || 
    (v.location || '').toLowerCase().includes('jogja')
  ).length;

  const handleChoose = (locName) => {
    onSelectLocation(locName);
    if (onClose) onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3.5 sm:p-5 transition-all duration-300 overflow-y-auto"
      onClick={(e) => {
        if (!isMandatory && e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border-2 border-amber-400/80 relative animate-in fade-in zoom-in-95 duration-200 my-auto text-sand-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Close hanya muncul jika bukan mandatory */}
        {!isMandatory && onClose && (
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center font-bold backdrop-blur transition"
            title="Tutup"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        )}

        {/* HEADER MODAL */}
        <div className="bg-gradient-to-br from-brand-950 via-brand-900 to-emerald-950 text-white px-5 sm:px-7 pt-6 pb-5 text-center relative overflow-hidden">
          {/* Aksen hiasan latar */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-xl pointer-events-none"></div>

          <div className="relative z-10 space-y-2">
            <span className="bg-amber-400 text-brand-950 text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 shadow-md">
              <i className="fa-solid fa-map-location-dot"></i> Wajib Pilih Destinasi
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
              Mau Liburan ke Mana?
            </h2>

            <p className="text-xs sm:text-sm text-sand-200/90 max-w-md mx-auto leading-relaxed">
              Tentukan destinasi tujuan Anda untuk melihat katalog villa & glamping yang tersedia dan siap dibooking.
            </p>
          </div>
        </div>

        {/* KONTEN PILIHAN TEMPAT (2 KARTU UTAMA) */}
        <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 bg-sand-50/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            
            {/* OPSI 1: TAWANGMANGU & KEMUNING */}
            <div 
              onClick={() => handleChoose('Tawangmangu')}
              className="group cursor-pointer bg-white rounded-2xl border-2 border-sand-200 hover:border-amber-500 shadow-sm hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-brand-900">
                <img 
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80" 
                  alt="Tawangmangu & Kemuning"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <span className="absolute top-2.5 left-2.5 bg-amber-400 text-brand-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                  🏔️ Dingin & Sejuk
                </span>

                <span className="absolute bottom-2 left-2.5 bg-brand-950/90 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md backdrop-blur-xs border border-amber-400/40">
                  {countTawangmangu} Unit Tersedia
                </span>
              </div>

              <div className="p-3.5 sm:p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-brand-900 leading-tight group-hover:text-terracotta-600 transition">
                    Tawangmangu & Kemuning
                  </h3>
                  <p className="text-[11px] text-sand-600 mt-1 line-clamp-2 leading-relaxed">
                    Lereng Gunung Lawu, Sekipan, Pancot, Blumbang, kebun teh Kemuning. Udara dingin & sejuk.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChoose('Tawangmangu');
                  }}
                  className="mt-3 w-full bg-amber-400 group-hover:bg-amber-300 text-brand-950 font-black text-xs py-2 px-3 rounded-xl border border-amber-500 shadow-xs flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <span>Pilih Tawangmangu</span>
                  <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </div>
            </div>

            {/* OPSI 2: YOGYAKARTA & SLEMAN */}
            <div 
              onClick={() => handleChoose('Yogyakarta')}
              className="group cursor-pointer bg-white rounded-2xl border-2 border-sand-200 hover:border-amber-500 shadow-sm hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-brand-900">
                <img 
                  src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80" 
                  alt="Yogyakarta & Sleman"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <span className="absolute top-2.5 left-2.5 bg-amber-400 text-brand-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                  🏛️ Asri & Wisata
                </span>

                <span className="absolute bottom-2 left-2.5 bg-brand-950/90 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md backdrop-blur-xs border border-amber-400/40">
                  {countJogja} Unit Tersedia
                </span>
              </div>

              <div className="p-3.5 sm:p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-brand-900 leading-tight group-hover:text-terracotta-600 transition">
                    Yogyakarta & Sleman
                  </h3>
                  <p className="text-[11px] text-sand-600 mt-1 line-clamp-2 leading-relaxed">
                    Kawasan Kaliurang, lereng Merapi, Sleman, & dekat kota. Nuansa estetik, tenang, & strategis.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChoose('Yogyakarta');
                  }}
                  className="mt-3 w-full bg-amber-400 group-hover:bg-amber-300 text-brand-950 font-black text-xs py-2 px-3 rounded-xl border border-amber-500 shadow-xs flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <span>Pilih Yogyakarta</span>
                  <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </div>
            </div>

          </div>

          {/* OPSI KETIGA: LIHAT SEMUA DESTINASI */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => handleChoose('all')}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-sand-100 text-sand-700 hover:text-brand-950 font-bold text-xs border border-sand-200 transition flex items-center justify-center gap-2 shadow-2xs group"
            >
              <i className="fa-solid fa-layer-group text-sand-400 group-hover:text-amber-500"></i>
              <span>Tampilkan Semua Unit (Tawangmangu & Jogja Sekaligus)</span>
              <i className="fa-solid fa-chevron-right text-[10px] text-sand-400"></i>
            </button>
          </div>
        </div>

        {/* FOOTER BANTUAN WA CS */}
        <div className="px-5 py-3 bg-sand-100/80 border-t border-sand-200 flex items-center justify-between text-xs text-sand-600">
          <span className="text-[11px]">Butuh bantuan memilih?</span>
          <a
            href={`https://wa.me/${settings?.whatsappPhone || '6281381669735'}?text=${encodeURIComponent('Halo Admin Sekala Villa! 🖐️\nSaya ingin rekomendasi tempat menginap di Tawangmangu atau Jogja, bisa dibantu?')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 text-[11px]"
          >
            <i className="fa-brands fa-whatsapp text-sm text-emerald-600"></i> Chat Admin CS
          </a>
        </div>
      </div>
    </div>
  );
}
