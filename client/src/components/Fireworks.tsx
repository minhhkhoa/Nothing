import React, { useEffect, useRef } from "react";

type FireworksEffectProps = {
  fireworks: boolean;
  setFireworks: React.Dispatch<React.SetStateAction<boolean>>;
};

type Particle = {
  x: number;
  y: number;
  angle: number;
  speed: number;
  radius: number;
  alpha: number;
  decay: number;
  color: string;
};

const colors = ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93"];

function FireworksEffect({ fireworks, setFireworks }: FireworksEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!fireworks) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const createFirework = () => {
      const x = canvas.width / 4 + Math.random() * (canvas.width / 2);
      const y = canvas.height / 4 + Math.random() * (canvas.height / 2);
      const count = 50;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        particlesRef.current.push({
          x,
          y,
          angle,
          speed: Math.random() * 4 + 2,
          radius: 2,
          alpha: 1,
          decay: Math.random() * 0.02 + 0.01,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        p.alpha -= p.decay;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${hexToRgb(p.color)},${p.alpha})`;
        ctx.fill();
      });

      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0);

      animationRef.current = requestAnimationFrame(draw);
    };

    const interval = setInterval(createFirework, 500);

    draw();

    const timer = setTimeout(() => {
      clearInterval(interval);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setFireworks(false);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [fireworks, setFireworks]);

  if (!fireworks) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)", // nền tối mờ
        zIndex: 9999,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          pointerEvents: "none", // không chặn click
        }}
      />
    </div>
  );
}

function hexToRgb(hex: string): string {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r},${g},${b}`;
}

export default FireworksEffect;
