import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const links = [
  { label: 'HOME', href: '#home' },
  { label: 'SKILL.TREE', href: '#skills' },
  { label: 'SYSTEM.SPECS', href: '#about' },
  { label: 'WORK.HISTORY', href: '#experience' },
  { label: 'EDU.LOG', href: '#education' },
  { label: 'PROJECTS', href: '#projects' },
];

export default function Navbar() {
  const { theme, toggleTheme, isTransitioning } = useTheme();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ delay: 3, duration: 0.8, ease: "easeOut" }} // delay past splash screen
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '1.25rem 4rem',
        display: 'flex',
        alignItems: 'center',
        gap: '3.5rem',
        zIndex: 50,
        backgroundColor: 'rgba(var(--bg-rgb), 0.7)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border)'
      }}
    >
      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--fg)' }}>
        GB_
      </div>

      <div style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--fg)' }}>
        {links.map(({ label, href }) => (
          <a key={href} href={href} style={{ cursor: 'pointer' }}>{label}</a>
        ))}
      </div>

      <button
        onClick={toggleTheme}
        disabled={isTransitioning}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        style={{
          marginLeft: 'auto',
          position: 'relative',
          width: '3.4rem',
          height: '1.8rem',
          background: 'none',
          border: '1px solid var(--border-strong)',
          padding: '2px',
          flexShrink: 0,
          opacity: isTransitioning ? 0.4 : 1
        }}
      >
        <motion.span
          style={{
            position: 'absolute',
            top: '2px',
            bottom: '2px',
            width: '1.4rem',
            backgroundColor: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          animate={{ left: theme === 'dark' ? '2px' : 'calc(100% - 1.4rem - 2px)' }}
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        >
          {theme === 'dark' ? <Moon size={11} color="var(--bg)" /> : <Sun size={11} color="var(--bg)" />}
        </motion.span>
      </button>
    </motion.nav>
  );
}
