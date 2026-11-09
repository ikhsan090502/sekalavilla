# SEKALA VILLA - WEB & MANAGEMENT SYSTEM

Proyek ini memiliki **2 Versi Lengkap**:
1. **Versi Vanilla JavaScript & HTML (Zero Dependency / Standalone)**
2. **Versi React JS (Vite + React Hooks + Component Architecture)**

---

## 🌟 1. Akses Langsung di Browser / Vercel

| Halaman | Deskripsi | Link Akses |
|---|---|---|
| **Landing Page (Vanilla JS)** | Versi cepat tanpa build, ringan & standalone | `/` (`index.html`) |
| **Admin Panel (Vanilla JS)** | Dashboard kelola banner, villa, template WA | `/admin` (`admin.html`) |
| **Landing Page (React JS)** | Versi modern SPA React dengan state management | `/react` |
| **API Docs** | Spesifikasi payload REST API Backend | `/api-docs` (`API_SPECIFICATION.md`) |

---

## ⚛️ 2. Cara Menjalankan Versi React JS di Komputer Lokal

Source code React terletak di dalam folder `react-version/`.

```bash
# 1. Masuk ke folder react-version
cd react-version

# 2. Install dependensi
npm install

# 3. Jalankan server development
npm run dev
```
Buka browser di `http://localhost:5173`.

### Build untuk Produksi
```bash
npm run build
```
Hasil build otomatis di-output ke folder `../react/` sehingga langsung tersambung dengan Vercel hosting.

---

## 🗂️ Struktur Proyek

```
sekalavilla/
├── index.html              # Landing Page utama (Versi Vanilla JavaScript)
├── admin.html              # Admin Control Panel (Versi Vanilla JavaScript)
├── API_SPECIFICATION.md    # Panduan lengkap endpoint REST API Backend
├── vercel.json             # Konfigurasi routing Vercel
├── react/                  # Hasil compile produksi React (Live di /react)
│   ├── index.html
│   └── assets/
└── react-version/          # Source Code React JS Lengkap
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx         # Komponen Utama
        ├── main.jsx
        ├── components/
        │   ├── Header.jsx
        │   ├── BannerSlider.jsx       # Slider banner (text/grafis murni)
        │   ├── SearchFilter.jsx       # Filter lokasi, tier & fasilitas
        │   ├── VillaCard.jsx          # Card villa harga ringkas
        │   ├── VillaDetailModal.jsx   # Modal popup foto 1:1 aspect ratio
        │   ├── AddonsSection.jsx      # Katalog BBQ, Jeep, PS, Catering
        │   ├── PromoModal.jsx         # Pop-up promo ADS voucher
        │   ├── MobileBottomNav.jsx    # Navigasi bawah khusus mobile
        │   └── Footer.jsx
        ├── pages/
        │   └── AdminDashboard.jsx     # Dashboard Admin React lengkap
        ├── data/
        │   └── initialData.js         # Master data default
        └── services/
            └── storage.js             # LocalStorage & API sync service
```

---

## 🔑 Login Admin Default
* **Username**: `admin`
* **Password**: `sekala2026`
