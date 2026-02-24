import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { initializeSettings } from './lib/init-settings';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DonationForm from './components/DonationForm';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import NoticesPage from './pages/NoticesPage';
import EventsPage from './pages/EventsPage';
import ZakatPage from './pages/ZakatPage';
import HistoryPage from './pages/HistoryPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ReportsPage from './pages/ReportsPage';
import ComingSoonPage from './pages/ComingSoonPage';
import Header from './components/Header';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-islamic-pattern font-sans text-gray-900 relative">
      {/* Decorative Top Border */}
      <div className="h-2 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600 sticky top-0 z-[60]"></div>
      
      <Header />
      
      <div className="pt-4 pb-12 relative z-10">
        {children}
      </div>

      {/* Decorative Bottom Pattern */}
      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-emerald-50 to-transparent pointer-events-none z-0"></div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    initializeSettings();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Layout><AuthPage /></Layout>} />
          <Route path="/donate" element={<Layout><div className="max-w-7xl mx-auto px-4 py-8"><DonationForm /></div></Layout>} />
          <Route path="/admin" element={<Layout><AdminPage /></Layout>} />
          <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
          <Route path="/notices" element={<Layout><NoticesPage /></Layout>} />
          <Route path="/events" element={<Layout><EventsPage /></Layout>} />
          <Route path="/zakat" element={<Layout><ZakatPage /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
          
          {/* Placeholders for remaining routes */}
          <Route path="/history" element={<Layout><HistoryPage /></Layout>} />
          <Route path="/reports" element={<Layout><ReportsPage /></Layout>} />
          <Route path="/construction" element={<Layout><ComingSoonPage title="Construction Fund" /></Layout>} />
          <Route path="/volunteer" element={<Layout><ComingSoonPage title="Volunteer" /></Layout>} />
          <Route path="/classes" element={<Layout><ComingSoonPage title="Quran Classes" /></Layout>} />
          <Route path="/audit" element={<Layout><ComingSoonPage title="Audit Reports" /></Layout>} />
          <Route path="/mosques" element={<Layout><ComingSoonPage title="Multi Mosque" /></Layout>} />
          <Route path="/app" element={<Layout><ComingSoonPage title="Mobile App" /></Layout>} />
          <Route path="/settings" element={<Layout><ComingSoonPage title="Settings" /></Layout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
