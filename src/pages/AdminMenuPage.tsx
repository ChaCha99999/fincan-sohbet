import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Sparkles, 
  UtensilsCrossed, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  AlertCircle,
  Eye,
  EyeOff,
  Camera
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { getCafes, getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../lib/api';
import type { Cafe, MenuItem } from '../types';
import { MENU_CATEGORIES } from '../data/mockMenu';

export const AdminMenuPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');

  // Modal State
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [formCategory, setFormCategory] = useState('Sıcak Kahveler');
  const [formCustomCategory, setFormCustomCategory] = useState('');
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState<number>(100);
  const [formImageUrl, setFormImageUrl] = useState<string>('');
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const [formIsPopular, setFormIsPopular] = useState(false);
  const [formIsAvailable, setFormIsAvailable] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Inline Quick Price Edit
  const [quickPriceId, setQuickPriceId] = useState<string | null>(null);
  const [quickPriceValue, setQuickPriceValue] = useState<number>(0);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    const [allCafes, menuData] = await Promise.all([
      getCafes(),
      getMenuItems(id),
    ]);
    const current = allCafes.find(c => c.id === id) || null;
    setCafe(current);
    setItems(menuData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // Kategoriler (Varsayılanlar + Kafenin Eklediği Özel Kategoriler)
  const availableCategories = useMemo(() => {
    const defaultCats = MENU_CATEGORIES.filter(c => c !== 'Tümü');
    const customCats = items.map(i => i.category).filter(c => !defaultCats.includes(c as any));
    return Array.from(new Set([...defaultCats, ...customCats]));
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory =
        selectedCategory === 'Tümü' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  const openCreateModal = () => {
    setFormCategory('Sıcak Kahveler');
    setFormCustomCategory('');
    setFormName('');
    setFormDescription('');
    setFormPrice(100);
    setFormImageUrl('');
    setImageInputMode('upload');
    setFormIsPopular(false);
    setFormIsAvailable(true);
    setFormError(null);
    setActiveItem(null);
    setModalMode('create');
  };

  const openEditModal = (item: MenuItem) => {
    setFormCategory(item.category);
    setFormCustomCategory('');
    setFormName(item.name);
    setFormDescription(item.description || '');
    setFormPrice(item.price);
    setFormImageUrl(item.image_url || '');
    setImageInputMode(item.image_url?.startsWith('data:') ? 'upload' : 'url');
    setFormIsPopular(item.is_popular || false);
    setFormIsAvailable(item.is_available !== false);
    setFormError(null);
    setActiveItem(item);
    setModalMode('edit');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 6 * 1024 * 1024) {
      setFormError('Lütfen 6 MB altında bir fotoğraf seçin.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 500;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height *= maxDim / width;
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width *= maxDim / height;
            height = maxDim;
          }
        }
        canvas.width = Math.round(width);
        canvas.height = Math.round(height);
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL('image/jpeg', 0.8);
        setFormImageUrl(compressed);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError('Lütfen ürün adını girin.');
      return;
    }

    if (formPrice <= 0) {
      setFormError('Lütfen geçerli bir fiyat girin.');
      return;
    }

    const category = formCategory === '__custom__' 
      ? formCustomCategory.trim() 
      : formCategory;

    if (!category) {
      setFormError('Lütfen bir kategori belirleyin.');
      return;
    }

    setSubmitting(true);
    try {
      const cleanImageUrl = formImageUrl.trim() || undefined;

      if (modalMode === 'create' && id) {
        await createMenuItem({
          cafe_id: id,
          category,
          name: formName.trim(),
          description: formDescription.trim() || undefined,
          price: Number(formPrice),
          currency: '₺',
          image_url: cleanImageUrl,
          is_popular: formIsPopular,
          is_available: formIsAvailable,
        });
      } else if (modalMode === 'edit' && activeItem) {
        await updateMenuItem(activeItem.id, {
          category,
          name: formName.trim(),
          description: formDescription.trim() || undefined,
          price: Number(formPrice),
          image_url: cleanImageUrl || null,
          is_popular: formIsPopular,
          is_available: formIsAvailable,
        });
      }
      setModalMode(null);
      loadData();
    } catch (err: any) {
      setFormError(err.message || 'Ürün kaydedilirken bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePopular = async (item: MenuItem) => {
    await updateMenuItem(item.id, { is_popular: !item.is_popular });
    setItems(prev => prev.map(m => m.id === item.id ? { ...m, is_popular: !m.is_popular } : m));
  };

  const handleToggleAvailable = async (item: MenuItem) => {
    const next = item.is_available === false ? true : false;
    await updateMenuItem(item.id, { is_available: next });
    setItems(prev => prev.map(m => m.id === item.id ? { ...m, is_available: next } : m));
  };

  const handleDelete = async (item: MenuItem) => {
    if (window.confirm(`"${item.name}" ürününü menüden silmek istediğinize emin misiniz?`)) {
      await deleteMenuItem(item.id, id);
      setItems(prev => prev.filter(m => m.id !== item.id));
    }
  };

  const handleSaveQuickPrice = async (item: MenuItem) => {
    if (quickPriceValue > 0) {
      await updateMenuItem(item.id, { price: quickPriceValue });
      setItems(prev => prev.map(m => m.id === item.id ? { ...m, price: quickPriceValue } : m));
    }
    setQuickPriceId(null);
  };

  // İstatistikler
  const totalCount = items.length;
  const popularCount = items.filter(i => i.is_popular).length;
  const outOfStockCount = items.filter(i => i.is_available === false).length;

  return (
    <AdminLayout title={`${cafe?.name || 'Kafe'} — Menü Yönetimi`}>
      <div className="space-y-6">
        {/* Üst Başlık & Geri Dön Butonu */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              to="/admin/cafes"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-coffee-600 hover:text-terracotta-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kafeler Listesine Dön
            </Link>
            <h2 className="font-serif font-black text-2xl text-coffee-950">
              {cafe ? `${cafe.name} Menüsü` : 'Menü Yönetimi'}
            </h2>
            <p className="text-xs text-coffee-600">
              Masadaki müşterilerin QR ile göreceği kahve, tatlı ve fiyat listesini buradan yönetin.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs shadow-warm flex items-center justify-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Yeni Ürün Ekle
          </button>
        </div>

        {/* İstatistik Rozetleri */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-coffee-200/80 shadow-warm-sm">
            <span className="text-[11px] font-semibold text-coffee-500 uppercase tracking-wider block">
              Toplam Ürün
            </span>
            <span className="font-serif font-extrabold text-2xl text-coffee-950 mt-1 block">
              {totalCount}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-coffee-200/80 shadow-warm-sm">
            <span className="text-[11px] font-semibold text-caramel-700 uppercase tracking-wider block">
              Popüler Ürünler
            </span>
            <span className="font-serif font-extrabold text-2xl text-caramel-800 mt-1 block">
              {popularCount}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-coffee-200/80 shadow-warm-sm">
            <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block">
              Tükendi / Kapalı
            </span>
            <span className="font-serif font-extrabold text-2xl text-rose-800 mt-1 block">
              {outOfStockCount}
            </span>
          </div>
        </div>

        {/* Arama & Kategori Filtreleri */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-coffee-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Menüde ara (örn: americano, cheesecake)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-coffee-200 text-xs text-coffee-900 placeholder:text-coffee-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedCategory('Tümü')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'Tümü'
                  ? 'bg-coffee-900 text-white shadow-warm'
                  : 'bg-white text-coffee-700 hover:bg-cream-100 border border-coffee-200'
              }`}
            >
              Tümü ({items.length})
            </button>
            {availableCategories.map(cat => {
              const count = items.filter(i => i.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-coffee-900 text-white shadow-warm'
                      : 'bg-white text-coffee-700 hover:bg-cream-100 border border-coffee-200'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Ürün Listesi */}
        {loading ? (
          <div className="p-12 text-center text-xs text-coffee-600 bg-white rounded-3xl border border-coffee-200">
            Menü yükleniyor...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-coffee-200 text-coffee-600 space-y-3">
            <UtensilsCrossed className="w-10 h-10 mx-auto text-coffee-400" />
            <p className="font-bold text-sm text-coffee-900">Ürün bulunamadı</p>
            <p className="text-xs text-coffee-500 max-w-sm mx-auto">
              Bu kategoride veya aramada ürün yok. Yeni ürün ekleyerek menünüzü zenginleştirebilirsiniz.
            </p>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-xl bg-terracotta-600 text-white font-bold text-xs inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Ürün Ekle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredItems.map(item => {
              const isAvailable = item.is_available !== false;
              const isPopular = item.is_popular === true;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl bg-white border transition-all flex flex-col justify-between gap-3 ${
                    isAvailable 
                      ? 'border-coffee-200/80 shadow-warm-sm hover:border-terracotta-300' 
                      : 'border-red-200 bg-red-50/20 opacity-75'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Ürün Görseli */}
                    {item.image_url ? (
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-cream-100 shrink-0 border border-coffee-200/60 shadow-xs">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-cream-100 text-coffee-400 flex items-center justify-center shrink-0 border border-coffee-200/40">
                        <UtensilsCrossed className="w-5 h-5 opacity-40" />
                      </div>
                    )}

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-coffee-500 bg-cream-100 px-2 py-0.5 rounded-md">
                            {item.category}
                          </span>
                          {isPopular && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-caramel-800 bg-caramel-100 px-2 py-0.5 rounded-md">
                              <Sparkles className="w-3 h-3" />
                              Popüler
                            </span>
                          )}
                          {!isAvailable && (
                            <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                              Tükendi
                            </span>
                          )}
                        </div>

                        {/* Fiyat Görünümü & Hızlı Düzenleme */}
                        <div className="shrink-0 text-right">
                          {quickPriceId === item.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={quickPriceValue}
                                onChange={e => setQuickPriceValue(Number(e.target.value))}
                                className="w-18 px-2 py-1 text-xs font-bold rounded-lg border border-terracotta-400 bg-white"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveQuickPrice(item)}
                                className="p-1 rounded-md bg-emerald-600 text-white"
                                title="Kaydet"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => setQuickPriceId(null)}
                                className="p-1 rounded-md bg-coffee-200 text-coffee-700"
                                title="İptal"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setQuickPriceId(item.id);
                                setQuickPriceValue(item.price);
                              }}
                              className="font-serif font-black text-lg text-terracotta-700 hover:text-terracotta-800 hover:underline flex items-center gap-1"
                              title="Fiyatı Değiştir"
                            >
                              <span>{item.price} {item.currency || '₺'}</span>
                              <Edit3 className="w-3 h-3 opacity-40 hover:opacity-100" />
                            </button>
                          )}
                        </div>
                      </div>

                      <h4 className="font-bold text-sm text-coffee-950 pt-1">
                        {item.name}
                      </h4>
                      {item.description && (
                        <p className="text-xs text-coffee-600 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Alt Kontroller */}
                  <div className="pt-2 border-t border-coffee-100 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      {/* Popüler Toggle */}
                      <button
                        onClick={() => handleTogglePopular(item)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isPopular 
                            ? 'bg-caramel-100 text-caramel-800 border-caramel-300' 
                            : 'text-coffee-400 hover:text-caramel-700 border-coffee-200 hover:bg-cream-50'
                        }`}
                        title={isPopular ? 'Popülerden Kaldır' : 'Popüler Olarak İşaretle'}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>

                      {/* Stok Durumu Toggle */}
                      <button
                        onClick={() => handleToggleAvailable(item)}
                        className={`px-2 py-1 rounded-lg border text-[11px] font-bold transition-colors flex items-center gap-1 ${
                          isAvailable
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                        }`}
                        title="Stok Durumunu Değiştir"
                      >
                        {isAvailable ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{isAvailable ? 'Satışta' : 'Tükendi'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 rounded-lg text-coffee-600 hover:text-coffee-950 hover:bg-cream-100 transition-colors"
                        title="Düzenle"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ürün Ekle / Düzenle Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-950/50 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-warm-lg border border-coffee-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-xl text-coffee-950">
                {modalMode === 'create' ? 'Yeni Ürün Ekle' : 'Ürünü Düzenle'}
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

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Kategori Seçimi */}
              <div>
                <label className="block text-xs font-semibold text-coffee-800 mb-1">
                  Kategori *
                </label>
                <select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-coffee-200 bg-cream-50 text-xs text-coffee-950 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                >
                  {availableCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="__custom__">+ Yeni Kategori Oluştur...</option>
                </select>
                {formCategory === '__custom__' && (
                  <input
                    type="text"
                    value={formCustomCategory}
                    onChange={e => setFormCustomCategory(e.target.value)}
                    placeholder="Örn: Kahvaltılıklar"
                    className="w-full mt-2 px-3 py-2 rounded-xl border border-coffee-200 bg-white text-xs text-coffee-950"
                  />
                )}
              </div>

              {/* Ürün Adı */}
              <div>
                <label className="block text-xs font-semibold text-coffee-800 mb-1">
                  Ürün Adı *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="Örn: Yulaflı Iced Latte"
                  className="w-full px-3 py-2 rounded-xl border border-coffee-200 bg-cream-50 text-xs text-coffee-950 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>

              {/* Fiyat */}
              <div>
                <label className="block text-xs font-semibold text-coffee-800 mb-1">
                  Fiyat (₺) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-coffee-500">₺</span>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={e => setFormPrice(Number(e.target.value))}
                    min={1}
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-coffee-200 bg-cream-50 text-xs text-coffee-950 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                  />
                </div>
              </div>

              {/* Açıklama */}
              <div>
                <label className="block text-xs font-semibold text-coffee-800 mb-1">
                  Açıklama / İçindekiler (İsteğe Bağlı)
                </label>
                <textarea
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Örn: Double espresso, yulaf sütü ve vanilya aromasıyla hazırlanır."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-coffee-200 bg-cream-50 text-xs text-coffee-950 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>

              {/* Ürün Fotoğrafı (Dosyadan / Kameradan veya URL) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-coffee-800">
                    Ürün Fotoğrafı (İsteğe Bağlı)
                  </label>
                  <div className="flex items-center gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setImageInputMode('upload')}
                      className={`px-2 py-0.5 rounded-lg font-bold transition-colors ${
                        imageInputMode === 'upload' ? 'bg-coffee-900 text-white' : 'text-coffee-600 hover:bg-cream-100'
                      }`}
                    >
                      Kamera / Dosya
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('url')}
                      className={`px-2 py-0.5 rounded-lg font-bold transition-colors ${
                        imageInputMode === 'url' ? 'bg-coffee-900 text-white' : 'text-coffee-600 hover:bg-cream-100'
                      }`}
                    >
                      Görsel Linki
                    </button>
                  </div>
                </div>

                {/* Ön İzleme (Varsa) */}
                {formImageUrl ? (
                  <div className="relative w-full h-28 rounded-2xl overflow-hidden border border-coffee-200 bg-cream-100 group">
                    <img
                      src={formImageUrl}
                      alt="Ön İzleme"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormImageUrl('')}
                      className="absolute top-2 right-2 p-1.5 rounded-xl bg-coffee-950/70 hover:bg-rose-700 text-white text-xs transition-colors shadow-md"
                      title="Fotoğrafı Kaldır"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : imageInputMode === 'upload' ? (
                  <label className="flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 border-dashed border-coffee-200 bg-cream-50/60 hover:bg-cream-100 hover:border-terracotta-400 cursor-pointer transition-all group">
                    <div className="w-9 h-9 rounded-xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                      <Camera className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-coffee-900">
                      Fotoğraf Seç veya Kamerayla Çek
                    </span>
                    <span className="text-[10px] text-coffee-500 mt-0.5">
                      PNG, JPG, WEBP (Otomatik sıkıştırılır)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative">
                    <input
                      type="url"
                      value={formImageUrl}
                      onChange={e => setFormImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/... veya görsel linki"
                      className="w-full px-3 py-2 rounded-xl border border-coffee-200 bg-cream-50 text-xs text-coffee-950 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                    />
                  </div>
                )}
              </div>

              {/* Anahtarlar (Popüler & Satışta) */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-coffee-200 bg-cream-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsPopular}
                    onChange={e => setFormIsPopular(e.target.checked)}
                    className="rounded text-terracotta-600 focus:ring-terracotta-500"
                  />
                  <span className="text-xs font-semibold text-coffee-800">⭐ Popüler</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-coffee-200 bg-cream-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsAvailable}
                    onChange={e => setFormIsAvailable(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-semibold text-coffee-800">✓ Satışta</span>
                </label>
              </div>

              {/* Aksiyon Butonları */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-coffee-100">
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
                  className="px-5 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs shadow-warm disabled:opacity-50"
                >
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
