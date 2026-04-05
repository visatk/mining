import React from 'react';
import { Wallet, ShoppingCart, CheckCircle2, Clock, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { Card } from '../components/shared/Card';
import { Link } from 'react-router-dom';

export function Dashboard() {
  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      <PageHeader title="Overview" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Wallet Card */}
        <Card className="p-6 relative overflow-hidden" glow>
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Available Balance</span>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Wallet size={20} />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-white mb-2 font-mono tracking-tight">$0.00</div>
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
            <CheckCircle2 size={14} /> Ready for new purchases
          </div>
        </Card>

        {/* Orders Card */}
        <Card className="p-6 relative overflow-hidden" glow>
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <ShoppingCart size={20} />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-white mb-2 font-mono tracking-tight">0</div>
          <div className="text-xs text-blue-400 font-medium flex items-center gap-1.5">
            <Clock size={14} /> Historical successful transactions
          </div>
        </Card>
        
        {/* Quick Action Card (New) */}
        <Card className="p-6 flex flex-col justify-between bg-gradient-to-br from-indigo-600/10 to-[#0f172a] border-indigo-500/20">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Need inventory?</h3>
            <p className="text-sm text-slate-400">Browse the latest high-quality database drops.</p>
          </div>
          <Link to="/purchase-cards" className="mt-4 flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg font-semibold transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/20">
            Shop Now <ArrowRight size={16} />
          </Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck size={20} className="text-blue-500" /> Platform Updates
          </h2>
          <Card className="p-0 overflow-hidden">
            <div className="p-5 border-b border-[#1e293b] bg-[#1e293b]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <h3 className="text-white font-bold text-base">NEW CC UPDATE! [Shop#1]</h3>
              </div>
              <span className="text-xs font-mono bg-[#0b1120] text-blue-400 px-2.5 py-1.5 rounded-md border border-[#1e293b]">Apr 02, 2026 / 08:15 PM</span>
            </div>
            <div className="p-5 text-sm text-slate-300 space-y-4">
              <p>GOOD VALID USA & MIX UPDATE! ADDED AROUND <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">2000+ CCs</span>.</p>
              <div className="bg-[#0b1120] p-4 rounded-lg border border-[#1e293b] font-mono text-xs space-y-2">
                <div className="flex items-center gap-2 text-blue-300"><ArrowRight size={12}/> APR#02_USA[GREAT]</div>
                <div className="flex items-center gap-2 text-blue-300"><ArrowRight size={12}/> APR#02_USA/MIX</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
           <Card className="p-5 border-red-500/30 bg-gradient-to-b from-red-500/10 to-transparent relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400"></div>
            <div className="flex items-center gap-2 text-red-400 mb-4 font-bold text-lg mt-1">
              <AlertTriangle size={20} /> Security Notice
            </div>
            <div className="text-sm text-slate-300 space-y-4">
              <p className="leading-relaxed">ElonMoney only uses the following official domains to prevent phishing.</p>
              <div className="flex flex-col gap-2">
                 {['elonmoney.hk', 'elonmoney.vip', 'elonmoney.sh'].map(domain => (
                   <div key={domain} className="bg-[#0b1120] text-red-300 px-3 py-2 rounded-md text-xs border border-red-500/20 font-mono flex items-center gap-2">
                     <ShieldCheck size={14} className="text-red-500"/> https://{domain}/
                   </div>
                 ))}
              </div>
              <div className="pt-4 border-t border-red-500/10 mt-4">
                <a href="https://t.me/elonmoney_bid" target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 bg-[#0b1120] text-red-400 px-4 py-2.5 rounded-lg border border-red-500/30 hover:bg-red-500/10 transition-colors font-semibold shadow-inner">
                  Join Official Telegram
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
