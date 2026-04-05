import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ children, className = "", glow = false }: CardProps) {
  return (
    <div className={`relative bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden transition-all duration-300 ${glow ? 'hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(37,99,235,0.1)]' : ''} ${className}`}>
      {/* Subtle top highlight gradient */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-600/20 to-transparent"></div>
      {children}
    </div>
  );
}
