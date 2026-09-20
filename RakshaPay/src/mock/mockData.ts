import { User, CommunityReport, ScamPattern } from '../types';

// Quick-fill scenarios used by the Message Analyzer.
export const SAMPLE_SCENARIOS = {
  kycScam: 'URGENT: Your bank KYC has expired. Your account will be blocked today by 8:00 PM. Click here to update immediately: http://bit.ly/sbi-kyc-update-portal to avoid suspension. Do not ignore.',
  fakeRefund: 'Dear Customer, your refund of ₹2,499 for Swiggy Order #84912 has been processed. Pay ₹999 refundable server processing charge via UPI to receive your total ₹3,498 credit into your bank account immediately.',
  bankImpersonation: 'Security alert: an unauthorized debit was detected on your bank account. Send the cancellation code immediately or your debit card will be blocked.',
  normalMessage: 'Your grocery order has been delivered. Thank you for shopping with us. You can view the receipt in the official app.'
};

export const MOCK_USERS: User[] = [
  {
    id: 'usr-demo',
    name: 'Aarav Patel',
    email: 'demo@scamshield.app',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    phoneNumber: '+91 98765 43210',
    trustScore: 98,
    createdAt: '2025-11-12',
    analysesCount: 14,
    reportsSubmitted: 3,
    reportsVerified: 2,
    confirmedThreatsCount: 2,
    savedPatterns: ['pattern-kyc', 'pattern-refund', 'pattern-bank']
  },
  {
    id: 'usr-1',
    name: 'Aarav Patel',
    email: 'aarav.patel@example.com',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    createdAt: '2025-11-12',
    analysesCount: 14,
    reportsSubmitted: 3,
    reportsVerified: 2,
    savedPatterns: ['pattern-kyc', 'pattern-refund']
  },
  {
    id: 'usr-2',
    name: 'Priya Sharma',
    email: 'priya.s@example.com',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    createdAt: '2025-12-05',
    analysesCount: 22,
    reportsSubmitted: 5,
    reportsVerified: 4,
    savedPatterns: ['pattern-qr', 'pattern-otp']
  },
  {
    id: 'usr-3',
    name: 'Rajesh Kumar',
    email: 'rajesh.k@example.com',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    createdAt: '2026-01-10',
    analysesCount: 8,
    reportsSubmitted: 1,
    reportsVerified: 1,
    savedPatterns: ['pattern-electricity']
  },
  {
    id: 'usr-4',
    name: 'Ananya Verma',
    email: 'ananya.v@example.com',
    role: 'user',
    createdAt: '2026-01-28',
    analysesCount: 5,
    reportsSubmitted: 2,
    reportsVerified: 1,
    savedPatterns: ['pattern-job']
  },
];

export const MOCK_SCAM_PATTERNS: ScamPattern[] = [
  {
    id: 'pattern-kyc',
    name: 'KYC Expiry & Suspension Phishing',
    category: 'KYC Impersonation',
    description: 'Fraudsters send SMS/WhatsApp warnings claiming your bank account or payment wallet KYC is expiring immediately, threatening suspension unless you click an external APK/phishing link.',
    commonSigns: [
      'Claims account will be blocked within 24 hours',
      'Sends unverified short-links (e.g., bit.ly, tinyurl, apk downloads)',
      'Requires entering PAN, Aadhaar, debit card details, or UPI PIN',
      'Caller poses as bank nodal officer or verification agent'
    ],
    detectionPhrases: [
      'Your KYC has expired',
      'Account will be blocked today',
      'Update immediately',
      'Click here to complete KYC',
      'Document re-verification pending'
    ],
    warningIndicators: [
      'Urgent 24-hour deadline',
      'Suspicious web domain outside official bank portal',
      'Request for OTP or PIN to "verify identity"'
    ],
    reportsCount: 128,
    status: 'Verified Pattern',
    riskLevel: 'high',
    trend: 'Rising'
  },
  {
    id: 'pattern-refund',
    name: 'Fake E-Commerce / Order Refund Processing Fee',
    category: 'Fake Refund',
    description: 'Impersonates delivery partners or merchant support (Amazon, Flipkart, Swiggy) claiming an overcharge or failed delivery refund requires clicking a payment link or scanning a QR code.',
    commonSigns: [
      'Claims you need to pay ₹1 or ₹999 refundable processing fee',
      'Sends a UPI collect request under the guise of "receiving" money',
      'Instructs you to enter UPI PIN to receive money (entering PIN always debits)',
      'Sends fake refund invoice screenshot'
    ],
    detectionPhrases: [
      'Refund approved click to receive',
      'Processing fee ₹999 required',
      'Accept collect request to credit refund',
      'Scan QR to get instant cashback'
    ],
    warningIndicators: [
      'Collect request marked as "Refund"',
      'Entering PIN asked when receiving funds',
      'Calls from personal mobile numbers instead of registered IVR'
    ],
    reportsCount: 94,
    status: 'Verified Pattern',
    riskLevel: 'high',
    trend: 'Rising'
  },
  {
    id: 'pattern-bank',
    name: 'Bank Official Impersonation & Security Alert',
    category: 'Bank Impersonation',
    description: 'Callers impersonate bank fraud department executives warning of an "unauthorized international transaction" and asking to verify details to cancel it.',
    commonSigns: [
      'Caller sounds professional with simulated office background sounds',
      'Mentions your partial name and bank name obtained from data leaks',
      'Urges you to quickly cancel a pending ₹45,000 debit',
      'Asks for the cancellation OTP received on your phone'
    ],
    detectionPhrases: [
      'Calling from your bank fraud detection unit',
      'Unauthorized transaction of ₹45,000 detected',
      'Tell me the verification code to cancel the debit',
      'Your debit card is compromised'
    ],
    warningIndicators: [
      'Caller insists OTP is for cancellation',
      'High psychological pressure and rush tactics',
      'Spoofed caller ID or random mobile numbers'
    ],
    reportsCount: 87,
    status: 'Verified Pattern',
    riskLevel: 'high',
    trend: 'Stable'
  },
  {
    id: 'pattern-qr',
    name: 'Marketplace "Scan QR to Receive Money" Fraud',
    category: 'QR Code Scam',
    description: 'Buyers on OLX, Facebook Marketplace, or housing rental portals pretend to be military personnel or distant buyers who send a QR code claiming it will transfer money into your account.',
    commonSigns: [
      'Buyer accepts your price immediately without negotiation',
      'Claims to use Indian Army or Defence payment gateway',
      'Sends a QR code telling you to "Scan and approve in Google Pay / PhonePe"',
      'Claims "First ₹1 test transfer then full amount"'
    ],
    detectionPhrases: [
      'Scan this QR code to receive money',
      'Army account payment gateway QR',
      'Enter your PIN to verify receiving account',
      'I have generated receiver QR code'
    ],
    warningIndicators: [
      'QR code contains a debit UPI intent URL',
      'Insistence that scanning QR receives payment (QR only sends payments)'
    ],
    reportsCount: 76,
    status: 'Verified Pattern',
    riskLevel: 'high',
    trend: 'Declining'
  },
  {
    id: 'pattern-remote',
    name: 'Remote Desktop Support Hijacking',
    category: 'Remote Access Scam',
    description: 'Scammers instruct victims to install remote desktop apps (AnyDesk, TeamViewer, RustDesk) under the pretext of technical support or KYC resolution, then capture banking screens and credentials.',
    commonSigns: [
      'Directs victim to Play Store to install AnyDesk or QuickSupport',
      'Asks for the 9-digit remote access code',
      'Instructs victim to open banking app while screen is shared',
      'Blacks out screen or tells victim not to touch the screen'
    ],
    detectionPhrases: [
      'Download AnyDesk from Play Store',
      'Read out the 9-digit code',
      'Our senior engineer will fix it remotely',
      'Keep the app open and approve permission'
    ],
    warningIndicators: [
      'Request to install third-party screen sharing tool',
      'Asking to access banking portal while screen is active'
    ],
    reportsCount: 65,
    status: 'Verified Pattern',
    riskLevel: 'high',
    trend: 'Stable'
  },
  {
    id: 'pattern-electricity',
    name: 'Fake Electricity Disconnection Warning',
    category: 'Electricity Bill Scam',
    description: 'Bulk SMS claiming electricity power will be disconnected at 9:30 PM tonight due to unpaid bill, providing an unverified helpline number to pay immediately.',
    commonSigns: [
      'Specific panic deadline: "electricity will be disconnected tonight at 9:30 PM"',
      'Contains mobile number for "Electricity Officer / SDO"',
      'Real state boards never send disconnection notices via personal numbers without consumer CA number'
    ],
    detectionPhrases: [
      'Electricity connection will be disconnected',
      'Previous month bill was not updated',
      'Contact our electricity officer immediately',
      'Pay immediately to prevent blackout'
    ],
    warningIndicators: [
      'No consumer account number mentioned',
      'Sent from personal 10-digit mobile number, not official government SMS header'
    ],
    reportsCount: 112,
    status: 'Verified Pattern',
    riskLevel: 'high',
    trend: 'Rising'
  },
  {
    id: 'pattern-otp',
    name: 'Accidental Transfer / Wrong OTP Social Engineering',
    category: 'OTP Scam',
    description: 'Scammer calls claiming they mistakenly entered your phone number during money transfer or login, pleading for the OTP just arrived on your phone.',
    commonSigns: [
      'Caller sounds apologetic or in tears',
      'Urges you to read out a 6-digit code received via SMS',
      'The SMS is actually a bank password reset or UPI onboarding OTP'
    ],
    detectionPhrases: [
      'I mistakenly sent my OTP to your number',
      'Please read the 6 digits I am a student',
      'Forward that message to me urgently'
    ],
    warningIndicators: [
      'SMS header clearly states "Do not share OTP with anyone including bank staff"'
    ],
    reportsCount: 54,
    status: 'Verified Pattern',
    riskLevel: 'high',
    trend: 'Declining'
  },
  {
    id: 'pattern-job',
    name: 'Part-Time Telegram Video Liking / Job Scam',
    category: 'Job Scam',
    description: 'Offers ₹3000-₹5000/day for liking YouTube videos or rating hotels, initially pays small amounts, then traps victim into transferring lakhs for "high commission prepaid tasks".',
    commonSigns: [
      'Begins on WhatsApp/Telegram with HR pretending from top MNCs',
      'First 2 tasks pay ₹150 to establish trust',
      'Then demands depositing ₹5,000 to ₹50,000 to unlock withdrawable balance'
    ],
    detectionPhrases: [
      'Part time work from home ₹3000 daily',
      'Like YouTube videos and earn',
      'VIP task deposit required to withdraw profit',
      'Merchant task completed transfer fee'
    ],
    warningIndicators: [
      'Requires paying money to work',
      'Communication strictly inside unverified Telegram groups'
    ],
    reportsCount: 83,
    status: 'Verified Pattern',
    riskLevel: 'high',
    trend: 'Rising'
  },
  {
    id: 'pattern-invest',
    name: 'Guaranteed 300% Crypto / Stock Trading Bot Scam',
    category: 'Investment Scam',
    description: 'Promotes fake trading terminals showing fabricated explosive profits, but refuses any withdrawal unless exorbitant "liquidity release taxes" are transferred.',
    commonSigns: [
      'Promises guaranteed daily 10-30% returns',
      'Displays fake dashboard showing huge dollar/rupee balances',
      'Blocks withdrawals demanding 25% tax payment first'
    ],
    detectionPhrases: [
      'Guaranteed 30% weekly return',
      'Zero risk algorithmic trading',
      'Deposit USDT to activate withdrawal',
      'Special insider signal group'
    ],
    warningIndicators: [
      'Unregistered unregulated platform',
      'Guaranteed returns on market investments'
    ],
    reportsCount: 71,
    status: 'Verified Pattern',
    riskLevel: 'high',
    trend: 'Rising'
  },
  {
    id: 'pattern-support',
    name: 'Fake Google Search Airline/Helpline Number Scam',
    category: 'Customer Support Scam',
    description: 'Scammers buy sponsored Google Ads or edit Google Maps listings with their personal numbers for airline refunds, delivery helplines, or banking support.',
    commonSigns: [
      'Phone number obtained from quick Google search or map pin',
      'Support agent asks you to download APK or send ₹10 verification charge',
      'Redirects you to a custom UPI handle'
    ],
    detectionPhrases: [
      'Indigo / SpiceJet customer care support',
      'Pay ₹10 server sync fee',
      'Send screenshot of UPI balance to verify',
      'Install our support quick fix tool'
    ],
    warningIndicators: [
      'Number not listed on company verified domain',
      'Agent asks to initiate transaction to resolve issue'
    ],
    reportsCount: 68,
    status: 'Verified Pattern',
    riskLevel: 'high',
    trend: 'Stable'
  }
];

export const MOCK_COMMUNITY_REPORTS: CommunityReport[] = [
  {
    id: 'rep-1042',
    ticketNumber: '#1042',
    category: 'KYC Impersonation',
    title: 'Urgent SBI Yono KYC Suspension SMS with malicious APK link',
    description: 'Received an SMS claiming my SBI Yono account would be blocked at 8:00 PM due to outdated KYC. The link led to a cloned SBI portal asking for NetBanking password and UPI PIN.',
    reportedAt: '2026-09-18T18:45:00Z',
    relativeTime: '2 hours ago',
    dateFormatted: 'September 18, 2026',
    timeFormatted: '06:45 PM IST',
    similarityConfidence: 94,
    reporter: {
      id: 'usr-104',
      name: 'Ananya Deshmukh',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      badge: 'Verified Citizen Sentinel',
      trustScore: 98,
      reportsSubmitted: 14,
      location: 'Mumbai, Maharashtra'
    },
    approximateAmountLost: 0,
    paymentMethod: 'UPI / NetBanking',
    maskedUpiId: 'sb****@okaxis',
    maskedPhone: '+91 98XXXXXX21',
    evidence: [
      {
        id: 'ev-1',
        type: 'screenshot',
        name: 'sms_alert_screenshot.jpg',
        fileSize: '420 KB',
        previewUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
        maskedSnippet: 'Dear Customer, your SBI account will be blocked today. Click http://bit.ly/sbi-kyc-update to update your PAN.'
      },
      {
        id: 'ev-2',
        type: 'audio',
        name: 'caller_voice_note.mp3',
        fileSize: '1.4 MB',
        transcript: 'Caller claimed to be Nodal Verification Officer from SBI Mumbai Head Office. Demanded immediate online document upload.'
      },
      {
        id: 'ev-3',
        type: 'link',
        name: 'phishing_domain.txt',
        maskedSnippet: 'hxxp://sbi-kyc-auth-portal-secure[.]live/login.php'
      }
    ],
    status: 'verified',
    riskLevel: 'high',
    confidenceScore: 96,
    similarReportsCount: 23,
    upvotes: 23,
    aiAnalysis: {
      summary: 'High-confidence automated KYC suspension lure designed to harvest NetBanking credentials and deploy a rogue remote access APK.',
      psychologicalTriggers: [
        'Artificial deadline urgency (8:00 PM cutoff)',
        'Fear of immediate financial freeze',
        'Official institutional authority spoofing'
      ],
      urgencyLevel: 'Critical',
      impersonationTactic: 'State Bank of India (SBI) Nodal KYC Verification Desk',
      technicalRedFlags: [
        'Bit.ly URL mask redirecting to non-SBI domain',
        'Cloned login portal harvesting NetBanking passwords',
        'Demands OTP and UPI PIN under the guise of verification'
      ],
      recommendation: 'Do not click the link or provide any credentials. SBI never sends SMS with shortened URLs or asks for PAN updates via third-party web portals.'
    },
    riskIndicators: [
      {
        id: 'ri-1',
        label: 'Coercive Immediate Cutoff',
        severity: 'high',
        detail: 'Threatens service suspension within 2 hours to force panic action.'
      },
      {
        id: 'ri-2',
        label: 'Obfuscated Short URL',
        severity: 'high',
        detail: 'Uses bit.ly redirection to conceal unauthorized cloud hosting endpoint.'
      },
      {
        id: 'ri-3',
        label: 'Credential Harvesting Form',
        severity: 'high',
        detail: 'Cloned form fields requesting NetBanking password and UPI PIN.'
      }
    ],
    comments: [
      {
        id: 'c-1',
        reportId: 'rep-1042',
        authorName: 'Vikram Sengupta',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        authorBadge: 'Lead Sentinel Moderator',
        createdAt: '2026-09-18T19:10:00Z',
        relativeTime: '1 hour ago',
        content: 'We cross-referenced the domain sbi-kyc-auth-portal-secure[.]live with CERT-In blocklists. The domain registrar was registered just 6 hours ago in Eastern Europe. Excellent catch by Ananya.',
        upvotes: 19
      },
      {
        id: 'c-2',
        reportId: 'rep-1042',
        authorName: 'Ramesh K.',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        authorBadge: 'Verified Citizen',
        createdAt: '2026-09-18T19:35:00Z',
        relativeTime: '45 mins ago',
        content: 'My father received the exact same SMS in Pune this morning with the same 8:00 PM deadline! Luckily I showed him this RakshaPay cluster and blocked the sender immediately.',
        upvotes: 11
      },
      {
        id: 'c-3',
        reportId: 'rep-1042',
        authorName: 'Dr. Priya Nair',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        authorBadge: 'Cyber Safety Advocate',
        createdAt: '2026-09-18T20:00:00Z',
        relativeTime: '20 mins ago',
        content: 'Everyone please note: National banks in India only send official communication from SMS headers like VK-SBIINB or AX-SBIPAN, NEVER from personal 10-digit mobile numbers.',
        upvotes: 14
      }
    ],
    moderationSignals: {
      duplicateEvidenceScore: 12,
      contradictoryDescription: false,
      repeatedSubmissions: false,
      suspiciousMetadata: false,
      aiRecommendation: 'Approve'
    }
  },
  {
    id: 'rep-1041',
    ticketNumber: '#1041',
    category: 'Fake Refund',
    title: 'Swiggy Delivery Refund Collect Request of ₹2,499',
    description: 'Ordered groceries on Swiggy. Got a call from an alleged Swiggy manager claiming items were damaged and refund was being credited. Sent a PhonePe collect request for ₹2,499 with remark "Swiggy Refund Credit".',
    reportedAt: '2026-09-18T16:15:00Z',
    relativeTime: '4 hours ago',
    dateFormatted: 'September 18, 2026',
    timeFormatted: '04:15 PM IST',
    similarityConfidence: 91,
    reporter: {
      id: 'usr-105',
      name: 'Karthik Raman',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      badge: 'Verified Citizen',
      trustScore: 92,
      reportsSubmitted: 4,
      location: 'Bengaluru, Karnataka'
    },
    approximateAmountLost: 2499,
    paymentMethod: 'UPI Collect Request',
    maskedUpiId: 're****@ybl',
    maskedPhone: '+91 91XXXXXX88',
    evidence: [
      {
        id: 'ev-4',
        type: 'payment_receipt',
        name: 'phonepe_collect_screenshot.png',
        fileSize: '680 KB',
        previewUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
        maskedSnippet: 'PhonePe Collect Request: ₹2,499.00 from "SWIGGY_REFUND_NODE". Remark: "Enter UPI PIN to receive money".'
      },
      {
        id: 'ev-5',
        type: 'chat',
        name: 'whatsapp_exchange.png',
        fileSize: '510 KB',
        maskedSnippet: 'Scammer: "Sir accept the collect request quickly before the server session expires."'
      }
    ],
    status: 'verified',
    riskLevel: 'high',
    confidenceScore: 92,
    similarReportsCount: 18,
    upvotes: 18,
    aiAnalysis: {
      summary: 'UPI collect request fraud exploiting delivery refund confusion. Perpetrator sends a debit collect request labeled as a credit refund.',
      psychologicalTriggers: [
        'Anticipation of expected financial refund',
        'Urgent call claiming session expiry',
        'Confusion between UPI Send vs Receive'
      ],
      urgencyLevel: 'High',
      impersonationTactic: 'Swiggy Customer Resolution Executive',
      technicalRedFlags: [
        'UPI Collect Request used instead of Credit transfer',
        'Remark deceptive text: "Enter UPI PIN to receive money"',
        'Rogue VPA handle re****@ybl'
      ],
      recommendation: 'Decline the collect request immediately on your UPI app. Remember: Entering your UPI PIN is strictly for authorizing debits from your bank, NEVER for receiving money.'
    },
    riskIndicators: [
      {
        id: 'ri-4',
        label: 'UPI Collect Reversal Deception',
        severity: 'high',
        detail: 'Collect requests pull money from your account; refunds are always push credits.'
      },
      {
        id: 'ri-5',
        label: 'Misleading Remark String',
        severity: 'high',
        detail: 'Remark text deliberately fakes a refund message to confuse the user.'
      }
    ],
    comments: [
      {
        id: 'c-4',
        reportId: 'rep-1041',
        authorName: 'Sneha Patel',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        authorBadge: 'Community Sentinel',
        createdAt: '2026-09-18T17:00:00Z',
        relativeTime: '3 hours ago',
        content: 'Swiggy or Zomato will NEVER call from personal numbers asking you to approve a PhonePe or GPay collect request. Refunds are processed automatically to the original payment source.',
        upvotes: 15
      }
    ],
    moderationSignals: {
      duplicateEvidenceScore: 8,
      contradictoryDescription: false,
      repeatedSubmissions: false,
      suspiciousMetadata: false,
      aiRecommendation: 'Approve'
    }
  },
  {
    id: 'rep-1040',
    ticketNumber: '#1040',
    category: 'QR Code Scam',
    title: 'OLX Sofa Buyer Sent "Receiver QR Code" demanding PIN',
    description: 'Posted an old sofa for ₹12,000 on OLX. Buyer claimed to be an Army subedar posted in Pune. Sent a QR code saying scanning it would instantly deposit ₹12,000 into my Google Pay.',
    reportedAt: '2026-09-18T13:20:00Z',
    relativeTime: '7 hours ago',
    dateFormatted: 'September 18, 2026',
    timeFormatted: '01:20 PM IST',
    similarityConfidence: 96,
    reporter: {
      id: 'usr-106',
      name: 'Pooja Sharma',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      badge: 'Community Contributor',
      trustScore: 94,
      reportsSubmitted: 6,
      location: 'Pune, Maharashtra'
    },
    approximateAmountLost: 0,
    paymentMethod: 'QR Code / Google Pay',
    maskedUpiId: 'ar****@icici',
    maskedPhone: '+91 87XXXXXX14',
    evidence: [
      {
        id: 'ev-6',
        type: 'screenshot',
        name: 'fake_qr_code.png',
        fileSize: '310 KB',
        previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        maskedSnippet: 'QR Code embedded with UPI Pay URL: upi://pay?pa=army_canteen_pune@icici&am=12000'
      },
      {
        id: 'ev-7',
        type: 'chat',
        name: 'olx_chat_history.pdf',
        fileSize: '890 KB',
        maskedSnippet: 'Buyer: "I have transferred through military portal. Scan code and enter PIN to accept."'
      }
    ],
    status: 'verified',
    riskLevel: 'high',
    confidenceScore: 98,
    similarReportsCount: 42,
    upvotes: 42,
    aiAnalysis: {
      summary: 'Marketplace reverse payment fraud exploiting the misconception that scanning QR codes or entering a UPI PIN is required to receive funds.',
      psychologicalTriggers: [
        'Defense/military personnel impersonation to induce trust',
        'Eagerness to close an online sale without in-person inspection',
        'Inversion of UPI transaction semantics'
      ],
      urgencyLevel: 'High',
      impersonationTactic: 'Army Subedar posted at Pune Military Base',
      technicalRedFlags: [
        'UPI intent payload contains debit parameters: upi://pay?pa=...&am=12000',
        'PIN prompt required on target device (confirming fund deduction)',
        'Unverified OLX profile created on the same morning'
      ],
      recommendation: 'NEVER scan a QR code or enter your UPI PIN to receive money. In the UPI system, receiving money requires zero action from the receiver.'
    },
    riskIndicators: [
      {
        id: 'ri-6',
        label: 'UPI Debit Intent Masking',
        severity: 'high',
        detail: 'The QR code initiates a payment TO the scammer instead of depositing money.'
      },
      {
        id: 'ri-7',
        label: 'Military Canteen Identity Fabric',
        severity: 'medium',
        detail: 'Fictitious military credentials utilized to bypass buyer skepticism.'
      }
    ],
    comments: [
      {
        id: 'c-5',
        reportId: 'rep-1040',
        authorName: 'Major (Retd.) R. Swaminathan',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        authorBadge: 'Defense Community Veteran',
        createdAt: '2026-09-18T14:30:00Z',
        relativeTime: '6 hours ago',
        content: 'Army personnel never buy civilian used goods using military accounts. All official purchases go through formal Kendriya Sainik Board tenders. Please warn all OLX sellers.',
        upvotes: 28
      }
    ],
    moderationSignals: {
      duplicateEvidenceScore: 5,
      contradictoryDescription: false,
      repeatedSubmissions: false,
      suspiciousMetadata: false,
      aiRecommendation: 'Approve'
    }
  },
  {
    id: 'rep-1039',
    ticketNumber: '#1039',
    category: 'Electricity Bill Scam',
    title: 'Mahavitaran Power Cut Threat at 9:30 PM SMS',
    description: 'Bulk message sent to entire neighborhood stating electricity connection would be cut off at 9:30 PM. Provided a 10-digit mobile number for executive Mr. Verma.',
    reportedAt: '2026-09-17T20:10:00Z',
    relativeTime: '1 day ago',
    dateFormatted: 'September 17, 2026',
    timeFormatted: '08:10 PM IST',
    similarityConfidence: 97,
    reporter: {
      id: 'usr-107',
      name: 'Rajesh Kulkarni',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      badge: 'Verified Citizen',
      trustScore: 96,
      reportsSubmitted: 8,
      location: 'Nagpur, Maharashtra'
    },
    approximateAmountLost: 850,
    paymentMethod: 'UPI Direct',
    maskedUpiId: 'el****@paytm',
    maskedPhone: '+91 78XXXXXX55',
    evidence: [
      {
        id: 'ev-8',
        type: 'screenshot',
        name: 'electricity_sms.jpg',
        fileSize: '340 KB',
        previewUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
        maskedSnippet: 'Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM by electricity office because your previous month bill was not updated. Please immediately contact 78XXXXXX55.'
      }
    ],
    status: 'verified',
    riskLevel: 'high',
    confidenceScore: 97,
    similarReportsCount: 31,
    upvotes: 31,
    aiAnalysis: {
      summary: 'Night-time utility disconnection scare targeting residential electricity consumers with immediate cutoff deadlines.',
      psychologicalTriggers: [
        'Fear of darkness / power loss during night hours (9:30 PM deadline)',
        'Authority pressure impersonating state power distribution board',
        'Nominal bill amount mentioned to encourage quick unverified payment'
      ],
      urgencyLevel: 'Critical',
      impersonationTactic: 'Mahavitaran (MSEDCL) Disconnection Officer',
      technicalRedFlags: [
        'SMS sent from personal 10-digit number instead of authorized bulk sender ID (e.g. VM-MSEDCL)',
        'Directs victims to personal WhatsApp/mobile number instead of official portal',
        'Personal Paytm VPA provided for bill clearance'
      ],
      recommendation: 'Utility companies never disconnect power overnight without prior statutory notices. Verify your bill status directly on the official electricity board app or portal.'
    },
    riskIndicators: [
      {
        id: 'ri-8',
        label: 'Night Disconnection Coercion',
        severity: 'high',
        detail: 'Imposes short 1-hour window before supposed power cutoff.'
      },
      {
        id: 'ri-9',
        label: 'Unregistered SMS Sender',
        severity: 'high',
        detail: 'Sent from standard telecom SIM card rather than DLT registered utility header.'
      }
    ],
    comments: [
      {
        id: 'c-6',
        reportId: 'rep-1039',
        authorName: 'MSEDCL Vigilance Alert',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        authorBadge: 'Official Advisory Node',
        createdAt: '2026-09-17T21:00:00Z',
        relativeTime: '1 day ago',
        content: 'Official notice: Mahavitaran sends SMS alerts ONLY with sender ID like VM-MSEDCL or VK-MSEB. We never instruct consumers to dial personal mobile numbers.',
        upvotes: 35
      }
    ]
  },
  {
    id: 'rep-1038',
    ticketNumber: '#1038',
    category: 'Remote Access Scam',
    title: 'AnyDesk App Installation for Airtel Broadband KYC Fix',
    description: 'Scammer impersonated Airtel fiber technical desk claiming fiber line would be deactivated unless an automated diagnostic tool was installed. Directed me to install AnyDesk and disclose 9 digit code.',
    reportedAt: '2026-09-17T15:00:00Z',
    relativeTime: '1 day ago',
    dateFormatted: 'September 17, 2026',
    timeFormatted: '03:00 PM IST',
    similarityConfidence: 98,
    reporter: {
      id: 'usr-108',
      name: 'Sunil Gokhale',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      badge: 'Verified Citizen',
      trustScore: 95,
      reportsSubmitted: 3,
      location: 'Hyderabad, Telangana'
    },
    approximateAmountLost: 0,
    paymentMethod: 'Remote App Hijack Attempt',
    maskedPhone: '+91 99XXXXXX32',
    evidence: [
      {
        id: 'ev-9',
        type: 'audio',
        name: 'call_recording_anydesk.mp3',
        fileSize: '2.1 MB',
        transcript: 'Caller: "Go to Google Play Store and search AnyDesk. Click Install... Now read out the address on the screen..."'
      }
    ],
    status: 'verified',
    riskLevel: 'high',
    confidenceScore: 99,
    similarReportsCount: 19,
    upvotes: 19,
    aiAnalysis: {
      summary: 'Remote administration tool takeover scam. Fraudster attempts to gain full screen and notification control over the victim device to intercept 2FA banking SMS.',
      psychologicalTriggers: [
        'Broadband service disruption fear',
        'Technical jargon intimidation (optical signal loss, server synchronization)',
        'Cooperative guidance illusion'
      ],
      urgencyLevel: 'Critical',
      impersonationTactic: 'Airtel Broadband Tier-2 Technical Desk',
      technicalRedFlags: [
        'Request to install TeamViewer QuickSupport or AnyDesk',
        'Demands the 9-digit remote access session code',
        'Attempts to observe screen during banking or OTP generation'
      ],
      recommendation: 'NEVER install AnyDesk, TeamViewer, or RustDesk at the request of an inbound telephone caller. Telecom companies will never require remote control of your phone.'
    },
    riskIndicators: [
      {
        id: 'ri-10',
        label: 'Remote Desktop Hijack Directive',
        severity: 'high',
        detail: 'Directs victim to grant remote desktop control to access device credentials.'
      },
      {
        id: 'ri-11',
        label: 'Active Call Deception',
        severity: 'high',
        detail: 'Keeps victim continuously on the phone to prevent independent verification.'
      }
    ],
    comments: [
      {
        id: 'c-7',
        reportId: 'rep-1038',
        authorName: 'Harish V.',
        authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
        authorBadge: 'Telecom Security Specialist',
        createdAt: '2026-09-17T16:00:00Z',
        relativeTime: '1 day ago',
        content: 'If you ever installed AnyDesk or gave out a code, turn off Wi-Fi/Mobile Data immediately, uninstall the app, and notify your bank to temporarily freeze UPI.',
        upvotes: 24
      }
    ]
  },
  {
    id: 'rep-1037',
    ticketNumber: '#1037',
    category: 'Job Scam',
    title: 'YouTube Video Like Task - Trapped in Telegram VIP Level',
    description: 'Earned ₹300 initially by subscribing to 3 channels. Then added to a 200-member Telegram group where admin demanded ₹10,000 for "Prepaid Crypto Task" to withdraw earlier earnings.',
    reportedAt: '2026-09-16T11:40:00Z',
    relativeTime: '2 days ago',
    approximateAmountLost: 10000,
    paymentMethod: 'UPI Multiple Handles',
    maskedUpiId: 'ta****@axisbank',
    maskedPhone: '+91 93XXXXXX90',
    evidence: [
      {
        id: 'ev-10',
        type: 'chat',
        name: 'telegram_chat_vip_tasks.png',
        fileSize: '760 KB',
        maskedSnippet: 'Admin: "Task 4 completed! To withdraw your ₹15,600 you must complete Tier 2 security deposit of ₹10,000."'
      }
    ],
    status: 'verified',
    riskLevel: 'high',
    confidenceScore: 95,
    similarReportsCount: 54,
  },
  {
    id: 'rep-1036',
    ticketNumber: '#1036',
    category: 'Bank Impersonation',
    title: 'Fake HDFC Fraud Alert regarding ₹62,000 international charge',
    description: 'Automated robocall transferred to live operator claiming my credit card was charged ₹62,000 in Dubai. Operator asked for 6-digit cancellation OTP to decline the charge.',
    reportedAt: '2026-09-15T09:30:00Z',
    relativeTime: '3 days ago',
    approximateAmountLost: 0,
    paymentMethod: 'OTP Theft',
    maskedPhone: '+91 80XXXXXX19',
    evidence: [
      {
        id: 'ev-11',
        type: 'audio',
        name: 'fraud_call_hdfc_spoof.mp3',
        fileSize: '3.2 MB',
        transcript: 'Operator: "Sir this is emergency security cancellation desk. You will receive an SMS containing reversal verification code."'
      }
    ],
    status: 'verified',
    riskLevel: 'high',
    confidenceScore: 98,
    similarReportsCount: 38,
  },
  {
    id: 'rep-1035',
    ticketNumber: '#1035',
    category: 'OTP Scam',
    title: 'Caller claimed he mistyped phone number for grocery order',
    description: 'Received a panic call from someone claiming he mistyped one digit in his Blinkit order and the OTP was sent to my phone. Asked me to read the OTP. The OTP was actually for IndusInd NetBanking password reset.',
    reportedAt: '2026-09-14T14:15:00Z',
    relativeTime: '4 days ago',
    approximateAmountLost: 0,
    paymentMethod: 'Password Reset Hijack',
    maskedPhone: '+91 70XXXXXX61',
    evidence: [
      {
        id: 'ev-12',
        type: 'screenshot',
        name: 'bank_otp_sms.png',
        fileSize: '290 KB',
        maskedSnippet: 'IndusInd Bank: 839210 is your OTP to reset NetBanking password. NEVER share with anyone.'
      }
    ],
    status: 'verified',
    riskLevel: 'high',
    confidenceScore: 99,
    similarReportsCount: 14,
  },
  {
    id: 'rep-1034',
    ticketNumber: '#1034',
    category: 'Investment Scam',
    title: 'WhatsApp group "Quant Alpha" promising 40% weekly returns',
    description: 'Added to an unrequested WhatsApp investment group with 40 participants posting screenshots of ₹50,000 daily profits. Provided a customized web trading APK.',
    reportedAt: '2026-09-13T17:40:00Z',
    relativeTime: '5 days ago',
    approximateAmountLost: 25000,
    paymentMethod: 'UPI to Corporate Current Account',
    maskedUpiId: 'tr****@kotak',
    maskedPhone: '+91 97XXXXXX02',
    evidence: [
      {
        id: 'ev-13',
        type: 'screenshot',
        name: 'trading_dashboard.png',
        fileSize: '540 KB',
        maskedSnippet: 'Dashboard shows balance $4,850.00 but withdrawal status is "Frozen: Require 20% Liquidity Collateral".'
      }
    ],
    status: 'verified',
    riskLevel: 'high',
    confidenceScore: 94,
    similarReportsCount: 29,
  },
  {
    id: 'rep-1033',
    ticketNumber: '#1033',
    category: 'Customer Support Scam',
    title: 'Fake Indigo Airline Cancellation Helpline on Google Maps',
    description: 'Searched Google for Indigo Bangalore Airport customer care. Called the top number. Agent asked for ₹25 registration charge to process flight refund and sent a malicious payment link.',
    reportedAt: '2026-09-12T12:00:00Z',
    relativeTime: '6 days ago',
    approximateAmountLost: 1200,
    paymentMethod: 'Phishing Payment Portal',
    maskedUpiId: 'in****@okaxis',
    maskedPhone: '+91 88XXXXXX41',
    evidence: [
      {
        id: 'ev-14',
        type: 'screenshot',
        name: 'google_maps_fake_listing.jpg',
        fileSize: '410 KB',
        maskedSnippet: 'Google Maps pin: Indigo Customer Care Helpline 24x7 showing personal mobile +91 88XXXXXX41.'
      }
    ],
    status: 'verified',
    riskLevel: 'high',
    confidenceScore: 96,
    similarReportsCount: 22,
  },
  {
    id: 'rep-1032',
    ticketNumber: '#1032',
    category: 'KYC Impersonation',
    title: 'Paytm Wallet KYC Renewal APK download notice',
    description: 'WhatsApp message from a business profile named "Paytm KYC Central". Stated wallet balance of ₹4,200 would be seized by RBI unless an updated KYC APK was installed.',
    reportedAt: '2026-09-11T18:20:00Z',
    relativeTime: '1 week ago',
    approximateAmountLost: 0,
    paymentMethod: 'Malicious APK',
    maskedPhone: '+91 95XXXXXX73',
    evidence: [
      {
        id: 'ev-15',
        type: 'link',
        name: 'apk_download_url.txt',
        maskedSnippet: 'hxxps://paytm-wallet-kyc-service-2026[.]apk'
      }
    ],
    status: 'verified',
    riskLevel: 'high',
    confidenceScore: 97,
    similarReportsCount: 48,
  },
  {
    id: 'rep-1031',
    ticketNumber: '#1031',
    category: 'Fake Refund',
    title: 'Amazon Courier Delay Cashback Scam',
    description: 'Pretended to be Amazon logistics stating delivery was delayed by 2 days, and as apology company is offering ₹500 instant cashback on GPay. Sent collect request instead.',
    reportedAt: '2026-09-10T10:15:00Z',
    relativeTime: '1 week ago',
    approximateAmountLost: 500,
    paymentMethod: 'UPI Collect',
    maskedUpiId: 'am****@upi',
    maskedPhone: '+91 92XXXXXX84',
    evidence: [
      {
        id: 'ev-16',
        type: 'payment_receipt',
        name: 'collect_request.png',
        fileSize: '320 KB'
      }
    ],
    status: 'verified',
    riskLevel: 'high',
    confidenceScore: 91,
    similarReportsCount: 15,
  },
  {
    id: 'rep-1030',
    ticketNumber: '#1030',
    category: 'Bank Impersonation',
    title: 'Reward Points Expiry Phishing SMS',
    description: 'SMS claiming 8,420 ICICI Reward Points worth ₹2,105 are expiring today. Asked to click link and redeem into bank account.',
    reportedAt: '2026-09-09T14:40:00Z',
    relativeTime: '1 week ago',
    approximateAmountLost: 0,
    paymentMethod: 'Card Phishing',
    maskedPhone: '+91 84XXXXXX99',
    evidence: [
      {
        id: 'ev-17',
        type: 'screenshot',
        name: 'reward_points_sms.jpg',
        fileSize: '300 KB'
      }
    ],
    status: 'verified',
    riskLevel: 'high',
    confidenceScore: 95,
    similarReportsCount: 33,
  },
  {
    id: 'rep-1029',
    ticketNumber: '#1029',
    category: 'QR Code Scam',
    title: 'Flat Deposit Advance Payment via QR code',
    description: 'Tenant found flat listing on NoBroker. House owner said he is in CRPF camp and sent a QR code to pay token advance of ₹5,000.',
    reportedAt: '2026-09-08T16:00:00Z',
    relativeTime: '10 days ago',
    approximateAmountLost: 5000,
    paymentMethod: 'QR Code',
    maskedUpiId: 'cr****@sbi',
    maskedPhone: '+91 90XXXXXX12',
    evidence: [
      {
        id: 'ev-18',
        type: 'chat',
        name: 'whatsapp_crpf_id.jpg',
        fileSize: '620 KB'
      }
    ],
    status: 'verified',
    riskLevel: 'high',
    confidenceScore: 96,
    similarReportsCount: 27,
  },
  {
    id: 'rep-1028',
    ticketNumber: '#1028',
    category: 'Job Scam',
    title: 'Hotel Rating on Google Reviews Work from home scam',
    description: 'Recruiter on Instagram offered ₹100 per Google review. Completed 5 reviews, received ₹500, then lured into VIP trading task.',
    reportedAt: '2026-09-07T11:20:00Z',
    relativeTime: '11 days ago',
    approximateAmountLost: 15000,
    paymentMethod: 'UPI Multiple',
    maskedUpiId: 'vi****@indus',
    maskedPhone: '+91 96XXXXXX39',
    evidence: [
      {
        id: 'ev-19',
        type: 'chat',
        name: 'instagram_dm.png',
        fileSize: '450 KB'
      }
    ],
    status: 'verified',
    riskLevel: 'high',
    confidenceScore: 93,
    similarReportsCount: 39,
  }
];

