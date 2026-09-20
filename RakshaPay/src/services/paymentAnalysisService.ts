import { PaymentAnalysisResult } from '../types';
import { apiPost } from './apiClient';
import { paymentAnalysisService as localService } from './paymentAnalysisLocal';
import type { PaymentAnalysisParams } from './paymentAnalysisLocal';

export type { PaymentAnalysisParams } from './paymentAnalysisLocal';

export const paymentAnalysisService = {
  async analyzePayment(params: PaymentAnalysisParams): Promise<PaymentAnalysisResult> {
    try {
      return await apiPost<PaymentAnalysisResult>('/api/analyze/payment', params);
    } catch {
      return localService.analyzePayment(params);
    }
  }
};
