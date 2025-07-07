
import { useEffect, useState, useRef } from 'react';

const AnimatedCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number; timestamp: number }>>([]);
  const animationFrameRef = useRef<number>();
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = 'none';
    document.documentElement.style.cursor = 'none';
    
    let trailId = 0;

    const updateMousePosition = (e: MouseEvent) => {
      const newPosition = { x: e.clientX, y: e.clientY };
      
      // Calculate velocity for smoother movement
      velocityRef.current = {
        x: newPosition.x - lastPositionRef.current.x,
        y: newPosition.y - lastPositionRef.current.y
      };
      
      lastPositionRef.current = newPosition;
      
      // Use RAF for smoother cursor updates
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      animationFrameRef.current = requestAnimationFrame(() => {
        setMousePosition(newPosition);
        
        // Add trail point with smoother curve calculation
        setTrail(prev => {
          const distance = Math.sqrt(
            Math.pow(newPosition.x - (prev[prev.length - 1]?.x || 0), 2) +
            Math.pow(newPosition.y - (prev[prev.length - 1]?.y || 0), 2)
          );
          
          // Only add trail point if mouse moved enough distance for smoother curves
          if (distance > 3) {
            const newTrail = [...prev, { 
              x: newPosition.x, 
              y: newPosition.y, 
              id: trailId++, 
              timestamp: Date.now() 
            }];
            return newTrail.slice(-20); // Keep more points for smoother curves
          }
          return prev;
        });
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
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Restore default cursor on cleanup
      document.body.style.cursor = 'auto';
      document.documentElement.style.cursor = 'auto';
    };
  }, []);

  // Clean up old trail points with orbital animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail(prev => prev.filter(point => Date.now() - point.timestamp < 1500));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Smooth Curved Trail Lines */}
      {trail.map((point, index) => {
        if (index === 0) return null;
        
        const prevPoint = trail[index - 1];
        const nextPoint = trail[index + 1];
        const age = Date.now() - point.timestamp;
        const progress = Math.min(age / 1500, 1);
        
        // Calculate smooth curve using bezier-like interpolation
        let controlX = point.x;
        let controlY = point.y;
        
        if (nextPoint) {
          controlX = (prevPoint.x + nextPoint.x) / 2;
          controlY = (prevPoint.y + nextPoint.y) / 2;
        }
        
        // Calculate line properties with curve
        const dx = controlX - prevPoint.x;
        const dy = controlY - prevPoint.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        // Enhanced orbital 3D effect
        const orbitRadius = progress * 25;
        const orbitSpeed = progress * 720; // Two full rotations
        const orbitX = Math.cos(orbitSpeed * Math.PI / 180) * orbitRadius;
        const orbitY = Math.sin(orbitSpeed * Math.PI / 180) * orbitRadius * 0.6;
        const orbitZ = Math.sin(orbitSpeed * Math.PI / 90) * 10; // Z-axis movement
        
        return (
          <div
            key={point.id}
            className="fixed pointer-events-none z-50"
            style={{
              left: prevPoint.x,
              top: prevPoint.y,
              width: Math.max(length, 2),
              height: '3px',
              background: `linear-gradient(90deg, 
                rgba(147, 51, 234, ${0.9 * (1 - progress)}) 0%, 
                rgba(59, 130, 246, ${0.8 * (1 - progress)}) 30%, 
                rgba(236, 72, 153, ${0.7 * (1 - progress)}) 70%,
                rgba(255, 255, 255, ${0.6 * (1 - progress)}) 100%)`,
              borderRadius: '2px',
              transform: `rotate(${angle}deg) translate3d(${orbitX}px, ${orbitY}px, ${orbitZ}px) scale(${1 - progress * 0.3})`,
              transformOrigin: '0 50%',
              boxShadow: `0 0 ${8 * (1 - progress)}px rgba(147, 51, 234, ${0.8 * (1 - progress)}), 
                         0 0 ${16 * (1 - progress)}px rgba(59, 130, 246, ${0.6 * (1 - progress)}),
                         0 0 ${24 * (1 - progress)}px rgba(236, 72, 153, ${0.4 * (1 - progress)})`,
              opacity: Math.max(0, 1 - progress),
              transition: 'opacity 0.05s ease-out',
              filter: `blur(${progress * 2}px)`,
            }}
          />
        );
      })}

      {/* Enhanced Trail Dots with 3D Orbital Motion */}
      {trail.map((point, index) => {
        const age = Date.now() - point.timestamp;
        const progress = Math.min(age / 1500, 1);
        
        // Complex orbital motion
        const orbitRadius = progress * 30;
        const orbitSpeed = progress * 540 + index * 30;
        const orbitX = Math.cos(orbitSpeed * Math.PI / 180) * orbitRadius;
        const orbitY = Math.sin(orbitSpeed * Math.PI / 180) * orbitRadius * 0.7;
        const orbitZ = Math.cos(orbitSpeed * Math.PI / 120) * 15;
        
        return (
          <div
            key={`dot-${point.id}`}
            className="fixed pointer-events-none z-50 rounded-full"
            style={{
              left: point.x - 4 + orbitX,
              top: point.y - 4 + orbitY,
              width: `${8 * (1 - progress * 0.6)}px`,
              height: `${8 * (1 - progress * 0.6)}px`,
              background: `radial-gradient(circle, 
                rgba(255, 255, 255, ${0.9 * (1 - progress)}) 0%, 
                rgba(147, 51, 234, ${0.8 * (1 - progress)}) 30%, 
                rgba(59, 130, 246, ${0.6 * (1 - progress)}) 70%, 
                transparent 100%)`,
              boxShadow: `0 0 ${12 * (1 - progress)}px rgba(147, 51, 234, ${0.9 * (1 - progress)}),
                         0 0 ${20 * (1 - progress)}px rgba(59, 130, 246, ${0.6 * (1 - progress)})`,
              opacity: Math.max(0, 1 - progress),
              transform: `scale(${1 - progress * 0.2}) rotateX(${progress * 180}deg) translateZ(${orbitZ}px)`,
              transition: 'opacity 0.05s ease-out',
            }}
          />
        );
      })}
      
      {/* Main cursor with enhanced responsiveness */}
      <div
        className="fixed pointer-events-none z-50 rounded-full transition-all duration-75 ease-out"
        style={{
          left: mousePosition.x - (cursorVariant === 'hover' ? 14 : 10),
          top: mousePosition.y - (cursorVariant === 'hover' ? 14 : 10),
          width: cursorVariant === 'hover' ? '28px' : '20px',
          height: cursorVariant === 'hover' ? '28px' : '20px',
          background: cursorVariant === 'hover' 
            ? 'radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(147, 51, 234, 0.8) 30%, rgba(59, 130, 246, 0.6) 70%, rgba(236, 72, 153, 0.4) 100%)'
            : 'radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(147, 51, 234, 0.7) 50%, rgba(59, 130, 246, 0.5) 100%)',
          boxShadow: cursorVariant === 'hover'
            ? '0 0 25px rgba(255, 255, 255, 0.9), 0 0 50px rgba(147, 51, 234, 0.8), 0 0 75px rgba(59, 130, 246, 0.6)'
            : '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(147, 51, 234, 0.7)',
          transform: cursorVariant === 'hover' ? 'scale(1.3)' : 'scale(1)',
          filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))',
        }}
      />
    </>
  );
};

export { AnimatedCursor };
