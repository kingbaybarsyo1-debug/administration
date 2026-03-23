import React, { useState } from 'react';
import { Plus, Search, ShoppingCart, Trash2, CheckCircle2, Banknote, CreditCard, Landmark, Smartphone, ChevronDown, ChevronUp, X, Printer, AlertCircle } from 'lucide-react';
import { Product, Customer, Sale, SaleItem, Payment } from '../types';
import { Receipt } from './Receipt';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SalesProps {
  sales: Sale[];
  products: Product[];
  customers: Customer[];
  onAddSale: (sale: Omit<Sale, 'id' | 'date'>) => void;
}

const PAYMENT_ICONS: Record<Payment['method'], React.ReactNode> = {
  cash: <Banknote className="w-3 h-3" />,
  card: <CreditCard className="w-3 h-3" />,
  bank_transfer: <Landmark className="w-3 h-3" />,
  mobile_payment: <Smartphone className="w-3 h-3" />,
};

const PAYMENT_LABELS: Record<Payment['method'], string> = {
  cash: 'نقدي',
  card: 'بطاقة',
  bank_transfer: 'تحويل',
  mobile_payment: 'جوال',
};

export const Sales: React.FC<SalesProps> = ({ sales, products, customers, onAddSale }) => {
  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [expandedSaleId, setExpandedSaleId] = useState<string | null>(null);
  const [saleToPrint, setSaleToPrint] = useState<Sale | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedSaleId(expandedSaleId === id ? null : id);
  };

  const handlePrint = (sale: Sale) => {
    setSaleToPrint(sale);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { productId: product.id, productName: product.name, quantity: 1, price: product.price }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => {
    const name = p.name || '';
    const sku = p.sku || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           sku.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSubmit = () => {
    if (!selectedCustomer || cart.length === 0) return;
    const customer = customers.find(c => c.id === selectedCustomer);
    onAddSale({
      customerId: selectedCustomer,
      customerName: customer?.name || '',
      items: cart,
      total,
      status: 'completed',
      payments: [{ method: 'cash', amount: total }] // Default to cash for manual sales
    });
    setIsNewSaleModalOpen(false);
    setCart([]);
    setSelectedCustomer('');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">سجل المبيعات</h2>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-1">تتبع الفواتير والعمليات الشرائية والمدفوعات</p>
        </div>
        <button 
          onClick={() => setIsNewSaleModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-sm hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          إنشاء فاتورة جديدة
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-right min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">رقم الفاتورة</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">العميل</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">التاريخ</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">طريقة الدفع</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الإجمالي</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sales.map((sale) => (
                <React.Fragment key={sale.id}>
                  <tr 
                    onClick={() => toggleExpand(sale.id)}
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-3 font-mono text-xs md:text-sm text-indigo-600 font-black">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                          {expandedSaleId === sale.id ? <ChevronUp className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                        </div>
                        #{sale.id.slice(-6).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors text-xs md:text-base">{sale.customerName}</div>
                      <div className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">عميل مسجل</div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="text-xs md:text-sm font-bold text-slate-500 bg-slate-50 px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl w-fit">
                        {sale.date}
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {sale.payments?.map((p, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1.5 md:gap-2 text-[9px] md:text-[10px] font-black bg-white border border-slate-100 text-slate-600 px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl shadow-sm">
                            <span className="text-indigo-500">{PAYMENT_ICONS[p.method]}</span>
                            {PAYMENT_LABELS[p.method]}
                          </span>
                        )) || (
                          <span className="text-[10px] md:text-xs text-slate-400 italic">غير محدد</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-1 font-black text-slate-900 text-sm md:text-lg">
                        {sale.total.toLocaleString()}
                        <span className="text-[9px] md:text-[10px] text-slate-400">ر.س</span>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex justify-end">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 md:gap-2 text-[9px] md:text-[10px] font-black px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl uppercase tracking-widest shadow-sm",
                          sale.status === 'completed' ? 'bg-emerald-50 text-emerald-600 shadow-emerald-500/5' :
                          sale.status === 'suspended' ? 'bg-amber-50 text-amber-600 shadow-amber-500/5' :
                          'bg-red-50 text-red-600 shadow-red-500/5'
                        )}>
                          {sale.status === 'completed' && <CheckCircle2 className="w-3 md:w-3.5 h-3 md:h-3.5" />}
                          {sale.status === 'suspended' && <AlertCircle className="w-3 md:w-3.5 h-3 md:h-3.5" />}
                          {sale.status === 'completed' ? 'مكتمل' : 
                           sale.status === 'suspended' ? 'معلق' : 'ملغي'}
                        </span>
                      </div>
                    </td>
                  </tr>
                  {expandedSaleId === sale.id && (
                    <tr className="bg-slate-50/30 animate-in slide-in-from-top-2 duration-300">
                      <td colSpan={6} className="px-4 md:px-8 py-4 md:py-8">
                        <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 p-4 md:p-8 shadow-xl shadow-slate-200/20">
                          <div className="flex items-center justify-between mb-6 md:mb-8 border-b border-slate-50 pb-4 md:pb-6">
                            <h4 className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">تفاصيل المنتجات المباعة</h4>
                            <div className="text-[9px] md:text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl uppercase tracking-widest">
                              {sale.items.length} منتجات
                            </div>
                          </div>
                          <div className="space-y-4 md:space-y-6">
                            {sale.items.map((item, idx) => (
                              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 group/item">
                                <div className="flex items-center gap-4 md:gap-6">
                                  <span className="w-8 h-8 md:w-10 md:h-10 bg-slate-50 rounded-lg md:rounded-xl flex items-center justify-center text-[10px] md:text-xs font-black text-slate-400 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all duration-300">
                                    {idx + 1}
                                  </span>
                                  <div>
                                    <div className="font-black text-slate-900 group-hover/item:text-indigo-600 transition-colors text-xs md:text-base">{item.productName}</div>
                                    <div className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">ID: {item.productId.slice(-8)}</div>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-6 md:gap-16">
                                  <div className="text-left">
                                    <div className="text-[9px] md:text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">الكمية</div>
                                    <div className="font-black text-slate-700 bg-slate-50 px-2 md:px-3 py-0.5 md:py-1 rounded-lg w-fit ml-auto text-xs md:text-sm">{item.quantity}</div>
                                  </div>
                                  <div className="text-left">
                                    <div className="text-[9px] md:text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">سعر الوحدة</div>
                                    <div className="font-black text-slate-700 text-xs md:text-sm">{item.price.toLocaleString()} <span className="text-[9px] md:text-[10px] text-slate-400">ر.س</span></div>
                                  </div>
                                  <div className="text-left w-24 md:w-40">
                                    <div className="text-[9px] md:text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">المجموع الفرعي</div>
                                    <div className="font-black text-indigo-600 text-sm md:text-lg">{(item.price * item.quantity).toLocaleString()} <span className="text-[9px] md:text-[10px] text-indigo-400">ر.س</span></div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-6">
                            <div className="flex gap-3 md:gap-4 w-full sm:w-auto">
                              <button 
                                onClick={() => handlePrint(sale)}
                                className="flex-1 sm:px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] md:text-xs hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2"
                              >
                                <Printer className="w-4 h-4" />
                                طباعة الفاتورة
                              </button>
                              {sale.status === 'suspended' && (
                                <button 
                                  className="flex-1 sm:px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] md:text-xs hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
                                >
                                  استكمال البيع
                                </button>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <span>المجموع الفرعي:</span>
                                <span className="text-slate-900">{(sale.subtotal || 0).toLocaleString()} ر.س</span>
                              </div>
                              <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <span>الخصم:</span>
                                <span className="text-red-500">{(sale.discountTotal || 0).toLocaleString()} ر.س</span>
                              </div>
                              <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <span>الضريبة:</span>
                                <span className="text-slate-900">{(sale.taxTotal || 0).toLocaleString()} ر.س</span>
                              </div>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">المجموع النهائي</span>
                                <span className="text-2xl md:text-3xl font-black text-slate-900">{sale.total.toLocaleString()} <span className="text-xs md:text-sm text-slate-400 font-bold">ر.س</span></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isNewSaleModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] w-full max-w-6xl max-h-[95vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">إنشاء فاتورة جديدة</h3>
                <p className="text-slate-400 text-xs md:text-sm font-medium mt-1">قم بإضافة المنتجات واختيار العميل لإتمام البيع</p>
              </div>
              <button 
                onClick={() => setIsNewSaleModalOpen(false)} 
                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl text-slate-400 hover:bg-white hover:text-slate-900 transition-all shadow-sm"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row custom-scrollbar">
              {/* Products Selection */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto border-l border-slate-100 bg-white">
                <div className="relative mb-6 md:mb-8 group">
                  <div className="absolute inset-0 bg-indigo-500/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-center bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100 p-1 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-300">
                    <div className="p-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <Search className="w-5 h-5" />
                    </div>
                    <input 
                      placeholder="البحث عن منتج بالاسم أو الرمز..." 
                      className="flex-1 bg-transparent border-none text-sm font-bold focus:ring-0 outline-none px-2 text-slate-600 placeholder:text-slate-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {filteredProducts.map(product => (
                    <button 
                      key={product.id}
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className="p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 bg-white hover:border-indigo-500 hover:bg-indigo-50/30 transition-all text-right group disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-xl hover:-translate-y-1 duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                          <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="text-base md:text-lg font-black text-slate-900">{product.price.toLocaleString()} <span className="text-[9px] md:text-[10px] text-slate-400 font-bold">ر.س</span></div>
                      </div>
                      <div className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors mb-1 text-sm md:text-base">{product.name}</div>
                      <div className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4">{product.category}</div>
                      <div className={cn(
                        "inline-flex items-center gap-2 px-2.5 md:px-3 py-1 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-tighter",
                        product.stock <= 5 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                      )}>
                        المتوفر: {product.stock}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="w-full lg:w-96 bg-slate-50/50 p-6 md:p-8 flex flex-col border-r border-slate-100">
                <div className="mb-6 md:mb-8">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2 block">اختيار العميل</label>
                  <select 
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="w-full px-4 md:px-5 py-3 md:py-4 bg-white border border-slate-100 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm cursor-pointer"
                  >
                    <option value="">-- اختر عميل --</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 mb-6 md:mb-8 pr-2 custom-scrollbar min-h-[200px]">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
                    <h4 className="font-black text-slate-900 text-sm tracking-tight">سلة المشتريات</h4>
                    <span className="bg-indigo-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg">{cart.length}</span>
                  </div>
                  {cart.map(item => (
                    <div key={item.productId} className="bg-white p-4 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm group/cart-item animate-in slide-in-from-left-2 duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-black text-slate-900 text-xs md:text-sm">{item.productName}</div>
                        <button onClick={() => removeFromCart(item.productId)} className="text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-2 py-1">
                            <span className="text-[10px] font-black text-slate-400">x</span>
                            <span className="text-xs font-black text-slate-900">{item.quantity}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold">{item.price.toLocaleString()} ر.س</span>
                        </div>
                        <div className="font-black text-indigo-600 text-xs md:text-sm">{(item.price * item.quantity).toLocaleString()} ر.س</div>
                      </div>
                    </div>
                  ))}
                  {cart.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 md:py-12 text-slate-400 opacity-50">
                      <ShoppingCart className="w-10 h-10 md:w-12 md:h-12 mb-4 stroke-[1.5]" />
                      <p className="text-xs md:text-sm font-bold">السلة فارغة حالياً</p>
                    </div>
                  )}
                </div>

                <div className="mt-auto bg-white p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20 space-y-4 md:space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] md:text-xs font-bold text-slate-400">
                      <span>المجموع الفرعي</span>
                      <span>{total.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] md:text-xs font-bold text-slate-400">
                      <span>الضريبة (15%)</span>
                      <span>{(total * 0.15).toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-slate-50">
                      <span className="text-xs md:text-sm font-black text-slate-900">الإجمالي النهائي</span>
                      <span className="text-2xl md:text-3xl font-black text-indigo-600 tracking-tighter">{(total * 1.15).toLocaleString()} <span className="text-[10px] md:text-xs text-indigo-400 font-bold">ر.س</span></span>
                    </div>
                  </div>
                  <button 
                    onClick={handleSubmit}
                    disabled={!selectedCustomer || cart.length === 0}
                    className="w-full bg-indigo-600 text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-xs md:text-sm hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    تأكيد وإصدار الفاتورة
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Receipt for Printing */}
      <div className="hidden print:block">
        {saleToPrint && <Receipt sale={saleToPrint} />}
      </div>
    </div>
  );
};
