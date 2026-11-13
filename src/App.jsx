import React, { useState, useEffect } from 'react';
import { villaApi } from './services/api';
import { storage } from './services/storage';
import Header from './components/Header';
import BannerSlider from './components/BannerSlider';
import SearchFilter from './components/SearchFilter';
import VillaCard from './components/VillaCard';
import VillaDetailModal from './components/VillaDetailModal';
import AddonsSection from './components/AddonsSection';
import ArticlesSection from './components/ArticlesSection';
import ArticleDetailModal from './components/ArticleDetailModal';
import PromoModal from './components/PromoModal';
import MobileBottomNav from './components/MobileBottomNav';
import Footer from './components/Footer';
import AdminDashboard from './pages/AdminDashboard';
import RegionCatalogPage from './pages/RegionCatalogPage';
import ArticlePage from './pages/ArticlePage';
import LandingGateway from './pages/LandingGateway';

export default function App() {
  const checkIsAdminURL = () => {
    return (
      window.location.hash === '#admin' ||
      window.location.search.includes('admin') ||
      window.location.pathname.endsWith('/admin')
    );
  };

  const getArticleSlugFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('article');
  };

  const checkHasEnteredSite = () => {
    // Lewati hanya jika membuka halaman admin atau artikel spesifik
    if (checkIsAdminURL() || getArticleSlugFromURL()) return true;
    return false; // Selalu tampilkan landing gateway terlebih dahulu saat masuk
  };

  const [view, setView] = useState(checkIsAdminURL() ? 'admin' : 'site');
  const [showLandingGateway, setShowLandingGateway] = useState(!checkHasEnteredSite());
  const [currentArticleSlug, setCurrentArticleSlug] = useState(getArticleSlugFromURL());
  // State Halaman Daerah (New Page): { active: boolean, regionId: 'tawangmangu' }
  const [regionPage, setRegionPage] = useState({
    active: false,
    regionId: 'tawangmangu'
  });

  const [banners, setBanners] = useState(storage.getBanners());
  const [villas, setVillas] = useState([]);
  const [regions, setRegions] = useState(storage.getRegions());
  const [articles, setArticles] = useState(storage.getArticles());
  const [loadingVillas, setLoadingVillas] = useState(true);
  const [settings, setSettings] = useState(storage.getSettings());

  const [selectedVilla, setSelectedVilla] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [promoOpen, setPromoOpen] = useState(false);

  const [filters, setFilters] = useState({
    propertyType: 'all', // 'all' | 'villa' | 'glamping'
    location: 'all',
    category: 'all',
    capacity: 0,
    bedrooms: 0,
    minPrice: 0,
    budget: 5000000,
    facilities: [], // multi-select fasilitas
    search: ''
  });

  // Listener URL Routing (#admin, ?article=slug)
  useEffect(() => {
    const handleUrlChange = () => {
      const artSlug = getArticleSlugFromURL();
      setCurrentArticleSlug(artSlug);

      if (checkIsAdminURL()) {
        setView('admin');
        setRegionPage(prev => ({ ...prev, active: false }));
      } else {
        setView('site');
      }
    };
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Fetch Banners, Settings, Regions di awal
  useEffect(() => {
    async function loadMeta() {
      try {
        const [b, s] = await Promise.all([
          villaApi.getBanners(),
          villaApi.getSettings()
        ]);
        if (b && b.length) setBanners(b);
        if (s) setSettings(s);
        setRegions(storage.getRegions());
      } catch (err) {
        console.error('Error loading meta:', err);
      }
    }
    loadMeta();
  }, []);

  // Fetch Data Unit setiap kali Filter berubah
  useEffect(() => {
    let isMounted = true;
    async function loadVillas() {
      setLoadingVillas(true);
      try {
        const data = await villaApi.getVillas(filters);
        if (isMounted) setVillas(data);
      } catch (err) {
        console.error('Error loading villas from API:', err);
      } finally {
        if (isMounted) setLoadingVillas(false);
      }
    }

    loadVillas();
    return () => { isMounted = false; };
  }, [filters]);

  const reloadData = async () => {
    setLoadingVillas(true);
    const data = await villaApi.getVillas(filters);
    setVillas(data);
    setBanners(storage.getBanners());
    setSettings(storage.getSettings());
    setRegions(storage.getRegions());
    setArticles(storage.getArticles());
    setLoadingVillas(false);
  };

  // Popup promo muncul otomatis jika diaktifkan di settings
  useEffect(() => {
    const s = storage.getSettings();
    if (s.promoEnabled !== false) {
      const timer = setTimeout(() => {
        setPromoOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleResetFilters = () => {
    setFilters({
      propertyType: 'all',
      location: 'all',
      category: 'all',
      capacity: 0,
      bedrooms: 0,
      minPrice: 0,
      budget: 5000000,
      facilities: [],
      search: ''
    });
  };

  const handleFilterLocation = (loc) => {
    handleResetFilters();
    setFilters(prev => ({ ...prev, location: loc }));
    document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBackToSite = () => {
    if (window.location.hash === '#admin') {
      window.location.hash = '';
    } else if (window.location.search.includes('admin')) {
      window.history.pushState(null, '', window.location.pathname);
    }
    setView('site');
    setRegionPage(prev => ({ ...prev, active: false }));
  };

  // BUKA HALAMAN BARU BERDASARKAN DAERAH (Langsung menampilkan Villa & Glamping)
  const handleOpenRegionPage = (regionId) => {
    setRegionPage({
      active: true,
      regionId
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseRegionPage = () => {
    setRegionPage(prev => ({ ...prev, active: false }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter unit yang tampil di homepage
  const displayVillas = villas.filter(v => {
    // 1. Search text
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      const matchName = (v.name || '').toLowerCase().includes(q);
      const matchDesc = (v.desc || '').toLowerCase().includes(q);
      const matchLoc = (v.location || '').toLowerCase().includes(q);
      const matchFeat = (v.features || []).some(f => f.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchLoc && !matchFeat) return false;
    }
    // 2. Property type
    if (filters.propertyType !== 'all') {
      const pType = (v.propertyType || 'villa').toLowerCase();
      if (pType !== filters.propertyType.toLowerCase()) return false;
    }
    // 3. Location
    if (filters.location !== 'all') {
      const loc = (v.location || '').toLowerCase();
      if (!loc.includes(filters.location.toLowerCase())) return false;
    }
    // 4. Category
    if (filters.category && filters.category !== 'all') {
      if ((v.category || 'Standard') !== filters.category) return false;
    }
    // 5. Capacity (berapa orang)
    if (filters.capacity && filters.capacity > 0) {
      if ((v.capacity || 0) < filters.capacity) return false;
    }
    // 5B. Bedrooms (berapa kamar)
    if (filters.bedrooms && filters.bedrooms > 0) {
      if ((v.bedrooms || 1) < filters.bedrooms) return false;
    }
    // 6. Range Harga: Fleksibel dengan toleransi harga mendekati (±15% atau 150rb)
    // Jika tamu mencari minPrice (misal 1jt), unit yang harganya mendekati (misal 850rb - 900rb) tetap dimasukkan
    if (filters.minPrice && filters.minPrice > 0) {
      const minTolerance = Math.min(filters.minPrice * 0.15, 200000); // toleransi 15% atau maks 200rb
      const effectiveMin = Math.max(0, filters.minPrice - minTolerance);
      if ((v.price || 0) < effectiveMin) return false;
    }
    // Jika tamu mencari batas maksimal budget (misal 1jt), unit yang sedikit di atasnya (misal 1.1jt) atau di bawahnya tetap masuk
    if (filters.budget && filters.budget > 0) {
      const maxTolerance = Math.min(filters.budget * 0.15, 250000); // toleransi 15% atau maks 250rb
      const effectiveMax = filters.budget + maxTolerance;
      if ((v.price || 0) > effectiveMax) return false;
    }
    // 7. Multi-select Facilities (Bisa pilih banyak fasilitas sekaligus)
    if (filters.facilities && Array.isArray(filters.facilities) && filters.facilities.length > 0) {
      const itemFeatures = v.features || [];
      const hasAllSelected = filters.facilities.every(selectedFac =>
        itemFeatures.some(f => f.toLowerCase().includes(selectedFac.toLowerCase()))
      );
      if (!hasAllSelected) return false;
    }

    return true;
  });

  // Judul dinamis katalog sesuai tipe yang dipilih
  const getCatalogHeading = () => {
    switch(filters.propertyType) {
      case 'villa': return 'Katalog Unit Villa';
      case 'glamping': return 'Katalog Glamping';
      default: return 'Katalog Semua Unit Pilihan Sekala';
    }
  };

  // 1. TAMPILKAN DASHBOARD ADMIN
  if (view === 'admin') {
    return (
      <AdminDashboard 
        onBackToSite={handleBackToSite} 
        onDataChanged={reloadData}
      />
    );
  }

  // 1A. TAMPILKAN LANDING GATEWAY INTERAKTIF (SEBELUM MASUK HALAMAN UTAMA)
  if (showLandingGateway && !currentArticleSlug && !regionPage.active) {
    return (
      <LandingGateway
        settings={settings}
        onComplete={(chosenFilters) => {
          setFilters(prev => ({
            ...prev,
            location: chosenFilters.location || 'all',
            capacity: chosenFilters.capacity || 0,
            bedrooms: chosenFilters.bedrooms || 0,
            propertyType: chosenFilters.propertyType || 'all',
            minPrice: chosenFilters.minPrice || 0,
            budget: chosenFilters.maxPrice > 0 ? chosenFilters.maxPrice : 5000000
          }));
          sessionStorage.setItem('SEKALA_ENTERED_GATEWAY', 'true');
          setShowLandingGateway(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSkip={() => {
          sessionStorage.setItem('SEKALA_ENTERED_GATEWAY', 'true');
          setShowLandingGateway(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  // 1B. TAMPILKAN HALAMAN ARTIKEL SENDIRI (JIKA DIBUKA DI TAB BARU ?article=slug)
  if (currentArticleSlug) {
    const matchedArticle = articles.find(
      a => a.slug === currentArticleSlug || a.id === currentArticleSlug
    ) || articles[0];

    return (
      <ArticlePage
        article={matchedArticle}
        settings={settings}
        onBack={() => {
          window.history.pushState(null, '', window.location.pathname);
          setCurrentArticleSlug(null);
        }}
        onNavigateHome={() => {
          window.history.pushState(null, '', window.location.pathname);
          setCurrentArticleSlug(null);
        }}
      />
    );
  }

  // 2. TAMPILKAN NEW PAGE DAERAH & SUB-MENU (JIKA DIBUKA)
  if (regionPage.active) {
    return (
      <div className="min-h-screen bg-sand-50 text-sand-900 font-sans">
        <Header 
          settings={settings} 
          regions={regions} 
          onOpenRegionPage={handleOpenRegionPage}
          onHomeClick={handleCloseRegionPage}
        />
        <main>
          <RegionCatalogPage
            regionId={regionPage.regionId}
            villas={villas}
            regions={regions}
            onSelectVilla={setSelectedVilla}
            onBack={handleCloseRegionPage}
            onNavigate={(rId) => setRegionPage({ active: true, regionId: rId })}
          />
        </main>
        <Footer />
        <MobileBottomNav settings={settings} />
        {selectedVilla && (
          <VillaDetailModal 
            villa={selectedVilla} 
            settings={settings} 
            onClose={() => setSelectedVilla(null)} 
          />
        )}
      </div>
    );
  }

  // 3. TAMPILKAN HOMEPAGE UTAMA
  return (
    <div className="min-h-screen bg-sand-50 text-sand-900 font-sans">
      {/* Header dengan Sub-menu Katalog Daerah */}
      <Header 
        settings={settings} 
        regions={regions}
        onOpenRegionPage={handleOpenRegionPage}
        onHomeClick={() => {
          handleResetFilters();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <main>
        {/* Banner Slider */}
        <BannerSlider 
          banners={banners} 
          onFilterLocation={handleFilterLocation}
        />

        {/* Pemilih Daerah (New Page) & Tab Kategori */}
        <SearchFilter 
          filters={filters} 
          setFilters={setFilters} 
          onReset={handleResetFilters}
          regions={regions}
          onOpenRegionPage={handleOpenRegionPage}
        />

        {/* Katalog Villa */}
        <section id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
            <div>
              <span className="text-terracotta-600 font-bold text-[10px] uppercase tracking-widest block">
                Rekomendasi Terverifikasi
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-900">
                {getCatalogHeading()}
              </h2>
            </div>
            
            <span className="text-xs font-bold bg-sand-200 px-3 py-1.5 rounded-xl text-sand-800 self-start sm:self-auto">
              Menampilkan <strong className="text-brand-900 font-extrabold">{displayVillas.length}</strong> Unit
            </span>
          </div>

          {/* Kondisi Loading vs Konten */}
          {loadingVillas ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-sand-200 p-8 shadow-sm">
              <i className="fa-solid fa-spinner fa-spin text-3xl text-brand-800 mb-3 block"></i>
              <p className="text-xs font-bold text-sand-800">Memuat data unit akomodasi...</p>
            </div>
          ) : displayVillas.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-sand-200 p-6">
              <i className="fa-solid fa-building-circle-exclamation text-4xl text-sand-400 mb-3 block"></i>
              <h3 className="text-base font-bold text-sand-900">Unit Tidak Ditemukan</h3>
              <p className="text-sand-800 text-xs mb-4 max-w-md mx-auto">
                Tidak ada unit yang cocok dengan filter yang dipilih. Silakan klik tombol di bawah untuk melihat semua unit.
              </p>
              <button 
                onClick={handleResetFilters}
                className="bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
              >
                Lihat Semua Unit
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayVillas.map(item => (
                <VillaCard 
                  key={item.id} 
                  villa={item} 
                  onClick={() => setSelectedVilla(item)} 
                />
              ))}
            </div>
          )}
        </section>

        {/* Add-Ons Section */}
        <AddonsSection settings={settings} />

        {/* Artikel & Panduan Wisata Section */}
        <ArticlesSection 
          articles={articles} 
          onSelectArticle={setSelectedArticle} 
        />

        {/* FAQ Section */}
        <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-900 text-center mb-6">
            Informasi & Pertanyaan Umum
          </h2>
          <div className="space-y-3">
            <details className="bg-white rounded-2xl border border-sand-200 p-4 group">
              <summary className="font-bold text-brand-900 text-xs sm:text-sm cursor-pointer flex justify-between items-center">
                Apa perbedaan Villa, Glamping, dan Homestay di Sekala?
                <i className="fa-solid fa-chevron-down text-xs group-open:rotate-180 transition me-1"></i>
              </summary>
              <p className="text-sand-800 text-xs mt-2 leading-relaxed">
                <strong>Villa:</strong> Hunian privat eksklusif dengan kolam renang pribadi dan karaoke.<br/>
                <strong>Glamping:</strong> Pengalaman berkemah mewah di pegunungan dengan kasur empuk dan view alam.<br/>
                <strong>Homestay:</strong> Rumah nyaman berkapasitas besar dengan harga hemat untuk keluarga & rombongan.
              </p>
            </details>

            <details className="bg-white rounded-2xl border border-sand-200 p-4 group">
              <summary className="font-bold text-brand-900 text-xs sm:text-sm cursor-pointer flex justify-between items-center">
                Bagaimana alur booking unit atau paket add-on?
                <i className="fa-solid fa-chevron-down text-xs group-open:rotate-180 transition me-1"></i>
              </summary>
              <p className="text-sand-800 text-xs mt-2 leading-relaxed">
                Klik tombol <strong>"Pesan via WA"</strong> di unit atau paket yang Anda pilih. Format pesan WhatsApp akan otomatis terisi lengkap dengan rincian unit. Admin CS siap membantu ketersediaan tanggal dan booking.
              </p>
            </details>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Nav */}
      <MobileBottomNav settings={settings} />

      {/* Villa Detail Modal (1:1 aspect ratio) */}
      {selectedVilla && (
        <VillaDetailModal 
          villa={selectedVilla} 
          settings={settings} 
          onClose={() => setSelectedVilla(null)} 
        />
      )}

      {selectedArticle && (
        <ArticleDetailModal 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)} 
        />
      )}

      {/* Promo Pop-up Modal */}
      <PromoModal 
        isOpen={promoOpen} 
        onClose={() => setPromoOpen(false)} 
        settings={settings} 
      />
    </div>
  );
}
