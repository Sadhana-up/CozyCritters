import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const FloatingIslandEnvironment = () => {
  const clouds = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 80,
    size: Math.random() * 150 + 80,
    opacity: Math.random() * 0.3 + 0.1,
    duration: Math.random() * 60 + 80,
    delay: Math.random() * 10,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Multi-layer gradient sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF5F9] via-[#FFE8F5] to-[#E8F0FF]" />

      {/* Soft radial glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-[#FFE0F0]/30 via-transparent to-transparent blur-3xl rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-[#E0E8FF]/25 via-transparent to-transparent blur-3xl rounded-full" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-radial from-[#FFF0E6]/20 via-transparent to-transparent blur-3xl rounded-full" />

      {/* Floating dreamy clouds/islands */}
      {clouds.map((cloud) => (
        <motion.div
          key={cloud.id}
          className="absolute rounded-full blur-2xl"
          style={{
            width: cloud.size,
            height: cloud.size * 0.4,
            background: `radial-gradient(ellipse at 30% 30%, rgba(255,220,240,${cloud.opacity}), rgba(200,180,220,${cloud.opacity * 0.3}), transparent)`,
            left: `${cloud.x}%`,
            top: `${cloud.y}%`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 60, 0],
          }}
          transition={{
            duration: cloud.duration,
            repeat: Infinity,
            delay: cloud.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle floating particles */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            background: `rgba(${220 + Math.random() * 35}, ${180 + Math.random() * 60}, ${240 + Math.random() * 15}, ${Math.random() * 0.4})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-50, 100, -50],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, Math.random() * 0.5 + 0.1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 15 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Distant floating stars */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 40}%`,
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        >
          <div className="text-2xl">✨</div>
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingIslandEnvironment;
