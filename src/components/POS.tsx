import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingCart, Trash2, Plus, Minus, User, CreditCard, Banknote, CheckCircle2, Smartphone, Landmark, AlertCircle, X, Printer, Eye, EyeOff } from 'lucide-react';
import Barcode from 'react-barcode';
import { Product, Customer, Sale, SaleItem, Payment } from '../types';
import { Receipt } from './Receipt';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toast } from 'sonner';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface POSProps {
  products: Product[];
  customers: Customer[];
  onAddSale: (sale: Omit<Sale, 'id' | 'date'>) => Sale | void;
  sales: Sale[];
  onDeleteSale: (id: string) => void;
}

const PAYMENT_METHODS = [
  { id: 'cash', label: 'نقدي', icon: Banknote },
  { id: 'card', label: 'بطاقة', icon: CreditCard },
  { id: 'bank_transfer', label: 'تحويل بنكي', icon: Landmark },
  { id: 'mobile_payment', label: 'دفع جوال', icon: Smartphone },
] as const;

export const POS: React.FC<POSProps> = ({ products, customers, onAddSale, sales, onDeleteSale }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastSale, setLastSale] = useState<Sale | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);
  const [activeItemForDiscount, setActiveItemForDiscount] = useState<string | null>(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [visibleCosts, setVisibleCosts] = useState<Set<string>>(new Set());
  const [cartSearchTerm, setCartSearchTerm] = useState('');
  const [showSuspended, setShowSuspended] = useState(false);

  const suspendedSales = useMemo(() => sales.filter(s => s.status === 'suspended'), [sales]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="البحث"]') as HTMLInputElement;
        searchInput?.focus();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // If there's an exact SKU match, add it
      const exactMatch = products.find(p => p.sku === searchTerm);
      if (exactMatch) {
        addToCart(exactMatch);
        setSearchTerm('');
        return;
      }
      
      // If only one product is filtered, add it
      if (filteredProducts.length === 1) {
        addToCart(filteredProducts[0]);
        setSearchTerm('');
      }
    }
  };

  const categories = useMemo(() => ['الكل', ...new Set(products.map(p => p.category))], [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const name = p.name || '';
      const sku = p.sku || '';
      const matchesSearch = !searchTerm.trim() || 
                           name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'الكل' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);
  
  const itemDiscounts = useMemo(() => cart.reduce((sum, item) => sum + (item.discountAmount || 0), 0), [cart]);
  
  const totalDiscount = itemDiscounts + invoiceDiscount;
  
  const taxableAmount = subtotal - totalDiscount;
  const taxTotal = Math.max(0, taxableAmount * 0.15); // 15% VAT
  const total = Math.max(0, taxableAmount + taxTotal);

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const remainingAmount = Math.max(0, total - totalPaid);

  const filteredCartProducts = useMemo(() => {
    if (!cartSearchTerm.trim()) return products.slice(0, 50); // Show first 50 when empty and focused
    return products.filter(p => 
      p.name.toLowerCase().includes(cartSearchTerm.toLowerCase()) || 
      p.sku.toLowerCase().includes(cartSearchTerm.toLowerCase())
    ).slice(0, 50); // Limit to 50 results
  }, [products, cartSearchTerm]);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => {
          if (item.productId === product.id) {
            const newQty = item.quantity + 1;
            const itemSubtotal = item.price * newQty;
            const discAmount = item.discountPercent ? (itemSubtotal * item.discountPercent / 100) : (item.discountAmount || 0);
            return { 
              ...item, 
              quantity: newQty,
              total: itemSubtotal - discAmount
            };
          }
          return item;
        });
      }
      return [...prev, { 
        productId: product.id, 
        productName: product.name, 
        quantity: 1, 
        price: product.price,
        discountPercent: 0,
        discountAmount: 0,
        taxPercent: 15,
        taxAmount: product.price * 0.15,
        total: product.price
      }];
    });
    
    toast.success(`تمت إضافة ${product.name} إلى السلة`, {
      position: 'top-center',
      duration: 2000,
    });

    // Open cart on mobile when adding first item
    if (cart.length === 0) setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const product = products.find(p => p.id === productId);
        const newQty = Math.max(1, item.quantity + delta);
        if (product && newQty > product.stock) return item;
        
        const itemSubtotal = item.price * newQty;
        const discAmount = item.discountPercent ? (itemSubtotal * item.discountPercent / 100) : (item.discountAmount || 0);
        
        return { 
          ...item, 
          quantity: newQty,
          total: itemSubtotal - discAmount
        };
      }
      return item;
    }));
  };

  const updateItemDiscount = (productId: string, type: 'percent' | 'amount', value: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const itemSubtotal = item.price * item.quantity;
        let discPercent = item.discountPercent || 0;
        let discAmount = item.discountAmount || 0;

        if (type === 'percent') {
          discPercent = value;
          discAmount = (itemSubtotal * value) / 100;
        } else {
          discAmount = value;
          discPercent = (value / itemSubtotal) * 100;
        }

        return {
          ...item,
          discountPercent: discPercent,
          discountAmount: discAmount,
          total: itemSubtotal - discAmount
        };
      }
      return item;
    }));
  };

  const updateItemPrice = (productId: string, newPrice: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const itemSubtotal = newPrice * item.quantity;
        const discAmount = item.discountPercent ? (itemSubtotal * item.discountPercent / 100) : (item.discountAmount || 0);
        return { 
          ...item, 
          price: newPrice,
          total: itemSubtotal - discAmount
        };
      }
      return item;
    }));
  };

  const updateItemQuantity = (productId: string, newQty: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const product = products.find(p => p.id === productId);
        const qty = Math.max(1, newQty);
        if (product && qty > product.stock) {
          toast.error('الكمية المطلوبة تتجاوز المخزون');
          return item;
        }
        
        const itemSubtotal = item.price * qty;
        const discAmount = item.discountPercent ? (itemSubtotal * item.discountPercent / 100) : (item.discountAmount || 0);
        
        return { 
          ...item, 
          quantity: qty,
          total: itemSubtotal - discAmount
        };
      }
      return item;
    }));
  };

  const handleResume = (sale: Sale) => {
    setCart(sale.items);
    setSelectedCustomerId(sale.customerId);
    setInvoiceDiscount(sale.discountTotal || 0);
    onDeleteSale(sale.id);
    setShowSuspended(false);
    toast.success('تم استرجاع الفاتورة');
  };

  const toggleCostVisibility = (productId: string) => {
    setVisibleCosts(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const addPayment = (method: Payment['method']) => {
    setPayments(prev => {
      const existing = prev.find(p => p.method === method);
      if (existing) {
        return prev.map(p => p.method === method ? { ...p, amount: p.amount + remainingAmount } : p);
      }
      return [...prev, { method, amount: remainingAmount }];
    });
  };

  const removePayment = (method: Payment['method']) => {
    setPayments(prev => prev.filter(p => p.method !== method));
  };

  const updatePaymentAmount = (method: Payment['method'], amount: number) => {
    const newAmount = Math.max(0, amount);
    
    setPayments(prev => {
      const hasCash = prev.some(p => p.method === 'cash');
      const hasCard = prev.some(p => p.method === 'card');
      
      // If we are updating cash and card exists, or vice versa
      if ((method === 'cash' && hasCard) || (method === 'card' && hasCash)) {
        const otherMethod = method === 'cash' ? 'card' : 'cash';
        const otherAmount = Math.max(0, total - newAmount);
        
        return prev.map(p => {
          if (p.method === method) return { ...p, amount: newAmount };
          if (p.method === otherMethod) return { ...p, amount: otherAmount };
          return p;
        });
      }
      
      // Default behavior for other methods or if only one of cash/card exists
      return prev.map(p => p.method === method ? { ...p, amount: newAmount } : p);
    });
  };

  const handleCheckout = (customPayments?: Payment[]) => {
    const finalPayments = customPayments || payments;
    const finalTotalPaid = finalPayments.reduce((sum, p) => sum + p.amount, 0);

    if (cart.length === 0 || finalTotalPaid < total) return;

    const customer = customers.find(c => c.id === selectedCustomerId);
    const saleData: Omit<Sale, 'id' | 'date'> = {
      customerId: selectedCustomerId || 'walk-in',
      customerName: customer?.name || 'عميل نقدي',
      items: cart,
      subtotal,
      taxTotal,
      discountTotal: totalDiscount,
      total,
      status: 'completed',
      payments: finalPayments
    };
    const newSale = onAddSale(saleData);
    if (newSale) {
      setLastSale(newSale);
    }
    setCart([]);
    setSelectedCustomerId('');
    setPayments([]);
    setShowPaymentOptions(false);
    setIsCartOpen(false);
    setShowSuccess(true);
    
    setTimeout(() => setShowSuccess(false), 10000); // Keep success screen longer for print option
  };

  useEffect(() => {
    if (showSuccess && lastSale) {
      const timer = setTimeout(() => {
        try {
          window.print();
        } catch (e) {
          console.error('Print failed:', e);
          toast.error('فشل بدء الطباعة التلقائية، يرجى الضغط على زر الطباعة');
        }
      }, 1000); // Increased delay to ensure rendering
      return () => clearTimeout(timer);
    }
  }, [showSuccess, lastSale?.id]); // Use sale ID to trigger only when a new sale is created

  const handlePrint = () => {
    if (lastSale) {
      window.print();
    }
  };

  const handleSuspend = () => {
    if (cart.length === 0) return;
    
    const customer = customers.find(c => c.id === selectedCustomerId);
    const saleData: Omit<Sale, 'id' | 'date'> = {
      customerId: selectedCustomerId || 'walk-in',
      customerName: customer?.name || 'عميل نقدي',
      items: cart,
      subtotal,
      taxTotal,
      discountTotal: totalDiscount,
      total,
      status: 'suspended',
      payments: []
    };
    
    onAddSale(saleData);
    setCart([]);
    setSelectedCustomerId('');
    setPayments([]);
    setInvoiceDiscount(0);
    setIsCartOpen(false);
    toast.info('تم تعليق الفاتورة بنجاح');
  };

  const handleCancel = () => {
    if (cart.length === 0) return;
    if (confirm('هل أنت متأكد من إلغاء الفاتورة؟')) {
      setCart([]);
      setSelectedCustomerId('');
      setPayments([]);
      setInvoiceDiscount(0);
      setIsCartOpen(false);
      toast.error('تم إلغاء الفاتورة');
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-full animate-in fade-in slide-in-from-bottom-4 duration-700 relative text-right bg-slate-50/30" dir="rtl">
      {/* Main Container - Matches the 'previous page' (cart view) */}
      <div className="h-full flex flex-col transition-all duration-500 p-2 md:p-4">
        <div className="h-full bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-slate-200/40 border border-slate-100 flex flex-col overflow-hidden group">
          {showSuccess && (
            <div className="absolute inset-0 bg-indigo-600/95 backdrop-blur-md z-[60] flex flex-col items-center justify-center text-white p-8 md:p-12 text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 md:w-28 md:h-28 bg-white/20 rounded-full flex items-center justify-center mb-6 md:mb-8 animate-bounce shadow-2xl">
                <CheckCircle2 className="w-10 h-10 md:w-14 md:h-14" />
              </div>
              <h3 className="text-2xl md:text-4xl font-black mb-3 md:mb-4 tracking-tight">تمت العملية بنجاح!</h3>
              <p className="text-indigo-100 font-medium leading-relaxed text-sm md:text-lg">تم تسجيل الفاتورة بنجاح وتحديث بيانات المخزون والعملاء.</p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8 md:mt-10">
                <button 
                  onClick={handlePrint} 
                  className="px-8 md:px-10 py-3 md:py-4 bg-white/20 text-white border border-white/30 rounded-xl md:rounded-2xl font-black text-xs md:text-sm hover:bg-white/30 transition-all flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  طباعة الفاتورة
                </button>
                <button 
                  onClick={() => setShowSuccess(false)} 
                  className="px-8 md:px-10 py-3 md:py-4 bg-white text-indigo-600 rounded-xl md:rounded-2xl font-black text-xs md:text-sm hover:bg-indigo-50 transition-all shadow-xl"
                >
                  إغلاق النافذة
                </button>
              </div>
            </div>
          )}

          <div className="p-6 md:p-8 border-b border-slate-100 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-black text-slate-900">فاتورتك الذكية</h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowSuspended(!showSuspended)}
                  className={cn(
                    "relative p-2 rounded-xl transition-all",
                    showSuspended ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-400 hover:text-slate-600"
                  )}
                  title="الفواتير المعلقة"
                >
                  <Landmark className="w-5 h-5" />
                  {suspendedSales.length > 0 && (
                    <span className="absolute -top-1 -left-1 w-5 h-5 bg-amber-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                      {suspendedSales.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {showSuspended && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-800">الفواتير المعلقة</span>
                  <button onClick={() => setShowSuspended(false)} className="text-amber-400 hover:text-amber-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                  {suspendedSales.length === 0 ? (
                    <p className="text-center text-[10px] text-amber-400 font-bold py-2">لا توجد فواتير معلقة</p>
                  ) : (
                    suspendedSales.map(sale => (
                      <div key={sale.id} className="flex items-center justify-between p-2 bg-white rounded-xl border border-amber-100 hover:border-amber-300 transition-all group">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-900">{sale.customerName}</span>
                          <span className="text-[8px] font-bold text-slate-400">{sale.items.length} منتجات - {sale.total.toLocaleString()} ر.س</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleResume(sale)}
                            className="px-3 py-1 bg-amber-500 text-white text-[8px] font-black rounded-lg hover:bg-amber-600 transition-all"
                          >
                            استرجاع
                          </button>
                          <button 
                            onClick={() => onDeleteSale(sale.id)}
                            className="p-1 text-red-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <select 
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full pr-12 md:pr-14 pl-5 md:pl-6 py-4 md:py-5 bg-slate-50/50 border border-slate-100 rounded-2xl md:rounded-[2rem] text-sm md:text-base font-black outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 appearance-none shadow-sm transition-all cursor-pointer text-slate-700"
                >
                  <option value="">عميل نقدي (Walk-in)</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="relative group">
                <div className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <Search className="w-5 h-5" />
                </div>
                <input 
                  type="text"
                  placeholder="البحث عن منتج أو مسح الباركود..."
                  className="w-full pr-12 md:pr-14 pl-5 md:pl-6 py-4 md:py-5 bg-slate-50/50 border border-slate-100 rounded-2xl md:rounded-[2rem] text-sm md:text-base font-black outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-sm transition-all text-slate-700 placeholder:text-slate-400"
                  value={cartSearchTerm}
                  onChange={(e) => setCartSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} // Delay to allow click on item
                />
                {isSearchFocused && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[80] max-h-60 overflow-y-auto custom-scrollbar">
                    {filteredCartProducts.map(product => (
                      <button
                        key={product.id}
                        onClick={() => {
                          addToCart(product);
                          setCartSearchTerm('');
                        }}
                        className="w-full flex items-center gap-4 p-4 hover:bg-indigo-50 transition-colors text-right border-b border-slate-50 last:border-0"
                      >
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-400 text-xs">
                          {product.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-black text-slate-900 truncate">{product.name}</div>
                          <div className="text-xs font-bold text-indigo-500">{product.price.toLocaleString()} ر.س</div>
                        </div>
                        <Plus className="w-5 h-5 text-indigo-600" />
                      </button>
                    ))}
                    {filteredCartProducts.length === 0 && (
                      <div className="p-4 text-center text-xs text-slate-400 font-bold">لا توجد نتائج</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 md:space-y-8 pr-4 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {cart.map(item => (
                <motion.div 
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-4 md:gap-6 group animate-in slide-in-from-left-4 duration-300"
                >
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm text-xs md:text-base">
                    {item.productName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-xs md:text-sm font-black text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">{item.productName}</div>
                      <button 
                        onClick={() => toggleCostVisibility(item.productId)}
                        className={cn(
                          "p-1 rounded-lg transition-all",
                          visibleCosts.has(item.productId) ? "bg-indigo-100 text-indigo-600" : "text-slate-300 hover:text-slate-500"
                        )}
                        title="إظهار التكلفة"
                      >
                        {visibleCosts.has(item.productId) ? <Eye className="w-3 h-3 md:w-4 md:h-4" /> : <EyeOff className="w-3 h-3 md:w-4 md:h-4" />}
                      </button>
                    </div>
                    <div className="flex flex-col gap-1 mt-0.5 md:mt-1">
                      <div className="flex items-center gap-2">
                        <input 
                          type="number"
                          value={item.price}
                          onChange={(e) => updateItemPrice(item.productId, Number(e.target.value))}
                          className="w-20 text-[10px] md:text-xs font-bold text-indigo-500 bg-transparent border-b border-transparent hover:border-indigo-200 focus:border-indigo-500 outline-none transition-all"
                        />
                        <span className="text-[10px] md:text-xs font-bold text-indigo-500">ر.س</span>
                        {item.discountAmount ? (
                          <div className="text-[8px] md:text-[10px] font-bold text-red-400 line-through">{(item.price * item.quantity).toLocaleString()}</div>
                        ) : null}
                      </div>
                      {visibleCosts.has(item.productId) && (
                        <div className="text-[8px] md:text-[10px] font-bold text-slate-400 flex items-center gap-1 animate-in fade-in slide-in-from-right-2 duration-300">
                          <span>التكلفة:</span>
                          <span>{products.find(p => p.id === item.productId)?.purchasePrice?.toLocaleString() || 0} ر.س</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center bg-slate-50 rounded-xl md:rounded-2xl p-1 md:p-1.5 shadow-inner border border-slate-100">
                      <button onClick={() => updateQuantity(item.productId, -1)} className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center hover:bg-white text-slate-400 hover:text-indigo-600 rounded-lg md:rounded-xl transition-all shadow-sm">
                        <Minus className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                      <input 
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItemQuantity(item.productId, Number(e.target.value))}
                        className="w-8 md:w-12 text-center text-xs md:text-sm font-black text-slate-900 bg-transparent outline-none appearance-none"
                      />
                      <button onClick={() => updateQuantity(item.productId, 1)} className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center hover:bg-white text-slate-400 hover:text-indigo-600 rounded-lg md:rounded-xl transition-all shadow-sm">
                        <Plus className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <button 
                        onClick={() => setActiveItemForDiscount(activeItemForDiscount === item.productId ? null : item.productId)}
                        className="px-3 py-1 bg-slate-100 text-[8px] md:text-[10px] font-black text-slate-500 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                      >
                        خصم
                      </button>
                      {activeItemForDiscount === item.productId && (
                        <input 
                          type="number"
                          autoFocus
                          value={item.discountAmount || ''}
                          onChange={(e) => updateItemDiscount(item.productId, 'amount', Number(e.target.value))}
                          className="w-16 text-[8px] md:text-[10px] p-1 bg-white border border-indigo-200 rounded text-center font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      )}
                      <span className="text-[8px] md:text-[10px] font-black text-slate-400">ر.س</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.productId)} 
                    className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg md:rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {cart.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-6 md:space-y-8 py-16 md:py-24">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-50 rounded-[2.5rem] md:rounded-[3rem] flex items-center justify-center">
                  <ShoppingCart className="w-10 h-10 md:w-14 md:h-14 opacity-20 stroke-[1.5]" />
                </div>
                <div className="text-center">
                  <p className="text-base md:text-lg font-black text-slate-400 uppercase tracking-widest">السلة فارغة</p>
                  <p className="text-xs md:text-sm font-bold text-slate-300 mt-2">ابدأ بإضافة المنتجات للبيع</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 md:p-10 bg-slate-900 text-white space-y-6 md:space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 md:w-48 h-32 md:h-48 bg-indigo-500/20 rounded-full -mr-16 md:-mr-24 -mt-16 md:-mt-24 blur-[60px] md:blur-[80px]" />
            
            <div className="relative z-10 space-y-3 md:space-y-4">
              <div className="flex justify-between text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>المجموع الفرعي</span>
                <span className="text-white font-mono">{subtotal.toLocaleString()} ر.س</span>
              </div>
              <div className="flex justify-between items-center text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>الخصم الإجمالي</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="number"
                    value={invoiceDiscount || ''}
                    onChange={(e) => setInvoiceDiscount(Number(e.target.value))}
                    className="w-20 bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-right outline-none focus:border-indigo-500"
                    placeholder="0"
                  />
                  <span className="text-red-400 font-mono">ر.س</span>
                </div>
              </div>
              <div className="flex justify-between text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>الضريبة (15%)</span>
                <span className="text-white font-mono">{taxTotal.toLocaleString()} ر.س</span>
              </div>
              
              {showPaymentOptions && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 pt-4 border-t border-white/10"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest">توزيع الدفع</span>
                    <span className={cn(
                      "text-xs font-bold",
                      remainingAmount > 0 ? 'text-red-400' : 'text-emerald-400'
                    )}>
                      المتبقي: {remainingAmount.toLocaleString()} ر.س
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {PAYMENT_METHODS.map(method => {
                      const isSelected = payments.some(p => p.method === method.id);
                      return (
                        <button 
                          key={method.id}
                          onClick={() => addPayment(method.id)}
                          className={cn(
                            "flex flex-col items-center gap-1 p-2 rounded-lg border transition-all",
                            isSelected 
                              ? 'border-indigo-500 bg-indigo-500/20 text-white' 
                              : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
                          )}
                        >
                          <method.icon className="w-4 h-4" />
                          <span className="text-[7px] font-black">{method.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  {payments.length > 0 && (
                    <div className="space-y-2">
                      {payments.map(p => (
                        <div key={p.method} className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
                          <span className="text-[8px] font-black flex-1">{PAYMENT_METHODS.find(m => m.id === p.method)?.label}</span>
                          <input 
                            type="number"
                            value={p.amount}
                            onChange={(e) => updatePaymentAmount(p.method, Number(e.target.value))}
                            className="w-20 bg-transparent border-b border-white/20 text-white text-right text-[10px] outline-none"
                          />
                          <button onClick={() => removePayment(p.method)} className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              <div className="h-[1px] bg-white/10 my-4 md:my-6" />
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[9px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-0.5 md:mb-1">الإجمالي النهائي</span>
                  <span className="text-2xl md:text-4xl font-black tracking-tighter">{total.toLocaleString()} <span className="text-xs md:text-sm font-bold">ر.س</span></span>
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={handleSuspend}
                    disabled={cart.length === 0}
                    className="text-[8px] md:text-[10px] font-black text-white bg-amber-500 px-4 py-2 rounded-xl uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
                  >
                    تعليق
                  </button>
                  <button 
                    onClick={handleCancel}
                    disabled={cart.length === 0}
                    className="text-[8px] md:text-[10px] font-black text-white bg-red-500 px-4 py-2 rounded-xl uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 md:gap-4 relative z-10">
              <button 
                onClick={() => {
                  if (showPaymentOptions) {
                    handleCheckout();
                  } else {
                    handleCheckout([{ method: 'cash', amount: total }]);
                  }
                }}
                disabled={cart.length === 0 || (showPaymentOptions && remainingAmount > 0)}
                className="flex-[2] bg-emerald-500 text-white py-4 md:py-6 rounded-2xl md:rounded-3xl font-black text-sm md:text-lg hover:bg-emerald-600 transition-all shadow-2xl shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] group"
              >
                <span className="flex items-center justify-center gap-2 md:gap-3">
                  {showPaymentOptions ? 'إتمام العملية' : 'دفع كاش وطباعة'}
                  <Printer className="w-4 h-4 md:w-6 md:h-6 group-hover:rotate-12 transition-transform" />
                </span>
              </button>
              <button 
                onClick={() => setShowPaymentOptions(!showPaymentOptions)}
                disabled={cart.length === 0}
                className={cn(
                  "flex-1 py-4 md:py-6 rounded-2xl md:rounded-3xl font-black text-xs md:text-sm transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] group",
                  showPaymentOptions ? "bg-white text-indigo-600" : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/40"
                )}
              >
                <span className="flex items-center justify-center gap-2">
                  {showPaymentOptions ? 'إلغاء التوزيع' : 'دفع مخصص'}
                  <CreditCard className="w-4 h-4" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>



      {/* Hidden Receipt for Printing */}
      <div className="print:block hidden">
        {lastSale && <Receipt sale={lastSale} />}
      </div>
    </div>
  );
};
