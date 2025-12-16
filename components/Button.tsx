import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'px-5 py-3 rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const widthStyles = fullWidth ? 'w-full' : '';

  const variantStyles = {
    primary: 'bg-gold-gradient text-background-dark shadow-lg-gold hover:shadow-xl-gold hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-surface-dark text-text-white border border-white/10 hover:bg-white/10 focus:ring-premium-gold-light/40',
    ghost: 'bg-transparent text-text-muted hover:text-text-white hover:bg-white/5 focus:ring-premium-gold-light/40',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className} ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;