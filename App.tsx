import React, { useState } from 'react';
import { User, Quest, QuestType } from './types';
import { LEVEL_CURVE, MOCK_QUESTS, NEURO_TIPS } from './constants';
import Onboarding from './views/Onboarding';
import SocialView from './views/SocialView';
import QuestsView from './views/QuestsView';
import ProfileView from './views/ProfileView';
import Avatar from './components/Avatar';
import { LayoutDashboard, Scroll, Users, User as UserIcon, LogOut, Sparkles, Coins, Zap, Award } from 'lucide-react';

const App: React.FC = () => {
  // --- Global State ---
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'quests' | 'social' | 'profile'>('dashboard');
  
  // Quest State
  const [quests, setQuests] = useState<Quest[]>(MOCK_QUESTS);
  const [activeQuestId, setActiveQuestId] = useState<string | null>(null);
  const [activeQuestStartTime, setActiveQuestStartTime] = useState<number | null>(null);
  
  // User State
  const [user, setUser] = useState<User>({
    id: 'u1',
    name: 'Viajante Novato',
    level: 2,
    xp: 450,
    xpToNextLevel: 500,
    gold: 120,
    avatarColor: 'bg-indigo-600',
    rankTitle: 'Civil',
    goals: []
  });

  const [notification, setNotification] = useState<string | null>(null);

  // --- Handlers ---

  const showNotification = (msg: string) => {
    setNotification(null); // Clear first to force re-render/re-animation
    setTimeout(() => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    }, 50);
  };

  const handleOnboardingComplete = (goals: string[]) => {
    setUser(prev => ({ ...prev, goals }));
    setIsOnboarded(true);
  };

  const addXp = (amount: number) => {
    setUser(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let nextLevelXp = prev.xpToNextLevel;

      // Level Up Logic
      if (newXp >= nextLevelXp) {
        newLevel += 1;
        // Simple curve progression
        nextLevelXp = (LEVEL_CURVE as any)[newLevel] || nextLevelXp * 1.5;
        showNotification(`Subiu de Nível! Você agora é Nível ${newLevel}`);
        
        // Hero Name Prompt (Level 3 Logic)
        if (newLevel === 3) {
            setTimeout(() => {
                const heroName = prompt("Acorde, Soldado! Escolha seu Codinome de Herói Secreto:");
                if (heroName) {
                    setUser(u => ({ ...u, heroName: heroName, rankTitle: 'Soldado' }));
                }
            }, 500);
        }
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        xpToNextLevel: nextLevelXp
      };
    });
  };

  const handleQuestComplete = (quest: Quest) => {
    addXp(quest.xpReward);
    setUser(prev => ({ ...prev, gold: prev.gold + quest.goldReward }));
    showNotification(`Missão Completa! +${quest.xpReward} XP, +${quest.goldReward} Ouro`);
    
    // Mark as completed in state (optional, or remove it)
    setQuests(prev => prev.map(q => q.id === quest.id ? { ...q, isCompleted: true } : q));
  };

  const handleAddQuest = (newQuest: Quest) => {
    setQuests(prev => [newQuest, ...prev]);
    showNotification("Nova missão adicionada ao seu grimório!");
  };

  // Centralized Logic for Quest Actions (Start, Stop, Upload, Complete)
  const handleQuestAction = (quest: Quest) => {
    // 1. TIMED QUEST LOGIC
    if (quest.type === QuestType.TIMED) {
       if (activeQuestId === quest.id) {
         // Stop/Complete logic
         const confirmComplete = window.confirm("O tempo da missão acabou? Você tem certeza que completou a tarefa?");
         if (confirmComplete) {
           handleQuestComplete(quest);
           setActiveQuestId(null);
           setActiveQuestStartTime(null);
         } else {
            // Just cancelling
            if (window.confirm("Deseja cancelar a missão atual?")) {
                setActiveQuestId(null);
                setActiveQuestStartTime(null);
                showNotification("Missão cancelada.");
            }
         }
       } else {
         // Start logic
         if (activeQuestId) {
             alert("Você já tem uma missão ativa! Termine-a ou cancele-a antes de iniciar outra.");
             return;
         }
         // Start the timer
         setActiveQuestId(quest.id);
         setActiveQuestStartTime(Date.now());
         showNotification(`Missão Iniciada: ${quest.title}`);
       }
       return;
    }

    // 2. RONDAMICA LOGIC (Photo Proof)
    if (quest.type === QuestType.RONDAMICA) {
         const fileInput = document.createElement('input');
         fileInput.type = 'file';
         fileInput.accept = 'image/*';
         fileInput.onchange = () => {
             // Simulating upload
             showNotification("Enviando prova...");
             setTimeout(() => {
                alert("Prova Verificada com Sucesso!");
                handleQuestComplete(quest);
             }, 1000);
         };
         fileInput.click();
         return;
    }

    // 3. DEFAULT LOGIC (Standard, Social, etc.)
    handleQuestComplete(quest);
  };

  // --- Views ---

  if (!isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const renderContent = () => {
    switch(currentView) {
      case 'social': return <SocialView currentUser={user} onAddXp={addXp} />;
      case 'quests': return (
        <QuestsView 
          quests={quests}
          onAction={handleQuestAction} 
          onAddQuest={handleAddQuest}
          activeQuestId={activeQuestId} 
          activeQuestStartTime={activeQuestStartTime}
        />
      );
      case 'profile': return <ProfileView user={user} />;
      case 'dashboard': 
        return (
          <div className="space-y-6">
             {/* Daily Tip Panel */}
             <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-white/10 rounded-xl p-6 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Sparkles size={100} />
                </div>
                <h3 className="text-purple-300 font-bold uppercase text-xs tracking-wider mb-2">Neuro-Dica do Dia</h3>
                <p className="text-xl font-medium text-white max-w-2xl italic">"{NEURO_TIPS[Math.floor(Math.random() * NEURO_TIPS.length)]}"</p>
             </div>

             {/* Stats Overview */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors">
                  <div className="p-3 bg-yellow-500/20 rounded-lg text-yellow-400"><Coins /></div>
                  <div>
                    <div className="text-2xl font-bold text-white">{user.gold}</div>
                    <div className="text-xs text-gray-400 uppercase">Riqueza Total</div>
                  </div>
               </div>
               <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors">
                  <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400"><Zap /></div>
                  <div>
                    <div className="text-2xl font-bold text-white">{user.xp}</div>
                    <div className="text-xs text-gray-400 uppercase">Experiência</div>
                  </div>
               </div>
               <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors">
                  <div className="p-3 bg-green-500/20 rounded-lg text-green-400"><Award /></div>
                  <div>
                    <div className="text-2xl font-bold text-white">{user.rankTitle}</div>
                    <div className="text-xs text-gray-400 uppercase">Rank Atual</div>
                  </div>
               </div>
             </div>

             <QuestsView 
                quests={quests}
                onAction={handleQuestAction} 
                onAddQuest={handleAddQuest}
                activeQuestId={activeQuestId} 
                activeQuestStartTime={activeQuestStartTime}
             />
          </div>
        );
      default: return <div className="p-10 text-center text-gray-500">Em Desenvolvimento</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0a1e] text-white font-sans flex overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-20 lg:w-64 bg-[#151024] border-r border-white/5 flex flex-col z-20 shadow-2xl">
        <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
          <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-lg rotate-3 shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
          <span className="hidden lg:block font-bold text-xl tracking-tight">QuestLife</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavButton 
            active={currentView === 'dashboard'} 
            onClick={() => setCurrentView('dashboard')} 
            icon={<LayoutDashboard />} 
            label="Painel" 
          />
          <NavButton 
            active={currentView === 'quests'} 
            onClick={() => setCurrentView('quests')} 
            icon={<Scroll />} 
            label="Missões" 
          />
          <NavButton 
            active={currentView === 'social'} 
            onClick={() => setCurrentView('social')} 
            icon={<Users />} 
            label="Social" 
          />
          <NavButton 
            active={currentView === 'profile'} 
            onClick={() => setCurrentView('profile')} 
            icon={<UserIcon />} 
            label="Perfil" 
          />
        </nav>

        <div className="p-4 mt-auto">
           <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 mb-4 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setCurrentView('profile')}>
              <Avatar colorClass={user.avatarColor} size="sm" hasBorder={false} />
              <div className="hidden lg:block overflow-hidden">
                 <div className="font-bold text-sm truncate">{user.heroName || user.name}</div>
                 <div className="text-xs text-purple-400">Nível {user.level} {user.rankTitle}</div>
              </div>
           </div>
           <button className="w-full flex items-center justify-center lg:justify-start gap-3 text-gray-400 hover:text-white hover:bg-white/5 p-2 rounded-lg transition-colors">
             <LogOut size={18} />
             <span className="hidden lg:inline text-sm font-medium">Sair</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen relative">
        {/* Top Header (Mobile/Context) */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0f0a1e]/80 backdrop-blur-md sticky top-0 z-10">
           <h1 className="text-lg font-semibold text-gray-200 capitalize">
             {currentView === 'social' ? 'Guilda & Chat' : 
              currentView === 'dashboard' ? 'Painel Principal' :
              currentView === 'quests' ? 'Quadro de Missões' : 'Perfil do Jogador'}
           </h1>
           
           {/* XP Bar Component */}
           <div className="flex flex-col items-end w-48">
              <div className="flex justify-between w-full text-[10px] text-gray-400 font-bold mb-1">
                 <span>XP {user.xp} / {user.xpToNextLevel}</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-gradient-to-r from-purple-600 to-pink-500 shadow-[0_0_10px_rgba(192,38,211,0.5)] transition-all duration-500 ease-out"
                   style={{ width: `${(user.xp / user.xpToNextLevel) * 100}%` }}
                 ></div>
              </div>
           </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-hidden p-6 relative">
           {notification && (
             <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500/90 text-white px-6 py-3 rounded-full shadow-xl shadow-green-900/20 backdrop-blur-md z-50 animate-bounce pointer-events-none">
               {notification}
             </div>
           )}
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-gradient-to-r from-purple-600/20 to-purple-900/10 text-purple-300 border border-purple-500/20' 
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    <span className={`transition-transform duration-300 ${active ? 'scale-110 text-purple-400' : 'group-hover:scale-110'}`}>
      {icon}
    </span>
    <span className="hidden lg:block font-medium text-sm">{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_5px_currentColor]"></div>}
  </button>
);

export default App;