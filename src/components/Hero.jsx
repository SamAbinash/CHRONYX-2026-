import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ArrowRight, Sparkles, ShieldCheck, ChevronDown, Flame, Activity } from 'lucide-react';
import AiCoreGraphic from './AiCoreGraphic';

export default function Hero({ onExploreEvents, onRegisterNow, onCheckStatus }) {
  // Countdown Timer target: October 10, 2026, 09:00:00 AM IST
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2026-10-10T09:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-screen pt-28 pb-20 flex items-center justify-center overflow-hidden bg-transparent">
      
      {/* Background Cybernetic Decor */}
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none opacity-40"></div>
      
      {/* Subtle Data Telemetry Header Line */}
      <div className="absolute top-16 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyber-cyan/20 to-transparent pointer-events-none"></div>

      {/* Radial Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-blue/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-[420px] h-[420px] bg-cyber-purple/20 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-cyber-cyan/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/4 right-12 w-[380px] h-[380px] bg-rose-600/10 rounded-full blur-[160px] pointer-events-none"></div>

      {/* Abstract AI Neural Core Graphic behind title */}
      <AiCoreGraphic />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        
        {/* College & Department Super-header */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full cyber-glass border border-cyber-cyan/30 text-cyber-cyan mb-6 shadow-[0_0_20px_rgba(0,240,255,0.15)] animate-pulse-glow">
          <Sparkles className="w-3.5 h-3.5 text-cyber-cyan shrink-0" />
          <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase font-mono">
            Jaya Sakthi Engineering College
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-xs sm:text-sm font-medium text-slate-300 hidden md:inline">
            Department of Artificial Intelligence and Data Science
          </span>
        </div>

        {/* Department Mobile View */}
        <p className="md:hidden text-xs text-cyber-cyan/90 font-mono uppercase tracking-widest mb-4">
          Department of Artificial Intelligence and Data Science
        </p>

        {/* Main Event Title with Futuristic Hologram Styling */}
        <div className="relative my-2 sm:my-4">
          <div className="inline-block relative">
            <h1 className="font-tech text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-white uppercase drop-shadow-[0_0_40px_rgba(0,240,255,0.4)]">
              CHRONYX
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-sky-300 to-cyber-purple relative ml-2 inline-block">
                2026
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cyber-cyan via-cyber-purple to-transparent rounded-full shadow-[0_0_10px_rgba(0,240,255,0.8)]"></span>
              </span>
            </h1>
          </div>
        </div>

        {/* Symposium Subtitle */}
        <div className="flex items-center justify-center space-x-3 my-3">
          <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-cyber-cyan"></div>
          <h2 className="text-base sm:text-2xl md:text-3xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-cyber-cyan to-purple-300 uppercase font-tech">
            AI & DATA SCIENCE SYMPOSIUM
          </h2>
          <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-purple-400"></div>
        </div>

        {/* Tagline */}
        <div className="inline-flex items-center space-x-2 sm:space-x-4 px-5 py-2 rounded-xl bg-space-900/80 border border-slate-800 text-slate-300 font-mono text-xs sm:text-sm font-semibold tracking-widest uppercase mb-8 shadow-inner">
          <span className="text-cyber-cyan">INNOVATE</span>
          <span className="text-cyber-purple">•</span>
          <span className="text-white">ANALYZE</span>
          <span className="text-cyber-purple">•</span>
          <span className="text-cyber-cyan">AUTOMATE</span>
        </div>

        {/* Event Key Details Badges with AI Telemetry */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto mb-10 text-left">
          
          {/* Date */}
          <div className="cyber-glass rounded-2xl p-4 flex items-center space-x-3.5 border-l-4 border-l-cyber-cyan group hover:border-cyber-cyan transition-all duration-300 tech-telemetry-border">
            <div className="p-2.5 rounded-xl bg-cyber-cyan/10 text-cyber-cyan group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase text-slate-400">Date of Event</p>
              <p className="text-base font-bold text-white font-tech">10-10-2026</p>
              <p className="text-[10px] text-cyber-cyan font-mono">Saturday</p>
            </div>
          </div>

          {/* Time */}
          <div className="cyber-glass rounded-2xl p-4 flex items-center space-x-3.5 border-l-4 border-l-cyber-purple group hover:border-cyber-purple transition-all duration-300 tech-telemetry-border">
            <div className="p-2.5 rounded-xl bg-cyber-purple/10 text-cyber-purple group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase text-slate-400">Starting Time</p>
              <p className="text-base font-bold text-white font-tech">9:00 A.M</p>
              <p className="text-[10px] text-purple-300 font-mono">Campus Reporting</p>
            </div>
          </div>

          {/* Venue */}
          <div className="cyber-glass rounded-2xl p-4 flex items-center space-x-3.5 border-l-4 border-l-cyber-blue group hover:border-cyber-blue transition-all duration-300 tech-telemetry-border">
            <div className="p-2.5 rounded-xl bg-cyber-blue/10 text-cyber-blue group-hover:scale-110 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase text-slate-400">Venue</p>
              <p className="text-base font-bold text-white font-tech">College Campus</p>
              <p className="text-[10px] text-sky-400 font-mono truncate">Thiruninravur – 602024</p>
            </div>
          </div>

        </div>

        {/* Futuristic Countdown Timer with Neural Frame */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center space-x-2 text-[11px] font-mono uppercase tracking-widest text-slate-400 mb-3">
            <Activity className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
            <span>Telemetry Countdown</span>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {[
              { label: 'DAYS', value: timeLeft.days },
              { label: 'HOURS', value: timeLeft.hours },
              { label: 'MINUTES', value: timeLeft.minutes },
              { label: 'SECONDS', value: timeLeft.seconds },
            ].map((unit) => (
              <div 
                key={unit.label} 
                className="cyber-glass rounded-2xl p-3 sm:p-4 text-center border border-cyber-cyan/20 shadow-[0_0_15px_rgba(0,240,255,0.08)] relative overflow-hidden group hover:border-cyber-cyan/40 transition-colors"
              >
                <div className="text-2xl sm:text-4xl md:text-5xl font-black font-tech text-white tracking-wider">
                  {String(unit.value).padStart(2, '0')}
                </div>
                <div className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-cyber-cyan mt-1">
                  {unit.label}
                </div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyber-cyan"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyber-cyan"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Futuristic CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          
          <button
            onClick={onRegisterNow}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyber-cyan via-sky-400 to-cyber-purple text-space-950 font-bold font-tech text-sm sm:text-base tracking-wider uppercase shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_40px_rgba(0,240,255,0.8)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 group"
          >
            <span>REGISTER PASS</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>

          <button
            onClick={onExploreEvents}
            className="w-full sm:w-auto px-8 py-4 rounded-xl cyber-glass border border-cyber-cyan/40 hover:border-cyber-cyan text-white font-tech font-bold text-sm sm:text-base tracking-wider uppercase hover:bg-cyber-cyan/10 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
          >
            <span>EXPLORE EVENTS</span>
          </button>

          <button
            onClick={onCheckStatus}
            className="w-full sm:w-auto px-5 py-4 rounded-xl text-slate-300 hover:text-cyber-cyan text-xs sm:text-sm font-mono tracking-wider transition-colors flex items-center justify-center space-x-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-cyber-cyan" />
            <span>CHECK STATUS</span>
          </button>

        </div>

      </div>

      {/* Subtle Scroll Down Prompt */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none opacity-60">
        <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Scroll Down</span>
        <ChevronDown className="w-4 h-4 text-cyber-cyan animate-bounce" />
      </div>

    </section>
  );
}
