import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Menu, Plus, ChevronDown, X, Home, CreditCard, ShoppingCart, 
  Wallet, RefreshCw, AlertTriangle, FileText, Ticket, User, 
  Calendar, Search
} from 'lucide-react';

// ==========================================
// SHARED COMPONENTS
// ==========================================

const Toggle = ({ checked, onChange, label }: { checked: boolean, onChange: (c: boolean) => void, label?: React.ReactNode }) => (
  <div className="flex items-center gap-3">
    <button 
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-slate-600'}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : 'translate-x-1'}`} />
    </button>
    {label && <span className="text-xs font-medium text-slate-300">{label}</span>}
  </div>
);

const EmptyTableState = ({ colSpan, message = "No records found" }: { colSpan: number, message?: string }) => (
  <tr>
    <td colSpan={colSpan} className="px-4 py-16 text-center">
      <div className="flex flex-col items-center justify-center">
        <div className="w-10 h-10 bg-[#2d3748] rounded-full flex items-center justify-center mb-3">
          <X size={18} className="text-slate-400" />
        </div>
        <p className="font-medium text-white">{message}</p>
      </div>
    </td>
  </tr>
);

const PageHeader = ({ title, action }: { title: string, action?: React.ReactNode }) => (
  <div className="flex items-center justify-between mb-6">
    <h1 className="text-xl font-bold text-white">{title}</h1>
    {action}
  </div>
);

// ==========================================
// PAGES
// ==========================================

function Dashboard() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1e293b] border border-[#2d3748] rounded-lg p-5 shadow-lg shadow-black/10">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Wallet size={16} /> <span className="text-sm font-medium">Balance</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">$ 0.00</div>
          <div className="text-xs text-emerald-500 font-medium">Balance in your Account</div>
        </div>
        <div className="bg-[#1e293b] border border-[#2d3748] rounded-lg p-5 shadow-lg shadow-black/10">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <ShoppingCart size={16} /> <span className="text-sm font-medium">Orders</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">0</div>
          <div className="text-xs text-emerald-500 font-medium">Your Total Orders</div>
        </div>
      </div>

      {/* Note Alert */}
      <div className="bg-[#1e293b] border border-red-500/30 rounded-lg p-5 shadow-lg shadow-black/10">
        <div className="flex items-center gap-2 text-red-400 mb-3 font-medium">
          <AlertTriangle size={18} /> Note
        </div>
        <div className="text-sm text-slate-300 space-y-3">
          <p>ElonMoney only uses the following domains.</p>
          <div className="flex flex-wrap gap-2">
             <span className="bg-[#2d3748] text-red-400 px-2 py-1 rounded text-xs border border-red-500/20">https://elonmoney.hk/</span>
             <span className="bg-[#2d3748] text-red-400 px-2 py-1 rounded text-xs border border-red-500/20">https://elonmoney.vip/</span>
             <span className="bg-[#2d3748] text-red-400 px-2 py-1 rounded text-xs border border-red-500/20">https://elonmoney.sh/</span>
          </div>
          <p>Join TG for updates [NEW LINK]:</p>
          <div className="inline-block bg-[#2d3748] text-red-400 px-2 py-1 rounded text-xs border border-red-500/20">https://t.me/elonmoney_bid</div>
          <p>All other domains are fake/scam. We do not sell on Telegram or any other social platform!</p>
        </div>
      </div>

      {/* News Feed */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">News</h2>
        <div className="space-y-4">
          <div className="bg-[#1e293b] border border-[#2d3748] rounded-lg p-5 shadow-lg shadow-black/10">
            <h3 className="text-white font-bold text-sm mb-1">NEW CC UPDATE! [Shop#1]</h3>
            <p className="text-xs text-slate-500 mb-3">Apr 02, 2026 / 08:15:38 PM</p>
            <div className="text-xs text-slate-300 space-y-2">
              <p>GOOD VALID USA & MIX UPDATE! ADDED AROUND 2000+ CCs.</p>
              <p className="font-bold">APR#02_USA[GREAT]<br/>APR#02_USA/MIX<br/>APR#02_MIX[GOOD]<br/>APR#02_USA[GOOD]</p>
              <p>Note: Shop#2 is under maintenance and may not be available. We will update this notice once it is up and running.</p>
              <p className="font-bold">NOTE: Please note down the new domains. We only have these domains!<br/><span className="font-normal text-slate-400">https://elonmoney.hk | https://elonmoney.vip | https://elonmoney.sh</span></p>
            </div>
          </div>
          <div className="bg-[#1e293b] border border-[#2d3748] rounded-lg p-5 shadow-lg shadow-black/10">
            <h3 className="text-white font-bold text-sm mb-1">NEW: Socks5 Proxy Section!</h3>
            <p className="text-xs text-slate-500 mb-3">Mar 26, 2026 / 01:46:24 AM</p>
            <div className="text-xs text-slate-300 space-y-2">
              <p>Dear users,<br/>We are excited to announce the launch of our new SOCKS5 proxy shop! Access high-quality, truly residential proxies that are designed to stay unblocked.</p>
              <p className="font-bold">Residential Proxy: $2<br/>Mobile Proxy: $1.50<br/>Hosting Proxy: $0.50</p>
              <p className="font-bold">All purchased proxies are valid for 24 hours with unlimited bandwidth. If a proxy stops working, it can be refunded within 1 hour.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Orders() {
  return (
    <div className="space-y-6">
      <PageHeader title="Orders" />
      <div className="bg-[#b48600] text-white text-xs font-medium p-3 rounded-lg flex items-center justify-between">
        <span>Only Shop #1 Cards are displayed in this section. <a href="#" className="font-bold underline hover:text-yellow-200">Click Here to view Shop #2 Cards</a>.</span>
      </div>
      <div className="bg-[#1e293b] border border-[#2d3748] rounded-lg overflow-x-auto shadow-lg shadow-black/10">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-xs text-slate-400 bg-[#1a233a] border-b border-[#2d3748]">
            <tr>
              <th className="px-4 py-3 font-medium">Number</th>
              <th className="px-4 py-3 font-medium">Number</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Checked</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Check time</th>
              <th className="px-4 py-3 font-medium">Dated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2d3748]">
            <EmptyTableState colSpan={7} />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Topup() {
  return (
    <div className="space-y-6">
      <PageHeader title="Topup" />
      
      <div className="bg-[#1e293b] border border-[#2d3748] rounded-lg p-5 shadow-lg shadow-black/10">
        <h2 className="text-xs font-medium text-slate-400 mb-3">Topup Account Balance</h2>
        <div className="space-y-2 mb-5">
          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input type="radio" name="coin" className="accent-blue-500 w-4 h-4" defaultChecked /> Bitcoin (BTC)
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input type="radio" name="coin" className="accent-blue-500 w-4 h-4" /> Litecoin (LTC)
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input type="radio" name="coin" className="accent-blue-500 w-4 h-4" /> Ethereum (ERC-20)
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input type="radio" name="coin" className="accent-blue-500 w-4 h-4" /> USDT (TRC-20)
          </label>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-md transition-colors shadow-lg shadow-blue-500/20">
          Create New Topup
        </button>
      </div>

      <div className="bg-[#1e293b] border border-[#2d3748] rounded-lg p-5 shadow-lg shadow-black/10">
        <h2 className="text-lg font-bold text-yellow-500 mb-1">Loyalty Rewards</h2>
        <p className="text-xs text-slate-400 mb-8">Get additional bonus balance automatically depending upon your account deposit history!</p>
        
        <div className="relative pt-6">
           {/* Decorative Avatars based on screenshot */}
           <div className="absolute top-0 w-full flex justify-between px-[12%]">
              <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-500 flex items-center justify-center opacity-0"><User size={16}/></div>
              <div className="w-8 h-8 rounded-full bg-[#1a233a] border border-[#2d3748] flex items-center justify-center overflow-hidden"><User size={16} className="text-slate-400"/></div>
              <div className="w-8 h-8 rounded-full bg-[#1a233a] border border-[#2d3748] flex items-center justify-center overflow-hidden"><User size={16} className="text-slate-400"/></div>
              <div className="w-8 h-8 rounded-full bg-[#1a233a] border border-[#2d3748] flex items-center justify-center overflow-hidden"><User size={16} className="text-slate-400"/></div>
           </div>
           
           <div className="flex flex-col md:flex-row rounded-lg overflow-hidden border border-[#2d3748] mt-2">
            <div className="flex-1 bg-blue-500 p-4 text-center border-r border-[#2d3748]">
              <div className="font-bold text-white text-sm">No Bonus</div>
              <div className="text-[10px] text-blue-100 mt-1">Total deposit &lt; 200$</div>
            </div>
            <div className="flex-1 bg-[#1a233a] p-4 text-center border-r border-[#2d3748]">
              <div className="font-bold text-white text-sm">5% Extra</div>
              <div className="text-[10px] text-slate-400 mt-1">Total deposit &gt;= 200$</div>
            </div>
            <div className="flex-1 bg-[#1a233a] p-4 text-center border-r border-[#2d3748]">
              <div className="font-bold text-white text-sm">10% Extra</div>
              <div className="text-[10px] text-slate-400 mt-1">Total deposit &gt;= 500$</div>
            </div>
            <div className="flex-1 bg-[#1a233a] p-4 text-center">
              <div className="font-bold text-white text-sm">15% Extra</div>
              <div className="text-[10px] text-slate-400 mt-1">Total deposit &gt;= 1000$</div>
            </div>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-400 mt-5">
          You will get <span className="font-bold text-white">0%</span> extra with your next deposit. Amount remaining until next level: <span className="font-bold text-white">$200</span>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-md transition-colors shadow-lg shadow-blue-500/20">
          Have a voucher code?
        </button>
      </div>
    </div>
  );
}

function ReportLostFunds() {
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(true);

  return (
    <div className="space-y-6">
      <PageHeader title="Report Lost Funds" />
      
      <div className="bg-[#1e293b] border border-[#2d3748] rounded-lg p-5 shadow-lg shadow-black/10">
        <div className="space-y-4 mb-6">
          <Toggle checked={toggle1} onChange={setToggle1} label={<>Did you pay more than the minimum amount mentioned on the top-up page <span className="text-red-500">*</span></>} />
          <Toggle checked={toggle2} onChange={setToggle2} label={<>Did you make only one transaction to the payment address? <span className="text-red-500">*</span></>} />
        </div>

        <div className="border border-[#2d3748] rounded-lg p-5 space-y-4">
          <div>
            <label className="block text-xs text-slate-300 mb-1.5 font-medium">Crypto address you made the payment to (Please do not mention your own address, but the address generated by us where you sent the payment) <span className="text-red-500">*</span></label>
            <input type="text" className="w-full bg-[#2d3748] border border-[#3f4b63] rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1.5 font-medium">Transaction/Hash ID <span className="text-red-500">*</span></label>
            <input type="text" className="w-full bg-[#2d3748] border border-[#3f4b63] rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1.5 font-medium">Date <span className="text-red-500">*</span></label>
            <div className="relative">
              <input type="text" className="w-full bg-[#2d3748] border border-[#3f4b63] rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors" />
              <Calendar size={14} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1.5 font-medium">Amount <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-400 text-sm">$</span>
              <input type="text" className="w-full bg-[#2d3748] border border-[#3f4b63] rounded-md pl-7 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors" />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-md transition-colors shadow-lg shadow-blue-500/20">
            Create Lost Funds Report
          </button>
        </div>
      </div>
      
      <p className="text-xs text-slate-400 px-1">You have not created any reports yet.</p>
    </div>
  );
}

function DynamicTopups() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dynamic Topups" />
      <div className="bg-[#1e293b] border border-[#2d3748] rounded-lg overflow-x-auto shadow-lg shadow-black/10">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-xs text-slate-400 bg-[#1a233a] border-b border-[#2d3748]">
            <tr>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Value</th>
              <th className="px-4 py-3 font-medium">Coin</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2d3748]">
            <EmptyTableState colSpan={5} />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrderCCScan() {
  const [boughtElsewhere, setBoughtElsewhere] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader title="Order CC Scan / Real Pic Document" />
      
      <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-5">
        <p className="text-xs text-green-400 leading-relaxed">
          This is a very unique service to order a custom CC Scan or even a real camera-clicked picture of a credit card(Front+Back side). Once your order is done, please let us know whether you need it in a scanned format or a real picture format.<br/>
          Normal service delivery TAT is 24-30 hours. Once order is created, a unique dedicated ticket will be opened were our team will coordinate and deliver the documents.<br/><br/>
          Get your orders approved today!
        </p>
      </div>

      <div className="space-y-5 px-1">
        <div>
          <label className="block text-xs text-slate-300 mb-1.5 font-medium">Order ID (Select Card) <span className="text-red-500">*</span></label>
          <div className="relative">
            <select className="w-full bg-[#2d3748] border border-[#3f4b63] rounded-md px-3 py-2 text-sm text-slate-200 appearance-none focus:outline-none focus:border-blue-500 transition-colors">
              <option>Select option</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">Select Order / Card to automatically fetch the data from. We only show your last 10 cards purchased. If you want to order a CC scan for any other card, enable the below checkbox.</p>
        </div>

        <div>
          <Toggle checked={boughtElsewhere} onChange={setBoughtElsewhere} label="Bought card elsewhere?" />
          <p className="text-[11px] text-slate-400 mt-1.5">Enable this to enter the details.</p>
        </div>

        <div>
          <label className="block text-xs text-slate-300 mb-2 font-medium">Service Type <span className="text-red-500">*</span></label>
          <div className="space-y-2">
             <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input type="radio" name="service" className="accent-blue-500 w-3.5 h-3.5" defaultChecked /> $18 - Normal Service
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input type="radio" name="service" className="accent-blue-500 w-3.5 h-3.5" /> $30 - Fast Service (6-8 Hours)
            </label>
          </div>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-md transition-colors shadow-lg shadow-blue-500/20">
          Create Ticket
        </button>
      </div>
    </div>
  );
}

function Tickets() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Tickets" 
        action={
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-md transition-colors shadow-lg shadow-blue-500/20">
            New ticket
          </button>
        } 
      />
      <div className="bg-[#1e293b] border border-[#2d3748] rounded-lg overflow-x-auto shadow-lg shadow-black/10">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-xs text-slate-400 bg-[#1a233a] border-b border-[#2d3748]">
            <tr>
              <th className="px-4 py-3 font-medium w-8"><input type="checkbox" className="accent-blue-500 bg-[#2d3748] border-[#3f4b63]" /></th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Replies</th>
              <th className="px-4 py-3 font-medium">Created at</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2d3748]">
            <EmptyTableState colSpan={4} />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PurchaseCards() {
  // Reusing the exact logic from the previous iteration
  return (
    <div className="space-y-6">
       <PageHeader title="Purchase Cards" />
       <div className="bg-[#1e293b] border border-[#2d3748] rounded-lg p-5 shadow-lg shadow-black/10 flex items-center justify-center py-20">
          <p className="text-slate-400 text-sm">Purchase Cards component logic imported here.</p>
       </div>
    </div>
  )
}

// ==========================================
// LAYOUT & ROUTING
// ==========================================

const NAVIGATION = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Purchase Cards', path: '/purchase-cards', icon: CreditCard },
  { name: 'Orders', path: '/orders', icon: ShoppingCart },
  { name: 'Topup', path: '/topup', icon: Wallet },
  { name: 'Dynamic Topups', path: '/dynamic-topups', icon: RefreshCw },
  { name: 'Report Lost Funds', path: '/report-lost', icon: AlertTriangle },
  { name: 'Order CC Scan', path: '/cc-scan', icon: FileText },
  { name: 'Tickets', path: '/tickets', icon: Ticket },
];

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#141b2d] text-slate-300 font-sans flex flex-col md:flex-row">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-[#1a233a] border-r border-[#2d3748] transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4 flex items-center justify-between border-b border-[#2d3748] h-[61px]">
          <span className="text-white font-bold text-lg tracking-wide">elonmoney.cc</span>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>
        <nav className="p-3 space-y-1 mt-2">
          {NAVIGATION.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-blue-600/10 text-blue-500' : 'text-slate-400 hover:bg-[#2d3748] hover:text-white'}`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#1a233a] border-b border-[#2d3748] min-h-[61px]">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="p-1 md:hidden hover:bg-[#2d3748] rounded transition-colors text-blue-500">
              <Menu size={20} />
            </button>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <button className="text-[10px] sm:text-xs font-semibold bg-emerald-600/20 text-emerald-400 px-2 sm:px-3 py-1.5 rounded-md hover:bg-emerald-600/30 transition-colors">
              Claim your free card!
            </button>
            <div className="flex items-center bg-[#0f172a] rounded-md px-2 sm:px-3 py-1 border border-[#2d3748]">
              <span className="text-xs sm:text-sm font-medium text-emerald-400 mr-1 sm:mr-2">$ 0.00</span>
              <button className="text-emerald-400 hover:text-emerald-300">
                <Plus size={14} />
              </button>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2d3748] flex items-center justify-center text-xs sm:text-sm font-bold text-white border border-slate-600">
              H
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 w-full max-w-6xl mx-auto">
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
