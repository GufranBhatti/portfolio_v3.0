import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5; // Jump randomly
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="splash-screen"
      initial={{ y: 0 }}
      exit={{ 
        y: '-100vh', 
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
      }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--accent)',
        color: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '2rem',
        zIndex: 9999,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <motion.h1 
          style={{ fontSize: 'clamp(4rem, 15vw, 12rem)', lineHeight: 0.8, letterSpacing: '-0.05em', margin: 0 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          SYS.INIT
        </motion.h1>
        <motion.h2 
          style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', lineHeight: 0.8, margin: 0, fontFamily: 'var(--font-mono)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {progress > 100 ? 100 : progress}%
        </motion.h2>
      </div>
      
      <div style={{ 
        width: '100%', 
        height: '4px', 
        backgroundColor: 'rgba(0,0,0,0.2)', 
        marginTop: '2rem',
        overflow: 'hidden' 
      }}>
        <motion.div 
          style={{ height: '100%', backgroundColor: 'var(--bg)' }}
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "circOut" }}
        />
      </div>
    </motion.div>
  );
}
