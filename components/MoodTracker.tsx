import React, { useState, useMemo } from 'react';
import { Mood, MoodLog } from '../types';
import MoodLogForm from './MoodLogForm';

interface MoodTrackerProps {
  moodLogs: MoodLog[];
  onSave: (log: MoodLog) => void;
  onDelete: (date: string) => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ moodLogs, onSave, onDelete }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const moodLogsMap = useMemo(() => {
    const map = new Map<string, MoodLog>();
    moodLogs.forEach(log => map.set(log.date, log));
    return map;
  }, [moodLogs]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date.toISOString().split('T')[0]);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedDate(null);
  };

  const moodOfTheWeek = useMemo(() => {
    const moodCounts: { [key in Mood]?: number } = {};
    const today = new Date();
    let count = 0;
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const log = moodLogsMap.get(date.toISOString().split('T')[0]);
        if (log) {
            moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1;
            count++;
        }
    }
    if (count === 0) return 'Not enough data';
    const mostFrequent = Object.entries(moodCounts).reduce((a, b) => a[1]! > b[1]! ? a : b)[0] as Mood;
    // Fix: Correctly perform a reverse lookup on the string enum to get the mood's name from its value (emoji).
    // The previous implementation attempted an invalid type assertion.
    const moodName = Object.entries(Mood).find(([, value]) => value === mostFrequent)?.[0];
    return `${mostFrequent} ${moodName || ''}`;
  }, [moodLogsMap]);

  return (
    <div className="p-4 md:p-8">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-purple-100 rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="px-3 py-1 bg-purple-200 text-purple-900 rounded-md hover:bg-purple-300 transition-colors duration-200">‹</button>
            <h2 className="text-xl font-bold text-purple-900">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="px-3 py-1 bg-purple-200 text-purple-900 rounded-md hover:bg-purple-300 transition-colors duration-200">›</button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-purple-900 opacity-75 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, day) => {
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day + 1);
              const dateStr = date.toISOString().split('T')[0];
              const log = moodLogsMap.get(dateStr);
              const isToday = new Date().toISOString().split('T')[0] === dateStr;

              return (
                <div key={day} onClick={() => handleDateClick(day + 1)} className="p-1 aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer transition-colors duration-200 hover:bg-secondary">
                  <span className={`text-sm font-medium ${isToday ? 'bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center' : 'text-purple-900'}`}>{day + 1}</span>
                  {log && <span className="text-2xl mt-1">{log.mood}</span>}
                </div>
              );
            })}
          </div>
        </div>
        <div className="space-y-6">
            <div className="bg-base-100 rounded-2xl shadow-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-700">Mood of the Week</h3>
                <p className="text-4xl mt-2">{moodOfTheWeek.split(' ')[0]}</p>
                <p className="text-gray-500">{moodOfTheWeek.split(' ').slice(1).join(' ')}</p>
            </div>
             <div className="bg-base-100 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">How to Use</h3>
                <p className="text-sm text-gray-600">Click on any day in the calendar to log your mood. You can add a note to remember what happened that day. Tracking your mood helps you understand your emotional patterns over time.</p>
            </div>
        </div>
      </div>
      {isFormOpen && selectedDate && (
        <MoodLogForm
          date={selectedDate}
          existingLog={moodLogsMap.get(selectedDate)}
          onSave={onSave}
          onDelete={onDelete}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default MoodTracker;