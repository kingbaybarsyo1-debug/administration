import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Store, 
  Percent, 
  Globe, 
  Bell, 
  Shield, 
  Smartphone,
  Save,
  CheckCircle2,
  Car,
  Printer,
  Lock,
  Languages
} from 'lucide-react';
import { toast } from 'sonner';
import { useData } from '../hooks/useData';

export const Settings: React.FC = () => {
  const { storeSettings, setStoreSettings } = useData();
  const [activeSection, setActiveSection] = useState('general');

  const handleSave = () => {
    toast.success('تم حفظ الإعدادات بنجاح', {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    });
  };

  const updateSetting = (key: string, value: any) => {
    setStoreSettings({ ...storeSettings, [key]: value });
  };

  const sections = [
    {
      id: 'general',
      title: 'إعدادات المتجر العامة',
      description: 'إدارة المعلومات الأساسية لمتجرك وهويته التجارية.',
      icon: Store,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      fields: [
        { label: 'اسم المتجر', value: storeSettings.name, onChange: (v: string) => updateSetting('name', v), type: 'text' },
        { label: 'العنوان', value: storeSettings.address, onChange: (v: string) => updateSetting('address', v), type: 'text' },
        { label: 'رقم الهاتف', value: storeSettings.phone, onChange: (v: string) => updateSetting('phone', v), type: 'text' },
        { label: 'البريد الإلكتروني', value: storeSettings.email, onChange: (v: string) => updateSetting('email', v), type: 'text' },
        { label: 'العملة الافتراضية', value: storeSettings.currency, onChange: (v: string) => updateSetting('currency', v), type: 'select', options: ['SAR', 'USD', 'AED', 'KWD'] },
      ]
    },
    {
      id: 'tax',
      title: 'الضرائب والرسوم',
      description: 'تكوين نسب ضريبة القيمة المضافة والرسوم الإضافية.',
      icon: Percent,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      fields: [
        { label: 'نسبة الضريبة (%)', value: storeSettings.taxRate, onChange: (v: any) => updateSetting('taxRate', Number(v)), type: 'number' },
        { label: 'الرقم الضريبي', value: storeSettings.taxNumber || '', onChange: (v: string) => updateSetting('taxNumber', v), type: 'text' },
      ]
    },
    {
      id: 'localization',
      title: 'اللغة والمنطقة',
      description: 'تخصيص لغة النظام وتنسيقات التاريخ والوقت.',
      icon: Globe,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      fields: [
        { label: 'لغة النظام', value: 'ar', onChange: () => {}, type: 'select', options: [{label: 'العربية', value: 'ar'}, {label: 'English', value: 'en'}] },
        { label: 'تنسيق التاريخ', value: 'YYYY-MM-DD', onChange: () => {}, type: 'select', options: ['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY'] },
      ]
    },
    {
      id: 'notifications',
      title: 'التنبيهات والإشعارات',
      description: 'إدارة كيفية تلقي التنبيهات حول المخزون والمبيعات.',
      icon: Bell,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      fields: [
        { label: 'تنبيهات المخزون المنخفض', value: 'true', onChange: () => {}, type: 'select', options: [{label: 'مفعل', value: 'true'}, {label: 'معطل', value: 'false'}] },
        { label: 'إشعارات المبيعات اليومية', value: 'false', onChange: () => {}, type: 'select', options: [{label: 'مفعل', value: 'true'}, {label: 'معطل', value: 'false'}] },
      ]
    },
    {
      id: 'security',
      title: 'الأمان والخصوصية',
      description: 'إعدادات الحماية والوصول وكلمات المرور.',
      icon: Shield,
      color: 'text-red-600',
      bg: 'bg-red-50',
      fields: [
        { label: 'تغيير كلمة المرور', value: '', onChange: () => {}, type: 'password' },
        { label: 'تأكيد كلمة المرور الجديدة', value: '', onChange: () => {}, type: 'password' },
      ]
    },
    {
      id: 'devices',
      title: 'الأجهزة والطابعات',
      description: 'ربط الطابعات الحرارية وأجهزة الباركود.',
      icon: Smartphone,
      color: 'text-slate-600',
      bg: 'bg-slate-50',
      fields: [
        { label: 'طابعة الفواتير الافتراضية', value: 'Thermal XP-80', onChange: () => {}, type: 'select', options: ['Thermal XP-80', 'PDF Printer', 'System Default'] },
        { label: 'طابعة الملصقات', value: 'Zebra GK420t', onChange: () => {}, type: 'select', options: ['Zebra GK420t', 'Dymo LabelWriter', 'System Default'] },
      ]
    },
    {
      id: 'cars',
      title: 'إعدادات السيارات',
      description: 'إدارة بيانات السيارات والأسطول الخاص بالمتجر.',
      icon: Car,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
      fields: [
        { label: 'تفعيل نظام إدارة السيارات', value: 'true', onChange: () => {}, type: 'select', options: [{label: 'مفعل', value: 'true'}, {label: 'معطل', value: 'false'}] },
        { label: 'نوع المركبات الافتراضي', value: 'نقل خفيف', onChange: () => {}, type: 'text' },
      ]
    }
  ];

  const currentSection = sections.find(s => s.id === activeSection) || sections[0];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">إعدادات النظام</h2>
          <p className="text-slate-500 font-medium mt-1">تخصيص وتكوين كافة جوانب نظام برو سيلز</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 hover:shadow-indigo-500/40 transition-all active:scale-95 group"
        >
          <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
          حفظ التغييرات
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-2">
          {[
            { id: 'general', label: 'العامة', icon: Store },
            { id: 'tax', label: 'الضرائب', icon: Percent },
            { id: 'localization', label: 'اللغة', icon: Globe },
            { id: 'notifications', label: 'التنبيهات', icon: Bell },
            { id: 'security', label: 'الأمان', icon: Shield },
            { id: 'devices', label: 'الأجهزة', icon: Smartphone },
            { id: 'cars', label: 'السيارات', icon: Car },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-right font-bold group ${
                activeSection === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                  : 'text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform ${activeSection === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-9 space-y-8">
          <div key={currentSection.id} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-start gap-6 mb-10">
              <div className={`${currentSection.bg} w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${currentSection.color} shadow-inner`}>
                <currentSection.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">{currentSection.title}</h3>
                <p className="text-slate-400 text-sm font-medium mt-1">{currentSection.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {currentSection.fields.map((field, i) => (
                <div key={i} className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{field.label}</label>
                  {field.type === 'select' ? (
                    <select 
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer"
                    >
                      {field.options?.map((opt: any) => (
                        <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
                          {typeof opt === 'string' ? opt : opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      type={field.type}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
