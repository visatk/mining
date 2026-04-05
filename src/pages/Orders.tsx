import React from 'react';
import { PageHeader } from '../components/shared/PageHeader';
import { Card } from '../components/shared/Card';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Orders() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader title="My Orders" />
      <Card className="overflow-hidden border-[#1e293b]">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-[#0f172a] border-b border-[#1e293b]">
              <tr>
                <th className="px-6 py-5">Item Reference</th>
                <th className="px-6 py-5">Details</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b] bg-[#0b1120]">
              <tr>
                <td colSpan={5} className="px-4 py-24 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-[#1e293b] rounded-2xl flex items-center justify-center mb-4 border border-[#334155] shadow-inner">
                      <ShoppingCart size={28} className="text-slate-500" />
                    </div>
                    <h3 className="font-bold text-lg text-white mb-1">No orders found</h3>
                    <p className="text-sm text-slate-400 mb-6">You haven't purchased any items yet.</p>
                    <Link to="/purchase-cards" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-lg transition-all shadow-lg active:scale-95">
                      Browse Inventory
                    </Link>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
