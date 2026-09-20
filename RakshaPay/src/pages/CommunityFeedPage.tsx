import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users, Search, Filter, ThumbsUp, MessageSquare, ShieldCheck, AlertTriangle, Clock, ExternalLink,
  PlusCircle, EyeOff, CheckCircle2, Lock, Send, Image as ImageIcon, Video, Mic, Reply, Paperclip
} from 'lucide-react';
import { ActiveView, CommunityReport } from '../types';
import { communityService } from '../services/communityService';
import { RiskBadge } from '../components/common/RiskBadge';
import { ReportDetailModal } from '../components/community/ReportDetailModal';
import { communityGroupsService, CommunityGroup, GroupMessage } from '../services/communityGroupsService';

interface CommunityFeedPageProps {
  onNavigate: (view: ActiveView) => void;
  initialMode?: 'feed' | 'similar';
}

export const CommunityFeedPage: React.FC<CommunityFeedPageProps> = ({ onNavigate, initialMode = 'feed' }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'similar'>(initialMode);
  const [reports, setReports] = useState<CommunityReport[]>(communityService.getAllReports());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeReportForDetail, setActiveReportForDetail] = useState<CommunityReport | null>(null);
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState('upi-awareness');
  const [groupMessages, setGroupMessages] = useState<GroupMessage[]>([]);
  const [groupMessage, setGroupMessage] = useState('');
  const [groupFile, setGroupFile] = useState<File | null>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [groupLoading, setGroupLoading] = useState(false);
  const [groupError, setGroupError] = useState<string | null>(null);

  React.useEffect(() => {
    setActiveTab(initialMode);
  }, [initialMode]);

  React.useEffect(() => {
    let active = true;
    communityGroupsService.getGroups().then((items) => {
      if (!active) return;
      setGroups(items);
      if (items.length && !items.some((g) => g.id === selectedGroupId)) setSelectedGroupId(items[0].id);
    });
    return () => { active = false; };
  }, []);

  React.useEffect(() => {
    let active = true;
    setGroupLoading(true);
    communityGroupsService.getMessages(selectedGroupId).then((items) => {
      if (active) setGroupMessages(items);
    }).finally(() => { if (active) setGroupLoading(false); });
    return () => { active = false; };
  }, [selectedGroupId]);

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  const handleGroupSend = async () => {
    if (!groupMessage.trim() && !groupFile) return;
    setGroupLoading(true);
    setGroupError(null);
    try {
      const created = await communityGroupsService.sendMessage(selectedGroupId, groupMessage.trim(), groupFile);
      setGroupMessages((prev) => [...prev, { ...created, replyTo }]);
      setGroupMessage('');
      setGroupFile(null);
      setReplyTo(null);
    } catch (error) {
      setGroupError(error instanceof Error ? error.message : 'Unable to send this message.');
    } finally {
      setGroupLoading(false);
    }
  };

  const handleUpvote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = communityService.upvoteReport(id);
    if (updated) {
      setReports(communityService.getAllReports());
      if (activeReportForDetail?.id === id) {
        setActiveReportForDetail(updated);
      }
    }
  };

  const filteredReports = reports.filter((r) => {
    const reportType = r.scamType || r.category || '';
    const matchesCategory = selectedCategory === 'all' || reportType.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reportType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header & Submit Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {activeTab === 'similar' ? 'Similar Scam Incident Clusters' : 'Community Scam Intelligence'}
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              {activeTab === 'similar' ? 'Threat Correlation Engine' : 'Verified Crowdsource'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {activeTab === 'similar'
              ? 'Detect recurring fraud networks, correlated recipient VPAs, and identical deception scripts across reported incidents.'
              : 'Real reports submitted by citizens across India. Filter by vector, inspect masked evidence, and upvote active threats.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
                activeTab === 'feed'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Reports Feed
            </button>
            <button
              onClick={() => setActiveTab('similar')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
                activeTab === 'similar'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Similar Scams
            </button>
          </div>

          <button
            onClick={() => onNavigate('report-scam')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 self-start sm:self-auto transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Scam</span>
          </button>
        </div>
      </div>

      {/* Similar Scams Quick Clusters Banner (Active when on similar tab) */}
      {activeTab === 'similar' && (
        <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
              High-Correlation Fraud Clusters in India
            </h2>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono">
              Heuristic Pattern Matching Active
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'SBI Yono APK Block', count: 42, query: 'Yono' },
              { label: 'Swiggy / Zomato Refund Traps', count: 38, query: 'refund' },
              { label: 'Mahavitaran 9:30 PM Power Cut', count: 29, query: 'electricity' },
              { label: 'OLX Military QR Code Advance', count: 21, query: 'olx' },
              { label: 'Telegram Part-time Like Rating', count: 34, query: 'task' },
            ].map((cluster) => (
              <button
                key={cluster.label}
                onClick={() => setSearchTerm(cluster.query)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                  searchTerm === cluster.query
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                }`}
              >
                <span>{cluster.label}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 text-[10px] font-mono">
                  {cluster.count}
                </span>
              </button>
            ))}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="px-2.5 py-1 text-xs text-rose-500 hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reports by bank, keyword, scam type (e.g. Yono, Swiggy, AnyDesk)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="all">All Scam Categories</option>
            <option value="kyc">KYC & Account Blocking</option>
            <option value="refund">Fake Refund / Collect</option>
            <option value="qr">OLX / QR Advance</option>
            <option value="task">Part-time Job / Tasks</option>
            <option value="electricity">Utility & Power Blackout</option>
          </select>
        </div>
      </div>

      {/* Reports + Community Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-5 items-start">
      <div className="grid grid-cols-1 gap-4">
        {filteredReports.map((report) => (
          <motion.div
            key={report.id}
            whileHover={{ y: -2 }}
            onClick={() => setActiveReportForDetail(report)}
            className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {report.id}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {report.scamType}
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-mono bg-slate-100 dark:bg-slate-800 text-slate-500">
                  Via {report.channel}
                </span>
                {report.status === 'verified' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Threat
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{report.createdAt}</span>
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {report.title}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                {report.description}
              </p>
            </div>

            {/* Masked Indicators & Upvote Bar */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                {report.phoneReported && (
                  <span className="flex items-center gap-1 font-mono">
                    <EyeOff className="w-3 h-3 text-emerald-500" />
                    {report.phoneReported}
                  </span>
                )}
                {report.upiReported && (
                  <span className="flex items-center gap-1 font-mono">
                    <Lock className="w-3 h-3 text-emerald-500" />
                    {report.upiReported}
                  </span>
                )}
                {(report.amountLost || report.approximateAmountLost || 0) > 0 && (
                  <span className="text-rose-600 dark:text-rose-400 font-semibold font-mono">
                    ₹{(report.amountLost || report.approximateAmountLost || 0).toLocaleString()} Lost
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => handleUpvote(report.id, e)}
                  disabled={communityService.hasConfirmed(report.id)}
                  className={`px-3 py-1 rounded-lg border flex items-center gap-1.5 transition-colors font-medium text-xs ${communityService.hasConfirmed(report.id) ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 cursor-default' : 'border-slate-200 dark:border-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600'}`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{report.upvotes} {communityService.hasConfirmed(report.id) ? 'Confirmed' : 'Confirm Threat'}</span>
                </button>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-xs flex items-center gap-0.5">
                  <span>View Details</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredReports.length === 0 && (
          <div className="p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <AlertTriangle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              No scam reports match your query. Try a different keyword or category.
            </p>
          </div>
        )}
      </div>

      {/* Community Groups: shared discussion area with text + image/video/audio attachments */}
      <aside className="lg:sticky lg:top-24 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center"><Users className="w-4 h-4" /></div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Community Groups</h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Discuss scams with other users</p>
            </div>
          </div>
        </div>

        <div className="p-3 border-b border-slate-100 dark:border-slate-800 space-y-2 max-h-48 overflow-y-auto">
          {groups.map((group) => (
            <button key={group.id} onClick={() => setSelectedGroupId(group.id)} className={`w-full text-left p-2.5 rounded-xl border transition-colors ${selectedGroupId === group.id ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-800' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60'}`}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{group.name}</span>
                <span className="text-[10px] text-slate-400">{group.members}</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{group.description}</p>
            </button>
          ))}
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">{selectedGroup?.name || 'Community Discussion'}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">{selectedGroup?.description || 'Share warnings and evidence.'}</p>
          </div>

          <div className="h-64 overflow-y-auto space-y-2 pr-1">
            {groupLoading && groupMessages.length === 0 ? (
              <div className="text-center text-[11px] text-slate-400 py-8">Loading discussion…</div>
            ) : groupMessages.length === 0 ? (
              <div className="text-center text-[11px] text-slate-400 py-8">No messages yet. Start the discussion.</div>
            ) : groupMessages.map((message) => (
              <div key={message.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">{message.authorName}</span>
                  <span className="text-[9px] text-slate-400">{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {message.replyTo && <div className="text-[9px] text-indigo-500 mt-1">Replying to a discussion message</div>}
                {message.content && <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 whitespace-pre-wrap">{message.content}</p>}
                {message.attachment && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                    {message.attachment.type.startsWith('image/') ? <img src={message.attachment.url} alt={message.attachment.name} className="w-full max-h-40 object-cover" /> : message.attachment.type.startsWith('video/') ? <video src={message.attachment.url} controls className="w-full max-h-40" /> : message.attachment.type.startsWith('audio/') ? <audio src={message.attachment.url} controls className="w-full" /> : <div className="p-2 text-[10px]">{message.attachment.name}</div>}
                  </div>
                )}
                <button onClick={() => setReplyTo(message.id)} className="mt-1.5 text-[9px] text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"><Reply className="w-3 h-3" />Reply</button>
              </div>
            ))}
          </div>

          {groupError && <div className="text-[10px] px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300">{groupError}</div>}
          {replyTo && <div className="text-[10px] px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-between"><span>Replying to a message</span><button onClick={() => setReplyTo(null)}>×</button></div>}
          {groupFile && <div className="text-[10px] px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 truncate">Attachment: {groupFile.name}</div>}
          <textarea value={groupMessage} onChange={(e) => setGroupMessage(e.target.value)} rows={2} placeholder="Share a scam warning or ask the group…" className="w-full resize-none px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <div className="flex items-center justify-between gap-2">
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
              <Paperclip className="w-3.5 h-3.5" /> Attach
              <input type="file" className="hidden" accept="image/*,video/*,audio/*" onChange={(e) => setGroupFile(e.target.files?.[0] || null)} />
            </label>
            <div className="flex items-center gap-1 text-slate-400" title="Photos, videos and audio are supported"><ImageIcon className="w-3 h-3" /><Video className="w-3 h-3" /><Mic className="w-3 h-3" /></div>
            <button disabled={groupLoading || (!groupMessage.trim() && !groupFile)} onClick={handleGroupSend} className="ml-auto px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-[10px] font-semibold flex items-center gap-1.5"><Send className="w-3.5 h-3.5" />Send</button>
          </div>
          <p className="text-[9px] text-slate-400">Automated moderation protects the discussion from credentials, spam and abusive content.</p>
        </div>
      </aside>
      </div>

      {/* Report Detail Modal */}
      <ReportDetailModal
        report={activeReportForDetail}
        isOpen={Boolean(activeReportForDetail)}
        onClose={() => setActiveReportForDetail(null)}
      />
    </div>
  );
};
