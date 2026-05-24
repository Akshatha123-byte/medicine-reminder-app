import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Pill, CheckCircle2, XCircle, Clock, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user, medicines, takenDoses, markDoseTaken, isDoseTaken } = useContext(AppContext);
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  
  const activeMedicines = medicines.filter(m => m.status === 'Active' && m.startDate <= todayStr && m.endDate >= todayStr);
  
  // Calculate stats
  const totalMeds = activeMedicines.length;
  let totalDosesToday = 0;
  let takenCount = 0;

  activeMedicines.forEach(med => {
    totalDosesToday += med.times.length;
    med.times.forEach(time => {
      if (isDoseTaken(med.id, todayStr, time)) {
        takenCount++;
      }
    });
  });

  const missedCount = totalDosesToday > 0 ? (totalDosesToday - takenCount) : 0; // Simplified logic

  const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Hello, {user?.name || 'User'} 👋
          </h1>
          <p className="text-slate-500 mt-1">
            <CalendarDays className="inline mr-2" size={16} />
            {format(new Date(), 'EEEE, MMMM do yyyy')}
          </p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Medicines" value={totalMeds} icon={Pill} color="bg-blue-50 text-blue-600" />
        <StatCard title="Today's Doses" value={totalDosesToday} icon={Clock} color="bg-indigo-50 text-indigo-600" />
        <StatCard title="Taken" value={takenCount} icon={CheckCircle2} color="bg-green-50 text-green-600" />
        <StatCard title="Missed / Pending" value={missedCount} icon={XCircle} color="bg-orange-50 text-orange-600" />
      </div>

      {/* Today's Schedule Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Today's Schedule</h2>
        </div>
        
        <div className="p-5">
          {timeSlots.map(slot => {
            const slotMeds = activeMedicines.filter(m => m.times.includes(slot));
            if (slotMeds.length === 0) return null;

            return (
              <div key={slot} className="mb-8 last:mb-0 relative">
                {/* Timeline line */}
                <div className="absolute left-[15px] top-8 bottom-[-32px] w-0.5 bg-slate-100 last:hidden"></div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-8 rounded-full bg-medical-blue text-white flex items-center justify-center font-bold z-10 shadow-sm relative">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <h3 className="font-bold text-lg text-slate-700">{slot}</h3>
                </div>

                <div className="pl-12 space-y-3">
                  {slotMeds.map(med => {
                    const taken = isDoseTaken(med.id, todayStr, slot);
                    return (
                      <div key={med.id} className={`flex items-center justify-between p-4 rounded-lg border transition-all ${taken ? 'bg-green-50/50 border-green-100 opacity-75' : 'bg-white border-slate-200 hover:border-blue-200 hover:shadow-sm'}`}>
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${taken ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-medical-blue'}`}>
                            <Pill size={20} />
                          </div>
                          <div>
                            <h4 className={`font-semibold ${taken ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{med.name}</h4>
                            <p className="text-sm text-slate-500">{med.dosage}</p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => !taken && markDoseTaken(med.id, todayStr, slot)}
                          disabled={taken}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${taken ? 'bg-green-100 text-green-700 cursor-default' : 'bg-medical-blue text-white hover:bg-blue-600 shadow-sm'}`}
                        >
                          <CheckCircle2 size={16} />
                          {taken ? 'Taken' : 'Mark Taken'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          
          {activeMedicines.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No medicines scheduled for today.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

export default Dashboard;
