import { NextResponse } from 'next/server';
import { db } from '@/app/data/mockDB'; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Order ID required' }, { status: 400 });

  // 1. Find the Order
  let order = db.orders.find(o => o.id === id || o.id.includes(id));
  
  if (!order) {
    const userOrder = db.orders.find(o => o.user_id === id);
    if (userOrder) order = userOrder;
  }

  if (order) {
    // 2. REVERSE LOOKUP: Find the shipment that points to this order
    const shipment = db.shipments.find(s => s.order_id === order?.id);

    // 3. Return a combined object (The Bot loves this)
    return NextResponse.json({
      ...order, // All order details
      shipment_details: shipment || null // Embed the shipment info directly
    });
  }
  
  return NextResponse.json({ error: 'Order not found' }, { status: 404 });
}