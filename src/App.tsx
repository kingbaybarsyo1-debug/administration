import { useState, useMemo, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { Sales } from './components/Sales';
import { SupplierReceipts } from './components/SupplierReceipts';
import { POS } from './components/POS';
import { Returns } from './components/Returns';
import { Users } from './components/Users';
import { Customers } from './components/Customers';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { Vouchers } from './components/Vouchers';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useData } from './hooks/useData';
import { Bell, Search, User, AlertTriangle } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { 
    isLoading,
    users, setUsers,
    products, setProducts, 
    customers, setCustomers, 
    suppliers, setSuppliers,
    sales, addSale, deleteSale,
    receipts, addReceipt,
    returns, addReturn
  } = useData();

  const notifiedProducts = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (isLoading) return;

    products.forEach(product => {
      if (product.stock <= 5 && !notifiedProducts.current.has(product.id)) {
        toast.error(`تنبيه: مخزون منخفض`, {
          description: `المنتج "${product.name}" وصل إلى ${product.stock} قطع فقط.`,
          icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
          duration: 5000,
          position: 'top-left'
        });
        notifiedProducts.current.add(product.id);
      } else if (product.stock > 5 && notifiedProducts.current.has(product.id)) {
        // Remove from notified if stock is replenished
        notifiedProducts.current.delete(product.id);
      }
    });
  }, [products, isLoading]);

  const stats = useMemo(() => {
    const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
    const totalPurchases = receipts.reduce((sum, r) => sum + r.total, 0);
    const totalReturns = returns.reduce((sum, r) => sum + r.refundAmount, 0);
    const lowStockItems = products.filter(p => p.stock <= 5).length;
    
    const totalInventoryValue = products.reduce((sum, p) => sum + ((p.purchasePrice || 0) * p.stock), 0);
    const potentialProfit = products.reduce((sum, p) => sum + ((p.price - (p.purchasePrice || 0)) * p.stock), 0);
    
    // Mock sales by month for the chart
    const salesByMonth = [
      { month: 'أكتوبر', amount: 4500 },
      { month: 'نوفمبر', amount: 5200 },
      { month: 'ديسمبر', amount: 4800 },
      { month: 'يناير', amount: 6100 },
      { month: 'فبراير', amount: 5900 },
      { month: 'مارس', amount: totalSales },
    ];

    // Top products
    const topProducts = products
      .map(p => ({ name: p.name, sales: Math.floor(Math.random() * 100) + 20 }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    return {
      totalSales,
      totalPurchases,
      totalReturns,
      totalOrders: sales.length,
      totalCustomers: customers.length,
      totalUsers: users.length,
      lowStockItems,
      totalInventoryValue,
      potentialProfit,
      salesByMonth,
      topProducts
    };
  }, [sales, products, customers, users, receipts, returns]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={stats} onNavigate={setActiveTab} />;
      case 'pos':
        return (
          <POS 
            products={products}
            customers={customers}
            onAddSale={addSale}
            sales={sales}
            onDeleteSale={deleteSale}
          />
        );
      case 'inventory':
        return (
          <Inventory 
            products={products} 
            onAdd={(p) => setProducts([...products, { ...p, id: Math.random().toString(36).substr(2, 9) }])}
            onUpdate={(p) => setProducts(products.map(prev => prev.id === p.id ? p : prev))}
            onDelete={(id) => setProducts(products.filter(p => p.id !== id))}
          />
        );
      case 'sales':
        return (
          <Sales 
            sales={sales} 
            products={products} 
            customers={customers} 
            onAddSale={addSale} 
          />
        );
      case 'vouchers':
        return <Vouchers />;
      case 'returns':
        return (
          <Returns 
            returns={returns}
            sales={sales}
            onAddReturn={addReturn}
          />
        );
      case 'receipts':
        return (
          <SupplierReceipts 
            receipts={receipts}
            products={products}
            suppliers={suppliers}
            onAddReceipt={addReceipt}
          />
        );
      case 'users':
        return (
          <Users 
            users={users}
            onAdd={(u) => setUsers([...users, { ...u, id: Math.random().toString(36).substr(2, 9) }])}
            onUpdate={(u) => setUsers(users.map(prev => prev.id === u.id ? u : prev))}
            onDelete={(id) => setUsers(users.filter(u => u.id !== id))}
          />
        );
      case 'customers':
        return (
          <Customers 
            customers={customers}
            onAdd={(c) => setCustomers([...customers, { ...c, id: Math.random().toString(36).substr(2, 9), totalSpent: 0, lastOrderDate: '' }])}
            onUpdate={(c) => setCustomers(customers.map(prev => prev.id === c.id ? c : prev))}
            onDelete={(id) => setCustomers(customers.filter(c => c.id !== id))}
          />
        );
      case 'reports':
        return <Reports stats={stats} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard stats={stats} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-slate-900 to-transparent opacity-[0.03] pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <Toaster richColors closeButton position="top-left" />
      
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        lowStockCount={stats.lowStockItems} 
      />
      
      <main className="flex-1 w-full relative z-10 overflow-hidden">
        {/* Content */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-full flex flex-col">
          {isLoading ? (
            <div className="flex items-center justify-center h-full p-20">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="flex-1 overflow-hidden py-4 md:py-6">
              {renderContent()}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
