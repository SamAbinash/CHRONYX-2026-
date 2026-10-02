import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft, KeyRound, Sparkles, Cpu 
} from 'lucide-react';
import { loginAdmin, getAdminConfig } from '../../services/adminAuthService';

export default function AdminLogin({ onLoginSuccess, onBackToSite }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const config = getAdminConfig();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginAdmin(email, password);
      if (res.success) {
        if (onLoginSuccess) onLoginSuccess(res.user);
      } else {
        setError(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail(config.email);
    setPassword(config.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-space-950 flex flex-col items-center justify-center p-4 relative overflow-hidden text-slate-100">
      
      {/* Background Cybernetic Decor */}
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none opacity-30"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyber-cyan/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyber-purple/15 rounded-full blur-[130px] pointer-events-none"></div>

      {/* Top Bar with Back Link */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between z-10">
        <button
          onClick={onBackToSite}
          className="inline-flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-cyber-cyan transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Symposium Website</span>
        </button>

        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
          CHRONYX 2026 SECURE
        </span>
      </div>

      {/* Main Login Card */}
      <div className="relative w-full max-w-md cyber-glass rounded-3xl p-6 sm:p-8 border border-cyber-cyan/35 shadow-[0_0_50px_rgba(0,240,255,0.2)] z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-space-950 border border-cyber-cyan/40 text-cyber-cyan flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(0,240,255,0.25)]">
            <Cpu className="w-7 h-7" />
          </div>

          <span className="inline-block text-[10px] font-mono text-cyber-cyan border border-cyber-cyan/30 px-3 py-1 rounded-full uppercase tracking-widest mb-2 bg-cyber-cyan/10">
            Organizer Portal
          </span>

          <h2 className="text-2xl sm:text-3xl font-black font-tech text-white uppercase tracking-wider">
            ADMIN <span className="cyber-gradient-text">LOGIN</span>
          </h2>

          <p className="text-xs text-slate-400 font-mono mt-1">
            Department of AI & DS • Jaya Sakthi Engineering College
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase text-slate-300 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="admin@chronyx2026.jsec.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-space-950 border border-slate-700 focus:border-cyber-cyan rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-1 focus:ring-cyber-cyan transition-all"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-space-950 border border-slate-700 focus:border-cyber-cyan rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-1 focus:ring-cyber-cyan transition-all"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyber-cyan via-sky-400 to-cyber-purple text-space-950 font-bold font-tech text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(0,240,255,0.35)] hover:shadow-[0_0_35px_rgba(0,240,255,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Verifying Credentials...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>SIGN IN TO DASHBOARD</span>
              </>
            )}
          </button>

        </form>

        {/* Demo Helper Banner for Development */}
        {config.isDemo && (
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-2">
              Development Demo Configuration:
            </span>
            <div className="p-3 rounded-xl bg-space-950/80 border border-slate-800 text-left text-[11px] font-mono space-y-1 mb-2">
              <p className="text-slate-400 truncate">Email: <span className="text-cyber-cyan">{config.email}</span></p>
              <p className="text-slate-400 truncate">Password: <span className="text-amber-300">Chronyx@2026#Admin</span></p>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] font-mono text-cyber-cyan hover:underline transition-all"
            >
              ⚡ Auto-Fill Demo Credentials
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
