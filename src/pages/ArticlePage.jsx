import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';

export default function ArticlePage({ article, settings, onBack, onNavigateHome }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const originalTitle = document.title;
    if (article?.metaTitle || article?.title) {
      document.title = `${article.metaTitle || article.title} | Sekala Villa`;
    }

    // JSON-LD Structured Data SEO
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'article-structured-data';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": article?.title,
      "description": article?.metaDesc || article?.summary,
      "image": [article?.image],
      "datePublished": article?.date,
      "author": {
        "@type": "Person",
        "name": article?.author || "Sekala Villa Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Sekala Villa",
        "logo": {
          "@type": "ImageObject",
          "url": "https://sekalavilla.com/logo.png"
        }
      },
      "keywords": article?.focusKeyword || ""
    });
    document.head.appendChild(script);

    return () => {
      document.title = originalTitle;
      const el = document.getElementById('article-structured-data');
      if (el) el.remove();
    };
  }, [article]);

  if (!article) return null;

  return (
    <div className="min-h-screen bg-sand-50 text-sand-900 font-sans flex flex-col justify-between">
      <Header settings={settings} onHomeClick={onNavigateHome} />

      <main className="py-8 sm:py-12 flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between pb-6 border-b border-sand-200 mb-8">
            <div className="flex items-center gap-2 text-xs font-semibold text-sand-800">
              <button 
                onClick={onBack} 
                className="hover:text-brand-900 flex items-center gap-1.5 font-bold text-brand-900 bg-sand-100 hover:bg-sand-200 px-3 py-1.5 rounded-xl border border-sand-200 transition"
              >
                <i className="fa-solid fa-arrow-left"></i> Kembali ke Beranda
              </button>
              <span className="text-sand-400">/</span>
              <span className="text-terracotta-600 font-bold">{article.category || 'Artikel'}</span>
            </div>

            {article.readingTime && (
              <span className="bg-amber-400 text-slate-950 font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                <i className="fa-regular fa-clock mr-1"></i>{article.readingTime}
              </span>
            )}
          </div>

          {/* Article Header Card */}
          <header className="space-y-4 mb-8">
            <span className="bg-brand-900 text-amber-300 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              {article.category || 'Panduan Wisata'}
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-brand-900 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-3 text-xs text-sand-600 font-semibold border-b border-sand-200 pb-4">
              <span><i className="fa-regular fa-calendar text-brand-700 mr-1.5"></i>{article.date || 'Terbaru'}</span>
              <span>•</span>
              <span><i className="fa-regular fa-user text-brand-700 mr-1.5"></i>Penulis: {article.author || 'Admin Sekala'}</span>
            </div>
          </header>

          {/* Main Cover Image (Hanya tampil jika ada gambar) */}
          {article.image && (
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-xl mb-8 border border-sand-200 bg-sand-200">
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Body Content */}
          <article className="space-y-6 max-w-3xl mx-auto">
            {article.summary && (
              <div className="p-5 sm:p-6 rounded-3xl bg-amber-50/80 border-l-4 border-amber-400 text-xs sm:text-sm font-medium text-sand-900 leading-relaxed italic shadow-xs">
                "{article.summary}"
              </div>
            )}

            <div className="text-xs sm:text-base text-sand-800 leading-relaxed space-y-5 whitespace-pre-line font-normal">
              {article.content}
            </div>

            {/* Tags SEO / Topik Terkait */}
            {article.tags && article.tags.length > 0 && (
              <div className="pt-6 border-t border-sand-200">
                <span className="text-[10px] uppercase font-extrabold text-sand-500 tracking-wider block mb-2.5">
                  <i className="fa-solid fa-tags text-emerald-600 mr-1.5"></i>
                  Topik & Tag Terkait:
                </span>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, idx) => (
                    <span key={idx} className="bg-sand-100 hover:bg-sand-200 text-sand-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-sand-200 transition">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action Box: Booking Villa */}
            <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-brand-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2 text-center sm:text-left">
                <span className="bg-amber-400 text-slate-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                  SEKALA VILLA EXPERIENCE
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-amber-50">
                  Rencanakan Liburan Seru Anda Sekarang
                </h3>
                <p className="text-xs sm:text-sm text-sand-200 max-w-md">
                  Pilih villa private pool di lereng Gunung Lawu atau glamping syahdu Kaliurang Jogja dengan fasilitas lengkap.
                </p>
              </div>
              <button
                onClick={onNavigateHome}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg transition shrink-0 flex items-center gap-2"
              >
                <i className="fa-solid fa-house-chimney"></i>
                <span>Cek Katalog Unit</span>
              </button>
            </div>

          </article>

        </div>
      </main>

      <Footer />
      <MobileBottomNav settings={settings} />
    </div>
  );
}
