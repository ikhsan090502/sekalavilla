import React, { useState } from 'react';
import { ADDONS_DATA, formatRupiah } from '../data/initialData';

export default function AddonsSection({ settings }) {
  const [activeTab, setActiveTab] = useState('bbq');
  const [selectedAddon, setSelectedAddon] = useState(null);

  const currentData = ADDONS_DATA[activeTab];
  const phone = settings?.whatsappPhone || '6281381669735';

  const handleOrderWA = (addonName, price) => {
    const template = settings?.waTemplateAddon || 
      `Halo Admin Sekala Villa! 🖐️\nSaya mau pesan paket layanan:\n\n🎁 *Paket:* {addon_name}\n💰 *Harga:* {price}\n\nBoleh diinfokan alur pemesanan dan ketersediaannya kak? Terima kasih!`;

    const text = template
      .replace(/{addon_name}/g, addonName)
      .replace(/{price}/g, formatRupiah(price));

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="addons-section" className="bg-sand-100 py-12 sm:py-20 border-t border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <span className="bg-terracotta-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">Layanan Ekstra Liburan</span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-brand-900">Detail Katalog Add-Ons</h2>
          <p className="text-sand-800 text-xs sm:text-sm mt-2">Pilih kategori dibawah untuk melihat rincian isi menu, harga, & pesanan langsung via WhatsApp.</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 pb-2 border-b border-sand-200 justify-start sm:justify-center">
          {[
            { id: 'bbq', label: 'Katalog BBQ', icon: 'fa-fire-burner' },
            { id: 'jeep', label: 'Wisata Jeep', icon: 'fa-truck-monster' },
            { id: 'ps', label: 'Sewa PlayStation', icon: 'fa-gamepad' },
            { id: 'catering', label: 'Catering Prasmanan', icon: 'fa-utensils' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-brand-900 text-amber-300 shadow'
                  : 'bg-white text-sand-800 border border-sand-200 hover:bg-sand-200'
              }`}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Active Pane */}
        {currentData && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-sand-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-sand-800">
              <div>
                <strong className="font-bold text-brand-900 text-sm block">{currentData.title}</strong>
                <span>{currentData.subtitle}</span>
              </div>
              <span className="bg-amber-100 text-amber-900 font-extrabold px-3 py-1 rounded-lg shrink-0">{currentData.note}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentData.packages.map(pkg => (
                <div key={pkg.id} className="bg-white rounded-3xl p-5 border border-sand-200 shadow-sm flex flex-col justify-between space-y-4">
                  <div>
                    <span className="bg-sand-100 text-sand-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase block w-fit mb-2">
                      {pkg.tag}
                    </span>
                    <h3 className="font-bold text-brand-900 text-base">{pkg.name}</h3>
                    <p className="text-sand-800 text-xs mt-1 leading-relaxed">{pkg.summary}</p>
                  </div>

                  <div>
                    <div className="text-brand-800 font-extrabold text-base mb-3">{formatRupiah(pkg.price)}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setSelectedAddon(pkg)}
                        className="w-full bg-sand-200 hover:bg-sand-300 text-sand-900 font-bold text-xs py-2.5 rounded-xl transition"
                      >
                        Detail Isi
                      </button>
                      <button 
                        onClick={() => handleOrderWA(pkg.name, pkg.price)}
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 rounded-xl transition shadow flex items-center justify-center gap-1"
                      >
                        <i className="fa-brands fa-whatsapp"></i> Tanya WA
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Modal Detail Add-On */}
      {selectedAddon && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedAddon(null); }}
        >
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-sand-200 relative p-6 space-y-4">
            <button 
              onClick={() => setSelectedAddon(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-sand-200 text-sand-900 flex items-center justify-center font-bold"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>

            <div>
              <span className="bg-terracotta-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">Rincian Paket Add-On</span>
              <h3 className="font-serif text-xl font-bold text-brand-900 mt-2">{selectedAddon.name}</h3>
              <p className="text-xs text-sand-800 mt-1">{selectedAddon.summary}</p>
            </div>

            <div className="bg-sand-50 p-4 rounded-2xl border border-sand-200 space-y-2">
              <h4 className="font-bold text-xs uppercase text-brand-900 tracking-wider">Item Termasuk Dalam Paket:</h4>
              <ul className="space-y-1.5 text-xs text-sand-800">
                {selectedAddon.details.map((d, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <i className="fa-solid fa-circle-check text-emerald-600 mt-0.5"></i>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-sand-100">
              <div>
                <span className="text-[9px] uppercase font-bold text-sand-800 block">Harga Total Paket</span>
                <span className="text-base font-extrabold text-brand-800">{formatRupiah(selectedAddon.price)}</span>
              </div>
              <button 
                onClick={() => {
                  handleOrderWA(selectedAddon.name, selectedAddon.price);
                  setSelectedAddon(null);
                }}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
              >
                <i className="fa-brands fa-whatsapp text-sm"></i> Pesan via WA
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
