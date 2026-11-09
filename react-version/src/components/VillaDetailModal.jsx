import React, { useState, useRef, useEffect } from 'react';
import { formatRupiah } from '../data/initialData';

export default function VillaDetailModal({ villa, settings, onClose }) {
  const [current, setCurrent] = useState(0);
  const images = villa?.images && villa.images.length ? villa.images : [villa?.image];
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!villa) return null;

  const handleNext = () => setCurrent((current + 1) % images.length);
  const handlePrev = () => setCurrent((current - 1 + images.length) % images.length);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  const handleDirectWA = () => {
    const template = settings?.waTemplateVilla || 
      `Halo Admin Sekala Villa! 🖐️\nSaya tertarik mau booking unit villa ini:\n\n📌 *Villa:* {villa_name}\n🏷️ *Kategori:* {category}\n📍 *Lokasi:* {location}\n👥 *Kapasitas:* {capacity} Pax\n💰 *Mulai Dari:* {price_start} / malam\n✨ *Fasilitas Utama:* {facilities}\n\nApakah unit ini ready untuk tanggal rencana saya kak? Mohon infonya, terima kasih!`;

    const text = template
      .replace(/{villa_name}/g, villa.name)
      .replace(/{category}/g, villa.category || 'Standard')
      .replace(/{location}/g, villa.location)
      .replace(/{capacity}/g, villa.capacity)
      .replace(/{price_start}/g, formatRupiah(villa.price))
      .replace(/{facilities}/g, (villa.features || []).join(', '));

    const phone = settings?.whatsappPhone || '6281381669735';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white shadow-2xl border border-sand-200 relative overflow-hidden w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl max-h-[92dvh] sm:max-h-[90vh] overflow-y-auto">
        {/* Mobile handle */}
        <div className="w-10 h-1 rounded-full bg-sand-200 mx-auto mt-2.5 sm:hidden"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white flex items-center justify-center font-bold backdrop-blur transition"
        >
          <i className="fa-solid fa-xmark text-base"></i>
        </button>

        {/* Gallery Slider Rasio 1 : 1 (Square) */}
        <div 
          className="relative bg-brand-900 overflow-hidden select-none w-full aspect-square"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="flex h-full w-full transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {images.map((img, i) => (
              <div key={i} className="flex-shrink-0 w-full h-full aspect-square">
                <img src={img} alt={`Foto ${i + 1}`} className="w-full h-full object-cover pointer-events-none" />
              </div>
            ))}
          </div>

          {/* Prev / Next Arrows */}
          <button 
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur transition z-20"
          >
            <i className="fa-solid fa-chevron-left text-sm"></i>
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur transition z-20"
          >
            <i className="fa-solid fa-chevron-right text-sm"></i>
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition ${i === current ? 'bg-white scale-125' : 'bg-white/40'}`}
              />
            ))}
          </div>

          {/* Counter & Badge */}
          <span className="absolute top-3 left-3 bg-slate-950/70 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur z-20">
            {current + 1} / {images.length}
          </span>
          <span className="absolute top-3 right-14 bg-brand-900/90 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full z-20">
            {villa.category || 'Standard'}
          </span>
        </div>

        {/* Info Content */}
        <div className="p-4 sm:p-6 space-y-4 pb-24 sm:pb-6">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-serif text-lg sm:text-2xl font-bold text-brand-900 leading-tight">
                {villa.name}
              </h3>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-700 shrink-0 bg-amber-100 px-2.5 py-1 rounded-xl">
                <i className="fa-solid fa-star text-amber-500"></i> {villa.rating}
              </span>
            </div>
            <span className="text-xs text-sand-800 flex items-center gap-1 mt-1">
              <i className="fa-solid fa-location-dot text-emerald-600"></i> {villa.location}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-sand-800 leading-relaxed">
            {villa.desc}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-sand-50 rounded-2xl p-3 flex items-center gap-2 border border-sand-200">
              <i className="fa-solid fa-users text-brand-700 text-lg"></i>
              <div>
                <span className="text-[10px] uppercase font-bold text-sand-800 block">Kapasitas</span>
                {villa.capacity} Tamu
              </div>
            </div>
            <div className="bg-sand-50 rounded-2xl p-3 flex items-center gap-2 border border-sand-200">
              <i className="fa-solid fa-bed text-brand-700 text-lg"></i>
              <div>
                <span className="text-[10px] uppercase font-bold text-sand-800 block">Kamar Tidur</span>
                {villa.bedrooms} Kamar
              </div>
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-sand-800 block mb-2">Fasilitas Tersedia:</span>
            <div className="flex flex-wrap gap-1.5">
              {(villa.features || []).map((f, i) => (
                <span key={i} className="bg-brand-100 text-brand-800 text-[10px] font-bold px-3 py-1 rounded-xl flex items-center gap-1.5">
                  <i className="fa-solid fa-circle-check text-emerald-600 text-[10px]"></i> {f}
                </span>
              ))}
            </div>
          </div>

          {/* Desktop Booking Bar */}
          <div className="hidden sm:flex pt-4 border-t border-sand-200 items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-sand-800 block">Mulai Dari</span>
              <span className="text-xl font-extrabold text-brand-800">
                {formatRupiah(villa.price)}<span className="text-xs font-normal text-sand-800"> / malam</span>
              </span>
            </div>
            <button 
              onClick={handleDirectWA}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 py-3.5 rounded-2xl shadow transition flex items-center gap-2"
            >
              <i className="fa-brands fa-whatsapp text-lg"></i> Pesan Langsung via WA
            </button>
          </div>
        </div>

        {/* Mobile Sticky Booking Bar */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-sand-200 shadow-2xl px-4 py-3 flex items-center gap-3 z-50">
          <div className="flex-1 min-w-0">
            <span className="text-[9px] uppercase font-bold text-sand-800 block">Mulai Dari</span>
            <span className="text-base font-extrabold text-brand-800 truncate block">
              {formatRupiah(villa.price)}<span className="text-xs font-normal text-sand-800"> /malam</span>
            </span>
          </div>
          <button 
            onClick={handleDirectWA}
            className="shrink-0 bg-emerald-700 active:bg-emerald-900 text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-lg transition flex items-center gap-2"
          >
            <i className="fa-brands fa-whatsapp text-lg"></i> Pesan WA
          </button>
        </div>
      </div>
    </div>
  );
}
