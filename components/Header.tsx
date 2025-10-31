import React from 'react';
import { User, View } from '../types';
import { AuraLogo, ChartBarIcon, ClipboardListIcon, ChatBubbleLeftRightIcon, LeafIcon, FaceSmileIcon } from './icons';

interface HeaderProps {
  user: User | null;
  onSignOut: () => void;
  activeView: View;
  setActiveView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onSignOut, activeView, setActiveView }) => {
  return (
    <header className="bg-base-100/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <AuraLogo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-gray-800 hidden sm:block">Aura</h1>
        </div>
        
        {user && (
            <>
                <nav className="flex items-center gap-1 md:gap-2 p-1 bg-base-200 rounded-full">
                    <NavButton
                        label="Habits"
                        icon={<ClipboardListIcon />}
                        isActive={activeView === 'habits'}
                        onClick={() => setActiveView('habits')}
                    />
                    <NavButton
                        label="Analytics"
                        icon={<ChartBarIcon />}
                        isActive={activeView === 'analytics'}
                        onClick={() => setActiveView('analytics')}
                    />
                     <NavButton
                        label="Mood"
                        icon={<FaceSmileIcon />}
                        isActive={activeView === 'mood'}
                        onClick={() => setActiveView('mood')}
                    />
                    <NavButton
                        label="Garden"
                        icon={<LeafIcon />}
                        isActive={activeView === 'garden'}
                        onClick={() => setActiveView('garden')}
                    />
                    <NavButton
                        label="Coach"
                        icon={<ChatBubbleLeftRightIcon />}
                        isActive={activeView === 'coach'}
                        onClick={() => setActiveView('coach')}
                    />
                </nav>

                <div className="flex items-center gap-4">
                     <span className="text-sm text-gray-600 hidden lg:block">{user.email}</span>
                     <button 
                        onClick={onSignOut} 
                        className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-300 transition-all duration-200 transform hover:scale-105"
                     >
                        Sign Out
                     </button>
                </div>
            </>
        )}
      </div>
    </header>
  );
};

interface NavButtonProps {
  label: string;
  // Fix: Explicitly type the icon prop to accept a className. This allows React.cloneElement to safely pass props.
  icon: React.ReactElement<{ className?: string }>;
  isActive: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ label, icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 ${
        isActive ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-800'
      }`}
    >
      {React.cloneElement(icon, { className: 'h-5 w-5' })}
      <span className="hidden md:inline">{label}</span>
    </button>
  );
};

export default Header;
