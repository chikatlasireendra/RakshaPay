import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CreditCard,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  Info,
  DollarSign,
  UserCheck,
  QrCode,
  ArrowUpRight
} from 'lucide-react';
import { ActiveView, PaymentAnalysisResult } from '../types';
import { paymentAnalysisService } from '../services/paymentAnalysisService';
import { authService } from '../services/authService';
import { userDataService } from '../services/userDataService';
import { RiskBadge } from '../components/common/RiskBadge';
import { InnovationInsights } from '../components/common/InnovationInsights';

interface PaymentAnalyzerProps {
  onNavigate: (view: ActiveView) => void;
}

export const PaymentAnalyzer: React.FC<PaymentAnalyzerProps> = ({ onNavigate }) => {
  const [amount, setAmount] = useState<number>(25000);
  const [recipientName, setRecipientName] = useState('SWIGGY_REFUND_NODE');
  const [upiId, setUpiId] = useState('refund_claim@okaxis');
  const [paymentType, setPaymentType] = useState<'Send Money' | 'Collect Request' | 'Refund' | 'QR Payment'>('Collect Request');
  const [isNewRecipient, setIsNewRecipient] = useState(true);
  const [contextMessage, setContextMessage] = useState('Approving collect request to receive pending ₹2,499 grocery refund');
  const [previousAverage, setPreviousAverage] = useState<number>(1200);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PaymentAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAnalyzePayment = async () => {
    setLoading(true);
    setResult(null);
    setErrorMessage(null);
    try {
      const res = await paymentAnalysisService.analyzePayment({
        amount,
        recipientName,
        upiId,
        paymentType,
        isNewRecipient,
        contextMessage,
        previousAverageAmount: previousAverage,
      });
      setResult(res);

      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        userDataService.addHistoryItem(currentUser.id, {
          type: 'Payment',
          query: `₹${amount} to ${recipientName || upiId} (${paymentType})`,
          title: `UPI Payment ₹${amount.toLocaleString('en-IN')} to ${recipientName || upiId || 'recipient'}`,
          riskLevel: res.riskLevel,
          riskScore: res.riskScore,
          category: paymentType === 'Collect Request' ? 'Fake Refund / Collect Trap' : 'Payment Risk Check',
          actionTaken: res.riskLevel === 'high' ? 'Payment Cancelled' : 'Payment Approved',
        });
        await authService.updateProfile({
          analysesCount: (currentUser.analysesCount || 0) + 1,
          confirmedThreatsCount:
            res.riskLevel === 'high'
              ? (currentUser.confirmedThreatsCount || 0) + 1
              : currentUser.confirmedThreatsCount,
        }).catch(() => { /* keep payment result visible */ });
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to analyze this payment.');
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (type: 'collect' | 'qr' | 'safe') => {
    if (type === 'collect') {
      setAmount(25000);
      setRecipientName('SWIGGY_REFUND_NODE');
      setUpiId('refund_claim@okaxis');
      setPaymentType('Collect Request');
      setIsNewRecipient(true);
      setContextMessage('Approving collect request to receive pending ₹2,499 grocery refund');
      setPreviousAverage(1200);
    } else if (type === 'qr') {
      setAmount(15000);
      setRecipientName('ARMY_CANTEEN_PUNE');
      setUpiId('army_defence_subedar@icici');
      setPaymentType('QR Payment');
      setIsNewRecipient(true);
      setContextMessage('Buyer sent a QR code on OLX claiming it will deposit camera price');
      setPreviousAverage(2000);
    } else {
      setAmount(450);
      setRecipientName('Nature Fresh Grocers');
      setUpiId('naturefresh@okhdfcbank');
      setPaymentType('Send Money');
      setIsNewRecipient(false);
      setContextMessage('Weekly vegetable purchase at neighborhood retail store');
      setPreviousAverage(500);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          UPI Payment Risk Assessment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Analyze transaction anomalies, collect request inversion traps, and beneficiary safety prior to entering your UPI PIN.
        </p>
      </div>

      {/* Preset Quick Fillers */}
      <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          Load Scenario Preset:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => loadPreset('collect')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 transition-colors"
          >
            ⚠️ High Risk: ₹25k Collect Request
          </button>
          <button
            onClick={() => loadPreset('qr')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 hover:bg-amber-100 transition-colors"
          >
            ⚠️ QR Code Advance Trick
          </button>
          <button
            onClick={() => loadPreset('safe')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 hover:bg-emerald-100 transition-colors"
          >
            🟢 Normal Grocery Payment
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-sm text-rose-700 dark:text-rose-300">{errorMessage}</div>
      )}

      {/* Input Form */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Transaction Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Payment Vector / Type
            </label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value as any)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Send Money">Send Money (Direct VPA Transfer)</option>
              <option value="Collect Request">Collect Request (Incoming Mandate)</option>
              <option value="Refund">Refund Processing Authorization</option>
              <option value="QR Payment">QR Payment (Scan to Pay)</option>
            </select>
          </div>

          {/* Recipient Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Recipient / Merchant Name
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g. Swiggy Support"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* UPI ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Beneficiary UPI ID (VPA)
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. merchant@okaxis"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* New Recipient Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950">
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                First-time / New Recipient?
              </span>
              <span className="text-[11px] text-slate-500">
                Have you sent payments to this VPA in the past?
              </span>
            </div>
            <input
              type="checkbox"
              checked={isNewRecipient}
              onChange={(e) => setIsNewRecipient(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          {/* Average Previous Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your Typical Transaction Average (₹)
            </label>
            <input
              type="number"
              value={previousAverage}
              onChange={(e) => setPreviousAverage(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Context / Message */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Transaction Remark / Context / Caller Instructions
          </label>
          <input
            type="text"
            value={contextMessage}
            onChange={(e) => setContextMessage(e.target.value)}
            placeholder="e.g. Caller told me to enter PIN to credit refund to my account"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Info className="w-3.5 h-3.5" />
            <span>Provides advisory assessment; does not store banking credentials</span>
          </div>
          <button
            id="analyze-payment-btn"
            onClick={handleAnalyzePayment}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md transition-all flex items-center gap-2"
          >
            {loading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Evaluating Signals...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Payment</span>
              </>
            )}
          </button>
        </div>
      </div>

      <InnovationInsights scamDna={(result as any)?.scamDna} multiEvidenceMatch={(result as any)?.multiEvidenceMatch} />

      {/* Result Section (Section 18) */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-6"
          >
            {/* Risk Assessment Header */}
            <div
              className={`p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm ${
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
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    Risk Assessment
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {result.riskLevel === 'high'
                    ? 'High Risk Payment Request'
                    : result.riskLevel === 'caution'
                    ? 'Caution Advised Before Transfer'
                    : 'Low Risk Payment Pattern'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
                  {result.recommendedAction}
                </p>
              </div>

              {/* Big Score */}
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0 min-w-[140px]">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Risk Assessment
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
                <span className="text-[10px] text-slate-400 mt-0.5">Anomaly Delta Model</span>
              </div>
            </div>

            {/* Contributing Factors Breakdown with Animated Bars */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                  Contributing Risk Factors
                </h3>
                <span className="text-xs text-slate-400 font-mono">Weighted Anomaly Vector</span>
              </div>

              <div className="space-y-4 pt-1">
                {result.contributingFactors.map((factor) => (
                  <div key={factor.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {factor.label}
                      </span>
                      <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                        +{factor.delta}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          factor.severity === 'high'
                            ? 'bg-rose-500'
                            : factor.severity === 'medium'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, factor.delta * 3.5)}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {factor.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Recommended Action Box */}
              <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">
                    Mandatory Safety Recommendation
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {result.recommendedAction}
                  </p>
                  <p className="text-[11px] text-slate-400 pt-1">
                    * Remember: Entering your UPI PIN is ONLY required when SENDING money, NEVER when receiving funds or refunds.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
