import React from 'react';
import { motion } from 'framer-motion';

const CritterAvatar = ({
  species = 'Critter',
  actionState = 'idle', // 'idle', 'feed', 'play', 'sleep'
  className = '',
}) => {
  const normSpecies = (species || 'Critter').toLowerCase();

  // Color mappings for species
  const colors = {
    bunny: { body: '#FFD1DC', ears: '#FFC0CB', details: '#FFA7B6' }, // Pastel Pink
    kitty: { body: '#E0F2F1', ears: '#B2DFDB', details: '#4DB6AC' }, // Minty Teal
    bear: { body: '#FFE0B2', ears: '#FFCC80', details: '#FB8C00' }, // Caramel Honey
    frog: { body: '#DCEDC8', ears: '#C5E1A5', details: '#7CB342' }, // Soft Lime
    critter: { body: '#FFF9C4', ears: '#FFF59D', details: '#FBC02D' }, // Butter Yellow (Default)
  };

  const petColor = colors[normSpecies] || colors.critter;

  // Decide face eyes based on state
  const renderEyes = () => {
    if (actionState === 'sleep') {
      // Closed sleeping eyes: uu
      return (
        <g stroke="#4A3E3D" strokeWidth="4.5" strokeLinecap="round" fill="none">
          <path d="M 28 50 q 6 6 12 0" />
          <path d="M 60 50 q 6 6 12 0" />
        </g>
      );
    }
    if (actionState === 'play') {
      // Excited happy eyes: ^ ^
      return (
        <g stroke="#4A3E3D" strokeWidth="5.5" strokeLinecap="round" fill="none">
          <path d="M 28 52 l 6 -6 l 6 6" />
          <path d="M 60 52 l 6 -6 l 6 6" />
        </g>
      );
    }
    // Normal cute twinkling eyes
    return (
      <g>
        <circle cx="34" cy="48" r="7" fill="#4A3E3D" />
        <circle cx="66" cy="48" r="7" fill="#4A3E3D" />
        {/* Twinkle highlights */}
        <circle cx="32" cy="45" r="2.5" fill="#FFFFFF" />
        <circle cx="64" cy="45" r="2.5" fill="#FFFFFF" />
      </g>
    );
  };

  // Render different species ears/details
  const renderSpeciesFeatures = () => {
    switch (normSpecies) {
      case 'bunny':
        return (
          <g>
            {/* Left long ear */}
            <path d="M 20 25 C 10 -15, 30 -15, 30 25 Z" fill={petColor.ears} stroke="#4A3E3D" strokeWidth="4.5" strokeLinejoin="round" />
            <path d="M 22 22 C 16 0, 26 0, 27 22 Z" fill="#FFA7B6" />
            
            {/* Right long ear */}
            <path d="M 70 25 C 70 -15, 90 -15, 80 25 Z" fill={petColor.ears} stroke="#4A3E3D" strokeWidth="4.5" strokeLinejoin="round" />
            <path d="M 73 22 C 74 0, 84 0, 78 22 Z" fill="#FFA7B6" />
          </g>
        );
      case 'kitty':
        return (
          <g>
            {/* Left pointed ear */}
            <polygon points="12,28 32,5 42,28" fill={petColor.ears} stroke="#4A3E3D" strokeWidth="4.5" strokeLinejoin="round" />
            <polygon points="18,25 32,10 38,25" fill="#FFA7B6" />
            
            {/* Right pointed ear */}
            <polygon points="58,28 68,5 88,28" fill={petColor.ears} stroke="#4A3E3D" strokeWidth="4.5" strokeLinejoin="round" />
            <polygon points="62,25 68,10 82,25" fill="#FFA7B6" />

            {/* Whiskers */}
            <g stroke="#4A3E3D" strokeWidth="3" strokeLinecap="round">
              {/* Left whiskers */}
              <line x1="10" y1="52" x2="-2" y2="50" />
              <line x1="10" y1="58" x2="-5" y2="58" />
              {/* Right whiskers */}
              <line x1="90" y1="52" x2="102" y2="50" />
              <line x1="90" y1="58" x2="105" y2="58" />
            </g>
          </g>
        );
      case 'bear':
        return (
          <g>
            {/* Left round ear */}
            <circle cx="22" cy="18" r="14" fill={petColor.ears} stroke="#4A3E3D" strokeWidth="4.5" />
            <circle cx="22" cy="18" r="8" fill="#FFA7B6" />
            
            {/* Right round ear */}
            <circle cx="78" cy="18" r="14" fill={petColor.ears} stroke="#4A3E3D" strokeWidth="4.5" />
            <circle cx="78" cy="18" r="8" fill="#FFA7B6" />
          </g>
        );
      case 'frog':
        return (
          <g>
            {/* Frog eyes resting on top of body */}
            <circle cx="30" cy="22" r="13" fill={petColor.body} stroke="#4A3E3D" strokeWidth="4.5" />
            <circle cx="30" cy="22" r="7" fill="#FFFFFF" />
            <circle cx="30" cy="22" r="3" fill="#4A3E3D" />

            <circle cx="70" cy="22" r="13" fill={petColor.body} stroke="#4A3E3D" strokeWidth="4.5" />
            <circle cx="70" cy="22" r="7" fill="#FFFFFF" />
            <circle cx="70" cy="22" r="3" fill="#4A3E3D" />
          </g>
        );
      default:
        // Default Critter: cute puff ears
        return (
          <g>
            <circle cx="20" cy="22" r="10" fill={petColor.ears} stroke="#4A3E3D" strokeWidth="4.5" />
            <circle cx="80" cy="22" r="10" fill={petColor.ears} stroke="#4A3E3D" strokeWidth="4.5" />
          </g>
        );
    }
  };

  // Animation variants
  const animations = {
    idle: {
      y: [0, -6, 0],
      scaleY: [1, 0.97, 1.03, 1],
      transition: {
        duration: 2.2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    feed: {
      x: [0, -4, 4, -4, 4, 0],
      scaleY: [1, 1.08, 0.95, 1.08, 1],
      transition: {
        duration: 0.6,
        ease: 'linear',
      },
    },
    play: {
      y: [0, -75, 0],
      rotate: [0, 180, 360],
      scaleY: [1, 0.8, 1.1, 1],
      transition: {
        duration: 0.75,
        ease: 'easeOut',
      },
    },
    sleep: {
      y: [0, -2, 0],
      rotate: 12,
      opacity: 0.78,
      transition: {
        y: {
          duration: 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
        },
        rotate: { duration: 0.4 },
        opacity: { duration: 0.4 },
      },
    },
  };

  return (
    <div className={`relative flex items-center justify-center select-none w-48 h-48 ${className}`}>
      
      {/* Particle stars / hearts for special actions */}
      {actionState === 'feed' && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <motion.span initial={{ scale: 0, opacity: 1, y: 10, x: -10 }} animate={{ scale: 1.4, opacity: 0, y: -45 }} className="absolute left-[20%] top-[10%] text-2xl">❤️</motion.span>
          <motion.span initial={{ scale: 0, opacity: 1, y: 10, x: 10 }} animate={{ scale: 1.4, opacity: 0, y: -50 }} className="absolute right-[20%] top-[15%] text-2xl">🍎</motion.span>
        </div>
      )}

      {actionState === 'play' && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <motion.span initial={{ scale: 0, opacity: 1, y: 0 }} animate={{ scale: 1.5, opacity: 0, y: -65, x: -40 }} className="absolute left-[10%] top-[20%] text-2xl">✨</motion.span>
          <motion.span initial={{ scale: 0, opacity: 1, y: 0 }} animate={{ scale: 1.5, opacity: 0, y: -70, x: 40 }} className="absolute right-[10%] top-[20%] text-2xl">🎾</motion.span>
          <motion.span initial={{ scale: 0, opacity: 1, y: 0 }} animate={{ scale: 1.3, opacity: 0, y: -80 }} className="absolute left-[45%] top-[5%] text-2xl">🌸</motion.span>
        </div>
      )}

      {actionState === 'sleep' && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <motion.span initial={{ scale: 0.5, opacity: 0, y: 15 }} animate={{ scale: [0.8, 1.3, 0.7], opacity: [0, 0.9, 0], y: -55, x: 25 }} transition={{ repeat: Infinity, duration: 3, delay: 0.5 }} className="absolute right-[10%] top-[10%] text-xl font-bold text-cozy-violet select-none">Zzz</motion.span>
          <motion.span initial={{ scale: 0.5, opacity: 0, y: 15 }} animate={{ scale: [0.8, 1.3, 0.7], opacity: [0, 0.9, 0], y: -65, x: 15 }} transition={{ repeat: Infinity, duration: 3, delay: 1.8 }} className="absolute right-[30%] top-[-5%] text-sm font-bold text-cozy-violet select-none">Zzz</motion.span>
        </div>
      )}

      {/* Critter Shadow */}
      <motion.div
        className="absolute bottom-1 w-32 h-4 bg-cozy-dark/10 rounded-full blur-[2px] z-0"
        animate={{
          scaleX: actionState === 'play' ? [1, 0.4, 1] : actionState === 'sleep' ? 0.95 : [1, 1.05, 0.95, 1],
          opacity: actionState === 'play' ? [0.4, 0.05, 0.4] : 0.3,
        }}
        transition={{
          duration: actionState === 'play' ? 0.75 : 2.2,
          repeat: actionState === 'play' ? 0 : Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Animated SVG Body */}
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full z-10 drop-shadow-[0_8px_16px_rgba(74,62,61,0.08)]"
        variants={animations}
        animate={actionState}
      >
        {/* Render species ears/details (behind body) */}
        {normSpecies !== 'frog' && renderSpeciesFeatures()}

        {/* Main round body */}
        <circle cx="50" cy="55" r="34" fill={petColor.body} stroke="#4A3E3D" strokeWidth="4.5" />

        {/* Render frog eyes on top of body */}
        {normSpecies === 'frog' && renderSpeciesFeatures()}

        {/* Blushing Cheeks */}
        <ellipse cx="26" cy="58" rx="6" ry="4" fill="#FFB7B2" opacity="0.85" />
        <ellipse cx="74" cy="58" rx="6" ry="4" fill="#FFB7B2" opacity="0.85" />

        {/* Render Eyes */}
        {renderEyes()}

        {/* Mouth */}
        {actionState === 'feed' ? (
          // Eating open mouth
          <circle cx="50" cy="62" r="5" fill="#4A3E3D" />
        ) : actionState === 'sleep' ? (
          // Soft sleeping o-mouth
          <circle cx="50" cy="61" r="2.5" fill="none" stroke="#4A3E3D" strokeWidth="3" />
        ) : (
          // Happy cute mouth (w-shape / cat smile)
          <path
            d="M 45 59 q 2.5 3 5 0 q 2.5 3 5 0"
            stroke="#4A3E3D"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        )}
      </motion.svg>
    </div>
  );
};

export default CritterAvatar;
