import React, { useState } from 'react';
import { Menu, X, ArrowRight, Sun, Moon } from 'lucide-react';
import { ActiveView } from '../../types';

interface NavbarProps {
  currentView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  isLoggedIn?: boolean;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  isLoggedIn,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="nav-logo-btn"
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <img
            src="/rakshapay-shield-transparent.png"
            alt="RakshaPay shield"
            className="w-9 h-10 object-contain shrink-0 group-hover:scale-105 transition-transform duration-300"
          />
          <span className="min-w-0 leading-none">
            <img
              src="/rakshapay-wordmark-light.png"
              alt="RakshaPay"
              className="block dark:hidden w-[116px] sm:w-[132px] h-auto object-contain object-left"
            />
            <img
              src="/rakshapay-wordmark-dark.png"
              alt="RakshaPay"
              className="hidden dark:block w-[116px] sm:w-[132px] h-auto object-contain object-left"
            />
            <span className="block mt-1 text-[9px] sm:text-[10px] font-medium tracking-wide text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Safer Payments. Brighter India.
            </span>
          </span>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            id="nav-how-it-works"
            onClick={() => {
              if (currentView !== 'landing') {
                onNavigate('landing');
                setTimeout(() => {
                  const el = document.getElementById('how-it-works-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              } else {
                const el = document.getElementById('how-it-works-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            How It Works
          </button>
          <button
            id="nav-scam-types"
            onClick={() => onNavigate('scam-patterns')}
            className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
              currentView === 'scam-patterns' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Scam Patterns
          </button>
          <button
            id="nav-community"
            onClick={() => onNavigate('community-feed')}
            className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
              currentView === 'community-feed' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Community Feed
          </button>
          <button
            id="nav-intelligence"
            onClick={() => onNavigate('scam-intelligence')}
            className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
              currentView === 'scam-intelligence' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Intelligence
          </button>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <button
              id="nav-dashboard-btn"
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all flex items-center gap-1.5"
            >
              Open Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                id="nav-login-btn"
                onClick={() => onNavigate('login')}
                className="px-3.5 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Log In
              </button>
              <button
                id="nav-analyze-scam-btn"
                onClick={() => onNavigate('message-analyzer')}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all flex items-center gap-1.5"
              >
                Analyze a Scam
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Theme Toggle */}
          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            id="nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-5 space-y-3">
          <button
            id="mobile-nav-analyze"
            onClick={() => {
              onNavigate('message-analyzer');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50"
          >
            🔍 Analyze a Scam
          </button>
          <button
            id="mobile-nav-how-it-works"
            onClick={() => {
              setMobileMenuOpen(false);
              if (currentView !== 'landing') {
                onNavigate('landing');
                setTimeout(() => {
                  const el = document.getElementById('how-it-works-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              } else {
                const el = document.getElementById('how-it-works-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-slate-700 dark:text-slate-300 font-medium"
          >
            How It Works
          </button>
          <button
            id="mobile-nav-patterns"
            onClick={() => {
              onNavigate('scam-patterns');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-slate-700 dark:text-slate-300 font-medium"
          >
            Scam Patterns
          </button>
          <button
            id="mobile-nav-feed"
            onClick={() => {
              onNavigate('community-feed');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-slate-700 dark:text-slate-300 font-medium"
          >
            Community Feed
          </button>
          <button
            id="mobile-nav-intelligence"
            onClick={() => {
              onNavigate('scam-intelligence');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-slate-700 dark:text-slate-300 font-medium"
          >
            Intelligence
          </button>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  onNavigate('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center font-semibold rounded-lg bg-indigo-600 text-white"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center font-medium rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    onNavigate('register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center font-semibold rounded-lg bg-indigo-600 text-white"
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
