import React from 'react';
import { formatRupiah } from '../data/initialData';

export default function VillaCard({ villa, onClick }) {
  const categoryBadge = villa.category || 'Standard';
  const catColor = categoryBadge === 'Budget' 
    ? 'bg-amber-500 text-slate-950' 
    : (categoryBadge === 'Premium' ? 'bg-brand-900 text-amber-300' : 'bg-emerald-700 text-white');

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-3xl overflow-hidden border border-sand-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer group"
    >
      <div className="relative h-52 overflow-hidden bg-sand-200">
        <img 
          src={villa.image || (villa.images && villa.images[0])} 
          alt={villa.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className={`${catColor} text-[10px] font-bold px-2.5 py-1 rounded-full shadow`}>
            {categoryBadge}
          </span>
          {villa.badge && (
            <span className="bg-black/60 backdrop-blur text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">
              {villa.badge}
            </span>
          )}
        </div>

        <span className="absolute top-3 right-3 bg-white/95 text-sand-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
          <i className="fa-solid fa-star text-amber-500"></i> {villa.rating}
        </span>

        <span className="absolute bottom-2.5 left-2.5 bg-slate-950/75 backdrop-blur text-white text-[10px] px-2.5 py-0.5 rounded-lg">
          <i className="fa-solid fa-location-dot me-1 text-emerald-400"></i> {villa.location}
        </span>

        <span className="absolute bottom-2.5 right-2.5 bg-white/90 text-sand-900 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow">
          <i className="fa-solid fa-images text-brand-700"></i> {(villa.images || []).length} Foto
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-brand-900 leading-snug group-hover:text-brand-700 transition">
            {villa.name}
          </h3>
          <div className="flex items-center gap-3 text-xs text-sand-800 font-medium my-2">
            <span><i className="fa-solid fa-users text-brand-700 me-1"></i> Max {villa.capacity} Pax</span>
            <span><i className="fa-solid fa-bed text-brand-700 me-1"></i> {villa.bedrooms} Kamar</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {(villa.features || []).slice(0, 3).map((f, i) => (
              <span key={i} className="bg-sand-100 text-sand-800 text-[9px] font-semibold px-2 py-0.5 rounded">
                {f}
              </span>
            ))}
            {(villa.features || []).length > 3 && (
              <span className="text-[9px] text-sand-800 font-bold px-1">
                +{(villa.features || []).length - 3}
              </span>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-sand-100 flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase font-bold text-sand-800 block">Mulai Dari</span>
            <span className="text-base font-extrabold text-brand-800">
              {formatRupiah(villa.price)}<span className="text-xs font-normal text-sand-800">/malam</span>
            </span>
          </div>
          <span className="bg-brand-100 group-hover:bg-brand-900 group-hover:text-amber-300 text-brand-800 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm">
            <i className="fa-solid fa-eye text-xs"></i> Detail
          </span>
        </div>
      </div>
    </div>
  );
}
