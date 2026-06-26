import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaArrowRight } from 'react-icons/fa';
import { usePortfolioData } from '../hooks/usePortfolioData';

const itemAnim = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
};

const CATEGORY_COLORS = {
  'Full Stack': 'rgb(var(--primary))',
  'AI & Tools': 'rgb(var(--secondary))',
  'Realtime': 'rgb(var(--primary-light))',
  'Frontend': 'rgb(var(--primary))',
  'Backend': 'rgb(var(--secondary))',
  'Other': 'rgb(var(--secondary-light))',
};

export default function Projects() {
  const { projects } = usePortfolioData();
  const categories = ['All', ...new Set(projects.map(p => p.category))];
  const [active, setActive] = useState('All');
  const [hovered, setHovered] = useState(null);

  const filtered = active === 'All' ? projects : projects.filter(p => p.category === active);

  return (
    <section id="projects" className="py-16 relative overflow-hidden bg-background">
      {/* Ambient blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full opacity-[0.06] pointer-events-none transition-all duration-1000"
        style={{ background: 'radial-gradient(circle, rgb(var(--primary)), transparent 70%)', filter: 'blur(100px)' }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.06] pointer-events-none transition-all duration-1000"
        style={{ background: 'radial-gradient(circle, rgb(var(--secondary)), transparent 70%)', filter: 'blur(90px)' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="tag-badge mb-5 inline-flex">Portfolio</span>
          <h2 className="text-4xl sm:text-6xl font-black tracking-[-0.03em] text-foreground mt-4">
            Featured{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-zinc-400">Projects</span>
          </h2>
          <p className="text-foreground/40 text-base mt-4 max-w-md mx-auto">
            A collection of real-world apps built with the MERN stack and modern tooling.
          </p>
        </motion.div>

        {/* ── Filter Tabs ── */}
        <div className="flex flex-wrap justify-center gap-2 mb-14">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-300 ${active === cat
                  ? 'text-foreground border border-foreground/20'
                  : 'text-foreground/40 border border-foreground/8 hover:border-foreground/15 hover:text-foreground/60'
                }`}
              style={active === cat ? {
                background: 'rgba(var(--foreground),0.08)',
                boxShadow: '0 0 20px rgba(var(--foreground),0.05)'
              } : { background: 'rgba(var(--foreground),0.02)' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Project Grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, i) => {
              const accentColor = CATEGORY_COLORS[project.category] || '#818cf8';
              const isHovered = hovered === project.id;
              return (
                <motion.div
                  key={project.id}
                  variants={itemAnim}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  onMouseEnter={() => setHovered(project.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="group relative rounded-3xl border border-foreground/[0.03] hover:border-primary/40 overflow-hidden flex flex-col transition-all duration-500"
                  style={{
                    background: 'rgba(var(--foreground),0.02)',
                    transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                    boxShadow: isHovered ? `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(var(--foreground),0.15)` : '0 4px 20px rgba(0,0,0,0.2)',
                  }}
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden flex-shrink-0">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl"
                        style={{ background: `linear-gradient(135deg, ${accentColor}15, rgba(0,0,0,0.5))` }}>
                        🚀
                      </div>
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Category badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide"
                      style={{
                        background: `rgba(var(--foreground),0.05)`,
                        border: `1px solid rgba(var(--foreground),0.1)`,
                        color: accentColor,
                        backdropFilter: 'blur(8px)'
                      }}>
                      {project.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-base font-bold text-foreground mb-2 leading-tight">{project.title}</h3>
                    <p className="text-foreground/45 text-xs leading-relaxed flex-1 mb-4 line-clamp-3">{project.description}</p>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {(project.tech || []).slice(0, 4).map(t => (
                        <span key={t} className="px-2.5 py-1 rounded-lg text-[10px] font-semibold text-foreground/50 border border-foreground/[0.03]"
                          style={{ background: 'rgba(var(--foreground),0.03)' }}>
                          {t}
                        </span>
                      ))}
                      {(project.tech || []).length > 4 && (
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold text-foreground/30 border border-foreground/[0.02]">
                          +{project.tech.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-3 pt-4 border-t border-foreground/[0.03]">
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noreferrer"
                          className="flex items-center gap-2 text-xs font-bold text-foreground/45 hover:text-foreground transition-colors duration-200">
                          <FaGithub size={13} /> Code
                        </a>
                      )}
                      {project.demo && project.demo !== "#" && project.demo !== "" && (
                        <a href={project.demo} target="_blank" rel="noreferrer"
                          className="flex items-center gap-2 text-xs font-bold transition-all duration-200 hover:-translate-x-0 ml-auto"
                          style={{ color: accentColor }}>
                          Live Demo <FaExternalLinkAlt size={10} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Bottom glow accent on hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-px transition-all duration-500"
                    style={{
                      background: `linear-gradient(90deg, transparent, rgb(var(--primary)), transparent)`,
                      opacity: isHovered ? 1 : 0
                    }} />
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <a href="https://github.com/Arunsanap99" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-sm text-foreground/70 border border-foreground/[0.03] hover:border-primary/40 bg-foreground/[0.02] hover:bg-foreground/[0.06] transition-all duration-300 hover:-translate-y-0.5">
            <FaGithub size={16} />
            View All on GitHub
            <FaArrowRight size={11} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
