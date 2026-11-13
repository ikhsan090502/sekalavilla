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

        {/* Tampilan Post SEO: Murni Judul, Nomor Urut, Kategori, Metadata & Ringkasan Teks (Tanpa Gambar / Thumbnail) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((art, index) => {
            const articleHref = `?article=${art.slug || art.id}`;

            return (
              <article 
                key={art.id}
                className="bg-white rounded-3xl p-6 border border-sand-200 shadow-sm hover:shadow-xl hover:border-brand-900/40 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Header Kartu: Kategori & Nomor Urut */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="bg-brand-900 text-amber-300 text-[10px] font-extrabold px-3 py-1 rounded-full shadow-xs uppercase tracking-wider">
                      {art.category || 'Panduan Wisata'}
                    </span>
                    <span className="w-8 h-8 rounded-2xl bg-sand-100 text-brand-900 flex items-center justify-center font-serif font-black text-xs border border-sand-200 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors shadow-xs">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Metadata Tanggal, Penulis & Waktu Baca */}
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

                  {/* Judul Artikel SEO: Link membuka di tab baru */}
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

                  {/* Ringkasan Konten Teks */}
                  <p className="text-xs sm:text-sm text-sand-800 leading-relaxed line-clamp-4 mb-4">
                    {art.summary}
                  </p>

                  {/* Tag SEO jika tersedia */}
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

                {/* Footer Kartu: Tombol Baca Buka Tab Baru */}
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
