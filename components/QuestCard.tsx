import React from 'react';
import { Quest, QuestType } from '../types';
import { Clock, Camera, Swords, CheckCircle2, Timer } from 'lucide-react';

interface QuestCardProps {
  quest: Quest;
  onComplete: (id: string) => void;
  isActive?: boolean;
}

const QuestCard: React.FC<QuestCardProps> = ({ quest, onComplete, isActive = false }) => {
  const getIcon = () => {
    switch (quest.type) {
      case QuestType.TIMED: return <Clock className="w-5 h-5 text-blue-400" />;
      case QuestType.RONDAMICA: return <Camera className="w-5 h-5 text-red-400" />;
      case QuestType.SOCIAL: return <Swords className="w-5 h-5 text-green-400" />;
      default: return <CheckCircle2 className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getBorderColor = () => {
    if (isActive) return 'border-blue-500 shadow-blue-500/20 shadow-lg';
    switch (quest.type) {
      case QuestType.RONDAMICA: return 'border-red-500/30 hover:border-red-500';
      case QuestType.TIMED: return 'border-blue-500/30 hover:border-blue-500';
      default: return 'border-quest-purple/30 hover:border-quest-purple';
    }
  };

  return (
    <div className={`group relative bg-quest-card/40 backdrop-blur-md rounded-xl p-4 border ${getBorderColor()} transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20 hover:-translate-y-1 overflow-hidden`}>
      {/* Background glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="flex justify-between items-start mb-2 relative z-10">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg shadow-inner ${isActive ? 'bg-blue-500/20 animate-pulse' : 'bg-black/20'}`}>
            {isActive ? <Timer className="w-5 h-5 text-blue-400" /> : getIcon()}
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{quest.category}</span>
            <h3 className="font-bold text-white leading-tight">{quest.title}</h3>
          </div>
        </div>
        <div className="text-right">
          <div className="text-yellow-400 text-sm font-bold flex items-center justify-end gap-1">
            <span>+{quest.xpReward} XP</span>
          </div>
          <div className="text-yellow-600/80 text-xs font-semibold">
            +{quest.goldReward} Ouro
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-300 mb-4 line-clamp-2 relative z-10">{quest.description}</p>
      
      <div className="flex items-center justify-between mt-auto relative z-10">
        <div className="flex gap-2">
            {quest.type === QuestType.TIMED && (
                <span className="text-xs bg-blue-900/50 text-blue-200 px-2 py-1 rounded border border-blue-500/20">
                {quest.durationMinutes}m
                </span>
            )}
            {quest.proofRequired && (
                <span className="text-xs bg-red-900/50 text-red-200 px-2 py-1 rounded border border-red-500/20">
                Prova
                </span>
            )}
        </div>
        
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onComplete(quest.id);
          }}
          className={`relative z-20 ml-auto text-xs font-bold py-2 px-4 rounded-lg shadow-lg transition-all active:scale-95 cursor-pointer ${
            isActive 
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-900/40'
              : 'bg-gradient-to-r from-quest-purple to-quest-accent hover:from-purple-600 hover:to-pink-600 text-white shadow-purple-900/40'
          }`}
        >
          {isActive 
            ? 'Parar' 
            : quest.type === QuestType.TIMED ? 'Iniciar' : 'Concluir'
          }
        </button>
      </div>
    </div>
  );
};

export default QuestCard;