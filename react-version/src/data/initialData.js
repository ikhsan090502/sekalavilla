export const DEFAULT_BANNERS = [
  {
    id: 'ban-1',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=80',
    hasText: true,
    badge: 'PROMO WEEKEND SPESIAL',
    title: 'Liburan Nyaman Rasa Rumah Sendiri.',
    subtitle: 'Sewa villa private pool Tawangmangu & Jogja dengan fasilitas komplit. Bisa tambah paket BBQ siap bakar, Jeep tour Kemuning, & sewa PS5!',
    btnText: 'Cek Unit Tawangmangu',
    btnLink: '#katalog'
  },
  {
    id: 'ban-2',
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1400&q=80',
    hasText: true,
    badge: 'EXTRA BONUS BBQ',
    title: 'Paket Staycation & Tour Jeep Kemuning',
    subtitle: 'Pilihan villa estetik dingin pegunungan & suasana syahdu Jogja. Booking sekarang gratis peminjaman alat panggang BBQ portable.',
    btnText: 'Tanya Jadwal WA',
    btnLink: 'https://wa.me/6281381669735'
  }
];

export const DEFAULT_VILLAS = [
  {
    id: 'sekala-1',
    name: 'Sekala Pine Resort Villa',
    category: 'Premium',
    location: 'Tawangmangu',
    capacity: 12,
    bedrooms: 4,
    price: 2500000,
    rating: 4.9,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80',
    ],
    features: ['Private Pool', 'View Gunung', 'Karaoke', 'Free Water Heater'],
    desc: 'Villa eksklusif dengan view pegunungan Lawu yang memukau. Cocok untuk gathering keluarga besar atau rombongan dengan fasilitas lengkap termasuk private pool, karaoke, dan water heater gratis.'
  },
  {
    id: 'sekala-2',
    name: 'Villa Sekala Heritage Jogja',
    category: 'Standard',
    location: 'Yogyakarta',
    capacity: 8,
    bedrooms: 3,
    price: 1750000,
    rating: 4.8,
    badge: 'Private Pool',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=800&q=80',
    ],
    features: ['Private Pool', 'Karaoke', 'Garden BBQ Area', 'Wifi 100Mbps'],
    desc: 'Villa bergaya heritage Jawa modern di jantung Yogyakarta. Nikmati private pool, area BBQ di taman, dan koneksi WiFi super cepat 100Mbps untuk staycation yang nyaman.'
  },
  {
    id: 'sekala-3',
    name: 'Sekala Peak View Cottage',
    category: 'Budget',
    location: 'Tawangmangu',
    capacity: 4,
    bedrooms: 2,
    price: 950000,
    rating: 4.7,
    badge: 'Budget Friendly',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=800&q=80',
    ],
    features: ['View Kebun Teh', 'Balkon Pegunungan', 'Dapur Ringkas'],
    desc: 'Cottage cozy dengan pemandangan hamparan kebun teh Kemuning langsung dari balkon. Pilihan terbaik untuk pasangan atau keluarga kecil yang ingin menikmati udara sejuk Tawangmangu.'
  },
  {
    id: 'sekala-4',
    name: 'Sekala Serenity Estate',
    category: 'Premium',
    location: 'Yogyakarta',
    capacity: 15,
    bedrooms: 5,
    price: 3200000,
    rating: 5.0,
    badge: 'Gathering Size',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1619292974578-ee84bbd86f7c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    ],
    features: ['Private Pool', 'Karaoke', 'View Gunung', 'Garden BBQ Area'],
    desc: 'Estate mewah berkapasitas besar dengan view Gunung Merapi yang spektakuler. Sempurna untuk gathering perusahaan, reuni, atau arisan besar dengan fasilitas karaoke hall dan area outbound.'
  }
];

export const DEFAULT_SETTINGS = {
  whatsappPhone: '6281381669735',
  waTemplateVilla: `Halo Admin Sekala Villa! 🖐️\nSaya tertarik mau booking unit villa ini:\n\n📌 *Villa:* {villa_name}\n🏷️ *Kategori:* {category}\n📍 *Lokasi:* {location}\n👥 *Kapasitas:* {capacity} Pax\n💰 *Mulai Dari:* {price_start} / malam\n✨ *Fasilitas Utama:* {facilities}\n\nApakah unit ini ready untuk tanggal rencana saya kak? Mohon infonya, terima kasih!`,
  waTemplateAddon: `Halo Admin Sekala Villa! 🖐️\nSaya mau pesan paket layanan:\n\n🎁 *Paket:* {addon_name}\n💰 *Harga:* {price}\n\nBoleh diinfokan alur pemesanan dan ketersediaannya kak? Terima kasih!`
};

export const ADDONS_DATA = {
  bbq: {
    title: "Katalog Paket BBQ Siap Bakar",
    subtitle: "Termasuk kompor/alat grill portable, arang batok, bumbu marinasi, & saus khas Sekala.",
    note: "Gratis antar ke lokasi villa area Tawangmangu/Kemuning.",
    packages: [
      {
        id: 'bbq-1',
        name: 'BBQ Paket Penasaran (2-4 Pax)',
        price: 150000,
        tag: 'Cocok Pasangan / Mini Group',
        summary: '250g Shortplate + 250g Sosis/Ayam + Alat Grill Set',
        details: [
          '250 gram US Beef Shortplate Sliced Meat',
          '250 gram Chicken Sliced / Sosis Grill Premium',
          'Set Alat Panggangan BBQ Portable + Capit',
          '1 Pack Arang Batok Kelapa + Margarin',
          'Saus Blackpepper & Bumbu Marinasi Teriyaki'
        ]
      },
      {
        id: 'bbq-2',
        name: 'BBQ Paket Rame-Rame (5-8 Pax)',
        price: 275000,
        tag: 'Terfavorit Tamu',
        summary: '500g US Shortplate + Bakso/Sosis + Bumbu Lengkap',
        details: [
          '500 gram US Shortplate Sliced Premium',
          '250 gram Bakso Sapi Grill & Sosis Jumbo',
          '1 Set Alat Panggangan BBQ Portable Large',
          '2 Pack Arang Batok Kelapa + Margarin',
          'Saus Blackpepper, Teriyaki, & Sambal Pedas Khas Sekala'
        ]
      },
      {
        id: 'bbq-3',
        name: 'BBQ Paket Premium Gathering (10+ Pax)',
        price: 450000,
        tag: 'Porsi Sultan Rombongan',
        summary: '1 Kg Meltique Wagyu & Shortplate + Jagung + Drink',
        details: [
          '1000 gram Meltique Wagyu & Shortplate Sliced',
          '500 gram Sosis & Bakso Grill Complete',
          '4 Pcs Jagung Manis Siap Panggang',
          'Alat Grill Double Pan + Arang Melimpah',
          'Bonus Drink (1 Pitcher Teh Manis)'
        ]
      }
    ]
  },
  jeep: {
    title: "Wisata Offroad Jeep Adventure",
    subtitle: "Jelajah kebun teh & terabas sungai. Kapasitas max 4-5 orang per unit Jeep.",
    note: "Penjemputan siap langsung dari halaman villa.",
    packages: [
      {
        id: 'jeep-1',
        name: 'Jeep Short Trip Tawangmangu',
        price: 350000,
        tag: 'Durasi ± 1.5 Jam',
        summary: 'Jelajah Kebun Teh, Spot Foto Panoramic, & Kebun Strawberry',
        details: [
          '1 Unit Armada Offroad Jeep 4x4 (Max 4-5 Pax)',
          'Driver Berpengalaman & Fuel (BBM)',
          'Rute: Spot Kebun Teh Kemuning & View Pegunungan',
          'Free Dokumentasi Foto HP oleh Driver'
        ]
      },
      {
        id: 'jeep-2',
        name: 'Jeep Medium Offroad River Kemuning',
        price: 500000,
        tag: 'Durasi ± 2.5 Jam',
        summary: 'Sensasi Terabas Sungai Kali Pucung & Telaga Madirda',
        details: [
          'Armada Jeep 4x4 Spec Offroad Basah',
          'Rute Extreme: Sungai Kali Pucung & Telaga Madirda',
          'Driver & Guide Berpengalaman',
          'Fasilitas Jas Hujan / Mantol saat Musim Hujan'
        ]
      },
      {
        id: 'jeep-3',
        name: 'Creator Dokumentasi Photo & Video Jeep',
        price: 200000,
        tag: 'Add-On Konten Reels/TikTok',
        summary: 'Kameramen Pribadi + File Mentah & Video Edit Siap Upload',
        details: [
          'Kameramen khusus mendampingi selama tour',
          'File Foto & Video mentah di-share via Google Drive',
          'Bonus 1-2 Video Reels/TikTok yang sudah di-edit'
        ]
      }
    ]
  },
  ps: {
    title: "Sewa PlayStation Delivery to Villa",
    subtitle: "Diantarkan & langsung di-setting di Smart TV unit Villa Anda. Pengantaran FREE.",
    note: "Sewa dihitung per 24 Jam.",
    packages: [
      {
        id: 'ps-1',
        name: 'Sewa PlayStation 4 Pro',
        price: 125000,
        tag: 'Rental 24 Jam',
        summary: 'Console PS4 Pro + 2 Stik Wireless + Puluhan Game Terinstal',
        details: [
          'Unit Console PS4 Pro 1TB HDD',
          '2 Stik Wireless DualShock 4',
          'Kabel HDMI & Kabel Charger',
          'Game: EA FC24/PES, GTA V, Tekken 7, CTR, Naruto, Mortal Kombat'
        ]
      },
      {
        id: 'ps-2',
        name: 'Sewa PlayStation 5 Disc Edition',
        price: 250000,
        tag: 'Next-Gen Grafis 4K',
        summary: 'Console PS5 + 2 Stik DualSense Wireless + Game Terbaru',
        details: [
          'Unit Console PS5 Disc Edition',
          '2 Stik DualSense Wireless Controller',
          'Pengalaman Grafis Smooth 4K HDR',
          'Game: EA FC 24, Spiderman 2, Mortal Kombat 1, God of War Ragnarok'
        ]
      }
    ]
  },
  catering: {
    title: "Catering & Consumsi Rombongan",
    subtitle: "Masakan rumahan khas Nusantara diantar hangat tepat pada jam makan Anda.",
    note: "Minimal order 10 Porsi/Box.",
    packages: [
      {
        id: 'cat-1',
        name: 'Paket Prasmanan Nusantara',
        price: 35000,
        tag: 'Harga Per Porsi',
        summary: 'Menu Prasmanan Lengkap: Lauk Utama + Sayur + Es Buah',
        details: [
          'Nasi Putih Pulen',
          'Lauk Utama: Ayam Goreng Lengkuas / Rendang Sapi / Ikan Bakar',
          'Lauk Pendamping: Tahu Tempe & Sayur Capcay / Sop',
          'Sambal, Kerupuk, Buah Potong & Es Sup Buah'
        ]
      },
      {
        id: 'cat-2',
        name: 'Paket Nasi Box Hemat',
        price: 25000,
        tag: 'Harga Per Box',
        summary: 'Nasi Box Praktis untuk Sarapan / Bekal Tour',
        details: [
          'Nasi Putih',
          'Ayam Bakar / Ayam Geprek Sambal Bawang',
          'Mie Goreng Jawa & Tumis Buncis',
          'Kerupuk & Air Mineral Box'
        ]
      }
    ]
  }
};

export function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
}
