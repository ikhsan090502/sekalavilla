import React from 'react';
import { formatRupiah } from '../data/initialData';

const FACILITIES = [
  { id: 'all', label: 'Semua Fasilitas' },
  { id: 'Private Pool', label: 'Private Pool', icon: 'fa-water-ladder' },
  { id: 'View Gunung', label: 'View Gunung', icon: 'fa-mountain-sun' },
  { id: 'View Kebun Teh', label: 'View Kebun Teh', icon: 'fa-leaf' },
  { id: 'Karaoke', label: 'Karaoke', icon: 'fa-microphone' },
  { id: 'Free Water Heater', label: 'Water Heater', icon: 'fa-temperature-arrow-up' },
  { id: 'Wifi 100Mbps', label: 'Wifi 100Mbps', icon: 'fa-wifi' },
];

export default function SearchFilter({ filters, setFilters, onReset }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-3 sm:-mt-6 relative z-20">
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-sand-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-sand-100">
          <span className="font-bold text-brand-900 text-xs sm:text-sm flex items-center gap-2">
            <i className="fa-solid fa-sliders text-terracotta-500 text-base"></i> Filter Pencarian Villa
          </span>
          <button 
            onClick={onReset}
            className="text-xs text-terracotta-600 font-bold hover:underline flex items-center gap-1"
          >
            <i className="fa-solid fa-rotate-left text-[11px]"></i> Reset Filter
          </button>
        </div>

        {/* Baris 1: Filter Dropdown & Budget */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[10px] font-extrabold text-sand-800 uppercase mb-1">Lokasi Destinasi</label>
            <select
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs font-semibold text-sand-900 focus:outline-none"
            >
              <option value="all">Semua Lokasi</option>
              <option value="Tawangmangu">Tawangmangu</option>
              <option value="Yogyakarta">Yogyakarta</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-sand-800 uppercase mb-1">Kategori Kelas</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs font-semibold text-sand-900 focus:outline-none"
            >
              <option value="all">Semua Kategori</option>
              <option value="Budget">Budget Friendly</option>
              <option value="Standard">Standard Pool</option>
              <option value="Premium">Premium / Gathering</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-sand-800 uppercase mb-1">Kapasitas Tamu</label>
            <select
              value={filters.capacity}
              onChange={(e) => setFilters({ ...filters, capacity: parseInt(e.target.value) })}
              className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs font-semibold text-sand-900 focus:outline-none"
            >
              <option value="0">Semua Kapasitas</option>
              <option value="4">2 - 4 Pax</option>
              <option value="8">5 - 8 Pax</option>
              <option value="15">10+ Pax (Rombongan)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] font-extrabold text-sand-800 uppercase">Batas Budget / Malam</label>
              <span className="text-xs font-bold text-brand-700">{formatRupiah(filters.budget)}</span>
            </div>
            <input
              type="range"
              min="500000"
              max="5000000"
              step="250000"
              value={filters.budget}
              onChange={(e) => setFilters({ ...filters, budget: parseInt(e.target.value) })}
              className="w-full accent-brand-700 h-2 bg-sand-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Baris 2: Filter Fasilitas Unggulan */}
        <div className="pt-2 border-t border-sand-100">
          <span className="block text-[10px] font-extrabold text-sand-800 uppercase mb-2">Filter Berdasarkan Fasilitas Unggulan:</span>
          <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1">
            {FACILITIES.map(fac => {
              const active = filters.facility === fac.id;
              return (
                <button
                  key={fac.id}
                  onClick={() => setFilters({ ...filters, facility: fac.id })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                    active 
                      ? 'bg-brand-900 text-amber-300 shadow-sm' 
                      : 'bg-sand-100 text-sand-800 border border-sand-200 hover:bg-sand-200'
                  }`}
                >
                  {fac.icon && <i className={`fa-solid ${fac.icon} ${active ? 'text-amber-300' : 'text-emerald-600'}`}></i>}
                  <span>{fac.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
