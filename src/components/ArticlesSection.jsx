import React, { useState, useMemo } from 'react';

export default function ArticlesSection({ articles = [], onSelectArticle, activeLocation = 'all' }) {
  if (!articles || articles.length === 0) return null;

  // Filter Tab Lokasi Artikel: 'all' | 'Tawangmangu' | 'Yogyakarta'
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Helper normalisasi lokasi artikel
  const getArticleLocation = (art) => {
    if (art.location) return art.location;
    const text = `${art.title || ''} ${(art.tags || []).join(' ')} ${art.content || ''}`.toLowerCase();
    if (text.includes('jogja') || text.includes('yogyakarta') || text.includes('kaliurang') || text.includes('merapi')) {
      return 'Yogyakarta';
    }
    return 'Tawangmangu';
  };

  // Hitung jumlah artikel per daerah
  const countTawangmangu = useMemo(() => {
    return articles.filter(a => {
      const loc = getArticleLocation(a).toLowerCase();
      return loc.includes('tawangmangu') || loc === 'semua lokasi';
    }).length;
  }, [articles]);

  const countJogja = useMemo(() => {
    return articles.filter(a => {
      const loc = getArticleLocation(a).toLowerCase();
      return loc.includes('yogyakarta') || loc.includes('jogja') || loc === 'semua lokasi';
    }).length;
  }, [articles]);

  // Filter artikel yang ditampilkan
  const filteredArticles = useMemo(() => {
    if (selectedLocation === 'all') return articles;
    return articles.filter(a => {
      const loc = getArticleLocation(a).toLowerCase();
      if (selectedLocation === 'Tawangmangu') {
        return loc.includes('tawangmangu') || loc === 'semua lokasi';
      }
      if (selectedLocation === 'Yogyakarta') {
        return loc.includes('yogyakarta') || loc.includes('jogja') || loc === 'semua lokasi';
      }
      return true;
    });
  }, [articles, selectedLocation]);

  return (
    <section id="artikel" className="py-16 sm:py-20 bg-sand-50 border-t border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-terracotta-600 block mb-1">
              INSPIRASI & INFORMASI WISATA
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-900 leading-tight">
              Artikel & Panduan Liburan Sekala
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-sand-800 max-w-md">
            Informasi pilihan seputar rekomendasi staycation dan tips liburan, dibagi berdasarkan destinasi tujuan.
          </p>
        </div>

        {/* TAB PILIHAN LOKASI / TEMPAT ARTIKEL */}
        <div className="flex flex-wrap items-center gap-2 mb-8 bg-white p-2 rounded-2xl border border-sand-200 shadow-xs">
          <span className="text-xs font-bold text-sand-500 px-2 hidden sm:inline">
            <i className="fa-solid fa-location-dot text-amber-500 mr-1"></i> Lokasi:
          </span>

          <button
            type="button"
            onClick={() => setSelectedLocation('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              selectedLocation === 'all'
                ? 'bg-amber-400 text-brand-950 font-black shadow-xs border border-amber-500'
                : 'text-sand-700 hover:bg-sand-100 hover:text-brand-900'
            }`}
          >
            <span>🗺️ Semua Destinasi</span>
            <span className={`text-[10px] px-1.5 rounded-full font-extrabold leading-5 ${
              selectedLocation === 'all' ? 'bg-brand-950 text-amber-300' : 'bg-sand-200 text-sand-700'
            }`}>
              {articles.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedLocation('Tawangmangu')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              selectedLocation === 'Tawangmangu'
                ? 'bg-amber-400 text-brand-950 font-black shadow-xs border border-amber-500'
                : 'text-sand-700 hover:bg-sand-100 hover:text-brand-900'
            }`}
          >
            <span className="inline-flex items-center gap-1.5"><i className="fa-solid fa-mountain-sun text-[11px]"></i> Tawangmangu</span>
            <span className={`text-[10px] px-1.5 rounded-full font-extrabold leading-5 ${
              selectedLocation === 'Tawangmangu' ? 'bg-brand-950 text-amber-300' : 'bg-sand-200 text-sand-700'
            }`}>
              {countTawangmangu}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedLocation('Yogyakarta')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              selectedLocation === 'Yogyakarta'
                ? 'bg-amber-400 text-brand-950 font-black shadow-xs border border-amber-500'
                : 'text-sand-700 hover:bg-sand-100 hover:text-brand-900'
            }`}
          >
            <span className="inline-flex items-center gap-1.5"><i className="fa-solid fa-landmark text-[11px]"></i> Yogyakarta</span>
            <span className={`text-[10px] px-1.5 rounded-full font-extrabold leading-5 ${
              selectedLocation === 'Yogyakarta' ? 'bg-brand-950 text-amber-300' : 'bg-sand-200 text-sand-700'
            }`}>
              {countJogja}
            </span>
          </button>
        </div>

        {/* JIKA TIDAK ADA ARTIKEL DI FILTER INI */}
        {filteredArticles.length === 0 && (
          <div className="bg-white rounded-3xl p-8 text-center border border-sand-200 max-w-md mx-auto my-6 space-y-3">
            <span className="text-3xl">📝</span>
            <h4 className="font-serif font-bold text-base text-brand-900">Belum Ada Artikel di Lokasi Ini</h4>
            <p className="text-xs text-sand-600">
              Artikel panduan untuk destinasi ini sedang disiapkan oleh tim editor Sekala Villa.
            </p>
            <button
              type="button"
              onClick={() => setSelectedLocation('all')}
              className="text-xs font-bold bg-amber-400 hover:bg-amber-300 text-brand-950 px-4 py-2 rounded-xl transition border border-amber-500"
            >
              Lihat Semua Artikel
            </button>
          </div>
        )}

        {/* GRID ARTIKEL */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArticles.map((art, index) => {
            const articleHref = `?article=${art.slug || art.id}`;
            const artLoc = getArticleLocation(art);
            const isJogja = artLoc.toLowerCase().includes('yogyakarta') || artLoc.toLowerCase().includes('jogja');

            return (
              <article 
                key={art.id}
                className="bg-white rounded-3xl p-6 border border-sand-200 shadow-sm hover:shadow-xl hover:border-brand-900/40 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="bg-brand-900 text-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                        {art.category || 'Panduan Wisata'}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                        isJogja 
                          ? 'bg-sky-50 text-sky-800 border-sky-300' 
                          : 'bg-amber-50 text-amber-900 border-amber-300'
                      }`}>
                        <i className={`fa-solid ${isJogja ? 'fa-landmark' : 'fa-mountain-sun'} text-[9px]`}></i>
                        {isJogja ? 'Yogyakarta' : 'Tawangmangu'}
                      </span>
                    </div>
                    <span className="w-8 h-8 rounded-2xl bg-sand-100 text-brand-900 flex items-center justify-center font-serif font-black text-xs border border-sand-200 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors shadow-xs shrink-0">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-sand-500 font-semibold mb-3">
                    <span><i className="fa-regular fa-calendar text-brand-700 mr-1"></i>{art.date || 'Terbaru'}</span>
                    <span>•</span>
                    <span><i className="fa-regular fa-user text-brand-700 mr-1"></i>{art.author || 'Sekala'}</span>
                    {art.readingTime && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold"><i className="fa-regular fa-clock mr-1"></i>{art.readingTime}</span>
                      </>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-lg sm:text-xl text-brand-900 leading-snug mb-3">
                    <a 
                      href={articleHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group-hover:text-terracotta-600 transition-colors hover:underline"
                      title={art.title}
                    >
                      {art.title}
                    </a>
                  </h3>

                  <p className="text-xs sm:text-sm text-sand-800 leading-relaxed line-clamp-4 mb-4">
                    {art.summary}
                  </p>

                  {art.tags && art.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {art.tags.slice(0, 3).map((tag, tIdx) => (
                        <span key={tIdx} className="bg-sand-50 text-sand-700 text-[10px] font-semibold px-2.5 py-0.5 rounded-lg border border-sand-200">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-sand-100 flex items-center justify-between text-xs font-bold text-brand-900 group-hover:text-terracotta-600 transition-colors">
                  <a 
                    href={articleHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full justify-between hover:underline"
                  >
                    <span className="flex items-center gap-1.5">
                      <i className="fa-solid fa-arrow-up-right-from-square text-[11px] text-terracotta-600"></i>
                      <span>Buka Artikel (Tab Baru)</span>
                    </span>
                    <i className="fa-solid fa-arrow-right text-[11px] group-hover:translate-x-1.5 transition-transform"></i>
                  </a>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
