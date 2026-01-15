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
  await new Promise((resolve) => setTimeout(resolve, 800)); // Faster response for better demo feel

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

  // Triage Logic 
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
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: 1, 
      sender: 'bot', 
      text: "Hi! I'm the Squad1 Assistant. I can track your luxury order or connect you with support instantly.",
      quickActions: ["Check Order 123", "Check Order 456", "Talk to someone"] 
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

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

  const checkStatus = () => {
    if (orderId === '123') {
      setStatus({
        step: 'Authentication',
        message: 'Your item is being authenticated.',
        accountability: 'Resp: Squad1 Team',
        color: 'blue'
      });
    } else if (orderId === '456') {
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

        {/* --- RIGHT SIDE: GIANT CHAT INTERFACE (70% Width) --- */}
        <div className="flex-1 w-full md:w-[70%] h-full">
          <div className="w-full h-[750px] md:h-full bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
            
            {/* Chat Header */}
            <div className="bg-black text-white p-6 flex justify-between items-center shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-lg">S1</div>
                <div>
                  <h3 className="font-bold text-lg">Squad1 Concierge</h3>
                  <p className="text-xs text-gray-400">Powered by Nugget.ai</p>
                </div>
              </div>
              <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">Online</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {/* Avatar for Bot */}
                  {msg.sender === 'bot' && (
                     <div className="w-8 h-8 bg-black rounded-full flex-shrink-0 mr-3 flex items-center justify-center text-white text-xs font-bold">S1</div>
                  )}
                  
                  <div className={`max-w-[75%] rounded-2xl p-5 text-base shadow-sm leading-relaxed ${
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
                 <div className="pl-11 flex flex-wrap gap-2">
                   {messages[messages.length - 1].quickActions?.map((action, idx) => (
                     <button 
                       key={idx}
                       onClick={() => handleSendMessage(action)}
                       className="bg-white text-blue-700 text-sm font-semibold px-5 py-2.5 rounded-full border border-blue-200 shadow-sm hover:bg-blue-50 transition hover:border-blue-300 transform hover:-translate-y-0.5"
                     >
                       {action}
                     </button>
                   ))}
                 </div>
              )}

              {isTyping && (
                <div className="flex justify-start items-center pl-11">
                  <div className="bg-gray-200 text-gray-500 rounded-full px-4 py-2 text-xs animate-pulse">
                    Typing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-gray-100">
              <div className="flex gap-4 items-center">
                <input 
                  type="text" 
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputMsg)}
                  placeholder="Type your message here..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <button 
                  onClick={() => handleSendMessage(inputMsg)}
                  disabled={!inputMsg.trim()}
                  className="bg-black text-white w-14 h-14 rounded-xl flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 shadow-lg transition transform hover:scale-105"
                >
                  <span className="text-xl">➤</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}