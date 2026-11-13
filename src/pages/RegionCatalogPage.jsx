import React, { useState } from 'react';
import VillaCard from '../components/VillaCard';

export default function RegionCatalogPage({ 
  regionId, 
  villas, 
  regions, 
  onSelectVilla, 
  onBack, 
  onNavigate 
}) {
  const currentRegion = regions.find(r => r.id === regionId) || regions[0];
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'villa' | 'glamping'

  // Filter unit berdasarkan daerah target
  const locTarget = regionId === 'tawangmangu' ? 'Tawangmangu' : 'Yogyakarta';
  const regionVillas = villas.filter(v => {
    const matchLoc = (v.location || '').toLowerCase().includes(locTarget.toLowerCase());
    return matchLoc;
  });

  // Filter tab tipe (Semua, Villa, Glamping)
  const displayList = regionVillas.filter(v => {
    if (activeTab === 'all') return true;
    const pType = (v.propertyType || 'villa').toLowerCase();
    return pType === activeTab.toLowerCase();
  });

  // Hitung jumlah masing-masing
  const countAll = regionVillas.length;
  const countVilla = regionVillas.filter(v => (v.propertyType || 'villa').toLowerCase() === 'villa').length;
  const countGlamping = regionVillas.filter(v => (v.propertyType || 'villa').toLowerCase() === 'glamping').length;

  return (
    <div className="min-h-screen bg-sand-50 py-8 sm:py-12 animate-in fade-in duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BREADCRUMB & BACK BUTTON */}
        <div className="flex items-center justify-between pb-6 border-b border-sand-200 mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-sand-800">
            <button 
              onClick={onBack} 
              className="hover:text-brand-900 flex items-center gap-1.5 font-bold text-brand-900 bg-sand-100 px-3 py-1.5 rounded-xl border border-sand-200 transition"
            >
              <i className="fa-solid fa-arrow-left"></i> Kembali ke Beranda
            </button>
            <span className="text-sand-400">/</span>
            <span className="text-terracotta-600 font-bold">{currentRegion?.name}</span>
          </div>

          <span className="hidden sm:inline-block bg-amber-400 text-slate-950 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            {currentRegion?.badge}
          </span>
        </div>

        {/* HEADER DAERAH */}
        <div className="bg-brand-900 text-white rounded-3xl p-6 sm:p-10 mb-8 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-2">
            <span className="text-amber-400 text-[10px] font-extrabold uppercase tracking-widest block">
              Eksklusif Area • {currentRegion?.badge}
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-amber-50 leading-tight">
              Katalog Villa & Glamping di {currentRegion?.name}
            </h1>
            <p className="text-sand-200 text-xs sm:text-sm leading-relaxed pt-1">
              Jelajahi seluruh pilihan villa private pool dan glamping di daerah {currentRegion?.name}. Semua unit terverifikasi langsung oleh Sekala Villa.
            </p>
          </div>

          <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10 pointer-events-none">
            <i className="fa-solid fa-mountain-city text-9xl"></i>
          </div>
        </div>

        {/* FILTER TAB: SEMUA / VILLA / GLAMPING */}
        <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-md border border-sand-200 mb-8 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 border ${
                activeTab === 'all'
                  ? 'bg-brand-900 text-amber-300 border-brand-900 shadow'
                  : 'bg-sand-50 text-sand-800 border-sand-200 hover:bg-sand-100 hover:text-brand-900'
              }`}
            >
              <i className="fa-solid fa-layer-group"></i>
              <span>Semua Unit</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'all' ? 'bg-amber-400 text-slate-950' : 'bg-sand-200 text-sand-700'}`}>
                {countAll}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('villa')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 border ${
                activeTab === 'villa'
                  ? 'bg-brand-900 text-amber-300 border-brand-900 shadow'
                  : 'bg-sand-50 text-sand-800 border-sand-200 hover:bg-sand-100 hover:text-brand-900'
              }`}
            >
              <i className="fa-solid fa-house-chimney-window"></i>
              <span>Villa</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'villa' ? 'bg-amber-400 text-slate-950' : 'bg-sand-200 text-sand-700'}`}>
                {countVilla}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('glamping')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 border ${
                activeTab === 'glamping'
                  ? 'bg-brand-900 text-amber-300 border-brand-900 shadow'
                  : 'bg-sand-50 text-sand-800 border-sand-200 hover:bg-sand-100 hover:text-brand-900'
              }`}
            >
              <i className="fa-solid fa-campground"></i>
              <span>Glamping</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'glamping' ? 'bg-amber-400 text-slate-950' : 'bg-sand-200 text-sand-700'}`}>
                {countGlamping}
              </span>
            </button>
          </div>

          {/* GANTI KE DAERAH LAIN */}
          <div className="flex items-center gap-2 px-2 py-1">
            <span className="text-xs font-bold text-sand-500 hidden md:inline">Ganti Wilayah:</span>
            {regions.map(r => (
              <button
                key={r.id}
                onClick={() => {
                  setActiveTab('all');
                  if (onNavigate) onNavigate(r.id);
                }}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition border ${
                  r.id === regionId 
                    ? 'bg-terracotta-500 text-white border-terracotta-500 shadow-xs' 
                    : 'bg-sand-50 text-sand-800 border-sand-200 hover:bg-sand-100'
                }`}
              >
                📍 {r.name}
              </button>
            ))}
          </div>
        </div>

        {/* LIST UNIT YANG DITAMPILKAN */}
        {displayList.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-sand-200 shadow-sm space-y-3">
            <i className="fa-solid fa-house-chimney-crack text-4xl text-sand-400"></i>
            <h3 className="text-base font-bold text-brand-900">Belum Ada Unit di Kategori Ini</h3>
            <p className="text-xs text-sand-800 max-w-md mx-auto">
              Belum ada unit {activeTab === 'villa' ? 'Villa' : (activeTab === 'glamping' ? 'Glamping' : '')} yang tersedia di {currentRegion?.name}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayList.map(item => (
              <VillaCard
                key={item.id}
                villa={item}
                onClick={() => onSelectVilla(item)}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
