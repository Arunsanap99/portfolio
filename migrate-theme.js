const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(srcDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Replace true white with CSS variable reference mapped to tailwind's config
  content = content.replace(/#ffffff/gi, 'rgb(var(--foreground))');
  content = content.replace(/#fff/gi, 'rgb(var(--foreground))');
  
  // Replace other hex colors depending on context
  content = content.replace(/#e5e5e5/gi, 'rgb(var(--foreground))');
  content = content.replace(/#d4d4d4/gi, 'rgb(var(--foreground))');
  content = content.replace(/#cccccc/gi, 'rgb(var(--secondary))');
  content = content.replace(/#a3a3a3/gi, 'rgb(var(--secondary-light))');
  content = content.replace(/#999999/gi, 'rgb(var(--secondary-light))');
  
  // Replace rgba(255,255,255, X) with rgba(var(--foreground), X)
  // This ensures the glassmorphism borders/backgrounds adapt to dark text in light mode
  content = content.replace(/rgba\(255,\s*255,\s*255,\s*([0-9.]+)\)/gi, 'rgba(var(--foreground), $1)');
  
  // Replace hardcoded rgba(0,0,0, X) shadows to adapt to light mode if needed
  content = content.replace(/rgba\(0,\s*0,\s*0,\s*([0-9.]+)\)/gi, 'rgba(var(--glow), $1)');

  // Fix Tailwind gradient classes to use foreground rather than hardcoded white
  content = content.replace(/from-white/g, 'from-foreground');
  content = content.replace(/to-zinc-400/g, 'to-foreground/60');
  content = content.replace(/text-white/g, 'text-foreground');
  content = content.replace(/bg-white/g, 'bg-foreground');
  content = content.replace(/border-white/g, 'border-foreground');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated: ' + path.basename(file));
  }
});

console.log("Theme migration complete! Start your development server to see the changes.");
