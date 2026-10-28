-- ==============================================================================
-- FİNCAN SOHBET — MİGRASYON 07: ÇOK KİRACILI YÖNETİM + BAŞVURU KAYDI
-- ==============================================================================
-- Amaç:
--   1. admin_users.cafe_id ile "platform yöneticisi" ve "kafe sahibi" ayrımı.
--   2. Kafe sahibinin yalnızca kendi kafesinin verilerine erişmesi.
--   3. Landing sayfasındaki başvuruların leads tablosuna kaydedilmesi.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ADMIN_USERS: kafe sahibi bağlantısı
-- ------------------------------------------------------------------------------
ALTER TABLE public.admin_users
    ADD COLUMN IF NOT EXISTS cafe_id UUID REFERENCES public.cafes(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_admin_users_cafe_id ON public.admin_users(cafe_id);

-- Platform yöneticisi: cafe_id boş olan admin.
-- Kafe sahibi: cafe_id dolu olan kayıt.
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
      AND cafe_id IS NULL
      AND COALESCE(role, 'admin') IN ('admin', 'superadmin')
  );
$$;

CREATE OR REPLACE FUNCTION public.current_cafe_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT cafe_id
  FROM public.admin_users
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;

-- ------------------------------------------------------------------------------
-- 2. ADMIN_USERS POLİTİKALARI
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins view admin list" ON public.admin_users;
DROP POLICY IF EXISTS "Back office users view own record" ON public.admin_users;
DROP POLICY IF EXISTS "Platform admins manage admin users" ON public.admin_users;

CREATE POLICY "Back office users view own record"
    ON public.admin_users FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Platform admins manage admin users"
    ON public.admin_users FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 3. CAFES POLİTİKALARI
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins full access to cafes" ON public.cafes;
DROP POLICY IF EXISTS "Platform admins manage cafes" ON public.cafes;
DROP POLICY IF EXISTS "Cafe owners view own cafe" ON public.cafes;
DROP POLICY IF EXISTS "Cafe owners update own cafe" ON public.cafes;

CREATE POLICY "Platform admins manage cafes"
    ON public.cafes FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Cafe owners view own cafe"
    ON public.cafes FOR SELECT
    TO authenticated
    USING (id = public.current_cafe_id());

CREATE POLICY "Cafe owners update own cafe"
    ON public.cafes FOR UPDATE
    TO authenticated
    USING (id = public.current_cafe_id())
    WITH CHECK (id = public.current_cafe_id());

-- ------------------------------------------------------------------------------
-- 4. TABLES POLİTİKALARI
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins full access to tables" ON public.tables;
DROP POLICY IF EXISTS "Platform admins manage tables" ON public.tables;
DROP POLICY IF EXISTS "Cafe owners manage own tables" ON public.tables;

CREATE POLICY "Platform admins manage tables"
    ON public.tables FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Cafe owners manage own tables"
    ON public.tables FOR ALL
    TO authenticated
    USING (cafe_id = public.current_cafe_id())
    WITH CHECK (cafe_id = public.current_cafe_id());

-- ------------------------------------------------------------------------------
-- 5. MENU_ITEMS POLİTİKALARI
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins full access to menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Platform admins manage menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Cafe owners manage own menu" ON public.menu_items;

CREATE POLICY "Platform admins manage menu items"
    ON public.menu_items FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Cafe owners manage own menu"
    ON public.menu_items FOR ALL
    TO authenticated
    USING (cafe_id = public.current_cafe_id())
    WITH CHECK (cafe_id = public.current_cafe_id());

-- ------------------------------------------------------------------------------
-- 6. SERVICE_REQUESTS POLİTİKALARI
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins full access to service requests" ON public.service_requests;
DROP POLICY IF EXISTS "Platform admins manage service requests" ON public.service_requests;
DROP POLICY IF EXISTS "Cafe owners manage own service requests" ON public.service_requests;

CREATE POLICY "Platform admins manage service requests"
    ON public.service_requests FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Cafe owners manage own service requests"
    ON public.service_requests FOR ALL
    TO authenticated
    USING (cafe_id = public.current_cafe_id())
    WITH CHECK (cafe_id = public.current_cafe_id());

-- ------------------------------------------------------------------------------
-- 7. EVENTS: kafe sahibi kendi olaylarını okuyabilir
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Cafe owners view own events" ON public.events;

CREATE POLICY "Cafe owners view own events"
    ON public.events FOR SELECT
    TO authenticated
    USING (cafe_id = public.current_cafe_id());

-- ------------------------------------------------------------------------------
-- 8. LEADS (BAŞVURULAR)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    cafe_name TEXT NOT NULL,
    city TEXT NOT NULL,
    contact_info TEXT NOT NULL,
    table_count INTEGER CHECK (table_count IS NULL OR (table_count >= 1 AND table_count <= 500)),
    note TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'archived')),
    source TEXT NOT NULL DEFAULT 'landing',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Platform admins manage leads" ON public.leads;

CREATE POLICY "Platform admins manage leads"
    ON public.leads FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Herkese açık başvuru kaydı; anon doğrudan tabloya yazamaz.
CREATE OR REPLACE FUNCTION public.submit_lead(
    p_full_name TEXT,
    p_cafe_name TEXT,
    p_city TEXT,
    p_contact_info TEXT,
    p_table_count INTEGER DEFAULT NULL,
    p_note TEXT DEFAULT NULL,
    p_source TEXT DEFAULT 'landing'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
    v_contact TEXT;
BEGIN
    IF length(trim(COALESCE(p_full_name, ''))) < 2 THEN
        RAISE EXCEPTION 'Lütfen adınızı ve soyadınızı girin.';
    END IF;

    IF length(trim(COALESCE(p_cafe_name, ''))) < 2 THEN
        RAISE EXCEPTION 'Lütfen kafe adını girin.';
    END IF;

    IF length(trim(COALESCE(p_city, ''))) < 2 THEN
        RAISE EXCEPTION 'Lütfen şehir bilgisini girin.';
    END IF;

    v_contact := trim(COALESCE(p_contact_info, ''));
    IF length(v_contact) < 5 THEN
        RAISE EXCEPTION 'Lütfen geçerli bir telefon veya e-posta adresi girin.';
    END IF;

    IF p_table_count IS NOT NULL AND (p_table_count < 1 OR p_table_count > 500) THEN
        RAISE EXCEPTION 'Masa sayısı 1 ile 500 arasında olmalıdır.';
    END IF;

    -- Aynı iletişim bilgisiyle 5 dakika içinde gelen tekrar başvurular yutulur
    SELECT id INTO v_id
    FROM public.leads
    WHERE lower(contact_info) = lower(v_contact)
      AND created_at > now() - interval '5 minutes'
    ORDER BY created_at DESC
    LIMIT 1;

    IF v_id IS NOT NULL THEN
        RETURN v_id;
    END IF;

    INSERT INTO public.leads
        (full_name, cafe_name, city, contact_info, table_count, note, source)
    VALUES
        (left(trim(p_full_name), 120),
         left(trim(p_cafe_name), 160),
         left(trim(p_city), 80),
         left(v_contact, 160),
         p_table_count,
         NULLIF(left(trim(COALESCE(p_note, '')), 500), ''),
         left(COALESCE(NULLIF(trim(p_source), ''), 'landing'), 40))
    RETURNING id INTO v_id;

    RETURN v_id;
END;
$$;

-- ------------------------------------------------------------------------------
-- 9. FONKSİYON İZİNLERİ
-- ------------------------------------------------------------------------------
GRANT EXECUTE ON FUNCTION public.submit_lead(TEXT, TEXT, TEXT, TEXT, INTEGER, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_service_request(TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_active_table_request(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_table_request(TEXT, UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.log_usage_event(TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_menu_items_by_token(TEXT) TO anon, authenticated;
