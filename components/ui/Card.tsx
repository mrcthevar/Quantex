import React from 'react';
import clsx from 'clsx';
import { Theme } from '../../types';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: 'default' | 'dark' | 'gradient';
  theme?: Theme;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = false, variant = 'default', theme }) => {
  const variants = {
    default: "bg-white/80 border-white/50 backdrop-blur-xl text-brand-text",
    dark: "bg-brand-dark text-white border-white/10",
    gradient: `${theme?.textGradient || 'bg-gradient-primary'} text-white border-none`
  };

  // Construct dynamic hover classes if a theme is provided
  const hoverClasses = theme && hover && variant === 'default'
    ? `hover:border-[${theme.border.split('-')[1]}-300] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:ring-1 hover:ring-[${theme.border.split('-')[1]}-200]` 
    : "hover:border-purple-200 hover:shadow-[0_20px_40px_rgba(139,92,246,0.1)]";

  return (
    <div className={clsx(
      "rounded-[2rem] border transition-all duration-300",
      variants[variant],
      variant === 'default' ? "shadow-[0_8px_30px_rgba(0,0,0,0.04)]" : "shadow-xl",
      hover && variant === 'default' && `hover:-translate-y-1 ${hoverClasses}`,
      hover && variant === 'dark' && "hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20",
      className
    )}>
      {children}
    </div>
  );
};