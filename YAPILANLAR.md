# YAPILANLAR — Fincan Sohbet

Bu dosya, ürün yol haritasındaki tamamlanan işleri ve sıradaki adımları tutar.
Her haftanın sonunda güncellenir.

---

## Yol Haritası Özeti

| Hafta | Kapsam | Durum |
|---|---|---|
| Hafta 1 | Güvenlik sertleştirmesi, demo girişinin kapatılması, test izolasyonu | Tamamlandı |
| Hafta 2 | Çok kiracılı yönetim (kafe sahibi), self-servis başvuru kaydı, başvuru paneli | Tamamlandı |
| Hafta 3 | Menü ticari özellikleri (kategori yönetimi, varyant/allergen), public QR menü (`/m/:slug`), realtime + analytics düzeltmeleri | Planlandı |
| Hafta 4 | Abonelik/faturalandırma, onboarding, izleme (monitoring), KVKK/DPA dokümanları | Planlandı |

---

## Hafta 1 — Güvenlik ve Temel Sağlamlaştırma (Tamamlandı)

### Veritabanı

- `supabase/migrations/06_security_hardening.sql` eklendi.
- `service_requests`, `events`, `menu_items` üzerindeki herkese açık politikalar kaldırıldı; erişim admin ile sınırlandı.
- `menu-images` storage bucket'ında yükleme/güncelleme/silme `is_admin()` kontrolüne bağlandı.
- Müşteri işlemleri masa token'ı doğrulayan `SECURITY DEFINER` RPC'lere taşındı:
  - `create_service_request` — garson/hesap çağrısı; kafe ve masa aktifliği, `waiter_call_enabled`, 20 sn spam ve mükerrer çağrı koruması.
  - `get_active_table_request` — masanın bekleyen/ işlemdeki çağrısı.
  - `cancel_table_request` — müşteri yalnızca kendi çağrısını iptal eder.
  - `log_usage_event` — `table_open` / `game_start` / `game_complete`; oyun slug doğrulaması ve 10 sn mükerrer koruması.
  - `get_menu_items_by_token` — menü yalnızca aktif kafe ve geçerli masa token'ı ile okunur.

### İstemci

- `src/lib/api.ts`
  - Tüm müşteri çağrıları token tabanlı RPC'lere geçti.
  - Canlı backend'de sessiz demo fallback kaldırıldı: yazma hataları fırlatılır, okuma hataları boş liste döner.
  - `uploadMenuImage` canlıda hata fırlatır (data-url fallback yok).
  - `getMenuItemsByToken` eklendi; müşteri menüsü artık demo ürünlerle başlamaz.
- Müşteri ekranları yeni API'ye bağlandı:
  - `src/pages/TableLandingPage.tsx` — masa açılış logu, aktif çağrı sorgusu, iptal.
  - `src/components/ServiceCallModal.tsx` — çağrı oluşturma `tableToken` ile.
  - `src/components/CafeMenuView.tsx` — boş menü durumu ("Menü henüz eklenmedi") ve yükleme iskeleti.
  - `src/pages/GamePlayPage.tsx` — oyun başlatma/bitirme logları token ile.
- Demo yönetici girişi üretimde kapatıldı:
  - `src/hooks/useAdminAuth.ts` — canlı backend'de `fincan_demo_admin_auth` yok sayılır ve temizlenir.
  - `src/pages/AdminLoginPage.tsx` — demo giriş bölümü yalnızca demo modunda görünür.
  - `src/components/DemoBanner.tsx` — `isDemoMode` ile çalışır.
- Admin yazma işlemlerinde sessiz yutma yerine kullanıcıya hata bildirimi eklendi:
  - `AdminCafesPage`, `AdminTablesPage`, `AdminMenuPage`.

### Test ve Yapılandırma

- `.env.test` eklendi; testler demo modda çalışır, canlı Supabase'e istek atmaz. `.gitignore`'a `!.env.test` istisnası eklendi.
- Testler yeni token tabanlı API'ye göre güncellendi; iptal ve menü-token testleri eklendi.
- `tsconfig.app.json` içinde `"strict": true` açıldı ve tüm tip hataları giderildi.
- Doğrulama: `npm test` 47/47, `tsc -b` temiz, `npm run build` başarılı, `npm run lint` 0 hata.
- Tarayıcıda demo modda doğrulandı: menü görüntüleme, aktif çağrı, iptal, yeni garson çağrısı, demo admin girişi ve panel.

### Yayına Alma Notu

> **Migration 06, yeni istemci deploy edilmeden önce Supabase SQL Editor'de çalıştırılmalı.**
> Aksi halde canlıda menü boş görünür, garson/hesap çağrıları ve olay kayıtları hata verir.

---

## Hafta 2 — Çok Kiracılık ve Self-Servis Başvuru (Tamamlandı)

### Veritabanı

- `supabase/migrations/07_multi_tenant_and_leads.sql` eklendi.
- `admin_users.cafe_id` kolonu eklendi; `NULL` = platform yöneticisi, dolu = kafe sahibi (owner).
- `is_admin()` yeniden tanımlandı: yalnızca `cafe_id IS NULL` olan yönetici platform yetkisi taşır (soru havuzu, admin_users yönetimi bu yetkiye bağlı).
- `current_cafe_id()` eklendi: giriş yapan admin'in bağlı olduğu kafeyi döndürür.
- RLS kapsamı:
  - `cafes` — platform yöneticisi tümüne; owner yalnızca kendi kaydını görüntüler/günceller.
  - `tables`, `menu_items`, `service_requests` — platform yöneticisi tümüne (ALL); owner yalnızca `cafe_id = current_cafe_id()`.
  - `events` — owner yalnızca kendi kafesinin olaylarını okur.
  - `admin_users` — kullanıcı kendi kaydını, platform yöneticisi tümünü görür.
- `leads` tablosu (durum: `new | contacted | converted | archived`, `source`, `created_at/updated_at`) ve indeksler.
- `submit_lead(...)` `SECURITY DEFINER` RPC'si: alan doğrulaması, `left()` ile uzunluk sınırı, aynı iletişim bilgisiyle 5 dakika içinde mükerrer başvuru engeli.
- 06'daki RPC'lere (`create_service_request`, `get_active_table_request`, `cancel_table_request`, `log_usage_event`, `get_menu_items_by_token`) `GRANT EXECUTE` verildi; istemci tarafında artık `permission denied` yaşanmaz.

### İstemci

- `src/types/index.ts`: `Lead`, `LeadStatus`; `AdminUser` tipine `owner` rolü ve `cafe_id` eklendi.
- `src/lib/api.ts`:
  - `submitLead`, `getLeads`, `updateLeadStatus` eklendi; canlıda RPC/tablo üzerinden, demoda yerel `localLeads` üzerinden çalışır.
  - Başvuru alanları için Türkçe hata mesajlı doğrulama (ad, kafe adı, şehir, iletişim, 1–500 masa).
  - Demo modda aynı iletişim bilgisiyle mükerrer başvuru engellenir.
- `src/data/mockData.ts`: demo için iki örnek başvuru (`MOCK_LEADS`).
- `src/hooks/useAdminAuth.ts`: `adminRole` ve `cafeId` durumu eklendi, `isPlatformAdmin` döndürülüyor; oturum, giriş ve auth dinleyicisi `admin_users` satırından rol/kafe bilgisini okuyor.
- `src/components/LeadModal.tsx`: form artık `submitLead` ile gerçekten kaydediliyor; hata banner'ı eklendi; başarı ekranı korundu.
- `src/pages/AdminLeadsPage.tsx` (yeni):
  - Platform yöneticisi koruması (owner'a yetkisiz uyarısı).
  - Durum sekmeleri ve sayaçları, manuel yenileme, hata banner'ı.
  - Durum güncelleme (Yeni / İletişimde / Arşiv) ve "Kafeye Dönüştür": slug üretimi + çakışmada `-2`, `-3` denemesi, ardından kafe oluşturma ve başvuruyu `converted` işaretleme.
- Rol bazlı panel:
  - `AdminLayout`: "Başvurular" ve "Soru Havuzu" sekmeleri yalnızca platform yöneticisine görünür.
  - `AdminCafesPage`: owner'da "Yeni Kafe Ekle" gizli, başlık "Kafem & Masalar", boş durum mesajı owner'a özel.
  - `AdminDashboardPage`: owner'da başlık "Kafe Özeti".
  - `AdminQuestionsPage`: owner erişiminde yetkisiz kartı gösterir.
- `src/App.tsx`: `/admin/leads` rotası eklendi (lazy).

### Test ve Doğrulama

- `src/tests/gameAndApi.test.ts` içine 4 lead testi eklendi: trim + `new` durumu, iletişim bazlı dedupe, geçersiz alan hataları, durum güncelleme ve olmayan kayıt hatası.
- Doğrulama: `npm test` 51/51, `tsc -b` temiz, `npm run build` başarılı, `npm run lint` 0 hata (22 uyarı).
- Tarayıcıda demo modda doğrulandı:
  - Landing'de başvuru formu doldurulup gönderildi → başarı ekranı.
  - Admin "Başvurular" sayfasında yeni kayıt en üstte, not/masa sayısı/iletişim doğru.
  - Durum güncelleme sayaçları değiştirdi (Yeni 1 → 0, İletişimde 1 → 2).
  - "Kafeye Dönüştür" kafeyi oluşturdu ve başvuruyu Dönüştürüldü'ye taşıdı.

### Yayına Alma Notu

> **Migration 06 ve 07, yeni istemci deploy edilmeden önce Supabase SQL Editor'de sırayla çalıştırılmalı.**
> Kafe sahibi hesabı açmak için `admin_users` tablosuna `cafe_id` dolu bir satır eklenmeli (service role / SQL). Owner kullanıcı oluşturma akışı henüz panelde yok.

> **Canlı proje durumu (2026-10-28):** 01 zaten uygulanmıştı; 02–07 SQL Editor'de sırayla çalıştırıldı. `02`/`05` içindeki `get_table_by_token` dönüş tipi değiştiği için iki dosyaya `DROP FUNCTION IF EXISTS` eklendi.

---

## Bilinen Riskler / Notlar

- Migration dosyaları elle uygulanıyor; uygulanmamış migration ile deploy edilen istemci ilgili RPC'lerde hata verir.
- Kafe sahibi hesapları panelden oluşturulamıyor; `admin_users` satırı SQL / service role ile eklenmeli. Owner provisioning Hafta 4 onboarding kapsamında ele alınacak.
- `submit_lead` mükerrer kontrolü yalnızca 5 dakikalık pencereyi kapsar; farklı iletişim bilgisiyle tekrar başvuru mümkündür.
- Supabase Realtime aboneliği henüz istemcide kullanılmıyor; admin paneli 6–8 saniyelik yoklamayla çalışıyor (Hafta 3).
- `MasaDuellosu` demo rakipleri ve `KafeNabzi` başlangıç oyları gerçek veri gibi sunuluyor; marka/mevzuat riski için Hafta 3'te etiketlenecek.
- Ödeme/abonelik altyapısı yok; `subscriptions` tablosu kullanılmıyor (Hafta 4).
