import React, { useState } from 'react';

export default function Header({ settings }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
            <a href="#katalog" className="hover:text-brand-700 transition">Katalog Villa</a>
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

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-sand-200 bg-sand-50 px-4 py-3 space-y-2 text-xs font-bold uppercase">
            <a href="#promo-banner" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sand-800">Promo Special</a>
            <a href="#katalog" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sand-800">Katalog Villa</a>
            <a href="#addons-section" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sand-800">Detail Add-Ons</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sand-800">Tanya Jawab</a>
          </div>
        )}
      </header>
    </>
  );
}
