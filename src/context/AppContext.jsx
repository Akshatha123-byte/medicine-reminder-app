import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const AppContext = createContext();

// Sync/migrate old local storage DB if it exists
const migrateData = () => {
  const oldUsersSaved = localStorage.getItem('medUsersDB');
  if (!oldUsersSaved) return;

  try {
    const oldUsers = JSON.parse(oldUsersSaved);
    if (!Array.isArray(oldUsers) || oldUsers.length === 0) return;

    const users = [];
    const profiles = [];
    const doctors = [];
    const prescriptions = [];
    const medicines = [];
    const doseRecords = [];
    const notifications = [];

    oldUsers.forEach(u => {
      const userId = uuidv4();

      users.push({
        id: userId,
        name: u.name || 'User',
        email: u.email,
        password: u.password,
        createdAt: new Date().toISOString()
      });

      profiles.push({
        id: uuidv4(),
        userId,
        age: u.profile?.age || '',
        gender: u.profile?.gender || '',
        weight: u.profile?.weight || '',
        height: u.profile?.height || '',
        bloodGroup: u.profile?.bloodGroup || '',
        allergies: u.profile?.allergies || '',
        medicalHistory: u.profile?.medicalHistory || '',
        emergencyContact: u.profile?.emergencyContact || ''
      });

      let docName = u.profile?.primaryDoctor || '';
      let docPhone = '';
      let docSpecialization = 'Primary Care';
      if (docName.includes(' - ')) {
        const parts = docName.split(' - ');
        docName = parts[0];
        docPhone = parts[1];
      }
      const doctorId = uuidv4();
      doctors.push({
        id: doctorId,
        userId,
        doctorName: docName || 'General Practitioner',
        doctorPhone: docPhone || '',
        specialization: docSpecialization
      });

      let prescriptionId = '';
      if (Array.isArray(u.medicines) && u.medicines.length > 0) {
        prescriptionId = uuidv4();
        prescriptions.push({
          id: prescriptionId,
          userId,
          doctorId,
          prescriptionDate: new Date().toISOString().split('T')[0],
          notes: 'Initial Migrated Prescription'
        });
      }

      if (Array.isArray(u.medicines)) {
        u.medicines.forEach(m => {
          medicines.push({
            id: m.id || uuidv4(),
            userId,
            prescriptionId: prescriptionId || null,
            name: m.name,
            dosage: m.dosage,
            frequency: m.frequency || 'Daily',
            times: m.times || [],
            startDate: m.startDate,
            endDate: m.endDate,
            status: m.status || 'Active',
            notes: m.notes || ''
          });
        });
      }

      if (u.takenDoses) {
        Object.keys(u.takenDoses).forEach(k => {
          if (u.takenDoses[k]) {
            const parts = k.split('-');
            if (parts.length >= 3) {
              const medId = parts[0];
              const timeSlot = parts[parts.length - 1];
              const date = parts.slice(1, parts.length - 1).join('-');
              doseRecords.push({
                id: uuidv4(),
                userId,
                medicineId: medId,
                date,
                timeSlot,
                status: 'taken',
                timestamp: new Date().toISOString()
              });
            }
          }
        });
      }
    });

    localStorage.setItem('users_relational', JSON.stringify(users));
    localStorage.setItem('profiles_relational', JSON.stringify(profiles));
    localStorage.setItem('doctors_relational', JSON.stringify(doctors));
    localStorage.setItem('prescriptions_relational', JSON.stringify(prescriptions));
    localStorage.setItem('medicines_relational', JSON.stringify(medicines));
    localStorage.setItem('doseRecords_relational', JSON.stringify(doseRecords));
    localStorage.setItem('notifications_relational', JSON.stringify(notifications));

    localStorage.setItem('medUsersDB_backup', oldUsersSaved);
    localStorage.removeItem('medUsersDB');
  } catch (err) {
    console.error('Migration failed:', err);
  }
};

// Run migration synchronously on load
migrateData();

export const AppProvider = ({ children }) => {
  // Current user state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('medCurrentUser');
    return saved ? JSON.parse(saved) : null;
  });

  // DB collections in state
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('users_relational') || '[]'));
  const [profiles, setProfiles] = useState(() => JSON.parse(localStorage.getItem('profiles_relational') || '[]'));
  const [doctors, setDoctors] = useState(() => JSON.parse(localStorage.getItem('doctors_relational') || '[]'));
  const [prescriptions, setPrescriptions] = useState(() => JSON.parse(localStorage.getItem('prescriptions_relational') || '[]'));
  const [medicines, setMedicines] = useState(() => JSON.parse(localStorage.getItem('medicines_relational') || '[]'));
  const [doseRecords, setDoseRecords] = useState(() => JSON.parse(localStorage.getItem('doseRecords_relational') || '[]'));
  const [notifications, setNotifications] = useState(() => JSON.parse(localStorage.getItem('notifications_relational') || '[]'));

  // Sync current user to local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem('medCurrentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('medCurrentUser');
    }
  }, [user]);

  // Ensure current user has ID on load (in case session existed pre-migration)
  useEffect(() => {
    if (user && !user.id) {
      const match = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
      if (match) {
        setUser({ id: match.id, name: match.name, email: match.email });
      }
    }
  }, [user, users]);

  // Expose filtered collections for current logged in user
  const activeMedicines = user ? medicines.filter(m => m.userId === user.id) : [];
  const activeProfile = user ? (profiles.find(p => p.userId === user.id) || {
    age: '', gender: '', weight: '', height: '', bloodGroup: '', allergies: '', medicalHistory: '', emergencyContact: ''
  }) : {};
  const activeDoctor = user ? (doctors.find(d => d.userId === user.id) || {
    doctorName: '', doctorPhone: '', specialization: ''
  }) : {};
  const activePrescriptions = user ? prescriptions.filter(p => p.userId === user.id) : [];
  const activeNotifications = user ? notifications.filter(n => n.userId === user.id) : [];

  // DB helper
  const saveCollection = (key, data, setter) => {
    setter(data);
    localStorage.setItem(key, JSON.stringify(data));
  };

  const signup = (userData) => {
    const emailLower = userData.email.toLowerCase();
    const exists = users.some(u => u.email.toLowerCase() === emailLower);
    if (exists) {
      throw new Error('Email already in use.');
    }
    const userId = uuidv4();
    const newUser = {
      id: userId,
      email: userData.email,
      password: userData.password,
      name: userData.name || 'User',
      createdAt: new Date().toISOString()
    };
    const newProfile = {
      id: uuidv4(),
      userId,
      age: '', gender: '', weight: '', height: '', bloodGroup: '', allergies: '', medicalHistory: '', emergencyContact: ''
    };
    const newDoctor = {
      id: uuidv4(),
      userId,
      doctorName: '', doctorPhone: '', specialization: ''
    };

    saveCollection('users_relational', [...users, newUser], setUsers);
    saveCollection('profiles_relational', [...profiles, newProfile], setProfiles);
    saveCollection('doctors_relational', [...doctors, newDoctor], setDoctors);

    // Auto-log in
    setUser({ id: newUser.id, name: newUser.name, email: newUser.email });
  };

  const login = (userData) => {
    const emailLower = userData.email.toLowerCase();
    const matchedUser = users.find(u => u.email.toLowerCase() === emailLower);
    if (!matchedUser || matchedUser.password !== userData.password) {
      throw new Error('Invalid email or password.');
    }
    setUser({ id: matchedUser.id, name: matchedUser.name, email: matchedUser.email });
  };

  const logout = () => {
    setUser(null);
  };

  // Medicine operations
  const addMedicine = (med) => {
    if (!user) return;
    const newMed = {
      ...med,
      id: uuidv4(),
      userId: user.id,
      status: med.status || 'Active'
    };
    saveCollection('medicines_relational', [...medicines, newMed], setMedicines);
  };

  const updateMedicine = (id, updatedMed) => {
    if (!user) return;
    const updated = medicines.map(m => m.id === id ? { ...m, ...updatedMed } : m);
    saveCollection('medicines_relational', updated, setMedicines);
  };

  const deleteMedicine = (id) => {
    if (!user) return;
    // 1. Remove medicine
    const filteredMeds = medicines.filter(m => m.id !== id);
    saveCollection('medicines_relational', filteredMeds, setMedicines);

    // 2. Cascade delete dose records associated with this medicine
    const filteredDoses = doseRecords.filter(d => d.medicineId !== id);
    saveCollection('doseRecords_relational', filteredDoses, setDoseRecords);
  };

  // Profile operations
  const setProfile = (newProfileData) => {
    if (!user) return;
    const updated = profiles.map(p => {
      if (p.userId === user.id) {
        return { ...p, ...newProfileData };
      }
      return p;
    });
    // If somehow profile doesn't exist, create it
    if (!profiles.some(p => p.userId === user.id)) {
      updated.push({
        id: uuidv4(),
        userId: user.id,
        ...newProfileData
      });
    }
    saveCollection('profiles_relational', updated, setProfiles);
  };

  // Doctor operations
  const setDoctor = (newDoctorData) => {
    if (!user) return;
    const updated = doctors.map(d => {
      if (d.userId === user.id) {
        return { ...d, ...newDoctorData };
      }
      return d;
    });
    if (!doctors.some(d => d.userId === user.id)) {
      updated.push({
        id: uuidv4(),
        userId: user.id,
        ...newDoctorData
      });
    }
    saveCollection('doctors_relational', updated, setDoctors);
  };

  // Prescription operations
  const addPrescription = (prescriptionData) => {
    if (!user) return null;
    const newPrescription = {
      ...prescriptionData,
      id: uuidv4(),
      userId: user.id,
      prescriptionDate: prescriptionData.prescriptionDate || new Date().toISOString().split('T')[0]
    };
    saveCollection('prescriptions_relational', [...prescriptions, newPrescription], setPrescriptions);
    return newPrescription;
  };

  const deletePrescription = (prescriptionId) => {
    if (!user) return;
    // Remove prescription
    const filteredPrescriptions = prescriptions.filter(p => p.id !== prescriptionId);
    saveCollection('prescriptions_relational', filteredPrescriptions, setPrescriptions);

    // Cascade delete medicines belonging to this prescription (and their dose records)
    const medsToDelete = medicines.filter(m => m.prescriptionId === prescriptionId);
    const medIdsToDelete = medsToDelete.map(m => m.id);

    const filteredMeds = medicines.filter(m => m.prescriptionId !== prescriptionId);
    saveCollection('medicines_relational', filteredMeds, setMedicines);

    const filteredDoses = doseRecords.filter(d => !medIdsToDelete.includes(d.medicineId));
    saveCollection('doseRecords_relational', filteredDoses, setDoseRecords);
  };

  // Dose Records operations
  const markDoseTaken = (medId, date, timeSlot) => {
    if (!user) return;
    const exists = doseRecords.some(r => r.userId === user.id && r.medicineId === medId && r.date === date && r.timeSlot === timeSlot && r.status === 'taken');
    if (exists) return;

    const newRecord = {
      id: uuidv4(),
      userId: user.id,
      medicineId: medId,
      date,
      timeSlot,
      status: 'taken',
      timestamp: new Date().toISOString()
    };
    saveCollection('doseRecords_relational', [...doseRecords, newRecord], setDoseRecords);
  };

  const isDoseTaken = (medId, date, timeSlot) => {
    if (!user) return false;
    return doseRecords.some(
      r => r.userId === user.id && r.medicineId === medId && r.date === date && r.timeSlot === timeSlot && r.status === 'taken'
    );
  };

  // Notification Operations
  const addNotification = (notif) => {
    if (!user) return;
    const newNotif = {
      id: uuidv4(),
      userId: user.id,
      message: notif.message,
      type: notif.type || 'due',
      timestamp: new Date().toISOString(),
      isRead: false
    };
    saveCollection('notifications_relational', [...notifications, newNotif], setNotifications);
  };

  const markAllNotificationsRead = () => {
    if (!user) return;
    const updated = notifications.map(n => n.userId === user.id ? { ...n, isRead: true } : n);
    saveCollection('notifications_relational', updated, setNotifications);
  };

  const clearNotification = (id) => {
    if (!user) return;
    const updated = notifications.filter(n => n.id !== id);
    saveCollection('notifications_relational', updated, setNotifications);
  };

  return (
    <AppContext.Provider value={{
      user, login, signup, logout,
      profile: activeProfile, setProfile,
      doctor: activeDoctor, setDoctor,
      prescriptions: activePrescriptions, addPrescription, deletePrescription,
      medicines: activeMedicines, addMedicine, updateMedicine, deleteMedicine,
      takenDoses: doseRecords, markDoseTaken, isDoseTaken,
      notifications: activeNotifications, addNotification, markAllNotificationsRead, clearNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};
