import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { handleResumeClick } from '../utils/utils';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const { developerInfo } = usePortfolioData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const handleScroll = () => {
      const sy = window.scrollY;
      setScrolled(sy > 60);

      // progress bar
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? (sy / docH) * 100 : 0);

      // active section
      const scrollPos = sy + 140;
      navLinks.forEach(link => {
        const el = document.querySelector(link.href);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top && scrollPos < top + el.offsetHeight) {
            setActiveSection(link.name.toLowerCase());
          }
        }
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    theme === 'light' ? root.classList.remove('dark') : root.classList.add('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const initials = developerInfo.name?.split(' ').map(n => n[0]).join('') || 'AS';

  return (
    <>
      {/* ── Scroll Progress Bar ── */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[100] bg-foreground/5">
        <motion.div
          className="h-full origin-left"
          style={{
            scaleX: scrollProgress / 100,
            background: 'rgba(var(--primary), 1)',
            boxShadow: '0 0 10px rgba(var(--primary), 0.5)'
          }}
        />
      </div>

      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled
          ? 'py-3'
          : 'py-5 bg-transparent'
        }`}>
        {/* Frosted glass bg — only when scrolled */}
        {scrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 border-b"
            style={{
              background: 'rgba(var(--background),0.8)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderColor: 'rgba(var(--primary), 0.2)',
              boxShadow: '0 4px 30px rgba(var(--primary), 0.05)'
            }}
          />
        )}

        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-10">

          {/* Brand */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black text-foreground relative overflow-hidden"
              style={{
                background: 'rgba(var(--foreground),0.05)',
                boxShadow: '0 4px 15px rgba(var(--foreground),0.05)',
                border: '1px solid rgba(var(--foreground),0.1)',
              }}>
              {initials}
            </div>
            <span className="text-sm font-bold text-foreground/80 group-hover:text-foreground transition-colors duration-200 hidden sm:block tracking-wide">
              {developerInfo.name}
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.name.toLowerCase();
              return (
                <a
                  key={link.name}
                  href={link.name === 'Resume' ? (developerInfo.resumeUrl || '#') : link.href}
                  onClick={link.name === 'Resume' ? (e) => handleResumeClick(e, developerInfo.resumeUrl) : undefined}
                  target={link.name === 'Resume' ? '_blank' : undefined}
                  rel={link.name === 'Resume' ? 'noopener noreferrer' : undefined}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'text-primary' : 'text-foreground/45 hover:text-foreground/80'
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBg"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: 'rgba(var(--primary),0.08)',
                        border: '1px solid rgba(var(--primary),0.3)',
                        boxShadow: '0 0 15px rgba(var(--primary),0.15)'
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </a>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(p => p === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 rounded-xl border border-foreground/10 hover:border-foreground/25 bg-foreground/[0.03] hover:bg-foreground/[0.07] flex items-center justify-center text-foreground/50 hover:text-foreground transition-all duration-200"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <FaSun size={14} /> : <FaMoon size={14} />}
            </button>

            {/* CTA button */}
            <a href="#contact"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-foreground/10"
              style={{
                background: 'rgba(var(--foreground),0.05)',
                border: '1px solid rgba(var(--foreground),0.1)',
              }}
            >
              Hire Me
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(p => !p)}
              className="lg:hidden w-9 h-9 rounded-xl border border-foreground/10 bg-foreground/[0.03] flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <FaTimes size={15} /> : <FaBars size={15} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="lg:hidden overflow-hidden mx-4 mt-2 rounded-2xl border border-foreground/10"
              style={{
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(30px)',
              }}
            >
              <ul className="p-4 flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.name.toLowerCase();
                  return (
                    <li key={link.name}>
                      <a
                        href={link.name === 'Resume' ? (developerInfo.resumeUrl || '#') : link.href}
                        onClick={link.name === 'Resume' ? (e) => { setMobileMenuOpen(false); handleResumeClick(e, developerInfo.resumeUrl); } : () => setMobileMenuOpen(false)}
                        target={link.name === 'Resume' ? '_blank' : undefined}
                        rel={link.name === 'Resume' ? 'noopener noreferrer' : undefined}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'text-primary bg-primary/[0.08] border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.15)]' : 'text-foreground/50 hover:text-foreground hover:bg-foreground/[0.04]'
                          }`}
                      >
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-primary" />
                        )}
                        {link.name}
                      </a>
                    </li>
                  );
                })}
                <li className="pt-2 border-t border-foreground/5 mt-2">
                  <a href="#contact"
                    className="flex items-center justify-center py-3 rounded-xl text-sm font-bold text-foreground transition-colors duration-200 hover:bg-foreground/10"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      background: 'rgba(var(--foreground),0.05)',
                      border: '1px solid rgba(var(--foreground),0.1)'
                    }}
                  >
                    Hire Me
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
