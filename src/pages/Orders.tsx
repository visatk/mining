import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/shared/PageHeader';
import { Card } from '../components/shared/Card';
import { ShoppingCart, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (res.status === 401) return navigate('/auth');
        const data = await res.json();
        if (data.success) setOrders(data.orders);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader title="My Orders" />
      <Card className="overflow-hidden border-[#1e293b]">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-[#0f172a] border-b border-[#1e293b]">
              <tr>
                <th className="px-6 py-5">Order ID</th>
                <th className="px-6 py-5">Item Reference</th>
                <th className="px-6 py-5">Card Data (CC|MM|YY|CVV)</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b] bg-[#0b1120]">
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-24 text-center">Loading securely...</td></tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-[#1e293b] rounded-2xl flex items-center justify-center mb-4"><ShoppingCart size={28} className="text-slate-500" /></div>
                      <h3 className="font-bold text-lg text-white mb-1">No orders found</h3>
                      <Link to="/purchase-cards" className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg mt-4">Browse Inventory</Link>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#1e293b]/30">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">{order.id}</td>
                    <td className="px-6 py-4 font-medium text-white">{order.item_reference}</td>
                    <td className="px-6 py-4 font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded select-all">{order.card_details}</td>
                    <td className="px-6 py-4 font-bold text-white">${order.amount.toFixed(2)}</td>
                    <td className="px-6 py-4"><span className="flex items-center gap-1 text-emerald-500 text-xs font-bold"><CheckCircle size={14}/> COMPLETED</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
