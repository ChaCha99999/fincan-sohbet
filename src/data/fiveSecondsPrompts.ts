export interface FiveSecondsPrompt {
  id: string;
  category: string;
  prompt: string;
}

export const FIVE_SECONDS_PROMPTS: FiveSecondsPrompt[] = [
  // Popüler Kültür & Mizah & Dizi
  { id: 'fs-1', category: 'Dizi & Sinema', prompt: 'Gibi dizisinde geçen 3 sahne veya replik say!' },
  { id: 'fs-2', category: 'Dizi & Sinema', prompt: 'Aşk-ı Memnu dizisinden 3 karakter say!' },
  { id: 'fs-3', category: 'Müzik', prompt: 'Tarkan’ın 3 farklı şarkısını say!' },
  { id: 'fs-4', category: 'Dizi & Sinema', prompt: 'Avrupa Yakası’ndan 3 karakter say!' },
  { id: 'fs-5', category: 'Müzik', prompt: 'Sezen Aksu’nun 3 unutulmaz şarkısını say!' },
  { id: 'fs-6', category: 'Mizah', prompt: 'Cem Yılmaz filmlerinden 3 tanesini say!' },
  { id: 'fs-7', category: 'Dizi & Sinema', prompt: 'Kurtlar Vadisi’nden 3 karakter say!' },
  { id: 'fs-8', category: 'Müzik', prompt: 'Türkçe Rock söyleyen 3 grup/sanatçı say!' },
  { id: 'fs-9', category: 'Mizah', prompt: 'Şahan Gökbakar’ın canlandırdığı 3 karakter say!' },
  { id: 'fs-10', category: 'Sinema', prompt: 'Hababam Sınıfı filminden 3 lakap say!' },

  // Günlük Hayat & Sosyal Medya & Bahaneler
  { id: 'fs-11', category: 'Bahaneler', prompt: 'Buluşmaya geç kalan birinin söyleyeceği 3 yalan say!' },
  { id: 'fs-12', category: 'Sosyal Medya', prompt: 'Instagram’da en çok paylaşılan 3 fotoğraf türü say!' },
  { id: 'fs-13', category: 'Bahaneler', prompt: 'Eski sevgiliden ayrılırken söylenen 3 klişe söz say!' },
  { id: 'fs-14', category: 'Sosyal Medya', prompt: 'Telefonunda her gün girdiğin 3 uygulama say!' },
  { id: 'fs-15', category: 'Günlük Hayat', prompt: 'Evden çıkarken unutulan 3 eşya say!' },
  { id: 'fs-16', category: 'Bahaneler', prompt: 'Borç parayı vermemek için uydurulan 3 bahane say!' },
  { id: 'fs-17', category: 'Sosyal Medya', prompt: 'Mesaja bilerek geç cevap verenlerin uydurduğu 3 yalan say!' },
  { id: 'fs-18', category: 'Günlük Hayat', prompt: 'Pazartesi sabahı insanı sinir eden 3 şey say!' },
  { id: 'fs-19', category: 'Günlük Hayat', prompt: 'Toplu taşımada en çok sinir bozan 3 hareket say!' },
  { id: 'fs-20', category: 'Alışveriş', prompt: 'Markette kasa arkasında satılan 3 küçük eşya say!' },

  // Yeme - İçme & Kafe Kültürü
  { id: 'fs-21', category: 'Yemek & Kafe', prompt: 'Kafede sipariş edilen 3 sıcak kahve türü say!' },
  { id: 'fs-22', category: 'Yemek & Kafe', prompt: 'Pazar kahvaltısında masada olan 3 peynir türü say!' },
  { id: 'fs-23', category: 'Yemek & Kafe', prompt: 'Gece 02:00’de yenen 3 sokak lezzeti say!' },
  { id: 'fs-24', category: 'Yemek & Kafe', prompt: 'Diyet bozduran 3 çikolatalı tatlı say!' },
  { id: 'fs-25', category: 'Yemek & Kafe', prompt: 'Gaziantep mutfağından 3 meşhur yemek say!' },
  { id: 'fs-26', category: 'Yemek & Kafe', prompt: 'Patates kızartmasının yanına yakışan 3 sos say!' },
  { id: 'fs-27', category: 'Yemek & Kafe', prompt: 'Çorbanın içine sıkılan veya konulan 3 şey say!' },
  { id: 'fs-28', category: 'Yemek & Kafe', prompt: 'Menemenin içine konulan 3 ana malzeme say!' },
  { id: 'fs-29', category: 'Yemek & Kafe', prompt: 'Kahvaltılık 3 reçel çeşidi say!' },
  { id: 'fs-30', category: 'Yemek & Kafe', prompt: 'Kafede en çok satılan 3 soğuk içecek say!' },

  // Genel Kültür, Coğrafya & Spor
  { id: 'fs-31', category: 'Coğrafya', prompt: 'B ile başlayan 3 ülke adı say!' },
  { id: 'fs-32', category: 'Spor', prompt: 'Süper Lig’de şampiyon olmuş 3 takım say!' },
  { id: 'fs-33', category: 'Coğrafya', prompt: 'Türkiye’nin deniz kıyısı olan 3 şehri say!' },
  { id: 'fs-34', category: 'Spor', prompt: 'Topla oynanan 3 farklı spor dalı say!' },
  { id: 'fs-35', category: 'Coğrafya', prompt: 'Başkenti olan 3 Avrupa ülkesi say!' },
  { id: 'fs-36', category: 'Spor', prompt: 'Formasında sarı renk olan 3 futbol takımı say!' },
  { id: 'fs-37', category: 'Coğrafya', prompt: 'Marmara Bölgesi’nde yer alan 3 il say!' },
  { id: 'fs-38', category: 'Bilim & Doğa', prompt: 'Güneş Sistemi’nde yer alan 3 gezegen say!' },
  { id: 'fs-39', category: 'Tarih', prompt: 'Osmanlı padişahlarından 3 tanesini say!' },
  { id: 'fs-40', category: 'Spor', prompt: 'Dünyaca ünlü 3 efsanevi futbolcu say!' },

  // Eğlenceli, Absürt & Çılgın
  { id: 'fs-41', category: 'Mizah & Absürt', prompt: 'İnsanın yalnızken yapmaktan utandığı 3 şey say!' },
  { id: 'fs-42', category: 'Mizah & Absürt', prompt: 'Görünce çığlık attıran 3 böcek/canlı say!' },
  { id: 'fs-43', category: 'Mizah & Absürt', prompt: 'Piyango çıksa satın alacağın ilk 3 çılgın şeyi say!' },
  { id: 'fs-44', category: 'Mizah & Absürt', prompt: 'İlk buluşmada (first date) asla giyilmeyecek 3 kıyafet say!' },
  { id: 'fs-45', category: 'Mizah & Absürt', prompt: 'Trafikte kornaya basma sebebi olan 3 durum say!' },
  { id: 'fs-46', category: 'Mizah & Absürt', prompt: 'Rüyanda kovaladığını görsen korkacağın 3 şey say!' },
  { id: 'fs-47', category: 'Mizah & Absürt', prompt: 'Sırf hava atmak için alınan 3 lüks eşya say!' },
  { id: 'fs-48', category: 'Mizah & Absürt', prompt: 'Asansörde tanımadığın biriyle kalınca yapılan 3 hareket say!' },
  { id: 'fs-49', category: 'Mizah & Absürt', prompt: 'Anne babaların çocuklarına kızarken söylediği 3 laf say!' },
  { id: 'fs-50', category: 'Mizah & Absürt', prompt: 'Kötü bir kuaförün saçına yapabileceği 3 facia say!' },

  // Eşyalar & Markalar & Nesneler
  { id: 'fs-51', category: 'Nesneler', prompt: 'Cepte veya çantada taşınan 3 eşya say!' },
  { id: 'fs-52', category: 'Markalar', prompt: 'Alman menşeili 3 otomobil markası say!' },
  { id: 'fs-53', category: 'Nesneler', prompt: 'Banyoda bulunan 3 temizlik eşyası say!' },
  { id: 'fs-54', category: 'Markalar', prompt: 'Dünyaca ünlü 3 spor giyim markası say!' },
  { id: 'fs-55', category: 'Nesneler', prompt: 'Kışın üşümemek için giyilen 3 şey say!' },
  { id: 'fs-56', category: 'Nesneler', prompt: 'Mutfakta elektrikle çalışan 3 alet say!' },
  { id: 'fs-57', category: 'Markalar', prompt: 'Gazlı içecek üreten 3 marka say!' },
  { id: 'fs-58', category: 'Nesneler', prompt: 'Kumsala giderken yanına alınan 3 eşya say!' },
  { id: 'fs-59', category: 'Nesneler', prompt: 'Uçakta el bagajına konulması yasak 3 şey say!' },
  { id: 'fs-60', category: 'Markalar', prompt: 'Cep telefonu üreten 3 büyük marka say!' },
];
