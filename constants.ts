
import { Habit, Category, Frequency, LogStatus } from './types';

const today = new Date();
const formatDate = (date: Date): string => date.toISOString().split('T')[0];

const generateLogs = (startDate: Date, days: number, pattern: LogStatus[]): { date: string; status: LogStatus }[] => {
  const logs = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    if (date > today) break;
    logs.push({
      date: formatDate(date),
      status: pattern[i % pattern.length],
    });
  }
  return logs;
};

const startDate1 = new Date();
startDate1.setDate(today.getDate() - 20);

const startDate2 = new Date();
startDate2.setDate(today.getDate() - 30);

const startDate3 = new Date();
startDate3.setDate(today.getDate() - 15);

export const INITIAL_HABITS: Habit[] = [
  {
    id: '1',
    name: 'Read for 30 minutes',
    description: 'Read a book from my reading list.',
    category: Category.Study,
    frequency: Frequency.Daily,
    startDate: formatDate(startDate1),
    logs: generateLogs(startDate1, 20, [LogStatus.Done, LogStatus.Done, LogStatus.Skipped, LogStatus.Done, LogStatus.Pending]),
  },
  {
    id: '2',
    name: 'Morning Jog',
    description: 'A 3km jog around the park.',
    category: Category.Health,
    frequency: Frequency.Daily,
    startDate: formatDate(startDate2),
    logs: generateLogs(startDate2, 30, [LogStatus.Done, LogStatus.Done, LogStatus.Done, LogStatus.Done, LogStatus.Done, LogStatus.Skipped, LogStatus.Pending]),
  },
  {
    id: '3',
    name: 'Meditate for 10 minutes',
    description: 'Use a guided meditation app.',
    category: Category.Mindfulness,
    frequency: Frequency.Daily,
    startDate: formatDate(startDate3),
    logs: generateLogs(startDate3, 15, [LogStatus.Done, LogStatus.Skipped, LogStatus.Done, LogStatus.Done]),
  },
];

export const KNOWLEDGE_BASE = `
  - Habit Stacking: One of the best ways to build a new habit is to identify a current habit you already do each day and then stack your new behavior on top.
  - The 2-Minute Rule: When you start a new habit, it should take less than two minutes to do. This makes it easier to start and build momentum.
  - Reward Yourself: When you successfully complete a habit, give yourself an immediate reward. This creates a positive feedback loop.
  - Don't Break the Chain Twice: Missing a habit once is an accident. Missing it twice is the start of a new habit. Try to get back on track immediately.
  - Environment Design: Make your desired habits easier to do by designing your environment for success. Want to read more? Put a book on your pillow.
`;
