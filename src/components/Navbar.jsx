import React, { useState, useEffect } from 'react';
import { Menu, X, Cpu, Ticket, ShieldCheck } from 'lucide-react';

export default function Navbar({ onNavigate, activeSection }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Events', href: '#events', id: 'events' },
    { name: 'Schedule', href: '#schedule', id: 'schedule' },
    { name: 'Venue', href: '#venue', id: 'venue' },
    { name: 'Contact', href: '#contact', id: 'contact' },
    { name: 'Check Status', href: '#status', id: 'status' },
  ];

  const handleLinkClick = (id) => {
    setIsOpen(false);
    if (onNavigate) {
      onNavigate(id);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-space-950/80 backdrop-blur-xl border-b border-cyber-cyan/20 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
        : 'bg-space-950/40 backdrop-blur-md border-b border-slate-800/40 py-4 sm:py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <a 
            href="#home" 
            onClick={(e) => { e.preventDefault(); handleLinkClick('home'); }}
            className="flex items-center space-x-3 group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-space-900 border border-cyber-cyan/40 group-hover:border-cyber-cyan transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.5)]">
              <Cpu className="w-5 h-5 text-cyber-cyan group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyber-purple rounded-full animate-ping opacity-75" />
            </div>
            <div className="flex flex-col">
              <span className="font-tech text-xl sm:text-2xl font-black tracking-wider text-white group-hover:text-cyber-cyan transition-colors">
                CHRONYX<span className="text-cyber-cyan">.26</span>
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 uppercase font-mono">
                AI & DS • JSEC
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5 p-1 rounded-2xl bg-space-900/40 border border-slate-800/60 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleLinkClick(link.id); }}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? 'text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/30 shadow-[0_0_12px_rgba(0,240,255,0.2)] font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-space-850/60'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent rounded-full shadow-[0_0_8px_rgba(0,240,255,0.8)]"></span>
                  )}
                  {link.id === 'status' && !isActive && (
                    <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse"></span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Button - Primary CTA: REGISTER PASS */}
          <div className="hidden sm:flex items-center space-x-3">
            <a
              href="#register"
              onClick={(e) => { e.preventDefault(); handleLinkClick('register'); }}
              className="relative inline-flex items-center justify-center px-5 py-2.5 text-xs sm:text-sm font-bold tracking-wider uppercase font-tech text-space-950 bg-gradient-to-r from-cyber-cyan via-sky-400 to-cyber-purple rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] group"
            >
              <Ticket className="w-4 h-4 mr-2 text-space-950 group-hover:rotate-12 transition-transform duration-300" />
              <span>REGISTER PASS</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            <a
              href="#register"
              onClick={(e) => { e.preventDefault(); handleLinkClick('register'); }}
              className="text-xs px-3 py-1.5 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-space-950 font-bold rounded-lg font-tech uppercase flex items-center shadow-md"
            >
              <Ticket className="w-3.5 h-3.5 mr-1" />
              PASS
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-space-850 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
              aria-label="Toggle navigation"
            >
              {isOpen ? <X className="w-6 h-6 text-cyber-cyan" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-space-950/95 backdrop-blur-2xl border-b border-cyber-cyan/25 px-4 pt-3 pb-6 space-y-2 mt-2 shadow-2xl animate-fade-in">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleLinkClick(link.id); }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium ${
                  activeSection === link.id
                    ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'text-slate-300 hover:bg-space-850 hover:text-white'
                }`}
              >
                <span>{link.name}</span>
                {link.id === 'status' && (
                  <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse"></span>
                )}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800">
            <a
              href="#register"
              onClick={(e) => { e.preventDefault(); handleLinkClick('register'); }}
              className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-gradient-to-r from-cyber-cyan via-sky-400 to-cyber-purple text-space-950 font-bold font-tech text-xs uppercase tracking-wider text-center shadow-lg"
            >
              <Ticket className="w-4 h-4 mr-2" />
              REGISTER PASS
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
