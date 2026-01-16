'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    NuggetChat: any;
  }
}

export default function NuggetChatWidget() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  // 1. Define the ID you will use in your HTML
  const CONTAINER_ID = "nugget-embedded-container"; 
  const NUGGET_DOMAIN = 'squad1-demo'; // Your domain

  // --- Token Handler (Same as before) ---
  const handleGetToken = async () => {
    const currentUserId = 'u_21'; 
    const SESSION_KEY = `nugget_token_${currentUserId}`;
    const cachedToken = sessionStorage.getItem(SESSION_KEY);
    if (cachedToken) return cachedToken;

    try {
      const res = await fetch("/api/get-nugget-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      });
      const data = await res.json();
      if (data.accessToken) {
        sessionStorage.setItem(SESSION_KEY, data.accessToken);
        return data.accessToken;
      }
    } catch (err) {
      console.error("Token fetch failed:", err);
    }
    return null;
  };

  useEffect(() => {
    // --- Load Script (Same as before) ---
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

  // --- Initialize for EMBEDDED MODE ---
  useEffect(() => {
    if (!scriptLoaded) return;

    // We verify the container exists before initializing to be safe
    const container = document.getElementById(CONTAINER_ID);
    if (!container) {
        console.warn(`Nugget container #${CONTAINER_ID} not found!`);
        return; 
    }

    console.log("Initializing Embedded Nugget Chat...");

    window.NuggetChat.init({
      //
      accessTokenHandler: handleGetToken,
      
      // - Switch to Embedded Mode
      containerId: CONTAINER_ID,
      containerTimeout: 5000, // Waits 5s for div to appear if not ready
    });

    // The docs say "You now have to manually open...". 
    // We force open it to ensure it renders inside the box immediately.
    window.NuggetChat.open();

  }, [scriptLoaded]);

  return null;
}