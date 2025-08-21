export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin";
}

export interface Order {
  id: string;
  order_number: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  date: string;
  created_at: string;
  customer?: {
    name: string;
  };
  vendor?: {
    name: string;
  };
  customerName: string;
  shippingAddress: string;
}

// export interface ApiOrderDetails {
//   id: number;
//   order_number: string;
//   status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
//   total: number;
//   created_at: string;
//   items: OrderItem[];
//   customer: {
//     id: number;
//     name: string;
//     email?: string; // ممكن يكون موجود أو لا
//   };
//   vendor: {
//     id: number;
//     name: string;
//   };
//   promo_code: string | null;
// }

export interface OrderItem {
  id: number;
  name: string;
  image: string;
  quantity: number;
  price: number;
  product_commission: number;
}

export interface ApiOrderDetails {
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  customer?: {
    name: string;
    email: string;
  };
  vendor: {
    name: string;
  };
  items: OrderItem[];
  promo_code?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive" | "out_of_stock";
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
  status: "active" | "inactive";
  productsCount: number;
  totalSales: number;
  joinedDate: string;
}
