import React, { useState } from 'react';
import { PageHeader } from '../components/shared/PageHeader';
import { Card } from '../components/shared/Card';
import { CheckCircle2, Wallet, RefreshCw, Copy, QrCode } from 'lucide-react';

const CRYPTO_METHODS = [
  { id: 'btc', name: 'Bitcoin', ticker: 'BTC', color: 'border-orange-500', bg: 'bg-orange-500/10' },
  { id: 'ltc', name: 'Litecoin', ticker: 'LTC', color: 'border-blue-400', bg: 'bg-blue-400/10' },
  { id: 'eth', name: 'Ethereum', ticker: 'ETH', color: 'border-purple-500', bg: 'bg-purple-500/10' },
];

export function Topup() {
  const [selected, setSelected] = useState('btc');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAddress, setGeneratedAddress] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedAddress('');
    
    // Simulate API delay for gateway generation
    setTimeout(() => {
      const mockPrefix = selected === 'btc' ? 'bc1q' : selected === 'eth' ? '0x' : 'ltc1q';
      const mockHash = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '').substring(0, 10);
      setGeneratedAddress(`${mockPrefix}${mockHash}`);
      setIsGenerating(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              onClick={() => { setSelected(method.id); setGeneratedAddress(''); }}
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

        {!generatedAddress ? (
           <button 
             onClick={handleGenerate}
             disabled={isGenerating}
             className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-[0.98] text-lg flex justify-center items-center gap-2 disabled:opacity-70"
           >
             {isGenerating ? <RefreshCw size={20} className="animate-spin" /> : null}
             {isGenerating ? 'Connecting to Gateway...' : `Generate ${CRYPTO_METHODS.find(m => m.id === selected)?.ticker} Payment Address`}
           </button>
        ) : (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-[#0b1120] border border-[#1e293b] rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
             <div className="w-32 h-32 bg-white rounded-lg p-2 flex items-center justify-center border-4 border-slate-700">
                <QrCode size={100} className="text-slate-900" />
             </div>
             <div className="flex-1 w-full space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase tracking-widest">Awaiting Deposit To</label>
                  <div className="flex items-center gap-2">
                    <input 
                      readOnly 
                      value={generatedAddress} 
                      className="w-full bg-[#0f172a] border border-[#2d3748] rounded-lg px-4 py-3 text-sm text-emerald-400 font-mono focus:outline-none"
                    />
                    <button 
                      onClick={copyToClipboard}
                      className={`p-3 rounded-lg flex-shrink-0 transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-[#1e293b] text-slate-400 hover:text-white border border-[#2d3748]'}`}
                    >
                      {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Network: <strong className="text-white">{CRYPTO_METHODS.find(m => m.id === selected)?.name}</strong></span>
                  <span className="flex items-center gap-2 text-blue-400"><RefreshCw size={14} className="animate-spin" /> Scanning blockchain...</span>
                </div>
             </div>
           </div>
        )}
      </Card>
    </div>
  );
}
