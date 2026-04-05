import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Menu, Plus, X, Home, CreditCard, ShoppingCart, Wallet } from 'lucide-react';

const NAVIGATION = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Purchase Cards', path: '/purchase-cards', icon: CreditCard },
  { name: 'My Orders', path: '/orders', icon: ShoppingCart },
  { name: 'Add Funds', path: '/topup', icon: Wallet },
];

export function AppLayout() {
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
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setSidebarOpen(false)} 
        aria-hidden="true"
      />

      {/* Sidebar */}
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

      {/* Main Content Area */}
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
          <Outlet />
        </main>
      </div>
    </div>
  );
}
