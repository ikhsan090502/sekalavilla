import React from 'react';

export default function ArticlesSection({ articles = [], onSelectArticle }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section id="artikel" className="py-16 sm:py-20 bg-sand-50 border-t border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-terracotta-600 block mb-1">
              INSPIRASI & INFORMASI WISATA
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-900 leading-tight">
              Artikel & Panduan Liburan Sekala
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-sand-800 max-w-md">
            Informasi pilihan seputar rekomendasi staycation, jalur wisata pegunungan, dan tips liburan nyaman di Tawangmangu & Jogja.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art, index) => {
            const articleHref = `?article=${art.slug || art.id}`;

            return (
              <article 
                key={art.id}
                className="bg-white rounded-3xl overflow-hidden border border-sand-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative"
              >
                {/* Nomor Urut 1, 2, 3 di pojok */}
                <div className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-slate-950/80 backdrop-blur text-amber-300 flex items-center justify-center font-serif font-black text-xs shadow-md border border-white/20">
                  {index + 1}
                </div>

                {/* Gambar Cover Artikel - Buka di tab baru */}
                <a 
                  href={articleHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-[16/10] overflow-hidden bg-sand-200 block"
                >
                  <img 
                    src={art.image} 
                    alt={art.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-brand-900/90 backdrop-blur text-amber-300 text-[10px] font-extrabold px-3 py-1 rounded-full shadow">
                    {art.category || 'Wisata'}
                  </span>
                </a>

                {/* Konten Ringkas Artikel */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-sand-500 font-semibold">
                      <span><i className="fa-regular fa-calendar text-brand-700 mr-1"></i>{art.date || 'Terbaru'}</span>
                      <span>•</span>
                      <span><i className="fa-regular fa-user text-brand-700 mr-1"></i>{art.author || 'Sekala'}</span>
                    </div>

                    {/* Judul Artikel: Link yang ketika diklik membuka tab baru */}
                    <h3 className="font-serif font-bold text-base sm:text-lg text-brand-900 leading-snug">
                      <a 
                        href={articleHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group-hover:text-terracotta-600 transition-colors line-clamp-2 hover:underline"
                        title={art.title}
                      >
                        {art.title}
                      </a>
                    </h3>

                    <p className="text-xs text-sand-800 leading-relaxed line-clamp-3">
                      {art.summary}
                    </p>
                  </div>

                  {/* Tombol Baca Selengkapnya - Buka di tab baru */}
                  <div className="pt-3 border-t border-sand-100 flex items-center justify-between text-xs font-bold text-brand-900 group-hover:text-terracotta-600 transition-colors">
                    <a 
                      href={articleHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 w-full justify-between hover:underline"
                    >
                      <span className="flex items-center gap-1.5">
                        <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                        <span>Buka Artikel (Tab Baru)</span>
                      </span>
                      <i className="fa-solid fa-arrow-right text-[11px] group-hover:translate-x-1 transition-transform"></i>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
