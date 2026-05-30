import React from "react";
import { motion } from "framer-motion";

const CollectibleCard = ({
  icon: Icon,
  title,
  description,
  color = "pink",
  index = 0,
}) => {
  const colorMap = {
    pink: {
      bg: "bg-gradient-to-br from-[#FFE5E8] to-[#FFD4DC]",
      icon: "bg-cozy-pink/30",
      border: "border-cozy-pink",
      accent: "cozy-pink",
    },
    sky: {
      bg: "bg-gradient-to-br from-[#E0F7FF] to-[#D1EFFF]",
      icon: "bg-cozy-sky/30",
      border: "border-cozy-sky",
      accent: "cozy-sky",
    },
    green: {
      bg: "bg-gradient-to-br from-[#E8F5E9] to-[#D4EDDA]",
      icon: "bg-cozy-green/30",
      border: "border-cozy-green",
      accent: "cozy-green",
    },
  };

  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{
        y: -12,
        rotateX: 8,
        rotateZ: -2,
        scale: 1.05,
      }}
      style={{ perspective: "1000px" }}
      className="h-full"
    >
      <div
        className={`relative h-full rounded-3xl ${c.bg} border-[3px] ${c.border} p-8 overflow-hidden group
          transition-all duration-300 hover:shadow-2xl`}
        style={{
          boxShadow: `
            0 10px 30px rgba(0, 0, 0, 0.08),
            inset -1px -1px 15px rgba(255, 255, 255, 0.5),
            inset 1px 1px 15px rgba(0, 0, 0, 0.05)
          `,
        }}
      >
        {/* Shine overlay */}
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-3xl" />

        {/* Top embossed line */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full" />

        {/* Main content */}
        <div className="relative z-10 flex flex-col gap-4 h-full">
          {/* Icon container with embossed effect */}
          <motion.div
            className={`w-16 h-16 rounded-2xl ${c.icon} border-2 ${c.border} flex items-center justify-center
              group-hover:scale-110 transition-transform duration-300`}
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            style={{
              boxShadow: `
                inset 0 2px 6px rgba(255, 255, 255, 0.6),
                inset 0 -2px 6px rgba(0, 0, 0, 0.05)
              `,
            }}
          >
            <Icon size={32} className="text-cozy-dark" />
          </motion.div>

          {/* Title */}
          <h3 className="font-extrabold text-lg font-serif text-cozy-dark leading-tight">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm font-medium text-cozy-dark/70 leading-relaxed flex-grow">
            {description}
          </p>

          {/* Collectible stamp effect at bottom */}
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-cozy-dark/30" />
            <span className="text-xs font-bold text-cozy-dark/40">
              Ritual Badge
            </span>
          </div>
        </div>

        {/* Bottom soft shadow effect */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/5 to-transparent pointer-events-none rounded-b-3xl" />

        {/* Hover glow effect */}
        <motion.div
          className="absolute -inset-full rounded-3xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />
      </div>
    </motion.div>
  );
};

export default CollectibleCard;
