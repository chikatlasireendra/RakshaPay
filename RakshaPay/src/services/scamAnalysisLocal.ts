import { RiskAnalysisResult, FlaggedReason, ScamCategory } from '../types';

export const scamAnalysisService = {
  analyzeMessage(text: string): Promise<RiskAnalysisResult> {
    return new Promise((resolve) => {
      // Simulate intelligent reasoning delay
      setTimeout(() => {
        const lower = text.toLowerCase();
        let riskScore = 15;
        let category: ScamCategory | 'Legitimate Communication' = 'Legitimate Communication';
        let confidence: 'High' | 'Medium' | 'Low' = 'Low';
        let categoryDesc = 'This communication shows standard transactional characteristics with low risk indicators.';
        const reasons: FlaggedReason[] = [];
        let commonCharacteristics: string[] = ['Standard formal language', 'Clear reference context'];
        let similarCount = 1;
        let breakdown = [
          { label: 'Standard reference check', matchPercentage: 95 },
          { label: 'Verified organization sender pattern', matchPercentage: 88 }
        ];

        // 1. KYC Impersonation
        if (lower.includes('kyc') || (lower.includes('blocked') && lower.includes('account')) || lower.includes('yono') || lower.includes('pan card') || lower.includes('suspension')) {
          riskScore = 91;
          category = 'KYC Impersonation';
          confidence = 'High';
          categoryDesc = 'This message contains patterns commonly associated with fake KYC and urgent account-blocking phishing attempts.';
          commonCharacteristics = [
            'Claims immediate KYC expiry / account freeze',
            'Creates artificial panic deadline (today / within 24h)',
            'Directs user to non-bank external URL or APK',
            'Threatens permanent service suspension'
          ];
          similarCount = 23;
          breakdown = [
            { label: 'KYC expiry threat', matchPercentage: 94 },
            { label: 'Account blocking panic trigger', matchPercentage: 88 },
            { label: 'Suspicious external link', matchPercentage: 82 },
            { label: 'Sensitive credential harvesting', matchPercentage: 76 }
          ];

          reasons.push(
            {
              id: 'r1',
              title: 'Urgency & Panic Trigger',
              snippet: lower.includes('today') || lower.includes('urgent') ? 'Urgent / Account blocked today deadline' : 'Account suspension threat',
              severity: 'high',
              explanation: 'Fraudsters create false urgency to prevent victims from verifying claims through official bank apps.',
              iconName: 'AlertTriangle'
            },
            {
              id: 'r2',
              title: 'Sensitive Credential Target',
              snippet: 'Mandatory verification link requesting login or documents',
              severity: 'high',
              explanation: 'Legitimate banks never request full KYC updates or UPI PINs via unverified short-links or SMS forms.',
              iconName: 'KeyRound'
            },
            {
              id: 'r3',
              title: 'Bank & Regulatory Impersonation',
              snippet: 'Claims to represent bank nodal officer or official portal',
              severity: 'high',
              explanation: 'Unregistered sender masquerading as a financial institution.',
              iconName: 'Landmark'
            },
            {
              id: 'r4',
              title: 'Suspicious External Link',
              snippet: text.includes('http') ? 'External unverified URL' : 'Domain disguised as official portal',
              severity: 'high',
              explanation: 'Redirects to a phishing form designed to harvest login credentials and 2FA tokens.',
              iconName: 'ExternalLink'
            }
          );
        }
        // 2. Fake Refund / Fee
        else if (lower.includes('refund') || lower.includes('processing fee') || lower.includes('cashback') || lower.includes('swiggy') || lower.includes('zomato')) {
          riskScore = 88;
          category = 'Fake Refund';
          confidence = 'High';
          categoryDesc = 'This message exhibits classic fake refund advance-fee fraud patterns where users are tricked into paying to "receive" money.';
          commonCharacteristics = [
            'Requires advance processing fee to release refund',
            'Uses UPI collect requests masked as receipt authorization',
            'Creates urgency around refund server timeout',
            'Unofficial communication channels'
          ];
          similarCount = 18;
          breakdown = [
            { label: 'Refund advance-fee demand', matchPercentage: 92 },
            { label: 'UPI collect inversion trick', matchPercentage: 86 },
            { label: 'Merchant support impersonation', matchPercentage: 79 }
          ];
          reasons.push(
            {
              id: 'rf1',
              title: 'Advance Fee Demanded for Refund',
              snippet: 'Requires paying fee to receive pending refund',
              severity: 'high',
              explanation: 'Legitimate e-commerce refunds are automatically credited back to the original source without extra charges.',
              iconName: 'DollarSign'
            },
            {
              id: 'rf2',
              title: 'UPI Payment Inversion Risk',
              snippet: 'Requests UPI PIN or collect request approval',
              severity: 'high',
              explanation: 'Entering your UPI PIN or approving a collect request debits money from your account, never credits it.',
              iconName: 'CreditCard'
            }
          );
        }
        // 3. Bank Impersonation / Unauthorized debit alert
        else if (lower.includes('fraud') || lower.includes('unauthorized') || lower.includes('hdfc') || lower.includes('icici') || lower.includes('sbi') || lower.includes('cancellation otp')) {
          riskScore = 89;
          category = 'Bank Impersonation';
          confidence = 'High';
          categoryDesc = 'Claims to be a bank fraud prevention department warning of an unauthorized debit to elicit one-time passwords.';
          commonCharacteristics = [
            'Alleges huge unauthorized debit (e.g., in foreign currency or distant city)',
            'Offers to cancel debit if user provides verification code',
            'Demands OTP under the guise of "cancellation confirmation"'
          ];
          similarCount = 31;
          breakdown = [
            { label: 'False emergency debit claim', matchPercentage: 95 },
            { label: 'OTP elicitation tactic', matchPercentage: 91 },
            { label: 'Spoofed security officer identity', matchPercentage: 84 }
          ];
          reasons.push(
            {
              id: 'bi1',
              title: 'OTP Request Under Guise of Cancellation',
              snippet: 'Requires reading or entering verification code to cancel debit',
              severity: 'high',
              explanation: 'Banks do not generate OTPs to cancel transactions; the OTP generated is actually authorizing the malicious transfer.',
              iconName: 'ShieldAlert'
            },
            {
              id: 'bi2',
              title: 'Fear-Inducing Security Alert',
              snippet: 'Fabricated international or massive card charge',
              severity: 'high',
              explanation: 'High emotional pressure designed to bypass logical caution.',
              iconName: 'AlertOctagon'
            }
          );
        }
        // 4. Remote Access / AnyDesk
        else if (lower.includes('anydesk') || lower.includes('teamviewer') || lower.includes('remote') || lower.includes('quicksupport') || lower.includes('9-digit')) {
          riskScore = 96;
          category = 'Remote Access Scam';
          confidence = 'High';
          categoryDesc = 'Instructs the victim to install remote desktop access tools that grant scammers full screen and keystroke control.';
          commonCharacteristics = [
            'Directs to third-party screen sharing apps',
            'Requests 9-digit session code',
            'Aims to view banking apps and OTP notifications directly on screen'
          ];
          similarCount = 19;
          breakdown = [
            { label: 'Screen mirroring software request', matchPercentage: 99 },
            { label: 'Technical assistance pretext', matchPercentage: 90 }
          ];
          reasons.push(
            {
              id: 'ra1',
              title: 'Critical Remote Access Application',
              snippet: 'Directs victim to download screen-sharing tools',
              severity: 'high',
              explanation: 'Remote access software allows criminals to see your screen in real time, capturing OTPs and passwords as you type.',
              iconName: 'Monitor'
            }
          );
        }
        // 5. Electricity Bill scam
        else if (lower.includes('electricity') || lower.includes('power') || lower.includes('disconnected') || lower.includes('officer')) {
          riskScore = 87;
          category = 'Electricity Bill Scam';
          confidence = 'High';
          categoryDesc = 'Widespread panic scam threatening immediate power disconnection at night unless an unverified number is contacted.';
          commonCharacteristics = [
            'Threatens power cutoff tonight at 9:30 PM',
            'Sent from regular personal mobile numbers',
            'No consumer account (CA) number or billing breakdown provided'
          ];
          similarCount = 28;
          breakdown = [
            { label: 'Nighttime disconnection threat', matchPercentage: 96 },
            { label: 'Missing official consumer account number', matchPercentage: 89 }
          ];
          reasons.push(
            {
              id: 'el1',
              title: 'Imminent Disconnection Threat',
              snippet: 'Power disconnected tonight deadline',
              severity: 'high',
              explanation: 'Utility corporations follow statutory notice periods and never announce cutoffs via arbitrary SMS with personal phone contacts.',
              iconName: 'ZapOff'
            }
          );
        }
        // 6. QR Code / Marketplace
        else if (lower.includes('qr') || lower.includes('scan') || lower.includes('olx') || lower.includes('army')) {
          riskScore = 85;
          category = 'QR Code Scam';
          confidence = 'High';
          categoryDesc = 'Attempting to deceive seller into scanning a QR code with the false promise of receiving funds.';
          commonCharacteristics = [
            'Claims scanning QR is required to "receive" funds',
            'Often claims military or defense department protocol',
            'Embedded UPI intent url debits the victim'
          ];
          similarCount = 34;
          breakdown = [
            { label: 'QR Scan to Receive inversion', matchPercentage: 95 },
            { label: 'Online marketplace fraud pattern', matchPercentage: 88 }
          ];
          reasons.push(
            {
              id: 'qr1',
              title: 'QR Code Payment Reversal Lie',
              snippet: 'Scan QR code to receive money',
              severity: 'high',
              explanation: 'In the UPI protocol, you NEVER need to scan a QR code or enter your UPI PIN to receive money. Scanning a QR code only SENDS money.',
              iconName: 'QrCode'
            }
          );
        }
        // 7. Job / Investment scam
        else if (lower.includes('work from home') || lower.includes('guaranteed 30%') || lower.includes('telegram') || lower.includes('like youtube') || lower.includes('daily return')) {
          riskScore = 93;
          category = lower.includes('return') ? 'Investment Scam' : 'Job Scam';
          confidence = 'High';
          categoryDesc = 'Prepaid task or unrealistic guaranteed returns scam operating through unverified messaging groups.';
          commonCharacteristics = [
            'Unrealistic high returns for nominal actions (liking videos, writing reviews)',
            'Demands prepaid deposit fees to unlock earnings'
          ];
          similarCount = 44;
          breakdown = [
            { label: 'Advance deposit to release earnings', matchPercentage: 94 },
            { label: 'Unrealistic return promises', matchPercentage: 91 }
          ];
          reasons.push(
            {
              id: 'jb1',
              title: 'Advance Task Fee Trap',
              snippet: 'Pay deposit to withdraw earnings',
              severity: 'high',
              explanation: 'Genuine employers never ask candidates to transfer money or pay fees in order to receive their salary.',
              iconName: 'Briefcase'
            }
          );
        } else {
          // Low risk / Normal message
          riskScore = 8;
          category = 'Legitimate Communication';
          confidence = 'Low';
          categoryDesc = 'No known fraud patterns or manipulation triggers were found in this text.';
          commonCharacteristics = ['Standard informational format', 'No coercive deadlines'];
          similarCount = 0;
          reasons.push({
            id: 'safe1',
            title: 'No Coercive Triggers Detected',
            snippet: 'Clean transactional text',
            severity: 'low',
            explanation: 'The message does not ask for credentials, urgent fund transfers, or unverified app downloads.',
            iconName: 'CheckCircle'
          });
        }

        const riskLevel = riskScore >= 70 ? 'high' : riskScore >= 35 ? 'caution' : 'low';

        const recommendedActions = riskScore >= 70
          ? [
              {
                title: 'Do NOT click any external links',
                description: 'Never tap short-links or APK downloads sent via SMS or messaging apps.',
                critical: true
              },
              {
                title: 'Never share your UPI PIN or OTP',
                description: 'Bank staff and customer care will NEVER ask for your OTP, NetBanking password, or UPI PIN.',
                critical: true
              },
              {
                title: 'Verify directly via official bank channels',
                description: 'Open your official banking app or call the verified number printed on the back of your debit card.',
                critical: false
              }
            ]
          : [
              {
                title: 'Proceed with normal verification',
                description: 'Always double check sender identities before transferring funds.',
                critical: false
              }
            ];

        const result: RiskAnalysisResult = {
          id: `res-${Date.now()}`,
          textAnalyzed: text,
          riskScore,
          riskLevel,
          scamCategory: category,
          confidence,
          categoryDescription: categoryDesc,
          commonCharacteristics,
          reasons,
          recommendedActions,
          similarCommunityReportsCount: similarCount,
          patternBreakdown: breakdown,
          analyzedAt: new Date().toISOString()
        };

        resolve(result);
      }, 750);
    });
  }
};
