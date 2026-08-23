import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import heroImg from '../../hero-section.png';

// Depth-layered dust field that drifts on its own and drags gently toward the pointer
function ParticleField({ count = 1800 }) {
  const pointsRef = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 4 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = radius * Math.cos(phi) - 4;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    const p = pointsRef.current;
    p.rotation.y += delta * 0.025;
    p.rotation.x += (state.pointer.y * 0.15 - p.rotation.x) * 0.02;
    p.rotation.y += (state.pointer.x * 0.1) * delta;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#d9f99d"
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
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
          <ParticleField />
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
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
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
            'radial-gradient(circle, rgba(217,249,157,0.15), transparent 60%), linear-gradient(rgba(217,249,157,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(217,249,157,0.3) 1px, transparent 1px)',
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
            background: 'linear-gradient(135deg, var(--accent), transparent 55%)',
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
              filter: 'grayscale(100%) contrast(115%) brightness(0.7)'
            }}
          />
          {/* Duotone wash for cohesion with the lime/orange palette */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(155deg, rgba(217,249,157,0.16), transparent 45%, rgba(9,9,11,0.55) 100%)',
              mixBlendMode: 'overlay'
            }}
          />
          {/* Scanning line sweeping the panel — small bit of tech motion */}
          <motion.div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
              opacity: 0.7,
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
              GUFRAN
              <br />
              <span style={{ color: 'transparent', WebkitTextStroke: '2px var(--fg)' }}>BHATTI</span>
            </h1>

            <p style={{ marginTop: '2rem', maxWidth: '500px', fontSize: '1.2rem', color: '#a1a1aa', lineHeight: 1.6 }}>
              Senior Full-Stack Developer & AI Engineer. Architecting enterprise systems and intelligent interfaces.
            </p>
          </motion.div>

          {/* Minimal floating ID tag over the portrait — no card, no border */}
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
              color: 'var(--accent)',
              pointerEvents: 'none'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }} />
            ID: 0xGB_ENG
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
