import React from 'react';
import { X, Clock, Calendar, MapPin, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';

export default function EventModal({ event, onClose, onRegisterEvent }) {
  if (!event) return null;

  const isTechnical = event.category === 'Technical';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-space-950/80 backdrop-blur-md animate-fade-in">
      
      {/* Modal Backdrop click */}
      <div className="fixed inset-0" onClick={onClose}></div>

      {/* Modal Dialog Box */}
      <div className="relative w-full max-w-lg bg-space-900 border border-cyber-cyan/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.2)] z-10 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-space-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pr-8 mb-6">
          <span className={`inline-block text-[11px] font-mono font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2 ${
            isTechnical 
              ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30' 
              : 'bg-cyber-purple/15 text-purple-300 border border-cyber-purple/30'
          }`}>
            {event.category} Event
          </span>
          <h3 className="text-2xl sm:text-3xl font-black font-tech text-white">
            {event.name}
          </h3>
        </div>

        {/* Event Verified Meta */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-space-950 border border-slate-800/80 text-center mb-6 text-xs font-mono">
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

        {/* Description */}
        <div className="mb-6">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center">
            <BookOpen className="w-3.5 h-3.5 mr-1.5 text-cyber-cyan" />
            Description
          </h4>
          <p className="text-slate-300 text-sm leading-relaxed">
            {event.shortDescription}
          </p>
        </div>

        {/* Rules & Details Notice */}
        <div className="p-4 rounded-2xl bg-space-950 border border-cyber-cyan/30 mb-6 flex items-start space-x-3">
          <Clock className="w-5 h-5 text-cyber-cyan shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Rules & Details – Coming Soon
            </p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Official event guidelines, rounds, and participation details will be updated soon by the Department of Artificial Intelligence and Data Science.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-mono"
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
