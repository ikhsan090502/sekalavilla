import React from 'react';

export default function MobileBottomNav({ settings }) {
  const phone = settings?.whatsappPhone || '6281381669735';

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-sand-200 shadow-lg flex items-center justify-around px-2 py-2">
      <a href="#promo-banner" className="flex flex-col items-center gap-0.5 text-sand-800 hover:text-brand-700 transition px-3 py-1">
        <i className="fa-solid fa-fire text-lg text-terracotta-500"></i>
        <span className="text-[9px] font-bold uppercase">Promo</span>
      </a>
      <a href="#katalog" className="flex flex-col items-center gap-0.5 text-sand-800 hover:text-brand-700 transition px-3 py-1">
        <i className="fa-solid fa-house-chimney text-lg text-brand-700"></i>
        <span className="text-[9px] font-bold uppercase">Villa</span>
      </a>
      <a 
        href={`https://wa.me/${phone}?text=Halo%20Admin%20Sekala%20Villa`} 
        target="_blank" 
        rel="noreferrer"
        className="flex flex-col items-center gap-0.5 -mt-5 bg-emerald-700 text-white rounded-2xl px-4 py-3 shadow-lg border-2 border-white"
      >
        <i className="fa-brands fa-whatsapp text-xl"></i>
        <span className="text-[9px] font-bold uppercase">WA Admin</span>
      </a>
      <a href="#addons-section" className="flex flex-col items-center gap-0.5 text-sand-800 hover:text-brand-700 transition px-3 py-1">
        <i className="fa-solid fa-fire-burner text-lg text-brand-700"></i>
        <span className="text-[9px] font-bold uppercase">Add-Ons</span>
      </a>
      <a href="#faq" className="flex flex-col items-center gap-0.5 text-sand-800 hover:text-brand-700 transition px-3 py-1">
        <i className="fa-solid fa-circle-question text-lg text-brand-700"></i>
        <span className="text-[9px] font-bold uppercase">FAQ</span>
      </a>
    </nav>
  );
}
