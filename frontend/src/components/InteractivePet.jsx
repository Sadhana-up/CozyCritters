import React, { useState } from "react";
import { motion } from "framer-motion";
import AnimatedCritter from "./AnimatedCritter";

const InteractivePet = ({ onInteract = () => {} }) => {
  const [petState, setPetState] = useState("idle"); // idle, happy, excited, sleepy, eating
  const [particles, setParticles] = useState([]);

  const handlePetClick = () => {
    setPetState("happy");
    createParticles("hearts");
    onInteract("pet");
    setTimeout(() => setPetState("idle"), 2000);
  };

  const handleFeed = () => {
    setPetState("eating");
    createParticles("food");
    onInteract("feed");
    setTimeout(() => setPetState("happy"), 1500);
  };

  const handlePlay = () => {
    setPetState("excited");
    createParticles("stars");
    onInteract("play");
    setTimeout(() => setPetState("idle"), 2000);
  };

  const createParticles = (type) => {
    const newParticles = Array.from({ length: 8 }).map((_, i) => ({
      id: `${Date.now()}-${i}`,
      type,
      x: Math.random() * 60 - 30,
      y: Math.random() * 60 - 30,
      delay: i * 0.05,
    }));
    setParticles([...particles, ...newParticles]);
    setTimeout(() => setParticles([]), 2000);
  };

  const getParticleSymbol = (type) => {
    const symbols = {
      hearts: "❤️",
      stars: "⭐",
      food: "🍖",
      sparkles: "✨",
    };
    return symbols[type] || "✨";
  };

  const stateMappings = {
    idle: "idle",
    happy: "happy",
    excited: "happy",
    sleepy: "sad",
    eating: "idle",
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Pet interaction zone with glow */}
      <motion.div
        className="relative w-64 h-64 flex items-center justify-center"
        animate={{
          scale: petState === "excited" ? [1, 1.05, 1] : 1,
        }}
        transition={{ duration: 0.5, repeat: petState === "excited" ? 2 : 0 }}
      >
        {/* Soft glow halo */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-radial from-cozy-pink/20 via-cozy-pink/5 to-transparent blur-2xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Pet display with shadow */}
        <motion.div
          className="relative z-10 flex items-center justify-center"
          onClick={handlePetClick}
          style={{ cursor: "pointer" }}
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <AnimatedCritter
            actionState={stateMappings[petState]}
            className="w-40 h-40 drop-shadow-2xl"
          />
        </motion.div>

        {/* Pet interaction feedback particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute text-3xl pointer-events-none"
            initial={{
              x: particle.x,
              y: particle.y,
              opacity: 1,
              scale: 0,
            }}
            animate={{
              x: particle.x * 2,
              y: particle.y * 2 - 100,
              opacity: 0,
              scale: 1,
            }}
            transition={{
              duration: 1.5,
              delay: particle.delay,
              ease: "easeOut",
            }}
          >
            {getParticleSymbol(particle.type)}
          </motion.div>
        ))}

        {/* Pet status indicator */}
        <motion.div
          className="absolute -bottom-16 text-center"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-xs font-bold text-cozy-dark/60 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-cozy-dark/10">
            {petState === "idle" && "Click me to play! 👆"}
            {petState === "happy" && "So happy! 🎉"}
            {petState === "excited" && "Wheee! 🎪"}
            {petState === "eating" && "Nom nom! 😋"}
            {petState === "sleepy" && "Zzz... 😴"}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default InteractivePet;
