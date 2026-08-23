import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Wraps a top-level section so it slides up and settles over whatever came
// before it as it scrolls into view — rounded top corners and a shadow ease
// out as it reaches its resting position, giving the page real depth on
// scroll instead of sections just appearing.
export default function RevealSection({ id, children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start start']
  });

  const translateY = useTransform(scrollYProgress, [0, 1], ['10%', '0%']);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [64, 0]);
  const shadowOpacity = useTransform(scrollYProgress, [0, 1], [0.6, 0]);
  const boxShadow = useTransform(shadowOpacity, (o) => `0 -60px 100px -20px rgba(0,0,0,${o})`);

  return (
    <motion.div
      id={id}
      ref={ref}
      style={{
        position: 'relative',
        zIndex: 2,
        backgroundColor: 'var(--bg)',
        translateY,
        scale,
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius,
        boxShadow,
        overflow: 'hidden'
      }}
    >
      {children}
    </motion.div>
  );
}
