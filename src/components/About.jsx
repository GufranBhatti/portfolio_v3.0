import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import aboutPhoto from '../../about-photo.jpg';

const stages = [
  {
    kind: 'headline',
    text: 'GOOD ENGINEERING TAKES OBSESSION.'
  },
  {
    kind: 'points',
    lead: 'Companies partner with me because of my',
    highlight: 'systems thinking + AI execution',
    points: [
      'I ship production AI systems, not notebook demos.',
      'I bridge deep learning models with real business workflows.'
    ]
  },
  {
    kind: 'points',
    lead: 'When I take on a project, you get',
    highlight: 'speed without breaking what matters',
    points: [
      'I architect scalable APIs and secure cloud infrastructure.',
      'I move fast, ship often, and keep systems maintainable.'
    ]
  }
];

// Scroll-pinned narrative: the photo stays fixed in view while the section
// scrolls through it, and text stages crossfade in sequence tied to scroll
// progress — replaces the old static profile paragraph.
//
// Every color in this component is pinned to fixed dark values on purpose,
// not theme variables: this is a full-bleed photograph with a dramatic dark
// treatment, and flipping that to light mode washes the photo out and makes
// the overlaid text illegible. It stays a fixed "cinematic" section
// regardless of the site-wide theme toggle.
export default function About() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end']
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);

  const stageRanges = [
    [0, 0.05, 0.26, 0.33],
    [0.33, 0.4, 0.62, 0.69],
    [0.69, 0.76, 0.97, 1]
  ];

  const stageOpacities = stageRanges.map(r => useTransform(scrollYProgress, r, [0, 1, 1, 0]));
  const stageYs = stageRanges.map(r => useTransform(scrollYProgress, r, [30, 0, 0, -30]));

  return (
    <section ref={sectionRef} style={{ height: '350vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', backgroundColor: '#09090b' }}>

        {/* Photo — subtly zooms out over the whole scroll, giving the
            "image moves" cue instead of sitting static. Clipped to this
            layer only, so the zoom never bleeds into the text below. */}
        <motion.div style={{ position: 'absolute', inset: 0, scale: imgScale, overflow: 'hidden' }}>
          <img
            src={aboutPhoto}
            alt="Gufran Bhatti at his desk"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: '70% 40%',
              filter: 'grayscale(100%) contrast(112%) brightness(0.55)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(100deg, rgba(9,9,11,0.92) 20%, rgba(9,9,11,0.55) 55%, rgba(9,9,11,0.75) 100%)'
            }}
          />
        </motion.div>

        {/* Grid overlay for continuity with the rest of the site */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '4rem 4rem',
            pointerEvents: 'none'
          }}
        />

        {/* Persistent section label — pinned to the corner of the viewport */}
        <div
          style={{
            position: 'absolute',
            top: '6rem',
            left: '3rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            color: '#d9f99d',
            letterSpacing: '0.05em'
          }}
        >
          // SYSTEM.SPECS
        </div>

        {/* Persistent stat readout */}
        <div
          style={{
            position: 'absolute',
            bottom: '3rem',
            right: '4rem',
            display: 'flex',
            gap: '2.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: '#d9f99d'
          }}
        >
          <span>EXP: 3+ YRS</span>
          <span>SHIPPED: 15+ PROJECTS</span>
        </div>

        {/* Staged text — each stage is its own full-size layer that centers
            its content with flex, so height varies safely between stages
            without ever anchoring to the top and running off the bottom. */}
        <div style={{ position: 'relative', height: '100%' }}>
          {stages.map((stage, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                padding: '0 4rem',
                opacity: stageOpacities[i],
                y: stageYs[i],
                pointerEvents: 'none'
              }}
            >
              <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
                {stage.kind === 'headline' ? (
                  <h2 style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)', color: '#fafafa', margin: 0, lineHeight: 1 }}>
                    {stage.text}
                  </h2>
                ) : (
                  <div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>
                      {stage.lead}
                    </p>
                    <h3 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#d9f99d', margin: 0, marginBottom: '2rem' }}>
                      {stage.highlight}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {stage.points.map((point, pi) => (
                        <div key={pi} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1rem' }}>
                          <span style={{ color: '#d9f99d', fontFamily: 'var(--font-mono)', fontSize: '1.1rem' }}>✓</span>
                          <p style={{ fontSize: '1.1rem', color: '#fafafa', lineHeight: 1.5, margin: 0 }}>{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
