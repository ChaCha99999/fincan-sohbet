import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DemoBanner } from './components/DemoBanner';
import { LeadModal } from './components/LeadModal';
import { LandingPage } from './pages/LandingPage';
import { TableLandingPage } from './pages/TableLandingPage';
import { GameCategoriesPage } from './pages/GameCategoriesPage';
import { GamePlayPage } from './pages/GamePlayPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminCafesPage } from './pages/AdminCafesPage';
import { AdminTablesPage } from './pages/AdminTablesPage';
import { AdminQuestionsPage } from './pages/AdminQuestionsPage';
import { Coffee, ArrowLeft } from 'lucide-react';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leadModalOpen, setLeadModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-coffee-900">
      <DemoBanner />
      <Navbar onOpenLeadModal={() => setLeadModalOpen(true)} />
      <main className="flex-1">
        {children}
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

export const App: React.FC = () => {
  return (
    <BrowserRouter>
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
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Yönetim Paneli Rotaları */}
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/cafes" element={<AdminCafesPage />} />
        <Route path="/admin/cafes/:id/tables" element={<AdminTablesPage />} />
        <Route path="/admin/questions" element={<AdminQuestionsPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
