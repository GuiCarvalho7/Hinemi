import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-premium-gold border-surface-dark"></div>
    </div>
  );
};

export default LoadingSpinner;