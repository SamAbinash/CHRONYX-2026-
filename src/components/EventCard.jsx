import React from 'react';
import { 
  Terminal, Database, ScanFace, Cpu, Sparkles, Binary, SearchCode, Eye, Brain, Gamepad2,
  ArrowRight, Clock, FileText, ChevronRight
} from 'lucide-react';

const ICON_MAP = {
  Terminal,
  Database,
  ScanFace,
  Cpu,
  Sparkles,
  Binary,
  SearchCode,
  Eye,
  Brain,
  Gamepad2
};

export default function EventCard({ event, onOpenDetails, onRegisterEvent }) {
  const IconComponent = ICON_MAP[event.icon] || Terminal;
  const isTechnical = event.category === 'Technical';

  return (
    <div className={`cyber-glass hud-scanline rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden border ${
      isTechnical 
        ? 'border-cyber-cyan/30 hover:border-cyber-cyan hover:shadow-[0_0_35px_rgba(0,240,255,0.3)] hover:-translate-y-1.5'
        : 'border-cyber-purple/35 hover:border-cyber-purple hover:shadow-[0_0_35px_rgba(168,85,247,0.35)] hover:-translate-y-1.5'
    }`}>
      
      {/* Circuit-style Corner Brackets */}
      <div className={`absolute top-0 right-0 w-6 h-6 pointer-events-none transition-opacity duration-300 opacity-60 group-hover:opacity-100 ${
        isTechnical ? 'border-t-2 border-r-2 border-cyber-cyan' : 'border-t-2 border-r-2 border-cyber-purple'
      }`} />
      <div className={`absolute bottom-0 left-0 w-6 h-6 pointer-events-none transition-opacity duration-300 opacity-60 group-hover:opacity-100 ${
        isTechnical ? 'border-b-2 border-l-2 border-cyber-cyan' : 'border-b-2 border-l-2 border-cyber-purple'
      }`} />
      <div className={`absolute top-0 left-0 w-2.5 h-2.5 pointer-events-none opacity-40 ${
        isTechnical ? 'border-t border-l border-cyber-cyan' : 'border-t border-l border-cyber-purple'
      }`} />
      <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 pointer-events-none opacity-40 ${
        isTechnical ? 'border-b border-r border-cyber-cyan' : 'border-b border-r border-cyber-purple'
      }`} />

      {/* Subtle Background Neural Grid Watermark */}
      <div className="absolute inset-0 bg-dot-matrix opacity-10 pointer-events-none"></div>

      <div className="relative z-10">
        
        {/* Tiny Technical HUD Node Label */}
        <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mb-3 tracking-widest uppercase">
          <span className="flex items-center space-x-1">
            <span className={`w-1 h-1 rounded-full ${isTechnical ? 'bg-cyber-cyan animate-pulse' : 'bg-cyber-purple animate-pulse'}`}></span>
            <span>HUD // NODE_{event.id.replace(/-/g, '_').toUpperCase()}</span>
          </span>
          <span className="opacity-60">SYS_OK</span>
        </div>

        {/* Header Telemetry: Icon & Category Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
            isTechnical 
              ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/35 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
              : 'bg-cyber-purple/15 text-cyber-purple border border-cyber-purple/35 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
          }`}>
            <IconComponent className="w-6 h-6" />
          </div>

          <div className="flex items-center space-x-2">
            <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
              isTechnical
                ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/35'
                : 'bg-cyber-purple/20 text-purple-300 border border-cyber-purple/45'
            }`}>
              {event.category}
            </span>
          </div>
        </div>

        {/* Event Name & Member Count Badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-xl sm:text-2xl font-bold font-tech text-white group-hover:text-cyber-cyan transition-colors tracking-wide">
            {event.name}
          </h3>
          {event.memberCount && (
            <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full shrink-0 mt-1 font-semibold border ${
              isTechnical
                ? 'bg-space-950/80 text-cyber-cyan border-cyber-cyan/30'
                : 'bg-space-950/80 text-purple-300 border-purple-400/30'
            }`}>
              {event.memberCount}
            </span>
          )}
        </div>

        {/* Short Neutral Description */}
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
          {event.shortDescription}
        </p>

      </div>

      {/* Control Panel Action Buttons */}
      <div className="space-y-2 pt-3 border-t border-slate-800/80 relative z-10">
        
        {/* Rules & Details */}
        <button
          onClick={() => onOpenDetails(event)}
          className="w-full py-2.5 px-3 rounded-xl bg-space-950/80 border border-slate-700/80 hover:border-cyber-cyan/50 text-slate-300 hover:text-white text-xs font-mono font-medium transition-all flex items-center justify-center space-x-1.5 group/btn"
        >
          <FileText className="w-3.5 h-3.5 text-cyber-cyan group-hover/btn:scale-110 transition-transform" />
          <span>View Rules & Details</span>
        </button>

        {/* Register CTA */}
        <button
          onClick={() => onRegisterEvent(event.name)}
          className={`w-full py-2.5 px-3 rounded-xl font-tech text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center space-x-1.5 text-space-950 shadow-md hover:scale-[1.02] active:scale-[0.98] ${
            isTechnical
              ? 'bg-cyber-cyan hover:bg-sky-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.6)]'
              : 'bg-gradient-to-r from-purple-400 to-pink-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]'
          }`}
        >
          <span>Register</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

      </div>

    </div>
  );
}
