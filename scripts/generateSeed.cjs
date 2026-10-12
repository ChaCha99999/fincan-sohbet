const fs = require('fs');
const path = require('path');

function loadQuestionsFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const eqIdx = content.indexOf('= [');
  if (eqIdx === -1) {
    throw new Error(`Could not find "= [" in ${filePath}`);
  }
  const startIdx = content.indexOf('[', eqIdx);
  const endIdx = content.lastIndexOf(']');
  if (startIdx === -1 || endIdx === -1) {
    throw new Error(`Could not find JSON array in ${filePath}`);
  }
  const jsonStr = content.slice(startIdx, endIdx + 1);
  return JSON.parse(jsonStr);
}

const sohbetPath = path.join(__dirname, '../src/data/questions/sohbet.ts');
const ikilemPath = path.join(__dirname, '../src/data/questions/ikilem.ts');
const muhtemelPath = path.join(__dirname, '../src/data/questions/muhtemel.ts');
const taniyoruzPath = path.join(__dirname, '../src/data/questions/taniyoruz.ts');

const sohbetQuestions = loadQuestionsFromFile(sohbetPath);
const ikilemQuestions = loadQuestionsFromFile(ikilemPath);
const muhtemelQuestions = loadQuestionsFromFile(muhtemelPath);
const taniyoruzQuestions = loadQuestionsFromFile(taniyoruzPath);

const allQuestions = [
  ...sohbetQuestions,
  ...ikilemQuestions,
  ...muhtemelQuestions,
  ...taniyoruzQuestions,
];

console.log(`Loaded ${allQuestions.length} total questions:`);
console.log(`- Sohbet: ${sohbetQuestions.length}`);
console.log(`- İkilem: ${ikilemQuestions.length}`);
console.log(`- Muhtemel: ${muhtemelQuestions.length}`);
console.log(`- Tanıyoruz: ${taniyoruzQuestions.length}`);

function escapeSql(str) {
  if (!str) return '';
  return str.replace(/'/g, "''");
}

let sql = `-- ==============================================================================
-- FİNCAN SOHBET — SEED DATA (KATEGORİLER, 900 ÖZGÜN SORU, ÖRNEK KAFE & MASALAR)
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

-- 900 ÖZGÜN TÜRKÇE SORU
INSERT INTO public.questions (id, category_id, game_type, question_text, option_a, option_b, tags, difficulty, is_active, sort_order) VALUES
`;

const valueRows = allQuestions.map(q => {
  const optA = q.option_a ? `'${escapeSql(q.option_a)}'` : 'NULL';
  const optB = q.option_b ? `'${escapeSql(q.option_b)}'` : 'NULL';
  const tagsStr = q.tags && q.tags.length > 0 
    ? `ARRAY[${q.tags.map(t => `'${escapeSql(t)}'`).join(', ')}]::TEXT[]` 
    : `'{}'::TEXT[]`;
  const diff = q.difficulty || 'easy';
  const active = q.is_active ? 'true' : 'false';
  
  return `('${q.id}', '${q.category_id}', '${q.game_type}', '${escapeSql(q.question_text)}', ${optA}, ${optB}, ${tagsStr}, '${diff}', ${active}, ${q.sort_order})`;
});

sql += valueRows.join(',\n');
sql += `\nON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  option_a = EXCLUDED.option_a,
  option_b = EXCLUDED.option_b,
  tags = EXCLUDED.tags,
  difficulty = EXCLUDED.difficulty,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;\n`;

const targetSqlPath = path.join(__dirname, '../supabase/seed.sql');
fs.writeFileSync(targetSqlPath, sql, 'utf8');
console.log(`Successfully generated ${targetSqlPath} with ${allQuestions.length} questions.`);
