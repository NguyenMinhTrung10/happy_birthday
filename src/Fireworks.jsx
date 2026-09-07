import React, { useEffect, useRef } from 'react';

const HUES = [340, 320, 285, 265, 45, 15, 195];
const GRAVITY = 0.032;
const MAX_PARTICLES = 1400;

function rand(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * Pháo hoa vẽ bằng canvas: rocket bay lên rồi nổ thành chùm hạt có đuôi sáng.
 * Chạy khi active=true, tự dọn dẹp khi unmount hoặc khi đổi tab.
 */
export default function Fireworks({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = 1;
    let raf = 0, timer = 0;
    const rockets = [];
    const particles = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const launch = (tx, ty) => {
      const startX = tx == null ? rand(w * 0.15, w * 0.85) : tx;
      const targetX = tx == null ? startX + rand(-w * 0.08, w * 0.08) : tx;
      const targetY = ty == null ? rand(h * 0.14, h * 0.48) : ty;
      const frames = rand(52, 78);
      rockets.push({
        x: startX,
        y: h + 10,
        vx: (targetX - startX) / frames,
        // v0 sao cho sau `frames` bước với trọng lực thì tới đúng targetY
        vy: (targetY - h) / frames - (GRAVITY * frames) / 2,
        hue: HUES[(Math.random() * HUES.length) | 0],
        trail: [],
      });
    };

    const explode = (x, y, hue) => {
      const count = 60 + ((Math.random() * 45) | 0);
      const power = rand(2.6, 4.6);
      const ring = Math.random() < 0.45; // nổ hình vòng tròn đều
      for (let i = 0; i < count; i++) {
        const angle = ring
          ? (Math.PI * 2 * i) / count + rand(-0.05, 0.05)
          : Math.random() * Math.PI * 2;
        const speed = power * (ring ? rand(0.9, 1.05) : Math.sqrt(Math.random()));
        if (particles.length >= MAX_PARTICLES) break;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          hue: hue + rand(-14, 14),
          life: 1,
          decay: rand(0.008, 0.017),
          size: rand(1.1, 2.4),
          trail: [],
        });
      }
    };

    const frame = () => {
      // làm mờ dần khung trước -> tạo vệt sáng
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.16)';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.trail.push([r.x, r.y]);
        if (r.trail.length > 6) r.trail.shift();
        r.x += r.vx;
        r.y += r.vy;
        r.vy += GRAVITY;

        ctx.beginPath();
        ctx.strokeStyle = `hsl(${r.hue},95%,72%)`;
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        const t0 = r.trail[0];
        ctx.moveTo(t0[0], t0[1]);
        ctx.lineTo(r.x, r.y);
        ctx.stroke();

        if (r.vy >= 0) {
          explode(r.x, r.y, r.hue);
          rockets.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.trail.push([p.x, p.y]);
        if (p.trail.length > 4) p.trail.shift();
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.vy = p.vy * 0.985 + GRAVITY;
        p.life -= p.decay;

        if (p.life <= 0 || p.y > h + 40) {
          particles.splice(i, 1);
          continue;
        }

        const flicker = p.life < 0.45 ? 0.55 + Math.random() * 0.45 : 1;
        const s = p.trail[0];
        ctx.beginPath();
        ctx.strokeStyle = `hsla(${p.hue},100%,${58 + p.life * 22}%,${p.life * flicker})`;
        ctx.lineWidth = p.size;
        ctx.lineCap = 'round';
        ctx.moveTo(s[0], s[1]);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      raf = requestAnimationFrame(frame);
    };

    const schedule = () => {
      timer = window.setTimeout(() => {
        if (!document.hidden) {
          launch();
          if (Math.random() < 0.3) window.setTimeout(launch, 220);
        }
        schedule();
      }, rand(750, 1900));
    };

    // Loạt chào mừng ngay khi mở quà
    [0, 260, 520, 900].forEach((d, i) => window.setTimeout(() => launch(), d + i * 40));
    schedule();
    raf = requestAnimationFrame(frame);

    // Chạm / click vào đâu là bắn pháo hoa ở đó
    const onPointer = (e) => {
      if (e.target.closest('button, a, .letter, .zoom-overlay, .polaroid, .photo-frame, .mini-photo')) return;
      const rect = canvas.getBoundingClientRect();
      launch(e.clientX - rect.left, e.clientY - rect.top);
    };
    window.addEventListener('pointerdown', onPointer);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', onPointer);
    };
  }, [active]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="fireworks" aria-hidden="true" />;
}
