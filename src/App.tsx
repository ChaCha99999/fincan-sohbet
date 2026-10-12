import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DemoBanner } from './components/DemoBanner';
import { LeadModal } from './components/LeadModal';
import { TableLandingPage } from './pages/TableLandingPage';
import { GameCategoriesPage } from './pages/GameCategoriesPage';
import { GamePlayPage } from './pages/GamePlayPage';
import { Coffee, ArrowLeft, Loader2 } from 'lucide-react';

// Tembel yüklenen sayfalar (müşteri QR açılış hızını maksimuma çıkarır)
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminCafesPage = lazy(() => import('./pages/AdminCafesPage').then(m => ({ default: m.AdminCafesPage })));
const AdminTablesPage = lazy(() => import('./pages/AdminTablesPage').then(m => ({ default: m.AdminTablesPage })));
const AdminMenuPage = lazy(() => import('./pages/AdminMenuPage').then(m => ({ default: m.AdminMenuPage })));
const AdminQuestionsPage = lazy(() => import('./pages/AdminQuestionsPage').then(m => ({ default: m.AdminQuestionsPage })));
const AdminServiceRequestsPage = lazy(() => import('./pages/AdminServiceRequestsPage').then(m => ({ default: m.AdminServiceRequestsPage })));

const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-cream-50 flex items-center justify-center p-6">
    <div className="flex flex-col items-center gap-3 text-coffee-700">
      <Loader2 className="w-8 h-8 animate-spin text-terracotta-600" />
      <span className="text-xs font-semibold uppercase tracking-wider text-coffee-600">Yükleniyor...</span>
    </div>
  </div>
);

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leadModalOpen, setLeadModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-coffee-900">
      <DemoBanner />
      <Navbar onOpenLeadModal={() => setLeadModalOpen(true)} />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          {children}
        </Suspense>
      </main>
      <Footer />
      <LeadModal isOpen={leadModalOpen} onClose={() => setLeadModalOpen(false)} />
    </div>
  );
};

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-warm border border-coffee-200 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center mx-auto">
          <Coffee className="w-7 h-7" />
        </div>
        <h1 className="font-serif font-black text-3xl text-coffee-950">404</h1>
        <p className="text-sm text-coffee-700">
          Aradığınız sayfa veya masa bulunamadı. Fincanınız boş kalmasın, ana sayfaya dönelim.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs shadow-warm"
        >
          <ArrowLeft className="w-4 h-4" />
          Ana Sayfaya Dön
        </a>
      </div>
    </div>
  );
};

const ScrollManager: React.FC = () => {
  const { pathname, hash } = useLocation();

  React.useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        // Allow DOM to settle before scrolling
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);

  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Routes>
        {/* Halka Açık Tanıtım Sayfası */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <LandingPage />
            </PublicLayout>
          }
        />

        {/* Gizlilik Sayfası */}
        <Route
          path="/privacy"
          element={
            <PublicLayout>
              <PrivacyPage />
            </PublicLayout>
          }
        />

        {/* Müşteri Masa Açılış Sayfası (QR / NFC Landing) */}
        <Route path="/t/:token" element={<TableLandingPage />} />

        {/* Oyun Kategorileri Seçici */}
        <Route path="/games" element={<GameCategoriesPage />} />

        {/* 4 Mini Oyun Ekranı */}
        <Route path="/play/:gameSlug" element={<GamePlayPage />} />

        {/* Yönetici Girişi */}
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<PageLoader />}>
              <AdminLoginPage />
            </Suspense>
          }
        />

        {/* Yönetim Paneli Rotaları */}
        <Route
          path="/admin/dashboard"
          element={
            <Suspense fallback={<PageLoader />}>
              <AdminDashboardPage />
            </Suspense>
          }
        />
        <Route
          path="/admin/calls"
          element={
            <Suspense fallback={<PageLoader />}>
              <AdminServiceRequestsPage />
            </Suspense>
          }
        />
        <Route
          path="/admin/cafes"
          element={
            <Suspense fallback={<PageLoader />}>
              <AdminCafesPage />
            </Suspense>
          }
        />
        <Route
          path="/admin/cafes/:id/tables"
          element={
            <Suspense fallback={<PageLoader />}>
              <AdminTablesPage />
            </Suspense>
          }
        />
        <Route
          path="/admin/cafes/:id/menu"
          element={
            <Suspense fallback={<PageLoader />}>
              <AdminMenuPage />
            </Suspense>
          }
        />
        <Route
          path="/admin/questions"
          element={
            <Suspense fallback={<PageLoader />}>
              <AdminQuestionsPage />
            </Suspense>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
