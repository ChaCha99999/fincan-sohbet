import type { AppConfig } from '../types';

export const APP_CONFIG: AppConfig = {
  brandName: 'Fincan Sohbet',
  tagline: 'Kafeler İçin QR & NFC Sohbet ve Mini Oyun Platformu',
  slogan: 'Kahveni al, bir soru seç, sohbeti başlat.',
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || 'iletisim@fincansohbet.com (Yapılandırılabilir)',
  contactPhone: import.meta.env.VITE_CONTACT_PHONE || undefined,
  supportLink: 'https://wa.me/?text=Fincan%20Sohbet%20bilgi%20talebi',
  appUrl: typeof window !== 'undefined' ? window.location.origin : (import.meta.env.VITE_APP_URL || 'http://localhost:5173'),
  demoMode: !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_DEMO_MODE === 'true',
  pricing: {
    name: 'Kafe Başlangıç Paketi',
    price: 390,
    currency: '₺',
    period: 'aylık',
    description: 'Tüm masalar için sınırsız QR/NFC erişimi, tüm mini oyunlar ve yönetim paneli dahil.',
    features: [
      'Sınırsız masa tanımlama & QR kod üretimi',
      'Yüksek çözünürlüklü SVG / PNG masa baskı şablonu',
      '4 interaktif mini oyun & 200+ özgün soru havuzu',
      'NFC etiket kurulum desteği',
      'Masa ve oyun açılış istatistikleri',
      'Kendi sorularınızı ekleyebileceğiniz yönetim paneli',
      'Müşteri için uygulama indirme ve parola ZORUNLULUĞU YOK',
    ]
  }
};

export const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return import.meta.env.VITE_APP_URL || 'http://localhost:5173';
};

export const getTableUrl = (publicToken: string): string => {
  return `${getBaseUrl()}/t/${publicToken}`;
};
