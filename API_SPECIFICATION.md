# SPESIFIKASI REST API - SEKALA VILLA SYSTEM

Dokumen ini adalah panduan lengkap kebutuhan Backend API untuk sistem Sekala Villa (Katalog, Banner Slider, Fasilitas, Add-ons, dan Pengaturan WhatsApp).

---

## 1. Arsitektur & Format Standar

- **Base URL**: `https://api.sekalavilla.com/v1` (contoh)
- **Format Payload**: `application/json`
- **Header Autentikasi Admin**: `Authorization: Bearer <JWT_TOKEN>`

### Standar Respons JSON
```json
// Berhasil
{
  "success": true,
  "message": "Operasi berhasil",
  "data": { ... }
}

// Gagal
{
  "success": false,
  "message": "Pesan error",
  "errors": [ ... ]
}
```

---

## 2. Modul Autentikasi Admin (Auth)

### `POST /api/auth/login`
Digunakan oleh Admin untuk masuk ke Dashboard.
- **Request Body**:
```json
{
  "username": "admin",
  "password": "secretpassword"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOi...",
    "admin": {
      "id": "adm_1",
      "username": "admin",
      "role": "superadmin"
    }
  }
}
```

### `GET /api/auth/me` *(Auth Required)*
Cek validitas token admin yang sedang aktif.

---

## 3. Modul Banner Iklan Slider (Banners)

Banner mendukung mode **gambar + teks** ATAU **banner grafis murni** (teks dikosongkan).

### `GET /api/banners`
Mengambil daftar banner aktif untuk slider di halaman depan.
- **Query Params**: `?active_only=true`
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "ban_1",
      "title": "Liburan Nyaman Rasa Rumah Sendiri", // Bisa null/kosong
      "subtitle": "Sewa villa private pool Tawangmangu & Jogja dengan fasilitas komplit.", // Bisa null/kosong
      "badge": "PROMO WEEKEND SPESIAL", // Bisa null/kosong
      "image_url": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1400",
      "has_text": true, // Boolean: jika false, hanya render gambar banner
      "button_text": "Cek Unit", // Opsional
      "button_link": "#katalog", // Opsional
      "order_index": 1,
      "is_active": true
    }
  ]
}
```

### `POST /api/banners` *(Auth Required)*
Menambah banner baru dari dashboard admin.

### `PUT /api/banners/:id` *(Auth Required)*
Memperbarui data banner.

### `DELETE /api/banners/:id` *(Auth Required)*
Menghapus banner.

---

## 4. Modul Katalog Villa (Villas)

### `GET /api/villas`
Mengambil daftar villa dengan dukungan filter.
- **Query Params**: 
  - `location`: "Tawangmangu" | "Yogyakarta" | "all"
  - `category`: "Budget" | "Standard" | "Premium" | "all"
  - `facility`: "Private Pool" | "View Gunung" (opsional)
  - `max_price`: 5000000
  - `capacity`: 8
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "villa_1",
      "name": "Sekala Pine Resort Villa",
      "category": "Premium", // Budget | Standard | Premium
      "location": "Tawangmangu",
      "capacity": 12,
      "bedrooms": 4,
      "price_start": 2500000,
      "rating": 4.9,
      "badge": "Best Seller",
      "images": [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
      ],
      "facilities": [
        "Private Pool",
        "View Gunung",
        "Karaoke",
        "Free Water Heater",
        "Wifi 100Mbps"
      ],
      "description": "Villa eksklusif dengan view pegunungan Lawu yang memukau...",
      "is_active": true
    }
  ]
}
```

### `GET /api/villas/:id`
Mengambil detail 1 villa untuk modal popup (1:1 aspect ratio gallery).

### `POST /api/villas` *(Auth Required)*
Menambah villa baru.

### `PUT /api/villas/:id` *(Auth Required)*
Update data villa.

### `DELETE /api/villas/:id` *(Auth Required)*
Hapus villa.

---

## 5. Modul Fasilitas (Facilities)

Daftar master fasilitas untuk filter di landing page dan form checkbox di dashboard admin.

### `GET /api/facilities`
- **Response**:
```json
{
  "success": true,
  "data": [
    { "id": "fac_1", "name": "Private Pool", "icon": "fa-water-ladder" },
    { "id": "fac_2", "name": "View Gunung", "icon": "fa-mountain-sun" },
    { "id": "fac_3", "name": "View Kebun Teh", "icon": "fa-leaf" },
    { "id": "fac_4", "name": "Karaoke", "icon": "fa-microphone" },
    { "id": "fac_5", "name": "Free Water Heater", "icon": "fa-temperature-arrow-up" },
    { "id": "fac_6", "name": "Wifi 100Mbps", "icon": "fa-wifi" },
    { "id": "fac_7", "name": "Area BBQ", "icon": "fa-fire-burner" }
  ]
}
```

---

## 6. Modul Pengaturan & Template WhatsApp (Settings)

Mengatur nomor WhatsApp Admin dan format template pesan yang dikirim ke WhatsApp saat tombol di-klik.

### `GET /api/settings`
- **Response**:
```json
{
  "success": true,
  "data": {
    "whatsapp_number": "6281381669735",
    "wa_template_villa": "Halo Admin Sekala Villa! 🖐️\nSaya tertarik booking:\n\n📌 *Villa:* {villa_name}\n🏷️ *Kategori:* {category}\n📍 *Lokasi:* {location}\n👥 *Kapasitas:* {capacity} Pax\n💰 *Harga Mulai:* {price_start}\n✨ *Fasilitas:* {facilities}\n\nApakah unit ini masih ready untuk jadwal saya kak?",
    "wa_template_addon": "Halo Admin Sekala Villa! 🖐️\nSaya mau pesan paket layanan:\n\n🎁 *Paket:* {addon_name}\n💰 *Harga:* {price}\n\nBoleh minta rincian pemesanan dan jadwalnya kak?",
    "wa_template_promo": "Halo Admin Sekala Villa! 🖐️\nSaya ingin klaim *Voucher Promo ADS (Kode: {promo_code})*:\n- Diskon sewa villa\n- Bonus alat BBQ\n\nBisa dibantu ketersediaannya kak?",
    "promo_code": "SEKALAADS150",
    "promo_discount": "Rp 150.000 + Free Alat BBQ"
  }
}
```

### `PUT /api/settings` *(Auth Required)*
Memperbarui nomor WA atau format template pesan. Variabel tag yang didukung:
- `{villa_name}` : Nama villa
- `{category}` : Kategori villa (Budget/Standard/Premium)
- `{location}` : Lokasi (Tawangmangu / Jogja)
- `{capacity}` : Kapasitas tamu
- `{price_start}` : Format rupiah harga
- `{facilities}` : Ringkasan fasilitas utama
