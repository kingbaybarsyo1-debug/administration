import React from 'react';
import Barcode from 'react-barcode';
import { Product } from '../types';
import { useData } from '../hooks/useData';

interface BarcodeLabelProps {
  product: Product;
}

export const BarcodeLabel: React.FC<BarcodeLabelProps> = ({ 
  product
}) => {
  const { storeSettings } = useData();
  const businessName = storeSettings.name;

  return (
    <div className="barcode-label-container bg-white text-black p-2 w-[50mm] h-[30mm] flex flex-col items-center justify-center border border-slate-200 rounded-xl overflow-hidden" dir="rtl">
      <div className="text-center leading-tight mb-0.5">
        <p className="text-[9px] font-black">{businessName}</p>
      </div>
      
      <div className="text-center mb-1">
        <p className="text-[10px] font-black">{product.name}</p>
      </div>

      <div className="flex justify-center mb-1 scale-[0.85]">
        <Barcode 
          value={product.sku} 
          width={1.5} 
          height={30} 
          fontSize={0} 
          margin={0}
        />
      </div>

      <div className="w-full flex justify-between items-center px-4 mt-0.5">
        <div className="text-[10px] font-black">
          SR {product.price.toFixed(2)}
        </div>
        <div className="text-[10px] font-black font-mono">
          {product.sku}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: 50mm 30mm;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          /* Hide everything on the page */
          body * {
            visibility: hidden;
          }
          /* Show only the barcode container and its children */
          .barcode-label-container, .barcode-label-container * {
            visibility: visible !important;
          }
          /* Position the barcode container at the top left of the printed page */
          .barcode-label-container {
            display: flex !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 50mm !important;
            height: 30mm !important;
            margin: 0 !important;
            padding: 4mm !important;
            background: white !important;
            z-index: 999999 !important;
            border: none !important;
            box-shadow: none !important;
          }
          /* Specifically handle the flex/grid items inside */
          .barcode-label-container .flex {
            display: flex !important;
          }
        }
      `}} />
    </div>
  );
};
