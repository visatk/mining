import React from 'react';
import { Wallet, ShoppingCart, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { Card } from '../components/shared/Card';

export function Dashboard() {
  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-300">
      <PageHeader title="Dashboard" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
        <Card className="p-5 lg:p-6 hover:border-slate-600 transition-colors">
          <div className="flex items-center gap-2 text-slate-400 mb-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <Wallet size={20} />
            </div>
            <span className="text-sm font-semibold uppercase tracking-wider">Balance</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">$ 0.00</div>
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 size={12} /> Available for purchases
          </div>
        </Card>
        <Card className="p-5 lg:p-6 hover:border-slate-600 transition-colors">
          <div className="flex items-center gap-2 text-slate-400 mb-3">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <ShoppingCart size={20} />
            </div>
            <span className="text-sm font-semibold uppercase tracking-wider">Orders</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">0</div>
          <div className="text-xs text-purple-400 font-medium flex items-center gap-1">
            <Clock size={12} /> Total successful transactions
          </div>
        </Card>
      </div>

      <Card className="p-5 lg:p-6 border-red-500/30 bg-red-500/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
        <div className="flex items-center gap-2 text-red-400 mb-4 font-bold text-lg">
          <AlertTriangle size={20} /> Security Notice
        </div>
        <div className="text-sm text-slate-300 space-y-4">
          <p>ElonMoney only uses the following official domains to prevent phishing.</p>
          <div className="flex flex-wrap gap-2">
             {['https://elonmoney.hk/', 'https://elonmoney.vip/', 'https://elonmoney.sh/'].map(domain => (
               <a key={domain} href={domain} className="bg-[#0f172a] text-red-400 px-3 py-1.5 rounded-md text-xs border border-red-500/20 hover:bg-red-500/10 transition-colors font-mono">
                 {domain}
               </a>
             ))}
          </div>
          <div className="pt-2 border-t border-red-500/10">
            <p className="mb-2">Join official Telegram for updates [NEW LINK]:</p>
            <a href="https://t.me/elonmoney_bid" target="_blank" rel="noreferrer" className="inline-block bg-[#0f172a] text-red-400 px-3 py-1.5 rounded-md text-xs border border-red-500/20 hover:bg-red-500/10 transition-colors font-mono">
              https://t.me/elonmoney_bid
            </a>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <ShieldCheck size={20} className="text-blue-500" /> Platform News & Updates
        </h2>
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <h3 className="text-white font-bold text-base">NEW CC UPDATE! [Shop#1]</h3>
              <span className="text-xs font-mono bg-[#0f172a] text-blue-400 px-2 py-1 rounded border border-[#2d3748]">Apr 02, 2026 / 08:15 PM</span>
            </div>
            <div className="text-sm text-slate-300 space-y-3">
              <p>GOOD VALID USA & MIX UPDATE! ADDED AROUND <span className="text-emerald-400 font-bold">2000+ CCs</span>.</p>
              <div className="bg-[#0f172a] p-3 rounded-lg border border-[#2d3748] font-mono text-xs space-y-1">
                <p className="text-blue-300">APR#02_USA[GREAT]</p>
                <p className="text-blue-300">APR#02_USA/MIX</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
