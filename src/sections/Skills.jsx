import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { usePortfolioData } from '../hooks/usePortfolioData';

/* ─── Category Theme Map ─────────────────────────────────────── */
const CAT = {
  Frontend: { color: 'rgb(var(--primary))', glow: 'rgb(var(--primary) / 0.15)', grad: ['rgb(var(--primary))','rgb(var(--primary-light))','rgb(var(--secondary))'] },
  Backend:  { color: 'rgb(var(--primary-light))', glow: 'rgb(var(--primary-light) / 0.15)', grad: ['rgb(var(--primary-light))','rgb(var(--secondary))','rgb(var(--secondary-light))'] },
  Database: { color: 'rgb(var(--secondary))', glow: 'rgb(var(--secondary) / 0.15)', grad: ['rgb(var(--secondary))','rgb(var(--secondary-light))','rgb(var(--primary))'] },
  Tools:    { color: 'rgb(var(--secondary-light))', glow: 'rgb(var(--secondary-light) / 0.15)', grad: ['rgb(var(--secondary-light))','rgb(var(--primary))','rgb(var(--primary-light))'] },
};
const DEFAULT_CAT = { color: 'rgb(var(--primary))', glow: 'rgb(var(--primary) / 0.15)', grad: ['rgb(var(--primary))','rgb(var(--primary-light))','rgb(var(--secondary))'] };

/* ─── SVG Circular Progress Ring ────────────────────────────── */
function CircleRing({ level, color, size = 88, stroke = 6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * (inView ? level : 0)) / 100;
  
  // Sanitize the color string to create a safe ID for SVGs without spaces or parentheses
  const gradId = `ring-${color.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <svg ref={ref} width={size} height={size} className="rotate-[-90deg]">
      {/* Track */}
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="rgba(var(--foreground),0.05)" strokeWidth={stroke} />
      {/* Progress */}
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        style={{ filter: `drop-shadow(0 0 6px ${color.includes('var') ? color : `${color}90`})` }}
      />
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Individual Skill Card ──────────────────────────────────── */
function SkillCard({ skill, catColor, index }) {
  const Icon = skill.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-3xl p-5 flex flex-col items-center gap-3 border cursor-default select-none transition-all duration-400 overflow-hidden group"
      style={{
        background: hovered ? `${catColor}12` : 'rgba(var(--foreground),0.02)',
        borderColor: hovered ? `${catColor}40` : 'rgba(var(--foreground),0.02)',
        transform: hovered ? 'translateY(-6px) scale(1.03)' : 'translateY(0) scale(1)',
        boxShadow: hovered ? `0 20px 50px rgba(0,0,0,0.4), 0 0 30px ${catColor}20` : '0 4px 20px rgba(0,0,0,0.15)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Glow spot behind icon */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full pointer-events-none transition-opacity duration-400"
        style={{
          background: `radial-gradient(circle, ${catColor}35, transparent)`,
          filter: 'blur(12px)',
          opacity: hovered ? 1 : 0,
        }} />

      {/* Ring + Icon stacked */}
      <div className="relative flex items-center justify-center">
        <CircleRing level={skill.level} color={catColor} size={80} stroke={5} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300"
            style={{
              background: `${catColor}18`,
              border: `1px solid ${catColor}30`,
              transform: hovered ? 'scale(1.15) rotate(6deg)' : 'scale(1) rotate(0deg)',
            }}>
            {Icon && <Icon size={18} style={{ color: skill.color || catColor }} />}
          </div>
        </div>
      </div>

      {/* Name + Level */}
      <div className="text-center">
        <p className="text-xs font-bold text-foreground/85 leading-tight">{skill.name}</p>
        <p className="text-[10px] font-mono mt-0.5 transition-colors duration-300"
          style={{ color: hovered ? catColor : 'rgba(var(--foreground),0.6)' }}>
          {skill.level}%
        </p>
      </div>

      {/* Bottom shimmer on hover */}
      <div className="absolute bottom-0 inset-x-0 h-px transition-opacity duration-400"
        style={{
          background: `linear-gradient(90deg, transparent, ${catColor}, transparent)`,
          opacity: hovered ? 1 : 0,
        }} />
    </motion.div>
  );
}

/* ─── Category Tab ───────────────────────────────────────────── */
function CatTab({ label, isActive, theme, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-xs font-bold tracking-wide transition-all duration-300"
      style={{
        color: isActive ? '#fff' : 'rgba(var(--foreground),0.65)',
        background: isActive 
          ? (theme.color.includes('var') ? theme.color.replace(')', ' / 0.18)') : `${theme.color}18`)
          : 'rgba(var(--foreground),0.03)',
        border: `1px solid ${isActive 
          ? (theme.color.includes('var') ? theme.color.replace(')', ' / 0.40)') : theme.color + '40') 
          : 'rgba(var(--foreground),0.05)'}`,
        boxShadow: isActive ? `0 0 20px ${theme.glow}` : 'none',
      }}
    >
      {isActive && (
        <motion.div
          layoutId="activeTabBg"
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${theme.grad[0].includes('var') ? theme.grad[0].replace(')', ' / 0.20)') : theme.grad[0] + '20'}, ${theme.grad[2].includes('var') ? theme.grad[2].replace(')', ' / 0.15)') : theme.grad[2] + '15'})`,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
        />
      )}
      <span className="relative z-10">{label}</span>
      <span className="relative z-10 px-1.5 py-0.5 rounded-full text-[9px] font-black"
        style={{
          background: isActive 
            ? (theme.color.includes('var') ? theme.color.replace(')', ' / 0.25)') : `${theme.color}25`) 
            : 'rgba(var(--foreground),0.08)',
          color: isActive ? theme.color : 'rgba(var(--foreground),0.55)',
        }}>
        {count}
      </span>
    </button>
  );
}

/* ─── Marquee Row ────────────────────────────────────────────── */
function MarqueeRow({ items, reverse = false, speed = 25 }) {
  const repeated = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden relative py-2">
      <div
        className="flex gap-4 w-max"
        style={{
          animation: `marquee ${speed}s linear infinite ${reverse ? 'reverse' : ''}`,
        }}
      >
        {repeated.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full whitespace-nowrap flex-shrink-0 transition-all duration-300 hover:scale-105"
              style={{
                background: 'rgba(var(--foreground),0.03)',
                border: '1px solid rgba(var(--foreground),0.07)',
                color: 'rgba(var(--foreground),0.45)',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              {Icon && <Icon size={13} style={{ color: s.color }} />}
              {s.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main Section ───────────────────────────────────────────── */
export default function Skills() {
  const { skills } = usePortfolioData();
  const [activeCategory, setActiveCategory] = useState('All');

  const allCategories = ['All', ...skills.map(s => s.category)];

  const filteredGroups = activeCategory === 'All'
    ? skills
    : skills.filter(s => s.category === activeCategory);

  const allItems = skills.flatMap(g => g.items.map(i => ({
    name: i.name, icon: i.icon, color: i.color
  })));
  const half = Math.ceil(allItems.length / 2);
  const row1 = allItems.slice(0, half);
  const row2 = allItems.slice(half);

  return (
    <section id="skills" className="py-16 relative overflow-hidden bg-background">

      {/* ── Ambient Orbs ── */}
      <div className="absolute top-[-5%] left-[-5%] w-[700px] h-[700px] rounded-full pointer-events-none opacity-[0.06] transition-all duration-1000"
        style={{ background: 'radial-gradient(circle, rgb(var(--primary)), transparent 65%)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full pointer-events-none opacity-[0.06] transition-all duration-1000"
        style={{ background: 'radial-gradient(circle, rgb(var(--secondary)), transparent 65%)', filter: 'blur(80px)' }} />

      {/* ── Grid overlay ── */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.025] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <span className="tag-badge mb-5 inline-flex">Technical Arsenal</span>
          <h2 className="text-5xl sm:text-[5.5rem] font-black tracking-[-0.04em] leading-none text-foreground mt-4">
            My{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-zinc-400" style={{ paddingBottom: '0.1em' }}>
              Skillset
            </span>
          </h2>
          <p className="text-foreground/35 text-base mt-5 max-w-md mx-auto font-normal leading-relaxed">
            Technologies I use daily to build fast, scalable, beautiful web products.
          </p>
        </motion.div>

        {/* ── Category Switcher ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2.5 mb-14"
        >
          {allCategories.map(cat => {
            const theme = cat === 'All'
              ? { color: 'rgb(var(--foreground))', glow: 'rgba(var(--foreground),0.05)', grad: ['rgb(var(--foreground))','#cccccc','#999999'] }
              : (CAT[cat] || DEFAULT_CAT);
            const count = cat === 'All'
              ? skills.reduce((a, g) => a + g.items.length, 0)
              : (skills.find(g => g.category === cat)?.items.length || 0);
            return (
              <CatTab
                key={cat}
                label={cat}
                isActive={activeCategory === cat}
                theme={theme}
                count={count}
                onClick={() => setActiveCategory(cat)}
              />
            );
          })}
        </motion.div>

        {/* ── Skill Cards Grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {filteredGroups.map((group) => {
              const theme = CAT[group.category] || DEFAULT_CAT;
              return (
                <div key={group.category} className="mb-10">
                  {/* Group label row */}
                  {activeCategory === 'All' && (
                    <div className="flex items-center gap-3 mb-6">
                      <span className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: theme.color, boxShadow: `0 0 10px ${theme.color}` }} />
                      <h3 className="text-xs font-black tracking-[0.2em] uppercase"
                        style={{ color: theme.color }}>
                        {group.category}
                      </h3>
                      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${theme.color}30, transparent)` }} />
                      <span className="text-[10px] font-mono text-foreground/20">{group.items.length} skills</span>
                    </div>
                  )}

                  {/* Cards */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                    {group.items.map((skill, si) => (
                      <SkillCard
                        key={si}
                        skill={skill}
                        catColor={theme.color}
                        index={si}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* ── Stats strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-16"
        >
          {[
            { val: skills.reduce((a,g) => a + g.items.length, 0), label: 'Technologies', color: 'rgb(var(--primary))' },
            { val: skills.length, label: 'Categories',    color: 'rgb(var(--primary-light))' },
            { val: 'Intern', label: 'Experience Level', color: 'rgb(var(--secondary))' },
            { val: '10+', label: 'Projects Built', color: 'rgb(var(--secondary-light))' },
          ].map(({ val, label, color }, i) => (
            <div key={i}
              className="relative rounded-3xl border border-foreground/6 p-5 text-center overflow-hidden transition-all duration-400 hover:-translate-y-1 group"
              style={{ background: 'rgba(var(--foreground), 0.02)' }}
            >
              <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full opacity-25 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${color}, transparent)`, filter: 'blur(10px)' }} />
              <p className="text-3xl font-black relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-foreground to-zinc-400">
                {val}
              </p>
              <p className="text-[11px] font-semibold text-foreground/35 mt-1.5 tracking-wide relative z-10">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* ── Dual Marquee ── */}
        <div className="relative overflow-hidden space-y-3">
          {/* Edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, rgb(var(--background)), transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(-90deg, rgb(var(--background)), transparent)' }} />

          {row1.length > 0 && <MarqueeRow items={row1} speed={28} />}
          {row2.length > 0 && <MarqueeRow items={row2} reverse speed={22} />}
        </div>
      </div>
    </section>
  );
}
