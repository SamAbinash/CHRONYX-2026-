import React from 'react';
import { SCHEDULE_PHASES } from '../data/scheduleData';
import { 
  TicketCheck, Sparkles, Cpu, Coffee, Gamepad2, Trophy, Clock, Calendar, Activity 
} from 'lucide-react';

const ICON_MAP = {
  TicketCheck,
  Sparkles,
  Cpu,
  Coffee,
  Gamepad2,
  Trophy
};

export default function Schedule() {
  return (
    <section id="schedule" className="relative py-24 bg-transparent overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-blue/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-600/8 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full cyber-glass border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono uppercase tracking-widest mb-4">
            <Clock className="w-3.5 h-3.5" />
            <span>Agenda & Structure</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-tech tracking-tight text-white mb-4 uppercase">
            SYMPOSIUM <span className="cyber-gradient-text">TIMELINE</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base">
            Event Date: <strong className="text-white font-tech">10-10-2026</strong> • Starting Time: <strong className="text-cyber-cyan font-tech">9:00 A.M</strong>
          </p>
        </div>

        {/* Schedule Coming Soon / Notice Card with Telemetry Accents */}
        <div className="cyber-glass rounded-3xl p-6 sm:p-8 border border-cyber-cyan/40 shadow-[0_0_40px_rgba(0,240,255,0.18)] mb-12 text-center max-w-2xl mx-auto relative overflow-hidden tech-telemetry-border hud-scanline">
          {/* Corner HUD Brackets */}
          <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-cyber-cyan pointer-events-none"></div>
          <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-cyber-cyan pointer-events-none"></div>
          <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-cyber-cyan pointer-events-none"></div>
          <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-cyber-cyan pointer-events-none"></div>

          <div className="flex items-center justify-between text-[10px] font-mono text-cyber-cyan/80 pb-2 mb-4 border-b border-cyber-cyan/20">
            <span className="tracking-widest uppercase">AGENDA CONSOLE // SYS_TIMELINE</span>
            <span className="text-emerald-400 font-bold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>SYNCHRONIZED</span>
            </span>
          </div>

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyber-cyan/15 text-cyber-cyan mb-4 border border-cyber-cyan/35 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-tech text-white mb-2 uppercase tracking-wide">
            Detailed Schedule Will Be Updated
          </h3>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
            The symposium commences promptly at <strong className="text-cyber-cyan font-tech">9:00 A.M</strong> on <strong className="text-white font-tech">10-10-2026</strong>. Specific session-wise timing slots and lab allotments will be published here upon official release.
          </p>

          <div className="inline-block mt-4 px-4 py-1.5 rounded-full bg-space-950 border border-slate-700 text-slate-400 text-xs font-mono">
            Status: <span className="text-cyber-cyan font-semibold">Coming Soon</span>
          </div>
        </div>

        {/* Confirmed Program Sequence */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 text-center mb-6 flex items-center justify-center space-x-2">
            <span className="h-[1px] w-8 bg-slate-700"></span>
            <span>Program Sequence</span>
            <span className="h-[1px] w-8 bg-slate-700"></span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SCHEDULE_PHASES.map((item, index) => {
              const IconComponent = ICON_MAP[item.icon] || Clock;

              return (
                <div 
                  key={index}
                  className="cyber-glass rounded-2xl p-5 border border-slate-800/80 hover:border-cyber-cyan/50 hover:shadow-[0_0_25px_rgba(0,240,255,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group overflow-hidden"
                >
                  {/* Subtle top indicator bar */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyber-cyan/30 to-transparent group-hover:via-cyber-cyan transition-colors"></div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-space-950 border border-slate-700 group-hover:border-cyber-cyan/40 flex items-center justify-center text-cyber-cyan transition-colors">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-space-950 text-slate-400 border border-slate-800 group-hover:border-cyber-cyan/30 group-hover:text-cyber-cyan transition-colors">
                        {item.phase}
                      </span>
                    </div>

                    <h4 className="font-tech font-bold text-white text-base mb-1.5 group-hover:text-cyber-cyan transition-colors">
                      {item.title}
                    </h4>

                    <p className="text-slate-400 text-xs leading-relaxed font-mono">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
