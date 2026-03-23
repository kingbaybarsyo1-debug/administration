import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Users as UsersIcon, 
  AlertTriangle,
  User as UserIcon,
  Package,
  Eye,
  ShoppingCart,
  Activity,
  Monitor,
  BarChart3,
  Truck,
  RotateCcw
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { DashboardStats } from '../types';

interface DashboardProps {
  stats: DashboardStats;
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, onNavigate }) => {
  const today = new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const statCards = [
    { label: 'إجمالي المبيعات', value: `${stats.totalSales.toLocaleString()} ر.س`, icon: ShoppingBag, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'إجمالي المشتريات', value: `${(stats.totalPurchases || 0).toLocaleString()} ر.س`, icon: Truck, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'إجمالي المرتجعات', value: `${(stats.totalReturns || 0).toLocaleString()} ر.س`, icon: RotateCcw, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'عدد الفواتير', value: stats.totalOrders.toLocaleString(), icon: Eye, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-1000 p-2 md:p-6 lg:p-10">
      {/* Welcome Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">لوحة التحكم الرئيسية</h2>
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
          <span>{today}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {statCards.map((card, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl border border-slate-100 p-8 flex items-center justify-between group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
          >
            <div className="flex flex-col items-start">
              <span className="text-slate-900 text-2xl font-black mb-1">{card.value}</span>
              <h3 className="text-slate-400 text-sm font-bold tracking-wide">{card.label}</h3>
            </div>
            <div className={`${card.bg} p-4 rounded-2xl ${card.color} group-hover:scale-110 transition-transform duration-500`}>
              <card.icon className="w-7 h-7" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => onNavigate('pos')}
          className="group relative overflow-hidden bg-gradient-to-br from-indigo-600 to-indigo-800 p-10 rounded-[2.5rem] text-white shadow-xl shadow-indigo-500/20 hover:shadow-2xl transition-all duration-500"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-colors"></div>
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="bg-white/20 p-5 rounded-3xl backdrop-blur-md">
              <Monitor className="w-10 h-10" />
            </div>
            <span className="text-2xl font-black tracking-tight">نقطة بيع سريعة</span>
          </div>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => onNavigate('reports')}
          className="group relative overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-800 p-10 rounded-[2.5rem] text-white shadow-xl shadow-emerald-500/20 hover:shadow-2xl transition-all duration-500"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-colors"></div>
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="bg-white/20 p-5 rounded-3xl backdrop-blur-md">
              <BarChart3 className="w-10 h-10" />
            </div>
            <span className="text-2xl font-black tracking-tight">تقرير المبيعات</span>
          </div>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          onClick={() => onNavigate('sales')}
          className="group relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-950 p-10 rounded-[2.5rem] text-white shadow-xl shadow-slate-900/20 hover:shadow-2xl transition-all duration-500"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-colors"></div>
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="bg-white/20 p-5 rounded-3xl backdrop-blur-md">
              <ShoppingCart className="w-10 h-10" />
            </div>
            <span className="text-2xl font-black tracking-tight">فاتورة جديدة</span>
          </div>
        </motion.button>
      </div>

      {/* Footer Bar */}
      <div className="mt-auto pt-10 border-t border-slate-100 flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span>النظام متصل</span>
          </div>
          <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
          <span>الإصدار 3.0.0</span>
        </div>
        <div>Your Fatoora 2026 © جميع الحقوق محفوظة</div>
      </div>
    </div>
  );
};
