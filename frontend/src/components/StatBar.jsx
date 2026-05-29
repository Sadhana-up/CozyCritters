import React from 'react';
import { motion } from 'framer-motion';

const StatBar = ({
  label,
  value, // 0 to 100
  icon,
  color = 'pink', // pink, green, yellow
  max = 100,
}) => {
  const clampValue = Math.max(0, Math.min(max, value));
  const percentage = (clampValue / max) * 100;

  const colorMap = {
    pink: {
      bg: 'bg-cozy-pink',
      border: 'border-cozy-pink',
      text: 'text-[#e5837e]',
      track: 'bg-[#FFF0EF]',
    },
    green: {
      bg: 'bg-cozy-green',
      border: 'border-cozy-green',
      text: 'text-[#82B284]',
      track: 'bg-[#EFF8F0]',
    },
    yellow: {
      bg: 'bg-cozy-yellow',
      border: 'border-[#F0CBA7]',
      text: 'text-[#C99C6B]',
      track: 'bg-[#FFF9F2]',
    },
    sky: {
      bg: 'bg-cozy-sky',
      border: 'border-cozy-sky',
      text: 'text-[#6499B9]',
      track: 'bg-[#F2F9FE]',
    }
  };

  const colors = colorMap[color] || colorMap.pink;

  // Set warning colors if state is dangerous
  let barColorClass = colors.bg;
  if (color === 'green' && percentage < 30) {
    barColorClass = 'bg-[#FF9B9B]'; // Red-ish if tired
  } else if (color === 'yellow' && percentage < 30) {
    barColorClass = 'bg-[#FF9B9B]'; // Red-ish if starving
  } else if (color === 'pink' && percentage < 30) {
    barColorClass = 'bg-[#FF9B9B]'; // Red-ish if sad
  }

  return (
    <div className="w-full flex flex-col gap-1.5 select-none">
      <div className="flex justify-between items-center text-sm font-bold text-cozy-dark px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">{icon}</span>
          <span>{label}</span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-white/70 border border-cozy-dark/10">
          {Math.round(percentage)}%
        </span>
      </div>

      <div className={`h-6 w-full border-[3px] border-cozy-dark rounded-full ${colors.track} overflow-hidden relative shadow-[inset_0_2px_4px_rgba(74,62,61,0.08)]`}>
        <motion.div
          className={`h-full rounded-full border-r-[2px] border-cozy-dark/20 ${barColorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 50, damping: 15 }}
        />
      </div>
    </div>
  );
};

export default StatBar;
