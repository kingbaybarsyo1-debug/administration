import React from 'react';
import { 
  Settings as SettingsIcon, 
  Store, 
  Percent, 
  Globe, 
  Bell, 
  Shield, 
  Smartphone,
  Save,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { useData } from '../hooks/useData';

export const Settings: React.FC = () => {
  const { storeSettings, setStoreSettings } = useData();

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
      ]
    }
  ];

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
          ].map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all text-right font-bold group"
            >
              <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-9 space-y-8">
          {sections.map((section) => (
            <div key={section.id} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-start gap-6 mb-10">
                <div className={`${section.bg} w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${section.color} shadow-inner`}>
                  <section.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{section.title}</h3>
                  <p className="text-slate-400 text-sm font-medium mt-1">{section.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {section.fields.map((field, i) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};
