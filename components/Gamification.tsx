import React, { useState, useMemo } from 'react';
import { Habit, LogStatus } from '../types';
import {
  PlantDyingIcon,
  PlantSadIcon,
  PlantNeutralIcon,
  PlantHappyIcon,
  PlantThrivingIcon,
  SparklesIcon,
  FlowerIcon,
} from './icons';

interface GamificationProps {
  habits: Habit[];
  overallStats: {
    completionRate: number;
    mostCompleted: string;
    mostMissed: string;
  };
  plantGrowthLevel: number;
  onWaterPlant: () => void;
}

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

const Gamification: React.FC<GamificationProps> = ({ habits, overallStats, plantGrowthLevel, onWaterPlant }) => {
  const [isWatering, setIsWatering] = useState(false);

  const { completionRate, mostCompleted, mostMissed } = overallStats;

  const getPlantState = () => {
    if (completionRate >= 95) return {
      icon: <PlantThrivingIcon />,
      message: `I'm thriving thanks to you! You've been amazing, especially with "${mostCompleted}". Keep it up! 🌸`
    };
    if (completionRate >= 75) return {
      icon: <PlantHappyIcon />,
      message: `I'm feeling happy and healthy! You're doing great with your habits, especially "${mostCompleted}". Consistency is key! 😊`
    };
    if (completionRate >= 50) return {
      icon: <PlantNeutralIcon />,
      message: `I'm doing okay, but I know we can do better together. Let's focus on completing habits like "${mostMissed}" more often. 🌱`
    };
    if (completionRate >= 25) return {
      icon: <PlantSadIcon />,
      message: `I'm feeling a little thirsty. We've missed a few habits like "${mostMissed}" recently. Let's try to get back on track! 💧`
    };
    return {
      icon: <PlantDyingIcon />,
      message: `I'm wilting... We've missed a lot of habits, especially "${mostMissed}". I need some water and consistency to feel better. 🥀`
    };
  };

  const { icon, message } = getPlantState();

  const allHabitsDoneToday = useMemo(() => {
    if (habits.length === 0) return false;
    const todayStr = formatDate(new Date());
    return habits.every(habit => {
      const todayLog = habit.logs.find(log => log.date === todayStr);
      return todayLog?.status === LogStatus.Done || todayLog?.status === LogStatus.Skipped;
    });
  }, [habits]);

  const handleWaterPlant = () => {
    if (!allHabitsDoneToday || isWatering) return;
    setIsWatering(true);
    setTimeout(() => {
        onWaterPlant();
    }, 1000);
    setTimeout(() => setIsWatering(false), 2000); // Animation duration
  };

  const getFlowerPosition = (index: number) => {
    const positions = [
      { top: '20%', left: '30%', transform: 'rotate(-15deg)' },
      { top: '35%', left: '65%', transform: 'rotate(20deg)' },
      { top: '55%', left: '25%', transform: 'rotate(10deg)' },
      { top: '15%', left: '55%', transform: 'rotate(-25deg)' },
      { top: '60%', left: '70%', transform: 'rotate(5deg)' },
      { top: '75%', left: '45%', transform: 'rotate(30deg)' },
      { top: '5%', left: '40%', transform: 'rotate(0deg)' },
      { top: '40%', left: '10%', transform: 'rotate(-5deg)' },
    ];
    return positions[index % positions.length];
  };

  const WaterSparkle = () => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => (
        <SparklesIcon
          key={i}
          className="absolute text-blue-400 animate-sparkle"
          style={{
            top: `${Math.random() * 40 + 20}%`,
            left: `${Math.random() * 80 + 10}%`,
            animationDelay: `${Math.random() * 1}s`,
            width: `${Math.random() * 16 + 8}px`,
            height: `${Math.random() * 16 + 8}px`,
          }}
        />
      ))}
      <style>{`
        @keyframes sparkle {
          0% { transform: translateY(0) scale(0); opacity: 1; }
          50% { opacity: 1; }
          100% { transform: translateY(80px) scale(1.5); opacity: 0; }
        }
        .animate-sparkle {
            animation: sparkle 1s ease-out forwards;
        }
        @keyframes bloom {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bloom {
            animation: bloom 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );

  return (
    <div className="p-4 md:p-8 flex flex-col items-center justify-center text-center">
      <div className="bg-base-100 rounded-2xl shadow-lg p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-800">Your Habit Garden</h2>
        <p className="text-gray-500 mb-8">Your plant's health reflects your consistency. Water it daily by completing your habits!</p>
        
        <div className="relative group w-48 h-48 mx-auto mb-8 transition-transform duration-300 transform hover:scale-110">
          {icon}
          {isWatering && <WaterSparkle />}
           {plantGrowthLevel > 0 && (
            <div className="absolute inset-0">
              {Array.from({ length: Math.min(plantGrowthLevel, 8) }).map((_, i) => (
                <FlowerIcon 
                  key={i} 
                  className="absolute w-8 h-8 animate-bloom"
                  style={getFlowerPosition(i)}
                />
              ))}
            </div>
          )}
          <div className="absolute bottom-full mb-2 w-72 p-3 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none left-1/2 -translate-x-1/2">
            {message}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-800"></div>
          </div>
        </div>

        <button
          onClick={handleWaterPlant}
          disabled={!allHabitsDoneToday || isWatering}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {isWatering ? 'Watering...' : 'Water Plant'}
        </button>
        {!allHabitsDoneToday && (
            <p className="text-xs text-gray-500 mt-2">Complete all your habits for today to unlock!</p>
        )}
      </div>
    </div>
  );
};

export default Gamification;