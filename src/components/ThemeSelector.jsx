import React, { useState, useEffect } from 'react';
import { FaPalette, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const themes = [
  { name: 'Monochrome', class: 'theme-monochrome', color: '#ffffff' },
  { name: 'Blue', class: 'theme-blue', color: '#3b82f6' },
  { name: 'Green', class: 'theme-green', color: '#10b981' },
  { name: 'Rose', class: 'theme-rose', color: '#f43f5e' },
  { name: 'Orange', class: 'theme-orange', color: '#f97316' },
  { name: 'Purple', class: 'theme-purple', color: '#a855f7' },
];

export default function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem('portfolio-theme') || 'theme-rose';
  });

  useEffect(() => {
    const root = document.documentElement;
    // Remove all theme classes first
    themes.forEach((t) => root.classList.remove(t.class));
    
    // Add the active theme class if it's not the default monochrome (which relies on :root default variables)
    if (activeTheme !== 'theme-monochrome') {
      root.classList.add(activeTheme);
    }
    
    localStorage.setItem('portfolio-theme', activeTheme);
    window.dispatchEvent(new CustomEvent('theme-change', { detail: activeTheme }));
  }, [activeTheme]);

  return (
    <>
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center justify-end pointer-events-none">
        {/* Pulsating background ring */}
        <div 
          className="absolute right-0 w-12 h-12 rounded-l-3xl opacity-30 animate-ping pointer-events-none"
          style={{
            background: 'rgb(var(--primary))',
            animationDuration: '3s'
          }}
        />
        <button
          onClick={() => setIsOpen(true)}
          className="pointer-events-auto relative p-3.5 rounded-l-2xl bg-slate-950/80 hover:bg-slate-900/95 backdrop-blur-xl border border-primary/40 border-r-0 flex items-center justify-center transition-all duration-500 hover:scale-105 hover:-translate-x-1 hover:pr-5 shadow-[0_0_30px_rgba(var(--primary),0.55)] group"
          aria-label="Theme Settings"
        >
          <FaPalette 
            className="text-primary group-hover:text-foreground transition-colors duration-300" 
            size={20} 
            style={{ animation: 'spin 10s linear infinite' }}
          />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 200 }}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-[60] p-5 glass-panel rounded-l-3xl border-r-0 shadow-glass-hover w-48 flex flex-col items-center space-y-4"
          >
            <div className="flex items-center justify-between w-full pb-3 border-b border-foreground/10">
              <h4 className="text-sm font-bold font-mono text-foreground tracking-widest uppercase">Themes</h4>
              <button onClick={() => setIsOpen(false)} className="text-foreground/50 hover:text-primary transition-colors">
                <FaTimes size={16} />
              </button>
            </div>
            
            <div className="flex flex-col gap-3 w-full">
              {themes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => setActiveTheme(theme.class)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                    activeTheme === theme.class 
                      ? 'bg-foreground/10 border-foreground/30 shadow-glass' 
                      : 'bg-transparent border-transparent hover:bg-foreground/5 hover:border-foreground/10'
                  }`}
                >
                  <div 
                    className="w-5 h-5 rounded-full shadow-inner border border-foreground/20" 
                    style={{ 
                      backgroundColor: theme.name === 'Monochrome' ? 'rgb(var(--foreground))' : theme.color, 
                      boxShadow: theme.name === 'Monochrome' ? '0 0 10px rgba(var(--foreground), 0.25)' : `0 0 10px ${theme.color}40` 
                    }}
                  />
                  <span className="text-xs font-semibold text-foreground/90">{theme.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
