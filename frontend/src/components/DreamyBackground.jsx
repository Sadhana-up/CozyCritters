import React from "react";
import { motion } from "framer-motion";

const DreamyBackground = () => {
  // Parallax cloud layers
  const clouds = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: Math.random() * 200 + 100,
    opacity: Math.random() * 0.15 + 0.05,
    delay: Math.random() * 20,
    duration: Math.random() * 80 + 100,
    yOffset: Math.random() * 30 - 15,
    depth: Math.random() * 100,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient sky backdrop with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF0E6] via-[#FFE8D9] to-[#FFEAE5]" />

      {/* Soft ambient light glow top */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-96 bg-gradient-radial from-[#FFDBCC]/40 via-transparent to-transparent blur-3xl" />

      {/* Warm side glow right */}
      <div className="absolute -right-32 top-1/3 w-96 h-96 bg-gradient-radial from-[#FFD4CC]/20 via-transparent to-transparent blur-3xl rounded-full" />

      {/* Soft left glow */}
      <div className="absolute -left-40 top-1/2 w-[500px] h-[500px] bg-gradient-radial from-[#F0E5FF]/15 via-transparent to-transparent blur-3xl rounded-full" />

      {/* Parallax floating clouds */}
      {clouds.map((cloud) => (
        <motion.div
          key={cloud.id}
          className="absolute rounded-full blur-2xl"
          style={{
            width: cloud.size,
            height: cloud.size * 0.6,
            opacity: cloud.opacity,
            background: `radial-gradient(ellipse at 30% 30%, rgba(255,220,200,${cloud.opacity}), transparent)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            zIndex: Math.floor(cloud.depth),
          }}
          animate={{
            x: [0, 80, 0],
            y: [cloud.yOffset, cloud.yOffset - 20, cloud.yOffset],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: cloud.duration,
            repeat: Infinity,
            delay: cloud.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating dust particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`dust-${i}`}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            background: `rgba(${200 + Math.random() * 55}, ${170 + Math.random() * 55}, ${200 + Math.random() * 55}, ${Math.random() * 0.3 + 0.05})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0, Math.random() * 0.3 + 0.1, 0],
          }}
          transition={{
            duration: Math.random() * 20 + 15,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Bottom soft fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white/50 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default DreamyBackground;
