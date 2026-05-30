import React from "react";
import { motion } from "framer-motion";

const Jelly3DButton = ({
  children,
  onClick,
  variant = "pink",
  className = "",
  disabled = false,
  type = "button",
}) => {
  const variantStyles = {
    pink: {
      bg: "bg-gradient-to-b from-[#FFB3BA] to-[#FF99A3]",
      shadow:
        "shadow-[0_8px_0_rgba(255,120,120,0.4), 0_0_30px_rgba(255,150,150,0.3)]",
      glow: "from-cozy-pink/40 to-transparent",
    },
    sky: {
      bg: "bg-gradient-to-b from-[#B3E5FF] to-[#81D4FA]",
      shadow:
        "shadow-[0_8px_0_rgba(100,180,255,0.4), 0_0_30px_rgba(150,200,255,0.3)]",
      glow: "from-cozy-sky/40 to-transparent",
    },
    green: {
      bg: "bg-gradient-to-b from-[#C8E6C9] to-[#A5D6A7]",
      shadow:
        "shadow-[0_8px_0_rgba(100,180,100,0.4), 0_0_30px_rgba(150,200,150,0.3)]",
      glow: "from-cozy-green/40 to-transparent",
    },
  };

  const style = variantStyles[variant];

  return (
    <div className="relative inline-block">
      {/* Outer glow halo */}
      <motion.div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-b ${style.glow} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        style={{ transform: "scale(1.1)" }}
      />

      {/* Main button */}
      <motion.button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`relative group px-8 py-4 text-base font-black rounded-3xl border-none cursor-pointer select-none overflow-hidden
          ${style.bg} ${style.shadow}
          transition-all duration-200 active:scale-95
          hover:scale-105 
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${className}`}
        whileHover={{ y: -3 }}
        whileTap={{ y: 0 }}
      >
        {/* Inner highlight shine */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent rounded-3xl pointer-events-none" />

        {/* Button content with perspective */}
        <span className="relative z-10 text-cozy-dark drop-shadow-sm flex items-center justify-center gap-2">
          {children}
        </span>

        {/* Bouncy elasticity indicator */}
        <motion.div
          className="absolute -bottom-full left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-white/20 blur-lg"
          animate={{ y: [0, 30, 0], opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
        />
      </motion.button>
    </div>
  );
};

export default Jelly3DButton;
