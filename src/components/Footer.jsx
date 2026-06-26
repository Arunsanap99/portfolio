import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { FaHeart, FaGithub, FaLinkedin, FaTwitter, FaArrowRight, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  const { developerInfo } = usePortfolioData();

  return (
    <footer className="relative bg-background overflow-hidden border-t border-foreground/5 pt-32 pb-10">
      {/* Premium Ambient Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, rgb(var(--foreground)), transparent 70%)', filter: 'blur(100px)' }} />
        <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.02]"
          style={{ background: 'radial-gradient(circle, rgb(var(--foreground)), transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Call to Action Section */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-16 mb-24">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-6"
            >
              Let's create something <br />
              <span className="text-gradient-primary">extraordinary.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-foreground/60 text-lg md:text-xl max-w-md mb-10 font-medium"
            >
              Open for freelance opportunities, collaborations, or just a friendly chat about technology and design.
            </motion.p>
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              href={`mailto:${developerInfo?.email}`}
              className="group inline-flex items-center gap-4 px-8 py-4 rounded-full font-bold text-sm tracking-wide transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'rgb(var(--foreground))',
                color: 'rgb(var(--background))',
                boxShadow: '0 20px 40px -10px rgba(var(--foreground), 0.3)'
              }}
            >
              <FaEnvelope size={14} />
              GET IN TOUCH
              <FaArrowRight size={12} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </motion.a>
          </div>

          {/* Connect Links */}
          <div className="flex flex-col gap-6 w-full md:w-auto mt-4 md:mt-0">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/40">Connect</span>
            <div className="flex flex-col gap-4">
              <a href={developerInfo?.socials?.linkedin} target="_blank" rel="noreferrer" className="text-2xl md:text-3xl font-medium text-foreground/70 hover:text-foreground transition-colors flex items-center gap-3 group">
                LinkedIn
                <FaArrowRight size={14} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-foreground/40" />
              </a>
              <a href={developerInfo?.socials?.github} target="_blank" rel="noreferrer" className="text-2xl md:text-3xl font-medium text-foreground/70 hover:text-foreground transition-colors flex items-center gap-3 group">
                GitHub
                <FaArrowRight size={14} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-foreground/40" />
              </a>
              <a href={developerInfo?.socials?.instagram || "https://www.instagram.com/arunn_.44/"} target="_blank" rel="noreferrer" className="text-2xl md:text-3xl font-medium text-foreground/70 hover:text-foreground transition-colors flex items-center gap-3 group">
                Instagram
                <FaArrowRight size={14} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-foreground/40" />
              </a>
              {developerInfo?.socials?.twitter && (
                <a href={developerInfo?.socials?.twitter} target="_blank" rel="noreferrer" className="text-2xl md:text-3xl font-medium text-foreground/70 hover:text-foreground transition-colors flex items-center gap-3 group">
                  Twitter
                  <FaArrowRight size={14} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-foreground/40" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 border-t border-foreground/5 pt-8">
          <div className="flex items-center gap-2 text-sm text-foreground/50 font-medium">
            <span>&copy; {new Date().getFullYear()} {developerInfo.name}. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-foreground/40 font-medium">
            <span>Designed & Crafted with</span>
            <FaHeart className="text-red-500/80 mx-1" size={12} />
            <span>by {developerInfo.name.split(' ')[0]}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
