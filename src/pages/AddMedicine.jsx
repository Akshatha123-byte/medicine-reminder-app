import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Save, X, ArrowLeft } from 'lucide-react';

const AddMedicine = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { medicines, addMedicine, updateMedicine } = useContext(AppContext);
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'Daily',
    times: [],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      const medToEdit = medicines.find(m => m.id === id);
      if (medToEdit) {
        setFormData(medToEdit);
      } else {
        navigate('/medicines');
      }
    }
  }, [id, isEditing, medicines, navigate]);

  const handleTimeToggle = (time) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.includes(time)
        ? prev.times.filter(t => t !== time)
        : [...prev.times, time]
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.dosage.trim()) newErrors.dosage = 'Dosage is required';
    if (formData.times.length === 0) newErrors.times = 'Select at least one time';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (isEditing) {
        updateMedicine(id, formData);
      } else {
        addMedicine(formData);
      }
      navigate('/medicines');
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-medical-blue transition-colors mb-6 font-medium"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">
            {isEditing ? 'Edit Medicine' : 'Add New Medicine'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Medicine Name *</label>
              <input
                type="text"
                className={`w-full p-3 bg-slate-50 border rounded-lg focus:bg-white focus:ring-2 focus:ring-medical-blue outline-none transition-all ${errors.name ? 'border-red-500' : 'border-slate-200'}`}
                placeholder="e.g., Amoxicillin"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Dosage */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Dosage *</label>
              <input
                type="text"
                className={`w-full p-3 bg-slate-50 border rounded-lg focus:bg-white focus:ring-2 focus:ring-medical-blue outline-none transition-all ${errors.dosage ? 'border-red-500' : 'border-slate-200'}`}
                placeholder="e.g., 500mg or 2 pills"
                value={formData.dosage}
                onChange={(e) => setFormData({...formData, dosage: e.target.value})}
              />
              {errors.dosage && <p className="text-red-500 text-xs mt-1">{errors.dosage}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Frequency */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Frequency</label>
              <select
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-medical-blue outline-none transition-all"
                value={formData.frequency}
                onChange={(e) => setFormData({...formData, frequency: e.target.value})}
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="As Needed">As Needed</option>
              </select>
            </div>

            {/* Status (Only in Edit) */}
            {isEditing && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                <select
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-medical-blue outline-none transition-all"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            )}
          </div>

          {/* Times */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Time(s) of Day *</label>
            <div className="flex flex-wrap gap-3">
              {['Morning', 'Afternoon', 'Evening', 'Night'].map(time => (
                <button
                  type="button"
                  key={time}
                  onClick={() => handleTimeToggle(time)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
                    formData.times.includes(time)
                      ? 'bg-blue-50 border-medical-blue text-medical-blue shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            {errors.times && <p className="text-red-500 text-xs mt-2">{errors.times}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date *</label>
              <input
                type="date"
                className={`w-full p-3 bg-slate-50 border rounded-lg focus:bg-white focus:ring-2 focus:ring-medical-blue outline-none transition-all ${errors.startDate ? 'border-red-500' : 'border-slate-200'}`}
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              />
              {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">End Date *</label>
              <input
                type="date"
                className={`w-full p-3 bg-slate-50 border rounded-lg focus:bg-white focus:ring-2 focus:ring-medical-blue outline-none transition-all ${errors.endDate ? 'border-red-500' : 'border-slate-200'}`}
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              />
              {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Notes / Instructions</label>
            <textarea
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-medical-blue outline-none transition-all resize-none h-24"
              placeholder="Any special instructions..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-medical-blue text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-sm shadow-blue-500/30 flex items-center gap-2"
            >
              <Save size={18} />
              {isEditing ? 'Save Changes' : 'Add Medicine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicine;
