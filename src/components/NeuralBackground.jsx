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

    // Responsive node count: lightweight on mobile, detailed on desktop
    const isMobile = width < 768;
    const nodeCount = isMobile ? 22 : 46;
    const connectionDistance = isMobile ? 85 : 135;
    const mouseRadius = 140;

    const mouse = { x: -1000, y: -1000, active: false };

    const nodes = [];
    const colors = ['#00f0ff', '#38bdf8', '#818cf8', '#a855f7'];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.42,
        vy: (Math.random() - 0.5) * 0.42,
        radius: Math.random() * 1.8 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI,
        dataPackets: [] // occasional light pulses traversing lines
      });
    }

    // Occasional data packet generation along synaptic lines
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

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        node.x += node.vx;
        node.y += node.vy;

        // Subtle mouse influence on desktop
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

        // Bounce from walls
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        node.pulse += 0.02;
        const currentRadius = node.radius + Math.sin(node.pulse) * 0.5;

        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = node.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.25;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();

            // Occasional traversing synaptic data pulse packet
            if (packetTimer % 180 === 0 && Math.random() < 0.08) {
              node.dataPackets.push({
                targetX: other.x,
                targetY: other.y,
                progress: 0,
                speed: 0.025
              });
            }
          }
        }

        // Render data packets traversing along lines
        for (let p = node.dataPackets.length - 1; p >= 0; p--) {
          const pkt = node.dataPackets[p];
          pkt.progress += pkt.speed;

          if (pkt.progress >= 1) {
            node.dataPackets.splice(p, 1);
          } else {
            const px = node.x + (pkt.targetX - node.x) * pkt.progress;
            const py = node.y + (pkt.targetY - node.y) * pkt.progress;

            ctx.beginPath();
            ctx.arc(px, py, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = '#00f0ff';
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#00f0ff';
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // Cursor connection on desktop
      if (mouse.active && !isMobile) {
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const dx = node.x - mouse.x;
          const dy = node.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseRadius) {
            const alpha = (1 - dist / mouseRadius) * 0.35;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(node.x, node.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
            ctx.lineWidth = 0.8;
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
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
}
