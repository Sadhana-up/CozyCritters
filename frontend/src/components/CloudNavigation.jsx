import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "./UI/Button";
import Jelly3DButton from "./Jelly3DButton";

const CloudNavigation = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="relative w-96 h-40"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Large cloud shape - SVG backdrop */}
      <svg
        viewBox="0 0 400 160"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Main cloud outline */}
        <defs>
          <filter id="cloudShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity="0.2" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
        </defs>

        <path
          d="M 40 120 Q 20 120 20 100 Q 20 80 40 80 Q 40 60 70 60 Q 100 40 140 60 Q 180 40 200 60 Q 230 50 260 65 Q 300 50 320 75 Q 360 80 360 100 Q 360 120 340 120 Z"
          fill="#FFFAF5"
          stroke="#FFD4A3"
          strokeWidth="3"
          filter="url(#cloudShadow)"
        />

        {/* Inner cloud for depth */}
        <path
          d="M 50 110 Q 35 110 35 95 Q 35 80 50 80 Q 50 65 75 65 Q 100 50 130 65 Q 160 52 180 65 Q 210 55 240 70 Q 270 58 300 75 Q 330 78 330 95 Q 330 110 320 110 Z"
          fill="white"
          opacity="0.5"
        />
      </svg>

      {/* Content inside cloud */}
      <div className="absolute inset-0 flex items-center justify-center gap-6 px-8 z-10">
        {!isLoggedIn ? (
          <>
            <Button
              variant="white"
              onClick={() => navigate("/login")}
              className="px-6 py-3 text-sm border-[2px] rounded-xl shadow-none hover:shadow-md active:translate-y-0.5 transition-all"
            >
              Sign In
            </Button>
            <Jelly3DButton
              variant="pink"
              onClick={() => navigate("/signup")}
              className="px-6 py-3"
            >
              Adopt
            </Jelly3DButton>
          </>
        ) : (
          <Jelly3DButton
            variant="sky"
            onClick={() => navigate("/dashboard")}
            className="px-8 py-3"
          >
            Enter
          </Jelly3DButton>
        )}
      </div>
    </motion.div>
  );
};

export default CloudNavigation;
