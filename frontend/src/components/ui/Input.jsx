import React from 'react';

export const Input = ({ 
  label, 
  id, 
  error, 
  className = '', 
  containerClassName = '',
  ...props 
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={`input-group ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <input 
        id={inputId}
        className={`input-field ${error ? 'border-red-500' : ''} ${className}`}
        style={error ? { borderColor: 'var(--error)' } : {}}
        {...props}
      />
      {error && <span className="text-xs text-error mt-1" style={{ color: 'var(--error)' }}>{error}</span>}
    </div>
  );
};
