import React from 'react';

const Card = ({
  children,
  className = '',
  thickBorder = false,
  ...props
}) => {
  return (
    <div
      className={`cozy-card ${thickBorder ? 'cozy-border-thick' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
