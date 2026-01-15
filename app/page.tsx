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
  quickActions?: string[]; // For buttons like "Where is my order?"
}

// --- MOCK API FOR NUGGET (Replace with real fetch later) ---
const sendToNuggetAPI = async (message: string): Promise<ChatMessage> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 1. HARDCODED RESPONSES BASED ON CASE STUDY LOGIC 
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('where') || lowerMsg.includes('order') || lowerMsg.includes('status')) {
    return {
      id: Date.now(),
      sender: 'bot',
      text: "I can help with that. Please enter your Order ID so I can check the specific status."
    };
  }
  
  // Simulating a specific Order ID lookup via Chat
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

  if (lowerMsg.includes('talk') || lowerMsg.includes('human') || lowerMsg.includes('agent')) {
    return {
      id: Date.now(),
      sender: 'bot',
      text: "I can help faster if I understand the issue. Is this about:",
      quickActions: ["Pickup Delay", "Shipping Delay", "Address Concern"]
    };
  }

  // Fallback
  return {
    id: Date.now(),
    sender: 'bot',
    text: "I didn't quite catch that. You can ask me 'Where is my order?' or request to 'Talk to someone'."
  };
};

export default function Home() {
  // --- STATE ---
  const [orderId, setOrderId] = useState<string>('');
  const [status, setStatus] = useState<OrderStatus | null>(null);
  
  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, sender: 'bot', text: "Hi! I'm the Squad1 Assistant. How can I help you today?", quickActions: ["Where is my order?", "Talk to someone"] }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Auto-scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages, isChatOpen]);

  // --- HANDLERS ---

  // 1. Send Message Logic
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add User Message
    const userMsg: ChatMessage = { id: Date.now(), sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputMsg('');
    setIsTyping(true);

    try {
      // 2. CALL THE API (Currently Mocked)
      const botResponse = await sendToNuggetAPI(text);
      
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("API Error", error);
    } finally {
      setIsTyping(false);
    }
  };

  // 3. Track Order Widget Logic
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
            <a href="#track" className="hover:text-blue-600">Track Order</a>
            <button 
              onClick={() => setIsChatOpen(true)}
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

      {/* --- CUSTOM CHAT INTERFACE --- */}
      
      {/* 1. Floating Button (Visible when chat is closed) */}
      {!isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button 
            onClick={() => setIsChatOpen(true)}
            className="bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition flex items-center gap-2"
          >
            <span className="text-2xl">💬</span>
            <span className="font-bold hidden md:block">Chat with Squad1</span>
          </button>
        </div>
      )}

      {/* 2. Chat Window (Visible when open) */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[500px]">
          
          {/* Header */}
          <div className="bg-black text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold">Squad1 Support</h3>
              <p className="text-xs text-gray-300">Typically replies instantly</p>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-gray-300 hover:text-white">
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Quick Actions (Buttons) */}
            {messages.length > 0 && messages[messages.length - 1].sender === 'bot' && messages[messages.length - 1].quickActions && (
               <div className="flex flex-wrap gap-2 mt-2">
                 {messages[messages.length - 1].quickActions?.map((action, idx) => (
                   <button 
                     key={idx}
                     onClick={() => handleSendMessage(action)}
                     className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-2 rounded-full border border-blue-200 hover:bg-blue-100 transition"
                   >
                     {action}
                   </button>
                 ))}
               </div>
            )}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-500 rounded-2xl p-3 text-xs animate-pulse">
                  Typing...
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
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={() => handleSendMessage(inputMsg)}
                disabled={!inputMsg.trim()}
                className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}