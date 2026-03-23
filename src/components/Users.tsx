import React, { useState } from 'react';
import { User as UserIcon, Shield, Mail, Key, MoreVertical, UserPlus, Search, ShieldCheck, ShieldAlert, ShieldQuestion, Edit2, Trash2, X } from 'lucide-react';
import { User } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UsersProps {
  users: User[];
  onAdd: (user: Omit<User, 'id'>) => void;
  onUpdate: (user: User) => void;
  onDelete: (id: string) => void;
}

const ROLE_LABELS = {
  admin: 'مدير نظام',
  manager: 'مشرف',
  cashier: 'كاشير'
};

const ROLE_ICONS = {
  admin: ShieldCheck,
  manager: ShieldAlert,
  cashier: ShieldQuestion
};

const ROLE_COLORS = {
  admin: 'bg-red-50 text-red-600 border-red-100',
  manager: 'bg-amber-50 text-amber-600 border-amber-100',
  cashier: 'bg-blue-50 text-blue-600 border-blue-100'
};

export const Users: React.FC<UsersProps> = ({ users, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    name: '',
    username: '',
    email: '',
    role: 'cashier',
    status: 'active'
  });

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      onUpdate({ ...formData, id: editingUser.id });
    } else {
      onAdd(formData);
    }
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ name: '', username: '', email: '', role: 'cashier', status: 'active' });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">إدارة المستخدمين</h2>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-1">إدارة صلاحيات الوصول وحسابات الموظفين</p>
        </div>
        <button 
          onClick={() => {
            setEditingUser(null);
            setFormData({ name: '', username: '', email: '', role: 'cashier', status: 'active' });
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-sm hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 group"
        >
          <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          إضافة مستخدم جديد
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
                placeholder="البحث عن مستخدم بالاسم أو البريد..." 
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
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">المستخدم</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الدور الوظيفي</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الحالة</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">آخر ظهور</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => {
                const RoleIcon = ROLE_ICONS[user.role];
                return (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl md:rounded-2xl flex items-center justify-center text-slate-500 font-black group-hover:scale-110 transition-transform duration-300 text-xs md:text-base">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors text-xs md:text-base">{user.name}</div>
                          <div className="text-[10px] md:text-xs text-slate-400 font-bold">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "p-1.5 md:p-2 rounded-lg md:rounded-xl border",
                          ROLE_COLORS[user.role]
                        )}>
                          <RoleIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </div>
                        <span className="text-xs md:text-sm font-black text-slate-700">
                          {ROLE_LABELS[user.role]}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider",
                        user.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                      )}>
                        <div className={cn("w-1 md:w-1.5 h-1 md:h-1.5 rounded-full", user.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400')} />
                        {user.status === 'active' ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="text-xs md:text-sm font-bold text-slate-500">{user.lastLogin || 'لم يسجل دخول'}</div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex items-center justify-end gap-1 md:gap-2">
                        <button 
                          onClick={() => handleEdit(user)}
                          className="p-2 md:p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg md:rounded-xl transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setUserToDelete(user.id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 md:p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg md:rounded-xl transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
            <p className="text-sm md:text-base text-slate-500 font-medium mb-8 md:mb-10 leading-relaxed">هل أنت متأكد من رغبتك في حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  if (userToDelete) {
                    onDelete(userToDelete);
                    setUserToDelete(null);
                    setIsDeleteModalOpen(false);
                  }
                }}
                className="flex-1 bg-red-600 text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-sm hover:bg-red-500 transition-all shadow-xl shadow-red-600/20 active:scale-95"
              >
                حذف المستخدم
              </button>
              <button 
                onClick={() => {
                  setUserToDelete(null);
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
                  <h3 className="text-lg md:text-xl font-black text-slate-900">{editingUser ? 'تعديل بيانات المستخدم' : 'إضافة مستخدم جديد'}</h3>
                  <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">يرجى إدخال كافة البيانات المطلوبة</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 md:p-3 hover:bg-white rounded-xl md:rounded-2xl transition-all text-slate-400 hover:text-slate-600 shadow-sm">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6 md:space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest px-1">الاسم الكامل</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-5 md:px-6 py-4 md:py-5 bg-slate-50 border border-slate-100 rounded-xl md:rounded-[1.5rem] text-xs md:text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    placeholder="أدخل الاسم الثلاثي"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest px-1">اسم المستخدم</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-5 md:px-6 py-4 md:py-5 bg-slate-50 border border-slate-100 rounded-xl md:rounded-[1.5rem] text-xs md:text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    placeholder="اسم الدخول"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest px-1">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    required
                    className="w-full px-5 md:px-6 py-4 md:py-5 bg-slate-50 border border-slate-100 rounded-xl md:rounded-[1.5rem] text-xs md:text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    placeholder="example@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest px-1">الدور الوظيفي</label>
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                    className="w-full px-5 md:px-6 py-4 md:py-5 bg-slate-50 border border-slate-100 rounded-xl md:rounded-[1.5rem] text-xs md:text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none"
                  >
                    <option value="admin">مدير نظام</option>
                    <option value="manager">مشرف</option>
                    <option value="cashier">كاشير</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 md:pt-6">
                <button 
                  type="submit"
                  className="w-full sm:flex-1 bg-indigo-600 text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-xs md:text-sm hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
                >
                  {editingUser ? 'حفظ التعديلات' : 'إنشاء الحساب'}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:px-10 bg-slate-100 text-slate-600 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-xs md:text-sm hover:bg-slate-200 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
