
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "food" | "juice";
  tags: string[];
  popular?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  type: "food" | "juice";
  image?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered";
  createdAt: string;
  deliveryAddress?: string;
  contactNumber?: string;
  customerName: string;
  customerEmail?: string;
  customerId?: string;
}

export type UserRole = "customer" | "admin" | "restaurant";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
