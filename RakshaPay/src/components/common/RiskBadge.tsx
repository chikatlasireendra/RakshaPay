import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';
import { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  score,
  showIcon = true,
  size = 'md',
}) => {
  const config = {
    low: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
      dot: 'bg-emerald-500',
      label: 'Low Risk',
      icon: ShieldCheck,
    },
    caution: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
      dot: 'bg-amber-500',
      label: 'Caution',
      icon: AlertTriangle,
    },
    high: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
      dot: 'bg-rose-500',
      label: 'High Risk',
      icon: AlertOctagon,
    },
  }[level];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-medium px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2',
  }[size];

  const Icon = config.icon;

  return (
    <span
      id={`risk-badge-${level}`}
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses} whitespace-nowrap shadow-xs transition-colors`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="font-mono text-[11px] opacity-80 border-l border-current pl-1 ml-0.5">
          {score}/100
        </span>
      )}
    </span>
  );
};
