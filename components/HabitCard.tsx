import React, { useState } from 'react';
import { Habit, HabitStats, LogStatus, Category } from '../types';
import { FireIcon, PencilIcon, TrashIcon, PlayIcon } from './icons';
import ConfirmationModal from './ConfirmationModal';

interface HabitCardProps {
  habit: Habit;
  stats: HabitStats;
  onLog: (habitId: string, status: LogStatus) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onStartFocus: (habit: Habit) => void;
  todayLogStatus?: LogStatus;
}

const categoryColors: { [key in Category]: string } = {
  [Category.Health]: 'bg-green-100 text-green-800',
  [Category.Productivity]: 'bg-blue-100 text-blue-800',
  [Category.Study]: 'bg-yellow-100 text-yellow-800',
  [Category.Mindfulness]: 'bg-purple-100 text-purple-800',
};

const HabitCard: React.FC<HabitCardProps> = ({ habit, stats, onLog, onEdit, onDelete, onStartFocus, todayLogStatus }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const LogButton = ({ status, text }: { status: LogStatus, text: string }) => {
    const isSelected = todayLogStatus === status;
    const baseClasses = "px-4 py-2 rounded-md font-semibold transition-all duration-200 transform hover:scale-105 w-full";
    const selectedClasses = status === LogStatus.Done ? "bg-accent text-white" : "bg-gray-500 text-white";
    const unselectedClasses = "bg-base-200 hover:bg-base-300 text-gray-700";
    
    return (
      <button onClick={() => onLog(habit.id, status)} className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}>
        {text}
      </button>
    );
  };

  const handleDeleteConfirm = () => {
    onDelete(habit.id);
    setIsDeleteModalOpen(false);
  };
    
  return (
    <>
      <div className="bg-base-100 rounded-xl shadow-md p-4 flex flex-col justify-between transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg">
        <div>
          <div className="flex justify-between items-start mb-2">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryColors[habit.category]}`}>{habit.category}</span>
              <div className="flex items-center gap-2">
                  <button onClick={() => onStartFocus(habit)} className="p-1 rounded-full text-gray-400 hover:text-accent hover:bg-green-50 transition-colors duration-200">
                      <PlayIcon className="h-4 w-4" />
                  </button>
                  <button onClick={() => onEdit(habit)} className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200">
                      <PencilIcon className="h-4 w-4" />
                  </button>
                  <button 
                      onClick={() => setIsDeleteModalOpen(true)} 
                      className="p-1 rounded-full text-gray-400 hover:text-danger hover:bg-red-50 transition-colors duration-200"
                  >
                      <TrashIcon className="h-4 w-4" />
                  </button>
              </div>
          </div>
          <h3 className="font-bold text-lg text-gray-800">{habit.name}</h3>
          <p className="text-sm text-gray-500 mb-4 h-10">{habit.description}</p>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-center">
              <p className="font-bold text-xl text-orange-500 flex items-center justify-center gap-1"><FireIcon /> {stats.streak}</p>
              <p className="text-xs text-gray-500">Streak</p>
          </div>
          <div className="text-center">
              <p className="font-bold text-xl text-gray-700">{stats.completionRate.toFixed(0)}%</p>
              <p className="text-xs text-gray-500">Rate</p>
          </div>
          <div className="text-center">
              <p className="font-bold text-xl text-gray-700">{stats.longestStreak}</p>
              <p className="text-xs text-gray-500">Best</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <LogButton status={LogStatus.Done} text="Done" />
          <LogButton status={LogStatus.Skipped} text="Skip" />
        </div>
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Habit"
        message={`Are you sure you want to permanently delete the habit "${habit.name}"? This action cannot be undone.`}
      />
    </>
  );
};

export default HabitCard;