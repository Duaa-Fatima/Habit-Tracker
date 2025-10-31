import React, { useMemo, useState, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Habit, HabitStats, LogStatus } from '../types';
import { generateAnalyticsSummary } from '../services/geminiService';
// Fix: Corrected import path for icons.
import { SparklesIcon } from './icons';

interface AnalyticsDashboardProps {
  habits: Habit[];
  stats: Map<string, HabitStats>;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ habits, stats }) => {
  const [summary, setSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const overallStats = useMemo(() => {
    const totalHabits = habits.length;
    let totalDone = 0;
    let totalSkipped = 0;
    let totalDaysTracked = 0;
    let bestStreak = 0;
    
    habits.forEach(habit => {
        const s = stats.get(habit.id);
        if(s) {
            totalDone += s.doneDays;
            totalSkipped += s.skippedDays;
            totalDaysTracked += s.totalDays;
            if(s.longestStreak > bestStreak) {
                bestStreak = s.longestStreak;
            }
        }
    });

    const totalPossibleDoneDays = totalDaysTracked - totalSkipped;
    const avgConsistency = totalPossibleDoneDays > 0 ? (totalDone / totalPossibleDoneDays) * 100 : 0;

    return { totalHabits, totalDone, avgConsistency, bestStreak };
  }, [habits, stats]);

  const weeklyChartData = useMemo(() => {
    const data: { name: string, completions: number }[] = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      const dateString = date.toISOString().split('T')[0];
      
      const completions = habits.reduce((acc, habit) => {
        const log = habit.logs.find(l => l.date === dateString);
        return log && log.status === LogStatus.Done ? acc + 1 : acc;
      }, 0);
      data.push({ name: dayName, completions });
    }
    return data;
  }, [habits]);

  const monthlyChartData = useMemo(() => {
    const data: { name: string; [key: string]: number | string }[] = [];
    const habitsByName: { [key: string]: number[] } = {};
    const dateLabels = new Set<string>();

    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0].substring(5); // MM-DD
        dateLabels.add(dateString);
    }
    
    const sortedLabels = Array.from(dateLabels);

    habits.forEach(habit => {
        habitsByName[habit.name] = Array(sortedLabels.length).fill(0);
    });

    sortedLabels.forEach((label, index) => {
      const fullDateStr = `${today.getFullYear()}-${label}`;
      habits.forEach(habit => {
          const log = habit.logs.find(l => l.date === fullDateStr);
          if (log && log.status === LogStatus.Done) {
              habitsByName[habit.name][index] = 1;
          }
      });
    });

    return sortedLabels.map((date, index) => {
        const entry: { name: string; [key: string]: number | string } = { name: date };
        habits.forEach(habit => {
            entry[habit.name] = habitsByName[habit.name][index];
        });
        return entry;
    });
  }, [habits]);

  const handleGenerateSummary = useCallback(async () => {
    setIsLoadingSummary(true);
    const result = await generateAnalyticsSummary(habits, stats);
    setSummary(result);
    setIsLoadingSummary(false);
  }, [habits, stats]);

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Habits" value={overallStats.totalHabits.toString()} />
        <StatCard title="Total Days Done" value={overallStats.totalDone.toString()} />
        <StatCard title="Avg. Consistency" value={`${overallStats.avgConsistency.toFixed(0)}%`} />
        <StatCard title="Best Streak" value={`${overallStats.bestStreak} days`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartContainer title="Weekly Completions">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completions" fill="#E1BEE7" name="Completed Habits" />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="AI-Generated Summary">
          <div className="p-4 h-[300px] flex flex-col">
            {summary ? (
              <div className="text-gray-600 whitespace-pre-wrap overflow-y-auto flex-1">{summary}</div>
            ) : (
              <div className="text-center text-gray-500 m-auto">
                {isLoadingSummary ? 'Generating your summary...' : 'Click the button to generate an AI summary of your progress.'}
              </div>
            )}
            <button onClick={handleGenerateSummary} disabled={isLoadingSummary} className="mt-4 w-full flex items-center justify-center gap-2 bg-primary text-purple-800 font-bold py-2 px-4 rounded-lg hover:bg-purple-300 transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:transform-none disabled:shadow-none">
              <SparklesIcon /> {isLoadingSummary ? 'Analyzing...' : 'Generate Insights'}
            </button>
          </div>
        </ChartContainer>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string }> = ({ title, value }) => (
  <div className="bg-base-100 p-4 rounded-lg shadow-sm text-center">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

const ChartContainer: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-base-100 p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
        {children}
    </div>
);

export default AnalyticsDashboard;