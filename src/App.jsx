import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';

import Navbar from './components/Navbar';
import ThreeBackground from './components/ThreeBackground';
import CustomCursor from './components/CustomCursor';
import AIQueryBot from './components/AIQueryBot';
import ThemeSelector from './components/ThemeSelector';
import AdminPanel from './pages/AdminPanel';
import { ADMIN_PATH } from './store/portfolioStore';

import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Experience from './sections/Experience';
import Contact from './sections/Contact';


function Portfolio() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen">
      <CustomCursor />
      
      {/* Background Layer */}
      <div className="fixed inset-0 z-0">
        <ThreeBackground />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Contact />
        </main>
      </div>

      {/* Floating Elements */}
      <ThemeSelector />
      <AIQueryBot />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path={ADMIN_PATH} element={<AdminPanel />} />
    </Routes>
  );
}

export default App;
