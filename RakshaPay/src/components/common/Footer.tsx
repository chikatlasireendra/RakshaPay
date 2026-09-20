import React from 'react';
import { Shield, Lock, ExternalLink, Heart } from 'lucide-react';
import { ActiveView } from '../../types';

interface FooterProps {
  onNavigate: (view: ActiveView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">RakshaPay</span>
            </div>
            <p className="text-sm font-medium text-cyan-400">
              Detect. Explain. Learn. Protect.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-powered UPI scam prevention and community-driven scam intelligence. One person’s experience becomes protection for the next person.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero-knowledge client privacy masking enabled</span>
            </div>
          </div>

          {/* Col 2: Threat Analyzers */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Threat Analyzers
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('message-analyzer')}
                  className="hover:text-white transition-colors"
                >
                  Message & SMS Analyzer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('payment-analyzer')}
                  className="hover:text-white transition-colors"
                >
                  UPI Payment Risk Analyzer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('call-analyzer')}
                  className="hover:text-white transition-colors"
                >
                  Call Audio & Transcript Analyzer
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Community & Intelligence */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Community & Intel
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('community-feed')}
                  className="hover:text-white transition-colors"
                >
                  Community Reports Feed
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('report-scam')}
                  className="hover:text-white transition-colors"
                >
                  Submit Scam Experience
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('scam-intelligence')}
                  className="hover:text-white transition-colors"
                >
                  Scam Pattern Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('emerging-scams')}
                  className="hover:text-white transition-colors text-slate-400 hover:text-slate-200"
                >
                  Emerging Threat Alerts
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Safety & National Helplines */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Emergency Helplines (India)
            </h4>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs space-y-2">
              <div className="flex justify-between items-center text-rose-300 font-semibold">
                <span>National Cyber Crime Helpline</span>
                <span className="font-mono text-sm font-bold text-white bg-rose-900/60 px-2 py-0.5 rounded">1930</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Report financial cyber frauds within golden hour to freeze illicit fund transfers.
              </p>
              <div className="text-[11px] text-slate-300 pt-1 border-t border-slate-700">
                Official portal: <span className="text-cyan-400 font-mono">cybercrime.gov.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer and Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="max-w-2xl leading-relaxed text-center md:text-left">
            RakshaPay is a prototype safety-assistance platform. Risk assessments are informational and should not replace official financial institution or law-enforcement guidance. Never share your OTP, UPI PIN, or NetBanking password with anyone.
          </p>
          <div className="flex items-center gap-1 text-slate-400 shrink-0">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Digital India Protection</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
