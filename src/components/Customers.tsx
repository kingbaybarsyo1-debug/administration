import React, { useState } from 'react';
import { Users as UsersIcon, UserPlus, Search, Phone, Mail, Calendar, DollarSign, Edit2, Trash2, MoreVertical, X } from 'lucide-react';
import { Customer } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CustomersProps {
  customers: Customer[];
  onAdd: (customer: Omit<Customer, 'id' | 'totalSpent' | 'lastOrderDate'>) => void;
  onUpdate: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

export const Customers: React.FC<CustomersProps> = ({ customers, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      onUpdate({ ...editingCustomer, ...formData });
    } else {
      onAdd(formData);
    }
    setIsModalOpen(false);
    setEditingCustomer(null);
    setFormData({ name: '', email: '', phone: '' });
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">إدارة العملاء</h2>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-1">قاعدة بيانات العملاء وسجل المشتريات والولاء</p>
        </div>
        <button 
          onClick={() => {
            setEditingCustomer(null);
            setFormData({ name: '', email: '', phone: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-sm hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 group"
        >
          <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          إضافة عميل جديد
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row gap-6">
          <div className="relative flex-1 group">
            <div className="absolute inset-0 bg-indigo-500/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 p-1 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-300">
              <div className="p-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="البحث عن عميل بالاسم أو رقم الجوال..." 
                className="flex-1 bg-transparent border-none text-sm font-bold focus:ring-0 outline-none px-2 text-slate-600 placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-right min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">العميل</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">معلومات التواصل</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">إجمالي المشتريات</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">آخر طلب</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl md:rounded-2xl flex items-center justify-center text-indigo-600 font-black group-hover:scale-110 transition-transform duration-300 text-xs md:text-base">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors text-xs md:text-base">{customer.name}</div>
                        <div className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">عميل مميز</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <div className="space-y-1 md:space-y-2">
                      <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-slate-700">
                        <Phone className="w-3 md:w-3.5 h-3 md:h-3.5 text-indigo-400" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] md:text-xs font-medium text-slate-400">
                        <Mail className="w-3 md:w-3.5 h-3 md:h-3.5 text-slate-300" />
                        {customer.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs md:text-base">
                        <DollarSign className="w-3.5 md:w-4 h-3.5 md:h-4 text-emerald-500" />
                        {customer.totalSpent.toLocaleString()} ر.س
                      </div>
                      <div className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">إجمالي المبيعات</div>
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-slate-500 bg-slate-50 px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl w-fit">
                      <Calendar className="w-3.5 md:w-4 h-3.5 md:h-4 text-slate-300" />
                      {customer.lastOrderDate || 'لا يوجد'}
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <div className="flex items-center justify-end gap-1 md:gap-2">
                      <button 
                        onClick={() => handleEdit(customer)}
                        className="p-2 md:p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg md:rounded-xl transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setCustomerToDelete(customer.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 md:p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg md:rounded-xl transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] w-full max-w-sm p-8 md:p-10 shadow-2xl animate-in zoom-in-95 duration-300 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-red-50 text-red-600 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/10">
              <Trash2 className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 tracking-tight">تأكيد الحذف</h3>
            <p className="text-sm md:text-base text-slate-500 font-medium mb-8 md:mb-10 leading-relaxed">هل أنت متأكد من رغبتك في حذف هذا العميل؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  if (customerToDelete) {
                    onDelete(customerToDelete);
                    setCustomerToDelete(null);
                    setIsDeleteModalOpen(false);
                  }
                }}
                className="flex-1 bg-red-600 text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-sm hover:bg-red-500 transition-all shadow-xl shadow-red-600/20 active:scale-95"
              >
                حذف العميل
              </button>
              <button 
                onClick={() => {
                  setCustomerToDelete(null);
                  setIsDeleteModalOpen(false);
                }}
                className="flex-1 bg-slate-100 text-slate-600 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-sm hover:bg-slate-200 transition-all active:scale-95"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 md:p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                  <UserPlus className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-black text-slate-900">{editingCustomer ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}</h3>
                  <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">يرجى إدخال كافة البيانات المطلوبة</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 md:p-3 hover:bg-white rounded-xl md:rounded-2xl transition-all text-slate-400 hover:text-slate-600 shadow-sm">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6 md:space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-6 md:gap-8">
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest px-1">اسم العميل بالكامل</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-5 md:px-6 py-4 md:py-5 bg-slate-50 border border-slate-100 rounded-xl md:rounded-[1.5rem] text-xs md:text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    placeholder="مثال: محمد أحمد علي"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest px-1">رقم الجوال</label>
                  <input 
                    type="tel" 
                    required
                    className="w-full px-5 md:px-6 py-4 md:py-5 bg-slate-50 border border-slate-100 rounded-xl md:rounded-[1.5rem] text-xs md:text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-left"
                    placeholder="05xxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest px-1">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    required
                    className="w-full px-5 md:px-6 py-4 md:py-5 bg-slate-50 border border-slate-100 rounded-xl md:rounded-[1.5rem] text-xs md:text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-left"
                    placeholder="example@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 md:pt-6 flex gap-3 md:gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 md:px-8 py-4 md:py-5 border-2 border-slate-100 text-slate-400 rounded-xl md:rounded-2xl font-black text-xs md:text-sm hover:bg-slate-50 transition-all"
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  className="flex-[2] px-6 md:px-8 py-4 md:py-5 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black text-xs md:text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                >
                  {editingCustomer ? 'حفظ التعديلات' : 'إضافة العميل'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
