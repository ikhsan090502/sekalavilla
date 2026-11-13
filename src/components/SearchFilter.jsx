import React from 'react';
import { PROPERTY_TYPES } from '../data/initialData';

export default function SearchFilter({ 
  filters, 
  setFilters, 
  onReset, 
  regions = [], 
  onOpenRegionPage 
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-3 sm:-mt-6 relative z-20">
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-sand-200 space-y-5">
        
        {/* HEADER KATEGORI & RESET */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-sand-100 gap-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-sand-500 block">
              Pilihan Akomodasi
            </span>
            <h3 className="font-serif font-bold text-base sm:text-lg text-brand-900">
              Temukan Tempat Menginap Berdasarkan Daerah
            </h3>
          </div>
          <button 
            onClick={onReset}
            className="text-xs text-terracotta-600 font-bold hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <i className="fa-solid fa-rotate-left text-[11px]"></i> Tampilkan Semua
          </button>
        </div>

        {/* SECTION 1: KELOMPOK DAERAH DENGAN SUB-TIPE (BERBENTUK HALAMAN BARU) */}
        <div className="space-y-3">
          <span className="text-[11px] font-extrabold text-brand-900 uppercase tracking-wider block">
            Jelajahi per Wilayah (Buka Halaman Khusus):
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {regions.map(r => (
              <div 
                key={r.id} 
                className="bg-sand-50 border border-sand-200 hover:border-amber-400/80 rounded-2xl p-4 transition shadow-xs hover:shadow-md space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-brand-900 text-amber-300 flex items-center justify-center text-xs">
                      <i className="fa-solid fa-location-dot"></i>
                    </span>
                    <strong className="font-serif font-bold text-sm text-brand-900">
                      {r.name}
                    </strong>
                  </div>
                  <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-2.5 py-0.5 rounded-full">
                    {r.badge}
                  </span>
                </div>

                {/* Sub-tipe button yang membuka New Page */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {r.types.map(t => (
                    <button
                      key={t.id}
                      onClick={() => onOpenRegionPage && onOpenRegionPage(r.id, t.id)}
                      className="bg-white hover:bg-brand-900 hover:text-amber-300 text-sand-800 text-xs font-bold py-2.5 px-2 rounded-xl border border-sand-200 transition shadow-xs flex flex-col items-center justify-center gap-1 text-center group"
                    >
                      <i className={`fa-solid ${t.icon} text-brand-700 group-hover:text-amber-400 text-xs`}></i>
                      <span className="text-[10px] sm:text-[11px] leading-tight">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: TAB FILTER CEPAT DI HALAMAN INI */}
        <div className="pt-2 border-t border-sand-100 space-y-2">
          <span className="text-[10px] font-bold text-sand-500 uppercase tracking-wider block">
            Atau Saring Langsung di Halaman Ini:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PROPERTY_TYPES.map(pt => {
              const active = (filters.propertyType || 'all') === pt.id;
              return (
                <button
                  key={pt.id}
                  onClick={() => setFilters(prev => ({ ...prev, propertyType: pt.id }))}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 border ${
                    active 
                      ? 'bg-brand-900 text-amber-300 border-brand-900 shadow-md' 
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

      </div>
    </section>
  );
}
