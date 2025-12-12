import React from 'react';

interface AvatarProps {
  colorClass: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hasBorder?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ colorClass, size = 'md', hasBorder = true }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32'
  };

  return (
    <div className={`relative ${sizeClasses[size]} rounded-full flex items-center justify-center ${hasBorder ? 'border-2 border-yellow-500/50' : ''}`}>
      {/* 3D Simulation using shadows and gradients */}
      <div className={`absolute inset-0 rounded-full ${colorClass} bg-gradient-to-br from-white/30 to-black/30 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-4px_6px_rgba(0,0,0,0.4),0_4px_10px_rgba(0,0,0,0.5)]`}>
        {/* Shine reflection */}
        <div className="absolute top-2 left-2 w-1/3 h-1/3 bg-white/20 rounded-full blur-[2px]"></div>
      </div>
      
      {/* Optional Inner icon or initial could go here */}
      <div className="relative z-10 text-white font-bold drop-shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-1/2 h-1/2 mx-auto opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
    </div>
  );
};

export default Avatar;