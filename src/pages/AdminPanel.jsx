import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ADMIN_PASSWORD,
  saveStore,
  resetStore,
  getDeveloperInfo,
  getSkills,
  getProjects,
  getExperience,
  exportData,
  importData,
  uploadFileToFirebase,
  isFirebaseEnabled,
} from '../store/portfolioStore';
import { compressImage } from '../utils/utils';

// ─── Tiny reusable components ────────────────────────────────────────────────
const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>}
    <input
      {...props}
      className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition-colors placeholder-slate-500"
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>}
    <textarea
      {...props}
      rows={3}
      className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition-colors placeholder-slate-500 resize-y"
    />
  </div>
);

const Card = ({ title, children }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
    <h2 className="text-lg font-bold text-white flex items-center gap-2">
      <span className="w-1 h-5 rounded-full bg-violet-500 inline-block" />
      {title}
    </h2>
    {children}
  </div>
);

const SaveBtn = ({ onClick, saved }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
      saved
        ? 'bg-green-500/20 text-green-400 border border-green-500/40'
        : 'bg-violet-600 hover:bg-violet-500 text-white'
    }`}
  >
    {saved ? '✓ Saved!' : 'Save Changes'}
  </button>
);

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) {
      onLogin();
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-3xl">🔐</div>
          <h1 className="text-2xl font-extrabold text-white">Admin Panel</h1>
          <p className="text-sm text-slate-500">Enter your secret password to continue</p>
        </div>

        <div className="space-y-3">
          <input
            type="password"
            placeholder="Enter password..."
            value={pw}
            onChange={e => { setPw(e.target.value); setError(false); }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className={`w-full bg-slate-800 border rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-colors placeholder-slate-500 ${
              error ? 'border-red-500' : 'border-slate-700 focus:border-violet-500'
            }`}
          />
          {error && <p className="text-red-400 text-xs text-center">❌ Wrong password. Try again.</p>}
          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-colors"
          >
            Unlock Admin Panel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE SECTION ─────────────────────────────────────────────────────────
function ProfileEditor({ setActiveTab }) {
  const showExternalUrlGuide = (
    <div className="bg-blue-950/50 border border-blue-500/30 rounded-xl p-3 mb-4 space-y-1 text-xs text-blue-200">
      <p className="font-bold text-blue-400">🚀 IMPORTANT FOR DEPLOYED LINK!</p>
      <p>For your photos to show up on your deployed portfolio, <strong>use a public external image URL</strong> instead of uploading directly!</p>
      <p><strong>How to get an image URL:</strong> Use free sites like <a href="https://imgur.com" target="_blank" rel="noreferrer" className="underline">Imgur</a>, <a href="https://postimages.org" target="_blank" rel="noreferrer" className="underline">PostImages</a>, or <a href="https://cloudinary.com" target="_blank" rel="noreferrer" className="underline">Cloudinary</a> to host your photo, then copy the direct image link!</p>
    </div>
  );
  const info = getDeveloperInfo();
  const [form, setForm] = useState({
    name: info.name,
    title: info.title,
    about: info.about,
    email: info.email,
    phone: info.phone,
    address: info.address,
    resumeUrl: info.resumeUrl,
    avatar: info.avatar,
    aboutAvatar: info.aboutAvatar || '',
    github: info.socials?.github || '',
    linkedin: info.socials?.linkedin || '',
    instagram: info.socials?.instagram || '',
    twitter: info.socials?.twitter || '',
    emailjsServiceId: info.emailjs?.serviceId || '',
    emailjsTemplateId: info.emailjs?.templateId || '',
    emailjsPublicKey: info.emailjs?.publicKey || '',
  });
  const [saved, setSaved] = useState(false);
  const [previewHero, setPreviewHero] = useState(info.avatar);
  const [previewAbout, setPreviewAbout] = useState(info.aboutAvatar || '');
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isUploadingAbout, setIsUploadingAbout] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImageUpload = (field, setPreview, setIsUploading) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    
    // Show preview and set data URL locally
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result;
      setPreview(dataUrl);
      set(field, dataUrl);

      if (isFirebaseEnabled) {
        try {
          const path = `portfolio/profile/${Date.now()}-${file.name}`;
          const downloadURL = await uploadFileToFirebase(file, path);
          setPreview(downloadURL);
          set(field, downloadURL);
        } catch (err) {
          console.error('Failed to upload image to Firebase:', err);
        }
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const success = saveStore({
      developerInfo: {
        name: form.name,
        title: form.title,
        about: form.about,
        email: form.email,
        phone: form.phone,
        address: form.address,
        resumeUrl: form.resumeUrl,
        avatar: form.avatar,
        aboutAvatar: form.aboutAvatar,
        socials: {
          github: form.github,
          linkedin: form.linkedin,
          instagram: form.instagram,
          twitter: form.twitter,
        },
        emailjs: {
          serviceId: form.emailjsServiceId,
          templateId: form.emailjsTemplateId,
          publicKey: form.emailjsPublicKey,
        }
      }
    });
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <Card title="Profile Information">
      {showExternalUrlGuide}
      {/* Two separate photo uploads */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Hero Photo */}
        <div className="bg-slate-800/50 rounded-2xl p-4 space-y-3 border border-slate-700/60">
          <p className="text-xs font-bold text-violet-400 uppercase tracking-wider">🏠 Hero Section Photo</p>
          <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-700 flex items-center justify-center border border-slate-600">
            {previewHero ? (
              <img src={previewHero} alt="Hero Preview" className="w-full h-full object-cover object-top" />
            ) : (
              <span className="text-slate-500 text-3xl">👤</span>
            )}
          </div>
          <label className="cursor-pointer block w-full text-center px-3 py-2 bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/40 text-violet-300 text-sm rounded-xl transition-colors font-semibold">
            {isUploadingHero ? '⏳ Uploading...' : '📷 Upload Hero Photo'}
            <input type="file" accept="image/*" className="hidden" disabled={isUploadingHero} onChange={handleImageUpload('avatar', setPreviewHero, setIsUploadingHero)} />
          </label>
          <input
            type="text"
            placeholder="Or paste image URL..."
            value={form.avatar.startsWith('data:') ? '' : form.avatar}
            onChange={e => { set('avatar', e.target.value); setPreviewHero(e.target.value); }}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-violet-500 placeholder-slate-500"
          />
        </div>

        {/* About Photo */}
        <div className="bg-slate-800/50 rounded-2xl p-4 space-y-3 border border-slate-700/60">
          <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">👤 About Section Photo</p>
          <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-700 flex items-center justify-center border border-slate-600">
            {previewAbout ? (
              <img src={previewAbout} alt="About Preview" className="w-full h-full object-cover object-top" />
            ) : (
              <span className="text-slate-500 text-sm text-center px-3">Falls back to Hero photo if empty</span>
            )}
          </div>
          <label className="cursor-pointer block w-full text-center px-3 py-2 bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/40 text-cyan-300 text-sm rounded-xl transition-colors font-semibold">
            {isUploadingAbout ? '⏳ Uploading...' : '📷 Upload About Photo'}
            <input type="file" accept="image/*" className="hidden" disabled={isUploadingAbout} onChange={handleImageUpload('aboutAvatar', setPreviewAbout, setIsUploadingAbout)} />
          </label>
          <input
            type="text"
            placeholder="Or paste image URL..."
            value={form.aboutAvatar.startsWith('data:') ? '' : form.aboutAvatar}
            onChange={e => { set('aboutAvatar', e.target.value); setPreviewAbout(e.target.value); }}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-violet-500 placeholder-slate-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Full Name" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Arun Sanap" />
        <Input label="Title" value={form.title} onChange={e => set('title', e.target.value)} placeholder="MERN Stack Developer" />
        <Input label="Email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@email.com" />
        <Input label="Phone" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 XXXXXXXXXX" />
        <Input label="Address / Location" value={form.address} onChange={e => set('address', e.target.value)} placeholder="City, State, Country" />
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resume PDF / Link</label>
          <div className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm flex justify-between items-center h-[46px]">
            <span className="truncate max-w-[200px] text-slate-400">
              {form.resumeUrl && form.resumeUrl.startsWith('data:application/pdf') ? '📄 Local PDF Uploaded' : (form.resumeUrl || 'Not Set')}
            </span>
            <button
              type="button"
              onClick={() => {
                if (setActiveTab) setActiveTab('Resume');
              }}
              className="text-xs text-violet-400 hover:text-violet-300 font-bold"
            >
              Manage →
            </button>
          </div>
        </div>
      </div>

      <Textarea label="About Me" value={form.about} onChange={e => set('about', e.target.value)} placeholder="Write a short bio about yourself..." />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="GitHub URL" value={form.github} onChange={e => set('github', e.target.value)} placeholder="https://github.com/..." />
        <Input label="LinkedIn URL" value={form.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." />
        <Input label="Instagram URL" value={form.instagram} onChange={e => set('instagram', e.target.value)} placeholder="https://instagram.com/..." />
        <Input label="Twitter URL" value={form.twitter} onChange={e => set('twitter', e.target.value)} placeholder="https://twitter.com/..." />
      </div>

      {/* EmailJS Configuration */}
      <div className="border-t border-slate-800/80 pt-6 mt-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-violet-400 uppercase tracking-wider flex items-center gap-2">
            📧 Real-Time Email Form Setup (EmailJS)
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Fill in these credentials so your portfolio's contact form sends messages straight to your inbox in real time.
            Sign up for a free account at <a href="https://www.emailjs.com/" target="_blank" rel="noreferrer" className="text-violet-400 hover:text-violet-300 underline font-semibold">emailjs.com</a> to get them.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Service ID" value={form.emailjsServiceId} onChange={e => set('emailjsServiceId', e.target.value)} placeholder="service_xxxxxxx" />
          <Input label="Template ID" value={form.emailjsTemplateId} onChange={e => set('emailjsTemplateId', e.target.value)} placeholder="template_xxxxxxx" />
          <Input label="Public Key" value={form.emailjsPublicKey} onChange={e => set('emailjsPublicKey', e.target.value)} placeholder="your_public_key" />
        </div>
      </div>

      <div className="flex justify-end"><SaveBtn onClick={handleSave} saved={saved} /></div>
    </Card>
  );
}

// ─── RESUME SECTION ──────────────────────────────────────────────────────────
function ResumeEditor() {
  const showResumeUrlGuide = (
    <div className="bg-blue-950/50 border border-blue-500/30 rounded-xl p-3 mb-4 space-y-1 text-xs text-blue-200">
      <p className="font-bold text-blue-400">🚀 IMPORTANT FOR DEPLOYED LINK!</p>
      <p>For your resume to show up on your deployed portfolio, <strong>use a public external PDF URL</strong> instead of uploading directly!</p>
      <p><strong>How to get a PDF URL:</strong> Upload your PDF to <a href="https://drive.google.com" target="_blank" rel="noreferrer" className="underline">Google Drive</a>, <a href="https://www.dropbox.com" target="_blank" rel="noreferrer" className="underline">Dropbox</a>, or <a href="https://cloudinary.com" target="_blank" rel="noreferrer" className="underline">Cloudinary</a>, then copy the direct PDF link!</p>
    </div>
  );
  
  const info = getDeveloperInfo();
  const [resumeUrl, setResumeUrl] = useState(info.resumeUrl || '');
  const [saved, setSaved] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setUploadError('❌ Only PDF files are supported.');
      return;
    }
    const maxLimit = isFirebaseEnabled ? 5 * 1024 * 1024 : 1.2 * 1024 * 1024;
    if (file.size > maxLimit) {
      setUploadError(`❌ File size exceeds ${isFirebaseEnabled ? '5MB' : '1.2MB'}. Please compress your PDF.`);
      return;
    }
    setUploadError('');
    setIsUploadingResume(true);
    
    // Show local preview and save data URL
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result;
      setResumeUrl(dataUrl);

      if (isFirebaseEnabled) {
        try {
          const path = `portfolio/resume/${Date.now()}-${file.name}`;
          const downloadURL = await uploadFileToFirebase(file, path);
          setResumeUrl(downloadURL);
        } catch (err) {
          console.error('Failed to upload PDF to Firebase:', err);
          setUploadError('❌ Failed to upload to cloud storage.');
        }
      }
      setIsUploadingResume(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const currentInfo = getDeveloperInfo();
    const success = saveStore({
      developerInfo: {
        ...currentInfo,
        resumeUrl: resumeUrl
      }
    });
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  const isBase64 = resumeUrl.startsWith('data:application/pdf');
  const base64Size = isBase64 ? Math.round((resumeUrl.length * 3) / 4 / 1024) : 0;
  const canPreview = isBase64 || 
    (typeof resumeUrl === 'string' && (
      resumeUrl.includes('firebasestorage.googleapis.com') || 
      resumeUrl.split('?')[0].endsWith('.pdf')
    ));

  return (
    <Card title="Resume Management">
      <div className="space-y-6">
        {showResumeUrlGuide}
        {/* Help Banner */}
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 text-xs text-slate-400 leading-relaxed">
          💡 Your resume can be configured in two ways:
          <ul className="list-disc pl-4 mt-2 space-y-1">
            <li><strong>Direct PDF Upload:</strong> Upload your PDF file directly. It will be saved locally in your browser storage. Keep it under 1.2MB.</li>
            <li><strong>Hosted URL Link:</strong> Paste a link to your resume from Google Drive, Dropbox, or any public host.</li>
          </ul>
        </div>

        {/* URL Input */}
        <Input
          label="Resume URL / Link"
          value={isBase64 ? 'Local PDF File (Uploaded below)' : resumeUrl}
          disabled={isBase64}
          onChange={e => setResumeUrl(e.target.value)}
          placeholder="https://drive.google.com/file/d/... or http://..."
        />

        {/* Upload Zone */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Upload Resume PDF</label>
          <div className="flex flex-col sm:flex-row gap-4 items-stretch">
            {/* Upload Area */}
            <label className={`flex-1 cursor-pointer flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 transition-all ${
              isBase64
                ? 'border-green-500/40 bg-green-500/5 hover:bg-green-500/10'
                : 'border-slate-700 hover:border-violet-500/50 bg-slate-900 hover:bg-slate-800/40'
            }`}>
              <div className="text-center space-y-2">
                <span className="text-3xl">{isUploadingResume ? '⏳' : (isBase64 ? '📄' : '📤')}</span>
                <p className="text-sm font-bold text-white">
                  {isUploadingResume ? 'Uploading Resume...' : (isBase64 ? 'Resume PDF Uploaded' : 'Select PDF File')}
                </p>
                <p className="text-xs text-slate-500">
                  {isBase64 ? `File size: ~${base64Size} KB` : 'PDF files only, max 1.2MB'}
                </p>
              </div>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                disabled={isUploadingResume}
                onChange={handlePdfUpload}
              />
            </label>

            {/* Clear / Action buttons */}
            {resumeUrl && resumeUrl !== '#' && (
              <div className="flex sm:flex-col justify-center gap-2">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-initial text-center px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  👁️ Open Resume
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setResumeUrl('');
                    setUploadError('');
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 text-xs font-semibold rounded-xl transition-colors"
                >
                  Clear Resume
                </button>
              </div>
            )}
          </div>
          {uploadError && <p className="text-red-400 text-xs mt-1">{uploadError}</p>}
        </div>

        {/* Live Preview */}
        {resumeUrl && resumeUrl !== '#' && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Preview</p>
            <div className="rounded-2xl overflow-hidden border border-slate-800 h-[450px] bg-slate-900 relative">
              {canPreview ? (
                <iframe src={resumeUrl} title="Resume Live Preview" className="w-full h-full border-0" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <span className="text-4xl">🔗</span>
                  <h3 className="font-bold text-white text-sm">External Resume URL Linked</h3>
                  <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                    A preview is not rendered for external URLs because third-party providers (like Google Drive) may restrict embedding. The link itself will function correctly on your portfolio.
                  </p>
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/40 text-violet-300 text-xs font-bold rounded-xl transition-colors"
                  >
                    Open Link in New Tab →
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <SaveBtn onClick={handleSave} saved={saved} />
      </div>
    </Card>
  );
}

// ─── SKILLS SECTION ──────────────────────────────────────────────────────────
function SkillsEditor() {
  const [categories, setCategories] = useState(() => {
    const s = getSkills();
    // Flatten for easier editing — store as [{category, name, level}]
    return s.map(cat => ({
      category: cat.category,
      items: cat.items.map(i => ({ name: i.name, level: i.level }))
    }));
  });
  const [saved, setSaved] = useState(false);

  const updateSkillLevel = (catIdx, itemIdx, val) => {
    setCategories(prev => {
      const next = prev.map((c, ci) => ci === catIdx
        ? { ...c, items: c.items.map((it, ii) => ii === itemIdx ? { ...it, level: Number(val) } : it) }
        : c
      );
      return next;
    });
  };

  const addSkill = (catIdx) => {
    setCategories(prev => prev.map((c, ci) => ci === catIdx
      ? { ...c, items: [...c.items, { name: 'New Skill', level: 80 }] }
      : c
    ));
  };

  const removeSkill = (catIdx, itemIdx) => {
    setCategories(prev => prev.map((c, ci) => ci === catIdx
      ? { ...c, items: c.items.filter((_, ii) => ii !== itemIdx) }
      : c
    ));
  };

  const updateSkillName = (catIdx, itemIdx, val) => {
    setCategories(prev => prev.map((c, ci) => ci === catIdx
      ? { ...c, items: c.items.map((it, ii) => ii === itemIdx ? { ...it, name: val } : it) }
      : c
    ));
  };

  const handleSave = () => {
    // Re-merge with icon/color from original data for rendering
    const { skills: defaultSkills } = { skills: getSkills() };
    const merged = categories.map(editCat => {
      const origCat = defaultSkills.find(c => c.category === editCat.category);
      return {
        category: editCat.category,
        items: editCat.items.map(editItem => {
          const orig = origCat?.items.find(i => i.name === editItem.name);
          return {
            name: editItem.name,
            level: editItem.level,
            icon: orig?.icon || null,
            color: orig?.color || '#aaaaaa',
          };
        })
      };
    });
    const success = saveStore({ skills: merged });
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <Card title="Skills & Proficiency">
      {categories.map((cat, ci) => (
        <div key={ci} className="space-y-3">
          <p className="text-sm font-bold text-violet-400 uppercase tracking-wider">{cat.category}</p>
          {cat.items.map((item, ii) => (
            <div key={ii} className="flex items-center gap-3">
              <input
                type="text"
                value={item.name}
                onChange={e => updateSkillName(ci, ii, e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm w-36 focus:outline-none focus:border-violet-500"
              />
              <input
                type="range" min={1} max={100} value={item.level}
                onChange={e => updateSkillLevel(ci, ii, e.target.value)}
                className="flex-1 accent-violet-500"
              />
              <span className="text-sm font-bold text-violet-400 w-10 text-right">{item.level}%</span>
              <button onClick={() => removeSkill(ci, ii)} className="text-red-400 hover:text-red-300 text-lg leading-none">×</button>
            </div>
          ))}
          <button
            onClick={() => addSkill(ci)}
            className="text-xs text-violet-400 hover:text-violet-300 border border-dashed border-violet-500/40 rounded-xl px-4 py-1.5 transition-colors"
          >
            + Add {cat.category} Skill
          </button>
        </div>
      ))}
      <div className="flex justify-end pt-2"><SaveBtn onClick={handleSave} saved={saved} /></div>
    </Card>
  );
}

// ─── PROJECTS SECTION ─────────────────────────────────────────────────────────
function ProjectsEditor() {
  const showProjectUrlGuide = (
    <div className="bg-blue-950/50 border border-blue-500/30 rounded-xl p-3 mb-4 space-y-1 text-xs text-blue-200">
      <p className="font-bold text-blue-400">🚀 IMPORTANT FOR DEPLOYED LINK!</p>
      <p>For your project images to show up on your deployed portfolio, <strong>use a public external image URL</strong> instead of uploading directly!</p>
      <p><strong>How to get an image URL:</strong> Use free sites like <a href="https://imgur.com" target="_blank" rel="noreferrer" className="underline">Imgur</a>, <a href="https://postimages.org" target="_blank" rel="noreferrer" className="underline">PostImages</a>, or <a href="https://cloudinary.com" target="_blank" rel="noreferrer" className="underline">Cloudinary</a> to host your photo, then copy the direct image link!</p>
    </div>
  );
  
  const [projects, setProjects] = useState(() => getProjects());
  const [saved, setSaved] = useState(false);
  const [isUploadingProjects, setIsUploadingProjects] = useState({}); // { [idx]: boolean }

  const update = (idx, field, val) => {
    setProjects(prev => prev.map((p, i) => i === idx ? { ...p, [field]: val } : p));
  };

  const handleProjImageUpload = (idx) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploadingProjects(prev => ({ ...prev, [idx]: true }));
    
    // Compress image first
    compressImage(file, async (dataUrl) => {
      // First set preview
      update(idx, 'image', dataUrl);
      
      // Now upload to Firebase
      try {
        const path = `portfolio/projects/${Date.now()}-${file.name}`;
        // Convert dataUrl to File object
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const newFile = new File([blob], file.name, { type: file.type });
        const downloadURL = await uploadFileToFirebase(newFile, path);
        update(idx, 'image', downloadURL);
      } catch (err) {
        console.error('Failed to upload project image:', err);
        alert('Failed to upload image. Please try again or use an image URL.');
      } finally {
        setIsUploadingProjects(prev => ({ ...prev, [idx]: false }));
      }
    });
  };

  const addProject = () => {
    setProjects(prev => [...prev, {
      id: Date.now(),
      title: 'New Project',
      description: 'Project description here...',
      tech: ['React', 'Node.js'],
      image: '',
      github: '',
      demo: '',
      category: 'Full Stack'
    }]);
  };

  const removeProject = (idx) => {
    setProjects(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    const success = saveStore({ projects });
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <Card title="Projects">
      {showProjectUrlGuide}
      <div className="space-y-6">
        {projects.map((proj, idx) => (
          <div key={proj.id} className="bg-slate-800/60 rounded-2xl p-4 space-y-3 border border-slate-700/60">
            <div className="flex items-center justify-between">
              <p className="font-bold text-white text-sm">Project #{idx + 1}</p>
              <button onClick={() => removeProject(idx)} className="text-red-400 hover:text-red-300 text-sm font-bold">Remove</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Title" value={proj.title} onChange={e => update(idx, 'title', e.target.value)} />
              <Input label="Category" value={proj.category} onChange={e => update(idx, 'category', e.target.value)} />
              <Input label="GitHub URL" value={proj.github} onChange={e => update(idx, 'github', e.target.value)} />
              <Input label="Live Demo URL" value={proj.demo} onChange={e => update(idx, 'demo', e.target.value)} />
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Project Image</label>
                <div className="flex gap-2 items-center">
                  {proj.image && (
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0 border border-slate-600">
                      <img src={proj.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className="cursor-pointer flex-1 text-center py-2 bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/40 text-violet-300 text-xs rounded-xl transition-colors font-semibold">
                    {isUploadingProjects[idx] ? '⏳ Uploading...' : '📷 Upload Image'}
                    <input type="file" accept="image/*" className="hidden" disabled={isUploadingProjects[idx]} onChange={handleProjImageUpload(idx)} />
                  </label>
                  {proj.image && (
                    <button
                      type="button"
                      onClick={() => update(idx, 'image', '')}
                      className="px-3 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 text-xs rounded-xl transition-colors font-semibold"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Or paste image URL..."
                  value={proj.image && proj.image.startsWith('data:') ? '' : proj.image}
                  onChange={e => update(idx, 'image', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-violet-500 placeholder-slate-500"
                />
              </div>

              <Input label="Tech Stack (comma separated)" value={Array.isArray(proj.tech) ? proj.tech.join(', ') : proj.tech} onChange={e => update(idx, 'tech', e.target.value.split(',').map(t => t.trim()))} />
            </div>
            <Textarea label="Description" value={proj.description} onChange={e => update(idx, 'description', e.target.value)} />
          </div>
        ))}
        <button
          onClick={addProject}
          className="w-full py-3 border border-dashed border-violet-500/40 text-violet-400 hover:text-violet-300 hover:border-violet-400 rounded-2xl text-sm font-bold transition-colors"
        >
          + Add New Project
        </button>
      </div>
      <div className="flex justify-end"><SaveBtn onClick={handleSave} saved={saved} /></div>
    </Card>
  );
}

// ─── EXPERIENCE / CERTIFICATES ───────────────────────────────────────────────
function ExperienceEditor() {
  const showExperienceUrlGuide = (
    <div className="bg-blue-950/50 border border-blue-500/30 rounded-xl p-3 mb-4 space-y-1 text-xs text-blue-200">
      <p className="font-bold text-blue-400">🚀 IMPORTANT FOR DEPLOYED LINK!</p>
      <p>For your certificates/files to show up on your deployed portfolio, <strong>use public external URLs</strong> instead of uploading directly!</p>
      <p><strong>How to get a URL:</strong> Upload to <a href="https://drive.google.com" target="_blank" rel="noreferrer" className="underline">Google Drive</a>, <a href="https://www.dropbox.com" target="_blank" rel="noreferrer" className="underline">Dropbox</a>, or <a href="https://cloudinary.com" target="_blank" rel="noreferrer" className="underline">Cloudinary</a>, then copy the direct link!</p>
    </div>
  );
  
  const [items, setItems] = useState(() => getExperience());
  const [saved, setSaved] = useState(false);

  const update = (idx, field, val) => {
    setItems(prev => prev.map((p, i) => i === idx ? { ...p, [field]: val } : p));
  };

  const handleExpFileUpload = (idx, field) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const processAndSave = async (fileObj, dataUrl = null) => {
      if (dataUrl) {
        update(idx, field, dataUrl);
        
        if (isFirebaseEnabled) {
          try {
            const path = `portfolio/experience/${Date.now()}-${fileObj.name}`;
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            const newFile = new File([blob], fileObj.name, { type: fileObj.type });
            const downloadURL = await uploadFileToFirebase(newFile, path);
            update(idx, field, downloadURL);
          } catch (err) {
            console.error('Failed to upload experience image:', err);
          }
        }
      } else {
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const localUrl = ev.target.result;
          update(idx, field, localUrl);
          
          if (isFirebaseEnabled) {
            try {
              const path = `portfolio/experience/${Date.now()}-${fileObj.name}`;
              const downloadURL = await uploadFileToFirebase(fileObj, path);
              update(idx, field, downloadURL);
            } catch (err) {
              console.error('Failed to upload experience file:', err);
            }
          }
        };
        reader.readAsDataURL(fileObj);
      }
    };
    
    if (file.type.startsWith('image/')) {
      compressImage(file, (dataUrl) => {
        processAndSave(file, dataUrl);
      });
    } else {
      processAndSave(file);
    }
  };

  const addItem = () => {
    setItems(prev => [...prev, {
      id: Date.now(),
      title: 'New Entry',
      subtitle: 'Company / Platform',
      date: '2026',
      description: 'Describe your role or achievement here...',
      type: 'certification',
      image: '',
      file: ''
    }]);
  };

  const removeItem = (idx) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    const success = saveStore({ experience: items });
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  const typeColors = {
    journey: 'text-blue-400',
    freelance: 'text-green-400',
    internship: 'text-yellow-400',
    certification: 'text-violet-400',
    achievement: 'text-orange-400',
  };

  return (
    <Card title="Experience & Certifications">
      {showExperienceUrlGuide}
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={item.id} className="bg-slate-800/60 rounded-2xl p-4 space-y-3 border border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wider ${typeColors[item.type] || 'text-slate-400'}`}>
                {item.type}
              </span>
              <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-300 text-sm font-bold">Remove</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Title" value={item.title} onChange={e => update(idx, 'title', e.target.value)} />
              <Input label="Company / Platform" value={item.subtitle} onChange={e => update(idx, 'subtitle', e.target.value)} />
              <Input label="Date / Period" value={item.date} onChange={e => update(idx, 'date', e.target.value)} />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</label>
                <select
                  value={item.type}
                  onChange={e => update(idx, 'type', e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500"
                >
                  <option value="journey">Journey</option>
                  <option value="freelance">Freelance</option>
                  <option value="internship">Internship</option>
                  <option value="certification">Certification</option>
                  <option value="achievement">Achievement</option>
                </select>
              </div>

              {/* Image Preview Upload Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {item.type === 'certification' ? 'Certificate Image Preview (PNG/JPG)' : 'Experience Image / Logo'}
                </label>
                <div className="flex gap-2 items-center">
                  {item.image && (
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0 border border-slate-600">
                      <img src={item.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className="cursor-pointer flex-1 text-center py-2 bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/40 text-violet-300 text-xs rounded-xl transition-colors font-semibold">
                    📷 Upload Image
                    <input type="file" accept="image/*" className="hidden" onChange={handleExpFileUpload(idx, 'image')} />
                  </label>
                  {item.image && (
                    <button
                      type="button"
                      onClick={() => update(idx, 'image', '')}
                      className="px-3 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 text-xs rounded-xl transition-colors font-semibold"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Or paste image URL..."
                  value={item.image && item.image.startsWith('data:') ? '' : (item.image || '')}
                  onChange={e => update(idx, 'image', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-violet-500 placeholder-slate-500"
                />
              </div>

              {/* Document / PDF Attachment Upload Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {item.type === 'certification' ? 'Official Certificate Document (PDF)' : 'Attached Document (PDF/File)'}
                </label>
                <div className="flex gap-2 items-center">
                  {item.file && (
                    <div className="w-12 h-12 rounded-lg bg-slate-700 flex-shrink-0 border border-slate-600 flex items-center justify-center text-lg">
                      📄
                    </div>
                  )}
                  <label className="cursor-pointer flex-1 text-center py-2 bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/40 text-violet-300 text-xs rounded-xl transition-colors font-semibold">
                    📎 Upload PDF / File
                    <input type="file" accept=".pdf,.doc,.docx,image/*" className="hidden" onChange={handleExpFileUpload(idx, 'file')} />
                  </label>
                  {item.file && (
                    <button
                      type="button"
                      onClick={() => update(idx, 'file', '')}
                      className="px-3 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 text-xs rounded-xl transition-colors font-semibold"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Or paste document URL..."
                  value={item.file && item.file.startsWith('data:') ? '' : (item.file || '')}
                  onChange={e => update(idx, 'file', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-violet-500 placeholder-slate-500"
                />
              </div>
            </div>
            <Textarea label="Description" value={item.description} onChange={e => update(idx, 'description', e.target.value)} />
          </div>
        ))}
        <button
          onClick={addItem}
          className="w-full py-3 border border-dashed border-violet-500/40 text-violet-400 hover:text-violet-300 hover:border-violet-400 rounded-2xl text-sm font-bold transition-colors"
        >
          + Add Entry
        </button>
      </div>
      <div className="flex justify-end"><SaveBtn onClick={handleSave} saved={saved} /></div>
    </Card>
  );
}

// ─── MAIN ADMIN PANEL ─────────────────────────────────────────────────────────
const TABS = ['Profile', 'Resume', 'Skills', 'Projects', 'Experience'];

export default function AdminPanel() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_auth') === '1');
  const [activeTab, setActiveTab] = useState('Profile');
  const navigate = useNavigate();

  const handleLogin = () => {
    sessionStorage.setItem('admin_auth', '1');
    setAuthed(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setAuthed(false);
  };

  const handleReset = () => {
    if (window.confirm('⚠️ This will reset ALL customizations to defaults. Are you sure?')) {
      resetStore();
    }
  };

  if (!authed) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">⚙️</span>
          <div>
            <h1 className="font-extrabold text-white text-base leading-none">Portfolio Admin</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage your portfolio content</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors"
          >
            ← View Site
          </button>
          <label className="cursor-pointer text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors">
            📥 Import
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  try {
                    await importData(file);
                    alert('Data imported successfully!');
                  } catch (err) {
                    alert('Failed to import data: ' + err.message);
                  }
                  e.target.value = '';
                }
              }}
            />
          </label>
          <button
            onClick={exportData}
            className="text-xs font-semibold text-green-400 hover:text-green-300 px-3 py-1.5 rounded-lg border border-green-500/30 hover:border-green-400/60 transition-colors"
          >
            📤 Export
          </button>
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-orange-400 hover:text-orange-300 px-3 py-1.5 rounded-lg border border-orange-500/30 hover:border-orange-400/60 transition-colors"
          >
            Reset All
          </button>
          <button
            onClick={handleLogout}
            className="text-xs font-semibold text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg border border-red-500/30 hover:border-red-400/60 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 flex-wrap">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Info Banner */}
        <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl px-5 py-4 text-sm text-violet-300 space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-base mt-0.5">💾</span>
            <span>All changes are <strong>auto-saved to your browser</strong>. They will persist even after closing the tab. Use <strong>Reset All</strong> to go back to defaults.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-base mt-0.5">📤</span>
            <span>Use <strong>Export</strong> to download your data as a JSON file, then <strong>Import</strong> on other devices to sync changes.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-base mt-0.5">🌐</span>
            <span>For images/resume to work across all devices, use <strong>public external URLs</strong> (e.g., Google Drive, Dropbox, Imgur, etc.) instead of local file uploads.</span>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'Profile'    && <ProfileEditor setActiveTab={setActiveTab} />}
        {activeTab === 'Resume'     && <ResumeEditor />}
        {activeTab === 'Skills'     && <SkillsEditor />}
        {activeTab === 'Projects'   && <ProjectsEditor />}
        {activeTab === 'Experience' && <ExperienceEditor />}
      </div>
    </div>
  );
}
