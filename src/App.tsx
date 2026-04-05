import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Menu, Plus, ChevronDown, X, Home, CreditCard, ShoppingCart, 
  Wallet, RefreshCw, AlertTriangle, FileText, Ticket, User, 
  Calendar, Search, Filter, ShieldCheck, Clock, CheckCircle2
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
      
      {/* Stats Cards */}
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

      {/* Note Alert */}
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

      {/* News Feed */}
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
              <p className="text-yellow-500/90 text-xs">Note: Shop#2 is under maintenance and may not be available. We will update this notice once it is up and running.</p>
            </div>
          </Card>
          
          <Card className="p-5 opacity-90">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <h3 className="text-white font-bold text-base">NEW: Socks5 Proxy Section!</h3>
              <span className="text-xs font-mono bg-[#0f172a] text-slate-400 px-2 py-1 rounded border border-[#2d3748]">Mar 26, 2026 / 01:46 AM</span>
            </div>
            <div className="text-sm text-slate-300 space-y-3">
              <p>We are excited to announce the launch of our new SOCKS5 proxy shop! Access high-quality, truly residential proxies that are designed to stay unblocked.</p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-[#0f172a] px-3 py-1.5 rounded border border-[#2d3748] text-xs"><span className="text-slate-400">Residential:</span> <span className="text-white font-bold">$2</span></span>
                <span className="bg-[#0f172a] px-3 py-1.5 rounded border border-[#2d3748] text-xs"><span className="text-slate-400">Mobile:</span> <span className="text-white font-bold">$1.50</span></span>
                <span className="bg-[#0f172a] px-3 py-1.5 rounded border border-[#2d3748] text-xs"><span className="text-slate-400">Hosting:</span> <span className="text-white font-bold">$0.50</span></span>
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
          {/* Filters Sidebar */}
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
                  <Input placeholder="e.g. 414720" maxLength={6} icon={CreditCard} />
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Base / Database</label>
                  <div className="relative">
                    <select className="w-full bg-[#0f172a] border border-[#2d3748] rounded-lg px-3 py-2.5 text-sm text-slate-200 appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                      <option value="">All Bases</option>
                      <option>APR#02_USA[GREAT]</option>
                      <option>APR#02_USA/MIX</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Country</label>
                    <Input placeholder="US" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">State</label>
                    <Input placeholder="NY" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">City</label>
                    <Input placeholder="City name" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Zip Code</label>
                    <Input placeholder="10001" />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#2d3748] space-y-3">
                  <Toggle checked={true} onChange={() => {}} label="Include Refunds" />
                  <Toggle checked={false} onChange={() => {}} label="Sniffed CVV" />
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-2">
                <Search size={16} /> Search Cards
              </button>
            </div>
          </Card>

          {/* Table Area */}
          <Card className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <div className="p-4 border-b border-[#2d3748] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#1e293b]">
              <span className="text-sm font-medium text-slate-300">
                Found <span className="text-white font-bold">0</span> results
              </span>
              <div className="flex gap-2">
                <button className="text-xs bg-[#0f172a] border border-[#2d3748] px-3 py-1.5 rounded hover:bg-[#2d3748] transition-colors text-slate-300">
                  Refresh
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
                  <EmptyTableState colSpan={8} message="No cards match your filter criteria" />
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
      <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm p-4 rounded-xl flex items-center justify-between gap-4 flex-col sm:flex-row">
        <span>Only <strong>Shop #1</strong> Cards are displayed in this section.</span>
        <a href="#" className="font-bold underline hover:text-yellow-400 whitespace-nowrap">View Shop #2 Cards &rarr;</a>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-xs text-slate-400 bg-[#0f172a] border-b border-[#2d3748]">
              <tr>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Card Details</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Number</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Price</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Checked</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Check time</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Dated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d3748]">
              <EmptyTableState colSpan={7} message="You haven't purchased any cards yet" />
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <Card className="p-6">
          <h2 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">Select Currency</h2>
          <p className="text-xs text-slate-400 mb-5">Choose your preferred cryptocurrency to top up your account.</p>
          
          <div className="space-y-3 mb-6">
            {[
              { id: 'btc', name: 'Bitcoin', symbol: 'BTC', color: 'text-orange-500' },
              { id: 'ltc', name: 'Litecoin', symbol: 'LTC', color: 'text-slate-300' },
              { id: 'eth', name: 'Ethereum', symbol: 'ERC-20', color: 'text-indigo-400' },
              { id: 'usdt', name: 'Tether', symbol: 'TRC-20', color: 'text-teal-500' }
            ].map((coin, i) => (
              <label key={coin.id} className="flex items-center justify-between p-3 rounded-lg border border-[#2d3748] hover:bg-[#2d3748]/50 cursor-pointer transition-colors has-[:checked]:bg-[#2d3748] has-[:checked]:border-blue-500/50">
                <div className="flex items-center gap-3">
                  <input type="radio" name="coin" className="accent-blue-500 w-4 h-4" defaultChecked={i === 0} /> 
                  <span className="text-sm text-slate-200 font-medium">{coin.name}</span>
                </div>
                <span className={`text-xs font-bold bg-[#0f172a] px-2 py-1 rounded ${coin.color}`}>{coin.symbol}</span>
              </label>
            ))}
          </div>
          
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]">
            Generate Payment Address
          </button>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 border-yellow-500/20 bg-gradient-to-b from-[#1e293b] to-[#1e293b]/50">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-yellow-500">Loyalty VIP Program</h2>
              <span className="bg-yellow-500/10 text-yellow-500 text-xs font-bold px-2 py-1 rounded border border-yellow-500/20">BONUS</span>
            </div>
            <p className="text-xs text-slate-400 mb-8 leading-relaxed">Automatically receive extra balance bonuses based on your lifetime deposit history.</p>
            
            <div className="relative pt-8">
               {/* Progress bar visual */}
               <div className="absolute top-0 left-0 w-full h-1 bg-[#0f172a] rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[15%]"></div>
               </div>
               
               <div className="flex flex-col sm:flex-row rounded-xl overflow-hidden border border-[#2d3748] shadow-inner bg-[#0f172a]">
                <div className="flex-1 bg-blue-500/20 p-4 text-center border-b sm:border-b-0 sm:border-r border-[#2d3748] relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-500 rounded-full border-4 border-[#1e293b]"></div>
                  <div className="font-bold text-blue-400 text-sm">No Bonus</div>
                  <div className="text-[10px] text-slate-400 mt-1">&lt; $200</div>
                </div>
                <div className="flex-1 p-4 text-center border-b sm:border-b-0 sm:border-r border-[#2d3748] opacity-50">
                  <div className="font-bold text-white text-sm">+5%</div>
                  <div className="text-[10px] text-slate-400 mt-1">&ge; $200</div>
                </div>
                <div className="flex-1 p-4 text-center border-b sm:border-b-0 sm:border-r border-[#2d3748] opacity-50">
                  <div className="font-bold text-white text-sm">+10%</div>
                  <div className="text-[10px] text-slate-400 mt-1">&ge; $500</div>
                </div>
                <div className="flex-1 p-4 text-center opacity-50">
                  <div className="font-bold text-white text-sm">+15%</div>
                  <div className="text-[10px] text-slate-400 mt-1">&ge; $1000</div>
                </div>
              </div>
            </div>

            <div className="bg-[#0f172a] rounded-lg p-3 mt-6 border border-[#2d3748] text-center">
              <p className="text-xs text-slate-400">
                Current Tier: <span className="font-bold text-white">0% Bonus</span><br/>
                Spend <span className="font-bold text-yellow-400">$200.00</span> more to reach the next tier.
              </p>
            </div>
          </Card>

          <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-dashed border-[#3f4b63]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-lg"><Ticket size={18} className="text-slate-400"/></div>
              <div>
                <h3 className="text-sm font-bold text-white">Promo Code</h3>
                <p className="text-xs text-slate-400">Redeem a voucher</p>
              </div>
            </div>
            <button className="w-full sm:w-auto bg-[#2d3748] hover:bg-[#3f4b63] text-white text-xs font-medium px-4 py-2.5 rounded-lg transition-colors">
              Redeem Code
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ReportLostFunds() {
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(true);

  return (
    <div className="space-y-6 max-w-3xl animate-in fade-in duration-300">
      <PageHeader title="Report Lost Funds" />
      
      <Card className="p-5 lg:p-8">
        <p className="text-sm text-slate-400 mb-6 pb-6 border-b border-[#2d3748]">
          If you sent funds but they haven't appeared in your balance after 3 confirmations, please fill out this form.
        </p>

        <div className="space-y-5 mb-8">
          <Toggle checked={toggle1} onChange={setToggle1} label={<span className="text-sm">Paid more than minimum mentioned amount? <span className="text-red-500">*</span></span>} />
          <Toggle checked={toggle2} onChange={setToggle2} label={<span className="text-sm">Made exactly one transaction to the address? <span className="text-red-500">*</span></span>} />
        </div>

        <div className="space-y-5 bg-[#0f172a] border border-[#2d3748] rounded-xl p-5 lg:p-6 shadow-inner">
          <div>
            <label className="block text-xs text-slate-300 mb-1.5 font-semibold uppercase tracking-wider">Destination Crypto Address <span className="text-red-500">*</span></label>
            <p className="text-[11px] text-slate-500 mb-2">The exact address generated by our system where you sent the funds.</p>
            <Input placeholder="e.g. 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" />
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1.5 font-semibold uppercase tracking-wider">Transaction Hash (TXID) <span className="text-red-500">*</span></label>
            <Input placeholder="Enter the exact blockchain TXID" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs text-slate-300 mb-1.5 font-semibold uppercase tracking-wider">Date of Transfer <span className="text-red-500">*</span></label>
              <Input type="date" className="w-full bg-[#0f172a] border border-[#2d3748] rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1.5 font-semibold uppercase tracking-wider">Amount Sent (USD Value) <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input type="number" placeholder="0.00" className="w-full bg-[#0f172a] border border-[#2d3748] rounded-lg pl-8 pr-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 py-3 rounded-lg transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]">
            Submit Investigation Request
          </button>
        </div>
      </Card>
      
      <p className="text-xs text-slate-500 px-1 text-center">You have not created any reports yet.</p>
    </div>
  );
}

function DynamicTopups() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader title="Topup History" />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-xs text-slate-400 bg-[#0f172a] border-b border-[#2d3748]">
              <tr>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Amount (USD)</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Crypto Value</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Network</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Date / Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d3748]">
              <EmptyTableState colSpan={5} message="No topup history found" />
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function OrderCCScan() {
  const [boughtElsewhere, setBoughtElsewhere] = useState(false);

  return (
    <div className="space-y-6 max-w-3xl animate-in fade-in duration-300">
      <PageHeader title="Order Document Services" />
      
      <Card className="p-5 lg:p-6 bg-emerald-500/5 border-emerald-500/20">
        <div className="flex gap-3">
          <div className="mt-0.5"><FileText size={20} className="text-emerald-400"/></div>
          <div className="text-sm text-emerald-100/80 leading-relaxed">
            <p className="mb-2">Request custom CC Scans or high-quality real camera pictures of credit cards (Front & Back). Specify format in your ticket after ordering.</p>
            <p><strong>Standard TAT:</strong> 24-30 hours.<br/>Our team will coordinate delivery via a dedicated secure ticket.</p>
          </div>
        </div>
      </Card>

      <Card className="p-5 lg:p-8 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Target Card (Order ID) <span className="text-red-500">*</span></label>
          <div className="relative">
            <select disabled={boughtElsewhere} className="w-full bg-[#0f172a] border border-[#2d3748] rounded-lg px-3 py-3 text-sm text-slate-200 appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              <option>Select an eligible card from history</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
          </div>
          <p className="text-xs text-slate-500 mt-2">Automatically fetches data from your last 10 purchases.</p>
        </div>

        <div className="py-4 border-y border-[#2d3748]">
          <Toggle checked={boughtElsewhere} onChange={setBoughtElsewhere} label="External Card (Bought elsewhere?)" />
          {boughtElsewhere && (
             <div className="mt-4 p-4 bg-[#0f172a] rounded-lg border border-[#2d3748] animate-in slide-in-from-top-2 duration-200">
                <label className="block text-xs font-semibold text-slate-300 mb-2">Card Details <span className="text-red-500">*</span></label>
                <textarea rows={3} placeholder="Paste full card details here..." className="w-full bg-[#1e293b] border border-[#3f4b63] rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 resize-none"></textarea>
             </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wider">Service Speed Tier <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
             <label className="flex items-center p-4 border border-[#2d3748] rounded-xl cursor-pointer hover:bg-[#2d3748]/50 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-500/5">
              <input type="radio" name="service" className="accent-blue-500 w-4 h-4 mt-0.5" defaultChecked /> 
              <div className="ml-3">
                <span className="block text-sm font-bold text-white mb-0.5">Standard Service</span>
                <span className="block text-xs text-slate-400">24-30 Hours • $18.00</span>
              </div>
            </label>
            <label className="flex items-center p-4 border border-[#2d3748] rounded-xl cursor-pointer hover:bg-[#2d3748]/50 transition-colors has-[:checked]:border-yellow-500 has-[:checked]:bg-yellow-500/5">
              <input type="radio" name="service" className="accent-yellow-500 w-4 h-4 mt-0.5" /> 
              <div className="ml-3">
                <span className="block text-sm font-bold text-yellow-500 mb-0.5">Priority Express</span>
                <span className="block text-xs text-slate-400">6-8 Hours • $30.00</span>
              </div>
            </label>
          </div>
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]">
          Pay & Create Ticket
        </button>
      </Card>
    </div>
  );
}

function Tickets() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader 
        title="Support Tickets" 
        action={
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-blue-500/20">
            <Plus size={16} /> Open New Ticket
          </button>
        } 
      />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-xs text-slate-400 bg-[#0f172a] border-b border-[#2d3748]">
              <tr>
                <th className="px-5 py-4 w-10 text-center"><input type="checkbox" className="accent-blue-500 rounded border-[#3f4b63] w-4 h-4" /></th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Subject / Title</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider text-center">Replies</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Last Updated</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d3748]">
              <EmptyTableState colSpan={5} message="No support tickets found" />
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ==========================================
// LAYOUT & ROUTING
// ==========================================

const NAVIGATION = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Purchase Cards', path: '/purchase-cards', icon: CreditCard },
  { name: 'My Orders', path: '/orders', icon: ShoppingCart },
  { name: 'Add Funds', path: '/topup', icon: Wallet },
  { name: 'Topup History', path: '/dynamic-topups', icon: RefreshCw },
  { name: 'Report Lost Funds', path: '/report-lost', icon: AlertTriangle },
  { name: 'Document Services', path: '/cc-scan', icon: FileText },
  { name: 'Support Center', path: '/tickets', icon: Ticket },
];

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 font-sans flex flex-col md:flex-row selection:bg-blue-500/30">
      
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setSidebarOpen(false)} 
        aria-hidden="true"
      />

      {/* Sidebar Navigation */}
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

        <div className="p-4 border-t border-[#2d3748] bg-[#1e293b]">
          <div className="bg-[#0f172a] rounded-xl p-4 border border-[#2d3748] shadow-inner">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#1e293b] border border-slate-600 flex items-center justify-center text-white font-bold">
                U
              </div>
              <div>
                <p className="text-white text-sm font-bold">User</p>
                <p className="text-emerald-400 text-xs font-mono">$ 0.00</p>
              </div>
            </div>
            <button className="w-full bg-[#1e293b] hover:bg-slate-700 text-xs font-semibold text-slate-300 py-2 rounded border border-[#3f4b63] transition-colors">
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-hidden bg-[#0f172a]">
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-[#1e293b]/80 backdrop-blur-md border-b border-[#2d3748]">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2 md:hidden hover:bg-[#2d3748] rounded-lg transition-colors text-slate-300 border border-transparent hover:border-[#3f4b63]">
              <Menu size={20} />
            </button>
            
            <div className="hidden lg:flex items-center relative text-slate-400 focus-within:text-white">
              <Search size={16} className="absolute left-3" />
              <input 
                type="text" 
                placeholder="Quick search bins..." 
                className="bg-[#0f172a] border border-[#2d3748] rounded-full pl-9 pr-4 py-1.5 text-sm w-64 focus:outline-none focus:border-blue-500 focus:w-80 transition-all duration-300 placeholder:text-slate-500" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <button className="hidden sm:block text-xs font-bold bg-emerald-500/10 text-emerald-400 px-3 py-2 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-all active:scale-95">
              Claim Free Card
            </button>
            <div className="flex items-center bg-[#0f172a] rounded-lg p-1 border border-[#2d3748] shadow-inner">
              <span className="text-sm font-bold text-emerald-400 px-3">$ 0.00</span>
              <Link to="/topup" className="bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded-md transition-colors shadow-sm">
                <Plus size={16} />
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto overflow-y-auto custom-scrollbar">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/purchase-cards" element={<PurchaseCards />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/topup" element={<Topup />} />
            <Route path="/dynamic-topups" element={<DynamicTopups />} />
            <Route path="/report-lost" element={<ReportLostFunds />} />
            <Route path="/cc-scan" element={<OrderCCScan />} />
            <Route path="/tickets" element={<Tickets />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
