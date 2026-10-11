import { describe, it, expect } from 'vitest';
import { INITIAL_QUESTIONS } from '../data/questionsSeed';
import { INITIAL_CATEGORIES } from '../data/categories';
import { validateTableToken, generatePublicToken } from '../lib/api';

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

  it('Geçerli ve aktif masa tokeni başarıyla doğrulanmalıdır', async () => {
    const result = await validateTableToken('demo-masa-1');
    expect(result.isValid).toBe(true);
    expect(result.isCafeActive).toBe(true);
    expect(result.isTableActive).toBe(true);
    expect(result.table?.label).toContain('Masa 01');
    expect(result.table?.cafe?.name).toBe('Moda Fincan Kahve & Kitap');
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
