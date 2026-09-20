import React from 'react';
import {
  LayoutDashboard,
  MessageSquareWarning,
  CreditCard,
  PhoneCall,
  ShieldAlert,
  Users,
  Layers,
  PlusCircle,
  BrainCircuit,
  Flame,
  History,
  FileText,
  User,
  LogOut,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { ActiveView } from '../../types';
import { authService } from '../../services/authService';
import { UserAvatar } from './UserAvatar';

interface SidebarProps {
  currentView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onLogout: () => void;
}

interface NavLeafItem {
  id: ActiveView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isLast?: boolean;
  badge?: string;
  badgeColor?: string;
  matches?: ActiveView[];
}

interface NavGroup {
  title: string;
  items: NavLeafItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onLogout }) => {
  const currentUser = authService.getCurrentUser();

  const isItemActive = (item: NavLeafItem) => {
    if (currentView === item.id) return true;
    if (item.matches && item.matches.includes(currentView)) return true;
    return false;
  };

  const navGroups: NavGroup[] = [
    {
      title: 'Analyze',
      items: [
        {
          id: 'message-analyzer',
          label: 'Scam Analyzer',
          icon: MessageSquareWarning,
          isLast: false,
          badge: 'AI',
          matches: ['message-analyzer', 'scam-analyzer']
        },
        {
          id: 'payment-analyzer',
          label: 'Payment Analyzer',
          icon: CreditCard,
          isLast: false
        },
        {
          id: 'call-analyzer',
          label: 'Call Analyzer',
          icon: PhoneCall,
          isLast: true
        }
      ]
    },
    {
      title: 'Community',
      items: [
        {
          id: 'community-feed',
          label: 'Community Reports',
          icon: Users,
          isLast: false
        },
        {
          id: 'similar-scams',
          label: 'Similar Scams',
          icon: Layers,
          isLast: false,
          badge: 'Clusters'
        },
        {
          id: 'report-scam',
          label: 'Report a Scam',
          icon: PlusCircle,
          isLast: true
        }
      ]
    },
    {
      title: 'Intelligence',
      items: [
        {
          id: 'scam-intelligence',
          label: 'Scam Patterns',
          icon: BrainCircuit,
          isLast: false,
          matches: ['scam-intelligence', 'scam-patterns']
        },
        {
          id: 'emerging-scams',
          label: 'Emerging Scams',
          icon: Flame,
          isLast: true,
          badge: 'Surge',
          badgeColor: 'rose'
        }
      ]
    },
    {
      title: 'My Activity',
      items: [
        {
          id: 'my-history',
          label: 'My History',
          icon: History,
          isLast: false
        },
        {
          id: 'my-reports',
          label: 'My Reports',
          icon: FileText,
          isLast: true
        }
      ]
    }
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col justify-between h-screen sticky top-0 shrink-0">
      {/* Top Brand Header */}
      <div>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 text-left group focus:outline-none min-w-0"
            aria-label="RakshaPay dashboard"
          >
            <img
              src="/rakshapay-shield-transparent.png"
              alt="RakshaPay shield"
              className="w-10 h-11 object-contain shrink-0 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="min-w-0 leading-none">
              <img
                src="/rakshapay-wordmark-light.png"
                alt="RakshaPay"
                className="block dark:hidden w-[126px] h-auto object-contain object-left"
              />
              <img
                src="/rakshapay-wordmark-dark.png"
                alt="RakshaPay"
                className="hidden dark:block w-[126px] h-auto object-contain object-left"
              />
              <span className="block mt-1 text-[9px] font-medium tracking-wide text-slate-500 dark:text-slate-400 whitespace-nowrap">
                Safer Payments. Brighter India.
              </span>
            </div>
          </button>
          <button
            onClick={() => onNavigate('landing')}
            title="View Public Landing Page"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Tree-Structured Navigation */}
        <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-210px)] text-xs">
          {/* Dashboard (Top Root Item) */}
          <div className="space-y-1">
            <button
              id="sidebar-nav-dashboard"
              onClick={() => onNavigate('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
                currentView === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 font-semibold shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className={`w-4 h-4 ${currentView === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                <span className="text-sm font-semibold tracking-tight">Dashboard</span>
              </div>
            </button>
          </div>

          {/* Grouped Tree Nodes */}
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              {/* Group Title */}
              <div className="px-3 pt-1 pb-0.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <span>{group.title}</span>
              </div>

              {/* Child Branch Items with ├─ and └─ indicators */}
              <div className="space-y-0.5 relative pl-1">
                {group.items.map((item) => {
                  const active = isItemActive(item);
                  const Icon = item.icon;
                  const branchSymbol = item.isLast ? '└─' : '├─';

                  return (
                    <button
                      key={item.id}
                      id={`sidebar-nav-${item.id}`}
                      onClick={() => onNavigate(item.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left ${
                        active
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 font-semibold shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Tree Branch Symbol */}
                        <span className="font-mono text-[11px] text-slate-300 dark:text-slate-600 select-none shrink-0 w-4">
                          {branchSymbol}
                        </span>
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {/* Optional Badges */}
                      {item.badge && (
                        <span
                          className={`px-1.5 py-0.2 text-[9px] font-bold rounded shrink-0 ${
                            item.badgeColor === 'rose'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                              : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/80 dark:text-indigo-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Profile Item */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 space-y-1">
            <button
              id="sidebar-nav-profile"
              onClick={() => onNavigate('profile')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
                currentView === 'profile' || currentView === 'settings'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 font-semibold shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className={`w-4 h-4 ${currentView === 'profile' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                <span className="text-xs font-semibold">Profile</span>
              </div>
            </button>
          </div>
        </nav>
      </div>

      {/* Footer: User Profile & Log Out */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="flex items-center gap-2.5 px-1 py-0.5">
          <UserAvatar avatarUrl={currentUser.avatarUrl} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              {currentUser.name}
            </p>
            <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
          </div>
        </div>

        {/* Explicit Log Out button matching user requirement */}
        <button
          id="sidebar-logout-btn"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors border border-rose-200/60 dark:border-rose-900/40"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
