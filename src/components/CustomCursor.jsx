import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const angle = useMotionValue(0);
  
  // Fast and snappy spring for the cursor position
  const posSpringConfig = { damping: 25, stiffness: 600, mass: 0.2 };
  const smoothX = useSpring(x, posSpringConfig);
  const smoothY = useSpring(y, posSpringConfig);
  
  // Slightly looser spring for the rotation to give it a dynamic feel
  const rotSpringConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothAngle = useSpring(angle, rotSpringConfig);

  useEffect(() => {
    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;
    let lastTime = performance.now();

    const handleMouseMove = (e) => {
      const currentX = e.clientX;
      const currentY = e.clientY;
      const currentTime = performance.now();
      
      const dx = currentX - lastX;
      const dy = currentY - lastY;
      const dt = currentTime - lastTime;
      
      // Calculate angle only if there's significant movement
      // and prevent jittering when moving very slowly
      if ((Math.abs(dx) > 1 || Math.abs(dy) > 1) && dt > 0) {
        // atan2 gives the angle in radians. 
        // Adding 90 degrees because our SVG arrow points UP by default (0 degrees usually means pointing RIGHT).
        let theta = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        
        // Ensure shortest path rotation (prevent 360 degree snapbacks)
        const currentAngle = angle.get();
        const diff = theta - (currentAngle % 360);
        if (diff > 180) theta -= 360;
        else if (diff < -180) theta += 360;
        
        angle.set(currentAngle + diff);
      }
      
      x.set(currentX);
      y.set(currentY);
      
      lastX = currentX;
      lastY = currentY;
      lastTime = currentTime;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y, angle]);

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        x: smoothX,
        y: smoothY,
        rotate: smoothAngle,
        pointerEvents: 'none',
        zIndex: 9999,
        // Center the cursor exactly on the pointer tip
        translateX: '-50%',
        translateY: '-50%' 
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--bg)" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0px 0px 4px rgba(217, 249, 157, 0.5))' }}>
        <path d="M12 2L20 22L12 18L4 22L12 2Z" />
      </svg>
    </motion.div>
  );
}
