import { NextResponse } from 'next/server';
import { db } from '@/app/data/mockDB'; 

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // 1. Try to find the user in our mock DB
    const user = db.users.find(u => u.id === userId);

    // 2. Prepare Payload
    // If user exists, use their info. If not (Guest), use generic info.
    const payload = {
      uid: "gugy", 
      clientId: parseInt(process.env.NUGGET_CLIENT_ID || '0'), 
      platform: "desktop",
      // Guest Logic:
      displayName: "Guest",
    };

    console.log("--------------------------------");
    console.log("OUTGOING BODY TO NUGGET:", JSON.stringify(payload, null, 2)); 
    console.log("--------------------------------");
    console.log("NUGGET CLIENT ID:", process.env.NUGGET_CLIENT_ID || '');
    console.log("NUGGET API KEY:", process.env.NUGGET_BASIC_AUTH_TOKEN || '');

    // 3. Call Nugget
    const response = await fetch("https://api.nugget.com/unified-support/auth/users/getAccessToken", {
      method: 'POST',
      headers: {
        'Authorization': `${process.env.NUGGET_BASIC_AUTH_TOKEN || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Status:', response.status);
    console.log('Headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Nugget API Error:", errorText);
      return NextResponse.json({ error: 'Failed to authenticate' }, { status: response.status });
    }

    const data = await response.json();
    console.log("--------------------------------");
    console.log("INCOMING BODY FROM NUGGET:", JSON.stringify(data, null, 2)); 
    console.log("--------------------------------");
    
    if (data.success && data.accessToken) {
        return NextResponse.json({ accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBWZXJzaW9uIjoiIiwiYnVzaW5lc3NJZCI6NTIsImNsaWVudElkIjo5LCJjbGllbnRfbmFtZSI6InNlY3VyaXR5X2V4dGVybmFsIiwiZGlzcGxheU5hbWUiOiJHdWVzdCIsImVtYWlsIjoiIiwiZXhwIjoxNzY4NjQ2NjM5LCJob3N0TmFtZSI6InNlY3VyaXR5Lm51Z2dldC5jb20iLCJpYXQiOjE3Njg1NjAyMzksImxhbmd1YWdlIjoiIiwicGhvbmVOdW1iZXIiOiIiLCJwaG90b1VSTCI6IiIsInNvdXJjZSI6IndlYiIsInRlbmFudElEIjo2LCJ1aWQiOiJyIn0.N3Md4h2cHayDpuPnusOGQ9AdkJ7KviWARY56fd9cVPw" });
    } else {
        return NextResponse.json({ error: 'No access token in response' }, { status: 500 });
    }

  } catch (error) {
    console.error("Token Generation Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}