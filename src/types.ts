export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: number;
  date: string;
  shippingAddress: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  vendor: string;
  description: string;
  image?: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  productsCount: number;
  totalSales: number;
  joinedDate: string;
}