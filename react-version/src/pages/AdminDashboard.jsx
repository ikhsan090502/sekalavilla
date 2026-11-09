import React, { useState } from 'react';
import { storage } from '../services/storage';
import { formatRupiah, DEFAULT_BANNERS, DEFAULT_VILLAS, DEFAULT_SETTINGS } from '../data/initialData';

export default function AdminDashboard({ onBackToSite, onDataChanged }) {
  const [isLoggedIn, setIsLoggedIn] = useState(storage.isAuth());
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('sekala2026');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState('banners');
  const [toastMsg, setToastMsg] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // States
  const [banners, setBanners] = useState(storage.getBanners());
  const [villas, setVillas] = useState(storage.getVillas());
  const [settings, setSettings] = useState(storage.getSettings());

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

  // Villa Modal
  const [villaModalOpen, setVillaModalOpen] = useState(false);
  const [editingVilla, setEditingVilla] = useState(null);
  const [villaForm, setVillaForm] = useState({
    name: '',
    category: 'Standard',
    location: 'Tawangmangu',
    capacity: 8,
    bedrooms: 3,
    price: 1500000,
    rating: 4.8,
    badge: '',
    imagesText: '',
    features: ['Private Pool'],
    desc: ''
  });

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

  // BANNER ACTIONS
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
    setBannerForm({
      imageUrl: b.imageUrl,
      hasText: b.hasText !== false,
      badge: b.badge || '',
      title: b.title || '',
      subtitle: b.subtitle || '',
      btnText: b.btnText || '',
      btnLink: b.btnLink || ''
    });
    setBannerModalOpen(true);
  };

  const saveBanner = (e) => {
    e.preventDefault();
    let updated;
    if (editingBanner) {
      updated = banners.map(b => b.id === editingBanner.id ? { ...b, ...bannerForm } : b);
    } else {
      updated = [...banners, { id: 'ban-' + Date.now(), ...bannerForm }];
    }
    setBanners(updated);
    storage.saveBanners(updated);
    setBannerModalOpen(false);
    onDataChanged?.();
    triggerToast('Banner iklan berhasil disimpan!');
  };

  const deleteBanner = (id) => {
    if (!window.confirm('Hapus banner ini?')) return;
    const updated = banners.filter(b => b.id !== id);
    setBanners(updated);
    storage.saveBanners(updated);
    onDataChanged?.();
    triggerToast('Banner telah dihapus.');
  };

  // VILLA ACTIONS
  const openAddVilla = () => {
    setEditingVilla(null);
    setVillaForm({
      name: '',
      category: 'Standard',
      location: 'Tawangmangu',
      capacity: 8,
      bedrooms: 3,
      price: 1500000,
      rating: 4.8,
      badge: 'Rekomendasi',
      imagesText: '',
      features: ['Private Pool', 'View Gunung'],
      desc: ''
    });
    setVillaModalOpen(true);
  };

  const openEditVilla = (v) => {
    setEditingVilla(v);
    setVillaForm({
      name: v.name,
      category: v.category || 'Standard',
      location: v.location,
      capacity: v.capacity,
      bedrooms: v.bedrooms,
      price: v.price,
      rating: v.rating,
      badge: v.badge || '',
      imagesText: (v.images || [v.image]).join('\n'),
      features: v.features || [],
      desc: v.desc || ''
    });
    setVillaModalOpen(true);
  };

  const saveVilla = (e) => {
    e.preventDefault();
    const imgs = villaForm.imagesText.split('\n').map(s => s.trim()).filter(Boolean);
    const data = {
      name: villaForm.name.trim(),
      category: villaForm.category,
      location: villaForm.location,
      capacity: parseInt(villaForm.capacity),
      bedrooms: parseInt(villaForm.bedrooms),
      price: parseInt(villaForm.price),
      rating: parseFloat(villaForm.rating) || 4.8,
      badge: villaForm.badge.trim(),
      image: imgs[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      images: imgs.length ? imgs : ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'],
      features: villaForm.features,
      desc: villaForm.desc.trim()
    };

    let updated;
    if (editingVilla) {
      updated = villas.map(v => v.id === editingVilla.id ? { ...v, ...data } : v);
    } else {
      updated = [...villas, { id: 'sekala-' + Date.now(), ...data }];
    }
    setVillas(updated);
    storage.saveVillas(updated);
    setVillaModalOpen(false);
    onDataChanged?.();
    triggerToast('Katalog villa berhasil disimpan!');
  };

  const deleteVilla = (id) => {
    if (!window.confirm('Hapus unit villa ini?')) return;
    const updated = villas.filter(v => v.id !== id);
    setVillas(updated);
    storage.saveVillas(updated);
    onDataChanged?.();
    triggerToast('Unit villa telah dihapus.');
  };

  // WHATSAPP SETTINGS
  const saveWA = () => {
    storage.saveSettings(settings);
    onDataChanged?.();
    triggerToast('Format pesan WhatsApp berhasil disimpan!');
  };

  const insertTag = (tag) => {
    setSettings(prev => ({
      ...prev,
      waTemplateVilla: prev.waTemplateVilla + ' ' + tag
    }));
  };

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-brand-900 via-brand-800 to-sand-900">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-sand-200">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-brand-900 text-amber-300 flex items-center justify-center text-2xl font-serif font-bold mx-auto mb-3 shadow">
              S
            </div>
            <h1 className="font-serif text-2xl font-bold text-brand-900">Sekala Villa Admin</h1>
            <p className="text-xs text-sand-800 mt-1">Kelola katalog, banner iklan slider & template WhatsApp</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-sand-50 border border-sand-200 rounded-xl text-xs font-medium text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-sand-50 border border-sand-200 rounded-xl text-xs font-medium text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
              />
              <span className="text-[10px] text-sand-800/80 mt-1 block">Default: <strong>admin</strong> / <strong>sekala2026</strong></span>
            </div>

            {loginError && (
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold text-center border border-rose-200">
                Username atau password salah!
              </div>
            )}

            <button type="submit" className="w-full bg-brand-900 hover:bg-brand-800 text-amber-300 font-bold py-3 rounded-xl transition shadow text-xs uppercase tracking-wider flex items-center justify-center gap-2">
              <i className="fa-solid fa-arrow-right-to-bracket"></i> Masuk Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-sand-200 text-center">
            <button onClick={onBackToSite} className="text-xs text-brand-700 font-bold hover:underline">
              <i className="fa-solid fa-arrow-left me-1"></i> Kembali ke Website Utama
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SIDEBAR LABELS
  const TAB_LABELS = {
    banners: { label: 'Banner Iklan Slider', icon: 'fa-image' },
    villas: { label: 'Katalog Villa', icon: 'fa-house-chimney' },
    whatsapp: { label: 'Custom Teks WA', icon: 'fa-brands fa-whatsapp' },
    api: { label: 'Kebutuhan REST API', icon: 'fa-code' }
  };

  // DASHBOARD MAIN WITH SIDEBAR LAYOUT
  return (
    <div className="min-h-screen flex bg-sand-100 text-sand-900">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-4 z-50 bg-emerald-800 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-600">
          <i className="fa-solid fa-circle-check text-amber-300 text-base"></i>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR NAVIGASI KIRI */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-brand-900 text-white flex flex-col justify-between shadow-2xl transition-transform duration-300 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} shrink-0`}>
        <div>
          {/* Header Brand */}
          <div className="p-6 border-b border-brand-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-brand-900 flex items-center justify-center text-xl font-serif font-bold shadow">
                S
              </div>
              <div>
                <div className="font-serif font-bold text-lg tracking-tight leading-none text-white">SEKALA VILLA</div>
                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block mt-1">Admin Panel (Sidebar)</span>
              </div>
            </div>
            <button 
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-sand-200 hover:text-white text-lg p-1"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Admin Profile Box */}
          <div className="p-4 mx-4 mt-4 bg-brand-800/70 border border-brand-700/60 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center text-sm font-bold">
              <i className="fa-solid fa-user-shield"></i>
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">Administrator</span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Online
              </span>
            </div>
          </div>

          {/* Sidebar Menu Items */}
          <nav className="p-4 space-y-1.5 mt-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-sand-200/50 px-3 py-1">Menu Utama</div>

            {[
              { id: 'banners', label: 'Banner Iklan Slider', icon: 'fa-image' },
              { id: 'villas', label: 'Katalog Villa', icon: 'fa-house-chimney' },
              { id: 'whatsapp', label: 'Custom Teks WA', icon: 'fa-brands fa-whatsapp' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMobileSidebarOpen(false); }}
                className={`w-full px-4 py-3 rounded-2xl transition flex items-center gap-3 text-xs font-bold ${
                  activeTab === tab.id
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-sand-200 hover:bg-white/10'
                }`}
              >
                <i className={`fa-solid ${tab.icon} text-sm w-5`}></i>
                <span>{tab.label}</span>
              </button>
            ))}

            <div className="text-[10px] font-bold uppercase tracking-wider text-sand-200/50 px-3 pt-4 py-1">Developer</div>

            <button
              onClick={() => { setActiveTab('api'); setMobileSidebarOpen(false); }}
              className={`w-full px-4 py-3 rounded-2xl transition flex items-center gap-3 text-xs font-bold ${
                activeTab === 'api'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-sand-200 hover:bg-white/10'
              }`}
            >
              <i className="fa-solid fa-code text-sm w-5"></i>
              <span>Kebutuhan REST API</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-brand-800 space-y-2">
          <button 
            onClick={onBackToSite}
            className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-3 rounded-2xl transition flex items-center justify-between border border-white/10"
          >
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-arrow-up-right-from-square text-amber-300"></i>
              <span>Kembali ke Web</span>
            </span>
            <i className="fa-solid fa-chevron-right text-[10px] text-sand-200/60"></i>
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold px-4 py-3 rounded-2xl transition flex items-center gap-2 justify-center shadow"
          >
            <i className="fa-solid fa-power-off"></i>
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-sand-200 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between lg:justify-end shadow-sm">
          <div className="flex items-center gap-3 lg:hidden">
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 text-brand-900 text-xl rounded-xl hover:bg-sand-100 transition"
            >
              <i className="fa-solid fa-bars-staggered"></i>
            </button>
            <span className="font-serif font-bold text-brand-900 text-sm">Sekala Admin</span>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-sand-800">
            <span className="bg-sand-100 text-brand-900 px-3 py-1.5 rounded-xl font-bold hidden sm:inline-block border border-sand-200">
              <i className={`fa-solid ${TAB_LABELS[activeTab]?.icon || 'fa-sliders'} me-1 text-terracotta-500`}></i>
              {TAB_LABELS[activeTab]?.label || 'Dashboard'}
            </span>
            <button 
              onClick={onBackToSite}
              className="text-brand-800 hover:text-brand-900 font-bold flex items-center gap-1.5"
            >
              <i className="fa-solid fa-globe text-emerald-600"></i>
              <span className="hidden sm:inline">Pratinjau Web</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-6xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6 flex-1">
          
          {/* TAB 1: BANNERS */}
          {activeTab === 'banners' && (
            <div className="space-y-6">
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sand-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-900">Kelola Banner Iklan Slider</h2>
                  <p className="text-xs text-sand-800 mt-1">Dukung banner <strong>gambar + teks</strong> atau <strong>banner grafis murni</strong> (teks kosong).</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={openAddBanner} className="bg-brand-900 hover:bg-brand-800 text-amber-300 font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2">
                    <i className="fa-solid fa-plus"></i> Tambah Banner
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Reset banner ke default?')) {
                        setBanners(DEFAULT_BANNERS);
                        storage.saveBanners(DEFAULT_BANNERS);
                        onDataChanged?.();
                      }
                    }}
                    className="bg-sand-200 hover:bg-sand-300 text-sand-900 font-bold text-xs px-3 py-2.5 rounded-xl transition"
                  >
                    <i className="fa-solid fa-rotate-left"></i>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {banners.map((b, idx) => (
                  <div key={b.id || idx} className="bg-white rounded-3xl border border-sand-200 overflow-hidden shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="relative h-44 bg-brand-900 overflow-hidden">
                        <img src={b.imageUrl} alt="Banner" className="w-full h-full object-cover" />
                        {b.hasText ? (
                          <div className="absolute inset-0 bg-brand-900/60 p-4 flex flex-col justify-end text-white">
                            {b.badge && <span className="bg-amber-400 text-slate-950 text-[9px] font-extrabold px-2 py-0.5 rounded-full w-fit mb-1">{b.badge}</span>}
                            <h4 className="font-serif font-bold text-sm leading-tight text-white">{b.title}</h4>
                            <p className="text-[10px] text-sand-200 line-clamp-2 mt-0.5">{b.subtitle}</p>
                          </div>
                        ) : (
                          <div className="absolute top-2 right-2 bg-slate-950/70 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Banner Grafis Murni
                          </div>
                        )}
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-brand-900">
                          <span>Slide #{idx + 1}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] ${b.hasText ? 'text-emerald-700 bg-emerald-50' : 'text-amber-800 bg-amber-50'}`}>
                            {b.hasText ? 'Teks Aktif' : 'Grafis Murni'}
                          </span>
                        </div>
                        <p className="text-[10px] text-sand-800 font-mono truncate">{b.imageUrl}</p>
                      </div>
                    </div>
                    <div className="p-4 pt-0 border-t border-sand-100 flex items-center justify-end gap-2">
                      <button onClick={() => openEditBanner(b)} className="bg-sand-200 hover:bg-sand-300 text-sand-900 font-bold text-xs px-3 py-1.5 rounded-lg transition">
                        <i className="fa-solid fa-pen-to-square me-1"></i> Edit
                      </button>
                      <button onClick={() => deleteBanner(b.id)} className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs px-3 py-1.5 rounded-lg transition">
                        <i className="fa-solid fa-trash me-1"></i> Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: VILLAS */}
          {activeTab === 'villas' && (
            <div className="space-y-6">
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sand-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-900">Kelola Katalog Villa</h2>
                  <p className="text-xs text-sand-800 mt-1">Kategori tier (Budget / Standard / Premium), checklist fasilitas, dan foto galeri 1:1.</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={openAddVilla} className="bg-brand-900 hover:bg-brand-800 text-amber-300 font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2">
                    <i className="fa-solid fa-plus"></i> Tambah Villa Baru
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {villas.map(v => (
                  <div key={v.id} className="bg-white rounded-3xl border border-sand-200 overflow-hidden shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="relative aspect-square bg-sand-200 overflow-hidden">
                        <img src={v.image || (v.images && v.images[0])} alt={v.name} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 bg-brand-900 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                          {v.category || 'Standard'}
                        </span>
                        <span className="absolute top-3 right-3 bg-white/90 text-sand-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <i className="fa-solid fa-star text-amber-500"></i> {v.rating}
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-serif font-bold text-base text-brand-900 leading-snug">{v.name}</h3>
                        <div className="flex items-center gap-3 text-xs text-sand-800">
                          <span><i className="fa-solid fa-location-dot text-emerald-600 me-1"></i> ${v.location}</span>
                          <span><i className="fa-solid fa-users text-brand-700 me-1"></i> {v.capacity} Pax</span>
                        </div>
                        <div className="pt-2 text-xs">
                          <span className="text-[10px] uppercase font-bold text-sand-800 block">Mulai Dari</span>
                          <strong className="text-sm font-extrabold text-brand-800">{formatRupiah(v.price)}</strong> / malam
                        </div>
                      </div>
                    </div>
                    <div className="p-4 pt-0 border-t border-sand-100 flex items-center justify-end gap-2">
                      <button onClick={() => openEditVilla(v)} className="bg-sand-200 hover:bg-sand-300 text-sand-900 font-bold text-xs px-3 py-1.5 rounded-lg transition">
                        <i className="fa-solid fa-pen-to-square me-1"></i> Edit
                      </button>
                      <button onClick={() => deleteVilla(v.id)} className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs px-3 py-1.5 rounded-lg transition">
                        <i className="fa-solid fa-trash me-1"></i> Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WHATSAPP */}
          {activeTab === 'whatsapp' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-sand-200 shadow-sm space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Nomor WhatsApp Admin</label>
                  <input
                    type="text"
                    value={settings.whatsappPhone}
                    onChange={e => setSettings({ ...settings, whatsappPhone: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs font-bold text-sand-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Template Pesan Pemesanan Villa</label>
                  <textarea
                    rows="7"
                    value={settings.waTemplateVilla}
                    onChange={e => setSettings({ ...settings, waTemplateVilla: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl p-3 text-xs font-mono text-sand-900 leading-relaxed"
                  />
                  <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] font-bold text-sand-800">Sisip tag:</span>
                    {['{villa_name}', '{category}', '{location}', '{capacity}', '{price_start}', '{facilities}'].map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => insertTag(tag)}
                        className="bg-sand-200 hover:bg-sand-300 text-sand-900 text-[10px] font-bold px-2 py-1 rounded-lg"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={saveWA} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-3 rounded-xl shadow">
                  <i className="fa-solid fa-floppy-disk me-1"></i> Simpan Format WA
                </button>
              </div>

              <div className="bg-sand-50 p-6 rounded-3xl border border-sand-200 shadow-sm">
                <span className="font-bold text-xs uppercase tracking-wider text-brand-900 block mb-3">Live Simulation</span>
                <div className="bg-emerald-100/50 border border-emerald-200 rounded-2xl p-4 text-xs font-sans text-sand-900 whitespace-pre-line leading-relaxed shadow-inner">
                  {settings.waTemplateVilla
                    .replace(/{villa_name}/g, villas[0]?.name || 'Sekala Villa')
                    .replace(/{category}/g, villas[0]?.category || 'Premium')
                    .replace(/{location}/g, villas[0]?.location || 'Tawangmangu')
                    .replace(/{capacity}/g, villas[0]?.capacity || '12')
                    .replace(/{price_start}/g, formatRupiah(villas[0]?.price || 2500000))
                    .replace(/{facilities}/g, (villas[0]?.features || []).join(', '))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: API */}
          {activeTab === 'api' && (
            <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-sm space-y-4">
              <h2 className="font-serif text-2xl font-bold text-brand-900">Kebutuhan Endpoint Backend REST API</h2>
              <p className="text-xs text-sand-800">
                Dokumen spesifikasi teknis lengkap telah tersedia di repository pada file <code className="bg-sand-100 px-2 py-1 rounded font-mono font-bold">API_SPECIFICATION.md</code>.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Modal Add/Edit Banner */}
      {bannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4">
            <h3 className="font-serif text-xl font-bold text-brand-900">
              {editingBanner ? 'Edit Banner Slider' : 'Tambah Banner Baru'}
            </h3>
            <form onSubmit={saveBanner} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-sand-800 mb-1">URL Gambar Banner *</label>
                <input
                  type="url"
                  required
                  value={bannerForm.imageUrl}
                  onChange={e => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                  className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="bg-sand-50 p-3 rounded-xl border border-sand-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-brand-900 block">Tampilkan Teks Pada Banner?</span>
                  <span className="text-[10px] text-sand-800">Matikan jika banner sudah memiliki teks grafis sendiri.</span>
                </div>
                <input
                  type="checkbox"
                  checked={bannerForm.hasText}
                  onChange={e => setBannerForm({ ...bannerForm, hasText: e.target.checked })}
                  className="accent-brand-700 w-5 h-5 cursor-pointer"
                />
              </div>

              {bannerForm.hasText && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Badge Atas</label>
                    <input
                      type="text"
                      value={bannerForm.badge}
                      onChange={e => setBannerForm({ ...bannerForm, badge: e.target.value })}
                      className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Judul Utama</label>
                    <input
                      type="text"
                      value={bannerForm.title}
                      onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })}
                      className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Sub-judul</label>
                    <textarea
                      rows="2"
                      value={bannerForm.subtitle}
                      onChange={e => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                      className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setBannerModalOpen(false)} className="bg-sand-200 text-sand-800 font-bold text-xs px-4 py-2 rounded-xl">Batal</button>
                <button type="submit" className="bg-brand-900 text-amber-300 font-bold text-xs px-5 py-2 rounded-xl shadow">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add/Edit Villa */}
      {villaModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="font-serif text-xl font-bold text-brand-900">
              {editingVilla ? 'Edit Unit Villa' : 'Tambah Villa Baru'}
            </h3>
            <form onSubmit={saveVilla} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Nama Villa *</label>
                  <input
                    type="text"
                    required
                    value={villaForm.name}
                    onChange={e => setVillaForm({ ...villaForm, name: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Kategori *</label>
                  <select
                    value={villaForm.category}
                    onChange={e => setVillaForm({ ...villaForm, category: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    <option value="Budget">Budget</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Lokasi</label>
                  <select
                    value={villaForm.location}
                    onChange={e => setVillaForm({ ...villaForm, location: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="Tawangmangu">Tawangmangu</option>
                    <option value="Yogyakarta">Yogyakarta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Kapasitas</label>
                  <input
                    type="number"
                    value={villaForm.capacity}
                    onChange={e => setVillaForm({ ...villaForm, capacity: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Harga Mulai</label>
                  <input
                    type="number"
                    value={villaForm.price}
                    onChange={e => setVillaForm({ ...villaForm, price: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-sand-800 mb-1">URL Galeri Foto (1 Baris = 1 URL, Rasio 1:1) *</label>
                <textarea
                  rows="3"
                  required
                  value={villaForm.imagesText}
                  onChange={e => setVillaForm({ ...villaForm, imagesText: e.target.value })}
                  className="w-full bg-sand-50 border border-sand-200 rounded-xl p-3 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-sand-800 mb-1">Deskripsi *</label>
                <textarea
                  rows="3"
                  required
                  value={villaForm.desc}
                  onChange={e => setVillaForm({ ...villaForm, desc: e.target.value })}
                  className="w-full bg-sand-50 border border-sand-200 rounded-xl p-3 text-xs"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setVillaModalOpen(false)} className="bg-sand-200 text-sand-800 font-bold text-xs px-4 py-2 rounded-xl">Batal</button>
                <button type="submit" className="bg-brand-900 text-amber-300 font-bold text-xs px-5 py-2 rounded-xl shadow">Simpan Villa</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
