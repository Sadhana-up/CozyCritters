import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  LogOut,
  Plus,
  Trash2,
  User,
  Sparkles,
  Settings,
  Home,
  Gallery as GalleryIcon,
} from "lucide-react";
import Card from "../components/UI/Card";
import FloatingHearts from "../components/FloatingHearts";
import MovablePet from "../components/MovablePet";
import CloudLogo from "../components/CloudLogo";
import { critterService, authService } from "../services/api";
import { soundManager } from "../utils/sound";

const Dashboard = () => {
  const navigate = useNavigate();
  const [critters, setCritters] = useState([]);
  const [selectedCritter, setSelectedCritter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interactingWith, setInteractingWith] = useState(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
      return;
    }
    fetchCritters();
  }, [navigate]);

  const fetchCritters = async () => {
    try {
      const data = await critterService.getAll();
      setCritters(data);
      if (data.length > 0) {
        setSelectedCritter(data[0]);
      }
    } catch (err) {
      console.error("Failed to load critters", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInteraction = async (type) => {
    if (!selectedCritter) return;
    setInteractingWith(type);
    soundManager.playClick();

    try {
      let updatedPet;
      if (type === "feed") {
        updatedPet = await critterService.feed(selectedCritter.id);
        soundManager.playEat();
      } else if (type === "play") {
        updatedPet = await critterService.play(selectedCritter.id);
        soundManager.playBoing();
      } else if (type === "sleep") {
        updatedPet = await critterService.sleep(selectedCritter.id);
        soundManager.playSnore();
      }

      if (updatedPet) {
        setSelectedCritter(updatedPet);
        setCritters((prev) =>
          prev.map((c) => (c.id === updatedPet.id ? updatedPet : c)),
        );
      }
    } catch (err) {
      console.error("Interaction failed:", err);
    } finally {
      setTimeout(() => setInteractingWith(null), 1200);
    }
  };

  const handleDeleteCritter = async (critterId) => {
    if (!window.confirm("Are you sure you want to let this critter go? 💔"))
      return;

    try {
      await critterService.delete(critterId);
      setCritters((prev) => prev.filter((c) => c.id !== critterId));
      if (selectedCritter?.id === critterId) {
        setSelectedCritter(critters.find((c) => c.id !== critterId) || null);
      }
      soundManager.playClick();
    } catch (err) {
      console.error("Failed to delete critter:", err);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-[#FFF5F9] to-[#E8F0FF]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles size={48} className="text-cozy-pink" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#FFF5F9] to-[#E8F0FF] px-4 py-6">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-40 h-40 bg-cozy-pink/5 rounded-full blur-3xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-60 h-60 bg-cozy-sky/5 rounded-full blur-3xl"
          animate={{ y: [20, 0, 20] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <header className="relative z-20 max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          <motion.div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.05 }}
          >
            <CloudLogo size="sm" />
            <div>
              <h1 className="text-2xl font-black font-serif text-cozy-dark">
                My Critters
              </h1>
              <p className="text-xs text-cozy-dark/50 font-semibold">
                Your Cozy Sanctuary
              </p>
            </div>
          </motion.div>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => navigate("/gallery")}
              className="p-3 rounded-full bg-cozy-pink/20 hover:bg-cozy-pink/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="View Gallery"
            >
              <GalleryIcon size={20} className="text-cozy-dark" />
            </motion.button>
            <motion.button
              onClick={() => navigate("/profile")}
              className="p-3 rounded-full bg-cozy-sky/20 hover:bg-cozy-sky/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Profile"
            >
              <User size={20} className="text-cozy-dark" />
            </motion.button>
            <motion.button
              onClick={handleLogout}
              className="p-3 rounded-full bg-cozy-pink/20 hover:bg-cozy-pink/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Logout"
            >
              <LogOut size={20} className="text-cozy-dark" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Character Showcase - Same as Landing Page */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto mb-8 overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide">
          {[
            { type: "bunny", label: "Bunny" },
            { type: "hamster", label: "Hamster" },
            { type: "hedgehog", label: "Hedgehog" },
            { type: "panda", label: "Panda" },
            { type: "duck", label: "Duck" },
            { type: "chick", label: "Chick" },
            { type: "cat", label: "Cat" },
            { type: "koala", label: "Koala" },
          ].map((pet, idx) => (
            <motion.div
              key={pet.type}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="flex flex-col items-center gap-2 shrink-0"
              title={pet.label}
            >
              <div className="w-24 h-24">
                <MovablePet petType={pet.type} />
              </div>
              <p className="text-xs font-bold text-cozy-dark/60">{pet.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Featured Critter & Interactions */}
        {selectedCritter && (
          <motion.div
            className="lg:col-span-2 flex flex-col gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Featured Card */}
            <div className="bg-white/60 backdrop-blur-md rounded-3xl border-[3px] border-cozy-pink/30 p-8 shadow-lg overflow-hidden">
              <div className="relative">
                {/* Background glow */}
                <motion.div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  animate={{
                    boxShadow: [
                      "inset 0 0 20px rgba(255, 182, 193, 0)",
                      "inset 0 0 40px rgba(255, 182, 193, 0.15)",
                      "inset 0 0 20px rgba(255, 182, 193, 0)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                <div className="relative z-10 text-center">
                  {/* Critter Name */}
                  <motion.h2
                    className="text-4xl font-black font-serif text-cozy-dark mb-2"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {selectedCritter.name}
                  </motion.h2>
                  <p className="text-sm font-bold text-cozy-dark/50 uppercase tracking-widest mb-6">
                    {selectedCritter.species}
                  </p>

                  {/* Critter Description */}
                  <p className="text-base text-cozy-dark/70 mb-8 leading-relaxed">
                    {selectedCritter.description}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <StatItem
                      label="Happiness"
                      value={selectedCritter.happiness}
                      emoji="💖"
                      color="cozy-pink"
                    />
                    <StatItem
                      label="Hunger"
                      value={selectedCritter.hunger}
                      emoji="🍎"
                      color="cozy-yellow"
                    />
                    <StatItem
                      label="Energy"
                      value={selectedCritter.energy}
                      emoji="⚡"
                      color="cozy-sky"
                    />
                  </div>

                  {/* Interaction Buttons */}
                  <div className="grid grid-cols-3 gap-4">
                    <motion.button
                      onClick={() => handleInteraction("feed")}
                      disabled={interactingWith === "feed"}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-3 bg-cozy-yellow/30 hover:bg-cozy-yellow/50 border-2 border-cozy-yellow/50 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
                    >
                      {interactingWith === "feed" ? "🍎..." : "🍎 Feed"}
                    </motion.button>

                    <motion.button
                      onClick={() => handleInteraction("play")}
                      disabled={interactingWith === "play"}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-3 bg-cozy-pink/30 hover:bg-cozy-pink/50 border-2 border-cozy-pink/50 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
                    >
                      {interactingWith === "play" ? "🎾..." : "🎾 Play"}
                    </motion.button>

                    <motion.button
                      onClick={() => handleInteraction("sleep")}
                      disabled={interactingWith === "sleep"}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-3 bg-cozy-sky/30 hover:bg-cozy-sky/50 border-2 border-cozy-sky/50 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
                    >
                      {interactingWith === "sleep" ? "😴..." : "😴 Sleep"}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Right: Critters List */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="sticky top-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black font-serif text-cozy-dark">
                Your Collection
              </h3>
              <motion.button
                onClick={() => navigate("/adopt")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-cozy-pink/30 hover:bg-cozy-pink/50 transition-colors"
                title="Adopt a new critter"
              >
                <Plus size={20} className="text-cozy-dark" />
              </motion.button>
            </div>

            <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto">
              <AnimatePresence>
                {critters.map((critter) => (
                  <motion.div
                    key={critter.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onClick={() => {
                      setSelectedCritter(critter);
                      soundManager.playClick();
                    }}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                      selectedCritter?.id === critter.id
                        ? "bg-cozy-pink/30 border-cozy-pink/50 shadow-lg"
                        : "bg-white/40 border-cozy-dark/10 hover:bg-white/60"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-cozy-dark">
                          {critter.name}
                        </h4>
                        <p className="text-xs text-cozy-dark/50">
                          {critter.species}
                        </p>
                      </div>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCritter(critter.id);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-cozy-pink/50 hover:text-cozy-pink transition-colors"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>

                    {/* Mini stats */}
                    <div className="flex gap-2 text-xs font-bold">
                      <span className="text-cozy-pink">
                        💖 {critter.happiness}%
                      </span>
                      <span className="text-cozy-yellow">
                        🍎 {critter.hunger}%
                      </span>
                      <span className="text-cozy-sky">
                        ⚡ {critter.energy}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {critters.length === 0 && (
                <div className="text-center py-8 text-cozy-dark/50">
                  <p className="text-sm font-semibold mb-4">
                    No critters yet! 🌟
                  </p>
                  <motion.button
                    onClick={() => navigate("/adopt")}
                    className="px-4 py-2 bg-cozy-pink/30 hover:bg-cozy-pink/50 rounded-full font-bold text-sm transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    Adopt One Now
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Hearts */}
      <FloatingHearts count={3} />
    </div>
  );
};

// Helper component for stats
const StatItem = ({ label, value, emoji, color }) => (
  <motion.div
    className={`bg-${color}/10 border-2 border-${color}/30 rounded-xl p-3`}
    whileHover={{ scale: 1.05 }}
  >
    <div className="text-2xl mb-1">{emoji}</div>
    <p className="text-xs font-bold text-cozy-dark/50">{label}</p>
    <p className={`text-lg font-black text-${color}`}>{Math.round(value)}%</p>
  </motion.div>
);

export default Dashboard;
