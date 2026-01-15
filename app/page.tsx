'use client';
import { useState, useRef, useEffect } from 'react';

// --- TYPES ---
interface OrderStatus {
  step: string;
  message: string;
  accountability: string;
  color: 'red' | 'yellow' | 'blue';
}

interface ChatMessage {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  quickActions?: string[]; 
}

// --- MOCK API FOR NUGGET ---
const sendToNuggetAPI = async (message: string): Promise<ChatMessage> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const lowerMsg = message.toLowerCase();

  // 1. Core Logic from Case Study
  if (lowerMsg.includes('123')) {
    return {
      id: Date.now(),
      sender: 'bot',
      text: "Your order (ID: 123) is currently being authenticated at Squad1. We are nudging our shipping partner to dispatch it within 24 hours. [Responsibility: Squad1 Coordination]"
    };
  }

  if (lowerMsg.includes('456')) {
    return {
      id: Date.now(),
      sender: 'bot',
      text: "Your seller is preparing the product. We've reminded them to initiate pickup by today. Squad1 is monitoring this closely. [Responsibility: Seller]"
    };
  }

  // Triage Logic [cite: 126]
  if (lowerMsg.includes('talk') || lowerMsg.includes('human') || lowerMsg.includes('issue')) {
    return {
      id: Date.now(),
      sender: 'bot',
      text: "I can help faster if I understand the issue. Is this about:",
      quickActions: ["Pickup Delay", "Shipping Delay", "Address Concern"]
    };
  }

  // Default Helper
  return {
    id: Date.now(),
    sender: 'bot',
    text: "I can check your order status immediately. Please enter your Order ID (e.g., 123 or 456)."
  };
};

export default function Home() {
  // --- STATE ---
  const [orderId, setOrderId] = useState<string>('');
  const [status, setStatus] = useState<OrderStatus | null>(null);
  
  // Chat State - Default is TRUE now
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: 1, 
      sender: 'bot', 
      text: "Hi! I'm the Squad1 Assistant. I can track your luxury order or connect you with support instantly.",
      // Removed generic 'Where is my order' button to force natural conversation or ID entry
      quickActions: ["Check Order 123", "Check Order 456", "Talk to someone"] 
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages, isChatOpen]);

  // --- HANDLERS ---
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = { id: Date.now(), sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputMsg('');
    setIsTyping(true);

    try {
      const botResponse = await sendToNuggetAPI(text);
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("API Error", error);
    } finally {
      setIsTyping(false);
    }
  };

  // Tracking Widget Logic (Kept as secondary validation tool)
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
        message: 'Order not found.',
        accountability: '',
        color: 'red'
      });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-800 relative">
      
      {/* --- HEADER --- */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tight text-black">
            SQUAD<span className="text-blue-600">1</span>
          </div>
          <nav className="space-x-6 text-sm font-medium">
            <a href="#" className="hover:text-blue-600">Home</a>
            {/* Removed redundant "Support" button since chat is always open */}
          </nav>
        </div>
      </header>

      <div className="flex flex-col md:flex-row max-w-6xl mx-auto py-10 gap-8 px-6">
        
        {/* --- LEFT SIDE: CONTENT & TRACKER (Secondary) --- */}
        <div className="flex-1 space-y-12">
          <section>
            <h1 className="text-5xl font-extrabold mb-6 tracking-tight text-gray-900">
              Trust in every transaction.
            </h1>
            <p className="text-xl text-gray-600">
              Squad1 authenticates luxury products before they reach your door.
              We ensure transparency, speed, and absolute certainty.
            </p>
          </section>

          {/* Mini Tracker */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4">Quick Tracker</h2>
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                placeholder="Order ID" 
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
              <button onClick={checkStatus} className="bg-black text-white px-4 py-2 rounded-lg">Check</button>
            </div>
            {status && (
              <div className={`p-3 rounded-lg border text-sm ${
                status.color === 'blue' ? 'bg-blue-50 border-blue-200' : 
                status.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="font-bold">{status.step}</div>
                <div className="text-gray-600">{status.accountability}</div>
              </div>
            )}
          </section>
        </div>

        {/* --- RIGHT SIDE: THE CHAT INTERFACE (Primary) --- */}
        <div className="flex-1 h-[600px] relative">
          {/* Chat Container */}
          <div className="w-full h-full bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
            
            {/* Chat Header */}
            <div className="bg-black text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Squad1 Concierge</h3>
                <p className="text-xs text-gray-300">Live Support & Tracking</p>
              </div>
              <div className="flex gap-2">
                 <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 text-sm shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {/* Quick Actions */}
              {messages.length > 0 && messages[messages.length - 1].sender === 'bot' && messages[messages.length - 1].quickActions && (
                 <div className="flex flex-wrap gap-2 mt-2">
                   {messages[messages.length - 1].quickActions?.map((action, idx) => (
                     <button 
                       key={idx}
                       onClick={() => handleSendMessage(action)}
                       className="bg-white text-blue-700 text-xs font-bold px-4 py-2 rounded-full border border-blue-200 shadow-sm hover:bg-blue-50 transition"
                     >
                       {action}
                     </button>
                   ))}
                 </div>
              )}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-500 rounded-2xl p-3 text-xs animate-pulse">
                    Squad1 is typing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputMsg)}
                  placeholder="Type your Order ID or question..."
                  className="flex-1 border border-gray-300 rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={() => handleSendMessage(inputMsg)}
                  disabled={!inputMsg.trim()}
                  className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 shadow-md"
                >
                  ➤
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}