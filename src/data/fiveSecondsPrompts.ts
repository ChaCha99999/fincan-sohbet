export interface FiveSecondsPrompt {
  id: string;
  category: string;
  prompt: string;
}

export const FIVE_SECONDS_PROMPTS: FiveSecondsPrompt[] = [
  // =========================================================================
  // 1. DİZİ, SİNEMA, MÜZİK & MİZAH (Popüler Kültür)
  // =========================================================================
  { id: 'fs-1', category: 'Dizi & Sinema', prompt: 'Gibi dizisinde geçen 3 sahne veya replik say!' },
  { id: 'fs-2', category: 'Dizi & Sinema', prompt: 'Aşk-ı Memnu dizisinden 3 karakter say!' },
  { id: 'fs-3', category: 'Müzik', prompt: 'Tarkan’ın 3 farklı şarkısını say!' },
  { id: 'fs-4', category: 'Dizi & Sinema', prompt: 'Avrupa Yakası’ndan 3 efsane karakter say!' },
  { id: 'fs-5', category: 'Müzik', prompt: 'Sezen Aksu’nun 3 unutulmaz şarkısını say!' },
  { id: 'fs-6', category: 'Mizah', prompt: 'Cem Yılmaz filmlerinden 3 tanesini say!' },
  { id: 'fs-7', category: 'Dizi & Sinema', prompt: 'Kurtlar Vadisi’nden 3 karakter say!' },
  { id: 'fs-8', category: 'Müzik', prompt: 'Türkçe Rock söyleyen 3 grup veya sanatçı say!' },
  { id: 'fs-9', category: 'Dizi & Sinema', prompt: 'Türk sinemasında meşhur 3 komedi karakteri say!' },
  { id: 'fs-10', category: 'Sinema', prompt: 'Hababam Sınıfı filminden 3 karakter veya lakap say!' },
  { id: 'fs-11', category: 'Dizi & Sinema', prompt: 'Ezel dizisinden 3 karakter say!' },
  { id: 'fs-12', category: 'Müzik', prompt: 'Duman grubunun 3 meşhur şarkısını say!' },
  { id: 'fs-13', category: 'Sinema', prompt: 'Marvel evreninden 3 süper kahraman say!' },
  { id: 'fs-14', category: 'Dizi & Sinema', prompt: 'Yeşilçam’ın unutulmaz 3 kadın oyuncusunu say!' },
  { id: 'fs-15', category: 'Mizah', prompt: 'Sosyal medyada viral olmuş 3 komik replik say!' },

  // =========================================================================
  // 2. GÜNLÜK HAYAT, BAHANELER & İLİŞKİLER
  // =========================================================================
  { id: 'fs-16', category: 'Bahaneler', prompt: 'Buluşmaya geç kalan birinin söyleyeceği 3 yalan say!' },
  { id: 'fs-17', category: 'Sosyal Medya', prompt: 'Instagram’da en çok paylaşılan 3 hikaye (story) türü say!' },
  { id: 'fs-18', category: 'Bahaneler', prompt: 'Ayrılırken söylenen 3 klasik bahane cümlesi say!' },
  { id: 'fs-19', category: 'Sosyal Medya', prompt: 'Telefonunda her gün kesin girdiğin 3 uygulama say!' },
  { id: 'fs-20', category: 'Günlük Hayat', prompt: 'Evden aceleyle çıkarken unutulan 3 eşya say!' },
  { id: 'fs-21', category: 'Bahaneler', prompt: 'Borç parayı vermemek veya geciktirmek için uydurulan 3 yalan say!' },
  { id: 'fs-22', category: 'Sosyal Medya', prompt: 'Mesaja bilerek geç cevap verenlerin uydurduğu 3 bahane say!' },
  { id: 'fs-23', category: 'Günlük Hayat', prompt: 'Pazartesi sabahı insanı sinir eden 3 şey say!' },
  { id: 'fs-24', category: 'Günlük Hayat', prompt: 'Toplu taşımada en çok sinir bozan 3 hareket say!' },
  { id: 'fs-25', category: 'Alışveriş', prompt: 'Markette kasa kenarında satılan 3 küçük eşya say!' },
  { id: 'fs-26', category: 'İlişkiler', prompt: 'İlk buluşmada (first date) asla açılmaması gereken 3 konu say!' },
  { id: 'fs-27', category: 'Bahaneler', prompt: 'Düğüne veya davete gitmemek için uydurulan 3 yalan say!' },
  { id: 'fs-28', category: 'İlişkiler', prompt: 'Eski sevgiliyi stalklarken korkulan 3 rezillik say!' },
  { id: 'fs-29', category: 'Günlük Hayat', prompt: 'Telefon şarjı %1 kalınca yapılan 3 panik hareket say!' },
  { id: 'fs-30', category: 'Kafe Kültürü', prompt: 'Masa hesabı gelince tuvalete kaçanın söyleyeceği 3 bahane say!' },

  // =========================================================================
  // 3. YEME - İÇME, KAFE & LEZZET
  // =========================================================================
  { id: 'fs-31', category: 'Yemek & Kafe', prompt: 'Kafede sipariş edilen 3 sıcak kahve türü say!' },
  { id: 'fs-32', category: 'Yemek & Kafe', prompt: 'Pazar kahvaltısında masada olan 3 peynir türü say!' },
  { id: 'fs-33', category: 'Yemek & Kafe', prompt: 'Gece 02:00’de acıkınca yenen 3 sokak lezzeti say!' },
  { id: 'fs-34', category: 'Yemek & Kafe', prompt: 'Diyet bozduran 3 çikolatalı veya şerbetli tatlı say!' },
  { id: 'fs-35', category: 'Yemek & Kafe', prompt: 'Gaziantep mutfağından 3 meşhur lezzet say!' },
  { id: 'fs-36', category: 'Yemek & Kafe', prompt: 'Patates kızartmasının yanına yakışan 3 sos say!' },
  { id: 'fs-37', category: 'Yemek & Kafe', prompt: 'Çorbanın içine sıkılan veya eklenen 3 şey say!' },
  { id: 'fs-38', category: 'Yemek & Kafe', prompt: 'Menemenin içine konulan 3 malzeme say!' },
  { id: 'fs-39', category: 'Yemek & Kafe', prompt: 'Kahvaltılık 3 reçel çeşidi say!' },
  { id: 'fs-40', category: 'Yemek & Kafe', prompt: 'Kafede en çok sipariş edilen 3 soğuk içecek say!' },
  { id: 'fs-41', category: 'Yemek & Kafe', prompt: 'İtalyan mutfağından 3 ünlü yemek say!' },
  { id: 'fs-42', category: 'Yemek & Kafe', prompt: 'Kırmızı etle yapılan 3 meşhur Türk yemeği say!' },
  { id: 'fs-43', category: 'Yemek & Kafe', prompt: 'Çayın yanında en iyi giden 3 hamur işi say!' },

  // =========================================================================
  // 4. GENEL KÜLTÜR, COĞRAFYA & SPOR (Hızlı Beyin Fırtınası)
  // =========================================================================
  { id: 'fs-44', category: 'Coğrafya', prompt: 'B harfiyle başlayan 3 ülke adı say!' },
  { id: 'fs-45', category: 'Spor', prompt: 'Süper Lig’de şampiyonluk yaşamış 3 takım say!' },
  { id: 'fs-46', category: 'Coğrafya', prompt: 'Türkiye’nin deniz kıyısı olan 3 şehrini say!' },
  { id: 'fs-47', category: 'Spor', prompt: 'Topla oynanan 3 farklı spor dalı say!' },
  { id: 'fs-48', category: 'Coğrafya', prompt: 'Avrupa kıtasından 3 başkent şehri say!' },
  { id: 'fs-49', category: 'Spor', prompt: 'Formasında sarı renk olan 3 futbol kulübü say!' },
  { id: 'fs-50', category: 'Coğrafya', prompt: 'Marmara Bölgesi’nde yer alan 3 il say!' },
  { id: 'fs-51', category: 'Bilim & Doğa', prompt: 'Güneş Sistemi’nde yer alan 3 gezegen adı say!' },
  { id: 'fs-52', category: 'Tarih', prompt: 'Osmanlı padişahlarından 3 tanesini say!' },
  { id: 'fs-53', category: 'Spor', prompt: 'Dünyaca ünlü 3 efsanevi futbolcu ismi say!' },
  { id: 'fs-54', category: 'Coğrafya', prompt: 'A harfiyle başlayan 3 Türkiye şehri say!' },
  { id: 'fs-55', category: 'Spor', prompt: 'Top kullanılmadan yapılan 3 spor dalı say!' },
  { id: 'fs-56', category: 'Genel Kültür', prompt: 'Periyodik tablodan bildiğin 3 element say!' },

  // =========================================================================
  // 5. MİZAHİ, ABSÜRT & ÇILGIN DURUMLAR
  // =========================================================================
  { id: 'fs-57', category: 'Mizah & Absürt', prompt: 'İnsanın evde tek başınayken yaptığı 3 garip hareket say!' },
  { id: 'fs-58', category: 'Mizah & Absürt', prompt: 'Görünce insanı yerinden sıçratan 3 böcek veya hayvan say!' },
  { id: 'fs-59', category: 'Mizah & Absürt', prompt: 'Büyük piyango çıksa satın alacağın ilk 3 şeyi say!' },
  { id: 'fs-60', category: 'Mizah & Absürt', prompt: 'İlk buluşmada giyilse düğünü iptal ettirecek 3 kıyafet say!' },
  { id: 'fs-61', category: 'Mizah & Absürt', prompt: 'Trafikte delicesine kornaya basma sebebi olan 3 durum say!' },
  { id: 'fs-62', category: 'Mizah & Absürt', prompt: 'Rüyanda kovaladığını görsen kan ter içinde uyanacağın 3 şey say!' },
  { id: 'fs-63', category: 'Mizah & Absürt', prompt: 'Sırf hava atmak için borca girilip alınan 3 şey say!' },
  { id: 'fs-64', category: 'Mizah & Absürt', prompt: 'Asansörde tanımadığın biriyle göz göze gelince yapılan 3 hareket say!' },
  { id: 'fs-65', category: 'Mizah & Absürt', prompt: 'Annelerin çocuklarına kızarken söylediği 3 klasik laf say!' },
  { id: 'fs-66', category: 'Mizah & Absürt', prompt: 'Kötü bir berberin veya kuaförün yapabileceği 3 facia say!' },
  { id: 'fs-67', category: 'Mizah & Absürt', prompt: 'Akraba WhatsApp grubuna atılan 3 klasik içerik say!' },
  { id: 'fs-68', category: 'Mizah & Absürt', prompt: 'Kafede Wi-Fi şifresi isterken yaşanan 3 garip an say!' },
  { id: 'fs-69', category: 'Mizah & Absürt', prompt: 'Tinder veya tanışma uygulamasında kaçıran 3 biyografi detayı say!' },

  // =========================================================================
  // 6. EŞYALAR, NESNELER & GÜNLÜK DÜNYA
  // =========================================================================
  { id: 'fs-70', category: 'Nesneler', prompt: 'Cepte veya el çantasında taşınan 3 eşya say!' },
  { id: 'fs-71', category: 'Markalar', prompt: 'Alman menşeili 3 otomobil markası say!' },
  { id: 'fs-72', category: 'Nesneler', prompt: 'Banyoda bulunan 3 temizlik eşyası say!' },
  { id: 'fs-73', category: 'Markalar', prompt: 'Dünyaca ünlü 3 spor giyim markası say!' },
  { id: 'fs-74', category: 'Nesneler', prompt: 'Kışın dondurucu soğukta giyilen 3 kıyafet say!' },
  { id: 'fs-75', category: 'Nesneler', prompt: 'Mutfakta elektrikle çalışan 3 alet say!' },
  { id: 'fs-76', category: 'Markalar', prompt: 'Gazlı içecek üreten 3 marka say!' },
  { id: 'fs-77', category: 'Nesneler', prompt: 'Yaz tatilinde plaj çantasına konulan 3 eşya say!' },
  { id: 'fs-78', category: 'Nesneler', prompt: 'Uçakta kabin bagajına alınması yasak 3 nesne say!' },
  { id: 'fs-79', category: 'Markalar', prompt: 'Akıllı cep telefonu üreten 3 marka say!' },
  { id: 'fs-80', category: 'Nesneler', prompt: 'Çalışma masasında duran 3 kırtasiye eşyası say!' },
  { id: 'fs-81', category: 'Nesneler', prompt: 'Yatak odasında kesinlikle bulunan 3 eşya say!' },
  { id: 'fs-82', category: 'Doğa', prompt: 'Kırmızı renkli 3 farklı meyve say!' },
  { id: 'fs-83', category: 'Doğa', prompt: 'Sarı renkli 3 farklı çiçek veya meyve say!' },
  { id: 'fs-84', category: 'Doğa', prompt: 'Uçabilen ama kuş olmayan 3 canlı say!' },
  { id: 'fs-85', category: 'Meslekler', prompt: 'Üniforma giyilerek yapılan 3 meslek say!' },
  { id: 'fs-86', category: 'Meslekler', prompt: 'Sürekli bilgisayar başında oturulan 3 meslek say!' },
  { id: 'fs-87', category: 'Nesneler', prompt: 'Kırıldığında felaket olan 3 cam eşya say!' },
  { id: 'fs-88', category: 'Teknoloji', prompt: 'Bluetooth ile telefona bağlanan 3 cihaz say!' },
  { id: 'fs-89', category: 'Genel Kültür', prompt: 'S harfiyle başlayan 3 hayvan adı say!' },
  { id: 'fs-90', category: 'Genel Kültür', prompt: 'Dört ayaklı evcil veya yabani 3 memeli hayvan say!' },
];
