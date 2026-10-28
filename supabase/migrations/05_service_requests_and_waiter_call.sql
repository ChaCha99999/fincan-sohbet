-- ==============================================================================
-- FİNCAN SOHBET — MİGRASYON 05: GARSON ÇAĞIR & HESAP İSTE ALTYAPISI
-- ==============================================================================

-- 1. Cafes tablosuna bu özelliğin açılıp kapanmasını sağlayan ayar sütunu
ALTER TABLE public.cafes 
    ADD COLUMN IF NOT EXISTS waiter_call_enabled BOOLEAN NOT NULL DEFAULT true;

-- 2. get_table_by_token fonksiyonunu yeni alanla güncelle
--    (dönüş tipi değişiyor; CREATE OR REPLACE yetmez, önce DROP gerekir)
DROP FUNCTION IF EXISTS public.get_table_by_token(TEXT);

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
    cafe_status TEXT,
    menu_url TEXT,
    wifi_name TEXT,
    wifi_password TEXT,
    instagram TEXT,
    waiter_call_enabled BOOLEAN
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
        c.status AS cafe_status,
        c.menu_url,
        c.wifi_name,
        c.wifi_password,
        c.instagram,
        COALESCE(c.waiter_call_enabled, true) AS waiter_call_enabled
    FROM public.tables t
    JOIN public.cafes c ON c.id = t.cafe_id
    WHERE LOWER(t.public_token) = LOWER(TRIM(p_token))
    LIMIT 1;
END;
$$;

-- 3. MASA SERVİS ÇAĞRILARI TABLOSU (GARSON & HESAP İSTEKLERİ)
CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cafe_id UUID NOT NULL REFERENCES public.cafes(id) ON DELETE CASCADE,
    table_id UUID NOT NULL REFERENCES public.tables(id) ON DELETE CASCADE,
    request_type TEXT NOT NULL CHECK (request_type IN ('waiter', 'bill')),
    payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'meal_card', 'other')),
    note TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_service_requests_cafe_id ON public.service_requests(cafe_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON public.service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_created_at ON public.service_requests(created_at);

-- 4. ROW LEVEL SECURITY (RLS) POLİTİKALARI
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Müşteriler masadan çağrı oluşturabilir (INSERT)
CREATE POLICY "Public can insert service requests"
    ON public.service_requests FOR INSERT
    WITH CHECK (true);

-- Müşteriler ve adminler çağrıları listeleyebilir (SELECT)
CREATE POLICY "Public can view service requests"
    ON public.service_requests FOR SELECT
    USING (true);

-- Müşteriler kendi çağrılarını iptal edebilir, adminler güncelleyebilir (UPDATE)
CREATE POLICY "Public and Admins can update service requests"
    ON public.service_requests FOR UPDATE
    USING (true);

-- Adminler silebilir
CREATE POLICY "Admins can delete service requests"
    ON public.service_requests FOR DELETE
    USING (public.is_admin());

-- 5. SUPABASE REALTIME ETKİNLİĞİ (Anlık garson paneli bildirimleri)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.service_requests;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        NULL;
END;
$$;
