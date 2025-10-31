import React, { useState, useEffect, useRef } from 'react';

interface FocusSessionModalProps {
  onClose: () => void;
  onComplete: () => void;
}

const FocusSessionModal: React.FC<FocusSessionModalProps> = ({ onClose, onComplete }) => {
  const [duration, setDuration] = useState(25);
  const [minutes, setMinutes] = useState(duration);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive) {
      setMinutes(duration);
      setSeconds(0);
    }
  }, [duration, isActive]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds > 0) {
            return prevSeconds - 1;
          }
          if (prevSeconds === 0) {
            if (minutes === 0) {
              clearInterval(intervalRef.current!);
              setIsActive(false);
              onComplete();
              return 0;
            } else {
              setMinutes(prevMinutes => prevMinutes - 1);
              return 59;
            }
          }
          return 0;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
        if(intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, seconds, minutes, onComplete]);

  const toggleTimer = () => {
     if (!isActive && minutes === duration && seconds === 0) {
      setMinutes(duration);
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsActive(false);
    setMinutes(duration);
    setSeconds(0);
  };
  
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    // Set a reasonable min/max duration
    setDuration(Math.max(1, Math.min(120, value || 1)));
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center" onClick={e => e.stopPropagation()}>
        <h2 className="text-3xl font-bold mb-2 text-gray-800">Focus Session</h2>
        <p className="text-gray-500 mb-6">Commit to a block of uninterrupted work.</p>
        
        <div className="mb-6 h-12 flex items-center justify-center">
          {!isActive && (
            <div className="flex items-center justify-center gap-2 transition-opacity duration-300">
              <label htmlFor="duration" className="text-gray-600 font-medium">Duration:</label>
              <input 
                type="number" 
                id="duration" 
                value={duration} 
                onChange={handleDurationChange}
                className="w-20 text-center text-lg font-semibold bg-base-200 text-gray-900 border border-gray-300 rounded-md p-1 focus:ring-2 focus:ring-primary focus:outline-none"
              />
               <span className="text-gray-600 font-medium">min</span>
            </div>
          )}
        </div>

        <div className="text-7xl font-mono font-bold text-primary bg-base-200 rounded-lg py-4 mb-6">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        
        <div className="flex justify-center gap-4">
          <button 
            onClick={toggleTimer} 
            className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105 hover:shadow-lg text-lg font-semibold w-32"
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button 
            onClick={resetTimer} 
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-200 transform hover:scale-105 hover:shadow-lg text-lg font-semibold w-32"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default FocusSessionModal;