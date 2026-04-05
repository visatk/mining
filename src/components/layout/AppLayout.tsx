import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Menu, Plus, X, Home, CreditCard, ShoppingCart, Wallet, User, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const NAVIGATION = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Purchase Cards', path: '/purchase-cards', icon: CreditCard },
  { name: 'My Orders', path: '/orders', icon: ShoppingCart },
  { name: 'Add Funds', path: '/topup', icon: Wallet },
];

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : 'unset';
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-300 font-sans flex flex-col md:flex-row">
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-all duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setSidebarOpen(false)} 
        aria-hidden="true"
      />

      <aside className={`fixed md:sticky top-0 left-0 z-50 h-[100dvh] w-[280px] bg-[#0f172a] border-r border-[#1e293b] shadow-2xl md:shadow-none transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex flex-col`}>
        <div className="p-6 flex items-center justify-between border-b border-[#1e293b]">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)] group-hover:scale-105 transition-transform">
              <CreditCard size={18} className="text-white" />
            </div>
            <span className="text-white font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">elonmoney</span>
          </Link>
          <button className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg bg-[#1e293b]/50" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>
        
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
          <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 mt-2">Main Menu</p>
          {NAVIGATION.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-blue-600/20 to-transparent border border-blue-500/30 text-blue-400 shadow-[inset_4px_0_0_rgba(59,130,246,1)]' : 'text-slate-400 hover:bg-[#1e293b] hover:text-slate-200 border border-transparent'}`}
              >
                <Icon size={18} className={`${isActive ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'text-slate-500 group-hover:text-slate-300 transition-colors'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[#1e293b] bg-[#0b1120]/50">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-[#1e293b] transition-colors group border border-transparent hover:border-[#334155]">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              <User size={18} className="text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.username}</p>
              <p className="text-xs text-emerald-400 font-medium truncate">Premium Member</p>
            </div>
            <button onClick={logout} className="p-2 text-slate-500 hover:text-red-400 transition-colors" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-hidden">
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-4 glass-panel rounded-none border-t-0 border-x-0 border-[#1e293b]">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2 md:hidden hover:bg-[#1e293b] rounded-lg transition-colors text-slate-300">
              <Menu size={20} />
            </button>
          </div>
          <div className="flex items-center gap-4 sm:gap-5">
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0f172a]"></span>
            </button>
            <div className="h-6 w-px bg-[#1e293b]"></div>
            <div className="flex items-center bg-[#0b1120] rounded-xl p-1 border border-[#1e293b] shadow-inner">
              <span className="text-sm font-bold text-emerald-400 px-4 font-mono tracking-wide">$ {user?.balance?.toFixed(2) || '0.00'}</span>
              <Link to="/topup" className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 p-2 rounded-lg transition-colors border border-emerald-500/20 active:scale-95">
                <Plus size={16} />
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 w-full mx-auto overflow-y-auto custom-scrollbar relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="relative z-10 max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
