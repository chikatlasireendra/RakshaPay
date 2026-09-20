import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  PhoneCall,
  MessageSquareWarning,
  Users,
  Zap,
  Landmark,
  QrCode,
  KeyRound,
  Briefcase,
  TrendingUp,
  Headphones,
  MessageSquare,
  Clock,
  ExternalLink,
  ChevronRight,
  ThumbsUp,
  Lock,
  FileText
} from 'lucide-react';
import { ActiveView, CommunityReport } from '../types';
import { communityService } from '../services/communityService';
import { RiskBadge } from '../components/common/RiskBadge';

interface LandingPageProps {
  onNavigate: (view: ActiveView) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [selectedReportModal, setSelectedReportModal] = useState<CommunityReport | null>(null);

  // Community reports for section 6
  const communityReports = communityService.getAllReports().slice(0, 3);

  // How It Works 5-step pipeline as requested: Detect → Analyze → Compare → Learn → Protect
  const howItWorksSteps = [
    {
      step: '01',
      title: 'Detect',
      label: 'Detection',
      desc: 'Ingest suspicious SMS messages, WhatsApp alerts, UPI collect requests, or caller audio recordings.',
      icon: Search,
      color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800/60'
    },
    {
      step: '02',
      title: 'Analyze',
      label: 'Analysis',
      desc: 'Deconstruct psychological urgency triggers, inverted payment requests, fake refund handles, and phishing URLs.',
      icon: AlertTriangle,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60'
    },
    {
      step: '03',
      title: 'Compare',
      label: 'Cross-Match',
      desc: 'Compare incoming patterns against 94+ verified recurring fraud vector clusters in the RakshaPay database.',
      icon: Zap,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60'
    },
    {
      step: '04',
      title: 'Learn',
      label: 'Explainability',
      desc: 'Review clear evidence cards explaining the exact manipulation tactics without confusing technical jargon.',
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/60'
    },
    {
      step: '05',
      title: 'Protect',
      label: 'Actionable Safety',
      desc: 'Receive decisive safety instructions to decline transactions, block scam numbers, or contact official helplines.',
      icon: ShieldCheck,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60'
    }
  ];

  // Analysis Modules
  const analysisModules = [
    {
      id: 'message-analyzer',
      title: 'Message Analysis',
      subtitle: 'SMS, WhatsApp & Phishing URLs',
      desc: 'Analyze suspicious text messages, KYC expiry warnings, fake delivery updates, and malicious APK installation links with instant explainable risk scoring.',
      icon: MessageSquareWarning,
      tag: 'Phishing & SMS Triage',
      color: 'from-blue-600 to-indigo-700',
      badgeBg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      features: ['Automatic PII redaction', 'Urgency & coercion flags', 'Known phishing link comparison']
    },
    {
      id: 'payment-analyzer',
      title: 'Payment Analysis',
      subtitle: 'UPI Requests, VPAs & QR Fraud',
      desc: 'Verify recipient UPI handles and detect "Collect Request" traps where fraudsters invert transactions under the pretext of sending refunds or cashbacks.',
      icon: CreditCard,
      tag: 'UPI & Transaction Risk',
      color: 'from-amber-600 to-rose-600',
      badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      features: ['Collect request trap detection', 'Receiver QR vs Sender QR warning', 'High-value anomaly alerting']
    },
    {
      id: 'call-analyzer',
      title: 'Call Analysis',
      subtitle: 'Audio Recordings & Impersonation',
      desc: 'Inspect recorded phone calls or transcripts. Identify fake police, customs officers, bank managers, and AnyDesk screen-sharing deception.',
      icon: PhoneCall,
      tag: 'Voice & Social Engineering',
      color: 'from-emerald-600 to-teal-700',
      badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      features: ['Audio transcript timeline', 'Remote access (AnyDesk) flags', 'Coercion & arrest threats']
    }
  ];

  // Common Scam Patterns
  const scamPatterns = [
    {
      name: 'KYC Scams',
      category: 'KYC Impersonation',
      icon: Landmark,
      desc: 'Urgent notices claiming your bank or wallet KYC has expired and your account will be suspended within hours.',
      warningSigns: [
        'Threat to freeze account by 9:00 PM',
        'Directs to unverified bit.ly or APK download',
        'Asks for Aadhaar, PAN, and UPI PIN'
      ]
    },
    {
      name: 'Fake Refund Scams',
      category: 'Fake Refund',
      icon: CreditCard,
      desc: 'E-commerce or food delivery pretexts where scammers ask for a "processing fee" or send a collect request to issue refunds.',
      warningSigns: [
        'Collect request labelled as "Refund"',
        'Instructs you to enter PIN to "receive"',
        'Demands small advance fee (₹10 - ₹999)'
      ]
    },
    {
      name: 'OTP Scams',
      category: 'OTP Theft',
      icon: KeyRound,
      desc: 'Callers claiming they mistyped your mobile number for a delivery or bank transfer, pleading for the SMS OTP just delivered.',
      warningSigns: [
        'Emotional urgency and apologetic tone',
        'SMS explicitly says "Password Reset OTP"',
        'Caller asks you to read 6 digits'
      ]
    },
    {
      name: 'QR Scams',
      category: 'QR Code Trap',
      icon: QrCode,
      desc: 'Marketplace buyers sending a QR code with the false promise that scanning it deposits money into your bank account.',
      warningSigns: [
        '"Scan QR code to receive payment"',
        'Pretending to be military/army personnel',
        'Entering UPI PIN always deducts money'
      ]
    },
    {
      name: 'Customer Support Scams',
      category: 'Support Impersonation',
      icon: Headphones,
      desc: 'Manipulated Google Search numbers or map listings for airline refunds, courier helplines, and bank customer care.',
      warningSigns: [
        'Personal 10-digit number on Google search',
        'Agent demands ₹10 registration fee',
        'Instructs you to download third-party app'
      ]
    },
    {
      name: 'Investment Scams',
      category: 'Crypto & Forex Fraud',
      icon: TrendingUp,
      desc: 'Telegram groups and fake trading portals promising guaranteed 30% daily returns with manipulated simulated balances.',
      warningSigns: [
        'Guaranteed daily profit promises',
        'Initial small withdrawals permitted',
        'Extortionate "tax deposit" to withdraw funds'
      ]
    },
    {
      name: 'Job Scams',
      category: 'Prepaid Task Fraud',
      icon: Briefcase,
      desc: 'Offers of high hourly pay for liking YouTube videos or rating hotels, escalating into costly "VIP Prepaid Merchant Tasks".',
      warningSigns: [
        '₹3,000/day for trivial clicking tasks',
        'Communication restricted to Telegram',
        'Requires upfront deposit to unlock earnings'
      ]
    }
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* 1. HERO SECTION (Clean, premium cybersecurity & fintech layout without 3D animation) */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-slate-50 via-white to-slate-50/60 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Community Threat Network Active • Zero Credential Storage</span>
              </div>

              {/* Exact Requested Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                Detect. Explain. <br />
                <span className="bg-gradient-to-r from-indigo-600 via-cyan-600 to-teal-500 bg-clip-text text-transparent">
                  Learn. Protect.
                </span>
              </h1>

              {/* Exact Requested Supporting Text */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                RakshaPay helps you analyze suspicious messages, payments and call recordings while learning from scam experiences reported by the community.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  id="hero-analyze-scam-btn"
                  onClick={() => onNavigate('message-analyzer')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Analyze a Scam</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  id="hero-explore-intel-btn"
                  onClick={() => onNavigate('scam-intelligence')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-base transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>Explore Scam Intelligence</span>
                </button>
              </div>

              {/* Security Pillars */}
              <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs font-medium text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Explainable AI Risk Breakdown</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Audio & Transcript Timeline</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Automatic PII Redaction</span>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Visual: Premium Cybersecurity Live Threat Card (Clean, no 3D) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-5"
            >
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
                {/* Card Header Bar */}
                <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-xs font-mono font-semibold tracking-wide text-slate-200">
                      LIVE THREAT INTERCEPT
                    </span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/60 font-semibold">
                    HIGH RISK • 96%
                  </span>
                </div>

                {/* Inspect Content Preview */}
                <div className="p-5 space-y-4 text-xs">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                      Intercepted Message Sample
                    </span>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-slate-800 dark:text-slate-200 text-[11px] leading-relaxed">
                      "Dear SBI Customer, your YONO NetBanking will be blocked tonight at 9:30 PM. Click{' '}
                      <span className="text-rose-500 dark:text-rose-400 underline font-bold">
                        http://bit.ly/sbi-kyc-verify
                      </span>{' '}
                      to update PAN card immediately."
                    </div>
                  </div>

                  {/* Explainable Evidence Badges */}
                  <div className="space-y-2">
                    <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">
                      AI Evidence Analysis
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300">
                        <span className="font-semibold block text-[11px]">Urgency Coercion</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">9:30 PM Artificial Deadline</span>
                      </div>
                      <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-amber-700 dark:text-amber-300">
                        <span className="font-semibold block text-[11px]">Unverified Domain</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">bit.ly short-link mask</span>
                      </div>
                    </div>
                  </div>

                  {/* Immediate Safety Action */}
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Recommended Action</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
                      Do not click link. Banks never send KYC update SMS with third-party URL shorteners or ask for credentials via SMS.
                    </p>
                  </div>

                  {/* Direct Test CTA inside Hero Card */}
                  <button
                    onClick={() => onNavigate('message-analyzer')}
                    className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Test Your Own Message in Scanner</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (Detect → Analyze → Compare → Learn → Protect) */}
      <section id="how-it-works-section" className="py-20 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              End-to-End Threat Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How It Works
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              A continuous loop transforming raw suspicious interactions into explainable threat protection and collective immunity.
            </p>
          </div>

          {/* Stepper Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 relative">
            {howItWorksSteps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-5 flex flex-col justify-between hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all relative"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {item.step}
                      </span>
                      <div className={`p-2 rounded-xl border ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{item.title}</span>
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    <span>{item.label}</span>
                    {idx < howItWorksSteps.length - 1 && (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. ANALYSIS MODULES (Message Analysis, Payment Analysis, Call Analysis) */}
      <section className="py-20 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Specialized Threat Engines
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Analysis Modules
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Choose the dedicated analyzer for your specific interaction. No login required for scanning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {analysisModules.map((mod, i) => {
              const Icon = mod.icon;
              return (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-xs hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-600 transition-all group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${mod.badgeBg}`}>
                        {mod.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                        {mod.subtitle}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {mod.desc}
                    </p>

                    <div className="pt-2 space-y-1.5 border-t border-slate-100 dark:border-slate-800">
                      {mod.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => onNavigate(mod.id as ActiveView)}
                      className="w-full py-3 px-4 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-indigo-600 dark:hover:bg-white dark:hover:text-indigo-700 text-white dark:text-slate-900 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <span>Open {mod.title}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. COMMUNITY INTELLIGENCE (One person's scam experience can help protect the next person) */}
      <section className="py-20 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Collective Defense Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Community Intelligence
              </h2>

              <blockquote className="border-l-4 border-indigo-600 pl-4 py-1 text-lg font-medium text-slate-800 dark:text-slate-200 italic">
                “One person's scam experience can help protect the next person.”
              </blockquote>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                When a user encounters a fraudulent SMS, suspicious payment request, or scam phone call, their submission is automatically stripped of personal identifiers (phone numbers, UPI IDs, account numbers). The attack signature is extracted and indexed, instantaneously shielding everyone else from the same vector.
              </p>

              {/* Anonymized Example Statistics */}
              <div className="grid grid-cols-2 gap-3.5 pt-1">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                    12,480+
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-0.5">
                    Analyzed Threats
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Anonymized telemetry</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                    3,820+
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-0.5">
                    Verified Scam Reports
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Community verified</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-2xl sm:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">
                    94
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-0.5">
                    Active Scam Patterns
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Cataloged vectors</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                    ₹1.82 Cr+
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-0.5">
                    Averted Losses
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Estimated protection</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => onNavigate('community-feed')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Explore Community Feed
                </button>
                <button
                  onClick={() => onNavigate('scam-intelligence')}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  View Scam Patterns
                </button>
              </div>
            </div>

            {/* Right Interactive Protection Propagation Card */}
            <div className="lg:col-span-6">
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-mono text-slate-300 font-semibold">
                      ANONYMIZED DEFENSE PROPAGATION
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                    Live Feed
                  </span>
                </div>

                {/* 3 Step Flow */}
                <div className="space-y-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                      1
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">Incident Submitted by Citizen</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        Phone: +91 98XXXXXX21 • UPI: sb****@okaxis • APK Hash logged
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                      2
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">AI Redaction & Pattern Synthesis</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Stripped all PII • Matched to KYC Threat Pattern #KYC-2026 • Verified by moderators
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                      3
                    </div>
                    <div>
                      <div className="font-semibold text-emerald-300">Immunity Distributed to All Users</div>
                      <div className="text-[11px] text-emerald-400/90 mt-0.5">
                        Any subsequent check containing the same URL or sender is instantly flagged as High Risk.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 text-center">
                  Zero personal account data is ever stored or shared.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SCAM PATTERNS (Common Categories as specified) */}
      <section id="scam-patterns-section" className="py-20 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Fraud Taxonomy & Warning Signs
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Scam Patterns
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Learn the common categories of modern digital fraud and recognize psychological red flags before you authorize.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {scamPatterns.map((pattern, idx) => {
              const Icon = pattern.icon;
              return (
                <motion.div
                  key={pattern.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: (idx % 4) * 0.06 }}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-indigo-400 dark:hover:border-indigo-600 hover:-translate-y-1 transition-all shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {pattern.category}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {pattern.name}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {pattern.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Warning Signs:
                    </span>
                    {pattern.warningSigns.map((sign, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                        <span>{sign}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => onNavigate('scam-patterns')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <span>Explore All 94 Verified Scam Patterns</span>
              <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. COMMUNITY (Reports and Discussions) */}
      <section className="py-20 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Live Community Sentinel
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                Community Reports & Discussions
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-2xl">
                Recent threat reports submitted by citizens, verified by moderators, and discussed by the community.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('community-feed')}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                View All Reports
              </button>
              <button
                onClick={() => onNavigate('report-scam')}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
              >
                Submit a Report
              </button>
            </div>
          </div>

          {/* Top 3 Community Cards with Discussion Snippets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {communityReports.map((report) => (
              <div
                key={report.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-5 flex flex-col justify-between hover:shadow-lg hover:border-indigo-400 dark:hover:border-indigo-600 transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {report.ticketNumber || report.id}
                    </span>
                    <RiskBadge level={report.riskLevel} />
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                    {report.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {report.description}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] text-slate-500 font-mono">
                    {report.maskedPhone && (
                      <span className="px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800">
                        Phone: {report.maskedPhone}
                      </span>
                    )}
                    {report.maskedUpiId && (
                      <span className="px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800">
                        UPI: {report.maskedUpiId}
                      </span>
                    )}
                  </div>
                </div>

                {/* Community Discussion Snippet */}
                <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">Community Alert: </span>
                      <span>Verified attack pattern. Multiple citizens reported this exact sender link in the past 24 hours.</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{report.upvotes || 12} Confirmations</span>
                    </div>
                    <button
                      onClick={() => setSelectedReportModal(report)}
                      className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer text-xs"
                    >
                      <span>Read Incident</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-20 bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-950 text-white relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/80 border border-indigo-400/40 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
            <Shield className="w-6 h-6" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Analyze a suspicious message before you trust it.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Before approving a payment request, scanning a received QR code, or clicking an urgent bank SMS link, test it with RakshaPay's explainable threat intelligence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              id="final-cta-analyze"
              onClick={() => onNavigate('message-analyzer')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-900/40 hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Analyze a Scam</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="final-cta-patterns"
              onClick={() => onNavigate('scam-patterns')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold text-base transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Browse Scam Patterns</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 pt-3">
            Zero sign-up required to test suspicious messages, payments, or audio calls.
          </p>
        </div>
      </section>

      {/* Incident Detail Modal for Landing Page */}
      {selectedReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-2xl w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedReportModal.ticketNumber || selectedReportModal.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {selectedReportModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReportModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Masked Incident Narrative
              </span>
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-mono">
                {selectedReportModal.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Category</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {selectedReportModal.category}
                </span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Reported Phone</span>
                <span className="font-mono text-slate-900 dark:text-white">
                  {selectedReportModal.maskedPhone || selectedReportModal.phoneReported || 'N/A'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setSelectedReportModal(null);
                  onNavigate('community-feed');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold cursor-pointer"
              >
                View in Community Feed
              </button>

              <button
                onClick={() => setSelectedReportModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
