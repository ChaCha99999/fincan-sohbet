-- ==============================================================================
-- FİNCAN SOHBET — MİGRASYON 04: MENÜ GÖRSELLERİ STORAGE BUCKET
-- ==============================================================================

-- 'menu-images' storage bucket oluştur
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Politikalar: Herkes okuyabilir (müşteriler menü fotoğraflarını görebilir)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Public can view menu images'
    ) THEN
        CREATE POLICY "Public can view menu images"
            ON storage.objects FOR SELECT
            USING (bucket_id = 'menu-images');
    END IF;
END $$;

-- Politikalar: Adminler görsel yükleyebilir / güncelleyebilir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Admins can upload menu images'
    ) THEN
        CREATE POLICY "Admins can upload menu images"
            ON storage.objects FOR INSERT
            WITH CHECK (bucket_id = 'menu-images');
    END IF;
END $$;
