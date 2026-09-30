import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import heroImg from '../../hero-section.png';

// Procedurally routes a motherboard-style trace layout (right-angle walks,
// like real PCB routing) spanning the full visible background, plus a
// handful of denser "chip" clusters at some trace endpoints, then samples
// `count` particles along it proportional to trace length.
function generateCircuitPoints(count) {
  const bounds = { xMin: -4.6, xMax: 4.6, yMin: -2.6, yMax: 2.6 };
  const step = 0.5;

  // Seeded LCG so the routed layout is stable rather than regenerating a
  // different (possibly messier) circuit on every mount
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const segments = [];
  const traceCount = 26;
  for (let t = 0; t < traceCount; t++) {
    let x = Math.round((bounds.xMin + rand() * (bounds.xMax - bounds.xMin)) / step) * step;
    let y = Math.round((bounds.yMin + rand() * (bounds.yMax - bounds.yMin)) / step) * step;
    let horizontal = rand() > 0.5;
    const legs = 2 + Math.floor(rand() * 4);
    for (let l = 0; l < legs; l++) {
      const len = (1 + Math.floor(rand() * 5)) * step;
      const dir = rand() > 0.5 ? 1 : -1;
      let nx = horizontal ? x + dir * len : x;
      let ny = horizontal ? y : y + dir * len;
      nx = Math.max(bounds.xMin, Math.min(bounds.xMax, nx));
      ny = Math.max(bounds.yMin, Math.min(bounds.yMax, ny));
      segments.push({ x1: x, y1: y, x2: nx, y2: ny });
      x = nx;
      y = ny;
      horizontal = !horizontal;
    }
  }

  const chipCenters = [];
  for (let i = 0; i < 6; i++) {
    const seg = segments[Math.floor(rand() * segments.length)];
    chipCenters.push({ x: seg.x2, y: seg.y2, size: 0.22 + rand() * 0.3 });
  }

  const lengths = segments.map(s => Math.hypot(s.x2 - s.x1, s.y2 - s.y1) || 0.001);
  const totalLen = lengths.reduce((a, b) => a + b, 0);
  const chipBudget = Math.floor(count * 0.18);
  const traceBudget = count - chipBudget;

  const out = new Float32Array(count * 3);
  let oi = 0;
  for (let i = 0; i < traceBudget; i++) {
    let r = Math.random() * totalLen;
    let si = 0;
    while (r > lengths[si] && si < segments.length - 1) {
      r -= lengths[si];
      si++;
    }
    const s = segments[si];
    const t = Math.random();
    out[oi * 3] = s.x1 + (s.x2 - s.x1) * t + (Math.random() - 0.5) * 0.03;
    out[oi * 3 + 1] = s.y1 + (s.y2 - s.y1) * t + (Math.random() - 0.5) * 0.03;
    out[oi * 3 + 2] = (Math.random() - 0.5) * 0.2 - 4;
    oi++;
  }
  for (let i = 0; i < chipBudget; i++) {
    const c = chipCenters[i % chipCenters.length];
    out[oi * 3] = c.x + (Math.random() - 0.5) * c.size;
    out[oi * 3 + 1] = c.y + (Math.random() - 0.5) * c.size;
    out[oi * 3 + 2] = (Math.random() - 0.5) * 0.15 - 4;
    oi++;
  }
  return out;
}

// Depth-layered dust field with real per-particle physics: each particle is
// pulled toward the cursor with a magnetic force plus a perpendicular swirl
// component (so they orbit rather than just clump). When the cursor sits
// still for a moment, the whole field slowly assembles into a motherboard-
// style circuit layout spanning the background — like the dust is computing
// into a structured system — and breaks apart the instant the cursor moves.
function ParticleField({ count = 1800, color = '#d9f99d', size = 0.035, opacity = 0.45 }) {
  const pointsRef = useRef();
  const dustOriginsRef = useRef();
  const shapeTargetsRef = useRef();
  const velocitiesRef = useRef();
  const idleRef = useRef(0);
  const stillTimeRef = useRef(0);
  const lastPointerRef = useRef({ x: 0, y: 0 });

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const dust = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 4 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi) - 4;
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
      dust[i * 3] = x;
      dust[i * 3 + 1] = y;
      dust[i * 3 + 2] = z;
    }
    dustOriginsRef.current = dust;

    // The "assembled" form — a routed circuit layout spanning the whole
    // background, at roughly the same depth as the dust field
    shapeTargetsRef.current = generateCircuitPoints(count);

    velocitiesRef.current = new Float32Array(count * 3);
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    const p = pointsRef.current;
    p.rotation.y += delta * 0.015;

    const dt = Math.min(delta, 0.05);
    const posAttr = p.geometry.attributes.position;
    const arr = posAttr.array;
    const dust = dustOriginsRef.current;
    const shape = shapeTargetsRef.current;
    const vel = velocitiesRef.current;

    // Track stillness to drive the idle -> assembled transition
    const moved =
      Math.abs(state.pointer.x - lastPointerRef.current.x) > 0.0008 ||
      Math.abs(state.pointer.y - lastPointerRef.current.y) > 0.0008;
    lastPointerRef.current.x = state.pointer.x;
    lastPointerRef.current.y = state.pointer.y;
    stillTimeRef.current = moved ? 0 : stillTimeRef.current + dt;
    const idleTarget = stillTimeRef.current > 1.1 ? 1 : 0;
    idleRef.current += (idleTarget - idleRef.current) * dt * (idleTarget ? 0.5 : 4);
    const idle = idleRef.current;

    // Cursor point projected loosely into the particle field's depth range
    const cx = state.pointer.x * 9;
    const cy = state.pointer.y * 6;
    const cz = 2;

    for (let i = 0; i < count; i++) {
      const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
      const dx = cx - arr[ix];
      const dy = cy - arr[iy];
      const dz = cz - arr[iz];
      const distSq = dx * dx + dy * dy + dz * dz + 1.2;
      const dist = Math.sqrt(distSq);

      // Magnetic pull toward the cursor
      const pull = 3.2 / distSq;
      // Perpendicular swirl (cross with the view axis) so particles orbit instead of clumping
      const swirl = 1.6 / distSq;

      vel[ix] += ((dx / dist) * pull + (-dy / dist) * swirl) * dt;
      vel[iy] += ((dy / dist) * pull + (dx / dist) * swirl) * dt;
      vel[iz] += (dz / dist) * pull * dt * 0.4;

      // Spring toward a target that blends dust scatter -> assembled sphere as idle grows
      const tx = dust[ix] + (shape[ix] - dust[ix]) * idle;
      const ty = dust[iy] + (shape[iy] - dust[iy]) * idle;
      const tz = dust[iz] + (shape[iz] - dust[iz]) * idle;
      const springStrength = 0.5 + idle * 1.2;
      vel[ix] += (tx - arr[ix]) * springStrength * dt;
      vel[iy] += (ty - arr[iy]) * springStrength * dt;
      vel[iz] += (tz - arr[iz]) * springStrength * dt;

      // Damping
      vel[ix] *= 0.93;
      vel[iy] *= 0.93;
      vel[iz] *= 0.93;

      arr[ix] += vel[ix];
      arr[iy] += vel[iy];
      arr[iz] += vel[iz];
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

const DECRYPT_GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>[]/\\';

// Scrambles through random glyphs, then resolves left-to-right into the real
// text — a terminal-style decrypt reveal, played once on mount.
function DecryptText({ text, duration = 900, delay = 0, style }) {
  const [display, setDisplay] = useState(() =>
    text.split('').map(ch => (ch === ' ' ? ' ' : DECRYPT_GLYPHS[(Math.random() * DECRYPT_GLYPHS.length) | 0])).join('')
  );

  useEffect(() => {
    let frame;
    let startTimeout;
    const total = text.length;

    const tick = (start) => (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const revealCount = Math.floor(progress * total);
      let out = '';
      for (let i = 0; i < total; i++) {
        const ch = text[i];
        if (ch === ' ') { out += ch; continue; }
        out += i < revealCount ? ch : DECRYPT_GLYPHS[(Math.random() * DECRYPT_GLYPHS.length) | 0];
      }
      setDisplay(out);
      if (progress < 1) {
        frame = requestAnimationFrame(tick(start));
      } else {
        setDisplay(text);
      }
    };

    startTimeout = setTimeout(() => {
      frame = requestAnimationFrame((now) => tick(now)(now));
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      cancelAnimationFrame(frame);
    };
  }, [text, duration, delay]);

  return <span style={style}>{display}</span>;
}

// Subtle camera parallax: the whole scene shifts opposite the pointer,
// giving real depth instead of just spinning geometry in place
function CameraRig() {
  useFrame((state) => {
    const targetX = state.pointer.x * 0.7;
    const targetY = state.pointer.y * 0.45;
    state.camera.position.x += (targetX - state.camera.position.x) * 0.04;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.04;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Hero() {
  const { theme } = useTheme();
  // Light mode needs a bolder treatment than a straight color swap — a
  // small, low-opacity dot in dark olive at the same size tuned for dark
  // mode reads as basically invisible against a bright background
  const particleColor = theme === 'dark' ? '#d9f99d' : '#365314';
  const particleSize = theme === 'dark' ? 0.035 : 0.05;
  const particleOpacity = theme === 'dark' ? 0.45 : 0.75;
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Spotlight reveal: a soft, lagging circle that follows the cursor and
  // unmasks a brighter accent grid underneath — the background "lights up"
  // as you move, instead of a static texture sitting there
  const spotX = useMotionValue(-400);
  const spotY = useMotionValue(-400);
  const spotSpring = { damping: 30, stiffness: 200, mass: 0.6 };
  const spotSpringX = useSpring(spotX, spotSpring);
  const spotSpringY = useSpring(spotY, spotSpring);

  // Normalized pointer position (-0.5 to 0.5) for the portrait's parallax tilt
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const tiltSpring = { damping: 25, stiffness: 200 };
  const tiltSpringX = useSpring(tiltX, tiltSpring);
  const tiltSpringY = useSpring(tiltY, tiltSpring);

  const handleSectionMouseMove = (e) => {
    const rect = sectionRef.current.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    spotX.set(localX);
    spotY.set(localY);
    tiltX.set(localX / rect.width - 0.5);
    tiltY.set(localY / rect.height - 0.5);
  };

  const handleSectionMouseLeave = () => {
    spotX.set(-400);
    spotY.set(-400);
    tiltX.set(0);
    tiltY.set(0);
  };

  const spotlightMask = useTransform([spotSpringX, spotSpringY], ([sx, sy]) =>
    `radial-gradient(300px circle at ${sx}px ${sy}px, black 0%, transparent 100%)`
  );

  const portraitRotateY = useTransform(tiltSpringX, [-0.5, 0.5], [6, -6]);
  const portraitRotateX = useTransform(tiltSpringY, [-0.5, 0.5], [-4, 4]);
  const portraitShiftX = useTransform(tiltSpringX, [-0.5, 0.5], [-16, 16]);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleSectionMouseMove}
      onMouseLeave={handleSectionMouseLeave}
      style={{ height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--bg)', perspective: '1400px' }}
    >

      {/* Immersive 3D Background: particle field + parallax wireframe core */}
      <motion.div style={{ position: 'absolute', inset: 0, y: bgY, zIndex: 0, pointerEvents: 'auto' }}>
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
          <ParticleField color={particleColor} size={particleSize} opacity={particleOpacity} />
          <CameraRig />
        </Canvas>
      </motion.div>

      {/* Vignette to ground the scene and keep text legible */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 30%, var(--bg) 90%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* Grid Overlay — faint everywhere, always visible */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(var(--fg-rgb),0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--fg-rgb),0.04) 1px, transparent 1px)',
          backgroundSize: '4rem 4rem',
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />

      {/* Spotlight reveal: a brighter accent grid + glow, masked to a circle
          that trails the cursor — the background lights up as you move */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          WebkitMaskImage: spotlightMask,
          maskImage: spotlightMask,
          backgroundImage:
            'radial-gradient(circle, rgba(var(--accent-rgb),0.15), transparent 60%), linear-gradient(rgba(var(--accent-rgb),0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.3) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 4rem 4rem, 4rem 4rem'
        }}
      />

      {/* Portrait as a sliced brutalist panel — angled left edge, floating
          below the nav with real clearance (no mask hack needed), a soft
          accent glow bleeding out behind the cut, and a scanning line for
          motion. Reads as a designed graphic element, not a photo card. */}
      <div style={{ position: 'absolute', top: '8rem', right: 0, bottom: '4rem', width: '44%', zIndex: 2, pointerEvents: 'none' }}>

        {/* Glow bleeding out from behind the angled cut */}
        <div
          style={{
            position: 'absolute',
            inset: '-2rem -1rem -2rem -3rem',
            clipPath: 'polygon(16% 0%, 100% 0%, 100% 100%, 0% 100%)',
            background: 'linear-gradient(135deg, #d9f99d, transparent 55%)',
            filter: 'blur(50px)',
            opacity: 0.35
          }}
        />

        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: 'polygon(14% 0%, 100% 0%, 100% 100%, 0% 100%)',
            rotateY: portraitRotateY,
            rotateX: portraitRotateX,
            x: portraitShiftX,
            overflow: 'hidden'
          }}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1.2, ease: 'easeOut' }}
        >
          <img
            src={heroImg}
            alt="Gufran Bhatti"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 18%',
              filter: 'grayscale(100%) contrast(112%) brightness(0.95)'
            }}
          />
          {/* Duotone wash — pinned to the dark palette on purpose: this
              photo panel stays a fixed "cinematic" treatment regardless of
              site theme, since flipping it to light washes the photo out.
              Lightened from the original pass, which read as too dark. */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(155deg, rgba(217,249,157,0.16), transparent 45%, rgba(9,9,11,0.3) 100%)',
              mixBlendMode: 'overlay'
            }}
          />
          {/* Scanning line sweeping the panel — small bit of tech motion.
              Brightening the photo above reduces how much the screen-blend
              line pops on its own, so it also carries its own glow now
              instead of relying purely on blend-mode contrast. */}
          <motion.div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #d9f99d, transparent)',
              boxShadow: '0 0 12px 2px rgba(217,249,157,0.8)',
              opacity: 0.9,
              mixBlendMode: 'screen'
            }}
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        style={{ y, opacity, zIndex: 3, position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 4rem', pointerEvents: 'none' }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

          <motion.div
            style={{ maxWidth: '700px', pointerEvents: 'auto' }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            <div style={{ display: 'inline-block', padding: '0.3rem 1rem', border: '1px solid var(--accent)', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              SYS.STATUS: ONLINE
            </div>

            <h1 style={{ fontSize: 'clamp(4rem, 10vw, 9rem)', margin: 0, color: 'var(--fg)', letterSpacing: '-0.04em', lineHeight: 0.9 }}>
              <DecryptText text="GUFRAN" duration={850} delay={200} />
              <br />
              <DecryptText
                text="BHATTI"
                duration={850}
                delay={480}
                style={{ color: 'transparent', WebkitTextStroke: '2px var(--fg)' }}
              />
            </h1>

            <p style={{ marginTop: '2rem', maxWidth: '500px', fontSize: '1.2rem', color: 'var(--muted)', lineHeight: 1.6 }}>
              Senior Full-Stack Developer & AI Engineer. Architecting enterprise systems and intelligent interfaces.
            </p>
          </motion.div>

          {/* Minimal floating ID tag over the portrait — no card, no border.
              Pinned to fixed lime, same as the rest of the portrait panel:
              it sits on a photo that always stays dark, so it must always
              stay light-on-dark regardless of site theme. */}
          <motion.div
            style={{
              position: 'absolute',
              right: '4rem',
              bottom: '4rem',
              zIndex: 3,
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              color: '#d9f99d',
              pointerEvents: 'none'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d9f99d', boxShadow: '0 0 10px #d9f99d' }} />
            ID: 0xGB_ENG
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
