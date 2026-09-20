import { RiskAnalysisResult } from '../types';
import { apiPost } from './apiClient';
import { scamAnalysisService as localService } from './scamAnalysisLocal';

export const scamAnalysisService = {
  async analyzeMessage(text: string): Promise<RiskAnalysisResult> {
    try {
      return await apiPost<RiskAnalysisResult>('/api/analyze/message', { text });
    } catch {
      // Keeps the original frontend demo behavior available when FastAPI is offline.
      return localService.analyzeMessage(text);
    }
  }
};
