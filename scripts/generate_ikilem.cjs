const fs = require('fs');
const path = require('path');

// 250 Özgün, Mizahi ve Düşündürücü İkilem Sorusu
const ikilemler = [
  // 1-25: Yeme - İçme & Kafe Kültürü İkilemleri
  {
    q: "Pazar sabahı kahvaltı krizinde hangisi masanın efendisidir?",
    a: "2 saat süren, 40 çeşit serpme köy kahvaltısı",
    b: "Vapurda ya da sokakta taze simit, kaşar ve sıcak çay"
  },
  {
    q: "Milli mutfak krizimiz: Menemen nasıl yapılır?",
    a: "Soğanlı (Gerçek gurmeler soğansız menemen yemez)",
    b: "Soğansız (Kahvaltıda soğan mı olur, yumurtanın tadını bozar)"
  },
  {
    q: "Kafede tatlı-kahve sıralaması nasıl olmalı?",
    a: "Önce tatlıdan bir çatal, hemen ardından sıcak kahveden bir yudum",
    b: "Önce tatlıyı tamamen bitirip damak temizliği için kahveye geçmek"
  },
  {
    q: "Sıcak yaz gününde kafe tercihin hangisi?",
    a: "Buz dolu ferahlatıcı bir Iced Americano / Cold Brew",
    b: "Güneşin altında bile ince belli bardakta taze demli çay"
  },
  {
    q: "Lahmacun yerken tarafını seç:",
    a: "Bol limon sıkıp maydanozla sarıp çıtır çıtır yemek",
    b: "Limon sıkmadan, etin saf lezzetini sumaklı soğanla taçlandırmak"
  },
  {
    q: "Gece saat 01:00'de acıktığında masaya hangisi gelsin?",
    a: "Bol sarımsaklı ve sirkeli sıcak işkembe/kelle paça",
    b: "Bol soslu zurna tavuk döner veya sokak kokoreci"
  },
  {
    q: "Tatlı krizinde son dilim:",
    a: "Fıstığı taşan sıcak çıtır Gaziantep baklavası",
    b: "İçi akışkan, sıcacık Belçika çikolatalı sufle"
  },
  {
    q: "Kahve yanında ikram:",
    a: "Geleneksel gül aromalı veya fıstıklı çifte kavrulmuş lokum",
    b: "Acı bademli veya fındıklı çıtır İtalyan biscotti"
  },
  {
    q: "Dışarıda yemek yerken hangisi daha büyük kabus?",
    a: "Yemeğin çok geç ve buz gibi soğuk gelmesi",
    b: "Porsiyonun kuş kadar gelip masadan aç kalkmak"
  },
  {
    q: "Pizzada ananas olur mu?",
    a: "Asla! İtalyan mutfağına ve hamura yapılmış bir hakarettir",
    b: "Tatlı-tuzlu dengesi harikadır, gayet güzel gider"
  },
  {
    q: "Patates kızartması sosu:",
    a: "Klasik mayonez + ketçap ikilisi",
    b: "Trüflü mayonez veya ballı hardal gibi gurme soslar"
  },
  {
    q: "Çay içerken şekerin yeri:",
    a: "Kıtlama ya da şekersiz (Çayın gerçek tadını almak için)",
    b: "En az 2 şekerli (Çay dediğin şerbet gibi tatlı olmalı)"
  },
  {
    q: "Kışın ortasında -5 derecede içecek tercihin:",
    a: "Bol tarçınlı, sıcacık koyu kıvamlı bir salep",
    b: "İçerisi sıcak nasılsa deyip inatla buzlu frappuccino"
  },
  {
    q: "Döner yerken içecek tercihin:",
    a: "Köpüklü yayık ayranı",
    b: "Buz gibi kola veya şalgam"
  },
  {
    q: "Makarna sosunda nihai karar:",
    a: "Yoğurtlu, sarımsaklı ve tereyağlı salçalı sos",
    b: "Kremalı, mantarlı ve fesleğenli parmesanlı sos"
  },
  {
    q: "Günün ilk kahvesi:",
    a: "Köpüklü geleneksel Türk kahvesi",
    b: "Gözleri anında açan sert bir espresso veya filtre kahve"
  },
  {
    q: "Karpuz yerken yanında ne olsun?",
    a: "Tuzlu beyaz peynir (Klasik Türk yaz ikilisi)",
    b: "Tek başına, buz gibi soğutulmuş olarak"
  },
  {
    q: "Sokak lezzetleri düellosu:",
    a: "Tencere tencere yenen sıcak Midye Dolma",
    b: "Sosuna banılan ıslak hamburger"
  },
  {
    q: "Tost ekmeğinde nihai tartışma:",
    a: "Sanayi tipi basılmış, yağlı çıtır somun ekmek tostu",
    b: "Kare tost ekmeğinde bol kaşarlı ev tipi tost"
  },
  {
    q: "Kafede hesap ödeme anı:",
    a: "Alman usulü: Herkes tam olarak ne içtiyse onu ödesin",
    b: "Masa kavgası: 'Olmaz ben ödeyeceğim' diye pos cihazını kapmak"
  },
  {
    q: "Mantıda boyut ve pişirme tercihi:",
    a: "Bir kaşığa 40 tane sığan minicik Kayseri mantısı",
    b: "İçi bol etli, cevizli ve tereyağlı büyük Sinop mantısı"
  },
  {
    q: "Kafede hangi masaya oturursun?",
    a: "Dışarıyı ve geçenleri izleyebileceğin cadde/cam kenarı masa",
    b: "Priz kenarı, kimsenin seni görmeyeceği kuytu köşe koltuk"
  },
  {
    q: "Su içerken sıcaklık tercihin:",
    a: "Buzdolabından yeni çıkmış, buz gibi boğaz yakan su",
    b: "Oda sıcaklığında ılık su"
  },
  {
    q: "Tatlı yerken porsiyon felsefesi:",
    a: "Herkes kendi tatlısını sipariş etsin, kimse tabağıma çatal atmasın",
    b: "Ortaya 2 tatlı söyleyelim, herkes ucundan tatsın"
  },
  {
    q: "Kahve dükkanında yeni tatlar denemek mi?",
    a: "Her zaman bildiğim, asla hayal kırıklığına uğratmayan favorim",
    b: "Menüde adını ilk kez gördüğüm en ilginç egzotik karışım"
  },

  // 26-50: Sosyal Medya, Teknoloji & Telefon Alışkanlıkları
  {
    q: "WhatsApp gizlilik ayarlarında tarafın:",
    a: "Mavi tik ve son görülme tamamen kapalı (Gizemli ve ulaşılamaz)",
    b: "Her şey açık (Kimseden saklayacak bir şeyim yok, açık oynarım)"
  },
  {
    q: "Hangisi başına gelse daha büyük panik yaşarsın?",
    a: "Telefonunun tüm fotoğraf galerisinin kalıcı olarak silinmesi",
    b: "Son 5 yıllık tüm WhatsApp sohbet geçmişinin herkese açılması"
  },
  {
    q: "Sosyal medyada flört taktiğin:",
    a: "Hikayesine doğrudan espriyle ya da soruyla DM yanıtı atmak",
    b: "Hikayelerine sessizce alev ya da alkış emojisi bırakıp beklemek"
  },
  {
    q: "Ömrünün sonuna kadar sadece birini kullanabileceksin:",
    a: "Sonsuz interneti olan ama sadece mesajlaşabilen tuşlu Nokia 3310",
    b: "Son model iPhone 16 Pro Max ama internet paketi asla yok"
  },
  {
    q: "Telefon bildirimleri konusunda tarzın:",
    a: "Gelen her bildirimi anında okuyup silen 0 okunmamış mesaj takıntılısı",
    b: "9.999+ okunmamış mail ve 150 okunmamış WhatsApp mesajıyla yaşayan rahat tip"
  },
  {
    q: "Instagram kullanım tarzın:",
    a: "Haftada 3 post, her gün hikaye atan aktif içerik üreticisi",
    b: "Sıfır gönderi, profil resmi bile olmayan gizli stalker hesabı"
  },
  {
    q: "Bir tartışmada haklı olduğunu kanıtlamak için:",
    a: "Geçmiş konuşmaların ekran görüntüsünü (screenshot) çat diye masaya koymak",
    b: "Sözlü argümanlarla karşındakini ikna etmeye çalışmak"
  },
  {
    q: "Film/Dizi izleme tarzın:",
    a: "Orijinal dilde ve Türkçe altyazılı",
    b: "Arkada iş yaparken de dinlenebilsin diye Türkçe dublajlı"
  },
  {
    q: "Kulaklık pilin bittiğinde toplu taşımada ne yaparsın?",
    a: "Mecburen insanların konuşmalarını ve motor sesini dinleyerek acı çekmek",
    b: "İneceğim durağa kadar gözlerimi kapatıp uyuyor taklidi yapmak"
  },
  {
    q: "Gelen bir aramayı açmak mı mesaj atmak mı?",
    a: "Hemen açıp 30 saniyede konuşup kapatmak",
    b: "Aramayı meşgule atıp 'müsait değilim, noldu yazsana' demek"
  },
  {
    q: "Sosyal medya algoritman hangisiyle dolu olsun?",
    a: "Kedi, köpek ve bebeklerin komik sakarlık videoları",
    b: "Kaotik sokak röportajları ve Twitter kavgaları"
  },
  {
    q: "Ekran süren günde ortalama ne kadar?",
    a: "3 saatin altı (Dijital detoks ustası, gerçek dünyada yaşayan)",
    b: "8 saat ve üzeri (Telefon elimde doğmuşum, ekranla bütünleştim)"
  },
  {
    q: "Spotify'da müzik dinlerken:",
    a: "Kendi özenle hazırladığım, şarkı sırası milimetrik olan çalma listem",
    b: "Algoritmanın ve rastgele karışık çalmanın (Shuffle) getirdiği sürprizler"
  },
  {
    q: "Online alışveriş sepeti felsefen:",
    a: "Sepete 25 parça eşya ekleyip günlerce bekletip hiçbirini almamak",
    b: "Gördüğüm an 'bana bu lazım' deyip 3 saniyede siparişi onaylamak"
  },
  {
    q: "Bir yere giderken navigasyon:",
    a: "Yolu ezbere bilsem bile trafiğe bakmak için navigasyonu açmak",
    b: "Tabelalara bakıp içgüdülerimle kaybolmayı göze alarak sürmek"
  },
  {
    q: "Yapay zeka (AI) dünyasında geleceğin:",
    a: "Her işimi yapay zekaya yaptırıp günde 2 saat çalışarak keyif çatmak",
    b: "Yapay zekanın fişini çekip dağ başında organik tarıma başlamak"
  },
  {
    q: "Instagram Hikayelerinde hangisi daha itici?",
    a: "Direksiyon logosu ve kahve bardağını kadraja sığdırma çabası",
    b: "Şarkı sözüyle göndermeli, kime yazıldığı belirsiz atarlı paylaşımlar"
  },
  {
    q: "Şarjın %3 kaldığında ne yaparsın?",
    a: "Panikle düşük güç moduna alıp ekran parlaklığını sıfıra indirmek",
    b: "'Kaderimde varsa kapanır' deyip son nefesine kadar video izlemek"
  },
  {
    q: "Sesli mesaj (Audio message) kültürü:",
    a: "3 dakikalık podcast gibi ses kaydı atmak ve dinlemek",
    b: "Sesli mesaj atanlara içten içe kızıp sadece yazılı iletişim istemek"
  },
  {
    q: "Fotoğraf çekilirken tavrın:",
    a: "Tek kare çekilip 'tamamdır oldu bu' demek",
    b: "Aynı açıdan 64 tane fotoğraf çektirip aralarındaki 1 milimetrelik farkı aramak"
  },
  {
    q: "İnternet hızın mı bilgisayarın kalitesi mi?",
    a: "Eski bir bilgisayar ama 1000 Mbps fiber ışık hızında internet",
    b: "Dünyanın en canavar bilgisayarı ama 8 Mbps kasan internet"
  },
  {
    q: "Grup sohbetlerinde rolün:",
    a: "Her şeye gülen, sticker ve caps yağdıran eğlenceli tip",
    b: "Grubu sessize alıp ayda bir 'noluyo burda' diye yazan hayalet üye"
  },
  {
    q: "Telefon zil sesin:",
    a: "Yıllardır telefonun varsayılan fabrikasyon melodisi",
    b: "Özel seçilmiş nostaljik veya komik bir dizi/film müziği"
  },
  {
    q: "Klavye alışkanlığın:",
    a: "Noktalama işaretlerine ve büyük harflere takıntılı kusursuz yazım",
    b: "hızlı yazcam die harflerikaristiran ve noktasızyazan rahatlik"
  },
  {
    q: "Youtube'da video izleme hızın:",
    a: "Normal hız (1.0x) - Konuşanın tonlamasını kaçırmamak için",
    b: "1.5x veya 2.0x hız - Hayat çok kısa, vakit kaybetmeye gerek yok"
  },

  // 51-75: Kariyer, Para & Hayat Tarzı
  {
    q: "İş hayatında hangisini seçerdin?",
    a: "Aylık 150.000 TL maaş ama günde 14 saat yoğun stres ve hafta sonu mesaisi",
    b: "Aylık 50.000 TL maaş ama günde sadece 4 saat çalışma ve sınırsız kafa rahatlığı"
  },
  {
    q: "Çalışma modeli tercihin:",
    a: "Evden (Remote) pijamalarla, kahven elinde yatakta çalışmak",
    b: "Şık bir ofiste, iş arkadaşlarıyla sosyalleşerek ve dedikodu yaparak çalışmak"
  },
  {
    q: "Eline aniden 10 milyon TL geçse ilk hamlen:",
    a: "Hepsini gayrimenkule ve garantili faize yatırıp erken emekli olmak",
    b: "Dünya turuna çıkıp lüks otellerde çılgınlar gibi harcamak"
  },
  {
    q: "Kariyerinde hangi unvan seni daha çok cezbeder?",
    a: "Kendi küçük ama huzurlu butik işletmesinin patronu olmak",
    b: "Dev bir küresel şirketin en üst düzey yöneticisi (CEO) olmak"
  },
  {
    q: "Pazartesi sendromuyla başa çıkma yöntemin:",
    a: "Erkenden uyanıp filtre kahveyle haftalık plan yapmak",
    b: "Pazar gecesinden itibaren hayata küsüp yataktan çıkmamak"
  },
  {
    q: "Gelecekte yaşamak istediğin yer:",
    a: "Ege'de bir sahil kasabasında zeytin ağaçları içinde taş ev",
    b: "İstanbul, New York veya Tokyo gibi hiç uyumayan metropolde gökdelen dairesi"
  },
  {
    q: "Tatilde tatil anlayışın:",
    a: "Her şey dahil otelde şezlongdan kalkmadan güneşlenip uyumak",
    b: "Sırt çantasını alıp günde 25.000 adım atarak müzeleri ve sokakları gezmek"
  },
  {
    q: "Alışveriş yaparken önceliğin:",
    a: "Kaliteli olsun, 1 tane olsun, 10 yıl giyeyim (Pahalı ama dayanıklı)",
    b: "Ucuz olsun, her sezon dolabı yenileyip farklı şeyler giyeyim (Fast fashion)"
  },
  {
    q: "Toplantıların kaderi:",
    a: "'Bu konu aslında bir mail ile çözülebilirdi' deyip içten içe sıkılmak",
    b: "Yüz yüze konuşmadan kimseyle anlaşamam deyip toplantı talep etmek"
  },
  {
    q: "Ev kiralarken/alırken en önemli kriter:",
    a: "İşine ve kafelere yürüme mesafesinde merkezi ama küçük bir ev",
    b: "Şehir merkezine 1 saat uzaklıkta ama bahçeli, geniş ve ferah bir ev"
  },
  {
    q: "Zengin olsan ilk alacağın lüks:",
    a: "Özel şoförlü son model konforlu bir araç",
    b: "Evdeki tüm yemek ve temizliği yapacak özel şef ve yardımcı"
  },
  {
    q: "Bir işte en önemli motivasyonun:",
    a: "Takdir edilmek ve saygı duyulan bir uzman olmak",
    b: "Her ayın 1'inde hesabına yatan dolgun para miktarı"
  },
  {
    q: "Maaş günündeki ilk duygun:",
    a: "'Bu ay kesin birikim yapıyorum, harcamayacağım' kararlılığı",
    b: "'Para dediğin harcanmak için vardır' deyip ilk günden kendini ödüllendirmek"
  },
  {
    q: "Uçak yolculuğunda koltuk tercihin:",
    a: "Manzarayı izleyip kafanı cama dayayabileceğin cam kenarı",
    b: "İstediğin zaman rahatça ayağa kalkabileceğin koridor kenarı"
  },
  {
    q: "Kredi kartı borcu kapatma stratejin:",
    a: "Her ay asgarisini ödeyip 'öbür ay toplu kapatırım' yalanına inanmak",
    b: "Ekstre gelir gelmez tamamını kuruşu kuruşuna kapatmak"
  },
  {
    q: "Günün hangi saatinde daha verimlisin?",
    a: "Sabah 06:00 - 11:00 arası herkes uyurken",
    b: "Gece 23:00 - 04:00 arası sessizlik çöktüğünde"
  },
  {
    q: "Bir işte başarısız olduğunda ilk tepkin:",
    a: "'Nerede hata yaptım?' diye analiz edip hemen düzeltmeye çalışmak",
    b: "'Vardır bunda da bir hayır' deyip suçu sisteme ya da kadere atmak"
  },
  {
    q: "İş arkadaşlarıyla ilişkiler:",
    a: "İş yerinde kalır, mesai bittiği an kimseyle görüşmem",
    b: "En yakın dostlarımı iş yerinden seçer, hafta sonu da beraber takılırım"
  },
  {
    q: "Toplu taşıma mı şahsi araba mı?",
    a: "Trafik çilesi çekmemek için metro/marmaray",
    b: "2 saat trafikte kalsam bile kendi arabamda müzik dinlemenin konforu"
  },
  {
    q: "Piyango çıksa işi bırakır mısın?",
    a: "Ertesi sabah istifamı verir, bir daha alarm kurmam",
    b: "Sırf oyalanmak ve canım sıkılmasın diye hobi gibi çalışmaya devam ederim"
  },
  {
    q: "Emeklilik hayalin:",
    a: "Küçük bir sahil kasabasında balık tutup domates yetiştirmek",
    b: "Dünyanın büyük şehirlerini gezip lüks restoranlarda akşam yemekleri yemek"
  },
  {
    q: "Bütçe yapma tarzın:",
    a: "Excel tablosunda kuruşu kuruşuna gelir-gider tutmak",
    b: "Hesapta para bittiğinde harcamayı kesmek"
  },
  {
    q: "Zaman yönetimi tarzın:",
    a: "Her işi son teslim tarihinden 3 gün önce bitirip rahatlamak",
    b: "Son gece sabahlayarak gelen adrenalin patlamasıyla işi teslim etmek"
  },
  {
    q: "Hediye seçme yeteneğin:",
    a: "Aylarca gözlemleyip karşı tarafın tam ihtiyacı olan şeyi bulmak",
    b: "Son gün panikle gidip kupa bardak ya da hediye kartı almak"
  },
  {
    q: "Hayat felsefen hangisine daha yakın?",
    a: "'Carpe Diem' - Anı yaşa, yarının ne getireceği belli değil",
    b: "'Geleceğini inşa et' - Bugün fedakarlık yap, yarın rahat et"
  },

  // 76-100: İlişkiler, Flört & Aşk Meşk İşleri
  {
    q: "İlk buluşmada (First Date) hesap ödeme ritüeli:",
    a: "Centilmenlik/incelik olarak davet eden tarafın tamamını ödemesi",
    b: "Modern dünyadayız, ilk günden yarı yarıya kırışmak"
  },
  {
    q: "İlişkide hangisi daha büyük kırmızı çizgi (Red Flag)?",
    a: "Garsona ya da hizmet personeline kaba ve üstten davranması",
    b: "Sürekli eski sevgilisinden ve onun hatalarından bahsetmesi"
  },
  {
    q: "Aşkta hangisi daha vazgeçilmezdir?",
    a: "Birlikte kahkahalarla gülebilmek ve aynı mizah anlayışına sahip olmak",
    b: "Her konuda güven duymak ve yanında tamamen huzurlu hissetmek"
  },
  {
    q: "Birlikte tatile çıkarken tercih:",
    a: "Her dakikası önceden planlanmış, rezervasyonlu konforlu seyahat",
    b: "Spontane, plansız, yolda nereye denk gelirse orada kalmalı macera"
  },
  {
    q: "Sevgilinin telefon şifresini bilmek:",
    a: "İlişkide şeffaflık esastır, birbirimizin şifresini bilmeliyiz",
    b: "Kişisel alan kutsaldır, şifre sormak da bilmek de gereksizdir"
  },
  {
    q: "İlk buluşma mekanı tercihi:",
    a: "Sakin, müziğin kısık olduğu, göz teması kurulabilecek butik bir kafe",
    b: "Şık, havalı ve lezzetli yemekleri olan bir akşam yemeği restoranı"
  },
  {
    q: "Hangisiyle bir ömür geçirmek daha zordur?",
    a: "Aşırı kıskanç ve her hareketini sorgulayan biriyle",
    b: "Aşırı umursamaz ve hiçbir şeyi dert etmeyen biriyle"
  },
  {
    q: "Ayrılık sonrası davranışın:",
    a: "Numarasını silip sosyal medyadan engelleyerek tam bir kopuş yaşamak",
    b: "Takipten çıkmadan gizlice ne yaptığını merak edip stalklamak"
  },
  {
    q: "İlişkide sürprizler:",
    a: "Özel günler dışında da çat kapı gelen beklenmedik sürprizler",
    b: "Bana sormadan sürpriz yapmasın, ne istediğimi ben söylerim garantisi"
  },
  {
    q: "Sevgilinle aynı müzik ve film zevkine sahip olmak:",
    a: "Çok önemli, zevklerimiz uyuşmazsa birlikte vakit geçiremeyiz",
    b: "Önemsiz, zıt kutuplar birbirini çeker, farklı şeyler keşfederiz"
  },
  {
    q: "Kavga ettikten sonra barışma tarzın:",
    a: "Hemen o an konuşup çözmeden asla uyuyamayan taraf",
    b: "'Biraz yalnız kalıp sakinleşeyim, yarın konuşuruz' diyen taraf"
  },
  {
    q: "Evlilik teklifi nerede ve nasıl olmalı?",
    a: "Sadece ikimizin olduğu çok samimi, sade ve baş başa bir an",
    b: "Bütün arkadaşların toplandığı, alkışlar ve müzik eşliğinde gösterişli bir an"
  },
  {
    q: "Sevgilinin arkadaşlarını sevmezsen:",
    a: "Açıkça söylerim ve onların olduğu ortamlara asla katılmam",
    b: "Onun hatrına dişimi sıkar, ortamlarda gülümserim"
  },
  {
    q: "Büyük bir aşk acısı çekerken:",
    a: "Arabesk ve hüzünlü şarkılarla dibe kadar batıp acıyı sonuna kadar yaşamak",
    b: "Hemen spora başlayıp, sosyalleşip kendini oyalamaya çalışmak"
  },
  {
    q: "Sevgilinden hediye beklerken:",
    a: "El emeği, manevi değeri yüksek duygusal bir mektup ya da albüm",
    b: "Gerçekten ihtiyacım olan pahalı ve kullanışlı teknolojik bir alet"
  },
  {
    q: "Ortak sosyal medya hesabı kullanan çiftler:",
    a: "Aşırı sempatik, tam bir birliktelik göstergesi",
    b: "Korkunç derecede ürkütücü ve güvensizlik belirtisi"
  },
  {
    q: "Buluşmaya geç kalma toleransın:",
    a: "Maksimum 10 dakika, sonrasında aşırı sinirlenirim",
    b: "Yarım saat beklerim, zaten ben de genelde geç kalırım"
  },
  {
    q: "Sevgilinin ailesiyle tanışma zamanı:",
    a: "İlişkinin ilk aylarında hemen tanışıp kaynaşmak",
    b: "İş ciddiye binip evlilik kararı alınana kadar mümkünse ertelemek"
  },
  {
    q: "Görücü usulü mü yoksa modern flört aplikasyonları mı?",
    a: "Görücü usulü / Tanıdık referansı (Kimin ne olduğu bellidir)",
    b: "Tinder/Bumble vb. (Kendi seçimimle dünyadan birini bulmak)"
  },
  {
    q: "İlişkide 'Seni Seviyorum' diyen ilk kişi olmak:",
    a: "İçimden geldiği an hiç gurur yapmadan söylerim",
    b: "Önce karşı tarafın söylemesini beklerim, riske girmem"
  },
  {
    q: "Eski sevgiliden arkadaş olur mu?",
    a: "Medeni insanlarız, saygı çerçevesinde pekala arkadaş kalınabilir",
    b: "Asla! Biten bitmiştir, eski sevgiliden sadece yabancı olur"
  },
  {
    q: "Aşkın ömrü sence ne kadardır?",
    a: "3 yıl sürer, sonra yerini sevgi ve alışkanlığa bırakır",
    b: "Doğru insanla bir ömür boyu ilk günkü gibi tutkulu kalabilir"
  },
  {
    q: "Sevgilinin en garip huyuna tepkin:",
    a: "Bunu tatlı bulup ona daha çok bağlanmak",
    b: "Zamanla bu huyu değiştirmeye ve törpülemeye çalışmak"
  },
  {
    q: "Romantik bir akşam:",
    a: "Evde mum ışığında beraber yemek yapıp film izlemek",
    b: "Dışarıda şık bir restoranda giyinip süslenip yemek yemek"
  },
  {
    q: "Bir ilişkide en çok korktuğun şey:",
    a: "Monotonlaşmak ve heyecanın tamamen bitmesi",
    b: "Bir gün yalan söylendiğini veya aldatıldığını öğrenmek"
  },

  // 101-125: Popüler Kültür, Dizi & Sinema İkilemleri
  {
    q: "Gibi dizisinde bir gün geçirmek zorunda kalsan kimi seçerdin?",
    a: "Her olaya felsefi ve absürt bir komplo teorisi üreten İlkkan",
    b: "Tahammülsüzlüğüyle cinnetin eşiğinde yaşayan Yılmaz"
  },
  {
    q: "Aşk-ı Memnu finalinde kimi daha haklı buluyorsun?",
    a: "Aşkı için her şeyi göze alıp uçuruma sürüklenen Bihter",
    b: "Olayların yükünü taşıyamayıp korkakça kaçan Behlül"
  },
  {
    q: "Kurtlar Vadisi evreninde hangisi daha efsanevi bir figürdür?",
    a: "Süleyman Çakır (İstanbul'un sefiri)",
    b: "Polat Alemdar (Devletin gizli kılıcı)"
  },
  {
    q: "Avrupa Yakası komedi efsanesi:",
    a: "Burhan Altıntop ('Ben aslında Nişantaşı çocuğuyum')",
    b: "Gaffur ('Beni beğenmiyor musun?')"
  },
  {
    q: "Süper kahraman evreninde tarafın:",
    a: "Marvel Evreni (Mizah, renkli karakterler ve Avengers)",
    b: "DC Evreni (Karanlık atmosfer, Batman ve Joker derinliği)"
  },
  {
    q: "Harry Potter dünyasında hangi binaya seçilmek isterdin?",
    a: "Gryffindor (Cesaret ve kahramanlık)",
    b: "Slytherin (Hırs, kurnazlık ve liderlik)"
  },
  {
    q: "Yüzüklerin Efendisi serisinde yolculuk tercihin:",
    a: "Gollum ile gizli ve tehlikeli Mordor patikaları",
    b: "Gimli ve Legolas ile cenk meydanlarında omuz omuza"
  },
  {
    q: "Bir sitcom dizisini hafızandan silip baştan izleme hakkın olsa:",
    a: "Friends (Samimiyet ve New York nostaljisi)",
    b: "The Office (Cringe mizah ve Michael Scott dehası)"
  },
  {
    q: "Breaking Bad mi Better Call Saul mu?",
    a: "Breaking Bad (Walter White'ın karanlık dönüşümü ve saf gerilim)",
    b: "Better Call Saul (Karakter derinliği ve sinematografik şaheser)"
  },
  {
    q: "Sinemada film izlerken oturulacak sıra:",
    a: "Tam ortanın ortası (Mükemmel ses ve görüntü açısı)",
    b: "En arka köşe (Kimse arkamda olmasın rahatlığı)"
  },
  {
    q: "Christopher Nolan filmleri mi Quentin Tarantino filmleri mi?",
    a: "Nolan (Zaman bükülmesi, akıl oyunları ve epik müzikler)",
    b: "Tarantino (Unutulmaz diyaloglar, bol kan ve ikonik sahneler)"
  },
  {
    q: "Yeşilçam nostaljisinde en sevdiğin karakter:",
    a: "Kemal Sunal (Şaban / Kibar Feyzo samimiyeti)",
    b: "Şener Şen (Badi Ekrem / Züğürt Ağa ustalığı)"
  },
  {
    q: "Dizi izlerken bölüm sıklığı:",
    a: "Bütün sezonu tek gecede sabahlayarak bitirmek (Binge-watch)",
    b: "Haftada 1 bölüm izleyip sindire sindire tadını çıkarmak"
  },
  {
    q: "Korku filmi izlerken tepkin:",
    a: "Işıkları kapatıp gerilimin içine giren cesur izleyici",
    b: "Korkunç sahnelerde yastığın arkasına saklanan temkinli izleyici"
  },
  {
    q: "Animasyon dünyasının kralı kimdir?",
    a: "Pixar (Duygusal derinlik, Toy Story, Coco, Up)",
    b: "Studio Ghibli / Hayao Miyazaki (Büyülü doğa, Ruhların Kaçışı)"
  },
  {
    q: "Cem Yılmaz gösterilerinden birini seç:",
    a: "CMYLMZ (Klasik efsane, uzaylılar ve taksiciler)",
    b: "Fundamentals (Modern hayat, tatil köyleri ve asansör halleri)"
  },
  {
    q: "Game of Thrones finali hakkında düşüncen:",
    a: "O kadar kötüydü ki ilk 7 sezonun da hatırını sildi",
    b: "Kusurları vardı ama yine de dizi tarihinin en büyük olayıydı"
  },
  {
    q: "Bilimkurgu sinemasında favorin:",
    a: "Interstellar (Kara delik, sevgi ve zamanda yolculuk)",
    b: "Matrix (Simülasyon teorisi ve kırmızı hap)"
  },
  {
    q: "Netflix mi sinema salonu mu?",
    a: "Evde koltuğunda battaniye altında Netflix izlemek",
    b: "Patlamış mısır kokusuyla dev perdede film izlemek"
  },
  {
    q: "Türk televizyon tarihinin en ikonik kötüsü kimdir?",
    a: "Aşk-ı Memnu Firdevs Yöreoğlu ('Sen Bihter Ziyagil'sin aptallık etme!')",
    b: "Yaprak Dökümü Ferhunde (Ortalığı birbirine katan deha)"
  },
  {
    q: "Müzik dinlerken sözler mi melodi mi?",
    a: "Şiir gibi yazılmış derin ve anlamlı şarkı sözleri",
    b: "Sözler saçma olsa bile insanı dans ettiren güçlü ritim ve melodi"
  },
  {
    q: "Konser deneyimi:",
    a: "En önde sahne dibinde ter içinde bağırarak şarkı söylemek",
    b: "Arkada tribünde sakin sakin biranı yudumlayarak izlemek"
  },
  {
    q: "Reality Show mu Belgesel mi?",
    a: "Survivor veya Kısmetse Olur gibi saf dram ve kaos dolu yarışmalar",
    b: "BBC Gezegenimiz tarzı David Attenborough seslendirmeli doğa belgeselleri"
  },
  {
    q: "Kitap uyarlaması filmlerde:",
    a: "Kitabı her zaman filminden katbekat daha iyidir diyenler",
    b: "Kitabı okumaya üşenip direkt 2 saatlik filmini izleyenler"
  },
  {
    q: "Eurovision şarkı yarışması:",
    a: "Manga veya Sertab Erener dönemindeki gibi milli gururla izlenen efsane",
    b: "Siyasetin ve şovun döndüğü gereksiz bir pop festivali"
  },

  // 126-150: Absürt & Süper Güç İkilemleri
  {
    q: "Hangi süper güce sahip olmak isterdin?",
    a: "Zihin okuyabilmek (Ama insanların senin hakkındaki kötü düşüncelerini de duyacaksın)",
    b: "Görünmez olabilmek (Ama sadece kimse sana bakmıyorken çalışacak)"
  },
  {
    q: "Geleceğe mi geçmişe mi seyahat?",
    a: "100 yıl geçmişe gidip tarihi olaylara bizzat tanıklık etmek",
    b: "100 yıl geleceğe gidip insanlığın nereye vardığını görmek"
  },
  {
    q: "Hayatının geri kalanında sadece birini yapabileceksin:",
    a: "Her konuştuğunda şarkı söyler gibi opera tonunda konuşmak",
    b: "Her yürüdüğünde arkandan Mehter Marşı çalması"
  },
  {
    q: "Hangisiyle 1 ay boyunca aynı odada kilitli kalmak daha zordur?",
    a: "Asla susmayan ve sürekli sana komplo teorileri anlatan biriyle",
    b: "Ağzını bıçak açmayan ve gözünü kırpmadan sana bakan biriyle"
  },
  {
    q: "Hangisini bilmek isterdin?",
    a: "Tam olarak hangi gün ve saatte öleceğini bilmek",
    b: "Nasıl öleceğini bilmek ama ne zaman olduğunu asla öğrenememek"
  },
  {
    q: "Bir sabah uyandığında:",
    a: "Hayvanların dilini anlayıp onlarla sohbet edebilmek",
    b: "Dünyadaki tüm yabancı dilleri ana dilin gibi akıcı konuşabilmek"
  },
  {
    q: "Absürt vücut kusuru:",
    a: "Her yalan söylediğinde burnunun Pinokyo gibi 5 cm uzaması",
    b: "Her heyecanlandığında sesinin helyum gazı çekmiş gibi incelmesi"
  },
  {
    q: "Sonsuz para mı sonsuz sağlık mı?",
    a: "Sınırsız servet (En iyi doktorları tutarım rahatlığı)",
    b: "Asla hastalanmayan, yorulmayan ve yaşlanmayan çelik gibi bir beden"
  },
  {
    q: "Issız bir adaya düşsen yanına alacağın ikili:",
    a: "Güneş enerjili sınırsız internetli tablet ve kulaklık",
    b: "Sınırsız konserve yiyecek ve temiz su kaynağı"
  },
  {
    q: "Hangisini seçerdin?",
    a: "Geçmişindeki tek bir büyük hatayı tamamen silip hayatı baştan yazmak",
    b: "Gelecekteki piyango sonuçlarını bilip bugün zengin olmak"
  },
  {
    q: "Uyku düzeni süper gücü:",
    a: "Günde sadece 2 saat uyuyup 24 saat zımba gibi enerjik olmak",
    b: "Yastığa başını koyduğun an 3 saniyede deliksiz uykuya dalabilmek"
  },
  {
    q: "Görünüş mü zeka mı?",
    a: "Dünyanın en çekici insanı olmak ama ortalama bir zekaya sahip olmak",
    b: "Dünyanın en zeki dâhisi olmak ama ortalama bir dış görünüşe sahip olmak"
  },
  {
    q: "Zamanı durdurma yeteneği:",
    a: "Zamanı günde 1 saatliğine durdurabilmek",
    b: "İstediğin herhangi bir yere ışınlanabilmek (Teleportasyon)"
  },
  {
    q: "Rüyalar alemi:",
    a: "Her gece rüyalarını bilinçli olarak yönetebilmek (Lucid Dream)",
    b: "Asla kabus görmemek ve her sabah tamamen dinlenmiş uyanmak"
  },
  {
    q: "Hafıza tercihi:",
    a: "Gördüğün ve duyduğun her şeyi asla unutmayan fotografik hafıza",
    b: "Canını sıkan veya seni üzen tüm kötü anıları zihninden silebilme gücü"
  },
  {
    q: "Sadece tek bir mevsim yaşanacak olsa:",
    a: "Sonsuz bir yaz (Deniz, güneş, şort ve akşam serinliği)",
    b: "Sonsuz bir sonbahar/kış (Yağmur, battaniye, kahve ve mont şıklığı)"
  },
  {
    q: "Yemek yemek mi uyumak mı?",
    a: "Asla yemek yemeye ihtiyaç duymamak ama her zaman tok hissetmek",
    b: "Asla uyumaya ihtiyaç duymamak ve günün 24 saatini yaşamak"
  },
  {
    q: "Evcil hayvan tercihi:",
    a: "Başına buyruk, asil ve gururlu bir kedi",
    b: "Seni görünce kuyruğunu sallayıp sevinçten havalara uçan bir köpek"
  },
  {
    q: "Uçabilmek mi su altında nefes alabilmek mi?",
    a: "Gökyüzünde kuşlar gibi süzülerek uçabilmek",
    b: "Okyanusun en derin karanlıklarında balık gibi nefes alıp yüzebilmek"
  },
  {
    q: "Şöhret bedeli:",
    a: "Tüm dünyada tanınan bir süperstar olmak ama sokakta korumasız yürüyememek",
    b: "Sıradan, kimsenin tanımadığı ama inanılmaz zengin ve özgür biri olmak"
  },
  {
    q: "Uzaylılar dünyaya gelse ilk tepkin:",
    a: "'Nihayet geldiniz, alın beni de götürün bu gezegenden' demek",
    b: "Bodruma konserve stoklayıp savunma planı hazırlamak"
  },
  {
    q: "Evinde hangi oda saray gibi olsun?",
    a: "Dev yataklı, sinema sistemli rüya gibi bir yatak odası",
    b: "Profesyonel şef ekipmanlarıyla donatılmış devasa bir mutfak"
  },
  {
    q: "Mizah yeteneği mi hitabet yeteneği mi?",
    a: "Girdiği her ortamı kahkahalara boğan doğuştan komedyen olmak",
    b: "Konuştuğunda binlerce insanı peşinden sürükleyen karizmatik hatip olmak"
  },
  {
    q: "Sonsuza kadar sadece tek bir yemek yiyeceksin:",
    a: "Her gün pizza veya hamburger",
    b: "Her gün anne usulü kuru fasulye + pilav + turşu"
  },
  {
    q: "Hangisiyle lanetlenmek isterdin?",
    a: "Her güldüğünde hapşırmak",
    b: "Her şaşırdığında elinde olmadan alkış tutmak"
  },

  // 151-175: Gündelik Hayatın Sinir Bozucu Anları
  {
    q: "Hangisi seni daha çok çileden çıkarır?",
    a: "Tam uykuya dalacakken kulağının dibinde vızıldayan sivrisinek",
    b: "Tam evden çıkacakken anahtar veya cüzdanı evin içinde bulamamak"
  },
  {
    q: "Trafikte hangi sürücü tipi daha tahammül edilmez?",
    a: "Sinyal vermeden aniden önünüze kıranlar",
    b: "Yeşil ışık yandığı salisede arkadan kornaya basanlar"
  },
  {
    q: "Toplu taşımada hangisi daha dayanılmazdır?",
    a: "Telefonundan son ses TikTok videosu izleyen teyze/amca",
    b: "Boş koltuk varken gelip dibine oturan yabancı"
  },
  {
    q: "Sipariş verirken hangisi daha büyük yıkım?",
    a: "Yemeksepeti kuryesinin yemeği dökülmüş ve ezilmiş getirmesi",
    b: "1 saat bekledikten sonra restorandan gelen 'siparişiniz iptal edildi' mesajı"
  },
  {
    q: "Sabah rutini çatışması:",
    a: "Alarmı çaldığı ilk saniyede kapatıp hemen yataktan fırlamak",
    b: "Alarmı her 5 dakikada bir erteleyip 45 dakika boyunca yatakta kıvranmak"
  },
  {
    q: "Sinemada arkandaki kişinin:",
    a: "Sürekli koltuğunu tekmelemesi",
    b: "Film boyunca yanındakine olayları sesli sesli açıklaması"
  },
  {
    q: "Kuaför / Berber faciası:",
    a: "'Sadece kırıkları al' dediğinde saçını 10 cm kısaltması",
    b: "Tüm tıraş boyunca sana istemediğin hayat tavsiyeleri vermesi"
  },
  {
    q: "Asansörde tanımadığın biriyle kalınca:",
    a: "Gözlerini tavandaki kat numaralarına dikip susmak",
    b: "'Hava da bugün çok sıcak/soğuk' diye havadan sudan laf açmak"
  },
  {
    q: "Ayakkabı çilesi:",
    a: "Çorabın ayakkabının içinde topuğunun altına doğru kayması",
    b: "Yağmurlu günde beyaz ayakkabının üstüne çamur sıçraması"
  },
  {
    q: "Bir mekanda WiFi şifresi istemek:",
    a: "Garsonu çağırıp çekinmeden şifreyi sormak",
    b: "Kendi internet paketini harcayıp sormaya üşenmek"
  },
  {
    q: "Kargocunun yaptığı hangisi daha sinir bozucudur?",
    a: "'Evde yoktunuz' mesajı atıp şubeye geri götürmesi",
    b: "Zile basıp 2 saniye sonra paketi kapının önüne fırlatıp kaçması"
  },
  {
    q: "Kıyafet alışverişinde kabin çilesi:",
    a: "Kıyafetleri kabinde denemeye üşenip direkt alıp evde denemek",
    b: "Kabinde 10 parça kıyafeti terleye terleye tek tek denemek"
  },
  {
    q: "Yaz mevsiminde hangisi daha beter?",
    a: "Geceleri sıcaktan yapış yapış olup uyuyamamak",
    b: "Gündüzleri güneşin altında yürürken terden sırılsıklam olmak"
  },
  {
    q: "Duşta sıcak su bittiğinde:",
    a: "Çığlık atıp hemen kendini dışarı atmak",
    b: "Donarak da olsa kalan köpükleri aceleyle durulamaya çalışmak"
  },
  {
    q: "Market kasasında sıra beklerken:",
    a: "Önündeki kişinin indirim kuponu arayıp kasayı kilitlemesi",
    b: "Kasiyerin bozuk para kalmadığı için para üstü yerine sakız teklif etmesi"
  },
  {
    q: "Telefon kılıfı felsefen:",
    a: "Zırh gibi kalın, tank çarpsa kırılmayacak kaba kılıf",
    b: "Telefonun orijinal inceliğini hissetmek için kılıfsız gezmek"
  },
  {
    q: "Birine borç para verdikten sonra:",
    a: "Zamanı gelince çekinmeden 'benim parayı ne zaman atıyorsun' demek",
    b: "İsteyemeyip içten içe günlerce karşındakinin hatırlamasını beklemek"
  },
  {
    q: "Kafede yan masanın bebeği ağlamaya başladığında:",
    a: "Anlayışla karşılayıp 'çocuktur ağlar' demek",
    b: "İçten içe gerilip masayı değiştirmek için fırsat kollamak"
  },
  {
    q: "Şemsiye taşımak:",
    a: "Hava biraz bulutlu olsa bile yanına kocaman şemsiye almak",
    b: "Bardaktan boşanırcasına yağsa bile kapüşonla idare etmek"
  },
  {
    q: "Ev temizliğinde hangisi daha zevklidir?",
    a: "Kulaklığı takıp evi köşe bucak süpürmek",
    b: "Bulaşıkları yıkayıp tezgahı pırıl pırıl parlatmak"
  },
  {
    q: "Bavul hazırlama tarzın:",
    a: "Seyahatten 3 gün önce kıyafetleri rulo yaparak özenle yerleştirmek",
    b: "Yola çıkmaya 20 dakika kala dolaptakileri rastgele bavula tıkıştırmak"
  },
  {
    q: "Tanımadığın bir ortama girdiğinde:",
    a: "Hemen kaynaşıp herkesle sohbete başlayan sosyal kelebek",
    b: "Bir köşede telefonuna bakıp birinin onunla konuşmasını bekleyen"
  },
  {
    q: "Kargo kutusunu açma yöntemin:",
    a: "Makas veya maket bıçağıyla bantları düzgünce kesmek",
    b: "Kutuyu vahşice yırtıp parçalayarak açmak"
  },
  {
    q: "Film izlerken soru soran kişi:",
    a: "Sabırla 'birazdan öğreneceğiz bekle' diye açıklamak",
    b: "'Sus izle işte film anlatıyor!' diye patlamak"
  },
  {
    q: "Diş fırçalarken musluk:",
    a: "Fırçalama boyunca musluğu kapatan tasarruf kahramanı",
    b: "Fırçalarken suyun şarıl şarıl akmasına aldırış etmeyen"
  },

  // 176-200: Felsefi & Derin Hayat İkilemleri
  {
    q: "Hayatının anlamını hangisi daha iyi tanımlar?",
    a: "Büyük başarılar elde edip dünyada kalıcı bir iz bırakmak",
    b: "Sevdiklerinle huzurlu, sade ve mutlu küçük anlar biriktirmek"
  },
  {
    q: "Acı gerçek mi tatlı yalan mı?",
    a: "Beni yerle bir etse bile her zaman gerçeği bilmek",
    b: "Huzurumu bozmayacaksa bazen gerçeğin saklanması"
  },
  {
    q: "İnsan doğası hakkında ne düşünüyorsun?",
    a: "İnsanlar özünde iyidir, koşullar onları bozar",
    b: "İnsanlar özünde bencil ve çıkarcıdır, kurallar onları dizginler"
  },
  {
    q: "Kader mi özgür irade mi?",
    a: "Yaşadığımız her şey önceden yazılmış bir senaryonun parçasıdır",
    b: "Her şey tamamen kendi seçimlerimizin ve kararlarımızın sonucudur"
  },
  {
    q: "Affetmek mi unutmak mı?",
    a: "Bana yapılanı affederim ama asla unutmam ve tedbiri elden bırakmam",
    b: "Kafamda yer kaplamasın diye tamamen unutur, hayatıma bakarım"
  },
  {
    q: "Yalnızlık hissi:",
    a: "Kalabalıklar içinde yapayalnız hissetmek",
    b: "Tek başına bir odada saatlerce sessizlik içinde oturmak"
  },
  {
    q: "Adalet mi merhamet mi?",
    a: "Kanunlar ve kurallar herkese eşit ve tavizsiz uygulanmalıdır",
    b: "Koşullar göz önüne alınarak insanlara her zaman merhamet gösterilmelidir"
  },
  {
    q: "Geçmişin pişmanlıkları mı geleceğin kaygıları mı?",
    a: "'Keşke öyle yapmasaydım' dediğim geçmiş hatalarım",
    b: "'Acaba ileride ne olacak' dediğim gelecek belirsizliği"
  },
  {
    q: "Cesaret tanımın:",
    a: "Korkusuzca bilinmeze ve tehlikeye atılabilmek",
    b: "Korkmana rağmen geri adım atmayıp o adımı atabilmek"
  },
  {
    q: "Güzellik algısı:",
    a: "Kusursuz simetri ve estetik çekicilik",
    b: "Kusurların getirdiği benzersiz karakter ve doğallık"
  },
  {
    q: "Dostlukta hangisi daha kıymetlidir?",
    a: "Her gün konuşmasak bile 5 yıl sonra kaldığımız yerden devam edebilmek",
    b: "Her gün hayatının en küçük detayını bile paylaşıp sürekli temas halinde olmak"
  },
  {
    q: "Mutluluğun anahtarı:",
    a: "Beklentilerini sıfıra indirip elindekilerle yetinmeyi bilmek",
    b: "Her zaman daha fazlasını hedefleyip sınırlarını zorlamak"
  },
  {
    q: "Bilgi mi tecrübe mi?",
    a: "Yüzlerce kitap okuyup teoriyi kusursuz bilmek",
    b: "Hata yapa yapa bizzat sahada yaşayarak öğrenmek"
  },
  {
    q: "Risk almak mı güvenli liman mı?",
    a: "Her şeyini kaybetme pahasına büyük hayallerin peşinden koşmak",
    b: "Garantili ve düzenli bir hayatın huzurunu tercih etmek"
  },
  {
    q: "Başkalarının senin hakkındaki düşünceleri:",
    a: "Hiç umurumda değil, ben kendimi biliyorum",
    b: "İster istemez kafama takılır, hakkımda ne düşündüklerini önemserim"
  },
  {
    q: "Bir insanın zekasını ne gösterir?",
    a: "Karmaşık sorunlara bulduğu pratik ve yaratıcı çözümler",
    b: "İnsan ilişkilerindeki yüksek empati ve duygusal farkındalık"
  },
  {
    q: "Hayat bir oyun olsaydı:",
    a: "Strateji ve planlama oyunu (Her hamle hesaplı)",
    b: "Açık dünya macera oyunu (Akışına bırakıp haritayı keşfetmek)"
  },
  {
    q: "Özgürlük mü aidiyet mi?",
    a: "Hiçbir yere ve kimseye bağlı olmadan tamamen bağımsız yaşamak",
    b: "Bir topluluğa, aileye ya da yuvaya ait olduğunu derinden hissetmek"
  },
  {
    q: "Vicdan azabı mı fırsat kaçırma korkusu mu?",
    a: "Yaptığım bir şey yüzünden pişman olup vicdan azabı çekmek",
    b: "Yapmadığım bir şey yüzünden 'keşke deneseydim' diye düşünmek"
  },
  {
    q: "Öğrenmek mi öğretmek mi?",
    a: "Sürekli yeni şeyler keşfeden bir öğrenci olmak",
    b: "Bildiğin şeyleri başkalarına aktaran ilham verici bir usta olmak"
  },
  {
    q: "İç huzur için:",
    a: "Şehrin kaosundan tamamen uzaklaşıp doğaya sığınmak",
    b: "Kaosun tam ortasında kalsan bile zihnini sakinleştirmeyi başarmak"
  },
  {
    q: "Tarihin hangi döneminde yaşamak isterdin?",
    a: "Rönesans dönemi İtalya'sı (Sanat, felsefe ve aydınlanma)",
    b: "Gelecekte 2200 yılı (Uçan arabalar, uzay kolonileri ve yapay zeka)"
  },
  {
    q: "Duygular mı mantık mı?",
    a: "Kalbinin sesini dinleyip hislerinle karar vermek",
    b: "Tüm duyguları bir kenara bırakıp matematiksel mantıkla karar vermek"
  },
  {
    q: "Saygı görmek mi sevilmek mi?",
    a: "Herkesin çekindiği ve derin saygı duyduğu biri olmak",
    b: "Herkesin içtenlikle sevdiği ve bağrına bastığı biri olmak"
  },
  {
    q: "Ölümsüzlük verilse kabul eder miydin?",
    a: "Evet, insanlığın sonuna kadar evrenin sırlarını görmek isterim",
    b: "Hayır, tüm sevdiklerimin ölümünü izlemek en büyük ceza olurdu"
  },

  // 201-225: Masa Sohbeti & Arkadaş Grubu İkilemleri
  {
    q: "Bu masadaki hesabı kim ödemeli?",
    a: "Masada en çok konuşup en çok güldüren kişi",
    b: "Aramızda en çok para kazanan ve en zengin olan kişi"
  },
  {
    q: "Arkadaş grubunda rolün hangisi?",
    a: "Organizasyonları yapan, mekanı seçen 'muhtar' karakter",
    b: "'Bana uyar' deyip her plana sorgusuz sualsiz katılan uyumlu tip"
  },
  {
    q: "Grup sohbetinde aniden atılan ifşa fotoğrafı:",
    a: "Hemen kaydedip yıllar sonra kullanmak üzere şantaj arşivine atmak",
    b: "'Sil şunu rezil olduk' deyip utançtan yerin dibine geçmek"
  },
  {
    q: "Bir arkadaşının sevgilisi seni hiç sarmadıysa:",
    a: "Arkadaşıma açık açık 'bu çocuk/kız sana göre değil' demek",
    b: "Araları bozulmasın diye içime atıp görmezden gelmek"
  },
  {
    q: "Arkadaşın yeni aldığı kıyafeti gösterip 'nasıl olmuş?' dediğinde ve çok çirkinse:",
    a: "Dürüstçe 'hiç olmamış, hemen iade et' demek",
    b: "'Rengi çok güzelmiş' diyerek konuyu kibarca geçiştirmek"
  },
  {
    q: "Ortak tatil planı yaparken:",
    a: "Grupta herkesin fikrini sorup 3 ayda bir ortak tarih bile bulamamak",
    b: "Birinin diktatör gibi 'tarih bu, biletler bu' deyip olayı bitirmesi"
  },
  {
    q: "Gruptan biri fıkra ya da komik olduğunu sandığı bir şey anlattığında kimse gülmezse:",
    a: "Buz gibi sessizliği bozmayıp karşındakini o cringe anla baş başa bırakmak",
    b: "Ayıp olmasın diye yapmacık bir şekilde kahkaha patlatmak"
  },
  {
    q: "Sır saklama konusunda tavrın:",
    a: "Mezara kadar benimle gider, işkence yapsalar kimseye söylemem",
    b: "Sadece tek bir en yakın arkadaşıma 'kimseye söyleme ama' diyerek anlatmak"
  },
  {
    q: "Buluşmaya çağrıldığında gitmek istemiyorsan:",
    a: "Dürüstçe 'hiç canım istemiyor, evde yatacağım' demek",
    b: "'Ayy başım çok ağrıyor / Annemlere yardım ediyorum' yalanına sığınmak"
  },
  {
    q: "Arkadaşının dişinde maydanoz kaldığında:",
    a: "Göz kırparak veya parmakla işaret ederek anında uyarmak",
    b: "Utanmasın diye görmezden gelip başkasının söylemesini ummak"
  },
  {
    q: "Okey veya Tabu oynarken tavrın:",
    a: "Eğlencesine oynayan, kaybetse de gülen neşeli oyuncu",
    b: "Hırsından masayı devirecek noktaya gelen profesyonel yarışmacı"
  },
  {
    q: "Grupta sürekli geç kalan o arkadaşa ceza:",
    a: "Masanın tüm çay/kahve hesabını ona kitlemek",
    b: "Onu beklemeden siparişleri verip yemeye başlamak"
  },
  {
    q: "Dedikodu yaparken tarzın:",
    a: "Gözleri parlayarak 'anlat anlat detay ver' diyen meraklı",
    b: "'Boşverin gıybet yapmayalım' deyip pürdikkat dinlemeye devam eden"
  },
  {
    q: "Arkadaşının doğum günü hediyesi:",
    a: "Tek başına düşünüp aldığın özel bir hediye",
    b: "Gruptan 5 kişi birleşip ortak büyük bir hediye almak"
  },
  {
    q: "Arkadaşınla aynı kişiden hoşlandığını fark edersen:",
    a: "Dostluk her şeyden önemlidir, hemen geri çekilirim",
    b: "Aşkta kural yoktur, karşı taraf kimi seçerse o kazanır"
  },
  {
    q: "Arkadaşının arabasına bindiğinde:",
    a: "DJ koltuğunu kapıp Bluetooth'a ilk bağlanan olmak",
    b: "Sessizce yolu izleyip müziğe hiç karışmamak"
  },
  {
    q: "Grupta borç para muhabbeti:",
    a: "Kuruşuna kadar IBAN atıp 'benim payım geldi mi' kontrolü yapmak",
    b: "'Aramızda lafı mı olur ya bir dahakine sen ödersin' rahatlığı"
  },
  {
    q: "Masada telefon kullanımı:",
    a: "Herkes telefonları üst üste masaya koysun, ilk eline alan hesabı ödesin kuralı",
    b: "Herkesin kendi ekranına bakıp arada birbirine video gösterdiği modern masa"
  },
  {
    q: "Eski bir dostla yıllar sonra karşılaşınca:",
    a: "Ayaküstü sarılıp 'kesin kahve içelim' deyip bir daha asla aramamak",
    b: "Hemen o an bir kafeye oturup saatlerce geçmişi yad etmek"
  },
  {
    q: "Arkadaş grubunda hangisi daha çekilmezdir?",
    a: "Sürekli sevgilisinden dert yanıp kafanızı şişiren arkadaş",
    b: "Sürekli ne kadar çok çalıştığından ve yoğunluğundan bahseden arkadaş"
  },
  {
    q: "Biri sana bir derdini anlattığında ilk refleksiyon:",
    a: "Hemen mantıklı çözümler üretip ne yapması gerektiğini söylemek",
    b: "Sadece dinleyip sarılmak ve duygusuna ortak olmak"
  },
  {
    q: "Arkadaşının evine yatıya kalmaya gittiğinde:",
    a: "Kendi evi gibi buzdolabını açıp rahat takılan tip",
    b: "Koltukta oturup 'su alabilir miyim' diye çekinerek soran tip"
  },
  {
    q: "Masa oyunlarında yenilince:",
    a: "'Oyun bu ya tebrik ederim' demek",
    b: "'Zarlar hileliydi, kesin balına kazandın' diye itiraz etmek"
  },
  {
    q: "Bir arkadaşının başarısını duyunca içindeki ilk ses:",
    a: "Onun adına gerçekten havalara uçup gurur duymak",
    b: "Hafif bir kıskançlıkla 'ben ne yapıyorum hayatımda' sorgulamasına girmek"
  },
  {
    q: "Bu masadan kalktıktan sonra ilk yapacağın şey:",
    a: "Eve gidip yatağa uzanıp dizimi açmak",
    b: "Gecenin devamı için başka bir plana akmak"
  },

  // 226-250: Çılgın, Eğlenceli & Sıra Dışı Senaryolar
  {
    q: "Bir zombi istilası başlasa ilk kimi feda edersin?",
    a: "Koşarken sürekli ayağı takılıp düşen o panik arkadaşını",
    b: "Sürekli 'ben demiştim' diyerek kafa şişiren ukala arkadaşını"
  },
  {
    q: "Tüm dünyada herkesin zihninde 10 saniye boyunca tek bir ses çalacak olsa:",
    a: "Ajdar'ın Çikita Muz şarkısı",
    b: "Gülşen'in Bangır Bangır nakaratı"
  },
  {
    q: "Hangi çılgın macerayı denemek isterdin?",
    a: "4000 metreden uçaktan paraşütle atlamak (Skydiving)",
    b: "Köpekbalıklarıyla dolu kafeste okyanusa dalmak (Shark diving)"
  },
  {
    q: "Hangisiyle 1 hafta yer değiştirmek isterdin?",
    a: "Elon Musk (Milyarlarca dolar ve roketlerle uğraşmak)",
    b: "Tembel bir ev kedisi (Bütün gün uyuyup mama yemek)"
  },
  {
    q: "Bir günlüğüne Türkiye Cumhurbaşkanı olsan ilk icraatın:",
    a: "Pazartesi günlerini resmi tatil ilan etmek",
    b: "Tüm kafelere kahve fiyatı tavan sınırı getirmek"
  },
  {
    q: "Kendi cenazende çalacak müzik:",
    a: "Herkesi hıçkırıklara boğan duygusal bir Sezen Aksu şarkısı",
    b: "Herkesi ayağa kaldırıp göbek attıracak bir Ankara havası"
  },
  {
    q: "Hangisi daha korkunç bir kabus olurdu?",
    a: "Canlı yayında haber bültenini sunarken aniden hıçkırık tutması",
    b: "Önemli bir iş mülakatına pijama ve terlikle gitmek zorunda kalmak"
  },
  {
    q: "Bir hayvan olarak reenkarne olsan:",
    a: "Gökyüzünde özgürce süzülen heybetli bir kartal",
    b: "Tropik bir adada ağaçta keyif yapan sevimli bir koala"
  },
  {
    q: "Issız bir adada tek başına mı yoksa sevmediğin biriyle mi?",
    a: "Tamamen tek başına (Kafa dinlerim, en azından dırdır yok)",
    b: "Sevmediğim biriyle (En azından insan sesi duyarım, kavga bile olsa)"
  },
  {
    q: "Tarihteki bir gizemi çözme şansın olsa:",
    a: "Mısır Piramitlerinin ve Atlantis'in gerçek sırrı",
    b: "Evrende başka zeki yaşam formlarının ve uzaylıların varlığı"
  },
  {
    q: "Her sabah uyandığında başında rastgele bir şapka belirecek olsa:",
    a: "Görkemli bir Osmanlı fesi",
    b: "Kocaman parlak bir kovboy şapkası"
  },
  {
    q: "Sadece tek bir içecekle yaşamak zorunda kalsan:",
    a: "Sıcak, tavşan kanı taze çay",
    b: "Köpüklü, taze çekilmiş filtre kahve"
  },
  {
    q: "Hangisi daha havalı bir yetenektir?",
    a: "Gözleri kapalı elektro gitar solosu atabilmek",
    b: "Sahnede profesyonel gibi akrobatik dans edebilmek"
  },
  {
    q: "Hayatının belgeselini kim seslendirsin?",
    a: "Haluk Bilginer (Derin, etkileyici ve karizmatik)",
    b: "Mehmet Ali Erbil (Kaotik, enerjik ve komik)"
  },
  {
    q: "Dünyanın en iyi şefi olmak mı dünyanın en iyi yazarı olmak mı?",
    a: "Yaptığı yemeklerle insanların aklını başından alan bir şef",
    b: "Yazdığı kitaplarla milyonların kalbine dokunan bir yazar"
  },
  {
    q: "Kayıp bir hazine sandığı bulsan:",
    a: "Müzeye bağışlayıp tarihe geçen dürüst kahraman olmak",
    b: "Sessizce İsviçre'ye kaçırıp hayatını krallar gibi yaşamak"
  },
  {
    q: "Her sinirlendiğinde istemsizce:",
    a: "Tavuk gibi gıdaklamak",
    b: "Kafanda gökkuşağı renkli konfetiler patlaması"
  },
  {
    q: "Hangisi daha eğlenceli bir akşam aktivitesidir?",
    a: "Arkadaşlarla detone ola ola karaoke yapmak",
    b: "Lunaparkta en çılgın hız trenine (Rollercoaster) binmek"
  },
  {
    q: "Zamanda yolculuk yaparak kime tavsiye vermek isterdin?",
    a: "Fatih Sultan Mehmet'e İstanbul fethinden önce",
    b: "Mustafa Kemal Atatürk'e Kurtuluş Savaşı yıllarında"
  },
  {
    q: "Ömrünün sonuna kadar sadece tek bir ayakkabı giyeceksin:",
    a: "Rahat ve yumuşak beyaz spor ayakkabı (Sneaker)",
    b: "Şık ama ayağı vuran deri kundura/topuklu ayakkabı"
  },
  {
    q: "Bir günlüğüne görünmez olsan ilk nereye sızardın?",
    a: "Devlet liderlerinin en gizli kapalı kapı zirvesine",
    b: "Arkadaşlarının senin arkandan konuştukları dedikodu masasına"
  },
  {
    q: "Milli Piyango büyük ikramiyesi çıksa ailene söyler misin?",
    a: "Hemen söylerim, hep beraber sevinir ve paylaşırız",
    b: "Asla söylemem, gizlice borçlarını kapatıp çaktırmadan yaşarım"
  },
  {
    q: "Hangisi daha büyük bir hayal kırıklığıdır?",
    a: "Çok övülen bir filme gidip salonda uyuyakalmak",
    b: "Çok övülen bir restorana gidip berbat bir yemek yemek"
  },
  {
    q: "Herkesin yalan söylediğinde sana kırmızı ışık yandığını gördüğü bir dünya:",
    a: "Mükemmel olurdu, kimse kimseyi kandıramazdı",
    b: "Korkunç olurdu, sosyal hayat ve nezaket anında çökerdi"
  },
  {
    q: "Son ikilem: Bu ikilemleri oynamaya devam etmek mi, yoksa kahveden bir yudum alıp derin bir dedikoduya girmek mi?",
    a: "Yeni bir ikilem kartı çek, oyun çok sardı!",
    b: "Kahveni tazele, şimdi masanın gerçek sırlarını dökme vakti!"
  }
];

const questions = ikilemler.map((item, index) => {
  const num = index + 1;
  const id = `ikilem-${String(num).padStart(3, '0')}`;
  
  let tags = ['İkilem', 'Seçim'];
  let difficulty = 'easy';
  if (num <= 25) {
    tags = ['Yeme-İçme', 'Kafe'];
    difficulty = 'easy';
  } else if (num <= 50) {
    tags = ['Teknoloji', 'Sosyal Medya'];
    difficulty = 'easy';
  } else if (num <= 75) {
    tags = ['Kariyer', 'Para'];
    difficulty = 'medium';
  } else if (num <= 100) {
    tags = ['İlişkiler', 'Flört'];
    difficulty = 'medium';
  } else if (num <= 125) {
    tags = ['Popüler Kültür', 'Dizi-Sinema'];
    difficulty = 'easy';
  } else if (num <= 150) {
    tags = ['Absürt', 'Süper Güç'];
    difficulty = 'easy';
  } else if (num <= 175) {
    tags = ['Günlük Hayat', 'Mizah'];
    difficulty = 'easy';
  } else if (num <= 200) {
    tags = ['Felsefe', 'Derin'];
    difficulty = 'deep';
  } else if (num <= 225) {
    tags = ['Masa Sohbeti', 'Arkadaşlık'];
    difficulty = 'medium';
  } else {
    tags = ['Çılgın Senaryo', 'Eğlence'];
    difficulty = 'easy';
  }

  return {
    id,
    category_id: 'cat-ikilem',
    game_type: 'ikilemde-kal',
    question_text: item.q,
    option_a: item.a,
    option_b: item.b,
    tags,
    difficulty,
    is_active: true,
    sort_order: num
  };
});

const content = `import type { Question } from '../../types';\n\nexport const IKILEM_QUESTIONS: Question[] = ${JSON.stringify(questions, null, 2)};\n`;

const targetPath = path.join(__dirname, '..', 'src', 'data', 'questions', 'ikilem.ts');
fs.writeFileSync(targetPath, content, 'utf8');
console.log(`Successfully generated ${questions.length} Ikilem questions at ${targetPath}`);
