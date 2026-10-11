# Fincan Sohbet ☕ — Kafeler İçin QR & NFC Masa Sosyalleşme ve Mini Oyun Platformu

> **"Kahveni al, bir soru seç, sohbeti başlat."**

Fincan Sohbet, kafelerde aynı masada oturan arkadaşların, sevgililerin veya yeni tanışan insanların sohbet edecek konu bulamadıkları anlarda kullanabilecekleri modern bir web platformudur.

Bu bir **QR menü veya sipariş sistemi değildir**. Kafelerin masa deneyimini eğlenceli ve unutulmaz hâle getiren B2B bir dijital sosyalleşme ürünüdür.

---

## 🌟 Öne Çıkan Özellikler

- **Sıfır Sürtünme (Zero Friction):** Müşterilerin uygulama indirmesine, parola belirlemesine veya hesap açmasına gerek yoktur. QR kod veya NFC ile doğrudan tarayıcıda açılır.
- **200+ Özgün ve Doğal Türkçe Soru:** Klişe olmayan, gerçek hayatta konuşulabilecek derin, eğlenceli ve samimi 200 adet hazır soru havuzu.
- **4 İnteraktif Mini Oyun (Tek Telefondan Grup Oyunu):**
  1. **Sohbeti Başlat (`sohbeti-baslat`):** Buz kırıcı, nostaljik ve derin tek kartlık sorular. Oturum boyunca tekrarsız soru akışı ve etiket filtreleri.
  2. **İkilemde Kal (`ikilemde-kal`):** İki zor seçenek arasında seçim yapma ve ardından gelen tartışma sorularıyla masada fikir savaşı.
  3. **Kim Daha Muhtemel? (`kim-daha-muhtemel`):** Oyuncu adlarını girip "Grupta kim..." sorusuna aynı anda oy verme ve canlı skor tablosu.
  4. **Birbirimizi Ne Kadar Tanıyoruz? (`ne-kadar-taniyoruz`):** Sırayla bir oyuncunun cevabını tahmin etme, doğru bilenlere puan verme ve tur şampiyonu belirleme.
- **QR ve NFC Desteği:** Tahmin edilmesi zor benzersiz masa tokenleri (`/t/:token`), SVG ve yüksek çözünürlüklü PNG indirme, baskıya hazır masa kartı şablonu ve NFC etiket yazma rehberi.
- **Korumalı Yönetici Paneli:** Supabase Auth ile güvenli yönetici girişi, kafe ve masa tanımlama, QR üretimi, Zod doğrulamalı soru yönetimi ve kullanım istatistikleri.
- **Güvenli Mimari:** Supabase Row Level Security (RLS) politikaları ve `SECURITY DEFINER` RPC fonksiyonları ile halka açık istemcilerin veritabanını taraması engellenir.
- **Çevrimdışı Demo Modu:** Supabase anahtarları henüz girilmemiş olsa bile tüm uygulama ve 4 oyun yerel demo verileriyle tam fonksiyonel olarak çalışır.
- **Mobil Öncelikli & 360px Uyumlu:** Krem, espresso ve terracotta tonlarında sıcak kafe tasarımı; hiçbir ekranda yatay taşma yapmaz.

---

## 🛠️ Teknoloji Yığını

- **Frontend:** React 19, TypeScript, Vite
- **Tasarım:** Tailwind CSS, Lucide React
- **Yönlendirme:** React Router v7
- **QR Kod:** `qrcode.react` (SVG & Canvas PNG export)
- **Doğrulama:** Zod
- **Veritabanı & Auth:** Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS), RPC
- **Test:** Vitest (Soru havuzu, token üretici ve masa doğrulama testleri)

---

## 🚀 Yerel Ortamda Çalıştırma

Projeyi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin:

```bash
# 1. Bağımlılıkları yükleyin
npm install

# 2. Geliştirici sunucusunu başlatın
npm run dev
```

Uygulama `http://localhost:5173` adresinde açılacaktır.

### Testleri Çalıştırma
```bash
npm test
```

### Üretim Build Alımı
```bash
npm run build
```

---

## 📦 Sayfalar ve Rotalar

| Rota | Açıklama |
|---|---|
| `/` | Halka açık B2B tanıtım sayfası, telefon ön izlemesi, özellikler, fiyatlandırma ve başvuru formu |
| `/t/:token` | QR veya NFC ile açılan masa açılış ekranı (örn: `/t/demo-masa-1`) |
| `/games` | 4 mini oyunun kategori ve sürelerini gösteren seçim ekranı |
| `/play/:gameSlug` | Seçilen oyunun oynandığı interaktif ekran (`sohbeti-baslat`, `ikilemde-kal`, vb.) |
| `/privacy` | Şeffaf KVKK ve gizlilik politikası |
| `/admin/login` | Yönetici giriş ekranı (Supabase Auth veya Demo Giriş) |
| `/admin/dashboard` | Kafe sayıları, QR okutma ve oyun başlatma istatistikleri |
| `/admin/cafes` | Kafe oluşturma, düzenleme ve aktif/pasif durumu |
| `/admin/cafes/:id/tables` | Masa ekleme, QR kod indirme (PNG/SVG), baskı kartı ve NFC rehberi |
| `/admin/questions` | 200 soruyu arama, filtreleme, düzenleme ve yeni soru ekleme |

---

## ☕ Demo Modu (Supabase Olmadan Anında Test)

Supabase hesabı oluşturmadan tüm özellikleri test edebilmeniz için projeye hazır demo masaları ve demo yönetici girişi eklenmiştir:

1. **Örnek Masa Deneyimi:** Tarayıcınızda doğrudan `http://localhost:5173/t/demo-masa-1` adresini açarak bir kafedeki müşterinin gördüğü ekranı test edebilirsiniz.
2. **Pasif Masa Testi:** `http://localhost:5173/t/demo-masa-pasif` adresi pasif masa hata durumunu gösterir.
3. **Demo Yönetici Girişi:** `http://localhost:5173/admin/login` adresine gidip **"Demo Yönetici Olarak Panele Gir"** butonuna basarak tüm yönetim panelini, kafe/masa işlemlerini ve soru havuzunu yönetebilirsiniz.

---

## 🗄️ Supabase Kurulum ve Canlı Ortama Alma Adımları

Canlı veritabanına geçmek istediğinizde aşağıdaki adımları tamamlayın:

### 1. Supabase Projesi Oluşturma
- [supabase.com](https://supabase.com) adresinden ücretsiz bir proje oluşturun.
- **Project Settings → API** bölümünden `Project URL` ve `anon public` anahtarınızı kopyalayın.

### 2. Ortam Değişkenlerini Ayarlama
Proje kök dizininde `.env` dosyası oluşturun:

```env
VITE_SUPABASE_URL=https://projeniz.supabase.co
VITE_SUPABASE_ANON_KEY=anon-anahtariniz
VITE_APP_URL=https://fincansohbet.com
```

### 3. Veritabanı Şemasını ve Güvenlik Politikalarını Yükleme
- Supabase Dashboard'da sol menüden **SQL Editor** sayfasına gidin.
- Projedeki `supabase/migrations/01_initial_schema.sql` dosyasının içeriğini yapıştırıp **Run** butonuna basın.
- Bu işlem tabloları (`cafes`, `tables`, `categories`, `questions`, `admin_users`, `events`, `subscriptions`), indeksleri, RLS politikalarını ve `get_table_by_token` RPC fonksiyonunu oluşturur.

### 4. 200 Soruyu ve Başlangıç Verilerini Yükleme
- Yine **SQL Editor** sayfasında `supabase/seed.sql` dosyasının içeriğini yapıştırıp **Run** butonuna basın.
- 4 kategori, 200 özgün soru ve örnek test kafesi veritabanına eklenecektir.

### 5. İlk Yönetici Hesabını Oluşturma
- Supabase Dashboard'da **Authentication → Users → Add User → Create User** adımlarını izleyerek e-posta ve parolanızı belirleyin.
- Oluşturulan kullanıcının `User UID` değerini kopyalayın.
- **SQL Editor**'de aşağıdaki sorguyu çalıştırarak kullanıcıyı yönetici tablosuna ekleyin:

```sql
INSERT INTO public.admin_users (user_id, role)
VALUES ('KOPYALADIGINIZ_USER_UID', 'admin');
```

Artık `/admin/login` ekranından bu e-posta ve parola ile giriş yapabilirsiniz.

---

## 🏷️ Masalara QR ve NFC Kurulumu

1. **Yönetim Paneline Girin:** `/admin/cafes` bölümünden kafenizi seçip **"Masaları Yönet"** butonuna tıklayın.
2. **Yeni Masa Ekleyin:** "Masa 01", "Masa 02 (Bahçe)" vb. masalarınızı oluşturun.
3. **QR Kodu İndirin:** Masanın yanındaki **"PNG"** veya **"SVG"** butonuna basarak QR kodunu indirin veya **"Masa Kartı"** butonuna basarak şık baskı şablonunu yazdırın.
4. **NFC Etiketi Yazma:**
   - Masanın kalıcı bağlantısını kopyalayın (`https://fincansohbet.com/t/TOKEN`).
   - Telefonunuza ücretsiz **NFC Tools** uygulamasını yükleyin.
   - **Write → Add a record → Custom URL / URI** seçip kopyaladığınız bağlantıyı yapıştırın.
   - **Write** butonuna basıp NFC etiketine telefonunuzu dokundurun.

---

## 🌐 Yayına Alma (Production Deployment)

Uygulama tamamen statik bir Single Page Application (SPA) olduğu için Vercel, Cloudflare Pages veya Netlify üzerinde sıfır maliyetle barındırılabilir.

- **Vercel:** Projeyi içe aktarın, Build Command: `npm run build`, Output Directory: `dist`. Rota yönlendirmeleri için `vercel.json` hazırdır.
- **Cloudflare Pages / Netlify:** SPA rotalarının doğrudan açılabilmesi için `public/_redirects` dosyası projede mevcuttur.

---

## 📄 Lisans ve Telif

© 2026 Fincan Sohbet. Tüm hakları saklıdır.
Soru havuzu ve tasarım Fincan Sohbet platformuna özel olarak hazırlanmıştır.
