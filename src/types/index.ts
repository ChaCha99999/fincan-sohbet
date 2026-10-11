export type GameType = 
  | 'sohbeti-baslat'
  | 'ikilemde-kal'
  | 'kim-daha-muhtemel'
  | 'ne-kadar-taniyoruz';

export type CafeStatus = 'active' | 'inactive';

export interface Cafe {
  id: string;
  name: string;
  slug: string;
  status: CafeStatus;
  created_at: string;
  updated_at?: string;
  table_count?: number;
}

export interface Table {
  id: string;
  cafe_id: string;
  label: string;
  public_token: string;
  is_active: boolean;
  created_at: string;
  cafe?: {
    id: string;
    name: string;
    slug: string;
    status: CafeStatus;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: GameType;
  description: string;
  estimated_time: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
}

export interface Question {
  id: string;
  category_id: string;
  game_type: GameType;
  question_text: string;
  option_a?: string | null;
  option_b?: string | null;
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'deep';
  is_active: boolean;
  sort_order: number;
  created_at?: string;
}

export type EventType = 'table_open' | 'game_start' | 'game_complete';

export interface UsageEvent {
  id: string;
  cafe_id: string;
  table_id: string;
  event_type: EventType;
  game_type?: GameType | null;
  created_at: string;
  cafe_name?: string;
  table_label?: string;
}

export interface AdminUser {
  user_id: string;
  role: 'admin' | 'superadmin';
  created_at: string;
}

export interface AppConfig {
  brandName: string;
  tagline: string;
  slogan: string;
  contactEmail: string;
  contactPhone?: string;
  supportLink?: string;
  appUrl: string;
  demoMode: boolean;
  pricing: {
    name: string;
    price: number;
    currency: string;
    period: string;
    description: string;
    features: string[];
  };
}

export interface TableValidationResult {
  isValid: boolean;
  isCafeActive: boolean;
  isTableActive: boolean;
  table?: Table;
  errorMessage?: string;
}
