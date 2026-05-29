import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const FloatingHearts = ({ count = 15, nightMode = false }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate static particle properties so they don't change on every render
    const items = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage from left
      size: Math.random() * 8 + 4, // size in pixels (smaller, more subtle)
      delay: Math.random() * 10,
      duration: Math.random() * 15 + 20, // float speed (s)
      opacity: Math.random() * 0.25 + 0.08,
      drift: Math.random() * 80 - 40, // horizontal drift
    }));
    setParticles(items);
  }, [count, nightMode]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute select-none rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: '-50px',
            opacity: p.opacity,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: nightMode 
              ? `rgba(200, 180, 220, ${p.opacity * 0.6})`
              : `rgba(255, 200, 200, ${p.opacity * 0.8})`,
            boxShadow: nightMode
              ? `0 0 ${p.size / 2}px rgba(200, 180, 220, ${p.opacity * 0.4})`
              : `0 0 ${p.size / 2}px rgba(255, 200, 200, ${p.opacity * 0.5})`,
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: '-110vh',
            x: p.drift,
            opacity: [0, p.opacity, p.opacity, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingHearts;
