import React from 'react';
import { formatRupiah, formatCatalogNumber } from '../data/initialData';

export default function VillaCard({ villa, onClick }) {
  const categoryBadge = villa.category || 'Standard';
  const catColor = categoryBadge === 'Budget' 
    ? 'bg-amber-500 text-slate-950' 
    : (categoryBadge === 'Premium' ? 'bg-brand-900 text-amber-300' : 'bg-emerald-700 text-white');

  const pType = villa.propertyType || 'villa';
  const typeLabel = pType === 'glamping' ? 'Glamping' : (pType === 'homestay' ? 'Homestay' : 'Villa');
  const typeIcon = pType === 'glamping' ? 'fa-campground' : (pType === 'homestay' ? 'fa-people-roof' : 'fa-house-chimney-window');

  const catNum = villa.catalogNumber ? formatCatalogNumber(villa.catalogNumber) : null;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-3xl overflow-hidden border border-sand-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer group"
    >
      <div className="relative h-56 overflow-hidden bg-sand-200">
        <img 
          src={villa.image || (villa.images && villa.images[0])} 
          alt={villa.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          {catNum && (
            <span className="bg-amber-400 text-brand-950 text-xs font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 border border-amber-500 tracking-wide">
              Katalog {catNum}
            </span>
          )}
          <span className="bg-slate-950/80 backdrop-blur text-amber-300 text-xs font-extrabold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
            <i className={`fa-solid ${typeIcon}`}></i> {typeLabel}
          </span>
          <span className={`${catColor} text-xs font-bold px-2.5 py-1 rounded-full shadow`}>
            {categoryBadge}
          </span>
        </div>

        <span className="absolute top-3 right-3 bg-white/95 text-sand-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
          <i className="fa-solid fa-star text-amber-500"></i> {villa.rating}
        </span>

        <span className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur text-white text-xs font-medium px-3 py-1 rounded-lg">
          <i className="fa-solid fa-location-dot me-1 text-emerald-400"></i> {villa.location}
        </span>

        <span className="absolute bottom-2.5 right-2.5 bg-white/95 text-sand-900 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow">
          <i className="fa-solid fa-images text-brand-700"></i> {(villa.images || []).length} Foto
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-900 leading-snug group-hover:text-brand-700 transition">
            {villa.name}
          </h3>
          <div className="flex items-center gap-3.5 text-xs sm:text-sm text-sand-800 font-semibold my-2.5">
            <span><i className="fa-solid fa-users text-brand-700 me-1"></i> Max {villa.capacity} Pax</span>
            <span><i className="fa-solid fa-bed text-brand-700 me-1"></i> {villa.bedrooms} Kamar</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {(villa.features || []).slice(0, 3).map((f, i) => (
              <span key={i} className="bg-sand-100 text-sand-800 text-xs font-semibold px-2.5 py-1 rounded-lg">
                {f}
              </span>
            ))}
            {(villa.features || []).length > 3 && (
              <span className="text-xs text-sand-800 font-bold px-1.5 py-1">
                +{(villa.features || []).length - 3}
              </span>
            )}
          </div>
        </div>

        <div className="pt-3.5 border-t border-sand-100 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-sand-600 block">Mulai Dari</span>
            <span className="text-lg font-black text-brand-900">
              {formatRupiah(villa.price)}<span className="text-xs font-medium text-sand-600">/malam</span>
            </span>
          </div>
          <span className="bg-amber-400 hover:bg-amber-300 text-brand-950 text-xs sm:text-sm font-extrabold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm border border-amber-500">
            <i className="fa-solid fa-eye text-xs"></i> Detail Unit
          </span>
        </div>
      </div>
    </div>
  );
}
