import React from 'react';
import { Dna, Network, TrendingUp, Users } from 'lucide-react';

type DnaData = {
  scamType?: string;
  tactics?: string[];
  channels?: string[];
  keyPhrases?: string[];
  paymentPattern?: string;
  confidence?: number;
};

type MatchData = {
  overallSimilarity?: number;
  text?: number;
  tactics?: number;
  payment?: number;
  call?: number;
  dna?: number;
};

interface Props {
  scamDna?: DnaData;
  multiEvidenceMatch?: MatchData;
  emerging?: boolean;
}

export const InnovationInsights: React.FC<Props> = ({ scamDna, multiEvidenceMatch, emerging = true }) => {
  const hasDna = Boolean(scamDna);
  const hasMatch = Boolean(multiEvidenceMatch);
  if (!hasDna && !hasMatch) return null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
      {hasDna && (
        <section className="rounded-2xl border border-cyan-200 dark:border-cyan-900/60 bg-cyan-50/40 dark:bg-cyan-950/20 p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300"><Dna className="w-4 h-4" /></div>
              <div><h3 className="text-sm font-bold text-slate-900 dark:text-white">Scam DNA</h3><p className="text-[10px] text-slate-500">Structured fingerprint of this scam pattern</p></div>
            </div>
            {typeof scamDna?.confidence === 'number' && <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-300">{scamDna.confidence}% confidence</span>}
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-lg bg-white/70 dark:bg-slate-900 border border-cyan-100 dark:border-slate-800"><span className="text-slate-400 block">Type</span><b className="text-slate-800 dark:text-slate-200">{scamDna?.scamType || 'Pattern'}</b></div>
            <div className="p-2.5 rounded-lg bg-white/70 dark:bg-slate-900 border border-cyan-100 dark:border-slate-800"><span className="text-slate-400 block">Channel</span><b className="text-slate-800 dark:text-slate-200">{scamDna?.channels?.join(', ') || '—'}</b></div>
          </div>
          <div className="flex flex-wrap gap-1.5">{[...(scamDna?.tactics || []), ...(scamDna?.keyPhrases || [])].slice(0, 10).map((x, i) => <span key={`${x}-${i}`} className="px-2 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 text-[10px] font-medium">{x}</span>)}</div>
          {scamDna?.paymentPattern && <p className="text-[11px] text-slate-600 dark:text-slate-300">Payment pattern: <b>{scamDna.paymentPattern}</b></p>}
        </section>
      )}

      {hasMatch && (
        <section className="rounded-2xl border border-violet-200 dark:border-violet-900/60 bg-violet-50/40 dark:bg-violet-950/20 p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2"><div className="p-2 rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300"><Network className="w-4 h-4" /></div><div><h3 className="text-sm font-bold text-slate-900 dark:text-white">Multi-Evidence Matching</h3><p className="text-[10px] text-slate-500">Cross-checks independent scam evidence</p></div></div>
            <span className="text-lg font-extrabold text-violet-700 dark:text-violet-300">{multiEvidenceMatch?.overallSimilarity ?? 0}%</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(multiEvidenceMatch || {}).filter(([k]) => k !== 'overallSimilarity').map(([key, value]) => <div key={key} className="p-2 rounded-lg bg-white/70 dark:bg-slate-900 border border-violet-100 dark:border-slate-800"><div className="flex justify-between text-[10px] text-slate-500"><span className="capitalize">{key}</span><b>{value}%</b></div><div className="mt-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden"><div className="h-full bg-violet-500" style={{ width: `${Math.min(100, Number(value) || 0)}%` }} /></div></div>)}
          </div>
          <p className="text-[10px] text-violet-800 dark:text-violet-300">Similarity indicates a pattern match; it does not by itself prove fraud.</p>
        </section>
      )}
    </div>
  );
};
