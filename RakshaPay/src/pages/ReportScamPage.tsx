import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  EyeOff,
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Lock,
  Sparkles,
  FileCheck2
} from 'lucide-react';
import { ActiveView } from '../types';
import { communityService } from '../services/communityService';
import { authService } from '../services/authService';
import { userDataService } from '../services/userDataService';

interface ReportScamPageProps {
  onNavigate: (view: ActiveView) => void;
}

export const ReportScamPage: React.FC<ReportScamPageProps> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [title, setTitle] = useState('');
  const [scamType, setScamType] = useState('KYC Impersonation');
  const [amountLost, setAmountLost] = useState<number>(0);
  const [channel, setChannel] = useState<'SMS' | 'WhatsApp' | 'Call' | 'Telegram' | 'Email'>('SMS');
  const [senderInfo, setSenderInfo] = useState('+91 98765 43210');
  const [upiVpa, setUpiVpa] = useState('paytm-refund@okaxis');
  const [description, setDescription] = useState(
    'Received SMS stating: "Dear customer your SBI Yono will be suspended today. Click http://sbi-kyc-update.xyz to update immediately. Call officer at +91 98765 43210 or transfer ₹1 to verify."'
  );
  const [consentToPublish, setConsentToPublish] = useState(true);

  // Result state
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);

  // Live masked preview computation (Section 22)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = authService.getCurrentUser();
    const newReport = communityService.createReport({
      title: title || `${scamType} Encounter via ${channel}`,
      scamType,
      channel,
      amountLost,
      description,
      phoneReported: senderInfo,
      upiReported: upiVpa,
    });
    if (currentUser && currentUser.id) {
      userDataService.addUserReport(currentUser.id, newReport);
      authService.updateProfile({
        reportsSubmitted: (currentUser.reportsSubmitted || 0) + 1,
      });
    }
    setSubmittedReportId(newReport.id);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Report Suspicious Activity or Scam
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Your report empowers instant pattern matching across the RakshaPay community while rigorously protecting your privacy.
        </p>
      </div>

      {/* Step Indicator */}
      {!submittedReportId && (
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {[
            { step: 1, label: 'Incident Details' },
            { step: 2, label: 'Evidence & Channels' },
            { step: 3, label: 'Privacy & Masking' },
          ].map((s) => (
            <div key={s.step} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep >= s.step
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {s.step}
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 hidden sm:inline">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Main Container */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
        {submittedReportId ? (
          /* Success Screen */
          <div className="text-center py-8 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Report Submitted Successfully
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Thank you for contributing! Your report has been tagged as{' '}
                <strong className="text-indigo-600 dark:text-indigo-400 font-mono">
                  {submittedReportId}
                </strong>{' '}
                and queued for community validation. Sensitive phone numbers and accounts were automatically masked.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => onNavigate('community-feed')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center gap-2"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>View in Community Intelligence Feed</span>
              </button>
              <button
                onClick={() => {
                  setSubmittedReportId(null);
                  setCurrentStep(1);
                  setTitle('');
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
              >
                Submit Another Report
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* STEP 1: Incident Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Report Headline / Summary
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Fake Electricity Bill Disconnection SMS targeting MSEB users"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Scam Classification
                    </label>
                    <select
                      value={scamType}
                      onChange={(e) => setScamType(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="KYC Impersonation">KYC & Account Blocking Impersonation</option>
                      <option value="Fake Refund">Fake Refund / Cashback Collect Request</option>
                      <option value="Remote Access">AnyDesk / TeamViewer Screen Share</option>
                      <option value="OLX QR Scam">OLX / Marketplace QR Code Trap</option>
                      <option value="Electricity Bill Cut">Electricity / Utility Blackout Threat</option>
                      <option value="Job / Part-time Task">YouTube Likes / Telegram Task Fraud</option>
                      <option value="Other">Other Novel Attack</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Financial Loss Amount (₹) - Enter 0 if prevented
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={amountLost}
                      onChange={(e) => setAmountLost(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>Proceed to Evidence</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Evidence & Channels */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Vector / Channel
                    </label>
                    <select
                      value={channel}
                      onChange={(e) => setChannel(e.target.value as any)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="SMS">SMS / Text Message</option>
                      <option value="WhatsApp">WhatsApp Chat</option>
                      <option value="Call">Phone Call</option>
                      <option value="Telegram">Telegram Group / DM</option>
                      <option value="Email">Email</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Reported Sender Phone / ID
                    </label>
                    <input
                      type="text"
                      value={senderInfo}
                      onChange={(e) => setSenderInfo(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Scammer UPI ID / VPA (If any)
                    </label>
                    <input
                      type="text"
                      value={upiVpa}
                      onChange={(e) => setUpiVpa(e.target.value)}
                      placeholder="e.g. claim_pay@okaxis"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Message Body or Incident Description
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>Inspect Privacy Masking</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Privacy & Masking (Section 22) */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 flex items-start gap-3">
                  <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase">
                      Client-Side PII Obfuscation Active
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      RakshaPay automatically strips personal phone numbers, bank accounts, and UPI handles before publishing to community feeds. Sensitive details are protected automatically.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20">
                  <div className="flex items-start gap-3">
                    <EyeOff className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <h3 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wide">Automatic privacy protection</h3>
                      <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
                        You submit one report. RakshaPay automatically masks phone numbers, UPI IDs, account numbers, OTPs and other sensitive values before the community version is stored or displayed. There is no Normal/Masked choice and no duplicate preview.
                      </p>
                      <div className="mt-2 text-[11px] font-mono text-emerald-700 dark:text-emerald-300">
                        Example: +91 98765 43210 → +91 98XXXXXX10 · paytm-refund@okaxis → pa****@okaxis
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consent Checkbox */}
                <div className="flex items-start gap-2.5 pt-2">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={consentToPublish}
                    onChange={(e) => setConsentToPublish(e.target.checked)}
                    className="mt-1 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="consent" className="text-xs text-slate-600 dark:text-slate-400">
                    I confirm this report does not contain false allegations, and I authorize sharing this anonymized threat pattern with RakshaPay community members.
                  </label>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    disabled={!consentToPublish}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs shadow-md flex items-center gap-2 transition-all"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Publish Protected Report</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
