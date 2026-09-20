import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ActiveView, User } from './types';
import { authService } from './services/authService';

// Layout & Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';

// Page Views
import { LandingPage } from './pages/LandingPage';
import { UserDashboardHome } from './pages/UserDashboardHome';
import { MessageAnalyzer } from './pages/MessageAnalyzer';
import { PaymentAnalyzer } from './pages/PaymentAnalyzer';
import { CallAnalyzer } from './pages/CallAnalyzer';
import { ReportScamPage } from './pages/ReportScamPage';
import { CommunityFeedPage } from './pages/CommunityFeedPage';
import { ScamIntelligencePage } from './pages/ScamIntelligencePage';
import { MyHistoryPage } from './pages/MyHistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

const PRIVATE_VIEWS: ActiveView[] = [
  'dashboard', 'message-analyzer', 'scam-analyzer', 'payment-analyzer', 'call-analyzer',
  'my-history', 'my-reports', 'profile', 'settings', 'report-scam', 'community-feed',
  'similar-scams', 'scam-intelligence', 'scam-patterns', 'emerging-scams'
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => authService.isAuthenticated());

  // Always start a fresh browser session on the public landing page.
  // Navigation after login still works normally, but a reload never restores an old private view.
  const [currentView, setCurrentView] = useState<ActiveView>('landing');

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('scamshield_theme') === 'dark';
  });

  // Keep dark class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('scamshield_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleNavigate = (targetView: ActiveView) => {
    let view = targetView;


    // Never redirect authenticated users back to login or register
    if (isAuthenticated && (view === 'login' || view === 'register')) {
      const user = authService.getCurrentUser();
      view = 'dashboard';
    }

    // Protect private views from unauthenticated visitors
    if (!isAuthenticated && PRIVATE_VIEWS.includes(view)) {
      view = 'login';
    }

    setCurrentView(view);
    localStorage.setItem('scamshield_active_view', view);
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentView('landing');
    localStorage.setItem('scamshield_active_view', 'landing');
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user?: User) => {
    setIsAuthenticated(true);
    setCurrentView('dashboard');
    localStorage.setItem('scamshield_active_view', 'dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderView = () => {
    if (currentView === 'dashboard') return <UserDashboardHome onNavigate={handleNavigate} />;
    if (currentView === 'message-analyzer' || currentView === 'scam-analyzer') return <MessageAnalyzer onNavigate={handleNavigate} />;
    if (currentView === 'payment-analyzer') return <PaymentAnalyzer onNavigate={handleNavigate} />;
    if (currentView === 'call-analyzer') return <CallAnalyzer onNavigate={handleNavigate} />;
    if (currentView === 'report-scam') return <ReportScamPage onNavigate={handleNavigate} />;
    if (currentView === 'community-feed') return <CommunityFeedPage onNavigate={handleNavigate} initialMode="feed" />;
    if (currentView === 'similar-scams') return <CommunityFeedPage onNavigate={handleNavigate} initialMode="similar" />;
    if (currentView === 'scam-intelligence' || currentView === 'scam-patterns') return <ScamIntelligencePage onNavigate={handleNavigate} initialTab="all" />;
    if (currentView === 'emerging-scams') return <ScamIntelligencePage onNavigate={handleNavigate} initialTab="emerging" />;
    if (currentView === 'my-history') return <MyHistoryPage onNavigate={handleNavigate} initialTab="history" />;
    if (currentView === 'my-reports') return <MyHistoryPage onNavigate={handleNavigate} initialTab="reports" />;
    if (currentView === 'profile' || currentView === 'settings') return <ProfilePage onNavigate={handleNavigate} onLogout={handleLogout} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />;
    return <UserDashboardHome onNavigate={handleNavigate} />;
  };

  // 1. PUBLIC USER VIEWS (when not logged in)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          isLoggedIn={false}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
        <main className="flex-1">
          {currentView === 'landing' && <LandingPage onNavigate={handleNavigate} />}
          {currentView === 'login' && (
            <LoginPage onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
          )}
          {currentView === 'register' && (
            <RegisterPage onNavigate={handleNavigate} onRegisterSuccess={() => handleLoginSuccess()} />
          )}
          {(currentView === 'scam-intelligence' || currentView === 'scam-patterns') && (
            <ScamIntelligencePage onNavigate={handleNavigate} initialTab="all" />
          )}
          {currentView === 'emerging-scams' && (
            <ScamIntelligencePage onNavigate={handleNavigate} initialTab="emerging" />
          )}
          {currentView === 'community-feed' && (
            <CommunityFeedPage onNavigate={handleNavigate} initialMode="feed" />
          )}
          {currentView === 'similar-scams' && (
            <CommunityFeedPage onNavigate={handleNavigate} initialMode="similar" />
          )}
          {(currentView === 'message-analyzer' || currentView === 'scam-analyzer') && (
            <MessageAnalyzer onNavigate={handleNavigate} />
          )}
          {currentView === 'payment-analyzer' && (
            <PaymentAnalyzer onNavigate={handleNavigate} />
          )}
          {currentView === 'call-analyzer' && (
            <CallAnalyzer onNavigate={handleNavigate} />
          )}
        </main>
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  // 3. AUTHENTICATED USER: Landing page access
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          isLoggedIn={true}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
        <main className="flex-1">
          <LandingPage onNavigate={handleNavigate} />
        </main>
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  // 4. AUTHENTICATED USER: Dashboard Shell
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* Desktop Persistent Tree Sidebar */}
      <div className="hidden md:block shrink-0">
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-slate-950 shadow-2xl z-10">
            <Sidebar
              currentView={currentView}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <Header
          onNavigate={handleNavigate}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />

        <main className="flex-1 pb-16 overflow-x-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentView}
              className="page-transition min-h-full"
              initial={{ opacity: 0, y: 10, filter: 'blur(2px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

