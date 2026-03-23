export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  purchasePrice: number;
  stock: number;
  sku: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  lastOrderDate: string;
}

export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  items: SaleItem[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled' | 'suspended';
  payments: Payment[];
  notes?: string;
}

export interface Payment {
  method: 'cash' | 'card' | 'bank_transfer' | 'mobile_payment';
  amount: number;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  discountPercent?: number;
  discountAmount?: number;
  taxPercent?: number;
  taxAmount?: number;
  total: number;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
}

export interface SupplierReceipt {
  id: string;
  supplierId: string;
  supplierName: string;
  items: ReceiptItem[];
  totalCost: number;
  date: string;
}

export interface ReceiptItem {
  productId: string;
  productName: string;
  quantity: number;
  costPrice: number;
}

export interface SaleReturn {
  id: string;
  saleId: string;
  customerId: string;
  customerName: string;
  items: ReturnItem[];
  refundAmount: number;
  date: string;
  reason: string;
  status: 'pending' | 'completed';
}

export interface ReturnItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface User {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'manager' | 'cashier';
  email: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalUsers: number;
  lowStockItems: number;
  totalInventoryValue: number;
  potentialProfit: number;
  salesByMonth: { month: string; amount: number }[];
  topProducts: { name: string; sales: number }[];
}
