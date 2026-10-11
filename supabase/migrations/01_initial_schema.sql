-- ==============================================================================
-- FİNCAN SOHBET — SUPABASE INITIAL DATABASE SCHEMA & SECURITY POLICIES
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CAFES TABLE
CREATE TABLE IF NOT EXISTS public.cafes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_cafes_slug ON public.cafes(slug);
CREATE INDEX IF NOT EXISTS idx_cafes_status ON public.cafes(status);

-- 3. TABLES TABLE
CREATE TABLE IF NOT EXISTS public.tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cafe_id UUID NOT NULL REFERENCES public.cafes(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    public_token TEXT NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_tables_cafe_id ON public.tables(cafe_id);
CREATE INDEX IF NOT EXISTS idx_tables_public_token ON public.tables(public_token);

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    estimated_time TEXT NOT NULL DEFAULT '15-30 dk',
    icon TEXT NOT NULL DEFAULT 'MessageCircle',
    sort_order INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 5. QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.questions (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    game_type TEXT NOT NULL CHECK (game_type IN ('sohbeti-baslat', 'ikilemde-kal', 'kim-daha-muhtemel', 'ne-kadar-taniyoruz')),
    question_text TEXT NOT NULL,
    option_a TEXT,
    option_b TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    difficulty TEXT DEFAULT 'easy',
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_questions_game_type ON public.questions(game_type);
CREATE INDEX IF NOT EXISTS idx_questions_is_active ON public.questions(is_active);

-- 6. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. EVENTS TABLE (Usage Analytics)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cafe_id UUID NOT NULL REFERENCES public.cafes(id) ON DELETE CASCADE,
    table_id UUID NOT NULL REFERENCES public.tables(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('table_open', 'game_start', 'game_complete')),
    game_type TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_events_cafe_id ON public.events(cafe_id);
CREATE INDEX IF NOT EXISTS idx_events_table_id ON public.events(table_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events(created_at);

-- 8. SUBSCRIPTIONS TABLE (Structure ready for B2B)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cafe_id UUID NOT NULL REFERENCES public.cafes(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL DEFAULT 'Kafe Başlangıç Paketi',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 9. GÜVENLİK VE ROW LEVEL SECURITY (RLS) POLİTİKALARI
-- ==============================================================================

-- Yetki kontrol fonksiyonu
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  );
$$;

-- RLS Etkinleştirme
ALTER TABLE public.cafes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- CATEGORIES: Genel okuma açık, yazma sadece admin
CREATE POLICY "Public can view active categories"
    ON public.categories FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins full access to categories"
    ON public.categories FOR ALL
    USING (public.is_admin());

-- QUESTIONS: Genel okuma açık, yazma sadece admin
CREATE POLICY "Public can view active questions"
    ON public.questions FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins full access to questions"
    ON public.questions FOR ALL
    USING (public.is_admin());

-- CAFES: Sadece admin okuyabilir/yazabilir
CREATE POLICY "Admins full access to cafes"
    ON public.cafes FOR ALL
    USING (public.is_admin());

-- TABLES: Sadece admin listeleyebilir (Genel halk doğrudan SELECT yapamaz, RPC kullanır)
CREATE POLICY "Admins full access to tables"
    ON public.tables FOR ALL
    USING (public.is_admin());

-- ADMIN_USERS: Sadece adminler görebilir
CREATE POLICY "Admins view admin list"
    ON public.admin_users FOR SELECT
    USING (public.is_admin());

-- EVENTS: Anon ekleme yapabilir (QR okutma ve oyun başlatma olayları), adminler okuyabilir
CREATE POLICY "Public can insert events"
    ON public.events FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can view events"
    ON public.events FOR SELECT
    USING (public.is_admin());

-- SUBSCRIPTIONS: Sadece admin
CREATE POLICY "Admins full access to subscriptions"
    ON public.subscriptions FOR ALL
    USING (public.is_admin());

-- ==============================================================================
-- 10. GÜVENLİ RPC FONKSİYONLARI (STORED PROCEDURES)
-- ==============================================================================

-- Token üzerinden güvenli masa sorgulama
CREATE OR REPLACE FUNCTION public.get_table_by_token(p_token TEXT)
RETURNS TABLE (
    table_id UUID,
    cafe_id UUID,
    table_label TEXT,
    public_token TEXT,
    is_active BOOLEAN,
    created_at TIMESTAMPTZ,
    cafe_name TEXT,
    cafe_slug TEXT,
    cafe_status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id AS table_id,
        t.cafe_id,
        t.label AS table_label,
        t.public_token,
        t.is_active,
        t.created_at,
        c.name AS cafe_name,
        c.slug AS cafe_slug,
        c.status AS cafe_status
    FROM public.tables t
    JOIN public.cafes c ON c.id = t.cafe_id
    WHERE LOWER(t.public_token) = LOWER(TRIM(p_token))
    LIMIT 1;
END;
$$;
