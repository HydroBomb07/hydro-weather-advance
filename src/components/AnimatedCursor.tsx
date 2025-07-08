import { useEffect, useRef, useCallback } from 'react';

const AnimatedCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<SVGSVGElement>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();
  const trailPointsRef = useRef<Array<{ x: number; y: number; opacity: number }>>([]);

  const updateCursor = useCallback(() => {
    if (!cursorRef.current || !trailRef.current) return;

    const { x, y } = mousePositionRef.current;
    
    // Update main cursor position with transform3d for better performance
    cursorRef.current.style.transform = `translate3d(${x - 10}px, ${y - 10}px, 0)`;

    // Update trail points less frequently for better performance
    trailPointsRef.current.unshift({ x, y, opacity: 1 });
    
    // Keep only necessary trail points
    if (trailPointsRef.current.length > 15) {
      trailPointsRef.current = trailPointsRef.current.slice(0, 15);
    }

    // Update trail path
    const pathElement = trailRef.current.querySelector('path');
    if (pathElement && trailPointsRef.current.length > 1) {
      let pathData = `M ${trailPointsRef.current[0].x} ${trailPointsRef.current[0].y}`;
      
      for (let i = 1; i < trailPointsRef.current.length; i++) {
        const point = trailPointsRef.current[i];
        const prevPoint = trailPointsRef.current[i - 1];
        
        // Create smooth curves
        const cpx = (prevPoint.x + point.x) / 2;
        const cpy = (prevPoint.y + point.y) / 2;
        
        pathData += ` Q ${prevPoint.x} ${prevPoint.y} ${cpx} ${cpy}`;
        
        // Update opacity for fade effect
        point.opacity = Math.max(0, 1 - (i / trailPointsRef.current.length));
      }
      
      pathElement.setAttribute('d', pathData);
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePositionRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    // Use requestAnimationFrame for smooth animation
    const animate = () => {
      updateCursor();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleMouseMove, updateCursor]);

  return (
    <>
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>
      
      {/* Trail SVG */}
      <svg
        ref={trailRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
        style={{ mixBlendMode: 'screen' }}
      >
        <defs>
          <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(147, 51, 234, 0.8)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.6)" />
            <stop offset="100%" stopColor="rgba(16, 185, 129, 0.4)" />
          </linearGradient>
        </defs>
        <path
          stroke="url(#trailGradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'blur(1px)' }}
        />
      </svg>

      {/* Main cursor */}
      <div
        ref={cursorRef}
        className="fixed w-5 h-5 pointer-events-none z-50 will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.8) 0%, rgba(59, 130, 246, 0.6) 50%, transparent 70%)',
          borderRadius: '50%',
          boxShadow: '0 0 20px rgba(147, 51, 234, 0.6), 0 0 40px rgba(59, 130, 246, 0.4)',
          filter: 'blur(0.5px)',
        }}
      />
    </>
  );
};

export { AnimatedCursor };
