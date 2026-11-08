import { useEffect, useRef } from "react";

const COLORS = ["#ffd166", "#ff4d9d", "#8a7dff", "#55e6ff", "#ff7b36", "#9cff6e"];

export default function FireworksCanvas({ auto = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;
    let lastAutoLaunch = 0;
    let particles = [];
    let rockets = [];
    let fountains = [];
    let chakris = [];
    let shockwaves = [];
    let scheduledBursts = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const explode = ({ x, y, color, count = 80, power = 1, type }) => {
      for (let i = 0; i < count; i++) {
        const angle = type === "anar"
          ? -Math.PI / 2 + (Math.random() - 0.5) * 1.15
          : (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.12;
        const speed = (type === "bomb" ? 3 : 1) + Math.random() * (type === "bomb" ? 6 : 4) * power;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.009 + Math.random() * 0.014,
          radius: 1 + Math.random() * (type === "bomb" ? 2.8 : 2.2),
          color
        });
      }
    };

    const launch = (config = {}) => {
      const x = config.x ?? window.innerWidth * (0.15 + Math.random() * 0.7);
      const y = config.y ?? window.innerHeight * (0.12 + Math.random() * 0.42);
      const color = config.color || COLORS[Math.floor(Math.random() * COLORS.length)];
      const burst = {
        x,
        y,
        color,
        count: config.count || 80,
        power: config.power || 1,
        type: config.type
      };

      if (config.type === "rocket") {
        rockets.push({ ...burst, y: window.innerHeight + 8, targetY: y });
        return;
      }

      if (config.type === "anar" || config.type === "phuljhadi") {
        fountains.push({
          ...burst,
          spread: config.type === "anar" ? 1.15 : 0.48,
          remaining: config.type === "anar" ? 72 : 90,
          sparksPerFrame: config.type === "anar" ? 5 : 3
        });
        return;
      }

      if (config.type === "chakri") {
        chakris.push({ ...burst, angle: 0, radius: 5, remaining: 100 });
        return;
      }

      if (config.type === "ladi") {
        for (let i = 0; i < 6; i++) {
          scheduledBursts.push({
            ...burst,
            x: x + (i - 2.5) * 30,
            y: y + (i % 2 ? 10 : -8),
            color: i % 2 ? "#fff0b0" : color,
            count: 36,
            power: 0.75,
            at: performance.now() + i * 105
          });
        }
        return;
      }

      if (config.type === "bomb") {
        shockwaves.push({ x, y, color, radius: 4, alpha: 0.9 });
        explode({ ...burst, count: config.count || 170, power: config.power || 1.45 });
        return;
      }

      if (config.type === "skyshot") {
        const colors = [color, "#fff0a5", COLORS[Math.floor(Math.random() * COLORS.length)]];
        for (let i = 0; i < colors.length; i++) {
          scheduledBursts.push({
            ...burst,
            x: x + (i - 1) * 52,
            y: y + (i === 1 ? 0 : -28),
            color: colors[i],
            count: i === 1 ? burst.count : Math.round(burst.count * 0.72),
            power: i === 1 ? burst.power : burst.power * 0.82,
            at: performance.now() + i * 170
          });
        }
        return;
      }

      explode(burst);
      if (config.double) {
        window.setTimeout(() => explode({
          ...burst,
          x: x + 35,
          y: y - 20,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          count: 55,
          power: 0.8
        }), 130);
      }
    };

    const handleFirework = event => launch(event.detail || {});
    const draw = time => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (auto && time - lastAutoLaunch > 1300 + Math.random() * 1000) {
        launch({ count: 45, power: 0.7 });
        lastAutoLaunch = time;
      }

      const readyBursts = scheduledBursts.filter(burst => burst.at <= time);
      scheduledBursts = scheduledBursts.filter(burst => burst.at > time);
      for (const burst of readyBursts) explode(burst);

      fountains = fountains.filter(fountain => fountain.remaining > 0);
      for (const fountain of fountains) {
        fountain.remaining -= 1;
        const baseGlow = fountain.type === "anar" ? 17 : 8;
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = "#fff0a5";
        ctx.shadowColor = fountain.color;
        ctx.shadowBlur = baseGlow;
        ctx.beginPath();
        ctx.ellipse(fountain.x, fountain.y, baseGlow * 0.45, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        for (let i = 0; i < fountain.sparksPerFrame; i++) {
          const angle = -Math.PI / 2 + (Math.random() - 0.5) * fountain.spread;
          const speed = 4.5 + Math.random() * (fountain.type === "anar" ? 5 : 4.5);
          particles.push({
            x: fountain.x + (Math.random() - 0.5) * 10,
            y: fountain.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            decay: 0.014 + Math.random() * 0.012,
            radius: 1.2 + Math.random() * 2.2,
            color: Math.random() < 0.35 ? "#fff3c4" : fountain.color,
            trail: true
          });
        }
      }

      chakris = chakris.filter(chakri => chakri.remaining > 0);
      for (const chakri of chakris) {
        chakri.remaining -= 1;
        chakri.angle += 0.24;
        chakri.radius = Math.min(chakri.radius + 0.75, 58);
        ctx.save();
        ctx.globalAlpha = Math.min(chakri.remaining / 22, 0.9);
        ctx.strokeStyle = chakri.color;
        ctx.shadowColor = chakri.color;
        ctx.shadowBlur = 16;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(chakri.x, chakri.y, chakri.radius, chakri.angle, chakri.angle + 1.9);
        ctx.stroke();
        ctx.restore();

        for (let i = 0; i < 4; i++) {
          const angle = chakri.angle + (Math.PI * 2 * i) / 4;
          const sparkX = chakri.x + Math.cos(angle) * chakri.radius;
          const sparkY = chakri.y + Math.sin(angle) * chakri.radius;
          particles.push({
            x: sparkX,
            y: sparkY,
            vx: Math.cos(angle) * 2 + (Math.random() - 0.5),
            vy: Math.sin(angle) * 2 + (Math.random() - 0.5),
            life: 0.8,
            decay: 0.04,
            radius: 1.8,
            color: i % 2 ? "#fff0b0" : chakri.color,
            trail: true
          });
        }
      }

      shockwaves = shockwaves.filter(wave => wave.alpha > 0);
      for (const wave of shockwaves) {
        wave.radius += 10;
        wave.alpha -= 0.035;
        ctx.save();
        ctx.globalAlpha = wave.alpha;
        ctx.strokeStyle = wave.color;
        ctx.shadowColor = wave.color;
        ctx.shadowBlur = 22;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      rockets = rockets.filter(rocket => rocket.y > rocket.targetY);
      for (const rocket of rockets) {
        rocket.y -= 9;
        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.strokeStyle = rocket.color;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 16;
        ctx.shadowColor = rocket.color;
        ctx.beginPath();
        ctx.moveTo(rocket.x, rocket.y + 32);
        ctx.lineTo(rocket.x, rocket.y - 5);
        ctx.stroke();
        ctx.restore();
        if (rocket.y <= rocket.targetY) {
          explode({ ...rocket, y: rocket.targetY, count: rocket.count, power: rocket.power, type: "rocket" });
        }
      }

      particles = particles.filter(particle => particle.life > 0);
      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += particle.trail ? 0.12 : 0.035;
        particle.vx *= 0.992;
        particle.life -= particle.decay;

        ctx.save();
        ctx.globalAlpha = Math.max(particle.life, 0);
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = particle.color;
        if (particle.trail) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particle.x - particle.vx * 2.5, particle.y - particle.vy * 2.5);
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = particle.radius;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("diwali:firework", handleFirework);
    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("diwali:firework", handleFirework);
    };
  }, [auto]);

  return <canvas ref={canvasRef} className="fireworks-canvas" aria-hidden="true" />;
}
