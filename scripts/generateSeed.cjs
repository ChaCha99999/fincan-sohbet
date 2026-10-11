const fs = require('fs');
const path = require('path');

// Read questionsSeed.ts
const questionsSeedContent = fs.readFileSync(path.join(__dirname, '../src/data/questionsSeed.ts'), 'utf8');

// Simple parser for INITIAL_QUESTIONS
const questions = [];
const regex = /{\s*id:\s*'([^']+)',\s*category_id:\s*'([^']+)',\s*game_type:\s*'([^']+)',\s*question_text:\s*'([^']+)'(?:,\s*option_a:\s*'([^']+)')?(?:,\s*option_b:\s*'([^']+)')?(?:,\s*tags:\s*\[([^\]]*)\])?(?:,\s*difficulty:\s*'([^']+)')?,\s*is_active:\s*(true|false),\s*sort_order:\s*(\d+)\s*}/g;

let match;
while ((match = regex.exec(questionsSeedContent)) !== null) {
  questions.push({
    id: match[1],
    category_id: match[2],
    game_type: match[3],
    question_text: match[4].replace(/'/g, "''"),
    option_a: match[5] ? match[5].replace(/'/g, "''") : null,
    option_b: match[6] ? match[6].replace(/'/g, "''") : null,
    tags: match[7] ? match[7].split(',').map(t => t.trim().replace(/'/g, '')).filter(Boolean) : [],
    difficulty: match[8] || 'easy',
    is_active: match[9] === 'true',
    sort_order: parseInt(match[10], 10),
  });
}

console.log(`Parsed ${questions.length} questions.`);

let sql = `-- ==============================================================================
-- FİNCAN SOHBET — SEED DATA (KATEGORİLER, 200 SORU, ÖRNEK KAFE & MASALAR)
-- ==============================================================================

-- KATEGORİLER
INSERT INTO public.categories (id, name, slug, description, estimated_time, icon, sort_order, is_active) VALUES
('cat-sohbet', 'Sohbeti Başlat', 'sohbeti-baslat', 'Sessizliği kıran, kahve eşliğinde samimi sohbetler açan derin ve eğlenceli sorular.', '15-30 dk', 'MessageCircle', 1, true),
('cat-ikilem', 'İkilemde Kal', 'ikilemde-kal', 'İki zor seçenek arasında seçim yap, masadaki herkes nedenini savunsun.', '10-20 dk', 'Split', 2, true),
('cat-muhtemel', 'Kim Daha Muhtemel?', 'kim-daha-muhtemel', 'Gruptaki arkadaşlarınızdan hangisi bu duruma daha çok uyuyor? Parmaklar aynı anda gösterilsin!', '15-25 dk', 'Users', 3, true),
('cat-taniyoruz', 'Birbirimizi Ne Kadar Tanıyoruz?', 'ne-kadar-taniyoruz', 'Sırası gelen kişinin cevabını doğru tahmin etmeye çalışın, masadaki puanları toplayın.', '20-35 dk', 'HeartHandshake', 4, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ÖRNEK KAFE VE MASALAR (İSTEĞE BAĞLI TEST VERİSİ)
INSERT INTO public.cafes (id, name, slug, status) VALUES
('a0000000-0000-0000-0000-000000000001', 'Moda Fincan Kahve & Kitap', 'moda-fincan', 'active')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.tables (id, cafe_id, label, public_token, is_active) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Masa 01 (Bahçe)', 'demo-masa-1', true),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Masa 02 (Pencere)', 'demo-masa-2', true),
('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Masa 03 (Pasif)', 'demo-masa-pasif', false)
ON CONFLICT (public_token) DO NOTHING;

-- 200 ÖZGÜN TÜRKÇE SORU
INSERT INTO public.questions (id, category_id, game_type, question_text, option_a, option_b, tags, difficulty, is_active, sort_order) VALUES
`;

const valueRows = questions.map(q => {
  const optA = q.option_a ? `'${q.option_a}'` : 'NULL';
  const optB = q.option_b ? `'${q.option_b}'` : 'NULL';
  const tagArray = q.tags.length > 0 ? `ARRAY[${q.tags.map(t => `'${t}'`).join(', ')}]::TEXT[]` : 'ARRAY[]::TEXT[]';
  return `('${q.id}', '${q.category_id}', '${q.game_type}', '${q.question_text}', ${optA}, ${optB}, ${tagArray}, '${q.difficulty}', ${q.is_active}, ${q.sort_order})`;
});

sql += valueRows.join(',\n');
sql += `\nON CONFLICT (id) DO UPDATE SET\n  question_text = EXCLUDED.question_text,\n  option_a = EXCLUDED.option_a,\n  option_b = EXCLUDED.option_b;\n`;

fs.writeFileSync(path.join(__dirname, '../supabase/seed.sql'), sql, 'utf8');
console.log('supabase/seed.sql generated successfully with ' + questions.length + ' questions.');
