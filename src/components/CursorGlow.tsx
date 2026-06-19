import { useEffect, useState, useRef } from 'react';

export function CursorGlow() {
  const [pos, setPos] = useState({ x: -999, y: -999 });
  const [visible, setVisible] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        setPos({ x: e.clientX, y: e.clientY });
        setVisible(true);
      });
    };
    const leave = () => setVisible(false);
    window.addEventListener('mousemove', handler, { passive: true });
    document.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', handler);
      document.removeEventListener('mouseleave', leave);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      {/* Main glow — brighter, larger */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
        style={{
          opacity: visible ? 1 : 0,
          background: `radial-gradient(500px circle at ${pos.x}px ${pos.y}px, rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.05) 45%, transparent 70%)`,
        }}
      />
      {/* Secondary warmer glow at 2x radius for atmospheric falloff */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500"
        style={{
          opacity: visible ? 1 : 0,
          background: `radial-gradient(900px circle at ${pos.x}px ${pos.y}px, rgba(129, 140, 248, 0.04), transparent 60%)`,
        }}
      />
    </>
  );
}
