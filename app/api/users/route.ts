import { NextResponse } from 'next/server';
import { db } from '@/app/data/mockDB'; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

  const user = db.users.find(u => u.id === id);

  if (user) return NextResponse.json(user);
  
  return NextResponse.json({ error: 'User not found' }, { status: 404 });
}