import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, id, className = '', ...props }) => {
  const baseStyles = 'w-full p-4 border border-white/10 rounded-xl bg-surface-dark text-text-white placeholder-text-muted focus:ring-2 focus:ring-premium-gold/50 focus:border-transparent transition-colors duration-200';

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text-muted mb-2">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`${baseStyles} ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;