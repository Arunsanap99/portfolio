import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBrain, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { usePortfolioData } from '../hooks/usePortfolioData';

const PRESET_QUESTIONS = [
  { text: "What is Arun's stack?", category: "skills" },
  { text: "Show featured projects", category: "projects" },
  { text: "Where did Arun study?", category: "education" },
  { text: "How can I contact Arun?", category: "contact" }
];

export default function AIQueryBot() {
  const { developerInfo, skills, projects, experience, stats } = usePortfolioData();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Set initial welcome message once developerInfo is loaded
  useEffect(() => {
    if (messages.length === 0 && developerInfo?.name) {
      setMessages([
        {
          id: 1,
          text: `Hello! I am ${developerInfo.name.split(' ')[0]}'s AI assistant. Ask me anything about his qualifications, experience, or project portfolio!`,
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [developerInfo, messages]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleBotResponse = (query) => {
    setIsTyping(true);
    setTimeout(() => {
      let reply = "";
      const text = query.toLowerCase();

      // 1. Education
      if (text.includes("education") || text.includes("college") || text.includes("study") || text.includes("btech") || text.includes("degree") || text.includes("met") || text.includes("bhujbal")) {
        reply = `Arun is currently a 3rd-year student pursuing a B.Tech in Computer Science & Design at MET Bhujbal Knowledge City.`;
      }
      // 2. Experience / Internships
      else if (text.includes("experience") || text.includes("internship") || text.includes("work") || text.includes("job")) {
        const internships = experience.filter(e => e.type === 'internship');
        if (internships.length > 0) {
          const list = internships.map(i => `- **${i.title}** at ${i.subtitle} (${i.date})`).join('\n');
          reply = `Arun has experience as an intern:\n\n${list}\n\nHis overall experience level is currently configured as "${stats.find(s => s.label.includes("Experience"))?.value || 'Intern'}".`;
        } else {
          reply = `Arun's experience level is set to "Intern". He has completed internships and bootcamps in MERN Full Stack development.`;
        }
      }
      // 3. Certifications
      else if (text.includes("certif") || text.includes("credential")) {
        const certs = experience.filter(e => e.type === 'certification');
        if (certs.length > 0) {
          const list = certs.map(c => `- **${c.title}** from ${c.subtitle}`).join('\n');
          reply = `Arun holds 5+ certifications, including:\n\n${list}`;
        } else {
          reply = `Arun has completed 5+ professional certifications in career readiness, software engineering, and full-stack development.`;
        }
      }
      // 4. Skills / Tech Stack
      else if (text.includes("stack") || text.includes("skill") || text.includes("technology") || text.includes("java") || text.includes("python") || text.includes("mern") || text.includes("react") || text.includes("bootstrap") || text.includes("numpy") || text.includes("pandas")) {
        const categoriesStr = skills.map(cat => {
          const itemsStr = cat.items.map(i => i.name).join(', ');
          return `• **${cat.category}**: ${itemsStr}`;
        }).join('\n');
        reply = `Arun is a MERN Stack Expert & AI enthusiast. His skills include:\n\n${categoriesStr}`;
      }
      // 5. Projects
      else if (text.includes("project") || text.includes("portfolio") || text.includes("build") || text.includes("app") || text.includes("wandernest") || text.includes("clubonlink") || text.includes("spotify") || text.includes("crop")) {
        if (projects && projects.length > 0) {
          const list = projects.map(p => `• **${p.title}** (${p.category}): ${p.description}`).join('\n\n');
          reply = `Arun has built 10+ projects. Featured projects:\n\n${list}`;
        } else {
          reply = `Arun has built 10+ projects using React, Node.js, Express, MongoDB, Tailwind, Python, and SQL.`;
        }
      }
      // 6. Resume / CV
      else if (text.includes("resume") || text.includes("cv") || text.includes("download")) {
        reply = `You can view or download Arun's Résumé by clicking the "Resume" button in the Hero or About sections of the website.`;
      }
      // 7. Social Links / Instagram
      else if (text.includes("instagram") || text.includes("github") || text.includes("linkedin") || text.includes("social") || text.includes("twitter")) {
        const socialsList = [];
        if (developerInfo.socials?.github) socialsList.push(`- GitHub: ${developerInfo.socials.github}`);
        if (developerInfo.socials?.linkedin) socialsList.push(`- LinkedIn: ${developerInfo.socials.linkedin}`);
        if (developerInfo.socials?.instagram) socialsList.push(`- Instagram: ${developerInfo.socials.instagram}`);
        reply = `You can connect with Arun online:\n\n${socialsList.join('\n')}`;
      }
      // 8. Contact Details
      else if (text.includes("contact") || text.includes("hire") || text.includes("email") || text.includes("phone") || text.includes("address") || text.includes("location")) {
        reply = `You can reach Arun via:\n\n- **Email**: ${developerInfo.email}\n- **Phone**: ${developerInfo.phone || '9322955167'}\n- **Location**: ${developerInfo.address || 'Nashik, Maharashtra, India'}\n\nYou can also send a message directly using the Contact Form at the bottom of the page!`;
      }
      // 9. About Arun / Bio
      else if (text.includes("who is") || text.includes("about arun") || text.includes("bio") || text.includes("myself") || text.includes("hello") || text.includes("hi")) {
        reply = `${developerInfo.about || "Arun is a passionate MERN Stack Developer who builds high-performance, responsive web applications with modern design."}`;
      }
      // 10. Default / Fallback
      else {
        reply = `I'm a lightweight bot showcasing Arun's portfolio. You can ask me about:\n\n- **Skills / Tech Stack** ("What is your stack?")\n- **Projects** ("Show me your projects")\n- **Experience & Education** ("Where do you study?")\n- **Contact Info** ("How can I reach you?")\n- **Resume** ("Where is your resume?")`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          text: reply,
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSend = (textToSend) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      text: textToSend,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    handleBotResponse(textToSend);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Mini Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-foreground/5 border border-primary/20 text-foreground hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(var(--primary),0.2)] hover:scale-110 active:scale-95 transition-all pointer-events-auto"
            aria-label="Open AI Assistant"
          >
            <FaBrain size={24} className="text-primary" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Chat Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="w-[350px] sm:w-[380px] h-[500px] rounded-2xl glass-panel shadow-glass flex flex-col overflow-hidden border border-foreground/10"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-background to-black/5 p-4 border-b border-foreground/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(var(--primary),0.15)]">
                  <FaBrain size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground tracking-wide">{developerInfo.name ? developerInfo.name.split(' ')[0] : 'Arun'} AI</h4>
                  <span className="text-[10px] text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" /> Online Assistant
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-foreground/60 hover:text-foreground p-1 transition-colors"
                aria-label="Close Chat"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Message Feed */}
            <div data-lenis-prevent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                    msg.sender === 'user' 
                      ? 'bg-foreground/10 text-foreground rounded-tr-none border border-foreground/10' 
                      : 'bg-foreground/5 dark:bg-foreground/5 text-foreground/90 border border-foreground/5 rounded-tl-none'
                  }`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <span className="block text-[8px] text-foreground/40 mt-1 text-right">{msg.time}</span>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-foreground/5 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Presets and Input */}
            <div className="p-3 bg-black/5 border-t border-foreground/5 space-y-3">
              {/* Presets */}
              <div className="flex flex-wrap gap-1.5">
                {PRESET_QUESTIONS.map((pq, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(pq.text)}
                    className="text-[10px] bg-foreground/5 hover:bg-foreground/10 border border-foreground/5 rounded-full px-2.5 py-1 transition-all text-foreground/70"
                  >
                    {pq.text}
                  </button>
                ))}
              </div>

              {/* Chat Input Field */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Ask about ${developerInfo.name ? developerInfo.name.split(' ')[0] : 'Arun'}...`}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend(inputVal)}
                  className="flex-1 bg-foreground/5 border border-foreground/5 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-foreground/20 text-foreground"
                />
                <button
                  onClick={() => handleSend(inputVal)}
                  className="p-2 h-8 w-8 rounded-lg bg-foreground/10 border border-foreground/10 text-foreground flex items-center justify-center hover:bg-foreground/20 hover:scale-105 transition-all"
                  aria-label="Send message"
                >
                  <FaPaperPlane size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
