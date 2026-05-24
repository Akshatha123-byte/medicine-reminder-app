import { useEffect, useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

// Simple event emitter for toasts
export const toastEmitter = {
  listeners: [],
  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  },
  emit(message) {
    this.listeners.forEach(fn => fn(message));
  }
};

const useReminder = () => {
  const { medicines, user, isDoseTaken } = useContext(AppContext);
  const [notified, setNotified] = useState({}); // track notified doses to avoid spamming
  const [notifiedMissed, setNotifiedMissed] = useState({});

  // Sync notifiedMissed when user changes
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`medNotifiedMissed_${user.email}`);
      setNotifiedMissed(saved ? JSON.parse(saved) : {});
    } else {
      setNotifiedMissed({});
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    if ('Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }

    const checkReminders = () => {
      const now = new Date();
      const currentHour = now.getHours();
      let timeSlot = '';

      if (currentHour >= 6 && currentHour < 12) timeSlot = 'Morning';
      else if (currentHour >= 12 && currentHour < 17) timeSlot = 'Afternoon';
      else if (currentHour >= 17 && currentHour < 21) timeSlot = 'Evening';
      else timeSlot = 'Night';

      const todayStr = now.toISOString().split('T')[0];

      // 1. Check for upcoming/current reminders
      medicines.forEach(med => {
        if (med.status !== 'Active') return;
        
        // Simple check if it's within start/end dates
        if (med.startDate > todayStr || med.endDate < todayStr) return;

        if (med.times.includes(timeSlot)) {
          const notificationKey = `${med.id}-${todayStr}-${timeSlot}`;
          
          if (!notified[notificationKey]) {
            // Trigger reminder
            triggerReminder(med, timeSlot);
            setNotified(prev => ({ ...prev, [notificationKey]: true }));
          }
        }
      });

      // 2. Check for missed reminders
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      medicines.forEach(med => {
        if (med.status !== 'Active') return;

        const checkSlotMissed = (dateStr, slot, hasSlotPassed) => {
          if (!med.times.includes(slot)) return;
          if (med.startDate > dateStr || med.endDate < dateStr) return;
          if (!hasSlotPassed) return;

          const taken = isDoseTaken(med.id, dateStr, slot);
          if (!taken) {
            const notificationKey = `missed-${med.id}-${dateStr}-${slot}`;
            const latestNotifiedStr = localStorage.getItem(`medNotifiedMissed_${user.email}`);
            const latestNotified = latestNotifiedStr ? JSON.parse(latestNotifiedStr) : {};

            if (!latestNotified[notificationKey]) {
              triggerMissedNotification(med, slot, dateStr);
              const updated = { ...latestNotified, [notificationKey]: true };
              localStorage.setItem(`medNotifiedMissed_${user.email}`, JSON.stringify(updated));
              setNotifiedMissed(updated);
            }
          }
        };

        // Morning slot ends at 12:00 PM
        checkSlotMissed(todayStr, 'Morning', currentHour >= 12);
        
        // Afternoon slot ends at 5:00 PM (17:00)
        checkSlotMissed(todayStr, 'Afternoon', currentHour >= 17);
        
        // Evening slot ends at 9:00 PM (21:00)
        checkSlotMissed(todayStr, 'Evening', currentHour >= 21);
        
        // Night slot for yesterday ends at 6:00 AM today
        checkSlotMissed(yesterdayStr, 'Night', currentHour >= 6);
      });
    };

    const triggerReminder = (med, timeSlot) => {
      const message = `Time to take your ${med.name} (${med.dosage})`;
      
      // Toast
      toastEmitter.emit(message);
      
      // Browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Medicine Reminder', {
          body: message,
          icon: '/vite.svg'
        });
      }
      
      // Sound
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.log('Audio play failed', e));
      } catch (err) {
        console.log('Audio error', err);
      }
    };

    const triggerMissedNotification = (med, slot, dateStr) => {
      const todayStr = new Date().toISOString().split('T')[0];
      const isToday = dateStr === todayStr;
      const displayDate = isToday ? 'today' : 'yesterday';
      const message = `⚠️ You missed your scheduled ${slot} dose of ${med.name} (${med.dosage}) for ${displayDate}!`;
      
      // Toast
      toastEmitter.emit(message);
      
      // Browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Missed Medicine Alert!', {
          body: message,
          icon: '/vite.svg'
        });
      }
      
      // Sound
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.log('Audio play failed', e));
      } catch (err) {
        console.log('Audio error', err);
      }
    };

    // Check immediately and then every minute
    checkReminders();
    const interval = setInterval(checkReminders, 60000);

    return () => clearInterval(interval);
  }, [medicines, user, notified, isDoseTaken]);
};

export default useReminder;
