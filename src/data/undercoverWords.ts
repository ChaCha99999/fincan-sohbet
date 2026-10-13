export interface UndercoverWordPair {
  id: string;
  civilianWord: string;
  undercoverWord: string;
  category: string;
}

export const UNDERCOVER_WORD_PAIRS: UndercoverWordPair[] = [
  // Kafe & Yeme-İçme
  { id: 'uc-1', civilianWord: 'Türk Kahvesi', undercoverWord: 'Filtre Kahve', category: 'Kafe & İçecek' },
  { id: 'uc-2', civilianWord: 'Çay', undercoverWord: 'Ihlamur', category: 'Kafe & İçecek' },
  { id: 'uc-3', civilianWord: 'Döner', undercoverWord: 'İskender', category: 'Yemek' },
  { id: 'uc-4', civilianWord: 'Lahmacun', undercoverWord: 'Kıymalı Pide', category: 'Yemek' },
  { id: 'uc-5', civilianWord: 'Menemen', undercoverWord: 'Çılbır', category: 'Yemek' },
  { id: 'uc-6', civilianWord: 'Baklava', undercoverWord: 'Künefe', category: 'Tatlı' },
  { id: 'uc-7', civilianWord: 'San Sebastian', undercoverWord: 'Sufle', category: 'Tatlı' },
  { id: 'uc-8', civilianWord: 'Simit', undercoverWord: 'Açma', category: 'Kahvaltı' },
  { id: 'uc-9', civilianWord: 'Midye Dolma', undercoverWord: 'Kokoreç', category: 'Sokak Lezzeti' },
  { id: 'uc-10', civilianWord: 'Ayran', undercoverWord: 'Şalgam', category: 'İçecek' },
  { id: 'uc-11', civilianWord: 'Karpuz', undercoverWord: 'Kavun', category: 'Meyve' },
  { id: 'uc-12', civilianWord: 'Kruvasan', undercoverWord: 'Boyoz', category: 'Fırın' },
  { id: 'uc-13', civilianWord: 'Ketçap', undercoverWord: 'Mayonez', category: 'Sos' },
  { id: 'uc-14', civilianWord: 'Mantı', undercoverWord: 'Hıngel', category: 'Yemek' },
  { id: 'uc-15', civilianWord: 'Mercimek Çorbası', undercoverWord: 'Ezogelin Çorbası', category: 'Yemek' },

  // Günlük Hayat & Sosyal Medya
  { id: 'uc-16', civilianWord: 'Instagram', undercoverWord: 'TikTok', category: 'Sosyal Medya' },
  { id: 'uc-17', civilianWord: 'WhatsApp', undercoverWord: 'Telegram', category: 'İletişim' },
  { id: 'uc-18', civilianWord: 'Taksi', undercoverWord: 'Dolmuş', category: 'Ulaşım' },
  { id: 'uc-19', civilianWord: 'Metro', undercoverWord: 'Tramvay', category: 'Ulaşım' },
  { id: 'uc-20', civilianWord: 'Spotify', undercoverWord: 'YouTube Music', category: 'Teknoloji' },
  { id: 'uc-21', civilianWord: 'Netflix', undercoverWord: 'Sinema', category: 'Eğlence' },
  { id: 'uc-22', civilianWord: 'Kulaklık', undercoverWord: 'Hoparlör', category: 'Teknoloji' },
  { id: 'uc-23', civilianWord: 'Dizüstü Bilgisayar (Laptop)', undercoverWord: 'Tablet', category: 'Teknoloji' },
  { id: 'uc-24', civilianWord: 'Kredi Kartı', undercoverWord: 'Nakit Para', category: 'Para' },
  { id: 'uc-25', civilianWord: 'Pazar', undercoverWord: 'Pazartesi', category: 'Zaman' },

  // Popüler Kültür & Oyunlar
  { id: 'uc-26', civilianWord: 'Tavla', undercoverWord: 'Okey', category: 'Masa Oyunu' },
  { id: 'uc-27', civilianWord: 'Satranç', undercoverWord: 'Dama', category: 'Masa Oyunu' },
  { id: 'uc-28', civilianWord: 'Gibi', undercoverWord: 'Avrupa Yakası', category: 'Dizi' },
  { id: 'uc-29', civilianWord: 'Aşk-ı Memnu', undercoverWord: 'Yaprak Dökümü', category: 'Dizi' },
  { id: 'uc-30', civilianWord: 'Futbol', undercoverWord: 'Basketbol', category: 'Spor' },
  { id: 'uc-31', civilianWord: 'Gitar', undercoverWord: 'Bağlama', category: 'Müzik' },
  { id: 'uc-32', civilianWord: 'Tarkan', undercoverWord: 'Mustafa Sandal', category: 'Müzik' },
  { id: 'uc-33', civilianWord: 'Sezen Aksu', undercoverWord: 'Ajda Pekkan', category: 'Müzik' },
  { id: 'uc-34', civilianWord: 'Cem Yılmaz', undercoverWord: 'Ata Demirer', category: 'Komedi' },
  { id: 'uc-35', civilianWord: 'Harry Potter', undercoverWord: 'Yüzüklerin Efendisi', category: 'Sinema' },

  // Doğa, Eşya & Mekan
  { id: 'uc-36', civilianWord: 'Kedi', undercoverWord: 'Köpek', category: 'Hayvan' },
  { id: 'uc-37', civilianWord: 'Güneş', undercoverWord: 'Ay', category: 'Doğa' },
  { id: 'uc-38', civilianWord: 'Deniz', undercoverWord: 'Havuz', category: 'Tatil' },
  { id: 'uc-39', civilianWord: 'Yaz', undercoverWord: 'İlkbahar', category: 'Mevsim' },
  { id: 'uc-40', civilianWord: 'Kar', undercoverWord: 'Dolu', category: 'Hava Durumu' },
  { id: 'uc-41', civilianWord: 'Çadır', undercoverWord: 'Bungalov', category: 'Kamp' },
  { id: 'uc-42', civilianWord: 'Gözlük', undercoverWord: 'Lens', category: 'Aksesuar' },
  { id: 'uc-43', civilianWord: 'Saat', undercoverWord: 'Bileklik', category: 'Aksesuar' },
  { id: 'uc-44', civilianWord: 'Yastık', undercoverWord: 'Minder', category: 'Ev' },
  { id: 'uc-45', civilianWord: 'Ayna', undercoverWord: 'Cam', category: 'Eşya' },

  // Kavramlar & Eğlenceli Detaylar
  { id: 'uc-46', civilianWord: 'Stalk', undercoverWord: 'Gıybet', category: 'Sosyal' },
  { id: 'uc-47', civilianWord: 'Flört', undercoverWord: 'Manita', category: 'İlişkiler' },
  { id: 'uc-48', civilianWord: 'Alarm', undercoverWord: 'Horoz', category: 'Sabah' },
  { id: 'uc-49', civilianWord: 'Garson', undercoverWord: 'Komi', category: 'Kafe' },
  { id: 'uc-50', civilianWord: 'Bahşiş', undercoverWord: 'İkram', category: 'Kafe' },
];
