import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import TextDisperse from './TextDisperse';

export default function Education() {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <section ref={ref} style={{ padding: '4rem 2rem', position: 'relative' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginBottom: '2rem' }}
        >
          <h2 style={{ fontSize: '3rem', color: 'var(--fg)', margin: 0 }}><TextDisperse>EDU.LOG</TextDisperse></h2>
        </motion.div>

        <div className="brutalist-grid" style={{ gridTemplateColumns: '1fr', gap: '1px' }}>
          <motion.div 
            className="brutalist-cell"
            style={{ x, position: 'relative', overflow: 'hidden' }}
          >
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--accent)' }}>Bachelor of Science in Computer Science (BSCS)</h3>
            <h4 style={{ fontSize: '1.2rem', color: 'var(--fg)', marginBottom: '1rem' }}>PAF-KIET — Karachi Institute of Economics & Technology</h4>
            <p style={{ color: '#a1a1aa', fontFamily: 'var(--font-mono)' }}>Karachi, Pakistan • 2019 – 2023</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
