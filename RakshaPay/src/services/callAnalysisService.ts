import { CallAnalysisResult } from '../types';
import { apiUpload } from './apiClient';
import { callAnalysisService as localService, PRESET_CALL_SCENARIOS } from './callAnalysisLocal';
import type { PresetCallScenario } from './callAnalysisLocal';

export { PRESET_CALL_SCENARIOS };
export type { PresetCallScenario };

export const callAnalysisService = {
  async analyzeAudioFile(
    fileOrName: File | string,
    presetId?: string,
    onProgress?: (stage: string, percent: number) => void
  ): Promise<CallAnalysisResult> {
    // Preset-only demo selection remains supported by the original frontend.
    if (typeof fileOrName === 'string') {
      return localService.analyzeAudioFile(fileOrName, presetId, onProgress);
    }

    try {
      const stages = [
        ['Uploading', 15],
        ['Transcribing', 35],
        ['Analyzing Conversation', 60],
        ['Detecting Scam Indicators', 78],
        ['Matching Community Patterns', 95]
      ] as const;

      let index = 0;
      onProgress?.(stages[0][0], stages[0][1]);
      const interval = window.setInterval(() => {
        index += 1;
        if (index < stages.length) onProgress?.(stages[index][0], stages[index][1]);
        else window.clearInterval(interval);
      }, 500);

      try {
        const result = await apiUpload<CallAnalysisResult>('/api/analyze/call', { preset_id: presetId }, fileOrName);
        window.clearInterval(interval);
        onProgress?.('Results', 100);
        return result;
      } catch (error) {
        window.clearInterval(interval);
        throw error;
      }
    } catch {
      return localService.analyzeAudioFile(fileOrName.name, presetId, onProgress);
    }
  }
};
