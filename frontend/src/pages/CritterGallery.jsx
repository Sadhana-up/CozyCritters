import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/UI/Button";
import { soundManager } from "../utils/sound";

const CritterGallery = () => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);

  const critters = [
    {
      id: 1,
      name: "Crazy Dodo",
      species: "Dodo",
      emoji: "🦤",
      description:
        "The cutest character with a quirky personality! Always bouncing around with excitement and spreading joy everywhere.",
      personality: "Quirky & Joyful",
      favoriteActivity: "Dancing",
    },
    {
      id: 2,
      name: "Rolly Scooby",
      species: "Dog",
      emoji: "🐕",
      description:
        "A playful and bouncy pup who loves zooming around and making friends. Scooby is always ready for an adventure!",
      personality: "Energetic & Friendly",
      favoriteActivity: "Playing Fetch",
    },
    {
      id: 3,
      name: "Petite Thorns",
      species: "Hedgehog",
      emoji: "🦔",
      description:
        "A tiny and adorable hedgehog with a prickly exterior but the sweetest heart. Loves curling up into a cozy ball.",
      personality: "Shy & Tender",
      favoriteActivity: "Curling Up",
    },
    {
      id: 4,
      name: "Sleepy Panda",
      species: "Panda",
      emoji: "🐼",
      description:
        "A gentle and peaceful panda who enjoys relaxing and munching bamboo. Always looks adorably sleepy!",
      personality: "Calm & Gentle",
      favoriteActivity: "Napping",
    },
    {
      id: 5,
      name: "Mini Chick",
      species: "Chick",
      emoji: "🐤",
      description:
        "A tiny yellow ball of fluff and cuteness! Mini Chick chirps cheerfully and waddles everywhere.",
      personality: "Cheerful & Bouncy",
      favoriteActivity: "Chirping",
    },
    {
      id: 6,
      name: "Zippy Hedgehog",
      species: "Hedgehog",
      emoji: "⚡",
      description:
        "A speedy little hedgehog with endless energy! Zippy loves to zoom around and make you smile with its antics.",
      personality: "Hyper & Playful",
      favoriteActivity: "Zooming",
    },
    {
      id: 7,
      name: "Fury Rat",
      species: "Rat",
      emoji: "🐭",
      description:
        "A feisty and confident rat with a big personality in a small package. Fury is brave, intelligent, and full of mischief!",
      personality: "Bold & Clever",
      favoriteActivity: "Exploring",
    },
    {
      id: 8,
      name: "Cocoala",
      species: "Koala",
      emoji: "🐨",
      description:
        "A laid-back and cuddly koala who loves napping in eucalyptus trees and giving warm hugs.",
      personality: "Cozy & Loving",
      favoriteActivity: "Hugging",
    },
    {
      id: 9,
      name: "Sparkly Starfish",
      species: "Starfish",
      emoji: "🌟",
      description:
        "A magical underwater friend that shimmers and glows! Sparkly Starfish brings oceanic wonder and dreams to your day.",
      personality: "Magical & Dreamy",
      favoriteActivity: "Shimmering",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleCardClick = (critter) => {
    soundManager.playClick();
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#FFF0E6] via-[#FFFDF9] to-[#FFEAE5] px-4 py-8">
      {/* Animated background elements */}
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
      <header className="relative z-20 max-w-7xl mx-auto mb-12">
        <motion.button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-cozy-dark/70 hover:text-cozy-dark transition-colors font-bold mb-8"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft size={20} />
          Back to Home
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-black font-serif text-cozy-dark mb-4">
            Meet Our Critters 🌟
          </h1>
          <p className="text-lg text-cozy-dark/60 font-semibold max-w-2xl mx-auto">
            Each critter has their own unique personality, quirks, and favorite
            activities. Hover over any character to learn more about them!
          </p>
        </motion.div>
      </header>

      {/* Gallery Grid */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {critters.map((critter, idx) => (
          <motion.div
            key={critter.id}
            variants={cardVariants}
            onHoverStart={() => setHoveredId(critter.id)}
            onHoverEnd={() => setHoveredId(null)}
            onClick={() => handleCardClick(critter)}
            className="group cursor-pointer h-full"
          >
            <div className="relative h-full bg-white/60 backdrop-blur-md rounded-3xl border-[3px] border-cozy-dark/10 p-6 overflow-hidden transition-all duration-300 hover:border-cozy-pink/50 hover:shadow-2xl">
              {/* Shine overlay */}
              <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-3xl" />

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full gap-4">
                {/* Emoji - Large and centered */}
                <motion.div
                  className="text-6xl text-center"
                  animate={
                    hoveredId === critter.id
                      ? { scale: 1.2, y: -10 }
                      : { scale: 1, y: 0 }
                  }
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {critter.emoji}
                </motion.div>

                {/* Name */}
                <div className="text-center">
                  <h2 className="text-2xl font-black font-serif text-cozy-dark">
                    {critter.name}
                  </h2>
                  <p className="text-xs font-bold text-cozy-dark/50 uppercase tracking-widest">
                    {critter.species}
                  </p>
                </div>

                {/* Personality Badge */}
                <motion.div
                  className="flex justify-center"
                  animate={
                    hoveredId === critter.id ? { scale: 1.05 } : { scale: 1 }
                  }
                >
                  <span className="inline-block px-4 py-1 bg-cozy-pink/15 border border-cozy-pink/30 rounded-full text-xs font-bold text-cozy-dark/70">
                    ✨ {critter.personality}
                  </span>
                </motion.div>

                {/* Description */}
                <p className="text-sm text-cozy-dark/70 leading-relaxed flex-grow">
                  {critter.description}
                </p>

                {/* Favorite Activity */}
                <motion.div
                  className="pt-3 border-t border-cozy-dark/10 text-center"
                  animate={
                    hoveredId === critter.id
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0.7, y: 5 }
                  }
                >
                  <p className="text-xs font-bold text-cozy-dark/50">
                    Favorite Activity
                  </p>
                  <p className="text-sm font-bold text-cozy-pink mt-1">
                    💫 {critter.favoriteActivity}
                  </p>
                </motion.div>

                {/* Heart animation on hover */}
                <AnimatedHeart show={hoveredId === critter.id} />
              </div>

              {/* Hover background glow */}
              <motion.div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                animate={
                  hoveredId === critter.id
                    ? {
                        boxShadow: [
                          "inset 0 0 0px rgba(255, 182, 193, 0)",
                          "inset 0 0 20px rgba(255, 182, 193, 0.2)",
                          "inset 0 0 0px rgba(255, 182, 193, 0)",
                        ],
                      }
                    : {}
                }
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Section */}
      <motion.section
        className="relative z-10 max-w-7xl mx-auto text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="bg-gradient-to-r from-cozy-pink/10 to-cozy-sky/10 rounded-3xl border-2 border-cozy-dark/10 p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-black font-serif text-cozy-dark mb-4">
            Ready to adopt your favorite critter? 🎉
          </h2>
          <p className="text-lg text-cozy-dark/60 mb-6 max-w-2xl mx-auto">
            Create an account and start your cozy adventure with these amazing
            characters!
          </p>
          <motion.button
            onClick={() => navigate("/signup")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-cozy-pink to-cozy-sky text-white font-bold rounded-full hover:shadow-lg transition-all"
          >
            Join the Sanctuary
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};

// Animated heart particles
const AnimatedHeart = ({ show }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="absolute top-4 right-4 pointer-events-none"
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, x: 0, y: 0 }}
          animate={{ opacity: 0, x: Math.random() * 20 - 10, y: -20 }}
          transition={{ duration: 1, delay: i * 0.1 }}
          className="absolute"
        >
          <Heart size={16} className="text-cozy-pink fill-cozy-pink" />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CritterGallery;
