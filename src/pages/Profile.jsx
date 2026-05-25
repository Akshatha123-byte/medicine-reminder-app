import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { User, Droplets, AlertTriangle, Phone, Save, Ruler, Activity, Stethoscope, FileText, Smile } from 'lucide-react';

const Profile = () => {
  const { user, profile, setProfile, doctor, setDoctor } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    weight: '',
    height: '',
    bloodGroup: '',
    allergies: '',
    medicalHistory: '',
    emergencyContact: '',
    doctorName: '',
    doctorPhone: '',
    specialization: ''
  });

  // Sync formData whenever profile or doctor changes from AppContext
  useEffect(() => {
    if (profile || doctor) {
      setFormData({
        age: profile?.age || '',
        gender: profile?.gender || '',
        weight: profile?.weight || '',
        height: profile?.height || '',
        bloodGroup: profile?.bloodGroup || '',
        allergies: profile?.allergies || '',
        medicalHistory: profile?.medicalHistory || '',
        emergencyContact: profile?.emergencyContact || '',
        doctorName: doctor?.doctorName || '',
        doctorPhone: doctor?.doctorPhone || '',
        specialization: doctor?.specialization || ''
      });
    }
  }, [profile, doctor]);

  const handleSave = () => {
    // Save profile data
    setProfile({
      age: formData.age,
      gender: formData.gender,
      weight: formData.weight,
      height: formData.height,
      bloodGroup: formData.bloodGroup,
      allergies: formData.allergies,
      medicalHistory: formData.medicalHistory,
      emergencyContact: formData.emergencyContact
    });

    // Save doctor data
    setDoctor({
      doctorName: formData.doctorName,
      doctorPhone: formData.doctorPhone,
      specialization: formData.specialization
    });

    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-800">My Profile</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-medical-blue text-white flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30 shadow-inner">
            <User size={48} className="text-white" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">{user?.name || 'User'}</h2>
            <p className="text-blue-100">{user?.email || 'user@example.com'}</p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800">Health Information</h3>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-sm font-medium text-medical-blue hover:underline bg-blue-50 px-4 py-2 rounded-lg"
              >
                Edit Profile
              </button>
            ) : (
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 text-sm font-medium text-white bg-medical-blue hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                <Save size={16} /> Save
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoField 
              icon={User} 
              label="Age" 
              value={formData.age} 
              isEditing={isEditing}
              onChange={(v) => setFormData({...formData, age: v})}
              placeholder="e.g., 35"
              type="number"
            />
            <InfoField 
              icon={Smile} 
              label="Gender" 
              value={formData.gender} 
              isEditing={isEditing}
              onChange={(v) => setFormData({...formData, gender: v})}
              placeholder="e.g., Male, Female, Other"
            />
            <InfoField 
              icon={Activity} 
              label="Weight (kg)" 
              value={formData.weight} 
              isEditing={isEditing}
              onChange={(v) => setFormData({...formData, weight: v})}
              placeholder="e.g., 70"
              type="number"
            />
            <InfoField 
              icon={Ruler} 
              label="Height (cm)" 
              value={formData.height} 
              isEditing={isEditing}
              onChange={(v) => setFormData({...formData, height: v})}
              placeholder="e.g., 175"
              type="number"
            />
            <InfoField 
              icon={Droplets} 
              label="Blood Group" 
              value={formData.bloodGroup} 
              isEditing={isEditing}
              onChange={(v) => setFormData({...formData, bloodGroup: v})}
              placeholder="e.g., O+"
            />
            <InfoField 
              icon={Phone} 
              label="Emergency Contact" 
              value={formData.emergencyContact} 
              isEditing={isEditing}
              onChange={(v) => setFormData({...formData, emergencyContact: v})}
              placeholder="Name & Number"
            />
            <InfoField 
              icon={AlertTriangle} 
              label="Allergies" 
              value={formData.allergies} 
              isEditing={isEditing}
              onChange={(v) => setFormData({...formData, allergies: v})}
              placeholder="e.g., Penicillin, Peanuts"
              fullWidth
            />
            <InfoField 
              icon={FileText} 
              label="Medical History / Chronic Conditions" 
              value={formData.medicalHistory} 
              isEditing={isEditing}
              onChange={(v) => setFormData({...formData, medicalHistory: v})}
              placeholder="e.g., Hypertension, Diabetes"
              fullWidth
            />

            {/* Relational Doctor Entity Fields */}
            <div className="md:col-span-2 border-t border-slate-100 pt-6 mt-4">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Stethoscope size={18} className="text-medical-blue" />
                Primary Doctor Details (Doctor Entity)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoField 
                  icon={User} 
                  label="Doctor Name" 
                  value={formData.doctorName} 
                  isEditing={isEditing}
                  onChange={(v) => setFormData({...formData, doctorName: v})}
                  placeholder="e.g., Dr. Smith"
                />
                <InfoField 
                  icon={Phone} 
                  label="Doctor Phone" 
                  value={formData.doctorPhone} 
                  isEditing={isEditing}
                  onChange={(v) => setFormData({...formData, doctorPhone: v})}
                  placeholder="e.g., (555) 019-2834"
                />
                <InfoField 
                  icon={Activity} 
                  label="Specialization" 
                  value={formData.specialization} 
                  isEditing={isEditing}
                  onChange={(v) => setFormData({...formData, specialization: v})}
                  placeholder="e.g., Cardiologist"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoField = ({ icon: Icon, label, value, isEditing, onChange, placeholder, type = 'text', fullWidth }) => (
  <div className={`${fullWidth ? 'md:col-span-2' : ''}`}>
    <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-2">
      <Icon size={16} className="text-medical-blue" />
      {label}
    </label>
    {isEditing ? (
      <input
        type={type}
        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-medical-blue outline-none transition-all"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    ) : (
      <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-slate-800 min-h-[46px] flex items-center">
        {value || <span className="text-slate-400 italic">Not specified</span>}
      </div>
    )}
  </div>
);

export default Profile;
