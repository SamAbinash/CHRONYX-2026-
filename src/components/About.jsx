import React from 'react';
import { Cpu, Terminal, Award, Users, Sparkles, Binary, Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react';

export default function About() {
  const highlights = [
    {
      icon: Terminal,
      title: '7 Technical Events',
      desc: 'Competitions in code analysis, datathon modeling, deepfake detection, vibe coding, and algorithmic problem solving.',
      color: 'text-cyber-cyan',
      borderColor: 'border-cyber-cyan/30',
      bgColor: 'bg-cyber-cyan/10'
    },
    {
      icon: Binary,
      title: '3 Non-Technical Arenas',
      desc: 'Exciting competitions in E-Sports tournament, tool finder, and mystery escape room challenge.',
      color: 'text-cyber-purple',
      borderColor: 'border-cyber-purple/30',
      bgColor: 'bg-cyber-purple/10'
    },
    {
      icon: Award,
      title: 'Certificate Provided',
      desc: 'Official verified symposium participation certificates awarded to all registered attendees.',
      color: 'text-amber-400',
      borderColor: 'border-amber-400/30',
      bgColor: 'bg-amber-400/10'
    },
    {
      icon: Users,
      title: 'Food Provided',
      desc: 'Complimentary high-energy lunch and refreshments provided for all registered participants.',
      color: 'text-emerald-400',
      borderColor: 'border-emerald-400/30',
      bgColor: 'bg-emerald-400/10'
    }
  ];

  return (
    <section id="about" className="relative py-24 bg-space-900/60 overflow-hidden">
      
      {/* Background Subtle Gradient Lines */}
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none opacity-20"></div>
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyber-purple/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full cyber-glass border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>About The Symposium</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-tech tracking-tight text-white mb-6 uppercase">
            Innovate • Analyze • <span className="cyber-gradient-text">Automate</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Organized by the <strong className="text-white font-semibold">Department of Artificial Intelligence and Data Science</strong> at <strong className="text-cyber-cyan font-semibold">Jaya Sakthi Engineering College</strong>, CHRONYX 2026 brings students together to showcase innovation, technical skill, and analytical acumen.
          </p>
        </div>

        {/* Two-Column About Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          
          {/* Left Column: Department Vision Card */}
          <div className="lg:col-span-7 cyber-glass rounded-3xl p-6 sm:p-10 border border-cyber-cyan/20 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyber-cyan/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-2xl bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan">
                <Cpu className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-tech text-white">
                  Department of AI & Data Science
                </h3>
                <p className="text-xs font-mono text-cyber-cyan uppercase tracking-wider">
                  Jaya Sakthi Engineering College • Thiruninravur – 602024
                </p>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed text-sm sm:text-base mb-6">
              The Department of Artificial Intelligence and Data Science is dedicated to academic learning, analytical exploration, and technological development. CHRONYX 2026 provides a platform for students to apply their knowledge across diverse computational disciplines and collaborative challenges.
            </p>

            <div className="p-4 rounded-2xl bg-space-950/80 border border-slate-800 text-sm text-slate-300">
              <span className="font-bold text-cyber-cyan font-tech uppercase tracking-wider block mb-1">
                The CHRONYX 2026 Theme:
              </span>
              Empowering engineers through the pillars of modern technology: <span className="text-white font-semibold">INNOVATE – ANALYZE – AUTOMATE</span>.
            </div>
          </div>

          {/* Right Column: Verified Event Facts */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            
            <div className="cyber-glass rounded-2xl p-5 border border-cyber-cyan/25 text-center flex flex-col justify-center">
              <div className="font-tech text-4xl sm:text-5xl font-black text-cyber-cyan mb-1">
                10
              </div>
              <div className="text-xs font-mono text-slate-300 uppercase tracking-wider">
                Total Events
              </div>
              <div className="text-[11px] text-slate-400 mt-1">7 Tech + 3 Non-Tech</div>
            </div>

            <div className="cyber-glass rounded-2xl p-5 border border-cyber-purple/25 text-center flex flex-col justify-center">
              <div className="font-tech text-2xl sm:text-3xl font-black text-cyber-purple mb-1">
                10-10-2026
              </div>
              <div className="text-xs font-mono text-slate-300 uppercase tracking-wider">
                Event Date
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Saturday</div>
            </div>

            <div className="cyber-glass rounded-2xl p-5 border border-sky-400/25 text-center flex flex-col justify-center">
              <div className="font-tech text-3xl sm:text-4xl font-black text-sky-400 mb-1">
                9:00 AM
              </div>
              <div className="text-xs font-mono text-slate-300 uppercase tracking-wider">
                Starting Time
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Campus Reporting</div>
            </div>

            <div className="cyber-glass rounded-2xl p-5 border border-emerald-400/25 text-center flex flex-col justify-center">
              <div className="font-tech text-2xl sm:text-3xl font-black text-emerald-400 mb-1">
                AI & DS
              </div>
              <div className="text-xs font-mono text-slate-300 uppercase tracking-wider">
                Organizing Dept
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Jaya Sakthi Engg College</div>
            </div>

          </div>

        </div>

        {/* Certificate Provided & Food Provided Dedicated Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          <div className="cyber-glass rounded-2xl p-4 sm:p-5 border border-cyber-cyan/40 flex items-center space-x-4 shadow-[0_0_20px_rgba(0,240,255,0.12)]">
            <div className="w-12 h-12 rounded-xl bg-cyber-cyan/15 border border-cyber-cyan/35 text-cyber-cyan flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg font-bold font-tech text-white uppercase tracking-wide">
                  Certificate Provided
                </span>
                <CheckCircle2 className="w-4 h-4 text-cyber-cyan shrink-0" />
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                Official verified symposium certificates provided for all participants and winners.
              </p>
            </div>
          </div>

          <div className="cyber-glass rounded-2xl p-4 sm:p-5 border border-cyber-purple/40 flex items-center space-x-4 shadow-[0_0_20px_rgba(168,85,247,0.12)]">
            <div className="w-12 h-12 rounded-xl bg-cyber-purple/15 border border-cyber-purple/35 text-cyber-purple flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg font-bold font-tech text-white uppercase tracking-wide">
                  Food Provided
                </span>
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                Complimentary food and lunch refreshments provided for all registered attendees.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((h, i) => {
            const Icon = h.icon;
            return (
              <div 
                key={i} 
                className={`cyber-glass rounded-2xl p-6 border ${h.borderColor} hover:scale-[1.02] transition-all duration-300 group`}
              >
                <div className={`w-12 h-12 rounded-xl ${h.bgColor} ${h.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold font-tech text-white mb-2">{h.title}</h4>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{h.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
