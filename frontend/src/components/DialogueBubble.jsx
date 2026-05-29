import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DialogueBubble = ({ message }) => {
  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="relative max-w-[280px] bg-white border-[3px] border-cozy-dark rounded-2xl p-3.5 shadow-cozy text-center select-none z-10"
        >
          <p className="text-sm font-bold text-cozy-dark leading-relaxed">
            {message}
          </p>
          
          {/* Bubble Tail */}
          <div className="absolute -bottom-[11px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-[3px] border-b-[3px] border-cozy-dark rotate-45" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DialogueBubble;
