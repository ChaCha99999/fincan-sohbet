import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, 
  Plus, 
  Layers, 
  Edit3, 
  X, 
  Save, 
  AlertCircle 
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { getCafes, createCafe, updateCafe, toggleCafeStatus } from '../lib/api';
import type { Cafe } from '../types';

export const AdminCafesPage: React.FC = () => {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [activeCafe, setActiveCafe] = useState<Cafe | null>(null);

  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadCafes = () => {
    setLoading(true);
    getCafes().then((res) => {
      setCafes(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadCafes();
  }, []);

  const openCreateModal = () => {
    setFormName('');
    setFormSlug('');
    setFormError(null);
    setActiveCafe(null);
    setModalMode('create');
  };

  const openEditModal = (cafe: Cafe) => {
    setFormName(cafe.name);
    setFormSlug(cafe.slug);
    setFormError(null);
    setActiveCafe(cafe);
    setModalMode('edit');
  };

  const handleSlugAuto = (name: string) => {
    setFormName(name);
    if (modalMode === 'create') {
      const generated = name
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setFormSlug(generated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError('Lütfen kafe adını girin.');
      return;
    }

    if (!formSlug.trim()) {
      setFormError('Lütfen kafe URL kısa adını (slug) girin.');
      return;
    }

    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        await createCafe(formName.trim(), formSlug.trim());
      } else if (modalMode === 'edit' && activeCafe) {
        await updateCafe(activeCafe.id, { name: formName.trim(), slug: formSlug.trim() });
      }
      setModalMode(null);
      loadCafes();
    } catch (err: any) {
      setFormError(err.message || 'Bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (cafe: Cafe) => {
    const nextStatus = cafe.status === 'active' ? 'inactive' : 'active';
    const confirmMessage = nextStatus === 'inactive'
      ? `"${cafe.name}" kafesini pasifleştirmek istediğinize emin misiniz? Müşteriler masalardan oyuna erişemeyecektir.`
      : `"${cafe.name}" kafesini tekrar aktif yapmak istiyor musunuz?`;

    if (window.confirm(confirmMessage)) {
      await toggleCafeStatus(cafe.id, nextStatus);
      loadCafes();
    }
  };

  return (
    <AdminLayout
      title="Kafe Yönetimi"
      subtitle="Kayıtlı işletmeleri görüntüleyin, durumlarını değiştirin veya masalarını yönetin"
    >
      <div className="space-y-4">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-coffee-600 font-semibold">
            Toplam {cafes.length} Kafe
          </span>
          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs shadow-warm flex items-center gap-1.5 transition-transform active:scale-98"
          >
            <Plus className="w-4 h-4" />
            Yeni Kafe Ekle
          </button>
        </div>

        {/* Cafe Cards / Table */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : cafes.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center space-y-3 border border-coffee-200">
            <Store className="w-8 h-8 text-coffee-400 mx-auto" />
            <p className="text-sm text-coffee-700 font-semibold">Henüz kayıtlı kafe bulunmuyor.</p>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-xl bg-terracotta-600 text-white text-xs font-bold"
            >
              İlk Kafeyi Ekle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cafes.map((cafe) => {
              const isActive = cafe.status === 'active';
              return (
                <div
                  key={cafe.id}
                  className="bg-white rounded-3xl p-5 border border-coffee-200 shadow-warm-sm flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-cream-100 text-coffee-800 flex items-center justify-center shrink-0">
                          <Store className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-coffee-950 leading-tight">
                            {cafe.name}
                          </h3>
                          <span className="text-[11px] text-coffee-500 font-mono">
                            /{cafe.slug}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleStatus(cafe)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                        }`}
                        title="Durumu Değiştir"
                      >
                        {isActive ? 'Aktif' : 'Pasif'}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-coffee-600 pt-2">
                      <Layers className="w-3.5 h-3.5 text-caramel-600" />
                      <span>{cafe.table_count || 0} Tanımlı Masa</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-coffee-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => openEditModal(cafe)}
                      className="p-2 rounded-xl hover:bg-cream-100 text-coffee-600 hover:text-coffee-950 transition-colors"
                      title="Düzenle"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <Link
                      to={`/admin/cafes/${cafe.id}/tables`}
                      className="flex-1 py-2 px-3 rounded-xl bg-cream-100 hover:bg-coffee-900 hover:text-white text-coffee-900 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      Masaları Yönet ({cafe.table_count || 0})
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create / Edit Cafe Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-950/50 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-warm-lg border border-coffee-200 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-xl text-coffee-950">
                {modalMode === 'create' ? 'Yeni Kafe Ekle' : 'Kafeyi Düzenle'}
              </h3>
              <button
                onClick={() => setModalMode(null)}
                className="p-1 rounded-lg text-coffee-400 hover:text-coffee-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-coffee-800 mb-1">
                  Kafe Adı *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => handleSlugAuto(e.target.value)}
                  placeholder="Örn: Moda Fincan Kahve"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 bg-cream-50 text-xs text-coffee-950 focus:outline-none focus:ring-2 focus:ring-terracotta-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-coffee-800 mb-1">
                  URL Kısa Adı (Slug) *
                </label>
                <input
                  type="text"
                  value={formSlug}
                  onChange={e => setFormSlug(e.target.value)}
                  placeholder="moda-fincan-kahve"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 bg-cream-50 text-xs text-coffee-950 font-mono focus:outline-none focus:ring-2 focus:ring-terracotta-500/40"
                />
                <span className="text-[10px] text-coffee-500 mt-1 block">
                  Küçük harf, rakam ve tire (-) içerebilir.
                </span>
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
