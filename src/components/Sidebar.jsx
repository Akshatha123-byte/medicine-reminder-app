import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Pill, CalendarClock, User, PlusCircle } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Pill, label: 'My Medicines', path: '/medicines' },
  { icon: CalendarClock, label: 'Schedule', path: '/schedule' },
  { icon: User, label: 'Profile', path: '/profile' },
];

const Sidebar = ({ open, setOpen }) => {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-slate-800/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}
      
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-white border-r border-slate-200
        transform transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col h-[calc(100vh-4rem)] lg:h-auto
      `}>
        <div className="p-4">
          <NavLink 
            to="/add-medicine"
            onClick={() => setOpen(false)}
            className="w-full flex items-center justify-center gap-2 bg-medical-blue hover:bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors shadow-md shadow-blue-500/20"
          >
            <PlusCircle size={20} />
            <span>Add Medicine</span>
          </NavLink>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-50 text-medical-blue' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <Icon size={20} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Mobile bottom nav - optional alternative to sidebar on mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30 flex justify-around p-2 pb-safe">
         {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex flex-col items-center gap-1 p-2 rounded-lg transition-colors
                  ${isActive ? 'text-medical-blue' : 'text-slate-500'}
                `}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            );
          })}
      </nav>
    </>
  );
};

export default Sidebar;
