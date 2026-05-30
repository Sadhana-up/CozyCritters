import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

const DraggableFloatingObject = ({
  id,
  shape,
  color,
  position,
  onRemove,
  isDragMode,
}) => {
  const [pos, setPos] = useState(position);
  const dragRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    if (!isDragMode) return;
    setIsDragging(true);
  };

  const handleDrag = (e) => {
    if (!isDragMode || !isDragging) return;
    const x = e.clientX || e.touches?.[0]?.clientX;
    const y = e.clientY || e.touches?.[0]?.clientY;
    if (x && y) {
      setPos({ x, y });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const shapeIcons = {
    cloud: "☁️",
    heart: "❤️",
    star: "⭐",
    bubble: "🫧",
    sparkle: "✨",
  };

  const colorMap = {
    pink: "from-cozy-pink/60 to-cozy-pink/40",
    sky: "from-cozy-sky/60 to-cozy-sky/40",
    yellow: "from-cozy-yellow/60 to-cozy-yellow/40",
    green: "from-cozy-green/60 to-cozy-green/40",
  };

  return (
    <motion.div
      ref={dragRef}
      className={`absolute w-16 h-16 flex items-center justify-center text-4xl cursor-${isDragMode ? "grab" : "auto"} rounded-full
        bg-gradient-to-br ${colorMap[color] || colorMap.pink}
        border-2 border-white/50 backdrop-blur-md
        select-none user-select-none pointer-events-auto`}
      style={{
        left: pos.x,
        top: pos.y,
        transform: "translate(-50%, -50%)",
      }}
      animate={{
        y: isDragging ? 0 : [0, -8, 0],
        rotate: isDragging ? 0 : [0, 5, -5, 0],
      }}
      transition={{
        duration: isDragging ? 0 : 4,
        repeat: isDragging ? 0 : Infinity,
        type: "spring",
      }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      onMouseMove={handleDrag}
      onTouchMove={handleDrag}
      onMouseUp={handleDragEnd}
      onTouchEnd={handleDragEnd}
      drag={isDragMode}
      dragElastic={0.2}
      dragTransition={{ power: 0.3, timeConstant: 200 }}
      whileHover={{ scale: isDragMode ? 1.1 : 1, rotate: isDragMode ? 5 : 0 }}
      whileTap={{ scale: isDragMode ? 1.15 : 1 }}
    >
      <div className="text-4xl drop-shadow-lg">
        {shapeIcons[shape] || shape}
      </div>

      {/* Close button on hover */}
      {isDragMode && (
        <motion.button
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-cozy-pink text-white text-xs font-bold flex items-center justify-center shadow-lg hover:bg-cozy-dark"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(id);
          }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
        >
          ✕
        </motion.button>
      )}
    </motion.div>
  );
};

export default DraggableFloatingObject;
