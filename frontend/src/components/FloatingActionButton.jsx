import React from "react";
import { motion } from "framer-motion";

const FloatingActionButton = ({
  icon,
  label,
  onClick,
  color = "pink",
  position,
  delay = 0,
  size = "md",
}) => {
  const colorMap = {
    pink: {
      bg: "from-cozy-pink to-[#FF99A3]",
      glow: "from-cozy-pink/40",
    },
    sky: {
      bg: "from-cozy-sky to-[#81D4FA]",
      glow: "from-cozy-sky/40",
    },
    green: {
      bg: "from-cozy-green to-[#A5D6A7]",
      glow: "from-cozy-green/40",
    },
    yellow: {
      bg: "from-cozy-yellow to-[#FFE082]",
      glow: "from-cozy-yellow/40",
    },
  };

  const sizeMap = {
    sm: { button: "w-12 h-12", icon: "text-2xl", label: "text-xs" },
    md: { button: "w-16 h-16", icon: "text-4xl", label: "text-sm" },
    lg: { button: "w-20 h-20", icon: "text-5xl", label: "text-base" },
  };

  const c = colorMap[color];
  const s = sizeMap[size];

  return (
    <motion.div
      className={`absolute flex flex-col items-center gap-2`}
      style={position}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
    >
      {/* Floating orbit motion */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay }}
      >
        {/* Glow halo */}
        <motion.div
          className={`absolute -inset-2 rounded-full bg-gradient-to-r ${c.glow} to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity`}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay,
          }}
        />

        {/* Main button */}
        <button
          onClick={onClick}
          className={`group relative ${s.button} rounded-full bg-gradient-to-b ${c.bg} cursor-pointer transform transition-all hover:shadow-2xl active:scale-95
            shadow-[0_8px_0_rgba(100,100,100,0.2),_0_0_30px_rgba(255,150,150,0.2)]`}
          style={{
            boxShadow: `
              0 10px 25px rgba(0, 0, 0, 0.1),
              inset -1px -1px 10px rgba(255, 255, 255, 0.4),
              inset 1px 1px 10px rgba(0, 0, 0, 0.05)
            `,
          }}
        >
          {/* Inner shine */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

          {/* Icon */}
          <div
            className={`relative z-10 ${s.icon} flex items-center justify-center`}
          >
            {icon}
          </div>
        </button>
      </motion.div>

      {/* Label */}
      <motion.div
        className={`${s.label} font-bold text-cozy-dark/70 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full border border-cozy-dark/10 whitespace-nowrap pointer-events-none`}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, delay }}
      >
        {label}
      </motion.div>
    </motion.div>
  );
};

export default FloatingActionButton;
