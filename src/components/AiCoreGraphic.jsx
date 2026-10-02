import React from 'react';

export default function AiCoreGraphic() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
      
      {/* Outer Radial Glow */}
      <div className="absolute w-[340px] sm:w-[540px] md:w-[680px] h-[340px] sm:h-[540px] md:h-[680px] rounded-full bg-gradient-to-tr from-cyber-cyan/15 via-blue-600/10 to-purple-600/20 blur-[90px] animate-pulse"></div>

      {/* Futuristic Concentric Geometric Neural Sphere SVG */}
      <svg 
        className="w-[380px] sm:w-[580px] md:w-[760px] h-[380px] sm:h-[580px] md:h-[760px] opacity-40" 
        viewBox="0 0 400 400" 
        fill="none"
      >
        {/* Core Gradient Definitions */}
        <defs>
          <linearGradient id="aiCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="aiPurpleGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0066ff" stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id="aiCenterOrb" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#7c3aed" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#030712" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Central Neural Core Orb */}
        <circle cx="200" cy="200" r="110" fill="url(#aiCenterOrb)" />

        {/* Inner Ring 1 - Fast Clockwise */}
        <circle 
          cx="200" 
          cy="200" 
          r="80" 
          stroke="url(#aiCyanGrad)" 
          strokeWidth="1.2" 
          strokeDasharray="4 8 12 8" 
          className="animate-[spin_40s_linear_infinite]"
          style={{ transformOrigin: '200px 200px' }}
        />

        {/* Middle Ring 2 - Counter-Clockwise */}
        <circle 
          cx="200" 
          cy="200" 
          r="125" 
          stroke="url(#aiPurpleGrad)" 
          strokeWidth="1.5" 
          strokeDasharray="16 10 4 10" 
          className="animate-[spin_55s_linear_infinite_reverse]"
          style={{ transformOrigin: '200px 200px' }}
        />

        {/* Outer Ring 3 - Fine Caliper Tick Ring */}
        <circle 
          cx="200" 
          cy="200" 
          r="170" 
          stroke="#00f0ff" 
          strokeOpacity="0.25" 
          strokeWidth="1" 
          strokeDasharray="2 14" 
          className="animate-[spin_80s_linear_infinite]"
          style={{ transformOrigin: '200px 200px' }}
        />

        {/* Axis Crosshairs & Coordinates */}
        <line x1="20" y1="200" x2="380" y2="200" stroke="#00f0ff" strokeOpacity="0.12" strokeWidth="0.8" strokeDasharray="4 6" />
        <line x1="200" y1="20" x2="200" y2="380" stroke="#a855f7" strokeOpacity="0.12" strokeWidth="0.8" strokeDasharray="4 6" />

        {/* Diagonal Neural Data Vectors */}
        <line x1="70" y1="70" x2="330" y2="330" stroke="#00f0ff" strokeOpacity="0.08" strokeWidth="0.8" />
        <line x1="70" y1="330" x2="330" y2="70" stroke="#00f0ff" strokeOpacity="0.08" strokeWidth="0.8" />

        {/* Constellation Nodes on Orbitals */}
        {[
          { cx: 200, cy: 75, r: 3, fill: '#00f0ff' },
          { cx: 325, cy: 200, r: 3.5, fill: '#a855f7' },
          { cx: 200, cy: 325, r: 2.5, fill: '#00f0ff' },
          { cx: 75, cy: 200, r: 3, fill: '#38bdf8' },
          { cx: 288, cy: 112, r: 2.8, fill: '#00f0ff' },
          { cx: 112, cy: 288, r: 2.8, fill: '#a855f7' },
          { cx: 112, cy: 112, r: 2.2, fill: '#38bdf8' },
          { cx: 288, cy: 288, r: 2.2, fill: '#00f0ff' },
        ].map((node, i) => (
          <g key={i}>
            <circle cx={node.cx} cy={node.cy} r={node.r * 2} fill={node.fill} fillOpacity="0.25" />
            <circle cx={node.cx} cy={node.cy} r={node.r} fill={node.fill} />
          </g>
        ))}
      </svg>

    </div>
  );
}
