import React, { useEffect, useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  Plus, 
  Edit3, 
  X, 
  Save, 
  AlertCircle 
} from 'lucide-react';
import { z } from 'zod';
import { AdminLayout } from '../components/AdminLayout';
import { getQuestions, createQuestion, updateQuestion, toggleQuestionStatus } from '../lib/api';
import type { Question, GameType } from '../types';

const questionSchema = z.object({
  game_type: z.enum(['sohbeti-baslat', 'ikilemde-kal', 'kim-daha-muhtemel', 'ne-kadar-taniyoruz']),
  question_text: z.string().min(5, 'Soru metni en az 5 karakter olmalıdır.').max(300, 'Soru metni en fazla 300 karakter olabilir.'),
  option_a: z.string().optional().nullable(),
  option_b: z.string().optional().nullable(),
  tags: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'deep']),
});

export const AdminQuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedGameType, setSelectedGameType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState({
    game_type: 'sohbeti-baslat' as GameType,
    question_text: '',
    option_a: '',
    option_b: '',
    tags: '',
    difficulty: 'easy' as 'easy' | 'medium' | 'deep',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const loadQuestions = () => {
    setLoading(true);
    getQuestions({ onlyActive: false }).then((data) => {
      setQuestions(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const openCreateModal = () => {
    setFormData({
      game_type: 'sohbeti-baslat',
      question_text: '',
      option_a: '',
      option_b: '',
      tags: '',
      difficulty: 'easy',
    });
    setFormErrors({});
    setEditingQuestion(null);
    setModalMode('create');
  };

  const openEditModal = (q: Question) => {
    setFormData({
      game_type: q.game_type,
      question_text: q.question_text,
      option_a: q.option_a || '',
      option_b: q.option_b || '',
      tags: q.tags?.join(', ') || '',
      difficulty: (q.difficulty as any) || 'easy',
    });
    setFormErrors({});
    setEditingQuestion(q);
    setModalMode('edit');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const result = questionSchema.safeParse(formData);
    if (!result.success) {
      const errMap: Record<string, string> = {};
      result.error.issues.forEach(i => {
        if (i.path[0]) errMap[i.path[0].toString()] = i.message;
      });
      setFormErrors(errMap);
      return;
    }

    if (formData.game_type === 'ikilemde-kal' && (!formData.option_a.trim() || !formData.option_b.trim())) {
      setFormErrors({ option_a: 'İkilem türündeki sorular için Seçenek A ve Seçenek B zorunludur.' });
      return;
    }

    setSubmitting(true);
    try {
      const tagsArray = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const categoryIdMap: Record<GameType, string> = {
        'sohbeti-baslat': 'cat-sohbet',
        'ikilemde-kal': 'cat-ikilem',
        'kim-daha-muhtemel': 'cat-muhtemel',
        'ne-kadar-taniyoruz': 'cat-taniyoruz',
      };

      if (modalMode === 'create') {
        await createQuestion({
          category_id: categoryIdMap[formData.game_type],
          game_type: formData.game_type,
          question_text: formData.question_text.trim(),
          option_a: formData.option_a.trim() || null,
          option_b: formData.option_b.trim() || null,
          tags: tagsArray,
          difficulty: formData.difficulty,
          is_active: true,
          sort_order: questions.length + 1,
        });
      } else if (modalMode === 'edit' && editingQuestion) {
        await updateQuestion(editingQuestion.id, {
          category_id: categoryIdMap[formData.game_type],
          game_type: formData.game_type,
          question_text: formData.question_text.trim(),
          option_a: formData.option_a.trim() || null,
          option_b: formData.option_b.trim() || null,
          tags: tagsArray,
          difficulty: formData.difficulty,
        });
      }

      setModalMode(null);
      loadQuestions();
    } catch (err: any) {
      setFormErrors({ general: err.message || 'Hata oluştu.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (q: Question) => {
    await toggleQuestionStatus(q.id, !q.is_active);
    loadQuestions();
  };

  // Filter questions
  const filtered = questions.filter(q => {
    if (selectedGameType !== 'all' && q.game_type !== selectedGameType) return false;
    if (statusFilter === 'active' && !q.is_active) return false;
    if (statusFilter === 'inactive' && q.is_active) return false;
    if (searchQuery.trim() && !q.question_text.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getGameLabel = (type: GameType) => {
    switch (type) {
      case 'sohbeti-baslat': return 'Sohbeti Başlat';
      case 'ikilemde-kal': return 'İkilemde Kal';
      case 'kim-daha-muhtemel': return 'Kim Daha Muhtemel?';
      case 'ne-kadar-taniyoruz': return 'Birbirimizi Ne Kadar Tanıyoruz?';
    }
  };

  return (
    <AdminLayout
      title="Soru Havuzu Yönetimi"
      subtitle="Platformdaki 200 hazır soruyu düzenleyin, filtreleyin veya yeni özel sorular ekleyin"
    >
      <div className="space-y-5">
        {/* Filter and Search Bar */}
        <div className="p-4 rounded-3xl bg-white border border-coffee-200 shadow-warm-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-coffee-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Soru metninde ara..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-coffee-200 bg-cream-50 text-xs text-coffee-950 focus:outline-none focus:ring-2 focus:ring-terracotta-500/40"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Game Type Filter */}
            <select
              value={selectedGameType}
              onChange={e => setSelectedGameType(e.target.value)}
              className="px-3 py-2 rounded-xl border border-coffee-200 bg-cream-50 text-xs text-coffee-800 font-semibold focus:outline-none"
            >
              <option value="all">Tüm Oyunlar ({questions.length})</option>
              <option value="sohbeti-baslat">Sohbeti Başlat</option>
              <option value="ikilemde-kal">İkilemde Kal</option>
              <option value="kim-daha-muhtemel">Kim Daha Muhtemel?</option>
              <option value="ne-kadar-taniyoruz">Birbirimizi Ne Kadar Tanıyoruz?</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-coffee-200 bg-cream-50 text-xs text-coffee-800 font-semibold focus:outline-none"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Yalnızca Aktif</option>
              <option value="inactive">Yalnızca Pasif</option>
            </select>

            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs shadow-warm flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              Soru Ekle
            </button>
          </div>
        </div>

        {/* Question Counter */}
        <div className="flex items-center justify-between text-xs text-coffee-600 px-1">
          <span>Gösterilen: <strong>{filtered.length}</strong> / {questions.length} Soru</span>
        </div>

        {/* Questions Table */}
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center space-y-2 border border-coffee-200">
            <HelpCircle className="w-8 h-8 text-coffee-400 mx-auto" />
            <p className="text-xs text-coffee-700 font-semibold">Aradığınız kriterlere uygun soru bulunamadı.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-coffee-200 shadow-warm-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream-50 text-coffee-700 uppercase font-semibold text-[10px] border-b border-coffee-200">
                  <tr>
                    <th className="py-3 px-4">Oyun Türü</th>
                    <th className="py-3 px-4">Soru Metni</th>
                    <th className="py-3 px-4">Seçenekler / Etiketler</th>
                    <th className="py-3 px-4">Durum</th>
                    <th className="py-3 px-4 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-coffee-100">
                  {filtered.slice(0, 100).map((q) => (
                    <tr key={q.id} className="hover:bg-cream-50/50 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-bold text-coffee-900 block">
                          {getGameLabel(q.game_type)}
                        </span>
                        <span className="text-[10px] text-coffee-400 font-mono">
                          {q.id}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-medium text-coffee-950 max-w-md leading-relaxed">
                          "{q.question_text}"
                        </p>
                      </td>

                      <td className="py-3 px-4 text-[11px] text-coffee-600 max-w-xs">
                        {q.game_type === 'ikilemde-kal' ? (
                          <div className="space-y-0.5">
                            <span className="text-terracotta-700 block">A: {q.option_a}</span>
                            <span className="text-caramel-700 block">B: {q.option_b}</span>
                          </div>
                        ) : q.tags && q.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {q.tags.map((t, idx) => (
                              <span key={idx} className="bg-cream-100 text-coffee-700 px-1.5 py-0.5 rounded text-[10px]">
                                #{t}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-coffee-400">-</span>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggle(q)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                            q.is_active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          {q.is_active ? 'Aktif' : 'Pasif'}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => openEditModal(q)}
                          className="p-1.5 rounded-lg text-coffee-600 hover:text-coffee-950 hover:bg-cream-100"
                          title="Düzenle"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length > 100 && (
              <div className="p-3 text-center text-xs text-coffee-500 bg-cream-50 border-t border-coffee-200">
                Performans için ilk 100 soru gösterilmektedir. Aramanızı daraltarak daha spesifik sorulara ulaşabilirsiniz.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create / Edit Question Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-lg w-full bg-white rounded-3xl p-6 shadow-warm-lg border border-coffee-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-xl text-coffee-950">
                {modalMode === 'create' ? 'Yeni Soru Ekle' : 'Soruyu Düzenle'}
              </h3>
              <button
                onClick={() => setModalMode(null)}
                className="p-1 text-coffee-400 hover:text-coffee-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formErrors.general && (
              <div className="p-3 rounded-xl bg-red-50 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formErrors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-coffee-800 mb-1">
                    Oyun Türü *
                  </label>
                  <select
                    value={formData.game_type}
                    onChange={e => setFormData({ ...formData, game_type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-coffee-200 bg-cream-50 text-xs text-coffee-900 focus:outline-none"
                  >
                    <option value="sohbeti-baslat">Sohbeti Başlat</option>
                    <option value="ikilemde-kal">İkilemde Kal</option>
                    <option value="kim-daha-muhtemel">Kim Daha Muhtemel?</option>
                    <option value="ne-kadar-taniyoruz">Birbirimizi Ne Kadar Tanıyoruz?</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-coffee-800 mb-1">
                    Zorluk Seviyesi
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={e => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-coffee-200 bg-cream-50 text-xs text-coffee-900 focus:outline-none"
                  >
                    <option value="easy">Buz Kırıcı (Kolay)</option>
                    <option value="medium">Düşündürücü (Orta)</option>
                    <option value="deep">Derin Düşünce</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-coffee-800 mb-1">
                  Soru Metni *
                </label>
                <textarea
                  rows={3}
                  value={formData.question_text}
                  onChange={e => setFormData({ ...formData, question_text: e.target.value })}
                  placeholder="Doğal ve samimi Türkçe soru metni..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 bg-cream-50 text-xs text-coffee-950 focus:outline-none focus:ring-2 focus:ring-terracotta-500/40 resize-none"
                />
                {formErrors.question_text && (
                  <p className="text-[11px] text-red-600 mt-1">{formErrors.question_text}</p>
                )}
              </div>

              {formData.game_type === 'ikilemde-kal' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-cream-50 rounded-2xl border border-coffee-200">
                  <div>
                    <label className="block text-[11px] font-bold text-coffee-800 mb-1">
                      Seçenek A *
                    </label>
                    <input
                      type="text"
                      value={formData.option_a}
                      onChange={e => setFormData({ ...formData, option_a: e.target.value })}
                      placeholder="Örn: Sıcak filtre kahve"
                      className="w-full px-3 py-2 rounded-xl border border-coffee-200 bg-white text-xs text-coffee-950 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-coffee-800 mb-1">
                      Seçenek B *
                    </label>
                    <input
                      type="text"
                      value={formData.option_b}
                      onChange={e => setFormData({ ...formData, option_b: e.target.value })}
                      placeholder="Örn: Soğuk Cold Brew"
                      className="w-full px-3 py-2 rounded-xl border border-coffee-200 bg-white text-xs text-coffee-950 focus:outline-none"
                    />
                  </div>
                  {formErrors.option_a && (
                    <p className="text-[11px] text-red-600 col-span-2">{formErrors.option_a}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-coffee-800 mb-1">
                  Etiketler (Virgülle ayırın)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Örn: Hayat, Kahve, Nostalji"
                  className="w-full px-3.5 py-2 rounded-xl border border-coffee-200 bg-cream-50 text-xs text-coffee-950 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-coffee-600 hover:bg-cream-100"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs shadow-warm flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {submitting ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
