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
      .replace(/{property_type}/g, villa.propertyType === 'glamping' ? 'Glamping' : 'Villa')
      .replace(/{category}/g, villa.category || 'Standard')
      .replace(/{location}/g, villa.location)
      .replace(/{capacity}/g, villa.capacity)
      .replace(/{price_start}/g, formatRupiah(villa.price))
      .replace(/{facilities}/g, (villa.features || []).join(', '));

    // Prioritas nomor:
    // 1. Nomor khusus unit villa jika ada (villa.whatsapp)
    // 2. Nomor daerah (Tawangmangu vs Yogyakarta)
    // 3. Nomor utama (settings.whatsappPhone)
    let phone = villa.whatsapp;
    if (!phone || phone.trim() === '') {
      const loc = (villa.location || '').toLowerCase();
      if (loc.includes('tawangmangu')) {
        phone = settings?.whatsappTawangmangu || settings?.whatsappPhone || '6281381669735';
      } else if (loc.includes('jogja') || loc.includes('yogyakarta')) {
        phone = settings?.whatsappJogja || settings?.whatsappPhone || '6281381669735';
      } else {
        phone = settings?.whatsappPhone || '6281381669735';
      }
    }

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <>
      {/* ========================================================= */}
      {/* MODAL UTAMA DETAIL VILLA                                  */}
      {/* ========================================================= */}
      <div 
        className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden animate-in fade-in duration-200"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="bg-white shadow-2xl border border-sand-200 relative w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl h-[92dvh] sm:h-[88vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          
          {/* Mobile Drag Indicator */}
          <div className="w-12 h-1.5 rounded-full bg-sand-300 mx-auto mt-2.5 mb-1 sm:hidden shrink-0"></div>

          {/* Tombol Tutup Modal Detail */}
          <button 
            onClick={onClose}
            aria-label="Tutup Detail"
            className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white flex items-center justify-center font-bold backdrop-blur transition shadow-md"
          >
            <i className="fa-solid fa-xmark text-base"></i>
          </button>

          {/* AREA TENGAH: SCROLLABLE BODY (Foto, Gallery, Deskripsi & Fasilitas) */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {/* Gallery Slider Rasio 16 : 10 atau Square */}
            <div 
              className="relative bg-brand-950 overflow-hidden select-none w-full aspect-[4/3] sm:aspect-[16/10] cursor-zoom-in group"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onClick={() => openZoom(current)}
            >
              <div 
                className="flex h-full w-full transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
              >
                {images.map((img, i) => (
                  <div key={i} className="flex-shrink-0 w-full h-full">
                    <img 
                      src={img} 
                      alt={`${villa.name} - Foto ${i + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" 
                    />
                  </div>
                ))}
              </div>

              {/* Hint Klik untuk Zoom */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="bg-slate-950/80 backdrop-blur text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                  <i className="fa-solid fa-magnifying-glass-plus text-amber-300"></i> Klik untuk Perbesar Foto
                </span>
              </div>

              {/* Tombol Panah Prev / Next */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={handlePrev}
                    aria-label="Foto Sebelumnya"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur transition z-20 shadow"
                  >
                    <i className="fa-solid fa-chevron-left text-sm"></i>
                  </button>
                  <button 
                    onClick={handleNext}
                    aria-label="Foto Selanjutnya"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur transition z-20 shadow"
                  >
                    <i className="fa-solid fa-chevron-right text-sm"></i>
                  </button>
                </>
              )}

              {/* Indikator Titik (Dots) */}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20 pointer-events-none">
                  {images.map((_, i) => (
                    <span
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-amber-400 w-5 shadow' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              )}

              {/* Counter & Badge Tipe */}
              <span className="absolute top-3 left-3 bg-slate-950/70 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur z-20 shadow flex items-center gap-1.5">
                <i className="fa-solid fa-images text-amber-300 text-[10px]"></i> {current + 1} / {images.length}
              </span>
              <span className="absolute top-3 right-14 bg-brand-900/90 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full z-20 shadow">
                {villa.category || 'Standard'}
              </span>

              {/* Tombol Zoom Icon Pojok Bawah */}
              <button
                onClick={(e) => { e.stopPropagation(); openZoom(current); }}
                className="absolute bottom-3 right-3 bg-slate-950/80 hover:bg-slate-950 text-white text-[10px] font-bold px-2.5 py-1 rounded-xl backdrop-blur z-20 flex items-center gap-1.5 transition shadow"
              >
                <i className="fa-solid fa-magnifying-glass-plus text-amber-300"></i> Zoom
              </button>
            </div>

            {/* Baris Thumbnail Mini Foto */}
            {images.length > 1 && (
              <div className="px-4 py-2.5 flex gap-2 overflow-x-auto hide-scrollbar select-none bg-sand-100/60 border-b border-sand-200">
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

            {/* Detail Deskripsi, Fasilitas, dan Informasi Unit */}
            <div className="p-4 sm:p-6 space-y-5">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-900 leading-snug">
                    {villa.name}
                  </h3>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-800 shrink-0 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-xl">
                    <i className="fa-solid fa-star text-amber-500"></i> {villa.rating || 4.8}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-sand-800 font-medium">
                  <span className="flex items-center gap-1">
                    <i className="fa-solid fa-location-dot text-emerald-600"></i> {villa.location}
                  </span>
                  <span className="text-sand-300">•</span>
                  <span className="capitalize text-sand-700">
                    Tipe: <strong>{villa.propertyType === 'glamping' ? 'Glamping' : 'Villa'}</strong>
                  </span>
                </div>
              </div>

              {/* Ringkasan Kapasitas & Kamar */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-sand-50 rounded-2xl p-3 flex items-center gap-3 border border-sand-200">
                  <div className="w-9 h-9 rounded-xl bg-sand-200/80 flex items-center justify-center text-brand-800 shrink-0">
                    <i className="fa-solid fa-users text-base"></i>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-sand-500 block">Kapasitas</span>
                    <strong className="text-sm text-sand-900">{villa.capacity} Orang</strong>
                  </div>
                </div>
                <div className="bg-sand-50 rounded-2xl p-3 flex items-center gap-3 border border-sand-200">
                  <div className="w-9 h-9 rounded-xl bg-sand-200/80 flex items-center justify-center text-brand-800 shrink-0">
                    <i className="fa-solid fa-bed text-base"></i>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-sand-500 block">Kamar Tidur</span>
                    <strong className="text-sm text-sand-900">{villa.bedrooms || 1} Kamar</strong>
                  </div>
                </div>
              </div>

              {/* Deskripsi Lengkap */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-extrabold text-sand-500 tracking-wider block">
                  Deskripsi Lengkap Unit
                </span>
                <p className="text-xs sm:text-sm text-sand-800 leading-relaxed whitespace-pre-line bg-sand-50/60 p-3.5 rounded-2xl border border-sand-200">
                  {villa.desc || 'Unit akomodasi terbaik dengan pemandangan asri, udara sejuk pegunungan, serta fasilitas privat siap huni untuk liburan bersama keluarga maupun sahabat.'}
                </p>
              </div>

              {/* Fasilitas Unit */}
              <div>
                <span className="text-[10px] uppercase font-extrabold text-sand-500 tracking-wider block mb-2">
                  Fasilitas & Keunggulan Tersedia:
                </span>
                <div className="flex flex-wrap gap-2">
                  {(villa.features || []).map((f, i) => (
                    <span 
                      key={i} 
                      className="bg-brand-50 text-brand-900 border border-brand-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                    >
                      <i className="fa-solid fa-circle-check text-emerald-600 text-xs"></i> 
                      <span>{f}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Jaminan Layanan Sekala */}
              <div className="bg-sand-100/70 border border-sand-200 rounded-2xl p-3.5 flex items-center gap-3 text-xs text-sand-800">
                <i className="fa-solid fa-shield-halved text-emerald-600 text-xl shrink-0"></i>
                <div className="leading-snug">
                  <strong className="block text-brand-900 text-xs">Garansi Booking Aman & Unit Terverifikasi</strong>
                  <span className="text-[11px] text-sand-600">Admin standby siap bantu reservasi, tanya tanggal kosong, serta custom paket BBQ.</span>
                </div>
              </div>
            </div>
          </div>

          {/* AREA BAWAH PERMANEN (STICKY BOTTOM BAR): HARGA & TOMBOL WA TIDAK PERLU DISCROLL */}
          <div className="shrink-0 bg-white border-t border-sand-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 shadow-[0_-8px_20px_rgba(0,0,0,0.08)] z-30">
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-extrabold text-sand-500 tracking-wider block">
                Mulai Dari / Malam
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-2xl font-black text-brand-900 tracking-tight truncate">
                  {formatRupiah(villa.price)}
                </span>
                <span className="text-[11px] font-semibold text-sand-500">/ malam</span>
              </div>
            </div>

            <button 
              onClick={handleDirectWA}
              className="bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs sm:text-sm px-5 sm:px-7 py-3 sm:py-3.5 rounded-2xl shadow-lg hover:shadow-emerald-700/30 transition-all flex items-center gap-2 shrink-0"
            >
              <i className="fa-brands fa-whatsapp text-lg text-emerald-200"></i>
              <span>Pesan via WA</span>
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
              <button
                onClick={() => setIsZoomedIn(!isZoomedIn)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                title={isZoomedIn ? 'Zoom Out' : 'Zoom In'}
              >
                <i className={`fa-solid ${isZoomedIn ? 'fa-magnifying-glass-minus' : 'fa-magnifying-glass-plus'} text-sm`}></i>
              </button>
              <button
                onClick={() => { setZoomOpen(false); setIsZoomedIn(false); }}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                title="Tutup (Esc)"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
          </div>

          {/* Tengah: Foto Fullscreen dengan Panah & Zoom */}
          <div 
            className="relative flex-1 flex items-center justify-center overflow-hidden p-2 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur transition"
                >
                  <i className="fa-solid fa-chevron-left text-lg"></i>
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur transition"
                >
                  <i className="fa-solid fa-chevron-right text-lg"></i>
                </button>
              </>
            )}

            <img
              src={images[current]}
              alt={`${villa.name} Fullscreen Zoom`}
              onClick={() => setIsZoomedIn(!isZoomedIn)}
              className={`max-h-full max-w-full object-contain transition-transform duration-300 cursor-pointer ${
                isZoomedIn ? 'scale-150 sm:scale-[2]' : 'scale-100'
              }`}
            />
          </div>

          {/* Bottom Bar: Thumbnails di Zoom */}
          <div 
            className="p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-2 overflow-x-auto hide-scrollbar z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => { setCurrent(i); setIsZoomedIn(false); }}
                className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                  i === current ? 'border-amber-400 scale-110 shadow-lg' : 'border-white/30 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumb Zoom ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
