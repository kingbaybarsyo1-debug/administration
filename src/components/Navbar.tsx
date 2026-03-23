import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  LogOut,
  Truck,
  Monitor,
  RotateCcw,
  User as UserIcon,
  Menu,
  X,
  Settings,
  ChevronDown
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useData } from '../hooks/useData';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lowStockCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, lowStockCount }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { storeSettings } = useData();

  const menuItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
    { id: 'pos', label: 'نقطة البيع', icon: Monitor },
    { id: 'inventory', label: 'المخزون', icon: Package, badge: lowStockCount > 0 ? lowStockCount : null },
    { id: 'receipts', label: 'المشتريات', icon: Truck },
    { id: 'sales', label: 'المبيعات', icon: ShoppingCart },
    { id: 'vouchers', label: 'السندات', icon: RotateCcw },
    { id: 'returns', label: 'المرتجعات', icon: RotateCcw },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
    { id: 'reports', label: 'التقارير', icon: BarChart3 },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:flex w-full bg-white/80 backdrop-blur-xl text-slate-900 sticky top-0 z-50 border-b border-slate-200/50 px-8 py-3">
        <div className="max-w-[1600px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-black tracking-tight whitespace-nowrap text-slate-900">{storeSettings.name}</h1>
              <span className="text-[9px] text-indigo-600 font-bold tracking-widest uppercase">نظام إدارة المبيعات</span>
            </div>
          </div>

          <nav className="flex items-center gap-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all duration-300 group relative",
                  activeTab === item.id 
                    ? "text-indigo-600 bg-indigo-50" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-all duration-300",
                  activeTab === item.id ? "scale-110" : "group-hover:scale-110"
                )} />
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-bold tracking-wide">{item.label}</span>
                  <ChevronDown className="w-2.5 h-2.5 opacity-50" />
                </div>
                {item.badge && (
                  <span className="absolute top-1 left-2 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="h-8 w-[1px] bg-slate-200 mx-2" />
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300 text-sm font-bold group">
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden w-full bg-white text-slate-900 flex items-center justify-between px-6 py-4 sticky top-0 z-50 border-b border-slate-100 shadow-sm">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2.5 bg-slate-50 rounded-xl text-slate-500 hover:text-indigo-600 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <h1 className="text-lg font-black tracking-tight text-slate-900">{storeSettings.name}</h1>
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <ShoppingCart className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-white animate-in fade-in duration-300">
          <div className="flex flex-col h-full p-8">
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-black text-slate-900">القائمة الرئيسية</h1>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-5 rounded-[1.5rem] transition-all duration-300 text-right",
                    activeTab === item.id 
                      ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-lg font-black flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="w-6 h-6 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-8 border-t border-slate-100">
              <button className="w-full flex items-center gap-4 p-5 rounded-[1.5rem] text-red-500 hover:bg-red-50 transition-all text-right">
                <LogOut className="w-6 h-6" />
                <span className="text-lg font-black">تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
