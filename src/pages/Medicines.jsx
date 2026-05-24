import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import MedicineCard from '../components/MedicineCard';
import { Search, Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Medicines = () => {
  const { medicines, deleteMedicine } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || med.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">My Medicines</h1>
        <Link 
          to="/add-medicine" 
          className="flex items-center gap-2 bg-medical-blue hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>Add New</span>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search medicines..."
            className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-medical-blue focus:border-medical-blue transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <select
            className="block w-full md:w-48 py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-medical-blue focus:border-medical-blue transition-all outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {filteredMedicines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredMedicines.map(med => (
            <MedicineCard 
              key={med.id} 
              medicine={med} 
              onDelete={deleteMedicine}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center flex flex-col items-center">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mb-4">
            <Search size={32} className="text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No medicines found</h3>
          <p className="text-slate-500 mb-6">We couldn't find any medicines matching your criteria.</p>
          <button 
            onClick={() => {setSearchTerm(''); setFilter('All');}}
            className="text-medical-blue font-medium hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Medicines;
