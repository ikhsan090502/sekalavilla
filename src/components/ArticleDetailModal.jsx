import React, { useEffect } from 'react';

export default function ArticleDetailModal({ article, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!article) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white shadow-2xl border border-sand-200 relative w-full sm:max-w-3xl rounded-t-3xl sm:rounded-3xl h-[92dvh] sm:h-[88vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Tombol Tutup */}
        <button 
          onClick={onClose}
          aria-label="Tutup Artikel"
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white flex items-center justify-center font-bold backdrop-blur transition shadow-md"
        >
          <i className="fa-solid fa-xmark text-base"></i>
        </button>

        {/* Scrollable Article Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Header Image */}
          <div className="relative aspect-[16/9] w-full bg-sand-200 overflow-hidden">
            <img 
              src={article.image} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30"></div>
            
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white space-y-2">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow inline-block">
                {article.category || 'Artikel'}
              </span>
              <h1 className="font-serif text-xl sm:text-3xl font-bold leading-tight text-white drop-shadow">
                {article.title}
              </h1>
              <div className="flex items-center gap-3 text-xs text-sand-200 font-medium">
                <span><i className="fa-regular fa-calendar mr-1 text-amber-300"></i>{article.date || 'Terbaru'}</span>
                <span>•</span>
                <span><i className="fa-regular fa-user mr-1 text-amber-300"></i>Oleh: {article.author || 'Sekala'}</span>
              </div>
            </div>
          </div>

          {/* Article Text Content */}
          <div className="p-5 sm:p-8 space-y-6 max-w-2xl mx-auto">
            {article.summary && (
              <div className="p-4 rounded-2xl bg-amber-50 border-l-4 border-amber-400 text-xs sm:text-sm font-medium text-sand-900 leading-relaxed italic">
                "{article.summary}"
              </div>
            )}

            <div className="text-xs sm:text-sm text-sand-800 leading-relaxed space-y-4 whitespace-pre-line font-normal">
              {article.content}
            </div>

            {/* Banner Penutup / CTA */}
            <div className="mt-8 pt-6 border-t border-sand-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-sand-50 p-5 rounded-2xl">
              <div>
                <strong className="block text-sm text-brand-900">Rencanakan Liburan Anda Sekarang!</strong>
                <span className="text-xs text-sand-600">Pilih villa atau glamping idaman bersama Sekala Villa.</span>
              </div>
              <button
                onClick={onClose}
                className="bg-brand-900 hover:bg-brand-800 text-amber-300 text-xs font-bold px-5 py-2.5 rounded-xl transition shadow"
              >
                Lihat Katalog Unit
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
