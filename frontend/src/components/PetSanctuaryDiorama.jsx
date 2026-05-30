import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CozyCrittersLogo from "./CozyCrittersLogo";

const PetSanctuaryDiorama = () => {
  const [creatures, setCreatures] = useState([]);

  useEffect(() => {
    // Generate random creatures
    const items = Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      x: Math.random() * 60 + 20,
      delay: Math.random() * 2,
      duration: Math.random() * 4 + 4,
      y: Math.random() * 20,
    }));
    setCreatures(items);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective">
      {/* Glass dome container with 3D depth effect */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
        style={{
          transform: "perspective(1200px) rotateX(5deg)",
        }}
      >
        {/* Main diorama glass dome */}
        <div
          className="relative w-96 h-80 rounded-[48px] overflow-hidden bg-gradient-to-br from-white/30 via-white/20 to-white/10 backdrop-blur-md border-[4px] border-white/40 shadow-2xl"
          style={{
            boxShadow: `
              0 0 60px rgba(255, 200, 150, 0.3),
              0 20px 60px rgba(0, 0, 0, 0.1),
              inset -2px -2px 20px rgba(255, 255, 255, 0.5),
              inset 2px 2px 20px rgba(255, 200, 150, 0.1)
            `,
          }}
        >
          {/* Interior soft gradient glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFFAF5]/20 via-transparent to-[#FFE8D9]/10" />

          {/* House interior with glow */}
          <div
            className="absolute inset-8 rounded-3xl bg-gradient-to-br from-[#FFF5ED] to-[#FFE8D9] border-[3px] border-cozy-dark/20 flex items-center justify-center overflow-hidden"
            style={{
              boxShadow: `
                0 8px 32px rgba(255, 180, 100, 0.2),
                inset 0 2px 10px rgba(255, 255, 255, 0.6)
              `,
            }}
          >
            {/* Cozy interior */}
            <div className="relative w-full h-full p-4 flex items-center justify-center">
              {/* Window glow effects */}
              <div className="absolute top-2 left-2 w-12 h-10 rounded-lg bg-gradient-to-br from-[#FFE5CC] to-[#FFD9B3] opacity-80 blur-sm" />
              <div className="absolute top-2 right-2 w-12 h-10 rounded-lg bg-gradient-to-br from-[#FFE5CC] to-[#FFD9B3] opacity-80 blur-sm" />

              {/* Main pet sanctuary area */}
              <div className="scale-75 opacity-90">
                <CozyCrittersLogo size="xl" />
              </div>

              {/* Animated creatures moving around */}
              {creatures.map((creature) => (
                <motion.div
                  key={creature.id}
                  className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-cozy-pink/60 to-cozy-pink/30 border border-cozy-dark/30"
                  style={{
                    left: `${creature.x}%`,
                    top: `${30 + creature.y}%`,
                  }}
                  animate={{
                    x: [0, 30, -30, 0],
                    y: [0, -10, 10, 0],
                  }}
                  transition={{
                    duration: creature.duration,
                    repeat: Infinity,
                    delay: creature.delay,
                  }}
                >
                  <div className="w-full h-full rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-cozy-dark/40" />
                  </div>
                </motion.div>
              ))}

              {/* Floating hearts inside */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={`heart-${i}`}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 80 + 10}%`,
                  }}
                  animate={{
                    y: [-20, 10, -20],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                >
                  <span className="text-xs">✨</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Top glass shine effect */}
          <div className="absolute top-0 left-1/4 right-1/4 h-20 bg-gradient-to-b from-white/60 via-white/20 to-transparent blur-2xl rounded-t-full opacity-50" />

          {/* Bottom shadow/reflection */}
          <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/10 via-transparent to-transparent blur-xl" />
        </div>

        {/* Base platform with shadow */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-[420px] h-12 rounded-full bg-gradient-to-b from-cozy-dark/5 to-black/15 blur-2xl" />

        {/* Floating sparkles around dome */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full bg-cozy-pink/40"
            style={{
              left: `${Math.random() * 100 - 20}%`,
              top: `${Math.random() * 100 - 20}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 2 + 1.5,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default PetSanctuaryDiorama;
