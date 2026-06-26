import React from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaArrowRight, FaEnvelope, FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { useTypewriter } from '../hooks/useTypewriter';
import { handleResumeClick } from '../utils/utils';

// Staggered container
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function Hero() {
  const { developerInfo } = usePortfolioData();
  const typedText = useTypewriter(developerInfo.taglines, 100, 55, 1800);

  const handleMouseMove = (e) => {
    const card = document.getElementById('hero-parallax-card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `rotateY(${x / 14}deg) rotateX(${-y / 14}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    const card = document.getElementById('hero-parallax-card');
    if (card) card.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden bg-background"
    >
      {/* ── Ambient glow orbs ── */}
      <div className="absolute top-[-15%] left-[-8%] w-[700px] h-[700px] rounded-full opacity-[0.08] pointer-events-none transition-all duration-1000"
        style={{ background: 'radial-gradient(circle, rgb(var(--primary)) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.08] pointer-events-none transition-all duration-1000"
        style={{ background: 'radial-gradient(circle, rgb(var(--secondary)) 0%, transparent 70%)', filter: 'blur(100px)' }} />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] opacity-[0.03] pointer-events-none rotate-12 transition-all duration-1000"
        style={{ background: 'linear-gradient(90deg, rgb(var(--primary)), rgb(var(--secondary)))', filter: 'blur(60px)' }} />

      {/* ── Subtle grid ── */}
      <div className="absolute inset-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center relative z-10">

        {/* ── Left: Text Content ── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="lg:col-span-7 flex flex-col items-start text-left space-y-7"
        >
          {/* Status badge */}
          <motion.div variants={item}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-primary/25 bg-primary/10 backdrop-blur-xl text-primary-light text-[11px] font-bold tracking-[0.15em] font-mono uppercase"
            style={{ boxShadow: '0 0 20px rgba(var(--primary),0.15), inset 0 1px 0 rgba(var(--primary),0.1)' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Available for Work
          </motion.div>

          {/* Hero heading */}
          <motion.h1 variants={item}
            className="text-[clamp(2.8rem,7vw,5.5rem)] font-black tracking-[-0.03em] leading-[1.05] text-foreground"
          >
            Hi, I'm<br />
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-zinc-400" style={{ paddingBottom: '0.1em' }}>
                {developerInfo.name}
              </span>
              {/* Underline glow */}
              <span className="absolute -bottom-2 left-0 w-full h-[2px] rounded-full opacity-40 transition-all duration-1000"
                style={{ background: 'linear-gradient(90deg, rgb(var(--primary)), transparent)' }} />
            </span>
          </motion.h1>

          {/* Typewriter */}
          <motion.div variants={item} className="flex items-center gap-3 h-10">
            <div className="w-1 h-6 rounded-full bg-foreground/20" />
            <p className="text-xl sm:text-2xl font-semibold text-foreground/60 font-mono">
              <span className="text-foreground/90">{typedText}</span>
              <span className="inline-block w-[2px] h-[1.1em] ml-0.5 align-middle animate-pulse rounded-sm bg-foreground/80"
                style={{ verticalAlign: 'middle' }} />
            </p>
          </motion.div>

          {/* About text */}
          <motion.p variants={item}
            className="max-w-lg text-base sm:text-lg text-foreground/50 leading-relaxed font-normal"
          >
            {developerInfo.about}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={item} className="flex flex-wrap items-center gap-4 pt-2">
            <a href="#projects"
              className="group relative px-7 py-3.5 rounded-2xl font-bold text-sm text-background bg-primary flex items-center gap-2.5 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(var(--primary),0.3)]"
            >
              View Projects
              <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
            </a>

            <a href="#contact"
              className="px-7 py-3.5 rounded-2xl font-bold text-sm text-foreground/80 flex items-center gap-2.5 border border-foreground/10 hover:border-foreground/25 bg-foreground/[0.03] hover:bg-foreground/[0.07] transition-all duration-300 hover:-translate-y-1 backdrop-blur-md"
            >
              Hire Me <FaEnvelope size={12} />
            </a>

            <a href={developerInfo.resumeUrl || '#'}
              onClick={(e) => handleResumeClick(e, developerInfo.resumeUrl)}
              target="_blank" rel="noreferrer"
              className="px-7 py-3.5 rounded-2xl font-bold text-sm text-foreground/50 flex items-center gap-2.5 border border-dashed border-foreground/10 hover:border-foreground/20 hover:text-foreground/70 transition-all duration-300 hover:-translate-y-1"
            >
              <FaDownload size={12} /> Resume
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div variants={item} className="flex items-center gap-4 pt-2">
            <span className="text-xs font-mono text-foreground/20 uppercase tracking-widest">Find me on</span>
            <div className="h-px w-8 bg-foreground/10" />
            <div className="flex items-center gap-3">
              {[
                { icon: FaGithub, href: developerInfo.socials?.github, label: 'GitHub' },
                { icon: FaLinkedin, href: developerInfo.socials?.linkedin, label: 'LinkedIn' },
                { icon: FaInstagram, href: developerInfo.socials?.instagram || "https://www.instagram.com/arunn_.44/", label: 'Instagram' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href || '#'} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-xl border border-foreground/10 hover:border-foreground/25 bg-foreground/[0.03] hover:bg-foreground/[0.08] flex items-center justify-center text-foreground/50 hover:text-foreground transition-all duration-300 hover:-translate-y-1"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* ── Right: Portrait Card ── */}
        <div className="lg:col-span-5 flex justify-center items-center mt-12 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            id="hero-parallax-card"
            className="relative cursor-grab active:cursor-grabbing"
            style={{ transformStyle: 'preserve-3d', perspective: '1200px', transition: 'transform 0.3s ease' }}
          >
            {/* Outer glow ring */}
            <div className="absolute -inset-4 rounded-[2.5rem] opacity-15 pointer-events-none transition-all duration-1000"
              style={{
                background: 'radial-gradient(circle, rgb(var(--primary)), transparent)',
                filter: 'blur(30px)',
              }} />

            {/* Main image card */}
            <div className="relative w-full max-w-[260px] sm:max-w-[340px] h-[380px] sm:h-[460px] rounded-[2rem] overflow-hidden group mx-auto"
              style={{
                border: '1px solid rgba(var(--foreground),0.1)',
                boxShadow: '0 30px 80px rgba(var(--background),0.5), 0 0 0 1px rgba(var(--foreground),0.05) inset'
              }}
            >
              {/* Gradient overlay top */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10 pointer-events-none" />

              {/* Photo */}
              {developerInfo.avatar ? (
                <img
                  src={developerInfo.avatar}
                  alt={developerInfo.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-foreground/10"
                  style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)' }}>
                  <span className="text-8xl">👨‍💻</span>
                </div>
              )}

              {/* Bottom name badge */}
              <div className="absolute bottom-0 inset-x-0 p-5 z-20">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-foreground font-bold text-lg leading-tight">{developerInfo.name}</p>
                    <p className="text-foreground/50 text-xs font-mono mt-0.5">{developerInfo.title}</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold font-mono text-emerald-400 border border-emerald-500/30"
                    style={{ background: 'rgba(16,185,129,0.1)', backdropFilter: 'blur(10px)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Open
                  </div>
                </div>
              </div>
            </div>

            {/* Floating stat badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -left-8 top-16 px-4 py-2.5 rounded-2xl text-xs font-bold"
              style={{
                background: 'rgba(var(--foreground),0.03)',
                border: '1px solid rgba(var(--foreground),0.1)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
              }}
            >
              <span className="text-foreground/80">⚡ React Expert</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 1 }}
              className="absolute -right-8 bottom-28 px-4 py-2.5 rounded-2xl text-xs font-bold"
              style={{
                background: 'rgba(var(--foreground),0.03)',
                border: '1px solid rgba(var(--foreground),0.1)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
              }}
            >
              <span className="text-foreground/80">🔥 MERN Stack Expert</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-10"
      >
        <span className="text-[9px] font-bold font-mono tracking-[0.2em] uppercase text-foreground/20">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-foreground/10 flex justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-1 h-1 rounded-full bg-foreground/30"
          />
        </div>
      </motion.div>
    </section>
  );
}
