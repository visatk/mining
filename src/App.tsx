import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// --- Layouts & Authentication ---
import DashboardLayout from './components/DashboardLayout';
import AuthPage from './pages/Auth';

// --- User Dashboard Pages ---
import DashboardHome from './pages/DashboardHome';
import PurchaseCards from './pages/PurchaseCards';
import Topup from './pages/Topup';
import CardChecker from './pages/CardChecker';
import CardKiller from './pages/CardKiller';
import ReportLostFunds from './pages/ReportLostFunds';
import Tickets from './pages/Tickets';
import CreateTicket from './pages/CreateTicket';
import OrderCCScan from './pages/OrderCCScan';
import DynamicTopups from './pages/DynamicTopups';

// --- Admin Pages ---
import AdminPanel from './pages/AdminPanel';

// --- Global Types ---
export type UserData = {
	id: string;
	username: string;
	balance: number;
	role: 'user' | 'admin' | 'super_admin';
	createdAt: string;
	totalDeposited?: number;
};

export default function App() {
	const [user, setUser] = useState<UserData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		checkSession();
	}, []);

	// Verify session token via HTTP-only cookie automatically
	const checkSession = async () => {
		try {
			const res = await fetch('/api/user/me');
			if (res.ok) {
				const { user: fetchedUser } = await res.json();
				setUser(fetchedUser);
			}
		} catch (err) {
			console.error('Session check failed', err);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
				<Loader2 className="animate-spin text-blue-500 w-10 h-10" />
			</div>
		);
	}

	return (
		<Routes>
			{/* Public Authentication Route */}
			<Route 
				path="/login" 
				element={user ? <Navigate to="/" replace /> : <AuthPage onAuthSuccess={(userData) => setUser(userData)} />} 
			/>

			{/* ========================================== */}
			{/* Protected Dashboard Routes                 */}
			{/* ========================================== */}
			<Route 
				path="/" 
				element={user ? <DashboardLayout user={user} onLogout={() => setUser(null)} /> : <Navigate to="/login" replace />}
			>
				{/* Main Landing */}
				<Route index element={<DashboardHome />} />
				
				{/* Primary Features */}
				<Route path="purchase-cards" element={<PurchaseCards />} />
				<Route path="order-cc-scan" element={<OrderCCScan />} />
				<Route path="card-checker" element={<CardChecker />} />
				<Route path="card-killer" element={<CardKiller />} />
				<Route path="report-lost-funds" element={<ReportLostFunds />} />
				<Route path="topup" element={<Topup />} />
				<Route path="dynamic-topups" element={<DynamicTopups />} />
				
				{/* Nested Ticket Routes */}
				<Route path="tickets">
					<Route index element={<Tickets />} />
					<Route path="create" element={<CreateTicket />} />
				</Route>

				{/* Admin Panel (Protected internally by component & backend) */}
				<Route path="admin" element={<AdminPanel />} />

				{/* Sidebar Placeholders */}
				<Route path="your-cards" element={<div className="text-white p-6">Your Cards Directory Coming Soon</div>} />
			</Route>

			{/* Catch-all route redirects back to home */}
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}
