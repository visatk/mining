import React from 'react';
import { X } from 'lucide-react';

interface EmptyTableStateProps {
  colSpan: number;
  message?: string;
}

export function EmptyTableState({ colSpan, message = "No records found" }: EmptyTableStateProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-16 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-[#2d3748] rounded-full flex items-center justify-center mb-3 border border-[#3f4b63]">
            <X size={20} className="text-slate-400" />
          </div>
          <p className="font-medium text-white">{message}</p>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search query.</p>
        </div>
      </td>
    </tr>
  );
}
