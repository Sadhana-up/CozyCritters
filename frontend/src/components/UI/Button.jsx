import React from 'react';
import { soundManager } from '../../utils/sound';

const Button = ({
  children,
  onClick,
  className = '',
  variant = 'white', // pink, green, yellow, peach, lavender, sky, white
  disabled = false,
  type = 'button',
  ...props
}) => {
  const handleClick = (e) => {
    soundManager.playClick();
    if (onClick) {
      onClick(e);
    }
  };

  const variantClasses = {
    white: 'bg-white hover:bg-neutral-50 active:bg-neutral-100',
    pink: 'bubble-btn-pink',
    green: 'bubble-btn-green',
    yellow: 'bubble-btn-yellow',
    peach: 'bubble-btn-peach',
    lavender: 'bubble-btn-lavender',
    sky: 'bubble-btn-sky',
  };

  const activeVariant = variantClasses[variant] || variantClasses.white;

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`bubble-btn ${activeVariant} ${disabled ? 'opacity-50 cursor-not-allowed transform-none active:transform-none active:shadow-bubble' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
