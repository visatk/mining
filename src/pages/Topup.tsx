import React from 'react';
import { PageHeader } from '../components/shared/PageHeader';
import { Card } from '../components/shared/Card';

export function Topup() {
  return (
    <div className="space-y-6 lg:space-y-8 max-w-5xl animate-in fade-in duration-300">
      <PageHeader title="Add Funds" />
      <Card className="p-6">
        <h2 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">Fund Wallet</h2>
        <p className="text-xs text-slate-400 mb-5">Crypto gateways setup is required for mainnet deployment.</p>
        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]">
          Generate Payment Address
        </button>
      </Card>
    </div>
  );
}
