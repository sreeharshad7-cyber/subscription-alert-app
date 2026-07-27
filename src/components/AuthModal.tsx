import React, { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { User } from '../types';
import { X, Lock, Mail, UserCheck, Shield, KeyRound, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, setUser } = useSubscription();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = () => {
    setUser({
      id: 'usr_google_' + Date.now(),
      name: 'Alex Sharma (Google)',
      email: 'alex.sharma@gmail.com',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      isGuest: false,
    });
    onClose();
  };

  const handleGuestSignIn = () => {
    setUser({
      id: 'usr_guest_' + Date.now(),
      name: 'Guest User',
      email: 'guest@subscriptionalert.app',
      photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      isGuest: true,
    });
    onClose();
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      setForgotSent(true);
      return;
    }

    setUser({
      id: 'usr_email_' + Date.now(),
      name: name || email.split('@')[0] || 'User',
      email: email || 'user@domain.com',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      isGuest: false,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-indigo-500/30 rounded-[2rem] max-w-sm w-full p-6 shadow-2xl space-y-5 relative"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
              <Shield size={24} />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              {mode === 'login' ? 'Sign In to Account' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Manage all subscriptions across devices</p>
          </div>

          {/* Google Sign-In Button */}
          {mode !== 'forgot' && (
            <button
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-4 rounded-2xl bg-slate-50 dark:bg-white hover:bg-slate-100 dark:hover:bg-slate-100 text-slate-900 font-extrabold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-transparent shadow-sm transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.14C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.59H1.29C.47 8.23 0 10.06 0 12s.47 3.77 1.29 5.41l3.99-3.14z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.59l3.99 3.14c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          )}

          {/* Divider */}
          {mode !== 'forgot' && (
            <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-wider">
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
              <span>or email</span>
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
            </div>
          )}

          {/* Email Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3 text-xs">
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Sharma"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {mode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {forgotSent && (
              <p className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold text-center border border-emerald-200 dark:border-transparent">
                Password reset link sent to your email!
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
            >
              {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
            </button>
          </form>

          {/* Guest Mode */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center space-y-2">
            <button
              onClick={handleGuestSignIn}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              Continue as Guest
            </button>

            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {mode === 'login' ? (
                <span>
                  Don't have an account?{' '}
                  <button onClick={() => setMode('signup')} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer">
                    Sign Up
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button onClick={() => setMode('login')} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer">
                    Sign In
                  </button>
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
