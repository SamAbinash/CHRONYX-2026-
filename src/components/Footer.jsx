import React from 'react';
import { 
  Cpu, ArrowUp, MessageCircle, Mail, MapPin, Calendar, Clock, Lock 
} from 'lucide-react';

function InstagramIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

export default function Footer({ onNavigate, onOpenOrganizer }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Events Lineup', id: 'events' },
    { label: 'Schedule', id: 'schedule' },
    { label: 'Campus Venue', id: 'venue' },
    { label: 'Coordinators', id: 'contact' },
    { label: 'Check Status', id: 'status' },
    { label: 'Register Pass', id: 'register' },
  ];

  return (
    <footer className="relative bg-space-950/85 backdrop-blur-md border-t border-cyber-cyan/20 pt-14 pb-12 overflow-hidden text-slate-400 text-xs font-mono">

      {/* Background Subtle Cyber Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-32 bg-cyber-cyan/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Emergency Grid Telemetry Strip */}
        <div className="flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-500 pb-6 mb-8 border-b border-slate-800/80 gap-3">
          <div className="flex items-center space-x-2 text-cyber-cyan">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse"></span>
            <span>SYSTEM: CHRONYX_CORE_V2.6 // STATUS: OPTIMAL</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline text-slate-400">ENCRYPTION: 256_SHA</span>
            <span className="hidden md:inline text-slate-400">GEO_BEACON: 13.1256° N, 80.0382° E</span>
            <span className="text-emerald-400 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>GRID_SYNC: 100%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/70">
          
          {/* Col 1: Brand & College Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-space-900 border border-cyber-cyan/40 flex items-center justify-center text-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="font-tech text-2xl font-black text-white tracking-wider">
                  CHRONYX<span className="text-cyber-cyan">.2026</span>
                </span>
                <p className="text-[10px] text-cyber-cyan tracking-widest uppercase">
                  AI & Data Science Symposium
                </p>
              </div>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm">
              Organized by the <strong className="text-white">Department of Artificial Intelligence and Data Science</strong>, <strong className="text-white">Jaya Sakthi Engineering College</strong>.
            </p>

            <div className="inline-flex items-center space-x-2 text-[11px] font-bold text-cyber-cyan tracking-widest uppercase">
              <span>INNOVATE</span>
              <span>•</span>
              <span>ANALYZE</span>
              <span>•</span>
              <span>AUTOMATE</span>
            </div>

            {/* Social Media Placeholders for Instagram and WhatsApp */}
            <div className="pt-2">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-2">
                Official Channels
              </span>
              <div className="flex items-center space-x-3">
                
                {/* Instagram Placeholder */}
                <a
                  href="#contact"
                  title="Official Instagram Placeholder"
                  className="w-10 h-10 rounded-xl bg-space-900 border border-slate-800 hover:border-pink-500/50 hover:bg-pink-500/10 text-slate-300 hover:text-pink-400 flex items-center justify-center transition-all group"
                >
                  <InstagramIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>

                {/* WhatsApp Placeholder */}
                <a
                  href="#contact"
                  title="Official WhatsApp Placeholder"
                  className="w-10 h-10 rounded-xl bg-space-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 flex items-center justify-center transition-all group"
                >
                  <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>

                {/* Contact Email Placeholder */}
                <a
                  href="#contact"
                  title="Department Maildesk"
                  className="w-10 h-10 rounded-xl bg-space-900 border border-slate-800 hover:border-cyber-cyan/50 hover:bg-cyber-cyan/10 text-slate-300 hover:text-cyber-cyan flex items-center justify-center transition-all group"
                >
                  <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>

              </div>
            </div>

          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-4">
            <h4 className="text-xs uppercase tracking-widest font-tech font-bold text-white mb-4">
              Quick Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="text-left text-slate-400 hover:text-cyber-cyan transition-colors py-1 flex items-center"
                >
                  <span className="text-cyber-cyan mr-1.5 opacity-60">›</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Col 3: Key Event Details */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-tech font-bold text-white mb-4">
              Event Details
            </h4>
            
            <div className="flex items-start space-x-2 text-xs text-slate-300">
              <Calendar className="w-4 h-4 text-cyber-cyan shrink-0 mt-0.5" />
              <span>10-10-2026 (Saturday)</span>
            </div>

            <div className="flex items-start space-x-2 text-xs text-slate-300">
              <Clock className="w-4 h-4 text-cyber-purple shrink-0 mt-0.5" />
              <span>Starting Time: 9:00 A.M</span>
            </div>

            <div className="flex items-start space-x-2 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>Jaya Sakthi Engineering College, Thiruninravur – 602024, Thiruvallur District, Tamil Nadu</span>
            </div>

            <div className="pt-2">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center space-x-2 px-3 py-2 rounded-xl bg-space-900 border border-slate-700 hover:border-cyber-cyan text-slate-300 hover:text-white transition-all text-xs"
              >
                <ArrowUp className="w-3.5 h-3.5 text-cyber-cyan" />
                <span>Back to Top</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 <strong className="text-slate-300">CHRONYX 2026</strong>. Department of Artificial Intelligence and Data Science, Jaya Sakthi Engineering College. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <span>INNOVATE – ANALYZE – AUTOMATE</span>
            {onOpenOrganizer && (
              <button
                onClick={onOpenOrganizer}
                title="Protected Organizer Portal (Authorized Key Required)"
                className="p-1 rounded-lg text-slate-700 hover:text-slate-400 hover:bg-space-900 transition-colors"
                aria-label="Organizer Access"
              >
                <Lock className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}
