-- ==============================================================================
-- FİNCAN SOHBET — MİGRASYON 06: GÜVENLİK SERTLEŞTİRMESİ
-- ==============================================================================
-- Amaç:
--   1. Anon istemcinin service_requests / events / menu_items tablolarına
--      doğrudan erişimini kapatmak.
--   2. Müşteri işlemlerini masa token'ı doğrulayan SECURITY DEFINER RPC'lere taşımak.
--   3. Storage yükleme politikasına admin kontrolü eklemek.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. SERVICE_REQUESTS: doğrudan erişim kapatılır, sadece admin erişir
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can insert service requests" ON public.service_requests;
DROP POLICY IF EXISTS "Public can view service requests" ON public.service_requests;
DROP POLICY IF EXISTS "Public and Admins can update service requests" ON public.service_requests;
DROP POLICY IF EXISTS "Admins can delete service requests" ON public.service_requests;
DROP POLICY IF EXISTS "Admins full access to service requests" ON public.service_requests;

CREATE POLICY "Admins full access to service requests"
    ON public.service_requests FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 2. EVENTS: anon doğrudan insert kaldırılır, sadece RPC ile yazılır
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can insert events" ON public.events;

CREATE POLICY "Admins can insert events"
    ON public.events FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 3. MENU_ITEMS: herkese açık SELECT kaldırılır, menü token RPC'si ile okunur
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view menu items" ON public.menu_items;

-- ------------------------------------------------------------------------------
-- 4. STORAGE: yükleme/güncelleme/silme sadece admin
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins can upload menu images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update menu images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete menu images" ON storage.objects;

CREATE POLICY "Admins can upload menu images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'menu-images' AND public.is_admin());

CREATE POLICY "Admins can update menu images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'menu-images' AND public.is_admin())
    WITH CHECK (bucket_id = 'menu-images' AND public.is_admin());

CREATE POLICY "Admins can delete menu images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'menu-images' AND public.is_admin());

-- ------------------------------------------------------------------------------
-- 5. RPC: MASA SERVİS ÇAĞRISI OLUŞTUR (GARSON / HESAP)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_service_request(
    p_token TEXT,
    p_request_type TEXT,
    p_payment_method TEXT DEFAULT NULL,
    p_note TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_table public.tables%ROWTYPE;
    v_cafe public.cafes%ROWTYPE;
    v_request public.service_requests%ROWTYPE;
BEGIN
    IF p_token IS NULL OR length(trim(p_token)) = 0 THEN
        RAISE EXCEPTION 'Masa bağlantısı geçersiz.';
    END IF;

    SELECT * INTO v_table
    FROM public.tables t
    WHERE lower(t.public_token) = lower(trim(p_token))
    LIMIT 1;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Masa bulunamadı veya bağlantı geçersiz.';
    END IF;

    SELECT * INTO v_cafe
    FROM public.cafes c
    WHERE c.id = v_table.cafe_id;

    IF NOT FOUND OR v_cafe.status <> 'active' THEN
        RAISE EXCEPTION 'Bu işletme şu anda hizmet vermemektedir.';
    END IF;

    IF NOT v_table.is_active THEN
        RAISE EXCEPTION 'Bu masa şu anda kullanıma kapalıdır.';
    END IF;

    IF COALESCE(v_cafe.waiter_call_enabled, true) = false THEN
        RAISE EXCEPTION 'Masa çağrısı bu işletmede devre dışı bırakılmış.';
    END IF;

    IF p_request_type NOT IN ('waiter', 'bill') THEN
        RAISE EXCEPTION 'Geçersiz istek türü.';
    END IF;

    IF p_payment_method IS NOT NULL AND p_payment_method NOT IN ('cash', 'card', 'meal_card', 'other') THEN
        RAISE EXCEPTION 'Geçersiz ödeme yöntemi.';
    END IF;

    -- Masada zaten aktif bir çağrı varsa aynısı döndürülür (mükerrer kayıt engeli)
    SELECT * INTO v_request
    FROM public.service_requests r
    WHERE r.table_id = v_table.id
      AND r.status IN ('pending', 'in_progress')
    ORDER BY r.created_at DESC
    LIMIT 1;

    IF FOUND THEN
        RETURN jsonb_build_object(
            'id', v_request.id,
            'cafe_id', v_request.cafe_id,
            'table_id', v_request.table_id,
            'request_type', v_request.request_type,
            'payment_method', v_request.payment_method,
            'note', v_request.note,
            'status', v_request.status,
            'created_at', v_request.created_at,
            'updated_at', v_request.updated_at,
            'table_label', v_table.label,
            'cafe_name', v_cafe.name
        );
    END IF;

    -- Aynı masadan 20 saniye içinde ikinci istek spam sayılır
    IF EXISTS (
        SELECT 1 FROM public.service_requests r
        WHERE r.table_id = v_table.id
          AND r.created_at > now() - interval '20 seconds'
    ) THEN
        RAISE EXCEPTION 'Çok sık istek gönderildi. Lütfen kısa bir süre bekleyin.';
    END IF;

    INSERT INTO public.service_requests
        (cafe_id, table_id, request_type, payment_method, note, status)
    VALUES
        (v_cafe.id, v_table.id, p_request_type, p_payment_method,
         NULLIF(left(trim(COALESCE(p_note, '')), 280), ''), 'pending')
    RETURNING * INTO v_request;

    RETURN jsonb_build_object(
        'id', v_request.id,
        'cafe_id', v_request.cafe_id,
        'table_id', v_request.table_id,
        'request_type', v_request.request_type,
        'payment_method', v_request.payment_method,
        'note', v_request.note,
        'status', v_request.status,
        'created_at', v_request.created_at,
        'updated_at', v_request.updated_at,
        'table_label', v_table.label,
        'cafe_name', v_cafe.name
    );
END;
$$;

-- ------------------------------------------------------------------------------
-- 6. RPC: MASANIN AKTİF ÇAĞRISINI GETİR
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_active_table_request(p_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_result JSONB;
BEGIN
    IF p_token IS NULL OR length(trim(p_token)) = 0 THEN
        RETURN NULL;
    END IF;

    SELECT jsonb_build_object(
        'id', r.id,
        'cafe_id', r.cafe_id,
        'table_id', r.table_id,
        'request_type', r.request_type,
        'payment_method', r.payment_method,
        'note', r.note,
        'status', r.status,
        'created_at', r.created_at,
        'updated_at', r.updated_at,
        'table_label', t.label,
        'cafe_name', c.name
    )
    INTO v_result
    FROM public.tables t
    JOIN public.cafes c ON c.id = t.cafe_id
    JOIN public.service_requests r ON r.table_id = t.id
    WHERE lower(t.public_token) = lower(trim(p_token))
      AND r.status IN ('pending', 'in_progress')
    ORDER BY r.created_at DESC
    LIMIT 1;

    RETURN v_result;
END;
$$;

-- ------------------------------------------------------------------------------
-- 7. RPC: MÜŞTERİ KENDİ ÇAĞRISINI İPTAL ETSİN
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.cancel_table_request(p_token TEXT, p_request_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_updated INTEGER;
BEGIN
    IF p_token IS NULL OR length(trim(p_token)) = 0 THEN
        RETURN false;
    END IF;

    UPDATE public.service_requests r
    SET status = 'cancelled',
        updated_at = now()
    FROM public.tables t
    WHERE r.id = p_request_id
      AND r.table_id = t.id
      AND lower(t.public_token) = lower(trim(p_token))
      AND r.status IN ('pending', 'in_progress');

    GET DIAGNOSTICS v_updated = ROW_COUNT;
    RETURN v_updated > 0;
END;
$$;

-- ------------------------------------------------------------------------------
-- 8. RPC: KULLANIM OLAYI KAYDI (QR OKUTMA / OYUN)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.log_usage_event(
    p_token TEXT,
    p_event_type TEXT,
    p_game_type TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_table public.tables%ROWTYPE;
    v_cafe_status TEXT;
    v_game_type TEXT;
BEGIN
    IF p_token IS NULL OR length(trim(p_token)) = 0 THEN
        RETURN;
    END IF;

    IF p_event_type NOT IN ('table_open', 'game_start', 'game_complete') THEN
        RAISE EXCEPTION 'Geçersiz olay türü.';
    END IF;

    SELECT * INTO v_table
    FROM public.tables t
    WHERE lower(t.public_token) = lower(trim(p_token))
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN;
    END IF;

    SELECT c.status INTO v_cafe_status
    FROM public.cafes c
    WHERE c.id = v_table.cafe_id;

    IF v_cafe_status IS DISTINCT FROM 'active' THEN
        RETURN;
    END IF;

    v_game_type := NULLIF(trim(COALESCE(p_game_type, '')), '');
    IF v_game_type IS NOT NULL AND v_game_type NOT IN (
        'sohbeti-baslat', 'ikilemde-kal', 'kim-daha-muhtemel', 'ne-kadar-taniyoruz',
        'kafe-trivia', 'masa-duellosu', 'kafe-nabzi', 'masadaki-casus',
        'bes-saniye', 'klasik-tabu', 'parmak-ruleti'
    ) THEN
        RAISE EXCEPTION 'Geçersiz oyun türü.';
    END IF;

    -- Aynı masa + olay + oyun için 10 saniyelik mükerrer koruması
    IF EXISTS (
        SELECT 1 FROM public.events e
        WHERE e.table_id = v_table.id
          AND e.event_type = p_event_type
          AND COALESCE(e.game_type, '') = COALESCE(v_game_type, '')
          AND e.created_at > now() - interval '10 seconds'
    ) THEN
        RETURN;
    END IF;

    INSERT INTO public.events (cafe_id, table_id, event_type, game_type)
    VALUES (v_table.cafe_id, v_table.id, p_event_type, v_game_type);
END;
$$;

-- ------------------------------------------------------------------------------
-- 9. RPC: MASA TOKEN'I İLE MENÜYÜ GETİR
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_menu_items_by_token(p_token TEXT)
RETURNS SETOF public.menu_items
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT m.*
    FROM public.menu_items m
    JOIN public.tables t ON t.cafe_id = m.cafe_id
    JOIN public.cafes c ON c.id = t.cafe_id
    WHERE lower(t.public_token) = lower(trim(p_token))
      AND c.status = 'active'
    ORDER BY m.sort_order ASC, m.name ASC;
$$;
