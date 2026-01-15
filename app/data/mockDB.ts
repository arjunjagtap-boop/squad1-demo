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
  contact_phone: string; // Vital for Voice Flow B [cite: 91]
}

export interface Order {
  id: string;
  user_id: string;
  seller_id: string;
  product_name: string;
  status: 'PICKUP_PENDING' | 'AUTHENTICATING' | 'SHIPPED' | 'DELIVERED';
  accountability: 'SELLER' | 'SHIPPING_PARTNER' | 'SQUAD1' | 'NONE'; // [cite: 27]
  pickup_deadline: string; // If passed -> Seller Fault
  pickup_actual_time?: string; // If > 24h ago & not shipped -> Partner Fault
}

export interface Shipment {
  id: string;
  order_id: string;
  partner_name: string;
  partner_phone: string; // Vital for Voice Flow C [cite: 109]
  is_dispatched: boolean;
  tracking_link?: string;
}

export interface Ticket {
  id: string;
  order_id: string;
  user_id: string;
  issue_type: 'PICKUP_DELAY' | 'SHIPPING_DELAY' | 'ADDRESS_CONCERN'; // [cite: 126]
  status: 'OPEN' | 'RESOLVED';
  callback_scheduled_for?: string;
}

// --- MOCK DATA GENERATORS ---

// 1. SELLERS (Pool of 5 luxury sellers)
export const sellers: Seller[] = [
  { id: 's1', name: 'Vintage Vault', contact_phone: '+15550101' },
  { id: 's2', name: 'Luxe Bags NY', contact_phone: '+15550102' },
  { id: 's3', name: 'Chronos Watches', contact_phone: '+15550103' },
  { id: 's4', name: 'Sneaker Headz', contact_phone: '+15550104' },
  { id: 's5', name: 'Rare Finds', contact_phone: '+15550105' },
];

// 2. USERS, ORDERS, SHIPMENTS (Generated to cover cases)
const users: User[] = [];
const orders: Order[] = [];
const shipments: Shipment[] = [];
const tickets: Ticket[] = [];

// Helper to create dates
const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
const hoursAhead = (h: number) => new Date(Date.now() + h * 60 * 60 * 1000).toISOString();

// --- GROUP A: SELLER DELAY (10 Users) ---
// Scenario: Pickup deadline missed. Accountability: Seller. [cite: 18, 50]
for (let i = 1; i <= 10; i++) {
  const uid = `u_${i}`;
  const oid = `ord_${100 + i}`;
  
  users.push({
    id: uid, name: `SellerDelay User${i}`, phone: `+155500${i}`, email: `user${i}@test.com`,
    address_short: '123 Delayed St', address_verified: true
  });

  orders.push({
    id: oid, user_id: uid, seller_id: 's1',
    product_name: 'Hermes Birkin (Waiting)',
    status: 'PICKUP_PENDING',
    accountability: 'SELLER', // Explicitly blaming seller [cite: 28]
    pickup_deadline: hoursAgo(5) // Deadline was 5 hours ago!
  });
}

// --- GROUP B: SHIPPING PARTNER DELAY (10 Users) ---
// Scenario: Picked up >24h ago, but not dispatched. Accountability: Partner. [cite: 19, 56]
for (let i = 11; i <= 20; i++) {
  const uid = `u_${i}`;
  const oid = `ord_${100 + i}`;
  
  users.push({
    id: uid, name: `ShipDelay User${i}`, phone: `+155500${i}`, email: `user${i}@test.com`,
    address_short: '456 Warehouse Ave', address_verified: true
  });

  orders.push({
    id: oid, user_id: uid, seller_id: 's2',
    product_name: 'Rolex Submariner',
    status: 'AUTHENTICATING', // It's at Squad1 or Warehouse
    accountability: 'SHIPPING_PARTNER', // [cite: 29]
    pickup_deadline: hoursAgo(48),
    pickup_actual_time: hoursAgo(26) // Picked up 26 hours ago (Breach > 24h)
  });

  shipments.push({
    id: `shp_${i}`, order_id: oid, partner_name: 'FastLogistics', partner_phone: '+19999999',
    is_dispatched: false // The problem
  });
}

// --- GROUP C: ADDRESS VERIFICATION NEEDED (10 Users) ---
// Scenario: Happy path, but needs voice bot to confirm address. [cite: 53, 55]
for (let i = 21; i <= 30; i++) {
  const uid = `u_${i}`;
  const oid = `ord_${100 + i}`;
  
  users.push({
    id: uid, name: `VerifyMe User${i}`, phone: `+155500${i}`, email: `user${i}@test.com`,
    address_short: '789 Unsure Blvd', 
    address_verified: false // Triggers Voice Flow A [cite: 82]
  });

  orders.push({
    id: oid, user_id: uid, seller_id: 's3',
    product_name: 'Gucci Belt',
    status: 'AUTHENTICATING',
    accountability: 'SQUAD1', // Currently with Squad1 for auth [cite: 30]
    pickup_deadline: hoursAgo(10),
    pickup_actual_time: hoursAgo(5) // Fresh pickup
  });
}

// --- GROUP D: ACTIVE ESCALATIONS (5 Users) ---
// Scenario: User already complained. "Talk to someone". [cite: 126]
for (let i = 31; i <= 35; i++) {
  const uid = `u_${i}`;
  const oid = `ord_${100 + i}`;
  
  users.push({
    id: uid, name: `Angry User${i}`, phone: `+155500${i}`, email: `user${i}@test.com`,
    address_short: '101 Escalation Rd', address_verified: true
  });

  orders.push({
    id: oid, user_id: uid, seller_id: 's4',
    product_name: 'Lost Sneaker',
    status: 'AUTHENTICATING',
    accountability: 'SQUAD1',
    pickup_deadline: hoursAgo(50)
  });

  tickets.push({
    id: `tkt_${i}`, order_id: oid, user_id: uid,
    issue_type: 'SHIPPING_DELAY',
    status: 'OPEN',
    callback_scheduled_for: hoursAhead(2)
  });
}

// --- GROUP E: HAPPY PATH / SHIPPED (15 Users) ---
// Scenario: Everything is fine. Reference group. [cite: 20]
for (let i = 36; i <= 50; i++) {
  const uid = `u_${i}`;
  const oid = `ord_${100 + i}`;
  
  users.push({
    id: uid, name: `Happy User${i}`, phone: `+155500${i}`, email: `user${i}@test.com`,
    address_short: '202 Happy Ln', address_verified: true
  });

  orders.push({
    id: oid, user_id: uid, seller_id: 's5',
    product_name: 'Louis Vuitton Wallet',
    status: 'SHIPPED',
    accountability: 'NONE', // Delivered/En route
    pickup_deadline: hoursAgo(100)
  });

  shipments.push({
    id: `shp_${i}`, order_id: oid, partner_name: 'FastLogistics', partner_phone: '+19999999',
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