import React, { useState, useEffect } from 'react';
import { toastEmitter } from '../hooks/useReminder';
import { Bell, X } from 'lucide-react';

const ReminderToast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toastEmitter.subscribe((message) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message }]);
      
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 5000);
    });

    return unsubscribe;
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div key={toast.id} className="bg-white border-l-4 border-medical-blue shadow-lg rounded-md p-4 flex items-center justify-between w-80 animate-in fade-in slide-in-from-top-5">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Bell size={20} className="text-medical-blue animate-pulse" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Reminder</h4>
              <p className="text-sm text-slate-600">{toast.message}</p>
            </div>
          </div>
          <button 
            onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ReminderToast;
