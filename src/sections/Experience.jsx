import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCode, FaBriefcase, FaCertificate, FaTrophy, FaRoute, FaTimes, FaPrint, FaExternalLinkAlt } from 'react-icons/fa';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { base64ToBlobUrl } from '../utils/utils';

const TYPE_CONFIG = {
  journey:      { icon: FaRoute,       color: 'rgb(var(--foreground))', bg: 'rgba(var(--foreground),0.03)',  border: 'rgba(var(--foreground),0.1)',  label: 'Journey'       },
  freelance:    { icon: FaCode,        color: 'rgb(var(--primary))', bg: 'rgb(var(--primary) / 0.03)',  border: 'rgb(var(--primary) / 0.15)',  label: 'Freelance'     },
  internship:   { icon: FaBriefcase,   color: 'rgb(var(--secondary))', bg: 'rgb(var(--secondary) / 0.03)',  border: 'rgb(var(--secondary) / 0.15)',  label: 'Internship'    },
  certification:{ icon: FaCertificate, color: 'rgb(var(--primary-light))', bg: 'rgb(var(--primary-light) / 0.03)',  border: 'rgb(var(--primary-light) / 0.15)',  label: 'Training'      },
  achievement:  { icon: FaTrophy,      color: 'rgb(var(--foreground))', bg: 'rgba(var(--foreground),0.03)', border: 'rgba(var(--foreground),0.1)', label: 'Achievement'   },
};

export default function Experience() {
  const { experience } = usePortfolioData();
  const [activeCert, setActiveCert] = useState(null);

  return (
    <section id="experience" className="py-16 relative overflow-hidden bg-background">
      {/* Ambient blobs */}
      <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.06] pointer-events-none transition-all duration-1000 animate-pulse"
        style={{ background: 'radial-gradient(circle, rgb(var(--primary)), transparent 70%)', filter: 'blur(100px)' }} />
      <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] rounded-full opacity-[0.06] pointer-events-none transition-all duration-1000 animate-pulse"
        style={{ background: 'radial-gradient(circle, rgb(var(--secondary)), transparent 70%)', filter: 'blur(90px)' }} />

      <div className="max-w-4xl mx-auto px-6 relative z-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <span className="tag-badge mb-5 inline-flex">Career Path</span>
          <h2 className="text-4xl sm:text-6xl font-black tracking-[-0.03em] text-foreground mt-4">
            My{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-zinc-400">Experience</span>
          </h2>
          <p className="text-foreground/40 text-base mt-4 max-w-md mx-auto">
            My professional journey, internships, and certifications.
          </p>
        </motion.div>

        {/* ── Timeline ── */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px sm:-translate-x-1/2 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, transparent, rgba(var(--foreground),0.15) 10%, rgba(var(--foreground),0.15) 90%, transparent)' }} />

          <div className="space-y-12">
            {experience.map((item, i) => {
              const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.journey;
              const Icon = cfg.icon;
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 }}
                  className={`relative flex items-start gap-6 sm:gap-0 ${
                    isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                >
                  {/* Card (takes up ~half the space on desktop) */}
                  <div className={`flex-1 sm:max-w-[calc(50%-2.5rem)] pl-14 sm:pl-0 ${isLeft ? 'sm:pr-10' : 'sm:pl-10'}`}>
                    <div className="rounded-3xl border p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-400"
                      style={{
                        background: cfg.bg,
                        borderColor: cfg.border,
                        boxShadow: `0 4px 30px ${cfg.color.includes('var') ? cfg.color.replace(')', ' / 0.08)') : `${cfg.color}08`}`
                      }}>

                      {/* Background icon watermark */}
                      <div className="absolute -bottom-3 -right-3 opacity-[0.06] pointer-events-none">
                        <Icon size={64} style={{ color: cfg.color }} />
                      </div>

                      {/* Type badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-[0.12em] uppercase"
                          style={{ 
                            background: cfg.color.includes('var') ? cfg.color.replace(')', ' / 0.20)') : `${cfg.color}20`, 
                            color: cfg.color, 
                            border: `1px solid ${cfg.color.includes('var') ? cfg.color.replace(')', ' / 0.30)') : `${cfg.color}30`}` 
                          }}>
                          {cfg.label}
                        </span>
                        <span className="text-[10px] font-mono text-foreground/30 ml-auto">{item.date}</span>
                      </div>

                      <h3 className="text-sm font-bold text-foreground mb-1 leading-tight">{item.title}</h3>
                      <p className="text-[11px] font-mono mb-3" style={{ color: cfg.color }}>{item.subtitle}</p>
                      <p className="text-xs text-foreground/45 leading-relaxed">{item.description}</p>

                      {/* Image Preview */}
                      {item.image && (
                        <div 
                          className="mt-4 rounded-2xl overflow-hidden border border-foreground/10 bg-black/20 max-h-48 cursor-zoom-in group-hover:border-foreground/20 transition-all duration-300 relative group/img shadow-md hover:shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.file) {
                              const docUrl = item.file.startsWith('data:') 
                                ? base64ToBlobUrl(item.file, 'application/pdf') 
                                : item.file;
                              setActiveCert({ file: docUrl, title: item.title });
                            } else {
                              setActiveCert(item.image ? { image: item.image, title: item.title } : item.certificateInfo);
                            }
                          }}
                        >
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover max-h-48 group-hover/img:scale-[1.02] transition-transform duration-500" />
                          <div className="absolute inset-0 bg-black/45 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="text-white text-xs font-bold bg-black/60 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10 backdrop-blur-sm">
                              🔍 Click to View
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Certificate Stats badges if present */}
                      {item.certificateInfo && item.certificateInfo.stats && (
                        <div className="mt-4 pt-3 border-t border-foreground/10 flex flex-wrap gap-x-4 gap-y-2">
                          {item.certificateInfo.stats.map((s, idx) => (
                            <div key={idx} className="flex flex-col">
                              <span className="text-[9px] uppercase tracking-wider text-foreground/30 font-mono leading-none">{s.label}</span>
                              <span className="text-xs font-bold text-foreground mt-0.5" style={{ color: cfg.color }}>{s.value}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Actions Button Group */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {(item.image || item.certificateInfo || item.file) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (item.file) {
                                const docUrl = item.file.startsWith('data:') 
                                  ? base64ToBlobUrl(item.file, 'application/pdf') 
                                  : item.file;
                                setActiveCert({ file: docUrl, title: item.title });
                              } else {
                                setActiveCert(item.image ? { image: item.image, title: item.title } : item.certificateInfo);
                              }
                            }}
                            className="inline-flex items-center gap-1.5 text-[9px] font-bold tracking-wider uppercase bg-foreground text-background hover:opacity-90 px-3.5 py-1.5 rounded-xl transition-all duration-300 active:scale-95 cursor-pointer"
                          >
                            <FaCertificate size={10} />
                            {item.type === 'certification' ? 'View Certificate' : 'View Document'}
                          </button>
                        )}

                        {item.file && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const docUrl = item.file.startsWith('data:') 
                                ? base64ToBlobUrl(item.file, 'application/pdf') 
                                : item.file;
                              window.open(docUrl, '_blank');
                            }}
                            className="inline-flex items-center gap-1.5 text-[9px] font-bold tracking-wider uppercase bg-violet-600 hover:bg-violet-500 text-white px-3.5 py-1.5 rounded-xl transition-all duration-300 active:scale-95 cursor-pointer"
                          >
                            <FaPrint size={10} />
                            {item.type === 'certification' ? 'Open PDF' : 'Open File'}
                          </button>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* Center dot / icon */}
                  <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 mt-6 sm:mt-6 flex-shrink-0 z-10">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: cfg.bg,
                        border: `2px solid ${cfg.border}`,
                        boxShadow: `0 0 20px ${cfg.color.includes('var') ? cfg.color.replace(')', ' / 0.30)') : `${cfg.color}30`}`
                      }}>
                      <Icon size={16} style={{ color: cfg.color }} />
                    </div>
                  </div>

                  {/* Empty spacer for alternating layout on desktop */}
                  <div className="hidden sm:block flex-1" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Certificate Modal ── */}
      <AnimatePresence>
        {activeCert && (
          <>
            {/* Print style injection and watermarking animations */}
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes spin-slow {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              .animate-spin-slow {
                animation: spin-slow 25s linear infinite;
              }
              @media print {
                body {
                  background: white !important;
                  color: black !important;
                }
                #root, header, footer, nav, button, .no-print, .ambient-blobs {
                  display: none !important;
                }
                .print-container {
                  display: block !important;
                  position: fixed !important;
                  inset: 0 !important;
                  width: 100vw !important;
                  height: 100vh !important;
                  z-index: 9999999 !important;
                  background: white !important;
                  padding: 2rem !important;
                  border: none !important;
                  box-shadow: none !important;
                }
                .certificate-card {
                  box-shadow: none !important;
                  width: 100% !important;
                  height: 100% !important;
                }
                .jainemo-border {
                  border: 8px double #78716c !important;
                  background: #fdfdfc !important;
                }
                .sunanda-border {
                  border: 8px double #64748b !important;
                  background: #f8fafc !important;
                }
                .wns-border {
                  border: 8px double #d97706 !important;
                  background: #fffdfa !important;
                }
              }
            ` }} />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto no-print">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveCert(null)}
                className="absolute inset-0 cursor-pointer"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden z-10 print-container"
              >
                {/* Header Action Bar */}
                <div className="flex items-center justify-between px-6 py-4 bg-stone-950/80 border-b border-stone-850 no-print">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    <span className="text-xs font-mono text-stone-400">Verified Credentials</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold tracking-wide transition-colors cursor-pointer"
                    >
                      <FaPrint size={12} />
                      Print / Save PDF
                    </button>
                    <button
                      onClick={() => setActiveCert(null)}
                      className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors cursor-pointer"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                </div>

                {/* Certificate Print Area */}
                <div id="certificate-print-area" className="p-6 md:p-12 bg-neutral-900 flex items-center justify-center w-full">
                  
                  {/* ────────────────── CUSTOM UPLOADED FILE (PDF/Doc) ────────────────── */}
                  {activeCert.file && (() => {
                    const isExternal = typeof activeCert.file === 'string' && (activeCert.file.startsWith('http://') || activeCert.file.startsWith('https://'));
                    return isExternal ? (
                      <div className="certificate-card w-full h-[65vh] bg-stone-950 p-1 rounded-3xl border border-stone-800 shadow-2xl max-w-3xl mx-auto relative overflow-hidden flex items-center justify-center">
                        <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
                          <span className="text-5xl">📄</span>
                          <h3 className="font-bold text-white text-base">External Document Linked</h3>
                          <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
                            This document is hosted externally and cannot be previewed inline because providers like Google Docs restrict embedding.
                          </p>
                          <a
                            href={activeCert.file}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/40 text-violet-300 text-sm font-bold rounded-xl transition-colors"
                          >
                            <FaExternalLinkAlt size={12} /> Open in New Tab
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="certificate-card w-full h-[65vh] bg-stone-950 p-1 rounded-3xl border border-stone-800 shadow-2xl max-w-3xl mx-auto relative overflow-hidden">
                        <iframe 
                          src={activeCert.file} 
                          title={activeCert.title || "Certificate Document"} 
                          className="w-full h-full rounded-2xl border-none"
                        />
                      </div>
                    );
                  })()}

                  {/* ────────────────── CUSTOM UPLOADED IMAGE ────────────────── */}
                  {activeCert.image && (
                    <div className="certificate-card w-full flex justify-center items-center bg-stone-950 p-4 rounded-3xl border border-stone-800 shadow-2xl max-w-2xl mx-auto relative overflow-hidden select-none">
                      <img src={activeCert.image} alt={activeCert.title || "Certificate / Document"} className="w-full h-auto object-contain rounded-2xl max-h-[65vh]" />
                    </div>
                  )}

                  {/* ────────────────── TEMPLATE: JAINEMO ────────────────── */}
                  {activeCert.template === 'jainemo' && (
                    <div className="certificate-card jainemo-border w-full bg-[#fdfdfc] border-[10px] border-double border-stone-300 p-6 md:p-12 text-stone-800 rounded-2xl shadow-2xl relative select-none">
                      
                      {/* Watermark Logo Icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
                        <FaCertificate size={350} className="text-stone-900 animate-spin-slow" />
                      </div>

                      {/* Certificate Borders & Accents */}
                      <div className="absolute top-4 left-4 right-4 bottom-4 border border-stone-200 pointer-events-none" />

                      {/* Header */}
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center border-b border-stone-200 pb-6 mb-8 gap-4">
                        <div>
                          <h4 className="text-xl md:text-2xl font-black tracking-wider text-stone-900 font-display">
                            JAINEMO PRIVATE LIMITED
                          </h4>
                          <p className="text-xs text-stone-500 mt-1 font-mono">
                            Write to us at: <a href="mailto:hr@apnikaksha.net" className="text-blue-600 underline font-semibold">hr@apnikaksha.net</a>
                          </p>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-xs text-stone-500 font-mono">Date: <span className="font-semibold text-stone-800">7th May 2026</span></p>
                        </div>
                      </div>

                      {/* Title */}
                      <div className="text-center my-8">
                        <h2 className="text-xl md:text-2xl font-extrabold tracking-wide text-stone-900 border-b-2 border-stone-800 inline-block pb-1 font-display">
                          INTERNSHIP COMPLETION CERTIFICATE
                        </h2>
                      </div>

                      {/* Certificate Body */}
                      <div className="space-y-6 text-sm leading-relaxed text-stone-700 font-serif">
                        <p>
                          This is to certify that <span className="font-bold text-stone-900 text-lg decoration-stone-400 decoration-wavy underline underline-offset-4">Mr. Arun sanap</span> completed his internship with <span className="font-semibold text-stone-900">“Jainemo Private Limited”</span> as a <span className="font-semibold text-stone-900">MERN Full Stack Teaching Assistant Intern</span> (Part-time and work from home), starting from <span className="font-semibold text-stone-900">7th December 2025 to 21st April 2026</span>.
                        </p>
                        <p>
                          He has completed his internship under the guidance of <span className="font-semibold text-stone-850">Ms. Khyati</span>.
                        </p>
                      </div>

                      {/* Stats Section */}
                      <div className="my-8 bg-stone-50 border border-stone-150 rounded-2xl p-4 grid grid-cols-3 gap-2 text-center">
                        {activeCert.stats.map((s, idx) => (
                          <div key={idx} className="flex flex-col items-center">
                            <span className="text-[10px] text-stone-450 font-mono uppercase tracking-wider">{s.label}</span>
                            <span className="text-lg md:text-2xl font-black text-stone-900 mt-1">{s.value}</span>
                          </div>
                        ))}
                      </div>

                      <p className="text-sm text-stone-700 font-serif mb-12">
                        We wish him good luck and success for his future endeavors.
                      </p>

                      {/* Footer Signature */}
                      <div className="flex justify-between items-end mt-12">
                        <div className="text-left">
                          <p className="text-xs text-stone-400 font-mono">Website</p>
                          <a
                            href={activeCert.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-semibold text-orange-600 hover:underline flex items-center gap-1 mt-1 font-mono"
                          >
                            apnacollege.in
                            <FaExternalLinkAlt size={8} />
                          </a>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-stone-500 font-mono mb-2">Best regards,</p>
                          <div
                            className="text-3xl text-blue-700 my-1 pr-4"
                            style={{ fontFamily: "'Dancing Script', cursive", transform: 'rotate(-4deg)' }}
                          >
                            {activeCert.signatureName}
                          </div>
                          <div className="border-t border-stone-250 pt-1 mt-1">
                            <p className="text-xs font-bold text-stone-800 leading-none">{activeCert.signatureRole.toUpperCase()}</p>
                            <p className="text-[10px] text-stone-400 font-bold uppercase mt-1 leading-none">JAINEMO PRIVATE LIMITED</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* ────────────────── TEMPLATE: SUNANDA ────────────────── */}
                  {activeCert.template === 'sunanda' && (
                    <div className="certificate-card sunanda-border w-full bg-[#f8fafc] border-[10px] border-double border-slate-350 p-6 md:p-12 text-slate-800 rounded-2xl shadow-2xl relative select-none">
                      
                      {/* Watermark Logo Icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
                        <FaBriefcase size={350} className="text-slate-900" />
                      </div>

                      {/* Certificate Borders & Accents */}
                      <div className="absolute top-4 left-4 right-4 bottom-4 border border-slate-200 pointer-events-none" />

                      {/* Header */}
                      <div className="flex flex-col items-center mb-6">
                        <div className="w-14 h-14 rounded-full border-4 border-slate-400 bg-white flex items-center justify-center text-slate-800 shadow-md font-bold text-[8px] text-center p-1 leading-tight font-display mb-2">
                          Sunanda Infotech
                        </div>
                        <span className="text-[9px] tracking-widest text-slate-400 font-mono uppercase font-bold">IT Consultancy & Services</span>
                      </div>

                      {/* Title */}
                      <div className="text-center my-6">
                        <h4 className="text-[10px] tracking-[0.2em] font-mono text-slate-400 uppercase">This Certificate is Proudly Presented To</h4>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 my-4 font-display" style={{ fontFamily: "'Dancing Script', cursive" }}>
                          {activeCert.recipient}
                        </h2>
                        <div className="w-12 h-0.5 bg-slate-300 mx-auto my-3" />
                        <p className="text-sm md:text-base leading-relaxed text-slate-650 max-w-xl mx-auto font-serif">
                          A student of <span className="font-semibold text-slate-800">{activeCert.college}</span> who has successfully completed <span className="font-semibold text-slate-900">{activeCert.duration}</span>.
                        </p>
                      </div>

                      {/* Footer Signatures */}
                      <div className="flex justify-between items-end mt-12 pt-6 border-t border-slate-100">
                        <div className="text-left">
                          {/* Coordinator Signature */}
                          <div className="text-2xl text-blue-700 my-1 font-semibold" style={{ fontFamily: "'Dancing Script', cursive", transform: 'rotate(-2deg)' }}>
                            G. Mandwade
                          </div>
                          <div className="border-t border-slate-200 pt-1">
                            <p className="text-xs font-bold text-slate-800 leading-none">{activeCert.signature1.name}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 leading-none">{activeCert.signature1.role}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          {/* Director Signature */}
                          <div className="text-2xl text-blue-700 my-1 font-semibold" style={{ fontFamily: "'Dancing Script', cursive", transform: 'rotate(-3deg)' }}>
                            S. Mandwade
                          </div>
                          <div className="border-t border-slate-200 pt-1">
                            <p className="text-xs font-bold text-slate-800 leading-none">{activeCert.signature2.name}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 leading-none">{activeCert.signature2.role}</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* ────────────────── TEMPLATE: WNS ────────────────── */}
                  {activeCert.template === 'wns' && (
                    <div className="certificate-card wns-border w-full bg-[#fffdfa] border-[10px] border-double border-amber-300 p-6 md:p-12 text-stone-850 rounded-2xl shadow-2xl relative select-none">
                      
                      {/* Watermark Logo Icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
                        <FaTrophy size={350} className="text-amber-900" />
                      </div>

                      {/* Certificate Borders & Accents */}
                      <div className="absolute top-4 left-4 right-4 bottom-4 border border-amber-100 pointer-events-none" />

                      {/* Header Logos */}
                      <div className="flex justify-between items-center border-b border-amber-100 pb-4 mb-6">
                        <div className="text-[10px] font-black text-stone-850 leading-tight">
                          WNS CARES <br />
                          <span className="text-[8px] text-stone-400 font-normal tracking-wide">FOUNDATION</span>
                        </div>
                        <div className="px-2.5 py-0.5 rounded bg-amber-50 text-[9px] font-bold font-mono text-amber-800 border border-amber-200/50">
                          MakeMyCareer@WCF
                        </div>
                        <div className="text-right text-[10px] font-black text-stone-850 leading-tight">
                          MET BHUJBAL <br />
                          <span className="text-[8px] text-stone-400 font-normal tracking-wide">KNOWLEDGE CITY</span>
                        </div>
                      </div>

                      {/* Title & Body */}
                      <div className="text-center my-6">
                        <h2 className="text-2xl md:text-3xl font-black text-amber-800 tracking-wide font-display">
                          Certificate Of Completion
                        </h2>
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-2 font-mono">This certificate is awarded to</p>
                        
                        <h3 className="text-2xl md:text-3xl font-extrabold text-stone-900 my-4 border-b border-stone-200 inline-block px-8 pb-1 font-display">
                          {activeCert.recipient}
                        </h3>

                        <p className="text-sm md:text-base leading-relaxed text-stone-655 max-w-xl mx-auto font-serif">
                          on successfully completing the <span className="font-semibold text-stone-800">{activeCert.program}</span> conducted by WNS Global Services from <span className="font-semibold text-stone-800">{activeCert.dateRange}</span>.
                        </p>
                      </div>

                      {/* Footer Signatures */}
                      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mt-12 gap-6 pt-6 border-t border-stone-150">
                        <div className="text-left w-full sm:w-auto">
                          {/* CEO Signature */}
                          <div className="text-2xl text-blue-700 my-1 font-semibold" style={{ fontFamily: "'Dancing Script', cursive", transform: 'rotate(-1deg)' }}>
                            K. R. Murugesh
                          </div>
                          <div className="border-t border-stone-250 pt-1">
                            <p className="text-xs font-bold text-stone-800 leading-none">{activeCert.signature1.name}</p>
                            <p className="text-[9px] text-stone-400 font-bold uppercase mt-1 leading-none">{activeCert.signature1.role}</p>
                          </div>
                        </div>

                        <div className="text-right w-full sm:w-auto sm:text-right">
                          {/* Mentor Signature */}
                          <div className="text-2xl text-blue-700 my-1 font-semibold" style={{ fontFamily: "'Dancing Script', cursive", transform: 'rotate(-3deg)' }}>
                            S. Murugesh
                          </div>
                          <div className="border-t border-stone-250 pt-1">
                            <p className="text-xs font-bold text-stone-850 leading-none">{activeCert.signature2.name}</p>
                            <p className="text-[9px] text-stone-400 font-bold uppercase mt-1 leading-none">{activeCert.signature2.role}</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
