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
import MoodTracker from './components/MoodTracker';
import { Habit, LogStatus, HabitStats, User, View, MoodLog } from './types';
import { calculateStats, calculateOverallStats } from './utils/stats';
import * as authService from './services/authService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [stats, setStats] = useState<Map<string, HabitStats>>(new Map());
  const [activeView, setActiveView] = useState<View>('habits');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);
  const [focusHabit, setFocusHabit] = useState<Habit | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [plantGrowthLevel, setPlantGrowthLevel] = useState(0);

  // Check auth status and load initial data
  useEffect(() => {
    const unsubscribe = authService.checkAuthStatus(async (user) => {
      if (user) {
        setCurrentUser(user);
        const data = await authService.loadUserData(user.uid);
        setHabits(data.habits || []);
        setPlantGrowthLevel(data.plantGrowthLevel || 0);
        setMoodLogs(data.moodLogs || []);
      } else {
        setCurrentUser(null);
        // Reset state when user logs out
        setHabits([]);
        setPlantGrowthLevel(0);
        setMoodLogs([]);
      }
      setIsLoadingAuth(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  
  // Recalculate stats when habits change
  useEffect(() => {
    const newStats = new Map<string, HabitStats>();
    habits.forEach(habit => {
      newStats.set(habit.id, calculateStats(habit));
    });
    setStats(newStats);
  }, [habits]);

  // Save user data whenever it changes (and user is logged in)
  useEffect(() => {
    if (currentUser && !isLoadingAuth) {
      const userData = {
        habits,
        plantGrowthLevel,
        moodLogs
      };
      authService.saveUserData(currentUser.uid, userData);
    }
  }, [habits, plantGrowthLevel, moodLogs, currentUser, isLoadingAuth]);

  
  const handleLoginSuccess = async (user: User) => {
    setCurrentUser(user);
    setIsLoadingAuth(true); // Show loading state while fetching data
    const data = await authService.loadUserData(user.uid);
    setHabits(data.habits || []);
    setPlantGrowthLevel(data.plantGrowthLevel || 0);
    setMoodLogs(data.moodLogs || []);
    setActiveView('habits');
    setIsLoadingAuth(false);
  };
  
  const handleSignOut = async () => {
    await authService.signOut();
    // The auth listener in the first useEffect will handle resetting state.
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
