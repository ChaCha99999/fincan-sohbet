import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ExternalLink, 
  Wifi, 
  Copy, 
  Check, 
  Sparkles, 
  Coffee, 
  UtensilsCrossed, 
  Info,
  ArrowRight
} from 'lucide-react';
import type { Cafe, Table, MenuItem } from '../types';
import { DEFAULT_MENU_ITEMS, MENU_CATEGORIES } from '../data/mockMenu';
import { getMenuItems } from '../lib/api';
import { useTranslation } from '../lib/i18n';

interface CafeMenuViewProps {
  cafe?: Table['cafe'] | Cafe | null;
  tableLabel?: string;
  onSwitchToGames: () => void;
}

export const CafeMenuView: React.FC<CafeMenuViewProps> = ({
  cafe,
  tableLabel,
  onSwitchToGames,
}) => {
  const { t, lang } = useTranslation();
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DEFAULT_MENU_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedWifi, setCopiedWifi] = useState<boolean>(false);

  useEffect(() => {
    if (cafe?.id) {
      getMenuItems(cafe.id).then((items) => {
        if (items && items.length > 0) {
          setMenuItems(items);
        }
      });
    }
  }, [cafe?.id]);

  const categoryList = useMemo(() => {
    const defaultCats = MENU_CATEGORIES.filter(c => c !== 'Tümü');
    const customCats = menuItems.map(i => i.category).filter(c => !defaultCats.includes(c as any));
    return ['Tümü', ...Array.from(new Set([...defaultCats, ...customCats]))];
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'Tümü' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const handleCopyWifi = () => {
    if (cafe?.wifi_password) {
      navigator.clipboard.writeText(cafe.wifi_password);
      setCopiedWifi(true);
      setTimeout(() => setCopiedWifi(false), 2000);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* External Menu Banner (Eğer işletme kendi linkini girdiyse) */}
      {cafe?.menu_url && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-coffee-900 to-coffee-800 text-cream-50 shadow-warm flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-caramel-300">
              {t.officialMenu}
            </span>
            <p className="text-sm font-semibold text-white">
              {t.officialMenuDesc}
            </p>
          </div>
          <a
            href={cafe.menu_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-terracotta-600 hover:bg-terracotta-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {t.openMenuBtn}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Wi-Fi Bilgisi Kartı (Masa için süper pratik detay) */}
      {(cafe?.wifi_name || cafe?.wifi_password) && (
        <div className="p-3.5 rounded-2xl bg-white border border-coffee-200/80 shadow-warm-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-caramel-100 text-caramel-800 flex items-center justify-center shrink-0">
              <Wifi className="w-4 h-4" />
            </div>
            <div className="text-left text-xs">
              <span className="text-coffee-500 font-medium">{t.tableWifi}:</span>
              <p className="font-bold text-coffee-900">
                {cafe.wifi_name || 'Kafe Wi-Fi'} 
                {cafe.wifi_password && (
                  <span className="text-coffee-600 font-normal ml-1">
                    (Şifre: <code className="bg-cream-100 px-1 py-0.5 rounded font-mono text-[11px] font-bold text-coffee-800">{cafe.wifi_password}</code>)
                  </span>
                )}
              </p>
            </div>
          </div>
          {cafe?.wifi_password && (
            <button
              onClick={handleCopyWifi}
              className="p-2 rounded-lg text-coffee-600 hover:text-coffee-950 hover:bg-cream-100 transition-colors shrink-0"
              title={t.copyWifi}
            >
              {copiedWifi ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      )}

      {/* Arama Çubuğu */}
      <div className="relative">
        <Search className="w-4 h-4 text-coffee-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchMenu}
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-cream-100 border-2 border-coffee-950/20 text-xs sm:text-sm text-coffee-950 placeholder:text-coffee-500 focus:outline-none focus:border-coffee-950 shadow-xs transition-all"
        />
      </div>

      {/* Kategori Butonları (Yatay Kaydırılabilir) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
        {categoryList.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 border-2 ${
              selectedCategory === cat
                ? 'bg-coffee-950 text-cream-50 border-coffee-950 shadow-xs'
                : 'bg-cream-100 text-coffee-800 hover:bg-cream-200 border-coffee-950/15'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menü Öğeleri Listesi */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-10 px-4 bg-cream-100 rounded-3xl border-2 border-coffee-950/20 text-coffee-600 space-y-2">
            <UtensilsCrossed className="w-8 h-8 mx-auto text-coffee-400" />
            <p className="font-semibold text-sm">Aradığınız kriterde ürün bulunamadı.</p>
            <p className="text-xs text-coffee-500">Arama kelimesini değiştirmeyi veya filtreyi temizlemeyi deneyin.</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isAvailable = item.is_available !== false;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-3xl bg-cream-100 border-2 transition-all flex items-start gap-3.5 text-left ${
                  isAvailable 
                    ? 'border-coffee-950/20 hover:border-coffee-950 hover:shadow-print-sm' 
                    : 'border-red-200 opacity-60 bg-cream-50'
                }`}
              >
                {/* Ürün Görseli (Varsa) */}
                {item.image_url && (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-cream-50 shrink-0 border-2 border-coffee-950/20 shadow-xs">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm sm:text-base text-coffee-950 leading-snug">
                      {item.name}
                    </h3>
                    {item.is_popular && isAvailable && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-caramel-300 text-coffee-950 border border-coffee-950/20 text-[10px] font-bold">
                        <Sparkles className="w-3 h-3" />
                        {t.popularBadge}
                      </span>
                    )}
                    {!isAvailable && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                        {t.outOfStock}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-coffee-600 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <span className="text-[10px] font-bold text-coffee-500 uppercase tracking-wider block pt-0.5">
                    {item.category}
                  </span>
                </div>

                <div className="text-right shrink-0 pt-0.5">
                  <span className="font-serif font-black text-base sm:text-lg text-terracotta-700 block">
                    {item.price} {item.currency || '₺'}
                  </span>
                </div>
              </div>
          );
        })
        )}
      </div>

      {/* Sipariş Notu & Oyuna Geçiş Çıkartması */}
      <div className="p-5 rounded-3xl bg-cream-200/90 border-2 border-coffee-950 text-coffee-900 space-y-3 text-left shadow-print-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-coffee-950">
          <Info className="w-4 h-4 text-terracotta-600 shrink-0" />
          <span>{lang === 'en' ? 'You can place your order with the staff.' : 'Siparişinizi garsonunuza iletebilirsiniz.'}</span>
        </div>
        <p className="text-xs text-coffee-700 leading-relaxed">
          {lang === 'en'
            ? `While your order is being prepared, start icebreaker games and conversations right at ${tableLabel || 'your table'}!`
            : `${tableLabel ? `${tableLabel} için ` : ''}siparişiniz hazırlanırken masada sıkılmayın! Tek dokunuşla buz kırıcı sohbet sorularını ve mini oyunları başlatın.`}
        </p>
        <button
          onClick={onSwitchToGames}
          className="w-full btn-primary !py-3 !text-xs flex items-center justify-center gap-2"
        >
          <Coffee className="w-4 h-4" />
          <span>{lang === 'en' ? 'While Waiting: Switch to Social Games' : 'Kahveyi Beklerken: Sohbet Oyunlarına Geç'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
