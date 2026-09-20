import { CommunityReport, ScamCategory, RiskLevel, EvidenceItem, ReportComment } from '../types';
import { MOCK_COMMUNITY_REPORTS } from '../mock/mockData';
import { authService } from './authService';
import { apiPost } from './apiClient';

const STORAGE_KEY = 'scamshield_community_reports';
const CONFIRMATIONS_KEY = 'scamshield_user_confirmations';

export interface SubmitReportPayload {
  category: ScamCategory;
  title: string;
  description: string;
  approximateAmountLost?: number;
  paymentMethod?: string;
  rawUpiId?: string;
  rawPhone?: string;
  rawAccount?: string;
  evidence: EvidenceItem[];
}

export const maskSensitiveData = {
  phone(phone: string): string {
    if (!phone) return '';
    const cleaned = phone.trim();
    const hasPlus = cleaned.startsWith('+');
    const digits = cleaned.replace(/\D/g, '');
    if (digits.length >= 10) {
      const last10 = digits.slice(-10);
      const firstTwo = last10.slice(0, 2);
      const lastTwo = last10.slice(-2);
      const maskedCore = `${firstTwo}XXXXXX${lastTwo}`;
      if (cleaned.startsWith('+91') || (hasPlus && digits.length > 10)) {
        return `+91 ${maskedCore}`;
      }
      return maskedCore;
    }
    if (digits.length >= 4) {
      return `${digits.slice(0, 2)}XXXX${digits.slice(-2)}`;
    }
    return 'XXXXXXXXXX';
  },

  upi(upi: string): string {
    if (!upi) return '';
    const cleaned = upi.trim();
    if (!cleaned.includes('@')) return 'pa****@upi';
    const [handle, vpa] = cleaned.split('@');
    const firstTwo = handle.slice(0, 2);
    return `${firstTwo}****@${vpa || 'upi'}`;
  },

  account(acc: string): string {
    if (!acc) return '';
    const digits = acc.replace(/\D/g, '');
    if (digits.length <= 4) return 'XXXXXXXX';
    const lastFour = digits.slice(-4);
    return `XXXXXXXX${lastFour}`;
  },

  email(email: string): string {
    if (!email || !email.includes('@')) return 'us****@domain.com';
    const [name, domain] = email.split('@');
    const firstTwo = name.slice(0, 2);
    return `${firstTwo}****@${domain}`;
  },

  otp(otpStr: string): string {
    return '[OTP: ******]';
  },

  address(addr: string): string {
    return '[MASKED ADDRESS]';
  },

  sanitizeText(text: string): string {
    if (!text) return '';
    let result = text;

    // 1. Phone numbers:
    // Matches +91 98765 43210, +91-9876543210, 98765 43210, 9876543210
    result = result.replace(/(\+91[\s-]?)?([6-9]\d{1})[\s-]?(\d{3})[\s-]?(\d{3})[\s-]?(\d{2})\b/g, (match, p1, p2, p3, p4, p5) => {
      return (p1 ? '+91 ' : '') + `${p2}XXXXXX${p5}`;
    });
    result = result.replace(/(\+91[\s-]?)?([6-9]\d{9})\b/g, (match, p1, p2) => {
      const firstTwo = p2.slice(0, 2);
      const lastTwo = p2.slice(-2);
      return (p1 ? '+91 ' : '') + `${firstTwo}XXXXXX${lastTwo}`;
    });

    // 2. UPI IDs:
    // Matches paytm-refund@okaxis, john123@icici, etc.
    result = result.replace(/\b([a-zA-Z0-9.\-_]{2})[a-zA-Z0-9.\-_]*@([a-zA-Z0-9]+)\b/g, '$1****@$2');

    // 3. Email addresses:
    result = result.replace(/\b([a-zA-Z0-9._%+-]{2})[a-zA-Z0-9._%+-]*@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g, '$1****@$2');

    // 4. Bank account numbers:
    result = result.replace(/\b(A\/C|acct|account|acc(?:\s+no)?)\s*[:#-]?\s*(\d{8,18})\b/gi, (match, prefix, accNum) => {
      const lastFour = accNum.slice(-4);
      return `${prefix} XXXXXXXX${lastFour}`;
    });

    // 5. OTPs / Verification codes / Passwords / PINs:
    result = result.replace(/\b(otp|one[-\s]?time[-\s]?password|code|verification[-\s]?code)\s*[:#-]?\s*(\d{4,8})\b/gi, '$1 [OTP: ******]');
    result = result.replace(/\b(pin|upi[-\s]?pin|mpin|password|secret|passcode)\s*[:#-]?\s*([A-Za-z0-9@#$%^&*]{4,16})\b/gi, '$1 [CONFIDENTIAL CREDENTIAL MASKED]');

    // 6. Personal addresses / Pincodes:
    result = result.replace(/\b(pin\s*code|pincode|postal\s*code|zip\s*code)\s*[:#-]?\s*(\d{6})\b/gi, '$1 [PIN: ******]');
    result = result.replace(/\b(Flat|House|Door|Plot|Apartment|Building)\s+No\.?\s*[A-Za-z0-9\/-]+/gi, '[MASKED ADDRESS]');

    return result;
  }
};

export const communityService = {
  getReports(): CommunityReport[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: CommunityReport[] = JSON.parse(stored);
        // Ensure that mock reports have the enriched fields from MOCK_COMMUNITY_REPORTS
        return parsed.map((report) => {
          const mockMatch = MOCK_COMMUNITY_REPORTS.find(m => m.id === report.id || m.ticketNumber === report.ticketNumber);
          if (mockMatch) {
            return {
              ...mockMatch,
              ...report,
              reporter: report.reporter || mockMatch.reporter,
              dateFormatted: report.dateFormatted || mockMatch.dateFormatted,
              timeFormatted: report.timeFormatted || mockMatch.timeFormatted,
              aiAnalysis: report.aiAnalysis || mockMatch.aiAnalysis,
              riskIndicators: report.riskIndicators || mockMatch.riskIndicators,
              comments: report.comments && report.comments.length > 0 ? report.comments : mockMatch.comments,
              upvotes: Math.max(report.upvotes || 0, mockMatch.upvotes || 0)
            };
          }
          // Default reporter for user-created reports if missing
          if (!report.reporter) {
            report.reporter = {
              name: 'Citizen Reporter',
              badge: 'Community Member',
              trustScore: 90,
              reportsSubmitted: 1,
              location: 'India'
            };
          }
          if (!report.comments) {
            report.comments = [];
          }
          return report;
        });
      } catch {
        // fallback
      }
    }
    return MOCK_COMMUNITY_REPORTS;
  },

  getAllReports(): CommunityReport[] {
    return this.getReports();
  },

  hasConfirmed(id: string): boolean {
    const user = authService.getCurrentUser();
    if (!user?.id || user.id === 'anonymous') return false;
    try {
      const map = JSON.parse(localStorage.getItem(CONFIRMATIONS_KEY) || '{}') as Record<string, string[]>;
      return (map[user.id] || []).includes(id);
    } catch {
      return false;
    }
  },

  async confirmReportAsync(id: string): Promise<CommunityReport | undefined> {
    try {
      const updated = await apiPost<CommunityReport>(`/api/reports/${encodeURIComponent(id)}/confirm`);
      const reports = this.getReports();
      const index = reports.findIndex((r) => r.id === id);
      if (index >= 0) { reports[index] = { ...reports[index], ...updated }; this.saveReports(reports); }
      return updated;
    } catch {
      return this.confirmReport(id);
    }
  },

  upvoteReport(id: string): CommunityReport | undefined {
    return this.confirmReport(id);
  },

  confirmReport(id: string): CommunityReport | undefined {
    const user = authService.getCurrentUser();
    if (!user?.id || user.id === 'anonymous') return undefined;
    const normalizedId = id.trim().toLowerCase();
    try {
      const map = JSON.parse(localStorage.getItem(CONFIRMATIONS_KEY) || '{}') as Record<string, string[]>;
      const confirmed = map[user.id] || [];
      if (confirmed.includes(normalizedId)) return this.getReportById(id);

      const reports = this.getReports();
      const report = reports.find(
        r => r.id.toLowerCase() === normalizedId ||
             r.ticketNumber.toLowerCase() === normalizedId ||
             r.ticketNumber.replace('#', '').toLowerCase() === normalizedId.replace('#', '')
      );
      if (!report) return undefined;

      report.upvotes = (report.upvotes || 0) + 1;
      report.similarReportsCount = (report.similarReportsCount || 0) + 1;
      this.saveReports(reports);
      map[user.id] = [...confirmed, normalizedId];
      localStorage.setItem(CONFIRMATIONS_KEY, JSON.stringify(map));
      return report;
    } catch {
      return undefined;
    }
  },

  addComment(
    reportId: string,
    commentPayload: {
      authorName: string;
      content: string;
      authorAvatar?: string;
      authorBadge?: string;
    }
  ): ReportComment | undefined {
    const reports = this.getReports();
    const cleanId = reportId.trim().toLowerCase();
    const report = reports.find(
      r => r.id.toLowerCase() === cleanId || 
           r.ticketNumber.toLowerCase() === cleanId ||
           r.ticketNumber.replace('#', '').toLowerCase() === cleanId.replace('#', '')
    );
    if (!report) return undefined;

    const newComment: ReportComment = {
      id: `comment-${Date.now()}`,
      reportId: report.id,
      authorName: commentPayload.authorName || 'Citizen Sentinel',
      authorAvatar: commentPayload.authorAvatar,
      authorBadge: commentPayload.authorBadge || 'Verified Citizen',
      createdAt: new Date().toISOString(),
      relativeTime: 'Just now',
      content: commentPayload.content,
      upvotes: 1,
      userUpvoted: true
    };

    if (!report.comments) {
      report.comments = [];
    }
    report.comments.unshift(newComment);
    this.saveReports(reports);
    return newComment;
  },

  maskSensitiveData(text: string): string {
    return text
      .replace(/(\+?91[\s-]?)?[6-9]\d{9}/g, '+91 98*** **210')
      .replace(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+/g, 'usr***@bank');
  },

  maskPhoneNumber(phone: string): string {
    return maskSensitiveData.phone(phone);
  },

  maskUpiId(upi: string): string {
    return maskSensitiveData.upi(upi);
  },

  createReport(payload: {
    title: string;
    scamType: string;
    channel: string;
    amountLost?: number;
    description: string;
    phoneReported?: string;
    upiReported?: string;
  }): CommunityReport {
    const reports = this.getReports();
    const newReport: CommunityReport = {
      id: `rep-${Date.now()}`,
      ticketNumber: `#${1043 + reports.length - MOCK_COMMUNITY_REPORTS.length}`,
      category: (payload.scamType as ScamCategory) || 'KYC Impersonation',
      title: payload.title,
      description: payload.description,
      reportedAt: new Date().toISOString(),
      relativeTime: 'Just now',
      dateFormatted: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      timeFormatted: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      similarityConfidence: 92,
      reporter: {
        name: 'You (Citizen Sentinel)',
        badge: 'Verified Citizen',
        trustScore: 95,
        reportsSubmitted: 1,
        location: 'India'
      },
      approximateAmountLost: payload.amountLost || 0,
      paymentMethod: 'UPI',
      maskedUpiId: payload.upiReported ? maskSensitiveData.upi(payload.upiReported) : undefined,
      maskedPhone: payload.phoneReported ? maskSensitiveData.phone(payload.phoneReported) : undefined,
      evidence: [],
      status: 'pending',
      riskLevel: 'high',
      confidenceScore: 92,
      similarReportsCount: 1,
      scamType: payload.scamType,
      channel: payload.channel,
      phoneReported: payload.phoneReported ? maskSensitiveData.phone(payload.phoneReported) : undefined,
      upiReported: payload.upiReported ? maskSensitiveData.upi(payload.upiReported) : undefined,
      amountLost: payload.amountLost || 0,
      upvotes: 1,
      createdAt: 'Just now',
      comments: []
    };
    const updated = [newReport, ...reports];
    this.saveReports(updated);
    return newReport;
  },

  saveReports(reports: CommunityReport[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  },

  getReportById(id: string): CommunityReport | undefined {
    const cleanId = id.trim().toLowerCase();
    return this.getReports().find(
      r => r.id.toLowerCase() === cleanId || 
           r.ticketNumber.toLowerCase() === cleanId ||
           r.ticketNumber.replace('#', '').toLowerCase() === cleanId.replace('#', '')
    );
  },

  getMatchingReportForAnalysis(category?: string, queryText?: string): CommunityReport {
    const reports = this.getReports();
    if (!category && !queryText) {
      return reports[0] || MOCK_COMMUNITY_REPORTS[0];
    }

    const cat = (category || '').toLowerCase();
    const text = (queryText || '').toLowerCase();

    // 1. Exact or related category match
    if (cat.includes('kyc') || cat.includes('yono') || text.includes('sbi') || text.includes('pan')) {
      const match = reports.find(r => r.id === 'rep-1042' || r.ticketNumber === '#1042');
      if (match) return match;
    }
    if (cat.includes('refund') || text.includes('refund') || text.includes('swiggy') || text.includes('collect')) {
      const match = reports.find(r => r.id === 'rep-1041' || r.ticketNumber === '#1041');
      if (match) return match;
    }
    if (cat.includes('qr') || text.includes('qr') || text.includes('olx') || text.includes('army')) {
      const match = reports.find(r => r.id === 'rep-1040' || r.ticketNumber === '#1040');
      if (match) return match;
    }
    if (cat.includes('electricity') || text.includes('electricity') || text.includes('bill') || text.includes('power')) {
      const match = reports.find(r => r.id === 'rep-1039' || r.ticketNumber === '#1039');
      if (match) return match;
    }
    if (cat.includes('remote') || text.includes('anydesk') || text.includes('teamviewer') || text.includes('airtel')) {
      const match = reports.find(r => r.id === 'rep-1038' || r.ticketNumber === '#1038');
      if (match) return match;
    }
    if (cat.includes('job') || text.includes('telegram') || text.includes('youtube') || text.includes('task')) {
      const match = reports.find(r => r.id === 'rep-1037' || r.ticketNumber === '#1037');
      if (match) return match;
    }
    if (cat.includes('bank') || text.includes('hdfc') || text.includes('card')) {
      const match = reports.find(r => r.id === 'rep-1036' || r.ticketNumber === '#1036');
      if (match) return match;
    }

    // Try matching any report by category
    const catMatch = reports.find(r => r.category.toLowerCase().includes(cat));
    if (catMatch) return catMatch;

    // Default to #1042 as primary benchmark report
    return reports.find(r => r.ticketNumber === '#1042') || reports[0] || MOCK_COMMUNITY_REPORTS[0];
  },

  searchReports(params: {
    query?: string;
    category?: ScamCategory | 'All';
    riskLevel?: RiskLevel | 'All';
    status?: 'all' | 'verified' | 'pending';
  }): CommunityReport[] {
    const reports = this.getReports();
    return reports.filter(r => {
      if (params.category && params.category !== 'All' && r.category !== params.category) {
        return false;
      }
      if (params.riskLevel && params.riskLevel !== 'All' && r.riskLevel !== params.riskLevel) {
        return false;
      }
      if (params.status && params.status !== 'all' && r.status !== params.status) {
        return false;
      }
      if (params.query) {
        const q = params.query.toLowerCase();
        const matchTitle = r.title.toLowerCase().includes(q);
        const matchDesc = r.description.toLowerCase().includes(q);
        const matchCategory = r.category.toLowerCase().includes(q);
        const matchTicket = r.ticketNumber.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCategory && !matchTicket) {
          return false;
        }
      }
      return true;
    });
  },

  submitReport(payload: SubmitReportPayload): Promise<CommunityReport> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reports = this.getReports();
        const nextTicketNum = `#${1043 + reports.length - MOCK_COMMUNITY_REPORTS.length}`;

        const newReport: CommunityReport = {
          id: `rep-${Date.now()}`,
          ticketNumber: nextTicketNum,
          category: payload.category,
          title: payload.title,
          description: payload.description,
          reportedAt: new Date().toISOString(),
          relativeTime: 'Just now',
          approximateAmountLost: payload.approximateAmountLost || 0,
          paymentMethod: payload.paymentMethod || 'UPI',
          maskedUpiId: payload.rawUpiId ? maskSensitiveData.upi(payload.rawUpiId) : undefined,
          maskedPhone: payload.rawPhone ? maskSensitiveData.phone(payload.rawPhone) : undefined,
          maskedAccount: payload.rawAccount ? maskSensitiveData.account(payload.rawAccount) : undefined,
          evidence: payload.evidence,
          status: 'pending',
          riskLevel: 'high',
          confidenceScore: 92,
          similarReportsCount: Math.floor(Math.random() * 15) + 3,
          moderationSignals: {
            duplicateEvidenceScore: 4,
            contradictoryDescription: false,
            repeatedSubmissions: false,
            suspiciousMetadata: false,
            aiRecommendation: 'Manual Review Required'
          }
        };

        const updated = [newReport, ...reports];
        this.saveReports(updated);
        resolve(newReport);
      }, 500);
    });
  },

  getSimilarReports(category: string): CommunityReport[] {
    return this.getReports()
      .filter(r => r.category.toLowerCase().includes(category.toLowerCase()))
      .slice(0, 4);
  }
};
