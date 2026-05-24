import React, { useState } from 'react';
import { Pill, Activity, CalendarDays, Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const MedicineCard = ({ medicine, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const statusColors = {
    Active: 'bg-green-100 text-green-700 border-green-200',
    Completed: 'bg-slate-100 text-slate-700 border-slate-200',
    Paused: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col group relative overflow-hidden">
      {/* Accent strip */}
      <div className={`absolute top-0 left-0 w-1 h-full ${medicine.status === 'Active' ? 'bg-medical-green' : medicine.status === 'Paused' ? 'bg-yellow-400' : 'bg-slate-300'}`}></div>
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2.5 rounded-lg">
            <Pill className="text-medical-blue" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800">{medicine.name}</h3>
            <p className="text-sm text-slate-500 font-medium">{medicine.dosage}</p>
          </div>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColors[medicine.status]}`}>
          {medicine.status}
        </span>
      </div>

      <div className="space-y-2 mb-6 flex-1">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Activity size={16} className="text-slate-400" />
          <span>{medicine.frequency} • {medicine.times.join(', ')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <CalendarDays size={16} className="text-slate-400" />
          <span>{medicine.startDate} to {medicine.endDate}</span>
        </div>
        {medicine.notes && (
          <div className="mt-3 bg-slate-50 p-3 rounded-lg text-sm text-slate-600 italic">
            "{medicine.notes}"
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 mt-auto">
        {showConfirm ? (
          <div className="flex items-center gap-2 w-full justify-between animate-in fade-in">
            <span className="text-sm font-medium text-slate-600">Delete?</span>
            <div className="flex gap-2">
              <button onClick={() => setShowConfirm(false)} className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200">Cancel</button>
              <button onClick={() => onDelete(medicine.id)} className="px-3 py-1 text-sm bg-medical-danger text-white rounded-md hover:bg-red-600">Confirm</button>
            </div>
          </div>
        ) : (
          <>
            <Link 
              to={`/edit-medicine/${medicine.id}`}
              className="p-2 text-slate-400 hover:text-medical-blue hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 size={18} />
            </Link>
            <button 
              onClick={() => setShowConfirm(true)}
              className="p-2 text-slate-400 hover:text-medical-danger hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MedicineCard;
