import { NextResponse } from 'next/server';
import { db } from '@/app/data/mockDB'; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Order ID required' }, { status: 400 });

  // Search logic: Exact match OR partial match (for ease of use)
  // Also checks if a USER ID was sent, to find that user's active order
  let order = db.orders.find(o => o.id === id || o.id.includes(id));
  
  if (!order) {
    // specific logic: if ID is a user ID, find their order
    const userOrder = db.orders.find(o => o.user_id === id);
    if (userOrder) order = userOrder;
  }

  if (order) return NextResponse.json(order);
  
  return NextResponse.json({ error: 'Order not found' }, { status: 404 });
}