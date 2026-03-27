import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  icon = null,
  fullWidth = false,
  ...props 
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary': return 'btn-primary';
      case 'secondary': return 'btn-secondary';
      case 'dark': return 'btn-dark';
      case 'outline': return 'btn-outline';
      default: return 'btn-primary';
    }
  };

  return (
    <button 
      className={`btn ${getVariantClass()} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="flex items-center justify-center">{icon}</span>}
      {children}
    </button>
  );
};
