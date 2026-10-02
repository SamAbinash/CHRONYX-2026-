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
    <section id="schedule" className="relative py-24 bg-space-900/60 overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-blue/10 rounded-full blur-[160px] pointer-events-none"></div>

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
        <div className="cyber-glass rounded-3xl p-6 sm:p-8 border border-cyber-cyan/40 shadow-[0_0_35px_rgba(0,240,255,0.15)] mb-12 text-center max-w-2xl mx-auto relative overflow-hidden tech-telemetry-border">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyber-cyan/15 text-cyber-cyan mb-4 border border-cyber-cyan/30 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-tech text-white mb-2 uppercase tracking-wide">
            Detailed Schedule Will Be Updated
          </h3>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
            The symposium commences promptly at <strong className="text-cyber-cyan">9:00 A.M</strong> on <strong className="text-white">10-10-2026</strong>. Specific session-wise timing slots and lab allotments will be published here upon official release.
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
                  className="cyber-glass rounded-2xl p-5 border border-slate-800 hover:border-cyber-cyan/40 hover:-translate-y-1 transition-all duration-300 shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-space-950 border border-slate-700 flex items-center justify-center text-cyber-cyan">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-space-950 text-slate-400 border border-slate-800">
                        {item.phase}
                      </span>
                    </div>

                    <h4 className="font-tech font-bold text-white text-base mb-1.5">
                      {item.title}
                    </h4>

                    <p className="text-slate-400 text-xs leading-relaxed">
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
