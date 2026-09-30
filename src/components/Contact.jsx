import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import SignatureText from './SignatureText';
import footerPhoto from '../../footer-photo.jpg';

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Skill.Tree', href: '#skills' },
  { label: 'System.Specs', href: '#about' },
  { label: 'Work.History', href: '#experience' },
  { label: 'Edu.Log', href: '#education' },
  { label: 'Projects', href: '#projects' }
];

const connectLinks = [
  { label: 'Email', href: 'mailto:gufranbhatti5@gmail.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/gufran-bhatti-80568822a/' },
  { label: 'GitHub', href: 'https://github.com/GufranBhatti' }
];

const builtWith = ['React', 'Three.js / R3F', 'Framer Motion', 'Vite'];

export default function Contact() {
  const sectionRef = useRef(null);

  // Same cursor-spotlight-reveal used in the Hero — keeps the closing
  // section interactive/immersive without needing a background photo yet
  const spotX = useMotionValue(-400);
  const spotY = useMotionValue(-400);
  const spotSpring = { damping: 30, stiffness: 200, mass: 0.6 };
  const spotSpringX = useSpring(spotX, spotSpring);
  const spotSpringY = useSpring(spotY, spotSpring);

  const handleMouseMove = (e) => {
    const rect = sectionRef.current.getBoundingClientRect();
    spotX.set(e.clientX - rect.left);
    spotY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    spotX.set(-400);
    spotY.set(-400);
  };

  const spotlightMask = useTransform([spotSpringX, spotSpringY], ([sx, sy]) =>
    `radial-gradient(320px circle at ${sx}px ${sy}px, black 0%, transparent 100%)`
  );

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative', overflow: 'hidden', backgroundColor: 'var(--bg)' }}
    >
      {/* Background photo — desaturated and darkened to keep the closing
          section on-theme and the text legible above it */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <img
          src={footerPhoto}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 30%',
            filter: 'contrast(108%) brightness(0.75) saturate(115%)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(var(--bg-rgb),0.2) 0%, rgba(var(--bg-rgb),0.55) 55%, var(--bg) 100%)'
          }}
        />
      </div>

      {/* Faint grid, always visible */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(var(--fg-rgb),0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--fg-rgb),0.04) 1px, transparent 1px)',
          backgroundSize: '4rem 4rem',
          pointerEvents: 'none'
        }}
      />

      {/* Cursor-tracked spotlight that reveals a brighter accent grid */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          WebkitMaskImage: spotlightMask,
          maskImage: spotlightMask,
          backgroundImage:
            'radial-gradient(circle, rgba(var(--accent-rgb),0.15), transparent 60%), linear-gradient(rgba(var(--accent-rgb),0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.3) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 4rem 4rem, 4rem 4rem'
        }}
      />

      <div style={{ position: 'relative', padding: '8rem 2rem 4rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: '1rem' }}>
              // LET'S BUILD SOMETHING
            </p>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <SignatureText text="Gufran Bhatti" fontSize={130} height={220} />
            </div>

            <p style={{ color: 'var(--muted)', fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '3rem', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
              Open to new opportunities in Full Stack Development, AI Engineering, and Backend Architecture.
            </p>

            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.a
                href="mailto:gufranbhatti5@gmail.com"
                className="btn-primary"
                style={{ padding: '1rem 3rem', fontSize: '1.2rem', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                TRANSMIT_EMAIL
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/gufran-bhatti-80568822a/"
                target="_blank"
                className="btn-outline"
                style={{ padding: '1rem 3rem', fontSize: '1.2rem', fontFamily: 'var(--font-mono)' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                LINKEDIN
              </motion.a>
              <motion.a
                href="https://github.com/GufranBhatti"
                target="_blank"
                className="btn-outline"
                style={{ padding: '1rem 3rem', fontSize: '1.2rem', fontFamily: 'var(--font-mono)' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                GITHUB
              </motion.a>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Footer directory — stays transparent over the photo, no divider
          line (a line here just floats awkwardly over the still-visible
          photo since it hasn't fully faded by this point in the section) */}
      <div style={{ position: 'relative', padding: '4rem 2rem' }}>
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '3rem',
            textAlign: 'left'
          }}
        >
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--fg)' }}>GB_</p>
            <p style={{ color: 'var(--muted-strong)', fontSize: '0.9rem', marginTop: '1rem', lineHeight: 1.6, maxWidth: '260px' }}>
              AI Engineer & Full-Stack Developer building intelligent systems and immersive interfaces.
            </p>
          </div>

          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent)', marginBottom: '1.25rem', letterSpacing: '0.05em' }}>QUICK LINKS</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {quickLinks.map(link => (
                <a key={link.href} href={link.href} style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>{link.label}</a>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent)', marginBottom: '1.25rem', letterSpacing: '0.05em' }}>CONNECT</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {connectLinks.map(link => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer" style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>{link.label}</a>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent)', marginBottom: '1.25rem', letterSpacing: '0.05em' }}>BUILT WITH</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {builtWith.map(tool => (
                <span key={tool} style={{ color: 'var(--muted)', fontSize: '0.95rem', fontFamily: 'var(--font-mono)' }}>{tool}</span>
              ))}
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--border-strong)', marginTop: '4rem' }}>
          &copy; 2026 GUFRAN BHATTI. SYSTEM OFFLINE.
        </p>
      </div>
    </section>
  );
}
