import React, { useEffect, useState } from 'react';
import { useMousePosition } from '../hooks/useMousePosition';

export default function CustomCursor() {
  const { x, y } = useMousePosition();
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show cursor only when mouse moves
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Track if hovering over buttons/interactive items
    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.classList.contains('interactive');
      setIsHovered(!!isInteractive);
    };

    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Don't render on mobile/touch screens
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    const checkTouch = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches || ('ontouchstart' in window));
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  if (isMobile || !isVisible) return null;

  return (
    <>
      {/* Lag follower ring */}
      <div 
        className="custom-cursor transition-transform duration-75"
        style={{
          left: `${x}px`,
          top: `${y}px`,
          transform: `translate(-50%, -50%) scale(${isHovered ? 1.5 : 1})`,
          borderColor: isHovered ? '#8b5cf6' : '#3b82f6',
          backgroundColor: isHovered ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
        }}
      />
      {/* Instant point dot */}
      <div 
        className="custom-cursor-dot"
        style={{
          left: `${x}px`,
          top: `${y}px`,
          transform: 'translate(-50%, -50%)',
          backgroundColor: isHovered ? '#3b82f6' : '#8b5cf6',
        }}
      />
    </>
  );
}
