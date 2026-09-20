import { PaymentAnalysisResult, PaymentRiskFactor } from '../types';

export interface PaymentAnalysisParams {
  amount: number;
  recipientName: string;
  upiId: string;
  paymentType: 'Send Money' | 'Collect Request' | 'Refund' | 'QR Payment';
  isNewRecipient: boolean;
  contextMessage?: string;
  previousAverageAmount?: number;
}

export const paymentAnalysisService = {
  analyzePayment(params: PaymentAnalysisParams): Promise<PaymentAnalysisResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let score = 10;
        const factors: PaymentRiskFactor[] = [];

        // 1. Payment type check
        if (params.paymentType === 'Collect Request') {
          score += 26;
          factors.push({
            id: 'f-collect',
            label: 'Collect request inversion hazard',
            delta: 26,
            severity: 'high',
            description: 'Approving a collect request immediately debits funds from your linked bank account.'
          });
        } else if (params.paymentType === 'Refund') {
          score += 24;
          factors.push({
            id: 'f-refund',
            label: 'Refund pattern anomaly',
            delta: 24,
            severity: 'high',
            description: 'Legitimate refunds do not require you to initiate or authorize an outgoing transaction.'
          });
        } else if (params.paymentType === 'QR Payment') {
          score += 15;
          factors.push({
            id: 'f-qr',
            label: 'Direct QR payment code',
            delta: 15,
            severity: 'medium',
            description: 'QR codes obscure the destination beneficiary details until the confirmation screen.'
          });
        }

        // 2. New recipient check
        if (params.isNewRecipient) {
          score += 18;
          factors.push({
            id: 'f-new-rec',
            label: 'First-time recipient identifier',
            delta: 18,
            severity: 'medium',
            description: 'No prior transaction history established with this UPI handle.'
          });
        }

        // 3. Amount anomaly
        const avg = params.previousAverageAmount || 1500;
        if (params.amount > avg * 5 || params.amount >= 20000) {
          const delta = params.amount >= 25000 ? 24 : 16;
          score += delta;
          factors.push({
            id: 'f-amount',
            label: 'Amount anomaly detected',
            delta,
            severity: 'high',
            description: `Payment of ₹${params.amount.toLocaleString()} is substantially higher than typical profile frequency.`
          });
        }

        // 4. UPI handle / recipient name analysis
        const upi = params.upiId.toLowerCase();
        const ctx = (params.contextMessage || '').toLowerCase();

        if (
          upi.includes('refund') || 
          upi.includes('cashback') || 
          upi.includes('support') || 
          upi.includes('army') || 
          upi.includes('canteen') ||
          ctx.includes('kyc') ||
          ctx.includes('verify') ||
          ctx.includes('pin')
        ) {
          score += 22;
          factors.push({
            id: 'f-suspicious-handle',
            label: 'High-risk VPA / Context keywords',
            delta: 22,
            severity: 'high',
            description: 'Beneficiary handle or message contains words frequently flagged in social-engineering scams.'
          });
        }

        // Cap score at 99
        score = Math.min(99, Math.max(5, score));
        const riskLevel = score >= 70 ? 'high' : score >= 35 ? 'caution' : 'low';

        let recommendedAction = 'Proceed with customary caution. Verify account holder name displayed by your UPI provider before confirming.';
        if (riskLevel === 'high') {
          recommendedAction = 'Verify the recipient before authorizing this payment. Do not enter your UPI PIN if this is supposed to be a refund or incoming payment.';
        } else if (riskLevel === 'caution') {
          recommendedAction = 'Caution advised. Double check the destination VPA with the recipient over a known secure phone channel.';
        }

        resolve({
          id: `pay-${Date.now()}`,
          amount: params.amount,
          recipientName: params.recipientName,
          upiId: params.upiId,
          paymentType: params.paymentType,
          isNewRecipient: params.isNewRecipient,
          riskScore: score,
          riskLevel,
          contributingFactors: factors,
          recommendedAction,
          analyzedAt: new Date().toISOString()
        });
      }, 700);
    });
  }
};
