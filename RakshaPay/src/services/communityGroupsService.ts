import { apiGet, apiUpload } from './apiClient';

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  members: number;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  userId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  replyTo?: string | null;
  attachment?: { name: string; type: string; url: string } | null;
  createdAt: string;
}

const LOCAL_GROUPS_KEY = 'scamshield_groups';
const LOCAL_MESSAGES_KEY = 'scamshield_group_messages';

const FALLBACK_GROUPS: CommunityGroup[] = [
  { id: 'upi-awareness', name: 'UPI Scam Awareness', description: 'UPI collect requests, QR traps and payment safety.', members: 128 },
  { id: 'kyc-bank', name: 'KYC & Bank Scams', description: 'Bank impersonation, KYC and account-blocking scams.', members: 96 },
  { id: 'fake-support', name: 'Fake Customer Support', description: 'Fake helplines, refund calls and support impersonation.', members: 74 },
  { id: 'job-scams', name: 'Job Scams', description: 'Fake jobs, task scams and advance-fee requests.', members: 61 },
  { id: 'investment', name: 'Investment Scams', description: 'Fraudulent trading, investment and guaranteed-return schemes.', members: 54 },
  { id: 'qr-scams', name: 'QR Code Scams', description: 'QR-code payment traps and receive-money deception.', members: 47 },
  { id: 'senior-safety', name: 'Senior Citizen Safety', description: 'Simple warnings and scam discussions for families and seniors.', members: 39 },
];

function saveGroups(groups: CommunityGroup[]) { localStorage.setItem(LOCAL_GROUPS_KEY, JSON.stringify(groups)); }
function localMessages(): Record<string, GroupMessage[]> {
  try { return JSON.parse(localStorage.getItem(LOCAL_MESSAGES_KEY) || '{}'); } catch { return {}; }
}

export const communityGroupsService = {
  async getGroups(): Promise<CommunityGroup[]> {
    try {
      const result = await apiGet<{ items: CommunityGroup[] }>('/api/community/groups');
      saveGroups(result.items);
      return result.items;
    } catch {
      const stored = localStorage.getItem(LOCAL_GROUPS_KEY);
      if (stored) { try { return JSON.parse(stored); } catch { /* fallback */ } }
      saveGroups(FALLBACK_GROUPS);
      return FALLBACK_GROUPS;
    }
  },

  async getMessages(groupId: string): Promise<GroupMessage[]> {
    try {
      const result = await apiGet<{ items: GroupMessage[] }>(`/api/community/groups/${groupId}/messages`);
      return result.items;
    } catch {
      return localMessages()[groupId] || [];
    }
  },

  async sendMessage(groupId: string, content: string, file?: File | null): Promise<GroupMessage> {
    return await apiUpload<GroupMessage>(`/api/community/groups/${groupId}/messages`, { content }, file);
  }
};
