import React from 'react';
import { Sale, SaleItem, Payment } from '../types';
import { useData } from '../hooks/useData';

interface ReceiptProps {
  sale: Sale;
}

export const Receipt: React.FC<ReceiptProps> = ({ 
  sale
}) => {
  const { storeSettings } = useData();
  const businessName = storeSettings.name;
  const address = storeSettings.address;
  const phone = storeSettings.phone;
  const vatNumber = storeSettings.taxNumber || "123456789012345";

  const subtotal = sale.subtotal || sale.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountTotal = sale.discountTotal || 0;
  const taxTotal = sale.taxTotal || (subtotal - discountTotal) * 0.15;

  return (
    <div className="receipt-container p-2 bg-white text-black font-mono text-sm w-full max-w-[80mm] mx-auto" dir="rtl">
      <div className="text-center mb-4">
        <h2 className="text-xl font-black mb-1">{businessName}</h2>
        <p className="text-[10px]">{address}</p>
        <p className="text-[10px]">هاتف: {phone}</p>
        <p className="text-[10px]">الرقم الضريبي: {vatNumber}</p>
      </div>

      <div className="border-t border-b border-dashed border-black py-2 mb-4">
        <div className="flex justify-between text-[10px]">
          <span>رقم الفاتورة:</span>
          <span>#{sale.id}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span>التاريخ:</span>
          <span>{new Date(sale.date).toLocaleString('ar-SA')}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span>العميل:</span>
          <span>{sale.customerName}</span>
        </div>
      </div>

      <table className="w-full mb-4 text-[10px]">
        <thead>
          <tr className="border-b border-dashed border-black">
            <th className="text-right py-1">الصنف</th>
            <th className="text-center py-1">الكمية</th>
            <th className="text-left py-1">السعر</th>
          </tr>
        </thead>
        <tbody>
          {sale.items.map((item, index) => (
            <tr key={index}>
              <td className="py-1">{item.productName}</td>
              <td className="text-center py-1">{item.quantity}</td>
              <td className="text-left py-1">{(item.price * item.quantity).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t border-dashed border-black pt-2 space-y-1 text-[10px]">
        <div className="flex justify-between">
          <span>المجموع الفرعي:</span>
          <span>{subtotal.toLocaleString()} ر.س</span>
        </div>
        {discountTotal > 0 && (
          <div className="flex justify-between text-red-600">
            <span>الخصم:</span>
            <span>-{discountTotal.toLocaleString()} ر.س</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>الضريبة (15%):</span>
          <span>{taxTotal.toLocaleString()} ر.س</span>
        </div>
        <div className="flex justify-between font-black text-base border-t border-dashed border-black pt-1 mt-1">
          <span>الإجمالي:</span>
          <span>{sale.total.toLocaleString()} ر.س</span>
        </div>
      </div>

      <div className="mt-4 pt-2 border-t border-dashed border-black">
        <p className="text-[10px] font-black mb-1">طرق الدفع:</p>
        {sale.payments.map((p, i) => (
          <div key={i} className="flex justify-between text-[10px]">
            <span>{p.method === 'cash' ? 'نقدي' : p.method === 'card' ? 'بطاقة' : p.method === 'bank_transfer' ? 'تحويل' : 'جوال'}:</span>
            <span>{p.amount.toLocaleString()} ر.س</span>
          </div>
        ))}
      </div>

      <div className="text-center mt-8 text-[10px]">
        <p className="font-black">شكراً لزيارتكم!</p>
        <p>الأسعار تشمل ضريبة القيمة المضافة</p>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide everything on the page */
          body * {
            visibility: hidden;
          }
          /* Show only the receipt container and its children */
          .receipt-container, .receipt-container * {
            visibility: visible !important;
          }
          /* Position the receipt at the top left of the printed page */
          .receipt-container {
            position: fixed;
            left: 0;
            top: 0;
            width: 72mm;
            margin: 0;
            padding: 2mm;
            background: white;
            box-shadow: none;
          }
          /* Hide scrollbars and other UI elements */
          @page {
            margin: 0;
            size: 80mm auto;
          }
          html, body {
            margin: 0;
            padding: 0;
            height: auto;
          }
        }
      `}} />
    </div>
  );
};
