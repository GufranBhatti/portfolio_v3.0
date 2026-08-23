import React from 'react';
import { motion } from 'framer-motion';
import TextDisperse from './TextDisperse';

const roles = [
  {
    company: 'THEINTELLIGENZ',
    location: 'Karachi, PK',
    title: 'Full Stack Developer',
    dates: 'MAY 2026 - PRESENT',
    bullets: [
      'Multi-Tenant Loyalty Platform: Architecting and developing a comprehensive multi-tenant SaaS application that enables multiple businesses to onboard, manage their customer base, and configure custom loyalty reward logic, all overseen by a centralized super-admin dashboard.',
      'Enterprise Web Portals: Designed and built a robust Self-Managed Super Fund (SMSF) portal from the ground up, managing frontend user interfaces, backend business logic, and secure database architecture.',
      'Frontend Development: Created a highly interactive and animated static website utilizing React to deliver a dynamic and engaging user experience.',
      'Cloud Infrastructure: Leveraging AWS for deploying, hosting, and managing web applications, ensuring scalable and secure server environments.'
    ]
  },
  {
    company: 'NEUSCO',
    location: 'Karachi, PK',
    note: 'IT Services and IT Consulting',
    title: 'AI Engineer',
    dates: 'JUN 2025 - APR 2026',
    bullets: [
      'Agentic Orchestration: Architected and implemented multi-agent systems using CrewAI and LangChain, automating complex enterprise workflows and significantly reducing manual processing time.',
      'Enterprise RAG: Developed workspace-aware RAG chatbots with strict security guardrails to prevent data leakage, ensuring secure context-aware query generation for corporate users.',
      'Computer Vision: Engineered real-time deep learning models utilizing PyTorch and TensorFlow for object recognition and pose estimation, powering interactive gesture-based applications.',
      'Full-Stack Development: Built scalable web applications (e.g., OptivueAI) and integrated RESTful APIs utilizing PHP and Laravel for seamless, dynamic user experiences.',
      'Workflow Automation: Orchestrated end-to-end data pipelines using Python and n8n, seamlessly bridging LLMs, vector databases (Qdrant), and client interfaces.'
    ]
  },
  {
    company: 'PRECISION BIRD (PVT) LIMITED',
    location: 'Karachi, PK',
    note: 'Service based Software Company',
    title: 'Python Developer (AI/ML | Data Analytics)',
    dates: 'SEP 2023 - MAY 2025',
    bullets: [
      'Geospatial AI: Fine-tuned YOLOv8 and the Segment Anything Model (SAM) for satellite imagery, increasing crop identification and field delineation accuracy by over 15%.',
      'Model Validation: Implemented Intersection over Union (IoU) metrics to validate model performance, heavily reducing the operational need for manual map digitization.',
      'Data Pipelines: Automated spatial data acquisition and preprocessing workflows using Python, accelerating the delivery of high-resolution orthomosaics.',
      'Analytics Integration: Designed interactive business intelligence dashboards using Power BI to visualize complex geospatial and operational datasets for stakeholders.'
    ]
  },
  {
    company: 'THE SPARKS FOUNDATION',
    location: 'Karachi, PK',
    note: 'Singapore based Software Company',
    title: 'Data Scientist Intern',
    dates: 'OCT 2022 - NOV 2022',
    bullets: [
      'Performed Exploratory Data Analysis (EDA) on diverse datasets to identify trends and anomalies.',
      'Trained and evaluated fundamental supervised machine learning models to solve classification tasks.'
    ]
  }
];

function RoleCard({ role, idx }) {
  return (
    <motion.div
      className="brutalist-cell"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: idx * 0.08 }}
      style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 260px) 1fr', gap: '2rem' }}
    >
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent)' }}>{role.dates}</p>
        <h3 style={{ fontSize: '1.4rem', marginTop: '0.6rem', color: 'var(--fg)' }}>{role.title}</h3>
        <p style={{ color: '#d4d4d8', fontSize: '0.95rem', marginTop: '0.4rem' }}>{role.company}</p>
        <p style={{ color: '#71717a', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>{role.location}{role.note ? ` — ${role.note}` : ''}</p>
      </div>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {role.bullets.map((b, i) => {
          const [label, ...rest] = b.split(':');
          const detail = rest.join(':').trim();
          return (
            <li key={i} style={{ display: 'flex', gap: '0.75rem', color: '#a1a1aa', fontSize: '1rem', lineHeight: 1.6 }}>
              <span style={{ color: 'var(--accent-secondary)', flexShrink: 0 }}>▹</span>
              <span>
                <strong style={{ color: 'var(--fg)', fontWeight: 600 }}>{label}:</strong> {detail}
              </span>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}

export default function Experience() {
  return (
    <section style={{ padding: '8rem 2rem', position: 'relative' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          style={{ marginBottom: '4rem' }}
        >
          <h2 style={{ fontSize: '4rem', color: 'var(--fg)', margin: 0 }}><TextDisperse>WORK.HISTORY</TextDisperse></h2>
          <div style={{ width: '100px', height: '4px', backgroundColor: 'var(--accent-secondary)', marginTop: '1rem' }} />
        </motion.div>

        <div className="brutalist-grid" style={{ gridTemplateColumns: '1fr', gap: '1px' }}>
          {roles.map((role, idx) => (
            <RoleCard key={role.company} role={role} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
