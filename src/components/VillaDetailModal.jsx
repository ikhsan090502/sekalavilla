import React, { useState, useRef, useEffect } from 'react';
import { formatRupiah } from '../data/initialData';

export default function VillaDetailModal({ villa, settings, onClose }) {
  const [current, setCurrent] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [isZoomedIn, setIsZoomedIn] = useState(false);

  const images = villa?.images && villa.images.length ? villa.images : [villa?.image];
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Keyboard navigation untuk Lightbox Zoom (Esc, Panah Kiri, Panah Kanan)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!zoomOpen) return;
      if (e.key === 'Escape') {
        setZoomOpen(false);
        setIsZoomedIn(false);
      } else if (e.key === 'ArrowRight') {
        setCurrent((prev) => (prev + 1) % images.length);
        setIsZoomedIn(false);
      } else if (e.key === 'ArrowLeft') {
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
        setIsZoomedIn(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomOpen, images.length]);

  if (!villa) return null;

  const handleNext = (e) => {
    e?.stopPropagation();
    setIsZoomedIn(false);
    setCurrent((current + 1) % images.length);
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    setIsZoomedIn(false);
    setCurrent((current - 1 + images.length) % images.length);
  };

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

  const openZoom = (index = current) => {
    setCurrent(index);
    setIsZoomedIn(false);
    setZoomOpen(true);
  };

  const handleDirectWA = () => {
    const template = settings?.waTemplateVilla || 
      `Halo Admin Sekala Villa! 🖐️\nSaya tertarik mau booking unit villa ini:\n\n📌 *Villa:* {villa_name}\n🏷️ *Kategori:* {category}\n📍 *Lokasi:* {location}\n👥 *Kapasitas:* {capacity} Pax\n💰 *Mulai Dari:* {price_start} / malam\n✨ *Fasilitas Utama:* {facilities}\n\nApakah unit ini ready untuk tanggal rencana saya kak? Mohon infonya, terima kasih!`;

    const text = template
      .replace(/{villa_name}/g, villa.name)
      .replace(/{property_type}/g, villa.propertyType === 'glamping' ? 'Glamping' : (villa.propertyType === 'homestay' ? 'Homestay' : 'Villa'))
      .replace(/{category}/g, villa.category || 'Standard')
      .replace(/{location}/g, villa.location)
      .replace(/{capacity}/g, villa.capacity)
      .replace(/{price_start}/g, formatRupiah(villa.price))
      .replace(/{facilities}/g, (villa.features || []).join(', '));

    const phone = settings?.whatsappPhone || '6281381669735';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <>
      {/* ========================================================= */}
      {/* MODAL UTAMA DETAIL VILLA                                  */}
      {/* ========================================================= */}
      <div 
        className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="bg-white shadow-2xl border border-sand-200 relative overflow-hidden w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl max-h-[92dvh] sm:max-h-[90vh] overflow-y-auto">
          {/* Mobile handle bar */}
          <div className="w-10 h-1 rounded-full bg-sand-200 mx-auto mt-2.5 sm:hidden"></div>

          {/* Tombol Tutup Modal Detail */}
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white flex items-center justify-center font-bold backdrop-blur transition shadow-md"
          >
            <i className="fa-solid fa-xmark text-base"></i>
          </button>

          {/* Gallery Slider Rasio 1 : 1 (Square) */}
          <div 
            className="relative bg-brand-900 overflow-hidden select-none w-full aspect-square cursor-zoom-in group"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => openZoom(current)}
          >
            <div 
              className="flex h-full w-full transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {images.map((img, i) => (
                <div key={i} className="flex-shrink-0 w-full h-full aspect-square">
                  <img 
                    src={img} 
                    alt={`${villa.name} - Foto ${i + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" 
                  />
                </div>
              ))}
            </div>

            {/* Hint Klik untuk Perbesar (Zoom) */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="bg-slate-950/80 backdrop-blur text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                <i className="fa-solid fa-magnifying-glass-plus text-amber-300"></i> Klik untuk Zoom Layar Penuh
              </span>
            </div>

            {/* Tombol Panah Prev / Next */}
            <button 
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur transition z-20 shadow"
            >
              <i className="fa-solid fa-chevron-left text-sm"></i>
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur transition z-20 shadow"
            >
              <i className="fa-solid fa-chevron-right text-sm"></i>
            </button>

            {/* Indikator Titik (Dots) */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20 pointer-events-none">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-amber-400 w-5 shadow' : 'bg-white/50'}`}
                />
              ))}
            </div>

            {/* Counter & Badge Tipe */}
            <span className="absolute top-3 left-3 bg-slate-950/70 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur z-20 shadow flex items-center gap-1">
              <i className="fa-solid fa-images text-amber-300 text-[10px]"></i> {current + 1} / {images.length}
            </span>
            <span className="absolute top-3 right-14 bg-brand-900/90 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full z-20 shadow">
              {villa.category || 'Standard'}
            </span>

            {/* Tombol Zoom Icon Pojok Bawah */}
            <button
              onClick={(e) => { e.stopPropagation(); openZoom(current); }}
              className="absolute bottom-3 right-3 bg-slate-950/80 hover:bg-slate-950 text-white text-[10px] font-bold px-2.5 py-1 rounded-xl backdrop-blur z-20 flex items-center gap-1 transition shadow"
            >
              <i className="fa-solid fa-magnifying-glass-plus text-amber-300"></i> Zoom
            </button>
          </div>

          {/* Baris Thumbnail Mini Foto */}
          {images.length > 1 && (
            <div className="px-4 pt-3 flex gap-2 overflow-x-auto hide-scrollbar select-none bg-sand-50/50">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                    idx === current ? 'border-brand-900 scale-105 shadow-md' : 'border-sand-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

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
              <span className="text-xs text-sand-800 flex items-center gap-1 mt-1 font-medium">
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

      {/* ========================================================= */}
      {/* LIGHTBOX FULLSCREEN ZOOM POPUP MODAL                      */}
      {/* ========================================================= */}
      {zoomOpen && (
        <div 
          className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-md flex flex-col justify-between select-none animate-in fade-in duration-200"
          onClick={() => { setZoomOpen(false); setIsZoomedIn(false); }}
        >
          {/* Top Bar Zoom */}
          <div 
            className="p-4 flex items-center justify-between text-white z-20 bg-gradient-to-b from-black/80 to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h4 className="font-serif font-bold text-sm sm:text-base text-amber-200 truncate max-w-xs sm:max-w-md">
                {villa.name}
              </h4>
              <span className="text-xs text-sand-300">
                Foto {current + 1} dari {images.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Tombol Perbesar / Perkecil Toggle */}
              <button
                onClick={() => setIsZoomedIn(!isZoomedIn)}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5"
                title="Perbesar / Perkecil"
              >
                <i className={`fa-solid ${isZoomedIn ? 'fa-magnifying-glass-minus text-amber-400' : 'fa-magnifying-glass-plus'}`}></i>
                <span className="hidden sm:inline">{isZoomedIn ? 'Normal' : 'Perbesar 1.5x'}</span>
              </button>

              {/* Tombol Tutup Zoom */}
              <button
                onClick={() => { setZoomOpen(false); setIsZoomedIn(false); }}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold transition"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
          </div>

          {/* Area Foto Tengah (Zoom & Swipe) */}
          <div 
            className="flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden relative"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Tombol Panah Prev (Kiri) */}
            <button
              onClick={handlePrev}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center backdrop-blur transition z-20 shadow-xl"
            >
              <i className="fa-solid fa-chevron-left text-lg"></i>
            </button>

            {/* Container Foto */}
            <div 
              className="relative max-w-full max-h-[75vh] sm:max-h-[82vh] overflow-auto flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[current]}
                alt={`Zoom Foto ${current + 1}`}
                onClick={() => setIsZoomedIn(!isZoomedIn)}
                className={`max-w-full max-h-[75vh] sm:max-h-[82vh] object-contain rounded-2xl shadow-2xl transition-transform duration-300 cursor-pointer ${
                  isZoomedIn ? 'scale-150 sm:scale-175 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
                }`}
              />
            </div>

            {/* Tombol Panah Next (Kanan) */}
            <button
              onClick={handleNext}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center backdrop-blur transition z-20 shadow-xl"
            >
              <i className="fa-solid fa-chevron-right text-lg"></i>
            </button>
          </div>

          {/* Bottom Bar: Thumbnail Jump & Hint */}
          <div 
            className="p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20 space-y-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Thumbnail Strip */}
            <div className="flex justify-center gap-2 overflow-x-auto hide-scrollbar py-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrent(i); setIsZoomedIn(false); }}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                    i === current ? 'border-amber-400 scale-110 shadow-lg' : 'border-white/20 opacity-50 hover:opacity-90'
                  }`}
                >
                  <img src={img} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <p className="text-center text-[11px] text-white/50 hidden sm:block">
              Klik gambar untuk memperbesar • Gunakan panah keyboard ← → atau klik luar untuk menutup
            </p>
          </div>
        </div>
      )}
    </>
  );
}
