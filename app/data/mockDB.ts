// --- TYPES ---
export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  address_short: string;
  address_verified: boolean; // Vital for Voice Flow A [cite: 82]
}

export interface Seller {
  id: string;
  name: string;
  contact_phone: string; // Vital for Voice Flow B [cite: 52]
}

export interface Order {
  id: string;
  user_id: string;
  seller_id: string;
  shipment_id: string; // <--- ADDED: Direct link to shipment
  product_name: string;
  // Status matches the phases in the Case Study [cite: 18, 19, 20]
  status: 'PICKUP_PENDING' | 'AUTHENTICATING' | 'SHIPPED' | 'DELIVERED';
  // Accountability drives the "Blame Game" logic [cite: 27, 28, 29, 30]
  accountability: 'SELLER' | 'SHIPPING_PARTNER' | 'SQUAD1' | 'NONE'; 
  pickup_deadline: string; 
  pickup_actual_time?: string;
}

export interface Shipment {
  id: string;
  order_id: string;
  partner_name: string;
  partner_phone: string; // Vital for Voice Flow C [cite: 58]
  is_dispatched: boolean;
  tracking_link?: string;
}

export interface Ticket {
  id: string;
  order_id: string;
  user_id: string;
  issue_type: 'PICKUP_DELAY' | 'SHIPPING_DELAY' | 'ADDRESS_CONCERN'; // [cite: 127, 128, 129]
  status: 'OPEN' | 'RESOLVED';
  callback_scheduled_for?: string;
}

// --- MOCK DATA GENERATORS ---

export const sellers: Seller[] = [
  { id: 's1', name: 'Vintage Vault', contact_phone: '+15550101' },
  { id: 's2', name: 'Luxe Bags NY', contact_phone: '+15550102' },
  { id: 's3', name: 'Chronos Watches', contact_phone: '+15550103' },
  { id: 's4', name: 'Sneaker Headz', contact_phone: '+15550104' },
  { id: 's5', name: 'Rare Finds', contact_phone: '+15550105' },
];

const users: User[] = [];
const orders: Order[] = [];
const shipments: Shipment[] = [];
const tickets: Ticket[] = [];

// Helper to create dates
const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
const hoursAhead = (h: number) => new Date(Date.now() + h * 60 * 60 * 1000).toISOString();

// --- GROUP A: SELLER DELAY (10 Users) ---
// Logic: Pickup not initiated. Accountability: SELLER. [cite: 28, 50]
for (let i = 1; i <= 10; i++) {
  const uid = `u_${i}`;
  const oid = `ord_${100}`;
  const shpId = `shp_${1000 + i}`;
  
  users.push({
    id: uid, name: `SellerDelay User${i}`, phone: `+155500${i}`, email: `user${i}@test.com`,
    address_short: '123 Delayed St', address_verified: true
  });

  orders.push({
    id: oid, user_id: uid, seller_id: 's1', shipment_id: shpId,
    product_name: 'Hermes Birkin (Waiting)',
    status: 'PICKUP_PENDING',
    accountability: 'SELLER', 
    pickup_deadline: hoursAgo(5) // Missed deadline 5 hours ago
  });

  // Shipment exists but hasn't started
  shipments.push({
    id: shpId, order_id: oid, partner_name: 'FastLogistics', partner_phone: '+19999999',
    is_dispatched: false
  });
}

// --- GROUP B: SHIPPING PARTNER DELAY (10 Users) ---
// Logic: Picked up >24h ago, not dispatched. Accountability: SHIPPING_PARTNER. [cite: 29, 56]
for (let i = 11; i <= 20; i++) {
  const uid = `u_${i}`;
  const oid = `ord_${100 + i}`;
  const shpId = `shp_${1000 + i}`;
  
  users.push({
    id: uid, name: `ShipDelay User${i}`, phone: `+155500${i}`, email: `user${i}@test.com`,
    address_short: '456 Warehouse Ave', address_verified: true
  });

  orders.push({
    id: oid, user_id: uid, seller_id: 's2', shipment_id: shpId,
    product_name: 'Rolex Submariner',
    status: 'AUTHENTICATING', // Item is technically with Squad1/Partner handover
    accountability: 'SHIPPING_PARTNER', 
    pickup_deadline: hoursAgo(48),
    pickup_actual_time: hoursAgo(26) // Picked up 26h ago (SLA Breach)
  });

  shipments.push({
    id: shpId, order_id: oid, partner_name: 'FastLogistics', partner_phone: '+19999999',
    is_dispatched: false // The failure point
  });
}

// --- GROUP C: ADDRESS VERIFICATION NEEDED (10 Users) ---
// Logic: Happy path so far, but needs Voice Flow A. Accountability: SQUAD1 (Internal). [cite: 30, 62]
for (let i = 21; i <= 30; i++) {
  const uid = `u_${i}`;
  const oid = `ord_${100 + i}`;
  const shpId = `shp_${1000 + i}`;
  
  users.push({
    id: uid, name: `VerifyMe User${i}`, phone: `+155500${i}`, email: `user${i}@test.com`,
    address_short: '789 Unsure Blvd', 
    address_verified: false // Triggers Voice Flow A
  });

  orders.push({
    id: oid, user_id: uid, seller_id: 's3', shipment_id: shpId,
    product_name: 'Gucci Belt',
    status: 'AUTHENTICATING',
    accountability: 'SQUAD1', 
    pickup_deadline: hoursAgo(10),
    pickup_actual_time: hoursAgo(5)
  });

  shipments.push({
    id: shpId, order_id: oid, partner_name: 'FastLogistics', partner_phone: '+19999999',
    is_dispatched: false
  });
}

// --- GROUP D: ACTIVE ESCALATIONS (5 Users) ---
// Logic: Customer asked to "talk to someone". [cite: 122]
for (let i = 31; i <= 35; i++) {
  const uid = `u_${i}`;
  const oid = `ord_${100 + i}`;
  const shpId = `shp_${1000 + i}`;
  
  users.push({
    id: uid, name: `Angry User${i}`, phone: `+155500${i}`, email: `user${i}@test.com`,
    address_short: '101 Escalation Rd', address_verified: true
  });

  orders.push({
    id: oid, user_id: uid, seller_id: 's4', shipment_id: shpId,
    product_name: 'Lost Sneaker',
    status: 'AUTHENTICATING',
    accountability: 'SQUAD1',
    pickup_deadline: hoursAgo(50)
  });

  shipments.push({
    id: shpId, order_id: oid, partner_name: 'FastLogistics', partner_phone: '+19999999',
    is_dispatched: false
  });

  tickets.push({
    id: `tkt_${i}`, order_id: oid, user_id: uid,
    issue_type: 'SHIPPING_DELAY',
    status: 'OPEN',
    callback_scheduled_for: hoursAhead(2)
  });
}

// --- GROUP E: HAPPY PATH / SHIPPED (15 Users) ---
// Logic: Dispatched and on the way. Accountability: NONE (or Courier). [cite: 20]
for (let i = 36; i <= 50; i++) {
  const uid = `u_${i}`;
  const oid = `ord_${100 + i}`;
  const shpId = `shp_${1000 + i}`;
  
  users.push({
    id: uid, name: `Happy User${i}`, phone: `+155500${i}`, email: `user${i}@test.com`,
    address_short: '202 Happy Ln', address_verified: true
  });

  orders.push({
    id: oid, user_id: uid, seller_id: 's5', shipment_id: shpId,
    product_name: 'Louis Vuitton Wallet',
    status: 'SHIPPED',
    accountability: 'NONE', 
    pickup_deadline: hoursAgo(100),
    pickup_actual_time: hoursAgo(98)
  });

  shipments.push({
    id: shpId, order_id: oid, partner_name: 'FastLogistics', partner_phone: '+19999999',
    is_dispatched: true,
    tracking_link: `https://track.squad1.com/${oid}`
  });
}

// --- EXPORT DATABASE ---
export const db = {
  users,
  sellers,
  orders,
  shipments,
  tickets
};