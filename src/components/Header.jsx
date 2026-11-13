import React, { useState } from 'react';

export default function Header({ settings, regions = [], onOpenRegionPage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catalogDropdownOpen, setCatalogDropdownOpen] = useState(false);
  const waPhone = settings?.whatsappPhone || '6281381669735';

  return (
    <>
      {/* Promo Bar */}
      <div className="bg-brand-900 text-amber-200 text-xs py-2 px-3 text-center font-medium flex items-center justify-center gap-2">
        <span className="bg-terracotta-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">PROMO ADS</span>
        <span className="truncate">Kulonuwun! Diskon Sewa Villa Up To 25% + Bonus alat BBQ siap bakar di Tawangmangu & Jogja.</span>
      </div>

      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-sand-50/90 backdrop-blur-md border-b border-sand-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-900 text-amber-300 flex items-center justify-center text-xl font-serif font-bold shadow-md">
              S
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-brand-900 leading-none block">SEKALA</span>
              <span className="text-[9px] uppercase tracking-widest text-terracotta-600 font-bold">Villa & Stays</span>
            </div>
          </a>

          <nav className="hidden md:flex items-center space-x-7 text-xs font-bold uppercase tracking-wider text-sand-800">
            <a href="#promo-banner" className="hover:text-brand-700 transition">Promo Iklan</a>

            {/* SUB-MENU KATALOG DENGAN DAERAH & TIPE AKOMODASI */}
            <div 
              className="relative"
              onMouseEnter={() => setCatalogDropdownOpen(true)}
              onMouseLeave={() => setCatalogDropdownOpen(false)}
            >
              <button 
                className="hover:text-brand-700 transition flex items-center gap-1.5 py-2 font-bold"
                onClick={() => setCatalogDropdownOpen(!catalogDropdownOpen)}
              >
                <span>Katalog Unit</span>
                <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${catalogDropdownOpen ? 'rotate-180' : ''}`}></i>
              </button>

              {/* DROPDOWN MENU */}
              {catalogDropdownOpen && (
                <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-2xl border border-sand-200 p-4 space-y-4 animate-in fade-in duration-150 z-50">
                  <div className="text-[10px] font-extrabold uppercase text-sand-400 tracking-wider">
                    Pilih Daerah & Tipe Akomodasi
                  </div>

                  {regions.map(r => (
                    <div key={r.id} className="space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-xs text-brand-900 border-b border-sand-100 pb-1">
                        <span className="flex items-center gap-1.5">
                          <i className="fa-solid fa-location-dot text-rose-600"></i>
                          <span>{r.name}</span>
                        </span>
                        <span className="text-[9px] bg-sand-100 text-sand-700 px-2 py-0.5 rounded-md">
                          {r.badge}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-1 pt-1">
                        {r.types.map(t => (
                          <button
                            key={t.id}
                            onClick={() => {
                              setCatalogDropdownOpen(false);
                              if (onOpenRegionPage) onOpenRegionPage(r.id, t.id);
                            }}
                            className="text-left text-xs text-sand-800 hover:text-brand-900 hover:bg-sand-50 p-2 rounded-xl transition flex items-center justify-between group"
                          >
                            <span className="flex items-center gap-2">
                              <i className={`fa-solid ${t.icon} text-brand-700 group-hover:text-amber-500 text-xs w-4`}></i>
                              <span className="font-semibold">{t.name}</span>
                            </span>
                            <i className="fa-solid fa-arrow-right text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-brand-700"></i>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 border-t border-sand-100 text-center">
                    <a
                      href="#katalog"
                      onClick={() => setCatalogDropdownOpen(false)}
                      className="text-[11px] font-bold text-terracotta-600 hover:underline block"
                    >
                      Lihat Semua Unit di Beranda ↓
                    </a>
                  </div>
                </div>
              )}
            </div>

            <a href="#addons-section" className="hover:text-brand-700 transition">Detail Add-Ons</a>
            <a href="#faq" className="hover:text-brand-700 transition">Info & FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${waPhone}?text=Halo%20Admin%20Sekala%20Villa,%20mau%20tanya%20unit%20villa`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition items-center gap-2"
            >
              <i className="fa-brands fa-whatsapp text-sm text-emerald-300"></i>
              <span>Hubungi Admin</span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-sand-900 text-xl p-2"
            >
              <i className="fa-solid fa-bars-staggered"></i>
            </button>
          </div>
        </div>

        {/* MOBILE MENU ACCORDION */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-sand-200 bg-sand-50 px-4 py-3 space-y-3 text-xs font-bold uppercase max-h-[80vh] overflow-y-auto">
            <a href="#promo-banner" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sand-800">
              Promo Special
            </a>

            {/* DAERAH & SUB-MENU DI HP */}
            <div className="py-2 border-y border-sand-200 space-y-3">
              <span className="text-[10px] text-sand-500 font-extrabold tracking-wider block">Katalog Daerah:</span>
              {regions.map(r => (
                <div key={r.id} className="space-y-1.5 pl-2">
                  <span className="text-brand-900 font-bold block text-xs">📍 {r.name}</span>
                  <div className="space-y-1 pl-3">
                    {r.types.map(t => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          if (onOpenRegionPage) onOpenRegionPage(r.id, t.id);
                        }}
                        className="block w-full text-left py-1 text-sand-700 font-semibold text-[11px] flex items-center gap-2"
                      >
                        <i className={`fa-solid ${t.icon} text-brand-700 w-3.5`}></i>
                        <span>{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <a href="#addons-section" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sand-800">
              Detail Add-Ons
            </a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sand-800">
              Tanya Jawab
            </a>
          </div>
        )}
      </header>
    </>
  );
}
