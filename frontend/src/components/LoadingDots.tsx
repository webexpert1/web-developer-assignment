import React from 'react';

/**
 * A simple component to display a three-dot pulsating loading animation.
 * Uses Tailwind CSS and pre-defined global CSS classes for the animation.
 */
const LoadingDots = () => {
  return (
    <div className="flex justify-center items-center space-x-2 py-8">
      {/* These classes now reference the global CSS definitions */}
      <div className="dot-1 w-3 h-3 rounded-full bg-purple-300"></div>
      <div className="dot-2 w-3 h-3 rounded-full bg-purple-300"></div>
      <div className="dot-3 w-3 h-3 rounded-full bg-purple-300"></div>
    </div>
  );
};

export default LoadingDots;