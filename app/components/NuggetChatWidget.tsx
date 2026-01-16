'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    NuggetChat: any;
  }
}

export default function NuggetChatWidget() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  // CONFIGURATION
  const CONTAINER_ID = "nugget-embedded-container"; 
  const NUGGET_DOMAIN = 'security'; // Your domain prefix

  // --- HELPER: GENERATE GUEST ID ---
  // We need a consistent ID for this session so the chat history sticks 
  // even if they refresh the page.
  const getGuestId = () => {
    const STORAGE_KEY = 'nugget_guest_uid';
    let id = sessionStorage.getItem(STORAGE_KEY);
    
    if (!id) {
      // Generate a random string (mock UUID)
      id = `guest_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
      sessionStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  };

  // --- TOKEN HANDLER (The "Guest" Logic) ---
  const handleGetToken = async () => {
    // 1. Mandatory: Check Cache First
    const TOKEN_KEY = "nuggetAccessToken";
    let token = sessionStorage.getItem(TOKEN_KEY);
    
    if (token) {
        // console.log("Using cached Guest token");
        return token;
    }

    // 2. If no token, fetch from backend using our Guest ID
    try {
      const guestId = getGuestId();
      
      const res = await fetch("/api/get-nugget-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: guestId }),
      });
      
      const data = await res.json();
      
      if (data.accessToken) {
        // 3. Mandatory: Cache the new token
        sessionStorage.setItem(TOKEN_KEY, data.accessToken);
        return data.accessToken;
      }
    } catch (err) {
      console.error("Guest Token fetch failed:", err);
    }
    return null;
  };

  useEffect(() => {
    // --- LOAD SCRIPT ---
    (function(w: any, d: any, s: any, a: any) {
      w[a] = w[a] || {
        q: [],
        init: function (config: any) {
          w[a].q.push({ type: "init", config: config });
          if (w[a].loaded) w[a]._processQueue();
        },
        toggle: function () { w[a].q.push({ type: "toggle" }); },
        open: function () { w[a].q.push({ type: "open" }); },
        close: function () { w[a].q.push({ type: "close" }); },
        _processQueue: function () { },  
      };
      
      if (d.getElementById('nugget-script')) {
        setScriptLoaded(true);
        return;
      }

      var n = d.createElement(s);
      var c = d.getElementsByTagName(s)[0];
      n.id = 'nugget-script';
      n.async = 1;
      n.src = `https://${NUGGET_DOMAIN}.nugget.com/user/chat-embed.js`;
      n.onload = function () {
        w[a].loaded = true;
        setScriptLoaded(true);
      };
      c.parentNode.insertBefore(n, c);
    })(window, document, 'script', 'NuggetChat');
  }, []);

  useEffect(() => {
    if (!scriptLoaded) return;

    // Safety check for embedded container
    if (!document.getElementById(CONTAINER_ID)) return;

    console.log("Initializing Guest Chat...");

    window.NuggetChat.init({
      accessTokenHandler: handleGetToken,
      
      // Embedded Config
      containerId: CONTAINER_ID,
      containerTimeout: 5000,
      
      // UI Properties
      initiallyVisible: true,
      initiallyExpanded: true,
    });

    window.NuggetChat.open();

  }, [scriptLoaded]);

  return null;
}