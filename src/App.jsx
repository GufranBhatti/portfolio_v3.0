import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import RevealSection from './components/RevealSection';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Education from './components/Education';
import Certifications from './components/Certifications';
import Projects from './components/Projects';
import Publications from './components/Publications';
import AskGB from './components/AskGB';
import Contact from './components/Contact';
import CustomCursor from './components/CustomCursor';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <CustomCursor />
      <AnimatePresence mode="wait">
        {loading && <SplashScreen key="splash" />}
      </AnimatePresence>

      {!loading && (
        <main>
          <Navbar />
          <div id="home">
            <Hero />
          </div>
          <RevealSection id="skills">
            <Skills />
          </RevealSection>
          <div id="about">
            <About />
          </div>
          <RevealSection id="experience">
            <Experience />
          </RevealSection>
          <RevealSection id="education">
            <Education />
            <Certifications />
          </RevealSection>
          <RevealSection id="projects">
            <Projects />
            <Publications />
          </RevealSection>
          <RevealSection id="ask">
            <AskGB />
          </RevealSection>
          <RevealSection id="contact">
            <Contact />
          </RevealSection>
        </main>
      )}
    </>
  );
}

export default App;
