import React, { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

const THEME_COLORS = {
  'theme-monochrome': {
    primary: '#ffffff',
    primaryLight: '#cccccc',
    secondary: '#888888',
    secondaryLight: '#aaaaaa',
    accent1: '#444444',
    accent2: '#666666',
    emissiveSec: '#444444',
  },
  'theme-blue': {
    primary: '#3b82f6',
    primaryLight: '#60a5fa',
    secondary: '#8b5cf6',
    secondaryLight: '#a78bfa',
    accent1: '#db2777',
    accent2: '#c084fc',
    emissiveSec: '#6d28d9',
  },
  'theme-green': {
    primary: '#10b981',
    primaryLight: '#34d399',
    secondary: '#059669',
    secondaryLight: '#6ee7b7',
    accent1: '#f59e0b',
    accent2: '#fbbf24',
    emissiveSec: '#047857',
  },
  'theme-rose': {
    primary: '#f43f5e',
    primaryLight: '#fb7185',
    secondary: '#e11d48',
    secondaryLight: '#fda4af',
    accent1: '#8b5cf6',
    accent2: '#a78bfa',
    emissiveSec: '#be123c',
  },
  'theme-orange': {
    primary: '#f97316',
    primaryLight: '#fb923c',
    secondary: '#ea580c',
    secondaryLight: '#fdba74',
    accent1: '#eab308',
    accent2: '#fde047',
    emissiveSec: '#c2410c',
  },
  'theme-purple': {
    primary: '#a855f7',
    primaryLight: '#c084fc',
    secondary: '#9333ea',
    secondaryLight: '#d8b4fe',
    accent1: '#3b82f6',
    accent2: '#60a5fa',
    emissiveSec: '#7e22ce',
  }
};

function ParticleField({ colors, ...props }) {
  const ref = useRef();
  // Generate random points in a sphere manually to avoid external dependency issues
  const [sphere] = useState(() => {
    const points = new Float32Array(1500); // 500 particles (x, y, z)
    for (let i = 0; i < points.length; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 1.5;
      points[i] = r * Math.sin(phi) * Math.cos(theta);
      points[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      points[i + 2] = r * Math.cos(phi);
    }
    return points;
  });


  useFrame((state, delta) => {
    // Slow rotation
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
    
    // Slight mouse reactivity
    const pointer = state.pointer;
    ref.current.rotation.x += (pointer.y * 0.2 - ref.current.rotation.x) * 0.05;
    ref.current.rotation.y += (pointer.x * 0.2 - ref.current.rotation.y) * 0.05;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color={colors.primary}
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

function FloatingWorkspace({ colors }) {
  const meshRef = useRef();
  const screenRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Floating oscillation
    meshRef.current.position.y = Math.sin(time * 0.8) * 0.15;
    
    // Follow mouse position slightly
    const pointer = state.pointer;
    meshRef.current.rotation.y = (pointer.x * 0.5 - meshRef.current.rotation.y) * 0.05;
    meshRef.current.rotation.x = (-pointer.y * 0.3 - meshRef.current.rotation.x) * 0.05;
  });

  return (
    <group ref={meshRef}>
      {/* Central Core - represent developer intelligence */}
      <mesh position={[0, 0, 0]}>
        <dodecahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial 
          color={colors.secondary} 
          wireframe 
          emissive={colors.emissiveSec} 
          emissiveIntensity={0.5} 
        />
      </mesh>

      {/* Halo rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.8, 0.02, 16, 100]} />
        <meshBasicMaterial color={colors.primary} transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[1.0, 0.01, 8, 80]} />
        <meshBasicMaterial color={colors.accent1} transparent opacity={0.2} />
      </mesh>
      
      {/* Interactive Orbiting Nodes */}
      <mesh position={[0.9, 0.2, 0.4]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={colors.primaryLight} emissive={colors.primary} emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.8, -0.3, -0.5]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={colors.secondaryLight} emissive={colors.secondary} emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

export default function ThreeBackground() {
  const [hasError, setHasError] = useState(false);
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem('portfolio-theme') || 'theme-purple';
  });

  useEffect(() => {
    const handleThemeChange = (e) => setActiveTheme(e.detail);
    window.addEventListener('theme-change', handleThemeChange);
    return () => window.removeEventListener('theme-change', handleThemeChange);
  }, []);

  const colors = THEME_COLORS[activeTheme] || THEME_COLORS['theme-blue'];

  // Fallback styling in case WebGL triggers errors or is disabled
  if (hasError) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden bg-background">
        <div 
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[120px] animate-pulse-glow transition-all duration-1000" 
          style={{ background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)` }}
        />
        <div 
          className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full opacity-15 blur-[120px] animate-pulse-glow transition-all duration-1000" 
          style={{ background: `radial-gradient(circle, ${colors.secondary} 0%, transparent 70%)`, animationDelay: '2s' }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-background">
      {/* Ambient background glows that react to the theme selector */}
      <div 
        className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full opacity-20 blur-[130px] animate-pulse-glow transition-all duration-1000 pointer-events-none"
        style={{ 
          background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)` 
        }} 
      />
      <div 
        className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full opacity-15 blur-[130px] animate-pulse-glow transition-all duration-1000 pointer-events-none"
        style={{ 
          background: `radial-gradient(circle, ${colors.secondary} 0%, transparent 70%)`,
          animationDelay: '1.5s' 
        }} 
      />
      <div 
        className="absolute top-[40%] left-[30%] w-[50%] h-[40%] rounded-full opacity-[0.08] blur-[150px] transition-all duration-1000 pointer-events-none"
        style={{ 
          background: `radial-gradient(circle, ${colors.accent1 || colors.primary} 0%, transparent 70%)` 
        }} 
      />

      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        onError={() => setHasError(true)}
        style={{ pointerEvents: 'auto', position: 'relative', zIndex: 1 }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color={colors.accent2} />
        <pointLight position={[-10, -10, -10]} intensity={1} color={colors.primaryLight} />
        <Suspense fallback={null}>
          <ParticleField colors={colors} />
          <FloatingWorkspace colors={colors} />
        </Suspense>
      </Canvas>
    </div>
  );
}
