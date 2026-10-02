import React from 'react';
import { X, Printer, Download, Sparkles, CheckCircle2, QrCode, Shield, Calendar, MapPin, Clock } from 'lucide-react';

export default function PassModal({ registration, onClose }) {
  if (!registration) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-space-950/85 backdrop-blur-md animate-fade-in print:bg-white print:p-0">
      
      {/* Backdrop */}
      <div className="fixed inset-0 print:hidden" onClick={onClose}></div>

      {/* Main Container */}
      <div className="relative w-full max-w-xl bg-space-900 border border-cyber-cyan/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,240,255,0.3)] z-10 max-h-[92vh] overflow-y-auto print:border-none print:shadow-none print:max-w-none print:max-h-none print:p-4 print:text-black">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-space-800 transition-colors print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Pass Card */}
        <div className="relative rounded-2xl bg-gradient-to-b from-space-950 to-space-900 border-2 border-cyber-cyan/40 p-6 sm:p-8 overflow-hidden print:border-2 print:border-black print:bg-white print:text-black">
          
          {/* Lanyard Hole Visual */}
          <div className="w-16 h-3 mx-auto rounded-full bg-space-850 border border-slate-700 mb-6 print:hidden"></div>

          {/* Header */}
          <div className="text-center pb-5 border-b border-slate-800 print:border-black">
            <span className="text-[10px] font-mono tracking-widest text-cyber-cyan uppercase font-bold print:text-black block mb-1">
              Jaya Sakthi Engineering College
            </span>
            <span className="text-xs font-mono text-slate-400 print:text-gray-700 uppercase block mb-2">
              Department of Artificial Intelligence and Data Science
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-tech text-white print:text-black tracking-wider uppercase">
              CHRONYX <span className="text-cyber-cyan print:text-black">2026</span>
            </h2>
            <p className="text-[11px] font-mono text-slate-300 print:text-gray-600 uppercase tracking-widest mt-1">
              INNOVATE • ANALYZE • AUTOMATE
            </p>
          </div>

          {/* Badge Type */}
          <div className="my-5 flex items-center justify-between">
            <span className="px-3.5 py-1 rounded-full bg-cyber-cyan/15 border border-cyber-cyan text-cyber-cyan print:border-black print:text-black text-xs font-mono font-bold uppercase tracking-wider">
              OFFICIAL DELEGATE PASS
            </span>
            <span className="text-xs font-mono font-bold text-slate-300 print:text-black">
              ID: <span className="text-cyber-cyan print:text-black font-tech text-base">{registration.regId}</span>
            </span>
          </div>

          {/* Delegate Main Info */}
          <div className="space-y-4 mb-6">
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider print:text-gray-600">Participant Name</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-tech text-white print:text-black">
                {registration.name}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <p className="text-[10px] text-slate-400 uppercase print:text-gray-600">College / Institution</p>
                <p className="text-slate-200 font-bold truncate print:text-black">{registration.college}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase print:text-gray-600">Department & Year</p>
                <p className="text-slate-200 font-bold print:text-black">{registration.department} • {registration.year}</p>
              </div>
            </div>

            {/* Events Enrolled */}
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 print:text-gray-600">Registered Events</p>
              <div className="flex flex-wrap gap-1.5">
                {registration.events.map((ev, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-space-900 border border-slate-700 text-cyber-cyan print:border-black print:text-black text-xs font-mono font-semibold">
                    {ev}
                  </span>
                ))}
              </div>
            </div>

            {registration.teamName && (
              <div className="p-2.5 rounded-xl bg-space-950 border border-slate-800 print:border-black">
                <p className="text-[10px] font-mono text-cyber-purple print:text-black uppercase font-bold">
                  Team: {registration.teamName}
                </p>
              </div>
            )}
          </div>

          {/* Date, Time & Venue */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800 print:border-black text-center text-xs font-mono mb-6">
            <div>
              <p className="text-[10px] text-slate-400 print:text-gray-600">Date</p>
              <p className="font-bold text-white print:text-black">10-10-2026</p>
            </div>
            <div className="border-x border-slate-800 print:border-black">
              <p className="text-[10px] text-slate-400 print:text-gray-600">Time</p>
              <p className="font-bold text-cyber-cyan print:text-black">9:00 A.M</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 print:text-gray-600">Venue</p>
              <p className="font-bold text-white print:text-black">College Campus</p>
            </div>
          </div>

          {/* Barcode & Security Stamp Footer */}
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <div className="h-8 flex items-center space-x-1">
                {[4, 2, 6, 2, 8, 3, 5, 2, 7, 3, 4, 8, 2, 5, 6, 3, 7, 2, 4, 6].map((w, i) => (
                  <div key={i} className="bg-slate-300 print:bg-black h-full" style={{ width: `${w}px` }}></div>
                ))}
              </div>
              <p className="text-[9px] font-mono text-slate-500 print:text-black tracking-widest">
                VERIFIED PASS • CHRONYX-SECURE
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-emerald-400 print:text-black font-bold block">
                ● STATUS: {registration.status.toUpperCase()}
              </span>
              <span className="text-[9px] font-mono text-slate-400 print:text-black">
                UTR: {registration.utrNumber ? registration.utrNumber.slice(-6).padStart(12, '*') : 'VERIFIED'}
              </span>
            </div>
          </div>

        </div>

        {/* Modal Buttons (Hidden in Print) */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <p className="text-xs font-mono text-slate-400 text-center sm:text-left">
            Present this digital or printed pass at the registration desk on 10-10-2026.
          </p>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-space-800 hover:bg-space-700 text-white font-mono text-xs flex items-center space-x-1.5 transition-colors border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Pass</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-cyber-cyan text-space-950 font-tech font-bold text-xs uppercase tracking-wider hover:bg-sky-300 transition-colors"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
