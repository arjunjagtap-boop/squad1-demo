import { NextResponse } from 'next/server';
import { db } from '@/app/data/mockDB'; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Seller ID required' }, { status: 400 });

  const seller = db.sellers.find(s => s.id === id);

  if (seller) return NextResponse.json(seller);
  
  return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
}