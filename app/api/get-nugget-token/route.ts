import { NextResponse } from 'next/server';
import { db } from '@/app/data/mockDB'; // Import your mock DB to get real user details

export async function POST(request: Request) {
  try {
    // 1. Get the User ID from the frontend request
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // 2. Fetch User Details from your Mock DB (Context Populating)
    // This ensures the bot knows the user's Name, Email and Phone automatically!
    const user = db.users.find(u => u.id === userId);

    // 3. Prepare the Payload according to Step 2.2 docs
    // Note: clientId must be an integer (parseInt)
    const payload = {
      uid: userId, 
      clientId: parseInt(process.env.NUGGET_CLIENT_ID || '0'), 
      platform: "desktop",
      
      // Optional fields (populated from your database)
      displayName: user?.name || "Guest User",
      email: user?.email || undefined,
      phoneNumber: user?.phone || undefined,
      // photoUrl: "..." (optional)
    };

    // 4. Call Nugget's API
    const response = await fetch("https://api.nugget.com/unified-support/auth/users/getAccessToken", {
      method: 'POST',
      headers: {
        'Authorization': process.env.NUGGET_BASIC_AUTH_TOKEN || '', // "Basic <base64>"
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Nugget API Error:", errorText);
      return NextResponse.json({ error: 'Failed to authenticate with Nugget' }, { status: response.status });
    }

    const data = await response.json();

    // 5. Return the token to Frontend
    if (data.success && data.accessToken) {
        return NextResponse.json({ accessToken: data.accessToken });
    } else {
        return NextResponse.json({ error: 'No access token in response' }, { status: 500 });
    }

  } catch (error) {
    console.error("Token Generation Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}