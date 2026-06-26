import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes, FaCalendarAlt, FaClock, FaBookOpen } from 'react-icons/fa';

const BLOG_POSTS = [
  {
    id: 1,
    title: "Optimizing MERN Stack API Performance",
    excerpt: "Learn how to use Redis caching, compound indexing in MongoDB, and gzip compression to speed up your Node.js backend responses by 70%.",
    content: "Building scalable backend architectures requires more than just standard routing. In this comprehensive guide, we cover: \n\n1. Implementing Redis as a caching layer to store static query responses.\n2. Creating compound index models in MongoDB to prevent full collection scans.\n3. Utilizing gzip compression middleware in Express.js.\n4. Implementing connection pools to minimize database lookup times. \n\nBy following these steps, you can achieve sub-100ms API response latency under heavy load scenarios.",
    category: "Backend",
    date: "May 14, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "The Ultimate Guide to React 19 Server Components",
    excerpt: "Dive deep into React Server Components (RSC), actions, and form states. Understand the architectural shifts and how they impact core vitals.",
    content: "React 19 brings massive updates to frontend rendering patterns. \n\n1. React Server Components: Render UI elements directly on the server, sending minified HTML rather than heavy bundle chunks.\n2. Server Actions: Trigger secure database updates directly from client buttons, bypassing separate API endpoints.\n3. The use() hook: Resolve promises and context dynamically during rendering.\n4. Form Actions: Seamless handling of submit states, pendings, and rollbacks.",
    category: "Frontend",
    date: "Jun 02, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Lenis vs Locomotive Scroll: Smooth Scroll Benchmarks",
    excerpt: "An in-depth performance audit comparing Lenis smooth scrolling and Locomotive scroll on desktop and mobile web viewports.",
    content: "Scroll animations can quickly destroy frame rates if not handled appropriately. \n\nWe benchmarked Lenis and Locomotive Scroll across multiple parameters:\n1. CPU Overheads: Lenis uses native browser scroll threads, resulting in only 5-10% CPU usage compared to Locomotive's 30%.\n2. Layout Shifts: Lenis operates without absolute position shifts, leaving SEO indexes intact.\n3. Framer Motion integration: Lenis syncs directly with gsap scrollTriggers, making it our primary recommendation for premium portfolios.",
    category: "UX Design",
    date: "Jun 12, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop"
  }
];

export default function BlogSection() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Frontend', 'Backend', 'UX Design'];

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="blog" className="py-24 relative overflow-hidden bg-background">
      {/* Background glow spotlights */}
      <div className="glow-spotlight absolute -top-10 -left-10 w-[300px] h-[300px] rounded-full bg-primary/10 transition-all duration-1000 blur-[80px] pointer-events-none" />
      <div className="glow-spotlight absolute -bottom-10 -right-10 w-[300px] h-[300px] rounded-full bg-secondary/10 transition-all duration-1000 blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold font-mono tracking-widest text-primary uppercase"
          >
            Insights & Guides
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight"
          >
            Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Publications</span>
          </motion.h2>
          <div className="h-1 w-12 bg-gradient-to-r from-primary to-secondary mx-auto mt-4 rounded-full" />
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search publications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:border-primary/50 text-foreground"
            />
            <FaSearch className="absolute left-3.5 top-4 text-foreground/40 text-sm" />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-4 py-2.5 rounded-full transition-all border ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-glow-primary'
                    : 'bg-foreground/5 text-foreground/70 border-foreground/5 hover:border-foreground/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post) => (
              <motion.article
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="group cursor-pointer rounded-2xl glass-panel border border-foreground/5 overflow-hidden flex flex-col h-full hover:border-primary/20 transition-all duration-300"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-primary/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-foreground/40 text-[10px] mb-3">
                    <span className="flex items-center gap-1.5"><FaCalendarAlt /> {post.date}</span>
                    <span className="flex items-center gap-1.5"><FaClock /> {post.readTime}</span>
                  </div>

                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-foreground/75 text-xs mt-3 line-clamp-3 leading-relaxed flex-1">
                    {post.excerpt}
                  </p>

                  <div className="mt-6 pt-4 border-t border-foreground/5 flex items-center justify-between text-xs text-primary-light font-bold group-hover:underline">
                    <span>Read Publication</span>
                    <FaBookOpen />
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/50 text-sm">No publications matching search filters.</p>
          </div>
        )}
      </div>

      {/* Reader Modal Overlay */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="max-w-2xl w-full max-h-[85vh] rounded-3xl glass-panel shadow-glass border border-foreground/10 flex flex-col overflow-hidden"
            >
              {/* Cover Image */}
              <div className="h-64 relative overflow-hidden flex-shrink-0">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <button
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-4 right-4 p-2 bg-background/60 hover:bg-background/90 text-foreground rounded-full border border-foreground/10 transition-colors"
                  aria-label="Close Reader"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto flex-1">
                <div className="flex items-center gap-4 text-foreground/50 text-xs mb-4 font-medium">
                  <span className="bg-primary/20 text-primary-light px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {selectedPost.category}
                  </span>
                  <span className="flex items-center gap-1.5"><FaCalendarAlt /> {selectedPost.date}</span>
                  <span className="flex items-center gap-1.5"><FaClock /> {selectedPost.readTime}</span>
                </div>

                <h3 className="text-2xl font-extrabold tracking-tight leading-tight">
                  {selectedPost.title}
                </h3>

                <div className="h-0.5 w-full bg-foreground/5 my-6" />

                <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedPost.content}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
