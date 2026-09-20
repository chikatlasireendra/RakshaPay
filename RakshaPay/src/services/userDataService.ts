import { User, UserHistoryItem, UserNotification, CommunityReport, RiskLevel } from '../types';

// Storage key helpers for user-isolated data
const getHistoryKey = (userId: string) => `users/${userId}/history`;
const getReportsKey = (userId: string) => `users/${userId}/reports`;
const getNotificationsKey = (userId: string) => `users/${userId}/notifications`;
const getCommentsKey = (userId: string) => `users/${userId}/comments`;

// Realistic sample data exclusively for DEMO USER
const DEMO_HISTORY: UserHistoryItem[] = [
  {
    id: 'scan-109',
    date: 'Sep 18, 2026 • 14:32',
    type: 'Message',
    title: 'SBI Yono Account Block Notice SMS',
    query: 'SBI Yono Account Block Notice: Dear customer your SBI Netbanking will be blocked...',
    riskLevel: 'high',
    riskScore: 91,
    category: 'KYC Impersonation',
    actionTaken: 'Ignored and reported to community'
  },
  {
    id: 'scan-108',
    date: 'Sep 17, 2026 • 18:15',
    type: 'Payment',
    title: 'Swiggy Refund Collect Request ₹2,499',
    query: '₹25,000 Collect Request from SWIGGY_REFUND_NODE (refund_claim@okaxis)',
    riskLevel: 'high',
    riskScore: 88,
    category: 'Fake Refund',
    actionTaken: 'Declined UPI mandate'
  },
  {
    id: 'scan-107',
    date: 'Sep 15, 2026 • 11:04',
    type: 'Call',
    title: 'Incoming Call from "Airtel Technical Support"',
    query: 'Audio Recording from +91 98112 34567 claiming Airtel 5G SIM block',
    riskLevel: 'caution',
    riskScore: 62,
    category: 'Remote Access Scam',
    actionTaken: 'Call terminated after 45s'
  },
  {
    id: 'scan-106',
    date: 'Sep 12, 2026 • 09:40',
    type: 'Message',
    title: 'Mahavitaran Power Bill Notice Due Sep 25',
    query: 'Mahavitaran Electricity Bill Notice: Dear consumer electricity bill ₹450 due...',
    riskLevel: 'low',
    riskScore: 8,
    category: 'Legitimate Notice',
    actionTaken: 'Paid via official portal'
  },
  {
    id: 'scan-105',
    date: 'Sep 08, 2026 • 19:22',
    type: 'Payment',
    title: 'Grocery Transfer to Nature Fresh Grocers',
    query: '₹450 Grocery Transfer to Nature Fresh Grocers (naturefresh@okhdfcbank)',
    riskLevel: 'low',
    riskScore: 12,
    category: 'Merchant Payment',
    actionTaken: 'Authorized successfully'
  }
];

const DEMO_REPORTS: CommunityReport[] = [
  {
    id: 'rep-demo-1',
    ticketNumber: '#1040',
    category: 'KYC Impersonation',
    title: 'Fake SBI Yono APK & Account Suspension SMS',
    description: 'Received SMS threatening account deactivation within 12 hours unless APK installed.',
    reportedAt: '2026-09-17T10:00:00Z',
    relativeTime: '2 days ago',
    approximateAmountLost: 0,
    paymentMethod: 'UPI',
    maskedUpiId: 'sbi-update****@okhdfc',
    maskedPhone: '+91 98XXXXXX10',
    evidence: [],
    status: 'verified',
    riskLevel: 'high',
    confidenceScore: 96,
    similarReportsCount: 14,
    upvotes: 14
  },
  {
    id: 'rep-demo-2',
    ticketNumber: '#1041',
    category: 'Fake Refund',
    title: 'Swiggy Refund Collect Request Trap ₹2,499',
    description: 'Customer care fraud initiated reverse collect request claiming meal delivery refund.',
    reportedAt: '2026-09-16T15:30:00Z',
    relativeTime: '3 days ago',
    approximateAmountLost: 2499,
    paymentMethod: 'UPI',
    maskedUpiId: 'refund-claim****@axis',
    maskedPhone: '+91 91XXXXXX45',
    evidence: [],
    status: 'verified',
    riskLevel: 'high',
    confidenceScore: 94,
    similarReportsCount: 28,
    upvotes: 28
  },
  {
    id: 'rep-demo-3',
    ticketNumber: '#1042',
    category: 'Remote Access Scam',
    title: 'Airtel Customer Service AnyDesk SIM Swap Attempt',
    description: 'Caller asked to install AnyDesk to complete 5G e-SIM upgrade.',
    reportedAt: '2026-09-14T11:20:00Z',
    relativeTime: '5 days ago',
    approximateAmountLost: 0,
    paymentMethod: 'UPI',
    maskedPhone: '+91 97XXXXXX88',
    evidence: [],
    status: 'pending',
    riskLevel: 'high',
    confidenceScore: 89,
    similarReportsCount: 5,
    upvotes: 5
  }
];

const DEMO_NOTIFICATIONS: UserNotification[] = [
  {
    id: 'n1',
    text: 'New scam pattern: Mahavitaran 9:30 PM power cutoff SMS flagged.',
    time: '12m ago',
    unread: true,
    type: 'alert'
  },
  {
    id: 'n2',
    text: 'Your community report #1040 (KYC Impersonation) was approved by moderators.',
    time: '2h ago',
    unread: true,
    type: 'update'
  },
  {
    id: 'n3',
    text: 'Security Advisory: Surge in fake airline cancellation phone numbers.',
    time: '1d ago',
    unread: false,
    type: 'system'
  }
];

const isDemoUser = (userId: string, email?: string): boolean => {
  return userId === 'usr-demo' || email === 'demo@scamshield.app';
};

export const userDataService = {
  // 1. ANALYSIS & SCAN HISTORY
  getUserHistory(userId: string, email?: string): UserHistoryItem[] {
    const key = getHistoryKey(userId);
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // ignore
      }
    }

    // Demo account gets realistic sample data; all new accounts get empty []
    if (isDemoUser(userId, email)) {
      this.setUserHistory(userId, DEMO_HISTORY);
      return DEMO_HISTORY;
    }

    return [];
  },

  setUserHistory(userId: string, items: UserHistoryItem[]): void {
    localStorage.setItem(getHistoryKey(userId), JSON.stringify(items));
  },

  addHistoryItem(userId: string, item: Omit<UserHistoryItem, 'id' | 'date'> & { date?: string }): UserHistoryItem {
    const current = this.getUserHistory(userId);
    const now = new Date();
    const dateFormatted = item.date || `${now.toLocaleString('default', { month: 'short' })} ${now.getDate()}, ${now.getFullYear()} • ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`;
    
    const newItem: UserHistoryItem = {
      ...item,
      id: `scan-${Date.now().toString().slice(-4)}`,
      date: dateFormatted,
      title: item.title || item.query.slice(0, 45)
    };

    const updated = [newItem, ...current];
    this.setUserHistory(userId, updated);
    return newItem;
  },

  // 2. COMMUNITY REPORTS (SUBMITTED BY USER)
  getUserReports(userId: string, email?: string): CommunityReport[] {
    const key = getReportsKey(userId);
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // ignore
      }
    }

    if (isDemoUser(userId, email)) {
      this.setUserReports(userId, DEMO_REPORTS);
      return DEMO_REPORTS;
    }

    return [];
  },

  setUserReports(userId: string, reports: CommunityReport[]): void {
    localStorage.setItem(getReportsKey(userId), JSON.stringify(reports));
  },

  addUserReport(userId: string, report: CommunityReport): void {
    const current = this.getUserReports(userId);
    const updated = [report, ...current];
    this.setUserReports(userId, updated);
  },

  // 3. NOTIFICATIONS
  getUserNotifications(userId: string, email?: string): UserNotification[] {
    const key = getNotificationsKey(userId);
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // ignore
      }
    }

    if (isDemoUser(userId, email)) {
      this.setUserNotifications(userId, DEMO_NOTIFICATIONS);
      return DEMO_NOTIFICATIONS;
    }

    return [];
  },

  setUserNotifications(userId: string, notifications: UserNotification[]): void {
    localStorage.setItem(getNotificationsKey(userId), JSON.stringify(notifications));
  },

  markNotificationRead(userId: string, notificationId: string): void {
    const list = this.getUserNotifications(userId);
    const updated = list.map(n => n.id === notificationId ? { ...n, unread: false } : n);
    this.setUserNotifications(userId, updated);
  },

  markAllNotificationsRead(userId: string): void {
    const list = this.getUserNotifications(userId);
    const updated = list.map(n => ({ ...n, unread: false }));
    this.setUserNotifications(userId, updated);
  },

  // 4. COMMENTS (ISOLATED)
  getUserComments(userId: string): any[] {
    const key = getCommentsKey(userId);
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return [];
  },

  setUserComments(userId: string, comments: any[]): void {
    localStorage.setItem(getCommentsKey(userId), JSON.stringify(comments));
  },

  // 5. USER METRICS & STATS
  getUserStats(user: User): {
    analysesCount: number;
    reportsSubmitted: number;
    reportsVerified: number;
    confirmedThreats: number;
    trustIndex: number | null;
    riskBreakdown: {
      lowRisk: number;
      caution: number;
      highRisk: number;
      protectedValueAvoided: number;
    };
  } {
    const isDemo = isDemoUser(user.id, user.email);
    const history = this.getUserHistory(user.id, user.email);
    const reports = this.getUserReports(user.id, user.email);

    if (isDemo) {
      return {
        analysesCount: 14,
        reportsSubmitted: 3,
        reportsVerified: 2,
        confirmedThreats: 2,
        trustIndex: 98,
        riskBreakdown: {
          lowRisk: 8,
          caution: 3,
          highRisk: 2,
          protectedValueAvoided: 27499
        }
      };
    }

    // NEW USER: strictly compute from actual user activity or start at 0
    const verifiedReports = reports.filter(r => r.status === 'verified').length;
    const lowRiskCount = history.filter(h => h.riskLevel === 'low').length;
    const cautionCount = history.filter(h => h.riskLevel === 'caution').length;
    const highRiskCount = history.filter(h => h.riskLevel === 'high').length;

    return {
      analysesCount: history.length,
      reportsSubmitted: reports.length,
      reportsVerified: verifiedReports,
      confirmedThreats: verifiedReports,
      // DO NOT invent a score for new accounts
      trustIndex: user.trustScore ?? null,
      riskBreakdown: {
        lowRisk: lowRiskCount,
        caution: cautionCount,
        highRisk: highRiskCount,
        protectedValueAvoided: 0
      }
    };
  }
};
