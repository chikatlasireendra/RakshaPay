import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Users,
  ThumbsUp,
  MessageSquare,
  Share2,
  Lock,
  Phone,
  CreditCard,
  Calendar,
  Clock,
  Send,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  X,
  FileText,
  Volume2,
  Image as ImageIcon,
  Link as LinkIcon,
  Play,
  Pause,
  ArrowLeft
} from 'lucide-react';
import { CommunityReport, ReportComment } from '../../types';
import { communityService } from '../../services/communityService';

interface ReportDetailModalProps {
  report: CommunityReport | null;
  isOpen: boolean;
  onClose: () => void;
  matchConfidence?: number;
  onNavigateToFeed?: () => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  isOpen,
  onClose,
  matchConfidence,
  onNavigateToFeed
}) => {
  if (!isOpen || !report) return null;

  // Local state for interactive features
  const [currentReport, setCurrentReport] = useState<CommunityReport>(report);
  const [hasConfirmed, setHasConfirmed] = useState<boolean>(() => communityService.hasConfirmed(report.id));
  const [confirmationsCount, setConfirmationsCount] = useState<number>(
    report.upvotes || report.similarReportsCount || 12
  );
  const [comments, setComments] = useState<ReportComment[]>(() => {
    return report.comments && report.comments.length > 0 ? report.comments : [];
  });
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Sync state whenever report changes
  useEffect(() => {
    setCurrentReport(report);
    setConfirmationsCount(report.upvotes || report.similarReportsCount || 12);
    setComments(report.comments && report.comments.length > 0 ? report.comments : []);
    setHasConfirmed(communityService.hasConfirmed(report.id));
  }, [report]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (previewImage) {
          setPreviewImage(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, previewImage]);

  // Handle Community Confirmation
  const handleConfirmThreat = async () => {
    if (hasConfirmed || communityService.hasConfirmed(currentReport.id)) {
      setHasConfirmed(true);
      return;
    }
    const updated = await communityService.confirmReportAsync(currentReport.id);
    if (!updated) return;
    setHasConfirmed(true);
    setConfirmationsCount(updated.upvotes || confirmationsCount + 1);
    setCurrentReport(updated);
  };

  // Handle Adding a Comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const nameToUse = authorName.trim() || 'Citizen Sentinel';
    const addedComment = communityService.addComment(currentReport.id, {
      authorName: nameToUse,
      content: newCommentText.trim(),
      authorBadge: 'Verified Citizen'
    });

    if (addedComment) {
      setComments((prev) => [addedComment, ...prev]);
      setNewCommentText('');
    }
  };

  // Copy share link / report ticket
  const handleCopyShare = () => {
    const shareText = `[RakshaPay Alert] Verified Threat Report ${currentReport.ticketNumber}: ${currentReport.title} - Category: ${currentReport.category}. Check evidence and protect yourself.`;
    navigator.clipboard.writeText(shareText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const confidenceValue = matchConfidence || currentReport.similarityConfidence || 94;

  const reporterName = currentReport.reporter?.name || 'Citizen Sentinel';
  const reporterAvatar = currentReport.reporter?.avatar;
  const reporterBadge = currentReport.reporter?.badge || 'Verified Citizen';
  const reporterTrust = currentReport.reporter?.trustScore || 96;
  const reporterLocation = currentReport.reporter?.location || 'India';

  const formattedDate =
    currentReport.dateFormatted ||
    (currentReport.reportedAt
      ? new Date(currentReport.reportedAt).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })
      : 'September 18, 2026');

  const formattedTime =
    currentReport.timeFormatted ||
    (currentReport.reportedAt
      ? new Date(currentReport.reportedAt).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })
      : '06:45 PM IST');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-xs">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Modal Shell */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 14 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 max-w-4xl w-full max-h-[92vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
      >
        {/* Top Sticky Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Back to Analyzer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {currentReport.ticketNumber || `#${currentReport.id}`}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                  {currentReport.riskLevel} Risk Incident
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {currentReport.status === 'verified' ? 'Verified Threat' : 'Under Review'}
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Community Intelligence Registry • Incident Investigation
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyShare}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Share Threat'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-slate-900 dark:text-slate-100">
          
          {/* SIMILARITY & MATCH CONFIDENCE BANNER (Highlights connection to Analyzer) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
                  Analyzer Vector Correlation
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-600 text-white">
                  {confidenceValue}% Match Confidence
                </span>
              </div>
              <p className="text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed">
                This community report matches your analyzed text across coercive timing, impersonation vector, and URL distribution patterns.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
              <div className="w-28 sm:w-36 h-2 bg-indigo-200 dark:bg-indigo-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
                  style={{ width: `${confidenceValue}%` }}
                />
              </div>
              <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300">
                {confidenceValue}%
              </span>
            </div>
          </div>

          {/* REPORT TITLE & CATEGORY */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700">
                {currentReport.category}
              </span>
              <span className="text-xs text-slate-400">
                Report ID: <strong className="font-mono text-slate-700 dark:text-slate-300">{currentReport.id}</strong>
              </span>
              {currentReport.status === 'verified' && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  AI-screened community pattern
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug">
              {currentReport.title}
            </h1>
          </div>

          {/* REPORTER PROFILE, DATE & TIME BAR */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {reporterAvatar ? (
                <img
                  src={reporterAvatar}
                  alt={reporterName}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover border-2 border-indigo-500/30"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-600 flex items-center justify-center text-white font-bold text-sm">
                  {reporterName.charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {reporterName}
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {reporterBadge}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  <span>Trust Score: {reporterTrust}%</span>
                  <span>•</span>
                  <span>{reporterLocation}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{formattedTime}</span>
                <span className="text-[10px] text-slate-400">({currentReport.relativeTime})</span>
              </div>
            </div>
          </div>

          {/* INCIDENT DESCRIPTION */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Incident Narrative & Citizen Testimony
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                {currentReport.description}
              </p>
            </div>
          </div>

          {/* MASKED EVIDENCE SECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                <span>Masked Forensic Evidence</span>
              </h3>
              <span className="text-[11px] text-slate-400">
                PII Redacted in Compliance with DPDPA 2023
              </span>
            </div>

            {/* Quick Identifier Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentReport.maskedPhone && (
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 block">Sender / Caller Number</span>
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white truncate block">
                      {currentReport.maskedPhone}
                    </span>
                  </div>
                </div>
              )}

              {currentReport.maskedUpiId && (
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 block">Recipient UPI VPA</span>
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white truncate block">
                      {currentReport.maskedUpiId}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 block">Financial Impact</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {(currentReport.approximateAmountLost || currentReport.amountLost || 0) > 0
                      ? `₹${(currentReport.approximateAmountLost || currentReport.amountLost || 0).toLocaleString()} Lost`
                      : '₹0 (Threat Intercepted)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Evidence items gallery */}
            {currentReport.evidence && currentReport.evidence.length > 0 && (
              <div className="space-y-2.5 pt-1">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Attached Artefacts ({currentReport.evidence.length})
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentReport.evidence.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {ev.type === 'screenshot' && <ImageIcon className="w-4 h-4 text-indigo-500" />}
                          {ev.type === 'audio' && <Volume2 className="w-4 h-4 text-amber-500" />}
                          {ev.type === 'link' && <LinkIcon className="w-4 h-4 text-rose-500" />}
                          {ev.type === 'chat' && <MessageSquare className="w-4 h-4 text-cyan-500" />}
                          <span className="font-semibold text-slate-900 dark:text-white truncate">
                            {ev.name}
                          </span>
                        </div>
                        {ev.fileSize && <span className="text-[10px] text-slate-400">{ev.fileSize}</span>}
                      </div>

                      {ev.previewUrl && (
                        <div
                          onClick={() => setPreviewImage(ev.previewUrl || null)}
                          className="relative h-28 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 cursor-pointer group"
                        >
                          <img
                            src={ev.previewUrl}
                            alt={ev.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity">
                            Click to Enlarge
                          </div>
                        </div>
                      )}

                      {ev.transcript && (
                        <div className="p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40">
                          <div className="flex items-center justify-between text-[11px] text-amber-800 dark:text-amber-300 font-semibold mb-1">
                            <span>Audio Call Transcript</span>
                            <button
                              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                              className="flex items-center gap-1 hover:underline text-[10px]"
                            >
                              {isPlayingAudio ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                              <span>{isPlayingAudio ? 'Pause' : 'Simulate Audio'}</span>
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-700 dark:text-slate-300 italic">
                            "{ev.transcript}"
                          </p>
                        </div>
                      )}

                      {ev.maskedSnippet && (
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 font-mono text-[11px] text-slate-800 dark:text-slate-200 break-all">
                          {ev.maskedSnippet}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI ANALYSIS BREAKDOWN */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>RakshaPay Explainable AI Analysis</span>
            </h3>

            <div className="p-5 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/30 to-slate-50 dark:from-indigo-950/20 dark:to-slate-900 space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 uppercase tracking-wider">
                  Threat Evaluation Synthesis
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentReport.aiAnalysis?.summary ||
                    'Automated analysis detected multi-stage social engineering designed to induce panicked compliance using artificial deadlines and spoofed institutional authority.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Psychological Manipulation Triggers
                  </span>
                  <ul className="space-y-1 text-xs">
                    {(
                      currentReport.aiAnalysis?.psychologicalTriggers || [
                        'Artificial deadline urgency to induce panic',
                        'Threat of immediate financial suspension',
                        'Official banking verification guise'
                      ]
                    ).map((trigger, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                        <span className="text-rose-500 font-bold shrink-0">•</span>
                        <span>{trigger}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Technical Red Flags
                  </span>
                  <ul className="space-y-1 text-xs">
                    {(
                      currentReport.aiAnalysis?.technicalRedFlags || [
                        'Obfuscated URL shortener mask',
                        'Unregistered domain endpoint',
                        'Inversion of payment direction'
                      ]
                    ).map((flag, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                        <span className="text-amber-500 font-bold shrink-0">•</span>
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actionable Safety Recommendation */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Protective Defense Directive
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {currentReport.aiAnalysis?.recommendation ||
                      'Never disclose passwords, UPI PINs, or OTPs. Official entities will never mandate urgent fund transfers or app downloads via SMS.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RISK INDICATORS MATRIX */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Risk Indicators & Threat Flags
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(
                currentReport.riskIndicators || [
                  {
                    id: 'ind-1',
                    label: 'Coercive Immediate Cutoff',
                    severity: 'high',
                    detail: 'Imposes short deadline window to force panicked actions.'
                  },
                  {
                    id: 'ind-2',
                    label: 'Impersonated Authority',
                    severity: 'high',
                    detail: 'Mimics official nodal officer credentials without validation.'
                  },
                  {
                    id: 'ind-3',
                    label: 'Credential Theft Vector',
                    severity: 'high',
                    detail: 'Directs victim into unauthorized form fields.'
                  }
                ]
              ).map((ind) => (
                <div
                  key={ind.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {ind.label}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        ind.severity === 'high'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          : ind.severity === 'medium'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {ind.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {ind.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* COMMUNITY CONFIRMATIONS CARD */}
          <div className="p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/70 dark:border-indigo-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Community Threat Confirmations
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <strong className="text-indigo-700 dark:text-indigo-300 font-semibold font-mono">
                  {confirmationsCount} Citizens
                </strong>{' '}
                have independently confirmed receiving this identical scam vector across India.
              </p>
            </div>

            <button
              onClick={handleConfirmThreat}
              disabled={hasConfirmed}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all shrink-0 ${
                hasConfirmed
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{hasConfirmed ? 'Threat Confirmed (+1)' : 'I Also Received This Scam (+1)'}</span>
            </button>
          </div>

          {/* DISCUSSION & COMMUNITY COMMENTS */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                <span>Discussion & Citizen Warnings ({comments.length})</span>
              </h3>
              <span className="text-[11px] text-slate-400">
                Live threat crowd-sourcing
              </span>
            </div>

            {/* Comment submission form */}
            <form onSubmit={handleAddComment} className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Your Name / Call-sign (Optional)"
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <div className="sm:col-span-2 relative">
                  <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Share helpful context, sender numbers, or warning advice..."
                    className="w-full px-3 py-2 pr-20 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!newCommentText.trim()}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>Post</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Comments Thread */}
            <div className="space-y-3 pt-1 max-h-72 overflow-y-auto pr-1">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {c.authorAvatar ? (
                        <img
                          src={c.authorAvatar}
                          alt={c.authorName}
                          referrerPolicy="no-referrer"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                          {c.authorName.charAt(0)}
                        </div>
                      )}
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {c.authorName}
                      </span>
                      {c.authorBadge && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {c.authorBadge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {c.relativeTime}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
                    {c.content}
                  </p>
                </div>
              ))}

              {comments.length === 0 && (
                <div className="p-6 text-center rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                  No comments yet. Be the first to share your warning or confirm this threat.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xs flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Public Threat Registry Verification Standard</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {onNavigateToFeed && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToFeed();
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 transition-colors flex items-center gap-1.5"
              >
                <span>View Full Community Feed</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
            >
              Back to Analyzer
            </button>
          </div>
        </div>
      </motion.div>

      {/* Enlarged Image Preview Overlay */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          >
            <img
              src={previewImage}
              alt="Evidence Artefact"
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/30"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
