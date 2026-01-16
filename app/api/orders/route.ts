import { NextResponse } from 'next/server';
import { db } from '@/app/data/mockDB'; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Order ID required' }, { status: 400 });

  // Search logic: Exact match OR partial match (for ease of use)
  // Also checks if a USER ID was sent, to find that user's active order
  // let order = db.orders.filter(o => o.id === id || o.id.includes(id));
  
  const orders = db.orders.filter(o => 
    o.id === id ||              // Exact Order ID match
    o.user_id === id ||         // Exact User ID match (Returns all orders for this user)
    o.id.includes(id)           // Partial Order ID match (Search bar friendly)
  );

  if (orders) return NextResponse.json(orders);
  
  return NextResponse.json({ error: 'Order not found' }, { status: 404 });
}