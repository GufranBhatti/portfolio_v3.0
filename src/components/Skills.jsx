import React from 'react';
import { motion } from 'framer-motion';
import TextDisperse from './TextDisperse';

const categories = [
  {
    title: 'Gen AI & LLMs',
    skills: ['RAG Pipelines', 'LangChain', 'CrewAI (Multi-Agent)', 'Llama 3.2', 'Gemini API', 'Prompt Engineering', 'Hugging Face', 'OpenAI', 'MistralAI', 'Text-to-Speech', 'Whisper', 'Cloud Inference (DeepInfra)', 'Stable Diffusion', 'MidJourney', 'Flux1']
  },
  {
    title: 'Computer Vision',
    skills: ['YOLOv8 (Fine-tuning)', 'RF-DETR', 'Segment Anything (SAM)', 'OpenCV', 'MediaPipe', 'Pose Estimation', 'Object Recognition', 'Object Tracking']
  },
  {
    title: 'Development',
    skills: ['React', 'Python (Advanced)', 'PHP', 'Laravel', 'RESTful APIs', 'FastAPI', 'Flask', 'C#', 'Streamlit', 'HTML/CSS/JS']
  },
  {
    title: 'Data, Cloud & Infra',
    skills: ['AWS', 'Qdrant (Vector DB)', 'PostgreSQL', 'MS SQL', 'Docker', 'Git']
  },
  {
    title: 'Automation & Analytics',
    skills: ['n8n Workflows', 'Power BI (DAX)', 'PowerQuery', 'ArcGIS Pro']
  },
  {
    title: 'Soft Skills',
    skills: ['Leadership', 'Punctual', 'Teaching Skills', 'Active Learner']
  }
];

export default function Skills() {
  return (
    <section style={{ padding: '8rem 2rem', position: 'relative' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          style={{ marginBottom: '4rem' }}
        >
          <h2 style={{ fontSize: '4rem', color: 'var(--fg)', margin: 0 }}><TextDisperse>SKILL.TREE</TextDisperse></h2>
          <div style={{ width: '100px', height: '4px', backgroundColor: 'var(--accent)', marginTop: '1rem' }} />
        </motion.div>

        <div className="brutalist-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1px' }}>
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              className="brutalist-cell"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', color: i % 2 === 0 ? 'var(--accent)' : 'var(--accent-secondary)' }}>
                // {cat.title.toUpperCase()}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {cat.skills.map(skill => (
                  <span
                    key={skill}
                    style={{
                      border: '1px solid var(--border-strong)',
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--fg)'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
