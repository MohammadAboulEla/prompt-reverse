import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-2.5 rounded-xl border border-neutral-700 bg-neutral-900/95 px-4 py-3 text-xs text-white shadow-2xl shadow-black/50 backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2"
        >
          {toast.type === 'success' && <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />}
          <span className="font-medium">{toast.text}</span>
          <button
            onClick={() => onDismiss(toast.id)}
            className="ml-2 text-neutral-400 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
