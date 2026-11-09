import React, { useState, useEffect } from 'react';
import { storage } from './services/storage';
import Header from './components/Header';
import BannerSlider from './components/BannerSlider';
import SearchFilter from './components/SearchFilter';
import VillaCard from './components/VillaCard';
import VillaDetailModal from './components/VillaDetailModal';
import AddonsSection from './components/AddonsSection';
import PromoModal from './components/PromoModal';
import MobileBottomNav from './components/MobileBottomNav';
import Footer from './components/Footer';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [view, setView] = useState('site'); // 'site' | 'admin'
  const [banners, setBanners] = useState(storage.getBanners());
  const [villas, setVillas] = useState(storage.getVillas());
  const [settings, setSettings] = useState(storage.getSettings());

  const [selectedVilla, setSelectedVilla] = useState(null);
  const [promoOpen, setPromoOpen] = useState(false);

  const [filters, setFilters] = useState({
    location: 'all',
    category: 'all',
    capacity: 0,
    budget: 5000000,
    facility: 'all'
  });

  const reloadData = () => {
    setBanners(storage.getBanners());
    setVillas(storage.getVillas());
    setSettings(storage.getSettings());
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPromoOpen(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleResetFilters = () => {
    setFilters({
      location: 'all',
      category: 'all',
      capacity: 0,
      budget: 5000000,
      facility: 'all'
    });
  };

  const handleFilterLocation = (loc) => {
    handleResetFilters();
    setFilters(prev => ({ ...prev, location: loc }));
    document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter Villa
  const filteredVillas = villas.filter(v => {
    if (filters.location !== 'all' && v.location !== filters.location) return false;
    if (filters.category !== 'all' && (v.category || 'Standard') !== filters.category) return false;
    if (filters.capacity > 0 && v.capacity < filters.capacity) return false;
    if (v.price > filters.budget) return false;
    if (filters.facility !== 'all') {
      const hasFac = (v.features || []).some(f => f.toLowerCase().includes(filters.facility.toLowerCase()));
      if (!hasFac) return false;
    }
    return true;
  });

  // Jika membuka tampilan Admin
  if (view === 'admin') {
    return (
      <AdminDashboard 
        onBackToSite={() => setView('site')} 
        onDataChanged={reloadData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-sand-50 text-sand-900 font-sans">
      {/* Header */}
      <Header 
        settings={settings} 
        onOpenAdmin={() => setView('admin')} 
      />

      <main>
        {/* Banner Slider */}
        <BannerSlider 
          banners={banners} 
          onFilterLocation={handleFilterLocation}
        />

        {/* Filter Pencarian & Fasilitas */}
        <SearchFilter 
          filters={filters} 
          setFilters={setFilters} 
          onReset={handleResetFilters}
        />

        {/* Katalog Villa */}
        <section id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="text-terracotta-600 font-bold text-[10px] uppercase tracking-widest block">Rekomendasi Sekala</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-900">Katalog Unit Villa</h2>
            </div>
            <span className="text-xs font-bold bg-sand-200 px-3 py-1 rounded-lg text-sand-800">
              <strong className="text-brand-800">{filteredVillas.length}</strong> Pilihan Unit
            </span>
          </div>

          {filteredVillas.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-sand-200">
              <i className="fa-solid fa-building-circle-exclamation text-3xl text-sand-400 mb-2 block"></i>
              <h3 className="text-sm font-bold text-sand-900">Villa Tidak Ditemukan</h3>
              <p className="text-sand-800 text-xs mb-3">Coba turunkan kriteria filter pencarian Anda.</p>
              <button 
                onClick={handleResetFilters}
                className="bg-brand-900 text-white font-bold text-xs px-4 py-2 rounded-xl"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVillas.map(item => (
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

        {/* FAQ Section */}
        <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-900 text-center mb-6">Informasi & Pertanyaan Umum</h2>
          <div className="space-y-3">
            <details className="bg-white rounded-2xl border border-sand-200 p-4 group">
              <summary className="font-bold text-brand-900 text-xs sm:text-sm cursor-pointer flex justify-between items-center">
                Bagaimana cara booking villa atau paket add-on?
                <i className="fa-solid fa-chevron-down text-xs group-open:rotate-180 transition me-1"></i>
              </summary>
              <p className="text-sand-800 text-xs mt-2 leading-relaxed">
                Cukup klik tombol <strong>"Pesan via WA"</strong> di villa atau paket add-on yang diinginkan. Format pesan otomatis terisi, lalu admin kami akan langsung mengonfirmasi ketersediaan tanggal & DP.
              </p>
            </details>

            <details className="bg-white rounded-2xl border border-sand-200 p-4 group">
              <summary className="font-bold text-brand-900 text-xs sm:text-sm cursor-pointer flex justify-between items-center">
                Apakah paket BBQ atau Jeep bisa diantar ke villa mana saja?
                <i className="fa-solid fa-chevron-down text-xs group-open:rotate-180 transition me-1"></i>
              </summary>
              <p className="text-sand-800 text-xs mt-2 leading-relaxed">
                Bisa banget! Untuk wilayah Tawangmangu, Kemuning, dan sekitarnya tim kami siap antar paket BBQ & peralatan grill lengkap. Tour Jeep juga bisa di-pick up dari area villa.
              </p>
            </details>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setView('admin')} />

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

      {/* Promo Pop-up Modal */}
      <PromoModal 
        isOpen={promoOpen} 
        onClose={() => setPromoOpen(false)} 
        settings={settings} 
      />
    </div>
  );
}
