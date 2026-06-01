import React, { useEffect, useState, useRef, useCallback } from "react";
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
  Star,
} from "lucide-react";
import Card from "../components/UI/Card";
import FloatingHearts from "../components/FloatingHearts";
import MovablePet from "../components/MovablePet";
import CloudLogo from "../components/CloudLogo";
import AnimatedCritter from "../components/AnimatedCritter";
import { critterService, authService } from "../services/api";
import { soundManager } from "../utils/sound";

// ─── Critter data ───────────────────────────────────────────────────────────
const CRITTERS = [
  {
    id: 1,
    name: "Bun-Bun",
    species: "Bunny",
    petType: "bunny",
    description:
      "A dreamy cloud-hopper who collects moonbeams and leaves tiny paw prints on your heart.",
    personality: "Dreamy & Tender",
    favoriteActivity: "Cloud-hopping",
    color: {
      bg: "from-pink-100 via-rose-50 to-pink-50",
      border: "border-pink-200",
      badge: "bg-pink-100 text-pink-700",
      glow: "rgba(255,182,193,0.35)",
    },
    companions: ["hamster", "chick"],
  },
  {
    id: 2,
    name: "Hammy",
    species: "Hamster",
    petType: "hamster",
    description:
      "A tiny architect who builds cozy dens out of acorns and warm thoughts.",
    personality: "Industrious & Warm",
    favoriteActivity: "Nest-building",
    color: {
      bg: "from-amber-100 via-orange-50 to-yellow-50",
      border: "border-amber-200",
      badge: "bg-amber-100 text-amber-700",
      glow: "rgba(251,191,36,0.3)",
    },
    companions: ["bunny", "hedgehog"],
  },
  {
    id: 3,
    name: "Prickles",
    species: "Hedgehog",
    petType: "hedgehog",
    description:
      "Shy on the outside, but the softest soul — rolls into a ball when startled by hugs.",
    personality: "Shy & Sweet",
    favoriteActivity: "Leaf-rolling",
    color: {
      bg: "from-stone-100 via-amber-50 to-stone-50",
      border: "border-stone-200",
      badge: "bg-stone-100 text-stone-600",
      glow: "rgba(168,162,158,0.3)",
    },
    companions: ["hamster", "duck"],
  },
  {
    id: 4,
    name: "Bao",
    species: "Panda",
    petType: "panda",
    description:
      "The world's most enthusiastic napper. Will eat bamboo and offer you profound life wisdom.",
    personality: "Zen & Cuddly",
    favoriteActivity: "Bamboo Meditation",
    color: {
      bg: "from-slate-100 via-gray-50 to-white",
      border: "border-slate-200",
      badge: "bg-slate-100 text-slate-600",
      glow: "rgba(148,163,184,0.3)",
    },
    companions: ["koala", "chick"],
  },
  {
    id: 5,
    name: "Quackers",
    species: "Duck",
    petType: "duck",
    description:
      "Struts around like they own every puddle. Will loudly narrate your entire day.",
    personality: "Bold & Chatty",
    favoriteActivity: "Puddle Strutting",
    color: {
      bg: "from-yellow-100 via-amber-50 to-yellow-50",
      border: "border-yellow-200",
      badge: "bg-yellow-100 text-yellow-700",
      glow: "rgba(253,224,71,0.35)",
    },
    companions: ["chick", "bunny"],
  },
  {
    id: 6,
    name: "Pip",
    species: "Chick",
    petType: "chick",
    description:
      "A tiny yellow sunbeam that peeps at everything curiously and falls asleep mid-chirp.",
    personality: "Curious & Sleepy",
    favoriteActivity: "Chirping Solos",
    color: {
      bg: "from-yellow-100 via-lime-50 to-yellow-50",
      border: "border-yellow-300",
      badge: "bg-yellow-100 text-yellow-800",
      glow: "rgba(250,204,21,0.35)",
    },
    companions: ["duck", "hamster"],
  },
  {
    id: 7,
    name: "Whiskers",
    species: "Cat",
    petType: "cat",
    description:
      "Claims to be a lone wolf but secretly schedules purring sessions for everyone's benefit.",
    personality: "Aloof & Loving",
    favoriteActivity: "Strategic Napping",
    color: {
      bg: "from-orange-100 via-amber-50 to-orange-50",
      border: "border-orange-200",
      badge: "bg-orange-100 text-orange-700",
      glow: "rgba(251,146,60,0.3)",
    },
    companions: ["bunny", "panda"],
  },
  {
    id: 8,
    name: "Eucaly",
    species: "Koala",
    petType: "koala",
    description:
      "Hangs from everything, pronounces 'cozy' as if inventing the word every single time.",
    personality: "Laid-back & Soft",
    favoriteActivity: "Eucalyptus Dreams",
    color: {
      bg: "from-teal-100 via-slate-50 to-teal-50",
      border: "border-teal-200",
      badge: "bg-teal-100 text-teal-700",
      glow: "rgba(94,234,212,0.3)",
    },
    companions: ["panda", "hedgehog"],
  },
];

// ─── Single roaming critter inside the sandbox ───────────────────────────────
const RoamingCritter = ({
  petType,
  size = 64,
  delay = 0,
  seed = 0,
  isMain = false,
  sandboxW,
  sandboxH,
}) => {
  const [pos, setPos] = useState({
    x: 30 + ((seed * 97) % (sandboxW - size - 30)),
    y: 20 + ((seed * 53) % (sandboxH - size - 30)),
  });
  const [target, setTarget] = useState(null);
  const [actionState, setActionState] = useState("idle");
  const [particles, setParticles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const posRef = useRef(pos);

  posRef.current = pos;

  // Pick a new wander target every few seconds
  useEffect(() => {
    const pick = () => {
      setTarget({
        x: Math.random() * (sandboxW - size - 20) + 10,
        y: Math.random() * (sandboxH - size - 20) + 10,
      });
    };
    const t = setTimeout(pick, delay * 600 + Math.random() * 2000);
    const interval = setInterval(pick, 3000 + Math.random() * 3000);
    return () => {
      clearTimeout(t);
      clearInterval(interval);
    };
  }, [sandboxW, sandboxH, size, delay]);

  // Lerp toward target
  useEffect(() => {
    if (!target || isDragging) return;
    let raf;
    const move = () => {
      setPos((prev) => {
        const dx = target.x - prev.x;
        const dy = target.y - prev.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 2) return prev;
        const speed = isMain ? 1.2 : 0.7;
        return { x: prev.x + dx * 0.02 * speed, y: prev.y + dy * 0.02 * speed };
      });
      raf = requestAnimationFrame(move);
    };
    raf = requestAnimationFrame(move);
    return () => cancelAnimationFrame(raf);
  }, [target, isDragging, isMain]);

  // Drag support
  const onPointerDown = useCallback(
    (e) => {
      e.stopPropagation();
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsDragging(true);
      setActionState("happy");
      const rect = e.currentTarget
        .closest(".sandbox-root")
        .getBoundingClientRect();
      dragRef.current = {
        startX: e.clientX - posRef.current.x - size / 2,
        startY: e.clientY - posRef.current.y - size / 2,
        rect,
      };
    },
    [size],
  );

  const onPointerMove = useCallback(
    (e) => {
      if (!isDragging || !dragRef.current) return;
      const { rect, startX, startY } = dragRef.current;
      const nx = e.clientX - rect.left - startX;
      const ny = e.clientY - rect.top - startY;
      setPos({
        x: Math.max(0, Math.min(nx, sandboxW - size)),
        y: Math.max(0, Math.min(ny, sandboxH - size)),
      });
    },
    [isDragging, sandboxW, sandboxH, size],
  );

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
    setActionState("idle");
  }, []);

  const onClick = useCallback((e) => {
    e.stopPropagation();
    soundManager.playClick?.();
    setActionState("happy");
    const icons = ["❤️", "⭐", "✨", "💫", "🌸"];
    const burst = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      icon: icons[Math.floor(Math.random() * icons.length)],
      dx: (Math.random() - 0.5) * 70,
      dy: -(20 + Math.random() * 50),
    }));
    setParticles(burst);
    setTimeout(() => setParticles([]), 1200);
    setTimeout(() => setActionState("idle"), 1500);
  }, []);

  return (
    <motion.div
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        width: size,
        height: size,
        cursor: isDragging ? "grabbing" : "grab",
        zIndex: isMain ? 10 : 5,
      }}
      animate={{
        scale: isDragging ? 1.15 : actionState === "happy" ? [1, 1.08, 1] : 1,
      }}
      transition={{ duration: 0.3 }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onClick={onClick}
    >
      {/* Glow halo */}
      {isMain && (
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255,182,193,0.5) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      )}

      <AnimatedCritter
        petType={petType}
        actionState={actionState}
        className="w-full h-full drop-shadow-lg"
      />

      {/* Shadow */}
      <div
        style={{
          position: "absolute",
          bottom: -4,
          left: "50%",
          transform: "translateX(-50%)",
          width: size * 0.6,
          height: 6,
          background: "rgba(0,0,0,0.12)",
          borderRadius: "50%",
          filter: "blur(3px)",
        }}
      />

      {/* Particles */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            style={{
              position: "absolute",
              top: "20%",
              left: "30%",
              fontSize: 16,
              pointerEvents: "none",
              zIndex: 20,
            }}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{ opacity: 0, x: p.dx, y: p.dy, scale: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {p.icon}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Clutter sandbox (the playful box) ───────────────────────────────────────
const ClutterSandbox = ({ critter }) => {
  const W = 260;
  const H = 160;

  // Build list: main critter + 2 companions (smaller)
  const cast = [
    { petType: critter.petType, size: 60, seed: 1, delay: 0, isMain: true },
    {
      petType: critter.companions[0],
      size: 42,
      seed: 2,
      delay: 0.4,
      isMain: false,
    },
    {
      petType: critter.companions[1],
      size: 36,
      seed: 3,
      delay: 0.8,
      isMain: false,
    },
  ];

  return (
    <div
      className={`sandbox-root relative rounded-2xl overflow-hidden bg-gradient-to-br ${critter.color.bg} border-2 ${critter.color.border}`}
      style={{ width: W, height: H, maxWidth: "100%" }}
    >
      {/* Sparkle decorations */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-xs pointer-events-none select-none"
          style={{
            left: `${15 + i * 18}%`,
            top: `${10 + (i % 3) * 25}%`,
            opacity: 0.35,
          }}
          animate={{ y: [0, -6, 0], opacity: [0.25, 0.5, 0.25] }}
          transition={{
            duration: 2.5 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          {["✨", "🌸", "⭐", "💫", "🍃"][i]}
        </motion.div>
      ))}

      {/* Tip label */}
      <div className="absolute bottom-1 right-2 text-[8px] font-bold opacity-25 pointer-events-none select-none">
        drag • click
      </div>

      {/* Roaming critters */}
      {cast.map((c, idx) => (
        <RoamingCritter
          key={idx}
          petType={c.petType}
          size={c.size}
          delay={c.delay}
          seed={c.seed}
          isMain={c.isMain}
          sandboxW={W}
          sandboxH={H}
        />
      ))}
    </div>
  );
};

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

      {/* Critters Gallery - Playful Clutter Sandboxes */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto mb-12"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-black font-serif text-cozy-dark mb-2">✨ Meet All Our Critters</h2>
          <p className="text-sm text-cozy-dark/60">Drag them, click them, and watch them roam!</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {CRITTERS.map((critter, idx) => (
            <motion.div
              key={critter.id}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              className="flex flex-col gap-0 h-full"
            >
              {/* Sandbox */}
              <ClutterSandbox critter={critter} />
              
              {/* Cute Pointer & Name Label */}
              <div className="relative pt-3">
                {/* Animated Arrow Pointer */}
                <motion.div
                  className="flex justify-center mb-1"
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="text-xl">👇</span>
                </motion.div>
                
                {/* Name Badge with cute background */}
                <motion.div
                  className="relative bg-gradient-to-r from-cozy-pink/10 to-cozy-sky/10 backdrop-blur-sm px-3 py-2 rounded-full border border-cozy-pink/20 text-center"
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(255,182,193,0.2)" }}
                >
                  <h3 className="text-sm font-black font-serif text-cozy-dark leading-tight">{critter.name}</h3>
                  <p className="text-xs text-cozy-dark/50 font-semibold">{critter.species}</p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8"
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
