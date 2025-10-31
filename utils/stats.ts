import { Habit, LogStatus, HabitStats } from '../types';

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

export const calculateStats = (habit: Habit): HabitStats => {
  const logs = [...habit.logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  let streak = 0;
  let longestStreak = 0;
  let lastDoneDate: Date | null = null;
  
  if (logs.length > 0) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    
    // Check if the last log is today or yesterday to initialize streak
    const lastLog = logs[logs.length - 1];
    if (lastLog.status === LogStatus.Done) {
        const lastLogDate = new Date(lastLog.date);
        const lastLogDateUTC = new Date(lastLogDate.getUTCFullYear(), lastLogDate.getUTCMonth(), lastLogDate.getUTCDate());
        const todayUTC = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
        const yesterdayUTC = new Date(yesterday.getUTCFullYear(), yesterday.getUTCMonth(), yesterday.getUTCDate());

        if (lastLogDateUTC.getTime() === todayUTC.getTime() || lastLogDateUTC.getTime() === yesterdayUTC.getTime()) {
           lastDoneDate = lastLogDate;
           streak = 1;
        }
    }
  }


  for (let i = logs.length - 2; i >= 0; i--) {
    const currentLog = logs[i];
    if (currentLog.status === LogStatus.Done && lastDoneDate) {
      const currentDate = new Date(currentLog.date);
      const diff = (lastDoneDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24);
      if (diff === 1) {
        streak++;
        lastDoneDate = currentDate;
      } else if (diff > 1) {
         break; // Streak broken
      }
    } else if(currentLog.status === LogStatus.Skipped && lastDoneDate) {
        const currentDate = new Date(currentLog.date);
        const diff = (lastDoneDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24);
        if(diff === 1) {
            lastDoneDate = currentDate; // Maintain streak over skipped days
        }
    }
  }
  
  // Calculate longest streak
  let currentLongest = 0;
  let lastDateForLongest: Date | null = null;
  for(const log of logs) {
    if (log.status === LogStatus.Done) {
        const currentDate = new Date(log.date);
        if (lastDateForLongest) {
            const diff = (currentDate.getTime() - lastDateForLongest.getTime()) / (1000 * 3600 * 24);
            if(diff === 1) {
                currentLongest++;
            } else {
                currentLongest = 1;
            }
        } else {
            currentLongest = 1;
        }
        lastDateForLongest = currentDate;
        if(currentLongest > longestStreak) {
            longestStreak = currentLongest;
        }
    } else if (log.status === LogStatus.Skipped) {
        if (lastDateForLongest) {
            const currentDate = new Date(log.date);
            const diff = (currentDate.getTime() - lastDateForLongest.getTime()) / (1000 * 3600 * 24);
            if(diff === 1) {
                lastDateForLongest = currentDate;
            } else {
                currentLongest = 0;
                lastDateForLongest = null;
            }
        }
    } else {
        currentLongest = 0;
        lastDateForLongest = null;
    }
  }


  const startDate = new Date(habit.startDate);
  const today = new Date();
  const totalDays = Math.max(1, Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 3600 * 24)));
  
  const doneDays = logs.filter(l => l.status === LogStatus.Done).length;
  const skippedDays = logs.filter(l => l.status === LogStatus.Skipped).length;

  const relevantDays = totalDays - skippedDays;
  const completionRate = relevantDays > 0 ? (doneDays / relevantDays) * 100 : 0;
  
  return { streak, longestStreak, completionRate, totalDays, doneDays, skippedDays };
};

export const calculateOverallStats = (habits: Habit[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to the start of the day

    let totalDone = 0;
    let totalPossible = 0; // Represents days that were not skipped
    const habitDoneCounts: { [key: string]: number } = {};
    const habitMissedCounts: { [key: string]: number } = {};

    habits.forEach(habit => {
        // Initialize counters for each habit
        if (!habitDoneCounts[habit.name]) habitDoneCounts[habit.name] = 0;
        if (!habitMissedCounts[habit.name]) habitMissedCounts[habit.name] = 0;

        const startDate = new Date(habit.startDate);
        startDate.setHours(0, 0, 0, 0); // Normalize start date

        // Iterate through the last 7 days
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            
            // Only consider days on or after the habit started
            if (d >= startDate) {
                const dateStr = formatDate(d);
                const log = habit.logs.find(l => l.date === dateStr);

                if (log) {
                    if (log.status === LogStatus.Done) {
                        totalDone++;
                        totalPossible++;
                        habitDoneCounts[habit.name]++;
                    } else if (log.status === LogStatus.Pending) {
                        // A pending log on a PAST day is a miss.
                        if (d < today) {
                            totalPossible++;
                            habitMissedCounts[habit.name]++;
                        }
                    }
                    // If status is 'Skipped', it's not a possible day. Do nothing.
                } else {
                    // No log found. If it's a PAST day, it's a miss.
                    if (d < today) {
                        totalPossible++;
                        habitMissedCounts[habit.name]++;
                    }
                }
            }
        }
    });

    const completionRate = totalPossible > 0 ? (totalDone / totalPossible) * 100 : 100;

    const mostCompleted = Object.entries(habitDoneCounts).reduce((a, b) => a[1] > b[1] ? a : b, ['', 0])[0] || 'N/A';
    const mostMissed = Object.entries(habitMissedCounts).reduce((a, b) => a[1] > b[1] ? a : b, ['', 0])[0] || 'N/A';

    return { completionRate, mostCompleted, mostMissed };
};