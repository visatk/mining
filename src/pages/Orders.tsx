import React from 'react';
import { PageHeader } from '../components/shared/PageHeader';
import { Card } from '../components/shared/Card';
import { EmptyTableState } from '../components/shared/EmptyTableState';

export function Orders() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader title="My Orders" />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-xs text-slate-400 bg-[#0f172a] border-b border-[#2d3748]">
              <tr>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Card Details</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Number</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Price</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Dated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d3748]">
              <EmptyTableState colSpan={5} message="You haven't purchased any cards yet" />
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
