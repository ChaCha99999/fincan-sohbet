import { supabase, isLiveBackend } from './supabase';
import type { 
  Cafe, 
  Table, 
  Category, 
  Question, 
  UsageEvent, 
  TableValidationResult, 
  GameType, 
  EventType,
  MenuItem,
  ServiceRequest,
  ServiceRequestType,
  ServiceRequestStatus,
  PaymentMethod,
  Lead,
  LeadStatus
} from '../types';
import { INITIAL_CATEGORIES } from '../data/categories';
import { INITIAL_QUESTIONS } from '../data/questionsSeed';
import { MOCK_CAFES, MOCK_TABLES, MOCK_EVENTS, MOCK_SERVICE_REQUESTS, MOCK_LEADS } from '../data/mockData';
import { DEFAULT_MENU_ITEMS } from '../data/mockMenu';

// Local in-memory caches for demo mode
let localCafes: Cafe[] = [...MOCK_CAFES];
let localTables: Table[] = [...MOCK_TABLES];
let localQuestions: Question[] = [...INITIAL_QUESTIONS];
let localEvents: UsageEvent[] = [...MOCK_EVENTS];
let localServiceRequests: ServiceRequest[] = [...MOCK_SERVICE_REQUESTS];
let localLeads: Lead[] = [...MOCK_LEADS];

export const generatePublicToken = (): string => {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let token = '';
  for (let i = 0; i < 10; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// Ağ donmalarına karşı güvenli zaman aşımı yardımcısı (3500ms sonra yerel veriye düşer)
const withTimeout = <T = any>(promise: Promise<T> | PromiseLike<T>, ms = 3500): Promise<T> => {
  return Promise.race([
    promise as Promise<T>,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Ağ isteği zaman aşımına uğradı')), ms)),
  ]);
};

// =========================================================================
// ÜCRETSİZ PLAN OPTİMİZASYONLARI (SUPABASE & EGRESS KORUMASI)
// =========================================================================
const tokenValidationCache = new Map<string, { result: TableValidationResult; expiresAt: number }>();
let cachedCategories: Category[] | null = null;
const recentEventLogMap = new Map<string, number>();

// ==========================================
// MASA DOĞRULAMA (TABLE VALIDATION)
// ==========================================
export const validateTableToken = async (token: string): Promise<TableValidationResult> => {
  if (!token || token.trim() === '') {
    return {
      isValid: false,
      isCafeActive: false,
      isTableActive: false,
      errorMessage: 'Geçersiz veya eksik masa bağlantısı.',
    };
  }

  const cleanToken = token.trim().toLowerCase();

  // 1. Önbellek Kontrolü (3 dakika geçerli - Supabase RPC çağrısını ve kotasını korur)
  const cached = tokenValidationCache.get(cleanToken);
  if (cached && Date.now() < cached.expiresAt && cached.result.isValid) {
    return cached.result;
  }

  // 2. Canlı backend: hata durumunda demo veriye DÜŞÜLMEZ
  if (isLiveBackend && supabase) {
    const unreachable: TableValidationResult = {
      isValid: false,
      isCafeActive: false,
      isTableActive: false,
      errorMessage: 'Masa bilgilerine şu anda ulaşılamıyor. İnternet bağlantınızı kontrol edip tekrar deneyin.',
    };

    try {
      const { data, error } = await withTimeout(
        supabase.rpc('get_table_by_token', {
          p_token: cleanToken,
        }) as any,
        3500
      );

      if (error) {
        console.error('Supabase RPC Error:', error.message);
        return unreachable;
      }

      if (!data || data.length === 0) {
        return {
          isValid: false,
          isCafeActive: false,
          isTableActive: false,
          errorMessage: 'Masa bulunamadı veya bağlantı geçersiz. Lütfen QR kodu tekrar okutun.',
        };
      }

      const item = data[0];
      const isCafeActive = item.cafe_status === 'active';
      const isTableActive = item.is_active === true;

      const tableObj: Table = {
        id: item.table_id,
        cafe_id: item.cafe_id,
        label: item.table_label,
        public_token: item.public_token,
        is_active: isTableActive,
        created_at: item.created_at || new Date().toISOString(),
        cafe: {
          id: item.cafe_id,
          name: item.cafe_name,
          slug: item.cafe_slug,
          status: item.cafe_status,
          menu_url: item.menu_url || null,
          wifi_name: item.wifi_name || null,
          wifi_password: item.wifi_password || null,
          instagram: item.instagram || null,
          waiter_call_enabled: item.waiter_call_enabled !== undefined
            ? item.waiter_call_enabled
            : true,
        },
      };

      if (!isCafeActive) {
        return {
          isValid: false,
          isCafeActive: false,
          isTableActive,
          table: tableObj,
          errorMessage: 'Bu işletme şu anda geçici olarak hizmet vermemektedir.',
        };
      }

      if (!isTableActive) {
        return {
          isValid: false,
          isCafeActive: true,
          isTableActive: false,
          table: tableObj,
          errorMessage: 'Bu masa şu anda kullanıma kapalıdır.',
        };
      }

      const validRes: TableValidationResult = {
        isValid: true,
        isCafeActive: true,
        isTableActive: true,
        table: tableObj,
      };
      tokenValidationCache.set(cleanToken, { result: validRes, expiresAt: Date.now() + 180000 });
      return validRes;
    } catch (err) {
      console.warn('Supabase token query failed:', err);
      return unreachable;
    }
  }

  // 3. Demo / Yerel Mod Doğrulaması
  const foundTable = localTables.find(t => t.public_token.toLowerCase() === cleanToken);

  if (!foundTable) {
    return {
      isValid: false,
      isCafeActive: false,
      isTableActive: false,
      errorMessage: 'Masa bulunamadı veya bağlantı geçersiz. Lütfen QR kodu tekrar okutun.',
    };
  }

  const cafe = localCafes.find(c => c.id === foundTable.cafe_id) || foundTable.cafe;
  const isCafeActive = cafe?.status === 'active';
  const isTableActive = foundTable.is_active;

  const resolvedTable: Table = {
    ...foundTable,
    cafe: cafe ? {
      id: cafe.id,
      name: cafe.name,
      slug: cafe.slug,
      status: cafe.status,
      menu_url: cafe.menu_url,
      wifi_name: cafe.wifi_name,
      wifi_password: cafe.wifi_password,
      instagram: cafe.instagram,
      waiter_call_enabled: cafe.waiter_call_enabled ?? true,
    } : undefined,
  };

  if (!isCafeActive) {
    return {
      isValid: false,
      isCafeActive: false,
      isTableActive,
      table: resolvedTable,
      errorMessage: 'Bu işletme şu anda geçici olarak hizmet vermemektedir.',
    };
  }

  if (!isTableActive) {
    return {
      isValid: false,
      isCafeActive: true,
      isTableActive: false,
      table: resolvedTable,
      errorMessage: 'Bu masa şu anda kullanıma kapalıdır.',
    };
  }

  const localValidRes: TableValidationResult = {
    isValid: true,
    isCafeActive: true,
    isTableActive: true,
    table: resolvedTable,
  };
  tokenValidationCache.set(cleanToken, { result: localValidRes, expiresAt: Date.now() + 180000 });
  return localValidRes;
};

// ==========================================
// KULLANIM OLAYLARI KAYDI (USAGE EVENTS)
// ==========================================
// Olay kaydı masa token'ı ile yapılır; customer tarafında yazma yetkisi yoktur,
// Supabase'de yalnızca SECURITY DEFINER log_usage_event RPC'si kullanılabilir.
export const logUsageEvent = async (
  tableToken: string,
  eventType: EventType,
  gameType?: GameType | null
): Promise<void> => {
  const token = tableToken.trim().toLowerCase();
  const eventKey = `${token}_${eventType}_${gameType || 'none'}`;
  const now = Date.now();
  const lastLogged = recentEventLogMap.get(eventKey) || 0;

  // Ücretsiz Plan Optimizasyonu: Aynı masadan 15 saniye içinde gelen mükerrer logları engelle
  if (now - lastLogged < 15000) {
    return;
  }
  recentEventLogMap.set(eventKey, now);
  if (recentEventLogMap.size > 150) {
    recentEventLogMap.clear();
  }

  if (isLiveBackend && supabase) {
    try {
      const { error } = await supabase.rpc('log_usage_event', {
        p_token: token,
        p_event_type: eventType,
        p_game_type: gameType || null,
      });
      if (error) console.error('Error logging event to Supabase:', error.message);
    } catch (e) {
      console.warn('Failed to log event:', e);
    }
    return;
  }

  // Demo cache için de kaydet
  const table = localTables.find(t => t.public_token.toLowerCase() === token);
  const cafe = table ? localCafes.find(c => c.id === table.cafe_id) : undefined;

  localEvents.unshift({
    id: 'evt-' + Date.now(),
    cafe_id: table?.cafe_id || '',
    table_id: table?.id || '',
    event_type: eventType,
    game_type: gameType || null,
    created_at: new Date().toISOString(),
    cafe_name: cafe?.name || 'Kafe',
    table_label: table?.label || 'Masa',
  });
};

// ==========================================
// SORULAR & KATEGORİLER
// ==========================================
export const getCategories = async (): Promise<Category[]> => {
  if (cachedCategories && cachedCategories.length > 0) {
    return cachedCategories;
  }

  if (isLiveBackend && supabase) {
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true }) as any,
        3500
      );

      if (!error && data && data.length > 0) {
        cachedCategories = data as Category[];
        return cachedCategories;
      }
    } catch (e) {
      console.warn('Supabase categories error, using fallback:', e);
    }
  }
  cachedCategories = INITIAL_CATEGORIES;
  return INITIAL_CATEGORIES;
};

export const getQuestions = async (filter?: {
  categoryId?: string;
  gameType?: GameType;
  search?: string;
  onlyActive?: boolean;
}): Promise<Question[]> => {
  if (isLiveBackend && supabase) {
    try {
      let query = supabase.from('questions').select('*');

      if (filter?.onlyActive !== false) {
        query = query.eq('is_active', true);
      }
      if (filter?.gameType) {
        query = query.eq('game_type', filter.gameType);
      }
      if (filter?.categoryId) {
        query = query.eq('category_id', filter.categoryId);
      }
      if (filter?.search) {
        query = query.ilike('question_text', `%${filter.search}%`);
      }

      query = query.order('sort_order', { ascending: true });

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as Question[];
      }
    } catch (e) {
      console.warn('Supabase questions error, using fallback:', e);
    }
  }

  // Fallback to local
  return localQuestions.filter(q => {
    if (filter?.onlyActive !== false && !q.is_active) return false;
    if (filter?.gameType && q.game_type !== filter.gameType) return false;
    if (filter?.categoryId && q.category_id !== filter.categoryId) return false;
    if (filter?.search && !q.question_text.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });
};

export const createQuestion = async (
  question: Omit<Question, 'id' | 'created_at'>
): Promise<Question> => {
  if (isLiveBackend && supabase) {
    const { data, error } = await supabase
      .from('questions')
      .insert([question])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Question;
  }

  const newQ: Question = {
    ...question,
    id: 'q-' + Date.now(),
    created_at: new Date().toISOString(),
  };
  localQuestions.unshift(newQ);
  return newQ;
};

export const updateQuestion = async (
  id: string,
  updates: Partial<Question>
): Promise<Question> => {
  if (isLiveBackend && supabase) {
    const { data, error } = await supabase
      .from('questions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Question;
  }

  const index = localQuestions.findIndex(q => q.id === id);
  if (index === -1) throw new Error('Soru bulunamadı');
  localQuestions[index] = { ...localQuestions[index], ...updates };
  return localQuestions[index];
};

export const toggleQuestionStatus = async (id: string, isActive: boolean): Promise<void> => {
  await updateQuestion(id, { is_active: isActive });
};

// ==========================================
// KAFE YÖNETİMİ (CAFES)
// ==========================================
export const getCafes = async (): Promise<Cafe[]> => {
  if (isLiveBackend && supabase) {
    try {
      const { data, error } = await supabase
        .from('cafes')
        .select('*, tables(count)')
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);

      return data.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        status: c.status,
        created_at: c.created_at,
        updated_at: c.updated_at,
        table_count: c.tables ? c.tables[0]?.count || 0 : 0,
        menu_url: c.menu_url,
        wifi_name: c.wifi_name,
        wifi_password: c.wifi_password,
        instagram: c.instagram,
        waiter_call_enabled: c.waiter_call_enabled !== undefined ? c.waiter_call_enabled : true,
      }));
    } catch (e) {
      console.error('Supabase cafes error:', e);
      return [];
    }
  }

  // Update table counts for local cafes
  return localCafes.map(c => ({
    ...c,
    table_count: localTables.filter(t => t.cafe_id === c.id).length,
    waiter_call_enabled: c.waiter_call_enabled ?? true,
  }));
};

export const createCafe = async (
  name: string, 
  slug: string, 
  details?: { 
    menu_url?: string | null; 
    wifi_name?: string | null; 
    wifi_password?: string | null; 
    instagram?: string | null;
    waiter_call_enabled?: boolean;
  }
): Promise<Cafe> => {
  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  const waiterCallEnabled = details?.waiter_call_enabled !== undefined ? details.waiter_call_enabled : true;

  if (isLiveBackend && supabase) {
    const { data, error } = await supabase
      .from('cafes')
      .insert([{ 
        name, 
        slug: cleanSlug, 
        status: 'active',
        menu_url: details?.menu_url || null,
        wifi_name: details?.wifi_name || null,
        wifi_password: details?.wifi_password || null,
        instagram: details?.instagram || null,
        waiter_call_enabled: waiterCallEnabled,
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Cafe;
  }

  const newCafe: Cafe = {
    id: 'cafe-' + Date.now(),
    name,
    slug: cleanSlug,
    status: 'active',
    created_at: new Date().toISOString(),
    table_count: 0,
    menu_url: details?.menu_url || null,
    wifi_name: details?.wifi_name || null,
    wifi_password: details?.wifi_password || null,
    instagram: details?.instagram || null,
    waiter_call_enabled: waiterCallEnabled,
  };
  localCafes.unshift(newCafe);
  return newCafe;
};

export const updateCafe = async (id: string, updates: Partial<Cafe>): Promise<Cafe> => {
  if (isLiveBackend && supabase) {
    const { data, error } = await supabase
      .from('cafes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Cafe;
  }

  const index = localCafes.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Kafe bulunamadı');
  localCafes[index] = { ...localCafes[index], ...updates };
  return localCafes[index];
};

export const toggleCafeStatus = async (id: string, status: 'active' | 'inactive'): Promise<void> => {
  await updateCafe(id, { status });
};

export const toggleCafeWaiterCall = async (id: string, enabled: boolean): Promise<Cafe> => {
  return await updateCafe(id, { waiter_call_enabled: enabled });
};

// ==========================================
// MASA YÖNETİMİ (TABLES)
// ==========================================
export const getTablesByCafe = async (cafeId: string): Promise<Table[]> => {
  if (isLiveBackend && supabase) {
    try {
      const { data, error } = await supabase
        .from('tables')
        .select('*, cafes(id, name, slug, status)')
        .eq('cafe_id', cafeId)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);

      return data.map((t: any) => ({
        id: t.id,
        cafe_id: t.cafe_id,
        label: t.label,
        public_token: t.public_token,
        is_active: t.is_active,
        created_at: t.created_at,
        cafe: t.cafes,
      }));
    } catch (e) {
      console.error('Supabase tables error:', e);
      return [];
    }
  }

  return localTables.filter(t => t.cafe_id === cafeId);
};

export const createTable = async (cafeId: string, label: string): Promise<Table> => {
  const publicToken = generatePublicToken();

  if (isLiveBackend && supabase) {
    const { data, error } = await supabase
      .from('tables')
      .insert([{
        cafe_id: cafeId,
        label,
        public_token: publicToken,
        is_active: true,
      }])
      .select('*, cafes(id, name, slug, status)')
      .single();

    if (error) throw new Error(error.message);
    return {
      id: data.id,
      cafe_id: data.cafe_id,
      label: data.label,
      public_token: data.public_token,
      is_active: data.is_active,
      created_at: data.created_at,
      cafe: data.cafes,
    };
  }

  const cafe = localCafes.find(c => c.id === cafeId);
  const newTable: Table = {
    id: 'tbl-' + Date.now(),
    cafe_id: cafeId,
    label,
    public_token: publicToken,
    is_active: true,
    created_at: new Date().toISOString(),
    cafe: cafe ? {
      id: cafe.id,
      name: cafe.name,
      slug: cafe.slug,
      status: cafe.status,
    } : undefined,
  };
  localTables.unshift(newTable);
  return newTable;
};

export const toggleTableStatus = async (id: string, isActive: boolean): Promise<void> => {
  if (isLiveBackend && supabase) {
    const { error } = await supabase
      .from('tables')
      .update({ is_active: isActive })
      .eq('id', id);

    if (error) throw new Error(error.message);
    return;
  }

  const index = localTables.findIndex(t => t.id === id);
  if (index !== -1) {
    localTables[index].is_active = isActive;
  }
};

export const updateTable = async (id: string, updates: Partial<Table>): Promise<Table> => {
  if (isLiveBackend && supabase) {
    const { data, error } = await supabase
      .from('tables')
      .update(updates)
      .eq('id', id)
      .select('*, cafes(id, name, slug, status)')
      .single();

    if (error) throw new Error(error.message);
    return {
      id: data.id,
      cafe_id: data.cafe_id,
      label: data.label,
      public_token: data.public_token,
      is_active: data.is_active,
      created_at: data.created_at,
      cafe: data.cafes,
    };
  }

  const index = localTables.findIndex(t => t.id === id);
  if (index === -1) throw new Error('Masa bulunamadı');
  localTables[index] = { ...localTables[index], ...updates };
  return localTables[index];
};

export const deleteTable = async (id: string): Promise<void> => {
  if (isLiveBackend && supabase) {
    const { error } = await supabase
      .from('tables')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return;
  }

  localTables = localTables.filter(t => t.id !== id);
};

// ==========================================
// DASHBOARD İSTATİSTİKLERİ
// ==========================================
export interface DashboardStats {
  totalCafes: number;
  activeCafes: number;
  passiveCafes: number;
  totalTables: number;
  activeTables: number;
  totalTableOpens: number;
  totalGameStarts: number;
  pendingServiceRequestsCount: number;
  categoryDistribution: Record<string, number>;
  recentEvents: UsageEvent[];
  isRealData: boolean;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  if (isLiveBackend && supabase) {
    try {
      const [cafesRes, tablesRes, eventsRes, callsRes] = await Promise.all([
        supabase.from('cafes').select('id, status'),
        supabase.from('tables').select('id, is_active'),
        supabase.from('events').select('*, cafes(name), tables(label)').order('created_at', { ascending: false }).limit(25),
        supabase.from('service_requests').select('id').eq('status', 'pending'),
      ]);

      const cafes = cafesRes.data || [];
      const tables = tablesRes.data || [];
      const events = eventsRes.data || [];
      const pendingCalls = callsRes.data || [];

      const activeCafes = cafes.filter(c => c.status === 'active').length;
      const activeTables = tables.filter(t => t.is_active).length;

      const totalTableOpens = events.filter(e => e.event_type === 'table_open').length;
      const totalGameStarts = events.filter(e => e.event_type === 'game_start').length;

      const categoryDistribution: Record<string, number> = {
        'sohbeti-baslat': 0,
        'ikilemde-kal': 0,
        'kim-daha-muhtemel': 0,
        'ne-kadar-taniyoruz': 0,
      };

      events.forEach(e => {
        if (e.game_type && categoryDistribution[e.game_type] !== undefined) {
          categoryDistribution[e.game_type]++;
        }
      });

      return {
        totalCafes: cafes.length,
        activeCafes,
        passiveCafes: cafes.length - activeCafes,
        totalTables: tables.length,
        activeTables,
        totalTableOpens,
        totalGameStarts,
        pendingServiceRequestsCount: pendingCalls.length,
        categoryDistribution,
        recentEvents: events.map((e: any) => ({
          id: e.id,
          cafe_id: e.cafe_id,
          table_id: e.table_id,
          event_type: e.event_type,
          game_type: e.game_type,
          created_at: e.created_at,
          cafe_name: e.cafes?.name || 'Bilinmeyen Kafe',
          table_label: e.tables?.label || 'Bilinmeyen Masa',
        })),
        isRealData: true,
      };
    } catch (e) {
      console.error('Dashboard stats query error:', e);
      return {
        totalCafes: 0,
        activeCafes: 0,
        passiveCafes: 0,
        totalTables: 0,
        activeTables: 0,
        totalTableOpens: 0,
        totalGameStarts: 0,
        pendingServiceRequestsCount: 0,
        categoryDistribution: {
          'sohbeti-baslat': 0,
          'ikilemde-kal': 0,
          'kim-daha-muhtemel': 0,
          'ne-kadar-taniyoruz': 0,
        },
        recentEvents: [],
        isRealData: true,
      };
    }
  }

  // Local / Demo mode stats
  const activeCafes = localCafes.filter(c => c.status === 'active').length;
  const activeTables = localTables.filter(t => t.is_active).length;
  const totalTableOpens = localEvents.filter(e => e.event_type === 'table_open').length;
  const totalGameStarts = localEvents.filter(e => e.event_type === 'game_start').length;
  const pendingServiceRequestsCount = localServiceRequests.filter(r => r.status === 'pending').length;

  const categoryDistribution: Record<string, number> = {
    'sohbeti-baslat': 0,
    'ikilemde-kal': 0,
    'kim-daha-muhtemel': 0,
    'ne-kadar-taniyoruz': 0,
  };

  localEvents.forEach(e => {
    if (e.game_type && categoryDistribution[e.game_type] !== undefined) {
      categoryDistribution[e.game_type]++;
    }
  });

  return {
    totalCafes: localCafes.length,
    activeCafes,
    passiveCafes: localCafes.length - activeCafes,
    totalTables: localTables.length,
    activeTables,
    totalTableOpens,
    totalGameStarts,
    pendingServiceRequestsCount,
    categoryDistribution,
    recentEvents: localEvents.slice(0, 15),
    isRealData: false, // Clearly indicates local/demo mode
  };
};

// ==========================================
// KAFE MENÜ YÖNETİMİ (MENU ITEMS)
// ==========================================
let localMenuItems: MenuItem[] = [...DEFAULT_MENU_ITEMS];

export const getMenuItems = async (cafeId?: string): Promise<MenuItem[]> => {
  if (isLiveBackend && supabase) {
    let query = supabase.from('menu_items').select('*').order('sort_order', { ascending: true });
    if (cafeId) {
      query = query.eq('cafe_id', cafeId);
    }
    const { data, error } = await query;
    if (error) {
      console.error('Supabase menu_items error:', error.message);
      return [];
    }
    return (data || []) as MenuItem[];
  }

  // Check localStorage for persisted local customizations per cafe
  if (typeof window !== 'undefined' && cafeId) {
    const stored = localStorage.getItem(`fincan_menu_${cafeId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {}
    }
  }

  return localMenuItems;
};

// Müşteri tarafı menü okuması: cafe_id bilgisini tarayıcıya sızdırmadan,
// yalnızca masa token'ı ile ve yalnızca aktif kafeler için çalışır.
export const getMenuItemsByToken = async (tableToken: string): Promise<MenuItem[]> => {
  const token = tableToken.trim().toLowerCase();

  if (isLiveBackend && supabase) {
    try {
      const { data, error } = await withTimeout(
        supabase.rpc('get_menu_items_by_token', { p_token: token }) as any,
        3500
      );

      if (error) {
        console.error('Supabase get_menu_items_by_token error:', error.message);
        return [];
      }
      return (data || []) as MenuItem[];
    } catch (e) {
      console.warn('Menu items by token failed:', e);
      return [];
    }
  }

  const table = localTables.find(t => t.public_token.toLowerCase() === token);
  if (!table) return [];

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(`fincan_menu_${table.cafe_id}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {}
    }
  }

  return localMenuItems;
};


export const uploadMenuImage = async (fileBlob: Blob, fileExtension = 'jpg'): Promise<string> => {
  if (isLiveBackend && supabase) {
    const fileName = `menu-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExtension}`;
    const { error } = await supabase.storage
      .from('menu-images')
      .upload(fileName, fileBlob, {
        contentType: fileExtension === 'png' ? 'image/png' : 'image/jpeg',
        upsert: true,
      });

    if (error) {
      throw new Error(`Görsel yüklenemedi: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from('menu-images')
      .getPublicUrl(fileName);

    if (!publicUrlData?.publicUrl) {
      throw new Error('Görsel adresi alınamadı.');
    }
    return publicUrlData.publicUrl;
  }

  // Demo modunda görsel tarayıcıda data-url olarak tutulur
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(fileBlob);
  });
};

export const createMenuItem = async (item: Omit<MenuItem, 'id' | 'created_at'>): Promise<MenuItem> => {
  if (isLiveBackend && supabase) {
    const { data, error } = await supabase
      .from('menu_items')
      .insert([{
        cafe_id: item.cafe_id,
        category: item.category,
        name: item.name,
        description: item.description || null,
        price: item.price,
        currency: item.currency || '₺',
        image_url: item.image_url || null,
        is_popular: item.is_popular || false,
        is_available: item.is_available !== false,
        sort_order: item.sort_order || 1,
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as MenuItem;
  }

  const newItem: MenuItem = {
    ...item,
    id: 'menu-' + Date.now(),
    currency: item.currency || '₺',
    is_popular: item.is_popular || false,
    is_available: item.is_available !== false,
    created_at: new Date().toISOString(),
  };

  localMenuItems = [newItem, ...localMenuItems];

  if (typeof window !== 'undefined' && item.cafe_id) {
    const stored = localStorage.getItem(`fincan_menu_${item.cafe_id}`);
    const list: MenuItem[] = stored ? JSON.parse(stored) : [...localMenuItems];
    if (!list.find(x => x.id === newItem.id)) {
      list.unshift(newItem);
    }
    localStorage.setItem(`fincan_menu_${item.cafe_id}`, JSON.stringify(list));
  }

  return newItem;
};

export const updateMenuItem = async (id: string, updates: Partial<MenuItem>): Promise<MenuItem> => {
  if (isLiveBackend && supabase) {
    const { data, error } = await supabase
      .from('menu_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as MenuItem;
  }

  const index = localMenuItems.findIndex(m => m.id === id);
  if (index !== -1) {
    localMenuItems[index] = { ...localMenuItems[index], ...updates };
    const cafeId = localMenuItems[index].cafe_id;
    if (typeof window !== 'undefined' && cafeId) {
      localStorage.setItem(`fincan_menu_${cafeId}`, JSON.stringify(localMenuItems));
    }
    return localMenuItems[index];
  }

  throw new Error('Ürün bulunamadı');
};

export const deleteMenuItem = async (id: string, cafeId?: string): Promise<void> => {
  if (isLiveBackend && supabase) {
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return;
  }

  localMenuItems = localMenuItems.filter(m => m.id !== id);
  if (typeof window !== 'undefined' && cafeId) {
    const stored = localStorage.getItem(`fincan_menu_${cafeId}`);
    if (stored) {
      const list: MenuItem[] = JSON.parse(stored).filter((m: MenuItem) => m.id !== id);
      localStorage.setItem(`fincan_menu_${cafeId}`, JSON.stringify(list));
    }
  }
};

// ==========================================
// MASA SERVİS ÇAĞRILARI (SERVICE REQUESTS)
// ==========================================
// Müşteri çağrıları masa token'ı ile oluşturulur; anon kullanıcı service_requests
// tablosuna doğrudan yazamaz, yalnızca doğrulanmış RPC'yi çağırabilir.
export const createServiceRequest = async (params: {
  tableToken: string;
  request_type: ServiceRequestType;
  payment_method?: PaymentMethod | null;
  note?: string | null;
}): Promise<ServiceRequest> => {
  const token = params.tableToken.trim().toLowerCase();

  if (isLiveBackend && supabase) {
    const { data, error } = await supabase.rpc('create_service_request', {
      p_token: token,
      p_request_type: params.request_type,
      p_payment_method: params.payment_method || null,
      p_note: params.note || null,
    });

    if (error) throw new Error(error.message);

    const d = data as any;
    return {
      id: d.id,
      cafe_id: d.cafe_id,
      table_id: d.table_id,
      request_type: d.request_type,
      payment_method: d.payment_method,
      note: d.note,
      status: d.status,
      created_at: d.created_at,
      updated_at: d.updated_at,
      cafe_name: d.cafe_name,
      table_label: d.table_label,
    };
  }

  const table = localTables.find(t => t.public_token.toLowerCase() === token);
  if (!table) throw new Error('Masa bulunamadı veya bağlantı geçersiz.');

  const existing = localServiceRequests.find(
    r => r.table_id === table.id && (r.status === 'pending' || r.status === 'in_progress')
  );
  if (existing) return existing;

  const cafe = localCafes.find(c => c.id === table.cafe_id);
  const newReq: ServiceRequest = {
    id: 'req-' + Date.now(),
    cafe_id: table.cafe_id,
    table_id: table.id,
    request_type: params.request_type,
    payment_method: params.payment_method || null,
    note: params.note || null,
    status: 'pending',
    created_at: new Date().toISOString(),
    cafe_name: cafe?.name || 'Kafe',
    table_label: table.label,
  };

  localServiceRequests.unshift(newReq);

  // Persist locally for demo sessions
  if (typeof window !== 'undefined') {
    localStorage.setItem(`fincan_active_call_${table.id}`, JSON.stringify(newReq));
  }

  return newReq;
};

export const getServiceRequests = async (filter?: {
  cafe_id?: string;
  status?: ServiceRequestStatus | 'all';
  table_id?: string;
}): Promise<ServiceRequest[]> => {
  if (isLiveBackend && supabase) {
    try {
      let query = supabase
        .from('service_requests')
        .select('*, cafes(name), tables(label)')
        .order('created_at', { ascending: false });

      if (filter?.cafe_id) {
        query = query.eq('cafe_id', filter.cafe_id);
      }
      if (filter?.table_id) {
        query = query.eq('table_id', filter.table_id);
      }
      if (filter?.status && filter.status !== 'all') {
        query = query.eq('status', filter.status);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);

      return (data || []).map((d: any) => ({
        id: d.id,
        cafe_id: d.cafe_id,
        table_id: d.table_id,
        request_type: d.request_type,
        payment_method: d.payment_method,
        note: d.note,
        status: d.status,
        created_at: d.created_at,
        updated_at: d.updated_at,
        cafe_name: d.cafes?.name || 'Bilinmeyen Kafe',
        table_label: d.tables?.label || 'Bilinmeyen Masa',
      }));
    } catch (e) {
      console.error('Supabase getServiceRequests error:', e);
      return [];
    }
  }

  return localServiceRequests.filter(req => {
    if (filter?.cafe_id && req.cafe_id !== filter.cafe_id) return false;
    if (filter?.table_id && req.table_id !== filter.table_id) return false;
    if (filter?.status && filter.status !== 'all' && req.status !== filter.status) return false;
    return true;
  });
};

export const updateServiceRequestStatus = async (
  id: string,
  status: ServiceRequestStatus
): Promise<ServiceRequest> => {
  if (isLiveBackend && supabase) {
    const { data, error } = await supabase
      .from('service_requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*, cafes(name), tables(label)')
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      cafe_id: data.cafe_id,
      table_id: data.table_id,
      request_type: data.request_type,
      payment_method: data.payment_method,
      note: data.note,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at,
      cafe_name: data.cafes?.name,
      table_label: data.tables?.label,
    };
  }

  const idx = localServiceRequests.findIndex(r => r.id === id);
  if (idx !== -1) {
    localServiceRequests[idx] = {
      ...localServiceRequests[idx],
      status,
      updated_at: new Date().toISOString(),
    };
    return localServiceRequests[idx];
  }

  throw new Error('Servis çağrısı bulunamadı');
};

export const getActiveServiceRequestsCount = async (cafeId?: string): Promise<number> => {
  if (isLiveBackend && supabase) {
    try {
      let query = supabase
        .from('service_requests')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (cafeId) {
        query = query.eq('cafe_id', cafeId);
      }

      const { count, error } = await query;
      if (error) throw new Error(error.message);
      return count || 0;
    } catch (e) {
      console.error('Supabase active request count error:', e);
      return 0;
    }
  }

  return localServiceRequests.filter(r => {
    if (cafeId && r.cafe_id !== cafeId) return false;
    return r.status === 'pending';
  }).length;
};

const mapServiceRequest = (d: any): ServiceRequest => ({
  id: d.id,
  cafe_id: d.cafe_id,
  table_id: d.table_id,
  request_type: d.request_type,
  payment_method: d.payment_method,
  note: d.note,
  status: d.status,
  created_at: d.created_at,
  updated_at: d.updated_at,
  cafe_name: d.cafe_name,
  table_label: d.table_label,
});

export const getActiveTableServiceRequest = async (tableToken: string): Promise<ServiceRequest | null> => {
  const token = tableToken.trim().toLowerCase();

  if (isLiveBackend && supabase) {
    try {
      const { data, error } = await withTimeout(
        supabase.rpc('get_active_table_request', { p_token: token }) as any,
        3500
      );
      if (error) {
        console.error('Supabase get_active_table_request error:', error.message);
        return null;
      }
      if (!data) return null;
      return mapServiceRequest(data);
    } catch (e) {
      console.warn('Active table request failed:', e);
      return null;
    }
  }

  const table = localTables.find(t => t.public_token.toLowerCase() === token);
  if (!table) return null;

  const found = localServiceRequests.find(
    r => r.table_id === table.id && (r.status === 'pending' || r.status === 'in_progress')
  );
  if (found) return found;

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(`fincan_active_call_${table.id}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.status === 'pending' || parsed.status === 'in_progress')) {
          return parsed;
        }
      } catch {}
    }
  }

  return null;
};

// Müşteri yalnızca kendi masasının bekleyen çağrısını iptal edebilir.
export const cancelServiceRequest = async (tableToken: string, requestId: string): Promise<boolean> => {
  const token = tableToken.trim().toLowerCase();

  if (isLiveBackend && supabase) {
    const { data, error } = await supabase.rpc('cancel_table_request', {
      p_token: token,
      p_request_id: requestId,
    });
    if (error) throw new Error(error.message);
    return data === true;
  }

  const table = localTables.find(t => t.public_token.toLowerCase() === token);
  if (!table) return false;

  const idx = localServiceRequests.findIndex(
    r => r.id === requestId && r.table_id === table.id && (r.status === 'pending' || r.status === 'in_progress')
  );
  if (idx === -1) return false;

  localServiceRequests[idx] = {
    ...localServiceRequests[idx],
    status: 'cancelled',
    updated_at: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.removeItem(`fincan_active_call_${table.id}`);
  }
  return true;
};

// ==========================================
// BAŞVURULAR (LEADS)
// ==========================================
export interface LeadInput {
  full_name: string;
  cafe_name: string;
  city: string;
  contact_info: string;
  table_count?: number | null;
  note?: string | null;
  source?: string;
}

const validateLeadInput = (input: LeadInput) => {
  const fullName = input.full_name.trim();
  const cafeName = input.cafe_name.trim();
  const city = input.city.trim();
  const contact = input.contact_info.trim();

  if (fullName.length < 2) throw new Error('Lütfen adınızı ve soyadınızı girin.');
  if (cafeName.length < 2) throw new Error('Lütfen kafe adını girin.');
  if (city.length < 2) throw new Error('Lütfen şehir bilgisini girin.');
  if (contact.length < 5) throw new Error('Lütfen geçerli bir telefon veya e-posta adresi girin.');
  if (input.table_count != null && (input.table_count < 1 || input.table_count > 500)) {
    throw new Error('Masa sayısı 1 ile 500 arasında olmalıdır.');
  }

  return { fullName, cafeName, city, contact };
};

export const submitLead = async (input: LeadInput): Promise<Lead> => {
  const { fullName, cafeName, city, contact } = validateLeadInput(input);
  const note = input.note?.trim() || null;
  const source = input.source || 'landing';

  if (isLiveBackend && supabase) {
    const { data, error } = await supabase.rpc('submit_lead', {
      p_full_name: fullName,
      p_cafe_name: cafeName,
      p_city: city,
      p_contact_info: contact,
      p_table_count: input.table_count ?? null,
      p_note: note,
      p_source: source,
    });

    if (error) throw new Error(error.message);

    return {
      id: data as string,
      full_name: fullName,
      cafe_name: cafeName,
      city,
      contact_info: contact,
      table_count: input.table_count ?? null,
      note,
      status: 'new',
      source,
      created_at: new Date().toISOString(),
    };
  }

  const duplicate = localLeads.find(
    (l) => l.contact_info.toLowerCase() === contact.toLowerCase()
  );
  if (duplicate) return duplicate;

  const newLead: Lead = {
    id: 'lead-' + Date.now(),
    full_name: fullName,
    cafe_name: cafeName,
    city,
    contact_info: contact,
    table_count: input.table_count ?? null,
    note,
    status: 'new',
    source,
    created_at: new Date().toISOString(),
  };
  localLeads.unshift(newLead);
  return newLead;
};

export const getLeads = async (): Promise<Lead[]> => {
  if (isLiveBackend && supabase) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase leads error:', error.message);
      return [];
    }
    return (data || []) as Lead[];
  }

  return [...localLeads];
};

export const updateLeadStatus = async (id: string, status: LeadStatus): Promise<Lead> => {
  if (isLiveBackend && supabase) {
    const { data, error } = await supabase
      .from('leads')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Lead;
  }

  const index = localLeads.findIndex((l) => l.id === id);
  if (index === -1) throw new Error('Başvuru bulunamadı');
  localLeads[index] = {
    ...localLeads[index],
    status,
    updated_at: new Date().toISOString(),
  };
  return localLeads[index];
};
