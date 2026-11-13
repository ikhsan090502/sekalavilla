export const DEFAULT_BANNERS = [
  {
    id: 'ban-1',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=80',
    hasText: true,
    badge: 'PROMO WEEKEND SPESIAL',
    title: 'Liburan Nyaman Rasa Rumah Sendiri.',
    subtitle: 'Sewa villa private pool, glamping kebun teh, & homestay Tawangmangu - Jogja. Bisa tambah paket BBQ siap bakar & Jeep tour!',
    btnText: 'Cek Katalog Unit',
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

// Master Daerah & Sub-Kategori Akomodasi
export const DEFAULT_REGIONS = [
  {
    id: 'tawangmangu',
    name: 'Tawangmangu & Kemuning',
    badge: 'Pegunungan Lawu',
    types: [
      { id: 'villa', name: 'Villa', icon: 'fa-house-chimney-window' },
      { id: 'glamping', name: 'Glamping', icon: 'fa-campground' }
    ]
  },
  {
    id: 'yogyakarta',
    name: 'Yogyakarta & Sleman',
    badge: 'Kota & Kaliurang',
    types: [
      { id: 'villa', name: 'Villa', icon: 'fa-house-chimney-window' },
      { id: 'glamping', name: 'Glamping', icon: 'fa-campground' }
    ]
  }
];

export const PROPERTY_TYPES = [
  { id: 'all', label: 'Semua Kategori', icon: 'fa-layer-group' },
  { id: 'villa', label: 'Villa', icon: 'fa-house-chimney-window' },
  { id: 'glamping', label: 'Glamping', icon: 'fa-campground' }
];

export const DEFAULT_VILLAS = [
  // 1. TAWANGMANGU - VILLA
  {
    id: 'sekala-tw-villa-1',
    name: 'Sekala Pine Resort Villa',
    propertyType: 'villa',
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
    desc: 'Villa eksklusif dengan view pegunungan Lawu yang memukau. Dilengkapi kolam renang privat, fasilitas karaoke lengkap, dan water heater untuk liburan keluarga besar.'
  },
  {
    id: 'sekala-tw-villa-2',
    name: 'Villa Nuansa Sekipan Tawangmangu',
    propertyType: 'villa',
    category: 'Standard',
    location: 'Tawangmangu',
    capacity: 10,
    bedrooms: 3,
    price: 1650000,
    rating: 4.8,
    badge: 'Private Pool',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80'
    ],
    features: ['Private Pool', 'View Gunung', 'Garden BBQ Area', 'Free Water Heater'],
    desc: 'Villa sejuk di kawasan Sekipan Tawangmangu dengan private pool outdoor, balkon pemandangan bukit, dan area BBQ siap pakai.'
  },

  // 2. TAWANGMANGU - GLAMPING
  {
    id: 'sekala-tw-glamp-1',
    name: 'Sekala Cloud Glamping Kemuning',
    propertyType: 'glamping',
    category: 'Standard',
    location: 'Tawangmangu',
    capacity: 4,
    bedrooms: 1,
    price: 850000,
    rating: 4.9,
    badge: 'View Kebun Teh',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1499363536502-87642509e31b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=800&q=80'
    ],
    features: ['View Kebun Teh', 'View Gunung', 'Free Water Heater', 'Wifi 100Mbps'],
    desc: 'Pengalaman menginap glamping mewah di tengah hamparan kebun teh Kemuning dengan pemandangan langsung Gunung Lawu. Kasur empuk, air hangat, dan api unggun.'
  },
  {
    id: 'sekala-tw-glamp-2',
    name: 'Sekala Lawu Dome Camp',
    propertyType: 'glamping',
    category: 'Budget',
    location: 'Tawangmangu',
    capacity: 4,
    bedrooms: 1,
    price: 650000,
    rating: 4.8,
    badge: 'Sensasi Dingin Lawu',
    image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506535772317-9fca71c959c6?auto=format&fit=crop&w=800&q=80'
    ],
    features: ['View Gunung', 'Garden BBQ Area', 'Wifi 100Mbps'],
    desc: 'Tenda dome estetik beratap transparan untuk melihat bintang di malam hari. Lokasi sejuk di lereng Lawu dengan spot grill BBQ.'
  },

  // 3. TAWANGMANGU - HOMESTAY
  {
    id: 'sekala-tw-home-1',
    name: 'Sekala Lawu Lodge Homestay',
    propertyType: 'homestay',
    category: 'Standard',
    location: 'Tawangmangu',
    capacity: 15,
    bedrooms: 5,
    price: 1350000,
    rating: 4.8,
    badge: 'Kapasitas Besar',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ],
    features: ['View Gunung', 'Karaoke', 'Dapur Ringkas', 'Garden BBQ Area'],
    desc: 'Rumah homestay besar 5 kamar di pusat Tawangmangu. Dekat Grojogan Sewu dan pasar wisata. Fasilitas karaoke dan dapur masak lengkap.'
  },

  // 4. JOGJA - VILLA
  {
    id: 'sekala-jg-villa-1',
    name: 'Villa Sekala Heritage Jogja',
    propertyType: 'villa',
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
    ],
    features: ['Private Pool', 'Karaoke', 'Garden BBQ Area', 'Wifi 100Mbps'],
    desc: 'Villa bergaya heritage modern di Yogyakarta. Cocok untuk staycation keluarga dengan kolam renang privat dan area outdoor BBQ.'
  },
  {
    id: 'sekala-jg-villa-2',
    name: 'Sekala Serenity Estate Jogja',
    propertyType: 'villa',
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
      'https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?auto=format&fit=crop&w=800&q=80'
    ],
    features: ['Private Pool', 'Karaoke', 'Garden BBQ Area', 'Wifi 100Mbps'],
    desc: 'Estate mewah berkapasitas besar di area Kaliurang Jogja. Kolam renang luas, gazebo santai, dan taman tropis yang sejuk.'
  },

  // 5. JOGJA - GLAMPING
  {
    id: 'sekala-jg-glamp-1',
    name: 'Sekala Merapi View Glamping',
    propertyType: 'glamping',
    category: 'Standard',
    location: 'Yogyakarta',
    capacity: 4,
    bedrooms: 1,
    price: 750000,
    rating: 4.8,
    badge: 'View Merapi Syahdu',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80'
    ],
    features: ['View Gunung', 'Garden BBQ Area', 'Wifi 100Mbps', 'Free Water Heater'],
    desc: 'Glamping estetik di lereng Gunung Merapi Kaliurang. Udara sejuk, pemandangan pepohonan rindang, dan tempat santai api unggun.'
  },

  // 6. JOGJA - HOMESTAY
  {
    id: 'sekala-jg-home-1',
    name: 'Sekala Omah Kayu Homestay Jogja',
    propertyType: 'homestay',
    category: 'Budget',
    location: 'Yogyakarta',
    capacity: 10,
    bedrooms: 3,
    price: 950000,
    rating: 4.7,
    badge: 'Hemat Rombongan',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?auto=format&fit=crop&w=800&q=80'
    ],
    features: ['Dapur Ringkas', 'Wifi 100Mbps', 'Parkir Luas', 'Free Water Heater'],
    desc: 'Homestay bernuansa kayu klasik dengan dapur lengkap, ruang keluarga luas, dan halaman parkir untuk 3 mobil di Yogyakarta.'
  }
];

export const DEFAULT_SETTINGS = {
  whatsappPhone: '6281381669735', // Fallback Utama
  whatsappTawangmangu: '6281381669735', // Admin Area Tawangmangu
  whatsappJogja: '6281381669735', // Admin Area Yogyakarta
  whatsappBBQ: '6281381669735', // PIC Layanan BBQ
  whatsappJeep: '6281381669735', // PIC Wisata Jeep Kemuning
  whatsappPS: '6281381669735', // PIC Rental PS
  whatsappCatering: '6281381669735', // PIC Catering
  waTemplateVilla: `Halo Admin Sekala Villa! 🖐️\nSaya tertarik booking unit ini:\n\n📌 *Nama:* {villa_name}\n🏷️ *Tipe:* {property_type}\n📍 *Lokasi:* {location}\n👥 *Kapasitas:* {capacity} Pax\n💰 *Mulai Dari:* {price_start} / malam\n✨ *Fasilitas Utama:* {facilities}\n\nApakah unit ini ready untuk tanggal rencana saya kak? Mohon infonya, terima kasih!`,
  waTemplateAddon: `Halo Admin Sekala Villa! 🖐️\nSaya mau pesan paket layanan:\n\n🎁 *Paket:* {addon_name}\n💰 *Harga:* {price}\n\nBoleh diinfokan ketersediaan jadwalnya kak? Terima kasih!`,
  
  // Promo Popup Settings
  promoEnabled: true,
  promoTitle: 'Diskon Rp 150.000 + Free Alat BBQ Set!',
  promoSubtitle: 'Khusus booking minggu ini melalui website resmi Sekala Villa! Dapatkan potongan langsung sewa unit di Tawangmangu & Jogja plus bonus free peminjaman alat grill BBQ.',
  promoCode: 'SEKALAADS150',
  promoDiscount: 'Rp 150.000 + Bonus Free Alat BBQ Set',
  promoImageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
};

// Artikel / Blog Dummy Awal
export const DEFAULT_ARTICLES = [
  {
    id: 'art-1',
    slug: 'tips-staycation-seru-tawangmangu',
    title: '5 Tips Staycation Seru & Dingin di Tawangmangu Bersama Keluarga',
    category: 'Panduan Wisata',
    date: '12 Nov 2026',
    author: 'Tim Sekala',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
    summary: 'Rekomendasi persiapan menginap di kaki Gunung Lawu mulai dari pilihan villa private pool hingga perlengkapan BBQ hangat.',
    content: `Liburan di Tawangmangu selalu menghadirkan sensasi kesegaran khas pegunungan Lawu yang sejuk berkabut. Bagi Anda yang berencana staycation bersama rombongan atau keluarga tercinta, berikut beberapa tips penting:

1. **Pilih Villa dengan Fasilitas Water Heater & Pemanas**
Suhu malam di Tawangmangu dan Kemuning bisa turun drastis hingga 16°C. Pastikan memilih villa Sekala yang sudah dilengkapi shower air panas dan selimut tebal ekstra.

2. **Siapkan Momen BBQ Siap Bakar di Halaman**
Suasana dingin malam pegunungan sangat pas ditemani aroma harum daging panggang. Layanan paket BBQ Sekala Villa sudah membawakan kompor grill, arang batok, dan bumbu marinasi langsung di villa Anda.

3. **Nikmati Wisata Alam & Tour Jeep Kemuning**
Pagi hari adalah waktu terbaik menikmati sunrise kebun teh. Cobalah sensasi seru jelajah lereng Lawu dengan armada Jeep 4x4 Sekala Adventure.`
  },
  {
    id: 'art-2',
    slug: 'rekomendasi-glamping-estetik-jogja',
    title: 'Sensasi Glamping Romantis di Jogja dengan Pemandangan Gagah Merapi',
    category: 'Rekomendasi Akomodasi',
    date: '10 Nov 2026',
    author: 'Admin Sekala',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1000&q=80',
    summary: 'Ingin liburan dengan konsep tenda mewah tanpa ribet? Ini alasan glamping Kaliurang Merapi jadi favorit pasangan dan keluarga muda.',
    content: `Glamping (Glamorous Camping) menawarkan perpaduan sempurna antara petualangan alam terbuka dengan kenyamanan kasur empuk hotel bintang lima.

Kawasan Kaliurang Sleman kini menjadi destinasi primadona bagi wisatawan Jogja yang mendambakan udara segar jauh dari hiruk-pikuk pusat kota. Suara gemerisik pohon pinus dan pemandangan megah puncak Merapi di pagi hari dijamin bikin pikiran rileks dan tenang kembali.`
  }
];

export const ADDONS_DATA = {
  bbq: {
    title: "Katalog Paket BBQ Siap Bakar",
    subtitle: "Termasuk kompor/alat grill portable, arang batok, bumbu marinasi, & saus khas Sekala.",
    note: "Alat grill dipinjamkan gratis selama masa sewa paket.",
    packages: [
      {
        id: 'bbq-1',
        name: 'BBQ Paket Berdua / Couple',
        price: 175000,
        tag: 'Porsi 2 Pax',
        summary: '250 gr Daging Beef Sliced + Sosis + Saus BBQ & Blackpepper',
        details: [
          '250 gram Daging US Beef Shortplate Sliced',
          '2 Pcs Sosis Sapi Jumbo & Bakso Ikan',
          '1 Set Kompor Gas Portable + Pan Grill Anti Lengket',
          '1 Kaleng Gas Portable Baru',
          'Saus Signature BBQ & Saus Sambal Pedas Manis'
        ]
      },
      {
        id: 'bbq-2',
        name: 'BBQ Paket Family Seru (4-6 Pax)',
        price: 295000,
        tag: 'Paling Laris',
        summary: '500 gr US Shortplate + Bakso/Sosis + Bumbu Lengkap',
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
        tag: 'Porsi Rombongan',
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
        name: 'Jeep Short Trip Kemuning',
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
          'Game: EA FC24/PES, GTA V, Tekken 7, CTR, Mortal Kombat'
        ]
      },
      {
        id: 'ps-2',
        name: 'Sewa PlayStation 5 Disc Edition',
        price: 250000,
        tag: 'Next-Gen 4K',
        summary: 'Console PS5 + 2 Stik DualSense Wireless + Game Terbaru',
        details: [
          'Unit Console PS5 Disc Edition',
          '2 Stik DualSense Wireless Controller',
          'Game: EA FC 24, Spiderman 2, Mortal Kombat 1'
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
      }
    ]
  }
};

export function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
}
