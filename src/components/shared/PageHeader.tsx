import React from 'react';

interface PageHeaderProps {
  title: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h1>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
