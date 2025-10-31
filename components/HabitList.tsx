import React from 'react';
import { Habit, HabitStats, LogStatus } from '../types';
import HabitCard from './HabitCard';
import { PlusIcon } from './icons';

interface HabitListProps {
  habits: Habit[];
  stats: Map<string, HabitStats>;
  onLog: (habitId: string, status: LogStatus) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onAdd: () => void;
  onStartFocus: (habit: Habit) => void;
}

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

const HabitList: React.FC<HabitListProps> = ({ habits, stats, onLog, onEdit, onDelete, onAdd, onStartFocus }) => {
  const todayStr = formatDate(new Date());

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Habits</h2>
        <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
          <PlusIcon />
          <span className="hidden sm:inline">New Habit</span>
        </button>
      </div>
      {habits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map(habit => {
            const habitStats = stats.get(habit.id);
            const todayLog = habit.logs.find(log => log.date === todayStr);
            return habitStats ? (
              <HabitCard 
                key={habit.id} 
                habit={habit} 
                stats={habitStats}
                onLog={onLog}
                onEdit={onEdit}
                onDelete={onDelete}
                onStartFocus={onStartFocus}
                todayLogStatus={todayLog?.status}
              />
            ) : null;
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-base-200 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-700">No habits yet!</h3>
          <p className="text-gray-500 mt-2 mb-4">Click "New Habit" to start your journey.</p>
          <button onClick={onAdd} className="flex items-center gap-2 mx-auto px-4 py-2 bg-accent text-white rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
            <PlusIcon />
            Create Your First Habit
          </button>
        </div>
      )}
    </div>
  );
};

export default HabitList;