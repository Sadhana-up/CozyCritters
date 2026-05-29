import React from "react";
import { motion } from "framer-motion";

const AnimatedCritter = ({ className = "w-32 h-32", actionState = "idle" }) => {
  const animations = {
    idle: {
      y: [0, -8, 0],
      rotate: [0, 1, -1, 0],
    },
    happy: {
      y: [0, -12, 0],
      scale: [1, 1.05, 1],
    },
    sad: {
      y: [0, -3, 0],
      rotate: [0, -2, 2, 0],
    },
  };

  const currentAnimation = animations[actionState] || animations.idle;

  return (
    <motion.svg
      viewBox="0 0 120 120"
      className={className}
      animate={currentAnimation}
      transition={{
        duration: actionState === "idle" ? 3 : 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Shadow */}
      <ellipse
        cx="60"
        cy="110"
        rx="35"
        ry="8"
        fill="currentColor"
        opacity="0.1"
      />

      {/* Body */}
      <motion.g>
        <ellipse
          cx="60"
          cy="65"
          rx="28"
          ry="32"
          fill="#FFE5E5"
          stroke="#D4987C"
          strokeWidth="2"
        />

        {/* Belly spot */}
        <ellipse cx="60" cy="75" rx="16" ry="18" fill="#FFF5F5" opacity="0.8" />
      </motion.g>

      {/* Left arm */}
      <motion.g
        animate={{
          rotate:
            actionState === "happy"
              ? [0, -15, 0]
              : actionState === "sad"
                ? [-5, -5, -5]
                : [-8, 8, -8],
        }}
        transition={{
          duration: actionState === "idle" ? 3 : 2,
          repeat: Infinity,
        }}
        style={{ transformOrigin: "40px 55px" }}
      >
        <ellipse
          cx="35"
          cy="65"
          rx="10"
          ry="18"
          fill="#FFD9D9"
          stroke="#D4987C"
          strokeWidth="1.5"
        />
        {/* Paw */}
        <circle
          cx="32"
          cy="83"
          r="7"
          fill="#FFE5E5"
          stroke="#D4987C"
          strokeWidth="1.5"
        />
        <circle cx="28" cy="85" r="2" fill="#D4987C" opacity="0.5" />
        <circle cx="32" cy="88" r="2" fill="#D4987C" opacity="0.5" />
        <circle cx="36" cy="86" r="2" fill="#D4987C" opacity="0.5" />
      </motion.g>

      {/* Right arm */}
      <motion.g
        animate={{
          rotate:
            actionState === "happy"
              ? [0, 15, 0]
              : actionState === "sad"
                ? [5, 5, 5]
                : [8, -8, 8],
        }}
        transition={{
          duration: actionState === "idle" ? 3 : 2,
          repeat: Infinity,
          delay: 0.1,
        }}
        style={{ transformOrigin: "80px 55px" }}
      >
        <ellipse
          cx="85"
          cy="65"
          rx="10"
          ry="18"
          fill="#FFD9D9"
          stroke="#D4987C"
          strokeWidth="1.5"
        />
        {/* Paw */}
        <circle
          cx="88"
          cy="83"
          r="7"
          fill="#FFE5E5"
          stroke="#D4987C"
          strokeWidth="1.5"
        />
        <circle cx="92" cy="85" r="2" fill="#D4987C" opacity="0.5" />
        <circle cx="88" cy="88" r="2" fill="#D4987C" opacity="0.5" />
        <circle cx="84" cy="86" r="2" fill="#D4987C" opacity="0.5" />
      </motion.g>

      {/* Head */}
      <ellipse
        cx="60"
        cy="42"
        rx="24"
        ry="26"
        fill="#FFE5E5"
        stroke="#D4987C"
        strokeWidth="2"
      />

      {/* Ears */}
      <motion.g
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <ellipse
          cx="42"
          cy="22"
          rx="8"
          ry="12"
          fill="#FFD9D9"
          stroke="#D4987C"
          strokeWidth="1.5"
        />
        <ellipse cx="42" cy="24" rx="4" ry="6" fill="#FFEAEA" />
      </motion.g>

      <motion.g
        animate={{ rotate: [5, -5, 5] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.1 }}
      >
        <ellipse
          cx="78"
          cy="22"
          rx="8"
          ry="12"
          fill="#FFD9D9"
          stroke="#D4987C"
          strokeWidth="1.5"
        />
        <ellipse cx="78" cy="24" rx="4" ry="6" fill="#FFEAEA" />
      </motion.g>

      {/* Eyes */}
      <motion.g
        animate={{ scaleY: actionState === "sad" ? [1, 0.3, 1] : [1, 0.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      >
        <circle cx="50" cy="38" r="3.5" fill="#3D2817" />
        <circle cx="70" cy="38" r="3.5" fill="#3D2817" />
        {/* Eye shine */}
        <circle cx="51" cy="37" r="1.2" fill="white" opacity="0.8" />
        <circle cx="71" cy="37" r="1.2" fill="white" opacity="0.8" />
      </motion.g>

      {/* Mouth */}
      {actionState === "happy" && (
        <motion.path
          d="M 54 48 Q 60 52 66 48"
          stroke="#D4987C"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          animate={{ scaleY: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {actionState === "sad" && (
        <motion.path
          d="M 54 52 Q 60 48 66 52"
          stroke="#D4987C"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      )}

      {actionState === "idle" && (
        <line
          x1="54"
          y1="50"
          x2="66"
          y2="50"
          stroke="#D4987C"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}

      {/* Nose */}
      <ellipse cx="60" cy="46" rx="2" ry="2.5" fill="#D4987C" opacity="0.6" />

      {/* Tail */}
      <motion.path
        d="M 75 75 Q 95 70 98 50 Q 99 35 92 28"
        stroke="#FFD9D9"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{
          pathLength: actionState === "happy" ? [0.5, 1, 0.5] : [0.4, 0.9, 0.4],
        }}
        transition={{
          duration: actionState === "idle" ? 2.5 : 1.5,
          repeat: Infinity,
        }}
      />

      {/* Cheeks blush */}
      {actionState !== "sad" && (
        <>
          <circle cx="30" cy="45" r="5" fill="#FFB3BA" opacity="0.3" />
          <circle cx="90" cy="45" r="5" fill="#FFB3BA" opacity="0.3" />
        </>
      )}
    </motion.svg>
  );
};

export default AnimatedCritter;
