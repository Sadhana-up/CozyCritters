import React from "react";
import { motion } from "framer-motion";

const AnimatedCritter = ({
  className = "w-32 h-32",
  actionState = "idle",
  petType = "bunny",
}) => {
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

  // Pet renderer functions
  const renderBunny = () => (
    <>
      <ellipse
        cx="60"
        cy="110"
        rx="35"
        ry="8"
        fill="currentColor"
        opacity="0.1"
      />
      <ellipse
        cx="60"
        cy="65"
        rx="28"
        ry="32"
        fill="#FFE5E5"
        stroke="#D4987C"
        strokeWidth="2"
      />
      <ellipse cx="60" cy="75" rx="16" ry="18" fill="#FFF5F5" opacity="0.8" />
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
      <ellipse
        cx="60"
        cy="42"
        rx="24"
        ry="26"
        fill="#FFE5E5"
        stroke="#D4987C"
        strokeWidth="2"
      />
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
      <motion.g
        animate={{ scaleY: actionState === "sad" ? [1, 0.3, 1] : [1, 0.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      >
        <circle cx="50" cy="38" r="3.5" fill="#3D2817" />
        <circle cx="70" cy="38" r="3.5" fill="#3D2817" />
        <circle cx="51" cy="37" r="1.2" fill="white" opacity="0.8" />
        <circle cx="71" cy="37" r="1.2" fill="white" opacity="0.8" />
      </motion.g>
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
      <ellipse cx="60" cy="46" rx="2" ry="2.5" fill="#D4987C" opacity="0.6" />
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
      {actionState !== "sad" && (
        <>
          <circle cx="30" cy="50" r="5" fill="#FFB6D9" opacity="0.4" />
          <circle cx="90" cy="50" r="5" fill="#FFB6D9" opacity="0.4" />
        </>
      )}
    </>
  );

  const renderHamster = () => (
    <>
      <ellipse
        cx="60"
        cy="110"
        rx="35"
        ry="8"
        fill="currentColor"
        opacity="0.1"
      />
      <ellipse
        cx="60"
        cy="70"
        rx="32"
        ry="28"
        fill="#FFB88C"
        stroke="#A0826D"
        strokeWidth="2"
      />
      <ellipse cx="60" cy="75" rx="18" ry="14" fill="#FFE8D0" />
      <ellipse
        cx="35"
        cy="65"
        rx="14"
        ry="16"
        fill="#FFD4B0"
        stroke="#A0826D"
        strokeWidth="1.5"
      />
      <ellipse
        cx="85"
        cy="65"
        rx="14"
        ry="16"
        fill="#FFD4B0"
        stroke="#A0826D"
        strokeWidth="1.5"
      />
      <circle
        cx="60"
        cy="40"
        r="18"
        fill="#FFB88C"
        stroke="#A0826D"
        strokeWidth="2"
      />
      <circle
        cx="45"
        cy="28"
        r="6"
        fill="#FFB88C"
        stroke="#A0826D"
        strokeWidth="1.5"
      />
      <circle cx="45" cy="28" r="3" fill="#FFE8D0" />
      <circle
        cx="75"
        cy="28"
        r="6"
        fill="#FFB88C"
        stroke="#A0826D"
        strokeWidth="1.5"
      />
      <circle cx="75" cy="28" r="3" fill="#FFE8D0" />
      <circle cx="52" cy="38" r="2.5" fill="#2D1B0F" />
      <circle cx="68" cy="38" r="2.5" fill="#2D1B0F" />
      <circle cx="52.5" cy="37" r="0.8" fill="white" />
      <circle cx="68.5" cy="37" r="0.8" fill="white" />
      {actionState === "happy" && (
        <circle cx="60" cy="46" r="2" fill="#A0826D" />
      )}
      {actionState === "idle" && (
        <circle cx="60" cy="46" r="1.5" fill="#A0826D" />
      )}
      <motion.path
        d="M 75 70 Q 95 65 98 45"
        stroke="#FFB88C"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        animate={{ rotate: [-10, 10, -10] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: "75px 70px" }}
      />
      <ellipse
        cx="48"
        cy="92"
        rx="6"
        ry="4"
        fill="#FFB88C"
        stroke="#A0826D"
        strokeWidth="1"
      />
      <ellipse
        cx="72"
        cy="92"
        rx="6"
        ry="4"
        fill="#FFB88C"
        stroke="#A0826D"
        strokeWidth="1"
      />
    </>
  );

  const renderHedgehog = () => (
    <>
      <ellipse
        cx="60"
        cy="110"
        rx="35"
        ry="8"
        fill="currentColor"
        opacity="0.1"
      />
      <ellipse
        cx="60"
        cy="70"
        rx="30"
        ry="30"
        fill="#C9B89B"
        stroke="#7A6B5F"
        strokeWidth="2"
      />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const x1 = 60 + Math.cos(angle) * 30;
        const y1 = 70 + Math.sin(angle) * 30;
        const x2 = 60 + Math.cos(angle) * 45;
        const y2 = 70 + Math.sin(angle) * 45;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#7A6B5F"
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      })}
      <circle
        cx="60"
        cy="42"
        r="16"
        fill="#C9B89B"
        stroke="#7A6B5F"
        strokeWidth="2"
      />
      <circle cx="60" cy="52" r="4" fill="#7A6B5F" />
      <circle cx="52" cy="38" r="3" fill="#2D1B0F" />
      <circle cx="68" cy="38" r="3" fill="#2D1B0F" />
      <circle cx="53" cy="37" r="1" fill="white" />
      <circle cx="69" cy="37" r="1" fill="white" />
      {actionState === "happy" && (
        <path
          d="M 58 50 Q 60 52 62 50"
          stroke="#7A6B5F"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      )}
      <ellipse
        cx="45"
        cy="95"
        rx="5"
        ry="6"
        fill="#C9B89B"
        stroke="#7A6B5F"
        strokeWidth="1"
      />
      <ellipse
        cx="75"
        cy="95"
        rx="5"
        ry="6"
        fill="#C9B89B"
        stroke="#7A6B5F"
        strokeWidth="1"
      />
    </>
  );

  const renderPanda = () => (
    <>
      <ellipse
        cx="60"
        cy="110"
        rx="35"
        ry="8"
        fill="currentColor"
        opacity="0.1"
      />
      <ellipse
        cx="60"
        cy="70"
        rx="28"
        ry="32"
        fill="white"
        stroke="black"
        strokeWidth="2"
      />
      <ellipse cx="60" cy="78" rx="16" ry="18" fill="white" />
      <circle cx="40" cy="32" r="10" fill="black" />
      <circle cx="80" cy="32" r="10" fill="black" />
      <circle
        cx="60"
        cy="42"
        r="22"
        fill="white"
        stroke="black"
        strokeWidth="2"
      />
      <ellipse cx="48" cy="40" rx="8" ry="9" fill="black" />
      <ellipse cx="72" cy="40" rx="8" ry="9" fill="black" />
      <circle cx="48" cy="40" r="3" fill="white" />
      <circle cx="72" cy="40" r="3" fill="white" />
      <circle cx="48" cy="40" r="1.5" fill="black" />
      <circle cx="72" cy="40" r="1.5" fill="black" />
      <circle cx="60" cy="48" r="2.5" fill="black" />
      {actionState === "happy" && (
        <path
          d="M 56 52 Q 60 54 64 52"
          stroke="black"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      )}
      {actionState === "idle" && (
        <line
          x1="58"
          y1="52"
          x2="62"
          y2="52"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
      <rect x="35" y="65" width="8" height="20" rx="4" fill="black" />
      <rect x="77" y="65" width="8" height="20" rx="4" fill="black" />
    </>
  );

  const renderDuck = () => (
    <>
      <ellipse
        cx="60"
        cy="110"
        rx="35"
        ry="8"
        fill="currentColor"
        opacity="0.1"
      />
      <ellipse
        cx="60"
        cy="75"
        rx="26"
        ry="30"
        fill="#FFD700"
        stroke="#DAA520"
        strokeWidth="2"
      />
      <path
        d="M 60 50 Q 62 55 62 65"
        stroke="#FFD700"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      <circle
        cx="60"
        cy="42"
        r="14"
        fill="#FFD700"
        stroke="#DAA520"
        strokeWidth="2"
      />
      <ellipse
        cx="72"
        cy="43"
        rx="8"
        ry="5"
        fill="#FFA500"
        stroke="#DAA520"
        strokeWidth="1"
      />
      <circle cx="58" cy="40" r="2.5" fill="black" />
      <circle cx="58.5" cy="39" r="0.8" fill="white" />
      <path
        d="M 50 75 Q 35 70 35 80"
        stroke="#DAA520"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 70 75 Q 85 70 85 80"
        stroke="#DAA520"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="102"
        x2="50"
        y2="108"
        stroke="#FFA500"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="70"
        y1="102"
        x2="70"
        y2="108"
        stroke="#FFA500"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  );

  const renderChick = () => (
    <>
      <ellipse
        cx="60"
        cy="110"
        rx="35"
        ry="8"
        fill="currentColor"
        opacity="0.1"
      />
      <circle
        cx="60"
        cy="75"
        r="25"
        fill="#FFD700"
        stroke="#DAA520"
        strokeWidth="2"
      />
      <circle
        cx="60"
        cy="42"
        r="16"
        fill="#FFD700"
        stroke="#DAA520"
        strokeWidth="2"
      />
      <circle
        cx="55"
        cy="28"
        r="5"
        fill="#FFD700"
        stroke="#DAA520"
        strokeWidth="1"
      />
      <circle
        cx="60"
        cy="25"
        r="5"
        fill="#FFD700"
        stroke="#DAA520"
        strokeWidth="1"
      />
      <circle
        cx="65"
        cy="28"
        r="5"
        fill="#FFD700"
        stroke="#DAA520"
        strokeWidth="1"
      />
      <circle cx="54" cy="40" r="3" fill="black" />
      <circle cx="66" cy="40" r="3" fill="black" />
      <circle cx="55" cy="39" r="1" fill="white" />
      <circle cx="67" cy="39" r="1" fill="white" />
      <polygon
        points="60,47 63,50 57,50"
        fill="#FFA500"
        stroke="#DAA520"
        strokeWidth="1"
      />
      <ellipse
        cx="48"
        cy="72"
        rx="8"
        ry="14"
        fill="#E6B800"
        stroke="#DAA520"
        strokeWidth="1"
      />
      <ellipse
        cx="72"
        cy="72"
        rx="8"
        ry="14"
        fill="#E6B800"
        stroke="#DAA520"
        strokeWidth="1"
      />
      <line
        x1="50"
        y1="98"
        x2="50"
        y2="104"
        stroke="#FFA500"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="70"
        y1="98"
        x2="70"
        y2="104"
        stroke="#FFA500"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  );

  const renderCat = () => (
    <>
      <ellipse
        cx="60"
        cy="110"
        rx="35"
        ry="8"
        fill="currentColor"
        opacity="0.1"
      />
      <ellipse
        cx="60"
        cy="72"
        rx="26"
        ry="28"
        fill="#FF8C42"
        stroke="#D97E2E"
        strokeWidth="2"
      />
      <ellipse cx="60" cy="78" rx="14" ry="14" fill="#FFB48C" />
      <circle
        cx="60"
        cy="42"
        r="18"
        fill="#FF8C42"
        stroke="#D97E2E"
        strokeWidth="2"
      />
      <polygon
        points="42,28 38,12 48,22"
        fill="#FF8C42"
        stroke="#D97E2E"
        strokeWidth="1.5"
      />
      <polygon points="42,25 40,18 45,25" fill="#FFB48C" />
      <polygon
        points="78,28 82,12 72,22"
        fill="#FF8C42"
        stroke="#D97E2E"
        strokeWidth="1.5"
      />
      <polygon points="78,25 80,18 75,25" fill="#FFB48C" />
      <ellipse
        cx="52"
        cy="38"
        rx="3"
        ry="5"
        fill="#32CD32"
        stroke="#D97E2E"
        strokeWidth="1"
      />
      <ellipse
        cx="68"
        cy="38"
        rx="3"
        ry="5"
        fill="#32CD32"
        stroke="#D97E2E"
        strokeWidth="1"
      />
      <circle cx="52" cy="39" r="1.5" fill="black" />
      <circle cx="68" cy="39" r="1.5" fill="black" />
      <polygon
        points="60,48 57,52 63,52"
        fill="#FFB48C"
        stroke="#D97E2E"
        strokeWidth="1"
      />
      {actionState === "happy" && (
        <>
          <path
            d="M 60 52 Q 55 56 50 54"
            stroke="#D97E2E"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 60 52 Q 65 56 70 54"
            stroke="#D97E2E"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </>
      )}
      <line x1="40" y1="45" x2="20" y2="43" stroke="#D97E2E" strokeWidth="1" />
      <line x1="40" y1="50" x2="20" y2="50" stroke="#D97E2E" strokeWidth="1" />
      <line x1="80" y1="45" x2="100" y2="43" stroke="#D97E2E" strokeWidth="1" />
      <line x1="80" y1="50" x2="100" y2="50" stroke="#D97E2E" strokeWidth="1" />
      <motion.path
        d="M 75 75 Q 95 60 92 35"
        stroke="#FF8C42"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        animate={{ rotate: [-15, 15, -15] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: "75px 75px" }}
      />
    </>
  );

  const renderKoala = () => (
    <>
      <ellipse
        cx="60"
        cy="110"
        rx="35"
        ry="8"
        fill="currentColor"
        opacity="0.1"
      />
      <ellipse
        cx="60"
        cy="75"
        rx="26"
        ry="30"
        fill="#9E9E9E"
        stroke="#757575"
        strokeWidth="2"
      />
      <circle
        cx="60"
        cy="42"
        r="20"
        fill="#9E9E9E"
        stroke="#757575"
        strokeWidth="2"
      />
      <circle
        cx="40"
        cy="28"
        r="9"
        fill="#9E9E9E"
        stroke="#757575"
        strokeWidth="1.5"
      />
      <circle cx="40" cy="28" r="5" fill="#E0E0E0" />
      <circle
        cx="80"
        cy="28"
        r="9"
        fill="#9E9E9E"
        stroke="#757575"
        strokeWidth="1.5"
      />
      <circle cx="80" cy="28" r="5" fill="#E0E0E0" />
      <circle cx="60" cy="42" r="14" fill="#E0E0E0" />
      <circle cx="52" cy="38" r="4" fill="black" />
      <circle cx="68" cy="38" r="4" fill="black" />
      <circle cx="53" cy="37" r="1.5" fill="white" />
      <circle cx="69" cy="37" r="1.5" fill="white" />
      <circle cx="60" cy="48" r="4" fill="#757575" />
      {actionState === "happy" && (
        <path
          d="M 55 52 Q 60 54 65 52"
          stroke="#757575"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      )}
      <ellipse
        cx="40"
        cy="70"
        rx="8"
        ry="18"
        fill="#9E9E9E"
        stroke="#757575"
        strokeWidth="1"
      />
      <ellipse
        cx="80"
        cy="70"
        rx="8"
        ry="18"
        fill="#9E9E9E"
        stroke="#757575"
        strokeWidth="1"
      />
      <ellipse cx="60" cy="80" rx="12" ry="14" fill="#E0E0E0" />
    </>
  );

  const getPetRenderer = () => {
    switch (petType) {
      case "bunny":
        return renderBunny();
      case "hamster":
        return renderHamster();
      case "hedgehog":
        return renderHedgehog();
      case "panda":
        return renderPanda();
      case "duck":
        return renderDuck();
      case "chick":
        return renderChick();
      case "cat":
        return renderCat();
      case "koala":
        return renderKoala();
      default:
        return renderBunny();
    }
  };

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
      {getPetRenderer()}
    </motion.svg>
  );
};

export default AnimatedCritter;
