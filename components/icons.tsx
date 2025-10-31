import React from 'react';

export const AuraLogo: React.FC<{className?: string}> = ({className = "h-8 w-8 text-purple-600"}) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L3 22H6L7.6 18H16.4L18 22H21L12 2ZM8.4 16L12 5.4L15.6 16H8.4Z" fill="url(#aura-gradient)"/>
        <defs>
            <linearGradient id="aura-gradient" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A78BFA"/>
            <stop offset="1" stopColor="#E1BEE7"/>
            </linearGradient>
        </defs>
    </svg>
);

export const SparklesIcon: React.FC<{className?: string, style?: React.CSSProperties}> = ({className = "h-5 w-5", style}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v.25a.75.75 0 01-1.5 0V2.75A.75.75 0 0110 2zM5.404 4.343a.75.75 0 010 1.06l-.25.25a.75.75 0 11-1.06-1.06l.25-.25a.75.75 0 011.06 0zm9.192 0a.75.75 0 011.06 0l.25.25a.75.75 0 01-1.06 1.06l-.25-.25a.75.75 0 010-1.06zM10 15a.75.75 0 01.75.75v.25a.75.75 0 01-1.5 0v-.25A.75.75 0 0110 15zM4.343 14.596a.75.75 0 011.06 0l.25.25a.75.75 0 01-1.06 1.06l-.25-.25a.75.75 0 010-1.06zm10.253 0a.75.75 0 010 1.06l-.25.25a.75.75 0 11-1.06-1.06l.25-.25a.75.75 0 011.06 0zM2 10a.75.75 0 01.75-.75h.25a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm15 0a.75.75 0 01.75-.75h.25a.75.75 0 010 1.5h-.25A.75.75 0 0117 10zM8.098 5.404a.75.75 0 011.06 0l.25.25a.75.75 0 01-1.06 1.06l-.25-.25a.75.75 0 010-1.06zm4.854 9.192a.75.75 0 011.06 0l.25.25a.75.75 0 01-1.06 1.06l-.25-.25a.75.75 0 010-1.06zM5.404 11.902a.75.75 0 010 1.06l-.25.25a.75.75 0 01-1.06-1.06l.25-.25a.75.75 0 011.06 0z" clipRule="evenodd" />
    </svg>
);

export const PaperAirplaneIcon: React.FC<{className?: string}> = ({className = "h-5 w-5"}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
  </svg>
);

export const ChartBarIcon: React.FC<{className?: string}> = ({className = "h-6 w-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

export const ClipboardListIcon: React.FC<{className?: string}> = ({className = "h-6 w-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);
  
export const ChatBubbleLeftRightIcon: React.FC<{className?: string}> = ({className = "h-6 w-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a1.05 1.05 0 01-1.485 0l-3.72-3.72C9.347 17.1 8.5 16.136 8.5 15v-4.286c0-.97.616-1.813 1.5-2.097m6.25-4.512V5.5a2.25 2.25 0 00-2.25-2.25H6.5a2.25 2.25 0 00-2.25 2.25v4.286c0 .97.616 1.813 1.5 2.097m5.25-2.097V5.5" />
    </svg>
);
  
export const PlusIcon: React.FC<{className?: string}> = ({className = "h-6 w-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

export const FireIcon: React.FC<{className?: string}> = ({className = "h-5 w-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.3 2.046A1 1 0 0112 3v1.667l1.323.945a1 1 0 01.44 1.8l-3.03 1.212a1 1 0 00-.566 1.342l2.333 4.334a1 1 0 01-1.789.96l-2.888-5.333a1 1 0 00-1.788-.001l-2.888 5.333a1 1 0 01-1.789-.96l2.334-4.334a1 1 0 00-.566-1.342L3.237 7.412a1 1 0 01.44-1.8L5 4.667V3a1 1 0 01.7-.954l5.6-1.6A1 1 0 0111.3 2.046zM6 14a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);

export const PencilIcon: React.FC<{className?: string}> = ({className = "h-5 w-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

export const TrashIcon: React.FC<{className?: string}> = ({className = "h-5 w-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);

export const ExclamationTriangleIcon: React.FC<{className?: string}> = ({className = "h-6 w-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

export const LeafIcon: React.FC<{className?: string}> = ({className = "h-6 w-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

export const FlowerIcon: React.FC<{className?: string, style?: React.CSSProperties}> = ({className, style}) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 17.1719C14.849 17.1719 17.1719 14.849 17.1719 12C17.1719 9.15101 14.849 6.82812 12 6.82812C9.15101 6.82812 6.82812 9.15101 6.82812 12C6.82812 14.849 9.15101 17.1719 12 17.1719Z" fill="#FBBF24"/>
        <path d="M12 22C14.1534 19.8466 17.5 16.5 17.5 12C17.5 7.5 14.1534 4.15342 12 2C9.84658 4.15342 6.5 7.5 6.5 12C6.5 16.5 9.84658 19.8466 12 22Z" fill="url(#flower-gradient)"/>
        <defs>
            <radialGradient id="flower-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12 12) rotate(90) scale(10)">
            <stop stopColor="#F472B6"/>
            <stop offset="1" stopColor="#F9A8D4"/>
            </radialGradient>
        </defs>
    </svg>
);


// Plant Icons
export const PlantDyingIcon: React.FC<{className?: string}> = ({className = "w-48 h-48 text-gray-400"}) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12M12 12H9.5M12 12H14.5M12 12L15 9.5M12 12L9 9.5M12 12L15 14.5M12 12L9 14.5M17 17l-1-1M7 17l1-1M12 8V2"/></svg>
);

export const PlantSadIcon: React.FC<{className?: string}> = ({className = "w-48 h-48 text-yellow-600"}) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V10M12 10C12 10 12 5.5 16 5.5C20 5.5 20 10 20 10M12 10C12 10 12 5.5 8 5.5C4 5.5 4 10 4 10M15 13.5C15 13.5 14 15.5 12 15.5C10 15.5 9 13.5 9 13.5"/></svg>
);

export const PlantNeutralIcon: React.FC<{className?: string}> = ({className = "w-48 h-48 text-lime-600"}) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V8M12 8C12 8 12 4 16 4C20 4 20 8 20 8M12 8C12 8 12 4 8 4C4 4 4 8 4 8M16 12C16 12 15 14 12 14C9 14 8 12 8 12"/></svg>
);

export const PlantHappyIcon: React.FC<{className?: string}> = ({className = "w-48 h-48 text-green-600"}) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V8M12 8C12 8 12 3 17 3C22 3 22 8 22 8M12 8C12 8 12 3 7 3C2 3 2 8 2 8M17 13C17 13 16 16 12 16C8 16 7 13 7 13"/></svg>
);

export const PlantThrivingIcon: React.FC<{className?: string}> = ({className = "w-48 h-48 text-emerald-600"}) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22V7M12 7C12 7 12 2 17.5 2C23 2 23 7 23 7M12 7C12 7 12 2 6.5 2C1 2 1 7 1 7M17 12C17 12 16 15 12 15C8 15 7 12 7 12"/>
    <path d="M19.5 9.5C19.5 9.5 18.5 11 17 11.5"/>
    <path d="M4.5 9.5C4.5 9.5 5.5 11 7 11.5"/>
  </svg>
);

export const PlayIcon: React.FC<{className?: string}> = ({className = "h-5 w-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
);

export const FaceSmileIcon: React.FC<{className?: string}> = ({className = "h-6 w-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
