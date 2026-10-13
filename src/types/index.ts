export type GameType = 
  | 'sohbeti-baslat'
  | 'ikilemde-kal'
  | 'kim-daha-muhtemel'
  | 'ne-kadar-taniyoruz'
  | 'kafe-trivia'
  | 'masa-duellosu'
  | 'kafe-nabzi'
  | 'masadaki-casus'
  | 'bes-saniye'
  | 'klasik-tabu'
  | 'parmak-ruleti';

export type CafeStatus = 'active' | 'inactive';

export interface MenuItem {
  id: string;
  cafe_id?: string;
  category: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  is_popular?: boolean;
  is_available?: boolean;
  sort_order?: number;
  tags?: string[];
  image_url?: string | null;
  created_at?: string;
}

export interface Cafe {
  id: string;
  name: string;
  slug: string;
  status: CafeStatus;
  created_at: string;
  updated_at?: string;
  table_count?: number;
  menu_url?: string | null;
  wifi_name?: string | null;
  wifi_password?: string | null;
  instagram?: string | null;
  waiter_call_enabled?: boolean;
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
    menu_url?: string | null;
    wifi_name?: string | null;
    wifi_password?: string | null;
    instagram?: string | null;
    waiter_call_enabled?: boolean;
  };
}

export type ServiceRequestType = 'waiter' | 'bill';
export type ServiceRequestStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'meal_card' | 'other';

export interface ServiceRequest {
  id: string;
  cafe_id: string;
  table_id: string;
  request_type: ServiceRequestType;
  payment_method?: PaymentMethod | null;
  note?: string | null;
  status: ServiceRequestStatus;
  created_at: string;
  updated_at?: string;
  cafe_name?: string;
  table_label?: string;
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

export interface TriviaQuestion {
  id: string;
  categoryId: string;
  categoryName: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface TriviaCategoryInfo {
  id: string;
  name: string;
  iconName: string;
  badgeColor: string;
  bgGradient: string;
  description: string;
  questionCount?: number;
}

export interface TriviaLeaderboardEntry {
  tableLabel: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  isCurrentTable?: boolean;
  rank?: number;
}

export interface DuelOpponent {
  id: string;
  tableLabel: string;
  isOnline: boolean;
  avatarColor: string;
  winCount?: number;
}

export interface DuelMatchSummary {
  myTableLabel: string;
  opponentTableLabel: string;
  myScore: number;
  opponentScore: number;
  myCorrect: number;
  opponentCorrect: number;
  winner: 'me' | 'opponent' | 'draw';
  categoryName: string;
}

export type PollCategory = 'kahve-muzik' | 'gunun-ikilemi' | 'kafe-modu';

export interface CafePollOption {
  id: string;
  text: string;
  votes: number;
  percentage?: number;
}

export interface CafePoll {
  id: string;
  category: PollCategory;
  categoryTitle: string;
  question: string;
  description?: string;
  totalVotes: number;
  options: CafePollOption[];
  myVoteOptionId?: string | null;
  trendingBadge?: string;
}



