import React from 'react';
import { motion } from 'motion/react';
import {
  Clock,
  MessageSquareWarning,
  CreditCard,
  PhoneCall,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Search,
  Filter,
  FileText
} from 'lucide-react';
import { ActiveView } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { authService } from '../services/authService';
import { userDataService } from '../services/userDataService';

interface MyHistoryPageProps {
  onNavigate: (view: ActiveView) => void;
  initialTab?: 'history' | 'reports';
}

export const MyHistoryPage: React.FC<MyHistoryPageProps> = ({ onNavigate, initialTab = 'history' }) => {
  const [activeTab, setActiveTab] = React.useState<'history' | 'reports'>(initialTab);
  const user = authService.getCurrentUser();
  const historyItems = userDataService.getUserHistory(user.id, user.email);
  const userReports = userDataService.getUserReports(user.id, user.email);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {activeTab === 'history' ? 'Analysis & Scan History' : 'My Community Reports'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {activeTab === 'history'
              ? 'Review past messages, payment requests, and call recordings scanned by RakshaPay.'
              : 'Track the verification status, community upvotes, and moderation actions on your submitted scam reports.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
                activeTab === 'history'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Scan History
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'reports'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>My Reports</span>
              <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-mono flex items-center justify-center">
                {userReports.length}
              </span>
            </button>
          </div>

          <button
            onClick={() => onNavigate(activeTab === 'history' ? 'message-analyzer' : 'report-scam')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
          >
            {activeTab === 'history' ? 'New Analysis' : 'Submit Report'}
          </button>
        </div>
      </div>

      {/* TAB 1: Scan History */}
      {activeTab === 'history' && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
          {historyItems.length === 0 ? (
            <div className="py-16 px-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  No scan history yet
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  You haven't run any scam checks yet. Analyze any suspicious message, payment QR, or call to establish your security record.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => onNavigate('message-analyzer')}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
                >
                  Analyze Message
                </button>
                <button
                  onClick={() => onNavigate('payment-analyzer')}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
                >
                  Analyze Payment
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-medium">
                    <th className="pb-3 pl-2">ID & Date</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Input Context / Subject</th>
                    <th className="pb-3">Detected Category</th>
                    <th className="pb-3">Risk Assessment</th>
                    <th className="pb-3 pr-2 text-right">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {historyItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 pl-2">
                        <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold block">
                          {item.id}
                        </span>
                        <span className="text-[11px] text-slate-400">{item.date}</span>
                      </td>
                      <td className="py-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                        {item.type}
                      </td>
                      <td className="py-3.5 max-w-xs pr-4 text-slate-800 dark:text-slate-200 truncate">
                        {item.query}
                      </td>
                      <td className="py-3.5 text-slate-700 dark:text-slate-300 font-medium">
                        {item.category}
                      </td>
                      <td className="py-3.5">
                        <RiskBadge level={item.riskLevel} score={item.riskScore} size="sm" />
                      </td>
                      <td className="py-3.5 pr-2 text-right text-slate-500 text-[11px]">
                        {item.actionTaken}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: My Community Reports */}
      {activeTab === 'reports' && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
          {userReports.length === 0 ? (
            <div className="py-16 px-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  No community reports yet
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  You haven't submitted any scam reports yet. If you encounter a suspicious message or payment request, submit it to protect other users.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('report-scam')}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
                >
                  Submit Your First Report
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-medium">
                    <th className="pb-3 pl-2">Report ID & Date</th>
                    <th className="pb-3">Title & Category</th>
                    <th className="pb-3">Masked Target</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Upvotes</th>
                    <th className="pb-3 pr-2 text-right">Moderator Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {userReports.map((report, idx) => (
                    <tr key={report.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 pl-2">
                        <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold block">
                          {report.ticketNumber || `#104${idx + 1}`}
                        </span>
                        <span className="text-[11px] text-slate-400">{report.relativeTime || 'Recent'}</span>
                      </td>
                      <td className="py-3.5 max-w-xs pr-4">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">{report.title}</p>
                        <span className="text-[11px] text-slate-400">{report.category}</span>
                      </td>
                      <td className="py-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                        {report.maskedUpiId || report.maskedPhone || 'Masked Details'}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            report.status === 'verified'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : report.status === 'rejected'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          <span className="capitalize">{report.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                        +{report.upvotes || 0}
                      </td>
                      <td className="py-3.5 pr-2 text-right text-slate-500 text-[11px]">
                        {report.status === 'verified'
                          ? 'Approved & broadcasted publicly'
                          : report.status === 'rejected'
                          ? 'Rejected (insufficient evidence)'
                          : 'Under AI & moderator triage'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

