-- ==============================================================================
-- FİNCAN SOHBET — MİGRASYON 02: KAFE MENÜ & WI-FI ALTYAPISI
-- ==============================================================================

-- 1. Cafes tablosuna menü ve wi-fi sütunlarını ekle
ALTER TABLE public.cafes 
    ADD COLUMN IF NOT EXISTS menu_url TEXT,
    ADD COLUMN IF NOT EXISTS wifi_name TEXT,
    ADD COLUMN IF NOT EXISTS wifi_password TEXT,
    ADD COLUMN IF NOT EXISTS instagram TEXT;

-- 2. get_table_by_token fonksiyonunu yeni alanlarla güncelle
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
    instagram TEXT
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
        c.instagram
    FROM public.tables t
    JOIN public.cafes c ON c.id = t.cafe_id
    WHERE LOWER(t.public_token) = LOWER(TRIM(p_token))
    LIMIT 1;
END;
$$;
