import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-sand-200 pt-10 pb-6 border-t border-brand-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 text-xs">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <div className="w-7 h-7 rounded bg-amber-400 text-brand-900 font-serif font-bold flex items-center justify-center">S</div>
              <span className="font-serif text-lg font-bold text-white">SEKALA VILLA</span>
            </div>
            <p className="text-sand-200/80">Layanan agen & manajemen villa terpercaya area Tawangmangu & Yogyakarta.</p>
          </div>
          <div>
            <h4 className="font-bold text-white uppercase mb-2">Cakupan Destinasi</h4>
            <p className="text-sand-200/80">Tawangmangu • Kemuning • Kaliurang • Kota Jogja</p>
          </div>
          <div>
            <h4 className="font-bold text-white uppercase mb-2">Kontak Reservasi</h4>
            <p className="text-sand-200/80">WhatsApp CS: +62 813-8166-9735</p>
          </div>
        </div>

        <div className="border-t border-brand-800 pt-4 text-center text-[10px] text-sand-200/60">
          &copy; 2026 Sekala Villa Management. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
