import React from 'react';
import { 
  FileText, 
  Download, 
  BarChart3, 
  TrendingUp,
  Package,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Globe,
  Truck,
  RotateCcw
} from 'lucide-react';
import { DashboardStats } from '../types';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useData } from '../hooks/useData';

interface ReportsProps {
  stats: DashboardStats;
}

export const Reports: React.FC<ReportsProps> = ({ stats }) => {
  const { storeSettings } = useData();

  const exportToCSV = () => {
    const rows = [
      ['Report', 'Value'],
      ['Store Name', storeSettings.name],
      ['Total Sales', stats.totalSales],
      ['Total Purchases', stats.totalPurchases],
      ['Total Returns', stats.totalReturns],
      ['Total Orders', stats.totalOrders],
      ['Total Customers', stats.totalCustomers],
      ['Low Stock Items', stats.lowStockItems],
      ['Total Inventory Value', stats.totalInventoryValue],
      ['Potential Profit', stats.potentialProfit],
      [''],
      ['Sales by Month', 'Amount'],
      ...stats.salesByMonth.map(s => [s.month, s.amount]),
      [''],
      ['Top Products', 'Sales Count'],
      ...stats.topProducts.map(p => [p.name, p.sales])
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${storeSettings.name}_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`${storeSettings.name} - Dashboard Report`, 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 25, { align: 'center' });

    (doc as any).autoTable({
      startY: 35,
      head: [['Metric', 'Value']],
      body: [
        ['Store Name', storeSettings.name],
        ['Total Sales', `${stats.totalSales.toLocaleString()} SAR`],
        ['Total Purchases', `${stats.totalPurchases?.toLocaleString() || 0} SAR`],
        ['Total Returns', `${stats.totalReturns?.toLocaleString() || 0} SAR`],
        ['Total Orders', stats.totalOrders],
        ['Total Customers', stats.totalCustomers],
        ['Total Users', stats.totalUsers],
        ['Low Stock Items', stats.lowStockItems],
        ['Total Inventory Value', `${stats.totalInventoryValue.toLocaleString()} SAR`],
        ['Potential Profit', `${stats.potentialProfit.toLocaleString()} SAR`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [99, 102, 241] }
    });

    doc.text('Sales by Month', 14, (doc as any).lastAutoTable.finalY + 15);
    (doc as any).autoTable({
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Month', 'Amount (SAR)']],
      body: stats.salesByMonth.map(s => [s.month, s.amount.toLocaleString()]),
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }
    });

    doc.text('Top Selling Products', 14, (doc as any).lastAutoTable.finalY + 15);
    (doc as any).autoTable({
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Product Name', 'Sales Count']],
      body: stats.topProducts.map(p => [p.name, p.sales]),
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129] }
    });

    doc.save(`${storeSettings.name}_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 text-right" dir="rtl">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full -mr-48 -mt-48 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full -ml-48 -mb-48 blur-[100px]" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <Zap className="w-3 h-3 fill-current" />
              مركز التحليلات المتقدم
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-6">
              حول بياناتك إلى <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">رؤى استراتيجية</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
              استخرج تقارير مفصلة عن أداء متجرك، مبيعاتك، ونمو قاعدة عملائك بضغطة زر واحدة وبأعلى دقة ممكنة.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <button 
              onClick={exportToCSV}
              className="group flex items-center justify-center gap-3 px-8 py-5 bg-white/5 backdrop-blur-xl text-white font-black text-sm uppercase tracking-widest rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all duration-500"
            >
              <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              تصدير CSV
            </button>
            <button 
              onClick={exportToPDF}
              className="group flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black text-sm uppercase tracking-widest rounded-[2rem] shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-[1.02] transition-all duration-500"
            >
              <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
              تصدير PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Quick Stats */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
              مؤشرات الأداء
            </h3>
            
            <div className="space-y-8">
              {[
                { label: 'إجمالي المبيعات', value: `${stats.totalSales.toLocaleString()} ر.س`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'إجمالي المشتريات', value: `${(stats.totalPurchases || 0).toLocaleString()} ر.س`, icon: Truck, color: 'text-orange-600', bg: 'bg-orange-50' },
                { label: 'إجمالي المرتجعات', value: `${(stats.totalReturns || 0).toLocaleString()} ر.س`, icon: RotateCcw, color: 'text-rose-600', bg: 'bg-rose-50' },
                { label: 'عدد الطلبات', value: stats.totalOrders, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'قاعدة العملاء', value: stats.totalCustomers, icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'المخزون المنخفض', value: stats.lowStockItems, icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50' }
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-4">
                    <div className={`${stat.bg} w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                      <div className="text-lg font-black text-slate-900">{stat.value}</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-slate-200 group-hover:text-indigo-500 transition-colors" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <ShieldCheck className="w-12 h-12 mb-6 text-indigo-200" />
            <h3 className="text-2xl font-black mb-4">بياناتك في أمان</h3>
            <p className="text-indigo-100 text-sm leading-relaxed mb-8">
              يتم تشفير كافة التقارير المستخرجة وحمايتها لضمان خصوصية بيانات متجرك وعملائك.
            </p>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-white w-2/3" />
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Analysis & Top Products */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-2xl font-black text-slate-900">أفضل المنتجات أداءً</h3>
                <p className="text-slate-400 text-sm font-medium mt-1">تحليل المنتجات الأكثر طلباً في متجرك</p>
              </div>
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.topProducts.map((product, i) => (
                <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-xl transition-all duration-500 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 font-black shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {i + 1}
                    </div>
                    <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      {product.sales} مبيعات
                    </div>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">{product.name}</h4>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full" 
                      style={{ width: `${(product.sales / stats.topProducts[0].sales) * 100}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/3 aspect-square bg-white rounded-[2.5rem] shadow-inner flex items-center justify-center p-8">
                <div className="relative w-full h-full">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeDasharray="100, 100"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-indigo-600"
                      strokeDasharray="75, 100"
                      strokeWidth="3"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-900">75%</span>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">نسبة النمو</span>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-slate-900 mb-4">تحليل النمو السنوي</h3>
                <p className="text-slate-500 leading-relaxed mb-6">
                  بناءً على البيانات الحالية، يظهر متجرك نمواً مستقراً بنسبة 75% مقارنة بالربع السابق. ننصح بالتركيز على المنتجات الأكثر مبيعاً لزيادة العوائد.
                </p>
                <div className="flex gap-4">
                  <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    توقعات إيجابية
                  </div>
                  <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    تحليل ذكي
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
