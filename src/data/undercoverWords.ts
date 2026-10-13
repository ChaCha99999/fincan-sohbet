export interface UndercoverWordPair {
  id: string;
  civilianWord: string;
  undercoverWord: string;
  category: string;
}

export const UNDERCOVER_WORD_PAIRS: UndercoverWordPair[] = [
  // =========================================================================
  // 1. KAFE, KAHVE & YEME-İÇME (Masa Sohbetine Özel)
  // =========================================================================
  { id: 'uc-1', civilianWord: 'Türk Kahvesi', undercoverWord: 'Filtre Kahve', category: 'Kafe & İçecek' },
  { id: 'uc-2', civilianWord: 'Siyah Çay', undercoverWord: 'Yeşil Çay', category: 'Kafe & İçecek' },
  { id: 'uc-3', civilianWord: 'Latte', undercoverWord: 'Cappuccino', category: 'Kafe & İçecek' },
  { id: 'uc-4', civilianWord: 'Espresso', undercoverWord: 'Ristretto', category: 'Kafe & İçecek' },
  { id: 'uc-5', civilianWord: 'Limonata', undercoverWord: 'Soğuk Çay (Ice Tea)', category: 'Soğuk İçecek' },
  { id: 'uc-6', civilianWord: 'Ayran', undercoverWord: 'Kefir', category: 'İçecek' },
  { id: 'uc-7', civilianWord: 'Döner', undercoverWord: 'İskender', category: 'Yemek' },
  { id: 'uc-8', civilianWord: 'Lahmacun', undercoverWord: 'Kıymalı Pide', category: 'Yemek' },
  { id: 'uc-9', civilianWord: 'Menemen', undercoverWord: 'Çılbır', category: 'Kahvaltı' },
  { id: 'uc-10', civilianWord: 'Baklava', undercoverWord: 'Şöbiyet', category: 'Tatlı' },
  { id: 'uc-11', civilianWord: 'Künefe', undercoverWord: 'Katmer', category: 'Tatlı' },
  { id: 'uc-12', civilianWord: 'San Sebastian', undercoverWord: 'Sufle', category: 'Tatlı' },
  { id: 'uc-13', civilianWord: 'Simit', undercoverWord: 'Açma', category: 'Fırın & Kahvaltı' },
  { id: 'uc-14', civilianWord: 'Poğaça', undercoverWord: 'Börek', category: 'Fırın' },
  { id: 'uc-15', civilianWord: 'Kruvasan', undercoverWord: 'Donut', category: 'Fırın & Tatlı' },
  { id: 'uc-16', civilianWord: 'Midye Dolma', undercoverWord: 'Kokoreç', category: 'Sokak Lezzeti' },
  { id: 'uc-17', civilianWord: 'Karpuz', undercoverWord: 'Kavun', category: 'Meyve' },
  { id: 'uc-18', civilianWord: 'Ketçap', undercoverWord: 'Mayonez', category: 'Sos' },
  { id: 'uc-19', civilianWord: 'Mantı', undercoverWord: 'Hıngel', category: 'Yemek' },
  { id: 'uc-20', civilianWord: 'Mercimek Çorbası', undercoverWord: 'Ezogelin Çorbası', category: 'Çorba' },
  { id: 'uc-21', civilianWord: 'Hamburger', undercoverWord: 'Cheeseburger', category: 'Fast Food' },
  { id: 'uc-22', civilianWord: 'Patates Kızartması', undercoverWord: 'Soğan Halkası', category: 'Atıştırmalık' },

  // =========================================================================
  // 2. GÜNLÜK HAYAT, ALIŞKANLIKLAR & SOSYAL MEDYA
  // =========================================================================
  { id: 'uc-23', civilianWord: 'Instagram', undercoverWord: 'TikTok', category: 'Sosyal Medya' },
  { id: 'uc-24', civilianWord: 'WhatsApp', undercoverWord: 'Telegram', category: 'Mesajlaşma' },
  { id: 'uc-25', civilianWord: 'Spotify', undercoverWord: 'Apple Music', category: 'Müzik Platformu' },
  { id: 'uc-26', civilianWord: 'Netflix', undercoverWord: 'BluTV', category: 'Dizi Platformu' },
  { id: 'uc-27', civilianWord: 'Taksi', undercoverWord: 'Dolmuş', category: 'Ulaşım' },
  { id: 'uc-28', civilianWord: 'Metro', undercoverWord: 'Tramvay', category: 'Ulaşım' },
  { id: 'uc-29', civilianWord: 'Vapur', undercoverWord: 'Motor (Deniz Taksi)', category: 'Ulaşım' },
  { id: 'uc-30', civilianWord: 'Kulaklık', undercoverWord: 'Hoparlör', category: 'Teknoloji' },
  { id: 'uc-31', civilianWord: 'Dizüstü Bilgisayar (Laptop)', undercoverWord: 'Tablet', category: 'Teknoloji' },
  { id: 'uc-32', civilianWord: 'Kredi Kartı', undercoverWord: 'Banka Kartı (Debit)', category: 'Ödeme' },
  { id: 'uc-33', civilianWord: 'Cumartesi', undercoverWord: 'Pazar', category: 'Hafta Sonu' },
  { id: 'uc-34', civilianWord: 'Parfüm', undercoverWord: 'Deodorant', category: 'Kişisel Bakım' },
  { id: 'uc-35', civilianWord: 'Güneş Gözlüğü', undercoverWord: 'Numaralı Gözlük', category: 'Aksesuar' },
  { id: 'uc-36', civilianWord: 'Şemsiye', undercoverWord: 'Yağmurluk', category: 'Giyim & Yağmur' },
  { id: 'uc-37', civilianWord: 'Sırt Çantası', undercoverWord: 'Omuz Çantası', category: 'Aksesuar' },
  { id: 'uc-38', civilianWord: 'Telefon Alarmı', undercoverWord: 'Çalar Saat', category: 'Uyanma' },
  { id: 'uc-39', civilianWord: 'Ayna', undercoverWord: 'Ön Kamera (Selfie)', category: 'Görüntü' },
  { id: 'uc-40', civilianWord: 'Trendyol', undercoverWord: 'Hepsiburada', category: 'Alışveriş' },

  // =========================================================================
  // 3. POPÜLER KÜLTÜR, DİZİ & EĞLENCE
  // =========================================================================
  { id: 'uc-41', civilianWord: 'Tavla', undercoverWord: 'Okey', category: 'Masa Oyunu' },
  { id: 'uc-42', civilianWord: 'Satranç', undercoverWord: 'Dama', category: 'Zeka Oyunu' },
  { id: 'uc-43', civilianWord: 'King', undercoverWord: 'Batak', category: 'Kağıt Oyunu' },
  { id: 'uc-44', civilianWord: 'Gibi (Dizi)', undercoverWord: 'Avrupa Yakası', category: 'Komedi Dizisi' },
  { id: 'uc-45', civilianWord: 'Aşk-ı Memnu', undercoverWord: 'Yaprak Dökümü', category: 'Dram Dizisi' },
  { id: 'uc-46', civilianWord: 'Kurtlar Vadisi', undercoverWord: 'Ezel', category: 'Dizi' },
  { id: 'uc-47', civilianWord: 'Cem Yılmaz', undercoverWord: 'Ata Demirer', category: 'Komedyen' },
  { id: 'uc-48', civilianWord: 'Tarkan', undercoverWord: 'Mustafa Sandal', category: 'Pop Müzik' },
  { id: 'uc-49', civilianWord: 'Sezen Aksu', undercoverWord: 'Ajda Pekkan', category: 'Müzik' },
  { id: 'uc-50', civilianWord: 'Harry Potter', undercoverWord: 'Yüzüklerin Efendisi', category: 'Fantastik Sinema' },
  { id: 'uc-51', civilianWord: 'Futbol', undercoverWord: 'Basketbol', category: 'Takım Sporu' },
  { id: 'uc-52', civilianWord: 'Voleybol', undercoverWord: 'Tenis', category: 'Spor' },
  { id: 'uc-53', civilianWord: 'Gitar', undercoverWord: 'Bağlama', category: 'Enstrüman' },
  { id: 'uc-54', civilianWord: 'Piyano', undercoverWord: 'Org', category: 'Enstrüman' },

  // =========================================================================
  // 4. DOĞA, MEKAN & TATİL
  // =========================================================================
  { id: 'uc-55', civilianWord: 'Kedi', undercoverWord: 'Köpek', category: 'Evcil Hayvan' },
  { id: 'uc-56', civilianWord: 'Deniz', undercoverWord: 'Havuz', category: 'Yüzme' },
  { id: 'uc-57', civilianWord: 'Güneş', undercoverWord: 'Dolunay', category: 'Gökyüzü' },
  { id: 'uc-58', civilianWord: 'Yaz', undercoverWord: 'İlkbahar', category: 'Mevsim' },
  { id: 'uc-59', civilianWord: 'Sonbahar', undercoverWord: 'Kış', category: 'Mevsim' },
  { id: 'uc-60', civilianWord: 'Kar', undercoverWord: 'Dolu', category: 'Hava Olayı' },
  { id: 'uc-61', civilianWord: 'Çadır', undercoverWord: 'Bungalov', category: 'Kamp & Doğa' },
  { id: 'uc-62', civilianWord: 'Otel', undercoverWord: 'Pansiyon', category: 'Tatil' },
  { id: 'uc-63', civilianWord: 'Plaj', undercoverWord: 'İskele', category: 'Tatil' },
  { id: 'uc-64', civilianWord: 'Göl', undercoverWord: 'Baraj', category: 'Su Kaynağı' },

  // =========================================================================
  // 5. İLİŞKİLER, DEDİKODU & KAFE DİNAMİĞİ
  // =========================================================================
  { id: 'uc-65', civilianWord: 'Stalklamak', undercoverWord: 'Gözetlemek', category: 'Sosyal Davranış' },
  { id: 'uc-66', civilianWord: 'Gıybet', undercoverWord: 'Eleştiri', category: 'Sohbet' },
  { id: 'uc-67', civilianWord: 'Flört', undercoverWord: 'Sevgili', category: 'İlişki' },
  { id: 'uc-68', civilianWord: 'İlk Buluşma (First Date)', undercoverWord: 'Kör Randevu (Blind Date)', category: 'İlişki' },
  { id: 'uc-69', civilianWord: 'Garson', undercoverWord: 'Komi', category: 'Kafe Çalışanı' },
  { id: 'uc-70', civilianWord: 'Bahşiş', undercoverWord: 'Hesap İndirimi', category: 'Kafe' },
  { id: 'uc-71', civilianWord: 'Kahve Falı', undercoverWord: 'Burç Yorumu', category: 'Kehanet' },
  { id: 'uc-72', civilianWord: 'Piyango Bileti', undercoverWord: 'Kazı Kazan', category: 'Şans Oyunu' },
  { id: 'uc-73', civilianWord: 'Kredi Borcu', undercoverWord: 'Kira Ödemesi', category: 'Maddi Yük' },
  { id: 'uc-74', civilianWord: 'Diyet', undercoverWord: 'Aralıklı Oruç (Fast)', category: 'Beslenme' },
  { id: 'uc-75', civilianWord: 'Pazar Temizliği', undercoverWord: 'Bahar Temizliği', category: 'Ev İşi' },
  { id: 'uc-76', civilianWord: 'Düğün', undercoverWord: 'Nişan', category: 'Kutlama' },
  { id: 'uc-77', civilianWord: 'Yastık', undercoverWord: 'Minder', category: 'Ev Eşyası' },
  { id: 'uc-78', civilianWord: 'Battaniye', undercoverWord: 'Yorgan', category: 'Ev Tekstili' },
  { id: 'uc-79', civilianWord: 'Diş Fırçası', undercoverWord: 'Diş İpi', category: 'Ağız Bakımı' },
  { id: 'uc-80', civilianWord: 'Termos', undercoverWord: 'Matara', category: 'Taşınabilir Eşya' },
];
