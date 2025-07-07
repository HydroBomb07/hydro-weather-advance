
import { useEffect, useState } from 'react';

const AnimatedCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number; timestamp: number }>>([]);

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = 'none';
    document.documentElement.style.cursor = 'none';
    
    let trailId = 0;

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Add trail point with timestamp for orbital animation
      setTrail(prev => {
        const newTrail = [...prev, { 
          x: e.clientX, 
          y: e.clientY, 
          id: trailId++, 
          timestamp: Date.now() 
        }];
        return newTrail.slice(-15); // Keep more trail points for smoother effect
      });
    };

    const handleMouseEnter = () => setCursorVariant('hover');
    const handleMouseLeave = () => setCursorVariant('default');

    document.addEventListener('mousemove', updateMousePosition);
    
    // Add event listeners for interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, [role="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      
      // Restore default cursor on cleanup
      document.body.style.cursor = 'auto';
      document.documentElement.style.cursor = 'auto';
    };
  }, []);

  // Clean up old trail points with orbital animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail(prev => prev.filter(point => Date.now() - point.timestamp < 2000));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Glowing Trail Lines */}
      {trail.map((point, index) => {
        if (index === 0) return null;
        
        const prevPoint = trail[index - 1];
        const age = Date.now() - point.timestamp;
        const progress = Math.min(age / 2000, 1); // 2 second lifecycle
        
        // Calculate line properties
        const dx = point.x - prevPoint.x;
        const dy = point.y - prevPoint.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        // Orbital 3D effect calculations
        const orbitRadius = progress * 20; // Increase radius over time
        const orbitSpeed = progress * 360 * 2; // Multiple rotations
        const orbitX = Math.cos(orbitSpeed * Math.PI / 180) * orbitRadius;
        const orbitY = Math.sin(orbitSpeed * Math.PI / 180) * orbitRadius * 0.5; // Flatten for 3D effect
        
        return (
          <div
            key={point.id}
            className="fixed pointer-events-none z-50"
            style={{
              left: prevPoint.x,
              top: prevPoint.y,
              width: length,
              height: '2px',
              background: `linear-gradient(90deg, 
                rgba(147, 51, 234, ${0.8 * (1 - progress)}) 0%, 
                rgba(59, 130, 246, ${0.6 * (1 - progress)}) 50%, 
                rgba(236, 72, 153, ${0.4 * (1 - progress)}) 100%)`,
              borderRadius: '1px',
              transform: `rotate(${angle}deg) translate(${orbitX}px, ${orbitY}px) scale(${1 - progress * 0.5})`,
              transformOrigin: '0 50%',
              boxShadow: `0 0 ${6 * (1 - progress)}px rgba(147, 51, 234, ${0.6 * (1 - progress)}), 
                         0 0 ${12 * (1 - progress)}px rgba(59, 130, 246, ${0.4 * (1 - progress)})`,
              opacity: Math.max(0, 1 - progress),
              transition: 'opacity 0.1s ease-out, transform 0.1s ease-out',
            }}
          />
        );
      })}

      {/* Trail Dots with Orbital Motion */}
      {trail.map((point, index) => {
        const age = Date.now() - point.timestamp;
        const progress = Math.min(age / 2000, 1);
        
        // Orbital motion for dots
        const orbitRadius = progress * 25;
        const orbitSpeed = progress * 360 * 1.5;
        const orbitX = Math.cos(orbitSpeed * Math.PI / 180) * orbitRadius;
        const orbitY = Math.sin(orbitSpeed * Math.PI / 180) * orbitRadius * 0.6;
        
        return (
          <div
            key={`dot-${point.id}`}
            className="fixed pointer-events-none z-50 rounded-full"
            style={{
              left: point.x - 3 + orbitX,
              top: point.y - 3 + orbitY,
              width: `${6 * (1 - progress * 0.7)}px`,
              height: `${6 * (1 - progress * 0.7)}px`,
              background: `radial-gradient(circle, 
                rgba(147, 51, 234, ${0.9 * (1 - progress)}) 0%, 
                rgba(59, 130, 246, ${0.7 * (1 - progress)}) 50%, 
                transparent 100%)`,
              boxShadow: `0 0 ${8 * (1 - progress)}px rgba(147, 51, 234, ${0.8 * (1 - progress)})`,
              opacity: Math.max(0, 1 - progress),
              transform: `scale(${1 - progress * 0.3}) rotateX(${progress * 180}deg)`,
              transition: 'opacity 0.1s ease-out, transform 0.1s ease-out',
            }}
          />
        );
      })}
      
      {/* Main cursor with enhanced glow */}
      <div
        className="fixed pointer-events-none z-50 rounded-full"
        style={{
          left: mousePosition.x - (cursorVariant === 'hover' ? 12 : 8),
          top: mousePosition.y - (cursorVariant === 'hover' ? 12 : 8),
          width: cursorVariant === 'hover' ? '24px' : '16px',
          height: cursorVariant === 'hover' ? '24px' : '16px',
          background: cursorVariant === 'hover' 
            ? 'radial-gradient(circle, rgba(147, 51, 234, 0.9) 0%, rgba(59, 130, 246, 0.7) 50%, rgba(236, 72, 153, 0.5) 100%)'
            : 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(147, 51, 234, 0.6) 100%)',
          boxShadow: cursorVariant === 'hover'
            ? '0 0 20px rgba(147, 51, 234, 0.8), 0 0 40px rgba(59, 130, 246, 0.6), 0 0 60px rgba(236, 72, 153, 0.4)'
            : '0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(147, 51, 234, 0.6)',
          transition: 'all 0.2s ease-out',
          transform: cursorVariant === 'hover' ? 'scale(1.2)' : 'scale(1)',
        }}
      />
    </>
  );
};

export { AnimatedCursor };
