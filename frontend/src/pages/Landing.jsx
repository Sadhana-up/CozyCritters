import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Heart,
  Moon,
  Smile,
  ShieldCheck,
  Gamepad2,
} from "lucide-react";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import { authService } from "../services/api";

const Landing = () => {
  const navigate = useNavigate();
  const isLoggedIn = authService.isAuthenticated();

  const handleCTA = () => {
    soundManager.playClick();
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  // Keywords and themes floating around the pet cup
  const pillBadges = [
    {
      text: "Nurture",
      color: "bg-cozy-pink",
      x: "-15%",
      y: "12%",
      rotate: -8,
      delay: 0.2,
      duration: 4.5,
    },
    {
      text: "Cozy",
      color: "bg-cozy-yellow",
      x: "115%",
      y: "20%",
      rotate: 6,
      delay: 0.5,
      duration: 5.2,
    },
    {
      text: "Bond",
      color: "bg-cozy-sky",
      x: "-22%",
      y: "68%",
      rotate: 10,
      delay: 0.8,
      duration: 4.8,
    },
    {
      text: "Rest",
      color: "bg-cozy-lavender",
      x: "105%",
      y: "72%",
      rotate: -12,
      delay: 1.1,
      duration: 5.5,
    },
    {
      text: "Mindful",
      color: "bg-white",
      x: "35%",
      y: "-15%",
      rotate: -3,
      delay: 1.4,
      duration: 6.0,
    },
    {
      text: "Joy",
      color: "bg-cozy-green",
      x: "-10%",
      y: "40%",
      rotate: -6,
      delay: 0.3,
      duration: 5.0,
    },
    {
      text: "Adorable",
      color: "bg-white",
      x: "118%",
      y: "45%",
      rotate: 8,
      delay: 0.9,
      duration: 4.7,
    },
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-cozy-canvas px-4 py-6 md:px-8">
      {/* ================= BACKGROUND ARTISTIC ELEMENTS (Maisonette Style) ================= */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft watercolor brush spots */}
        <div className="absolute -top-20 -left-20 w-80 h-80 watercolor-peach rounded-full opacity-60" />
        <div className="absolute top-[40%] -right-20 w-96 h-96 watercolor-pink rounded-full opacity-50" />
        <div className="absolute -bottom-20 left-[20%] w-[450px] h-[450px] watercolor-green rounded-full opacity-40" />
        <div className="absolute bottom-[20%] -left-10 w-72 h-72 watercolor-yellow rounded-full opacity-50" />

        {/* Floating subtle background lines/shapes (artistic watercolor accent) */}
        <svg
          className="absolute right-[8%] top-[18%] opacity-35"
          width="80"
          height="80"
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle
            cx="50"
            cy="50"
            r="30"
            stroke="#FFB7B2"
            strokeWidth="4"
            strokeDasharray="6 6"
          />
          <path
            d="M 50 10 L 50 25 M 50 75 L 50 90 M 10 50 L 25 50 M 75 50 L 90 50"
            stroke="#FFB7B2"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        <svg
          className="absolute left-[8%] bottom-[25%] opacity-30"
          width="60"
          height="60"
          viewBox="0 0 100 100"
          fill="none"
        >
          <path d="M 20 20 Q 50 50 80 20 Q 50 80 20 20 Z" fill="#E0BBE4" />
        </svg>
      </div>

      {/* ================= HEADER / NAVIGATION ================= */}
      <header className="relative z-10 max-w-6xl mx-auto w-full flex justify-between items-center py-2 px-1 border-b-[2px] border-cozy-dark/5">
        <div
          className="flex items-center gap-3 select-none cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="text-xl md:text-2xl font-bold font-serif tracking-wide text-cozy-dark">
            Cozy Critters
          </span>
        </div>

        {/* Minimalist Editorial Menu Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-widest text-cozy-dark/60">
          <a
            href="#adoptions"
            className="hover:text-cozy-dark transition-colors"
          >
            Adoptions
          </a>
          <a href="#rituals" className="hover:text-cozy-dark transition-colors">
            Daily Rituals
          </a>
          <a href="#about" className="hover:text-cozy-dark transition-colors">
            Journal
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <Button
                variant="white"
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-xs border-[2px] rounded-xl shadow-none active:translate-y-0.5"
              >
                Sign In
              </Button>
              <Button
                variant="pink"
                onClick={() => navigate("/signup")}
                className="px-4 py-2 text-xs border-[2px] rounded-xl shadow-none bg-cozy-pink active:translate-y-0.5 font-bold"
              >
                Adopt
              </Button>
            </>
          ) : (
            <Button
              variant="green"
              onClick={() => navigate("/dashboard")}
              className="px-5 py-2 text-xs border-[2px] rounded-xl shadow-none bg-cozy-green active:translate-y-0.5 font-bold"
            >
              Enter Garden
            </Button>
          )}
        </div>
      </header>

      {/* ================= HERO / VISUAL SANDBOX ================= */}
      <main className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 my-auto py-8 items-center">
        {/* Left Side: Elegant Editorial Content (Maisonette Style) */}
        <div className="lg:col-span-5 flex flex-col justify-center text-left gap-6">
          <div className="flex flex-col gap-4">
            <span className="text-xs uppercase tracking-widest font-extrabold text-cozy-pink flex items-center gap-1.5">
              <Sparkles size={14} /> A Tranquil Virtual Pet Experience
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-serif text-cozy-dark leading-[1.08] tracking-tight">
              A whimsical safe haven for little bubbly friends.
            </h1>
            <p className="text-sm md:text-base font-bold text-cozy-dark/65 leading-relaxed mt-2">
              Hatch, nurture, and grow your digital companions inside a soft,
              dreamy browser sanctuary. CozyCritters is designed for daily
              warmth, slow mindful care, and pleasant offline growth.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 items-center mt-3">
            <Button
              variant="pink"
              onClick={handleCTA}
              className="px-8 py-4.5 text-base font-extrabold border-[3px] rounded-2xl shadow-cozy hover:shadow-cozy-lg transition-all"
            >
              Adopt a Companion
            </Button>

            <div className="flex items-center gap-2 text-xs font-bold text-cozy-dark/50">
              <ShieldCheck size={16} className="text-cozy-green" />
              <span>Free caretaking logs included.</span>
            </div>
          </div>
        </div>

        {/* Right Side: 3D Clay Cup Centerpiece (Kawaii Coffee Style) */}
        <div className="lg:col-span-7 flex items-center justify-center relative mt-6 lg:mt-0">
          {/* Main 3D Clay Pet mug container */}
          <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
            {/* Interactive floating badges around centerpiece */}
            {pillBadges.map((badge, idx) => (
              <motion.div
                key={idx}
                className={`absolute ${badge.color} border-[2.5px] border-cozy-dark px-4 py-2.5 rounded-full text-xs font-black text-cozy-dark shadow-cozy-sm select-none z-20`}
                style={{
                  left: badge.x,
                  top: badge.y,
                  transform: `rotate(${badge.rotate}deg)`,
                }}
                animate={{
                  y: [0, -10, 0],
                  rotate: [
                    badge.rotate,
                    badge.rotate + (idx % 2 === 0 ? 3 : -3),
                    badge.rotate,
                  ],
                }}
                transition={{
                  duration: badge.duration,
                  repeat: Infinity,
                  delay: badge.delay,
                  ease: "easeInOut",
                }}
              >
                {badge.text}
              </motion.div>
            ))}

            {/* Central 3D render graphic card */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full h-full flex items-center justify-center z-10"
            >
              {/* Outer soft 3D-feeling shadow plate */}
              <div className="absolute inset-4 bg-white border-[3px] border-cozy-dark rounded-[3.5rem] shadow-cozy-lg overflow-hidden flex items-center justify-center p-2.5 bg-[#FFF9F2]">
                <img
                  src="/cozy_pet_hero.png"
                  alt="3D Clay Bunny Pet Mug"
                  className="w-full h-full object-cover rounded-[2.8rem] hover:scale-103 transition-transform duration-500 pointer-events-none select-none"
                />
              </div>

              {/* Decorative sparkles */}
              <div className="absolute top-[8%] left-[10%] text-3xl animate-pulse">
                ✨
              </div>
              <div className="absolute bottom-[10%] right-[10%] text-3xl animate-bounce">
                🌸
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* ================= DETAILS / RITUALS SECTION ================= */}
      <section
        id="rituals"
        className="relative z-10 max-w-6xl mx-auto w-full pt-10 pb-4 border-t-[2px] border-cozy-dark/5"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black font-serif text-cozy-dark">
            Mindful Care Rituals
          </h2>
          <p className="text-xs font-bold text-cozy-dark/45 uppercase tracking-widest mt-1">
            Simple, gentle interactions for daily bonding
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-[2.5px] p-5 flex flex-col gap-2.5 bg-white text-left hover:scale-[1.01] transition-transform">
            <div className="w-10 h-10 rounded-xl bg-cozy-yellow/30 border-2 border-cozy-yellow flex items-center justify-center text-xl">
              🍎
            </div>
            <h3 className="font-extrabold text-sm font-serif">
              Nourishing Apples
            </h3>
            <p className="text-xs font-semibold text-cozy-dark/60 leading-relaxed">
              Feeding your pet tasty apples decreases hunger levels. Balanced
              satiation ensures they stay energetic enough to join you in sweet
              backyard adventures.
            </p>
          </Card>

          <Card className="border-[2.5px] p-5 flex flex-col gap-2.5 bg-white text-left hover:scale-[1.01] transition-transform">
            <div className="w-10 h-10 rounded-xl bg-cozy-pink/30 border-2 border-cozy-pink flex items-center justify-center text-xl">
              🎾
            </div>
            <h3 className="font-extrabold text-sm font-serif">
              Exciting Activities
            </h3>
            <p className="text-xs font-semibold text-cozy-dark/60 leading-relaxed">
              Play with your pet to boost happiness. Interactive jumps, excited
              spins, and sparkles strengthen your emotional bonds, keeping their
              mood bright and happy!
            </p>
          </Card>

          <Card className="border-[2.5px] p-5 flex flex-col gap-2.5 bg-white text-left hover:scale-[1.01] transition-transform">
            <div className="w-10 h-10 rounded-xl bg-cozy-green/30 border-2 border-cozy-green flex items-center justify-center text-xl">
              😴
            </div>
            <h3 className="font-extrabold text-sm font-serif">
              Starry Slumber
            </h3>
            <p className="text-xs font-semibold text-cozy-dark/60 leading-relaxed">
              Rest allows energy levels to rise. When twilight sets, let your
              little bunny or kitty sleep inside their cozy basket to prepare
              for a brand new day of play.
            </p>
          </Card>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full flex flex-col md:flex-row justify-between items-center text-center text-[10px] font-bold text-cozy-dark/40 py-4 border-t-[2px] border-cozy-dark/5 mt-4">
        <p>
          © 2026 CozyCritters • Designed with Whimsical Watercolor pastels 🌸
        </p>
        <p className="mt-1 md:mt-0 font-serif italic text-xs">
          "Hatch a small bundle of joy, one snuggle at a time."
        </p>
      </footer>
    </div>
  );
};

export default Landing;
