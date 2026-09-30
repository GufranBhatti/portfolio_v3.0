import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import TextDisperse from './TextDisperse';

export default function Publications() {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={ref} style={{ padding: '4rem 2rem', position: 'relative', backgroundColor: 'var(--border)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginBottom: '2rem' }}
        >
          <h2 style={{ fontSize: '3rem', color: 'var(--bg)', margin: 0 }}><TextDisperse>RESEARCH.PUB</TextDisperse></h2>
        </motion.div>

        <div className="brutalist-grid" style={{ gridTemplateColumns: '1fr', gap: '1px' }}>
          <motion.div 
            className="brutalist-cell"
            style={{ x, position: 'relative', overflow: 'hidden', backgroundColor: 'var(--fg)', color: 'var(--bg)' }}
            whileHover={{ scale: 0.98 }}
          >
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--bg)' }}>Efficient & Sustainable Intrusion Detection System Using Machine Learning & Deep Learning for IoT</h3>
            
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--muted-inverted)' }}>
              <span>IEEE</span>
              <span>April 20, 2023</span>
            </div>

            <p style={{ color: 'var(--muted-inverted-strong)', lineHeight: 1.6, fontSize: '1.1rem' }}>
              Contributed to research on enhancing security frameworks for Internet of Things (IoT) devices by leveraging advanced ML and Deep Learning algorithms to detect network intrusions efficiently.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
