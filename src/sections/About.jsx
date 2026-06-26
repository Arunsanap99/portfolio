import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  FaGraduationCap, FaAward, FaEnvelope,
  FaMapMarkerAlt, FaCode, FaDownload, FaArrowRight
} from 'react-icons/fa';
import { usePortfolioData } from '../hooks/usePortfolioData';
import StatsCounter from '../components/StatsCounter';
import { handleResumeClick } from '../utils/utils';

/* ── Animation helpers ─────────────────────────────────────── */
const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

const fadeLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -32 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

const fadeRight = (delay = 0) => ({
  initial: { opacity: 0, x: 32 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ── Stat Chip ──────────────────────────────────────────────── */
const STAT_CONFIG = [
  { color: 'rgb(var(--primary))', accent: 'rgba(var(--foreground),0.02)', border: 'rgba(var(--foreground),0.03)' },
  { color: 'rgb(var(--primary-light))', accent: 'rgba(var(--foreground),0.02)', border: 'rgba(var(--foreground),0.03)' },
  { color: 'rgb(var(--secondary-light))', accent: 'rgba(var(--foreground),0.02)', border: 'rgba(var(--foreground),0.03)' },
  { color: 'rgb(var(--secondary))', accent: 'rgba(var(--foreground),0.02)', border: 'rgba(var(--foreground),0.03)' },
];

function StatChip({ stat, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const c = STAT_CONFIG[index % 4];
  return (
    <motion.div
      ref={ref}
      {...fade(0.05 * index)}
      className="flex flex-col items-center justify-center text-center p-5 rounded-2xl border relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow-sm"
      style={{ background: c.accent, borderColor: c.border }}
    >
      {/* soft glow spot */}
      <div className="absolute -top-5 -right-5 w-12 h-12 rounded-full pointer-events-none opacity-40"
        style={{ background: `radial-gradient(circle, ${c.color}, transparent)`, filter: 'blur(12px)' }} />
      <p className="text-[1.8rem] font-black leading-none relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-foreground to-zinc-400">
        {inView ? (
          typeof stat.value === 'number' ? (
            <StatsCounter value={stat.value} suffix={stat.suffix} />
          ) : (
            <span>{stat.value}{stat.suffix}</span>
          )
        ) : '0'}
      </p>
      <p className="text-[10px] font-semibold tracking-wide text-foreground/40 mt-1.5 relative z-10 uppercase">
        {stat.label}
      </p>
    </motion.div>
  );
}

/* ── Edu / Achievement Row ──────────────────────────────────── */
// Simplified details directly into compact highlights

/* ── Main ───────────────────────────────────────────────────── */
export default function About() {
  const { developerInfo, stats } = usePortfolioData();

  const infoItems = [
    { icon: FaEnvelope,     val: developerInfo.email,   color: 'rgb(var(--foreground))', label: 'Email'    },
    { icon: FaMapMarkerAlt, val: developerInfo.address, color: 'rgb(var(--foreground))', label: 'Location' },
    { icon: FaCode,         val: 'MERN Stack',          color: 'rgb(var(--foreground))', label: 'Stack'    },
  ].filter(i => i.val);

  return (
    <section id="about" className="py-16 relative overflow-hidden bg-background">

      {/* ── Ambient glow ── */}
      <div className="absolute top-0 right-[-8%] w-[560px] h-[560px] rounded-full pointer-events-none opacity-[0.06] transition-all duration-1000"
        style={{ background: 'radial-gradient(circle, rgb(var(--primary)), transparent 65%)', filter: 'blur(90px)' }} />
      <div className="absolute bottom-0 left-[-6%] w-[480px] h-[480px] rounded-full pointer-events-none opacity-[0.06] transition-all duration-1000"
        style={{ background: 'radial-gradient(circle, rgb(var(--secondary)), transparent 65%)', filter: 'blur(100px)' }} />

      {/* ── Dot grid ── */}
      <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-[0.05]
        [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,black_30%,transparent_100%)]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ════════════════════════════════
            SECTION HEADER
        ════════════════════════════════ */}
        <motion.div {...fade()} className="mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <span className="tag-badge mb-4 inline-flex">Who I Am</span>
            <h2 className="text-4xl xs:text-5xl sm:text-6xl md:text-[4.5rem] font-black tracking-[-0.04em] leading-[1.0] text-foreground whitespace-nowrap">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-zinc-400" style={{ paddingBottom: '0.15em' }}>Myself</span>
            </h2>
          </div>
          {/* Subtle horizontal rule with label */}
          <p className="text-foreground/35 text-sm leading-relaxed max-w-xs sm:text-right">
            Passionate MERN Stack developer. I craft fast, beautiful, production-ready web applications.
          </p>
        </motion.div>

        {/* ════════════════════════════════
            MAIN TWO-COLUMN GRID
        ════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── LEFT: Photo + Info strip ── */}
          <motion.div {...fadeLeft(0.05)} className="lg:col-span-5 flex flex-col gap-4">

            {/* Photo */}
            <div className="relative w-full max-w-[320px] md:max-w-[400px] lg:max-w-none mx-auto aspect-[3/4] rounded-3xl overflow-hidden group"
              style={{
                border: '1px solid rgba(var(--foreground),0.02)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(var(--foreground),0.02) inset',
              }}
            >
              {/* colour grade overlay */}
              <div className="absolute inset-0 bg-black/20 pointer-events-none z-10" />

              {(developerInfo.aboutAvatar || developerInfo.avatar) ? (
                <img
                  src={developerInfo.aboutAvatar || developerInfo.avatar}
                  alt={developerInfo.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)' }}>
                  <span className="text-9xl opacity-20">👨‍💻</span>
                </div>
              )}

              {/* Bottom name strip */}
              <div className="absolute bottom-0 inset-x-0 p-5 z-20"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }}>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-foreground font-bold text-base leading-tight">{developerInfo.name}</p>
                    <p className="text-foreground/40 text-[11px] font-mono mt-0.5">{developerInfo.title}</p>
                  </div>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold text-foreground/80 border border-foreground/20"
                    style={{ background: 'rgba(var(--foreground),0.05)', backdropFilter: 'blur(8px)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/80 animate-pulse" />
                    Open
                  </span>
                </div>
              </div>
            </div>

            {/* ── Info strip ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2 w-full">
              {infoItems.map(({ icon: Icon, val, color, label }, i) => (
                <div key={i} className="flex items-center gap-3.5 px-5 py-3 rounded-2xl border border-foreground/6 bg-foreground/[0.02] overflow-hidden">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                    <Icon size={11} style={{ color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-black tracking-widest uppercase text-foreground/25 mb-0.5">{label}</p>
                    <p className="text-xs font-semibold text-foreground/65 truncate">{val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── CTA Button (resume) ── */}
            {developerInfo.resumeUrl && developerInfo.resumeUrl !== '#' && (
              <motion.a
                {...fade(0.15)}
                href={developerInfo.resumeUrl}
                onClick={(e) => handleResumeClick(e, developerInfo.resumeUrl)}
                target="_blank" rel="noreferrer"
                className="group flex items-center justify-center gap-3 py-3 w-full rounded-2xl border border-foreground/8 hover:border-foreground/20 text-foreground/55 hover:text-foreground text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 bg-foreground/[0.02]"
              >
                <FaDownload size={12} className="group-hover:-translate-y-0.5 transition-transform duration-200" />
                Download Résumé
                <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform duration-200" />
              </motion.a>
            )}
          </motion.div>

          {/* ── RIGHT: Text + Stats + Cards ── */}
          <motion.div {...fadeRight(0.08)} className="lg:col-span-7 flex flex-col gap-6">

            {/* ── Bio block ── */}
            <div className="rounded-3xl border border-foreground/6 p-8 relative overflow-hidden"
              style={{ background: 'rgba(var(--foreground),0.02)' }}>
              {/* accent corner */}
              <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-[0.08] transition-all duration-1000"
                style={{ background: 'radial-gradient(circle at top right, rgb(var(--primary)), transparent 70%)', filter: 'blur(20px)' }} />

              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(var(--foreground),0.3), transparent)' }} />
                <span className="text-[10px] font-black tracking-[0.2em] uppercase text-foreground/50">My Story</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-foreground leading-snug tracking-tight mb-5">
                Full Stack Journey &amp; Vision
              </h3>

              <div className="space-y-4">
                <p className="text-sm text-foreground/50 leading-[1.85]">
                  My career is built around the <span className="text-foreground/80 font-semibold">MERN stack</span> ecosystem. I specialize in designing structured backend components with Node.js/Express, mapping flexible collection models in MongoDB, and deploying intuitive frontends using React and Tailwind CSS.
                </p>
                <p className="text-sm text-foreground/50 leading-[1.85]">
                  I strongly believe in creating <span className="text-foreground/80 font-semibold">clean architectures</span>, optimizing database pipelines, and crafting beautiful micro-interactive experiences that improve user retention and drive product growth.
                </p>
              </div>

              {/* Inline tech tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                {['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS', 'Redux', 'REST APIs'].map(t => (
                  <span key={t}
                    className="px-3 py-1 rounded-full text-[10px] font-bold text-foreground/45 border border-foreground/8 transition-all duration-200 hover:border-foreground/20 hover:text-foreground/65"
                    style={{ background: 'rgba(var(--foreground),0.03)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Animated Stats ── */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map((stat, i) => <StatChip key={i} stat={stat} index={i} />)}
            </div>

            {/* ── Compact Highlights Grid ── */}
            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-3xl border border-foreground/6 p-5 flex items-start gap-4 bg-foreground/[0.02]">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-primary/10 border border-primary/20 text-primary flex-shrink-0">
                  <FaGraduationCap size={16} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black tracking-widest uppercase text-foreground/30 mb-1">Education</h4>
                  <p className="text-sm font-bold text-foreground/80 leading-snug">B.Tech in Computer Science & Design</p>
                  <p className="text-[10px] font-mono text-foreground/40 mt-0.5">MET Bhujbal Knowledge City · 3rd Year Student</p>
                </div>
              </div>
            </div>

          </motion.div>
        </div>



      </div>
    </section>
  );
}
