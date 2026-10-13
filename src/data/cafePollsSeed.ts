import type { CafePoll } from '../types';

export const INITIAL_CAFE_POLLS: CafePoll[] = [
  {
    "id": "poll-1",
    "category": "kahve-muzik",
    "categoryTitle": "Müzik & Atmosfer",
    "question": "Bugün kafede arka planda ne çalmalı?",
    "description": "Kafe çalma listesini belirlemek için masanızın tercihini oylayın!",
    "totalVotes": 124,
    "trendingBadge": "En Çok Oylanan",
    "options": [
      {
        "id": "opt-1-1",
        "text": "Akustik & Indie Türkçe",
        "votes": 42
      },
      {
        "id": "opt-1-2",
        "text": "Caz & Kahve Klasikleri",
        "votes": 35
      },
      {
        "id": "opt-1-3",
        "text": "Lo-Fi Beats & Chillhop",
        "votes": 28
      },
      {
        "id": "opt-1-4",
        "text": "90'lar Nostaljik Pop",
        "votes": 19
      }
    ]
  },
  {
    "id": "poll-2",
    "category": "gunun-ikilemi",
    "categoryTitle": "Günün Büyük İkilemi",
    "question": "Menemen soğanlı mı olur soğansız mı?",
    "description": "Yüzyılın gastronomi tartışmasında tarafınızı seçin!",
    "totalVotes": 122,
    "trendingBadge": "Kıran Kırana",
    "options": [
      {
        "id": "opt-2-1",
        "text": "Kesinlikle Soğanlı! (Lezzeti soğandır)",
        "votes": 68
      },
      {
        "id": "opt-2-2",
        "text": "Asla! Soğansız olur (Domates & biber yeter)",
        "votes": 54
      }
    ]
  },
  {
    "id": "poll-3",
    "category": "kafe-modu",
    "categoryTitle": "Kafe Nabzı & Mod",
    "question": "Şu an masanızın genel modu nedir?",
    "description": "Kafede şu an kimler ne amaçla oturuyor? Nabzı ölçüyoruz.",
    "totalVotes": 120,
    "trendingBadge": "Sosyal Nabız",
    "options": [
      {
        "id": "opt-3-1",
        "text": "Dostlarla derin dedikodu & dertleşme",
        "votes": 49
      },
      {
        "id": "opt-3-2",
        "text": "Laptop başında ders veya iş koşturmacası",
        "votes": 31
      },
      {
        "id": "opt-3-3",
        "text": "Romantik kahve & sohbet buluşması",
        "votes": 22
      },
      {
        "id": "opt-3-4",
        "text": "Tek başıma kafa dinleme & kitap saati",
        "votes": 18
      }
    ]
  },
  {
    "id": "poll-4",
    "category": "kahve-muzik",
    "categoryTitle": "Gurme Seçim",
    "question": "Kahvenin yanına en çok yakışan tatlı hangisi?",
    "description": "Kahve ritüelinin vazgeçilmez eşlikçisini seçiyoruz.",
    "totalVotes": 144,
    "trendingBadge": "Tatlı Krizi",
    "options": [
      {
        "id": "opt-4-1",
        "text": "San Sebastian Cheesecake (Bol Çikolatalı)",
        "votes": 56
      },
      {
        "id": "opt-4-2",
        "text": "Fırından Yeni Çıkmış Kruvasan",
        "votes": 38
      },
      {
        "id": "opt-4-3",
        "text": "Islak Çikolatalı Sıcak Cookie",
        "votes": 29
      },
      {
        "id": "opt-4-4",
        "text": "Havuçlu Tarçınlı Anne Keki",
        "votes": 21
      }
    ]
  },
  {
    "id": "poll-5",
    "category": "gunun-ikilemi",
    "categoryTitle": "Hafta Sonu İkilemi",
    "question": "İdeal bir hafta sonu sabahı sizin için nedir?",
    "description": "Dinlenme tanımınız hangisine daha yakın?",
    "totalVotes": 114,
    "trendingBadge": "Hafta Sonu",
    "options": [
      {
        "id": "opt-5-1",
        "text": "Erken uyanıp güzel bir kafede keyifli kahvaltı",
        "votes": 63
      },
      {
        "id": "opt-5-2",
        "text": "Öğlene kadar yatakta kalıp sınırsız tembellik",
        "votes": 51
      }
    ]
  },
  {
    "id": "poll-6",
    "category": "kahve-muzik",
    "categoryTitle": "Kahve Tercihi",
    "question": "Yaz-kış fark etmeksizin kahvenizi nasıl içersiniz?",
    "description": "Sıcakçılar mı soğukçular mı çoğunlukta?",
    "totalVotes": 138,
    "trendingBadge": "Soğuk vs Sıcak",
    "options": [
      {
        "id": "opt-6-1",
        "text": "Buz gibi Iced Latte / Cold Brew",
        "votes": 58
      },
      {
        "id": "opt-6-2",
        "text": "Dumanı üstünde Sıcak Filtre / Americano",
        "votes": 47
      },
      {
        "id": "opt-6-3",
        "text": "Geleneksel Orta Şekerli Türk Kahvesi",
        "votes": 33
      }
    ]
  },
  {
    "id": "poll-7",
    "category": "gunun-ikilemi",
    "categoryTitle": "Masa Etiği",
    "question": "Bu masadan kalkarken hesabı kim ödemeli?",
    "description": "Hesap krizine demokratik bir çözüm bulalım!",
    "totalVotes": 98,
    "trendingBadge": "Hesap Zamanı",
    "options": [
      {
        "id": "opt-7-1",
        "text": "Herkes kendi içtiğini ödesin (Alman usulü)",
        "votes": 45
      },
      {
        "id": "opt-7-2",
        "text": "Masanın en çok para kazananı ısmarlasın",
        "votes": 31
      },
      {
        "id": "opt-7-3",
        "text": "Biri tek çeksin, sonra IBAN’a atarız (klasik yalan)",
        "votes": 22
      }
    ]
  },
  {
    "id": "poll-8",
    "category": "kafe-modu",
    "categoryTitle": "Masa Alışkanlıkları",
    "question": "Kafede otururken telefona bakma sınırınız nedir?",
    "description": "Ekranlar mı konuşmalar mı kazanıyor?",
    "totalVotes": 105,
    "trendingBadge": "Ekran Süresi",
    "options": [
      {
        "id": "opt-8-1",
        "text": "Telefonu masaya yüzüstü koyup sohbete odaklanmak",
        "votes": 52
      },
      {
        "id": "opt-8-2",
        "text": "Bir gözüm bildirimlerde, bir kulağım masada",
        "votes": 38
      },
      {
        "id": "opt-8-3",
        "text": "Sürekli hikaye/fotoğraf çekmekten sohbete vakit bulamayan",
        "votes": 15
      }
    ]
  },
  {
    "id": "poll-9",
    "category": "kahve-muzik",
    "categoryTitle": "Kahve Kültürü",
    "question": "Türk kahvesi fincanı kapandıktan sonra fal bakılmalı mı?",
    "description": "Geleneksel fal merakı masada ne durumda?",
    "totalVotes": 112,
    "trendingBadge": "Fal Vakti",
    "options": [
      {
        "id": "opt-9-1",
        "text": "Kesinlikle! Fal kapatmadan kahve içilmez",
        "votes": 61
      },
      {
        "id": "opt-9-2",
        "text": "Fala inanmam ama geyiğine dinlerim",
        "votes": 36
      },
      {
        "id": "opt-9-3",
        "text": "Gerek yok, fincanı olduğu gibi bırakırım",
        "votes": 15
      }
    ]
  },
  {
    "id": "poll-10",
    "category": "gunun-ikilemi",
    "categoryTitle": "Sokak Lezzeti",
    "question": "Gece dışarıda yemek krizinde nihai tercih:",
    "description": "Gece acıkanların vazgeçilmezi hangisi?",
    "totalVotes": 130,
    "trendingBadge": "Gece Kaçamağı",
    "options": [
      {
        "id": "opt-10-1",
        "text": "Çıtır ekmek arası kokoreç veya midye dolma",
        "votes": 64
      },
      {
        "id": "opt-10-2",
        "text": "Bol soslu Hatay zurna tavuk döner",
        "votes": 42
      },
      {
        "id": "opt-10-3",
        "text": "Sıcak ıslak hamburger",
        "votes": 24
      }
    ]
  },
  {
    "id": "poll-11",
    "category": "kafe-modu",
    "categoryTitle": "Çalışma Ortamı",
    "question": "Laptopla kafede çalışmak gerçekten verimli mi?",
    "description": "Kafe ofisçilerini dinliyoruz!",
    "totalVotes": 89,
    "trendingBadge": "Remote Çalışma",
    "options": [
      {
        "id": "opt-11-1",
        "text": "Evet! Arka plan sesleri ve kahve kokusu odaklıyor",
        "votes": 48
      },
      {
        "id": "opt-11-2",
        "text": "Hayır, sürekli etrafı izlemekten iş yapamıyorum",
        "votes": 41
      }
    ]
  },
  {
    "id": "poll-12",
    "category": "gunun-ikilemi",
    "categoryTitle": "Tatil Tarzı",
    "question": "Hangisi daha dinlendirici bir tatil?",
    "description": "Bavulunuzu hazırlayın, nereye gidiyoruz?",
    "totalVotes": 102,
    "trendingBadge": "Tatil Hayali",
    "options": [
      {
        "id": "opt-12-1",
        "text": "Sessiz sakin Ege/Akdeniz koyunda şezlong ve deniz",
        "votes": 62
      },
      {
        "id": "opt-12-2",
        "text": "Avrupa şehirlerinde günde 20.000 adım müze ve sokak turu",
        "votes": 40
      }
    ]
  },
  {
    "id": "poll-13",
    "category": "kahve-muzik",
    "categoryTitle": "Masa Sohbeti",
    "question": "Kafede en keyifli sohbet konusu hangisidir?",
    "description": "Masayı en çok ne alevlendirir?",
    "totalVotes": 119,
    "trendingBadge": "Derin Sohbet",
    "options": [
      {
        "id": "opt-13-1",
        "text": "Ortak tanıdıkların ve eski sevgililerin dedikodusu",
        "votes": 53
      },
      {
        "id": "opt-13-2",
        "text": "Eski anılar ve çocukluk nostaljisi",
        "votes": 37
      },
      {
        "id": "opt-13-3",
        "text": "Gelecek planları, hayaller ve kariyer",
        "votes": 29
      }
    ]
  },
  {
    "id": "poll-14",
    "category": "gunun-ikilemi",
    "categoryTitle": "Günün Sorusu",
    "question": "Lahmacun nasıl yenmeli?",
    "description": "Milli lezzette tarafınızı seçin!",
    "totalVotes": 141,
    "trendingBadge": "Lahmacun Kavgası",
    "options": [
      {
        "id": "opt-14-1",
        "text": "Bol limon sıkıp maydanozla sararak",
        "votes": 94
      },
      {
        "id": "opt-14-2",
        "text": "Limonsuz, sadece sumaklı soğanla",
        "votes": 47
      }
    ]
  },
  {
    "id": "poll-15",
    "category": "kafe-modu",
    "categoryTitle": "Kafe Konforu",
    "question": "Kafede hangi oturma alanını tercih edersiniz?",
    "description": "İlk nereye göz dikersiniz?",
    "totalVotes": 115,
    "trendingBadge": "Yer Kapma",
    "options": [
      {
        "id": "opt-15-1",
        "text": "Caddeyi izleyen cam kenarı veya ferah bahçe",
        "votes": 63
      },
      {
        "id": "opt-15-2",
        "text": "Priz kenarındaki geniş koltuklu kuytu köşe",
        "votes": 52
      }
    ]
  },
  {
    "id": "poll-16",
    "category": "kahve-muzik",
    "categoryTitle": "Gurme Damak",
    "question": "Çay içerken şeker tercihiniz:",
    "description": "Çayda şeker meselesi masayı ikiye bölüyor!",
    "totalVotes": 125,
    "trendingBadge": "Çay Tiryakileri",
    "options": [
      {
        "id": "opt-16-1",
        "text": "Kesinlikle şekersiz / kıtlama (Gerçek tadı böyle çıkar)",
        "votes": 81
      },
      {
        "id": "opt-16-2",
        "text": "En az 1-2 şekerli (Çay dediğin tatlı olmalı)",
        "votes": 44
      }
    ]
  },
  {
    "id": "poll-17",
    "category": "gunun-ikilemi",
    "categoryTitle": "Modern Hayat",
    "question": "WhatsApp gizlilik ayarlarınızda son görülme ve mavi tik:",
    "description": "Gizemli misiniz yoksa şeffaf mı?",
    "totalVotes": 133,
    "trendingBadge": "Mavi Tik",
    "options": [
      {
        "id": "opt-17-1",
        "text": "Her ikisi de kapalı (Beni kimse takip edemez)",
        "votes": 76
      },
      {
        "id": "opt-17-2",
        "text": "Açık (Kimseden saklayacak bir şeyim yok)",
        "votes": 57
      }
    ]
  },
  {
    "id": "poll-18",
    "category": "kafe-modu",
    "categoryTitle": "Günün Enerjisi",
    "question": "Bugün kafeden sonra planınız nedir?",
    "description": "Günün devamı nasıl akacak?",
    "totalVotes": 96,
    "trendingBadge": "Sonraki Durak",
    "options": [
      {
        "id": "opt-18-1",
        "text": "Direkt eve gidip uzanmak ve dizi izlemek",
        "votes": 54
      },
      {
        "id": "opt-18-2",
        "text": "Biraz yürüyüş yapıp şehri turlamak",
        "votes": 26
      },
      {
        "id": "opt-18-3",
        "text": "Akşam için başka bir mekana/yemeğe geçmek",
        "votes": 16
      }
    ]
  },
  {
    "id": "poll-19",
    "category": "gunun-ikilemi",
    "categoryTitle": "Sinema Tercihi",
    "question": "Evde dizi/film izlerken dublaj mı altyazı mı?",
    "description": "Nasıl izlemeyi seviyorsunuz?",
    "totalVotes": 128,
    "trendingBadge": "Dizi Saati",
    "options": [
      {
        "id": "opt-19-1",
        "text": "Orijinal ses tonu ve Türkçe altyazı",
        "votes": 104
      },
      {
        "id": "opt-19-2",
        "text": "Rahat rahat arkada dinlemek için Türkçe dublaj",
        "votes": 24
      }
    ]
  },
  {
    "id": "poll-20",
    "category": "kahve-muzik",
    "categoryTitle": "Son Soru",
    "question": "Fincan Sohbet oyunlarından en çok hangisini sevdiniz?",
    "description": "Masanızın favori oyununu seçin!",
    "totalVotes": 156,
    "trendingBadge": "Masanın Favorisi",
    "options": [
      {
        "id": "opt-20-1",
        "text": "Sohbeti Başlat (Derin & komik sohbetler)",
        "votes": 56
      },
      {
        "id": "opt-20-2",
        "text": "İkilemde Kal (Çılgın seçimler & tartışma)",
        "votes": 47
      },
      {
        "id": "opt-20-3",
        "text": "Kim Daha Muhtemel? (Arkadaşları ifşalama)",
        "votes": 34
      },
      {
        "id": "opt-20-4",
        "text": "Bilgi Yarışması & Masalar Arası Düello",
        "votes": 19
      }
    ]
  }
];
