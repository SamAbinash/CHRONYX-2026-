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
    <div className={`cyber-glass rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden border ${
      isTechnical 
        ? 'border-cyber-cyan/20 hover:border-cyber-cyan hover:shadow-[0_0_35px_rgba(0,240,255,0.25)] hover:-translate-y-1.5' 
        : 'border-cyber-purple/30 hover:border-cyber-purple hover:shadow-[0_0_35px_rgba(168,85,247,0.3)] hover:-translate-y-1.5'
    }`}>
      
      {/* Circuit-style Corner Brackets */}
      <div className={`absolute top-0 right-0 w-6 h-6 pointer-events-none transition-opacity duration-300 opacity-40 group-hover:opacity-100 ${
        isTechnical ? 'border-t-2 border-r-2 border-cyber-cyan' : 'border-t-2 border-r-2 border-cyber-purple'
      }`} />
      <div className={`absolute bottom-0 left-0 w-6 h-6 pointer-events-none transition-opacity duration-300 opacity-40 group-hover:opacity-100 ${
        isTechnical ? 'border-b-2 border-l-2 border-cyber-cyan' : 'border-b-2 border-l-2 border-cyber-purple'
      }`} />

      {/* Subtle Background Neural Grid Watermark */}
      <div className="absolute inset-0 bg-dot-matrix opacity-10 pointer-events-none"></div>

      <div className="relative z-10">
        
        {/* Header Telemetry: Icon & Category Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
            isTechnical 
              ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/35 shadow-[0_0_15px_rgba(0,240,255,0.2)]' 
              : 'bg-cyber-purple/15 text-cyber-purple border border-cyber-purple/35 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
          }`}>
            <IconComponent className="w-6 h-6" />
          </div>

          <div className="flex items-center space-x-2">
            <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
              isTechnical
                ? 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30'
                : 'bg-cyber-purple/15 text-purple-300 border border-cyber-purple/40'
            }`}>
              {event.category}
            </span>
          </div>
        </div>

        {/* Event Name */}
        <h3 className="text-xl sm:text-2xl font-bold font-tech text-white mb-2 group-hover:text-cyber-cyan transition-colors tracking-wide">
          {event.name}
        </h3>

        {/* Short Neutral Description */}
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
          {event.shortDescription}
        </p>

      </div>

      {/* Control Panel Action Buttons */}
      <div className="space-y-2 pt-3 border-t border-slate-800/80 relative z-10">
        
        {/* Rules & Details - Coming Soon */}
        <button
          onClick={() => onOpenDetails(event)}
          className="w-full py-2.5 px-3 rounded-xl bg-space-950/80 border border-slate-700/80 hover:border-cyber-cyan/50 text-slate-300 hover:text-white text-xs font-mono font-medium transition-all flex items-center justify-center space-x-1.5 group/btn"
        >
          <Clock className="w-3.5 h-3.5 text-cyber-cyan group-hover/btn:rotate-45 transition-transform" />
          <span>Rules & Details – Coming Soon</span>
        </button>

        {/* Register CTA */}
        <button
          onClick={() => onRegisterEvent(event.name)}
          className={`w-full py-2.5 px-3 rounded-xl font-mono text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-1.5 text-space-950 shadow-md ${
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
