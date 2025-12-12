import React from 'react';
import { User } from '../types';
import Avatar from '../components/Avatar';
import { Shield, Zap, Coins, Trophy, User as UserIcon, Calendar, Target } from 'lucide-react';

interface ProfileViewProps {
  user: User;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user }) => {
  return (
    <div className="h-full overflow-y-auto space-y-6 pb-20">
      {/* Header Profile Card */}
      <div className="relative bg-gradient-to-b from-quest-card to-slate-900 rounded-2xl p-8 border border-white/10 overflow-hidden shadow-2xl">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -ml-16 -mb-16"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex flex-col items-center">
             <div className="ring-4 ring-white/10 rounded-full p-1">
                <Avatar colorClass={user.avatarColor} size="xl" />
             </div>
             <div className="mt-4 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-bold border border-yellow-500/30">
               {user.rankTitle}
             </div>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-bold text-white mb-1">
              {user.heroName || user.name}
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              {user.heroName ? `Identidade Secreta: ${user.name}` : 'Aspirante QuestLife'}
            </p>
            
            {/* Level Progress */}
            <div className="w-full max-w-md">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-purple-300">Nível {user.level}</span>
                <span className="text-gray-500">{user.xp} / {user.xpToNextLevel} XP</span>
              </div>
              <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-white/5">
                <div 
                   className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-500"
                   style={{ width: `${(user.xp / user.xpToNextLevel) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-center min-w-[100px]">
               <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
               <div className="text-xl font-bold text-white">12</div>
               <div className="text-[10px] text-gray-400 uppercase">Conquistas</div>
            </div>
            <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-center min-w-[100px]">
               <Shield className="w-6 h-6 text-blue-500 mx-auto mb-2" />
               <div className="text-xl font-bold text-white">4</div>
               <div className="text-[10px] text-gray-400 uppercase">Rank Guilda</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Goals Section */}
         <div className="md:col-span-2 bg-slate-900/50 border border-white/5 rounded-xl p-6">
            <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
              <Target className="text-red-400" /> Objetivos Ativos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               {user.goals.length > 0 ? user.goals.map((goal, index) => (
                 <div key={index} className="bg-white/5 p-3 rounded-lg flex items-center gap-3 border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-300 text-sm">{goal}</span>
                 </div>
               )) : (
                 <p className="text-gray-500 text-sm italic">Nenhum objetivo definido.</p>
               )}
            </div>
         </div>

         {/* Inventory Summary (Placeholder for future) */}
         <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
            <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
               <Coins className="text-yellow-400" /> Inventário
            </h3>
            <div className="space-y-4">
               <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg">
                  <span className="text-sm text-gray-300">Ouro Total</span>
                  <span className="font-bold text-yellow-400">{user.gold}</span>
               </div>
               <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg opacity-50">
                  <span className="text-sm text-gray-300">Poções</span>
                  <span className="font-bold text-white">0</span>
               </div>
               <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-400 mt-2">
                  Ver Loja (Em Breve)
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ProfileView;