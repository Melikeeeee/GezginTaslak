import type { Destination, Place, Post } from "@gezgin/types";

// ==============================================================================
// 1. DESTINATIONS
// ==============================================================================

export const ISTANBUL_DESTINATION: Destination = {
  id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
  name: "İstanbul",
  country: "Türkiye",
  slug: "istanbul",
  description:
    "Avrupa ile Asya'yı Boğaz ile birleştiren, Bizans ve Osmanlı mirası, anıtsal camileri ve capcanlı lezzet kültürüyle büyüleyen metropol.",
  latitude: 41.0082,
  longitude: 28.9784,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

export const ANKARA_DESTINATION: Destination = {
  id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5e",
  name: "Ankara",
  country: "Türkiye",
  slug: "ankara",
  description:
    "Türkiye'nin başkenti; Anıtkabir, köklü cumhuriyet mimarisi, dünya çapında müzeleri ve zengin kültür sanat hayatıyla Anadolu'nun kalbi.",
  latitude: 39.9334,
  longitude: 32.8597,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

export const IZMIR_DESTINATION: Destination = {
  id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5f",
  name: "İzmir",
  country: "Türkiye",
  slug: "izmir",
  description:
    "Ege'nin incisi; palmiyeli Kordon boyu, antik Efes mirası, Tarihi Kemeraltı Çarşısı ve zengin Ege gastronomisiyle büyüleyen sahil kenti.",
  latitude: 38.4237,
  longitude: 27.1428,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

export const ESKISEHIR_DESTINATION: Destination = {
  id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c60",
  name: "Eskişehir",
  country: "Türkiye",
  slug: "eskisehir",
  description:
    "Porsuk Çayı'nda gondol turları, rengarenk Tarihi Odunpazarı Evleri, modern müzeleri ve gençlik enerjisiyle Türkiye'nin kültür kenti.",
  latitude: 39.7767,
  longitude: 30.5206,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

export const KAPADOKYA_DESTINATION: Destination = {
  id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c61",
  name: "Kapadokya",
  country: "Türkiye",
  slug: "kapadokya",
  description:
    "Peri bacaları, sıcak hava balonları, kayalara oyulmuş tarihi kiliseleri ve binlerce yıllık yeraltı şehirleriyle masalsı bir coğrafya.",
  latitude: 38.6431,
  longitude: 34.8289,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

export const ANTALYA_DESTINATION: Destination = {
  id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c62",
  name: "Antalya",
  country: "Türkiye",
  slug: "antalya",
  description:
    "Akdeniz'in turkuaz suları, antik tiyatroları, Kaleiçi'nin dar sokakları ve muhteşem doğa şelaleleriyle tatil ve tarih cenneti.",
  latitude: 36.8969,
  longitude: 30.7133,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

export const SEED_DESTINATIONS: Destination[] = [
  ISTANBUL_DESTINATION,
  ANKARA_DESTINATION,
  IZMIR_DESTINATION,
  ESKISEHIR_DESTINATION,
  KAPADOKYA_DESTINATION,
  ANTALYA_DESTINATION,
];

// ==============================================================================
// 2. PLACES - ISTANBUL
// ==============================================================================

export const ISTANBUL_PLACES: Place[] = [
  {
    id: "b1000001-0000-0000-0000-000000000001",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
    name: "Ayasofya-i Kebîr Câmi-i Şerîfi (Hagia Sophia)",
    slug: "hagia-sophia",
    category: "historical",
    description:
      "Bizans ve Osmanlı dönemlerinin eşsiz mimari harikası, anıtsal kubbesi ve tarihi mozaikleriyle İstanbul'un kalbi.",
    address: "Sultan Ahmet, Ayasofya Meydanı No:1, 34122 Fatih/İstanbul",
    latitude: 41.008583,
    longitude: 28.980175,
    opening_hours: "Her gün 09:00 - 19:30",
    price_level: 2,
    rating: 4.9,
    image_url:
      "https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 90,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "b1000001-0000-0000-0000-000000000002",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
    name: "Topkapı Sarayı Müzesi",
    slug: "topkapi-palace",
    category: "historical",
    description:
      "Osmanlı padişahlarının yüzyıllar boyunca ikamet ettiği, Harem ve Kutsal Emanetler bölümlerini barındıran saray kompleksi.",
    address: "Cankurtaran, 34122 Fatih/İstanbul",
    latitude: 41.01152,
    longitude: 28.983377,
    opening_hours: "Çarşamba - Pazartesi 09:00 - 18:00 (Salı günleri kapalı)",
    price_level: 3,
    rating: 4.8,
    image_url:
      "https://images.unsplash.com/photo-1566438480900-0609be27a4be?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 180,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "b1000001-0000-0000-0000-000000000003",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
    name: "Galata Kulesi",
    slug: "galata-tower",
    category: "historical",
    description:
      "Haliç ve Tarihi Yarımada'ya bakan 360 derecelik panoramik manzarasıyla 14. yüzyıldan kalma Ceneviz gözetleme kulesi.",
    address: "Bereketzade, 34421 Beyoğlu/İstanbul",
    latitude: 41.025658,
    longitude: 28.974155,
    opening_hours: "Her gün 08:30 - 23:00",
    price_level: 3,
    rating: 4.7,
    image_url:
      "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 60,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "b1000001-0000-0000-0000-000000000004",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
    name: "Yerebatan Sarnıcı",
    slug: "basilica-cistern",
    category: "historical",
    description:
      "6. yüzyıldan kalma büyüleyici su sarnıcı; Medusa başlı kaideler ve büyüleyici ışıklandırmasıyla yeraltı sarayı.",
    address: "Alemdar, Yerebatan Cd. 1/3, 34110 Fatih/İstanbul",
    latitude: 41.008389,
    longitude: 28.977864,
    opening_hours: "Her gün 09:00 - 22:00",
    price_level: 2,
    rating: 4.8,
    image_url:
      "https://images.unsplash.com/photo-1594973815049-f033a0b93847?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 50,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "b1000001-0000-0000-0000-000000000005",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
    name: "Kapalıçarşı (Grand Bazaar)",
    slug: "grand-bazaar",
    category: "shopping",
    description:
      "Dünyanın en eski ve en büyük kapalı çarşılarından biri; baharatlar, mücevherler, halılar ve otantik hediyelikler.",
    address: "Beyazıt, Kalpakçılar Cd. No:22, 34126 Fatih/İstanbul",
    latitude: 41.01072,
    longitude: 28.96803,
    opening_hours: "Pazartesi - Cumartesi 08:30 - 19:00 (Pazar günleri kapalı)",
    price_level: 2,
    rating: 4.6,
    image_url:
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 120,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "b1000001-0000-0000-0000-000000000006",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
    name: "Tarihi Sultanahmet Köftecisi Selim Usta",
    slug: "tarihi-sultanahmet-koftecisi",
    category: "restaurant",
    description:
      "1920'den bu yana geleneksel tarifiyle kömür ateşinde pişen leziz köfteleri ve meşhur piyazıyla bir gastronomi klasiği.",
    address: "Alemdar, Divan Yolu Cd. No:12, 34110 Fatih/İstanbul",
    latitude: 41.0079,
    longitude: 28.9772,
    opening_hours: "Her gün 10:30 - 23:00",
    price_level: 2,
    rating: 4.5,
    image_url:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 45,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
];

// ==============================================================================
// 3. PLACES - ANKARA
// ==============================================================================

export const ANKARA_PLACES: Place[] = [
  {
    id: "b2000001-0000-0000-0000-000000000001",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5e",
    name: "Anıtkabir",
    slug: "anitkabir",
    category: "historical",
    description:
      "Gazi Mustafa Kemal Atatürk'ün ebedi istirahatgahı; Aslanlı Yol, Kurtuluş Savaşı Müzesi ve görkemli mimarisiyle Türkiye'nin manevi simgesi.",
    address: "Yücetepe, Akdeniz Cd. No:31, 06570 Çankaya/Ankara",
    latitude: 39.925054,
    longitude: 32.836952,
    opening_hours: "Her gün 09:00 - 17:00",
    price_level: 1,
    rating: 5.0,
    image_url:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 120,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "b2000001-0000-0000-0000-000000000002",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5e",
    name: "Anadolu Medeniyetleri Müzesi",
    slug: "anadolu-medeniyetleri-muzesi",
    category: "museum",
    description:
      "Paleolitik çağdan günümüze Anadolu'nun zengin arkeolojik mirasını sergileyen, Avrupa'da Yılın Müzesi ödüllü görkemli müze.",
    address: "Kale, Gözcü Sk. No:2, 06240 Altındağ/Ankara",
    latitude: 39.938361,
    longitude: 32.861845,
    opening_hours: "Her gün 08:30 - 19:00",
    price_level: 2,
    rating: 4.8,
    image_url:
      "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 90,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "b2000001-0000-0000-0000-000000000003",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5e",
    name: "Ankara Kalesi",
    slug: "ankara-kalesi",
    category: "historical",
    description:
      "Başkentin en eski yapılarından; tarihi surları, otantik sokakları ve Ankara'yı 360 derece ayaklar altına seren panoramik manzarası.",
    address: "Kale Mh., 06240 Altındağ/Ankara",
    latitude: 39.941667,
    longitude: 32.864722,
    opening_hours: "Her gün 08:00 - 20:00",
    price_level: 1,
    rating: 4.6,
    image_url:
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 75,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "b2000001-0000-0000-0000-000000000004",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5e",
    name: "Kuğulu Park & Tunalı Hilmi",
    slug: "kugulu-park",
    category: "nature",
    description:
      "Ankara'nın simgesi kuğuları, yemyeşil göleti ve hareketli Tunalı Hilmi Caddesi ile kentin buluşma ve dinlenme noktası.",
    address: "Kavaklıdere, Çankaya/Ankara",
    latitude: 39.8997,
    longitude: 32.8601,
    opening_hours: "24 Saat Açık",
    price_level: 1,
    rating: 4.7,
    image_url:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 45,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "b2000001-0000-0000-0000-000000000005",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5e",
    name: "Tarihi Boğaziçi Lokantası (1956)",
    slug: "bogazici-lokantasi",
    category: "restaurant",
    description:
      "Geleneksel Ankara tavası, incik kebap ve zengin zeytinyağlı tencere yemekleriyle başkentin yarım asırlık lezzet durağı.",
    address: "Ulus, Denizciler Cd. No:1/A, 06250 Altındağ/Ankara",
    latitude: 39.9392,
    longitude: 32.8573,
    opening_hours: "Her gün 11:30 - 21:00",
    price_level: 2,
    rating: 4.6,
    image_url:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 60,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
];

// ==============================================================================
// 4. PLACES - İZMİR
// ==============================================================================

export const IZMIR_PLACES: Place[] = [
  {
    id: "b3000001-0000-0000-0000-000000000001",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5f",
    name: "İzmir Saat Kulesi & Konak Meydanı",
    slug: "izmir-saat-kulesi",
    category: "historical",
    description:
      "1901 yapımı zarif Osmanlı mimarisi, güvercinleri ve deniz esintisiyle İzmir'in en tanınan ikonik simgesi.",
    address: "Konak Meydanı, 35250 Konak/İzmir",
    latitude: 38.418889,
    longitude: 27.128611,
    opening_hours: "24 Saat Açık",
    price_level: 1,
    rating: 4.8,
    image_url:
      "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 40,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "b3000001-0000-0000-0000-000000000002",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5f",
    name: "Efes Antik Kenti (Ephesus)",
    slug: "efes-antik-kenti",
    category: "historical",
    description:
      "Celsus Kütüphanesi, devasa antik tiyatro ve mermer caddeleriyle UNESCO Dünya Mirası listesindeki antik dünyanın başkenti.",
    address: "Selçuk, 35920 Selçuk/İzmir",
    latitude: 37.9408,
    longitude: 27.3414,
    opening_hours: "Her gün 08:00 - 19:30",
    price_level: 3,
    rating: 4.9,
    image_url:
      "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 180,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "b3000001-0000-0000-0000-000000000003",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5f",
    name: "Tarihi Asansör & Seyir Terası",
    slug: "tarihi-asansor",
    category: "cafe",
    description:
      "1907 yılında iki caddeyi birbirine bağlamak için yapılan tarihi asansör; İzmir Körfezi'nin eşsiz gün batımı ve kahve keyfi.",
    address: "Turgut Reis, Şht. Nihatbey Cd. 76/A, 35000 Konak/İzmir",
    latitude: 38.4087,
    longitude: 27.1175,
    opening_hours: "Her gün 08:30 - 00:00",
    price_level: 2,
    rating: 4.7,
    image_url:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 60,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "b3000001-0000-0000-0000-000000000004",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5f",
    name: "Kordon Boyu & Alsancak Sahili",
    slug: "kordon-alsancak",
    category: "nature",
    description:
      "Ege Denizi boyunca uzanan çim alanlar, bisiklet yolları, kafeler ve İzmir'in meşhur gün batımı buluşma noktası.",
    address: "Alsancak, Atatürk Cd., 35220 Konak/İzmir",
    latitude: 38.4356,
    longitude: 27.1408,
    opening_hours: "24 Saat Açık",
    price_level: 1,
    rating: 4.8,
    image_url:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 90,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
];

// ==============================================================================
// 5. PLACES - ESKİŞEHİR
// ==============================================================================

export const ESKISEHIR_PLACES: Place[] = [
  {
    id: "b4000001-0000-0000-0000-000000000001",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c60",
    name: "Tarihi Odunpazarı Evleri",
    slug: "odunpazari-evleri",
    category: "historical",
    description:
      "Geleneksel Osmanlı sivil mimarisini yansıtan rengarenk ahşap konaklar, lületaşı atölyeleri ve Arnavut kaldırımlı sokaklar.",
    address: "Odunpazarı, 26030 Odunpazarı/Eskişehir",
    latitude: 39.7612,
    longitude: 30.5258,
    opening_hours: "Her gün açık",
    price_level: 1,
    rating: 4.8,
    image_url:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 120,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "b4000001-0000-0000-0000-000000000002",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c60",
    name: "Sazova Bilim Kültür ve Sanat Parkı",
    slug: "sazova-parki",
    category: "nature",
    description:
      "Masal Şatosu, Korsan Gemisi, Uzay Evi ve yapay göletiyle Türkiye'nin en büyük ve en yaratıcı tematik parklarından biri.",
    address: "Sazova, Ulusal Egemenlik Blv., 26150 Tepebaşı/Eskişehir",
    latitude: 39.7686,
    longitude: 30.4739,
    opening_hours: "Her gün 10:00 - 18:00",
    price_level: 2,
    rating: 4.8,
    image_url:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 150,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "b4000001-0000-0000-0000-000000000003",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c60",
    name: "OMM (Odunpazarı Modern Müze)",
    slug: "odunpazari-modern-muze",
    category: "museum",
    description:
      "Ünlü Japon mimarlık ofisi Kengo Kuma & Associates tasarımı ödüllü binasıyla Türkiye ve dünyadan çağdaş sanat seçkisi.",
    address: "Şarkiye, Türmen Hoca Sk. No:15, 26020 Odunpazarı/Eskişehir",
    latitude: 39.7629,
    longitude: 30.5265,
    opening_hours: "Salı - Pazar 10:00 - 18:00 (Pazartesi kapalı)",
    price_level: 2,
    rating: 4.9,
    image_url:
      "https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 75,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "b4000001-0000-0000-0000-000000000004",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c60",
    name: "Porsuk Çayı & Adalar Gondol Gezisi",
    slug: "porsuk-cayi-adalar",
    category: "nature",
    description:
      "Eskişehir'in ortasından geçen Porsuk Çayı üzerinde Venedik tipi gondol ve bot turları, sahil boyu kafeler ve köprüler.",
    address: "İstiklal, Porsuk Blv., 26010 Tepebaşı/Eskişehir",
    latitude: 39.7753,
    longitude: 30.5186,
    opening_hours: "Her gün 10:00 - 22:00",
    price_level: 2,
    rating: 4.7,
    image_url:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 60,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "b4000001-0000-0000-0000-000000000005",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c60",
    name: "Tarihi Papağan Çiğbörek",
    slug: "papagan-cigborek",
    category: "restaurant",
    description:
      "Eskişehir'in tescilli lezzeti çıtır çıtır sıcak kıymalı çiğbörek ve yanında köpüklü yayık ayranı.",
    address: "Arifiye, Belediye Sk. No:8, 26010 Odunpazarı/Eskişehir",
    latitude: 39.7712,
    longitude: 30.5218,
    opening_hours: "Her gün 10:00 - 20:30",
    price_level: 1,
    rating: 4.6,
    image_url:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 45,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
];

// ==============================================================================
// 6. PLACES - KAPADOKYA
// ==============================================================================

export const KAPADOKYA_PLACES: Place[] = [
  {
    id: "b5000001-0000-0000-0000-000000000001",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c61",
    name: "Göreme Açık Hava Müzesi",
    slug: "goreme-acik-hava-muzesi",
    category: "museum",
    description:
      "Kayalara oyulmuş 10. ve 12. yüzyıl Bizans kiliseleri, olağanüstü freskleri ve manastır hayatıyla UNESCO Dünya Mirası.",
    address: "Göreme Kasabası, 50180 Nevşehir",
    latitude: 38.6403,
    longitude: 34.8458,
    opening_hours: "Her gün 08:00 - 19:00",
    price_level: 3,
    rating: 4.9,
    image_url:
      "https://images.unsplash.com/photo-1609137144822-297eb0985207?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 120,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "b5000001-0000-0000-0000-000000000002",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c61",
    name: "Uçhisar Kalesi & Güvercinlik Vadisi",
    slug: "uchisar-kalesi",
    category: "nature",
    description:
      "Kapadokya'nın en yüksek noktası; tüm bölgeye ve Erciyes Dağı'na hakim 360 derece manzara ve kaya oyma tüneller.",
    address: "Uçhisar Kasabası, 50240 Nevşehir",
    latitude: 38.6306,
    longitude: 34.8058,
    opening_hours: "Her gün 07:30 - 20:00",
    price_level: 2,
    rating: 4.8,
    image_url:
      "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 90,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "b5000001-0000-0000-0000-000000000003",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c61",
    name: "Derinkuyu Yeraltı Şehri",
    slug: "derinkuyu-yeralti-sehri",
    category: "historical",
    description:
      "8 kat derinliğe inen, binlerce insanın sığınabileceği havalandırma bacaları, kiliseleri ve şaraphaneleriyle mühendislik harikası.",
    address: "Derinkuyu, 50700 Nevşehir",
    latitude: 38.3736,
    longitude: 34.735,
    opening_hours: "Her gün 08:00 - 19:00",
    price_level: 2,
    rating: 4.8,
    image_url:
      "https://images.unsplash.com/photo-1594973815049-f033a0b93847?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 80,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "b5000001-0000-0000-0000-000000000004",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c61",
    name: "Dibek Geleneksel Testi Kebabı",
    slug: "dibek-testi-kebabi",
    category: "restaurant",
    description:
      "Toprak testiler içinde közde saatlerce pişen ve masada kırılarak servis edilen geleneksel Kapadokya testi kebabı.",
    address: "Belediye Cd., 50180 Göreme/Nevşehir",
    latitude: 38.6439,
    longitude: 34.8294,
    opening_hours: "Her gün 12:00 - 22:30",
    price_level: 3,
    rating: 4.7,
    image_url:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 75,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
];

// ==============================================================================
// 7. PLACES - ANTALYA
// ==============================================================================

export const ANTALYA_PLACES: Place[] = [
  {
    id: "b6000001-0000-0000-0000-000000000001",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c62",
    name: "Kaleiçi & Hadrian Kapısı (Üçkapılar)",
    slug: "kaleici-hadrian-kapisi",
    category: "historical",
    description:
      "Roma İmparatoru Hadrianus onuruna yapılan mermer kapı, begonvilli tarihi konaklar ve Akdeniz'e inen taş sokaklar.",
    address: "Barbaros, 07100 Muratpaşa/Antalya",
    latitude: 36.8853,
    longitude: 30.7086,
    opening_hours: "24 Saat Açık",
    price_level: 1,
    rating: 4.8,
    image_url:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 100,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "b6000001-0000-0000-0000-000000000002",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c62",
    name: "Düden Şelalesi",
    slug: "duden-selalesi",
    category: "nature",
    description:
      "40 metrelik falezlerden Akdeniz'in masmavi sularına dökülen büyüleyici doğa harikası ve sahil yürüyüş parkuru.",
    address: "Çağlayan, Lara Cd. No:457, 07230 Muratpaşa/Antalya",
    latitude: 36.8519,
    longitude: 30.7858,
    opening_hours: "Her gün 08:30 - 19:30",
    price_level: 1,
    rating: 4.7,
    image_url:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 60,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "b6000001-0000-0000-0000-000000000003",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c62",
    name: "Aspendos Antik Tiyatrosu",
    slug: "aspendos-tiyatrosu",
    category: "historical",
    description:
      "M.S. 2. yüzyıldan günümüze kusursuz akustiğiyle ulaşan, dünyanın en iyi korunmuş Roma antik tiyatrosu.",
    address: "Serik, 07500 Serik/Antalya",
    latitude: 36.9389,
    longitude: 31.1722,
    opening_hours: "Her gün 08:00 - 19:00",
    price_level: 2,
    rating: 4.9,
    image_url:
      "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 90,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "b6000001-0000-0000-0000-000000000004",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c62",
    name: "7 Mehmet Restoran (1937)",
    slug: "7-mehmet-restoran",
    category: "restaurant",
    description:
      "Akdeniz mutfağı, bademli kuzu kulaklı pilav, deniz ürünleri ve yaratıcı Türk gastronomisinin öncüsü efsanevi restoran.",
    address: "Meltem, Atatürk Kültür Parkı İçi, 07030 Muratpaşa/Antalya",
    latitude: 36.8833,
    longitude: 30.6728,
    opening_hours: "Her gün 12:00 - 23:30",
    price_level: 3,
    rating: 4.8,
    image_url:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    estimated_visit_minutes: 90,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
];

// ==============================================================================
// 8. COMBINED EXPORTS
// ==============================================================================

export const ALL_PLACES: Place[] = [
  ...ISTANBUL_PLACES,
  ...ANKARA_PLACES,
  ...IZMIR_PLACES,
  ...ESKISEHIR_PLACES,
  ...KAPADOKYA_PLACES,
  ...ANTALYA_PLACES,
];

// Alias for convenience
export const SEED_PLACES = ALL_PLACES;

// ==============================================================================
// 9. COMMUNITY SOCIAL FEED SEED POSTS
// ==============================================================================

export const SEED_POSTS: Post[] = [
  {
    id: "post-001",
    user_id: "u-101",
    author_name: "Elif Demir",
    author_username: "elif_travels",
    author_avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c61",
    destination_name: "Kapadokya",
    location_name: "Göreme, Kapadokya",
    caption:
      "Kapadokya'da sabah 06:00'da balonların kalkışını izlemek büyüleyici bir rüya gibi! Sıcak çayınızı alıp Uçhisar Kalesi eteklerine geçin, manzara tek kelimeyle inanılmaz. 🎈✨",
    image_url:
      "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=1200&q=80",
    likes_count: 48,
    comments_count: 2,
    is_liked: false,
    comments: [
      {
        id: "c-101",
        post_id: "post-001",
        user_id: "u-201",
        author_name: "Caner Yılmaz",
        content: "Fotoğraf harika görünüyor! Balon turu için rezervasyonu kaç gün önceden yaptınız?",
        created_at: "2 saat önce",
      },
      {
        id: "c-102",
        post_id: "post-001",
        user_id: "u-101",
        author_name: "Elif Demir",
        content: "En az 2 hafta önceden yaptırmanızı öneririm Caner, rüzgara göre uçuş günleri değişebiliyor!",
        created_at: "1 saat önce",
      },
    ],
    created_at: "3 saat önce",
  },
  {
    id: "post-002",
    user_id: "u-102",
    author_name: "Caner Yılmaz",
    author_username: "caner_on_the_road",
    author_avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c60",
    destination_name: "Eskişehir",
    location_name: "Porsuk Çayı & Adalar, Eskişehir",
    caption:
      "Eskişehir'de Porsuk Çayı'nda gondol turuna çıktık. Venedik havası, yemyeşil kıyılar ve Odunpazarı'ndaki sıcak çiğbörek molası harikaydı! Mutlaka rotanıza ekleyin. 🚣‍♂️🥟",
    image_url:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
    likes_count: 35,
    comments_count: 1,
    is_liked: false,
    comments: [
      {
        id: "c-201",
        post_id: "post-002",
        user_id: "u-103",
        author_name: "Selin Kaya",
        content: "Papağan Çiğbörek'e uğradınız mı? Eskişehir'in vazgeçilmezi!",
        created_at: "4 saat önce",
      },
    ],
    created_at: "5 saat önce",
  },
  {
    id: "post-003",
    user_id: "u-103",
    author_name: "Selin Kaya",
    author_username: "selin.kesifte",
    author_avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5f",
    destination_name: "İzmir",
    location_name: "Kordon Alsancak, İzmir",
    caption:
      "İzmir Kordon'da gün batımı bir başka güzel. Çimlerde oturup Ege rüzgarını dinlemek günün tüm yorgunluğunu alıyor. Yanına da sıcacık gevrek ve çay! 🌅🕊️",
    image_url:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    likes_count: 52,
    comments_count: 2,
    is_liked: false,
    comments: [
      {
        id: "c-301",
        post_id: "post-003",
        user_id: "u-104",
        author_name: "Burak Özkan",
        content: "İzmir gün batımları Türkiye'nin en huzurlusu kesinlikle.",
        created_at: "5 saat önce",
      },
    ],
    created_at: "6 saat önce",
  },
  {
    id: "post-004",
    user_id: "u-104",
    author_name: "Burak Özkan",
    author_username: "burak_ozkan",
    author_avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5e",
    destination_name: "Ankara",
    location_name: "Anıtkabir, Ankara",
    caption:
      "Ankara gezimizin en anlamlı durağı: Anıtkabir. Aslanlı Yol, nöbet değişimi seremonisi ve Kurtuluş Savaşı Müzesi her Türk gencinin görmesi gereken eşsiz bir tarih mirası. 🇹🇷🏛️",
    image_url:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
    likes_count: 94,
    comments_count: 3,
    is_liked: false,
    comments: [
      {
        id: "c-401",
        post_id: "post-004",
        user_id: "u-105",
        author_name: "Zeynep Arslan",
        content: "Tüyleri diken diken eden bir atmosfer. Saygı ve minnetle...",
        created_at: "8 saat önce",
      },
    ],
    created_at: "9 saat önce",
  },
  {
    id: "post-005",
    user_id: "u-105",
    author_name: "Zeynep Arslan",
    author_username: "zeynep.travels",
    author_avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c62",
    destination_name: "Antalya",
    location_name: "Kaleiçi & Düden, Antalya",
    caption:
      "Falezlerden Akdeniz'in masmavi sularına dökülen Düden Şelalesi! Kaleiçi'nin dar taş sokaklarını gezdikten sonra burada gün batımı kahvesi içmek harika bir deneyim. 🌊☀️",
    image_url:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    likes_count: 44,
    comments_count: 1,
    is_liked: false,
    comments: [],
    created_at: "12 saat önce",
  },
  {
    id: "post-006",
    user_id: "u-106",
    author_name: "Mert Aydın",
    author_username: "mert_geziyor",
    author_avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    destination_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
    destination_name: "İstanbul",
    location_name: "Galata Kulesi, İstanbul",
    caption:
      "Galata Kulesi'nin terasından Tarihi Yarımada ve Boğaz'ı izlemek asla eskimeyen bir tutku. Akşamüstü ışığında martılarla birlikte muhteşem kareler yakalayabilirsiniz! 📸✨",
    image_url:
      "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1200&q=80",
    likes_count: 73,
    comments_count: 4,
    is_liked: false,
    comments: [],
    created_at: "1 gün önce",
  },
];

