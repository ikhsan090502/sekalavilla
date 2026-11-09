import React, { useState, useEffect, useRef } from 'react';

export default function BannerSlider({ banners = [], onFilterLocation }) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleNext = () => {
    if (!banners.length) return;
    setCurrent((current + 1) % banners.length);
  };

  const handlePrev = () => {
    if (!banners.length) return;
    setCurrent((current - 1 + banners.length) % banners.length);
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

  if (!banners.length) return null;

  return (
    <section id="promo-banner" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div 
        className="relative rounded-3xl overflow-hidden bg-brand-900 text-white min-h-[360px] sm:min-h-[440px] shadow-2xl select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slider Track */}
        <div 
          className="flex h-full min-h-[360px] sm:min-h-[440px] transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {banners.map((b, idx) => (
            <div 
              key={b.id || idx}
              className={`flex-shrink-0 w-full h-full min-h-[360px] sm:min-h-[440px] relative overflow-hidden ${b.hasText ? 'flex items-center p-6 sm:p-12' : ''}`}
            >
              {b.hasText ? (
                <>
                  <img src={b.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" alt={b.title || 'Banner'} />
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-900/90 via-brand-900/50 to-transparent"></div>
                  <div className="relative z-10 max-w-xl space-y-4">
                    {b.badge && (
                      <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                        <i className="fa-solid fa-fire text-amber-800"></i> {b.badge}
                      </div>
                    )}
                    <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-amber-50 leading-tight">
                      {b.title}
                    </h1>
                    <p className="text-sand-200 text-xs sm:text-sm leading-relaxed">
                      {b.subtitle}
                    </p>
                    <div className="pt-2 flex flex-wrap gap-3">
                      {b.btnText && (
                        <a 
                          href={b.btnLink || '#katalog'} 
                          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs px-5 py-3 rounded-xl transition shadow flex items-center gap-2"
                        >
                          <span>{b.btnText}</span> <i className="fa-solid fa-arrow-right text-[11px]"></i>
                        </a>
                      )}
                      <button 
                        onClick={() => onFilterLocation?.('Tawangmangu')}
                        className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-3 rounded-xl backdrop-blur transition border border-white/20"
                      >
                        Tawangmangu
                      </button>
                      <button 
                        onClick={() => onFilterLocation?.('Yogyakarta')}
                        className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-3 rounded-xl backdrop-blur transition border border-white/20"
                      >
                        Jogja
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <img src={b.imageUrl} className="w-full h-full object-cover" alt="Banner Promo" />
              )}
            </div>
          ))}
        </div>

        {/* Prev / Next Arrows */}
        <button 
          onClick={handlePrev} 
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/50 hover:bg-slate-950/80 text-white flex items-center justify-center backdrop-blur transition z-20 shadow-md"
        >
          <i className="fa-solid fa-chevron-left text-sm"></i>
        </button>
        <button 
          onClick={handleNext} 
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/50 hover:bg-slate-950/80 text-white flex items-center justify-center backdrop-blur transition z-20 shadow-md"
        >
          <i className="fa-solid fa-chevron-right text-sm"></i>
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${i === current ? 'w-7 bg-amber-400' : 'w-2.5 bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
