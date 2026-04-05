import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-[#1e293b] border border-[#2d3748] rounded-xl shadow-lg shadow-black/20 ${className}`}>
      {children}
    </div>
  );
}
