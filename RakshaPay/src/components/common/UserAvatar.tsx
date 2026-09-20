import React from 'react';
import { Shield, ShieldAlert, User as UserIcon, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export interface AvatarOption {
  id: string;
  name: string;
  bgColor: string;
  iconColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const AVATAR_PRESETS: AvatarOption[] = [
  {
    id: 'avatar-shield',
    name: 'Shield Blue',
    bgColor: 'bg-gradient-to-tr from-indigo-600 to-cyan-500',
    iconColor: 'text-white',
    icon: Shield
  },
  {
    id: 'avatar-emerald',
    name: 'Emerald Sentinel',
    bgColor: 'bg-gradient-to-tr from-emerald-600 to-teal-400',
    iconColor: 'text-white',
    icon: CheckCircle2
  },
  {
    id: 'avatar-amber',
    name: 'Amber Guard',
    bgColor: 'bg-gradient-to-tr from-amber-500 to-rose-500',
    iconColor: 'text-white',
    icon: ShieldAlert
  },
  {
    id: 'avatar-violet',
    name: 'Cyber Violet',
    bgColor: 'bg-gradient-to-tr from-purple-600 to-indigo-500',
    iconColor: 'text-white',
    icon: Sparkles
  },
  {
    id: 'avatar-slate',
    name: 'Slate Minimal',
    bgColor: 'bg-gradient-to-tr from-slate-700 to-slate-900',
    iconColor: 'text-slate-100',
    icon: UserIcon
  }
];

interface UserAvatarProps {
  avatarUrl?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  avatarUrl,
  name = 'User',
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-24 h-24 text-2xl'
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
    xl: 'w-12 h-12'
  };

  // If preset ID
  const preset = AVATAR_PRESETS.find(p => p.id === avatarUrl);
  if (preset) {
    const Icon = preset.icon;
    return (
      <div
        className={`${sizeClasses[size]} ${preset.bgColor} rounded-full flex items-center justify-center ${preset.iconColor} shadow-xs shrink-0 select-none ${className}`}
        title={name}
      >
        <Icon className={iconSizes[size]} />
      </div>
    );
  }

  // If external URL (like demo user's photo)
  if (avatarUrl && (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://') || avatarUrl.startsWith('data:'))) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700 ${className}`}
      />
    );
  }

  // Default fallback: initial letter inside clean indigo gradient
  const initial = (name || 'U').trim().charAt(0).toUpperCase() || 'U';
  return (
    <div
      className={`${sizeClasses[size]} bg-gradient-to-tr from-indigo-600 to-slate-800 rounded-full flex items-center justify-center text-white font-bold shadow-xs shrink-0 select-none ${className}`}
      title={name}
    >
      <span>{initial}</span>
    </div>
  );
};
