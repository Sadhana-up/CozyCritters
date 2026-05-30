import React from "react";
import { motion } from "framer-motion";

const CloudLogo = ({ size = "md" }) => {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className={`${sizeMap[size]} fill-current`}
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Main cloud shape */}
      <path
        d="M 30 60 Q 25 60 25 55 Q 25 50 30 50 Q 30 40 40 40 Q 50 35 60 40 Q 70 35 75 45 Q 80 45 80 50 Q 80 55 75 60 Z"
        fill="currentColor"
        opacity="0.9"
      />

      {/* Inner cloud lighter tone */}
      <path
        d="M 35 58 Q 31 58 31 54 Q 31 51 35 51 Q 35 44 42 44 Q 50 40 58 44 Q 65 40 70 48 Q 73 48 73 52 Q 73 56 70 58 Z"
        fill="currentColor"
        opacity="0.6"
      />

      {/* Sparkle accent */}
      <circle cx="50" cy="48" r="2" fill="currentColor" opacity="0.8" />
      <circle cx="45" cy="52" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="60" cy="50" r="1.5" fill="currentColor" opacity="0.6" />
    </motion.svg>
  );
};

export default CloudLogo;
