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
  ArrowDownLeft
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Voucher {
  id: string;
  type: 'receipt' | 'payment';
  date: string;
  amount: number;
  customerName: string;
  description: string;
  paymentMethod: string;
}

export const Vouchers: React.FC = () => {
  const [vouchers] = useState<Voucher[]>([
    { id: 'V-001', type: 'receipt', date: '2024-03-20', amount: 1500, customerName: 'أحمد محمد', description: 'دفعة من الحساب', paymentMethod: 'cash' },
    { id: 'V-002', type: 'payment', date: '2024-03-21', amount: 500, customerName: 'شركة التوريد', description: 'سداد فاتورة مشتريات', paymentMethod: 'bank_transfer' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 text-right" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">السندات المالية</h2>
          <p className="text-slate-500 font-medium mt-1">إدارة سندات القبض والصرف</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all">
            <Plus className="w-5 h-5" />
            سند قبض
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-rose-600 text-white font-black rounded-2xl shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all">
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
          <div className="text-2xl font-black text-slate-900">1,500 ر.س</div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-6">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">إجمالي المدفوعات</div>
          <div className="text-2xl font-black text-slate-900">500 ر.س</div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">صافي الحركة</div>
          <div className="text-2xl font-black text-slate-900">1,000 ر.س</div>
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
              {vouchers.map((voucher) => (
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
    </div>
  );
};
