import React, { useEffect, useRef } from 'react';

export default function NeuralBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;
    const nodeCount = isMobile ? 18 : 36;
    const connectionDistance = isMobile ? 90 : 140;
    const mouseRadius = 150;

    const mouse = { x: -1000, y: -1000, active: false };

    // Synaptic Neural Nodes
    const nodes = [];
    const colors = ['#00f0ff', '#38bdf8', '#818cf8', '#a855f7', '#ff3b5c'];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.8 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI,
        dataPackets: []
      });
    }

    // Atmospheric Cyber Embers & Sparks (Ascending Post-Apocalyptic Particles)
    const emberCount = isMobile ? 22 : 48;
    const embers = [];
    const emberPalette = ['#00f0ff', '#38bdf8', '#f59e0b', '#ff3366', '#ef4444', '#a855f7'];

    for (let i = 0; i < emberCount; i++) {
      embers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.65 + 0.25), // Upward atmospheric drift
        radius: Math.random() * 1.6 + 1.0,
        color: emberPalette[Math.floor(Math.random() * emberPalette.length)],
        alpha: Math.random() * 0.45 + 0.45,
        flicker: Math.random() * Math.PI,
        flickerSpeed: Math.random() * 0.04 + 0.02
      });
    }

    let packetTimer = 0;

    const handleMouseMove = (e) => {
      if (isMobile) return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      packetTimer++;

      // 1. Render Atmospheric Ascending Cyber Embers / Sparks
      for (let i = 0; i < embers.length; i++) {
        const emb = embers[i];
        emb.x += emb.vx + Math.sin(emb.flicker * 0.5) * 0.2;
        emb.y += emb.vy;
        emb.flicker += emb.flickerSpeed;

        if (emb.y < -15) {
          emb.y = height + 15;
          emb.x = Math.random() * width;
        }
        if (emb.x < -15) emb.x = width + 15;
        if (emb.x > width + 15) emb.x = -15;

        const currentAlpha = emb.alpha * (0.7 + Math.sin(emb.flicker) * 0.3);

        ctx.beginPath();
        ctx.arc(emb.x, emb.y, emb.radius, 0, Math.PI * 2);
        ctx.fillStyle = emb.color;
        ctx.globalAlpha = Math.max(0.15, Math.min(1.0, currentAlpha));
        ctx.shadowBlur = 6;
        ctx.shadowColor = emb.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }

      // 2. Render Synaptic Neural Network Nodes & Connections
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        node.x += node.vx;
        node.y += node.vy;

        // Subtle mouse influence
        if (mouse.active) {
          const mdx = node.x - mouse.x;
          const mdy = node.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < mouseRadius) {
            const force = (1 - mdist / mouseRadius) * 0.6;
            node.x += (mdx / mdist) * force;
            node.y += (mdy / mdist) * force;
          }
        }

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        node.pulse += 0.025;
        const currentRadius = node.radius + Math.sin(node.pulse) * 0.45;

        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = 0.85;
        ctx.shadowBlur = 8;
        ctx.shadowColor = node.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;

        // Connections
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.28;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();

            // Occasional traversing synaptic data packets
            if (packetTimer % 160 === 0 && Math.random() < 0.1) {
              node.dataPackets.push({
                targetX: other.x,
                targetY: other.y,
                progress: 0,
                speed: 0.028
              });
            }
          }
        }

        // Render Data Packets
        for (let p = node.dataPackets.length - 1; p >= 0; p--) {
          const pkt = node.dataPackets[p];
          pkt.progress += pkt.speed;

          if (pkt.progress >= 1) {
            node.dataPackets.splice(p, 1);
          } else {
            const px = node.x + (pkt.targetX - node.x) * pkt.progress;
            const py = node.y + (pkt.targetY - node.y) * pkt.progress;

            ctx.beginPath();
            ctx.arc(px, py, 2.0, 0, Math.PI * 2);
            ctx.fillStyle = '#00f0ff';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#00f0ff';
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // Mouse Connection
      if (mouse.active && !isMobile) {
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const dx = node.x - mouse.x;
          const dy = node.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseRadius) {
            const alpha = (1 - dist / mouseRadius) * 0.4;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(node.x, node.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* Deep Charcoal & Near-Black Master Base */}
      <div className="absolute inset-0 bg-[#02040a] bg-gradient-to-b from-[#02040a] via-[#040813] to-[#010206]" />

      {/* Atmospheric Neon Fog: Cyan, Purple & Dramatic Emergency Red Glows */}
      <div className="absolute top-1/4 -left-20 w-[550px] h-[550px] bg-cyber-cyan/[0.12] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-[600px] h-[600px] bg-cyber-purple/[0.10] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[650px] h-[350px] bg-cyber-blue/[0.08] rounded-full blur-[140px] pointer-events-none" />

      {/* Prominent Emergency Red Beacon Glows */}
      <div className="absolute top-16 right-1/4 w-[450px] h-[450px] bg-rose-600/[0.08] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[420px] h-[420px] bg-red-600/[0.07] rounded-full blur-[150px] pointer-events-none" />

      {/* Dystopian Cyber City / Megastructure Skyline Silhouette (Clearly Visible) */}
      <div className="absolute bottom-0 left-0 right-0 h-[48vh] sm:h-[56vh] overflow-hidden pointer-events-none opacity-75">
        <svg
          viewBox="0 0 1920 600"
          className="w-full h-full object-cover object-bottom"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="dystopianSkyGrad" x1="0" y1="0" x2="0" y2="100%">
              <stop offset="0%" stopColor="#08142c" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#030612" stopOpacity="0.98" />
            </linearGradient>
            <linearGradient id="dystopianBackGrad" x1="0" y1="0" x2="0" y2="100%">
              <stop offset="0%" stopColor="#0d2146" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#030716" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="fogFade" x1="0" y1="100%" x2="0" y2="0%">
              <stop offset="0%" stopColor="#02040a" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#02040a" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#02040a" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Far Layer: Colossal Megastructure Monoliths, Broken Pylons, Industrial Trusses */}
          <g fill="url(#dystopianBackGrad)" stroke="#00f0ff" strokeOpacity="0.18" strokeWidth="1">
            {/* Pyramid Arcology */}
            <polygon points="120,600 240,240 280,240 400,600" />
            <polygon points="255,240 260,90 265,240" />
            <line x1="240" y1="180" x2="280" y2="180" stroke="#00f0ff" strokeOpacity="0.4" strokeWidth="1.5" />
            <line x1="245" y1="140" x2="275" y2="140" stroke="#00f0ff" strokeOpacity="0.4" strokeWidth="1.5" />

            {/* Industrial Cooling Stacks & Cyber Spire */}
            <rect x="520" y="280" width="90" height="320" />
            <polygon points="560,280 565,120 570,280" />

            {/* Stepped Megatower Central */}
            <polygon points="820,600 860,160 940,160 980,600" />
            <rect x="880" y="80" width="40" height="80" />
            <line x1="900" y1="80" x2="900" y2="30" stroke="#38bdf8" strokeWidth="2.5" />

            {/* Ruined Suspension Arch */}
            <path d="M1100,600 Q1220,160 1340,600" stroke="#0d2146" strokeWidth="26" fill="none" opacity="0.8" />
            <line x1="1220" y1="260" x2="1220" y2="60" stroke="#38bdf8" strokeWidth="2.5" />

            {/* Right Megalith Clusters */}
            <rect x="1460" y="200" width="110" height="400" />
            <polygon points="1620,600 1670,140 1720,140 1770,600" />
            <line x1="1695" y1="140" x2="1695" y2="60" stroke="#a855f7" strokeWidth="2.5" />
          </g>

          {/* Near Layer: Industrial Sci-Fi Ruins, Data Bunkers, Antenna Towers */}
          <g fill="url(#dystopianSkyGrad)" stroke="#00f0ff" strokeOpacity="0.25" strokeWidth="1.2">
            {/* Sector 1 Bunker & Spire */}
            <rect x="0" y="400" width="180" height="200" />
            <polygon points="60,400 70,250 80,400" />
            <rect x="160" y="340" width="70" height="260" />

            {/* Broken Overpass / Truss Girder */}
            <rect x="330" y="360" width="160" height="240" />
            <polygon points="350,360 370,230 390,360" />
            <polygon points="450,360 470,190 490,360" />
            {/* Structural Cross Beams */}
            <line x1="330" y1="360" x2="490" y2="460" stroke="#00f0ff" strokeOpacity="0.3" strokeWidth="1" />
            <line x1="330" y1="460" x2="490" y2="360" stroke="#00f0ff" strokeOpacity="0.3" strokeWidth="1" />

            {/* Central High-Tech Complex */}
            <rect x="660" y="290" width="130" height="310" />
            <polygon points="720,290 725,45 730,290" />

            {/* Cyber Illuminated Window Slits */}
            <line x1="680" y1="330" x2="770" y2="330" stroke="#00f0ff" strokeOpacity="0.65" strokeWidth="2" strokeDasharray="8 6 14 6" />
            <line x1="680" y1="360" x2="770" y2="360" stroke="#f59e0b" strokeOpacity="0.55" strokeWidth="2" strokeDasharray="10 8 6 8" />
            <line x1="680" y1="390" x2="770" y2="390" stroke="#00f0ff" strokeOpacity="0.65" strokeWidth="2" strokeDasharray="14 6 8 6" />
            <line x1="680" y1="420" x2="770" y2="420" stroke="#38bdf8" strokeOpacity="0.55" strokeWidth="2" strokeDasharray="6 8 16 8" />

            {/* Megatower Mid */}
            <polygon points="960,600 990,280 1060,280 1090,600" />
            <line x1="1025" y1="280" x2="1025" y2="150" stroke="#38bdf8" strokeWidth="2" />
            <line x1="1000" y1="320" x2="1050" y2="320" stroke="#a855f7" strokeOpacity="0.6" strokeWidth="2" strokeDasharray="6 6 12 6" />
            <line x1="1000" y1="350" x2="1050" y2="350" stroke="#00f0ff" strokeOpacity="0.6" strokeWidth="2" strokeDasharray="10 6 8 6" />

            {/* Right Industrial Refinery / Array */}
            <rect x="1260" y="310" width="140" height="290" />
            <polygon points="1320,310 1330,85 1340,310" />
            <line x1="1280" y1="350" x2="1380" y2="350" stroke="#00f0ff" strokeOpacity="0.55" strokeWidth="2" strokeDasharray="12 6 8 6" />
            <rect x="1420" y="380" width="90" height="220" />
            <rect x="1530" y="270" width="100" height="330" />
            <polygon points="1570,270 1580,65 1590,270" />
            <line x1="1545" y1="310" x2="1615" y2="310" stroke="#f59e0b" strokeOpacity="0.55" strokeWidth="2" strokeDasharray="8 6 10 6" />
            <rect x="1740" y="320" width="180" height="280" />
          </g>

          {/* Prominent Red Emergency Warning Beacons (Vivid Pulsing LEDs) */}
          <g>
            {/* Spire 1 (x=260, y=90) */}
            <circle cx="260" cy="90" r="14" fill="#ef4444" opacity="0.35" className="animate-pulse" />
            <circle cx="260" cy="90" r="4.5" fill="#ff4d4d" />
            <circle cx="260" cy="90" r="2" fill="#ffffff" />

            {/* Spire 2 (x=565, y=120) */}
            <circle cx="565" cy="120" r="14" fill="#ef4444" opacity="0.35" className="animate-pulse" />
            <circle cx="565" cy="120" r="4" fill="#ff4d4d" />
            <circle cx="565" cy="120" r="1.8" fill="#ffffff" />

            {/* Spire 3 (x=725, y=45) - Main Central Emergency Spire */}
            <circle cx="725" cy="45" r="20" fill="#ef4444" opacity="0.45" className="animate-pulse" />
            <circle cx="725" cy="45" r="6" fill="#ff4d4d" />
            <circle cx="725" cy="45" r="2.5" fill="#ffffff" />

            {/* Spire 4 (x=900, y=30) */}
            <circle cx="900" cy="30" r="14" fill="#ef4444" opacity="0.35" className="animate-pulse" />
            <circle cx="900" cy="30" r="4.5" fill="#ff4d4d" />
            <circle cx="900" cy="30" r="2" fill="#ffffff" />

            {/* Spire 5 (x=1330, y=85) */}
            <circle cx="1330" cy="85" r="15" fill="#ef4444" opacity="0.4" className="animate-pulse" />
            <circle cx="1330" cy="85" r="5" fill="#ff4d4d" />
            <circle cx="1330" cy="85" r="2" fill="#ffffff" />

            {/* Spire 6 (x=1580, y=65) */}
            <circle cx="1580" cy="65" r="18" fill="#ef4444" opacity="0.45" className="animate-pulse" />
            <circle cx="1580" cy="65" r="5.5" fill="#ff4d4d" />
            <circle cx="1580" cy="65" r="2.2" fill="#ffffff" />

            {/* Cyan & Purple Status Beacons */}
            <circle cx="470" cy="190" r="3.5" fill="#00f0ff" opacity="0.9" />
            <circle cx="1025" cy="150" r="3.5" fill="#00f0ff" opacity="0.9" />
            <circle cx="1695" cy="60" r="3.5" fill="#a855f7" opacity="0.9" />
          </g>

          {/* Lower Atmospheric Fog Wash */}
          <rect x="0" y="360" width="1920" height="240" fill="url(#fogFade)" />
        </svg>
      </div>

      {/* Faint Ground Perspective Grid Matrix */}
      <div
        className="absolute bottom-0 left-0 right-0 h-80 opacity-[0.24] pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
          backgroundImage: 'linear-gradient(to right, rgba(0, 240, 255, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 240, 255, 0.12) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'bottom'
        }}
      />

      {/* Subtle Telemetry HUD Perimeter Watermarks */}
      <div className="absolute top-24 left-6 text-[9px] font-mono text-cyber-cyan/30 tracking-widest hidden xl:block uppercase select-none">
        SYS.DEFENSE // PROTOCOL_APOCALYPSE [MONITORED]
      </div>
      <div className="absolute top-24 right-6 text-[9px] font-mono text-rose-500/40 tracking-widest hidden xl:flex items-center space-x-1.5 uppercase select-none">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        <span>STATUS: DEFENSE GRID ARMED</span>
      </div>

      {/* Interactive Synaptic Canvas + Ascending Cyber Sparks */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-80 transition-opacity duration-700"
      />

      {/* Master Dark Vignette: Balanced for high contrast without blacking out the background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(2, 4, 10, 0.4) 75%, rgba(1, 2, 5, 0.85) 100%)'
        }}
      />
    </div>
  );
}
