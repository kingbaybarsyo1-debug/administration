import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, AlertCircle, Filter, AlertTriangle, X, Printer } from 'lucide-react';
import Barcode from 'react-barcode';
import { Product } from '../types';
import { BarcodeLabel } from './BarcodeLabel';
import { toast } from 'sonner';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InventoryProps {
  products: Product[];
  onAdd: (product: Omit<Product, 'id'>) => void;
  onUpdate: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ products, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'in-stock'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [productToPrintBarcode, setProductToPrintBarcode] = useState<Product | null>(null);

  // Modal form state
  const [modalCategory, setModalCategory] = useState('');
  const [modalSku, setModalSku] = useState('');
  const [isSkuManuallyEdited, setIsSkuManuallyEdited] = useState(false);

  const categories = useMemo(() => ['الكل', ...new Set(products.map(p => p.category))], [products]);

  const generateSku = (category: string) => {
    if (!category) return '';
    const prefix = category.substring(0, 3).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${random}`;
  };

  const handleOpenModal = (product: Product | null) => {
    if (product) {
      setEditingProduct(product);
      setModalCategory(product.category);
      setModalSku(product.sku);
      setIsSkuManuallyEdited(true);
    } else {
      setEditingProduct(null);
      setModalCategory('');
      setModalSku('');
      setIsSkuManuallyEdited(false);
    }
    setIsModalOpen(true);
  };

  const handleCategoryChange = (val: string) => {
    setModalCategory(val);
    if (!isSkuManuallyEdited) {
      setModalSku(generateSku(val));
    }
  };

  const filteredProducts = products.filter(p => {
    const name = p.name || '';
    const sku = p.sku || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'الكل' || p.category === selectedCategory;
    
    let matchesStock = true;
    if (stockFilter === 'low') matchesStock = p.stock <= 5;
    if (stockFilter === 'in-stock') matchesStock = p.stock > 5;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handlePrintBarcode = (product: Product) => {
    setProductToPrintBarcode(product);
    toast.info('جاري تحضير ملصق الباركود للطباعة...', {
      duration: 2000,
    });
    
    // Give more time for the barcode SVG to render completely
    setTimeout(() => {
      try {
        window.focus();
        window.print();
      } catch (error) {
        console.error('Print error:', error);
        toast.error('حدث خطأ أثناء محاولة الطباعة');
      }
      // Keep the label in DOM for a bit longer to ensure it's captured by the print process
      setTimeout(() => {
        setProductToPrintBarcode(null);
      }, 1000);
    }, 800);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hidden Barcode Label for Printing */}
      {productToPrintBarcode && (
        <div className="hidden print:block">
          <BarcodeLabel product={productToPrintBarcode} />
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">إدارة المخزون</h2>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-1">إدارة المنتجات والكميات والأسعار والباركود</p>
        </div>
        <button 
          onClick={() => handleOpenModal(null)}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-sm hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          إضافة منتج جديد
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/30 flex flex-col lg:flex-row gap-6 items-center">
          <div className="relative flex-1 w-full group">
            <div className="absolute inset-0 bg-indigo-500/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 p-1 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-300">
              <div className="p-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <input 
                type="text"
                placeholder="البحث بالاسم أو SKU..."
                className="flex-1 bg-transparent border-none text-sm font-bold focus:ring-0 outline-none px-2 text-slate-600 placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="flex-1 sm:flex-none flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm group hover:border-indigo-200 transition-all">
              <Filter className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-sm outline-none text-slate-600 font-black cursor-pointer w-full"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 sm:flex-none flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm group hover:border-indigo-200 transition-all">
              <AlertCircle className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              <select 
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value as any)}
                className="bg-transparent text-sm outline-none text-slate-600 font-black cursor-pointer w-full"
              >
                <option value="all">كل المخزون</option>
                <option value="low">مخزون منخفض</option>
                <option value="in-stock">متوفر</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-right min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">المنتج</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الفئة</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">سعر الشراء</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">سعر البيع</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الكمية</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((product) => (
                <tr 
                  key={product.id} 
                  className={cn(
                    "hover:bg-slate-50/50 transition-colors group",
                    product.stock <= 5 && "bg-red-50/30"
                  )}
                >
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <div className="flex flex-col gap-2">
                      <div className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors text-xs md:text-base">{product.name}</div>
                      <div className="bg-white p-1 rounded-lg border border-slate-100 w-fit shadow-sm group-hover:shadow-md transition-shadow">
                        <Barcode 
                          value={product.sku} 
                          width={0.5} 
                          height={15} 
                          fontSize={8} 
                          margin={0}
                          background="transparent"
                        />
                      </div>
                      {product.stock <= 5 && (
                        <div className="text-[9px] md:text-[10px] text-red-500 font-black flex items-center gap-1 mt-1 uppercase tracking-tighter">
                          <AlertTriangle className="w-3 h-3 animate-pulse" />
                          مخزون منخفض جداً
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <span className="text-[9px] md:text-[10px] font-black bg-slate-100 text-slate-500 px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl uppercase tracking-widest">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <div className="flex items-center gap-1 font-black text-slate-500">
                      <span className="text-sm md:text-base">{(product.purchasePrice || 0).toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400">ر.س</span>
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <div className="flex items-center gap-1 font-black text-indigo-600">
                      <span className="text-base md:text-lg">{product.price.toLocaleString()}</span>
                      <span className="text-[10px] text-indigo-400">ر.س</span>
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <div className={cn(
                      "px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl text-xs md:text-sm font-black flex items-center gap-2 w-fit",
                      product.stock <= 5 
                        ? "bg-red-100 text-red-600 shadow-lg shadow-red-500/10" 
                        : "bg-emerald-50 text-emerald-600 shadow-lg shadow-emerald-500/5"
                    )}>
                      {product.stock}
                      {product.stock <= 5 && <AlertCircle className="w-3.5 md:w-4 h-3.5 md:h-4 animate-pulse" />}
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <div className="flex items-center justify-end gap-1 md:gap-2">
                      <button 
                        onClick={() => handlePrintBarcode(product)}
                        className="p-2 md:p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg md:rounded-xl transition-all"
                        title="طباعة الباركود"
                      >
                        <Printer className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-2 md:p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg md:rounded-xl transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setProductToDelete(product.id);
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
            <p className="text-sm md:text-base text-slate-500 font-medium mb-8 md:mb-10 leading-relaxed">هل أنت متأكد من رغبتك في حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  if (productToDelete) {
                    onDelete(productToDelete);
                    setProductToDelete(null);
                    setIsDeleteModalOpen(false);
                  }
                }}
                className="flex-1 bg-red-600 text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-sm hover:bg-red-500 transition-all shadow-xl shadow-red-600/20 active:scale-95"
              >
                حذف المنتج
              </button>
              <button 
                onClick={() => {
                  setProductToDelete(null);
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[95vh] relative custom-scrollbar">
            <div className="p-6 md:p-10 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                    {editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
                  </h3>
                  <p className="text-slate-400 text-xs md:text-sm font-medium mt-1">أدخل تفاصيل المنتج بدقة</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl text-slate-400 hover:bg-white hover:text-slate-900 transition-all shadow-sm"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = {
                name: formData.get('name') as string,
                category: formData.get('category') as string,
                sku: formData.get('sku') as string,
                price: Number(formData.get('price')),
                purchasePrice: Number(formData.get('purchasePrice')),
                stock: Number(formData.get('stock')),
              };
              if (editingProduct) {
                onUpdate({ ...editingProduct, ...data });
              } else {
                onAdd(data);
              }
              setIsModalOpen(false);
            }} className="p-6 md:p-10 space-y-6 md:space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">اسم المنتج</label>
                  <input 
                    name="name" 
                    defaultValue={editingProduct?.name} 
                    required 
                    className="w-full px-4 md:px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    placeholder="أدخل اسم المنتج"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">الفئة</label>
                    <input 
                      name="category" 
                      value={modalCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      required 
                      className="w-full px-4 md:px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                      placeholder="مثال: مشروبات"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">SKU / رمز المنتج</label>
                    <input 
                      name="sku" 
                      value={modalSku}
                      onChange={(e) => {
                        setModalSku(e.target.value);
                        setIsSkuManuallyEdited(true);
                      }}
                      required 
                      className="w-full px-4 md:px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                      placeholder="أدخل الرمز"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">سعر الشراء (ر.س)</label>
                    <input 
                      name="purchasePrice" 
                      type="number" 
                      defaultValue={editingProduct?.purchasePrice || 0} 
                      required 
                      className="w-full px-4 md:px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">سعر البيع (ر.س)</label>
                    <input 
                      name="price" 
                      type="number" 
                      defaultValue={editingProduct?.price} 
                      required 
                      className="w-full px-4 md:px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">الكمية المتوفرة</label>
                    <input 
                      name="stock" 
                      type="number" 
                      defaultValue={editingProduct?.stock} 
                      required 
                      className="w-full px-4 md:px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 md:pt-6">
                <button 
                  type="submit"
                  className="w-full sm:flex-1 bg-indigo-600 text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-xs md:text-sm hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
                >
                  {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}
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
