import React from "react";
import { motion } from "framer-motion";

const CozyCrittersLogo = ({ size = "md" }) => {
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
      {/* House/home base */}
      <path
        d="M 20 60 L 20 80 Q 20 85 25 85 L 75 85 Q 80 85 80 80 L 80 60"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Roof */}
      <path
        d="M 15 60 L 50 35 L 85 60"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Roof accent */}
      <path
        d="M 50 35 L 50 50"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 2"
        opacity="0.5"
      />

      {/* Door */}
      <rect
        x="43"
        y="65"
        width="14"
        height="20"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* Door handle */}
      <circle cx="54" cy="75" r="1.5" fill="currentColor" />

      {/* Window left */}
      <rect
        x="28"
        y="50"
        width="10"
        height="10"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="33"
        y1="50"
        x2="33"
        y2="60"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.6"
      />
      <line
        x1="28"
        y1="55"
        x2="38"
        y2="55"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.6"
      />

      {/* Window right */}
      <rect
        x="62"
        y="50"
        width="10"
        height="10"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="67"
        y1="50"
        x2="67"
        y2="60"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.6"
      />
      <line
        x1="62"
        y1="55"
        x2="72"
        y2="55"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.6"
      />

      {/* Chimney */}
      <rect
        x="72"
        y="40"
        width="5"
        height="12"
        rx="1"
        fill="currentColor"
        opacity="0.3"
      />
      <line
        x1="72"
        y1="42"
        x2="77"
        y2="42"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Cute critter peeking from window */}
      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Critter head in left window */}
        <circle cx="33" cy="50" r="4.5" fill="currentColor" opacity="0.7" />
        {/* Eyes */}
        <circle cx="30.5" cy="49" r="0.8" fill="white" />
        <circle cx="35.5" cy="49" r="0.8" fill="white" />
        {/* Happy expression */}
        <path
          d="M 30 51 Q 33 52 36 51"
          stroke="white"
          strokeWidth="0.8"
          fill="none"
          strokeLinecap="round"
          opacity="0.8"
        />
      </motion.g>
    </motion.svg>
  );
};

export default CozyCrittersLogo;
