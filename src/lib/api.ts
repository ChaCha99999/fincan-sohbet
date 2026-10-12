import { supabase, isSupabaseConfigured } from './supabase';
import type { 
  Cafe, 
  Table, 
  Category, 
  Question, 
  UsageEvent, 
  TableValidationResult, 
  GameType, 
  EventType,
  MenuItem
} from '../types';
import { INITIAL_CATEGORIES } from '../data/categories';
import { INITIAL_QUESTIONS } from '../data/questionsSeed';
import { MOCK_CAFES, MOCK_TABLES, MOCK_EVENTS } from '../data/mockData';
import { DEFAULT_MENU_ITEMS } from '../data/mockMenu';

// Local in-memory caches for demo mode
let localCafes: Cafe[] = [...MOCK_CAFES];
let localTables: Table[] = [...MOCK_TABLES];
let localQuestions: Question[] = [...INITIAL_QUESTIONS];
let localEvents: UsageEvent[] = [...MOCK_EVENTS];

export const generatePublicToken = (): string => {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let token = '';
  for (let i = 0; i < 10; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

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

  // 1. Supabase üzerinden RPC çağrısı
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.rpc('get_table_by_token', {
        p_token: cleanToken,
      });

      if (error) {
        console.error('Supabase RPC Error:', error.message);
      } else if (data && data.length > 0) {
        const item = data[0];
        const isCafeActive = item.cafe_status === 'active';
        const isTableActive = item.is_active === true;

        const localCafeMatch = localCafes.find(c => c.id === item.cafe_id || c.name === item.cafe_name || c.slug === item.cafe_slug);
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
            menu_url: item.menu_url || localCafeMatch?.menu_url || null,
            wifi_name: item.wifi_name || localCafeMatch?.wifi_name || null,
            wifi_password: item.wifi_password || localCafeMatch?.wifi_password || null,
            instagram: item.instagram || localCafeMatch?.instagram || null,
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

        return {
          isValid: true,
          isCafeActive: true,
          isTableActive: true,
          table: tableObj,
        };
      }
    } catch (err) {
      console.warn('Supabase token query failed, falling back to local:', err);
    }
  }

  // 2. Demo / Yerel Mod Doğrulaması
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

  return {
    isValid: true,
    isCafeActive: true,
    isTableActive: true,
    table: resolvedTable,
  };
};

// ==========================================
// KULLANIM OLAYLARI KAYDI (USAGE EVENTS)
// ==========================================
export const logUsageEvent = async (
  cafeId: string,
  tableId: string,
  eventType: EventType,
  gameType?: GameType | null
): Promise<void> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('events').insert([
        {
          cafe_id: cafeId,
          table_id: tableId,
          event_type: eventType,
          game_type: gameType || null,
        },
      ]);
      if (error) console.error('Error logging event to Supabase:', error.message);
    } catch (e) {
      console.warn('Failed to log event:', e);
    }
  }

  // Demo cache için de kaydet
  const cafe = localCafes.find(c => c.id === cafeId);
  const table = localTables.find(t => t.id === tableId);

  localEvents.unshift({
    id: 'evt-' + Date.now(),
    cafe_id: cafeId,
    table_id: tableId,
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
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    } catch (e) {
      console.warn('Supabase categories error, using fallback:', e);
    }
  }
  return INITIAL_CATEGORIES;
};

export const getQuestions = async (filter?: {
  categoryId?: string;
  gameType?: GameType;
  search?: string;
  onlyActive?: boolean;
}): Promise<Question[]> => {
  if (isSupabaseConfigured && supabase) {
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
  if (isSupabaseConfigured && supabase) {
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
  if (isSupabaseConfigured && supabase) {
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
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('cafes')
        .select('*, tables(count)')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          status: c.status,
          created_at: c.created_at,
          updated_at: c.updated_at,
          table_count: c.tables ? c.tables[0]?.count || 0 : 0,
        }));
      }
    } catch (e) {
      console.warn('Supabase cafes error, using fallback:', e);
    }
  }

  // Update table counts for local cafes
  return localCafes.map(c => ({
    ...c,
    table_count: localTables.filter(t => t.cafe_id === c.id).length,
  }));
};

export const createCafe = async (
  name: string, 
  slug: string, 
  details?: { menu_url?: string | null; wifi_name?: string | null; wifi_password?: string | null; instagram?: string | null }
): Promise<Cafe> => {
  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

  if (isSupabaseConfigured && supabase) {
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
  };
  localCafes.unshift(newCafe);
  return newCafe;
};

export const updateCafe = async (id: string, updates: Partial<Cafe>): Promise<Cafe> => {
  if (isSupabaseConfigured && supabase) {
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

// ==========================================
// MASA YÖNETİMİ (TABLES)
// ==========================================
export const getTablesByCafe = async (cafeId: string): Promise<Table[]> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('tables')
        .select('*, cafes(id, name, slug, status)')
        .eq('cafe_id', cafeId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((t: any) => ({
          id: t.id,
          cafe_id: t.cafe_id,
          label: t.label,
          public_token: t.public_token,
          is_active: t.is_active,
          created_at: t.created_at,
          cafe: t.cafes,
        }));
      }
    } catch (e) {
      console.warn('Supabase tables error, using fallback:', e);
    }
  }

  return localTables.filter(t => t.cafe_id === cafeId);
};

export const createTable = async (cafeId: string, label: string): Promise<Table> => {
  const publicToken = generatePublicToken();

  if (isSupabaseConfigured && supabase) {
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
  if (isSupabaseConfigured && supabase) {
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
  if (isSupabaseConfigured && supabase) {
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
  if (isSupabaseConfigured && supabase) {
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
  categoryDistribution: Record<string, number>;
  recentEvents: UsageEvent[];
  isRealData: boolean;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const [cafesRes, tablesRes, eventsRes] = await Promise.all([
        supabase.from('cafes').select('id, status'),
        supabase.from('tables').select('id, is_active'),
        supabase.from('events').select('*, cafes(name), tables(label)').order('created_at', { ascending: false }).limit(25),
      ]);

      const cafes = cafesRes.data || [];
      const tables = tablesRes.data || [];
      const events = eventsRes.data || [];

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
      console.warn('Dashboard stats query error, showing local stats:', e);
    }
  }

  // Local / Demo mode stats
  const activeCafes = localCafes.filter(c => c.status === 'active').length;
  const activeTables = localTables.filter(t => t.is_active).length;
  const totalTableOpens = localEvents.filter(e => e.event_type === 'table_open').length;
  const totalGameStarts = localEvents.filter(e => e.event_type === 'game_start').length;

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
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('menu_items').select('*').order('sort_order', { ascending: true });
      if (cafeId) {
        query = query.eq('cafe_id', cafeId);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as MenuItem[];
      }
    } catch (e) {
      console.warn('Supabase menu_items error, falling back to local:', e);
    }
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

export const createMenuItem = async (item: Omit<MenuItem, 'id' | 'created_at'>): Promise<MenuItem> => {
  if (isSupabaseConfigured && supabase) {
    try {
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

      if (!error && data) {
        return data as MenuItem;
      }
    } catch (e) {
      console.warn('Supabase createMenuItem error, using local fallback:', e);
    }
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
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return data as MenuItem;
      }
    } catch (e) {
      console.warn('Supabase updateMenuItem error, using local fallback:', e);
    }
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
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (!error) return;
    } catch (e) {
      console.warn('Supabase deleteMenuItem error, using local fallback:', e);
    }
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
