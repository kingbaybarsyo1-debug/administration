import { useState, useEffect } from 'react';
import { Product, Customer, Sale, Supplier, SupplierReceipt, SaleReturn, User, StoreSettings, Voucher } from '../types';

const INITIAL_STORE_SETTINGS: StoreSettings = {
  name: 'برو سيلز للأنظمة',
  address: 'الرياض، المملكة العربية السعودية',
  phone: '0500000000',
  email: 'info@prosales.com',
  currency: 'SAR',
  taxRate: 15,
};

const INITIAL_VOUCHERS: Voucher[] = [
  { id: 'V-001', type: 'receipt', date: '2024-03-20', amount: 1500, customerName: 'أحمد محمد', description: 'دفعة من الحساب', paymentMethod: 'cash' },
  { id: 'V-002', type: 'payment', date: '2024-03-21', amount: 500, customerName: 'شركة التوريد', description: 'سداد فاتورة مشتريات', paymentMethod: 'bank_transfer' },
];

const INITIAL_USERS: User[] = [
  { id: '1', name: 'أدمن النظام', username: 'admin', role: 'admin', email: 'admin@prosales.com', status: 'active', lastLogin: '2024-03-21 14:30' },
  { id: '2', name: 'سارة أحمد', username: 'sara_cashier', role: 'cashier', email: 'sara@prosales.com', status: 'active', lastLogin: '2024-03-21 10:15' },
  { id: '3', name: 'محمد علي', username: 'm_ali', role: 'manager', email: 'mali@prosales.com', status: 'inactive', lastLogin: '2024-03-19 09:00' },
];

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'هاتف ذكي X1', category: 'إلكترونيات', price: 1200, purchasePrice: 900, stock: 15, sku: 'PH-001' },
  { id: '2', name: 'سماعات لاسلكية', category: 'إكسسوارات', price: 150, purchasePrice: 100, stock: 5, sku: 'AC-002' },
  { id: '3', name: 'شاحن سريع 65 واط', category: 'إكسسوارات', price: 45, purchasePrice: 30, stock: 50, sku: 'AC-003' },
  { id: '4', name: 'ساعة ذكية Pro', category: 'إلكترونيات', price: 350, purchasePrice: 250, stock: 8, sku: 'WT-004' },
];

const INITIAL_CUSTOMERS: Customer[] = [
  { id: '1', name: 'أحمد محمد', email: 'ahmed@example.com', phone: '0501234567', totalSpent: 2400, lastOrderDate: '2024-03-15' },
  { id: '2', name: 'سارة علي', email: 'sara@example.com', phone: '0559876543', totalSpent: 150, lastOrderDate: '2024-03-10' },
];

const INITIAL_SUPPLIERS: Supplier[] = [
  { id: '1', name: 'شركة التوريدات التقنية', contact: 'خالد محمود', phone: '0512345678' },
  { id: '2', name: 'مؤسسة الأجهزة الحديثة', contact: 'سمير حسن', phone: '0523456789' },
];

const INITIAL_SALES: Sale[] = [
  { 
    id: 'INV-001', 
    customerId: '1', 
    customerName: 'أحمد محمد', 
    total: 1200, 
    date: '2024-03-15', 
    status: 'completed',
    items: [{ 
      productId: '1', 
      productName: 'هاتف ذكي X1', 
      quantity: 1, 
      price: 1200,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 15,
      taxAmount: 180,
      total: 1200
    }],
    subtotal: 1200,
    taxTotal: 180,
    discountTotal: 0,
    payments: [{ method: 'cash', amount: 1200 }]
  },
];

export function useData() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [receipts, setReceipts] = useState<SupplierReceipt[]>([]);
  const [returns, setReturns] = useState<SaleReturn[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);

  useEffect(() => {
    // Simulate initial data fetch
    const timer = setTimeout(() => {
      const savedUsers = localStorage.getItem('sales_users');
      setUsers(savedUsers ? JSON.parse(savedUsers) : INITIAL_USERS);

      const savedProducts = localStorage.getItem('sales_products');
      setProducts(savedProducts ? JSON.parse(savedProducts) : INITIAL_PRODUCTS);

      const savedCustomers = localStorage.getItem('sales_customers');
      setCustomers(savedCustomers ? JSON.parse(savedCustomers) : INITIAL_CUSTOMERS);

      const savedSuppliers = localStorage.getItem('sales_suppliers');
      setSuppliers(savedSuppliers ? JSON.parse(savedSuppliers) : INITIAL_SUPPLIERS);

      const savedSales = localStorage.getItem('sales_data');
      setSales(savedSales ? JSON.parse(savedSales) : INITIAL_SALES);

      const savedReceipts = localStorage.getItem('sales_receipts');
      setReceipts(savedReceipts ? JSON.parse(savedReceipts) : []);

      const savedReturns = localStorage.getItem('sales_returns');
      setReturns(savedReturns ? JSON.parse(savedReturns) : []);

      const savedVouchers = localStorage.getItem('sales_vouchers');
      setVouchers(savedVouchers ? JSON.parse(savedVouchers) : INITIAL_VOUCHERS);

      const savedSettings = localStorage.getItem('sales_settings');
      setStoreSettings(savedSettings ? JSON.parse(savedSettings) : INITIAL_STORE_SETTINGS);

      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) localStorage.setItem('sales_users', JSON.stringify(users));
  }, [users, isLoading]);

  useEffect(() => {
    if (!isLoading) localStorage.setItem('sales_products', JSON.stringify(products));
  }, [products, isLoading]);

  useEffect(() => {
    if (!isLoading) localStorage.setItem('sales_customers', JSON.stringify(customers));
  }, [customers, isLoading]);

  useEffect(() => {
    if (!isLoading) localStorage.setItem('sales_suppliers', JSON.stringify(suppliers));
  }, [suppliers, isLoading]);

  useEffect(() => {
    if (!isLoading) localStorage.setItem('sales_data', JSON.stringify(sales));
  }, [sales, isLoading]);

  useEffect(() => {
    if (!isLoading) localStorage.setItem('sales_receipts', JSON.stringify(receipts));
  }, [receipts, isLoading]);

  useEffect(() => {
    if (!isLoading) localStorage.setItem('sales_returns', JSON.stringify(returns));
  }, [returns, isLoading]);

  useEffect(() => {
    if (!isLoading) localStorage.setItem('sales_vouchers', JSON.stringify(vouchers));
  }, [vouchers, isLoading]);

  useEffect(() => {
    if (!isLoading) localStorage.setItem('sales_settings', JSON.stringify(storeSettings));
  }, [storeSettings, isLoading]);

  const addVoucher = (voucher: Omit<Voucher, 'id' | 'date'>) => {
    const newVoucher: Voucher = {
      ...voucher,
      id: `V-${String(vouchers.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
    };
    setVouchers([newVoucher, ...vouchers]);
    return newVoucher;
  };

  const addSale = (sale: Omit<Sale, 'id' | 'date'>) => {
    const newSale: Sale = {
      ...sale,
      id: `INV-${String(sales.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
    };
    setSales([newSale, ...sales]);
    
    // Only update stock and customer totals if the sale is completed
    if (sale.status === 'completed') {
      // Update stock (decrease)
      setProducts(prev => prev.map(p => {
        const item = sale.items.find(i => i.productId === p.id);
        if (item) return { ...p, stock: p.stock - item.quantity };
        return p;
      }));

      // Update customer total spent
      setCustomers(prev => prev.map(c => {
        if (c.id === sale.customerId) {
          return { 
            ...c, 
            totalSpent: c.totalSpent + sale.total,
            lastOrderDate: newSale.date
          };
        }
        return c;
      }));
    }

    return newSale;
  };

  const addReceipt = (receipt: Omit<SupplierReceipt, 'id' | 'date'>) => {
    const newReceipt: SupplierReceipt = {
      ...receipt,
      id: `REC-${String(receipts.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
    };
    setReceipts([newReceipt, ...receipts]);

    // Update stock (increase)
    setProducts(prev => prev.map(p => {
      const item = receipt.items.find(i => i.productId === p.id);
      if (item) return { ...p, stock: p.stock + item.quantity };
      return p;
    }));
  };

  const addReturn = (saleReturn: Omit<SaleReturn, 'id' | 'date'>) => {
    const newReturn: SaleReturn = {
      ...saleReturn,
      id: `RET-${String(returns.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
    };
    setReturns([newReturn, ...returns]);

    // Update stock (increase)
    setProducts(prev => prev.map(p => {
      const item = saleReturn.items.find(i => i.productId === p.id);
      if (item) return { ...p, stock: p.stock + item.quantity };
      return p;
    }));

    // Update customer total spent (decrease)
    setCustomers(prev => prev.map(c => {
      if (c.id === saleReturn.customerId) {
        return { 
          ...c, 
          totalSpent: Math.max(0, c.totalSpent - saleReturn.refundAmount)
        };
      }
      return c;
    }));
  };

  const deleteSale = (id: string) => {
    setSales(prev => prev.filter(s => s.id !== id));
  };

  return { 
    isLoading,
    users, setUsers,
    products, setProducts, 
    customers, setCustomers, 
    suppliers, setSuppliers,
    sales, addSale, deleteSale,
    receipts, addReceipt,
    returns, addReturn,
    vouchers, addVoucher,
    storeSettings, setStoreSettings
  };
}
