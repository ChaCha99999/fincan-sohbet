import { useState, useEffect } from 'react';

export type Language = 'tr' | 'en';

const LANGUAGE_STORAGE_KEY = 'fincan_language_pref';

export const translations = {
  tr: {
    // Genel
    loading: 'Yükleniyor...',
    tableActive: 'Masa Aktif',
    tableWifi: 'Masa Wi-Fi',
    copyWifi: 'Şifreyi Kopyala',
    copied: 'Kopyalandı!',
    backToTable: 'Masa Ekranına Dön',
    backToHome: 'Ana Sayfa',
    backToGames: 'Oyun Seçimine Dön',
    endGame: 'Bu Oyunu Bitir ve Menüye Dön',

    // Tablar & Portal
    tabPortal: 'Masa',
    tabMenu: 'Kafe Menüsü',
    tabGames: 'Sohbet & Oyun',
    welcomeTable: 'Masaya Hoş Geldiniz!',
    whatToDo: 'Ne Yapmak İstersiniz?',
    whatToDoDesc: 'Siparişinizi vermeden önce menüye göz atabilir veya kahvenizi beklerken sohbete başlayabilirsiniz.',
    exploreMenuTitle: 'Kafe Menüsünü İncele',
    exploreMenuDesc: 'Sıcak ve soğuk kahveler, taze fırın tatlıları ve tüm ürünlerin güncel fiyat listesi.',
    orderBeforeBadge: 'Sipariş Öncesi',
    findTopicTitle: 'Konuşacak Konu Arıyoruz!',
    findTopicDesc: 'Sipariş hazırlanırken veya masada sessizlik olunca: Buz kırıcı sorular, ikilemler ve tahmin oyunları.',
    fourGamesBadge: '4 Mini Oyun',

    // Menü
    searchMenu: 'Menüde ürün veya içerik ara...',
    popularBadge: 'Popüler',
    outOfStock: 'Tükendi',
    officialMenu: 'Resmi QR Menü',
    officialMenuDesc: 'Kafenin kendi dijital menüsünü açmak için dokunun',
    openMenuBtn: 'Menüyü Aç',

    // Oyunlar
    chooseGameTitle: 'Bir Oyun Seçin',
    chooseGameDesc: 'Telefonu masanın ortasına koyun. Sırayla soruları okuyun ve kahvenin tadını çıkarın.',
    startGame: 'Oyunu Başlat',
    singlePhoneNotice: 'Tüm oyunlar tek bir telefon üzerinden oynanır. Ek bir cihaz veya uygulama gerekmez.',
    nextQuestion: 'Yeni Soru Getir',
    howToPlay: 'Nasıl Oynanır?',
    gotItContinue: 'Anladım, Devam Et',
    passText: 'Pas',
    turnRule: 'Sırayla herkes cevaplasın',
    seenCount: 'Görülen',
    round: 'Tur',
    playerSetup: 'Oyuncu Kurulumu',
    addPlayer: 'Oyuncu Ekle',
    namePlaceholder: 'İsim yazın...',
    startGameBtn: 'Oyunu Başlat',
    atLeastTwoPlayers: 'En az 2 oyuncu eklemelisiniz',
    scoresTitle: 'Skor Tablosu',
    point: 'Puan',
    voteThisPlayer: 'Bu Kişiye Oy Ver',
    nextRound: 'Sonraki Soru',
  },
  en: {
    // General
    loading: 'Loading...',
    tableActive: 'Table Active',
    tableWifi: 'Table Wi-Fi',
    copyWifi: 'Copy Password',
    copied: 'Copied!',
    backToTable: 'Back to Table',
    backToHome: 'Home',
    backToGames: 'Back to Games',
    endGame: 'Finish Game & Return to Menu',

    // Tabs & Portal
    tabPortal: 'Table',
    tabMenu: 'Cafe Menu',
    tabGames: 'Chat & Games',
    welcomeTable: 'Welcome to your Table!',
    whatToDo: 'What would you like to do?',
    whatToDoDesc: 'Browse the menu before ordering, or start a lively conversation while waiting for your coffee.',
    exploreMenuTitle: 'Browse Cafe Menu',
    exploreMenuDesc: 'Hot and iced coffees, fresh artisan pastries, and current prices.',
    orderBeforeBadge: 'Before Ordering',
    findTopicTitle: 'Looking for a Conversation Topic!',
    findTopicDesc: 'Icebreakers, intriguing dilemmas, and fun guess-the-answer games right at your table.',
    fourGamesBadge: '4 Mini Games',

    // Menu
    searchMenu: 'Search menu items...',
    popularBadge: 'Popular',
    outOfStock: 'Sold Out',
    officialMenu: 'Official QR Menu',
    officialMenuDesc: 'Tap to view the cafe’s original digital menu',
    openMenuBtn: 'Open Menu',

    // Games
    chooseGameTitle: 'Choose a Game',
    chooseGameDesc: 'Place the phone in the center of the table. Take turns answering and enjoy your coffee.',
    startGame: 'Start Game',
    singlePhoneNotice: 'All games are played on a single phone. No app download or second device needed.',
    nextQuestion: 'Next Question',
    howToPlay: 'How to Play?',
    gotItContinue: 'Got it, Continue',
    passText: 'Pass',
    turnRule: 'Take turns answering',
    seenCount: 'Seen',
    round: 'Round',
    playerSetup: 'Player Setup',
    addPlayer: 'Add Player',
    namePlaceholder: 'Enter name...',
    startGameBtn: 'Start Game',
    atLeastTwoPlayers: 'Add at least 2 players',
    scoresTitle: 'Scoreboard',
    point: 'Pts',
    voteThisPlayer: 'Vote for this Person',
    nextRound: 'Next Question',
  }
};

export const getStoredLanguage = (): Language => {
  if (typeof window === 'undefined') return 'tr';
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
    if (saved === 'tr' || saved === 'en') return saved;
  } catch {}
  return 'tr';
};

export const setStoredLanguage = (lang: Language) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    window.dispatchEvent(new Event('languagechange'));
  } catch {}
};

export const useTranslation = () => {
  const [lang, setLang] = useState<Language>(getStoredLanguage);

  useEffect(() => {
    const handler = () => {
      setLang(getStoredLanguage());
    };
    window.addEventListener('languagechange', handler);
    return () => window.removeEventListener('languagechange', handler);
  }, []);

  const toggleLanguage = () => {
    const nextLang: Language = lang === 'tr' ? 'en' : 'tr';
    setStoredLanguage(nextLang);
    setLang(nextLang);
  };

  const t = translations[lang];

  return { lang, toggleLanguage, t, setLanguage: setStoredLanguage };
};
