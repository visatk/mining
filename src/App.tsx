import React, { useState } from 'react';
import { Menu, Plus, ChevronDown, X } from 'lucide-react';

// --- Types ---
interface CardData {
  id: string;
  expiration: string;
  company: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  bank: string;
  price: number;
}

// --- Mock Data ---
const MOCK_CARDS: CardData[] = [
  { id: '1', expiration: '06/27', company: 'AMEX CREDIT', city: 'Solana Beach', state: 'CA', zip: '92075', country: 'US', bank: 'AMERICAN EXPRESS US', price: 8.0 },
  { id: '2', expiration: '09/31', company: 'MasterCard DEBIT STANDARD', city: 'León', state: 'León', zip: '37207', country: 'MX', bank: 'JSCB ROSSIYSKY CAPITAL', price: 8.0 },
  { id: '3', expiration: '02/29', company: 'Visa DEBIT PREPAID', city: 'Fruitland', state: 'WA', zip: '99129', country: 'US', bank: '', price: 8.0 },
  { id: '4', expiration: '11/28', company: 'Visa DEBIT CLASSIC', city: 'Mukilteo', state: 'WA', zip: '98275', country: 'US', bank: 'CITIBANK N.A.', price: 8.0 },
  { id: '5', expiration: '01/30', company: 'MasterCard DEBIT STANDARD', city: 'Towson', state: 'MD', zip: '21286', country: 'US', bank: 'CU COOPERATIVE SYSTEMS', price: 8.0 },
  { id: '6', expiration: '10/28', company: 'Visa DEBIT CLASSIC', city: 'Monterey Park', state: 'CA', zip: '91754', country: 'US', bank: 'CITIBANK N.A.', price: 8.0 },
  { id: '7', expiration: '06/27', company: 'MasterCard CREDIT', city: 'Virginia', state: 'Chester', zip: '23831', country: 'US', bank: 'EUROPAY NORGE, A.S.', price: 8.0 },
];

export default function App() {
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ssnDobToggle, setSsnDobToggle] = useState(false);

  const handleBuyClick = (card: CardData) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const confirmPurchase = () => {
    // Implement purchase logic here
    console.log('Purchased:', selectedCard);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#141b2d] text-slate-300 font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#1a233a] border-b border-[#2d3748]">
        <div className="flex items-center gap-4">
          <button className="p-1 hover:bg-[#2d3748] rounded transition-colors text-blue-500">
            <Menu size={20} />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-xs font-semibold bg-emerald-600/20 text-emerald-400 px-3 py-1.5 rounded-md hover:bg-emerald-600/30 transition-colors">
            Claim your free card!
          </button>
          <div className="flex items-center bg-[#0f172a] rounded-md px-3 py-1 border border-[#2d3748]">
            <span className="text-sm font-medium text-emerald-400 mr-2">$ 0.00</span>
            <button className="text-emerald-400 hover:text-emerald-300">
              <Plus size={16} />
            </button>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#2d3748] flex items-center justify-center text-sm font-bold text-white border border-slate-600">
            J
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <h1 className="text-xl font-bold text-white mb-6">Purchase Cards</h1>

        {/* Filter Panel */}
        <div className="bg-[#1e293b] border border-[#2d3748] rounded-lg p-5 mb-6 space-y-4 shadow-lg shadow-black/20">
          <div className="grid grid-cols-1 gap-4">
            {/* BINs */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">BINs</label>
              <input 
                type="text" 
                placeholder="Comma Separated" 
                className="w-full bg-[#2d3748] border border-[#3f4b63] rounded-md px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Base */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Base <span className="text-red-500">*</span></label>
              <div className="relative">
                <select className="w-full bg-[#2d3748] border border-[#3f4b63] rounded-md px-3 py-2 text-sm text-slate-200 appearance-none focus:outline-none focus:border-blue-500 transition-colors">
                  <option>All</option>
                  <option>Database A</option>
                  <option>Database B</option>
                </select>
                <div className="absolute right-3 top-2.5 flex items-center gap-1 text-slate-400 pointer-events-none">
                  <X size={14} className="hover:text-white cursor-pointer pointer-events-auto" />
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>

            {/* EXP */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">EXP</label>
              <input 
                type="text" 
                placeholder="MM/YYYY" 
                className="w-full bg-[#2d3748] border border-[#3f4b63] rounded-md px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* City & State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">City</label>
                <input 
                  type="text" 
                  className="w-full bg-[#2d3748] border border-[#3f4b63] rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">State</label>
                <input 
                  type="text" 
                  className="w-full bg-[#2d3748] border border-[#3f4b63] rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* ZIP Code */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">ZIP Code</label>
              <input 
                type="text" 
                className="w-full bg-[#2d3748] border border-[#3f4b63] rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Country <span className="text-red-500">*</span></label>
              <div className="relative">
                <select className="w-full bg-[#2d3748] border border-[#3f4b63] rounded-md px-3 py-2 text-sm text-slate-200 appearance-none focus:outline-none focus:border-blue-500 transition-colors">
                  <option>All</option>
                  <option>US</option>
                  <option>GB</option>
                </select>
                <div className="absolute right-3 top-2.5 flex items-center gap-1 text-slate-400 pointer-events-none">
                  <X size={14} className="hover:text-white cursor-pointer pointer-events-auto" />
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>

            {/* Company & SSN Toggle */}
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1">
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Company <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select className="w-full bg-[#2d3748] border border-[#3f4b63] rounded-md px-3 py-2 text-sm text-slate-200 appearance-none focus:outline-none focus:border-blue-500 transition-colors">
                    <option>All</option>
                    <option>Visa</option>
                    <option>MasterCard</option>
                  </select>
                  <div className="absolute right-3 top-2.5 text-slate-400 pointer-events-none">
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center h-[38px] px-2">
                <button 
                  type="button"
                  onClick={() => setSsnDobToggle(!ssnDobToggle)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${ssnDobToggle ? 'bg-blue-600' : 'bg-slate-600'}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${ssnDobToggle ? 'translate-x-4' : 'translate-x-1'}`} />
                </button>
                <span className="ml-3 text-xs font-medium text-slate-300">SSN + DOB</span>
              </div>
            </div>

            {/* Search Button */}
            <div className="pt-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-md transition-colors shadow-lg shadow-blue-500/20">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-[#1e293b] border border-[#2d3748] rounded-lg overflow-x-auto shadow-lg shadow-black/20">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-xs text-slate-400 bg-[#1a233a] border-b border-[#2d3748]">
              <tr>
                <th className="px-4 py-3 font-medium">Expiration</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">State</th>
                <th className="px-4 py-3 font-medium">ZIP</th>
                <th className="px-4 py-3 font-medium">Country</th>
                <th className="px-4 py-3 font-medium">Bank</th>
                <th className="px-4 py-3 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d3748]">
              {MOCK_CARDS.map((card) => (
                <tr key={card.id} className="hover:bg-[#2d3748]/50 transition-colors">
                  <td className="px-4 py-4 text-slate-300">{card.expiration}</td>
                  <td className="px-4 py-4">
                    <div className="max-w-[150px] whitespace-normal leading-tight text-slate-200">
                      {card.company}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-300">{card.city}</td>
                  <td className="px-4 py-4 text-slate-300">{card.state}</td>
                  <td className="px-4 py-4 text-slate-300">{card.zip}</td>
                  <td className="px-4 py-4 text-slate-300">{card.country}</td>
                  <td className="px-4 py-4">
                    <div className="max-w-[150px] whitespace-normal leading-tight text-slate-400 text-xs uppercase">
                      {card.bank || '-'}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button 
                      onClick={() => handleBuyClick(card)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-1.5 rounded shadow-sm transition-colors"
                    >
                      Buy ${card.price.toFixed(2)}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Purchase Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-[#1e293b] border border-[#2d3748] rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d3748]">
              <h3 className="text-lg font-semibold text-white">Purchase Card</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="px-6 py-8 text-center">
              <p className="text-slate-300">Are you sure you want to buy this card?</p>
              {selectedCard && (
                 <p className="text-sm text-slate-500 mt-2">
                   {selectedCard.company} ending in {selectedCard.expiration}
                 </p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#2d3748] flex items-center justify-center gap-4 bg-[#1a233a]">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2 px-4 rounded-md border border-[#3f4b63] text-slate-300 hover:bg-[#2d3748] hover:text-white transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={confirmPurchase}
                className="flex-1 py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors font-medium text-sm shadow-lg shadow-blue-500/20"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
