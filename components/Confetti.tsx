
import React, { useState, useEffect } from 'react';
// This is a placeholder for a confetti effect. 
// In a real project you would install a library like 'react-confetti'.
// For now, it will just be a visual placeholder.

const Confetti: React.FC = () => {
    // FIX: Replaced 'JSX.Element' with 'React.ReactNode' to resolve the "Cannot find namespace 'JSX'" error.
    const [pieces, setPieces] = useState<React.ReactNode[]>([]);
  
    useEffect(() => {
      const newPieces = Array.from({ length: 150 }).map((_, i) => {
        const style = {
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 3 + 2}s`,
          animationDelay: `${Math.random() * 2}s`,
          backgroundColor: ['#FCE4EC', '#E1BEE7', '#E3F2FD', '#66BB6A'][Math.floor(Math.random() * 4)],
        };
        return <div key={i} className="confetti-piece" style={style}></div>;
      });
      setPieces(newPieces);
    }, []);
  
    return (
      <div className="confetti-container">
        {pieces}
        <style>{`
          .confetti-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
            z-index: 9999;
          }
          .confetti-piece {
            position: absolute;
            width: 10px;
            height: 20px;
            opacity: 0;
            top: -20px;
            animation: drop ease-in-out forwards;
          }
          @keyframes drop {
            0% { transform: translateY(0vh) rotateZ(0deg); opacity: 1; }
            100% { transform: translateY(105vh) rotateZ(360deg); opacity: 0; }
          }
        `}</style>
      </div>
    );
  };
  
  export default Confetti;
