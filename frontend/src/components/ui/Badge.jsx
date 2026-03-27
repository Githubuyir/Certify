import React from 'react';

export const Badge = ({ children, variant = 'neutral', className = '' }) => {
  const getBadgeClass = () => {
    switch (variant) {
      case 'success': return 'badge-success';
      case 'error': return 'badge-error';
      case 'warning': return 'badge-warning';
      case 'neutral':
      default: return 'badge-neutral';
    }
  };

  return (
    <span className={`badge ${getBadgeClass()} ${className}`}>
      {children}
    </span>
  );
};
