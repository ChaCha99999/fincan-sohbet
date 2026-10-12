const fs = require('fs');
const path = require('path');

// 250 Özgün, Mizahi ve Eğlenceli "Kim Daha Muhtemel?" Sorusu
const muhtemelSorular = [
  // 1-25: Sosyal Medya, Telefon & Stalk Halleri
  "Eski sevgilisinin yeni sevgilisinin ilkokul arkadaşının profilini 10 dakikada bulacak kişi?",
  "Buluşmada telefonunu masaya koyup her 15 saniyede bir ekranına bakacak kişi?",
  "Yanlışlıkla birinin 3 yıl önceki tatil fotoğrafını gece 03:00'te beğenecek kişi?",
  "Instagram'da 500 kişiyi 'Yakın Arkadaşlar' (Close Friends) listesine alacak kişi?",
  "Birine mesaj yazdıktan sonra karşı tarafın 'yazıyor...' yazısını nefesini tutarak bekleyecek kişi?",
  "Grup sohbetindeki dedikodunun ekran görüntüsünü yanlışlıkla o gruba geri atacak kişi?",
  "Telefonunun şarjı %1 kalınca dünyanın sonu gelmiş gibi panikleyecek kişi?",
  "Hikaye paylaştıktan sonra ilk 10 dakikada kimlerin baktığını 25 kez kontrol edecek kişi?",
  "Tinder/Bumble'da tanıştığı biriyle ilk buluşmada evlilik planı yapacak kişi?",
  "WhatsApp'ta 'son görülme' ve 'mavi tik' kapalı olduğu için gizemli ajan gibi takılan kişi?",
  "Kafede fotoğrafı çekilirken 'bir saniye ışık kötü, tekrar çek' diye 40 kare çektirecek kişi?",
  "Gelen telefon aramasını meşgule atıp 2 saniye sonra 'noldu yazsana' diye mesaj atacak kişi?",
  "Spotify Wrapped özetinde gizli arabesk veya nostalji şarkıları çıktığı için utancından paylaşamayacak kişi?",
  "Online alışveriş sepetine 50 parça kıyafet doldurup hiçbirini satın almayacak kişi?",
  "Sosyal medyada gördüğü her astroloji ve burç yorumunu ciddiye alıp gününü ona göre planlayacak kişi?",
  "Yabancı bir mekanda garsona 'pardon WiFi şifresi neydi' diye ilk soracak kişi?",
  "Bir TikTok akımını evde tek başınayken gizlice deneyip kaydedecek kişi?",
  "Telefonunu sessize alıp sonra evin içinde nereye koyduğunu bulamayan kişi?",
  "Google arama geçmişi yanlışlıkla açılsa masadaki herkese rezil olacak kişi?",
  "Hiç tanımadığı bir ünlünün ya da fenomenin DM kutusuna içini dökecek kişi?",
  "Bir tartışmayı kazanmak için 2 yıl önceki WhatsApp mesajının ekran görüntüsünü çıkaracak kişi?",
  "Sırf profili güzel görünsün diye sevmediği kahveyi sipariş edip fotoğrafını çekecek kişi?",
  "Grup sohbetinde 4 dakikalık sesli mesaj (podcast) atıp herkesi bezdirecek kişi?",
  "Kendi doğum gününü bir hafta önceden hikayelerle hatırlatmaya başlayacak kişi?",
  "Telefonun bildirim sesini duyunca panikle masadan fırlayacak kişi?",

  // 26-50: Para, Alışveriş, Hesap & Cimrilik/Cömertlik
  "Markette 800 TL harcayıp 5 TL poşet parası vermemek için tüm eşyaları kucağında taşıyacak kişi?",
  "Kafede hesap ödenirken 'ben sadece soda içtim' diyerek bozuklukları kuruşu kuruşuna sayacak kişi?",
  "Masadaki tüm hesabı 'bırakın ya ben hallederim' diye pos cihazına tek hamlede basacak kişi?",
  "Gruptan birine 25 TL borç verip 6 ay boyunca unutmayıp hatırlatacak kişi?",
  "İndirim var diye hayatı boyunca asla kullanmayacağı saçma sapan bir şeyi satın alacak kişi?",
  "Kripto paradan ya da borsadan batıp 'bu bir düzeltme hareketi' diye kendini avutacak kişi?",
  "Gelecekte kazara veya çalışarak aramızdan ilk milyoner olacak kişi?",
  "Piyangodan büyük ikramiye çıksa en yakın arkadaşlarına bile söylemeyip gizlice yurt dışına kaçacak kişi?",
  "Dolabında etiketini bile sökmediği onlarca kıyafetle 'giyecek hiçbir şeyim yok' diye ağlayacak kişi?",
  "Restoranda porsiyon küçük gelince garsonla kibarca ama diş bileyerek tartışacak kişi?",
  "İkinci el uygulamasında 50 TL'lik eşya için 3 gün boyunca kıran kırana pazarlık yapacak kişi?",
  "Kredi kartı ekstrem geldiğinde ekstreyi açmaya korkup telefonunu kapatacak kişi?",
  "Maaşının yattığı ilk 3 günde krallar gibi yaşayıp ayın kalanında simit-çay ile beslenecek kişi?",
  "Taksiye binmek yerine 'şurası 20 dakika yürünür ya' diyerek herkesi karda kışta yürütecek kişi?",
  "Açık büfe kahvaltıda tabağı piramit gibi doldurup yarısını masada bırakacak kişi?",
  "Arkadaş grubunun doğum günü hediyesi için para toplarken parayı en son atan kişi?",
  "Yurtdışına gidince her şeyin fiyatını kafasında anında TL'ye çarpıp derin bir iç çekecek kişi?",
  "Kafede masaya gelen ikram kurabiyeyi veya şekeri çantasına gizlice atacak kişi?",
  "Lüks bir mağazaya girip fiyat etiketini görünce 'aslında tarzım değilmiş' diyerek geri çıkacak kişi?",
  "Kendi düğününde takılan altınları gece odasında tek tek sayıp Excel tablosu yapacak kişi?",
  "Miras kavgası çıksa hakkını son kuruşuna kadar söke söke alacak kişi?",
  "Arkadaşından borç isterken 40 takla atıp 'pazartesi kesin sendeyim' diyecek kişi?",
  "Bir kafede 150 TL'lik kahveyi 4 saat boyunca yudumlayıp prizden kalkmayacak kişi?",
  "Evdeki bayat ekmekleri atmayıp 10 farklı tarifle değerlendirmeye çalışan gizli tasarruf ustası?",
  "Milyarder olsa bile sokaktaki indirim tezgahını görünce dayanamayıp karıştıracak kişi?",

  // 51-75: Geç Kalma, Tembellik & Uyku Düzeni
  "Buluşmaya '5 dakikaya oradayım' mesajı attığında aslında henüz yataktan bile çıkmamış olan kişi?",
  "Hafta sonu hiçbir plan yapmayıp 48 saat boyunca pijamayla yatakta dizi izleyecek kişi?",
  "Sabah kurduğu 10 tane alarmın hiçbirini duymayıp mışıl mışıl uyumaya devam edecek kişi?",
  "Önemli bir iş toplantısına veya sınava uyuya kalıp pijamayla koşacak kişi?",
  "Evde kapı zili çaldığında 'kesin bana değildir' diyerek koltuktan kalkmaya üşenecek kişi?",
  "Buluşma yerine tam 45 dakika geç gelip 'trafik felaketti' yalanını en inandırıcı söyleyecek kişi?",
  "Yatağa uzandığında ışığı kapatmayı unuttuğu için 20 dakika boyunca ışığa bakıp kalkmaya üşenen kişi?",
  "Pazar akşamı aniden gelen 'yarın işe/okula gitmesem ne olur' krizine girecek kişi?",
  "Bir kafede otururken esnemekten gözlerinden yaşlar gelen ve uykusu gelen kişi?",
  "Gündüz saat 14:00'te 'küçük bir kestireyim' deyip gece 21:00'de hangi yılda olduğunu unutmuş uyanan kişi?",
  "Yemek yapmaya üşenip 3 gün üst üste dışarıdan hazır sipariş verecek kişi?",
  "Gruptan bir buluşma teklifi geldiğinde son dakikada 'hastayım' bahanesiyle ekecek kişi?",
  "Uçak saatine 40 dakika kala havalimanı kapısına nefes nefese varıp kapıyı zorlayacak kişi?",
  "Odasını toplamak yerine tüm dağınıklığı tek bir sandalyenin üstüne yığacak kişi?",
  "Sinemada filmin en heyecanlı yerinde kafası omzuna düşüp horul horul uyuyacak kişi?",
  "Günde 14 saat uyuyup uyandığında 'hala çok yorgunum' diye şikayet edecek kişi?",
  "Spor salonuna 1 yıllık üyelik yaptırıp sadece ilk 2 gün gidip sonra asla uğramayacak kişi?",
  "Bulaşık makinesini boşaltmaya üşenip temiz tabakları makinenin içinden kullanan kişi?",
  "Yürüyen merdivende bir adım bile atmadan heykel gibi bekleyen kişi?",
  "Arabayı park edecek yer bulamayıp gideceği yerden vazgeçip eve geri dönecek kişi?",
  "Grup tatilinde sabah herkesi erkenden uyandırıp 'hadi kalkın gün bitiyor' diye terör estirecek kişi?",
  "Televizyon kumandası 1 metre uzakta olduğu için kanal değiştirmeyip istemediği programı izleyen kişi?",
  "Yaz tatilinde şezlongdan kalkmadan 8 saat boyunca kıpırdamadan yatacak kişi?",
  "Alarm sesini en nefret ettiği şarkı yapıp yine de o şarkıyla uyanamayacak kişi?",
  "İş yerinde tuvalette oyun oynayarak 25 dakika mesai öldürecek kişi?",

  // 76-100: İlişkiler, Flört & Aşk Halleri
  "İlk buluşmada (First date) karşısındakine ilk 10 dakikada aşık olduğunu hissettirecek kişi?",
  "Eski sevgilisinden gelen 'nasılsın?' mesajına 2 saniye içinde uzun bir paragraf döşeyecek kişi?",
  "İlişkide en ufak bir tartışmada 'biz galiba anlaşamıyoruz' diyerek bavulu toplayacak kişi?",
  "Birini bir hafta boyunca stalklayıp sonra yanlışlıkla hikayesine alev emojisi atacak kişi?",
  "Sevgilisinin burcuyla kendi burcunun uyumunu 15 farklı siteden kontrol edecek kişi?",
  "Romantik bir yemekte heyecandan bardağı devirip masayı göle çevirecek kişi?",
  "İlk görüşte aşka inanıp her hafta başka birine 'bu seferki kesin ruh ikizim' diyecek kişi?",
  "Sevgilisiyle tartışırken 6 ay önce söylediği tek bir kelimeyi kelimesi kelimesine hatırlatan kişi?",
  "Ayrılık sonrasında anında arabesk şarkılar eşliğinde hüzünlü story yağmuru başlatacak kişi?",
  "Birine açılmak yerine 2 yıl boyunca platonik olarak uzaktan iç çekerek bekleyecek kişi?",
  "İlişkisi başlar başlamaz tüm arkadaş grubunu unutup sevgilisiyle dünyadan kopacak kişi?",
  "Sevgilisinin telefon şifresini göz ucuyla gizlice çözmeye çalışacak usta ajan?",
  "İlk buluşmaya bütün arkadaşlarını arka masaya oturtup göz hapsine aldıracak kişi?",
  "Flörtüne 'ben aslında ilişk insanı değilim' deyip 2 hafta sonra nişanlanacak kişi?",
  "Sevgilisinin ailesiyle tanışmaya gittiğinde heyecandan pot üstüne pot kıracak kişi?",
  "Gruptaki birinin eski sevgilisiyle yanlışlıkla pişti olup nereye saklanacağını bilemeyecek kişi?",
  "Kavga ederken haklı olduğunu kanıtlamak için ağlama kozunu ustaca kullanacak kişi?",
  "Sevgilisine aldığı hediyeyi son anda beğenmeyip panikle benzinlikten çiçek alacak kişi?",
  "İlişkisinde dedektif gibi her yalanı ilk saniyede yakalayan altıncı hissi güçlü kişi?",
  "Aşk acısından 5 kilo verip hemen spor salonuna yazılarak intikam fiziği yapacak kişi?",
  "Evlilik teklifini stadyumda veya AVM ortasında binlerce kişinin önünde yapacak çılgın?",
  "Sevgilisine attığı mesaj 'görüldü' olunca 3 saat boyunca tırnaklarını yiyen kişi?",
  "En yakın arkadaşının sevgilisini görür görmez 'bu çocuktan/kızdan hiç hoşlanmadım' diyecek kişi?",
  "Romantik bir film izlerken gözyaşlarına boğulup burnunu çekecek duygusal tip?",
  "Flört döneminde cool davranmaya çalışırken aşırı soğuk davranıp karşı tarafı kaçıracak kişi?",

  // 101-125: Sakarlık, Unutkanlık & Kaos
  "Düz yolda yürürken kendi ayağına takılıp düşme tehlikesi atlatacak kişi?",
  "Kafeden kalkarken cüzdanını, anahtarını veya telefonunu kesinlikle masada unutacak kişi?",
  "Evden çıkıp 3 sokak yürüdükten sonra 'ütü açık mı kaldı' paniğiyle geri dönecek kişi?",
  "Sıcak çayı veya kahveyi üstüne döküp beyaz tişörtünü mahvedecek kişi?",
  "Birinin adını 3 saniye önce öğrenip hemen ardından adını tamamen unutacak kişi?",
  "Girdiği cam kapıyı açık sanıp kafasını cama güüüm diye çarpacak kişi?",
  "Biriyle vedalaşırken 'görüşürüz' deyip aynı yöne doğru yan yana yürümeye devam eden o cringe kişi?",
  "Önemli bir evrakı veya bileti 'asla kaybolmasın' diye öyle bir yere saklayıp kendisi de bulamayan kişi?",
  "Markette alışveriş yapıp kasada kartının şifresini aniden unutan kişi?",
  "Arkadaşının çok önemli sırrını masada kazara ağzından kaçırıp gözlerini fal taşı gibi açacak kişi?",
  "Girdiği restoranda garson 'afiyet olsun' deyince istemsizce 'size de' diyecek kişi?",
  "Toplu taşımada ineceğini durağı kaçırıp son durakta şaşkın şaşkın uyanacak kişi?",
  "Yemek yaparken yemeğin altını yakıp mutfağı duman altı edecek kişi?",
  "Telefonu elindeyken 'telefonum nerede' diye panikle evin altını üstüne getirecek kişi?",
  "Kıyafetini ters giydiğini akşama doğru bir arkadaşı uyarınca fark edecek kişi?",
  "Arabanın anahtarını arabanın içinde unutup kapıları kilitleyecek dahi?",
  "Bir espri anlatmaya başlayıp esprinin sonunu unutan ya da kendisi gülmekten anlatamayan kişi?",
  "Şemsiyesini gittiği ilk mekanda unutup yağmurda sırılsıklam eve dönecek kişi?",
  "Gözlüğü kafasındayken 15 dakika boyunca 'gözlüğümü gören var mı' diye soracak kişi?",
  "Asansöre bindiğinde basacağı katı unutup boş boş kat düğmelerine bakan kişi?",
  "Kafede sandalyeye otururken sandalyeyi ıskalayıp yere oturma tehlikesi yaşayacak kişi?",
  "Yeni aldığı teknolojik aleti ilk 24 saat içinde yere düşürüp ekranını çatlatacak kişi?",
  "Kulağında kulaklık varken dışarıdan duyulmadığını sanıp şarkıyı avazı çıktığı kadar bağırarak söyleyen kişi?",
  "Doğum günlerini ve yıldönümlerini hatırlamakta dünyanın en başarısız insanı?",
  "Tuz yerine şekeri çorbaya boca edip tadına bakınca şok geçirecek mutfak sakarı?",

  // 126-150: Kafe, Yemek & Gurmelik Halleri
  "Gittiği kafede menüdeki 60 çeşit kahveyi 20 dakika inceleyip yine klasik Türk kahvesi söyleyecek kişi?",
  "Diyete pazartesi sabahı başlayıp aynı gün akşam saat 20:00'de tatlı krizine teslim olacak kişi?",
  "Yan masaya gelen yemeği görüp garsona 'şu masadakinden bize de getirin' diyecek gözü aç gurme?",
  "Kafede garson yanlış sipariş getirdiğinde çekinmeyip 'ben bunu söylememiştim' diye kibarca düzelten kişi?",
  "Kafede garson yanlış sipariş getirdiğinde utanıp 'olsun ya bu da güzelmiş' diyerek içen kişi?",
  "Lahmacuna limon sıkılmasına veya menemene soğan konulmasına dini bir mesele gibi takacak kişi?",
  "Yemeğin fotoğrafını çekmeden kimsenin çatal vurmasına izin vermeyen sosyal medya şefi?",
  "Bir fincan kahveye 'çekirdekleri Guatemala'nın yüksek tepelerinden toplanmış' analizi yapacak kahve uzmanı?",
  "Dışarıda yemek yerken tabağındaki son lokmayı bile sıyırıp ekmekle tabak temizleyecek kişi?",
  "Kafede en kuytu, priz kenarı, rahat koltuklu masayı kapmak için koşar adım yer tutacak kişi?",
  "Masadaki herkes doymuşken 'ortaya bir patates daha mı söylesek' teklifini getirecek kişi?",
  "Acı sos yarışmasında 'bana hiçbir şey olmaz' deyip ilk lokmada gözlerinden yaşlar akacak cesur?",
  "Çay soğumasın diye tek dikişte içip dili damağı yanan sabırsız çay tiryakisi?",
  "Gece yarısı saat 02:00'de 'canım inanılmaz kokoreç/ıslak hamburger çekti' diye grubu ayaklandıracak kişi?",
  "Hesap öderken garsona bahşiş bırakılması konusunda masadakilere nutuk çekecek centilmen?",
  "Evde yemek yapıp 'MasterChef tabağı yaptım' diye gururla masadaki herkese fotoğrafını gösterecek kişi?",
  "Gittiği her şehirde 'buranın nesi meşhur' deyip en salaş esnaf lokantasını bulacak gezgin gurme?",
  "Sırf fal kapatmak için hiç sevmediği halde Türk kahvesi sipariş edip tabağa çevirecek kişi?",
  "Arkadaşının tabağından 'sadece bir çatal alabilir miyim' deyip porsiyonun üçte birini götürecek kişi?",
  "Masada su bittiğinde garsona el işareti yapmaya çekinip susuzluktan kuruyan utangaç?",
  "Buzlu kahvenin içindeki buzları pipetle kütür kütür kemiren sabırsız tip?",
  "Kafede tatlı siparişi verirken 'kalorisi en az olan hangisi' diye sorup sonra sufle yiyen kişi?",
  "Menüdeki yabancı kelimeleri telaffuz ederken İtalyan aksanı yapmaya çalışan şovmen?",
  "Kahvaltı masasında Nutella kavanozunu kaşıkla tek başına bitirecek tatlı canavarı?",
  "Masadaki çerez tabağındaki kaju ve antep fıstıklarını gizlice ilk ayıklayıp yiyen stratejist?",

  // 151-175: Popüler Kültür, Dizi & Mizah
  "Gibi dizisindeki İlkkan gibi her sıradan olaya derin ve saçma felsefi açıklamalar getirecek kişi?",
  "Gibi dizisindeki Yılmaz gibi insanların saçmalıklarına tahammül edemeyip aniden parlayacak kişi?",
  "Düğün salonunda ilk 10 dakikada halayın başına geçip mendil sallayacak neşeli tip?",
  "Ortamda kimsenin anlamadığı çok niş bir dizi veya film göndermesi yapıp tek başına gülecek kişi?",
  "Karaoke gecesinde mikrofonu eline geçirip bir daha kimseye vermeyecek gizli popstar?",
  "Girdiği her ortamda Cem Yılmaz esprileri patlatıp ortamı güldürmeye çalışan fıkracı?",
  "Survivor'a katılsa adada ilk hafta açlıktan ve dedikodudan cinnet geçirecek kişi?",
  "Yolda ünlü birini görünce heyecandan fotoğraf çektirmek için üstüne atlayacak kişi?",
  "Tüm arkadaş grubunu toplayıp zorla korku filmi izletip en çok kendisi korkacak kişi?",
  "Bir dizinin finalini önceden izleyip gruptakilere bilerek veya kazara spoiler verecek hain?",
  "Tavla veya okey oynarken zarları fırlatıp 'böyle şansın ben...' diye masayı devirecek hırslı oyuncu?",
  "Kendi esprisine masadaki herkesten önce ve herkesten yüksek sesle kahkaha atan kişi?",
  "Bir ortamda tartışma çıkınca patlamış mısırını alıp kenardan keyifle kaosu izleyecek kişi?",
  "Tiktok'ta komik video çekerken rezil olup videosu viral olacak geleceğin fenomeni?",
  "Arkadaşının taklidini onun yüzüne karşı birebir yapıp herkesi yerlere yatıracak komedyen?",
  "Milli maç izlerken televizyonun dibine kadar girip hakeme taktik veren fanatik?",
  "Arabada müzik çalarken camları açıp şarkıyı tüm mahalleye dinleten DJ ruhlu kişi?",
  "Eurovision tekrar başlasa Türkiye adına sahneye çıkıp dans etmeyi kabul edecek kişi?",
  "Korku evine gidince korkudan kapıdaki görevliye sarılıp ağlayacak cesur yürek?",
  "Bir ünlünün konserinde sahneye atlayıp güvenlikle güreşecek fanatik hayran?",
  "Masa oyunlarında (Monopoly, Tabu, Catan) kazanmak için kuralları eğip bükecek çakal?",
  "Büyüyünce stand-up gösterisi yapıp arkadaş grubunun dedikodularını sahneye taşıyacak kişi?",
  "Instagram reels veya TikTok videolarında kaydırırken zaman kavramını kaybedip 4 saat geçiren kişi?",
  "Grup fotoğrafında en güzel kendi çıktığı fotoğrafı seçip diğerlerinin kötü çıkmasını umursamayan kişi?",
  "Yabancı şarkı dinlerken sözleri bilmediği halde uydurma sözlerle bağıra çağıra eşlik eden kişi?",

  // 176-200: Macera, Seyahat & Çılgınlık
  "Yurtdışı tatilinde pasaportunu veya cüzdanını kaybedip konsolosluğa sığınacak kişi?",
  "Issız bir adaya düşsek zekası ve kurnazlığıyla ilk hayatta kalacak kişi?",
  "Issız bir adaya düşsek ilk gün hindistancevizi kırmaya çalışırken yaralanacak kişi?",
  "Plansız bir şekilde 'hadi çantanı topla yarım saate yola çıkıyoruz' teklifine anında 'varım' diyecek kişi?",
  "Havalimanında güvenlik kontrolünde kemeri, saati, montu çıkarırken kuyruğu kilitleyecek kişi?",
  "Gittiği yabancı ülkede dil bilmediği halde el kol hareketleriyle herkesle anlaşıp arkadaş olan kişi?",
  "Uçak türbülansa girdiğinde panikle yanındaki yabancının elini tutacak kişi?",
  "Otostop çekerek dünyayı gezmeyi göze alabilecek maceracı ruh?",
  "Lunaparkta en yüksek hız trenine (Rollercoaster) binip ses tellerini yırtana kadar bağıracak kişi?",
  "Tatilde otelden çıkmayıp bütün gün havuz başında uyuklayacak tembel turist?",
  "Dağ yürüyüşünde gruptan kopup kaybolacak ve arama kurtarma ekibini peşine takacak kişi?",
  "Çadır kampına gidip ilk geceden 'böcek var, sırtım ağrıdı' diyerek otele kaçacak kişi?",
  "Gittiği her tarihi eserin ve müzenin önünde zıplayarak poz verecek heyecanlı turist?",
  "Navigasyon açtığı halde tabelaları yanlış anlayıp şehirden tamamen alakasız bir köye varacak kişi?",
  "Bungolow tatilinde gece gelen sincap veya kedi sesini ayı sanıp barikat kuracak kişi?",
  "Venedik'te kaybolup gondolcuya memleket meselelerini anlatmaya çalışacak kişi?",
  "Yamaç paraşütü yaparken havada korkudan gözlerini bile açamayacak kişi?",
  "Tatilde bavulunu öyle bir dolduracak ki havaalanında fazla bagaj ücreti ödemek zorunda kalacak kişi?",
  "Sırf ucuz bilet buldu diye hiç bilmediği ve kışın -20 derece olan bir ülkeye tek başına gidecek kişi?",
  "Gemi turunda ilk 15 dakikada deniz tutup kamaradan çıkamayacak talihsiz gezgin?",
  "Yolculukta arabayı sürerken benzin ışığı yandığı halde 'bizi 50 km daha götürür' diye inat eden kişi?",
  "Grup seyahatinde tüm bütçeyi ve rotayı dakika dakika Excel'e döken kontrol delisi?",
  "Gittiği tropik ülkede sokak yemeği yiyip 3 gün boyunca midesini bozacak maceraperest?",
  "Otel odasındaki şampuanları ve terlikleri 'nasılsa hakkım' diyerek çantaya istifleyecek kişi?",
  "Dalış yaparken balıklardan korkup suyun üstüne fırlayacak kişi?",

  // 201-225: Masadaki Karakterler, Dostluk & Gizli Huylar
  "Gruptan biri ağladığında ona sarılıp onunla beraber hıçkıra hıçkıra ağlayacak duygusal kişi?",
  "Gece saat 04:00'te 'başım dertte' diye arasan pijamayla arabaya atlayıp yardıma gelecek gerçek dost?",
  "En ciddi ve gergin ortamda bile patavatsızca komik bir laf edip herkesi güldürecek kişi?",
  "Bir sır verdiğinde o sırrı mezara kadar kimseye söylemeyeceğine yemin edebileceğin kişi?",
  "Bir sır verdiğinde 'kimseye söyleme ama' diyerek 2 saat sonra annesine anlatacak kişi?",
  "Masada kavga veya tartışma çıktığında araya girip bilgece ortamı sakinleştirecek arabulucu?",
  "Masada tartışma çıktığında ateşe körükle gidip kaosu körükleyecek fitneci?",
  "Gruptaki herkesin burcunu, doğum gününü ve kan grubunu ezbere bilen ayaklı arşiv?",
  "Kendi fikrini savunurken dünyayı karşısına alacak kadar inatçı ve geri adım atmaz kişi?",
  "Başkalarının dertlerini kendi derdi gibi dinleyip günlerce o dertle gezen aşırı empatik kişi?",
  "Bir kafede yan masanın dedikodusuna kulak kabartıp dudak okuyarak olayı çözecek casus?",
  "Kendi doğum gününde ilgi odağı olmaktan utanıp yerin dibine geçecek mahcup tip?",
  "Grupta bir organizasyon yapılacağı zaman kimse adım atmayınca mecburen liderliği ele alan kişi?",
  "Grupça çekilen fotoğrafta herkes çok güzel çıkmışken sadece kendisi kötü çıktığı için fotoğrafı sildiren kişi?",
  "Haksızlığa uğradığında garsona, müdüre veya yetkiliye hakkını sonuna kadar savunacak cesur kişi?",
  "Bir hatasını fark ettiğinde gurur yapmadan ilk özür dileyecek olgun kişi?",
  "Gruptaki herkesin dert ortağı ve psikoloğu olan ama kendi dertlerini kimseye anlatmayan kişi?",
  "Biri ona hediye aldığında beğenmese bile karşı taraf üzülmesin diye sevinçten havalara uçma taklidi yapan kişi?",
  "Kafede masada otururken sürekli bacağını sallayan ya da parmaklarıyla masada ritim tutan kişi?",
  "Trafikte biri korna çaldığında camı açıp 'hayırdır hemşerim' diye laf dalaşına girecek kişi?",
  "Milli bayramlarda ya da özel günlerde gruptaki herkese ilk tebrik mesajını atan kişi?",
  "Arkadaşının evine gittiğinde ilk iş olarak buzdolabının kapağını açıp 'ne var ne yok' diye bakan kişi?",
  "Bir film veya dizi önerip karşı taraf beğenmeyince kişisel hakaret sayıp küsen kişi?",
  "Bu masada otururken gizlice herkesin analizini yapıp kafasında not alan sessiz gözlemci?",
  "Grupta herkes yaşlansa bile ruhu hep 18 yaşında kalacak olan sonsuz çocuk?",

  // 226-250: Gelecek, Başarı & Çılgın Kehanetler
  "10 yıl sonra bir sahil kasabasında butik kafe veya zeytinyağı atölyesi açacak kişi?",
  "10 yıl sonra dev bir holdingin tepe yöneticisi olup takım elbiseyle toplantıdan toplantıya koşacak kişi?",
  "Kazara veya bilerek televizyona çıkıp tüm Türkiye'nin konuştuğu bir figür haline gelecek kişi?",
  "Bir gün aniden her şeyi bırakıp Hindistan'a veya Tibet'e gidip inzivaya çekilecek kişi?",
  "Kendi yazdığı kitap veya çektiği video ile milyonlarca insana ilham verecek kişi?",
  "Çok zengin bir ailenin mirasçısıyla evlenip lüks yatlarla dünya turuna çıkacak kişi?",
  "Gelecekte siyasete atılıp belediye başkanı veya milletvekili adayı olacak kişi?",
  "Evinde 5 kedi ve 2 köpekle huzur dolu bir hayvan cenneti kuracak kişi?",
  "Kendi şirketini kurup masadaki arkadaşlarını işe alarak patronluk taslayacak kişi?",
  "Emekli olduğunda mahallenin en huysuz ama en tatlı tonton dedesi/ninesi olacak kişi?",
  "Gelecekte çocuklarına gençlik maceralarını anlatırken 'bizim zamanımızda' diye başlayan efsaneler uyduracak kişi?",
  "Dünyayı değiştirecek çılgın bir teknolojik icat veya girişim fikri bulacak deha?",
  "Yapay zeka robotların dünyayı ele geçireceğine en çok inanan ve hazırlık yapan kişi?",
  "Kendi düğününde çılgınlar gibi dans edip ayakkabısını fırlatacak damat/gelin adayı?",
  "Gelecekte Michelin yıldızlı bir gurme restoranın kapısında rezervasyon sırası bekleyecek kişi?",
  "Hayat hikayesi bir gün dijital platformlarda mini diziye konu olabilecek kadar kaotik olan kişi?",
  "Arkadaş grubunun 20 yıl sonraki mezunlar buluşmasını organize edecek fedakar dost?",
  "Uzaya turist olarak ilk bilet alıp Mars'ta kahve içme hayali kuran kişi?",
  "Miras kalsa hepsini 1 yılda lüks arabalara ve gece hayatına yatırıp sıfırı tüketecek kişi?",
  "Tüm dünya batsa bile sakinliğini koruyup 'vardır bunda da bir hayır' diyecek stoik felsefeci?",
  "Bir gün zengin olduğunda bu masadaki herkesi toplayıp Maldivler'e tatile götürecek cömert ruh?",
  "Bir gün çok ünlü olduğunda 'ben bu arkadaşlarımı hiç tanımıyorum' deyip numarasını değiştirecek şaka makinesi?",
  "Yaşlandığında torunlarına TikTok ve yapay zeka öğretecek en havalı büyükanne/büyükbaba?",
  "Her zaman en doğru zamanda doğru yerde olup hayatın tüm fırsatlarını yakalayacak şanslı kişi?",
  "Ve bu masada oyun bittikten sonra hesabı ödemek için masadaki herkesle tatlı bir kavgaya girişecek kişi?"
];

const questions = muhtemelSorular.map((q, index) => {
  const num = index + 1;
  const id = `muhtemel-${String(num).padStart(3, '0')}`;
  
  let tags = ['Muhtemel', 'Grup'];
  let difficulty = 'easy';
  if (num <= 25) {
    tags = ['Sosyal Medya', 'Telefon'];
    difficulty = 'easy';
  } else if (num <= 50) {
    tags = ['Para', 'Alışveriş'];
    difficulty = 'easy';
  } else if (num <= 75) {
    tags = ['Tembellik', 'Uyku'];
    difficulty = 'easy';
  } else if (num <= 100) {
    tags = ['İlişkiler', 'Flört'];
    difficulty = 'medium';
  } else if (num <= 125) {
    tags = ['Sakarlık', 'Kaos'];
    difficulty = 'easy';
  } else if (num <= 150) {
    tags = ['Kafe', 'Yemek'];
    difficulty = 'easy';
  } else if (num <= 175) {
    tags = ['Popüler Kültür', 'Mizah'];
    difficulty = 'easy';
  } else if (num <= 200) {
    tags = ['Macera', 'Seyahat'];
    difficulty = 'medium';
  } else if (num <= 225) {
    tags = ['Dostluk', 'Karakter'];
    difficulty = 'medium';
  } else {
    tags = ['Gelecek', 'Kehanet'];
    difficulty = 'easy';
  }

  return {
    id,
    category_id: 'cat-muhtemel',
    game_type: 'kim-daha-muhtemel',
    question_text: q,
    tags,
    difficulty,
    is_active: true,
    sort_order: num
  };
});

const content = `import type { Question } from '../../types';\n\nexport const MUHTEMEL_QUESTIONS: Question[] = ${JSON.stringify(questions, null, 2)};\n`;

const targetPath = path.join(__dirname, '..', 'src', 'data', 'questions', 'muhtemel.ts');
fs.writeFileSync(targetPath, content, 'utf8');
console.log(`Successfully generated ${questions.length} Muhtemel questions at ${targetPath}`);
