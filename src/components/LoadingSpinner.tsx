import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 40, 
  className = "", 
  label = "جاري التحميل..." 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 w-full h-full min-h-[400px] ${className}`}>
      <Loader2 
        className="text-indigo-600 animate-spin mb-4" 
        size={size} 
      />
      {label && <p className="text-slate-500 font-medium animate-pulse">{label}</p>}
    </div>
  );
};
