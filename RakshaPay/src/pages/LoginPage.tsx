import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, User, KeyRound, ArrowLeft } from 'lucide-react';
import { ActiveView, User as UserType } from '../types';
import { authService } from '../services/authService';

interface LoginPageProps {
  onNavigate: (view: ActiveView) => void;
  onLoginSuccess: (user?: UserType) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('demo@scamshield.app');
  const [password, setPassword] = useState('Demo@12345');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot Password flow state
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitted, setResetSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login(email, password);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setError(res.error || 'Login failed. Check your email and password.');
      }
    } catch {
      setError('An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setError(null);
    setResetSubmitted(true);
  };

  const setDemoUser = () => {
    setEmail('demo@scamshield.app');
    setPassword('Demo@12345');
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
        {/* Left Side: Security Art & Identity */}
        <div className="p-8 sm:p-10 bg-gradient-to-br from-indigo-900 via-slate-900 to-cyan-950 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">RakshaPay</span>
            </div>
            <h2 className="text-2xl font-bold leading-tight">
              Protect your digital finances before you authorize.
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Log in to access your threat scan history, contribute verified scam patterns, and participate in collective intelligence.
            </p>
          </div>

          {/* Product information */}
          <div className="space-y-3 pt-5 border-t border-indigo-800/40">
            <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">What RakshaPay does</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                ['Scam DNA + Multi-Evidence Matching', 'Connect message, payment, call and behavioral evidence.'],
                ['Community Scam Intelligence', 'Turn reported experiences into reusable scam patterns.'],
                ['Emerging Scam Detection', 'Highlight fast-growing combinations of tactics and channels.'],
                ['Community Groups', 'Discuss scam experiences with text, photo, video and audio evidence.'],
              ].map(([title, desc]) => (
                <div key={title} className="p-2.5 rounded-lg bg-white/5 border border-indigo-800/40">
                  <div className="text-xs font-semibold text-white">{title}</div>
                  <div className="text-[10px] text-slate-300 mt-0.5 leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Demo Credentials Card */}
          <div className="space-y-2.5 pt-6 relative z-10">
            <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
              Demo Credentials (Click to autofill)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={setDemoUser}
                className="p-2.5 rounded-lg text-left bg-indigo-950/70 border border-indigo-700/60 hover:border-indigo-400 text-indigo-100 transition-colors"
              >
                <div className="font-bold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Demo User</span>
                </div>
                <div className="text-[10px] text-slate-300 font-mono mt-0.5 truncate">demo@scamshield.app</div>
                <div className="text-[10px] text-slate-400 font-mono">Demo@12345</div>
              </button>


            </div>
          </div>

          <div className="space-y-2 pt-6 relative z-10 border-t border-indigo-800/40">
            <div className="flex items-center gap-2 text-xs text-cyan-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Zero-knowledge client privacy masking</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-cyan-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Backend-verified login with protected user data</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login or Reset Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          {isForgotPassword ? (
            /* Forgot Password Flow */
            <div>
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setResetSubmitted(false);
                  setError(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6 font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to log in</span>
              </button>

              <div className="mb-6">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Reset Password</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enter your registered email address to receive password recovery instructions.
                </p>
              </div>

              {resetSubmitted ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Password reset link sent to your email.</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-emerald-700 dark:text-emerald-300/90">
                      If an account exists for <span className="font-semibold underline">{resetEmail || email}</span>, a password reset link has been dispatched. Please check your inbox and spam folders.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setResetSubmitted(false);
                    }}
                    className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    Return to Log In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={resetEmail || email}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    id="reset-password-submit-btn"
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Normal Login Form */
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Welcome back</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enter your credentials to access your RakshaPay portal
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="login-email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="demo@scamshield.app"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setResetEmail(email);
                        setIsForgotPassword(true);
                        setError(null);
                      }}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="login-password-input"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Log In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-slate-500 mt-6">
                Don't have an account?{' '}
                <button
                  onClick={() => onNavigate('register')}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  Create an account
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

