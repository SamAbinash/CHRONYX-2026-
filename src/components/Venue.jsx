import React from 'react';
import { MapPin, Navigation, Train, Bus, ExternalLink, Compass } from 'lucide-react';

export default function Venue() {
  const mapsUrl = "https://www.google.com/maps/search/?api=1&query=Jaya+Sakthi+Engineering+College+Thiruninravur+Thiruvallur+District+Tamil+Nadu";

  return (
    <section id="venue" className="relative py-24 bg-transparent overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none opacity-20"></div>
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyber-cyan/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-10 right-1/4 w-80 h-80 bg-rose-600/8 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full cyber-glass border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono uppercase tracking-widest mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>Campus Destination</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-tech tracking-tight text-white mb-4 uppercase">
            Symposium <span className="cyber-gradient-text">Venue</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base">
            Official campus location details and directions for CHRONYX 2026.
          </p>
        </div>

        {/* Venue Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Campus Details & Transit Guide */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Primary Address Box */}
            <div className="cyber-glass rounded-3xl p-6 sm:p-8 border border-cyber-cyan/35 shadow-[0_0_40px_rgba(0,240,255,0.15)] relative overflow-hidden hud-scanline">
              {/* Corner HUD Brackets */}
              <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-cyber-cyan pointer-events-none"></div>
              <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-cyber-cyan pointer-events-none"></div>
              <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-cyber-cyan pointer-events-none"></div>
              <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-cyber-cyan pointer-events-none"></div>

              <div className="flex items-center justify-between text-[10px] font-mono text-cyber-cyan/80 pb-2 mb-4 border-b border-cyber-cyan/20">
                <span className="tracking-widest uppercase">DESTINATION // GRID_REF: TNV-602024</span>
                <span className="text-emerald-400 font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>NAV_LOCKED</span>
                </span>
              </div>

              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-cyber-cyan/15 border border-cyber-cyan/35 text-cyber-cyan flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-cyber-cyan uppercase tracking-widest font-semibold">
                    Venue
                  </span>
                  <h3 className="text-2xl font-bold font-tech text-white mt-0.5">
                    Jaya Sakthi Engineering College
                  </h3>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-space-950/80 border border-slate-800 text-slate-300 text-sm font-mono space-y-1 mb-6">
                <p className="text-white font-semibold">Jaya Sakthi Engineering College</p>
                <p className="text-slate-200">Thiruninravur – 602024</p>
                <p className="text-slate-400">Thiruvallur District, Tamil Nadu</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-space-950 font-bold font-tech text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-cyber-cyan/30 hover:scale-105 transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
              </div>
            </div>

            {/* Travel Transit Guidance Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Suburban Train */}
              <div className="cyber-glass rounded-2xl p-5 border border-slate-800">
                <div className="flex items-center space-x-3 mb-2 text-cyber-cyan">
                  <Train className="w-5 h-5" />
                  <h4 className="font-tech font-bold text-white text-sm">By Train</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Suburban railway connectivity via <strong className="text-slate-200">Thiruninravur Railway Station</strong>, located convenient to the college campus.
                </p>
              </div>

              {/* Bus Connectivity */}
              <div className="cyber-glass rounded-2xl p-5 border border-slate-800">
                <div className="flex items-center space-x-3 mb-2 text-cyber-purple">
                  <Bus className="w-5 h-5" />
                  <h4 className="font-tech font-bold text-white text-sm">By Bus / Road</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Regular public and local bus services operate to <strong className="text-slate-200">Thiruninravur</strong>, with connecting transit to the campus.
                </p>
              </div>

            </div>

          </div>

          {/* Right Column: Interactive Map Display Placeholder */}
          <div className="lg:col-span-6">
            <div className="cyber-glass rounded-3xl p-3 border border-slate-800 shadow-2xl relative group overflow-hidden">
              
              {/* Futuristic Map Overlay Simulation */}
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl bg-space-950 border border-slate-800/80 overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                
                {/* Visual Grid Lines */}
                <div className="absolute inset-0 bg-grid-cyber opacity-30"></div>
                
                {/* Radar Sweep Effect */}
                <div className="absolute w-72 h-72 rounded-full border border-cyber-cyan/30 animate-ping opacity-25"></div>
                <div className="absolute w-44 h-44 rounded-full border border-cyber-purple/30"></div>

                {/* Map Pin Point */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyber-cyan to-cyber-blue p-0.5 shadow-[0_0_30px_rgba(0,240,255,0.7)] animate-bounce mb-3">
                    <div className="w-full h-full bg-space-950 rounded-[14px] flex items-center justify-center text-cyber-cyan">
                      <MapPin className="w-7 h-7" />
                    </div>
                  </div>

                  <h4 className="font-tech text-xl font-bold text-white mb-1">
                    Jaya Sakthi Engineering College
                  </h4>
                  <p className="text-xs font-mono text-cyber-cyan mb-2">
                    College Campus • Thiruninravur – 602024
                  </p>
                  <p className="text-xs text-slate-400 max-w-sm mb-5">
                    Thiruvallur District, Tamil Nadu
                  </p>

                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-space-900 border border-cyber-cyan/50 text-white hover:text-cyber-cyan text-xs font-mono transition-colors"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Cyber Corner Borders */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyber-cyan"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyber-cyan"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyber-cyan"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyber-cyan"></div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
