import React, { useContext, useState } from 'react';
import { Menu, UserCircle, Bell, HeartPulse } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const { user, logout, medicines, isDoseTaken } = useContext(AppContext);
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNotifications = () => {
    if (!user) return [];
    const notifications = [];
    const now = new Date();
    const currentHour = now.getHours();
    const todayStr = now.toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Check which slot is currently active/upcoming
    let currentSlot = '';
    if (currentHour >= 6 && currentHour < 12) currentSlot = 'Morning';
    else if (currentHour >= 12 && currentHour < 17) currentSlot = 'Afternoon';
    else if (currentHour >= 17 && currentHour < 21) currentSlot = 'Evening';
    else currentSlot = 'Night';

    medicines.forEach(med => {
      if (med.status !== 'Active') return;

      // Check current slot
      if (med.times.includes(currentSlot) && med.startDate <= todayStr && med.endDate >= todayStr) {
        const taken = isDoseTaken(med.id, todayStr, currentSlot);
        notifications.push({
          id: `${med.id}-${todayStr}-${currentSlot}`,
          text: `Dose due: ${med.name} (${med.dosage}) - ${currentSlot}`,
          type: 'due',
          time: 'Active Now',
          taken
        });
      }

      // Helper to check missed
      const checkMissed = (dateStr, slot, hasPassed, label) => {
        if (!med.times.includes(slot)) return;
        if (med.startDate > dateStr || med.endDate < dateStr) return;
        if (!hasPassed) return;

        const taken = isDoseTaken(med.id, dateStr, slot);
        if (!taken) {
          notifications.push({
            id: `missed-${med.id}-${dateStr}-${slot}`,
            text: `Missed: ${med.name} (${med.dosage}) - ${slot} (${label})`,
            type: 'missed',
            time: label,
            taken: false
          });
        }
      };

      checkMissed(todayStr, 'Morning', currentHour >= 12, 'Today');
      checkMissed(todayStr, 'Afternoon', currentHour >= 17, 'Today');
      checkMissed(todayStr, 'Evening', currentHour >= 21, 'Today');
      checkMissed(yesterdayStr, 'Night', currentHour >= 6, 'Yesterday');
    });

    return notifications;
  };

  const notifications = getNotifications();
  const unreadCount = notifications.filter(n => !n.taken).length;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 h-16 flex items-center justify-between px-4 lg:px-8 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <Menu size={24} />
        </button>
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="bg-medical-blue p-1.5 rounded-lg">
            <HeartPulse size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold text-slate-800 hidden sm:block">MedMinder</span>
        </Link>
      </div>

      <div className="flex items-center gap-4 relative">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-medical-blue hover:bg-blue-50 rounded-full transition-colors relative"
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-medical-danger rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-800">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 bg-red-50 text-red-600 rounded-full">
                    {unreadCount} active alert{unreadCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-slate-400 italic">
                    No active notifications
                  </div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 flex items-start gap-2.5 transition-colors"
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        n.type === 'missed' ? 'bg-red-500' : n.taken ? 'bg-green-400' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className={`text-sm text-left ${
                          n.type === 'missed' ? 'text-red-700 font-medium' : n.taken ? 'text-slate-500 line-through' : 'text-slate-700 font-medium'
                        }`}>
                          {n.text}
                        </p>
                        <span className="text-[10px] text-slate-400 block text-left mt-0.5">{n.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-slate-800">{user?.name || 'User'}</p>
            <button onClick={handleLogout} className="text-xs text-slate-500 hover:text-medical-blue transition-colors">Logout</button>
          </div>
          <Link to="/profile">
            <UserCircle size={32} className="text-slate-400 hover:text-medical-blue transition-colors" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
