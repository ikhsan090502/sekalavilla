import React from 'react';

export default function PromoModal({ isOpen, onClose, settings }) {
  if (!isOpen) return null;

  const phone = settings?.whatsappPhone || '6281381669735';

  const copyCode = () => {
    navigator.clipboard?.writeText('SEKALAADS150');
    alert("Kode Promo SEKALAADS150 berhasil disalin!");
  };

  const claimPromo = () => {
    const text = `Halo Admin Sekala Villa! 🖐️\nSaya dapat info dari website dan ingin klaim *Voucher Promo ADS (Kode: SEKALAADS150)*:\n\n- Potongan Rp 150.000\n- Bonus Free Alat BBQ Set\n\nBisa dibantu informasi tanggal villa yang masih ready kak? Terima kasih!`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-sand-50 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-sand-200 relative">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white flex items-center justify-center font-bold backdrop-blur transition"
        >
          <i className="fa-solid fa-xmark text-base"></i>
        </button>

        <div className="relative h-52 bg-brand-900 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80" 
            alt="Promo" 
            className="w-full h-full object-cover opacity-60" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-transparent to-transparent"></div>
          <div className="absolute top-4 left-4">
            <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
              <i className="fa-solid fa-bolt me-1"></i> SPECIAL ADS PROMO
            </span>
          </div>
          <div className="absolute bottom-3 left-4 right-4">
            <span className="text-amber-300 text-xs font-bold uppercase tracking-widest block">Terbatas Untuk 10 Pemesan Pertama</span>
            <h3 className="font-serif text-2xl font-bold text-white leading-tight">Diskon Rp 150.000 + Free Alat BBQ Set!</h3>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sand-800 text-xs leading-relaxed">
            Khusus booking minggu ini melalui website resmi Sekala Villa! Dapatkan potongan langsung sewa villa di <strong>Tawangmangu & Jogja</strong> plus gratis peminjaman set grill BBQ portable.
          </p>

          <div className="bg-amber-100/70 border border-amber-300/80 rounded-2xl p-3 flex items-center justify-between text-amber-950">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-ticket-simple text-amber-700 text-xl"></i>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-800 block">Kode Promo Ads</span>
                <strong className="font-mono text-sm font-bold tracking-wider">SEKALAADS150</strong>
              </div>
            </div>
            <button 
              onClick={copyCode}
              className="bg-amber-400 hover:bg-amber-500 text-amber-950 text-[10px] font-bold px-3 py-1.5 rounded-xl transition"
            >
              Salin Kode
            </button>
          </div>

          <div className="pt-1 space-y-2">
            <button 
              onClick={claimPromo}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3.5 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
            >
              <i className="fa-brands fa-whatsapp text-lg"></i> Klaim Vocher Promo via WA
            </button>
            <button 
              onClick={onClose}
              className="w-full text-sand-800 hover:text-sand-900 font-semibold text-xs py-1 transition text-center block"
            >
              Nanti Saja, Lihat Katalog Dulu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
