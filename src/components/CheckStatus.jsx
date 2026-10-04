import React, { useState, useEffect } from 'react';
import { getPublicRegistrationStatus } from '../services/registrationService';
import { 
  Search, ShieldCheck, CheckCircle2, Clock, AlertOctagon, Send, Ticket, 
  ExternalLink, User, Building, Layers, Sparkles 
} from 'lucide-react';

const STATUS_CONFIG = {
  'Payment Verification Pending': {
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/40',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]',
    icon: Clock,
    badgeText: 'Payment Verification Pending'
  },
  'Submitted': {
    color: 'text-cyber-cyan',
    bg: 'bg-cyber-cyan/15',
    border: 'border-cyber-cyan/40',
    glow: 'shadow-[0_0_20px_rgba(0,240,255,0.25)]',
    icon: Send,
    badgeText: 'Submitted'
  },
  'Confirmed': {
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/40',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]',
    icon: CheckCircle2,
    badgeText: 'Confirmed'
  },
  'Rejected': {
    color: 'text-rose-400',
    bg: 'bg-rose-500/15',
    border: 'border-rose-500/40',
    glow: 'shadow-[0_0_20px_rgba(244,63,94,0.25)]',
    icon: AlertOctagon,
    badgeText: 'Rejected'
  }
};

export default function CheckStatus({ activeSearchQuery, onViewPass }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // If query is passed externally (e.g. from registration success)
  useEffect(() => {
    if (activeSearchQuery) {
      setSearchQuery(activeSearchQuery);
      handleSearch(activeSearchQuery);
    }
  }, [activeSearchQuery]);

  const handleSearch = (queryToUse) => {
    const q = queryToUse !== undefined ? queryToUse : searchQuery;
    if (!q.trim()) return;

    setHasSearched(true);
    const found = getPublicRegistrationStatus(q);
    setResult(found || null);
  };

  const handleQuickDemoClick = (id) => {
    setSearchQuery(id);
    handleSearch(id);
  };

  const statusInfo = result ? (STATUS_CONFIG[result.status] || STATUS_CONFIG['Payment Verification Pending']) : null;
  const StatusIcon = statusInfo ? statusInfo.icon : ShieldCheck;

  return (
    <section id="status" className="relative py-24 bg-transparent overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none opacity-20"></div>
      <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-cyber-blue/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute top-1/4 right-10 w-80 h-80 bg-rose-600/8 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full cyber-glass border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono uppercase tracking-widest mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Status Terminal</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-tech tracking-tight text-white mb-4 uppercase">
            AI VERIFICATION <span className="cyber-gradient-text">DASHBOARD</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base">
            Enter your unique <strong className="text-white">Registration ID</strong> (e.g. CHX26-0001) to verify your registration status.
          </p>
        </div>

        {/* Search Box */}
        <div className="cyber-glass rounded-3xl p-6 sm:p-8 border border-cyber-cyan/35 shadow-[0_0_40px_rgba(0,240,255,0.15)] mb-8 relative overflow-hidden hud-scanline">
          {/* Corner HUD Brackets */}
          <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-cyber-cyan pointer-events-none"></div>
          <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-cyber-cyan pointer-events-none"></div>
          <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-cyber-cyan pointer-events-none"></div>
          <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-cyber-cyan pointer-events-none"></div>

          <div className="flex items-center justify-between text-[10px] font-mono text-cyber-cyan/80 pb-2 mb-4 border-b border-cyber-cyan/20">
            <span className="tracking-widest uppercase">VERIFICATION_NODE // LOOKUP_GATEWAY</span>
            <span className="text-emerald-400 font-bold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>ONLINE</span>
            </span>
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Enter Registration ID (e.g. CHX26-0001)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-space-950 border border-slate-700 focus:border-cyber-cyan rounded-2xl pl-12 pr-4 py-3.5 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyber-cyan font-mono transition-all uppercase"
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-space-950 font-bold font-tech text-sm uppercase tracking-wider shadow-lg shadow-cyber-cyan/30 hover:scale-105 transition-all flex items-center justify-center space-x-2 shrink-0"
            >
              <span>Search Status</span>
            </button>
          </form>

          {/* Quick Demo Test Chips */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Try Sample IDs to Test Status States:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoClick('CHX26-0002')}
                className="text-xs font-mono px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors flex items-center space-x-1"
              >
                <span>CHX26-0002</span>
                <span className="text-[10px] text-amber-300">(Verification Pending)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoClick('CHX26-0001')}
                className="text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors flex items-center space-x-1"
              >
                <span>CHX26-0001</span>
                <span className="text-[10px] text-emerald-300">(Confirmed)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoClick('CHX26-0003')}
                className="text-xs font-mono px-3 py-1.5 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/20 transition-colors flex items-center space-x-1"
              >
                <span>CHX26-0003</span>
                <span className="text-[10px] text-cyan-300">(Submitted)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoClick('CHX26-0004')}
                className="text-xs font-mono px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-colors flex items-center space-x-1"
              >
                <span>CHX26-0004</span>
                <span className="text-[10px] text-rose-300">(Rejected)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Result Card */}
        {hasSearched && (
          <div>
            {result ? (
              <div className={`cyber-glass rounded-3xl p-6 sm:p-8 border ${statusInfo.border} ${statusInfo.glow} relative overflow-hidden transition-all duration-300`}>
                
                {/* Status Header Badge */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-1">
                      Registration ID
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black font-tech text-white tracking-wider">
                      {result.regId}
                    </h3>
                  </div>

                  <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl border ${statusInfo.bg} ${statusInfo.border} ${statusInfo.color}`}>
                    <StatusIcon className="w-5 h-5 animate-pulse" />
                    <span className="font-tech font-bold text-sm tracking-wide uppercase">
                      {statusInfo.badgeText}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-slate-800 text-xs font-mono">
                  
                  {/* Participant Name */}
                  <div>
                    <span className="text-slate-400 block mb-0.5">Participant Name</span>
                    <span className="text-white font-bold text-base font-tech">{result.name}</span>
                  </div>

                  {/* Registration Status */}
                  <div>
                    <span className="text-slate-400 block mb-0.5">Registration Status</span>
                    <span className={`font-bold ${statusInfo.color}`}>{result.status}</span>
                  </div>

                  {/* Institution & Department */}
                  <div>
                    <span className="text-slate-400 block mb-0.5">College / Institution</span>
                    <span className="text-slate-200">{result.college}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Department & Year</span>
                    <span className="text-slate-200">{result.department} • {result.year}</span>
                  </div>

                  {/* Selected Event(s) */}
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block mb-1.5 font-semibold">Selected Event(s)</span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.events.map((ev, i) => (
                        <span key={i} className="px-3 py-1 rounded-md bg-space-950 border border-cyber-cyan/30 text-cyber-cyan text-xs font-semibold">
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Team Details if available */}
                  {result.teamType === 'Team' && result.teamName && (
                    <div className="sm:col-span-2 p-3 rounded-xl bg-space-950 border border-slate-800">
                      <span className="text-cyber-purple font-bold block mb-1">Team Name: {result.teamName}</span>
                      {result.teamMembers && result.teamMembers.length > 0 && (
                        <div className="text-slate-400 text-[11px]">
                          Members: {result.teamMembers.map(m => m.name).filter(Boolean).join(', ')}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submission date & UTR */}
                  <div>
                    <span className="text-slate-400 block mb-0.5">Submission Timestamp</span>
                    <span className="text-slate-300">{result.submittedAt}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Verification Desk</span>
                    <span className="text-cyber-cyan font-bold">AI & DS Organizing Desk</span>
                  </div>

                </div>

                {/* Remarks & Action */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-300 leading-relaxed max-w-md">
                    <strong className="text-white block font-mono">Remarks:</strong>
                    <span>{result.remarks}</span>
                  </div>

                  {onViewPass && (
                    <button
                      onClick={() => onViewPass(result)}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-space-950 font-bold font-tech text-xs uppercase tracking-wider shadow-lg shadow-cyber-cyan/30 hover:scale-105 transition-all flex items-center space-x-2 shrink-0"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>View Delegate Pass</span>
                    </button>
                  )}
                </div>

              </div>
            ) : (
              <div className="cyber-glass rounded-3xl p-10 text-center border border-slate-800 max-w-md mx-auto">
                <AlertOctagon className="w-12 h-12 text-rose-400 mx-auto mb-3" />
                <h4 className="text-xl font-bold font-tech text-white">No Record Found</h4>
                <p className="text-xs text-slate-400 mt-2 mb-4 leading-relaxed">
                  We could not locate any registration matching "{searchQuery}". Please verify the Registration ID.
                </p>
                <a
                  href="#register"
                  className="inline-block px-4 py-2 rounded-xl bg-cyber-cyan text-space-950 font-bold font-mono text-xs uppercase"
                >
                  Register Now
                </a>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
