import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Load users database from localStorage
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('medUsersDB');
    return saved ? JSON.parse(saved) : [];
  });

  // Current logged in user details { email, name }
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('medCurrentUser');
    return saved ? JSON.parse(saved) : null;
  });

  // Active state for currently logged-in user
  const [profile, setProfileState] = useState({
    age: '',
    bloodGroup: '',
    allergies: '',
    emergencyContact: '',
    gender: '',
    weight: '',
    height: '',
    medicalHistory: '',
    primaryDoctor: ''
  });

  const [medicines, setMedicines] = useState([]);
  const [takenDoses, setTakenDoses] = useState({});

  // Sync current user email to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('medCurrentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('medCurrentUser');
    }
  }, [user]);

  // When logged-in user changes, populate their specific data from the database
  useEffect(() => {
    if (user) {
      const curUser = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
      if (curUser) {
        setMedicines(curUser.medicines || []);
        setProfileState(curUser.profile || { age: '', bloodGroup: '', allergies: '', emergencyContact: '', gender: '', weight: '', height: '', medicalHistory: '', primaryDoctor: '' });
        setTakenDoses(curUser.takenDoses || {});
      }
    } else {
      setMedicines([]);
      setProfileState({ age: '', bloodGroup: '', allergies: '', emergencyContact: '', gender: '', weight: '', height: '', medicalHistory: '', primaryDoctor: '' });
      setTakenDoses({});
    }
  }, [user]);

  // Helper to update a user's data in the database
  const updateUserData = (updatedFields) => {
    if (!user) return;
    const updatedUsers = users.map(u => {
      if (u.email.toLowerCase() === user.email.toLowerCase()) {
        return { ...u, ...updatedFields };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('medUsersDB', JSON.stringify(updatedUsers));
  };

  const signup = (userData) => {
    const emailLower = userData.email.toLowerCase();
    const exists = users.some(u => u.email.toLowerCase() === emailLower);
    if (exists) {
      throw new Error('Email already in use.');
    }
    const newUser = {
      email: userData.email,
      password: userData.password,
      name: userData.name || 'User',
      medicines: [], // empty at start
      profile: { age: '', bloodGroup: '', allergies: '', emergencyContact: '', gender: '', weight: '', height: '', medicalHistory: '', primaryDoctor: '' },
      takenDoses: {}
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('medUsersDB', JSON.stringify(updatedUsers));
    
    // Automatically log in
    setUser({ email: newUser.email, name: newUser.name });
  };

  const login = (userData) => {
    const emailLower = userData.email.toLowerCase();
    const matchedUser = users.find(u => u.email.toLowerCase() === emailLower);
    if (!matchedUser || matchedUser.password !== userData.password) {
      throw new Error('Invalid email or password.');
    }
    setUser({ email: matchedUser.email, name: matchedUser.name });
  };

  const logout = () => {
    setUser(null);
  };

  const addMedicine = (med) => {
    const newMeds = [...medicines, { ...med, id: uuidv4(), status: 'Active' }];
    setMedicines(newMeds);
    updateUserData({ medicines: newMeds });
  };

  const updateMedicine = (id, updatedMed) => {
    const newMeds = medicines.map(m => m.id === id ? { ...m, ...updatedMed } : m);
    setMedicines(newMeds);
    updateUserData({ medicines: newMeds });
  };

  const deleteMedicine = (id) => {
    const newMeds = medicines.filter(m => m.id !== id);
    setMedicines(newMeds);
    updateUserData({ medicines: newMeds });
  };

  const setProfile = (newProfile) => {
    setProfileState(newProfile);
    updateUserData({ profile: newProfile });
  };

  const markDoseTaken = (medId, date, timeSlot) => {
    const key = `${medId}-${date}-${timeSlot}`;
    const newTakenDoses = { ...takenDoses, [key]: true };
    setTakenDoses(newTakenDoses);
    updateUserData({ takenDoses: newTakenDoses });
  };

  const isDoseTaken = (medId, date, timeSlot) => {
    const key = `${medId}-${date}-${timeSlot}`;
    return !!takenDoses[key];
  };

  return (
    <AppContext.Provider value={{
      user, login, signup, logout,
      profile, setProfile,
      medicines, addMedicine, updateMedicine, deleteMedicine,
      takenDoses, markDoseTaken, isDoseTaken
    }}>
      {children}
    </AppContext.Provider>
  );
};
