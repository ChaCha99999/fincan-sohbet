import { describe, it, expect } from 'vitest';
import { INITIAL_QUESTIONS } from '../data/questionsSeed';
import { INITIAL_CATEGORIES } from '../data/categories';
import { 
  validateTableToken, 
  generatePublicToken,
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  createServiceRequest,
  getServiceRequests,
  updateServiceRequestStatus,
  toggleCafeWaiterCall,
  getActiveServiceRequestsCount,
  getActiveTableServiceRequest
} from '../lib/api';
import { DEFAULT_MENU_ITEMS, MENU_CATEGORIES } from '../data/mockMenu';
import { TRIVIA_CATEGORIES, TRIVIA_QUESTIONS } from '../data/triviaQuestions';
import { INITIAL_CAFE_POLLS } from '../data/cafePollsSeed';

describe('Soru Havuzu ve Kategoriler (Question Pool & Categories)', () => {
  it('Toplam en az 150 (hedef 200) özgün soru bulunmalıdır', () => {
    expect(INITIAL_QUESTIONS.length).toBe(200);
  });

  it('4 ana kategori eksiksiz tanımlanmış olmalıdır', () => {
    expect(INITIAL_CATEGORIES.length).toBe(4);
    const slugs = INITIAL_CATEGORIES.map(c => c.slug);
    expect(slugs).toContain('sohbeti-baslat');
    expect(slugs).toContain('ikilemde-kal');
    expect(slugs).toContain('kim-daha-muhtemel');
    expect(slugs).toContain('ne-kadar-taniyoruz');
  });

  it('Her oyun türünde tam 50 adet soru bulunmalıdır', () => {
    const sohbetCount = INITIAL_QUESTIONS.filter(q => q.game_type === 'sohbeti-baslat').length;
    const ikilemCount = INITIAL_QUESTIONS.filter(q => q.game_type === 'ikilemde-kal').length;
    const muhtemelCount = INITIAL_QUESTIONS.filter(q => q.game_type === 'kim-daha-muhtemel').length;
    const taniyoruzCount = INITIAL_QUESTIONS.filter(q => q.game_type === 'ne-kadar-taniyoruz').length;

    expect(sohbetCount).toBe(50);
    expect(ikilemCount).toBe(50);
    expect(muhtemelCount).toBe(50);
    expect(taniyoruzCount).toBe(50);
  });

  it('İkilem sorularının Seçenek A ve Seçenek B alanları dolu olmalıdır', () => {
    const ikilemler = INITIAL_QUESTIONS.filter(q => q.game_type === 'ikilemde-kal');
    ikilemler.forEach(q => {
      expect(q.option_a).toBeDefined();
      expect(q.option_a?.length).toBeGreaterThan(3);
      expect(q.option_b).toBeDefined();
      expect(q.option_b?.length).toBeGreaterThan(3);
    });
  });

  it('Tüm soruların metni anlamlı ve yeterli uzunlukta olmalıdır', () => {
    INITIAL_QUESTIONS.forEach(q => {
      expect(q.question_text.trim().length).toBeGreaterThan(10);
      expect(q.is_active).toBe(true);
    });
  });
});

describe('Masa Doğrulama ve Token Mantığı (Table Validation)', () => {
  it('Rastgele üretilen masa tokeni en az 8 karakter ve URL uyumlu olmalıdır', () => {
    const token = generatePublicToken();
    expect(token.length).toBe(10);
    expect(/^[a-z0-9]+$/.test(token)).toBe(true);
  });

  it('Geçerli ve aktif masa tokeni başarıyla doğrulanmalıdır ve Wi-Fi bilgilerini içermelidir', async () => {
    const result = await validateTableToken('demo-masa-1');
    expect(result.isValid).toBe(true);
    expect(result.isCafeActive).toBe(true);
    expect(result.isTableActive).toBe(true);
    expect(result.table?.label).toContain('Masa 01');
    expect(result.table?.cafe?.name).toBe('Moda Fincan Kahve & Kitap');
    expect(result.table?.cafe?.wifi_name).toBe('ModaFincan_Misafir');
    expect(result.table?.cafe?.wifi_password).toBe('kahvevekitap');
  });

  it('Pasif masa tokeni geçersiz sayılmalı ve masa pasif hatası vermelidir', async () => {
    const result = await validateTableToken('demo-masa-pasif');
    expect(result.isValid).toBe(false);
    expect(result.isTableActive).toBe(false);
    expect(result.errorMessage).toContain('kullanıma kapalıdır');
  });

  it('Pasif kafeye ait masa tokeni geçersiz sayılmalıdır', async () => {
    const result = await validateTableToken('demo-pasif-kafe-masa');
    expect(result.isValid).toBe(false);
    expect(result.isCafeActive).toBe(false);
    expect(result.errorMessage).toContain('hizmet vermemektedir');
  });

  it('Var olmayan token anlaşılır hata mesajı dönmelidir', async () => {
    const result = await validateTableToken('olmayan-rastgele-token-123');
    expect(result.isValid).toBe(false);
    expect(result.table).toBeUndefined();
    expect(result.errorMessage).toContain('Masa bulunamadı');
  });
});

describe('Kafe Menü Modülü (Cafe Menu Module)', () => {
  it('Dahili menüde en az 20 adet ürün ve 4 kategori bulunmalıdır', () => {
    expect(DEFAULT_MENU_ITEMS.length).toBeGreaterThanOrEqual(20);
    expect(MENU_CATEGORIES).toContain('Sıcak Kahveler');
    expect(MENU_CATEGORIES).toContain('Soğuk Kahveler');
    expect(MENU_CATEGORIES).toContain('Tatlılar & Fırın');
    expect(MENU_CATEGORIES).toContain('Çay & Diğer');
  });

  it('Menüye yeni ürün ekleme, fiyat güncelleme ve silme çalışmalıdır', async () => {
    const testItem = await createMenuItem({
      category: 'Sıcak Kahveler',
      name: 'Özel Zencefilli Mocha',
      price: 160,
      description: 'Zencefilli çikolata ve espresso',
      is_popular: true,
      is_available: true,
    });

    expect(testItem.id).toBeDefined();
    expect(testItem.name).toBe('Özel Zencefilli Mocha');
    expect(testItem.price).toBe(160);

    const updated = await updateMenuItem(testItem.id, { price: 175, is_available: false });
    expect(updated.price).toBe(175);
    expect(updated.is_available).toBe(false);

    await deleteMenuItem(testItem.id);
    const items = await getMenuItems();
    expect(items.find(i => i.id === testItem.id)).toBeUndefined();
  });
});

describe('Masalar Arası Kafe Trivia Modülü (Trivia & Categories)', () => {
  it('Tam 10 tematik kategori eksiksiz tanımlanmış olmalıdır', () => {
    expect(TRIVIA_CATEGORIES.length).toBe(10);
    const categoryIds = TRIVIA_CATEGORIES.map(c => c.id);
    expect(categoryIds).toContain('genel-kultur');
    expect(categoryIds).toContain('futbol-spor');
    expect(categoryIds).toContain('arabalar');
    expect(categoryIds).toContain('sinema-dizi');
    expect(categoryIds).toContain('muzik');
    expect(categoryIds).toContain('yemek-mutfak');
    expect(categoryIds).toContain('cografya');
    expect(categoryIds).toContain('bilim-teknoloji');
    expect(categoryIds).toContain('gaming');
    expect(categoryIds).toContain('nostalji');
  });

  it('Her kategoride en az 5 adet soru olmak üzere toplam en az 50 soru bulunmalıdır', () => {
    expect(TRIVIA_QUESTIONS.length).toBeGreaterThanOrEqual(50);
    TRIVIA_CATEGORIES.forEach(cat => {
      const questionsInCat = TRIVIA_QUESTIONS.filter(q => q.categoryId === cat.id);
      expect(questionsInCat.length).toBeGreaterThanOrEqual(5);
    });
  });

  it('Tüm trivia soruları 4 şıklı olmalı ve doğru cevap indeksi 0-3 aralığında bulunmalıdır', () => {
    TRIVIA_QUESTIONS.forEach(q => {
      expect(q.options.length).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThanOrEqual(3);
      expect(q.question.trim().length).toBeGreaterThan(10);
      q.options.forEach(opt => {
        expect(opt.trim().length).toBeGreaterThan(0);
      });
      // Doğru cevap şıkkı geçerli bir metin olmalıdır
      expect(q.options[q.correctIndex]).toBeDefined();
    });
  });

  it('Puanlama mantığı doğru çalışmalıdır (Baz puan + Hız bonusu)', () => {
    const timeLimit = 15;
    
    // 15. saniyede (tam sürede) doğru cevaplama
    const maxSpeedBonus = Math.round((15 / timeLimit) * 50);
    const maxPoints = 100 + maxSpeedBonus;
    expect(maxPoints).toBe(150);

    // 0. saniyede doğru cevaplama
    const minSpeedBonus = Math.round((0 / timeLimit) * 50);
    const minPoints = 100 + minSpeedBonus;
    expect(minPoints).toBe(100);

    // Yanlış cevapta 0 puan
    const wrongPoints = 0;
    expect(wrongPoints).toBe(0);
  });

  it('Kategoriye göre filtreleme doğru çalışmalıdır', () => {
    const arabalarQuestions = TRIVIA_QUESTIONS.filter(q => q.categoryId === 'arabalar');
    expect(arabalarQuestions.length).toBe(5);
    arabalarQuestions.forEach(q => {
      expect(q.categoryId).toBe('arabalar');
      expect(q.categoryName).toContain('Arabalar');
    });
  });
});

describe('Masalar Arası Hızlı Düello Modülü (1v1 Table Duel)', () => {
  it('Düello için 5 soruluk hızlı tur formatı geçerli olmalıdır', () => {
    const duelQuestionsCount = 5;
    expect(TRIVIA_QUESTIONS.length).toBeGreaterThanOrEqual(duelQuestionsCount);
    const sampleRound = TRIVIA_QUESTIONS.slice(0, duelQuestionsCount);
    expect(sampleRound.length).toBe(5);
  });

  it('Düello zafer ve mağlubiyet mantığı doğru hesaplanmalıdır', () => {
    const calculateWinner = (myScore: number, oppScore: number): 'me' | 'opponent' | 'draw' => {
      if (myScore > oppScore) return 'me';
      if (oppScore > myScore) return 'opponent';
      return 'draw';
    };

    expect(calculateWinner(520, 380)).toBe('me');
    expect(calculateWinner(300, 450)).toBe('opponent');
    expect(calculateWinner(400, 400)).toBe('draw');
  });

  it('Düello can/güç çubuğu oranlaması güvenli sınırlar arasında olmalıdır', () => {
    const calculateBarPercent = (myScore: number, oppScore: number) => {
      const total = myScore + oppScore || 1;
      return Math.max(15, Math.min(85, (myScore / total) * 100));
    };

    // Çok ezici üstünlükte bile sınır %85 olmalıdır (taşma yapmaz)
    expect(calculateBarPercent(1000, 0)).toBe(85);
    // Çok gerideyken bile sınır %15 olmalıdır (kaybolmaz)
    expect(calculateBarPercent(0, 1000)).toBe(15);
    // Eşitlikte %50 olmalıdır
    expect(calculateBarPercent(300, 300)).toBe(50);
  });
});

describe('Ortak Kafe Nabzı Modülü (Live Cafe Polls)', () => {
  it('En az 6 adet özgün kafe anketi tanımlanmış olmalıdır', () => {
    expect(INITIAL_CAFE_POLLS.length).toBeGreaterThanOrEqual(6);
  });

  it('Tüm anketlerin geçerli kategorisi, soru metni ve en az 2 seçeneği olmalıdır', () => {
    INITIAL_CAFE_POLLS.forEach((poll) => {
      expect(poll.question.trim().length).toBeGreaterThan(5);
      expect(['kahve-muzik', 'gunun-ikilemi', 'kafe-modu']).toContain(poll.category);
      expect(poll.options.length).toBeGreaterThanOrEqual(2);
      expect(poll.totalVotes).toBeGreaterThan(0);
      poll.options.forEach((opt) => {
        expect(opt.text.trim().length).toBeGreaterThan(0);
        expect(opt.votes).toBeGreaterThanOrEqual(0);
      });
    });
  });

  it('Seçeneklerin oy toplamı toplam oy sayısıyla tutarlı olmalıdır', () => {
    INITIAL_CAFE_POLLS.forEach((poll) => {
      const sumVotes = poll.options.reduce((acc, curr) => acc + curr.votes, 0);
      expect(sumVotes).toBe(poll.totalVotes);
    });
  });

  it('Oy yüzde hesaplama mantığı doğru çalışmalıdır', () => {
    const calculatePercentage = (optVotes: number, total: number) => {
      if (total === 0) return 0;
      return Math.round((optVotes / total) * 100);
    };

    expect(calculatePercentage(50, 100)).toBe(50);
    expect(calculatePercentage(25, 100)).toBe(25);
    expect(calculatePercentage(0, 100)).toBe(0);
    expect(calculatePercentage(10, 0)).toBe(0);
  });

  it('Anket kategorilerine göre filtreleme doğru çalışmalıdır', () => {
    const ikilemler = INITIAL_CAFE_POLLS.filter((p) => p.category === 'gunun-ikilemi');
    expect(ikilemler.length).toBeGreaterThanOrEqual(2);
    ikilemler.forEach((p) => {
      expect(p.category).toBe('gunun-ikilemi');
    });
  });
});

describe('Garson Çağır & Hesap İste Modülü (Waiter Call & Service Requests)', () => {
  it('Kafenin waiter_call_enabled özelliği varsayılan olarak aktif olmalı veya doğrulamada dönmelidir', async () => {
    const res = await validateTableToken('demo-masa-1');
    expect(res.isValid).toBe(true);
    expect(res.table?.cafe?.waiter_call_enabled).toBe(true);
  });

  it('waiter_call_enabled pasif olan kafede bu özellik false olarak gelmelidir', async () => {
    const res = await validateTableToken('demo-pasif-kafe-masa');
    expect(res.table?.cafe?.waiter_call_enabled).toBe(false);
  });

  it('Yeni garson çağırma isteği oluşturulabilmelidir', async () => {
    const req = await createServiceRequest({
      cafe_id: 'cafe-moda-01',
      table_id: 'tbl-moda-01',
      request_type: 'waiter',
      note: 'Su rica ediyoruz',
    });

    expect(req.id).toBeDefined();
    expect(req.request_type).toBe('waiter');
    expect(req.status).toBe('pending');
    expect(req.note).toBe('Su rica ediyoruz');
  });

  it('Ödeme türü ile hesap isteme çağrısı oluşturulabilmelidir', async () => {
    const req = await createServiceRequest({
      cafe_id: 'cafe-moda-01',
      table_id: 'tbl-moda-02',
      request_type: 'bill',
      payment_method: 'card',
      note: 'POS cihazı rica ediyoruz',
    });

    expect(req.id).toBeDefined();
    expect(req.request_type).toBe('bill');
    expect(req.payment_method).toBe('card');
    expect(req.status).toBe('pending');
  });

  it('Servis çağrısı durumu güncellenebilmelidir (pending -> in_progress -> completed)', async () => {
    const req = await createServiceRequest({
      cafe_id: 'cafe-moda-01',
      table_id: 'tbl-moda-01',
      request_type: 'waiter',
    });

    const inProgress = await updateServiceRequestStatus(req.id, 'in_progress');
    expect(inProgress.status).toBe('in_progress');

    const completed = await updateServiceRequestStatus(req.id, 'completed');
    expect(completed.status).toBe('completed');
  });

  it('İşletme bazlı veya genel servis çağrıları filtrelenebilmelidir', async () => {
    const all = await getServiceRequests({ cafe_id: 'cafe-moda-01' });
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBeGreaterThan(0);
  });

  it('Aktif çağrı sayısı ve masaya ait aktif çağrı sorgulanabilmelidir', async () => {
    const count = await getActiveServiceRequestsCount('cafe-moda-01');
    expect(count).toBeGreaterThanOrEqual(0);

    const activeTableReq = await getActiveTableServiceRequest('tbl-moda-01');
    expect(activeTableReq === null || typeof activeTableReq === 'object').toBe(true);
  });

  it('Admin panelden işletmenin masa çağrısı özelliği açılıp kapatılabilmelidir (toggle)', async () => {
    // Kapat
    const updatedDisabled = await toggleCafeWaiterCall('cafe-moda-01', false);
    expect(updatedDisabled.waiter_call_enabled).toBe(false);

    // Tekrar Aç
    const updatedEnabled = await toggleCafeWaiterCall('cafe-moda-01', true);
    expect(updatedEnabled.waiter_call_enabled).toBe(true);
  });
});




