import React, { type ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  gradient?: 'primary' | 'secondary' | 'accent' | 'none';
  animated?: boolean;
  style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  gradient = 'none',
  animated = false,
  style = {},
}) => {
  return (
    <div
      className={`
        backdrop-blur-[10px] bg-white bg-opacity-10 rounded-3xl border border-white border-opacity-20 shadow-2xl
        ${animated ? 'transition-all duration-500 hover:bg-opacity-20 hover:border-opacity-40 hover:shadow-2xl cursor-pointer animate-fade-in' : ''}
        ${className}
      `}
      style={{
        ...style,
        background: gradient !== 'none'
          ? `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))`
          : undefined,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      {children}
    </div>
  );
};
