import React, { useContext, useState } from 'react';
import { Menu, UserCircle, Bell, HeartPulse } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const { user, logout, notifications, markAllNotificationsRead, profile } = useContext(AppContext);
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleToggleNotifications = () => {
    const nextState = !showNotifications;
    setShowNotifications(nextState);
    if (nextState) {
      markAllNotificationsRead();
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const sortedNotifications = [...notifications].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

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
            onClick={handleToggleNotifications}
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
                    {unreadCount} new alert{unreadCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {sortedNotifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-slate-400 italic">
                    No notifications
                  </div>
                ) : (
                  sortedNotifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 flex items-start gap-2.5 transition-colors ${
                        !n.isRead ? 'bg-blue-50/20' : ''
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        n.type === 'missed' ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className={`text-sm text-left ${
                          n.type === 'missed' ? 'text-red-700 font-medium' : 'text-slate-700'
                        }`}>
                          {n.message}
                        </p>
                        <span className="text-[10px] text-slate-400 block text-left mt-0.5">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
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
          <Link to="/profile" className="flex items-center">
            {profile?.profilePic ? (
              <img 
                src={profile.profilePic} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border border-slate-200 object-cover hover:ring-2 hover:ring-medical-blue transition-all"
              />
            ) : (
              <UserCircle size={32} className="text-slate-400 hover:text-medical-blue transition-colors" />
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
