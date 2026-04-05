import React, { useState, useEffect } from 'react';
import { Filter, Search, RefreshCw, ShoppingCart, CreditCard, X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { Card } from '../components/shared/Card';
import { Input } from '../components/shared/Input';
import { Toggle } from '../components/shared/Toggle';
import { EmptyTableState } from '../components/shared/EmptyTableState';

interface CardData {
  id: string | number;
  bin: string;
  type: string; // Will be split visually
  exp: string;
  country: string;
  stateCityZip: string;
  base: string;
  price: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function PurchaseCards() {
  const [showFilters, setShowFilters] = useState(false);
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filterBin, setFilterBin] = useState('');
  const [filterCountry, setFilterCountry] = useState('');

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({ total: 0, page: 1, limit: 50, totalPages: 1 });

  const fetchCards = async (currentPage = page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterBin) params.append('bin', filterBin);
      if (filterCountry) params.append('country', filterCountry);
      params.append('page', currentPage.toString());
      params.append('limit', '50');
      
      const res = await fetch(`/api/cards?${params.toString()}`);
      const data = await res.json();
      
      if (data.success) {
        setCards(data.data);
        if (data.pagination) setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch cards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = () => {
    if (page === 1) fetchCards(1);
    else setPage(1);
    if (window.innerWidth < 1024) setShowFilters(false);
  };

  // Helper to render beautiful badges for the "Type" string (e.g. "VISA / CREDIT / CLASSIC")
  const renderTypeBadges = (typeStr: string) => {
    const parts = typeStr.split(' / ').map(p => p.trim());
    return (
      <div className="flex gap-1.5 items-center">
        {parts[0] && <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">{parts[0]}</span>}
        {parts[1] && <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">{parts[1]}</span>}
        {parts[2] && <span className="bg-slate-700 text-slate-300 border border-slate-600 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">{parts[2]}</span>}
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-4 animate-in fade-in duration-500">
       <PageHeader 
          title="Inventory" 
          action={
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 bg-[#1e293b] border border-[#334155] px-4 py-2 rounded-xl text-sm text-white hover:bg-[#334155] transition-all"
            >
              <Filter size={16} /> Filters
            </button>
          }
        />
       
       <div className="flex flex-col lg:flex-row gap-5 flex-1 min-h-0">
          <Card className={`w-full lg:w-72 flex-shrink-0 flex flex-col h-fit lg:h-full overflow-y-auto custom-scrollbar ${showFilters ? 'block' : 'hidden lg:flex'}`}>
            <div className="p-5 border-b border-[#1e293b] flex justify-between items-center sticky top-0 bg-[#0f172a]/95 backdrop-blur z-10 rounded-t-xl">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Filter size={18} className="text-blue-500" /> Database Filters
              </h3>
              <button onClick={() => setShowFilters(false)} className="lg:hidden text-slate-400 hover:text-white bg-[#1e293b] p-1 rounded-md">
                <X size={16} />
              </button>
            </div>
            
            <div className="p-5 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase tracking-widest">BIN / IIN</label>
                  <Input placeholder="e.g. 414720" maxLength={6} icon={CreditCard} value={filterBin} onChange={(e) => setFilterBin(e.target.value)} />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase tracking-widest">Country ISO</label>
                  <Input placeholder="US, UK, CA..." value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)} />
                </div>
                <div className="pt-4 border-t border-[#1e293b] space-y-4">
                  <Toggle checked={true} onChange={() => {}} label="Include Refunds" />
                  <Toggle checked={false} onChange={() => {}} label="Sniffed CVV Only" />
                </div>
              </div>
              <button 
                onClick={handleSearch}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Search size={16} /> Query Database
              </button>
            </div>
          </Card>

          <Card className="flex-1 flex flex-col min-w-0 overflow-hidden border-[#1e293b]">
            <div className="p-4 border-b border-[#1e293b] flex justify-between items-center bg-[#1e293b]/20">
              <span className="text-sm text-slate-400">
                Found <span className="text-white font-bold bg-[#1e293b] px-2 py-0.5 rounded border border-[#334155] mx-1">{pagination.total}</span> records
              </span>
              <button onClick={() => fetchCards(page)} className="flex items-center gap-2 text-xs font-semibold bg-[#1e293b] border border-[#334155] px-4 py-2 rounded-lg hover:bg-[#334155] transition-colors text-white">
                <RefreshCw size={14} className={loading ? 'animate-spin text-blue-400' : 'text-blue-400'} /> Sync
              </button>
            </div>
            
            <div className="flex-1 overflow-auto custom-scrollbar relative bg-[#0b1120]">
              <table className="w-full text-left text-sm whitespace-nowrap min-w-[900px]">
                <thead className="text-[11px] uppercase tracking-wider text-slate-500 bg-[#0f172a] sticky top-0 z-10 shadow-sm border-b border-[#1e293b]">
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
                    <tr>
                      <td colSpan={7} className="px-4 py-24 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <RefreshCw size={28} className="text-blue-500 animate-spin" />
                          <p className="text-slate-400 text-sm font-medium animate-pulse">Decrypting secure database...</p>
                        </div>
                      </td>
                    </tr>
                  ) : cards.length === 0 ? (
                    <EmptyTableState colSpan={7} message="No records found in database" />
                  ) : (
                    cards.map((card) => (
                      <tr key={card.id} className="hover:bg-[#1e293b]/50 transition-colors group">
                        <td className="px-5 py-3.5 text-white font-mono font-medium flex items-center gap-2">
                          {card.bin}<span className="text-slate-600">******</span>
                        </td>
                        <td className="px-5 py-3.5">{renderTypeBadges(card.type)}</td>
                        <td className="px-5 py-3.5 text-slate-300 font-mono text-xs">{card.exp}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex flex-col">
                            <span className="text-white font-medium">{card.country}</span>
                            <span className="text-[10px] text-slate-500 truncate max-w-[150px]">{card.stateCityZip}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                           <span className="bg-[#1e293b] text-slate-300 px-2 py-1 rounded text-[10px] font-mono border border-[#334155]">{card.base}</span>
                        </td>
                        <td className="px-5 py-3.5 text-right text-emerald-400 font-bold text-base">${card.price}</td>
                        <td className="px-5 py-3.5 text-center">
                          <button className="bg-transparent border border-blue-500 text-blue-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 text-xs font-bold px-4 py-2 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 w-full">
                            <ShoppingCart size={14} /> Buy
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination UI */}
            <div className="p-4 border-t border-[#1e293b] flex items-center justify-between bg-[#0f172a]">
              <div className="text-sm text-slate-500 font-medium">
                Page <span className="text-white">{pagination.page}</span> / {Math.max(1, pagination.totalPages)}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || loading}
                  className="p-2 rounded-lg bg-[#1e293b] text-slate-300 border border-[#334155] hover:bg-[#334155] disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page >= pagination.totalPages || loading}
                  className="p-2 rounded-lg bg-[#1e293b] text-slate-300 border border-[#334155] hover:bg-[#334155] disabled:opacity-50 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </Card>
       </div>
    </div>
  );
}
