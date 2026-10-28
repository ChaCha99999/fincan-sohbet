import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, isLiveBackend } from '../lib/supabase';

const DEMO_AUTH_KEY = 'fincan_demo_admin_auth';

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [adminRole, setAdminRole] = useState<'admin' | 'owner' | 'superadmin' | null>(null);
  const [cafeId, setCafeId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);

      // Canlı backend'de demo oturumu geçersizdir; eski kalıntı anahtarı temizle
      if (isLiveBackend) {
        localStorage.removeItem(DEMO_AUTH_KEY);
      } else {
        const demoAuth = localStorage.getItem(DEMO_AUTH_KEY);
        if (demoAuth === 'true') {
          setIsAuthenticated(true);
          setUserEmail('admin@demo.fincansohbet.com (Demo)');
          setAdminRole('admin');
          setCafeId(null);
          setIsLoading(false);
          return;
        }
      }

      // Check Supabase Auth
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Check if user is in admin_users table
            const { data, error } = await supabase
              .from('admin_users')
              .select('role, cafe_id')
              .eq('user_id', session.user.id)
              .maybeSingle();

            if (!error && data) {
              setIsAuthenticated(true);
              setUserEmail(session.user.email || null);
              setAdminRole((data.role as 'admin' | 'owner' | 'superadmin') || 'admin');
              setCafeId(data.cafe_id || null);
            } else {
              setIsAuthenticated(false);
            }
          } else {
            setIsAuthenticated(false);
          }
        } catch (e) {
          console.warn('Auth check error:', e);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    checkAuth();

    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      const { data: authListener } = client.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const { data } = await client
            .from('admin_users')
            .select('role, cafe_id')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (data) {
            setIsAuthenticated(true);
            setUserEmail(session.user.email || null);
            setAdminRole((data.role as 'admin' | 'owner' | 'superadmin') || 'admin');
            setCafeId(data.cafe_id || null);
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
          setUserEmail(null);
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  const loginWithSupabase = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase bağlantısı henüz yapılandırılmadı. Demo Girişini kullanabilirsiniz.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { success: false, error: 'Geçersiz e-posta veya parola.' };
      }

      if (data.user) {
        const { data: adminData, error: adminErr } = await supabase
          .from('admin_users')
          .select('role, cafe_id')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (adminErr || !adminData) {
          await supabase.auth.signOut();
          return { success: false, error: 'Bu kullanıcı yetkili yönetici listesinde bulunmuyor.' };
        }

        setIsAuthenticated(true);
        setUserEmail(data.user.email || null);
        setAdminRole((adminData.role as 'admin' | 'owner' | 'superadmin') || 'admin');
        setCafeId(adminData.cafe_id || null);
        return { success: true };
      }
      return { success: false, error: 'Giriş yapılamadı.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Bilinmeyen bir hata oluştu.' };
    }
  };

  const loginDemo = () => {
    if (isLiveBackend) return;
    localStorage.setItem(DEMO_AUTH_KEY, 'true');
    setIsAuthenticated(true);
    setUserEmail('admin@demo.fincansohbet.com (Demo)');
    setAdminRole('admin');
    setCafeId(null);
  };

  const logout = async () => {
    localStorage.removeItem(DEMO_AUTH_KEY);
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    setUserEmail(null);
    setAdminRole(null);
    setCafeId(null);
  };

  // Kafe sahibi (cafe_id dolu) platform yöneticisi sayılmaz
  const isPlatformAdmin =
    !cafeId && (adminRole === 'admin' || adminRole === 'superadmin');

  return {
    isAuthenticated,
    isLoading,
    userEmail,
    adminRole,
    cafeId,
    isPlatformAdmin,
    loginWithSupabase,
    loginDemo,
    logout,
  };
};
