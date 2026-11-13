import React, { useState } from 'react';
import { storage } from '../services/storage';
import { formatRupiah, DEFAULT_BANNERS, DEFAULT_VILLAS, DEFAULT_SETTINGS } from '../data/initialData';
import { scrapeGoogleMaps } from '../services/scraper';

export default function AdminDashboard({ onBackToSite, onDataChanged }) {
  const [isLoggedIn, setIsLoggedIn] = useState(storage.isAuth());
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('sekala2026');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState('villas');
  const [toastMsg, setToastMsg] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Storage States
  const [banners, setBanners] = useState(storage.getBanners());
  const [villas, setVillas] = useState(storage.getVillas());
  const [regions, setRegions] = useState(storage.getRegions());
  const [articles, setArticles] = useState(storage.getArticles());
  const [settings, setSettings] = useState(storage.getSettings());

  // Article Modal States
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [articleForm, setArticleForm] = useState({
    title: '',
    category: 'Panduan Wisata',
    image: '',
    summary: '',
    content: '',
    author: 'Admin Sekala',
    metaTitle: '',
    metaDesc: '',
    focusKeyword: '',
    tagsText: '',
    readingTime: '3 Menit'
  });

  // Region / Type Custom Form State
  const [newRegionName, setNewRegionName] = useState('');
  const [newRegionBadge, setNewRegionBadge] = useState('');
  const [selectedRegionForType, setSelectedRegionForType] = useState('tawangmangu');
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeIcon, setNewTypeIcon] = useState('fa-house');

  // Banner Modal
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    imageUrl: '',
    hasText: true,
    badge: '',
    title: '',
    subtitle: '',
    btnText: '',
    btnLink: ''
  });

  // Villa / Accommodation Modal
  const [villaModalOpen, setVillaModalOpen] = useState(false);
  const [editingVilla, setEditingVilla] = useState(null);
  const [villaForm, setVillaForm] = useState({
    name: '',
    propertyType: 'villa', // villa | glamping | homestay
    category: 'Standard',  // Budget | Standard | Premium
    location: 'Tawangmangu',
    capacity: 8,
    bedrooms: 3,
    price: 1500000,
    rating: 4.8,
    badge: '',
    whatsapp: '', // Nomor WA khusus unit jika ada
    imagesText: '',
    features: ['Private Pool'],
    desc: ''
  });

  // Scraper Google Maps States
  const [scraperModalOpen, setScraperModalOpen] = useState(false);
  const [scraperInput, setScraperInput] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedResult, setScrapedResult] = useState(null);
  const [scraperError, setScraperError] = useState('');

  // Promo Form State
  const [promoForm, setPromoForm] = useState({
    promoEnabled: settings.promoEnabled !== false,
    promoTitle: settings.promoTitle || 'Diskon Rp 150.000 + Free Alat BBQ Set!',
    promoSubtitle: settings.promoSubtitle || 'Khusus booking minggu ini melalui website resmi Sekala Villa!',
    promoCode: settings.promoCode || 'SEKALAADS150',
    promoDiscount: settings.promoDiscount || 'Rp 150.000 + Bonus Free Alat BBQ Set',
    promoImageUrl: settings.promoImageUrl || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
  });

  // WA Settings Form State
  const [waPhone, setWaPhone] = useState(settings.whatsappPhone || '6281381669735');
  const [waTawangmangu, setWaTawangmangu] = useState(settings.whatsappTawangmangu || '6281381669735');
  const [waJogja, setWaJogja] = useState(settings.whatsappJogja || '6281381669735');
  const [waBBQ, setWaBBQ] = useState(settings.whatsappBBQ || '6281381669735');
  const [waJeep, setWaJeep] = useState(settings.whatsappJeep || '6281381669735');
  const [waPS, setWaPS] = useState(settings.whatsappPS || '6281381669735');
  const [waCatering, setWaCatering] = useState(settings.whatsappCatering || '6281381669735');
  const [waTemplateVilla, setWaTemplateVilla] = useState(settings.waTemplateVilla || '');
  const [waTemplateAddon, setWaTemplateAddon] = useState(settings.waTemplateAddon || '');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'sekala2026') {
      storage.setAuth(true);
      setIsLoggedIn(true);
      setLoginError(false);
      triggerToast('Selamat datang di Dashboard Admin Sekala Villa!');
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    storage.setAuth(false);
    setIsLoggedIn(false);
  };

  // REGION & SUB-ADMIN TIPE AKOMODASI HANDLERS
  const handleAddRegion = (e) => {
    e.preventDefault();
    if (!newRegionName.trim()) return;
    const rId = newRegionName.toLowerCase().replace(/[^a-z0-9]/g, '-').trim() || ('reg-' + Date.now());
    const newReg = {
      id: rId,
      name: newRegionName.trim(),
      badge: newRegionBadge.trim() || 'Destinasi Baru',
      types: [
        { id: 'villa', name: 'Villa', icon: 'fa-house-chimney-window' },
        { id: 'glamping', name: 'Glamping', icon: 'fa-campground' }
      ]
    };
    const updated = [...regions, newReg];
    setRegions(updated);
    storage.saveRegions(updated);
    onDataChanged();
    setNewRegionName('');
    setNewRegionBadge('');
    triggerToast(`✅ Daerah "${newReg.name}" berhasil ditambahkan!`);
  };

  const handleAddTypeToRegion = (e) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;
    const tId = newTypeName.toLowerCase().replace(/[^a-z0-9]/g, '-').trim() || ('type-' + Date.now());
    const updated = regions.map(r => {
      if (r.id === selectedRegionForType) {
        return {
          ...r,
          types: [...r.types, { id: tId, name: newTypeName.trim(), icon: newTypeIcon }]
        };
      }
      return r;
    });
    setRegions(updated);
    storage.saveRegions(updated);
    onDataChanged();
    setNewTypeName('');
    triggerToast(`✅ Tipe akomodasi "${newTypeName}" berhasil ditambahkan ke daerah!`);
  };

  const handleDeleteTypeFromRegion = (regId, typeId) => {
    if (!confirm('Hapus tipe akomodasi ini dari daerah?')) return;
    const updated = regions.map(r => {
      if (r.id === regId) {
        return {
          ...r,
          types: r.types.filter(t => t.id !== typeId)
        };
      }
      return r;
    });
    setRegions(updated);
    storage.saveRegions(updated);
    onDataChanged();
    triggerToast('Tipe akomodasi dihapus.');
  };

  // BANNER HANDLERS
  const openAddBanner = () => {
    setEditingBanner(null);
    setBannerForm({
      imageUrl: '',
      hasText: true,
      badge: 'PROMO WEEKEND SPESIAL',
      title: '',
      subtitle: '',
      btnText: 'Cek Unit',
      btnLink: '#katalog'
    });
    setBannerModalOpen(true);
  };

  const openEditBanner = (b) => {
    setEditingBanner(b);
    setBannerForm({ ...b });
    setBannerModalOpen(true);
  };

  const handleBannerFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setBannerForm(prev => ({ ...prev, imageUrl: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBanner = (e) => {
    e.preventDefault();
    if (!bannerForm.imageUrl) {
      alert('Pilih gambar atau masukkan URL gambar banner!');
      return;
    }
    let updated;
    if (editingBanner) {
      updated = banners.map(b => b.id === editingBanner.id ? { ...bannerForm, id: editingBanner.id } : b);
    } else {
      updated = [...banners, { ...bannerForm, id: 'ban-' + Date.now() }];
    }
    setBanners(updated);
    storage.saveBanners(updated);
    onDataChanged();
    setBannerModalOpen(false);
    triggerToast('Banner berhasil disimpan!');
  };

  const deleteBanner = (id) => {
    if (!confirm('Hapus banner ini?')) return;
    const updated = banners.filter(b => b.id !== id);
    setBanners(updated);
    storage.saveBanners(updated);
    onDataChanged();
    triggerToast('Banner berhasil dihapus.');
  };

  // VILLA / UNIT HANDLERS
  const openAddVilla = () => {
    setEditingVilla(null);
    setVillaForm({
      name: '',
      propertyType: 'villa',
      category: 'Standard',
      location: 'Tawangmangu',
      capacity: 8,
      bedrooms: 3,
      price: 1500000,
      rating: 4.8,
      badge: '',
      whatsapp: '',
      imagesText: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
      features: ['Private Pool', 'View Gunung', 'Karaoke'],
      desc: ''
    });
    setVillaModalOpen(true);
  };

  const openEditVilla = (v) => {
    setEditingVilla(v);
    setVillaForm({
      name: v.name,
      propertyType: v.propertyType || 'villa',
      category: v.category || 'Standard',
      location: v.location,
      capacity: v.capacity,
      bedrooms: v.bedrooms,
      price: v.price,
      rating: v.rating,
      badge: v.badge || '',
      whatsapp: v.whatsapp || '',
      imagesText: (v.images || [v.image]).join('\n'),
      features: v.features || [],
      desc: v.desc || ''
    });
    setVillaModalOpen(true);
  };

  const toggleFeature = (feat) => {
    setVillaForm(prev => {
      const exists = prev.features.includes(feat);
      return {
        ...prev,
        features: exists ? prev.features.filter(f => f !== feat) : [...prev.features, feat]
      };
    });
  };

  const handleSaveVilla = (e) => {
    e.preventDefault();
    const imgs = villaForm.imagesText.trim().split('\n').map(s => s.trim()).filter(Boolean);
    const mainImg = imgs[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80';

    const itemData = {
      id: editingVilla ? editingVilla.id : ('sekala-' + Date.now()),
      name: villaForm.name.trim(),
      propertyType: villaForm.propertyType,
      category: villaForm.category,
      location: villaForm.location,
      capacity: parseInt(villaForm.capacity) || 2,
      bedrooms: parseInt(villaForm.bedrooms) || 1,
      price: parseInt(villaForm.price) || 500000,
      rating: parseFloat(villaForm.rating) || 4.8,
      badge: villaForm.badge.trim(),
      whatsapp: villaForm.whatsapp ? villaForm.whatsapp.trim() : '',
      image: mainImg,
      images: imgs.length ? imgs : [mainImg],
      features: villaForm.features,
      desc: villaForm.desc.trim()
    };

    let updated;
    if (editingVilla) {
      updated = villas.map(v => v.id === editingVilla.id ? itemData : v);
    } else {
      updated = [itemData, ...villas];
    }

    setVillas(updated);
    storage.saveVillas(updated);
    onDataChanged();
    setVillaModalOpen(false);
    triggerToast('Data unit berhasil disimpan!');
  };

  const deleteVilla = (id) => {
    if (!confirm('Yakin ingin menghapus unit ini?')) return;
    const updated = villas.filter(v => v.id !== id);
    setVillas(updated);
    storage.saveVillas(updated);
    onDataChanged();
    triggerToast('Unit berhasil dihapus.');
  };

  // GOOGLE MAPS AUTO SCRAPER HANDLERS
  const handleRunScraper = async (overrideQuery) => {
    const q = overrideQuery || scraperInput;
    if (!q || !q.trim()) {
      setScraperError('Silakan masukkan nama tempat atau link Google Maps!');
      return;
    }
    setScraperError('');
    setIsScraping(true);
    setScrapedResult(null);
    try {
      const res = await scrapeGoogleMaps(q);
      setScrapedResult(res);
    } catch (err) {
      setScraperError(err.message || 'Gagal menarik data dari Google Maps.');
    } finally {
      setIsScraping(false);
    }
  };

  const handleSaveScrapedUnit = () => {
    if (!scrapedResult) return;
    const updated = [scrapedResult, ...villas];
    setVillas(updated);
    storage.saveVillas(updated);
    onDataChanged();
    setScraperModalOpen(false);
    setScrapedResult(null);
    setScraperInput('');
    triggerToast(`✅ Unit "${scrapedResult.name}" berhasil ditarik & masuk katalog!`);
  };

  // PROMO SETTINGS HANDLER
  const handleSavePromo = (e) => {
    e.preventDefault();
    const updated = {
      ...settings,
      promoEnabled: promoForm.promoEnabled,
      promoTitle: promoForm.promoTitle,
      promoSubtitle: promoForm.promoSubtitle,
      promoCode: promoForm.promoCode,
      promoDiscount: promoForm.promoDiscount,
      promoImageUrl: promoForm.promoImageUrl
    };
    setSettings(updated);
    storage.saveSettings(updated);
    onDataChanged();
    triggerToast('Pengaturan popup promo berhasil disimpan!');
  };

  // WA SETTINGS HANDLER
  const handleSaveWA = (e) => {
    e.preventDefault();
    const updated = {
      ...settings,
      whatsappPhone: waPhone.trim(),
      whatsappTawangmangu: waTawangmangu.trim(),
      whatsappJogja: waJogja.trim(),
      whatsappBBQ: waBBQ.trim(),
      whatsappJeep: waJeep.trim(),
      whatsappPS: waPS.trim(),
      whatsappCatering: waCatering.trim(),
      waTemplateVilla,
      waTemplateAddon
    };
    setSettings(updated);
    storage.saveSettings(updated);
    onDataChanged();
    triggerToast('Pengaturan nomor WhatsApp & template berhasil disimpan!');
  };

  // ARTICLE HANDLERS
  const handleOpenAddArticle = () => {
    setEditingArticle(null);
    setArticleForm({
      title: '',
      category: 'Panduan Wisata',
      image: '',
      summary: '',
      content: '',
      author: 'Admin Sekala',
      metaTitle: '',
      metaDesc: '',
      focusKeyword: '',
      tagsText: 'Tawangmangu, Villa, Wisata',
      readingTime: '3 Menit'
    });
    setArticleModalOpen(true);
  };

  const handleOpenEditArticle = (art) => {
    setEditingArticle(art);
    setArticleForm({
      title: art.title || '',
      category: art.category || 'Panduan Wisata',
      image: art.image || '',
      summary: art.summary || '',
      content: art.content || '',
      author: art.author || 'Admin Sekala',
      metaTitle: art.metaTitle || '',
      metaDesc: art.metaDesc || '',
      focusKeyword: art.focusKeyword || '',
      tagsText: Array.isArray(art.tags) ? art.tags.join(', ') : (art.tagsText || ''),
      readingTime: art.readingTime || '3 Menit'
    });
    setArticleModalOpen(true);
  };

  const handleDeleteArticle = (id) => {
    if (window.confirm('Yakin ingin menghapus artikel ini?')) {
      const filtered = articles.filter(a => a.id !== id);
      setArticles(filtered);
      storage.saveArticles(filtered);
      onDataChanged();
      triggerToast('Artikel berhasil dihapus!');
    }
  };

  const handleSaveArticle = (e) => {
    e.preventDefault();
    if (!articleForm.title.trim()) {
      alert('Judul artikel wajib diisi!');
      return;
    }

    const slug = articleForm.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const today = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date());
    const tags = articleForm.tagsText.split(',').map(t => t.trim()).filter(Boolean);

    const articleData = {
      title: articleForm.title.trim(),
      category: articleForm.category,
      image: articleForm.image.trim(),
      summary: articleForm.summary.trim(),
      content: articleForm.content.trim(),
      author: articleForm.author.trim() || 'Admin Sekala',
      metaTitle: articleForm.metaTitle.trim() || `${articleForm.title.trim()} | Sekala Villa`,
      metaDesc: articleForm.metaDesc.trim() || articleForm.summary.trim(),
      focusKeyword: articleForm.focusKeyword.trim(),
      tags,
      readingTime: articleForm.readingTime || '3 Menit',
      slug
    };

    if (editingArticle) {
      const updated = articles.map(a => a.id === editingArticle.id ? {
        ...a,
        ...articleData
      } : a);
      setArticles(updated);
      storage.saveArticles(updated);
      triggerToast('Artikel & SEO berhasil diperbarui!');
    } else {
      const newArt = {
        id: 'art-' + Date.now(),
        ...articleData,
        date: today
      };
      const updated = [newArt, ...articles];
      setArticles(updated);
      storage.saveArticles(updated);
      triggerToast('Artikel baru & SEO berhasil ditambahkan!');
    }

    setArticleModalOpen(false);
    onDataChanged();
  };

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-brand-900 flex items-center justify-center p-4">
        <div className="bg-sand-50 rounded-3xl max-w-sm w-full p-8 shadow-2xl border border-sand-200">
          <div className="text-center mb-6">
            <span className="w-12 h-12 bg-amber-400 text-brand-900 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold shadow-md mb-3">
              <i className="fa-solid fa-lock"></i>
            </span>
            <h1 className="font-serif text-2xl font-bold text-brand-900">Admin Sekala Villa</h1>
            <p className="text-xs text-sand-800 mt-1">Dashboard Pengelolaan Sistem</p>
          </div>

          {loginError && (
            <div className="bg-rose-100 border border-rose-300 text-rose-800 text-xs p-3 rounded-xl mb-4 font-semibold">
              Username atau password salah!
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-white border border-sand-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white border border-sand-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-700"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs py-3 rounded-xl shadow transition"
            >
              Masuk Dashboard
            </button>
          </form>

          <button
            onClick={onBackToSite}
            className="w-full text-center text-xs text-sand-800 hover:text-brand-900 font-bold mt-4 block"
          >
            ← Kembali ke Website
          </button>
        </div>
      </div>
    );
  }

  // TABS CONFIGURATION
  const tabs = [
    { id: 'villas', label: 'Katalog Unit Akomodasi', icon: 'fa-house-chimney-window' },
    { id: 'regions', label: 'Kelola Daerah & Tipe (Sub-Admin)', icon: 'fa-map-location-dot' },
    { id: 'articles', label: 'Kelola Artikel & Halaman', icon: 'fa-newspaper' },
    { id: 'banners', label: 'Banner Iklan Slider', icon: 'fa-image' },
    { id: 'promo', label: 'Pengaturan Popup Promo', icon: 'fa-tags' },
    { id: 'whatsapp', label: 'Nomor WhatsApp & Template', icon: 'fa-whatsapp', brand: true },
    { id: 'api', label: 'Koneksi REST API VPS', icon: 'fa-code' },
  ];

  return (
    <div className="min-h-screen bg-sand-100 flex flex-col md:flex-row">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-800 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-emerald-600 animate-in fade-in slide-in-from-top-2">
          <i className="fa-solid fa-circle-check text-amber-300"></i>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* SIDEBAR DESKTOP */}
      <aside className="w-64 bg-brand-900 text-white p-5 hidden md:flex flex-col justify-between shrink-0 shadow-xl">
        <div>
          <div className="flex items-center gap-3 pb-6 border-b border-brand-800 mb-6">
            <span className="w-10 h-10 rounded-2xl bg-amber-400 text-brand-900 flex items-center justify-center font-bold text-lg shadow">
              <i className="fa-solid fa-shield-halved"></i>
            </span>
            <div>
              <h2 className="font-serif font-bold text-base text-amber-50">Sekala Admin</h2>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> React Single Page
              </span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {tabs.map(t => {
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`w-full px-4 py-3 rounded-2xl font-bold text-xs transition flex items-center gap-3 text-left ${
                    active
                      ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                      : 'text-sand-200 hover:bg-white/10'
                  }`}
                >
                  <i className={`fa-${t.brand ? 'brands' : 'solid'} ${t.icon} text-sm w-4 ${active ? 'text-slate-950' : 'text-amber-400'}`}></i>
                  <span>{t.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-brand-800 space-y-2">
          <button
            onClick={onBackToSite}
            className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-arrow-up-right-from-square"></i> Lihat Website
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </aside>

      {/* TOPBAR MOBILE */}
      <div className="md:hidden bg-brand-900 text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <span className="font-serif font-bold text-base text-amber-50 flex items-center gap-2">
          <i className="fa-solid fa-shield-halved text-amber-400"></i> Sekala Admin
        </span>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="text-white p-2 rounded-lg bg-white/10"
        >
          <i className="fa-solid fa-bars text-lg"></i>
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden flex">
          <div className="w-64 bg-brand-900 text-white p-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-brand-800 mb-4">
                <span className="font-serif font-bold text-base text-amber-50">Menu Navigasi</span>
                <button onClick={() => setMobileSidebarOpen(false)} className="text-white">
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>
              <nav className="space-y-1">
                {tabs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setActiveTab(t.id); setMobileSidebarOpen(false); }}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 text-left ${
                      activeTab === t.id ? 'bg-amber-400 text-slate-950' : 'text-sand-200'
                    }`}
                  >
                    <i className={`fa-${t.brand ? 'brands' : 'solid'} ${t.icon} w-4`}></i>
                    <span>{t.label}</span>
                  </button>
                ))}
              </nav>
            </div>
            <div className="space-y-2">
              <button onClick={onBackToSite} className="w-full bg-white/10 text-white text-xs font-bold py-2 rounded-xl">
                Lihat Website
              </button>
              <button onClick={handleLogout} className="w-full bg-rose-900 text-rose-300 text-xs font-bold py-2 rounded-xl">
                Logout
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)}></div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        
        {/* ========================================================= */}
        {/* TAB 1: KATALOG VILLA / GLAMPING / HOMESTAY                */}
        {/* ========================================================= */}
        {activeTab === 'villas' && (
          <div className="space-y-6">
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sand-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="bg-brand-100 text-brand-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-1">
                  Katalog Unit
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-900">
                  Kelola Villa, Glamping & Homestay
                </h2>
                <p className="text-xs text-sand-800 mt-1">
                  Atur tipe unit akomodasi, harga per malam, fasilitas utama, dan foto galeri 1:1.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  onClick={() => { setScraperModalOpen(true); setScrapedResult(null); setScraperError(''); }}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-2xl shadow transition flex items-center gap-2"
                >
                  <i className="fa-solid fa-wand-magic-sparkles text-brand-900"></i>
                  <span>⚡ Tarik Otomatis dari Maps</span>
                </button>
                <button
                  onClick={openAddVilla}
                  className="bg-brand-900 hover:bg-brand-800 text-amber-300 font-bold text-xs px-4 py-2.5 rounded-2xl shadow transition flex items-center gap-2"
                >
                  <i className="fa-solid fa-plus"></i> Tambah Manual
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {villas.map(v => {
                const pType = v.propertyType || 'villa';
                const typeLabel = pType === 'glamping' ? 'Glamping' : (pType === 'homestay' ? 'Homestay' : 'Villa');
                const typeIcon = pType === 'glamping' ? 'fa-campground' : (pType === 'homestay' ? 'fa-people-roof' : 'fa-house-chimney-window');

                return (
                  <div key={v.id} className="bg-white rounded-3xl border border-sand-200 overflow-hidden shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="relative aspect-square bg-sand-200 overflow-hidden">
                        <img src={v.image || (v.images && v.images[0])} alt={v.name} className="w-full h-full object-cover" />
                        
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                          <span className="bg-brand-900 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                            <i className={`fa-solid ${typeIcon}`}></i> {typeLabel}
                          </span>
                          <span className="bg-white/90 text-sand-900 text-[10px] font-bold px-2 py-1 rounded-full shadow">
                            {v.category || 'Standard'}
                          </span>
                        </div>

                        <span className="absolute top-3 right-3 bg-white/95 text-sand-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                          <i className="fa-solid fa-star text-amber-500"></i> {v.rating}
                        </span>

                        <span className="absolute bottom-2.5 left-2.5 bg-slate-950/75 backdrop-blur text-white text-[10px] px-2.5 py-0.5 rounded-lg">
                          <i className="fa-solid fa-location-dot me-1 text-emerald-400"></i> {v.location}
                        </span>
                      </div>

                      <div className="p-4 space-y-2">
                        <h3 className="font-serif font-bold text-base text-brand-900 leading-snug">{v.name}</h3>
                        <div className="flex items-center gap-3 text-xs text-sand-800">
                          <span><i className="fa-solid fa-users text-brand-700 me-1"></i> {v.capacity} Pax</span>
                          <span><i className="fa-solid fa-bed text-brand-700 me-1"></i> {v.bedrooms} Kamar</span>
                        </div>
                        <div className="pt-2 text-xs">
                          <span className="text-[10px] uppercase font-bold text-sand-800 block">Mulai Dari</span>
                          <strong className="text-sm font-extrabold text-brand-800">{formatRupiah(v.price)}</strong> / malam
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-sand-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditVilla(v)}
                        className="bg-sand-200 hover:bg-sand-300 text-sand-900 font-bold text-xs px-3 py-1.5 rounded-xl transition"
                      >
                        <i className="fa-solid fa-pen-to-square me-1"></i> Edit
                      </button>
                      <button
                        onClick={() => deleteVilla(v.id)}
                        className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs px-3 py-1.5 rounded-xl transition"
                      >
                        <i className="fa-solid fa-trash me-1"></i> Hapus
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: BANNER IKLAN SLIDER                                */}
        {/* ========================================================= */}
                {/* ========================================================= */}
        {/* TAB SUB-ADMIN: KELOLA DAERAH & TIPE AKOMODASI             */}
        {/* ========================================================= */}
        {activeTab === 'regions' && (
          <div className="space-y-6">
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sand-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="bg-brand-100 text-brand-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-1">
                  Sub-Admin Pengaturan Daerah
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-900">
                  Kelola Tipe Akomodasi per Daerah
                </h2>
                <p className="text-xs text-sand-800 mt-1">
                  Atur daerah (Tawangmangu, Jogja, dll) dan sub-tipe akomodasi (Villa, Glamping, Homestay). Setiap kombinasi otomatis memiliki halaman khusus (New Page) dan sub-menu di katalog.
                </p>
              </div>
            </div>

            {/* FORM 1: TAMBAH DAERAH BARU */}
            <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-brand-900 flex items-center gap-2">
                <i className="fa-solid fa-location-dot text-rose-600"></i>
                <span>Tambah Daerah Baru</span>
              </h3>
              <form onSubmit={handleAddRegion} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Nama Daerah *</label>
                  <input
                    type="text"
                    required
                    value={newRegionName}
                    onChange={e => setNewRegionName(e.target.value)}
                    placeholder="Contoh: Malang & Batu"
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Badge Tag Wilayah</label>
                  <input
                    type="text"
                    value={newRegionBadge}
                    onChange={e => setNewRegionBadge(e.target.value)}
                    placeholder="Contoh: Dingin & Pegunungan"
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-700"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-brand-900 hover:bg-brand-800 text-amber-300 font-bold text-xs py-2.5 px-4 rounded-xl shadow transition flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-plus"></i> Tambah Daerah
                  </button>
                </div>
              </form>
            </div>

            {/* FORM 2: TAMBAH TIPE AKOMODASI KE DAERAH */}
            <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-brand-900 flex items-center gap-2">
                <i className="fa-solid fa-tags text-amber-500"></i>
                <span>Tambah Tipe Akomodasi Khusus ke Daerah</span>
              </h3>
              <form onSubmit={handleAddTypeToRegion} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Pilih Daerah Target *</label>
                  <select
                    value={selectedRegionForType}
                    onChange={e => setSelectedRegionForType(e.target.value)}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs font-bold text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                  >
                    {regions.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Nama Tipe Akomodasi *</label>
                  <input
                    type="text"
                    required
                    value={newTypeName}
                    onChange={e => setNewTypeName(e.target.value)}
                    placeholder="Contoh: Cabin Kayu / Treehouse"
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Pilih Ikon FontAwesome</label>
                  <select
                    value={newTypeIcon}
                    onChange={e => setNewTypeIcon(e.target.value)}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-700"
                  >
                    <option value="fa-house-chimney-window">Villa (Rumah Mewah)</option>
                    <option value="fa-campground">Glamping (Tenda Camp)</option>
                    <option value="fa-people-roof">Homestay (Rombongan)</option>
                    <option value="fa-tree">Cabin / Alam</option>
                    <option value="fa-bed">Kamar / Suite</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl shadow transition flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-plus"></i> Tambah Tipe
                  </button>
                </div>
              </form>
            </div>

            {/* DAFTAR DAERAH & TIPE YANG SUDAH ADA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {regions.map(r => (
                <div key={r.id} className="bg-white rounded-3xl border border-sand-200 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-sand-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-xl bg-brand-900 text-amber-300 flex items-center justify-center text-sm font-bold shadow-xs">
                        <i className="fa-solid fa-location-dot"></i>
                      </span>
                      <div>
                        <h4 className="font-serif font-bold text-base text-brand-900 leading-snug">{r.name}</h4>
                        <span className="text-[10px] text-sand-500 font-semibold">{r.badge}</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-sand-100 text-sand-800 font-bold px-2 py-0.5 rounded-md">
                      {r.types.length} Tipe
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-sand-400 uppercase tracking-wider block">
                      Sub-Tipe Akomodasi di Daerah Ini:
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {r.types.map(t => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-sand-50 border border-sand-200 text-xs"
                        >
                          <span className="flex items-center gap-2 font-bold text-brand-900">
                            <i className={`fa-solid ${t.icon} text-brand-700 w-4`}></i>
                            <span>{t.name}</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => handleDeleteTypeFromRegion(r.id, t.id)}
                            className="text-sand-400 hover:text-rose-600 p-1 text-xs transition"
                            title="Hapus tipe ini"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'banners' && (
          <div className="space-y-6">
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sand-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-1">
                  Hero Header
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-900">
                  Banner Iklan Slider
                </h2>
                <p className="text-xs text-sand-800 mt-1">
                  Slide banner promo di bagian atas website. Mendukung upload gambar langsung atau input URL.
                </p>
              </div>
              <button
                onClick={openAddBanner}
                className="bg-brand-900 hover:bg-brand-800 text-amber-300 font-bold text-xs px-5 py-3 rounded-2xl shadow transition flex items-center gap-2 shrink-0"
              >
                <i className="fa-solid fa-plus"></i> Tambah Banner Baru
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {banners.map((b, i) => (
                <div key={b.id || i} className="bg-white rounded-3xl border border-sand-200 overflow-hidden shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="relative h-44 bg-sand-200 overflow-hidden">
                      <img src={b.imageUrl} alt={b.title || 'Banner'} className="w-full h-full object-cover" />
                      {b.badge && (
                        <span className="absolute top-3 left-3 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-3 py-1 rounded-full shadow">
                          {b.badge}
                        </span>
                      )}
                      <span className="absolute top-3 right-3 bg-slate-950/70 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {b.hasText ? 'Mode Gambar + Teks' : 'Banner Grafis Murni'}
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <h3 className="font-serif font-bold text-lg text-brand-900">
                        {b.title || <span className="italic text-sand-400 text-sm">Tanpa Teks Headline</span>}
                      </h3>
                      {b.subtitle && <p className="text-xs text-sand-700 line-clamp-2">{b.subtitle}</p>}
                    </div>
                  </div>

                  <div className="p-4 border-t border-sand-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditBanner(b)}
                      className="bg-sand-200 hover:bg-sand-300 text-sand-900 font-bold text-xs px-3 py-1.5 rounded-xl transition"
                    >
                      <i className="fa-solid fa-pen-to-square me-1"></i> Edit
                    </button>
                    <button
                      onClick={() => deleteBanner(b.id)}
                      className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs px-3 py-1.5 rounded-xl transition"
                    >
                      <i className="fa-solid fa-trash me-1"></i> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: PENGATURAN POPUP PROMO                            */}
        {/* ========================================================= */}
        {activeTab === 'promo' && (
          <div className="max-w-3xl space-y-6">
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sand-200 shadow-sm">
              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-1">
                Ads Pop-Up
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-900">
                Pengaturan Popup Promo
              </h2>
              <p className="text-xs text-sand-800 mt-1">
                Atur isi popup diskon yang otomatis muncul saat calon tamu membuka website pertama kali.
              </p>
            </div>

            <form onSubmit={handleSavePromo} className="bg-white p-6 rounded-3xl border border-sand-200 shadow-sm space-y-4">
              {/* Toggle ON/OFF */}
              <div className="flex items-center justify-between p-4 bg-sand-50 rounded-2xl border border-sand-200">
                <div>
                  <h4 className="font-bold text-sm text-brand-900">Aktifkan Popup Promo</h4>
                  <p className="text-xs text-sand-700">Muncul setelah 1.5 detik halaman utama dimuat</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={promoForm.promoEnabled}
                    onChange={e => setPromoForm({ ...promoForm, promoEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-sand-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-sand-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Judul Headline Promo *</label>
                <input
                  type="text"
                  required
                  value={promoForm.promoTitle}
                  onChange={e => setPromoForm({ ...promoForm, promoTitle: e.target.value })}
                  className="w-full bg-sand-50 border border-sand-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Deskripsi Singkat *</label>
                <textarea
                  rows="3"
                  required
                  value={promoForm.promoSubtitle}
                  onChange={e => setPromoForm({ ...promoForm, promoSubtitle: e.target.value })}
                  className="w-full bg-sand-50 border border-sand-200 rounded-xl p-3 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Kode Voucher Promo *</label>
                  <input
                    type="text"
                    required
                    value={promoForm.promoCode}
                    onChange={e => setPromoForm({ ...promoForm, promoCode: e.target.value.toUpperCase() })}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-brand-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Teks Diskon / Bonus *</label>
                  <input
                    type="text"
                    required
                    value={promoForm.promoDiscount}
                    onChange={e => setPromoForm({ ...promoForm, promoDiscount: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-sand-800 mb-1">URL Gambar Header Modal</label>
                <input
                  type="url"
                  value={promoForm.promoImageUrl}
                  onChange={e => setPromoForm({ ...promoForm, promoImageUrl: e.target.value })}
                  className="w-full bg-sand-50 border border-sand-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {promoForm.promoImageUrl && (
                <div className="h-32 rounded-2xl overflow-hidden border border-sand-200">
                  <img src={promoForm.promoImageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-brand-900 hover:bg-brand-800 text-amber-300 font-bold text-xs px-6 py-3 rounded-xl shadow transition"
                >
                  Simpan Pengaturan Promo
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: ARTIKEL & HALAMAN MANAGEMENT                      */}
        {/* ========================================================= */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sand-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <span className="bg-brand-100 text-brand-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-1">
                  Konten & Edukasi Wisata
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-900">
                  Manajemen Artikel & Wisata
                </h2>
                <p className="text-xs text-sand-800 mt-1">
                  Tambah dan kelola artikel, tips wisata, rekomendasi villa, beserta foto cover dan isi halaman.
                </p>
              </div>
              <button
                onClick={handleOpenAddArticle}
                className="bg-brand-900 hover:bg-brand-800 text-amber-300 font-bold text-xs px-5 py-3 rounded-2xl shadow transition flex items-center justify-center gap-2 shrink-0"
              >
                <i className="fa-solid fa-plus"></i>
                <span>Tulis Artikel Baru</span>
              </button>
            </div>

            {/* List Artikel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articles.map((art) => (
                <div key={art.id} className="bg-white rounded-3xl border border-sand-200 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-sand-100">
                      <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2.5 left-2.5 bg-brand-900/90 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur">
                        {art.category}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-sand-500 font-semibold block">{art.date} • {art.author}</span>
                      <h3 className="font-serif font-bold text-base text-brand-900 line-clamp-2 mt-1">
                        {art.title}
                      </h3>
                      <p className="text-xs text-sand-700 line-clamp-2 mt-1">
                        {art.summary}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-sand-100 flex items-center justify-end gap-2 mt-4">
                    <button
                      onClick={() => handleOpenEditArticle(art)}
                      className="bg-sand-100 hover:bg-sand-200 text-brand-900 font-bold text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
                    >
                      <i className="fa-solid fa-pen-to-square text-[11px]"></i> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteArticle(art.id)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
                    >
                      <i className="fa-solid fa-trash text-[11px]"></i> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: WHATSAPP SETTINGS                                 */}
        {/* ========================================================= */}
        {activeTab === 'whatsapp' && (
          <div className="max-w-3xl space-y-6">
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sand-200 shadow-sm">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-1">
                WhatsApp Multi-Admin & Layanan
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-900">
                Pengaturan Nomor WhatsApp & Template Pesan
              </h2>
              <p className="text-xs text-sand-800 mt-1">
                Atur nomor WhatsApp yang berbeda untuk setiap cabang daerah (Tawangmangu & Jogja) serta setiap divisi layanan (BBQ, Jeep, PS, Catering).
              </p>
            </div>

            <form onSubmit={handleSaveWA} className="bg-white p-6 rounded-3xl border border-sand-200 shadow-sm space-y-6">
              
              {/* BAGIAN 1: NOMOR PER DAERAH & PUSAT */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-brand-900 border-b border-sand-200 pb-2 flex items-center gap-2">
                  <i className="fa-solid fa-map-location-dot text-brand-700"></i>
                  <span>Nomor Admin per Cabang Wilayah</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-sand-800 mb-1">
                      📍 Admin Area Tawangmangu & Kemuning *
                    </label>
                    <input
                      type="text"
                      required
                      value={waTawangmangu}
                      onChange={e => setWaTawangmangu(e.target.value)}
                      placeholder="6281381669735"
                      className="w-full bg-sand-50 border border-sand-200 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-[10px] text-sand-500 mt-1 block">Otomatis dipakai jika tamu booking unit di Tawangmangu</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-sand-800 mb-1">
                      📍 Admin Area Yogyakarta & Sleman *
                    </label>
                    <input
                      type="text"
                      required
                      value={waJogja}
                      onChange={e => setWaJogja(e.target.value)}
                      placeholder="6281381669735"
                      className="w-full bg-sand-50 border border-sand-200 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-[10px] text-sand-500 mt-1 block">Otomatis dipakai jika tamu booking unit di Yogyakarta</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-sand-800 mb-1">
                    🏢 Nomor WhatsApp Admin Utama / Pusat (Fallback) *
                  </label>
                  <input
                    type="text"
                    required
                    value={waPhone}
                    onChange={e => setWaPhone(e.target.value)}
                    placeholder="6281381669735"
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-sand-500 mt-1 block">Dipakai untuk tombol Hubungi Admin di Header & Footer</span>
                </div>
              </div>

              {/* BAGIAN 2: NOMOR PIC ADD-ONS */}
              <div className="space-y-4 pt-2">
                <h3 className="font-bold text-sm text-brand-900 border-b border-sand-200 pb-2 flex items-center gap-2">
                  <i className="fa-solid fa-bell-concierge text-brand-700"></i>
                  <span>Nomor PIC Layanan Add-Ons</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-sand-800 mb-1">
                      🥩 PIC Paket BBQ Siap Bakar *
                    </label>
                    <input
                      type="text"
                      required
                      value={waBBQ}
                      onChange={e => setWaBBQ(e.target.value)}
                      className="w-full bg-sand-50 border border-sand-200 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-sand-800 mb-1">
                      🚙 PIC Wisata Jeep Adventure Kemuning *
                    </label>
                    <input
                      type="text"
                      required
                      value={waJeep}
                      onChange={e => setWaJeep(e.target.value)}
                      className="w-full bg-sand-50 border border-sand-200 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-sand-800 mb-1">
                      🎮 PIC Rental PlayStation Delivery *
                    </label>
                    <input
                      type="text"
                      required
                      value={waPS}
                      onChange={e => setWaPS(e.target.value)}
                      className="w-full bg-sand-50 border border-sand-200 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-sand-800 mb-1">
                      🍱 PIC Catering Rombongan / Prasmanan *
                    </label>
                    <input
                      type="text"
                      required
                      value={waCatering}
                      onChange={e => setWaCatering(e.target.value)}
                      className="w-full bg-sand-50 border border-sand-200 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* BAGIAN 3: TEMPLATE PESAN */}
              <div className="space-y-4 pt-2">
                <h3 className="font-bold text-sm text-brand-900 border-b border-sand-200 pb-2 flex items-center gap-2">
                  <i className="fa-solid fa-comment-dots text-brand-700"></i>
                  <span>Format Pesan Otomatis (Template)</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Template Booking Unit *</label>
                  <p className="text-[10px] text-sand-600 mb-2">Tag yang bisa dipakai: <code>{'{villa_name}'}</code>, <code>{'{property_type}'}</code>, <code>{'{location}'}</code>, <code>{'{capacity}'}</code>, <code>{'{price_start}'}</code>, <code>{'{facilities}'}</code></p>
                  <textarea
                    rows="5"
                    required
                    value={waTemplateVilla}
                    onChange={e => setWaTemplateVilla(e.target.value)}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl p-3 text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Template Pesan Add-On (BBQ / Jeep / PS / Catering) *</label>
                  <p className="text-[10px] text-sand-600 mb-2">Tag yang bisa dipakai: <code>{'{addon_name}'}</code>, <code>{'{price}'}</code></p>
                  <textarea
                    rows="3"
                    required
                    value={waTemplateAddon}
                    onChange={e => setWaTemplateAddon(e.target.value)}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl p-3 text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition"
                >
                  Simpan Semua Pengaturan WhatsApp
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: REST API VPS INTEGRATION INFO                     */}
        {/* ========================================================= */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sand-200 shadow-sm">
              <span className="bg-brand-100 text-brand-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-1">
                Integrasi Backend VPS
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-900">
                Koneksi REST API ke VPS
              </h2>
              <p className="text-xs text-sand-800 mt-1">
                Karena website ini 100% menggunakan React JS di frontend, menghubungkan ke server VPS sangat praktis via JSON REST API (tanpa PHP).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white p-5 rounded-3xl border border-sand-200 shadow-sm space-y-2">
                <span className="bg-blue-100 text-blue-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">GET /api/villas</span>
                <h4 className="font-bold text-sm text-brand-900">Mengambil Data Katalog Unit</h4>
                <p className="text-xs text-sand-700 leading-relaxed">
                  Endpoint di VPS yang merespon daftar unit dengan field <code>propertyType: 'villa' | 'glamping' | 'homestay'</code>, <code>price</code>, <code>location</code>, dan array <code>images</code>.
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-sand-200 shadow-sm space-y-2">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">GET /api/banners</span>
                <h4 className="font-bold text-sm text-brand-900">Mengambil Slider Hero</h4>
                <p className="text-xs text-sand-700 leading-relaxed">
                  Endpoint untuk gambar banner iklan aktif, badge teks, dan link aksi tujuan.
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-sand-200 shadow-sm space-y-2">
                <span className="bg-amber-100 text-amber-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">GET /api/settings</span>
                <h4 className="font-bold text-sm text-brand-900">Pengaturan Promo & WA</h4>
                <p className="text-xs text-sand-700 leading-relaxed">
                  Endpoint untuk status popup promo (ON/OFF), kode promo, dan nomor WhatsApp CS.
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-sand-200 shadow-sm space-y-2">
                <span className="bg-purple-100 text-purple-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">CORS Allowed</span>
                <h4 className="font-bold text-sm text-brand-900">Izin Akses Domain</h4>
                <p className="text-xs text-sand-700 leading-relaxed">
                  Pastikan server VPS mengizinkan header <code>Access-Control-Allow-Origin: *</code> agar React dapat mengambil data tanpa diblokir browser.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ========================================================= */}
      {/* MODAL FORM VILLA / GLAMPING / HOMESTAY                    */}
      {/* ========================================================= */}
      {villaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-sand-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-sand-100">
              <h3 className="font-serif font-bold text-lg text-brand-900">
                {editingVilla ? 'Edit Unit Akomodasi' : 'Tambah Unit Akomodasi Baru'}
              </h3>
              <button onClick={() => setVillaModalOpen(false)} className="text-sand-400 hover:text-sand-900">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSaveVilla} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Nama Unit *</label>
                <input
                  type="text"
                  required
                  value={villaForm.name}
                  onChange={e => setVillaForm({ ...villaForm, name: e.target.value })}
                  placeholder="Contoh: Sekala Pine Resort Villa"
                  className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* TIPE AKOMODASI */}
                <div>
                  <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Tipe Akomodasi *</label>
                  <select
                    value={villaForm.propertyType}
                    onChange={e => setVillaForm({ ...villaForm, propertyType: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs font-bold text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                  >
                    <option value="villa">🏰 Villa</option>
                    <option value="glamping">🏕️ Glamping</option>
                    <option value="homestay">🏠 Homestay Rombongan</option>
                  </select>
                </div>

                {/* KELAS HARGA */}
                <div>
                  <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Kategori Kelas *</label>
                  <select
                    value={villaForm.category}
                    onChange={e => setVillaForm({ ...villaForm, category: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs font-bold text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                  >
                    <option value="Budget">Budget Friendly</option>
                    <option value="Standard">Standard Pool</option>
                    <option value="Premium">Premium / Gathering</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Lokasi *</label>
                  <select
                    value={villaForm.location}
                    onChange={e => setVillaForm({ ...villaForm, location: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Tawangmangu">Tawangmangu</option>
                    <option value="Yogyakarta">Yogyakarta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Kapasitas Pax *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={villaForm.capacity}
                    onChange={e => setVillaForm({ ...villaForm, capacity: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Jml Kamar</label>
                  <input
                    type="number"
                    min="1"
                    value={villaForm.bedrooms}
                    onChange={e => setVillaForm({ ...villaForm, bedrooms: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Harga / Malam *</label>
                  <input
                    type="number"
                    required
                    min="100000"
                    step="50000"
                    value={villaForm.price}
                    onChange={e => setVillaForm({ ...villaForm, price: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs font-bold text-brand-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Badge Tag Promo (Opsional)</label>
                  <input
                    type="text"
                    value={villaForm.badge}
                    onChange={e => setVillaForm({ ...villaForm, badge: e.target.value })}
                    placeholder="Contoh: Best Seller / View Kebun Teh / Free BBQ"
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-sand-800 mb-1">
                    Nomor WhatsApp Khusus Unit Ini (Opsional)
                  </label>
                  <input
                    type="text"
                    value={villaForm.whatsapp || ''}
                    onChange={e => setVillaForm({ ...villaForm, whatsapp: e.target.value })}
                    placeholder="Contoh: 6281234567890 (Kosongkan jika ikut nomor daerah)"
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                  <span className="text-[10px] text-sand-500 mt-0.5 block">Jika diisi, pesan booking unit ini akan langsung masuk ke nomor ini</span>
                </div>
              </div>

              {/* Checklist Fasilitas */}
              <div>
                <label className="block text-xs font-bold uppercase text-sand-800 mb-2">Pilih Fasilitas</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Private Pool', 'View Gunung', 'View Kebun Teh', 'Karaoke', 'Free Water Heater', 'Wifi 100Mbps', 'Garden BBQ Area', 'Dapur Ringkas', 'Parkir Luas'].map(f => {
                    const checked = villaForm.features.includes(f);
                    return (
                      <label key={f} className="flex items-center gap-2 p-2 rounded-xl bg-sand-50 border border-sand-200 text-xs font-medium cursor-pointer hover:bg-sand-100">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleFeature(f)}
                          className="rounded text-brand-900"
                        />
                        <span>{f}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-sand-800 mb-1">URL Galeri Foto (1 Baris = 1 URL, Rasio 1:1) *</label>
                <textarea
                  rows="3"
                  required
                  value={villaForm.imagesText}
                  onChange={e => setVillaForm({ ...villaForm, imagesText: e.target.value })}
                  placeholder="https://images.unsplash.com/...&#10;https://images.unsplash.com/..."
                  className="w-full bg-sand-50 border border-sand-200 rounded-xl p-3 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Deskripsi Singkat *</label>
                <textarea
                  rows="3"
                  required
                  value={villaForm.desc}
                  onChange={e => setVillaForm({ ...villaForm, desc: e.target.value })}
                  className="w-full bg-sand-50 border border-sand-200 rounded-xl p-3 text-xs leading-relaxed"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-sand-100">
                <button
                  type="button"
                  onClick={() => setVillaModalOpen(false)}
                  className="bg-sand-200 text-sand-800 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-sand-300 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-brand-900 hover:bg-brand-800 text-amber-300 font-bold text-xs px-6 py-2.5 rounded-xl shadow transition"
                >
                  Simpan Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL FORM BANNER SLIDER                                  */}
      {/* ========================================================= */}
      {bannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-sand-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-sand-100">
              <h3 className="font-serif font-bold text-lg text-brand-900">
                {editingBanner ? 'Edit Banner Slider' : 'Tambah Banner Slider'}
              </h3>
              <button onClick={() => setBannerModalOpen(false)} className="text-sand-400 hover:text-sand-900">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4">
              {/* Gambar: Upload File atau Masukkan URL */}
              <div>
                <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Pilih File Gambar Banner</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerFileUpload}
                  className="w-full bg-sand-50 border border-sand-200 rounded-xl p-2 text-xs"
                />
                <p className="text-[10px] text-sand-500 mt-1">Atau masukkan URL gambar langsung di bawah ini:</p>
                <input
                  type="url"
                  value={bannerForm.imageUrl}
                  onChange={e => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs mt-1"
                />
              </div>

              {bannerForm.imageUrl && (
                <div className="h-32 rounded-2xl overflow-hidden border border-sand-200 bg-sand-100">
                  <img src={bannerForm.imageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Mode Teks */}
              <div className="flex items-center gap-2 p-3 bg-sand-50 rounded-xl border border-sand-200">
                <input
                  type="checkbox"
                  id="bannerHasText"
                  checked={bannerForm.hasText}
                  onChange={e => setBannerForm({ ...bannerForm, hasText: e.target.checked })}
                  className="rounded text-brand-900"
                />
                <label htmlFor="bannerHasText" className="text-xs font-bold text-brand-900 cursor-pointer">
                  Tampilkan Teks Judul & Tombol di Atas Banner
                </label>
              </div>

              {bannerForm.hasText && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Badge Teks (Opsional)</label>
                    <input
                      type="text"
                      value={bannerForm.badge}
                      onChange={e => setBannerForm({ ...bannerForm, badge: e.target.value })}
                      placeholder="PROMO WEEKEND SPESIAL"
                      className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Headline Utama</label>
                    <input
                      type="text"
                      value={bannerForm.title}
                      onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })}
                      placeholder="Liburan Nyaman Rasa Rumah Sendiri."
                      className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Subteks Deskripsi</label>
                    <textarea
                      rows="2"
                      value={bannerForm.subtitle}
                      onChange={e => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                      className="w-full bg-sand-50 border border-sand-200 rounded-xl p-3 text-xs leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Teks Tombol</label>
                      <input
                        type="text"
                        value={bannerForm.btnText}
                        onChange={e => setBannerForm({ ...bannerForm, btnText: e.target.value })}
                        placeholder="Cek Unit"
                        className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Link Tombol</label>
                      <input
                        type="text"
                        value={bannerForm.btnLink}
                        onChange={e => setBannerForm({ ...bannerForm, btnLink: e.target.value })}
                        placeholder="#katalog"
                        className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-2 justify-end pt-2 border-t border-sand-100">
                <button
                  type="button"
                  onClick={() => setBannerModalOpen(false)}
                  className="bg-sand-200 text-sand-800 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-sand-300 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-brand-900 hover:bg-brand-800 text-amber-300 font-bold text-xs px-6 py-2.5 rounded-xl shadow transition"
                >
                  Simpan Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ========================================================= */}
      {/* MODAL ARTIKEL & HALAMAN WISATA                            */}
      {/* ========================================================= */}
      {articleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-sand-200 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-sand-100">
              <h3 className="font-serif font-bold text-lg text-brand-900">
                {editingArticle ? 'Edit Artikel Wisata' : 'Tulis Artikel / Halaman Baru'}
              </h3>
              <button
                onClick={() => setArticleModalOpen(false)}
                className="w-8 h-8 rounded-full bg-sand-100 text-sand-800 hover:bg-sand-200 flex items-center justify-center transition"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Judul Artikel *</label>
                <input
                  type="text"
                  required
                  value={articleForm.title}
                  onChange={e => setArticleForm({ ...articleForm, title: e.target.value })}
                  placeholder="Contoh: 5 Rekomendasi Villa Private Pool di Tawangmangu untuk Gathering"
                  className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs font-bold text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Kategori Artikel *</label>
                  <select
                    value={articleForm.category}
                    onChange={e => setArticleForm({ ...articleForm, category: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs font-semibold text-brand-900"
                  >
                    <option value="Panduan Wisata">Panduan Wisata</option>
                    <option value="Rekomendasi Akomodasi">Rekomendasi Akomodasi</option>
                    <option value="Tips & Trik Staycation">Tips & Trik Staycation</option>
                    <option value="Promo & Berita">Promo & Berita</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Penulis / Author</label>
                  <input
                    type="text"
                    value={articleForm.author}
                    onChange={e => setArticleForm({ ...articleForm, author: e.target.value })}
                    placeholder="Admin Sekala"
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-sand-800 mb-1">
                  URL Foto Cover Artikel (Opsional - Post SEO Murni Teks)
                </label>
                <input
                  type="url"
                  value={articleForm.image}
                  onChange={e => setArticleForm({ ...articleForm, image: e.target.value })}
                  placeholder="Opsional (Kosongkan jika ingin postingan murni teks/judul tanpa thumbnail)"
                  className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-700 font-mono"
                />
              </div>

              {articleForm.image && (
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-sand-200 bg-sand-100 max-h-48">
                  <img src={articleForm.image} alt="Preview Cover" className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Ringkasan Singkat (Summary) *</label>
                <textarea
                  rows="2"
                  required
                  value={articleForm.summary}
                  onChange={e => setArticleForm({ ...articleForm, summary: e.target.value })}
                  placeholder="Ringkasan 1-2 kalimat yang tampil di kartu artikel..."
                  className="w-full bg-sand-50 border border-sand-200 rounded-xl p-3 text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Isi Lengkap Artikel *</label>
                <p className="text-[10px] text-sand-500 mb-1">Tuliskan konten artikel secara detail (bisa menggunakan spasi dan baris baru untuk paragraf).</p>
                <textarea
                  rows="8"
                  required
                  value={articleForm.content}
                  onChange={e => setArticleForm({ ...articleForm, content: e.target.value })}
                  placeholder="Tulis paragraf artikel disini..."
                  className="w-full bg-sand-50 border border-sand-200 rounded-xl p-3 text-xs leading-relaxed"
                />
              </div>

              {/* =================================================== */}
              {/* PANEL PENGATURAN SEO & SEARCH ENGINE OPTIMIZATION   */}
              {/* =================================================== */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs">
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                    <strong className="text-xs text-emerald-950 font-bold uppercase tracking-wide">
                      Pengaturan SEO Google (Search Engine Optimization)
                    </strong>
                  </div>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 font-extrabold px-2 py-0.5 rounded-full">
                    SEO Rank Booster
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-sand-800 mb-1">
                      Meta Title Google (Maks 60 Karakter)
                    </label>
                    <input
                      type="text"
                      value={articleForm.metaTitle}
                      onChange={e => setArticleForm({ ...articleForm, metaTitle: e.target.value })}
                      placeholder="Contoh: 7 Rekomendasi Villa Private Pool di Tawangmangu Murah | Sekala"
                      className="w-full bg-white border border-sand-300 rounded-xl px-3 py-2 text-xs font-semibold"
                    />
                    <div className="flex justify-between text-[10px] text-sand-500 mt-0.5">
                      <span>Judul yang muncul di hasil pencarian Google & tab browser</span>
                      <span className={(articleForm.metaTitle || '').length > 60 ? 'text-amber-600 font-bold' : 'text-sand-400'}>
                        {(articleForm.metaTitle || '').length} / 60
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-sand-800 mb-1">
                      Meta Description Google (Maks 155-160 Karakter)
                    </label>
                    <textarea
                      rows="2"
                      value={articleForm.metaDesc}
                      onChange={e => setArticleForm({ ...articleForm, metaDesc: e.target.value })}
                      placeholder="Ringkasan persuasif dengan kata kunci villa/glamping yang membuat orang klik di Google..."
                      className="w-full bg-white border border-sand-300 rounded-xl p-2.5 text-xs"
                    />
                    <div className="flex justify-between text-[10px] text-sand-500 mt-0.5">
                      <span>Snippet deskripsi yang muncul di bawah judul pada pencarian Google</span>
                      <span className={(articleForm.metaDesc || '').length > 160 ? 'text-amber-600 font-bold' : 'text-sand-400'}>
                        {(articleForm.metaDesc || '').length} / 160
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-sand-800 mb-1">
                        Fokus Kata Kunci (Keywords SEO)
                      </label>
                      <input
                        type="text"
                        value={articleForm.focusKeyword}
                        onChange={e => setArticleForm({ ...articleForm, focusKeyword: e.target.value })}
                        placeholder="villa tawangmangu, sewa villa private pool"
                        className="w-full bg-white border border-sand-300 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-sand-800 mb-1">
                        Perkiraan Durasi Baca (Reading Time)
                      </label>
                      <input
                        type="text"
                        value={articleForm.readingTime}
                        onChange={e => setArticleForm({ ...articleForm, readingTime: e.target.value })}
                        placeholder="3 Menit Baca"
                        className="w-full bg-white border border-sand-300 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-sand-800 mb-1">
                      Tag / Topik Terkait (Pisahkan dengan tanda koma)
                    </label>
                    <input
                      type="text"
                      value={articleForm.tagsText}
                      onChange={e => setArticleForm({ ...articleForm, tagsText: e.target.value })}
                      placeholder="Tawangmangu, Private Pool, BBQ, Keluarga"
                      className="w-full bg-white border border-sand-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  {/* PREVIEW HASIL GOOGLE SEARCH SNIPPET */}
                  <div className="bg-white rounded-xl p-3 border border-sand-200 mt-2">
                    <span className="text-[9px] font-extrabold uppercase text-sand-400 block mb-1">
                      Simulasi Preview di Google:
                    </span>
                    <span className="text-xs text-emerald-800 font-medium block truncate">
                      https://sekalavilla.com › artikel › {articleForm.title ? articleForm.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30) : 'judul-artikel'}
                    </span>
                    <h4 className="text-sm font-bold text-blue-700 hover:underline cursor-pointer leading-snug">
                      {articleForm.metaTitle || articleForm.title || 'Judul Artikel Anda di Google'}
                    </h4>
                    <p className="text-[11px] text-sand-600 line-clamp-2 mt-0.5">
                      {articleForm.metaDesc || articleForm.summary || 'Deskripsi meta artikel Anda akan ditampilkan seperti ini di hasil pencarian Google.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-sand-100">
                <button
                  type="button"
                  onClick={() => setArticleModalOpen(false)}
                  className="bg-sand-200 text-sand-800 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-sand-300 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-brand-900 hover:bg-brand-800 text-amber-300 font-bold text-xs px-6 py-2.5 rounded-xl shadow transition"
                >
                  Simpan Artikel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL AUTO SCRAPER GOOGLE MAPS                            */}
      {/* ========================================================= */}
      {scraperModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-sand-200 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-sand-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-amber-400 text-brand-900 flex items-center justify-center text-sm font-bold shadow">
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                </span>
                <div>
                  <h3 className="font-serif font-bold text-lg text-brand-900 leading-tight">
                    Tarik Data Otomatis dari Google Maps
                  </h3>
                  <p className="text-[10px] text-sand-600">Ekstrak nama, tipe, foto & fasilitas filter secara instan</p>
                </div>
              </div>
              <button 
                onClick={() => setScraperModalOpen(false)} 
                className="text-sand-400 hover:text-sand-900"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-sand-800 mb-1.5">
                  Link Google Maps atau Nama Tempat *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={scraperInput}
                    onChange={(e) => setScraperInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleRunScraper(); }}
                    placeholder="Contoh: The Noman Tawangmangu, Bilby Villa, atau paste link maps.app.goo.gl..."
                    className="flex-1 bg-sand-50 border border-sand-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    onClick={() => handleRunScraper()}
                    disabled={isScraping}
                    className="bg-amber-400 hover:bg-amber-500 disabled:bg-sand-200 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5 shrink-0"
                  >
                    {isScraping ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        <span>Menarik Data...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-bolt"></i>
                        <span>Tarik Data</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Contoh Cepat Klik 1 Kali */}
              <div>
                <span className="text-[10px] font-bold text-sand-500 block mb-1">
                  Atau klik contoh tempat populer di bawah:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'The Noman Tawangmangu',
                    'Bilby Villa Tawangmangu',
                    'Villa Nuansa Sekipan',
                    'Rumah Atsiri Glamping',
                    'Bohemian Jogja Villas',
                    'Ubu Villa Jogja',
                    'Barokah Homestay Tawangmangu'
                  ].map((example) => (
                    <button
                      key={example}
                      type="button"
                      onClick={() => {
                        setScraperInput(example);
                        handleRunScraper(example);
                      }}
                      className="bg-sand-100 hover:bg-sand-200 text-sand-800 text-[10px] font-semibold px-2.5 py-1 rounded-lg transition"
                    >
                      + {example}
                    </button>
                  ))}
                </div>
              </div>

              {scraperError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl font-medium flex items-center gap-2">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  <span>{scraperError}</span>
                </div>
              )}

              {/* HASIL PREVIEW SCRAPING */}
              {scrapedResult && (
                <div className="bg-sand-50 border border-amber-300 rounded-2xl p-4 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-sand-200 pb-2">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <i className="fa-solid fa-check"></i> Data Berhasil Diekstrak
                    </span>
                    <span className="text-xs font-bold text-amber-700">
                      ★ {scrapedResult.rating} Google Review
                    </span>
                  </div>

                  <div className="flex gap-3 items-start">
                    <img
                      src={scrapedResult.image}
                      alt={scrapedResult.name}
                      className="w-20 h-20 rounded-xl object-cover border border-sand-200 shrink-0"
                    />
                    <div className="space-y-1 min-w-0 flex-1">
                      <h4 className="font-serif font-bold text-sm text-brand-900 leading-tight">
                        {scrapedResult.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-sand-700">
                        <span className="font-bold text-brand-800">
                          {scrapedResult.propertyType === 'glamping' ? '🏕️ Glamping' : (scrapedResult.propertyType === 'homestay' ? '🏠 Homestay' : '🏰 Villa')}
                        </span>
                        <span>•</span>
                        <span>📍 {scrapedResult.location}</span>
                        <span>•</span>
                        <span>👥 {scrapedResult.capacity} Pax</span>
                      </div>
                    </div>
                  </div>

                  {/* Fasilitas Terdeteksi */}
                  <div>
                    <span className="text-[10px] font-bold text-sand-800 uppercase block mb-1">
                      Fasilitas Terdeteksi (Otomatis Masuk Filter):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {scrapedResult.features.map((f, i) => (
                        <span key={i} className="bg-emerald-700 text-white text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <i className="fa-solid fa-check text-[8px]"></i> {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Input Harga yang bisa disesuaikan sebelum simpan */}
                  <div className="pt-2 border-t border-sand-200 flex items-center justify-between gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-sand-800 block">
                        Harga Sewa / Malam
                      </label>
                      <input
                        type="number"
                        value={scrapedResult.price}
                        onChange={(e) => setScrapedResult({ ...scrapedResult, price: parseInt(e.target.value) || 0 })}
                        className="bg-white border border-sand-300 rounded-lg px-2.5 py-1 text-xs font-bold text-brand-900 w-36"
                      />
                    </div>
                    <button
                      onClick={handleSaveScrapedUnit}
                      className="bg-brand-900 hover:bg-brand-800 text-amber-300 font-bold text-xs px-5 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
                    >
                      <i className="fa-solid fa-floppy-disk"></i>
                      <span>Simpan ke Katalog</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
