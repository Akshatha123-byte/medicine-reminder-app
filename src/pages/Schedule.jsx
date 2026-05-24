import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react';

const Schedule = () => {
  const { medicines, takenDoses, markDoseTaken, isDoseTaken } = useContext(AppContext);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handlePrevDay = () => setSelectedDate(prev => subDays(prev, 1));
  const handleNextDay = () => setSelectedDate(prev => addDays(prev, 1));
  const handleToday = () => setSelectedDate(new Date());

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const isToday = isSameDay(selectedDate, new Date());

  const activeMedicinesForDate = medicines.filter(
    m => m.status === 'Active' && m.startDate <= dateStr && m.endDate >= dateStr
  );

  const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Schedule</h1>
        
        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
          <button onClick={handlePrevDay} className="p-2 hover:bg-white rounded-md transition-colors text-slate-600">
            <ChevronLeft size={20} />
          </button>
          <div className="flex flex-col items-center px-4 min-w-[140px]">
            <span className="text-sm font-bold text-slate-800">{format(selectedDate, 'MMM dd, yyyy')}</span>
            <span className="text-xs text-slate-500">{format(selectedDate, 'EEEE')}</span>
          </div>
          <button onClick={handleNextDay} className="p-2 hover:bg-white rounded-md transition-colors text-slate-600">
            <ChevronRight size={20} />
          </button>
        </div>

        {!isToday && (
          <button onClick={handleToday} className="text-sm font-medium text-medical-blue hover:underline px-2">
            Go to Today
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {activeMedicinesForDate.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No medicines scheduled for this day.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {timeSlots.map(slot => {
              const medsInSlot = activeMedicinesForDate.filter(m => m.times.includes(slot));
              if (medsInSlot.length === 0) return null;

              return (
                <div key={slot} className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-medical-blue"></span>
                    {slot}
                  </h3>
                  <div className="space-y-3">
                    {medsInSlot.map(med => {
                      const taken = isDoseTaken(med.id, dateStr, slot);
                      // Logic for missed: if date is before today, or it's today and past the slot time (simplified: just if date is past)
                      const isPastDate = dateStr < format(new Date(), 'yyyy-MM-dd');
                      const missed = !taken && isPastDate;

                      return (
                        <div key={med.id} className={`flex items-center justify-between p-4 rounded-xl border ${
                          taken ? 'bg-green-50 border-green-100' : 
                          missed ? 'bg-red-50 border-red-100' : 
                          'bg-white border-slate-200'
                        }`}>
                          <div>
                            <h4 className={`font-semibold ${taken ? 'text-green-800 line-through' : missed ? 'text-red-800' : 'text-slate-800'}`}>
                              {med.name}
                            </h4>
                            <p className={`text-sm ${taken ? 'text-green-600' : missed ? 'text-red-600' : 'text-slate-500'}`}>
                              {med.dosage}
                            </p>
                          </div>
                          
                          {taken ? (
                            <div className="flex items-center gap-1.5 text-green-600 bg-green-100 px-3 py-1.5 rounded-full text-sm font-semibold">
                              <CheckCircle2 size={16} /> Taken
                            </div>
                          ) : missed ? (
                            <div className="text-red-600 bg-red-100 px-3 py-1.5 rounded-full text-sm font-semibold">
                              Missed
                            </div>
                          ) : (
                            <button
                              onClick={() => markDoseTaken(med.id, dateStr, slot)}
                              className="flex items-center gap-1.5 text-slate-500 hover:text-medical-blue hover:bg-blue-50 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border border-transparent hover:border-blue-200"
                            >
                              <Circle size={16} /> Mark Taken
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
