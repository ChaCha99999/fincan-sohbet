export interface ClassicTabooCard {
  id: string;
  word: string;
  tabooWords: [string, string, string, string, string];
  category?: string;
}

export const CLASSIC_TABOO_CARDS: ClassicTabooCard[] = [
  // 1-15: Genel Eşyalar & Teknoloji
  {
    id: 'taboo-1',
    word: 'TELEVİZYON',
    tabooWords: ['Ekran', 'Kumanda', 'Kanal', 'Dizi', 'İzlemek'],
    category: 'Eşya & Teknoloji'
  },
  {
    id: 'taboo-2',
    word: 'BUZDOLABI',
    tabooWords: ['Soğuk', 'Mutfak', 'Yemek', 'Buzluk', 'Dondurucu'],
    category: 'Ev Eşyası'
  },
  {
    id: 'taboo-3',
    word: 'BİLGİSAYAR',
    tabooWords: ['Klavye', 'Fare', 'İnternet', 'Ekran', 'Laptop'],
    category: 'Teknoloji'
  },
  {
    id: 'taboo-4',
    word: 'KULAKLIK',
    tabooWords: ['Müzik', 'Ses', 'Şarkı', 'Kulak', 'Kablo'],
    category: 'Teknoloji'
  },
  {
    id: 'taboo-5',
    word: 'AYNA',
    tabooWords: ['Cam', 'Bakmak', 'Yansıma', 'Görüntü', 'Kırılmak'],
    category: 'Eşya'
  },
  {
    id: 'taboo-6',
    word: 'ŞEMSİYE',
    tabooWords: ['Yağmur', 'Islanmak', 'Hava', 'Açmak', 'Su'],
    category: 'Aksesuar'
  },
  {
    id: 'taboo-7',
    word: 'FOTOĞRAF MAKİNESİ',
    tabooWords: ['Resim', 'Çekmek', 'Poz', 'Lens', 'Kamera'],
    category: 'Teknoloji'
  },
  {
    id: 'taboo-8',
    word: 'ÜTÜ',
    tabooWords: ['Kıyafet', 'Kırışık', 'Buhar', 'Sıcak', 'Gömlek'],
    category: 'Ev Eşyası'
  },
  {
    id: 'taboo-9',
    word: 'SAAT',
    tabooWords: ['Zaman', 'Yelkovan', 'Akrep', 'Dakika', 'Kol'],
    category: 'Aksesuar'
  },
  {
    id: 'taboo-10',
    word: 'GÖZLÜK',
    tabooWords: ['Göz', 'Görmek', 'Cam', 'Çerçeve', 'Numara'],
    category: 'Aksesuar'
  },
  {
    id: 'taboo-11',
    word: 'PUSULA',
    tabooWords: ['Yön', 'Kuzey', 'Güney', 'İbre', 'Kaybolmak'],
    category: 'Araç'
  },
  {
    id: 'taboo-12',
    word: 'MİKROFON',
    tabooWords: ['Ses', 'Şarkı', 'Sahne', 'Hoparlör', 'Konuşmak'],
    category: 'Müzik & Ses'
  },
  {
    id: 'taboo-13',
    word: 'ASANSÖR',
    tabooWords: ['Kat', 'Bina', 'İnmek', 'Çıkmak', 'Düğme'],
    category: 'Yapı'
  },
  {
    id: 'taboo-14',
    word: 'GİTAR',
    tabooWords: ['Tel', 'Müzik', 'Çalmak', 'Akort', 'Enstrüman'],
    category: 'Müzik'
  },
  {
    id: 'taboo-15',
    word: 'BİSİKLET',
    tabooWords: ['Pedal', 'Tekerlek', 'Sürmek', 'Zincir', 'İki'],
    category: 'Ulaşım'
  },

  // 16-30: Doğa, Hayvanlar & Coğrafya
  {
    id: 'taboo-16',
    word: 'GÜNEŞ',
    tabooWords: ['Sıcak', 'Sarı', 'Gündüz', 'Işık', 'Yaz'],
    category: 'Doğa & Uzay'
  },
  {
    id: 'taboo-17',
    word: 'PENGUEN',
    tabooWords: ['Kutup', 'Kuş', 'Uçmak', 'Buz', 'Antarktika'],
    category: 'Hayvanlar'
  },
  {
    id: 'taboo-18',
    word: 'VOLKAN (YANARDAĞ)',
    tabooWords: ['Lav', 'Patlamak', 'Magma', 'Ateş', 'Dağ'],
    category: 'Coğrafya'
  },
  {
    id: 'taboo-19',
    word: 'ŞELALE',
    tabooWords: ['Su', 'Akmak', 'Yüksek', 'Nehir', 'Dökülmek'],
    category: 'Coğrafya'
  },
  {
    id: 'taboo-20',
    word: 'KANGURU',
    tabooWords: ['Avustralya', 'Kese', 'Zıplamak', 'Yavru', 'Kuyruk'],
    category: 'Hayvanlar'
  },
  {
    id: 'taboo-21',
    word: 'ORMAN',
    tabooWords: ['Ağaç', 'Yeşil', 'Doğa', 'Yaprak', 'Hayvan'],
    category: 'Doğa'
  },
  {
    id: 'taboo-22',
    word: 'DEPREM',
    tabooWords: ['Fay', 'Sallanmak', 'Yıkılmak', 'Şiddet', 'Richter'],
    category: 'Doğa Olayı'
  },
  {
    id: 'taboo-23',
    word: 'ÇÖL',
    tabooWords: ['Kum', 'Sıcak', 'Kaktüs', 'Deve', 'Vaha'],
    category: 'Coğrafya'
  },
  {
    id: 'taboo-24',
    word: 'ZÜRAFA',
    tabooWords: ['Boyun', 'Uzun', 'Benekli', 'Afrika', 'Ağaç'],
    category: 'Hayvanlar'
  },
  {
    id: 'taboo-25',
    word: 'GÖKKUŞAĞI',
    tabooWords: ['Renk', 'Yağmur', 'Güneş', 'Gökyüzü', 'Yedi'],
    category: 'Doğa Olayı'
  },
  {
    id: 'taboo-26',
    word: 'BUZUL',
    tabooWords: ['Kutup', 'Soğuk', 'Erimak', 'Buz', 'Devasa'],
    category: 'Coğrafya'
  },
  {
    id: 'taboo-27',
    word: 'KARTAL',
    tabooWords: ['Kuş', 'Uçmak', 'Göz', 'Pençe', 'Yırtıcı'],
    category: 'Hayvanlar'
  },
  {
    id: 'taboo-28',
    word: 'KÖPEKBALIĞI',
    tabooWords: ['Deniz', 'Diş', 'Yüzgeç', 'Isırmak', 'Okyanus'],
    category: 'Deniz Canlısı'
  },
  {
    id: 'taboo-29',
    word: 'MAĞARA',
    tabooWords: ['Karanlık', 'Yarasa', 'Taş', 'Giriş', 'Sarkıt'],
    category: 'Coğrafya'
  },
  {
    id: 'taboo-30',
    word: 'BUKALEMUN',
    tabooWords: ['Renk', 'Değişmek', 'Kertenkele', 'Kamuflaj', 'Göz'],
    category: 'Hayvanlar'
  },

  // 31-45: Sanat, Spor & Eğlence
  {
    id: 'taboo-31',
    word: 'FUTBOL',
    tabooWords: ['Top', 'Gol', 'Kale', 'Hakem', 'Maç'],
    category: 'Spor'
  },
  {
    id: 'taboo-32',
    word: 'SİNEMA',
    tabooWords: ['Film', 'Perde', 'Patlamış Mısır', 'Bilet', 'Salon'],
    category: 'Sanat & Kültür'
  },
  {
    id: 'taboo-33',
    word: 'TİYATRO',
    tabooWords: ['Sahne', 'Oyuncu', 'Perde', 'Replik', 'Oyun'],
    category: 'Sanat'
  },
  {
    id: 'taboo-34',
    word: 'BASKETBOL',
    tabooWords: ['Pota', 'Top', 'Basket', 'Smaç', 'Turnike'],
    category: 'Spor'
  },
  {
    id: 'taboo-35',
    word: 'HEYKEL',
    tabooWords: ['Mermer', 'Sanatçı', 'Yontmak', 'Kil', 'Müze'],
    category: 'Sanat'
  },
  {
    id: 'taboo-36',
    word: 'SATRANÇ',
    tabooWords: ['Şah', 'Mat', 'Vezir', 'Piyon', 'Tahta'],
    category: 'Zeka Oyunu'
  },
  {
    id: 'taboo-37',
    word: 'KONSER',
    tabooWords: ['Müzik', 'Şarkıcı', 'Sahne', 'Bilet', 'Canlı'],
    category: 'Eğlence'
  },
  {
    id: 'taboo-38',
    word: 'KARAOKE',
    tabooWords: ['Şarkı', 'Mikrofon', 'Söylemek', 'Söz', 'Ekran'],
    category: 'Eğlence'
  },
  {
    id: 'taboo-39',
    word: 'LUNAPARK',
    tabooWords: ['Dönme Dolap', 'Tren', 'Çarpışan Oto', 'Eğlence', 'Atlıkarınca'],
    category: 'Eğlence'
  },
  {
    id: 'taboo-40',
    word: 'SİRK',
    tabooWords: ['Palyaço', 'Çadır', 'Akrobat', 'Gösteri', 'Trapez'],
    category: 'Eğlence'
  },
  {
    id: 'taboo-41',
    word: 'YÜZME',
    tabooWords: ['Havuz', 'Deniz', 'Kulaç', 'Su', 'Mayo'],
    category: 'Spor'
  },
  {
    id: 'taboo-42',
    word: 'KAYAK',
    tabooWords: ['Kar', 'Kış', 'Dağ', 'Baton', 'Kayak Merkezi'],
    category: 'Kış Sporu'
  },
  {
    id: 'taboo-43',
    word: 'BALE',
    tabooWords: ['Dans', 'Tütü', 'Parmak Ucu', 'Müzik', 'Kuğu'],
    category: 'Dans & Sanat'
  },
  {
    id: 'taboo-44',
    word: 'BOKS',
    tabooWords: ['Ring', 'Eldiven', 'Yumruk', 'Raund', 'Nakavt'],
    category: 'Spor'
  },
  {
    id: 'taboo-45',
    word: 'SİHİRBAZ',
    tabooWords: ['Numara', 'Şapka', 'Tavşan', 'Hile', 'İllüzyon'],
    category: 'Gösteri'
  },

  // 46-60: Meslekler & Toplum
  {
    id: 'taboo-46',
    word: 'DOKTOR',
    tabooWords: ['Hastane', 'İlaç', 'Muayene', 'Hasta', 'Reçete'],
    category: 'Meslek'
  },
  {
    id: 'taboo-47',
    word: 'ÖĞRETMEN',
    tabooWords: ['Okul', 'Öğrenci', 'Ders', 'Sınıf', 'Tahta'],
    category: 'Meslek'
  },
  {
    id: 'taboo-48',
    word: 'AŞÇI',
    tabooWords: ['Yemek', 'Mutfak', 'Önlük', 'Restoran', 'Tencere'],
    category: 'Meslek'
  },
  {
    id: 'taboo-49',
    word: 'PİLOT',
    tabooWords: ['Uçak', 'Havalimanı', 'Uçmak', 'Kokpit', 'Hava'],
    category: 'Meslek'
  },
  {
    id: 'taboo-50',
    word: 'İTFAİYECİ',
    tabooWords: ['Yangın', 'Hortum', 'Su', 'Söndürmek', 'Merdiven'],
    category: 'Meslek'
  },
  {
    id: 'taboo-51',
    word: 'AVUKAT',
    tabooWords: ['Mahkeme', 'Dava', 'Hakim', 'Cübbe', 'Hukuk'],
    category: 'Meslek'
  },
  {
    id: 'taboo-52',
    word: 'BERBER',
    tabooWords: ['Saç', 'Tıraş', 'Makas', 'Ayna', 'Fön'],
    category: 'Meslek'
  },
  {
    id: 'taboo-53',
    word: 'KASAP',
    tabooWords: ['Et', 'Kıyma', 'Bıçak', 'Tavuk', 'Biftek'],
    category: 'Meslek'
  },
  {
    id: 'taboo-54',
    word: 'MİMAR',
    tabooWords: ['Bina', 'Çizim', 'Proje', 'İnşaat', 'Plan'],
    category: 'Meslek'
  },
  {
    id: 'taboo-55',
    word: 'KAPTAN',
    tabooWords: ['Gemi', 'Deniz', 'Dümen', 'Liman', 'Dalga'],
    category: 'Meslek'
  },
  {
    id: 'taboo-56',
    word: 'HAKEM',
    tabooWords: ['Düdük', 'Kart', 'Sarı', 'Kırmızı', 'Maç'],
    category: 'Spor'
  },
  {
    id: 'taboo-57',
    word: 'DİŞ HEKİMİ',
    tabooWords: ['Diş', 'Dolgu', 'Çürük', 'Çekmek', 'Fırça'],
    category: 'Sağlık'
  },
  {
    id: 'taboo-58',
    word: 'ASTRONOT',
    tabooWords: ['Uzay', 'Roket', 'Ay', 'Kıyafet', 'NASA'],
    category: 'Bilim'
  },
  {
    id: 'taboo-59',
    word: 'POLİS',
    tabooWords: ['Karakol', 'Üniforma', 'Suçlu', 'Kelepçe', 'Siren'],
    category: 'Güvenlik'
  },
  {
    id: 'taboo-60',
    word: 'TERZİ',
    tabooWords: ['Dikiş', 'İğne', 'İplik', 'Kumaş', 'Paça'],
    category: 'Zanaat'
  },

  // 61-75: Duygular, Kavramlar & Soyut Şeyler
  {
    id: 'taboo-61',
    word: 'AŞK',
    tabooWords: ['Kalp', 'Sevgi', 'Romantik', 'Sevgili', 'Duygu'],
    category: 'Duygu'
  },
  {
    id: 'taboo-62',
    word: 'ÖFKE',
    tabooWords: ['Kızmak', 'Sinir', 'Bağırmak', 'Sakin', 'Duygu'],
    category: 'Duygu'
  },
  {
    id: 'taboo-63',
    word: 'MUTLULUK',
    tabooWords: ['Gülmek', 'Sevinç', 'Neşe', 'Huzur', 'Keyif'],
    category: 'Duygu'
  },
  {
    id: 'taboo-64',
    word: 'KORKU',
    tabooWords: ['Ürkmek', 'Karanlık', 'Çığlık', 'Kabus', 'Panik'],
    category: 'Duygu'
  },
  {
    id: 'taboo-65',
    word: 'ÖZLEM',
    tabooWords: ['Hasret', 'Kavuşmak', 'Uzak', 'Görmek', 'Hatırlamak'],
    category: 'Duygu'
  },
  {
    id: 'taboo-66',
    word: 'KADER',
    tabooWords: ['Kısmet', 'Alın Yazısı', 'Gelecek', 'Tesadüf', 'Yazılmak'],
    category: 'Felsefe'
  },
  {
    id: 'taboo-67',
    word: 'RÜYA',
    tabooWords: ['Uyumak', 'Gece', 'Görmek', 'Kabus', 'Uyanmak'],
    category: 'Kavram'
  },
  {
    id: 'taboo-68',
    word: 'ZAMAN',
    tabooWords: ['Saat', 'Geçmek', 'Dakika', 'Geçmiş', 'Gelecek'],
    category: 'Kavram'
  },
  {
    id: 'taboo-69',
    word: 'ADALET',
    tabooWords: ['Mahkeme', 'Hak', 'Hukuk', 'Terazi', 'Eşitlik'],
    category: 'Kavram'
  },
  {
    id: 'taboo-70',
    word: 'GÜVEN',
    tabooWords: ['İnanmak', 'Sır', 'Sadakat', 'Şüphe', 'Doğruluk'],
    category: 'Kavram'
  },
  {
    id: 'taboo-71',
    word: 'CESARET',
    tabooWords: ['Korkusuz', 'Kahraman', 'Yürek', 'Adım', 'Atılmak'],
    category: 'Karakter'
  },
  {
    id: 'taboo-72',
    word: 'SABIR',
    tabooWords: ['Beklemek', 'Tahammül', 'Zaman', 'Acele', 'Sakin'],
    category: 'Erdem'
  },
  {
    id: 'taboo-73',
    word: 'VİCDAN',
    tabooWords: ['Rahat', 'Azap', 'İç Ses', 'Ahlak', 'Pişmanlık'],
    category: 'Kavram'
  },
  {
    id: 'taboo-74',
    word: 'ŞANS',
    tabooWords: ['Talih', 'Piyango', 'Kısmet', 'Kader', 'Uğur'],
    category: 'Kavram'
  },
  {
    id: 'taboo-75',
    word: 'SIR',
    tabooWords: ['Gizli', 'Söylememek', 'Kulak', 'Fısıldamak', 'Öğrenmek'],
    category: 'Kavram'
  },

  // 76-90: Yiyecekler, İçecekler & Mutfak
  {
    id: 'taboo-76',
    word: 'PİZZA',
    tabooWords: ['İtalya', 'Peynir', 'Dilim', 'Hamur', 'Sucuk'],
    category: 'Yemek'
  },
  {
    id: 'taboo-77',
    word: 'HAMBURGER',
    tabooWords: ['Köfte', 'Ekmek', 'Patates', 'Ketçap', 'Fast Food'],
    category: 'Yemek'
  },
  {
    id: 'taboo-78',
    word: 'ÇİKOLATA',
    tabooWords: ['Tatlı', 'Kakao', 'Sütlü', 'Bitter', 'Kare'],
    category: 'Tatlı'
  },
  {
    id: 'taboo-79',
    word: 'DONDURMA',
    tabooWords: ['Külah', 'Soğuk', 'Top', 'Yaz', 'Erimak'],
    category: 'Tatlı'
  },
  {
    id: 'taboo-80',
    word: 'MAKARNA',
    tabooWords: ['İtalyan', 'Haşlamak', 'Sos', 'Spagetti', 'Salça'],
    category: 'Yemek'
  },
  {
    id: 'taboo-81',
    word: 'KARPUZ',
    tabooWords: ['Yaz', 'Çekirdek', 'Kırmızı', 'Kabuk', 'Peynir'],
    category: 'Meyve'
  },
  {
    id: 'taboo-82',
    word: 'ÇAYDANLIK',
    tabooWords: ['Demlik', 'Çay', 'Kaynamak', 'Su', 'Alt'],
    category: 'Mutfak'
  },
  {
    id: 'taboo-83',
    word: 'LİMON',
    tabooWords: ['Ekşi', 'Sarı', 'Sıkmak', 'Çorba', 'C Vitamini'],
    category: 'Meyve'
  },
  {
    id: 'taboo-84',
    word: 'EKMEK',
    tabooWords: ['Fırın', 'Un', 'Dilim', 'Buğday', 'Somun'],
    category: 'Gıda'
  },
  {
    id: 'taboo-85',
    word: 'ÇORBA',
    tabooWords: ['Kaşık', 'Sıcak', 'Kase', 'İçmek', 'Mercimek'],
    category: 'Yemek'
  },
  {
    id: 'taboo-86',
    word: 'BAL',
    tabooWords: ['Arı', 'Kovan', 'Tatlı', 'Kahvaltı', 'Petek'],
    category: 'Gıda'
  },
  {
    id: 'taboo-87',
    word: 'PATATES',
    tabooWords: ['Kızartma', 'Püre', 'Cips', 'Toprak', 'Ketçap'],
    category: 'Sebze'
  },
  {
    id: 'taboo-88',
    word: 'TUZ',
    tabooWords: ['Beyaz', 'Yemek', 'Biber', 'Baharat', 'Tuzluk'],
    category: 'Gıda'
  },
  {
    id: 'taboo-89',
    word: 'YUMURTA',
    tabooWords: ['Tavuk', 'Sarısı', 'Beyazı', 'Kabuk', 'Omlet'],
    category: 'Gıda'
  },
  {
    id: 'taboo-90',
    word: 'PEYNİR',
    tabooWords: ['Süt', 'Kaşar', 'Beyaz', 'Kahvaltı', 'Dilim'],
    category: 'Gıda'
  },

  // 91-105: Tarih, Mimari & Kültürel Semboller
  {
    id: 'taboo-91',
    word: 'PİRAMİT',
    tabooWords: ['Mısır', 'Firavun', 'Üçgen', 'Mezar', 'Keops'],
    category: 'Tarih & Mimari'
  },
  {
    id: 'taboo-92',
    word: 'EYFEL KULESİ',
    tabooWords: ['Fransa', 'Paris', 'Demir', 'Anıt', 'Şehir'],
    category: 'Mimari'
  },
  {
    id: 'taboo-93',
    word: 'KÖPRÜ',
    tabooWords: ['Geçmek', 'Nehir', 'Boğaz', 'Ayak', 'Yol'],
    category: 'Mimari'
  },
  {
    id: 'taboo-94',
    word: 'MÜZE',
    tabooWords: ['Tarihi', 'Eser', 'Sergi', 'Heykel', 'Gezmek'],
    category: 'Kültür'
  },
  {
    id: 'taboo-95',
    word: 'KÜTÜPHANE',
    tabooWords: ['Kitap', 'Sessiz', 'Okumak', 'Raf', 'Ders'],
    category: 'Kültür'
  },
  {
    id: 'taboo-96',
    word: 'FİRAVUN',
    tabooWords: ['Mısır', 'Kral', 'Mumya', 'Piramit', 'Antik'],
    category: 'Tarih'
  },
  {
    id: 'taboo-97',
    word: 'SARAY',
    tabooWords: ['Padişah', 'Kral', 'Görkemli', 'Oda', 'Taht'],
    category: 'Mimari'
  },
  {
    id: 'taboo-98',
    word: 'HARİTA',
    tabooWords: ['Dünya', 'Ülke', 'Şehir', 'Sınır', 'Atlas'],
    category: 'Coğrafya'
  },
  {
    id: 'taboo-99',
    word: 'BAYRAK',
    tabooWords: ['Ülke', 'Kırmızı', 'Hilal', 'Yıldız', 'Gönder'],
    category: 'Milli Sembol'
  },
  {
    id: 'taboo-100',
    word: 'DENİZ FENERİ',
    tabooWords: ['Işık', 'Gemi', 'Gece', 'Kıyı', 'Karanlık'],
    category: 'Denizcilik'
  },
];
