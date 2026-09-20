import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquareWarning,
  CreditCard,
  PhoneCall,
  Sparkles,
  AlertTriangle,
  KeyRound,
  Landmark,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Copy,
  Users,
  AlertOctagon,
  FileCheck2,
  DollarSign,
  Eye,
  Lock,
  Calendar,
  Clock,
  ThumbsUp
} from 'lucide-react';
import { ActiveView, RiskAnalysisResult, CommunityReport } from '../types';
import { scamAnalysisService } from '../services/scamAnalysisService';
import { authService } from '../services/authService';
import { userDataService } from '../services/userDataService';
import { communityService } from '../services/communityService';
import { SAMPLE_SCENARIOS } from '../mock/mockData';
import { RiskBadge } from '../components/common/RiskBadge';
import { InnovationInsights } from '../components/common/InnovationInsights';
import { ReportDetailModal } from '../components/community/ReportDetailModal';

interface MessageAnalyzerProps {
  onNavigate: (view: ActiveView) => void;
  initialText?: string;
}

export const MessageAnalyzer: React.FC<MessageAnalyzerProps> = ({ onNavigate, initialText }) => {
  const [inputText, setInputText] = useState(initialText || SAMPLE_SCENARIOS.kycScam);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<RiskAnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedReport, setSelectedReport] = useState<CommunityReport | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = textToAnalyze !== undefined ? textToAnalyze : inputText;
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setResult(null);
    setErrorMessage(null);

    try {
      const res = await scamAnalysisService.analyzeMessage(text);
      setResult(res);

      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        userDataService.addHistoryItem(currentUser.id, {
          type: 'Message',
          query: text.slice(0, 80),
          title: text.slice(0, 48) + (text.length > 48 ? '...' : ''),
          riskLevel: res.riskLevel,
          riskScore: res.riskScore,
          category: res.scamCategory || 'Suspicious Message',
          actionTaken: res.riskLevel === 'high' ? 'Blocked & Reported' : 'Verified by User',
        });
        await authService.updateProfile({
          analysesCount: (currentUser.analysesCount || 0) + 1,
          confirmedThreatsCount:
            res.riskLevel === 'high'
              ? (currentUser.confirmedThreatsCount || 0) + 1
              : currentUser.confirmedThreatsCount,
        }).catch(() => { /* analysis result must remain visible even if profile sync fails */ });
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to analyze this message.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleInspectMatchingReport = (reportOrId?: CommunityReport | string) => {
    let reportToOpen: CommunityReport | undefined;
    if (typeof reportOrId === 'object' && reportOrId !== null) {
      reportToOpen = reportOrId;
    } else if (typeof reportOrId === 'string') {
      reportToOpen = communityService.getReportById(reportOrId);
    }

    if (!reportToOpen) {
      reportToOpen = communityService.getMatchingReportForAnalysis(result?.scamCategory, inputText);
    }

    setSelectedReport(reportToOpen || null);
    setIsReportModalOpen(true);
  };

  // Get matching report for live preview
  const matchingReport = communityService.getMatchingReportForAnalysis(result?.scamCategory, inputText);

  const handleCopyGuidance = () => {
    if (!result) return;
    const text = `RakshaPay Safety Advisory: Risk Score ${result.riskScore}/100 (${result.riskLevel.toUpperCase()}). Recommendation: Do NOT click external links, never share your UPI PIN or OTP.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getReasonIcon = (iconName: string) => {
    switch (iconName) {
      case 'AlertTriangle': return AlertTriangle;
      case 'KeyRound': return KeyRound;
      case 'Landmark': return Landmark;
      case 'ExternalLink': return ExternalLink;
      case 'DollarSign': return DollarSign;
      case 'CreditCard': return CreditCard;
      default: return AlertOctagon;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      {/* 1. Header & Quick Vector Switcher Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              AI Scam Message Analyzer
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Inspect suspicious SMS, WhatsApp forwards, or emails for social engineering cues before responding.
            </p>
          </div>

          {/* Quick Vector Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => {}}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs flex items-center gap-1.5"
            >
              <MessageSquareWarning className="w-3.5 h-3.5" />
              <span>Message</span>
            </button>
            <button
              onClick={() => onNavigate('payment-analyzer')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Payment</span>
            </button>
            <button
              onClick={() => onNavigate('call-analyzer')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Text Input Area + Scenario Quick Fillers */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Message Content
          </label>
          <textarea
            id="message-analyzer-textarea"
            rows={5}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste suspicious SMS, WhatsApp message, email or other text here..."
            className="w-full p-3.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed"
          />
        </div>

        {/* Example scenario presets (Mandatory from section 14) */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Or test a real-world scam template:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setInputText(SAMPLE_SCENARIOS.kycScam);
                handleAnalyze(SAMPLE_SCENARIOS.kycScam);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              🏦 KYC Scam Example
            </button>
            <button
              onClick={() => {
                setInputText(SAMPLE_SCENARIOS.fakeRefund);
                handleAnalyze(SAMPLE_SCENARIOS.fakeRefund);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              💸 Fake Refund Example
            </button>
            <button
              onClick={() => {
                setInputText(SAMPLE_SCENARIOS.bankImpersonation);
                handleAnalyze(SAMPLE_SCENARIOS.bankImpersonation);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              🚨 Bank Impersonation
            </button>
            <button
              onClick={() => {
                setInputText(SAMPLE_SCENARIOS.normalMessage);
                handleAnalyze(SAMPLE_SCENARIOS.normalMessage);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              🟢 Normal Message Example
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {inputText.length} characters analyzed
          </span>
          <button
            id="message-analyzer-submit-btn"
            onClick={() => handleAnalyze()}
            disabled={isAnalyzing || !inputText.trim()}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Analyzing Patterns...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze with RakshaPay</span>
              </>
            )}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-sm text-rose-700 dark:text-rose-300">
          {errorMessage}
        </div>
      )}

      {/* 3. AI Scanning Animation Indicator */}
      {isAnalyzing && (
        <div className="p-8 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 text-center space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Deconstructing Message Vectors...
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluating urgency markers, domain reputation, and matching against 94 community threat clusters.
            </p>
          </div>
          <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto overflow-hidden">
            <div className="w-full h-full bg-indigo-600 animate-[shimmer_1.5s_infinite] -translate-x-full" />
          </div>
        </div>
      )}

      <InnovationInsights scamDna={(result as any)?.scamDna} multiEvidenceMatch={(result as any)?.multiEvidenceMatch} />

      {/* 4. EXPLAINABLE AI RESULT (Sections 15, 16, 17, 24) */}
      <AnimatePresence>
        {result && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-6"
          >
            {/* Risk Score & Category Banner */}
            <div
              className={`p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                result.riskLevel === 'high'
                  ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60'
                  : result.riskLevel === 'caution'
                  ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60'
                  : 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <RiskBadge level={result.riskLevel} size="lg" />
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    Confidence: {result.confidence}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Possible Scam Type: {result.scamCategory}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                  {result.categoryDescription}
                </p>
              </div>

              {/* Big Score Gauge */}
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0 min-w-[140px]">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Risk Score
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span
                    className={`text-4xl font-extrabold font-mono ${
                      result.riskLevel === 'high'
                        ? 'text-rose-600 dark:text-rose-400'
                        : result.riskLevel === 'caution'
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {result.riskScore}
                  </span>
                  <span className="text-xs font-mono text-slate-400">/100</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5">RakshaPay Index</span>
              </div>
            </div>

            {/* Section 15: Why was this flagged? Animated Evidence Cards */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                    Why was this flagged?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Explainable AI evidence signals extracted directly from the submission
                  </p>
                </div>
                <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                  {result.reasons.length} Evidence Signals
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {result.reasons.map((reason) => {
                  const Icon = getReasonIcon(reason.iconName);
                  return (
                    <div
                      key={reason.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {reason.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-semibold uppercase">
                          {reason.severity}
                        </span>
                      </div>

                      <div className="text-xs font-mono bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 italic">
                        "{reason.snippet}"
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {reason.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 16 & 17: Common Characteristics + Recommended Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Common Characteristics */}
              <div className="lg:col-span-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                  Common Attack Characteristics
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Known behavioral tactics mapped to this scam pattern:
                </p>
                <ul className="space-y-2 pt-1">
                  {result.commonCharacteristics.map((char, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                      <span>{char}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: Section 17 Recommended Action Safety Card */}
              <div className="lg:col-span-6 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-rose-900 dark:text-rose-300 uppercase tracking-tight flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>What should you do?</span>
                  </h3>
                  <button
                    onClick={handleCopyGuidance}
                    className="text-xs font-semibold text-rose-700 dark:text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied' : 'Share Advice'}</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {result.recommendedActions.map((act, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-900/60 space-y-0.5"
                    >
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span>{act.title}</span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 pl-3">
                        {act.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleInspectMatchingReport(matchingReport)}
                    className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Inspect Correlated Community Case</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Section 24: "HAVE OTHERS SEEN THIS?" Similar Community Reports */}
            <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-slate-900 p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Have others seen this?
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <strong className="text-indigo-700 dark:text-indigo-300 font-semibold">
                      {result.similarCommunityReportsCount} community reports
                    </strong>{' '}
                    show identical coercion phrases and vector signatures.
                  </p>
                </div>

                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800 self-start sm:self-auto">
                  MATCH CONFIDENCE 94%
                </span>
              </div>

              {/* MATCHING REPORT HIGHLIGHT CARD */}
              <div
                onClick={() => handleInspectMatchingReport(matchingReport)}
                className="group relative p-4 sm:p-5 rounded-xl border border-indigo-200/90 dark:border-indigo-800/80 bg-white dark:bg-slate-950 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                      {matchingReport.ticketNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {matchingReport.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                      High Risk Incident
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{matchingReport.relativeTime || '2 hours ago'}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {matchingReport.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {matchingReport.description}
                  </p>
                </div>

                {/* Reporter snippet & Community Confirmations */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    {matchingReport.reporter?.avatar ? (
                      <img
                        src={matchingReport.reporter.avatar}
                        alt={matchingReport.reporter.name}
                        referrerPolicy="no-referrer"
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-[10px] font-bold text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
                        {(matchingReport.reporter?.name || 'C').charAt(0)}
                      </div>
                    )}
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Reported by {matchingReport.reporter?.name || 'Citizen Sentinel'}
                    </span>
                    <span className="text-[10px] text-slate-400 hidden sm:inline">
                      ({matchingReport.reporter?.location || 'Mumbai'})
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 text-xs">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{matchingReport.upvotes || matchingReport.similarReportsCount || 23} Confirmations</span>
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:underline flex items-center gap-1 text-xs">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Details & Evidence</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Pattern breakdown bars */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Pattern Signature Frequency:
                </span>
                <div className="space-y-2.5">
                  {result.patternBreakdown.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                        <span className="font-mono text-slate-500">{item.matchPercentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-500"
                          style={{ width: `${item.matchPercentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-indigo-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-500">
                  * Reports are anonymized and reviewed by community moderators.
                </span>
                <button
                  onClick={() => handleInspectMatchingReport(matchingReport)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Inspect Matching Community Report {matchingReport.ticketNumber}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MATCHING REPORT DETAIL MODAL */}
      <ReportDetailModal
        isOpen={isReportModalOpen}
        report={selectedReport}
        onClose={() => setIsReportModalOpen(false)}
        matchConfidence={94}
        onNavigateToFeed={() => onNavigate('community-feed')}
      />
    </div>
  );
};
