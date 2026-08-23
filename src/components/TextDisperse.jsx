import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Per-character offsets for the scatter-on-hover effect. Index wraps via
// modulo below, so this works for strings longer than 13 characters too.
const transforms = [
  { x: -0.8, y: -0.6, rotationZ: -29 },
  { x: -0.2, y: -0.4, rotationZ: -6 },
  { x: -0.05, y: 0.1, rotationZ: 12 },
  { x: -0.05, y: -0.1, rotationZ: -9 },
  { x: -0.1, y: 0.55, rotationZ: 3 },
  { x: 0, y: -0.1, rotationZ: 9 },
  { x: 0, y: 0.15, rotationZ: -12 },
  { x: 0, y: 0.15, rotationZ: -17 },
  { x: 0, y: -0.65, rotationZ: 9 },
  { x: 0.1, y: 0.4, rotationZ: 12 },
  { x: 0, y: -0.15, rotationZ: -9 },
  { x: 0.2, y: 0.15, rotationZ: 12 },
  { x: 0.8, y: 0.6, rotationZ: 20 }
];

const charVariants = {
  open: (t) => ({
    x: `${t.x}em`,
    y: `${t.y}em`,
    rotateZ: t.rotationZ,
    transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1] },
    zIndex: 1
  }),
  closed: {
    x: 0,
    y: 0,
    rotateZ: 0,
    transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1] },
    zIndex: 0
  }
};

// Renders as an inline <span> so it can sit inside an <h2>/<h3> and inherit
// the parent's font/color/letter-spacing — on hover each character scatters
// outward, then eases back together on mouse leave.
export default function TextDisperse({ children, style, ...props }) {
  const [isAnimated, setIsAnimated] = useState(false);

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', cursor: 'pointer', ...style }}
      onMouseEnter={() => setIsAnimated(true)}
      onMouseLeave={() => setIsAnimated(false)}
      {...props}
    >
      {children.split('').map((char, i) => (
        <motion.span
          key={i}
          custom={transforms[i % transforms.length]}
          variants={charVariants}
          animate={isAnimated ? 'open' : 'closed'}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}
