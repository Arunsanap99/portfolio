import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaPaperPlane, FaUser, FaCommentDots, FaCheckCircle, FaSpinner, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaInstagram, FaTwitter } from 'react-icons/fa';
import { usePortfolioData } from '../hooks/usePortfolioData';
import emailjs from '@emailjs/browser';

const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show:  { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const contactItems = [
  { icon: FaEnvelope, label: 'Email', key: 'email',   href: v => `mailto:${v}`, color: 'rgb(var(--foreground))' },
  { icon: FaPhone,   label: 'Phone', key: 'phone',   href: v => `tel:${v}`,    color: 'rgb(var(--primary-light))' },
  { icon: FaMapMarkerAlt, label: 'Location', key: 'address', href: () => '#', color: 'rgb(var(--secondary))' },
];

const socials = [
  { icon: FaGithub,    key: 'github',    label: 'GitHub',    color: 'rgb(var(--foreground))' },
  { icon: FaLinkedin,  key: 'linkedin',  label: 'LinkedIn',  color: 'rgb(var(--primary-light))' },
  { icon: FaInstagram, key: 'instagram', label: 'Instagram', color: 'rgb(var(--secondary))' },
  { icon: FaTwitter,   key: 'twitter',   label: 'Twitter',   color: 'rgb(var(--secondary-light))' },
];

export default function Contact() {
  const { developerInfo } = usePortfolioData();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [focused, setFocused] = useState(null);

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setStatus('submitting');

    const config = developerInfo.emailjs;
    if (config && config.serviceId && config.templateId && config.publicKey) {
      try {
        await emailjs.send(
          config.serviceId,
          config.templateId,
          {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject || 'Portfolio Inquiry',
            message: formData.message,
            to_email: developerInfo.email || 'as3085034@gmail.com'
          },
          config.publicKey
        );
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 3500);
      } catch (err) {
        console.error('EmailJS Send Error:', err);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 4000);
      }
    } else {
      // Mock fallback: if keys are not configured yet, succeed as a mockup
      setTimeout(() => {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 3500);
      }, 1200);
    }
  };

  return (
    <section id="contact" className="py-16 relative overflow-hidden bg-background">
      {/* Ambient blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[550px] h-[550px] rounded-full opacity-[0.06] pointer-events-none transition-all duration-1000"
        style={{ background: 'radial-gradient(circle, rgb(var(--primary)), transparent 70%)', filter: 'blur(90px)' }} />
      <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] rounded-full opacity-[0.06] pointer-events-none transition-all duration-1000"
        style={{ background: 'radial-gradient(circle, rgb(var(--secondary)), transparent 70%)', filter: 'blur(100px)' }} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="tag-badge mb-5 inline-flex">Let's Connect</span>
          <h2 className="text-4xl sm:text-6xl font-black tracking-[-0.03em] text-foreground mt-4">
            Start a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-zinc-400">Conversation</span>
          </h2>
          <p className="text-foreground/40 text-base mt-4 max-w-md mx-auto leading-relaxed">
            Have a project in mind or just want to chat? I'm always open to new opportunities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Left: Info Cards ── */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            {/* Contact Info Card */}
            <motion.div variants={itemAnim}
              className="rounded-3xl p-6 border border-foreground/8 flex-1"
              style={{ background: 'rgba(var(--foreground),0.02)', backdropFilter: 'blur(20px)' }}
            >
              <p className="text-xs font-bold tracking-[0.15em] uppercase text-foreground/30 mb-5">Contact Info</p>
              <div className="space-y-5">
                {contactItems.map(({ icon: Icon, label, key, href, color }) => {
                  const val = developerInfo[key];
                  if (!val) return null;
                  return (
                    <a key={key} href={href(val)} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                        style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                        <Icon size={14} style={{ color }} />
                      </div>
                      <div>
                        <p className="text-[10px] font-mono text-foreground/25 uppercase tracking-widest mb-0.5">{label}</p>
                        <p className="text-sm font-semibold text-foreground/70 group-hover:text-foreground/90 transition-colors duration-300 break-all">{val}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div variants={itemAnim}
              className="rounded-3xl p-6 border border-foreground/[0.03]"
              style={{ background: 'rgba(var(--foreground),0.02)', backdropFilter: 'blur(20px)' }}
            >
              <p className="text-xs font-bold tracking-[0.15em] uppercase text-foreground/30 mb-4">Social</p>
              <div className="grid grid-cols-2 gap-3">
                {socials.map(({ icon: Icon, key, label, color }) => {
                  let href = developerInfo.socials?.[key];
                  if (key === 'instagram' && !href) {
                    href = "https://www.instagram.com/arunn_.44/";
                  }
                  return (
                    <a key={key} href={href || '#'} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2.5 p-3 rounded-2xl border border-foreground/[0.03] hover:border-primary/40 text-foreground/40 hover:text-foreground/80 transition-all duration-300 hover:-translate-y-0.5"
                      style={{ background: 'rgba(var(--foreground),0.02)' }}
                    >
                      <Icon size={14} style={{ color }} />
                      <span className="text-xs font-semibold">{label}</span>
                    </a>
                  );
                })}
              </div>
            </motion.div>

            {/* Availability tag */}
            <motion.div variants={itemAnim}
              className="rounded-3xl p-5 border border-foreground/[0.03] text-center"
              style={{ background: 'rgba(var(--foreground),0.02)' }}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="text-foreground text-sm font-bold">Available for Work</span>
              </div>
              <p className="text-foreground/40 text-xs mt-1">Open to freelance & full-time</p>
            </motion.div>
          </motion.div>

          {/* ── Right: Contact Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="lg:col-span-3"
          >
            <div className="rounded-3xl border border-foreground/8 p-8 h-full relative overflow-hidden"
              style={{ background: 'rgba(var(--foreground),0.02)', backdropFilter: 'blur(20px)' }}>

              {/* Corner accent */}
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-[0.08] pointer-events-none transition-all duration-1000"
                style={{ background: 'radial-gradient(circle, rgb(var(--primary)), transparent)', filter: 'blur(30px)' }} />

              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="h-full min-h-[400px] flex flex-col items-center justify-center text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(var(--foreground),0.05)', border: '1px solid rgba(var(--foreground),0.1)' }}>
                      <FaCheckCircle size={28} className="text-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Message Sent!</h3>
                    <p className="text-foreground/50 text-sm max-w-xs">Thank you for reaching out. I'll get back to you as soon as possible.</p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { name: 'name', label: 'Your Name', icon: FaUser, placeholder: 'John Doe', type: 'text' },
                        { name: 'email', label: 'Email Address', icon: FaEnvelope, placeholder: 'john@example.com', type: 'email' },
                      ].map(field => (
                        <div key={field.name} className="space-y-1.5">
                          <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/30">{field.label}</label>
                          <div className="relative">
                            <field.icon size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/25 pointer-events-none" />
                            <input
                              type={field.type}
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleChange}
                              onFocus={() => setFocused(field.name)}
                              onBlur={() => setFocused(null)}
                              required
                              placeholder={field.placeholder}
                              className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm text-foreground placeholder-foreground/20 outline-none transition-all duration-300 input-glow focus:border-primary/50"
                              style={{
                                background: 'rgba(var(--foreground),0.02)',
                                border: `1px solid ${focused === field.name ? 'rgba(var(--primary),0.5)' : 'rgba(var(--foreground),0.04)'}`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/30">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onFocus={() => setFocused('subject')}
                        onBlur={() => setFocused(null)}
                        placeholder="Project Inquiry / Collaboration"
                        className="w-full px-4 py-3 rounded-2xl text-sm text-foreground placeholder-foreground/20 outline-none transition-all duration-300 input-glow focus:border-primary/50"
                        style={{
                          background: 'rgba(var(--foreground),0.02)',
                          border: `1px solid ${focused === 'subject' ? 'rgba(var(--primary),0.5)' : 'rgba(var(--foreground),0.04)'}`,
                        }}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/30">Message</label>
                      <div className="relative">
                        <FaCommentDots size={12} className="absolute left-4 top-4 text-foreground/25 pointer-events-none" />
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          onFocus={() => setFocused('message')}
                          onBlur={() => setFocused(null)}
                          required
                          rows={5}
                          placeholder={`Hello ${developerInfo.name?.split(' ')[0] || 'Arun'}, I'd love to discuss...`}
                          className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm text-foreground placeholder-foreground/20 outline-none transition-all duration-300 resize-none input-glow focus:border-primary/50"
                          style={{
                            background: 'rgba(var(--foreground),0.02)',
                            border: `1px solid ${focused === 'message' ? 'rgba(var(--primary),0.5)' : 'rgba(var(--foreground),0.04)'}`,
                          }}
                        />
                      </div>
                    </div>

                    {status === 'error' && (
                      <p className="text-red-400 text-xs text-center font-semibold bg-red-500/10 py-2.5 rounded-xl border border-red-500/20">
                        ⚠️ Failed to send message. Make sure Service/Template ID & Public Key are correct in the Admin Panel.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full py-3.5 rounded-2xl font-bold text-sm text-background flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-primary/90"
                      style={{
                        background: 'rgb(var(--primary))',
                        border: '1px solid rgba(var(--primary),0.3)'
                      }}
                    >
                      {status === 'submitting' ? (
                        <><FaSpinner className="animate-spin" size={14} /> Sending...</>
                      ) : (
                        <><span>Send Message</span><FaPaperPlane size={12} /></>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
