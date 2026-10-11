import type { Category } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-sohbet',
    name: 'Sohbeti Başlat',
    slug: 'sohbeti-baslat',
    description: 'Sessizliği kıran, kahve eşliğinde derin veya eğlenceli sohbetler açan samimi sorular.',
    estimated_time: '15-30 dk',
    icon: 'MessageCircle',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'cat-ikilem',
    name: 'İkilemde Kal',
    slug: 'ikilemde-kal',
    description: 'İki zor seçenek arasında seçim yap, masadaki herkes nedenini savunsun.',
    estimated_time: '10-20 dk',
    icon: 'Split',
    sort_order: 2,
    is_active: true,
  },
  {
    id: 'cat-muhtemel',
    name: 'Kim Daha Muhtemel?',
    slug: 'kim-daha-muhtemel',
    description: 'Gruptaki arkadaşlarınızdan hangisi bu duruma daha çok uyuyor? Parmaklar aynı anda gösterilsin!',
    estimated_time: '15-25 dk',
    icon: 'Users',
    sort_order: 3,
    is_active: true,
  },
  {
    id: 'cat-taniyoruz',
    name: 'Birbirimizi Ne Kadar Tanıyoruz?',
    slug: 'ne-kadar-taniyoruz',
    description: 'Sırası gelen kişinin vereceği cevabı doğru tahmin etmeye çalışın, masadaki puanları toplayın.',
    estimated_time: '20-35 dk',
    icon: 'HeartHandshake',
    sort_order: 4,
    is_active: true,
  },
];
