import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FloatingIslandEnvironment from "../components/FloatingIslandEnvironment";
import InteractivePet from "../components/InteractivePet";
import FloatingActionButton from "../components/FloatingActionButton";
import DraggableFloatingObject from "../components/DraggableFloatingObject";
import { authService } from "../services/api";

const PetGameHub = () => {
  const navigate = useNavigate();
  const [isDragMode, setIsDragMode] = useState(false);
  const [objects, setObjects] = useState([
    { id: 1, shape: "cloud", color: "sky", position: { x: 200, y: 150 } },
    { id: 2, shape: "heart", color: "pink", position: { x: 250, y: 200 } },
  ]);
  const [stats, setStats] = useState({
    happiness: 85,
    hunger: 40,
    energy: 70,
  });
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // Simulate stat changes over time
    const timer = setInterval(() => {
      setStats((prev) => ({
        happiness: Math.max(0, prev.happiness - Math.random() * 2),
        hunger: Math.min(100, prev.hunger + Math.random() * 3),
        energy: Math.max(0, prev.energy - Math.random() * 1.5),
      }));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePetInteraction = (type) => {
    if (type === "pet") {
      setStats((prev) => ({
        ...prev,
        happiness: Math.min(100, prev.happiness + 15),
        energy: Math.max(0, prev.energy - 5),
      }));
    } else if (type === "feed") {
      setStats((prev) => ({
        ...prev,
        hunger: Math.max(0, prev.hunger - 30),
        happiness: Math.min(100, prev.happiness + 5),
      }));
    } else if (type === "play") {
      setStats((prev) => ({
        ...prev,
        happiness: Math.min(100, prev.happiness + 25),
        energy: Math.max(0, prev.energy - 20),
        hunger: Math.min(100, prev.hunger + 10),
      }));
    }
  };

  const createRandomObject = () => {
    const shapes = ["cloud", "heart", "star", "bubble", "sparkle"];
    const colors = ["pink", "sky", "yellow", "green"];
    const newObject = {
      id: Date.now(),
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      position: {
        x: Math.random() * window.innerWidth * 0.6 + window.innerWidth * 0.2,
        y: Math.random() * window.innerHeight * 0.4 + window.innerHeight * 0.1,
      },
    };
    setObjects([...objects, newObject]);
  };

  const removeObject = (id) => {
    setObjects(objects.filter((obj) => obj.id !== id));
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-[#FFF5F9] to-[#E8F0FF]">
      {/* Floating Island Background */}
      <FloatingIslandEnvironment />

      {/* Main Content */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Top Bar with Stats */}
        <motion.div
          className="flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-md border-b border-white/30"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <motion.h1
            className="text-2xl font-black font-serif text-cozy-dark"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Cozy Critters
          </motion.h1>

          {/* Quick Stats */}
          <div className="flex gap-6">
            <motion.div className="flex items-center gap-2 text-xs font-bold">
              <div className="w-3 h-3 rounded-full bg-cozy-pink" />
              <span>Happiness: {Math.round(stats.happiness)}%</span>
            </motion.div>
            <motion.div className="flex items-center gap-2 text-xs font-bold">
              <div className="w-3 h-3 rounded-full bg-cozy-yellow" />
              <span>Hunger: {Math.round(stats.hunger)}%</span>
            </motion.div>
            <motion.div className="flex items-center gap-2 text-xs font-bold">
              <div className="w-3 h-3 rounded-full bg-cozy-sky" />
              <span>Energy: {Math.round(stats.energy)}%</span>
            </motion.div>
          </div>

          {/* Menu Button */}
          <motion.button
            className="px-4 py-2 rounded-full bg-cozy-pink text-white font-bold text-sm cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMenu(!showMenu)}
          >
            ☰
          </motion.button>
        </motion.div>

        {/* Menu Dropdown */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              className="absolute top-16 right-6 z-50 bg-white/90 backdrop-blur-md rounded-3xl border-2 border-cozy-dark/10 shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
            >
              <div className="p-4 flex flex-col gap-2">
                <button className="px-6 py-3 text-sm font-bold hover:bg-cozy-pink/10 rounded-xl transition-colors text-left">
                  Profile
                </button>
                <button className="px-6 py-3 text-sm font-bold hover:bg-cozy-pink/10 rounded-xl transition-colors text-left">
                  Settings
                </button>
                <button className="px-6 py-3 text-sm font-bold hover:bg-cozy-pink/10 rounded-xl transition-colors text-left">
                  Achievements
                </button>
                <hr className="my-2 border-cozy-dark/10" />
                <button
                  className="px-6 py-3 text-sm font-bold hover:bg-cozy-pink/10 rounded-xl transition-colors text-left"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pet Play Area */}
        <div className="flex-1 flex items-center justify-center relative px-4 py-8">
          <InteractivePet onInteract={handlePetInteraction} />

          {/* Draggable floating objects */}
          {objects.map((obj) => (
            <DraggableFloatingObject
              key={obj.id}
              id={obj.id}
              shape={obj.shape}
              color={obj.color}
              position={obj.position}
              onRemove={removeObject}
              isDragMode={isDragMode}
            />
          ))}
        </div>

        {/* Floating Action Buttons */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-screen h-32 pointer-events-none">
          {/* Paw Button - Menu */}
          <FloatingActionButton
            icon="🐾"
            label="Menu"
            onClick={() => setShowMenu(!showMenu)}
            color="pink"
            size="lg"
            position={{ left: "15%", bottom: 0 }}
            delay={0}
          />

          {/* Toy Button - Play */}
          <FloatingActionButton
            icon="🎾"
            label="Play"
            onClick={() => handlePetInteraction("play")}
            color="sky"
            size="lg"
            position={{ left: "35%", bottom: 0 }}
            delay={0.1}
          />

          {/* Food Button - Feed */}
          <FloatingActionButton
            icon="🍖"
            label="Feed"
            onClick={() => handlePetInteraction("feed")}
            color="yellow"
            size="lg"
            position={{ left: "55%", bottom: 0 }}
            delay={0.2}
          />

          {/* Magic Wand - Create/Edit Mode */}
          <FloatingActionButton
            icon="✨"
            label={isDragMode ? "Done" : "Create"}
            onClick={() => {
              if (isDragMode) {
                setIsDragMode(false);
              } else {
                setIsDragMode(true);
                createRandomObject();
              }
            }}
            color={isDragMode ? "green" : "pink"}
            size="lg"
            position={{ left: "75%", bottom: 0 }}
            delay={0.3}
          />
        </div>

        {/* Create Mode Indicator */}
        <AnimatePresence>
          {isDragMode && (
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <motion.div
                className="bg-white/80 backdrop-blur-md rounded-3xl px-8 py-4 border-2 border-cozy-green shadow-2xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <p className="font-bold text-cozy-dark text-lg">
                  Drag & create magic objects! ✨
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PetGameHub;
