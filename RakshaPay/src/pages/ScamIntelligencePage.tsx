import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  AlertTriangle,
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  XCircle,
  HelpCircle, Dna, Network, TrendingUp, Users
} from 'lucide-react';
import { ActiveView } from '../types';
import { apiGet } from '../services/apiClient';
import { MOCK_SCAM_PATTERNS } from '../mock/mockData';

interface ScamIntelligencePageProps {
  onNavigate: (view: ActiveView) => void;
  initialTab?: 'all' | 'emerging';
}

export const ScamIntelligencePage: React.FC<ScamIntelligencePageProps> = ({ onNavigate, initialTab = 'all' }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'emerging'>(initialTab);
  const [emergingInsight, setEmergingInsight] = useState<any>(null);

  React.useEffect(() => {
    setActiveFilter(initialTab);
  }, [initialTab]);

  const displayedPatterns = activeFilter === 'emerging'
    ? MOCK_SCAM_PATTERNS.filter((p) => p.trend === 'Rising' || p.riskLevel === 'high')
    : MOCK_SCAM_PATTERNS;

  const [selectedPattern, setSelectedPattern] = useState(displayedPatterns[0] || MOCK_SCAM_PATTERNS[0]);

  React.useEffect(() => {
    if (displayedPatterns.length > 0 && !displayedPatterns.some(p => p.id === selectedPattern?.id)) {
      setSelectedPattern(displayedPatterns[0]);
    }
  }, [activeFilter]);

  React.useEffect(() => {
    apiGet<{ items: any[] }>('/api/intelligence/emerging').then((data) => setEmergingInsight(data.items?.[0] || null)).catch(() => setEmergingInsight(null));
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {activeFilter === 'emerging' ? 'Emerging Threat Alerts' : 'UPI Scam Tactics Encyclopedia'}
            </h1>
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
              activeFilter === 'emerging'
                ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-semibold'
                : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
            }`}>
              {activeFilter === 'emerging' ? 'High Surge / Rising Waves' : 'Threat Intelligence'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {activeFilter === 'emerging'
              ? 'Real-time telemetry on active zero-day impersonation scams and rising social engineering attacks across India.'
              : 'In-depth anatomy of the most prevalent digital payment deception vectors in India. Learn the red flags before encountering them.'}
          </p>
        </div>

        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
              activeFilter === 'all'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Patterns
          </button>
          <button
            onClick={() => setActiveFilter('emerging')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              activeFilter === 'emerging'
                ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Emerging Scams</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </button>
        </div>
      </div>

      {/* Innovation layer */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { icon: Dna, title: 'Scam DNA', text: 'Extracts tactics, channels, phrases and payment behavior into a reusable fingerprint.' },
          { icon: Network, title: 'Multi-Evidence Matching', text: 'Connects message, payment, call and identifier evidence to find stronger pattern matches.' },
          { icon: Users, title: 'Community Scam Intelligence', text: 'Turns community reports and confirmations into shared scam intelligence.' },
          { icon: TrendingUp, title: 'Emerging Scam Detection', text: 'Tracks rising combinations of tactics, channels and payment patterns.' },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-2 mb-2"><Icon className="w-4 h-4 text-indigo-500" /><h3 className="text-xs font-bold text-slate-900 dark:text-white">{title}</h3></div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      {emergingInsight && (
        <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /><span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">AI-Detected Emerging Scam Pattern</span></div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{emergingInsight.title}</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">{emergingInsight.description}</p>
          </div>
          <span className="shrink-0 px-3 py-1.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-mono font-bold">{emergingInsight.growth || 'Rising'}</span>
        </div>
      )}

      {/* Main Grid: Left Navigation / Right Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left List of Patterns */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-1 mb-2">
            {activeFilter === 'emerging' ? 'Rising Threats (Active Surge)' : 'Cataloged Threat Vectors'}
          </span>
          {displayedPatterns.map((p) => {
            const isSelected = selectedPattern?.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPattern(p)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-900 dark:text-indigo-300 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xs font-bold">{p.name}</h2>
                    {p.trend === 'Rising' && (
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 rounded font-bold">
                        Surging
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 line-clamp-1">
                    Risk: <span className="uppercase font-semibold text-rose-500">{p.riskLevel}</span>
                  </span>
                </div>
                <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
              </div>
            );
          })}
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Header of Selected Pattern */}
          <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold uppercase">
                {selectedPattern.riskLevel} Risk
              </span>
              <span className="text-xs font-mono text-slate-400">ID: {selectedPattern.id}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {selectedPattern.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedPattern.description}
            </p>
          </div>

          {/* Warning Signals */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Critical Warning Signals & Coercion Cues</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(selectedPattern.warningSigns || selectedPattern.commonSigns || selectedPattern.warningIndicators || []).map((sign: string, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span>{sign}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Real-World Case Scenario */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Anatomy of a Typical Attack Scenario
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
              "{selectedPattern.realWorldExample || selectedPattern.description}"
            </p>
          </div>

          {/* Prevention & Counter-Actions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Recommended Counter-Measures</span>
            </h3>
            <div className="space-y-2">
              {(selectedPattern.recommendedPrevention || [
                'Never enter UPI PIN to receive refunds or cash prizes',
                'Verify official customer support via verified branch website or app',
                'Immediately report suspicious numbers to National Cyber Crime portal (1930)'
              ]).map((prev: string, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{prev}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action trigger */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Encountered this pattern recently?
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => onNavigate('message-analyzer')}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Scan a Message
              </button>
              <button
                onClick={() => onNavigate('report-scam')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
              >
                Report an Incident
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
