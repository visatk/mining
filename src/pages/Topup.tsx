import React, { useState } from 'react';
import { PageHeader } from '../components/shared/PageHeader';
import { Card } from '../components/shared/Card';
import { CheckCircle2, Wallet } from 'lucide-react';

const CRYPTO_METHODS = [
  { id: 'btc', name: 'Bitcoin', ticker: 'BTC', color: 'border-orange-500', bg: 'bg-orange-500/10' },
  { id: 'ltc', name: 'Litecoin', ticker: 'LTC', color: 'border-blue-400', bg: 'bg-blue-400/10' },
  { id: 'eth', name: 'Ethereum', ticker: 'ETH', color: 'border-purple-500', bg: 'bg-purple-500/10' },
];

export function Topup() {
  const [selected, setSelected] = useState('btc');

  return (
    <div className="space-y-6 lg:space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <PageHeader title="Add Funds" />
      <Card className="p-6 md:p-8" glow>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <Wallet size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Select Payment Gateway</h2>
            <p className="text-sm text-slate-400">Choose your preferred cryptocurrency network.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {CRYPTO_METHODS.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelected(method.id)}
              className={`relative p-5 rounded-xl border-2 text-left transition-all ${selected === method.id ? `${method.color} ${method.bg} shadow-lg` : 'border-[#1e293b] bg-[#0b1120] hover:border-[#334155]'}`}
            >
              {selected === method.id && (
                <div className="absolute top-3 right-3 text-white bg-blue-500 rounded-full">
                  <CheckCircle2 size={18} />
                </div>
              )}
              <h3 className="font-bold text-white text-lg">{method.name}</h3>
              <p className="text-slate-400 text-sm font-mono mt-1">{method.ticker} Network</p>
            </button>
          ))}
        </div>

        <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl mb-6">
          <p className="text-sm text-blue-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Automatic balance update after 1 network confirmation.
          </p>
        </div>

        <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-[0.98] text-lg">
          Generate {CRYPTO_METHODS.find(m => m.id === selected)?.ticker} Payment Address
        </button>
      </Card>
    </div>
  );
}
