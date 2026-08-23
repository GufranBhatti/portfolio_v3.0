import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import TextDisperse from './TextDisperse';

const projects = [
  {
    title: 'Repeatify — Multi-Tenant CRM',
    tags: ['AWS Lambda', 'PostgreSQL', 'Cognito', 'React'],
    desc: 'Serverless multi-tenant CRM for small businesses — 30+ Lambda functions handling SMS/email marketing campaigns, credit tracking, and a React admin dashboard, deployed on AWS.'
  },
  {
    title: 'Womb Atlas',
    tags: ['React', 'Vite', 'GSAP', 'Framer Motion'],
    desc: 'A language-first global observatory mapping women’s health narratives across cultures — animated network maps, live intelligence dashboards, and magic-bento interactions.'
  },
  {
    title: 'OptivueAI',
    tags: ['ASP.NET Core', 'SQL Server', 'Computer Vision'],
    desc: 'Enterprise site-safety monitoring platform — live camera feeds, rule-based AI detection, evidence logging, and audited PDF compliance reporting for security teams.'
  },
  {
    title: 'SMSF Client Portal',
    tags: ['AWS', 'Serverless', 'Cognito', 'React'],
    desc: 'Self-Managed Super Fund portal built for TheIntelligenz — secure client onboarding, document handling, and a fully serverless AWS backend.'
  },
  {
    title: 'Mentorship RAG Engine',
    tags: ['FastAPI', 'RAG', 'LLM'],
    desc: 'Retrieval-augmented mentorship assistant serving context-aware answers over a program knowledge base through a concurrent FastAPI backend.'
  },
  {
    title: 'PhishGuard',
    tags: ['Flask', 'scikit-learn', 'Security'],
    desc: 'Real-time phishing URL detector — 16 hand-engineered features, three classifiers benchmarked by F1-score, served through a dark-terminal Flask UI.'
  },
  {
    title: 'Enterprise RAG SQL Chatbot',
    tags: ['FastAPI', 'LangChain', 'Gemini', 'MySQL'],
    desc: 'Multi-tenant FastAPI microservice with workspace-aware RAG pipeline and conversational memory.'
  },
  {
    title: 'Multi-Agent AI System',
    tags: ['CrewAI', 'LangChain', 'Python'],
    desc: 'Autonomous agents for automated email dispatch and smart report generation.'
  },
  {
    title: 'AI Interview Prep App',
    tags: ['Next.js', 'Gemini', 'Full-Stack'],
    desc: 'SaaS application generating tailored interview questions and evaluating responses.'
  },
  {
    title: 'Reckless Driving Detection',
    tags: ['Python', 'ML / DL', 'IoT'],
    desc: 'AI model trained on sensor data to detect reckless driving behavior in real-time.'
  },
  {
    title: 'IoT Intrusion Detection (IEEE)',
    tags: ['TensorFlow', 'Streamlit', 'IEEE'],
    desc: 'Published research implementing BiLSTM & DNN on IoT network attack datasets.'
  },
  {
    title: 'Pose Estimation System',
    tags: ['PyTorch', 'OpenCV', 'MediaPipe'],
    desc: 'Real-time human pose estimation pipeline for workplace safety monitoring.'
  },
  {
    title: 'Power BI Analytics Dashboards',
    tags: ['Power BI', 'DAX', 'Data Modeling'],
    desc: 'Interactive business intelligence dashboards for sales analytics and operational KPIs.'
  },
  {
    title: 'Image Classifier — Dog Breeds',
    tags: ['PyTorch', 'Transfer Learning', 'Udacity'],
    desc: 'Pre-trained CNN image classifier for 133 dog breeds using transfer learning.'
  }
];

function ProjectCard({ project, idx }) {
  // We can add subtle parallax to each card
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <motion.div 
      ref={ref}
      style={{ y, position: 'relative', overflow: 'hidden', minHeight: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
      className="brutalist-cell"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover="hover"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
    >
      <motion.div 
        style={{ position: 'absolute', inset: 0, backgroundColor: 'var(--accent)', zIndex: 0, originY: 1 }}
        variants={{
          hover: { scaleY: 1 }
        }}
        initial={{ scaleY: 0 }}
        transition={{ duration: 0.3, ease: 'circOut' }}
      />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--border-strong)', marginBottom: '1rem' }}>
          PROJ_0{idx + 1}
        </p>
        <motion.h3 
          style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--fg)', letterSpacing: '-0.02em' }}
          variants={{ hover: { color: 'var(--bg)' } }}
        >
          {project.title}
        </motion.h3>
        <motion.p 
          style={{ color: '#a1a1aa', fontSize: '1.1rem', lineHeight: 1.5 }}
          variants={{ hover: { color: 'var(--bg)' } }}
        >
          {project.desc}
        </motion.p>
      </div>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '2rem' }}>
        {project.tags.map(tag => (
          <motion.span 
            key={tag}
            style={{ border: '1px solid var(--border-strong)', padding: '0.3rem 0.8rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}
            variants={{ hover: { borderColor: 'var(--bg)', color: 'var(--bg)' } }}
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section style={{ padding: '8rem 2rem', position: 'relative', backgroundColor: 'var(--bg)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
        >
          <div>
            <h2 style={{ fontSize: '4rem', color: 'var(--fg)', margin: 0 }}><TextDisperse>PROJECTS</TextDisperse></h2>
            <div style={{ width: '100px', height: '4px', backgroundColor: 'var(--accent-secondary)', marginTop: '1rem' }} />
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--border-strong)' }}>// ALL MODULES</p>
        </motion.div>

        <div className="brutalist-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1px' }}>
          {projects.map((project, idx) => (
            <ProjectCard key={idx} project={project} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
