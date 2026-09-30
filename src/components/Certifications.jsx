import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import TextDisperse from './TextDisperse';

const certs = [
  { title: "Data Analysis and Visualization with Power BI", issuer: "Microsoft", date: "May 2024" },
  { title: "Data Modeling in Power BI", issuer: "Microsoft", date: "May 2024" },
  { title: "Extract, Transform and Load Data in Power BI", issuer: "Microsoft", date: "Apr 2024" },
  { title: "AI Programming with Python", issuer: "Udacity", date: "Jul 2023" },
  { title: "Neural Networks and Deep Learning", issuer: "Coursera", date: "Jun 2023" },
  { title: "Databases and SQL for Data Science with Python", issuer: "Coursera", date: "Apr 2023" },
  { title: "Data Science and Business Analytics Internship", issuer: "The Sparks Foundation", date: "Nov 2022" },
  { title: "Machine Learning with Python", issuer: "freeCodeCamp", date: "Sep 2022" },
  { title: "Data Analysis with Python", issuer: "freeCodeCamp", date: "Jul 2022" }
];

export default function Certifications() {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  
  return (
    <section ref={ref} style={{ padding: '8rem 2rem', position: 'relative' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
        >
          <h2 style={{ fontSize: '3rem', color: 'var(--fg)', margin: 0 }}><TextDisperse>CERTIFICATIONS</TextDisperse></h2>
          <div style={{ width: '100px', height: '4px', backgroundColor: 'var(--accent)', marginTop: '1rem' }} />
        </motion.div>

        <div className="brutalist-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1px' }}>
          {certs.map((cert, i) => {
            // Apply subtle up/down parallax alternating by index
            const y = useTransform(scrollYProgress, [0, 1], i % 2 === 0 ? [50, -50] : [-50, 50]);
            
            return (
              <motion.div
                key={i}
                className="brutalist-cell cert-cell"
                style={{ y, position: 'relative' }}
                whileHover={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <h3 style={{ fontSize: '1.2rem', color: 'var(--fg)', marginBottom: '0.5rem' }}>{cert.title}</h3>
                <p style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>{cert.issuer}</p>
                <p style={{ color: 'var(--muted-strong)', fontSize: '0.8rem', marginTop: '1rem', fontFamily: 'var(--font-mono)' }}>{cert.date}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
