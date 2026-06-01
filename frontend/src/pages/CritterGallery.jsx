import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowLeft, Sparkles, Star, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnimatedCritter from "../components/AnimatedCritter";
import { soundManager } from "../utils/sound";

// ─── Critter data ───────────────────────────────────────────────────────────
const CRITTERS = [
  {
    id: 1,
    name: "Bun-Bun",
    species: "Bunny",
    petType: "bunny",
    description: "A dreamy cloud-hopper who collects moonbeams and leaves tiny paw prints on your heart.",
    personality: "Dreamy & Tender",
    favoriteActivity: "Cloud-hopping",
    color: { bg: "from-pink-100 via-rose-50 to-pink-50", border: "border-pink-200", badge: "bg-pink-100 text-pink-700", glow: "rgba(255,182,193,0.35)" },
    companions: ["hamster", "chick"],
  },
  {
    id: 2,
    name: "Hammy",
    species: "Hamster",
    petType: "hamster",
    description: "A tiny architect who builds cozy dens out of acorns and warm thoughts.",
    personality: "Industrious & Warm",
    favoriteActivity: "Nest-building",
    color: { bg: "from-amber-100 via-orange-50 to-yellow-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-700", glow: "rgba(251,191,36,0.3)" },
    companions: ["bunny", "hedgehog"],
  },
  {
    id: 3,
    name: "Prickles",
    species: "Hedgehog",
    petType: "hedgehog",
    description: "Shy on the outside, but the softest soul — rolls into a ball when startled by hugs.",
    personality: "Shy & Sweet",
    favoriteActivity: "Leaf-rolling",
    color: { bg: "from-stone-100 via-amber-50 to-stone-50", border: "border-stone-200", badge: "bg-stone-100 text-stone-600", glow: "rgba(168,162,158,0.3)" },
    companions: ["hamster", "duck"],
  },
  {
    id: 4,
    name: "Bao",
    species: "Panda",
    petType: "panda",
    description: "The world's most enthusiastic napper. Will eat bamboo and offer you profound life wisdom.",
    personality: "Zen & Cuddly",
    favoriteActivity: "Bamboo Meditation",
    color: { bg: "from-slate-100 via-gray-50 to-white", border: "border-slate-200", badge: "bg-slate-100 text-slate-600", glow: "rgba(148,163,184,0.3)" },
    companions: ["koala", "chick"],
  },
  {
    id: 5,
    name: "Quackers",
    species: "Duck",
    petType: "duck",
    description: "Struts around like they own every puddle. Will loudly narrate your entire day.",
    personality: "Bold & Chatty",
    favoriteActivity: "Puddle Strutting",
    color: { bg: "from-yellow-100 via-amber-50 to-yellow-50", border: "border-yellow-200", badge: "bg-yellow-100 text-yellow-700", glow: "rgba(253,224,71,0.35)" },
    companions: ["chick", "bunny"],
  },
  {
    id: 6,
    name: "Pip",
    species: "Chick",
    petType: "chick",
    description: "A tiny yellow sunbeam that peeps at everything curiously and falls asleep mid-chirp.",
    personality: "Curious & Sleepy",
    favoriteActivity: "Chirping Solos",
    color: { bg: "from-yellow-100 via-lime-50 to-yellow-50", border: "border-yellow-300", badge: "bg-yellow-100 text-yellow-800", glow: "rgba(250,204,21,0.35)" },
    companions: ["duck", "hamster"],
  },
  {
    id: 7,
    name: "Whiskers",
    species: "Cat",
    petType: "cat",
    description: "Claims to be a lone wolf but secretly schedules purring sessions for everyone's benefit.",
    personality: "Aloof & Loving",
    favoriteActivity: "Strategic Napping",
    color: { bg: "from-orange-100 via-amber-50 to-orange-50", border: "border-orange-200", badge: "bg-orange-100 text-orange-700", glow: "rgba(251,146,60,0.3)" },
    companions: ["bunny", "panda"],
  },
  {
    id: 8,
    name: "Eucaly",
    species: "Koala",
    petType: "koala",
    description: "Hangs from everything, pronounces 'cozy' as if inventing the word every single time.",
    personality: "Laid-back & Soft",
    favoriteActivity: "Eucalyptus Dreams",
    color: { bg: "from-teal-100 via-slate-50 to-teal-50", border: "border-teal-200", badge: "bg-teal-100 text-teal-700", glow: "rgba(94,234,212,0.3)" },
    companions: ["panda", "hedgehog"],
  },
];

// ─── Single roaming critter inside the sandbox ───────────────────────────────
const RoamingCritter = ({ petType, size = 64, delay = 0, seed = 0, isMain = false, sandboxW, sandboxH }) => {
  const [pos, setPos] = useState({
    x: 30 + (seed * 97) % (sandboxW - size - 30),
    y: 20 + (seed * 53) % (sandboxH - size - 30),
  });
  const [target, setTarget] = useState(null);
  const [actionState, setActionState] = useState("idle");
  const [particles, setParticles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const posRef = useRef(pos);
  const animRef = useRef(null);

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
    return () => { clearTimeout(t); clearInterval(interval); };
  }, [sandboxW, sandboxH, size, delay]);

  // Lerp toward target
  useEffect(() => {
    if (!target || isDragging) return;
    let raf;
    const move = () => {
      setPos(prev => {
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
  const onPointerDown = useCallback((e) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setActionState("happy");
    const rect = e.currentTarget.closest(".sandbox-root").getBoundingClientRect();
    dragRef.current = {
      startX: e.clientX - posRef.current.x - size / 2,
      startY: e.clientY - posRef.current.y - size / 2,
      rect,
    };
  }, [size]);

  const onPointerMove = useCallback((e) => {
    if (!isDragging || !dragRef.current) return;
    const { rect, startX, startY } = dragRef.current;
    const nx = e.clientX - rect.left - startX;
    const ny = e.clientY - rect.top - startY;
    setPos({
      x: Math.max(0, Math.min(nx, sandboxW - size)),
      y: Math.max(0, Math.min(ny, sandboxH - size)),
    });
  }, [isDragging, sandboxW, sandboxH, size]);

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
      style={{ position: "absolute", left: pos.x, top: pos.y, width: size, height: size, cursor: isDragging ? "grabbing" : "grab", zIndex: isMain ? 10 : 5 }}
      animate={{ scale: isDragging ? 1.15 : actionState === "happy" ? [1, 1.08, 1] : 1 }}
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
          style={{ background: "radial-gradient(circle, rgba(255,182,193,0.5) 0%, transparent 70%)" }}
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
          position: "absolute", bottom: -4, left: "50%",
          transform: "translateX(-50%)",
          width: size * 0.6, height: 6,
          background: "rgba(0,0,0,0.12)",
          borderRadius: "50%",
          filter: "blur(3px)",
        }}
      />

      {/* Particles */}
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            style={{ position: "absolute", top: "20%", left: "30%", fontSize: 16, pointerEvents: "none", zIndex: 20 }}
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
  const W = 320;
  const H = 200;

  // Build list: main critter + 2 companions (smaller)
  const cast = [
    { petType: critter.petType, size: 72, seed: 1, delay: 0, isMain: true },
    { petType: critter.companions[0], size: 50, seed: 2, delay: 0.4, isMain: false },
    { petType: critter.companions[1], size: 44, seed: 3, delay: 0.8, isMain: false },
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
          style={{ left: `${15 + i * 18}%`, top: `${10 + (i % 3) * 25}%`, opacity: 0.35 }}
          animate={{ y: [0, -6, 0], opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
        >
          {["✨", "🌸", "⭐", "💫", "🍃"][i]}
        </motion.div>
      ))}

      {/* Tip label */}
      <div className="absolute bottom-1.5 right-2.5 text-[9px] font-bold opacity-30 pointer-events-none select-none">
        drag • click to pet
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

// ─── Gallery card ─────────────────────────────────────────────────────────────
const CritterCard = ({ critter, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="flex flex-col gap-0 rounded-3xl overflow-hidden"
      style={{
        boxShadow: hovered
          ? `0 20px 60px ${critter.color.glow}, 0 4px 20px rgba(0,0,0,0.08)`
          : "0 4px 20px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.3s",
        border: `3px solid`,
        borderColor: hovered ? "transparent" : "rgba(0,0,0,0.06)",
      }}
    >
      {/* ── Sandbox top ── */}
      <div className="flex justify-center items-center bg-white/30 px-3 pt-4 pb-2">
        <ClutterSandbox critter={critter} />
      </div>

      {/* ── Info bottom ── */}
      <div className="relative bg-white/80 backdrop-blur-md px-5 py-4 flex flex-col gap-2">
        {/* Shine */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-xl font-black font-serif text-cozy-dark leading-tight">{critter.name}</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-cozy-dark/40">{critter.species}</p>
          </div>
          <span className={`shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold ${critter.color.badge}`}>
            <Sparkles size={9} /> {critter.personality}
          </span>
        </div>

        <p className="text-xs text-cozy-dark/65 leading-relaxed">{critter.description}</p>

        <div className="flex items-center gap-1.5 pt-1 border-t border-cozy-dark/8">
          <Star size={11} className="text-cozy-pink" />
          <span className="text-[10px] font-bold text-cozy-dark/50">Loves:</span>
          <span className="text-[10px] font-bold text-cozy-pink">{critter.favoriteActivity}</span>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Gallery page ────────────────────────────────────────────────────────
const CritterGallery = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-[#FFF0E6] via-[#FFFDF9] to-[#FFEAE5] px-4 py-8">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,182,193,0.18) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.1, 1], x: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-5%] right-[-5%] w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(147,197,253,0.15) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.08, 1], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(167,243,208,0.12) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </div>

      {/* ── Header ── */}
      <header className="relative z-20 max-w-7xl mx-auto mb-10">
        <motion.button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-cozy-dark/60 hover:text-cozy-dark transition-colors font-bold mb-8 group"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft size={18} className="group-hover:text-cozy-pink transition-colors" />
          Back to Home
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <motion.span
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest font-extrabold text-cozy-pink mb-4"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Zap size={12} /> Interactive Critter Playground
          </motion.span>

          <h1 className="text-5xl md:text-6xl font-black font-serif text-cozy-dark mb-4 leading-tight">
            Meet the{" "}
            <span className="bg-gradient-to-r from-cozy-pink via-cozy-yellow to-cozy-sky bg-clip-text text-transparent">
              Gang 🐾
            </span>
          </h1>
          <p className="text-base text-cozy-dark/55 font-semibold max-w-xl mx-auto leading-relaxed">
            Each box is a tiny sanctuary — drag the critters around, click them for love, and watch their little friends tag along!
          </p>
        </motion.div>
      </header>

      {/* ── Gallery Grid ── */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-16">
        {CRITTERS.map((critter, idx) => (
          <CritterCard key={critter.id} critter={critter} index={idx} />
        ))}
      </div>

      {/* ── CTA ── */}
      <motion.section
        className="relative z-10 max-w-4xl mx-auto text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="bg-gradient-to-br from-cozy-pink/10 via-white/60 to-cozy-sky/10 rounded-3xl border-2 border-cozy-dark/8 p-8 md:p-12 backdrop-blur-md">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-5xl mb-4"
          >
            🏡
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-black font-serif text-cozy-dark mb-3">
            Ready to adopt your crew?
          </h2>
          <p className="text-base text-cozy-dark/55 mb-7 max-w-xl mx-auto">
            Create an account, pick your favorite critter, and start a cozy adventure together!
          </p>
          <motion.button
            onClick={() => navigate("/signup")}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="px-8 py-3.5 bg-gradient-to-r from-cozy-pink to-cozy-sky text-white font-bold rounded-full hover:shadow-xl transition-all text-sm"
          >
            Join the Sanctuary ✨
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};

export default CritterGallery;
