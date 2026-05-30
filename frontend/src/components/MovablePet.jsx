import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedCritter from "./AnimatedCritter";

const MovablePet = ({ petType = "bunny" }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [petState, setPetState] = useState("idle");
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);

  // Auto-drift animation when not dragging
  const [autoX, setAutoX] = useState(0);
  useEffect(() => {
    if (!isDragging) {
      const interval = setInterval(() => {
        setAutoX((prev) => (prev + 0.5) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isDragging]);

  const handleMouseDown = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - position.x,
      y: e.clientY - rect.top - position.y,
    });
    setIsDragging(true);
    setPetState("excited");
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    // Constrain to container bounds
    const maxX = rect.width - 100;
    const maxY = rect.height - 100;
    setPosition({
      x: Math.max(-50, Math.min(newX, maxX)),
      y: Math.max(-50, Math.min(newY, maxY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setPetState("idle");
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handlePetClick = () => {
    setPetState("happy");
    createParticles("hearts");
    setTimeout(() => setPetState("idle"), 1500);
  };

  const createParticles = (type) => {
    const newParticles = Array.from({ length: 8 }).map((_, i) => ({
      id: `${Date.now()}-${i}`,
      type,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      delay: i * 0.05,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => setParticles([]), 2000);
  };

  const getParticleSymbol = (type) => {
    const symbols = {
      hearts: "❤️",
      stars: "⭐",
      sparkles: "✨",
    };
    return symbols[type] || "✨";
  };

  const stateMappings = {
    idle: "idle",
    happy: "happy",
    excited: "happy",
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 border-[4px] border-cozy-dark/10 shadow-2xl cursor-grab active:cursor-grabbing"
      style={{
        perspective: "1000px",
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-100"
          style={{ top: "20%", right: "10%" }}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-32 h-8 rounded-full bg-gradient-to-r from-blue-200 to-blue-100"
          style={{ bottom: "15%", left: "5%" }}
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      {/* Movable pet */}
      <motion.div
        className="absolute z-20"
        style={{
          x: position.x,
          y: position.y,
          left: 0,
          top: 0,
        }}
        onMouseDown={handleMouseDown}
      >
        <motion.div
          className="relative w-32 h-32 flex items-center justify-center cursor-grab active:cursor-grabbing"
          onClick={handlePetClick}
          whileHover={{ scale: 1.1 }}
          animate={{
            rotateZ: !isDragging ? Math.sin(autoX * (Math.PI / 180)) * 3 : 0,
          }}
        >
          {/* Pet glow halo */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-radial from-cozy-pink/30 via-cozy-pink/10 to-transparent blur-2xl"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Pet character */}
          <motion.div
            className="relative z-10"
            animate={{
              y: isDragging ? 0 : [0, -4, 0],
            }}
            transition={{
              duration: 2,
              repeat: !isDragging ? Infinity : 0,
            }}
          >
            <AnimatedCritter
              actionState={stateMappings[petState]}
              className="w-24 h-24 drop-shadow-xl"
              petType={petType}
            />
          </motion.div>

          {/* Shadow under pet */}
          <motion.div
            className="absolute bottom-0 w-20 h-2 rounded-full bg-gradient-to-r from-black/20 to-transparent blur-md"
            animate={{
              scaleX: isDragging ? 1.3 : 1,
            }}
          />
        </motion.div>

        {/* Interaction particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute text-2xl pointer-events-none"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: particle.x * 2,
              y: particle.y * 2,
              opacity: 0,
              scale: 0.5,
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
      </motion.div>

      {/* Instruction text */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-cozy-dark/40 pointer-events-none"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        Drag to move • Click to pet
      </motion.div>
    </div>
  );
};

export default MovablePet;
