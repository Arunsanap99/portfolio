import {
  FaHtml5, FaCss3Alt, FaJsSquare, FaReact, FaNodeJs, FaGitAlt, FaGithub, FaTerminal, FaCode, FaLaptopCode, FaServer, FaDatabase, FaCogs, FaBrain, FaRocket, FaLinkedin, FaInstagram, FaTwitter, FaJava, FaPython
} from 'react-icons/fa';
import {
  SiTailwindcss, SiRedux, SiExpress, SiMongodb, SiMysql, SiPostman, SiLeetcode, SiHackerrank, SiCodechef, SiNumpy, SiPandas, SiBootstrap
} from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';

export const developerInfo = {
  name: "Arun Sanap",
  title: "MERN Stack Developer",
  taglines: [
    "Full Stack Developer",
    "MERN Stack Developer",
    "React Specialist",
  ],
  avatar: "/project-images/5376f0f1-5fca-45f8-b2a8-dc1507a808ed.png",       // Hero section photo — set via Admin Panel
  aboutAvatar: "/project-images/c641de2e-632f-4c91-ada6-4c4a7c6ca165.png",  // About section photo — set via Admin Panel
  email: "as3085034@gmail.com",
  phone: "9322955167",
  address: "Nashik, Maharastra, India",
  about: "I am a passionate MERN Stack Developer. I build high-performance, responsive, and visually stunning web applications with modern design semantics. Currently expanding my horizons in AI integrations and building interactive 3D web experiences.",
  resumeUrl: "#", // User can upload / link their PDF here
  socials: {
    github: "https://github.com/Arunsanap99",
    linkedin: "https://www.linkedin.com/in/arun-sanap-37781228b/",
    instagram: "https://www.instagram.com/arunn_.44/",
  },
  emailjs: {
    serviceId: "",
    templateId: "",
    publicKey: ""
  }
};

export const stats = [
  { value: 10, label: "Projects Completed", suffix: "+" },
  { value: 5, label: "Certifications", suffix: "+" },
  { value: "Intern", label: "Experience Level", suffix: "" }
];

export const skills = [
  {
    category: "Frontend",
    items: [
      { name: "HTML", level: 95, icon: FaHtml5, color: "#e34c26" },
      { name: "CSS", level: 90, icon: FaCss3Alt, color: "#264de4" },
      { name: "JavaScript", level: 92, icon: FaJsSquare, color: "#f7df1e" },
      { name: "React", level: 95, icon: FaReact, color: "#61dafb" },
      { name: "Tailwind CSS", level: 93, icon: SiTailwindcss, color: "#06b6d4" },
      { name: "Bootstrap", level: 85, icon: SiBootstrap, color: "#7952b3" },
      { name: "Redux", level: 85, icon: SiRedux, color: "#764abc" }
    ]
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", level: 90, icon: FaNodeJs, color: "#339933" },
      { name: "Express.js", level: 88, icon: SiExpress, color: "#ffffff" }
    ]
  },
  {
    category: "Database",
    items: [
      { name: "MongoDB", level: 90, icon: SiMongodb, color: "#47a248" },
      { name: "MySQL", level: 82, icon: SiMysql, color: "#4479a1" }
    ]
  },
  {
    category: "Tools",
    items: [
      { name: "Git", level: 88, icon: FaGitAlt, color: "#f05032" },
      { name: "GitHub", level: 92, icon: FaGithub, color: "#ffffff" },
      { name: "Postman", level: 85, icon: SiPostman, color: "#ff6c37" },
      { name: "VS Code", level: 95, icon: VscVscode, color: "#007acc" }
    ]
  },
  {
    category: "Languages & Libraries",
    items: [
      { name: "Java", level: 85, icon: FaJava, color: "#f89820" },
      { name: "Python", level: 88, icon: FaPython, color: "#3776ab" },
      { name: "NumPy", level: 80, icon: SiNumpy, color: "#013243" },
      { name: "Pandas", level: 82, icon: SiPandas, color: "#150458" }
    ]
  }
];

export const experience = [
  {
    id: 7,
    title: "Career Readiness Job Skill Training",
    subtitle: "WNS Global Services / MakeMyCareer@WCF",
    date: "Jul 2024",
    description: "Completed comprehensive job skill training focused on professional growth, career preparation, and technical aptitude. Conducted in collaboration with WNS Cares Foundation and MET Bhujbal Knowledge City.",
    type: "certification",
    certificateInfo: {
      template: "wns",
      provider: "WNS Global Services",
      recipient: "Arun Pandurang Sanap",
      program: "MakeMyCareer@WCF Online Job Skill Training in Career Readiness",
      dateRange: "05th July 2024 to 27th July 2024",
      signature1: { name: "Keshav R. Murugesh", role: "Group CEO, WNS Global Services" },
      signature2: { name: "Shamini Murugesh", role: "Honorary Chief Mentor, WCF and Creator, CyberSmart" }
    }
  },
  {
    id: 6,
    title: "Software Engineering Intern",
    subtitle: "Sunanda Infotech Pvt Ltd",
    date: "Aug 2024 - Sep 2024",
    description: "Completed a 1-month hands-on internship focusing on web development and IT consultancy. Gained experience in IT services and software workflows under the guidance of senior coordinators.",
    type: "internship",
    certificateInfo: {
      template: "sunanda",
      provider: "Sunanda Infotech Pvt Ltd",
      recipient: "Arun Pandurang Sanap",
      college: "MET's Institute Of Technology - Polytechnic (BTech), Adgaon, Nashik",
      duration: "one month of Internship",
      signature1: { name: "Gulshan Mandwade", role: "Co-ordinator" },
      signature2: { name: "Siddharth Mandwade", role: "Director" }
    }
  },
  {
    id: 1,
    title: "MERN Stack Learning Journey",
    subtitle: "Self-Taught & Bootcamp",
    date: "2024 - 2025",
    description: "Built the foundation in web development. Mastered JavaScript, React, Node.js, Express, and MongoDB. Created several landing pages, cloned popular websites, and developed custom full stack CRUD projects.",
    type: "journey"
  },
  {
    id: 3,
    title: "MERN Full Stack Teaching Assistant Intern",
    subtitle: "Jainemo Private Limited",
    date: "Dec 2025 - Apr 2026",
    description: "Mentored 5,000+ students, resolved 613+ doubts with a 4.62/5.00 average feedback rating. Guided student learning and conducted code reviews under the supervision of Ms. Khyati.",
    type: "internship",
    certificateInfo: {
      template: "jainemo",
      provider: "Jainemo Private Limited",
      recipient: "Arun Sanap",
      role: "MERN Full Stack Teaching Assistant Intern",
      dateRange: "7th December 2025 to 21st April 2026",
      mentor: "Ms. Khyati",
      dateIssued: "7th May 2026",
      stats: [
        { label: "Students Mentored", value: "5000" },
        { label: "Doubts Solved", value: "613" },
        { label: "Average Rating", value: "4.62" }
      ],
      signatureName: "Aman Jaiswal",
      signatureRole: "HR Department",
      website: "https://www.apnacollege.in/"
    }
  }
];

export const projects = [
  {
    id: 1,
    title: "Clubonlink",
    description: "A modern platform for connecting campus clubs and simplifying event coordination, member communications, and activity tracking.",
    tech: ["React", "Tailwind CSS", "Node.js", "Express.js", "MongoDB"],
    image: "/project-images/clubonlink.png",
    github: "https://github.com/Arunsanap99/clubonlink",
    demo: "https://clubonlink.netlify.app",
    category: "Full Stack"
  },
  {
    id: 2,
    title: "Wandernest Travel Website",
    description: "An interactive travel rental marketplace and hotel booking system, featuring detailed lodging searches, user reviews, and map location pins.",
    tech: ["React", "Node.js", "MongoDB", "Express.js", "Tailwind CSS"],
    image: "/project-images/wandernest.png",
    github: "https://github.com/Arunsanap99/wondernest",
    demo: "https://wandernest-isd9.onrender.com/",
    category: "Full Stack"
  },
  {
    id: 3,
    title: "AI-Powered Crop Protection System",
    description: "An intelligent agricultural solution leveraging computer vision and ML models to identify crop diseases, pest threats, and offer real-time mitigation insights.",
    tech: ["Python", "TensorFlow", "React", "Flask", "Tailwind CSS"],
    image: "/project-images/crop-protection.png",
    github: "https://github.com/Arunsanap99/AI-powered-crop-protection-system",
    demo: "",
    category: "AI & Tools"
  },
  {
    id: 4,
    title: "Real-Time Chat Application",
    description: "A responsive instant messaging client using Socket.io for real-time message sync, featuring status indicators, room channels, and message history.",
    tech: ["React", "Node.js", "Express.js", "Socket.io", "Tailwind CSS"],
    image: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?q=80&w=800&auto=format&fit=crop",
    github: "https://github.com/Arunsanap99/chat-application",
    demo: "",
    category: "Realtime"
  },
  {
    id: 5,
    title: "Spotify Clone",
    description: "A high-fidelity music streaming interface mimicking Spotify, featuring audio playback controls, custom playlist creation, and responsive layout styling.",
    tech: ["React", "Tailwind CSS", "Context API", "HTML5 Audio"],
    image: "/project-images/spotify-clone.png",
    github: "https://github.com/Arunsanap99/spotify-clone",
    demo: "",
    category: "Frontend"
  }
];

export const services = [
  {
    title: "Frontend Development",
    description: "Creating highly performant, visually interactive, and responsive user interfaces using modern React, Tailwind, and animated UI patterns.",
    icon: FaLaptopCode
  },
  {
    title: "Full Stack Development",
    description: "Building end-to-end web architectures featuring robust MERN APIs, session management, secure tokens, and scalable database schemas.",
    icon: FaServer
  },
  {
    title: "React Development",
    description: "Advanced single-page applications optimized with React Router, custom hooks, atomic component styling, and redux state workflows.",
    icon: FaReact
  },
  {
    title: "API Integration",
    description: "Designing, documenting, and integrating standard RESTful APIs and real-time WebSockets to synchronize client-server communications.",
    icon: FaCogs
  },
  {
    title: "AI Integration",
    description: "Connecting OpenAI GPT, text-to-speech, image generation models, and vector stores to create intelligent AI agents.",
    icon: FaBrain
  },
  {
    title: "Website Optimization",
    description: "Auditing and optimizing slow applications to improve SEO indexing, core web vitals, bundle splitting, and rendering speeds.",
    icon: FaRocket
  }
];

export const testimonials = [
  {
    name: "John Doe",
    role: "CEO, TechSphere",
    rating: 5,
    comment: "Arun delivered a MERN stack application that exceeded all our expectations. The animations are buttery smooth, and the API speeds are outstanding. Recruiter-level excellence!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
  },
  {
    name: "Sarah Jenkins",
    role: "Product Manager, TravelWave",
    rating: 5,
    comment: "Working with Arun on the Wanderlust travel platform was a absolute pleasure. He is incredibly skilled at React, responsive layouts, and animations using Framer Motion.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
  },
  {
    name: "David Miller",
    role: "Founder, JarvisAI Solutions",
    rating: 5,
    comment: "Arun's expertise in React and REST API integrations helped us ship our AI prototype 2 weeks ahead of schedule. Highly recommended developer!",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
  }
];

export const codingProfiles = [
  {
    platform: "GitHub",
    username: "Arunsanap99",
    link: "https://github.com/Arunsanap99",
    icon: FaGithub,
    color: "#ffffff",
    statName: "Public Repos",
    statValue: "34"
  },
  {
    platform: "LeetCode",
    username: "arun_sanap",
    link: "https://leetcode.com/arun_sanap",
    icon: SiLeetcode,
    color: "#ffa116",
    statName: "Problems Solved",
    statValue: "245"
  },
  {
    platform: "HackerRank",
    username: "arunsanap_dev",
    link: "https://hackerrank.com/arunsanap_dev",
    icon: SiHackerrank,
    color: "#2ec866",
    statName: "Stars Earned",
    statValue: "5 ⭐"
  },
  {
    platform: "CodeChef",
    username: "arunsanap_code",
    link: "https://codechef.com/users/arunsanap_code",
    icon: SiCodechef,
    color: "#5b4638",
    statName: "Max Rating",
    statValue: "1450"
  }
];
