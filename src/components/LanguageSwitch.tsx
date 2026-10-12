import React from 'react';
import { useTranslation } from '../lib/i18n';
import { Globe } from 'lucide-react';

export const LanguageSwitch: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { lang, toggleLanguage } = useTranslation();

  return (
    <button
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
        lang === 'tr'
          ? 'bg-white text-coffee-800 border-coffee-200 hover:border-terracotta-400'
          : 'bg-coffee-900 text-cream-50 border-coffee-950'
      } ${className}`}
      title={lang === 'tr' ? 'Switch to English' : 'Türkçe Dilini Seç'}
    >
      <Globe className="w-3.5 h-3.5 text-terracotta-600" />
      <span>{lang === 'tr' ? 'TR' : 'EN'}</span>
    </button>
  );
};
