import { Order, Product, Vendor } from './types';

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    status: 'delivered',
    total: 259.99,
    items: 3,
    date: '2024-01-15',
    shippingAddress: '123 Main St, New York, NY 10001'
  },
  {
    id: 'ORD-002',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@example.com',
    status: 'processing',
    total: 149.50,
    items: 2,
    date: '2024-01-14',
    shippingAddress: '456 Oak Ave, Los Angeles, CA 90210'
  },
  {
    id: 'ORD-003',
    customerName: 'Mike Chen',
    customerEmail: 'mike@example.com',
    status: 'shipped',
    total: 89.99,
    items: 1,
    date: '2024-01-13',
    shippingAddress: '789 Pine Rd, Chicago, IL 60601'
  },
  {
    id: 'ORD-004',
    customerName: 'Emma Wilson',
    customerEmail: 'emma@example.com',
    status: 'pending',
    total: 199.99,
    items: 4,
    date: '2024-01-12',
    shippingAddress: '321 Elm St, Miami, FL 33101'
  },
  {
    id: 'ORD-005',
    customerName: 'David Brown',
    customerEmail: 'david@example.com',
    status: 'cancelled',
    total: 75.00,
    items: 1,
    date: '2024-01-11',
    shippingAddress: '654 Maple Dr, Seattle, WA 98101'
  }
];

export const mockProducts: Product[] = [
  {
    id: 'PRD-001',
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 129.99,
    stock: 45,
    status: 'active',
    vendor: 'TechCorp',
    description: 'High-quality wireless headphones with noise cancellation'
  },
  {
    id: 'PRD-002',
    name: 'Smart Watch',
    category: 'Electronics',
    price: 299.99,
    stock: 23,
    status: 'active',
    vendor: 'TechCorp',
    description: 'Advanced smartwatch with health monitoring features'
  },
  {
    id: 'PRD-003',
    name: 'Coffee Maker',
    category: 'Appliances',
    price: 89.99,
    stock: 12,
    status: 'active',
    vendor: 'HomeGoods Co.',
    description: 'Programmable coffee maker with thermal carafe'
  },
  {
    id: 'PRD-004',
    name: 'Yoga Mat',
    category: 'Fitness',
    price: 39.99,
    stock: 0,
    status: 'out_of_stock',
    vendor: 'FitLife',
    description: 'Premium non-slip yoga mat for all fitness levels'
  },
  {
    id: 'PRD-005',
    name: 'Desk Lamp',
    category: 'Furniture',
    price: 59.99,
    stock: 8,
    status: 'active',
    vendor: 'Office Solutions',
    description: 'LED desk lamp with adjustable brightness and color temperature'
  }
];

export const mockVendors: Vendor[] = [
  {
    id: 'VND-001',
    name: 'TechCorp',
    email: 'contact@techcorp.com',
    phone: '+1 (555) 123-4567',
    address: '100 Tech Street, Silicon Valley, CA 94000',
    status: 'active',
    productsCount: 25,
    totalSales: 45899.99,
    joinedDate: '2023-03-15'
  },
  {
    id: 'VND-002',
    name: 'HomeGoods Co.',
    email: 'info@homegoods.com',
    phone: '+1 (555) 234-5678',
    address: '250 Home Avenue, Austin, TX 73301',
    status: 'active',
    productsCount: 18,
    totalSales: 23450.50,
    joinedDate: '2023-05-20'
  },
  {
    id: 'VND-003',
    name: 'FitLife',
    email: 'support@fitlife.com',
    phone: '+1 (555) 345-6789',
    address: '75 Fitness Blvd, Denver, CO 80202',
    status: 'active',
    productsCount: 12,
    totalSales: 18900.00,
    joinedDate: '2023-07-10'
  },
  {
    id: 'VND-004',
    name: 'Office Solutions',
    email: 'hello@officesolutions.com',
    phone: '+1 (555) 456-7890',
    address: '500 Business Park, Boston, MA 02101',
    status: 'inactive',
    productsCount: 8,
    totalSales: 9750.25,
    joinedDate: '2023-09-05'
  }
];