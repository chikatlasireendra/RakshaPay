export type RiskLevel = 'low' | 'caution' | 'high';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user';
  avatarUrl?: string;
  phoneNumber?: string;
  createdAt: string;
  analysesCount: number;
  reportsSubmitted: number;
  reportsVerified: number;
  confirmedThreatsCount?: number;
  savedPatterns: string[];
  trustScore?: number | null; // null if unrated/new
}

export interface UserHistoryItem {
  id: string;
  date: string;
  type: 'Message' | 'Payment' | 'Call';
  query: string;
  riskLevel: RiskLevel;
  riskScore: number;
  category: string;
  actionTaken: string;
  title?: string;
}

export interface UserNotification {
  id: string;
  text: string;
  time: string;
  unread: boolean;
  type?: 'alert' | 'update' | 'system';
}

export type ScamCategory = 
  | 'KYC Impersonation'
  | 'Bank Impersonation'
  | 'Fake Refund'
  | 'QR Code Scam'
  | 'OTP Scam'
  | 'Remote Access Scam'
  | 'Investment Scam'
  | 'Customer Support Scam'
  | 'Job Scam'
  | 'Electricity Bill Scam';

export interface EvidenceItem {
  id: string;
  type: 'screenshot' | 'audio' | 'chat' | 'payment_receipt' | 'link';
  name: string;
  url?: string;
  fileSize?: string;
  previewUrl?: string;
  transcript?: string;
  maskedSnippet?: string;
}

export interface ReporterProfile {
  id?: string;
  name: string;
  avatar?: string;
  badge?: string;
  trustScore?: number;
  reportsSubmitted?: number;
  location?: string;
}

export interface ReportComment {
  id: string;
  reportId: string;
  authorName: string;
  authorAvatar?: string;
  authorBadge?: string;
  createdAt: string;
  relativeTime: string;
  content: string;
  upvotes: number;
  userUpvoted?: boolean;
}

export interface ReportRiskIndicator {
  id: string;
  label: string;
  severity: 'high' | 'medium' | 'low';
  detail: string;
}

export interface ReportAIAnalysis {
  summary: string;
  psychologicalTriggers: string[];
  urgencyLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  impersonationTactic: string;
  technicalRedFlags: string[];
  recommendation: string;
}

export interface CommunityReport {
  id: string;
  ticketNumber: string; // e.g., "#1042"
  category: ScamCategory;
  title: string;
  description: string;
  reportedAt: string;
  relativeTime: string;
  reporter?: ReporterProfile;
  dateFormatted?: string;
  timeFormatted?: string;
  similarityConfidence?: number;
  approximateAmountLost?: number;
  paymentMethod?: string;
  maskedUpiId?: string;
  maskedPhone?: string;
  maskedAccount?: string;
  evidence: EvidenceItem[];
  status: 'pending' | 'verified' | 'rejected';
  riskLevel: RiskLevel;
  confidenceScore: number;
  similarReportsCount: number;
  aiAnalysis?: ReportAIAnalysis;
  riskIndicators?: ReportRiskIndicator[];
  comments?: ReportComment[];
  moderationSignals?: {
    duplicateEvidenceScore: number;
    contradictoryDescription: boolean;
    repeatedSubmissions: boolean;
    suspiciousMetadata: boolean;
    aiRecommendation: 'Approve' | 'Manual Review Required' | 'Reject Candidate';
  };
  // UI Convenience aliases
  scamType?: string;
  channel?: string;
  phoneReported?: string;
  upiReported?: string;
  amountLost?: number;
  upvotes?: number;
  createdAt?: string;
  privacyChoice?: 'private' | 'anonymized';
  isPrivate?: boolean;
  privateOriginalEvidence?: {
    rawDescription: string;
    rawPhone?: string;
    rawUpi?: string;
    rawAccount?: string;
    submittedByUserId?: string;
    submittedAt: string;
    accessLevel: 'AUTHORIZED_MODERATION_ONLY';
  };
}

export interface FlaggedReason {
  id: string;
  title: string;
  snippet: string;
  severity: 'high' | 'medium' | 'low';
  explanation: string;
  iconName: string;
}

export interface RiskAnalysisResult {
  id: string;
  textAnalyzed: string;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  scamCategory: ScamCategory | 'Legitimate Communication';
  confidence: 'High' | 'Medium' | 'Low';
  categoryDescription: string;
  commonCharacteristics: string[];
  reasons: FlaggedReason[];
  recommendedActions: {
    title: string;
    description: string;
    critical: boolean;
  }[];
  similarCommunityReportsCount: number;
  patternBreakdown: {
    label: string;
    matchPercentage: number;
  }[];
  analyzedAt: string;
  scamDna?: Record<string, any>;
  multiEvidenceMatch?: Record<string, number>;
}

export interface PaymentRiskFactor {
  id: string;
  label: string;
  delta: number; // e.g. +24
  severity: 'high' | 'medium' | 'low';
  description: string;
}

export interface PaymentAnalysisResult {
  id: string;
  amount: number;
  recipientName: string;
  upiId: string;
  paymentType: 'Send Money' | 'Collect Request' | 'Refund' | 'QR Payment';
  isNewRecipient: boolean;
  riskScore: number;
  riskLevel: RiskLevel;
  contributingFactors: PaymentRiskFactor[];
  recommendedAction: string;
  analyzedAt: string;
  scamDna?: Record<string, any>;
  multiEvidenceMatch?: Record<string, number>;
}

export interface CallTimelineEvent {
  timestamp: string; // e.g. "00:18"
  seconds: number;
  label: string;
  signalType: 'urgency' | 'impersonation' | 'otp_request' | 'remote_access' | 'threat' | 'neutral';
  snippet: string;
}

export interface CallTranscriptLine {
  speaker: 'Caller' | 'User';
  text: string;
  timestamp: string;
  isSuspicious?: boolean;
  highlightCategory?: string;
}

export interface CallSuspiciousIndicator {
  id: string;
  label: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  quote?: string;
}

export interface CallAnalysisResult {
  id: string;
  fileName: string;
  duration: string;
  riskScore: number;
  riskLevel: RiskLevel;
  scamCategory?: string;
  detectedSignals: string[];
  suspiciousIndicators?: CallSuspiciousIndicator[];
  timeline: CallTimelineEvent[];
  transcript: CallTranscriptLine[];
  summary: string;
  recommendedAction: string;
  analyzedAt: string;
  similarReports?: CommunityReport[];
  scamDna?: Record<string, any>;
  multiEvidenceMatch?: Record<string, number>;
}

export interface ScamPattern {
  id: string;
  name: string;
  category: ScamCategory | string;
  description: string;
  commonSigns: string[];
  detectionPhrases: string[];
  warningIndicators: string[];
  reportsCount: number;
  status: 'Verified Pattern' | 'Under Review';
  riskLevel: RiskLevel;
  trend: 'Rising' | 'Stable' | 'Declining';
  // UI convenience aliases
  warningSigns?: string[];
  recommendedPrevention?: string[];
  realWorldExample?: string;
}

export type ActiveView = 
  | 'landing'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'message-analyzer'
  | 'scam-analyzer'
  | 'payment-analyzer'
  | 'call-analyzer'
  | 'community-feed'
  | 'similar-scams'
  | 'report-scam'
  | 'scam-intelligence'
  | 'scam-patterns'
  | 'emerging-scams'
  | 'my-history'
  | 'my-reports'
  | 'profile'
  | 'settings'
  ;
