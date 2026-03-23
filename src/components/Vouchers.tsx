import React, { useState } from 'react';
import { 
  RotateCcw, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  DollarSign, 
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useData } from '../hooks/useData';
import { Voucher } from '../types';

export const Vouchers: React.FC = () => {
  const { vouchers, addVoucher } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [voucherType, setVoucherType] = useState<'receipt' | 'payment'>('receipt');
  
  const [newVoucher, setNewVoucher] = useState({
    customerName: '',
    amount: '',
    description: '',
    paymentMethod: 'cash'
  });

  const handleAddVoucher = (type: 'receipt' | 'payment') => {
    setVoucherType(type);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVoucher({
      type: voucherType,
      amount: Number(newVoucher.amount),
      customerName: newVoucher.customerName,
      description: newVoucher.description,
      paymentMethod: newVoucher.paymentMethod
    });
    setShowModal(false);
    setNewVoucher({
      customerName: '',
      amount: '',
      description: '',
      paymentMethod: 'cash'
    });
  };

  const totalReceipts = vouchers.filter(v => v.type === 'receipt').reduce((sum, v) => sum + v.amount, 0);
  const totalPayments = vouchers.filter(v => v.type === 'payment').reduce((sum, v) => sum + v.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 text-right" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">السندات المالية</h2>
          <p className="text-slate-500 font-medium mt-1">إدارة سندات القبض والصرف</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => handleAddVoucher('receipt')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            سند قبض
          </button>
          <button 
            onClick={() => handleAddVoucher('payment')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-rose-600 text-white font-black rounded-2xl shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            سند صرف
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
          <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">إجمالي المقبوضات</div>
          <div className="text-2xl font-black text-slate-900">{totalReceipts.toLocaleString()} ر.س</div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-6">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">إجمالي المدفوعات</div>
          <div className="text-2xl font-black text-slate-900">{totalPayments.toLocaleString()} ر.س</div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">صافي الحركة</div>
          <div className="text-2xl font-black text-slate-900">{(totalReceipts - totalPayments).toLocaleString()} ر.س</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="بحث في السندات..."
            className="w-full pr-12 pl-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-50 text-slate-600 font-black rounded-2xl hover:bg-slate-100 transition-all">
          <Filter className="w-5 h-5" />
          تصفية
        </button>
        <button className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-50 text-slate-600 font-black rounded-2xl hover:bg-slate-100 transition-all">
          <Calendar className="w-5 h-5" />
          التاريخ
        </button>
      </div>

      {/* Vouchers Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-6 text-slate-400 font-black text-xs uppercase tracking-widest">رقم السند</th>
                <th className="px-8 py-6 text-slate-400 font-black text-xs uppercase tracking-widest">النوع</th>
                <th className="px-8 py-6 text-slate-400 font-black text-xs uppercase tracking-widest">التاريخ</th>
                <th className="px-8 py-6 text-slate-400 font-black text-xs uppercase tracking-widest">البيان</th>
                <th className="px-8 py-6 text-slate-400 font-black text-xs uppercase tracking-widest">المبلغ</th>
                <th className="px-8 py-6 text-slate-400 font-black text-xs uppercase tracking-widest">طريقة الدفع</th>
                <th className="px-8 py-6 text-slate-400 font-black text-xs uppercase tracking-widest">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {vouchers.filter(v => 
                v.customerName.includes(searchTerm) || 
                v.description.includes(searchTerm) ||
                v.id.includes(searchTerm)
              ).map((voucher) => (
                <motion.tr 
                  key={voucher.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <span className="font-black text-slate-900">#{voucher.id}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      voucher.type === 'receipt' 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-rose-50 text-rose-600'
                    }`}>
                      {voucher.type === 'receipt' ? 'سند قبض' : 'سند صرف'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-slate-500 font-medium">{voucher.date}</td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900">{voucher.customerName}</span>
                      <span className="text-xs text-slate-400">{voucher.description}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`font-black ${
                      voucher.type === 'receipt' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {voucher.amount.toLocaleString()} ر.س
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-slate-500 font-medium">
                      {voucher.paymentMethod === 'cash' ? 'نقدي' : 'تحويل بنكي'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors">
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Voucher Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">
                    إضافة {voucherType === 'receipt' ? 'سند قبض' : 'سند صرف'}
                  </h3>
                  <p className="text-slate-500 font-medium mt-1">أدخل تفاصيل السند المالي</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pr-2">الاسم / الجهة</label>
                    <div className="relative">
                      <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        required
                        type="text"
                        className="w-full pr-12 pl-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                        placeholder="اسم العميل أو المورد"
                        value={newVoucher.customerName}
                        onChange={(e) => setNewVoucher({...newVoucher, customerName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pr-2">المبلغ</label>
                    <div className="relative">
                      <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        required
                        type="number"
                        className="w-full pr-12 pl-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                        placeholder="0.00"
                        value={newVoucher.amount}
                        onChange={(e) => setNewVoucher({...newVoucher, amount: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pr-2">طريقة الدفع</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setNewVoucher({...newVoucher, paymentMethod: 'cash'})}
                      className={`py-4 rounded-2xl font-black transition-all ${
                        newVoucher.paymentMethod === 'cash' 
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      نقدي
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewVoucher({...newVoucher, paymentMethod: 'bank_transfer'})}
                      className={`py-4 rounded-2xl font-black transition-all ${
                        newVoucher.paymentMethod === 'bank_transfer' 
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      تحويل بنكي
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pr-2">البيان / الوصف</label>
                  <textarea
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium min-h-[100px]"
                    placeholder="تفاصيل إضافية عن السند..."
                    value={newVoucher.description}
                    onChange={(e) => setNewVoucher({...newVoucher, description: e.target.value})}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    حفظ السند
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 bg-slate-50 text-slate-600 font-black rounded-2xl hover:bg-slate-100 transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
