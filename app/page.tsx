'use client';

import { useState } from 'react';
import NuggetChatWidget from './components/NuggetChatWidget';

// --- TYPES (For the Left-Side Tracker) ---
interface OrderStatus {
  step: string;
  message: string;
  accountability: string;
  color: 'red' | 'yellow' | 'blue';
}

export default function Home() {
  // --- TRACKER STATE ---
  const [orderId, setOrderId] = useState<string>('');
  const [status, setStatus] = useState<OrderStatus | null>(null);

  // --- TRACKER LOGIC (Local Debug Tool) ---
  const checkStatus = () => {
    // You can update this to fetch from your new /api/orders endpoint if you want real data!
    if (orderId.includes('123')) {
      setStatus({
        step: 'Authentication',
        message: 'Your item is being authenticated.',
        accountability: 'Resp: Squad1 Team',
        color: 'blue'
      });
    } else if (orderId.includes('456')) {
      setStatus({
        step: 'Pickup Pending',
        message: 'Waiting for seller handover.',
        accountability: 'Resp: Seller',
        color: 'yellow'
      });
    } else {
      setStatus({
        step: 'Not Found',
        message: 'Order not found.',
        accountability: '',
        color: 'red'
      });
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 font-sans text-gray-800">
      
      {/* --- HEADER --- */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tight text-black">
            SQUAD<span className="text-blue-600">1</span>
          </div>
          <div className="text-xs font-medium text-gray-400 uppercase tracking-widest">
            Automated Support Demo
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto py-8 gap-6 px-6 h-[calc(100vh-80px)]">
        
        {/* --- LEFT SIDE: COMPACT TRACKER (30% Width) --- */}
        <div className="w-full md:w-[30%] flex flex-col gap-6">
          <section>
            <h1 className="text-3xl font-extrabold mb-3 tracking-tight text-gray-900 leading-tight">
              Trust in every transaction.
            </h1>
            <p className="text-sm text-gray-600">
              Squad1 authenticates luxury products. We ensure transparency and speed.
            </p>
          </section>

          {/* Mini Tracker UI */}
          <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-sm font-bold mb-3 text-gray-500 uppercase tracking-wider">Manual Tracker</h2>
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                placeholder="Order ID" 
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
              <button onClick={checkStatus} className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">Go</button>
            </div>
            
            {status && (
              <div className={`p-3 rounded-lg border text-xs ${
                status.color === 'blue' ? 'bg-blue-50 border-blue-200' : 
                status.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="font-bold mb-1 text-sm">{status.step}</div>
                <div className="text-gray-600 mb-2 leading-relaxed">{status.message}</div>
                <div className="inline-block bg-white border border-gray-200 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide">
                  {status.accountability}
                </div>
              </div>
            )}
          </section>

           <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-xs text-blue-800">
              <strong>Tip:</strong> Try asking the bot about Order <strong>123</strong> (Authentication) or <strong>456</strong> (Seller Delay).
           </div>
        </div>

        {/* --- RIGHT SIDE: NUGGET EMBEDDED CHAT (70% Width) --- */}
        <div className="flex-1 w-full md:w-[70%] h-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden relative">
            
            {/* This container ID matches the one in `NuggetChatWidget.tsx` 
                The chat will auto-expand to fill this parent div.
            */}
            <div 
                id="nugget-embedded-container" 
                className="w-full h-full"
            ></div>

            {/* This component handles the script loading and injection */}
            <NuggetChatWidget />
            
        </div>

      </div>
    </main>
  );
}