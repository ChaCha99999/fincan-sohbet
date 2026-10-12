-- ==============================================================================
-- FİNCAN SOHBET — MİGRASYON 03: MENÜ YÖNETİMİ TABLOSU & POLİTİKALARI
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cafe_id UUID REFERENCES public.cafes(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT '₺',
    image_url TEXT,
    is_popular BOOLEAN NOT NULL DEFAULT false,
    is_available BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_menu_items_cafe_id ON public.menu_items(cafe_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items(category);

-- RLS
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Müşteriler masadan menüyü görebilir (SELECT)
CREATE POLICY "Public can view menu items"
    ON public.menu_items FOR SELECT
    USING (true);

-- Adminler tam erişime sahiptir (INSERT, UPDATE, DELETE)
CREATE POLICY "Admins full access to menu items"
    ON public.menu_items FOR ALL
    USING (public.is_admin());
