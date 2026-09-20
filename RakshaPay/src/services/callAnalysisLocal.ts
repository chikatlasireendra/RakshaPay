import { CallAnalysisResult, CallTimelineEvent, CallTranscriptLine, CallSuspiciousIndicator, CommunityReport } from '../types';
import { communityService } from './communityService';

export interface PresetCallScenario {
  id: string;
  name: string;
  description: string;
  duration: string;
  riskScore: number;
  scamCategory: string;
  detectedSignals: string[];
  suspiciousIndicators: CallSuspiciousIndicator[];
  timeline: CallTimelineEvent[];
  transcript: CallTranscriptLine[];
  summary: string;
  recommendedAction: string;
  similarReportIds: string[];
}

export const PRESET_CALL_SCENARIOS: PresetCallScenario[] = [
  {
    id: 'call-anydesk-kyc',
    name: 'AnyDesk Remote Support & KYC Call (Critical)',
    description: 'Fraudster impersonating bank technical officer ordering victim to install AnyDesk to prevent KYC account freeze.',
    duration: '01:14',
    riskScore: 94,
    scamCategory: 'Remote Access & Bank Impersonation Scam',
    detectedSignals: [
      'Bank Impersonation',
      'KYC Expiry Urgency',
      'Remote Desktop (AnyDesk)',
      'Intimidation & Strict Coercion',
      'OTP Credential Harvesting'
    ],
    suspiciousIndicators: [
      {
        id: 'ind-1',
        label: 'Senior Bank Officer Impersonation',
        severity: 'high',
        description: 'Caller falsely identifies as Senior Verification Officer from bank headquarters to engineer compliance.',
        quote: 'Hello, this is Senior Verification Officer Sharma from your bank headquarters.'
      },
      {
        id: 'ind-2',
        label: 'Fabricated KYC Expiry & Immediate Account Freeze',
        severity: 'high',
        description: 'Creates acute stress by threatening a 15-minute account lockout if not rectified over the phone.',
        quote: 'Your central KYC registry is suspended. If not verified in 15 minutes your account is frozen.'
      },
      {
        id: 'ind-3',
        label: 'Psychological Coercion (Refusal of Branch Visit)',
        severity: 'medium',
        description: 'Forbids victim from visiting a verified bank branch and orders victim not to disconnect the call.',
        quote: 'No sir, branch cannot help. Do not disconnect the call, the server lock has already initiated.'
      },
      {
        id: 'ind-4',
        label: 'Remote Desktop App Installation Directive (AnyDesk)',
        severity: 'high',
        description: 'Directs victim to download third-party remote screen-sharing software to gain uninhibited device control.',
        quote: 'Open Play Store, search AnyDesk, and read me the 9-digit address on your screen.'
      },
      {
        id: 'ind-5',
        label: 'Active OTP Solicitation',
        severity: 'high',
        description: 'Demands 6-digit approval code under pretext of server bypass to execute unauthorized fund transfer.',
        quote: 'Now an approval code will arrive. Read out the 6 digits quickly to complete the bypass.'
      }
    ],
    timeline: [
      {
        timestamp: '00:04',
        seconds: 4,
        label: 'Bank impersonation',
        signalType: 'impersonation',
        snippet: 'Hello, this is Senior Verification Officer Sharma from your bank headquarters.'
      },
      {
        timestamp: '00:18',
        seconds: 18,
        label: 'KYC threat',
        signalType: 'threat',
        snippet: 'Your central KYC registry is suspended. If not verified in 15 minutes your account is frozen.'
      },
      {
        timestamp: '00:31',
        seconds: 31,
        label: 'Urgency trigger',
        signalType: 'urgency',
        snippet: 'Do not disconnect the call, the server lock has already initiated.'
      },
      {
        timestamp: '00:44',
        seconds: 44,
        label: 'Remote access request',
        signalType: 'remote_access',
        snippet: 'Open Play Store, search AnyDesk, and read me the 9-digit address on your screen.'
      },
      {
        timestamp: '00:58',
        seconds: 58,
        label: 'OTP request',
        signalType: 'otp_request',
        snippet: 'Now an approval code will arrive. Read out the 6 digits quickly to complete the bypass.'
      }
    ],
    transcript: [
      {
        speaker: 'Caller',
        text: 'Hello, this is Senior Verification Officer Sharma from your bank headquarters.',
        timestamp: '00:04',
        isSuspicious: true,
        highlightCategory: 'Bank Impersonation'
      },
      {
        speaker: 'User',
        text: 'Yes? Is something wrong with my account?',
        timestamp: '00:12'
      },
      {
        speaker: 'Caller',
        text: 'Your central KYC registry is suspended. If not verified in 15 minutes your account is frozen.',
        timestamp: '00:18',
        isSuspicious: true,
        highlightCategory: 'KYC Expiry Threat'
      },
      {
        speaker: 'User',
        text: 'Can I visit my nearest bank branch tomorrow to submit documents?',
        timestamp: '00:26'
      },
      {
        speaker: 'Caller',
        text: 'No sir, branch cannot help. Do not disconnect the call, the server lock has already initiated.',
        timestamp: '00:31',
        isSuspicious: true,
        highlightCategory: 'Coercive Urgency & Refusal'
      },
      {
        speaker: 'User',
        text: 'What should I do right now then?',
        timestamp: '00:39'
      },
      {
        speaker: 'Caller',
        text: 'Open Play Store, search AnyDesk, and read me the 9-digit address on your screen.',
        timestamp: '00:44',
        isSuspicious: true,
        highlightCategory: 'Remote Desktop Hijack'
      },
      {
        speaker: 'User',
        text: 'Why do I need AnyDesk for my bank KYC?',
        timestamp: '00:52'
      },
      {
        speaker: 'Caller',
        text: 'Now an approval code will arrive. Read out the 6 digits quickly to complete the bypass.',
        timestamp: '00:58',
        isSuspicious: true,
        highlightCategory: 'OTP Credential Harvesting'
      }
    ],
    summary: 'The caller utilized textbook multi-stage social engineering: claiming authority, threatening immediate account lockdown, insisting on screen-sharing software, and demanding one-time passwords.',
    recommendedAction: 'Immediately terminate call. Never install AnyDesk or share OTPs. Call your bank using the phone number printed on your physical card.',
    similarReportIds: ['rep-1038', 'rep-1042']
  },
  {
    id: 'call-dubai-fraud',
    name: 'Dubai Unauthorized Debit & OTP Call',
    description: 'Automated robocall transferring to a fraud agent claiming a ₹45,000 credit card transaction took place in Dubai.',
    duration: '00:54',
    riskScore: 89,
    scamCategory: 'Unauthorized Transaction & OTP Harvesting Scam',
    detectedSignals: [
      'Credit Card Fraud Scare',
      'Cancellation OTP Demand',
      'Artificial Background Call Noise',
      'Authority Impersonation'
    ],
    suspiciousIndicators: [
      {
        id: 'ind-d1',
        label: 'Fabricated High-Value Transaction Shock',
        severity: 'high',
        description: 'Frightens the cardholder with an alleged ₹45,000 international charge at Dubai airport.',
        quote: 'Card safety unit: International charge of ₹45,000 flagged in Dubai airport.'
      },
      {
        id: 'ind-d2',
        label: 'False Security Reassurance',
        severity: 'medium',
        description: 'Presents the scammer as a protective hero offering instant reversal on a secure terminal.',
        quote: 'Do not panic. I am canceling the debit transaction right now on our secure terminal.'
      },
      {
        id: 'ind-d3',
        label: 'Reverse OTP Trick',
        severity: 'high',
        description: 'Misrepresents an outgoing payment authorization OTP as a "cancellation code".',
        quote: 'Provide the 6-digit cancellation verification code just received via SMS.'
      }
    ],
    timeline: [
      {
        timestamp: '00:03',
        seconds: 3,
        label: 'Emergency alert',
        signalType: 'threat',
        snippet: 'Card safety unit: International charge of ₹45,000 flagged in Dubai airport.'
      },
      {
        timestamp: '00:20',
        seconds: 20,
        label: 'Cancellation assurance',
        signalType: 'impersonation',
        snippet: 'I am canceling the debit transaction right now on our secure terminal.'
      },
      {
        timestamp: '00:42',
        seconds: 42,
        label: 'OTP request',
        signalType: 'otp_request',
        snippet: 'Provide the 6-digit cancellation verification code just received via SMS.'
      }
    ],
    transcript: [
      {
        speaker: 'Caller',
        text: 'Card safety unit: International charge of ₹45,000 flagged in Dubai airport.',
        timestamp: '00:03',
        isSuspicious: true,
        highlightCategory: 'Fabricated Debit Alert'
      },
      {
        speaker: 'User',
        text: 'What? I am in Mumbai, I never authorized any international payment!',
        timestamp: '00:11'
      },
      {
        speaker: 'Caller',
        text: 'Do not panic. I am canceling the debit transaction right now on our secure terminal.',
        timestamp: '00:20',
        isSuspicious: true,
        highlightCategory: 'False Solution / Deceptive Reversal'
      },
      {
        speaker: 'User',
        text: 'Please cancel it immediately.',
        timestamp: '00:32'
      },
      {
        speaker: 'Caller',
        text: 'Provide the 6-digit cancellation verification code just received via SMS.',
        timestamp: '00:42',
        isSuspicious: true,
        highlightCategory: 'OTP Credential Theft'
      }
    ],
    summary: 'Caller creates high stress with a fabricated high-value transaction, then offers relief in exchange for an SMS verification code which actually authorizes the transfer.',
    recommendedAction: 'Hang up. Banks never require an OTP to cancel or block a compromised card. Block the card instantly within your verified mobile banking app.',
    similarReportIds: ['rep-1041', 'rep-1040']
  },
  {
    id: 'call-electricity-threat',
    name: 'Night Electricity Disconnection Call',
    description: 'Imposter posing as state electricity board disconnection officer demanding immediate settlement via phone.',
    duration: '01:05',
    riskScore: 92,
    scamCategory: 'Utility Disconnection Threat Scam',
    detectedSignals: [
      'Power Disconnection Panic',
      'Officer Impersonation',
      'Artificial Urgency Window',
      'Direct Phone Payment Request'
    ],
    suspiciousIndicators: [
      {
        id: 'ind-e1',
        label: 'Immediate Utility Disconnection Threat',
        severity: 'high',
        description: 'Threatens power cutoff within the hour, leveraging fear of overnight blackout.',
        quote: 'Your meter connection is marked for disconnection tonight at 9:30 PM due to unpaid balance.'
      },
      {
        id: 'ind-e2',
        label: 'Fake Sub-Divisional Officer Authority',
        severity: 'medium',
        description: 'Poses as Senior Disconnection Officer Deshmukh handling local substation records.',
        quote: 'This is Executive Officer Deshmukh from Mahavitaran Central Substation.'
      },
      {
        id: 'ind-e3',
        label: 'Direct Mobile Payment Demand',
        severity: 'high',
        description: 'Instructs victim to bypass official billing portals and transfer funds to a private UPI number.',
        quote: 'Transfer ₹850 immediately to our substation terminal number to update your ledger.'
      }
    ],
    timeline: [
      {
        timestamp: '00:05',
        seconds: 5,
        label: 'Power Cut Warning',
        signalType: 'threat',
        snippet: 'Your meter connection is marked for disconnection tonight at 9:30 PM due to unpaid balance.'
      },
      {
        timestamp: '00:22',
        seconds: 22,
        label: 'Authority Impersonation',
        signalType: 'impersonation',
        snippet: 'This is Executive Officer Deshmukh from Mahavitaran Central Substation.'
      },
      {
        timestamp: '00:48',
        seconds: 48,
        label: 'Direct Payment Demand',
        signalType: 'otp_request',
        snippet: 'Transfer ₹850 immediately to our substation terminal number to update your ledger.'
      }
    ],
    transcript: [
      {
        speaker: 'Caller',
        text: 'Your meter connection is marked for disconnection tonight at 9:30 PM due to unpaid balance.',
        timestamp: '00:05',
        isSuspicious: true,
        highlightCategory: 'Disconnection Threat'
      },
      {
        speaker: 'User',
        text: 'I already paid my electricity bill through Google Pay two weeks ago.',
        timestamp: '00:15'
      },
      {
        speaker: 'Caller',
        text: 'This is Executive Officer Deshmukh from Mahavitaran Central Substation. The bank server failed to update our ledger.',
        timestamp: '00:22',
        isSuspicious: true,
        highlightCategory: 'Authority Impersonation'
      },
      {
        speaker: 'User',
        text: 'How do I resolve this before 9:30 PM?',
        timestamp: '00:36'
      },
      {
        speaker: 'Caller',
        text: 'Transfer ₹850 immediately to our substation terminal number to update your ledger, or technician will cut line.',
        timestamp: '00:48',
        isSuspicious: true,
        highlightCategory: 'Coercive Payment Demand'
      }
    ],
    summary: 'Caller creates high stress using a night-time power outage deadline, claiming previous payments failed and demanding immediate transfer to a private number.',
    recommendedAction: 'Hang up. State electricity boards do not call from personal numbers demanding immediate phone transfers. Check bill status on the official electricity portal.',
    similarReportIds: ['rep-1039', 'rep-1042']
  }
];

export const callAnalysisService = {
  analyzeAudioFile(
    fileName: string,
    presetId?: string,
    onProgress?: (stage: string, percent: number) => void
  ): Promise<CallAnalysisResult> {
    return new Promise((resolve) => {
      // Find preset scenario or match based on filename
      let preset = PRESET_CALL_SCENARIOS.find(p => p.id === presetId);
      if (!preset) {
        const lowerName = fileName.toLowerCase();
        if (lowerName.includes('debit') || lowerName.includes('dubai') || lowerName.includes('card')) {
          preset = PRESET_CALL_SCENARIOS[1];
        } else if (lowerName.includes('electricity') || lowerName.includes('power') || lowerName.includes('bill')) {
          preset = PRESET_CALL_SCENARIOS[2];
        } else {
          preset = PRESET_CALL_SCENARIOS[0];
        }
      }

      // Workflow stages requested by user:
      // Transcribing -> Analyzing Conversation -> Detecting Scam Indicators -> Matching Community Patterns
      const stages = [
        { label: 'Transcribing', percent: 25, subtext: 'Transcribing speech to text with neural acoustic model...' },
        { label: 'Analyzing Conversation', percent: 50, subtext: 'Analyzing conversational dynamics & turn-taking...' },
        { label: 'Detecting Scam Indicators', percent: 75, subtext: 'Detecting psychological manipulation & coercion triggers...' },
        { label: 'Matching Community Patterns', percent: 95, subtext: 'Matching against verified Community Scam Registry...' },
        { label: 'Results', percent: 100, subtext: 'Synthesizing forensic risk report...' }
      ];

      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < stages.length) {
          const currentStage = stages[currentIndex];
          if (onProgress) {
            onProgress(currentStage.label, currentStage.percent);
          }
          currentIndex++;
        } else {
          clearInterval(interval);

          // Resolve similar community reports
          const allReports = communityService.getReports();
          const matchedReports: CommunityReport[] = [];
          
          if (preset.similarReportIds && preset.similarReportIds.length > 0) {
            preset.similarReportIds.forEach(id => {
              const r = allReports.find(report => report.id === id || report.ticketNumber === id);
              if (r) matchedReports.push(r);
            });
          }

          // If not enough matched by ID, match by category
          if (matchedReports.length < 2) {
            const categoryMatches = allReports.filter(
              r => r.category.toLowerCase().includes('remote') || 
                   r.category.toLowerCase().includes('kyc') ||
                   r.category.toLowerCase().includes('call')
            );
            categoryMatches.forEach(cm => {
              if (!matchedReports.some(r => r.id === cm.id)) {
                matchedReports.push(cm);
              }
            });
          }

          resolve({
            id: `call-${Date.now()}`,
            fileName,
            duration: preset.duration,
            riskScore: preset.riskScore,
            riskLevel: preset.riskScore >= 70 ? 'high' : 'caution',
            scamCategory: preset.scamCategory,
            detectedSignals: preset.detectedSignals,
            suspiciousIndicators: preset.suspiciousIndicators,
            timeline: preset.timeline,
            transcript: preset.transcript,
            summary: preset.summary,
            recommendedAction: preset.recommendedAction,
            analyzedAt: new Date().toISOString(),
            similarReports: matchedReports.slice(0, 3)
          });
        }
      }, 420);
    });
  }
};
