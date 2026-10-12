const fs = require('fs');
const path = require('path');

// 150 Özgün, Samimi ve Keşif Dolu "Ne Kadar Tanıyoruz?" Sorusu
const taniyoruzSorular = [
  // 1-25: Zevkler, Tercihler & Günlük Alışkanlıklar
  "Benim bir kafeye girdiğimde istisnasız ilk sipariş edeceğim favori içecek nedir?",
  "Pazar kahvaltısında masada olmazsa olmazım, asla vazgeçemeyeceğim lezzet hangisidir?",
  "Beni en çok sinirlendiren veya sabrımı taşıran o meşhur küçük hareket nedir?",
  "Gece aniden gelen acıkma krizinde sipariş edeceğim ilk kaçamak yiyecek nedir?",
  "Telefonumda en çok vakit geçirdiğim ve ekran süremi sömüren favori uygulamam hangisi?",
  "Benim sabah insanı mı (Early bird), yoksa gece kuşu mu (Night owl) olduğumu biliyor musunuz?",
  "Bana hediye alacak olsaydınız, beni sevinçten havalara uçuracak o garanti hediye ne olurdu?",
  "Benim asla ağzıma sürmediğim, kokusuna bile tahammül edemediğim yemek hangisi?",
  "Hayatta en çok gitmek, sokaklarında kaybolmak istediğim o hayalimdeki şehir/ülke neresi?",
  "Stresli veya moralim bozuk olduğunda kendimi rahatlatmak için ilk ne yaparım?",
  "Benim hakkımda kimsenin kolay kolay tahmin edemeyeceği gizli bir yeteneğim veya huyum var mı?",
  "En sevdiğim müzik türü ya da asla bıkmadan dinlediğim o sanatçı/grup kimdir?",
  "Evde tek başıma kaldığımda yapmaktan en çok zevk aldığım o tembel aktivite nedir?",
  "Beni güldürmek ne kadar kolaydır? Benim mizah anlayışımı en iyi hangi dizi veya karakter özetler?",
  "Alışveriş yaparken en çok neye para harcamaktan kendimi alamam?",
  "Buluşmalara genelde tam vaktinde mi gelirim, 10 dakika erken mi, yoksa hep geç mi kalırım?",
  "Kıyafet dolabımda en çok hangi renk hakimdir ve hangi tarzı kendime yakıştırırım?",
  "Sosyal medyada karşıma çıktığında durup sonuna kadar izlediğim video türü nedir?",
  "Çay mı insanıyım yoksa kahve insanı mı? Günde kaç bardak/fincan içerim?",
  "Benim hayatta en değer verdiğim kişisel eşyam veya yanımdan ayırmadığım nesne nedir?",
  "Tatilde deniz-kum-güneş insanı mıyım, yoksa kültür-müze-yürüyüş insanı mı?",
  "Benim 'asla giymem' dediğim o kıyafet veya tarz nedir?",
  "Hızlı ve telaşlı bir yürüyüşçü müyüm, yoksa etrafı izleyerek aheste aheste yürüyen biri mi?",
  "Arabada ya da yolda giderken en çok hangi şarkıyı bağıra bağıra söylemeyi severim?",
  "Bir restoranda hesap ödenirken benim sergileyeceğim tipik davranış nedir?",

  // 26-50: Korkular, Zaaflar & Gizli Huylar
  "Benim en büyük fobim ya da gördüğüm an çığlık atacağım şey nedir? (Böcek, yükseklik vb.)",
  "Benim 'guilty pleasure' sayılan, dinlemekten ya da izlemekten gizlice zevk aldığım şey ne?",
  "Bir ortamda en çok ne tür insanlardan ve hangi davranıştan anında soğurum?",
  "Çocukken en çok korktuğum şey neydi biliyor musunuz?",
  "Beni gerçekten hüzünlendiren ve gözlerimi dolduran film sahnesi ya da konu nedir?",
  "Benim hayatta en çok pişmanlık duyduğum ya da 'keşke' dediğim konu ne olabilir?",
  "Bir tartışma anında benim tepkim ne olur: Bağırmak mı, mantıkla ezmek mi, yoksa susup küsmek mi?",
  "Benim hakkımda ilk tanıştığınızda düşündüğünüz ama sonradan tamamen yanıldığınız şey neydi?",
  "Uykum ne kadar ağırdır? Top patlasa uyanmaz mıyım, yoksa çıt çıksa gözüm açılır mı?",
  "Kendimde değiştirmek istediğim ama bir türlü değiştiremediğim o zaafım nedir?",
  "Beni kandırmak veya bana yalan söylemek kolay mıdır, hemen anlar mıyım?",
  "Karanlıktan, yalnız kalmaktan ya da ıssız yerlerden korkar mıyım?",
  "Bugüne kadar başıma gelen ve anlatırken hala yüzümün kızardığı o rezil anım nedir?",
  "Benim takıntılı olduğum bir temizlik ya da düzen kuralım var mı?",
  "Birine kırıldığımda bunu hemen yüzüne söyler miyim, yoksa soğuk davranıp anlamasını mı beklerim?",
  "Nazara, burçlara ya da batıl inançlara ne kadar inanırım?",
  "Hastalandığımda nasıl bir hasta olurum: Mızmız ve ilgi bekleyen mi, yoksa tek başına sessizce iyileşen mi?",
  "Sır tutma konusunda bana ne kadar güvenirsiniz? 1'den 10'a kadar puanlayın.",
  "Beni en çok ne tür başarısızlıklar ya da hayal kırıklıkları derinden etkiler?",
  "Sosyal ortamlarda enerjim tükendiğinde (social battery bittiğinde) bunu nasıl belli ederim?",
  "Bugüne kadar aldığım ve sonradan 'ben bunu niye aldım' dediğim en saçma eşyam nedir?",
  "Benim hakkımda bilinen en büyük klişe ya da önyargı nedir?",
  "Birinin kalbini kırmaktan mı daha çok korkarım, yoksa kendi hakkımı savunamamaktan mı?",
  "Zor bir karar verirken aklımı mı dinlerim yoksa kalbimin sesini mi?",
  "Benim en tahammülsüz olduğum ses veya gürültü nedir?",

  // 51-75: Çocukluk, Geçmiş & Aile
  "Çocukken büyüyünce ne olmak isterdim, hayalimdeki meslek neydi?",
  "İlkokul veya lise yıllarımda nasıl bir öğrenciydim: Çalışkan mı, haylaz mı, sessiz mi?",
  "Bana çocukluğumu en çok hatırlatan o koku veya yemek nedir?",
  "Ailemde huy olarak en çok kime benzediğimi düşünüyorsunuz?",
  "Çocukluğumun geçtiği yer ya da mahalle hakkında bildiğiniz en belirgin detay nedir?",
  "Okulda en sevdiğim ve en nefret ettiğim dersler hangileriydi?",
  "Çocukken başıma gelen en büyük yaramazlık veya ceza hikayem neydi?",
  "Bana göre çocukluğumun en güzel yılı ya da dönemi hangisiydi?",
  "Büyürken en çok etkilendiğim veya kendime örnek aldığım rol model kimdi?",
  "İlk izlediğim ve beni derinden etkileyen çizgi film veya sinema filmi neydi?",
  "Çocukken inandığım ve sonradan öğrendiğimde çok şaşırdığım o komik gerçek neydi?",
  "Eski fotoğraflarıma baktığınızda bende değişmeyen tek şey nedir?",
  "Ailemle aramdaki en eğlenceli ya da en tuhaf ortak gelenek nedir?",
  "Benim çocukluk lakabım ya da evde bana takılan komik isim neydi?",
  "Gençlik yıllarıma ait bir şeyi geri getirme şansım olsa neyi seçerdim?",
  "İlk arkadaşlıklarımdan hala görüştüğüm kimse var mı?",
  "Bana göre beni ben yapan en önemli çocukluk anım nedir?",
  "Küçükken en çok hangi oyunu oynamaktan keyif alırdım?",
  "Büyümekle ilgili beni en çok hayal kırıklığına uğratan şey ne oldu?",
  "Annemin ya da babamın bana sürekli tekrarladığı o meşhur nasihat nedir?",
  "Çocukken sahip olduğum ve asla yanımdan ayırmadığım o oyuncak neydi?",
  "Gençlik döneminde yaptığım en çılgın veya asi hareket neydi?",
  "Hangi yaşımda hayatımın en büyük dönüm noktasını yaşadım?",
  "Geçmişe dair en çok özlediğim o masum his nedir?",
  "10 yaşındaki halim bugünkü beni görseydi benimle gurur duyar mıydı?",

  // 76-100: Aşk, Flört & İlişki Dünyam
  "Benim bir ilişkide asla tahammül edemeyeceğim o 1 numaralı kırmızı çizgim nedir?",
  "İlk görüşte aşka inanır mıyım, yoksa zamanla tanıdıkça mı bağlanırım?",
  "Benim ideal partnerimde aradığım en temel ve vazgeçilmez karakter özelliği nedir?",
  "Aşık olduğumda bunu nasıl belli ederim: Sürekli ilgilenerek mi, heyecandan kaçarak mı?",
  "Bana göre mükemmel bir ilk buluşma (First date) senaryosu nerede ve nasıl olmalıdır?",
  "İlişkide kıskançlık seviyem 1 ile 10 arasında kaçtır?",
  "Ayrılık sonrasında acımı nasıl yaşarım: İçime kapanarak mı, hemen sosyalleşerek mi?",
  "Benim sevgi dilim hangisidir: Güzel sözler mi, kaliteli zaman mı, hediye mi, fiziksel temas mı?",
  "Bir ilişkide baskın olan taraf mı olmayı severim, yoksa eşit ve dengeli bir ortaklık mı?",
  "Benim flört ederken yaptığım en belirgin taktik ya da komik hareket nedir?",
  "Eski sevgililerimle arkadaş kalabilen biri miyim, yoksa tamamen hayatımdan silen biri mi?",
  "Romantik sürprizlerden hoşlanır mıyım, yoksa sürprizler beni utandırıp gerer mi?",
  "Beni etkilemek isteyen biri bunu en kolay hangi yolla başarabilir?",
  "İlişkilerimde affedici miyimdir, yoksa yapılan yanlışı asla unutmaz mıyım?",
  "Evlilik ve aile kurma fikrine bakış açım nedir?",
  "Bana göre bir ilişkide heyecanı ve tutkuyu öldüren en büyük hata nedir?",
  "Sevgilimin telefonunu gizlice karıştırma potansiyelim var mıdır?",
  "Aşk acısı çekerken hangi şarkıyı arka arkaya 50 kez dinlerim?",
  "Birlikte olduğum insanın arkadaş grubumla anlaşması benim için ne kadar önemlidir?",
  "Bir ilişkide en çok değer verdiğim şey güven midir, tutku mu, yoksa huzur mu?",
  "Benim birinde gördüğüm an etkilendiğim o çekici detay nedir?",
  "İlişkide tartışırken ses tonumu yükseltir miyim, yoksa buz gibi mi konuşurum?",
  "Bana göre ayrılık konuşması yüz yüze mi yapılmalıdır, mesajla mı?",
  "Sevgilime karşı ne kadar cömertimdir? Ona hediye alırken sınırlarım nedir?",
  "Hayatımın aşkını bulduğumu nasıl anlarım?",

  // 101-125: Hayaller, Değerler & Gelecek
  "Benim 5 yıl sonraki en büyük kariyer veya kişisel hedefim nedir?",
  "Dünyada sınırsız param olsa ilk kuracağım hayal ya da yapacağım proje ne olurdu?",
  "Emekli olduğumda yaşamak istediğim o huzurlu yer neresi?",
  "Hayatta en çok saygı duyduğum ve takdir ettiğim erdem hangisidir?",
  "Benim için 'başarı' ne anlama gelir: Zenginlik mi, huzur mu, özgürlük mü?",
  "Bir kitap yazacak olsaydım konusu ya da adı ne olurdu?",
  "Bana göre dünyadaki en büyük problem ya da çözülmesi gereken dert nedir?",
  "Gelecekte mutlaka öğrenmek veya ustalaşmak istediğim o hobi/beceri nedir?",
  "Hayat felsefemi tek bir cümleyle özetleyecek olsanız o cümle ne olurdu?",
  "Kendime ait bir işletme açacak olsaydım bu ne tür bir yer olurdu?",
  "Ölmeden önce mutlaka yapılacaklar (Bucket list) listemin 1 numarasında ne var?",
  "Gelecekte çocuk sahibi olmak ve ebeveynlik hakkındaki düşüncem nedir?",
  "Zaman makinesiyle geleceğe gitsem ilk öğrenmek isteyeceğim şey ne olurdu?",
  "Benim kendimi en huzurlu ve tamamen güvende hissettiğim yer neresidir?",
  "Hayatta hiçbir koşulda taviz vermeyeceğim o temel ahlaki prensibim nedir?",
  "Bir gün çok zengin olsam bile asla vazgeçmeyeceğim o mütevazı alışkanlığım ne olurdu?",
  "Benim maneviyat ve inanç dünyama bakış açım nasıldır?",
  "Tarihte yaşamış hangi büyük liderle veya dehayla 1 saat sohbet etmek isterdim?",
  "Benim adımı duyunca insanların aklına gelmesini istediğim o miras/his nedir?",
  "Geleceğe dair beni en çok endişelendiren ya da düşündüren şey nedir?",
  "Benim hayatta en çok ilham aldığım kişi kimdir?",
  "Bir gün tüm dünyayı gezecek olsam yanıma alacağım tek yol arkadaşım kim olurdu?",
  "Yaşlanmaktan korkar mıyım, yoksa olgunlaşmanın tadını çıkarmayı mı beklerim?",
  "Benim için 'ev' hissi neyi veya kimi ifade eder?",
  "Hayatımın bu anında en çok ihtiyaç duyduğum şey nedir?",

  // 126-150: Masadaki Dostluk, Güven & Anlar
  "Bu masada benimle ilgili en eski ya da en unutulmaz ortak anımız nedir?",
  "Beni ilk gördüğünüz gün hakkımdaki ilk izleniminiz neydi?",
  "Benim bu arkadaş grubuna kattığım en belirgin renk veya rol nedir?",
  "Zor bir durumda kalsanız benden ilk isteyeceğiniz yardım ne olurdu?",
  "Benim en komik taklidimi bu masada kim yapabilir?",
  "Benim bir sırrımı saklamak zorunda kalsanız bana ne kadar kefil olursunuz?",
  "Bu masadakiler arasında benim kafa yapımın ve mizahımın en çok uyuştuğu kişi kimdir?",
  "Beni bir film veya dizi karakterine benzetseniz bu kim olurdu?",
  "Benim bu grupta en çok hangi huyumu takdir ediyorsunuz?",
  "Benimle baş başa bir gün geçirecek olsanız yapacağımız en iyi aktivite ne olurdu?",
  "Benim en tahammül edilemez ya da çekilmez olduğum o anlar hangileridir?",
  "Bu masada birlikte en çok güldüğümüz o rezillik veya absürt olay neydi?",
  "Benim birine küstüğümde veya darıldığımda barışmam için ne yapılması gerekir?",
  "Bana göre gerçek dostluğun en büyük kanıtı nedir?",
  "Benim bu hayattaki en büyük şansım nedir sizce?",
  "Grupta bir tatil planı yapsak benim gruptaki görevim ne olurdu?",
  "Bana bir şarkı armağan edecek olsaydınız bu hangi parça olurdu?",
  "Benim hiç kimseye anlatmadığım ama bu masadakilerin bildiği o sır nedir?",
  "Beni tanımlayan 3 anahtar kelime seçseniz bunlar ne olurdu?",
  "Bu masadaki dostluğumuzun 10 yıl sonraki halini nasıl hayal ediyorsunuz?",
  "Benim hakkımda hala merak ettiğiniz ya da sormaya çekindiğiniz bir soru var mı?",
  "Zamanı geri alsak bu masada yeniden yaşamak isteyeceğimiz o tek gün hangisi?",
  "Benim moralim yerlerdeyken bu masada beni 2 dakikada neşelendirecek kişi kimdir?",
  "Benim hayatımda bıraktığınız en güzel iz nedir?",
  "Ve son soru: Bu masada beni gerçekten ne kadar iyi tanıdığınızı düşünüyorsunuz?"
];

const questions = taniyoruzSorular.map((q, index) => {
  const num = index + 1;
  const id = `taniyoruz-${String(num).padStart(3, '0')}`;
  
  let tags = ['Tanıyoruz', 'Dostluk'];
  let difficulty = 'easy';
  if (num <= 25) {
    tags = ['Alışkanlıklar', 'Zevkler'];
    difficulty = 'easy';
  } else if (num <= 50) {
    tags = ['Korkular', 'Zaferler'];
    difficulty = 'medium';
  } else if (num <= 75) {
    tags = ['Çocukluk', 'Geçmiş'];
    difficulty = 'medium';
  } else if (num <= 100) {
    tags = ['İlişkiler', 'Aşk'];
    difficulty = 'deep';
  } else if (num <= 125) {
    tags = ['Hayaller', 'Gelecek'];
    difficulty = 'deep';
  } else {
    tags = ['Masa', 'Dostluk'];
    difficulty = 'medium';
  }

  return {
    id,
    category_id: 'cat-taniyoruz',
    game_type: 'ne-kadar-taniyoruz',
    question_text: q,
    tags,
    difficulty,
    is_active: true,
    sort_order: num
  };
});

const content = `import type { Question } from '../../types';\n\nexport const TANIYORUZ_QUESTIONS: Question[] = ${JSON.stringify(questions, null, 2)};\n`;

const targetPath = path.join(__dirname, '..', 'src', 'data', 'questions', 'taniyoruz.ts');
fs.writeFileSync(targetPath, content, 'utf8');
console.log(`Successfully generated ${questions.length} Taniyoruz questions at ${targetPath}`);
