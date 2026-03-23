import React, { useState } from 'react';
import { Search, RotateCcw, Trash2, CheckCircle2, AlertCircle, ShoppingBag, X, ChevronRight, Minus, Plus, Printer } from 'lucide-react';
import { Sale, SaleReturn, ReturnItem } from '../types';
import { ReturnReceipt } from './ReturnReceipt';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ReturnsProps {
  returns: SaleReturn[];
  sales: Sale[];
  onAddReturn: (saleReturn: Omit<SaleReturn, 'id' | 'date'>) => void;
}

export const Returns: React.FC<ReturnsProps> = ({ returns, sales, onAddReturn }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState('');
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [reason, setReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [returnToPrint, setReturnToPrint] = useState<SaleReturn | null>(null);

  const selectedSale = sales.find(s => s.id === selectedSaleId);

  const handlePrint = (ret: SaleReturn) => {
    setReturnToPrint(ret);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const toggleItem = (productId: string, productName: string, price: number, maxQty: number) => {
    setReturnItems(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.filter(item => item.productId !== productId);
      }
      return [...prev, { productId, productName, price, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number, maxQty: number) => {
    const qty = Math.min(maxQty, Math.max(1, quantity));
    setReturnItems(prev => prev.map(item => 
      item.productId === productId ? { ...item, quantity: qty } : item
    ));
  };

  const refundAmount = returnItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = () => {
    if (!selectedSale || returnItems.length === 0 || !reason) return;
    
    onAddReturn({
      saleId: selectedSale.id,
      customerId: selectedSale.customerId,
      customerName: selectedSale.customerName,
      items: returnItems,
      refundAmount,
      reason,
      status: 'completed'
    });
    
    setIsModalOpen(false);
    setSelectedSaleId('');
    setReturnItems([]);
    setReason('');
  };

  const filteredReturns = returns.filter(r => {
    const id = r.id || '';
    const saleId = r.saleId || '';
    const customerName = r.customerName || '';
    return id.toLowerCase().includes(searchTerm.toLowerCase()) ||
           saleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customerName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">إدارة المرتجعات</h2>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-1">معالجة طلبات الإرجاع واسترداد الأموال للعملاء</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-sm hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 group"
        >
          <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          تسجيل مرتجع جديد
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/30">
          <div className="relative max-w-md group">
            <div className="absolute inset-0 bg-indigo-500/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 p-1 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-300">
              <div className="p-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="البحث برقم المرتجع، الفاتورة، أو العميل..." 
                className="flex-1 bg-transparent border-none text-sm font-bold focus:ring-0 outline-none px-2 text-slate-600 placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-right min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">رقم المرتجع</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">رقم الفاتورة</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">العميل</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">التاريخ</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">المبلغ المسترد</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الحالة</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredReturns.map((ret) => (
                <tr key={ret.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <span className="text-xs md:text-sm font-black text-indigo-600 bg-indigo-50 px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl">#{ret.id}</span>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <span className="text-xs md:text-sm font-bold text-slate-500">#{ret.saleId}</span>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <div className="text-xs md:text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{ret.customerName}</div>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <div className="text-xs md:text-sm font-bold text-slate-500">{ret.date}</div>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <div className="text-base md:text-lg font-black text-red-600 tracking-tighter">-{ret.refundAmount.toLocaleString()} <span className="text-[9px] md:text-[10px] font-bold">ر.س</span></div>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600">
                      <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      مكتمل
                    </span>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <div className="flex justify-end">
                      <button 
                        onClick={() => handlePrint(ret)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="طباعة الفاتورة"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReturns.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-300 space-y-4">
                      <RotateCcw className="w-12 md:w-16 h-12 md:h-16 opacity-10" />
                      <p className="text-base md:text-lg font-black text-slate-400 uppercase tracking-widest">لا توجد سجلات مرتجعات</p>
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
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] w-full max-w-5xl max-h-[95vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
            <div className="p-6 md:p-10 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/30">
                    <RotateCcw className="w-5 h-5 md:w-7 md:h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">تسجيل عملية إرجاع</h3>
                    <p className="text-slate-400 text-xs md:text-sm font-medium mt-1">اختر الفاتورة والأصناف المراد إرجاعها</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl text-slate-400 hover:bg-white hover:text-slate-900 transition-all shadow-sm"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row custom-scrollbar">
              {/* Sale Selection */}
              <div className="flex-1 p-6 md:p-10 border-l border-slate-100">
                <div className="mb-8 md:mb-10">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-3 block">ابحث عن الفاتورة</label>
                  <div className="relative group">
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <Search className="w-5 h-5" />
                    </div>
                    <select 
                      value={selectedSaleId}
                      onChange={(e) => {
                        setSelectedSaleId(e.target.value);
                        setReturnItems([]);
                      }}
                      className="w-full pr-14 pl-6 py-4 md:py-5 bg-slate-50 border border-slate-100 rounded-xl md:rounded-[1.5rem] text-xs md:text-sm font-black outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 appearance-none shadow-sm transition-all cursor-pointer"
                    >
                      <option value="">-- اختر الفاتورة من القائمة --</option>
                      {sales.map(s => (
                        <option key={s.id} value={s.id}>{s.id} - {s.customerName} ({s.total.toLocaleString()} ر.س)</option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedSale ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" />
                        أصناف الفاتورة المتاحة
                      </h4>
                      <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-lg uppercase tracking-widest">#{selectedSale.id}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {selectedSale.items.map(item => {
                        const isSelected = returnItems.some(ri => ri.productId === item.productId);
                        return (
                          <div 
                            key={item.productId}
                            onClick={() => toggleItem(item.productId, item.productName, item.price, item.quantity)}
                            className={cn(
                              "p-4 md:p-6 rounded-2xl md:rounded-[2rem] border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group",
                              isSelected 
                                ? 'border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-600/5' 
                                : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                            )}
                          >
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center font-black transition-all text-xs md:text-base",
                                isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-white'
                              )}>
                                {item.productName.charAt(0)}
                              </div>
                              <div>
                                <div className="text-sm md:text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{item.productName}</div>
                                <div className="text-[10px] md:text-xs font-bold text-slate-400 mt-1">{item.price.toLocaleString()} ر.س × {item.quantity} قطعة</div>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="flex items-center justify-end gap-4" onClick={e => e.stopPropagation()}>
                                <div className="flex flex-col items-end">
                                  <span className="text-[9px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">الكمية المرتجعة</span>
                                  <div className="flex items-center bg-white rounded-lg md:rounded-xl p-1 shadow-sm border border-indigo-100">
                                    <button onClick={() => updateQuantity(item.productId, (returnItems.find(ri => ri.productId === item.productId)?.quantity || 1) - 1, item.quantity)} className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center hover:bg-indigo-50 text-indigo-400 rounded-lg transition-all">
                                      <Minus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    </button>
                                    <input 
                                      type="number" 
                                      min="1" 
                                      max={item.quantity}
                                      value={returnItems.find(ri => ri.productId === item.productId)?.quantity || 1}
                                      onChange={(e) => updateQuantity(item.productId, Number(e.target.value), item.quantity)}
                                      className="w-10 md:w-12 bg-transparent border-none text-xs md:text-sm font-black text-center focus:ring-0 outline-none"
                                    />
                                    <button onClick={() => updateQuantity(item.productId, (returnItems.find(ri => ri.productId === item.productId)?.quantity || 1) + 1, item.quantity)} className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center hover:bg-indigo-50 text-indigo-400 rounded-lg transition-all">
                                      <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="h-48 md:h-64 flex flex-col items-center justify-center text-slate-300 space-y-4 md:space-y-6 bg-slate-50/50 rounded-2xl md:rounded-[2.5rem] border-2 border-dashed border-slate-100">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Search className="w-8 h-8 md:w-10 md:h-10 opacity-20" />
                    </div>
                    <p className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest">يرجى اختيار فاتورة لعرض الأصناف</p>
                  </div>
                )}
              </div>

              {/* Return Summary */}
              <div className="w-full lg:w-[400px] bg-slate-900 p-6 md:p-10 flex flex-col relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full -mr-24 -mt-24 blur-[80px]" />
                
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="mb-8 md:mb-10">
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest px-1 mb-3 block">سبب الإرجاع</label>
                    <textarea 
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="مثال: منتج تالف، العميل غير راضٍ..."
                      className="w-full px-5 md:px-6 py-4 md:py-5 bg-white/5 border border-white/10 rounded-xl md:rounded-[1.5rem] text-xs md:text-sm text-white font-bold outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[100px] md:min-h-[120px] resize-none placeholder:text-slate-600 transition-all"
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-4 md:space-y-6 mb-8 md:mb-10 custom-scrollbar pr-2 min-h-[150px]">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ملخص المرتجعات</h4>
                      <span className="text-[10px] font-black text-white bg-white/10 px-2 py-1 rounded-lg">{returnItems.length} أصناف</span>
                    </div>
                    {returnItems.map(item => (
                      <div key={item.productId} className="flex items-center justify-between group animate-in slide-in-from-right-4">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 md:w-8 md:h-8 bg-white/5 rounded-lg flex items-center justify-center text-[9px] md:text-[10px] font-black text-slate-400">
                            {item.quantity}
                          </div>
                          <div className="text-xs md:text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{item.productName}</div>
                        </div>
                        <span className="text-xs md:text-sm font-black text-red-400 tracking-tighter">-{ (item.price * item.quantity).toLocaleString() } ر.س</span>
                      </div>
                    ))}
                    {returnItems.length === 0 && (
                      <div className="text-center text-slate-600 py-8 md:py-12 italic text-xs md:text-sm">لم يتم اختيار أصناف للإرجاع</div>
                    )}
                  </div>

                  <div className="mt-auto pt-6 md:pt-8 border-t border-white/10 space-y-6 md:space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[9px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">المبلغ المسترد</span>
                        <span className="text-2xl md:text-4xl font-black text-white tracking-tighter">{refundAmount.toLocaleString()} <span className="text-xs md:text-sm font-bold">ر.س</span></span>
                      </div>
                      <div className="w-10 h-10 md:w-16 md:h-16 bg-red-500/10 rounded-xl md:rounded-2xl flex items-center justify-center text-red-500">
                        <RotateCcw className="w-5 h-5 md:w-8 md:h-8" />
                      </div>
                    </div>
                    <button 
                      onClick={handleSubmit}
                      disabled={!selectedSale || returnItems.length === 0 || !reason}
                      className="w-full bg-indigo-600 text-white py-4 md:py-6 rounded-xl md:rounded-2xl font-black text-sm md:text-lg hover:bg-indigo-50 transition-all shadow-2xl shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] group"
                    >
                      <span className="flex items-center justify-center gap-2 md:gap-3">
                        تأكيد عملية الإرجاع
                        <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Return Receipt for Printing */}
      <div className="hidden print:block">
        {returnToPrint && <ReturnReceipt returnRecord={returnToPrint} />}
      </div>
    </div>
  );
};
