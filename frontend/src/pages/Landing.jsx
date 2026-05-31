import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Heart,
  ShieldCheck,
  Apple,
  Zap,
  Moon as MoonIcon,
} from "lucide-react";
import Button from "../components/UI/Button";
import CloudLogo from "../components/CloudLogo";
import DreamyBackground from "../components/DreamyBackground";
import MovablePet from "../components/MovablePet";
import Jelly3DButton from "../components/Jelly3DButton";
import CollectibleCard from "../components/CollectibleCard";
import CloudNavigation from "../components/CloudNavigation";
import { authService } from "../services/api";
import { soundManager } from "../utils/sound";

const Landing = () => {
  const navigate = useNavigate();
  const isLoggedIn = authService.isAuthenticated();

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#FFF0E6] via-[#FFFDF9] to-[#FFEAE5] px-4 py-6 md:px-8">
      {/* Dreamy background with parallax layers */}
      <DreamyBackground />

      {/* ================= HEADER / NAVIGATION ================= */}
      <header className="relative z-20 max-w-7xl mx-auto w-full flex justify-between items-center py-4 px-2 border-b-[2px] border-cozy-dark/5">
        <motion.div
          className="flex items-center gap-2 select-none cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.05 }}
        >
          <CloudLogo size="sm" />
          <span className="text-xl font-bold font-serif tracking-wide text-cozy-dark hidden sm:inline">
            Cozy Critters
          </span>
        </motion.div>

        {/* Minimalist menu */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-widest text-cozy-dark/50">
          <motion.a
            href="#critters"
            className="hover:text-cozy-dark transition-colors"
            whileHover={{ scale: 1.1 }}
          >
            Our Critters
          </motion.a>
          <motion.a
            href="#rituals"
            className="hover:text-cozy-dark transition-colors"
            whileHover={{ scale: 1.1 }}
          >
            How It Works
          </motion.a>
          <motion.button
            onClick={() => navigate("/gallery")}
            className="px-4 py-2 bg-cozy-pink/20 hover:bg-cozy-pink/30 rounded-full transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Gallery
          </motion.button>
        </nav>

        {/* Cloud Navigation - Auth buttons on mobile */}
        <div className="md:hidden">
          <CloudNavigation isLoggedIn={isLoggedIn} />
        </div>
      </header>

      {/* ================= CLOUD NAVIGATION - Desktop ================= */}
      <motion.div
        className="hidden md:flex relative z-15 justify-center py-8 mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <CloudNavigation isLoggedIn={isLoggedIn} />
      </motion.div>

      {/* ================= HERO SECTION ================= */}
      <main className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 my-auto py-12 items-center">
        {/* Left: Editorial Content */}
        <motion.div
          className="lg:col-span-5 flex flex-col justify-center text-left gap-8"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col gap-5">
            <motion.span
              className="text-xs uppercase tracking-widest font-extrabold text-cozy-pink flex items-center gap-2"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles size={14} /> 9 Unique Personalities Await
            </motion.span>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black font-serif text-cozy-dark leading-[0.95] tracking-tight">
              Meet Your
              <br />
              <span className="bg-gradient-to-r from-cozy-pink via-cozy-yellow to-cozy-sky bg-clip-text text-transparent">
                New Fuzzy Friends
              </span>
            </h1>

            <p className="text-base md:text-lg font-semibold text-cozy-dark/70 leading-relaxed max-w-md">
              Discover 9 adorable critters, each with their own unique
              personality, quirks, and favorite activities. Build meaningful
              bonds in a warm, cozy sanctuary.
            </p>
          </div>

          <motion.div
            className="flex items-center justify-start gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="flex items-center gap-2 text-xs font-bold text-cozy-dark/50 bg-white/50 backdrop-blur-sm px-4 py-3 rounded-2xl border border-cozy-dark/10"
              whileHover={{ y: -2 }}
            >
              <ShieldCheck size={16} className="text-cozy-green" />
              <span>Free forever. No ads.</span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.button
              onClick={() => navigate("/gallery")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-cozy-pink/20 hover:bg-cozy-pink/30 text-cozy-dark font-bold rounded-full transition-all text-sm"
            >
              View Gallery
            </motion.button>

            {!isLoggedIn && (
              <motion.button
                onClick={() => navigate("/signup")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-cozy-pink to-cozy-sky text-white font-bold rounded-full hover:shadow-lg transition-all text-sm"
              >
                Join Now
              </motion.button>
            )}
          </motion.div>
        </motion.div>

        {/* Right: Multiple Movable Pet Characters */}
        <motion.div
          className="lg:col-span-7 grid grid-cols-3 gap-6 items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Pet 1 - Bunny */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <MovablePet petType="bunny" />
          </motion.div>

          {/* Pet 2 - Hamster */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <MovablePet petType="hamster" />
          </motion.div>

          {/* Pet 3 - Hedgehog */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <MovablePet petType="hedgehog" />
          </motion.div>

          {/* Pet 4 - Panda */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <MovablePet petType="panda" />
          </motion.div>

          {/* Pet 5 - Duck */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <MovablePet petType="duck" />
          </motion.div>

          {/* Pet 6 - Chick */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <MovablePet petType="chick" />
          </motion.div>

          {/* Pet 7 - Cat */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <MovablePet petType="cat" />
          </motion.div>

          {/* Pet 8 - Koala */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <MovablePet petType="koala" />
          </motion.div>

          {/* Pet 9 - Bunny (extra) */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <MovablePet petType="hamster" />
          </motion.div>
        </motion.div>
      </main>

      {/* ================= HOW IT WORKS SECTION ================= */}
      <section
        id="rituals"
        className="relative z-10 max-w-7xl mx-auto w-full pt-16 pb-12 border-t-[2px] border-cozy-dark/10"
      >
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-black font-serif text-cozy-dark mb-3">
            How It Works
          </h2>
          <p className="text-sm font-semibold text-cozy-dark/50 uppercase tracking-widest">
            Simple, playful interactions to build your bond
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <CollectibleCard
            icon={Apple}
            title="Nourishing Meals"
            description="Feed your companion delicious meals to decrease hunger. Balanced nutrition keeps them energetic and ready for adventures."
            color="pink"
            index={0}
          />

          <CollectibleCard
            icon={Zap}
            title="Interactive Play"
            description="Play games to boost happiness and strengthen your emotional bond. Keep their spirits high with fun activities."
            color="sky"
            index={1}
          />

          <CollectibleCard
            icon={MoonIcon}
            title="Restful Sleep"
            description="Quality rest restores energy levels. Let your companion sleep peacefully to prepare for another wonderful day."
            color="green"
            index={2}
          />
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center text-center text-[11px] font-bold text-cozy-dark/40 py-6 border-t-[2px] border-cozy-dark/5 mt-8">
        <p>© 2026 CozyCritters • Crafted with Love and Care</p>
        <p className="mt-2 md:mt-0 font-serif italic text-xs">
          "Hatch a small bundle of joy, one snuggle at a time."
        </p>
      </footer>
    </div>
  );
};

export default Landing;
