import React from 'react';
import { SaleReturn, ReturnItem } from '../types';

interface ReturnReceiptProps {
  returnRecord: SaleReturn;
  businessName?: string;
  address?: string;
  phone?: string;
  vatNumber?: string;
}

export const ReturnReceipt: React.FC<ReturnReceiptProps> = ({ 
  returnRecord, 
  businessName = "متجر النخبة", 
  address = "الرياض، المملكة العربية السعودية", 
  phone = "0500000000",
  vatNumber = "123456789012345"
}) => {
  return (
    <div className="receipt-container p-4 bg-white text-black font-mono text-sm w-[80mm] mx-auto" dir="rtl">
      <div className="text-center mb-4">
        <h2 className="text-xl font-black mb-1">{businessName}</h2>
        <p className="text-xs font-black text-red-600 border border-red-600 inline-block px-2 py-0.5 rounded mb-1">فاتورة مرتجع</p>
        <p className="text-[10px]">{address}</p>
        <p className="text-[10px]">هاتف: {phone}</p>
        <p className="text-[10px]">الرقم الضريبي: {vatNumber}</p>
      </div>

      <div className="border-t border-b border-dashed border-black py-2 mb-4">
        <div className="flex justify-between text-[10px]">
          <span>رقم المرتجع:</span>
          <span>#{returnRecord.id}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span>رقم الفاتورة الأصلية:</span>
          <span>#{returnRecord.saleId}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span>التاريخ:</span>
          <span>{new Date(returnRecord.date).toLocaleString('ar-SA')}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span>العميل:</span>
          <span>{returnRecord.customerName}</span>
        </div>
      </div>

      <table className="w-full mb-4 text-[10px]">
        <thead>
          <tr className="border-b border-dashed border-black">
            <th className="text-right py-1">الصنف</th>
            <th className="text-center py-1">الكمية</th>
            <th className="text-left py-1">المبلغ</th>
          </tr>
        </thead>
        <tbody>
          {returnRecord.items.map((item, index) => (
            <tr key={index}>
              <td className="py-1">{item.productName}</td>
              <td className="text-center py-1">{item.quantity}</td>
              <td className="text-left py-1">{(item.price * item.quantity).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t border-dashed border-black pt-2 space-y-1 text-[10px]">
        <div className="flex justify-between font-black text-base border-t border-dashed border-black pt-1 mt-1">
          <span>إجمالي المبلغ المسترد:</span>
          <span>{returnRecord.refundAmount.toLocaleString()} ر.س</span>
        </div>
      </div>

      <div className="mt-4 pt-2 border-t border-dashed border-black">
        <p className="text-[10px] font-black mb-1">سبب الإرجاع:</p>
        <p className="text-[10px] italic">{returnRecord.reason}</p>
      </div>

      <div className="text-center mt-8 text-[10px]">
        <p className="font-black">شكراً لتعاملكم معنا!</p>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .receipt-container, .receipt-container * {
            visibility: visible;
          }
          .receipt-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm;
          }
        }
      `}} />
    </div>
  );
};
