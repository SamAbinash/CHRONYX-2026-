import React from 'react';
import {
  Ticket,
  Clock,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function RegistrationForm({ onNavigateHome }) {
  return (
    <section
      id="register"
      className="relative min-h-[70vh] py-24 bg-transparent overflow-hidden flex items-center"
    >
      {/* Cyber background */}
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none opacity-20" />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-cyan/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-purple/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main content */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="cyber-glass rounded-3xl p-8 sm:p-12 border border-rose-500/40 shadow-[0_0_60px_rgba(244,63,94,0.15)] text-center relative overflow-hidden">
          {/* Corner decorations */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-rose-400 pointer-events-none" />

          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-rose-400 pointer-events-none" />

          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-rose-400 pointer-events-none" />

          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-rose-400 pointer-events-none" />

          {/* Official portal label */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full cyber-glass border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono uppercase tracking-widest mb-8">
            <Ticket className="w-4 h-4" />
            <span>CHRONYX 2026 • Official Portal</span>
          </div>

          {/* Status icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/40 flex items-center justify-center">
            <Clock className="w-10 h-10 text-rose-400" />
          </div>

          {/* Registration status */}
          <p className="text-rose-400 text-xs sm:text-sm font-mono uppercase tracking-[0.3em] mb-4">
            Registration Status: Closed
          </p>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-tech tracking-tight text-white mb-6">
            REGISTRATION
            <br />
            <span className="text-rose-400">CLOSED</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base font-mono leading-relaxed max-w-2xl mx-auto mb-8">
            Registrations for CHRONYX 2026 are now officially closed.
            Thank you to everyone who registered and showed interest
            in our symposium.
          </p>

          {/* Event details */}
          <div className="max-w-md mx-auto rounded-2xl bg-space-950/70 border border-slate-800 p-5 mb-8">
            <div className="flex items-center justify-center gap-2 text-cyber-cyan mb-3">
              <Sparkles className="w-5 h-5" />

              <span className="font-tech font-bold uppercase tracking-wider">
                CHRONYX 2026
              </span>
            </div>

            <p className="text-white text-sm font-mono mb-2">
              10 October 2026
            </p>

            <p className="text-slate-400 text-xs sm:text-sm font-mono">
              Department of Artificial Intelligence &amp; Data Science
            </p>

            <p className="text-slate-400 text-xs sm:text-sm font-mono mt-1">
              Jaya Sakthi Engineering College
            </p>
          </div>

          {/* Confirmation message */}
          <div className="max-w-md mx-auto flex items-start gap-3 text-left p-4 rounded-xl border border-cyber-cyan/20 bg-cyber-cyan/5 mb-8">
            <CheckCircle2 className="w-5 h-5 text-cyber-cyan shrink-0 mt-0.5" />

            <p className="text-slate-300 text-xs sm:text-sm font-mono leading-relaxed">
              Already registered? Your existing registration details
              remain in our records. Thank you for being part of CHRONYX 2026!
            </p>
          </div>

          {/* Home navigation */}
          {typeof onNavigateHome === 'function' && (
            <button
              type="button"
              onClick={onNavigateHome}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-space-950 font-bold font-tech text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-cyber-cyan/20 hover:scale-105 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          )}

          <p className="text-slate-500 text-[10px] sm:text-xs font-mono mt-8">
            THANK YOU FOR BEING PART OF THE NEXT WAVE OF INNOVATION
          </p>
        </div>
      </div>
    </section>
  );
}