import React, { useState, useEffect } from 'react';
import { Filter, Search, RefreshCw, ShoppingCart, CreditCard, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/shared/PageHeader';
import { Card } from '../components/shared/Card';
import { Input } from '../components/shared/Input';
import { EmptyTableState } from '../components/shared/EmptyTableState';
import { useAuth } from '../contexts/AuthContext';

export function PurchaseCards() {
  const navigate = useNavigate();
  const { updateBalance } = useAuth();
  
  const [showFilters, setShowFilters] = useState(false);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  
  const [filterBin, setFilterBin] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  const fetchCards = async (currentPage = page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: currentPage.toString(), limit: '50' });
      if (filterBin) params.append('bin', filterBin);
      if (filterCountry) params.append('country', filterCountry);
      
      const res = await fetch(`/api/cards?${params.toString()}`);
      if (res.status === 401) return navigate('/auth');
      
      const data = await res.json();
      if (data.success) {
        setCards(data.data);
        if (data.pagination) setPagination(data.pagination);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCards(page); }, [page]);

  const handleBuy = async (card: any) => {
    if (!window.confirm(`Buy card ${card.bin} for $${card.price}?`)) return;
    setPurchasingId(card.id);
    try {
      const res = await fetch('/api/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ card })
      });
      const data = await res.json();
      
      if (res.status === 401) return navigate('/auth');
      if (data.success) {
        updateBalance(data.newBalance);
        alert('Purchase successful! Check My Orders.');
        setCards(cards.filter(c => c.id !== card.id)); // Remove card from view
      } else {
        alert(data.error || 'Failed to purchase');
      }
    } finally {
      setPurchasingId(null);
    }
  };

  const renderTypeBadges = (typeStr: string) => {
    const parts = typeStr.split(' / ').map(p => p.trim());
    return (
      <div className="flex gap-1.5 items-center">
        {parts[0] && <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">{parts[0]}</span>}
        {parts[1] && <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">{parts[1]}</span>}
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-4 animate-in fade-in duration-500">
       <PageHeader title="Inventory" action={<button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center gap-2 bg-[#1e293b] border border-[#334155] px-4 py-2 rounded-xl text-sm text-white"><Filter size={16} /> Filters</button>} />
       
       <div className="flex flex-col lg:flex-row gap-5 flex-1 min-h-0">
          {/* Filter Sidebar Snipped for brevity - same as yours */}
          <Card className={`w-full lg:w-72 flex-shrink-0 flex flex-col h-fit lg:h-full overflow-y-auto ${showFilters ? 'block' : 'hidden lg:flex'}`}>
            <div className="p-5 space-y-4">
              <Input placeholder="BIN (e.g. 414720)" icon={CreditCard} value={filterBin} onChange={(e) => setFilterBin(e.target.value)} />
              <Input placeholder="Country ISO" value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)} />
              <button onClick={() => { setPage(1); fetchCards(1); }} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl"><Search size={16} className="inline mr-2"/> Query</button>
            </div>
          </Card>

          <Card className="flex-1 flex flex-col min-w-0 overflow-hidden border-[#1e293b]">
            <div className="p-4 border-b border-[#1e293b] flex justify-between items-center bg-[#1e293b]/20">
              <span className="text-sm text-slate-400">Found <span className="text-white font-bold bg-[#1e293b] px-2 py-0.5 rounded border border-[#334155] mx-1">{pagination.total}</span> records</span>
            </div>
            
            <div className="flex-1 overflow-auto custom-scrollbar bg-[#0b1120]">
              <table className="w-full text-left text-sm whitespace-nowrap min-w-[900px]">
                <thead className="text-[11px] uppercase tracking-wider text-slate-500 bg-[#0f172a] sticky top-0 z-10 border-b border-[#1e293b]">
                  <tr>
                    <th className="px-5 py-4 font-bold">BIN Identity</th>
                    <th className="px-5 py-4 font-bold">Details</th>
                    <th className="px-5 py-4 font-bold">Exp</th>
                    <th className="px-5 py-4 font-bold">Location</th>
                    <th className="px-5 py-4 font-bold">Base Info</th>
                    <th className="px-5 py-4 font-bold text-right">Price</th>
                    <th className="px-5 py-4 font-bold text-center w-28">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]">
                  {loading ? (
                    <tr><td colSpan={7} className="px-4 py-24 text-center text-blue-500"><RefreshCw className="animate-spin inline"/></td></tr>
                  ) : cards.length === 0 ? (
                    <EmptyTableState colSpan={7} message="No records found in database" />
                  ) : (
                    cards.map((card) => (
                      <tr key={card.id} className="hover:bg-[#1e293b]/50 group">
                        <td className="px-5 py-3.5 text-white font-mono">{card.bin}<span className="text-slate-600">******</span></td>
                        <td className="px-5 py-3.5">{renderTypeBadges(card.type)}</td>
                        <td className="px-5 py-3.5 text-slate-300 font-mono text-xs">{card.exp}</td>
                        <td className="px-5 py-3.5 text-white">{card.country}</td>
                        <td className="px-5 py-3.5"><span className="bg-[#1e293b] text-slate-300 px-2 py-1 rounded text-[10px] font-mono">{card.base}</span></td>
                        <td className="px-5 py-3.5 text-right text-emerald-400 font-bold">${card.price}</td>
                        <td className="px-5 py-3.5 text-center">
                          <button 
                            onClick={() => handleBuy(card)} 
                            disabled={purchasingId === card.id}
                            className="bg-transparent border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-bold px-4 py-2 rounded-lg w-full disabled:opacity-50"
                          >
                            {purchasingId === card.id ? 'Processing...' : 'Buy'}
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
