import React, { useState, useEffect } from 'react';
import { Filter, Search, RefreshCw, ShoppingCart, CreditCard, X } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { Card } from '../components/shared/Card';
import { Input } from '../components/shared/Input';
import { Toggle } from '../components/shared/Toggle';
import { EmptyTableState } from '../components/shared/EmptyTableState';

interface CardData {
  id: string | number;
  bin: string;
  type: string;
  exp: string;
  country: string;
  stateCityZip: string;
  base: string;
  price: string;
}

export function PurchaseCards() {
  const [showFilters, setShowFilters] = useState(false);
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filterBin, setFilterBin] = useState('');
  const [filterCountry, setFilterCountry] = useState('');

  const fetchCards = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterBin) params.append('bin', filterBin);
      if (filterCountry) params.append('country', filterCountry);
      
      const res = await fetch(`/api/cards?${params.toString()}`);
      const data = await res.json();
      
      if (data.success) {
        setCards(data.data);
      } else {
        console.error("API Error:", data.error);
      }
    } catch (error) {
      console.error("Failed to fetch cards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleSearch = () => {
    fetchCards();
    if (window.innerWidth < 1024) setShowFilters(false);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-4 animate-in fade-in duration-300">
       <PageHeader 
          title="Purchase Cards" 
          action={
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 bg-[#1e293b] border border-[#2d3748] px-4 py-2 rounded-lg text-sm text-white hover:bg-[#2d3748] transition-colors"
            >
              <Filter size={16} /> Filters
            </button>
          }
        />
       
       <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
          <Card className={`w-full lg:w-72 flex-shrink-0 flex flex-col h-fit lg:h-full overflow-y-auto custom-scrollbar ${showFilters ? 'block' : 'hidden lg:flex'}`}>
            <div className="p-4 border-b border-[#2d3748] flex justify-between items-center sticky top-0 bg-[#1e293b] z-10 rounded-t-xl">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Filter size={18} className="text-blue-500" /> Card Filters
              </h3>
              <button onClick={() => setShowFilters(false)} className="lg:hidden text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-4 space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">BIN / IIN</label>
                  <Input 
                    placeholder="e.g. 414720" 
                    maxLength={6} 
                    icon={CreditCard} 
                    value={filterBin}
                    onChange={(e) => setFilterBin(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Country</label>
                  <Input 
                    placeholder="US, UK, CA..." 
                    value={filterCountry}
                    onChange={(e) => setFilterCountry(e.target.value)}
                  />
                </div>

                <div className="pt-2 border-t border-[#2d3748] space-y-3">
                  <Toggle checked={true} onChange={() => {}} label="Include Refunds" />
                  <Toggle checked={false} onChange={() => {}} label="Sniffed CVV" />
                </div>
              </div>

              <button 
                onClick={handleSearch}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Search size={16} /> Search Cards
              </button>
            </div>
          </Card>

          <Card className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <div className="p-4 border-b border-[#2d3748] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#1e293b]">
              <span className="text-sm font-medium text-slate-300">
                Found <span className="text-white font-bold">{cards.length}</span> results
              </span>
              <div className="flex gap-2">
                <button onClick={fetchCards} className="flex items-center gap-1.5 text-xs bg-[#0f172a] border border-[#2d3748] px-3 py-1.5 rounded hover:bg-[#2d3748] transition-colors text-slate-300">
                  <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto custom-scrollbar relative">
              <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
                <thead className="text-xs text-slate-400 bg-[#0f172a] sticky top-0 z-10 shadow-sm border-b border-[#2d3748]">
                  <tr>
                    <th className="px-4 py-3.5 font-semibold">BIN</th>
                    <th className="px-4 py-3.5 font-semibold">Type/Class</th>
                    <th className="px-4 py-3.5 font-semibold">Exp</th>
                    <th className="px-4 py-3.5 font-semibold">Country</th>
                    <th className="px-4 py-3.5 font-semibold">State/City/Zip</th>
                    <th className="px-4 py-3.5 font-semibold">Base</th>
                    <th className="px-4 py-3.5 font-semibold text-right">Price</th>
                    <th className="px-4 py-3.5 font-semibold text-center w-24">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d3748]">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <RefreshCw size={24} className="text-blue-500 animate-spin" />
                          <p className="text-slate-400 text-sm font-medium">Querying secure database...</p>
                        </div>
                      </td>
                    </tr>
                  ) : cards.length === 0 ? (
                    <EmptyTableState colSpan={8} message="No cards match your filter criteria" />
                  ) : (
                    cards.map((card) => (
                      <tr key={card.id} className="hover:bg-[#2d3748]/30 transition-colors group">
                        <td className="px-4 py-3 text-white font-mono font-medium">{card.bin}******</td>
                        <td className="px-4 py-3 text-slate-300 text-xs">{card.type}</td>
                        <td className="px-4 py-3 text-slate-300 font-mono">{card.exp}</td>
                        <td className="px-4 py-3 text-slate-300">{card.country}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs truncate max-w-[150px]">{card.stateCityZip}</td>
                        <td className="px-4 py-3 text-blue-400 font-mono text-xs">{card.base}</td>
                        <td className="px-4 py-3 text-right text-emerald-400 font-bold">${card.price}</td>
                        <td className="px-4 py-3 text-center">
                          <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-1.5 w-full">
                            <ShoppingCart size={14} /> Buy
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
       </div>
    </div>
  );
}
