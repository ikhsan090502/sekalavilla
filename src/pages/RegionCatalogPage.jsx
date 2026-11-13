import React from 'react';
import VillaCard from '../components/VillaCard';

export default function RegionCatalogPage({ 
  regionId, 
  typeId, 
  villas, 
  regions, 
  onSelectVilla, 
  onBack, 
  onNavigate 
}) {
  const currentRegion = regions.find(r => r.id === regionId) || regions[0];
  const types = currentRegion?.types || [];
  const currentType = types.find(t => t.id === typeId) || types[0];

  // Filter unit yang spesifik untuk daerah & tipe ini
  const locTarget = regionId === 'tawangmangu' ? 'Tawangmangu' : 'Yogyakarta';
  const filteredList = villas.filter(v => {
    const matchLoc = (v.location || '').toLowerCase().includes(locTarget.toLowerCase());
    const pType = (v.propertyType || 'villa').toLowerCase();
    const matchType = pType === (currentType?.id || 'villa').toLowerCase();
    return matchLoc && matchType;
  });

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
            <span className="text-sand-400">/</span>
            <span className="text-brand-900 font-extrabold">{currentType?.name}</span>
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
              Katalog {currentType?.name} di {currentRegion?.name}
            </h1>
            <p className="text-sand-200 text-xs sm:text-sm leading-relaxed pt-1">
              Pilihan akomodasi terverifikasi dengan suasana nyaman, fasilitas lengkap, dan harga terbaik langsung dari Sekala Villa.
            </p>
          </div>

          <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10 pointer-events-none">
            <i className="fa-solid fa-mountain-city text-9xl"></i>
          </div>
        </div>

        {/* SUB-MENU TIPE AKOMODASI (VILLA, GLAMPING, HOMESTAY) UNTUK DAERAH INI */}
        <div className="bg-white rounded-2xl p-2 sm:p-3 shadow-md border border-sand-200 mb-8 flex flex-wrap gap-2">
          {types.map(t => {
            const isActive = t.id === currentType?.id;
            return (
              <button
                key={t.id}
                onClick={() => onNavigate(regionId, t.id)}
                className={`flex-1 sm:flex-initial px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 border ${
                  isActive
                    ? 'bg-brand-900 text-amber-300 border-brand-900 shadow'
                    : 'bg-sand-50 text-sand-800 border-sand-200 hover:bg-sand-100 hover:text-brand-900'
                }`}
              >
                <i className={`fa-solid ${t.icon} ${isActive ? 'text-amber-400' : 'text-brand-700'}`}></i>
                <span>{t.name}</span>
              </button>
            );
          })}
        </div>

        {/* SWITCH DAERAH LAIN */}
        <div className="flex items-center gap-2 pb-6">
          <span className="text-xs font-bold text-sand-600">Pilih Daerah Lain:</span>
          {regions.map(r => (
            <button
              key={r.id}
              onClick={() => onNavigate(r.id, r.types[0]?.id || 'villa')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                r.id === regionId 
                  ? 'bg-terracotta-500 text-white shadow-xs' 
                  : 'bg-sand-200/80 text-sand-800 hover:bg-sand-300'
              }`}
            >
              📍 {r.name}
            </button>
          ))}
        </div>

        {/* LIST UNIT YANG DITAMPILKAN */}
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-sand-200 shadow-sm space-y-3">
            <i className="fa-solid fa-house-chimney-crack text-4xl text-sand-400"></i>
            <h3 className="text-base font-bold text-brand-900">Belum Ada Unit di Kategori Ini</h3>
            <p className="text-xs text-sand-800 max-w-md mx-auto">
              Belum ada unit {currentType?.name} yang terdaftar di daerah {currentRegion?.name}. Silakan cek tipe akomodasi lainnya.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map(item => (
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
