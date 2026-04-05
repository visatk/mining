import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { PurchaseCards } from './pages/PurchaseCards';
import { Orders } from './pages/Orders';
import { Topup } from './pages/Topup';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/purchase-cards" element={<PurchaseCards />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/topup" element={<Topup />} />
      </Route>
    </Routes>
  );
}
