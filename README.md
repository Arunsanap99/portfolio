# ⚡ Premium Interactive MERN Stack Developer Portfolio

A high-performance, visually stunning, and interactive 3D portfolio website custom-tailored for a **Full Stack MERN Developer**. It features a modern dark aesthetic, smooth scroll physics, custom canvas particles, real-time email routing, an AI-powered query chatbot, and an integrated local Admin Panel.

---

## 🚀 Key Features

* **3D Particle Background**: Responsive interactive WebGL background with custom orbital gravity animations.
* **Dynamic Theme Switcher**: 6 preset accent themes (Purple default, Monochrome, Blue, Green, Rose, Orange) configurable live.
* **Local Admin Panel**: An interactive dashboard backed by browser IndexedDB to edit stats, certificates, projects, and socials on the fly without database costs.
* **Optimized Credentials & Documents**: 
  * High-fidelity image compression (1600x1200 PNG format) for certificates to maintain text readability.
  * Smart iframe handles that gracefully redirect Google Drive/Docs credentials to new tabs (avoiding X-Frame-Options blocks).
* **Real-time Contact Route**: Connects directly to EmailJS for instant delivery.
* **AI Query Chatbot**: Conversational bot contextually trained on developer stats, education, experience, and custom FAQs.
* **Netlify SPA Routing**: Out-of-the-box configurations (`_redirects`) optimized to serve static media assets alongside fallback routing.

---

## 🛠️ Tech Stack

* **Frontend**: React (Vite), Tailwind CSS, Framer Motion
* **Animations**: Canvas WebGL (Three.js), Lenis Scroll
* **Storage**: IndexedDB (Local DB)
* **API Routing & Services**: EmailJS, netlify-redirects
* **Icons**: React Icons (Fa, Si, Vsc)

---

## 📦 Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Run Locally
Start the development server:
```bash
npm run dev
```

### 3. Production Build
Compile the optimized production bundle:
```bash
npm run build
```

---

## ⚙️ Netlify Deployments
This repository is configured with a `_redirects` file in the public folder to support SPA routing:
* Bypasses client-side index routing for asset folders (like `/project-images/*`).
* Redirects all page routers (`/*`) back to `/index.html` to prevent 404s on browser reloads.
