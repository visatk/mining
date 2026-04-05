import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (c: boolean) => void;
  label?: React.ReactNode;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <button 
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1e293b] ${checked ? 'bg-blue-600' : 'bg-slate-600'}`}
      >
        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : 'translate-x-1'}`} />
      </button>
      {label && <span className="text-sm font-medium text-slate-300 select-none">{label}</span>}
    </div>
  );
}
