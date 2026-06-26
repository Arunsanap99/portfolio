import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function handleResumeClick(e, resumeUrl) {
  if (!resumeUrl || resumeUrl === '#') {
    e.preventDefault();
    alert('No resume uploaded yet.');
    return;
  }
  if (resumeUrl.startsWith('data:application/pdf')) {
    e.preventDefault();
    try {
      const base64Parts = resumeUrl.split(',');
      const byteCharacters = atob(base64Parts[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } catch (err) {
      console.error('Error opening base64 PDF:', err);
      // Fallback: download
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = 'Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

export function compressImage(file, callback, options = {}) {
  const {
    maxWidth = 1600,
    maxHeight = 1200,
    format = 'image/png',
    quality = 0.92
  } = options;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Only resize if the image actually exceeds the limits
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL(format, quality);
      callback(dataUrl);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

export function base64ToBlobUrl(base64Data, contentType = 'application/pdf') {
  try {
    const base64Parts = base64Data.split(',');
    const byteCharacters = atob(base64Parts[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: contentType });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error('Error converting base64 to Blob URL:', err);
    return base64Data; // fallback to original data URL
  }
}
