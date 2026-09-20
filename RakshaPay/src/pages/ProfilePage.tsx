import React, { useState } from 'react';
import { User, Shield, Bell, Moon, Sun, Key, LogOut, CheckCircle2 } from 'lucide-react';
import { ActiveView } from '../types';
import { authService } from '../services/authService';
import { userDataService } from '../services/userDataService';
import { UserAvatar, AVATAR_PRESETS } from '../components/common/UserAvatar';

interface ProfilePageProps {
  onNavigate: (view: ActiveView) => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onNavigate,
  onLogout,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const user = authService.getCurrentUser();
  const userStats = userDataService.getUserStats(user);
  const userReports = userDataService.getUserReports(user.id, user.email);

  const [name, setName] = useState(user.name);
  const [email] = useState(user.email);
  const [phone, setPhone] = useState(user.phoneNumber || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatarUrl || 'avatar-shield');
  const [pushAlerts, setPushAlerts] = useState(true);
  const [autoMasking, setAutoMasking] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    authService.updateProfile({
      name,
      phoneNumber: phone,
      avatarUrl: selectedAvatar,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-1 border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Account & Privacy Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage your verified profile, threat alert preferences, and automated PII masking controls.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center space-y-4 shadow-xs">
          <div className="flex justify-center">
            <UserAvatar avatarUrl={selectedAvatar} size="lg" />
          </div>

          <div>
            <h2 className="font-bold text-base text-slate-900 dark:text-white">{user.name}</h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{user.email}</p>
            <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              Role: {user.role}
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-left space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Scams Scanned:</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">
                {userStats.analysesCount}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Community Reports:</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">
                {userReports.length}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Confirmed Threats:</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">
                {user.confirmedThreatsCount || 0}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Trust Index:</span>
              {user.trustScore !== null && user.trustScore !== undefined ? (
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {user.trustScore}% (High)
                </span>
              ) : (
                <span className="text-slate-400 font-mono text-[11px] italic">
                  Unranked (New Account)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="md:col-span-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6">
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">
              Personal Information
            </h3>

            {saved && (
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile preferences updated successfully.</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Registered Email (Read-Only)
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alert Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="No phone number provided"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            {/* Avatar Selector in Profile */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Profile Avatar
              </label>
              <div className="flex items-center gap-2.5">
                {AVATAR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedAvatar(preset.id)}
                    className={`p-1 rounded-full transition-all ${
                      selectedAvatar === preset.id
                        ? 'ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-slate-900 scale-105'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    title={preset.name}
                  >
                    <UserAvatar avatarUrl={preset.id} size="sm" />
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy & Alerts Toggles */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                Security & Preferences
              </h3>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                    Automatic Client-Side PII Masking
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Always mask phone numbers and UPI IDs prior to community submission
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoMasking}
                  onChange={(e) => setAutoMasking(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                    Real-time Threat Push Notifications
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Get warned about active SMS or WhatsApp fraud campaigns in your state
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={pushAlerts}
                  onChange={(e) => setPushAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                    Appearance Mode
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Currently set to {isDarkMode ? 'Dark' : 'Light'} Mode
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onToggleDarkMode}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium flex items-center gap-1.5"
                >
                  {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                  <span>Toggle Theme</span>
                </button>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={onLogout}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
