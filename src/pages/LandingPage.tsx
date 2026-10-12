import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Coffee, 
  QrCode, 
  Smartphone, 
  MessageCircle, 
  Split, 
  Users, 
  HeartHandshake, 
  ArrowRight, 
  CheckCircle2, 
  ChevronDown,
  BellRing,
  Receipt,
  Wifi,
  Trophy,
  HelpCircle
} from 'lucide-react';
import { APP_CONFIG } from '../lib/config';
import { LeadModal } from '../components/LeadModal';

export const LandingPage: React.FC = () => {
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Fincan Sohbet yalnızca bir QR menü uygulaması mıdır?',
      a: 'Hayır, sıradan bir QR menüden çok daha fazlasıdır! Masada tek bir QR kod üzerinden hem kafenizin güncel dijital menüsünü ve Wi-Fi bilgilerini sunar, hem sesli garson/hesap çağrısı sağlar, hem de masadaki misafirlerin birbirleriyle eğlenceli mini oyunlarla sohbet etmelerini sağlayan hibrit bir masa deneyim portalıdır.',
    },
    {
      q: 'Garson çağırma ve hesap isteme özelliği nasıl çalışır?',
      a: 'Müşteri masadaki ekrandan tek tıkla garson çağırabilir veya nakit/kredi kartı tercihiyle hesap isteyebilir. Bu bildirim anında kafenizin yönetim paneline sesli uyarı ve titreşimle düşer. Dilediğiniz zaman bu özelliği panelden tek tıkla açıp kapatabilirsiniz.',
    },
    {
      q: 'Müşterilerin uygulama indirmesi veya hesap açması gerekiyor mu?',
      a: 'Asla! Müşteri masadaki QR kodu okuttuğunda veya NFC etiketine telefonunu yaklaştırdığında doğrudan tarayıcıda açılır. Şifre, e-posta veya kayıt formu doldurmadan saniyeler içinde menüye veya oyunlara ulaşırlar.',
    },
    {
      q: 'NFC etiketleri ve QR kodlar nasıl çalışır?',
      a: 'Her masanıza benzersiz, kalıcı ve tahmin edilmesi zor bir bağlantı atanır. Yönetim panelinizden tek tıkla yüksek çözünürlüklü baskıya hazır masa kartlarını ve QR kodları indirebilirsiniz. Aynı bağlantı standart NFC etiketlerine de saniyeler içinde yazılabilir.',
    },
    {
      q: 'Kafe olarak kendi sorularımızı ve menümüzü ekleyebilir miyiz?',
      a: 'Evet! Platform 200 adet hazır ve kaliteli Türkçe soruyla gelir. Ayrıca yönetim paneliniz üzerinden dilediğiniz zaman kendi kafenize özel soruları, buz kırıcıları, menü ürünlerinizi ve fiyatlarınızı kolayca yönetebilirsiniz.',
    },
    {
      q: 'Abonelik ücreti ve sözleşme şartları nasıldır?',
      a: 'Kafeler için aylık sabit abonelik modeliyle çalışıyoruz. Uzun süreli bağlayıcı sözleşmeler yoktur, dilediğiniz ay aboneliğinizi durdurabilirsiniz. Başlangıç paketi tüm masalarınızı ve tüm oyun modlarını kapsar.',
    },
  ];

  const marqueeItems = [
    '☕ QR Dijital Menü',
    '🔔 Tek Tıkla Garson Çağır',
    '💳 Nakit / Kredi Kartı Hesap İste',
    '🎯 7 Buz Kırıcı Mini Oyun',
    '⚡ Şifresiz Wi-Fi Bağlantısı',
    '🏆 Masalar Arası Düello',
    '📊 Kafe Nabzı Canlı Anket',
    '📱 Uygulama Yok • Anında Tarayıcıda',
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      <LeadModal isOpen={leadModalOpen} onClose={() => setLeadModalOpen(false)} />

      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-14 pb-12 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Editorial Headline & Copy */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream-200/80 border border-coffee-900/15 text-coffee-900 text-xs font-bold uppercase tracking-wider shadow-sm">
                <span className="w-2 h-2 rounded-full bg-terracotta-600 animate-pulse" />
                Kafeler İçin 3. Nesil Masa Portalı
              </div>

              <h1 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-coffee-950 tracking-tight leading-[1.12]">
                Kahvenin yanına <br />
                <span className="relative inline-block text-terracotta-600 italic">
                  güzel bir sohbet.
                  <svg 
                    className="absolute -bottom-2 left-0 w-full h-3 text-caramel-400 -z-10" 
                    viewBox="0 0 250 12" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 9C60 3 190 2 247 9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <p className="text-base sm:text-lg text-coffee-800 leading-relaxed font-normal max-w-xl">
                Aynı masada oturup telefonuna dalan dostlara, ilk buluşmanın sessizliğine veya derin sohbet arayanlara... Masadaki QR kodu okutun; dijital menü, hızlı garson çağırma ve 7 buz kırıcı oyun anında açılsın.
              </p>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  to="/t/demo-masa-1"
                  className="btn-primary !py-4 !px-7 !text-sm flex items-center justify-center gap-2.5 group"
                >
                  <Coffee className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  Örnek Masayı Gör
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => setLeadModalOpen(true)}
                  className="btn-secondary !py-4 !px-7 !text-sm flex items-center justify-center gap-2"
                >
                  Kafen İçin Başvur
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-coffee-700 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-pistachio-600 shrink-0" />
                  Uygulama indirme yok
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-pistachio-600 shrink-0" />
                  Şifre veya üyelik yok
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-pistachio-600 shrink-0" />
                  200+ özgün soru
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-pistachio-600 shrink-0" />
                  Garson & Hesap çağrısı
                </span>
              </div>
            </div>

            {/* Right Column: High Quality Hero Photography with Overlays */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Background decorative offset card */}
                <div className="absolute inset-0 bg-caramel-300 rounded-4xl translate-x-3 translate-y-3 border-2 border-coffee-950 -z-10" />

                {/* Main Hero Photo Container */}
                <div className="relative rounded-4xl border-2 border-coffee-950 bg-cream-100 overflow-hidden shadow-print aspect-[3/4]">
                  <img
                    src="/images/hero-table.jpg"
                    alt="Kafe masasında Türk kahvesi, latte ve tatlı sohbet"
                    width={600}
                    height={800}
                    fetchPriority="high"
                    className="w-full h-full object-cover select-none"
                  />
                  
                  {/* Subtle paper grain overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-coffee-950/60 via-transparent to-black/10 pointer-events-none" />

                  {/* Floating Pill Top: Waiter Call active */}
                  <div className="absolute top-4 right-4 bg-cream-50/95 backdrop-blur-md border-2 border-coffee-950 rounded-2xl px-3.5 py-2 shadow-print-sm flex items-center gap-2.5 animate-rise">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pistachio-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pistachio-600" />
                    </span>
                    <div className="text-left">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-coffee-600">Masa 04</p>
                      <p className="text-xs font-bold text-coffee-950">Garson Çağrıldı 🔔</p>
                    </div>
                  </div>

                  {/* Floating Pill Bottom: Active Conversation Card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-cream-50/95 backdrop-blur-md border-2 border-coffee-950 rounded-2xl p-3.5 shadow-print-sm space-y-1 text-left animate-rise">
                    <div className="flex items-center justify-between">
                      <span className="eyebrow text-terracotta-600 !text-[10px]">İkilemde Kal</span>
                      <span className="text-[10px] font-bold text-coffee-500">Masa Oyunu</span>
                    </div>
                    <p className="font-serif font-bold text-xs sm:text-sm text-coffee-950 leading-snug">
                      "Zaman makinesiyle geçmişe mi, sınırsız kahveyle geleceğe mi?"
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. MARQUEE STRIP (Infinite Ticker) */}
      <div className="relative -mx-4 sm:-mx-6 bg-coffee-950 text-cream-100 py-3.5 border-y-2 border-coffee-900 overflow-hidden shadow-inner">
        <div className="flex w-max marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span 
              key={index} 
              className="mx-6 text-xs sm:text-sm font-semibold tracking-wide uppercase flex items-center gap-2 text-cream-100"
            >
              {item}
              <span className="text-caramel-400 opacity-60">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* 3. HOW IT WORKS (3 Editorial Ticket Cards) */}
      <section id="nasil-calisir" className="scroll-mt-24 sm:scroll-mt-28 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-14">
          <span className="eyebrow text-terracotta-600">
            Sıfır Sürtünme • 3 Basit Adım
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-coffee-950">
            Masanızda Nasıl Çalışır?
          </h2>
          <p className="text-sm sm:text-base text-coffee-700 leading-relaxed">
            Misafirlerinize teknolojiyle boğuşmadan, doğal ve keyifli bir kafe deneyimi yaşatın.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="rounded-4xl bg-cream-100 border-2 border-coffee-950 shadow-print-sm hover:shadow-print transition-all duration-200 p-8 flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-terracotta-600 text-cream-50 flex items-center justify-center border-2 border-coffee-950 shadow-print-sm">
                  <QrCode className="w-7 h-7" />
                </div>
                <span className="font-serif font-black text-4xl text-coffee-300 group-hover:text-terracotta-500 transition-colors">
                  01
                </span>
              </div>
              <h3 className="font-serif font-bold text-xl text-coffee-950">
                Masadaki Koda Dokun
              </h3>
              <p className="text-sm text-coffee-700 leading-relaxed">
                Müşteri telefon kamerasıyla masadaki ahşap veya pleksi karttaki QR kodu okutur ya da NFC etiketine telefonunu dokundurur.
              </p>
            </div>
            <div className="ticket-divider pt-4 text-xs font-semibold text-coffee-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-pistachio-600" />
              Kamera & NFC destekli
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-4xl bg-cream-100 border-2 border-coffee-950 shadow-print-sm hover:shadow-print transition-all duration-200 p-8 flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-caramel-400 text-coffee-950 flex items-center justify-center border-2 border-coffee-950 shadow-print-sm">
                  <Smartphone className="w-7 h-7" />
                </div>
                <span className="font-serif font-black text-4xl text-coffee-300 group-hover:text-caramel-500 transition-colors">
                  02
                </span>
              </div>
              <h3 className="font-serif font-bold text-xl text-coffee-950">
                Anında Tarayıcıda Açılır
              </h3>
              <p className="text-sm text-coffee-700 leading-relaxed">
                İndirme, parola veya kayıt formu yok. Dijital menü, hızlı Wi-Fi ve anlık garson çağırma butonları tek ekranda hazır.
              </p>
            </div>
            <div className="ticket-divider pt-4 text-xs font-semibold text-coffee-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-pistachio-600" />
              2 saniyede açılış hızı
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-4xl bg-cream-100 border-2 border-coffee-950 shadow-print-sm hover:shadow-print transition-all duration-200 p-8 flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-pistachio-500 text-coffee-950 flex items-center justify-center border-2 border-coffee-950 shadow-print-sm">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <span className="font-serif font-black text-4xl text-coffee-300 group-hover:text-pistachio-600 transition-colors">
                  03
                </span>
              </div>
              <h3 className="font-serif font-bold text-xl text-coffee-950">
                Sohbet & Oyun Başlar
              </h3>
              <p className="text-sm text-coffee-700 leading-relaxed">
                Masadakiler 7 mini oyundan birini seçer; telefonu masanın ortasına bırakır. Kahkaha, nostalji ve derin sohbetler başlar.
              </p>
            </div>
            <div className="ticket-divider pt-4 text-xs font-semibold text-coffee-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-pistachio-600" />
              Grupça keyifli vakit
            </div>
          </div>

        </div>
      </section>

      {/* 4. THE 7 GAMES BENTO GRID (Dark Espresso Sanctuary) */}
      <section id="oyunlar" className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-coffee-950 text-cream-50 rounded-4xl sm:rounded-5xl p-7 sm:p-14 border-2 border-coffee-900 shadow-print paper-grain space-y-12">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-coffee-900">
            <div className="space-y-3 max-w-xl">
              <span className="eyebrow text-caramel-400">
                Masanın Ritmi • 7 Özgün Mini Oyun
              </span>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-cream-50">
                Masadaki Her Ruh Hâline Uygun
              </h2>
              <p className="text-sm sm:text-base text-coffee-300 leading-relaxed">
                İlk buluşmadan eski dostların buluşmasına, sessizliği kırmak veya eğlenceli bir yarışma başlatmak için özenle tasarlandı.
              </p>
            </div>

            <Link
              to="/games"
              className="btn-secondary !bg-cream-100 !text-coffee-950 !py-3 !px-5 !text-xs shrink-0 inline-flex items-center gap-2 self-start md:self-auto"
            >
              Tüm Oyunları İncele
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Game 1: Sohbeti Başlat */}
            <div className="rounded-3xl bg-coffee-900/80 border border-coffee-800 p-6 space-y-4 hover:border-terracotta-500/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-terracotta-600/30 text-terracotta-400 flex items-center justify-center border border-terracotta-500/30">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-cream-50">1. Sohbeti Başlat</h3>
                  <span className="text-[11px] text-coffee-400 font-medium">Buz Kırıcı • 50+ Soru</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-coffee-300 leading-relaxed">
                Buzları eriten, çocukluk hatıralarından hayat felsefesine uzanan tek kartlık samimi sorular. Oturum boyunca aynı soru tekrarlanmaz.
              </p>
            </div>

            {/* Game 2: İkilemde Kal */}
            <div className="rounded-3xl bg-coffee-900/80 border border-coffee-800 p-6 space-y-4 hover:border-caramel-400/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-caramel-400/30 text-caramel-300 flex items-center justify-center border border-caramel-400/30">
                  <Split className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-cream-50">2. İkilemde Kal</h3>
                  <span className="text-[11px] text-coffee-400 font-medium">Tartışma • 50+ İkilem</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-coffee-300 leading-relaxed">
                İki zor seçenek arasında seçim yapın. Seçimden sonra çıkan derin tartışma sorusuyla herkes kendi argümanını masaya koysun!
              </p>
            </div>

            {/* Game 3: Kim Daha Muhtemel? */}
            <div className="rounded-3xl bg-coffee-900/80 border border-coffee-800 p-6 space-y-4 hover:border-pistachio-400/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-pistachio-500/30 text-pistachio-400 flex items-center justify-center border border-pistachio-400/30">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-cream-50">3. Kim Daha Muhtemel?</h3>
                  <span className="text-[11px] text-coffee-400 font-medium">Grup Oyunu • 50+ Senaryo</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-coffee-300 leading-relaxed">
                Masadakilerin adlarını yazın. "Aramızda kim..." sorusuna parmaklar aynı anda kalksın, en çok işaret edilen turun galibi olsun.
              </p>
            </div>

            {/* Game 4: Ne Kadar Tanıyoruz? */}
            <div className="rounded-3xl bg-coffee-900/80 border border-coffee-800 p-6 space-y-4 hover:border-terracotta-400/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-500/30 text-rose-300 flex items-center justify-center border border-rose-400/30">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-cream-50">4. Ne Kadar Tanıyoruz?</h3>
                  <span className="text-[11px] text-coffee-400 font-medium">Dostluk Testi • 50+ Soru</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-coffee-300 leading-relaxed">
                Sırası gelen kişinin cevabını masadaki diğerleri tahmin etsin. Doğru bilenler puan toplasın, kimin kimi daha iyi tanıdığı ortaya çıksın.
              </p>
            </div>

            {/* Game 5: Kafe Trivia */}
            <div className="rounded-3xl bg-coffee-900/80 border border-coffee-800 p-6 space-y-4 hover:border-caramel-400/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/30 text-amber-300 flex items-center justify-center border border-amber-400/30">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-cream-50">5. Kafe Trivia</h3>
                  <span className="text-[11px] text-coffee-400 font-medium">Genel Kültür • 4 Seçenek</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-coffee-300 leading-relaxed">
                Sinema, müzik, tarih ve kahve kültürü üzerine eğlenceli trivia soruları. Masadakilerle bilginizi yarıştıran hızlı tempolu test.
              </p>
            </div>

            {/* Game 6 & 7: Masa Düellosu + Kafe Nabzı */}
            <div className="rounded-3xl bg-coffee-900/80 border border-coffee-800 p-6 space-y-4 hover:border-pistachio-400/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-500/30 text-blue-300 flex items-center justify-center border border-blue-400/30">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-cream-50">6. Düello & Kafe Nabzı</h3>
                  <span className="text-[11px] text-coffee-400 font-medium">İnteraktif • Masalar Arası</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-coffee-300 leading-relaxed">
                İster yan masayla puan düellosuna girin, ister kafenizin "Günün Sorusu" anketine oy verip diğer masaların tercihlerini canlı izleyin.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. MASA DENEYİMİ VE SERVİS ÇAĞRISI ÖZELLİKLERİ */}
      <section id="kafeler-icin" className="scroll-mt-24 sm:scroll-mt-28 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-4xl bg-cream-100 border-2 border-coffee-950 p-8 sm:p-12 shadow-print-sm space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="eyebrow text-terracotta-600">
              Sadece Oyun Değil • Eksiksiz Masa Hizmeti
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-coffee-950">
              Masada İhtiyaç Duyulan Her Şey Tek Ekranda
            </h2>
            <p className="text-sm sm:text-base text-coffee-700 leading-relaxed">
              Müşteri memnuniyetini artırırken garsonların adımlarını ve servis süresini yarı yarıya indirin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1: Garson Çağır */}
            <div className="p-6 rounded-3xl bg-cream-50 border-2 border-coffee-900/15 shadow-sm space-y-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-pistachio-100 text-pistachio-800 flex items-center justify-center border border-pistachio-300">
                <BellRing className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-coffee-950">Garson Çağır</h3>
              <p className="text-xs sm:text-sm text-coffee-700 leading-relaxed">
                Göz teması kurmak için el sallamaya son. Tek tıkla ilgili masanın garson çağrısı personele anlık sesli düşer.
              </p>
            </div>

            {/* Feature 2: Hesap İste */}
            <div className="p-6 rounded-3xl bg-cream-50 border-2 border-coffee-900/15 shadow-sm space-y-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-terracotta-100 text-terracotta-800 flex items-center justify-center border border-terracotta-300">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-coffee-950">Hesap İste</h3>
              <p className="text-xs sm:text-sm text-coffee-700 leading-relaxed">
                Nakit veya POS cihazı seçeneğiyle hesabı masaya çağırın. Garson masaya direkt hazır cihazla gelsin.
              </p>
            </div>

            {/* Feature 3: Dijital Menü */}
            <div className="p-6 rounded-3xl bg-cream-50 border-2 border-coffee-900/15 shadow-sm space-y-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-caramel-100 text-caramel-800 flex items-center justify-center border border-caramel-300">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-coffee-950">Dijital Menü</h3>
              <p className="text-xs sm:text-sm text-coffee-700 leading-relaxed">
                Fotoğraflı, açıklamalı ve kategorize güncel menü. Panelden anında fiyat veya ürün güncellemesi yapın.
              </p>
            </div>

            {/* Feature 4: Kolay Wi-Fi */}
            <div className="p-6 rounded-3xl bg-cream-50 border-2 border-coffee-900/15 shadow-sm space-y-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center border border-blue-300">
                <Wifi className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-coffee-950">Şifresiz Wi-Fi</h3>
              <p className="text-xs sm:text-sm text-coffee-700 leading-relaxed">
                Karmaşık şifre sorma devri kapandı. Misafirleriniz tek tıkla şifreyi kopyalar veya doğrudan bağlanır.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. CAFE B2B SECTION (With Barista Owner Photo) */}
      <section id="b2b" className="scroll-mt-24 sm:scroll-mt-28 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Barista Photo */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute inset-0 bg-terracotta-500 rounded-4xl translate-x-3 translate-y-3 border-2 border-coffee-950 -z-10" />
              
              <div className="rounded-4xl border-2 border-coffee-950 overflow-hidden shadow-print aspect-[3/4] bg-cream-100 relative">
                <img
                  src="/images/barista-owner.jpg"
                  alt="Kafe işletmecisi masaları yönetirken"
                  width={600}
                  height={800}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                
                {/* Stats badge overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-cream-50/95 backdrop-blur-md border-2 border-coffee-950 rounded-2xl p-4 shadow-print-sm flex items-center justify-around text-center">
                  <div>
                    <p className="font-serif font-black text-2xl text-terracotta-600">+%35</p>
                    <p className="text-[11px] font-bold text-coffee-700">Masa Kalış Süresi</p>
                  </div>
                  <div className="w-px h-8 bg-coffee-200" />
                  <div>
                    <p className="font-serif font-black text-2xl text-pistachio-700">5 Dk</p>
                    <p className="text-[11px] font-bold text-coffee-700">Kolay Kurulum</p>
                  </div>
                  <div className="w-px h-8 bg-coffee-200" />
                  <div>
                    <p className="font-serif font-black text-2xl text-coffee-950">0 TL</p>
                    <p className="text-[11px] font-bold text-coffee-700">Cihaz Masrafı</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: B2B Benefits & Value Prop */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <span className="eyebrow text-terracotta-600">
              Kafeler İçin Değer Önerisi
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-coffee-950 leading-tight">
              Kafenizi Sadece Kahve İçilen Değil, Hatırlanan Bir Mekân Yapın
            </h2>
            <p className="text-base text-coffee-800 leading-relaxed font-normal">
              Gelen müşteriler sessizce telefonlarına bakmak yerine masalarında güldüklerinde, mekanınız onların "ikinci evi" ve favori buluşma noktası haline gelir.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-cream-100 border border-coffee-200/80">
                <div className="w-8 h-8 rounded-xl bg-pistachio-200 text-pistachio-800 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-coffee-950">Masa Kalış Süresi ve İkinci Sipariş</h4>
                  <p className="text-xs text-coffee-700 mt-0.5">Oyuna dalan misafirler masada daha keyifle vakit geçirir, ikinci fincan kahve veya tatlı sipariş olasılığı artar.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-cream-100 border border-coffee-200/80">
                <div className="w-8 h-8 rounded-xl bg-pistachio-200 text-pistachio-800 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-coffee-950">Sıfır Donanım & Operasyonel Kolaylık</h4>
                  <p className="text-xs text-coffee-700 mt-0.5">Pahalı tablet veya POS donanımı gerekmez. Masalarınıza şık bir ahşap/pleksi QR kart yerleştirmeniz yeterlidir.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-cream-100 border border-coffee-200/80">
                <div className="w-8 h-8 rounded-xl bg-pistachio-200 text-pistachio-800 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-coffee-950">Kendi Sorularınızı ve Markanızı Ekleyin</h4>
                  <p className="text-xs text-coffee-700 mt-0.5">Yönetim panelinden kafenizin adını, logosunu ve kafenize özel komik veya tematik soruları dakikalar içinde ekleyin.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setLeadModalOpen(true)}
                className="btn-primary !py-4 !px-8 !text-sm flex items-center gap-2"
              >
                Kafeniz İçin Başvurun
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 7. SOCIAL PROOF & CAFE ATMOSPHERE PHOTO */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-4xl sm:rounded-5xl border-2 border-coffee-950 overflow-hidden shadow-print aspect-[16/9] sm:aspect-[21/9]">
          <img
            src="/images/friends-cafe.jpg"
            alt="Kafede neşeyle sohbet eden arkadaşlar"
            width={1200}
            height={600}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-coffee-950 via-coffee-950/40 to-transparent" />
          
          <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-12 right-6 sm:right-12 max-w-2xl text-left space-y-3">
            <span className="eyebrow text-caramel-400">Gerçek Kafe Deneyimi</span>
            <p className="font-serif font-bold text-lg sm:text-2xl text-cream-50 leading-snug">
              "Eskiden masada herkes telefonuna bakardı. Şimdi masadaki ikilemleri tartışmaktan kahveler soğuyor ama masadan kahkaha eksik olmuyor."
            </p>
            <p className="text-xs sm:text-sm text-coffee-300 font-medium">
              — Kadıköy 3. Nesil Kafe Müdavimi & İşletmecisi
            </p>
          </div>
        </div>
      </section>

      {/* 8. PRICING SECTION */}
      <section id="fiyat" className="scroll-mt-24 sm:scroll-mt-28 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-12">
          <span className="eyebrow text-terracotta-600">
            Şeffaf ve Sade Model
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-coffee-950">
            Kafe Başlangıç Paketi
          </h2>
          <p className="text-sm sm:text-base text-coffee-700 max-w-md mx-auto">
            Masa başına gizli ek ücret yok. Tüm masalarınız ve özellikler için tek sabit aylık abonelik.
          </p>
        </div>

        <div className="bg-cream-100 rounded-4xl p-8 sm:p-12 border-2 border-coffee-950 shadow-print space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-terracotta-600 border-b-2 border-l-2 border-coffee-950 text-cream-50 text-[11px] font-bold px-5 py-1.5 rounded-bl-2xl uppercase tracking-wider">
            Lansmana Özel
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b-2 border-coffee-200">
            <div>
              <h3 className="font-serif font-bold text-2xl text-coffee-950">
                {APP_CONFIG.pricing.name}
              </h3>
              <p className="text-xs sm:text-sm text-coffee-700 mt-1">
                {APP_CONFIG.pricing.description}
              </p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <span className="font-serif font-black text-4xl sm:text-5xl text-coffee-950">
                {APP_CONFIG.pricing.price} {APP_CONFIG.pricing.currency}
              </span>
              <span className="text-xs text-coffee-600 font-bold ml-1 uppercase">
                / {APP_CONFIG.pricing.period}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {APP_CONFIG.pricing.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-coffee-800">
                <CheckCircle2 className="w-4 h-4 text-pistachio-600 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
            <div className="flex items-start gap-3 text-xs sm:text-sm text-coffee-800">
              <CheckCircle2 className="w-4 h-4 text-pistachio-600 shrink-0 mt-0.5" />
              <span>Garson çağırma ve hesap isteme modülü dahil</span>
            </div>
            <div className="flex items-start gap-3 text-xs sm:text-sm text-coffee-800">
              <CheckCircle2 className="w-4 h-4 text-pistachio-600 shrink-0 mt-0.5" />
              <span>Baskıya hazır QR ve NFC masa standı şablonları</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3.5">
            <button
              onClick={() => setLeadModalOpen(true)}
              className="w-full sm:flex-1 btn-primary !py-4 !text-sm text-center justify-center"
            >
              14 Gün Ücretsiz Deneme Başlat
            </button>
            <Link
              to="/t/demo-masa-1"
              className="w-full sm:w-auto btn-secondary !py-4 !text-sm text-center justify-center"
            >
              Canlı Masa Demosunu Gör
            </Link>
          </div>

          <p className="text-[11px] text-coffee-600 text-center">
            * Kredi kartı zorunluluğu yoktur. İstediğiniz an herhangi bir taahhüt olmadan iptal edebilirsiniz.
          </p>
        </div>
      </section>

      {/* 9. FAQ SECTION */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-10">
          <span className="eyebrow text-terracotta-600">Sorularınız & Yanıtlar</span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-coffee-950">
            Sıkça Sorulan Sorular
          </h2>
          <p className="text-xs sm:text-sm text-coffee-700">
            Aklınıza takılan tüm soruların net yanıtları
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-cream-100 rounded-2xl border-2 border-coffee-950/20 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-coffee-950 flex items-center justify-between gap-3 hover:bg-cream-200/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-coffee-700 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-coffee-700 leading-relaxed border-t border-coffee-200/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. CLOSING HERO CTA BANNER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-4xl bg-terracotta-600 text-cream-50 p-8 sm:p-14 text-center space-y-6 border-2 border-coffee-950 shadow-print overflow-hidden">
          
          {/* Background pattern */}
          <div 
            className="absolute inset-0 opacity-10 bg-repeat pointer-events-none" 
            style={{ backgroundImage: `url('/images/pattern-cups.jpg')`, backgroundSize: '240px' }} 
          />

          <div className="relative z-10 space-y-6 max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-cream-50 text-terracotta-600 flex items-center justify-center mx-auto border-2 border-coffee-950 shadow-print-sm">
              <Coffee className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif font-black text-2xl sm:text-4xl text-cream-50 tracking-tight">
                Kafenizin Masalarında Sohbet Başlasın
              </h2>
              <p className="text-xs sm:text-sm text-cream-100 leading-relaxed">
                Misafirlerinize kahve kadar sıcak bir masa deneyimi sunmak için hemen ücretsiz denemenizi başlatın.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setLeadModalOpen(true)}
                className="w-full sm:w-auto btn-dark !py-3.5 !px-8 !text-sm flex items-center justify-center gap-2"
              >
                Hemen Başvurun
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <Link
                to="/t/demo-masa-1"
                className="w-full sm:w-auto btn-secondary !bg-cream-50 !py-3.5 !px-8 !text-sm text-center justify-center"
              >
                Masa Deneyimini Gör
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
