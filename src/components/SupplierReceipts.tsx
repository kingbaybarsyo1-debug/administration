import React, { useState } from 'react';
import { Plus, Search, Truck, Trash2, CheckCircle2, Package, X, ChevronDown, ChevronUp } from 'lucide-react';
import Barcode from 'react-barcode';
import { Product, Supplier, SupplierReceipt, ReceiptItem } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SupplierReceiptsProps {
  receipts: SupplierReceipt[];
  products: Product[];
  suppliers: Supplier[];
  onAddReceipt: (receipt: Omit<SupplierReceipt, 'id' | 'date'>) => void;
}

export const SupplierReceipts: React.FC<SupplierReceiptsProps> = ({ receipts, products, suppliers, onAddReceipt }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [receiptItems, setReceiptItems] = useState<ReceiptItem[]>([]);
  const [expandedReceiptId, setExpandedReceiptId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => {
    const name = p.name || '';
    const sku = p.sku || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           sku.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const toggleExpand = (id: string) => {
    setExpandedReceiptId(expandedReceiptId === id ? null : id);
  };

  const addToReceipt = (product: Product) => {
    setReceiptItems(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { productId: product.id, productName: product.name, quantity: 1, costPrice: product.purchasePrice || product.price * 0.7 }]; // Use purchasePrice if available, else default to 70% of selling price
    });
  };

  const updateItem = (productId: string, field: keyof ReceiptItem, value: number) => {
    setReceiptItems(prev => prev.map(item => 
      item.productId === productId ? { ...item, [field]: value } : item
    ));
  };

  const removeFromReceipt = (productId: string) => {
    setReceiptItems(prev => prev.filter(item => item.productId !== productId));
  };

  const totalCost = receiptItems.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0);

  const handleSubmit = () => {
    if (!selectedSupplier || receiptItems.length === 0) return;
    const supplier = suppliers.find(s => s.id === selectedSupplier);
    onAddReceipt({
      supplierId: selectedSupplier,
      supplierName: supplier?.name || '',
      items: receiptItems,
      totalCost
    });
    setIsModalOpen(false);
    setReceiptItems([]);
    setSelectedSupplier('');
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">توريدات الموردين</h2>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-1">إدارة وصول البضائع وتحديث المخزون وتكاليف الشراء</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-sm hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          تسجيل توريد جديد
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-right border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">رقم التوريد</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">المورد</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">التاريخ</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">إجمالي التكلفة</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">عدد الأصناف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {receipts.map((receipt) => (
                <React.Fragment key={receipt.id}>
                  <tr 
                    onClick={() => toggleExpand(receipt.id)}
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-3 font-mono text-xs md:text-sm text-indigo-600 font-black">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                          {expandedReceiptId === receipt.id ? <ChevronUp className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                        </div>
                        #{receipt.id.slice(-6).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors text-xs md:text-base">{receipt.supplierName}</div>
                      <div className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">مورد معتمد</div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="text-xs md:text-sm font-bold text-slate-500 bg-slate-50 px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl w-fit">
                        {receipt.date}
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-1 font-black text-slate-900 text-base md:text-lg">
                        {receipt.totalCost.toLocaleString()}
                        <span className="text-[10px] text-slate-400">ر.س</span>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex justify-end">
                        <span className="inline-flex items-center gap-2 text-[9px] md:text-[10px] font-black bg-indigo-50 text-indigo-600 px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl uppercase tracking-widest shadow-sm shadow-indigo-500/5">
                          <Package className="w-3 md:w-3.5 h-3 md:h-3.5" />
                          {receipt.items.length} أصناف
                        </span>
                      </div>
                    </td>
                  </tr>
                  {expandedReceiptId === receipt.id && (
                    <tr className="bg-slate-50/30 animate-in slide-in-from-top-2 duration-300">
                      <td colSpan={5} className="px-4 md:px-8 py-4 md:py-8">
                        <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 p-4 md:p-8 shadow-xl shadow-slate-200/20 overflow-x-auto custom-scrollbar">
                          <div className="flex items-center justify-between mb-6 md:mb-8 border-b border-slate-50 pb-4 md:pb-6 min-w-[600px]">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تفاصيل الأصناف المستلمة</h4>
                            <div className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-xl uppercase tracking-widest">
                              تم التحديث في المخزن
                            </div>
                          </div>
                          <div className="space-y-4 md:space-y-6 min-w-[600px]">
                            {receipt.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between group/item">
                                <div className="flex items-center gap-4 md:gap-6">
                                  <span className="w-8 h-8 md:w-10 md:h-10 bg-slate-50 rounded-lg md:rounded-xl flex items-center justify-center text-[10px] md:text-xs font-black text-slate-400 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all duration-300">
                                    {idx + 1}
                                  </span>
                                  <div>
                                    <div className="font-black text-slate-900 group-hover/item:text-indigo-600 transition-colors text-xs md:text-base">{item.productName}</div>
                                    <div className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">ID: {item.productId.slice(-8)}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-8 md:gap-16">
                                  <div className="text-left">
                                    <div className="text-[9px] md:text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">الكمية المستلمة</div>
                                    <div className="font-black text-slate-700 bg-slate-50 px-2.5 md:px-3 py-1 rounded-lg w-fit ml-auto text-xs md:text-sm">+{item.quantity}</div>
                                  </div>
                                  <div className="text-left">
                                    <div className="text-[9px] md:text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">تكلفة الوحدة</div>
                                    <div className="font-black text-slate-700 text-xs md:text-sm">{item.costPrice.toLocaleString()} <span className="text-[10px] text-slate-400">ر.س</span></div>
                                  </div>
                                  <div className="text-left w-32 md:w-40">
                                    <div className="text-[9px] md:text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">المجموع الفرعي</div>
                                    <div className="font-black text-indigo-600 text-base md:text-lg">{(item.costPrice * item.quantity).toLocaleString()} <span className="text-[10px] text-indigo-400">ر.س</span></div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 min-w-[600px]">
                            <button className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">طباعة سند الاستلام</button>
                            <div className="flex items-center gap-4">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">إجمالي تكلفة التوريد</span>
                              <span className="text-2xl md:text-3xl font-black text-slate-900">{receipt.totalCost.toLocaleString()} <span className="text-xs md:text-sm text-slate-400 font-bold">ر.س</span></span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {receipts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-300">
                      <Truck className="w-16 h-16 mb-4 stroke-[1.5]" />
                      <p className="text-lg font-black">لا توجد سجلات توريد حالياً</p>
                      <p className="text-sm font-medium mt-1">ابدأ بإضافة أول توريد بضاعة من الموردين</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] w-full max-w-6xl max-h-[95vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden relative custom-scrollbar">
            <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                  <Truck className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">تسجيل توريد بضاعة</h3>
                  <p className="text-slate-400 text-xs md:text-sm font-medium mt-1">قم باختيار المورد وإضافة المنتجات المستلمة</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl text-slate-400 hover:bg-white hover:text-slate-900 transition-all shadow-sm"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
              {/* Products Selection */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto border-l border-slate-100 bg-white custom-scrollbar">
                <div className="relative mb-6 md:mb-8 group">
                  <div className="absolute inset-0 bg-indigo-500/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-center bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100 p-1 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-300">
                    <div className="p-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <Search className="w-5 h-5" />
                    </div>
                    <input 
                      placeholder="البحث عن منتج لإضافته للتوريد..." 
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
                      onClick={() => addToReceipt(product)}
                      className="p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 bg-white hover:border-indigo-500 hover:bg-indigo-50/30 transition-all text-right group shadow-sm hover:shadow-xl hover:-translate-y-1 duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                          <Package className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">SKU: {product.sku}</div>
                          <div className="bg-white p-0.5 rounded border border-slate-100 shadow-sm">
                            <Barcode 
                              value={product.sku} 
                              width={0.4} 
                              height={12} 
                              fontSize={6} 
                              margin={0}
                              background="transparent"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors mb-1 text-sm md:text-base">{product.name}</div>
                      <div className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4">{product.category}</div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black bg-slate-50 text-slate-600 uppercase tracking-tighter">
                        المخزون الحالي: {product.stock}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Receipt Summary */}
              <div className="w-full lg:w-96 bg-slate-50/50 p-6 md:p-8 flex flex-col border-r border-slate-100 overflow-y-auto lg:overflow-visible custom-scrollbar">
                <div className="mb-6 md:mb-8">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2 block">اختيار المورد</label>
                  <select 
                    value={selectedSupplier}
                    onChange={(e) => setSelectedSupplier(e.target.value)}
                    className="w-full px-4 md:px-5 py-3 md:py-4 bg-white border border-slate-100 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm cursor-pointer"
                  >
                    <option value="">-- اختر المورد --</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 mb-6 md:mb-8 pr-2 custom-scrollbar min-h-[200px] lg:min-h-0">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4 sticky top-0 bg-slate-50/50 z-10">
                    <h4 className="font-black text-slate-900 text-sm tracking-tight">الأصناف المستلمة</h4>
                    <span className="bg-indigo-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg">{receiptItems.length}</span>
                  </div>
                  {receiptItems.map(item => (
                    <div key={item.productId} className="bg-white p-4 md:p-5 rounded-[1.25rem] md:rounded-[1.5rem] border border-slate-100 shadow-sm group/cart-item animate-in slide-in-from-left-2 duration-300 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="font-black text-slate-900 text-xs md:text-sm">{item.productName}</div>
                        <button onClick={() => removeFromReceipt(item.productId)} className="text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div>
                          <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">الكمية</label>
                          <input 
                            type="number" 
                            value={item.quantity}
                            onChange={(e) => updateItem(item.productId, 'quantity', Number(e.target.value))}
                            className="w-full px-3 py-2 bg-slate-50 border-none rounded-lg md:rounded-xl text-[10px] md:text-xs font-black outline-none focus:ring-2 focus:ring-indigo-500/20"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">تكلفة الوحدة</label>
                          <input 
                            type="number" 
                            value={item.costPrice}
                            onChange={(e) => updateItem(item.productId, 'costPrice', Number(e.target.value))}
                            className="w-full px-3 py-2 bg-slate-50 border-none rounded-lg md:rounded-xl text-[10px] md:text-xs font-black outline-none focus:ring-2 focus:ring-indigo-500/20"
                          />
                        </div>
                      </div>
                      <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
                        <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">المجموع</span>
                        <span className="font-black text-indigo-600 text-xs md:text-sm">{(item.costPrice * item.quantity).toLocaleString()} ر.س</span>
                      </div>
                    </div>
                  ))}
                  {receiptItems.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400 opacity-50">
                      <Package className="w-12 h-12 mb-4 stroke-[1.5]" />
                      <p className="text-sm font-bold">لم يتم اختيار أصناف بعد</p>
                    </div>
                  )}
                </div>

                <div className="mt-auto bg-white p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20 space-y-4 md:space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm font-black text-slate-900">إجمالي التكلفة</span>
                    <span className="text-2xl md:text-3xl font-black text-indigo-600 tracking-tighter">{totalCost.toLocaleString()} <span className="text-[10px] md:text-xs text-indigo-400 font-bold">ر.س</span></span>
                  </div>
                  <button 
                    onClick={handleSubmit}
                    disabled={!selectedSupplier || receiptItems.length === 0}
                    className="w-full bg-indigo-600 text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-xs md:text-sm hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    تأكيد استلام التوريد
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
