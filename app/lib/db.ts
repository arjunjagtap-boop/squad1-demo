import fs from 'fs';
import path from 'path';

// Locate the file relative to the project root
const dbPath = path.join(process.cwd(), 'app/data/db.json');

// --- TYPES (Matching your JSON structure) ---
export interface User { id: string; name: string; email: string; phone: string; address: string; address_verified: boolean; }
export interface Order { id: string; user_id: string; seller_id: string; shipper_id: string; product_name: string; status: string; accountability: string; tracking_link?: string; }
// Add Seller/Shipper interfaces if needed

export interface Database {
  users: User[];
  sellers: any[];
  shippers: any[];
  orders: Order[];
}

// --- HELPER FUNCTIONS ---

// 1. Read the entire DB
export function readDb(): Database {
  const fileContents = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(fileContents);
}

// 2. Write changes back to the file (Persistence!)
export function writeDb(data: Database) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// 3. Get User by ID
export function getUser(userId: string) {
  const db = readDb();
  return db.users.find((u) => u.id === userId);
}

// 4. Get Orders for a specific User
export function getUserOrders(userId: string) {
  const db = readDb();
  return db.orders.filter((o) => o.user_id === userId);
}

// 5. Update Order Status (Example usage in your API)
export function updateOrderStatus(orderId: string, newStatus: string) {
  const db = readDb();
  const orderIndex = db.orders.findIndex((o) => o.id === orderId);
  
  if (orderIndex > -1) {
    db.orders[orderIndex].status = newStatus;
    writeDb(db); // Saves the change to disk
    return db.orders[orderIndex];
  }
  return null;
}