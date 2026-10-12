import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Lock, EyeOff, Server, HelpCircle } from 'lucide-react';
import { APP_CONFIG } from '../lib/config';

const LAST_UPDATE_DATE = new Date().toLocaleDateString('tr-TR');

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Navigation */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-coffee-700 hover:text-coffee-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Ana Sayfaya Dön
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-coffee-200">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Şeffaf Gizlilik ve KVKK Politikası</span>
        </div>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-coffee-950">
          Gizlilik ve Veri Güvenliği
        </h1>
        <p className="text-xs sm:text-sm text-coffee-600">
          Son güncelleme: {LAST_UPDATE_DATE} • {APP_CONFIG.brandName}
        </p>
      </div>

      {/* Highlights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-coffee-200 shadow-warm-sm space-y-2">
          <Lock className="w-5 h-5 text-emerald-600" />
          <h2 className="font-bold text-sm text-coffee-950">Üyelik ve Form Yok</h2>
          <p className="text-xs text-coffee-600">Müşterilerden isim, telefon, e-posta veya parola toplanmaz.</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-coffee-200 shadow-warm-sm space-y-2">
          <EyeOff className="w-5 h-5 text-emerald-600" />
          <h2 className="font-bold text-sm text-coffee-950">Cevaplar Kaydedilmez</h2>
          <p className="text-xs text-coffee-600">Oyunlardaki tercihler ve masadaki puanlar sunucuda ASLA saklanmaz.</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-coffee-200 shadow-warm-sm space-y-2">
          <Server className="w-5 h-5 text-emerald-600" />
          <h2 className="font-bold text-sm text-coffee-950">Sadece Anonim Sayaç</h2>
          <p className="text-xs text-coffee-600">Yalnızca toplam QR okutma ve oyun açılış adedi sayılır.</p>
        </div>
      </div>

      {/* Policy Details */}
      <div className="space-y-8 text-sm text-coffee-800 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-serif font-bold text-xl text-coffee-950">
            1. Temel İlkemiz: Mahremiyet ve Sıfır Takip
          </h2>
          <p>
            {APP_CONFIG.brandName} olarak, kafelerde masaya oturan insanların kendi aralarındaki özel sohbetlerin mahremiyetine saygı duyuyoruz. Platformumuz ticari amaçlı profil çıkarma, reklam hedefleme veya kullanıcı izleme (fingerprinting) teknolojilerini kesinlikle kullanmaz.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif font-bold text-xl text-coffee-950">
            2. Müşteri Tarafında Toplanan Veriler
          </h2>
          <p>
            Müşteriler masadaki QR veya NFC'yi okuttuğunda:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-coffee-700">
            <li><strong>Masa Açılış Olayı:</strong> Sadece hangi masanın QR kodunun okutulduğuna dair zaman damgası (örn: Masa 04 açıldı).</li>
            <li><strong>Oyun Başlatma Olayı:</strong> Hangi oyunun başlatıldığına dair genel sayaç artışı (örn: Sohbeti Başlat tıklandı).</li>
          </ul>
          <p className="pt-1">
            <strong>Toplanmayanlar:</strong> Müşteri cihazının IP adresi veya parmak iziyle kimlik eşleştirmesi yapılmaz. Oyunda girilen oyuncu adları veya ikilem cevapları yalnızca telefonunuzun tarayıcı belleğinde geçici olarak tutulur, sunucumuza gönderilmez.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif font-bold text-xl text-coffee-950">
            3. Çerezler (Cookies) ve Yerel Depolama
          </h2>
          <p>
            Sitemizde üçüncü taraf reklam veya takip çerezleri bulunmaz. Yalnızca oturumun sağlıklı işlemesi (masadaki aktif turun sıfırlanmaması ve yönetici oturumu) için yerel depolama (sessionStorage/localStorage) kullanılır.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif font-bold text-xl text-coffee-950">
            4. Kafe Başvuruları ve Yönetici Bilgileri
          </h2>
          <p>
            Platformu kafesinde kullanmak isteyen işletme sahiplerinin "Kafen İçin Başvur" formunda ilettiği ad, telefon ve e-posta bilgileri yalnızca hizmet sözleşmesi, kurulum desteği ve iletişim amaçlı kullanılır; üçüncü taraflarla paylaşılmaz.
          </p>
        </section>

        <section className="p-4 rounded-2xl bg-caramel-50 border border-caramel-200 text-xs text-coffee-800 space-y-2">
          <div className="flex items-center gap-2 font-bold text-caramel-900">
            <HelpCircle className="w-4 h-4 text-caramel-700" />
            <span>Yasal Uyarı</span>
          </div>
          <p>
            Bu metin platformun mevcut veri işleme faaliyetlerini gerçeğe uygun şekilde açıklayan bir bilgilendirmedir. Kurumsal işletmelerin kendi özel aydınlatma metinlerini ve KVKK gereksinimlerini hukuk danışmanlarıyla doğrulamaları tavsiye edilir.
          </p>
        </section>
      </div>
    </div>
  );
};
