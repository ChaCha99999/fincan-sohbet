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
  ChevronDown 
} from 'lucide-react';
import { APP_CONFIG } from '../lib/config';
import { LeadModal } from '../components/LeadModal';

export const LandingPage: React.FC = () => {
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Fincan Sohbet yalnızca bir QR menü uygulaması mıdır?',
      a: 'Hayır, sıradan bir QR menüden çok daha fazlasıdır! Masada tek bir QR kod üzerinden hem kafenizin güncel dijital menüsünü ve Wi-Fi bilgilerini sunar, hem de masadaki misafirlerin birbirleriyle eğlenceli mini oyunlarla sohbet etmelerini sağlayan hibrit bir masa deneyim platformudur.',
    },
    {
      q: 'Müşterilerin uygulama indirmesi veya hesap açması gerekiyor mu?',
      a: 'Asla! Müşteri masadaki QR kodu okuttuğunda veya NFC etiketine telefonunu yaklaştırdığında doğrudan tarayıcıda açılır. Şifre, e-posta veya kayıt formu doldurmadan anında oynamaya başlarlar.',
    },
    {
      q: 'NFC etiketleri ve QR kodlar nasıl çalışır?',
      a: 'Her masanıza benzersiz, kalıcı ve tahmin edilmesi zor bir bağlantı atanır. Yönetim panelinizden tek tıkla yüksek çözünürlüklü baskıya hazır masa kartlarını ve QR kodları indirebilirsiniz. Aynı bağlantı standart NFC etiketlerine de saniyeler içinde yazılabilir.',
    },
    {
      q: 'Kafe olarak kendi sorularımızı ekleyebilir miyiz?',
      a: 'Evet! Platform 200 adet hazır ve kaliteli Türkçe soruyla gelir. Ayrıca yönetim paneliniz üzerinden dilediğiniz zaman kendi kafenize özel soruları, buz kırıcıları veya etkinlik sorularını kolayca ekleyebilirsiniz.',
    },
    {
      q: 'Abonelik ücreti ve sözleşme şartları nasıldır?',
      a: 'Kafeler için aylık sabit abonelik modeliyle çalışıyoruz. Uzun süreli bağlayıcı sözleşmeler yoktur, dilediğiniz ay aboneliğinizi durdurabilirsiniz. Başlangıç paketi tüm masalarınızı ve özellikleri kapsar.',
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      <LeadModal isOpen={leadModalOpen} onClose={() => setLeadModalOpen(false)} />

      {/* 1. HERO SECTION */}
      <section className="relative pt-10 sm:pt-20 pb-16 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-7">
          <h1 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-coffee-950 tracking-tight leading-[1.18] max-w-3xl mx-auto">
            Kahvenin Yanına <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta-600 via-caramel-600 to-terracotta-700">
              Güzel Bir Sohbet.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-coffee-700 max-w-2xl mx-auto leading-relaxed font-normal">
            Aynı masada oturup telefonuna dalan dostlara, ilk buluşmanın sessizliğine veya derin sohbet arayanlara... Masadaki QR kodu okutun, fincanlar soğumadan sohbeti başlatın.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              to="/t/demo-masa-1"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-base shadow-warm hover:shadow-warm-lg transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <Coffee className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Masa Deneyimini Dene
            </Link>

            <button
              onClick={() => setLeadModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-cream-100 text-coffee-900 border-2 border-coffee-200 font-bold text-base shadow-warm-sm transition-colors flex items-center justify-center gap-2"
            >
              Kafen İçin Başvur
              <ArrowRight className="w-4 h-4 text-terracotta-600" />
            </button>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-coffee-600">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Uygulama indirme yok
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Şifre veya üyelik yok
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              200+ özgün Türkçe soru
            </span>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (3 STEPS) */}
      <section id="nasil-calisir" className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
            Sıfır Sürtünme • Hızlı Başlangıç
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-coffee-950">
            Masanızda Nasıl Çalışır?
          </h2>
          <p className="text-sm text-coffee-700 leading-relaxed">
            Müşterilerinize teknolojiyle boğuşmadan, doğal bir kafe deneyimi yaşatın.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="p-8 rounded-3xl bg-white border border-coffee-200 shadow-warm-sm hover:shadow-warm transition-shadow space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center mx-auto">
              <QrCode className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-terracotta-700 uppercase tracking-wider">
                Adım 1
              </span>
              <h3 className="font-serif font-bold text-xl text-coffee-950">
                Masadaki QR Kodu Okutun
              </h3>
              <p className="text-xs sm:text-sm text-coffee-700 leading-relaxed">
                Müşteri telefon kamerasıyla masadaki ahşap veya akrilik karttaki QR kodu tarar veya NFC etiketine telefonunu yaklaştırır.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-8 rounded-3xl bg-white border border-coffee-200 shadow-warm-sm hover:shadow-warm transition-shadow space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-caramel-100 text-caramel-700 flex items-center justify-center mx-auto">
              <Smartphone className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-caramel-700 uppercase tracking-wider">
                Adım 2
              </span>
              <h3 className="font-serif font-bold text-xl text-coffee-950">
                Uygulama İndirmeden Açılır
              </h3>
              <p className="text-xs sm:text-sm text-coffee-700 leading-relaxed">
                App Store veya Google Play indirmesi yok. Şifre ve üyelik formu yok. Tarayıcıda anında hafif ve mobil uyumlu ekran açılır.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-8 rounded-3xl bg-white border border-coffee-200 shadow-warm-sm hover:shadow-warm transition-shadow space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-coffee-100 text-coffee-800 flex items-center justify-center mx-auto">
              <MessageCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-coffee-800 uppercase tracking-wider">
                Adım 3
              </span>
              <h3 className="font-serif font-bold text-xl text-coffee-950">
                Sohbet ve Oyun Başlar
              </h3>
              <p className="text-xs sm:text-sm text-coffee-700 leading-relaxed">
                Masadakiler 4 farklı mini oyundan birini seçer; kahkaha, nostalji veya derin felsefi sohbetler masayı sarar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GAME CATEGORIES SHOWCASE */}
      <section className="bg-coffee-900 text-white py-16 rounded-3xl max-w-6xl mx-auto px-6 sm:px-10">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-caramel-400">
            4 Eğlenceli Mini Oyun
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-cream-50">
            Masadaki Her Ruh Hâline Uygun
          </h2>
          <p className="text-sm text-coffee-300 leading-relaxed">
            Sadece basit sorular değil; farklı arkadaşlık seviyeleri ve gruplar için tasarlanmış dört özgün oyun mekaniği.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Game 1 */}
          <div className="p-6 rounded-2xl bg-coffee-800/80 border border-coffee-700/80 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-terracotta-500/20 text-terracotta-400 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-cream-50">1. Sohbeti Başlat</h3>
                <span className="text-[11px] text-coffee-400">50 Soru • 15-30 dk</span>
              </div>
            </div>
            <p className="text-xs text-coffee-300 leading-relaxed">
              Buzları eriten, çocukluk hatıralarından hayat felsefesine uzanan tek kartlık samimi sorular. Oturum boyunca aynı soru tekrar gelmez.
            </p>
          </div>

          {/* Game 2 */}
          <div className="p-6 rounded-2xl bg-coffee-800/80 border border-coffee-700/80 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-caramel-500/20 text-caramel-400 flex items-center justify-center">
                <Split className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-cream-50">2. İkilemde Kal</h3>
                <span className="text-[11px] text-coffee-400">50 İkilem • 10-20 dk</span>
              </div>
            </div>
            <p className="text-xs text-coffee-300 leading-relaxed">
              İki zor seçenek arasında seçim yapın. Seçimden sonra çıkan tartışma sorusuyla herkes kendi argümanını masaya koysun!
            </p>
          </div>

          {/* Game 3 */}
          <div className="p-6 rounded-2xl bg-coffee-800/80 border border-coffee-700/80 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-cream-50">3. Kim Daha Muhtemel?</h3>
                <span className="text-[11px] text-coffee-400">50 Soru • 15-25 dk</span>
              </div>
            </div>
            <p className="text-xs text-coffee-300 leading-relaxed">
              Oyuncuların adlarını telefona girin. "Grupta kim..." sorusuna parmaklar aynı anda kalksın, en çok oy alan turun galibi olsun.
            </p>
          </div>

          {/* Game 4 */}
          <div className="p-6 rounded-2xl bg-coffee-800/80 border border-coffee-700/80 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-cream-50">4. Birbirimizi Ne Kadar Tanıyoruz?</h3>
                <span className="text-[11px] text-coffee-400">50 Soru • 20-35 dk</span>
              </div>
            </div>
            <p className="text-xs text-coffee-300 leading-relaxed">
              Sırası gelen kişinin cevabını masadaki diğerleri tahmin etmeye çalışır. Doğru bilenler puan toplar, turun şampiyonu belirlenir.
            </p>
          </div>
        </div>

        <div className="text-center pt-8">
          <Link
            to="/games"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-coffee-950 font-bold text-xs hover:bg-cream-100 transition-colors"
          >
            Tüm Oyunları ve Örnek Soruları İncele
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 4. CAFE B2B BENEFITS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
              Kafeler İçin Değer Önerisi
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-coffee-950 leading-tight">
              Kafenizi Sadece Kahve İçilen Değil, Hatırlanan Bir Mekan Yapın
            </h2>
            <p className="text-sm text-coffee-700 leading-relaxed">
              Gelen müşteriler sessizce telefonlarına bakmak yerine masalarında eğlenip güldüklerinde, mekanınız onların "favori kahvecisi" haline gelir.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-coffee-900">Masa Kalış Süresi ve İkinci Sipariş</h4>
                  <p className="text-xs text-coffee-600">Oyuna dalan misafirler masada daha keyifle vakit geçirir, ikinci fincan kahve veya tatlı sipariş olasılığı artar.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-coffee-900">Sıfır Donanım ve Operasyonel Yük</h4>
                  <p className="text-xs text-coffee-600">Özel tablet veya cihaz gerekmez. Masanıza şık bir ahşap/pleksi QR kart koymanız yeterlidir.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-coffee-900">Kendi Sorularınızı ve Markanızı Ekleyin</h4>
                  <p className="text-xs text-coffee-600">Yönetim panelinizden kafenizin adını, masalarını yönetebilir ve kendi özel sorularınızı oluşturabilirsiniz.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-cream-100 rounded-3xl p-8 border border-coffee-200/80 space-y-6">
            <h3 className="font-serif font-bold text-2xl text-coffee-950">
              5 Dakikada Kafenizi Yayına Alın
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-coffee-200">
                <div className="w-8 h-8 rounded-xl bg-terracotta-100 text-terracotta-700 font-bold text-xs flex items-center justify-center">1</div>
                <div className="text-xs">
                  <p className="font-bold text-coffee-900">Panelden Masalarınızı Ekleyin</p>
                  <p className="text-coffee-600">Masa 1, Masa 2, Bahçe 3 gibi etiketleri saniyeler içinde oluşturun.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-coffee-200">
                <div className="w-8 h-8 rounded-xl bg-terracotta-100 text-terracotta-700 font-bold text-xs flex items-center justify-center">2</div>
                <div className="text-xs">
                  <p className="font-bold text-coffee-900">QR Kodları ve Baskı Kartını İndirin</p>
                  <p className="text-coffee-600">Tek tıkla SVG veya PNG olarak indirin, doğrudan yazdırın.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-coffee-200">
                <div className="w-8 h-8 rounded-xl bg-terracotta-100 text-terracotta-700 font-bold text-xs flex items-center justify-center">3</div>
                <div className="text-xs">
                  <p className="font-bold text-coffee-900">Masaya Yerleştirin, Sohbeti İzleyin</p>
                  <p className="text-coffee-600">Müşterileriniz kahvelerini yudumlarken eğlenmeye başlasın.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setLeadModalOpen(true)}
              className="w-full py-3.5 rounded-2xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm shadow-warm transition-transform active:scale-98"
            >
              Kafeniz İçin Hemen Başvurun
            </button>
          </div>
        </div>
      </section>

      {/* 5. PRICING SECTION (CONFIGURABLE DRAFT PRICING) */}
      <section id="fiyat" className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
            Şeffaf ve Sade Model
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-coffee-950">
            Kafe Başlangıç Paketi
          </h2>
          <p className="text-sm text-coffee-700 max-w-md mx-auto">
            Masa başına gizli ek ücret yok. Tüm masalarınız için tek bir sabit aylık abonelik.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-terracotta-300 shadow-warm-lg space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-terracotta-600 text-white text-[11px] font-bold px-4 py-1 rounded-bl-2xl">
            Tavsiye Edilen
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-coffee-100">
            <div>
              <h3 className="font-serif font-bold text-2xl text-coffee-950">
                {APP_CONFIG.pricing.name}
              </h3>
              <p className="text-xs text-coffee-600 mt-1">
                {APP_CONFIG.pricing.description}
              </p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <span className="font-serif font-black text-4xl text-coffee-950">
                {APP_CONFIG.pricing.price} {APP_CONFIG.pricing.currency}
              </span>
              <span className="text-xs text-coffee-500 font-medium ml-1">
                / {APP_CONFIG.pricing.period}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {APP_CONFIG.pricing.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-coffee-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => setLeadModalOpen(true)}
              className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm shadow-warm transition-transform active:scale-98"
            >
              14 Gün Ücretsiz Deneme Başlat
            </button>
            <Link
              to="/t/demo-masa-1"
              className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-cream-100 hover:bg-cream-200 text-coffee-900 font-bold text-sm transition-colors text-center"
            >
              Canlı Demoyu İncele
            </Link>
          </div>

          <p className="text-[11px] text-coffee-500 text-center">
            * Fiyatlandırma başlangıç taslağıdır ve lansman dönemine özeldir. Kredi kartı zorunluluğu olmadan başvuru yapabilirsiniz.
          </p>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-10">
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-coffee-950">
            Sıkça Sorulan Sorular
          </h2>
          <p className="text-xs sm:text-sm text-coffee-700">
            Aklınıza takılan soruların yanıtları
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-coffee-200/80 overflow-hidden shadow-warm-sm"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm text-coffee-950 flex items-center justify-between gap-3 hover:bg-cream-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-coffee-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-coffee-700 leading-relaxed border-t border-coffee-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. BOTTOM BANNER CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-coffee-900 to-coffee-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-warm-lg">
          <div className="w-12 h-12 rounded-2xl bg-terracotta-600 flex items-center justify-center mx-auto text-white">
            <Coffee className="w-6 h-6" />
          </div>
          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-cream-50">
              Kafenizin Masalarında Sohbet Başlasın
            </h2>
            <p className="text-xs sm:text-sm text-coffee-300 leading-relaxed">
              Müşterilerinize kahve kadar sıcak bir masa deneyimi sunmak için bizimle iletişime geçin.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setLeadModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm shadow-warm"
            >
              Hemen Başvurun
            </button>
            <Link
              to="/t/demo-masa-1"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-coffee-800 hover:bg-coffee-700 text-coffee-100 font-bold text-sm"
            >
              Masa Deneyimi Ekranını Gör
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
