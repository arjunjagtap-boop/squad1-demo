'use client';
import { useState, useEffect } from 'react';
import Script from 'next/script';

// 1. Define the shape of our Status object
interface OrderStatus {
  step: string;
  message: string;
  accountability: string;
  color: 'red' | 'yellow' | 'blue';
}

// 2. Extend the Window interface to allow Nugget globals
declare global {
  interface Window {
    nuggetSettings?: {
      apiKey: string;
      botId: string;
    };
    nugget?: {
      open: () => void;
      show?: () => void;
      toggle?: () => void;
    };
  }
}

export default function Home() {
  // Types are inferred here, but we can be explicit for clarity
  const [orderId, setOrderId] = useState<string>('');
  const [status, setStatus] = useState<OrderStatus | null>(null);

  // 3. THIS IS WHERE YOU INTEGRATE NUGGET
  useEffect(() => {
    // Define the Nugget configuration
    window.nuggetSettings = {
      apiKey: "YOUR_HACKATHON_API_KEY", // Replace later
      botId: "squad1_bot"
    };
    
    console.log("Nugget Integration Configured");
  }, []);

  // 4. Mock Logic for the "Track Order" Widget
  const checkStatus = () => {
    if (orderId === '123') {
      setStatus({
        step: 'Authentication',
        message: 'Your item is currently being authenticated by Squad1 experts.',
        accountability: 'Responsible: Squad1 Team',
        color: 'blue'
      });
    } else if (orderId === '456') {
      setStatus({
        step: 'Pickup Pending',
        message: 'Waiting for seller to handover the item. We have nudged them.',
        accountability: 'Responsible: Seller',
        color: 'yellow'
      });
    } else {
      setStatus({
        step: 'Not Found',
        message: 'Order not found. Please check your ID.',
        accountability: '',
        color: 'red'
      });
    }
  };

  // 5. Trigger the Bot Manually
  const openSupportBot = () => {
    if (window.nugget) {
      window.nugget.open(); 
    } else {
      alert("Nugget Bot would open here! (Script not yet loaded)");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* 6. LOAD THE NUGGET SCRIPT HERE */}
      <Script 
        src="https://cdn.nugget.ai/sdk.js" 
        strategy="lazyOnload"
        onLoad={() => console.log("Nugget Script Loaded Successfully")}
      />

      {/* --- HEADER --- */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tight text-black">
            SQUAD<span className="text-blue-600">1</span>
          </div>
          <nav className="space-x-6 text-sm font-medium">
            <a href="#" className="hover:text-blue-600">Home</a>
            <a href="#track" className="hover:text-blue-600">Track Order</a>
            <button 
              onClick={openSupportBot}
              className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition"
            >
              Support
            </button>
          </nav>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="bg-white py-20 border-b">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight text-gray-900">
            Trust in every transaction.
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Squad1 authenticates luxury products before they reach your door.
            We ensure transparency, speed, and absolute certainty.
          </p>
          <a href="#track" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
            Track Your Order
          </a>
        </div>
      </section>

      {/* --- TRACKING WIDGET --- */}
      <section id="track" className="py-20 bg-gray-50">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Where is my order?</h2>
          <p className="text-gray-500 mb-6 text-sm">Enter your Order ID to see real-time responsibility status.</p>
          
          <div className="flex gap-2 mb-6">
            <input 
              type="text" 
              placeholder="Enter Order ID (Try: 123 or 456)" 
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
            <button 
              onClick={checkStatus}
              className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800"
            >
              Check
            </button>
          </div>

          {/* Dynamic Status Display */}
          {status && (
            <div className={`p-4 rounded-lg border ${
              status.color === 'red' ? 'bg-red-50 border-red-200' : 
              status.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
              'bg-blue-50 border-blue-200'
            }`}>
              <div className="font-bold text-lg mb-1">{status.step}</div>
              <div className="text-gray-700 mb-2">{status.message}</div>
              {status.accountability && (
                <div className="text-xs font-semibold uppercase tracking-wider text-blue-800 bg-blue-100 inline-block px-2 py-1 rounded">
                  {status.accountability}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* --- FLOATING CHAT BUTTON --- */}
      <div className="fixed bottom-6 right-6 z-50">
        <div 
          onClick={openSupportBot}
          className="bg-blue-600 text-white p-4 rounded-full shadow-xl cursor-pointer hover:bg-blue-700 transition flex items-center gap-2"
        >
          <span className="text-2xl">💬</span>
          <span className="font-bold hidden md:block">Chat with Squad1</span>
        </div>
      </div>

    </main>
  );
}