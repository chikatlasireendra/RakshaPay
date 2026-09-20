import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  MessageSquareWarning,
  CreditCard,
  PhoneCall,
  PlusCircle,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';
import { ActiveView } from '../types';
import { authService } from '../services/authService';
import { userDataService } from '../services/userDataService';
import { RiskBadge } from '../components/common/RiskBadge';

interface UserDashboardHomeProps {
  onNavigate: (view: ActiveView) => void;
}

export const UserDashboardHome: React.FC<UserDashboardHomeProps> = ({ onNavigate }) => {
  const user = authService.getCurrentUser();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const recentAnalyses = userDataService.getUserHistory(user.id, user.email);
  const userStats = userDataService.getUserStats(user);
  const hour = now.getHours();
  const greeting = hour < 5 ? 'Good night' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : hour < 21 ? 'Good evening' : 'Good night';
  const displayName = (user.name || '').trim() && !user.name.includes('@')
    ? user.name.split(' ')[0]
    : (user.email || 'there').split('@')[0].split(/[._-]/)[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {greeting}, {displayName}
            </h1>
            <span className="p-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Stay one step ahead of scams with real-time UPI threat intelligence.
          </p>
        </div>


      </div>

      {/* 2. Four Primary Analysis Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Analyze Message */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => onNavigate('message-analyzer')}
          className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-600 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <MessageSquareWarning className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              Analyze Message
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Paste suspicious SMS, WhatsApp message, email or text to detect coercion, links, and fake KYC triggers.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <span>Analyze text</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </motion.div>

        {/* Card 2: Analyze Payment */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => onNavigate('payment-analyzer')}
          className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs hover:border-amber-400 dark:hover:border-amber-600 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              Analyze Payment
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Check payment amount anomalies, recipient handle history, and collect request inversion traps before you tap PIN.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span>Check transaction</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </motion.div>

        {/* Card 3: Analyze Call */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => onNavigate('call-analyzer')}
          className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs hover:border-cyan-400 dark:hover:border-cyan-600 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              Analyze Call
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Upload an audio recording to transcribe speech, flag AnyDesk or OTP requests, and visualize an interactive risk timeline.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-semibold text-cyan-600 dark:text-cyan-400">
            <span>Scan audio</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </motion.div>

        {/* Card 4: Report a Scam */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => onNavigate('report-scam')}
          className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs hover:border-emerald-400 dark:hover:border-emerald-600 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <PlusCircle className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              Report a Scam
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Share your experience and evidence with the community. Automatic PII masking keeps your phone and account private.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span>Submit report</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </motion.div>
      </div>

      {/* 3. Middle Grid: Quick Risk Overview Widget + Trending Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Risk Overview */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase">
              Your Recent Analysis Breakdown
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">Last 30 Days</span>
          </div>

          {/* Three Risk Stats with Circular Indicators */}
          <div className="grid grid-cols-3 gap-3">
            {/* Low Risk */}
            <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-center flex flex-col items-center">
              <div className="relative w-12 h-12 flex items-center justify-center mb-1">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-emerald-100 dark:text-emerald-950/60"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500"
                    strokeDasharray={userStats.riskBreakdown.lowRisk > 0 ? "60, 100" : "0, 100"}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute font-bold text-sm text-emerald-800 dark:text-emerald-300">
                  {userStats.riskBreakdown.lowRisk}
                </span>
              </div>
              <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">Low Risk</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Verified Safe</span>
            </div>

            {/* Caution */}
            <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-center flex flex-col items-center">
              <div className="relative w-12 h-12 flex items-center justify-center mb-1">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-amber-100 dark:text-amber-950/60"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-amber-500"
                    strokeDasharray={userStats.riskBreakdown.caution > 0 ? "25, 100" : "0, 100"}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute font-bold text-sm text-amber-800 dark:text-amber-300">
                  {userStats.riskBreakdown.caution}
                </span>
              </div>
              <span className="text-xs font-semibold text-amber-900 dark:text-amber-300">Caution</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400">Review Advised</span>
            </div>

            {/* High Risk */}
            <div className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800/40 text-center flex flex-col items-center">
              <div className="relative w-12 h-12 flex items-center justify-center mb-1">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-rose-100 dark:text-rose-950/60"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-rose-500"
                    strokeDasharray={userStats.riskBreakdown.highRisk > 0 ? "18, 100" : "0, 100"}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute font-bold text-sm text-rose-800 dark:text-rose-300">
                  {userStats.riskBreakdown.highRisk}
                </span>
              </div>
              <span className="text-xs font-semibold text-rose-900 dark:text-rose-300">High Risk</span>
              <span className="text-[10px] text-rose-600 dark:text-rose-400">Blocked Scams</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Protected Value Avoided:
              </span>
            </div>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              ₹{userStats.riskBreakdown.protectedValueAvoided.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Trending Threat Intelligence Banner */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-rose-500" />
                <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase">
                  Active Regional Surge Alert
                </h2>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                CRITICAL SURGE
              </span>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-rose-50/70 to-slate-50 dark:from-rose-950/30 dark:to-slate-900 border border-rose-200/80 dark:border-rose-900/60 space-y-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>Mahavitaran 9:30 PM Power Cut SMS Wave</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Over 112 community reports received in the last 24 hours. Fraudsters send bulk SMS claiming unpaid electricity bills will lead to a 9:30 PM blackout, asking victims to call a personal mobile number.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <span>📍 Affected: Maharashtra, Gujarat, Delhi NCR</span>
                <span>⚠️ Target: UPI Direct Transfer</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">23 similar patterns mapped</span>
            <button
              onClick={() => onNavigate('scam-intelligence')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Inspect pattern breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Recent Analysis Feed */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase">
              Recent Threat Analyses
            </h2>
          </div>
          {recentAnalyses.length > 0 && (
            <button
              onClick={() => onNavigate('my-history')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View Full History
            </button>
          )}
        </div>

        {recentAnalyses.length === 0 ? (
          <div className="py-12 px-4 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                No threat analyses yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You haven't run any scam checks yet. Analyze any suspicious message, payment QR, or call to establish your security record.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                onClick={() => onNavigate('message-analyzer')}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
              >
                Analyze Message
              </button>
              <button
                onClick={() => onNavigate('payment-analyzer')}
                className="px-3.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
              >
                Check Payment
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-medium">
                  <th className="pb-3 pl-2">Subject / Query</th>
                  <th className="pb-3">Vector</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Risk Assessment</th>
                  <th className="pb-3">Time</th>
                  <th className="pb-3 pr-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {recentAnalyses.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 pl-2 font-medium text-slate-900 dark:text-white">
                      {item.title || item.query}
                    </td>
                    <td className="py-3.5 text-slate-500 font-mono text-[11px]">{item.type}</td>
                    <td className="py-3.5 text-slate-600 dark:text-slate-300">{item.category}</td>
                    <td className="py-3.5">
                      <RiskBadge level={item.riskLevel} score={item.riskScore} size="sm" />
                    </td>
                    <td className="py-3.5 text-slate-400 text-[11px]">{item.date}</td>
                    <td className="py-3.5 pr-2 text-right">
                      <button
                        onClick={() => onNavigate(item.type === 'Payment' ? 'payment-analyzer' : item.type === 'Call' ? 'call-analyzer' : 'message-analyzer')}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold text-[11px]"
                      >
                        Re-examine
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

