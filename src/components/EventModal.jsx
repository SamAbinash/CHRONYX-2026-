import React, { useEffect, useRef } from 'react';
import {
  X, Clock, ArrowRight, BookOpen, FileText, Award,
  Terminal, Database, ScanFace, Cpu, Sparkles, Binary, SearchCode, Eye, Brain, Gamepad2
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

export default function EventModal({ event, onClose, onRegisterEvent }) {
  if (!event) return null;

  const isTechnical = event.category === 'Technical';
  const IconComponent = (event.icon && ICON_MAP[event.icon]) || (isTechnical ? Terminal : Gamepad2);

  // Check if event has populated details
  const hasDetails = Boolean(
    event.details &&
    (
      (Array.isArray(event.details) && event.details.length > 0) ||
      (typeof event.details === 'object' && !Array.isArray(event.details) && Object.keys(event.details).length > 0) ||
      (typeof event.details === 'string' && event.details.trim().length > 0)
    )
  );

  // Render populated details or placeholder
  const renderDetailsContent = () => {
    if (!hasDetails) {
      return (
        <div className="p-4 rounded-2xl bg-space-950 border border-slate-800/80 flex items-center space-x-3 text-slate-400">
          <Clock className="w-5 h-5 text-cyber-cyan shrink-0" />
          <p className="text-xs sm:text-sm font-mono text-slate-300">
            Details will be updated soon.
          </p>
        </div>
      );
    }

    // If details is an array
    if (Array.isArray(event.details)) {
      return (
        <div className="space-y-2.5">
          {event.details.map((item, idx) => {
            if (typeof item === 'string') {
              return (
                <div key={idx} className="p-3 rounded-xl bg-space-950 border border-slate-800/80 flex items-start space-x-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan mt-1.5 shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-300 leading-relaxed font-mono">{item}</span>
                </div>
              );
            }
            if (typeof item === 'object' && item !== null) {
              const title = item.title || item.round || item.name || item.heading || item.label;
              const desc = item.description || item.rules || item.text || item.details || item.value;
              return (
                <div key={idx} className="p-3.5 rounded-xl bg-space-950 border border-slate-800/80 space-y-1">
                  {title && (
                    <h5 className="text-xs font-mono font-bold text-cyber-cyan uppercase tracking-wider flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan shrink-0" />
                      <span>{title}</span>
                    </h5>
                  )}
                  {desc && (
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-3 font-mono">
                      {desc}
                    </p>
                  )}
                  {!title && !desc && (
                    <div className="space-y-1 text-xs text-slate-300 font-mono">
                      {Object.entries(item).map(([k, v]) => (
                        <p key={k}><span className="text-cyber-cyan font-bold">{k}:</span> {String(v)}</p>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <div key={idx} className="p-3 rounded-xl bg-space-950 border border-slate-800/80 text-xs sm:text-sm text-slate-300 font-mono">
                {String(item)}
              </div>
            );
          })}
        </div>
      );
    }

    // If details is an object
    if (typeof event.details === 'object' && event.details !== null) {
      return (
        <div className="space-y-3">
          {Object.entries(event.details).map(([key, val]) => (
            <div key={key} className="p-3.5 rounded-xl bg-space-950 border border-slate-800/80">
              <h5 className="text-xs font-mono font-bold text-cyber-cyan uppercase tracking-wider mb-2">
                {key.replace(/_/g, ' ')}
              </h5>
              {Array.isArray(val) ? (
                <ul className="space-y-1.5">
                  {val.map((sub, i) => (
                    <li key={i} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-300 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{typeof sub === 'string' ? sub : JSON.stringify(sub)}</span>
                    </li>
                  ))}
                </ul>
              ) : typeof val === 'object' && val !== null ? (
                <div className="space-y-1 text-xs text-slate-300 font-mono">
                  {Object.entries(val).map(([subK, subV]) => (
                    <p key={subK}><span className="text-slate-400 font-semibold">{subK}:</span> {String(subV)}</p>
                  ))}
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-mono">
                  {String(val)}
                </p>
              )}
            </div>
          ))}
        </div>
      );
    }

    // String fallback
    return (
      <div className="p-4 rounded-2xl bg-space-950 border border-slate-800/80 text-xs sm:text-sm text-slate-300 font-mono leading-relaxed whitespace-pre-line">
        {String(event.details)}
      </div>
    );
  };

  // Lock background page scroll while modal is active and allow escape key exit
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const scrollContainerRef = useRef(null);

  const handleDialogWheel = (e) => {
    // If scrolling on header or footer, forward the scroll to the scrollable content area
    if (scrollContainerRef.current && !scrollContainerRef.current.contains(e.target)) {
      scrollContainerRef.current.scrollTop += e.deltaY;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-space-950/85 backdrop-blur-md animate-fade-in overscroll-none">

      {/* Modal Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Box */}
      <div
        className="relative w-full max-w-lg max-h-[88vh] bg-space-950/95 border border-cyber-cyan/40 rounded-3xl shadow-[0_0_60px_rgba(0,240,255,0.25)] z-10 flex flex-col overflow-hidden hud-scanline overscroll-contain"
        onClick={(e) => e.stopPropagation()}
        onWheel={handleDialogWheel}
      >

        {/* 4-Corner HUD circuit brackets */}
        <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-cyber-cyan pointer-events-none z-20" />
        <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-cyber-cyan pointer-events-none z-20" />
        <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-cyber-cyan pointer-events-none z-20" />
        <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-cyber-cyan pointer-events-none z-20" />

        {/* Modal Header (Fixed / Non-scrolling) */}
        <div className="p-6 sm:p-7 pb-4 shrink-0 border-b border-slate-800/80 bg-space-950/90 relative z-10">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-space-800 transition-colors z-20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* HUD Mission Console Status Tag */}
          <div className="flex items-center justify-between text-[10px] font-mono text-cyber-cyan/80 pb-3 mb-4 border-b border-cyber-cyan/20 pr-8">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="tracking-wider">CONSOLE // SEC-07 // EVENT_INITIALIZED</span>
            </div>
            <span className="text-slate-500 font-mono text-[9px]">ID: {event.id || 'EVT'}</span>
          </div>

          {/* Modal Header with Icon, Category Badge & Name */}
          <div className="flex items-start space-x-3 sm:space-x-4 pr-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
              isTechnical
                ? 'bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/35 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                : 'bg-cyber-purple/15 text-cyber-purple border-cyber-purple/35 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
            }`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-1.5 mb-1.5">
                <span className={`inline-block text-[11px] font-mono font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${
                  isTechnical
                    ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30'
                    : 'bg-cyber-purple/15 text-purple-300 border border-cyber-purple/30'
                }`}>
                  {event.category} Event
                </span>
                {event.memberCount && (
                  <span className="inline-block text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-space-950 border border-slate-700 text-slate-300">
                    {event.memberCount}
                  </span>
                )}
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-tech text-white leading-tight">
                {event.name}
              </h3>
            </div>
          </div>
        </div>

        {/* Scrollable Event Content Area */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto overscroll-contain p-6 sm:p-7 pt-4 space-y-6 touch-pan-y"
          style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
        >
          {/* Event Verified Meta */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-space-950 border border-slate-800/80 text-center text-xs font-mono">
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Date</p>
              <p className="font-bold text-white mt-0.5">10-10-2026</p>
            </div>
            <div className="border-x border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase">Starting Time</p>
              <p className="font-bold text-cyber-cyan mt-0.5">9:00 A.M</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Venue</p>
              <p className="font-bold text-slate-200 mt-0.5 truncate">Campus</p>
            </div>
          </div>

          {/* Provisions Badge Bar */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-space-950 border border-cyber-cyan/30 text-center flex items-center justify-center space-x-1.5">
              <Award className="w-3.5 h-3.5 text-cyber-cyan shrink-0" />
              <span className="text-cyber-cyan font-bold">Certificate Provided</span>
            </div>
            <div className="p-2.5 rounded-xl bg-space-950 border border-cyber-purple/30 text-center flex items-center justify-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="text-purple-300 font-bold">Food Provided</span>
            </div>
          </div>

          {/* Short Description */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center">
              <BookOpen className="w-3.5 h-3.5 mr-1.5 text-cyber-cyan" />
              Description
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {event.shortDescription}
            </p>
          </div>

          {/* Event Details Section */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center">
              <FileText className="w-3.5 h-3.5 mr-1.5 text-cyber-cyan" />
              Event Details
            </h4>
            {renderDetailsContent()}
          </div>
        </div>

        {/* Modal Actions (Fixed at bottom) */}
        <div className="flex items-center justify-end space-x-3 p-4 sm:px-7 sm:py-4 border-t border-slate-800 bg-space-950/90 shrink-0 relative z-10">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-mono transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onRegisterEvent(event.name);
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-purple text-space-950 font-bold text-xs sm:text-sm font-tech tracking-wider uppercase shadow-lg shadow-cyber-cyan/30 hover:scale-105 transition-all flex items-center space-x-2"
          >
            <span>Register</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
