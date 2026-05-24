import React, { useContext } from 'react';
import { Menu, UserCircle, Bell, HeartPulse } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:text-medical-blue hover:bg-blue-50 rounded-full transition-colors relative">
          <Bell size={22} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-medical-danger rounded-full"></span>
        </button>
        
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
