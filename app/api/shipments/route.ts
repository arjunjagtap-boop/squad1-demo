import { NextResponse } from 'next/server';
import { db } from '@/app/data/mockDB'; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Shipment ID required' }, { status: 400 });

  // Search logic
  const shipment = db.shipments.find(s => s.id === id);

  if (shipment) return NextResponse.json(shipment);
  
  return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
}