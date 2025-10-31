import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import HabitList from './components/HabitList';
import HabitForm from './components/HabitForm';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AICoach from './components/AICoach';
import Gamification from './components/Gamification';
import FocusSessionModal from './components/FocusSessionModal';
import Confetti from './components/Confetti';
import AuthPage from './components/AuthPage';
import MoodTracker from './components/MoodTracker'; // Import new component
import { Habit, LogStatus, HabitStats, User, View, MoodLog } from './types';
import { calculateStats, calculateOverallStats } from './utils/stats';
import * as authService from './services/authService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]); // New state for moods
  const [stats, setStats] = useState<Map<string, HabitStats>>(new Map());
  const [activeView, setActiveView] = useState<View>('habits');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);
  const [focusHabit, setFocusHabit] = useState<Habit | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [plantGrowthLevel, setPlantGrowthLevel] = useState(0);

  // Check auth status on initial load
  useEffect(() => {
    const user = authService.checkAuthStatus();
    if (user) {
      setCurrentUser(user);
      const data = authService.loadUserData(user.email);
      setHabits(data.habits);
      setPlantGrowthLevel(data.plantGrowthLevel);
      setMoodLogs(data.moodLogs || []); // Load mood logs
    }
    setIsLoadingAuth(false);
  }, []);
  
  // Create a combined data object for saving
  const userData = useMemo(() => ({
    habits,
    plantGrowthLevel,
    moodLogs
  }), [habits, plantGrowthLevel, moodLogs]);

  // Recalculate stats when habits change and save all user data
  useEffect(() => {
    if (currentUser) {
      const newStats = new Map<string, HabitStats>();
      habits.forEach(habit => {
        newStats.set(habit.id, calculateStats(habit));
      });
      setStats(newStats);
      authService.saveUserData(currentUser.email, userData);
    }
  }, [habits, currentUser, userData]);
  
  // Save all user data when plant growth or mood logs change
  useEffect(() => {
    if (currentUser) {
      authService.saveUserData(currentUser.email, userData);
    }
  }, [plantGrowthLevel, moodLogs, currentUser, userData]);
  
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    const data = authService.loadUserData(user.email);
    setHabits(data.habits);
    setPlantGrowthLevel(data.plantGrowthLevel);
    setMoodLogs(data.moodLogs || []);
    setActiveView('habits');
  };
  
  const handleSignOut = () => {
    authService.signOut();
    setCurrentUser(null);
    setHabits([]);
    setPlantGrowthLevel(0);
    setMoodLogs([]);
  };

  const handleLog = (habitId: string, status: LogStatus) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setHabits(prevHabits => {
      const updatedHabits = prevHabits.map(h => {
        if (h.id === habitId) {
          const newLogs = [...h.logs];
          const logIndex = newLogs.findIndex(l => l.date === todayStr);
          if (logIndex !== -1) {
            newLogs[logIndex].status = newLogs[logIndex].status === status ? LogStatus.Pending : status;
          } else {
            newLogs.push({ date: todayStr, status });
          }
          return { ...h, logs: newLogs };
        }
        return h;
      });
      const allDoneNow = updatedHabits.every(h => {
        const todayLog = h.logs.find(l => l.date === todayStr);
        return todayLog?.status === LogStatus.Done || todayLog?.status === LogStatus.Skipped;
      });
      if (allDoneNow) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
      return updatedHabits;
    });
  };

  const handleSaveHabit = (habitData: Omit<Habit, 'id' | 'logs'>) => {
    if (editingHabit) {
      setHabits(habits.map(h => (h.id === editingHabit.id ? { ...editingHabit, ...habitData } : h)));
    } else {
      const newHabit: Habit = { id: Date.now().toString(), logs: [], ...habitData };
      setHabits([...habits, newHabit]);
    }
    setIsFormOpen(false);
    setEditingHabit(undefined);
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsFormOpen(true);
  };

  const handleDelete = (habitId: string) => {
    setHabits(habits.filter(h => h.id !== habitId));
  };
  
  const handleWaterPlant = () => {
    setPlantGrowthLevel(prev => prev + 1);
  };

  const handleStartFocus = (habit: Habit) => {
    setFocusHabit(habit);
  };

  const handleCompleteFocus = () => {
    if (focusHabit) {
      handleLog(focusHabit.id, LogStatus.Done);
    }
    setFocusHabit(null);
  };

  const handleCloseFocus = () => {
    setFocusHabit(null);
  };
  
  // --- New Mood Handlers ---
  const handleSaveMoodLog = (log: MoodLog) => {
    setMoodLogs(prev => {
        const existingIndex = prev.findIndex(l => l.date === log.date);
        if (existingIndex !== -1) {
            const updatedLogs = [...prev];
            updatedLogs[existingIndex] = log;
            return updatedLogs;
        }
        return [...prev, log];
    });
  };

  const handleDeleteMoodLog = (date: string) => {
      setMoodLogs(prev => prev.filter(l => l.date !== date));
  };

  const overallStats = useMemo(() => calculateOverallStats(habits), [habits]);

  if (isLoadingAuth) {
      return <div className="min-h-screen bg-base-300 flex items-center justify-center"><p>Loading...</p></div>;
  }
  
  if (!currentUser) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="bg-base-300 min-h-screen font-sans">
      {showConfetti && <Confetti />}
      <Header 
        user={currentUser}
        onSignOut={handleSignOut}
        activeView={activeView} 
        setActiveView={setActiveView} 
      />
      <main>
        {activeView === 'habits' && (
          <HabitList
            habits={habits}
            stats={stats}
            onLog={handleLog}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={() => { setEditingHabit(undefined); setIsFormOpen(true); }}
            onStartFocus={handleStartFocus}
          />
        )}
        {activeView === 'analytics' && <AnalyticsDashboard habits={habits} stats={stats} />}
        {activeView === 'coach' && <AICoach habits={habits} stats={stats} />}
        {activeView === 'garden' && <Gamification habits={habits} overallStats={overallStats} plantGrowthLevel={plantGrowthLevel} onWaterPlant={handleWaterPlant} />}
        {activeView === 'mood' && (
            <MoodTracker 
                moodLogs={moodLogs}
                onSave={handleSaveMoodLog}
                onDelete={handleDeleteMoodLog}
            />
        )}
      </main>
      {isFormOpen && (
        <HabitForm
          habit={editingHabit}
          onClose={() => { setIsFormOpen(false); setEditingHabit(undefined); }}
          onSave={handleSaveHabit}
        />
      )}
      {focusHabit && (
        <FocusSessionModal 
          onClose={handleCloseFocus}
          onComplete={handleCompleteFocus}
        />
      )}
    </div>
  );
};

export default App;
