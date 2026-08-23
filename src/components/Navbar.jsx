import React from 'react';
import { motion } from 'framer-motion';

const links = [
  { label: 'HOME', href: '#home' },
  { label: 'SKILL.TREE', href: '#skills' },
  { label: 'SYSTEM.SPECS', href: '#about' },
  { label: 'WORK.HISTORY', href: '#experience' },
  { label: 'EDU.LOG', href: '#education' },
  { label: 'PROJECTS', href: '#projects' },
];

export default function Navbar() {
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
        backgroundColor: 'rgba(9, 9, 11, 0.7)',
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
    </motion.nav>
  );
}
