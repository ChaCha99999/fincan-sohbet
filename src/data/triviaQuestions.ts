import type { TriviaCategoryInfo, TriviaQuestion } from '../types';

export const TRIVIA_CATEGORIES: TriviaCategoryInfo[] = [
  {
    "id": "genel-kultur",
    "name": "Genel Kültür & Tarih",
    "iconName": "Brain",
    "badgeColor": "bg-amber-100 text-amber-900 border-amber-300",
    "bgGradient": "from-amber-600 to-amber-800",
    "description": "Dünya tarihi, ilginç bilgiler ve efsane olaylar."
  },
  {
    "id": "futbol-spor",
    "name": "Futbol & Spor",
    "iconName": "Trophy",
    "badgeColor": "bg-emerald-100 text-emerald-900 border-emerald-300",
    "bgGradient": "from-emerald-600 to-emerald-800",
    "description": "Süper Lig, Şampiyonlar Ligi, efsane goller ve rekorlar."
  },
  {
    "id": "arabalar",
    "name": "Arabalar & Motor Dünyası",
    "iconName": "Car",
    "badgeColor": "bg-red-100 text-red-900 border-red-300",
    "bgGradient": "from-red-600 to-red-800",
    "description": "Efsane markalar, motorlar, hız canavarları ve Formula 1."
  },
  {
    "id": "sinema-dizi",
    "name": "Sinema & Diziler",
    "iconName": "Film",
    "badgeColor": "bg-purple-100 text-purple-900 border-purple-300",
    "bgGradient": "from-purple-600 to-purple-800",
    "description": "Yeşilçam klasikleri, Hollywood başyapıtları ve replikler."
  },
  {
    "id": "muzik",
    "name": "Müzik & Şarkılar",
    "iconName": "Music",
    "badgeColor": "bg-pink-100 text-pink-900 border-pink-300",
    "bgGradient": "from-pink-600 to-pink-800",
    "description": "Türkçe pop, rock, efsane şarkı sözleri ve unutulmaz sesler."
  },
  {
    "id": "yemek-mutfak",
    "name": "Yemek & Kahve Kültürü",
    "iconName": "Utensils",
    "badgeColor": "bg-orange-100 text-orange-900 border-orange-300",
    "bgGradient": "from-orange-600 to-orange-800",
    "description": "Türk mutfağı, dünya lezzetleri, kahveler ve gurmelik."
  },
  {
    "id": "cografya",
    "name": "Coğrafya & Şehirler",
    "iconName": "Globe2",
    "badgeColor": "bg-cyan-100 text-cyan-900 border-cyan-300",
    "bgGradient": "from-cyan-600 to-cyan-800",
    "description": "Başkentler, plaka kodları, dünya haritası ve doğa harikaları."
  },
  {
    "id": "bilim-teknoloji",
    "name": "Bilim & Teknoloji",
    "iconName": "Cpu",
    "badgeColor": "bg-blue-100 text-blue-900 border-blue-300",
    "bgGradient": "from-blue-600 to-blue-800",
    "description": "Uzay, yapay zekâ, icatlar, internet ve bilim dünyası."
  },
  {
    "id": "gaming",
    "name": "Oyun Dünyası (Gaming)",
    "iconName": "Gamepad2",
    "badgeColor": "bg-indigo-100 text-indigo-900 border-indigo-300",
    "bgGradient": "from-indigo-600 to-indigo-800",
    "description": "PlayStation, PC, e-spor, GTA, retro ve modern oyunlar."
  },
  {
    "id": "nostalji",
    "name": "90'lar & 2000'ler Nostalji",
    "iconName": "Sparkles",
    "badgeColor": "bg-teal-100 text-teal-900 border-teal-300",
    "bgGradient": "from-teal-600 to-teal-800",
    "description": "Çocukluk çizgi filmleri, tasolar, kasetler ve eski günler."
  }
];

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    "id": "t-gk-1",
    "categoryId": "genel-kultur",
    "categoryName": "Genel Kültür & Tarih",
    "question": "Türkiye Cumhuriyeti'nin ilk kadın başbakanı kimdir?",
    "options": [
      "Tansu Çiller",
      "Meral Akşener",
      "Türkan Akyol",
      "Fatma Aliye"
    ],
    "correctIndex": 0,
    "explanation": "Tansu Çiller, 1993-1996 yılları arasında Türkiye Cumhuriyeti başbakanlığı yapmıştır.",
    "difficulty": "easy"
  },
  {
    "id": "t-gk-2",
    "categoryId": "genel-kultur",
    "categoryName": "Genel Kültür & Tarih",
    "question": "Leonardo da Vinci'nin dünyaca ünlü Mona Lisa tablosu hangi müzede sergilenmektedir?",
    "options": [
      "British Museum",
      "Louvre Müzesi",
      "Prado Müzesi",
      "Uffizi Galerisi"
    ],
    "correctIndex": 1,
    "explanation": "Mona Lisa, Fransa'nın Paris kentindeki ünlü Louvre Müzesi'nde korunmaktadır.",
    "difficulty": "easy"
  },
  {
    "id": "t-gk-3",
    "categoryId": "genel-kultur",
    "categoryName": "Genel Kültür & Tarih",
    "question": "Antik Dünyanın Yedi Harikası arasından günümüze kadar ayakta kalmayı başaran tek yapı hangisidir?",
    "options": [
      "Babil’in Asma Bahçeleri",
      "İskenderiye Feneri",
      "Keops Piramidi",
      "Rodos Heykeli"
    ],
    "correctIndex": 2,
    "explanation": "Mısır’daki Keops Piramidi (Büyük Piramit), antik 7 harika arasında günümüze ulaşan tek yapıdır.",
    "difficulty": "medium"
  },
  {
    "id": "t-gk-4",
    "categoryId": "genel-kultur",
    "categoryName": "Genel Kültür & Tarih",
    "question": "Kimyasal periyodik tabloda \"Au\" sembolü hangi değerli elementi temsil eder?",
    "options": [
      "Gümüş",
      "Altın",
      "Bakır",
      "Alüminyum"
    ],
    "correctIndex": 1,
    "explanation": "Altın elementi, Latince parıldayan anlamına gelen \"Aurum\" kelimesinden türetilen \"Au\" sembolüyle gösterilir.",
    "difficulty": "easy"
  },
  {
    "id": "t-gk-5",
    "categoryId": "genel-kultur",
    "categoryName": "Genel Kültür & Tarih",
    "question": "Modern matbaanın temellerini atarak hareketli harflerle ilk kez İncil basan mucit kimdir?",
    "options": [
      "Johannes Gutenberg",
      "Nikola Tesla",
      "Galileo Galilei",
      "Isaac Newton"
    ],
    "correctIndex": 0,
    "explanation": "Johannes Gutenberg 1440’lı yıllarda Almanya’da hareketli baskı makinesini geliştirmiştir.",
    "difficulty": "medium"
  },
  {
    "id": "t-gk-6",
    "categoryId": "genel-kultur",
    "categoryName": "Genel Kültür & Tarih",
    "question": "Osmanlı Devleti'nde ilk Türk matbaasını kuran ve ilk basılı eseri yayımlayan öncü kimdir?",
    "options": [
      "İbrahim Müteferrika",
      "Evliya Çelebi",
      "Katip Çelebi",
      "Ali Kuşçu"
    ],
    "correctIndex": 0,
    "explanation": "İbrahim Müteferrika, 1727 yılında Lale Devri sırasında ilk Osmanlı matbaasını faaliyete geçirmiştir.",
    "difficulty": "easy"
  },
  {
    "id": "t-gk-7",
    "categoryId": "genel-kultur",
    "categoryName": "Genel Kültür & Tarih",
    "question": "Tarihte \"Göze göz, dişe diş\" ilkesiyle bilinen dünyanın en eski yazılı kanun derlemesi kime aittir?",
    "options": [
      "Hammurabi",
      "Cengiz Han",
      "Büyük İskender",
      "Jüstinyen"
    ],
    "correctIndex": 0,
    "explanation": "Babil Kralı Hammurabi tarafından M.Ö. 1750 civarında taş stel üzerine yazdırılmıştır.",
    "difficulty": "easy"
  },
  {
    "id": "t-gk-8",
    "categoryId": "genel-kultur",
    "categoryName": "Genel Kültür & Tarih",
    "question": "1969 yılında Apollo 11 göreviyle Ay'a ilk adımı atan insan kimdir?",
    "options": [
      "Neil Armstrong",
      "Buzz Aldrin",
      "Yuri Gagarin",
      "Michael Collins"
    ],
    "correctIndex": 0,
    "explanation": "\"İnsan için küçük, insanlık için dev bir adım\" diyen Neil Armstrong ilk adımı atmıştır.",
    "difficulty": "easy"
  },
  {
    "id": "t-gk-9",
    "categoryId": "genel-kultur",
    "categoryName": "Genel Kültür & Tarih",
    "question": "Çanakkale Deniz Zaferi hangi tarihte kazanılmıştır?",
    "options": [
      "18 Mart 1915",
      "23 Nisan 1920",
      "29 Ekim 1923",
      "30 Ağustos 1922"
    ],
    "correctIndex": 0,
    "explanation": "18 Mart 1915, Türk milletinin kahramanlık destanı Çanakkale Deniz Zaferi günüdür.",
    "difficulty": "easy"
  },
  {
    "id": "t-gk-10",
    "categoryId": "genel-kultur",
    "categoryName": "Genel Kültür & Tarih",
    "question": "2015 yılında DNA onarımı mekanizmaları alanındaki çalışmalarıyla Nobel Kimya Ödülü kazanan Türk bilim insanı kimdir?",
    "options": [
      "Aziz Sancar",
      "Oktay Sinanoğlu",
      "Gazi Yaşargil",
      "Uğur Şahin"
    ],
    "correctIndex": 0,
    "explanation": "Prof. Dr. Aziz Sancar, hücrelerin hasar gören DNA’ları nasıl onardığını haritalandırarak Nobel almıştır.",
    "difficulty": "easy"
  },
  {
    "id": "t-fs-1",
    "categoryId": "futbol-spor",
    "categoryName": "Futbol & Spor",
    "question": "Türkiye A Milli Futbol Takımı, 2002 FIFA Dünya Kupası’nda hangi dereceyi elde etmiştir?",
    "options": [
      "Dünya Şampiyonu",
      "Dünya İkincisi",
      "Dünya Üçüncüsü",
      "Çeyrek Final"
    ],
    "correctIndex": 2,
    "explanation": "Şenol Güneş yönetimindeki Milliler, Güney Kore’yi 3-2 mağlup ederek tarihi bir 3.lük elde etti.",
    "difficulty": "easy"
  },
  {
    "id": "t-fs-2",
    "categoryId": "futbol-spor",
    "categoryName": "Futbol & Spor",
    "question": "UEFA Kupası’nı namağlup kazanan ilk ve tek Türk futbol takımı hangisidir?",
    "options": [
      "Fenerbahçe",
      "Galatasaray",
      "Beşiktaş",
      "Trabzonspor"
    ],
    "correctIndex": 1,
    "explanation": "Galatasaray, 17 Mayıs 2000 tarihinde Arsenal’i penaltılarla yenerek UEFA Kupası’nı müzesine götürmüştür.",
    "difficulty": "easy"
  },
  {
    "id": "t-fs-3",
    "categoryId": "futbol-spor",
    "categoryName": "Futbol & Spor",
    "question": "Futbol tarihinde en çok Ballon d’Or (Altın Top) ödülü kazanan oyuncu kimdir?",
    "options": [
      "Cristiano Ronaldo",
      "Lionel Messi",
      "Pelé",
      "Johan Cruyff"
    ],
    "correctIndex": 1,
    "explanation": "Lionel Messi, kariyeri boyunca 8 kez Ballon d’Or kazanarak kırılması güç bir rekora imza atmıştır.",
    "difficulty": "easy"
  },
  {
    "id": "t-fs-4",
    "categoryId": "futbol-spor",
    "categoryName": "Futbol & Spor",
    "question": "Olimpiyatlarda üç kez üst üste halterde altın madalya kazanan efsanevi \"Cep Herkülü\" lakaplı milli sporcumuz kimdir?",
    "options": [
      "Halil Mutlu",
      "Naim Süleymanoğlu",
      "Taner Sağır",
      "Halterci Sedat"
    ],
    "correctIndex": 1,
    "explanation": "Naim Süleymanoğlu; 1988, 1992 ve 1996 Olimpiyatlarında altın madalya alarak spor tarihine geçmiştir.",
    "difficulty": "easy"
  },
  {
    "id": "t-fs-5",
    "categoryId": "futbol-spor",
    "categoryName": "Futbol & Spor",
    "question": "Bir basketbol maçında NBA potasının yerden standart yüksekliği kaç metredir (veya kaç feet)?",
    "options": [
      "2.95 metre (9.5 feet)",
      "3.05 metre (10 feet)",
      "3.15 metre (10.5 feet)",
      "3.25 metre (11 feet)"
    ],
    "correctIndex": 1,
    "explanation": "Resmi FIBA ve NBA standartlarında pota çemberinin yerden yüksekliği tam olarak 3.05 metredir (10 feet).",
    "difficulty": "medium"
  },
  {
    "id": "t-fs-6",
    "categoryId": "futbol-spor",
    "categoryName": "Futbol & Spor",
    "question": "Süper Lig tarihinde teknik direktör olarak en çok şampiyonluk kazanan isim kimdir (8 kez)?",
    "options": [
      "Fatih Terim",
      "Mustafa Denizli",
      "Şenol Güneş",
      "Ahmet Suat Özyazıcı"
    ],
    "correctIndex": 0,
    "explanation": "Fatih Terim, Galatasaray ile 8 Süper Lig şampiyonluğu kazanarak rekorun tek sahibidir.",
    "difficulty": "easy"
  },
  {
    "id": "t-fs-7",
    "categoryId": "futbol-spor",
    "categoryName": "Futbol & Spor",
    "question": "2002 Dünya Kupası üçüncülük maçında Hakan Şükür kaçıncı saniyede gol atarak Dünya Kupası tarihinin en hızlı golü rekorunu kırmıştır?",
    "options": [
      "11. saniye",
      "24. saniye",
      "37. saniye",
      "5. saniye"
    ],
    "correctIndex": 0,
    "explanation": "Hakan Şükür, maçın 10.89 saniyesinde attığı golle Dünya Kupası tarihinin en erken golünü kaydetmiştir.",
    "difficulty": "medium"
  },
  {
    "id": "t-fs-8",
    "categoryId": "futbol-spor",
    "categoryName": "Futbol & Spor",
    "question": "Formula 1 tarihinde 7 dünya şampiyonluğu ile zirveyi paylaşan iki efsanevi pilot kimlerdir?",
    "options": [
      "Michael Schumacher & Lewis Hamilton",
      "Ayrton Senna & Alain Prost",
      "Max Verstappen & Fernando Alonso",
      "Sebastian Vettel & Kimi Raikkonen"
    ],
    "correctIndex": 0,
    "explanation": "Schumacher ve Hamilton 7’şer dünya şampiyonluğu ile F1 tarihinin en çok şampiyon olan pilotlarıdır.",
    "difficulty": "easy"
  },
  {
    "id": "t-fs-9",
    "categoryId": "futbol-spor",
    "categoryName": "Futbol & Spor",
    "question": "Kareem Abdul-Jabbar’ın rekorunu kırarak NBA tarihinin tüm zamanların en çok sayı atan oyuncusu olan süperstar kimdir?",
    "options": [
      "LeBron James",
      "Kobe Bryant",
      "Michael Jordan",
      "Stephen Curry"
    ],
    "correctIndex": 0,
    "explanation": "LeBron James, 2023 yılında 38.388 sayıyı geçerek NBA tarihinin en skorer ismi olmuştur.",
    "difficulty": "easy"
  },
  {
    "id": "t-fs-10",
    "categoryId": "futbol-spor",
    "categoryName": "Futbol & Spor",
    "question": "Sezonun en prestijli tenis turnuvalarından biri olan İngiltere Wimbledon Şampiyonası hangi zemin üzerinde oynanır?",
    "options": [
      "Çim Kort",
      "Toprak Kort",
      "Sert Kort",
      "Halı Zemin"
    ],
    "correctIndex": 0,
    "explanation": "Wimbledon, geleneksel olarak çim kort üzerinde oynanan tek Grand Slam turnuvasıdır.",
    "difficulty": "easy"
  },
  {
    "id": "t-ar-1",
    "categoryId": "arabalar",
    "categoryName": "Arabalar & Motor Dünyası",
    "question": "Logosunda şaha kalkmış siyah bir at figürü (Cavallino Rampante) bulunan efsane İtalyan süper spor otomobil markası hangisidir?",
    "options": [
      "Lamborghini",
      "Ferrari",
      "Maserati",
      "Alfa Romeo"
    ],
    "correctIndex": 1,
    "explanation": "Enzo Ferrari tarafından kurulan Ferrari’nin logosu 1. Dünya Savaşı pilotu Francesco Baracca’nın uçağındaki attan gelir.",
    "difficulty": "easy"
  },
  {
    "id": "t-ar-2",
    "categoryId": "arabalar",
    "categoryName": "Arabalar & Motor Dünyası",
    "question": "Dünyanın en zorlu ve ölümcül pisti olarak bilinen \"Yeşil Cehennem (Green Hell)\" lakaplı yarış pisti hangisidir?",
    "options": [
      "Monaco Cadde Pisti",
      "Nürburgring Nordschleife",
      "Silverstone",
      "Le Mans (Circuit de la Sarthe)"
    ],
    "correctIndex": 1,
    "explanation": "Almanya’daki Nürburgring Nordschleife pistine \"Green Hell\" lakabını ünlü pilot Jackie Stewart vermiştir.",
    "difficulty": "medium"
  },
  {
    "id": "t-ar-3",
    "categoryId": "arabalar",
    "categoryName": "Arabalar & Motor Dünyası",
    "question": "Porsche’nin 1964 yılından bu yana üretilen, arkadan motorlu efsanevi ikonik modeli hangisidir?",
    "options": [
      "Porsche 911",
      "Porsche Cayenne",
      "Porsche Panamera",
      "Porsche Taycan"
    ],
    "correctIndex": 0,
    "explanation": "Porsche 911, otomobil tasarımının ve boksör motorun en kusursuz ve uzun soluklu temsilcisidir.",
    "difficulty": "easy"
  },
  {
    "id": "t-ar-4",
    "categoryId": "arabalar",
    "categoryName": "Arabalar & Motor Dünyası",
    "question": "Otomotivde \"Quattro\" dört tekerlekten çekiş (AWD) sistemiyle özdeşleşen Alman markası hangisidir?",
    "options": [
      "BMW",
      "Mercedes-Benz",
      "Audi",
      "Volkswagen"
    ],
    "correctIndex": 2,
    "explanation": "Audi, 1980’lerde ralli dünyasını sarsan kalıcı dört çeker sistemine Quattro adını vermiştir.",
    "difficulty": "easy"
  },
  {
    "id": "t-ar-5",
    "categoryId": "arabalar",
    "categoryName": "Arabalar & Motor Dünyası",
    "question": "400 km/s barajını aşarak hiper otomobil çağını başlatan 1001 beygirlik 16 silindirli efsane model hangisidir?",
    "options": [
      "McLaren F1",
      "Bugatti Veyron",
      "Koenigsegg Agera",
      "Pagani Zonda"
    ],
    "correctIndex": 1,
    "explanation": "Bugatti Veyron 16.4, 8.0 litrelik quad-turbo W16 motoruyla 407 km/s hıza ulaşarak tarihe geçmiştir.",
    "difficulty": "medium"
  },
  {
    "id": "t-ar-6",
    "categoryId": "arabalar",
    "categoryName": "Arabalar & Motor Dünyası",
    "question": "Henry Ford tarafından yürüyen bant üretim hattıyla seri üretilen ve otomobili halka ulaştıran ilk model hangisidir?",
    "options": [
      "Ford Model T",
      "Ford Mustang",
      "Ford GT40",
      "Ford Fiesta"
    ],
    "correctIndex": 0,
    "explanation": "Ford Model T (1908), modern sanayide seri üretimin öncüsü olarak otomotiv çağını başlatmıştır.",
    "difficulty": "easy"
  },
  {
    "id": "t-ar-7",
    "categoryId": "arabalar",
    "categoryName": "Arabalar & Motor Dünyası",
    "question": "Ferrari’ye rakip olarak doğan ve logosunda dövüş boğası (Taurus) figürü bulunan İtalyan marka hangisidir?",
    "options": [
      "Lamborghini",
      "Lancia",
      "Maserati",
      "Bugatti"
    ],
    "correctIndex": 0,
    "explanation": "Ferruccio Lamborghini, kurucusu olduğu markanın modellerine ünlü boğa güreşi boğalarının adını vermiştir.",
    "difficulty": "easy"
  },
  {
    "id": "t-ar-8",
    "categoryId": "arabalar",
    "categoryName": "Arabalar & Motor Dünyası",
    "question": "1961 yılında Türkiye’de dönemin Cumhurbaşkanı Cemal Gürsel’in talimatıyla 129 günde üretilen ilk yerli otomobilin adı nedir?",
    "options": [
      "Devrim",
      "Anadol",
      "Murat 124",
      "Toros"
    ],
    "correctIndex": 0,
    "explanation": "Eskişehir Demiryolu Cer Atölyeleri’nde üretilen \"Devrim\", Türk mühendisliğinin ilk yerli otomobil girişimidir.",
    "difficulty": "easy"
  },
  {
    "id": "t-ar-9",
    "categoryId": "arabalar",
    "categoryName": "Arabalar & Motor Dünyası",
    "question": "BMW’nin logosundaki mavi ve beyaz renkler neyi temsil eder?",
    "options": [
      "Bavyera eyaletinin bayrağını",
      "Gökyüzü ve bulutları",
      "Uçak pervanesi ve petrolü",
      "Hız ve güvenliği"
    ],
    "correctIndex": 0,
    "explanation": "BMW logosundaki mavi-beyaz dilimler, şirketin kurulduğu Alman Bavyera eyaletinin resmi renkleridir.",
    "difficulty": "medium"
  },
  {
    "id": "t-ar-10",
    "categoryId": "arabalar",
    "categoryName": "Arabalar & Motor Dünyası",
    "question": "Japon drift kültürünün ve \"Initial D\" animesinin simgesi olan arkadan itişli efsanevi Toyota modeli hangisidir?",
    "options": [
      "AE86 Corolla Levin / Sprinter Trueno",
      "Supra MK4",
      "Celica GT-Four",
      "Yaris GR"
    ],
    "correctIndex": 0,
    "explanation": "Hachi-Roku (86) olarak bilinen hafif gövdeli AE86, drift dünyasının en ikonik arabasıdır.",
    "difficulty": "medium"
  },
  {
    "id": "t-sd-1",
    "categoryId": "sinema-dizi",
    "categoryName": "Sinema & Diziler",
    "question": "Hababam Sınıfı filmlerinde öğrencilerin korkulu rüyası ama babacan müdür muavini \"Kel Mahmut\"u kim canlandırmıştır?",
    "options": [
      "Münir Özkul",
      "Kemal Sunal",
      "Şener Şen",
      "Halit Akçatepe"
    ],
    "correctIndex": 0,
    "explanation": "Usta sanatçı Münir Özkul, Kel Mahmut rolüyle Türk sinemasının en unutulmaz karakterlerinden birini yaratmıştır.",
    "difficulty": "easy"
  },
  {
    "id": "t-sd-2",
    "categoryId": "sinema-dizi",
    "categoryName": "Sinema & Diziler",
    "question": "\"Ona reddedemeyeceği bir teklif yapacağım\" repliğiyle ünlü sinema başyapıtı hangisidir?",
    "options": [
      "Yaralı Yüz (Scarface)",
      "Baba (The Godfather)",
      "Ucuz Roman (Pulp Fiction)",
      "İyi Dostlar (Goodfellas)"
    ],
    "correctIndex": 1,
    "explanation": "Marlon Brando’nun Don Vito Corleone karakteriyle devleştiği The Godfather (1972) filmine aittir.",
    "difficulty": "easy"
  },
  {
    "id": "t-sd-3",
    "categoryId": "sinema-dizi",
    "categoryName": "Sinema & Diziler",
    "question": "Avrupa Yakası dizisinde \"Ben aslında Nişantaşı çocuğuyum\" diyen efsanevi karakter kimdir?",
    "options": [
      "Burhan Altıntop",
      "Gaffur Aksoy",
      "Volkan Sütçüoğlu",
      "Kubilay Peynircioğlu"
    ],
    "correctIndex": 0,
    "explanation": "Engin Günaydın’ın hayat verdiği Tokatlı idare müdürü Burhan Altıntop dizi tarihinin en komik figürlerindendir.",
    "difficulty": "easy"
  },
  {
    "id": "t-sd-4",
    "categoryId": "sinema-dizi",
    "categoryName": "Sinema & Diziler",
    "question": "Yüzüklerin Efendisi film üçlemesinde yönetmen koltuğunda kim oturmuştur?",
    "options": [
      "Steven Spielberg",
      "Christopher Nolan",
      "Peter Jackson",
      "James Cameron"
    ],
    "correctIndex": 2,
    "explanation": "Yeni Zelandalı yönetmen Peter Jackson, J.R.R. Tolkien’in başyapıtını 17 Oscar kazanan efsanevi bir üçlemeye dönüştürdü.",
    "difficulty": "easy"
  },
  {
    "id": "t-sd-5",
    "categoryId": "sinema-dizi",
    "categoryName": "Sinema & Diziler",
    "question": "\"Gibi\" dizisinde \"Ben senin gibi her şeyi bir teorisi olan adamlardan değilim İlkkan\" sözünü kim söyler?",
    "options": [
      "Yılmaz",
      "Ersoy",
      "Zafer",
      "Kadir"
    ],
    "correctIndex": 0,
    "explanation": "Feyyaz Yiğit’in canlandırdığı Yılmaz karakteri, İlkkan’ın abartılı teorilerine karşı tahammülsüzlüğüyle bilinir.",
    "difficulty": "easy"
  },
  {
    "id": "t-sd-6",
    "categoryId": "sinema-dizi",
    "categoryName": "Sinema & Diziler",
    "question": "Yüzüklerin Efendisi serisinde Tek Yüzük’ün yok edilebilmesi için atılması gereken yanardağ hangisidir?",
    "options": [
      "Hüküm Dağı (Mount Doom)",
      "Yalnız Dağ (Erebor)",
      "Sisli Dağlar",
      "Gundabad"
    ],
    "correctIndex": 0,
    "explanation": "Yüzük yalnızca Sauron tarafından dövüldüğü yer olan Mordor’daki Hüküm Dağı lavlarında eritilebilir.",
    "difficulty": "easy"
  },
  {
    "id": "t-sd-7",
    "categoryId": "sinema-dizi",
    "categoryName": "Sinema & Diziler",
    "question": "Cannes Film Festivali’nde en büyük ödül olan Altın Palmiye’yi kazanan Nuri Bilge Ceylan filmi hangisidir?",
    "options": [
      "Kış Uykusu",
      "Uzak",
      "Bir Zamanlar Anadolu’da",
      "Ahlat Ağacı"
    ],
    "correctIndex": 0,
    "explanation": "2014 yılında Kış Uykusu (Winter Sleep), Altın Palmiye kazanarak Türk sinemasını gururlandırmıştır.",
    "difficulty": "medium"
  },
  {
    "id": "t-sd-8",
    "categoryId": "sinema-dizi",
    "categoryName": "Sinema & Diziler",
    "question": "İspanyol yapımı ünlü soygun dizisi La Casa de Papel’de soyguncuların taktığı bıyıklı maske hangi ünlü ressama aittir?",
    "options": [
      "Salvador Dalí",
      "Pablo Picasso",
      "Vincent van Gogh",
      "Diego Velázquez"
    ],
    "correctIndex": 0,
    "explanation": "Dizideki ikonik bıyıklı kırmızı tulumlu maske, sürrealist dahi Salvador Dalí’nin yüzüdür.",
    "difficulty": "easy"
  },
  {
    "id": "t-sd-9",
    "categoryId": "sinema-dizi",
    "categoryName": "Sinema & Diziler",
    "question": "Breaking Bad dizisinde Walter White’ın uyuşturucu dünyasında kullandığı gizli takma adı nedir?",
    "options": [
      "Heisenberg",
      "Cap’n Cook",
      "Saul Goodman",
      "Gus Fring"
    ],
    "correctIndex": 0,
    "explanation": "Ünlü fizikçi Werner Heisenberg’den esinlenerek Heisenberg lakabını kullanmıştır.",
    "difficulty": "easy"
  },
  {
    "id": "t-sd-10",
    "categoryId": "sinema-dizi",
    "categoryName": "Sinema & Diziler",
    "question": "Aşk-ı Memnu dizisinde final bölümünde \"Beni beni, Bihter’ini...\" repliğini söyleyen Bihter Yöreoğlu’nu kim canlandırmıştır?",
    "options": [
      "Beren Saat",
      "Hazal Kaya",
      "Nebahat Çehre",
      "Zerrin Tekindor"
    ],
    "correctIndex": 0,
    "explanation": "Beren Saat, Türk televizyon tarihinin en çok izlenen final sahnelerinden birine imza atmıştır.",
    "difficulty": "easy"
  },
  {
    "id": "t-mz-1",
    "categoryId": "muzik",
    "categoryName": "Müzik & Şarkılar",
    "question": "2003 yılında Letonya’nın Riga kentinde düzenlenen Eurovision Şarkı Yarışması’nı Türkiye adına kazanan sanatçı kimdir?",
    "options": [
      "Şebnem Paker",
      "Sertab Erener",
      "Athena",
      "Manga"
    ],
    "correctIndex": 1,
    "explanation": "Sertab Erener, \"Everyway That I Can\" adlı şarkısıyla 167 puan toplayarak Türkiye’ye ilk birinciliği getirdi.",
    "difficulty": "easy"
  },
  {
    "id": "t-mz-2",
    "categoryId": "muzik",
    "categoryName": "Müzik & Şarkılar",
    "question": "\"Arkadaşım Eşek\", \"Gülpembe\" ve \"Dönence\" gibi ölümsüz eserlerin sahibi usta sanatçı kimdir?",
    "options": [
      "Erkin Koray",
      "Cem Karaca",
      "Barış Manço",
      "Fikret Kızılok"
    ],
    "correctIndex": 2,
    "explanation": "Barış Manço, 7’den 77’ye tüm Türkiye’nin sevgilisi olmuş Anadolu rock efsanesidir.",
    "difficulty": "easy"
  },
  {
    "id": "t-mz-3",
    "categoryId": "muzik",
    "categoryName": "Müzik & Şarkılar",
    "question": "Rock müzik tarihinin en ikonik gruplarından Queen’in efsanevi solisti kimdir?",
    "options": [
      "Mick Jagger",
      "Freddie Mercury",
      "Robert Plant",
      "David Bowie"
    ],
    "correctIndex": 1,
    "explanation": "Freddie Mercury, 4 oktavlık benzersiz vokal aralığı ve \"Bohemian Rhapsody\" gibi başyapıtlarıyla tanınır.",
    "difficulty": "easy"
  },
  {
    "id": "t-mz-4",
    "categoryId": "muzik",
    "categoryName": "Müzik & Şarkılar",
    "question": "\"Minik Serçe\" lakabıyla tanınan, yüzlerce unutulmaz şarkıya imza atan Türk pop müziğinin kraliçesi kimdir?",
    "options": [
      "Ajda Pekkan",
      "Sezen Aksu",
      "Nilüfer",
      "Nükhet Duru"
    ],
    "correctIndex": 1,
    "explanation": "Sezen Aksu, şarkıları ve yetiştirdiği onlarca sanatçıyla Türk popunun en büyük bestecisidir.",
    "difficulty": "easy"
  },
  {
    "id": "t-mz-5",
    "categoryId": "muzik",
    "categoryName": "Müzik & Şarkılar",
    "question": "Klasik müzik dehası Beethoven, dünyaca ünlü 9. Senfonisini bestelediğinde hangi fiziksel engele sahipti?",
    "options": [
      "Tamamen sağırdı",
      "Görme engelliydi",
      "Konuşamıyordu",
      "Felçliydi"
    ],
    "correctIndex": 0,
    "explanation": "Beethoven işitme duyusunu tamamen kaybetmesine rağmen titreşimleri hissederek 9. Senfoniyi bestelemiştir.",
    "difficulty": "medium"
  },
  {
    "id": "t-mz-6",
    "categoryId": "muzik",
    "categoryName": "Müzik & Şarkılar",
    "question": "\"Şıkıdım\", \"Kuzu Kuzu\" ve \"Dudu\" şarkılarıyla uluslararası üne kavuşan \"Megastar\" lakaplı sanatçı kimdir?",
    "options": [
      "Tarkan",
      "Mustafa Sandal",
      "Kenan Doğulu",
      "Murat Boz"
    ],
    "correctIndex": 0,
    "explanation": "Tarkan, 90’lardan bugüne pop müziğin zirvesindeki tartışmasız Megastar’dır.",
    "difficulty": "easy"
  },
  {
    "id": "t-mz-7",
    "categoryId": "muzik",
    "categoryName": "Müzik & Şarkılar",
    "question": "\"Bozkırın Tezenesi\" lakabıyla tanınan, \"Yalan Dünya\" ve \"Gönül Dağı\" türkülerinin efsanevi halk ozanı kimdir?",
    "options": [
      "Neşet Ertaş",
      "Aşık Veysel",
      "Mahzuni Şerif",
      "Muharrem Ertaş"
    ],
    "correctIndex": 0,
    "explanation": "Büyük usta Neşet Ertaş’a \"Bozkırın Tezenesi\" unvanını Yaşar Kemal vermiştir.",
    "difficulty": "easy"
  },
  {
    "id": "t-mz-8",
    "categoryId": "muzik",
    "categoryName": "Müzik & Şarkılar",
    "question": "Rock müzik grubu Duman’ın karizmatik solisti ve bestecisi kimdir?",
    "options": [
      "Kaan Tangöze",
      "Batuhan Mutlugil",
      "Ari Barokas",
      "Hayko Cepkin"
    ],
    "correctIndex": 0,
    "explanation": "Kaan Tangöze, kendine has vokal tarzıyla Duman grubunun solistliğini üstlenmektedir.",
    "difficulty": "easy"
  },
  {
    "id": "t-mz-9",
    "categoryId": "muzik",
    "categoryName": "Müzik & Şarkılar",
    "question": "Dünyanın en çok satan albümü rekorunu 70 milyondan fazla satışla elinde tutan Michael Jackson albümü hangisidir?",
    "options": [
      "Thriller",
      "Bad",
      "Dangerous",
      "Off the Wall"
    ],
    "correctIndex": 0,
    "explanation": "1982 çıkışlı \"Thriller\", müzik tarihinin ticari anlamda en başarılı albümüdür.",
    "difficulty": "easy"
  },
  {
    "id": "t-mz-10",
    "categoryId": "muzik",
    "categoryName": "Müzik & Şarkılar",
    "question": "\"Cambaz\", \"Bir Derdim Var\" ve \"Oyunbozan\" şarkılarıyla tanınan Türk alternatif rock grubu hangisidir?",
    "options": [
      "mor ve ötesi",
      "maNga",
      "Yüksek Sadakat",
      "Gripin"
    ],
    "correctIndex": 0,
    "explanation": "mor ve ötesi, 2004 yılında çıkardığı \"Dünya Yalan Söylüyor\" albümüyle döneme damga vurmuştur.",
    "difficulty": "easy"
  },
  {
    "id": "t-ym-1",
    "categoryId": "yemek-mutfak",
    "categoryName": "Yemek & Kahve Kültürü",
    "question": "Geleneksel Türk kahvesi pişirilirken kullanılan özel, uzun saplı kaba ne ad verilir?",
    "options": [
      "Cezve",
      "Güğüm",
      "Çaydanlık",
      "Semaver"
    ],
    "correctIndex": 0,
    "explanation": "Cezve, bakırdan yapılan ve Türk kahvesinin köpüklü pişmesini sağlayan geleneksel araçtır.",
    "difficulty": "easy"
  },
  {
    "id": "t-ym-2",
    "categoryId": "yemek-mutfak",
    "categoryName": "Yemek & Kahve Kültürü",
    "question": "Gaziantep mutfağının tescilli ve dünyaca ünlü tatlısı hangisidir?",
    "options": [
      "Baklava",
      "Künefe",
      "Sütlaç",
      "Revani"
    ],
    "correctIndex": 0,
    "explanation": "Antep Baklavası, Avrupa Birliği tarafından tescillenen ilk Türk coğrafi işaretli ürünüdür.",
    "difficulty": "easy"
  },
  {
    "id": "t-ym-3",
    "categoryId": "yemek-mutfak",
    "categoryName": "Yemek & Kahve Kültürü",
    "question": "İtalyan kahve klasiği olan \"Espresso\"nun üzerine sıcak su eklenerek seyreltilmesiyle hazırlanan kahve türü hangisidir?",
    "options": [
      "Americano",
      "Cappuccino",
      "Latte",
      "Macchiato"
    ],
    "correctIndex": 0,
    "explanation": "2. Dünya Savaşı’nda İtalya’daki Amerikan askerlerinin sert espressoyu seyreltmesiyle Americano doğmuştur.",
    "difficulty": "easy"
  },
  {
    "id": "t-ym-4",
    "categoryId": "yemek-mutfak",
    "categoryName": "Yemek & Kahve Kültürü",
    "question": "Geleneksel Hatay mutfağında sıcak şerbet dökülerek servis edilen, uzayan peynirli tatlı hangisidir?",
    "options": [
      "Künefe",
      "Kadayıf",
      "Şöbiyet",
      "Kemalpaşa"
    ],
    "correctIndex": 0,
    "explanation": "Antakya Künefesi, tuzsuz özel künefe peyniri ve tereyağlı tel kadayıfla közde pişirilir.",
    "difficulty": "easy"
  },
  {
    "id": "t-ym-5",
    "categoryId": "yemek-mutfak",
    "categoryName": "Yemek & Kahve Kültürü",
    "question": "Dünyanın en pahalı baharatı olarak bilinen ve gramı altınla yarışan baharat hangisidir?",
    "options": [
      "Safran",
      "Kakule",
      "Vanilya Çubuğu",
      "Muskat"
    ],
    "correctIndex": 0,
    "explanation": "Safran çiçeğinin tepeciklerinden bin bir emekle tek tek elle toplandığı için dünyanın en pahalı baharatıdır.",
    "difficulty": "medium"
  },
  {
    "id": "t-ym-6",
    "categoryId": "yemek-mutfak",
    "categoryName": "Yemek & Kahve Kültürü",
    "question": "İtalyan tatlısı Tiramisu’nun kremasında kullanılan geleneksel taze İtalyan peyniri hangisidir?",
    "options": [
      "Mascarpone",
      "Parmesan",
      "Ricotta",
      "Mozzarella"
    ],
    "correctIndex": 0,
    "explanation": "Tiramisu’nun kadifemsi kıvamı, yağ oranı yüksek Mascarpone peynirinden gelir.",
    "difficulty": "medium"
  },
  {
    "id": "t-ym-7",
    "categoryId": "yemek-mutfak",
    "categoryName": "Yemek & Kahve Kültürü",
    "question": "Gaziantep mutfağında sabahın erken saatlerinde tüketilen etli, pirinçli ve sarımsaklı meşhur çorba nedir?",
    "options": [
      "Beyran",
      "Kelle Paça",
      "Tarhana",
      "Ezogelin"
    ],
    "correctIndex": 0,
    "explanation": "Beyran, kuzu eti, pirinç, iç yağı ve sarımsakla harlı ateşte hazırlanan coğrafi işaretli lezzettir.",
    "difficulty": "easy"
  },
  {
    "id": "t-ym-8",
    "categoryId": "yemek-mutfak",
    "categoryName": "Yemek & Kahve Kültürü",
    "question": "Dünya kahve üretiminin büyük kısmını oluşturan, daha aromatik ve yumuşak içimli kaliteli kahve çekirdeği türü hangisidir?",
    "options": [
      "Arabica",
      "Robusta",
      "Liberica",
      "Excelsa"
    ],
    "correctIndex": 0,
    "explanation": "Arabica çekirdekleri yüksek rakımlarda yetişir; meyvemsi asiditesi ve zengin aromasıyla bilinir.",
    "difficulty": "easy"
  },
  {
    "id": "t-ym-9",
    "categoryId": "yemek-mutfak",
    "categoryName": "Yemek & Kahve Kültürü",
    "question": "Japon mutfağında sushi sarımında kullanılan kurutulmuş preslenmiş deniz yosununa ne ad verilir?",
    "options": [
      "Nori",
      "Wasabi",
      "Wakame",
      "Miso"
    ],
    "correctIndex": 0,
    "explanation": "Nori, kurutulup fırınlanan ince tabaka halindeki yenilebilir deniz yosunudur.",
    "difficulty": "easy"
  },
  {
    "id": "t-ym-10",
    "categoryId": "yemek-mutfak",
    "categoryName": "Yemek & Kahve Kültürü",
    "question": "Kayseri mutfağıyla özdeşleşen, bir kaşığa 40 adet sığmasıyla meşhur hamur yemeği hangisidir?",
    "options": [
      "Mantı",
      "Yağlama",
      "Katmer",
      "Hıngel"
    ],
    "correctIndex": 0,
    "explanation": "Geleneksel Kayseri mantısı ne kadar küçük kapatılırsa ustalık o derece yüksek kabul edilir.",
    "difficulty": "easy"
  },
  {
    "id": "t-cg-1",
    "categoryId": "cografya",
    "categoryName": "Coğrafya & Şehirler",
    "question": "Avustralya’nın başkenti neresidir?",
    "options": [
      "Sidney",
      "Melbourne",
      "Kanberra",
      "Brisbane"
    ],
    "correctIndex": 2,
    "explanation": "Sidney ve Melbourne arasındaki rekabeti çözmek için başkent olarak Kanberra (Canberra) seçilmiştir.",
    "difficulty": "medium"
  },
  {
    "id": "t-cg-2",
    "categoryId": "cografya",
    "categoryName": "Coğrafya & Şehirler",
    "question": "Türkiye’nin yüzölçümü bakımından en büyük gölü hangisidir?",
    "options": [
      "Tuz Gölü",
      "Van Gölü",
      "Beyşehir Gölü",
      "İznik Gölü"
    ],
    "correctIndex": 1,
    "explanation": "Van Gölü, 3.713 km² yüzölçümüyle Türkiye’nin en büyük, dünyanın da en büyük sodalı gölüdür.",
    "difficulty": "easy"
  },
  {
    "id": "t-cg-3",
    "categoryId": "cografya",
    "categoryName": "Coğrafya & Şehirler",
    "question": "Dünyanın en yüksek dağı olan Everest Tepesi hangi iki ülke sınırında yer alır?",
    "options": [
      "Nepal - Çin",
      "Hindistan - Pakistan",
      "Nepal - Butan",
      "Afganistan - Çin"
    ],
    "correctIndex": 0,
    "explanation": "8.848 metre yüksekliğindeki Everest, Himalayalar’da Nepal ve Çin (Tibet) sınırında yükselir.",
    "difficulty": "medium"
  },
  {
    "id": "t-cg-4",
    "categoryId": "cografya",
    "categoryName": "Coğrafya & Şehirler",
    "question": "06 Ankara, 34 İstanbul ise 35 numaralı plaka kodu hangi şehrimize aittir?",
    "options": [
      "Antalya",
      "Bursa",
      "İzmir",
      "Adana"
    ],
    "correctIndex": 2,
    "explanation": "Ege’nin incisi İzmir’in il plaka kodu 35’tir.",
    "difficulty": "easy"
  },
  {
    "id": "t-cg-5",
    "categoryId": "cografya",
    "categoryName": "Coğrafya & Şehirler",
    "question": "Afrika kıtasının en uzun nehri ve aynı zamanda dünyanın en uzun nehirlerinden biri hangisidir?",
    "options": [
      "Amazon",
      "Nil Nehri",
      "Kongo Nehri",
      "Zambezi"
    ],
    "correctIndex": 1,
    "explanation": "Nil Nehri yaklaşık 6.650 km uzunluğuyla Akdeniz’e dökülen tarihi bir hayat kaynağıdır.",
    "difficulty": "easy"
  },
  {
    "id": "t-cg-6",
    "categoryId": "cografya",
    "categoryName": "Coğrafya & Şehirler",
    "question": "Dünyanın en geniş yağmur ormanı alanına sahip Amazon Havzası ağırlıklı olarak hangi ülkede yer alır?",
    "options": [
      "Brezilya",
      "Kolombiya",
      "Peru",
      "Arjantin"
    ],
    "correctIndex": 0,
    "explanation": "Amazon Yağmur Ormanları’nın yaklaşık %60’ı Brezilya sınırları içerisindedir.",
    "difficulty": "easy"
  },
  {
    "id": "t-cg-7",
    "categoryId": "cografya",
    "categoryName": "Coğrafya & Şehirler",
    "question": "Dünyanın hem Avrupa hem Asya kıtasında toprağı bulunan Türkiye dışındaki diğer Avrasya devi ülke hangisidir?",
    "options": [
      "Rusya",
      "Kazakistan",
      "Mısır",
      "Azerbaycan"
    ],
    "correctIndex": 0,
    "explanation": "Rusya toprakları Ural Dağları sınır kabul edilerek hem Doğu Avrupa’yı hem Kuzey Asya’yı kapsar.",
    "difficulty": "easy"
  },
  {
    "id": "t-cg-8",
    "categoryId": "cografya",
    "categoryName": "Coğrafya & Şehirler",
    "question": "Japonya’nın başkenti ve dünyanın en kalabalık kentsel metropol alanı neresidir?",
    "options": [
      "Tokyo",
      "Kyoto",
      "Osaka",
      "Hiroşima"
    ],
    "correctIndex": 0,
    "explanation": "Büyük Tokyo Bölgesi, 37 milyonu aşkın nüfusuyla dünyanın en kalabalık metropolüdür.",
    "difficulty": "easy"
  },
  {
    "id": "t-cg-9",
    "categoryId": "cografya",
    "categoryName": "Coğrafya & Şehirler",
    "question": "Türkiye’de güneşin ilk doğduğu ve ülkenin en doğu ucunu oluşturan ilimiz hangisidir?",
    "options": [
      "Iğdır",
      "Kars",
      "Ağrı",
      "Van"
    ],
    "correctIndex": 0,
    "explanation": "Iğdır’ın Dilucu Sınır Kapısı bölgesi Türkiye’nin en doğu meridyenine ev sahipliği yapar.",
    "difficulty": "easy"
  },
  {
    "id": "t-cg-10",
    "categoryId": "cografya",
    "categoryName": "Coğrafya & Şehirler",
    "question": "İskandinav ülkeleri arasında \"Bin Göller Ülkesi\" olarak anılan kuzey ülkesi hangisidir?",
    "options": [
      "Finlandiya",
      "Norveç",
      "İsveç",
      "Danimarka"
    ],
    "correctIndex": 0,
    "explanation": "Finlandiya topraklarında 180 binden fazla irili ufaklı göl bulunmaktadır.",
    "difficulty": "medium"
  },
  {
    "id": "t-bt-1",
    "categoryId": "bilim-teknoloji",
    "categoryName": "Bilim & Teknoloji",
    "question": "Işığın boşluktaki yayılma hızı saniyede yaklaşık kaç kilometredir?",
    "options": [
      "150.000 km/s",
      "300.000 km/s",
      "500.000 km/s",
      "1.000.000 km/s"
    ],
    "correctIndex": 1,
    "explanation": "Işık hızı tam olarak 299.792 km/saniye olup evrendeki nihai hız sınırıdır.",
    "difficulty": "easy"
  },
  {
    "id": "t-bt-2",
    "categoryId": "bilim-teknoloji",
    "categoryName": "Bilim & Teknoloji",
    "question": "2007 yılında ilk iPhone modelini sahnede \"Bugün üç devrimci ürün tanıtıyoruz\" diyerek dünyaya sunan vizyoner kimdir?",
    "options": [
      "Steve Jobs",
      "Bill Gates",
      "Tim Cook",
      "Steve Wozniak"
    ],
    "correctIndex": 0,
    "explanation": "Steve Jobs’ın 9 Ocak 2007 tarihindeki efsanevi Macworld sunumu akıllı telefon çağını başlattı.",
    "difficulty": "easy"
  },
  {
    "id": "t-bt-3",
    "categoryId": "bilim-teknoloji",
    "categoryName": "Bilim & Teknoloji",
    "question": "Güneş Sistemi’nde yer alan en büyük gezegen hangisidir?",
    "options": [
      "Satürn",
      "Jüpiter",
      "Neptün",
      "Mars"
    ],
    "correctIndex": 1,
    "explanation": "Jüpiter, kütlesi Güneş Sistemi’ndeki diğer tüm gezegenlerin toplamının iki katından fazla olan bir gaz devidir.",
    "difficulty": "easy"
  },
  {
    "id": "t-bt-4",
    "categoryId": "bilim-teknoloji",
    "categoryName": "Bilim & Teknoloji",
    "question": "İnternet sitelerinde kullanılan \"WWW\" kısaltmasının açılımı nedir?",
    "options": [
      "World Wide Web",
      "World Wireless Web",
      "Web Wide World",
      "Wide World Wire"
    ],
    "correctIndex": 0,
    "explanation": "Tim Berners-Lee tarafından 1989 yılında CERN’de geliştirilen World Wide Web (Dünya Çapında Ağ).",
    "difficulty": "easy"
  },
  {
    "id": "t-bt-5",
    "categoryId": "bilim-teknoloji",
    "categoryName": "Bilim & Teknoloji",
    "question": "İnsan vücudundaki kalıtsal genetik şifreyi taşıyan çift sarmal yapıdaki nükleik asit molekülü nedir?",
    "options": [
      "RNA",
      "DNA",
      "ATP",
      "Protein"
    ],
    "correctIndex": 1,
    "explanation": "DNA (Deoksiribonükleik asit), tüm canlıların gelişim ve işlev talimatlarını barındırır.",
    "difficulty": "easy"
  },
  {
    "id": "t-bt-6",
    "categoryId": "bilim-teknoloji",
    "categoryName": "Bilim & Teknoloji",
    "question": "Gökyüzündeki pas rengi kızıl görünümünden ötürü \"Kızıl Gezegen\" olarak adlandırılan komşu gezegen hangisidir?",
    "options": [
      "Mars",
      "Venüs",
      "Merkür",
      "Satürn"
    ],
    "correctIndex": 0,
    "explanation": "Mars yüzeyindeki yoğun demir oksit (pas) tozu gezegene kızıl rengini verir.",
    "difficulty": "easy"
  },
  {
    "id": "t-bt-7",
    "categoryId": "bilim-teknoloji",
    "categoryName": "Bilim & Teknoloji",
    "question": "1969 yılında ABD Savunma Bakanlığı desteğiyle kurulan ve modern internetin atası kabul edilen ağın adı nedir?",
    "options": [
      "ARPANET",
      "Ethernet",
      "Intranet",
      "Bitnet"
    ],
    "correctIndex": 0,
    "explanation": "ARPANET, paket anahtarlamalı ilk ağ olarak üniversiteler arası iletişimi sağlamış ve internete evrilmiştir.",
    "difficulty": "medium"
  },
  {
    "id": "t-bt-8",
    "categoryId": "bilim-teknoloji",
    "categoryName": "Bilim & Teknoloji",
    "question": "Bilgisayar biliminin babası sayılan ve 2. Dünya Savaşı’nda Almanların Enigma şifresini kıran İngiliz matematikçi kimdir?",
    "options": [
      "Alan Turing",
      "John von Neumann",
      "Charles Babbage",
      "Ada Lovelace"
    ],
    "correctIndex": 0,
    "explanation": "Alan Turing, Bletchley Park’ta geliştirdiği Bombe makinesiyle Enigma şifrelerini çözmüştür.",
    "difficulty": "easy"
  },
  {
    "id": "t-bt-9",
    "categoryId": "bilim-teknoloji",
    "categoryName": "Bilim & Teknoloji",
    "question": "Periyodik tablodaki en hafif ve evrende en bol bulunan element hangisidir?",
    "options": [
      "Hidrojen (H)",
      "Helyum (He)",
      "Oksijen (O)",
      "Karbon (C)"
    ],
    "correctIndex": 0,
    "explanation": "Hidrojen, atom numarası 1 olan ve evrendeki bilinen kütlenin yaklaşık %75’ini oluşturan elementtir.",
    "difficulty": "easy"
  },
  {
    "id": "t-bt-10",
    "categoryId": "bilim-teknoloji",
    "categoryName": "Bilim & Teknoloji",
    "question": "Elektrik akımı ve kablosuz enerji iletimi üzerine çalışan, alternatif akım (AC) motorunun dahi mucidi kimdir?",
    "options": [
      "Nikola Tesla",
      "Thomas Edison",
      "Alexander Graham Bell",
      "James Watt"
    ],
    "correctIndex": 0,
    "explanation": "Nikola Tesla, alternatif akım sistemi ve çok fazlı motor patentleriyle modern elektrik şebekesini kurdu.",
    "difficulty": "easy"
  },
  {
    "id": "t-gm-1",
    "categoryId": "gaming",
    "categoryName": "Oyun Dünyası (Gaming)",
    "question": "Rockstar Games imzalı GTA: San Andreas oyununun Los Santos sokaklarında intikam arayan efsanevi ana karakteri kimdir?",
    "options": [
      "Tommy Vercetti",
      "Carl Johnson (CJ)",
      "Niko Bellic",
      "Michael De Santa"
    ],
    "correctIndex": 1,
    "explanation": "Carl \"CJ\" Johnson, Grove Street ailesini yeniden ayağa kaldırmaya çalışan unutulmaz kahramandır.",
    "difficulty": "easy"
  },
  {
    "id": "t-gm-2",
    "categoryId": "gaming",
    "categoryName": "Oyun Dünyası (Gaming)",
    "question": "Mojang tarafından geliştirilen ve pikselli küplerden oluşan dünyanın en çok satan oyunu hangisidir?",
    "options": [
      "Roblox",
      "Terraria",
      "Minecraft",
      "Fortnite"
    ],
    "correctIndex": 2,
    "explanation": "Minecraft, 300 milyondan fazla kopya satarak oyun tarihinin en çok satan oyunu unvanına sahiptir.",
    "difficulty": "easy"
  },
  {
    "id": "t-gm-3",
    "categoryId": "gaming",
    "categoryName": "Oyun Dünyası (Gaming)",
    "question": "Counter-Strike serisinin en popüler ve rekabetçi haritası \"Dust 2\"de bomba kurulan kaç adet alan (site) vardır?",
    "options": [
      "1",
      "2 (A ve B)",
      "3",
      "4"
    ],
    "correctIndex": 1,
    "explanation": "Dust II haritasında teröristlerin bombayı kurabileceği A Site (Uzun/Kısa) ve B Site olmak üzere 2 alan vardır.",
    "difficulty": "easy"
  },
  {
    "id": "t-gm-4",
    "categoryId": "gaming",
    "categoryName": "Oyun Dünyası (Gaming)",
    "question": "Sony’nin ilk PlayStation konsolu hangi on yılda piyasaya sürülmüştür?",
    "options": [
      "1970’ler",
      "1980’ler",
      "1990’lar (1994)",
      "2000’ler"
    ],
    "correctIndex": 2,
    "explanation": "İlk PlayStation konsolu Aralık 1994’te Japonya’da, 1995’te dünya genelinde çıkış yaptı.",
    "difficulty": "easy"
  },
  {
    "id": "t-gm-5",
    "categoryId": "gaming",
    "categoryName": "Oyun Dünyası (Gaming)",
    "question": "The Witcher oyun serisinde beyaz saçları ve iki kılıcıyla bilinen efsanevi canavar avcısı kahraman kimdir?",
    "options": [
      "Geralt of Rivia",
      "Vesemir",
      "Dandelion",
      "Ciri"
    ],
    "correctIndex": 0,
    "explanation": "Andrzej Sapkowski’nin romanlarından uyarlanan seride Rivyalı Geralt, mutant bir canavar avcısıdır.",
    "difficulty": "easy"
  },
  {
    "id": "t-gm-6",
    "categoryId": "gaming",
    "categoryName": "Oyun Dünyası (Gaming)",
    "question": "\"Finish Him!\" anonsu ve acımasız \"Fatality\" bitiriş hareketleriyle tanınan efsanevi dövüş oyunu hangisidir?",
    "options": [
      "Mortal Kombat",
      "Tekken",
      "Street Fighter",
      "King of Fighters"
    ],
    "correctIndex": 0,
    "explanation": "Mortal Kombat (1992), kanlı Fatality mekaniğiyle video oyun derecelendirme sisteminin doğmasına yol açtı.",
    "difficulty": "easy"
  },
  {
    "id": "t-gm-7",
    "categoryId": "gaming",
    "categoryName": "Oyun Dünyası (Gaming)",
    "question": "Valve’ın portal tabancasıyla duvarlarda mavi ve turuncu geçitler açarak ilerlenen fizik-bulmaca başyapıtı nedir?",
    "options": [
      "Portal",
      "Half-Life",
      "Team Fortress",
      "Left 4 Dead"
    ],
    "correctIndex": 0,
    "explanation": "Portal (ve Portal 2), yapay zeka GLaDOS’un iğneleyici replikleri ve mekanikleriyle bir kült eserdir.",
    "difficulty": "easy"
  },
  {
    "id": "t-gm-8",
    "categoryId": "gaming",
    "categoryName": "Oyun Dünyası (Gaming)",
    "question": "League of Legends (LoL) oyununda haritanın merkezinde yer alan nehri koruyan ve kesildiğinde takıma güç veren ejderha ve nehir canavarları nerededir?",
    "options": [
      "Sihirdar Vadisi (Summoner’s Rift)",
      "Sonsuz Uçurum",
      "Kristal Yara",
      "Uğursuz Koruluk"
    ],
    "correctIndex": 0,
    "explanation": "Sihirdar Vadisi, 5v5 rekabetçi LoL maçlarının oynandığı standart üç koridorlu haritadır.",
    "difficulty": "easy"
  },
  {
    "id": "t-gm-9",
    "categoryId": "gaming",
    "categoryName": "Oyun Dünyası (Gaming)",
    "question": "Nintendo’nun bıyıklı İtalyan tesisatçı kahramanı Mario, prenses Peach’i kurtarmak için kiminle savaşır?",
    "options": [
      "Bowser",
      "Wario",
      "Donkey Kong",
      "Luigi"
    ],
    "correctIndex": 0,
    "explanation": "Dikenli kabuğu ve ateş püskürtmesiyle bilinen Kral Bowser, Mario’nun ezeli düşmanıdır.",
    "difficulty": "easy"
  },
  {
    "id": "t-gm-10",
    "categoryId": "gaming",
    "categoryName": "Oyun Dünyası (Gaming)",
    "question": "Red Dead Redemption 2’de Van der Linde çetesinin sadık üyesi olan ana karakter kimdir?",
    "options": [
      "Arthur Morgan",
      "John Marston",
      "Dutch van der Linde",
      "Micah Bell"
    ],
    "correctIndex": 0,
    "explanation": "Arthur Morgan, derin hikayesi ve duygusal dönüşümüyle oyun tarihinin en sevilen karakterlerindendir.",
    "difficulty": "easy"
  },
  {
    "id": "t-no-1",
    "categoryId": "nostalji",
    "categoryName": "90'lar & 2000'ler Nostalji",
    "question": "2000’li yıllarda internet kafelerin ve evlerin vazgeçilmezi olan, titreşim gönderme özelliğiyle ünlü anlık mesajlaşma programı neydi?",
    "options": [
      "MSN Messenger",
      "ICQ",
      "mIRC",
      "Yahoo Messenger"
    ],
    "correctIndex": 0,
    "explanation": "MSN Messenger, \"Çevrimdışı Görün\", göz kırpmalar ve \"Ne Dinliyorum\" özellikleriyle dönemin simgesiydi.",
    "difficulty": "easy"
  },
  {
    "id": "t-no-2",
    "categoryId": "nostalji",
    "categoryName": "90'lar & 2000'ler Nostalji",
    "question": "90’larda cips paketlerinden çıkan, yerde üst üste dizilip vurularak ters çevrilmeye çalışılan yuvarlak plastik diskler neydi?",
    "options": [
      "Taso",
      "Misket",
      "Bilye",
      "Fırıldak"
    ],
    "correctIndex": 0,
    "explanation": "Özellikle Looney Tunes ve Pokémon tasoları 90’lar çocuklarının en büyük sokak rekabetiydi.",
    "difficulty": "easy"
  },
  {
    "id": "t-no-3",
    "categoryId": "nostalji",
    "categoryName": "90'lar & 2000'ler Nostalji",
    "question": "İçindeki \"Yılan (Snake)\" oyunu ve çekiçle bile kırılmayan efsanevi dayanıklılığıyla hatırlanan Nokia telefon modeli hangisidir?",
    "options": [
      "Nokia 3310",
      "Nokia 5110",
      "Nokia N73",
      "Nokia 6600"
    ],
    "correctIndex": 0,
    "explanation": "2000 yılında piyasaya çıkan Nokia 3310, teknoloji dünyasının en büyük nostalji ikonlarından biridir.",
    "difficulty": "easy"
  },
  {
    "id": "t-no-4",
    "categoryId": "nostalji",
    "categoryName": "90'lar & 2000'ler Nostalji",
    "question": "Sokakta yürürken kulaklıkla kaset dinlemeyi mümkün kılan Sony imzalı taşınabilir cihaza ne ad verilirdi?",
    "options": [
      "Discman",
      "Walkman",
      "iPod",
      "MP3 Çalar"
    ],
    "correctIndex": 1,
    "explanation": "Sony Walkman, müzik dinleme alışkanlığını tamamen kişisel ve taşınabilir hale getirmiştir.",
    "difficulty": "easy"
  },
  {
    "id": "t-no-5",
    "categoryId": "nostalji",
    "categoryName": "90'lar & 2000'ler Nostalji",
    "question": "Kasetlerin bandı sıkıştığında veya geri sarmak için pil bitmesin diye kaset deliğine sokulan nostaljik kırtasiye aleti neydi?",
    "options": [
      "Tükenmez / Kurşun Kalem",
      "Cetvel",
      "Pergel",
      "Ataş"
    ],
    "correctIndex": 0,
    "explanation": "Kurşun veya altıgen tükenmez kalem sokup parmakla fır fır çevirmek 90’ların evrensel refleksidir.",
    "difficulty": "easy"
  },
  {
    "id": "t-no-6",
    "categoryId": "nostalji",
    "categoryName": "90'lar & 2000'ler Nostalji",
    "question": "90’larda çocukların küçük bir anahtarlıkta besleyip büyüttüğü, altını temizleyip uyuttuğu dijital evcil hayvan oyuncağı neydi?",
    "options": [
      "Sanal Bebek (Tamagotchi)",
      "Furby",
      "Game Boy",
      "Tetris"
    ],
    "correctIndex": 0,
    "explanation": "Tamagotchi (Sanal Bebek), yem verilmediğinde öten ve tüm çocukların cebinde taşıdığı çılgınlıktı.",
    "difficulty": "easy"
  },
  {
    "id": "t-no-7",
    "categoryId": "nostalji",
    "categoryName": "90'lar & 2000'ler Nostalji",
    "question": "Televizyonda Tolga Abi sunumuyla çocukların ev telefonunun tuşlarına basarak yönettiği sevimli kahramanın adı neydi?",
    "options": [
      "Hugo",
      "Snoopy",
      "Casper",
      "Red Kit"
    ],
    "correctIndex": 0,
    "explanation": "\"Cadı Sila\"ya karşı yarışılan interaktif canlı yayın efsanesi \"Hugo ve Tolga Abi\" idi.",
    "difficulty": "easy"
  },
  {
    "id": "t-no-8",
    "categoryId": "nostalji",
    "categoryName": "90'lar & 2000'ler Nostalji",
    "question": "Bakkallarda satılan, içinden spor araba resimleri ve teknik detayları çıkan efsanevi nostaljik sakız hangisidir?",
    "options": [
      "Turbo Sakız",
      "Tipitip",
      "Şıpsevdi (Love is...)",
      "Big Babol"
    ],
    "correctIndex": 0,
    "explanation": "Turbo sakızın içinden çıkan otomobil kartları erkek çocuklarının en büyük koleksiyonuydu.",
    "difficulty": "easy"
  },
  {
    "id": "t-no-9",
    "categoryId": "nostalji",
    "categoryName": "90'lar & 2000'ler Nostalji",
    "question": "İnternete bağlanırken hoparlörden \"bıııırr-çzzz-düüütt\" sesleri çıkaran telefon hattı modem teknolojisine ne ad verilirdi?",
    "options": [
      "Dial-up (Çevirmeli Ağ - 56k)",
      "ADSL",
      "Fiber Optik",
      "Kablo Net"
    ],
    "correctIndex": 0,
    "explanation": "Çevirmeli ağ (Dial-up), internete girildiğinde ev telefonunun meşgul çalmasına neden olan nostaljik sesti.",
    "difficulty": "easy"
  },
  {
    "id": "t-no-10",
    "categoryId": "nostalji",
    "categoryName": "90'lar & 2000'ler Nostalji",
    "question": "90’larda televizyon karşısında saatlerce oynanan, \"9999 in 1\" yazan ama içinde aslında 5 farklı oyun olan el konsolu neydi?",
    "options": [
      "El Tetrisi (Brick Game)",
      "Game Boy Color",
      "PSP",
      "Sega Game Gear"
    ],
    "correctIndex": 0,
    "explanation": "Gri veya sarı renkli pilli El Tetrisi, araba yarışı ve blok kırma oyunlarıyla efsaneydi.",
    "difficulty": "easy"
  }
];
