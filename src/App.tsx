import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Menu, Plus, ChevronDown, X, Home, CreditCard, ShoppingCart, 
  Wallet, RefreshCw, AlertTriangle, FileText, Ticket, 
  Search, Filter, ShieldCheck, Clock, CheckCircle2
} from 'lucide-react';

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

const EmptyTableState = ({ colSpan, message = "No records found" }: { colSpan: number, message?: string }) => (
  <tr>
    <td colSpan={colSpan} className="px-4 py-16 text-center">
      <div className="flex flex-col items-center justify-center">
        <div className="w-12 h-12 bg-[#2d3748] rounded-full flex items-center justify-center mb-3 border border-[#3f4b63]">
          <X size={20} className="text-slate-400" />
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
          <p className="text-red-300/80 italic text-xs">All other domains are fake/scam. We do not sell on Telegram or any other social platform!</p>
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
                <p className="text-blue-300">APR#02_MIX[GOOD]</p>
                <p className="text-blue-300">APR#02_USA[GOOD]</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PurchaseCards() {
  const [showFilters, setShowFilters] = useState(false);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters State
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
  )
}

function Orders() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader title="My Orders" />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-xs text-slate-400 bg-[#0f172a] border-b border-[#2d3748]">
              <tr>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Card Details</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Number</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Price</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Dated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d3748]">
              <EmptyTableState colSpan={5} message="You haven't purchased any cards yet" />
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Topup() {
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

// Layout Wrapper
const NAVIGATION = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Purchase Cards', path: '/purchase-cards', icon: CreditCard },
  { name: 'My Orders', path: '/orders', icon: ShoppingCart },
  { name: 'Add Funds', path: '/topup', icon: Wallet },
];

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : 'unset';
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 font-sans flex flex-col md:flex-row selection:bg-blue-500/30">
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setSidebarOpen(false)} 
        aria-hidden="true"
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
              <Link 
                key={item.path} 
                to={item.path} 
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' : 'text-slate-400 hover:bg-[#2d3748] hover:text-white'}`}
              >
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
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center bg-[#0f172a] rounded-lg p-1 border border-[#2d3748] shadow-inner">
              <span className="text-sm font-bold text-emerald-400 px-3">$ 0.00</span>
              <Link to="/topup" className="bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded-md transition-colors shadow-sm">
                <Plus size={16} />
              </Link>
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
