// Data Tata Surya dalam Bahasa Indonesia
const tataSuryaData = [
    {
        id: 'matahari',
        nama: 'Matahari',
        subtitle: 'Bintang Pusat Tata Surya',
        kategori: 'Bintang',
        deskripsi: 'Matahari adalah bintang di pusat tata surya kita. Sangat besar dan panas, memberikan cahaya dan kehangatan untuk semua planet.',
        warna: '#FDB813',
        gradien: ['#FEF08A', '#FB923C', '#EA580C'],
        ukuran: 600,
        glowColor: 'rgba(251, 146, 60, 0.6)',
        rotasi: '25 Hari',
        suhu: '5.500°C',
        gambar: './images/matahari_sun_1769483148379.png',
        fakta: [
            'Matahari adalah bola gas raksasa yang terdiri dari hidrogen dan helium.',
            'Satu juta Bumi bisa muat di dalam Matahari!',
            'Cahaya Matahari membutuhkan waktu 8 menit untuk sampai ke Bumi.'
        ]
    },
    {
        id: 'merkurius',
        nama: 'Merkurius',
        subtitle: 'Planet Terdekat dengan Matahari',
        kategori: 'Planet Ke-1',
        deskripsi: 'Merkurius adalah planet terkecil dan terdekat dengan Matahari. Permukaannya penuh kawah seperti Bulan.',
        warna: '#9CA3AF',
        gradien: ['#E5E7EB', '#9CA3AF', '#6B7280'],
        ukuran: 320,
        glowColor: 'rgba(156, 163, 175, 0.4)',
        rotasi: '59 Hari',
        suhu: '167°C',
        gambar: './images/planet_merkurius.png',
        fakta: [
            'Merkurius adalah planet tercepat yang mengelilingi Matahari.',
            'Meskipun dekat Matahari, Merkurius bukan planet terpanas.',
            'Satu hari di Merkurius lebih lama dari satu tahunnya!'
        ]
    },
    {
        id: 'venus',
        nama: 'Venus',
        subtitle: 'Planet Paling Terang',
        kategori: 'Planet Ke-2',
        deskripsi: 'Venus adalah planet paling terang di langit malam. Diselimuti awan tebal yang menjebak panas, menjadikannya planet terpanas.',
        warna: '#F59E0B',
        gradien: ['#FDE68A', '#F59E0B', '#D97706'],
        ukuran: 380,
        glowColor: 'rgba(245, 158, 11, 0.5)',
        rotasi: '243 Hari',
        suhu: '464°C',
        gambar: './images/planet_venus_1769483227424.png',
        fakta: [
            'Venus berputar ke arah yang berlawanan dengan planet kebanyakan.',
            'Di Venus, Matahari terbit dari barat dan terbenam di timur.',
            'Venus adalah planet terpanas karena efek rumah kaca yang ekstrem.'
        ]
    },
    {
        id: 'bumi',
        nama: 'Bumi',
        subtitle: 'Planet Kehidupan',
        kategori: 'Planet Ke-3',
        deskripsi: 'Bumi adalah satu-satunya planet yang memiliki kehidupan. Diselimuti air dan atmosfer yang melindungi kita.',
        warna: '#3B82F6',
        gradien: ['#93C5FD', '#3B82F6', '#1E40AF'],
        ukuran: 400,
        glowColor: 'rgba(59, 130, 246, 0.5)',
        rotasi: '24 Jam',
        suhu: '15°C',
        gambar: './images/planet_bumi_1769483112669.png',
        fakta: [
            'Bumi adalah satu-satunya planet yang diketahui memiliki air cair di permukaannya.',
            'Atmosfer Bumi melindungi kita dari meteor dan radiasi Matahari.',
            '70% permukaan Bumi ditutupi oleh lautan.'
        ]
    },
    {
        id: 'mars',
        nama: 'Mars',
        subtitle: 'Planet Merah',
        kategori: 'Planet Ke-4',
        deskripsi: 'Mars dikenal sebagai Planet Merah karena tanahnya berwarna merah berkarat. Memiliki gunung berapi terbesar di tata surya.',
        warna: '#EF4444',
        gradien: ['#FCA5A5', '#EF4444', '#B91C1C'],
        ukuran: 340,
        glowColor: 'rgba(239, 68, 68, 0.5)',
        rotasi: '25 Jam',
        suhu: '-63°C',
        gambar: './images/planet_mars_1769483130267.png',
        fakta: [
            'Mars memiliki gunung berapi tertinggi di tata surya, Olympus Mons.',
            'Ilmuwan percaya Mars pernah memiliki air cair di masa lalu.',
            'Mars memiliki badai debu raksasa yang bisa menutupi seluruh planet.'
        ]
    },
    {
        id: 'jupiter',
        nama: 'Jupiter',
        subtitle: 'Planet Terbesar',
        kategori: 'Planet Ke-5',
        deskripsi: 'Jupiter adalah planet terbesar di tata surya. Bola gas raksasa dengan badai besar bernama Bintik Merah Besar.',
        warna: '#F97316',
        gradien: ['#FED7AA', '#F97316', '#C2410C'],
        ukuran: 550,
        glowColor: 'rgba(249, 115, 22, 0.4)',
        rotasi: '10 Jam',
        suhu: '-110°C',
        gambar: './images/planet_jupiter_1769483179468.png',
        fakta: [
            'Jupiter adalah "pembersih debu" tata surya karena gravitasinya yang kuat.',
            'Bintik Merah Besar Jupiter adalah badai yang sudah berlangsung ratusan tahun.',
            'Jupiter memiliki lebih dari 75 bulan yang mengelilinginya.'
        ]
    },
    {
        id: 'saturnus',
        nama: 'Saturnus',
        subtitle: 'Planet Bercincin',
        kategori: 'Planet Ke-6',
        deskripsi: 'Saturnus terkenal dengan cincin indahnya yang terbuat dari es dan batu. Cincin ini sangat lebar tapi sangat tipis.',
        warna: '#EAB308',
        gradien: ['#FEF08A', '#EAB308', '#A16207'],
        ukuran: 500,
        glowColor: 'rgba(234, 179, 8, 0.4)',
        rotasi: '11 Jam',
        suhu: '-140°C',
        gambar: './images/planet_saturnus_1769483202162.png',
        fakta: [
            'Cincin Saturnus sebagian besar terbuat dari potongan es dan debu.',
            'Saturnus adalah planet yang sangat ringan, ia bisa mengapung di air!',
            'Angin di Saturnus bisa mencapai kecepatan 1.800 kilometer per jam.'
        ]
    },
    {
        id: 'uranus',
        nama: 'Uranus',
        subtitle: 'Planet Miring',
        kategori: 'Planet Ke-7',
        deskripsi: 'Uranus berputar miring seperti bola yang menggelinding. Berwarna biru kehijauan karena gas metana di atmosfernya.',
        warna: '#06B6D4',
        gradien: ['#A5F3FC', '#06B6D4', '#0E7490'],
        ukuran: 420,
        glowColor: 'rgba(6, 182, 212, 0.4)',
        rotasi: '17 Jam',
        suhu: '-195°C',
        gambar: './images/planet_uranus.png',
        fakta: [
            'Uranus adalah planet pertama yang ditemukan dengan bantuan teleskop.',
            'Uranus adalah raksasa es yang suhunya sangat dingin.',
            'Uranus memiliki cincin tipis yang hampir tidak terlihat.'
        ]
    },
    {
        id: 'neptunus',
        nama: 'Neptunus',
        subtitle: 'Planet Terjauh',
        kategori: 'Planet Ke-8',
        deskripsi: 'Neptunus adalah planet terjauh dari Matahari. Berwarna biru tua dan memiliki angin terkencang di tata surya.',
        warna: '#1E40AF',
        gradien: ['#60A5FA', '#1E40AF', '#1E3A8A'],
        ukuran: 400,
        glowColor: 'rgba(30, 64, 175, 0.5)',
        rotasi: '16 Jam',
        suhu: '-200°C',
        gambar: './images/planet_neptunus.png',
        fakta: [
            'Neptunus tidak bisa dilihat dengan mata telanjang dari Bumi.',
            'Tahun di Neptunus sangat lama, memakan waktu 165 tahun Bumi!',
            'Neptunus memiliki 14 bulan, yang terbesar bernama Triton.'
        ]
    }
];
