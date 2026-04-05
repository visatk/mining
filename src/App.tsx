import React, { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Menu, Plus, ChevronDown, X, Home, CreditCard, ShoppingCart, 
  Wallet, RefreshCw, AlertTriangle, FileText, Ticket, 
  Search, Filter, ShieldCheck, Clock, CheckCircle2, Copy, 
  Bitcoin, DollarSign, QrCode, ArrowUpRight
} from 'lucide-react';

// ==========================================
// GLOBAL CONTEXT (User & Balance)
// ==========================================

interface UserState {
  username: string;
  balance: number;
  loading: boolean;
  refreshUser: () => void;
  deductBalance: (amount: number) => void;
}

const UserContext = createContext<UserState>({
  username: '', balance: 0, loading: true, refreshUser: () => {}, deductBalance: () => {}
});

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState('Guest');
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/user');
      const data = await res.json();
      if (data.success) {
        setUsername(data.data.username);
        setBalance(data.data.balance);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUser(); }, []);

  const deductBalance = (amount: number) => {
    setBalance(prev => Math.max(0, prev - amount));
  };

  return (
    <UserContext.Provider value={{ username, balance, loading, refreshUser: fetchUser, deductBalance }}>
      {children}
    </UserContext.Provider>
  );
};

// ==========================================
// SHARED COMPONENTS
// ==========================================

const Toggle = ({ checked, onChange, label }: { checked: boolean, onChange: (c: boolean) => void, label?: React.ReactNode }) => (
  <div className="flex items-center gap-3">
    <button 
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1e293b] ${checked ? 'bg-blue-600' : 'bg-slate-600'}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : 'translate-x-1'}`} />
    </button>
    {label && <span className="text-sm font-medium text-slate-300 select-none">{label}</span>}
  </div>
);

const EmptyTableState = ({ colSpan, message = "No records found", icon: Icon = X }: { colSpan: number, message?: string, icon?: React.ElementType }) => (
  <tr>
    <td colSpan={colSpan} className="px-4 py-16 text-center">
      <div className="flex flex-col items-center justify-center">
        <div className="w-12 h-12 bg-[#2d3748] rounded-full flex items-center justify-center mb-3 border border-[#3f4b63]">
          <Icon size={20} className="text-slate-400" />
        </div>
        <p className="font-medium text-white">{message}</p>
        <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search query.</p>
      </div>
    </td>
  </tr>
);

const PageHeader = ({ title, action }: { title: string, action?: React.ReactNode }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h1>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-[#1e293b] border border-[#2d3748] rounded-xl shadow-lg shadow-black/20 ${className}`}>
    {children}
  </div>
);

const Input = ({ icon: Icon, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ElementType }) => (
  <div className="relative">
    {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />}
    <input 
      className={`w-full bg-[#0f172a] border border-[#2d3748] rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${Icon ? 'pl-9' : ''}`}
      {...props}
    />
  </div>
);

// ==========================================
// PAGES
// ==========================================

function Dashboard() {
  const { balance, loading } = useContext(UserContext);

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
          <div className="text-3xl font-bold text-white mb-1">
            $ {loading ? '...' : balance.toFixed(2)}
          </div>
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 size={12} /> Available for purchases
          </div>
        </Card>
        <Card className="p-5 lg:p-6 hover:border-slate-600 transition-colors">
          <div className="flex items-center gap-2 text-slate-400 mb-3">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <ShoppingCart size={20} />
            </div>
            <span className="text-sm font-semibold uppercase tracking-wider">Total Spent</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">$ 0.00</div>
          <div className="text-xs text-purple-400 font-medium flex items-center gap-1">
            <Clock size={12} /> Lifetime spending
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
        </div>
      </Card>
    </div>
  );
}

function PurchaseCards() {
  const { balance, deductBalance } = useContext(UserContext);
  const [showFilters, setShowFilters] = useState(false);
  const [cards, setCards] = useState<any[]>([]);
  const [totalCards, setTotalCards] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  
  // Filters State
  const [filterBin, setFilterBin] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterZip, setFilterZip] = useState('');
  const [filterBase, setFilterBase] = useState('');

  const fetchCards = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterBin) params.append('bin', filterBin);
      if (filterCountry) params.append('country', filterCountry);
      if (filterState) params.append('state', filterState);
      if (filterCity) params.append('city', filterCity);
      if (filterZip) params.append('zip', filterZip);
      if (filterBase) params.append('base', filterBase);
      
      const res = await fetch(`/api/cards?${params.toString()}`);
      const data = await res.json();
      
      if (data.success) {
        setCards(data.data);
        setTotalCards(data.total);
      }
    } catch (error) {
      console.error("Failed to fetch cards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCards(); }, []);

  const handleSearch = () => {
    fetchCards();
    if (window.innerWidth < 1024) setShowFilters(false);
  };

  const handleBuy = async (id: string, price: number) => {
    if (balance < price) {
      alert("Insufficient funds. Please add balance to topup.");
      return;
    }
    
    setPurchasing(id);
    try {
      const res = await fetch('/api/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, price })
      });
      const data = await res.json();
      
      if (data.success) {
        deductBalance(price);
        // Remove card from UI list
        setCards(cards.filter(c => c.id !== id));
        setTotalCards(prev => prev - 1);
        alert("Card purchased successfully! Check My Orders.");
      }
    } catch (err) {
      alert("Error purchasing card.");
    } finally {
      setPurchasing(null);
    }
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
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Base / Database</label>
                  <Input 
                    placeholder="e.g. APR#02" 
                    value={filterBase}
                    onChange={(e) => setFilterBase(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Country</label>
                    <Input 
                      placeholder="US, UK" 
                      value={filterCountry}
                      onChange={(e) => setFilterCountry(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">State</label>
                    <Input 
                      placeholder="NY, TX" 
                      value={filterState}
                      onChange={(e) => setFilterState(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">City</label>
                    <Input 
                      placeholder="City" 
                      value={filterCity}
                      onChange={(e) => setFilterCity(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Zip Code</label>
                    <Input 
                      placeholder="10001" 
                      value={filterZip}
                      onChange={(e) => setFilterZip(e.target.value)}
                    />
                  </div>
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
                Found <span className="text-white font-bold">{totalCards}</span> results
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
                        <td className="px-4 py-3 text-emerald-300 font-mono font-medium">{card.exp}</td>
                        <td className="px-4 py-3 text-slate-300">{card.country}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs truncate max-w-[200px]">{card.stateCityZip}</td>
                        <td className="px-4 py-3 text-blue-400 font-mono text-xs">{card.base}</td>
                        <td className="px-4 py-3 text-right text-emerald-400 font-bold">${card.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-center">
                          <button 
                            onClick={() => handleBuy(card.id, card.price)}
                            disabled={purchasing === card.id}
                            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-1.5 rounded transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-1.5 w-full"
                          >
                            {purchasing === card.id ? <RefreshCw size={14} className="animate-spin" /> : <ShoppingCart size={14} />} 
                            {purchasing === card.id ? 'Buying' : 'Buy'}
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
  )
}

function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 h-full flex flex-col">
      <PageHeader 
        title="My Orders" 
        action={
          <button onClick={fetchOrders} className="flex items-center gap-1.5 text-xs bg-[#1e293b] border border-[#2d3748] px-4 py-2 rounded-lg hover:bg-[#2d3748] transition-colors text-slate-300">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        }
      />
      
      <Card className="flex-1 flex flex-col min-h-[500px] overflow-hidden">
        <div className="flex-1 overflow-auto custom-scrollbar relative">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
            <thead className="text-xs text-slate-400 bg-[#0f172a] sticky top-0 z-10 shadow-sm border-b border-[#2d3748]">
              <tr>
                <th className="px-4 py-3.5 font-semibold">Order ID</th>
                <th className="px-4 py-3.5 font-semibold">Date</th>
                <th className="px-4 py-3.5 font-semibold">Card Details (CC|MM|YY|CVV)</th>
                <th className="px-4 py-3.5 font-semibold">Type</th>
                <th className="px-4 py-3.5 font-semibold">Base</th>
                <th className="px-4 py-3.5 font-semibold text-right">Price</th>
                <th className="px-4 py-3.5 font-semibold text-center w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d3748]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <RefreshCw size={24} className="text-blue-500 animate-spin mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">Loading your orders...</p>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <EmptyTableState colSpan={7} message="You have no orders yet." icon={ShoppingCart} />
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#2d3748]/30 transition-colors">
                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">{order.id}</td>
                    <td className="px-4 py-3 text-slate-300 text-xs">{new Date(order.date).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-300 font-mono font-medium tracking-wider">{order.cardDetails}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{order.type}</td>
                    <td className="px-4 py-3 text-blue-400 font-mono text-xs">{order.base}</td>
                    <td className="px-4 py-3 text-right text-emerald-400 font-bold">${order.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => handleCopy(order.cardDetails)}
                        className="bg-[#2d3748] hover:bg-[#3f4b63] text-white text-xs px-3 py-1.5 rounded transition-all flex items-center justify-center gap-1.5 w-full"
                      >
                        <Copy size={14} /> Copy
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
  );
}

function Topup() {
  const [selectedMethod, setSelectedMethod] = useState('btc');
  
  const methods = [
    { id: 'btc', name: 'Bitcoin', network: 'BTC Network', icon: Bitcoin, color: 'text-orange-400', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
    { id: 'usdt', name: 'TetherUS', network: 'TRC20', icon: DollarSign, color: 'text-emerald-400', address: 'TXYZ1234567890abcdefghijklmnopqrstuv' },
    { id: 'ltc', name: 'Litecoin', network: 'LTC Network', icon: DollarSign, color: 'text-slate-300', address: 'ltc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
  ];

  const activeMethod = methods.find(m => m.id === selectedMethod)!;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeMethod.address);
    alert('Wallet address copied to clipboard');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <PageHeader title="Add Funds" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-3">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Select Method</h3>
          {methods.map(method => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;
            return (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${isSelected ? 'bg-blue-600/10 border-blue-500' : 'bg-[#1e293b] border-[#2d3748] hover:border-[#3f4b63]'}`}
              >
                <div className={`p-2 rounded-lg bg-[#0f172a] ${method.color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <div className="font-bold text-white">{method.name}</div>
                  <div className="text-xs text-slate-400">{method.network}</div>
                </div>
                {isSelected && <CheckCircle2 size={18} className="ml-auto text-blue-500" />}
              </button>
            )
          })}
        </div>

        <Card className="md:col-span-2 p-6 md:p-8 flex flex-col items-center justify-center border-[#2d3748]">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Deposit {activeMethod.name}</h2>
            <p className="text-slate-400 text-sm">Send any amount to the address below. Your balance will be credited automatically after 1 network confirmation.</p>
          </div>

          <div className="bg-white p-4 rounded-xl mb-8">
            <QrCode size={160} className="text-black" />
          </div>

          <div className="w-full max-w-md space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Deposit Address ({activeMethod.network})</label>
            <div className="flex gap-2">
              <input 
                readOnly 
                value={activeMethod.address} 
                className="flex-1 bg-[#0f172a] border border-[#2d3748] rounded-lg px-4 py-3 text-sm text-white font-mono focus:outline-none"
              />
              <button 
                onClick={handleCopy}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-lg transition-colors flex items-center gap-2 font-medium shrink-0"
              >
                <Copy size={16} /> Copy
              </button>
            </div>
            <p className="text-xs text-amber-400/80 mt-3 text-center flex items-center justify-center gap-1.5">
              <AlertTriangle size={12} /> Minimum deposit: $5.00 equivalent
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ==========================================
// LAYOUT & APP ROOT
// ==========================================

const NAVIGATION = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Purchase Cards', path: '/purchase-cards', icon: CreditCard },
  { name: 'My Orders', path: '/orders', icon: ShoppingCart },
  { name: 'Add Funds', path: '/topup', icon: Wallet },
];

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { username, balance, loading } = useContext(UserContext);

  useEffect(() => setSidebarOpen(false), [location.pathname]);
  useEffect(() => { document.body.style.overflow = sidebarOpen ? 'hidden' : 'unset'; }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 font-sans flex flex-col md:flex-row selection:bg-blue-500/30">
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setSidebarOpen(false)} aria-hidden="true"
      />

      <aside className={`fixed md:sticky top-0 left-0 z-50 h-[100dvh] w-[280px] bg-[#1e293b] border-r border-[#2d3748] shadow-2xl md:shadow-none transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex flex-col`}>
        <div className="p-5 flex items-center justify-between border-b border-[#2d3748] bg-[#1e293b]">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <CreditCard size={18} className="text-white" />
            </div>
            <span className="text-white font-extrabold text-xl tracking-tight">elonmoney</span>
          </Link>
          <button className="md:hidden text-slate-400 hover:text-white bg-[#0f172a] p-1.5 rounded-md border border-[#2d3748]" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>
        
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 mt-2">Menu</p>
          {NAVIGATION.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path} className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' : 'text-slate-400 hover:bg-[#2d3748] hover:text-white'}`}>
                <Icon size={18} className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-hidden bg-[#0f172a]">
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-[#1e293b]/80 backdrop-blur-md border-b border-[#2d3748]">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2 md:hidden hover:bg-[#2d3748] rounded-lg transition-colors text-slate-300 border border-transparent hover:border-[#3f4b63]">
              <Menu size={20} />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-[#0f172a] border border-[#2d3748] px-4 py-1.5 rounded-full">
              <Wallet size={14} className="text-emerald-400" />
              <span className="text-sm font-bold text-white">${loading ? '...' : balance.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/30">
                {username ? username.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto overflow-y-auto custom-scrollbar">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/purchase-cards" element={<PurchaseCards />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/topup" element={<Topup />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <MainLayout />
    </UserProvider>
  );
}
