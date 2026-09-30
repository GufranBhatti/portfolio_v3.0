import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Colors are hardcoded per-theme here rather than pulled from CSS vars —
// this overlay sits ABOVE the page and cross-fades between the two palettes
// itself, so it needs both values at once rather than "the current one".
const PALETTE = {
  dark: { bg: '#09090b', accent: '#d9f99d', border: 'rgba(255,255,255,0.35)', muted: '#a1a1aa', ink: '#09090b' },
  light: { bg: '#f2f2ef', accent: '#4d7c0f', border: 'rgba(0,0,0,0.3)', muted: '#52525b', ink: '#f2f2ef' }
};

function Mascot({ stage }) {
  const walking = stage === 'walk-in' || stage === 'walk-out';
  const xTarget = stage === 'walk-out' ? 260 : 0;

  return (
    <motion.div
      style={{ position: 'relative', width: '56px', height: '72px', flexShrink: 0 }}
      initial={{ x: -260 }}
      animate={{ x: xTarget }}
      transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
    >
      {/* antenna */}
      <div style={{ position: 'absolute', top: '-10px', left: '25px', width: '2px', height: '10px', backgroundColor: '#3f3f46' }} />
      <motion.div
        style={{ position: 'absolute', top: '-16px', left: '21px', width: '8px', height: '8px', backgroundColor: '#d9f99d', border: '1px solid #18181b' }}
        animate={{ opacity: walking ? [1, 0.35, 1] : 1 }}
        transition={{ duration: 0.5, repeat: walking ? Infinity : 0 }}
      />

      {/* head */}
      <div style={{ position: 'absolute', top: 0, left: '8px', width: '40px', height: '26px', backgroundColor: '#d9f99d', border: '2px solid #18181b' }}>
        <div style={{ position: 'absolute', top: '9px', left: '8px', width: '6px', height: '6px', backgroundColor: '#18181b' }} />
        <div style={{ position: 'absolute', top: '9px', right: '8px', width: '6px', height: '6px', backgroundColor: '#18181b' }} />
      </div>

      {/* body + chest light */}
      <div style={{ position: 'absolute', top: '24px', left: '12px', width: '32px', height: '30px', backgroundColor: '#3f3f46', border: '2px solid #18181b' }}>
        <motion.div
          style={{ position: 'absolute', top: '10px', left: '11px', width: '10px', height: '10px', border: '1px solid #18181b' }}
          animate={{ backgroundColor: stage === 'act' || stage === 'walk-in' ? '#52525b' : '#d9f99d' }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* legs — alternate to fake a walk cycle */}
      <motion.div
        style={{ position: 'absolute', top: '52px', left: '14px', width: '10px', height: '18px', backgroundColor: '#18181b' }}
        animate={{ y: walking ? [0, -4, 0] : 0 }}
        transition={{ duration: 0.28, repeat: walking ? Infinity : 0 }}
      />
      <motion.div
        style={{ position: 'absolute', top: '52px', left: '32px', width: '10px', height: '18px', backgroundColor: '#18181b' }}
        animate={{ y: walking ? [-4, 0, -4] : 0 }}
        transition={{ duration: 0.28, repeat: walking ? Infinity : 0 }}
      />

      {/* arm holding the cord */}
      <div style={{ position: 'absolute', top: '32px', left: '42px', width: '14px', height: '6px', backgroundColor: '#18181b' }} />
    </motion.div>
  );
}

function SwitchPanel({ stage, connected, statusText, palette }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {/* cord — its width IS the "plugging in" action */}
      <motion.div
        style={{ height: '4px' }}
        animate={{ width: connected ? '44px' : '0px', backgroundColor: connected ? palette.accent : palette.border }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      />

      {/* spark burst at the exact moment of connect/disconnect */}
      <AnimatePresence>
        {stage === 'flash' && (
          <motion.div
            style={{
              position: 'absolute',
              left: '30px',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${palette.accent}, transparent 70%)`,
              pointerEvents: 'none'
            }}
            initial={{ opacity: 0.9, scale: 0.2 }}
            animate={{ opacity: 0, scale: 1.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.7rem' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.18em', color: palette.accent }}>
          SYS.POWER
        </p>
        <div
          style={{
            position: 'relative',
            width: '96px',
            height: '50px',
            border: `2px solid ${palette.border}`,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.25)'
          }}
        >
          <motion.div
            style={{
              position: 'absolute',
              top: '4px',
              bottom: '4px',
              width: '40px',
              backgroundColor: palette.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            animate={{ left: connected ? 'calc(100% - 40px - 4px)' : '4px' }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          >
            {connected ? <Sun size={14} color={palette.ink} /> : <Moon size={14} color={palette.ink} />}
          </motion.div>
        </div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: palette.muted, letterSpacing: '0.06em' }}>
          {statusText}
        </p>
      </div>
    </div>
  );
}

export default function ThemeTransition() {
  const { isTransitioning, pendingTheme, theme, commitPendingTheme, endTransition } = useTheme();
  const [stage, setStage] = useState('walk-in');
  const timeouts = useRef([]);

  useEffect(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    if (!isTransitioning) return;

    setStage('walk-in');
    const schedule = (fn, ms) => timeouts.current.push(setTimeout(fn, ms));
    schedule(() => setStage('act'), 650);
    schedule(() => {
      commitPendingTheme();
      setStage('flash');
    }, 1150);
    schedule(() => setStage('walk-out'), 1550);
    schedule(() => endTransition(), 2050);

    return () => {
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransitioning]);

  const goingLight = pendingTheme === 'light';
  const connected = stage === 'flash' || stage === 'walk-out' ? goingLight : !goingLight;
  const palette = PALETTE[theme];

  const statusText =
    stage === 'walk-in'
      ? 'POWER MODULE DETECTED...'
      : stage === 'act'
      ? goingLight ? 'CONNECTING PLUG...' : 'DISCONNECTING PLUG...'
      : stage === 'flash'
      ? goingLight ? 'POWER: ON' : 'POWER: OFF'
      : goingLight ? 'LIGHTS: ON' : 'LIGHTS: OFF';

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key="theme-transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, backgroundColor: palette.bg }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          transition={{ opacity: { duration: 0.2 }, backgroundColor: { duration: 0.4 } }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'auto'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Mascot stage={stage} />
            <SwitchPanel stage={stage} connected={connected} statusText={statusText} palette={palette} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
