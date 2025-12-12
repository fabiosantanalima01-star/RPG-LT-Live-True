import React, { useState, useEffect } from 'react';
import { Quest, QuestType, QuestCategory } from '../types';
import QuestCard from '../components/QuestCard';
import { Filter, Plus, X, Timer } from 'lucide-react';

interface QuestsViewProps {
  quests: Quest[];
  onAction: (quest: Quest) => void;
  onAddQuest: (quest: Quest) => void;
  activeQuestId: string | null;
  activeQuestStartTime: number | null;
}

const QuestsView: React.FC<QuestsViewProps> = ({ 
  quests, 
  onAction, 
  onAddQuest,
  activeQuestId, 
  activeQuestStartTime 
}) => {
  const [filter, setFilter] = useState<QuestType | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timerDisplay, setTimerDisplay] = useState("00:00");
  
  // New Quest Form State
  const [newQuestTitle, setNewQuestTitle] = useState("");
  const [newQuestDesc, setNewQuestDesc] = useState("");
  const [newQuestType, setNewQuestType] = useState<QuestType>(QuestType.STANDARD);
  const [newQuestCategory, setNewQuestCategory] = useState<QuestCategory>(QuestCategory.FORTIS);
  const [newQuestDuration, setNewQuestDuration] = useState(25);

  const filteredQuests = quests.filter(q => (filter === 'ALL' || q.type === filter) && !q.isCompleted);
  const activeQuest = quests.find(q => q.id === activeQuestId);

  // Timer Logic
  useEffect(() => {
    if (!activeQuestId || !activeQuestStartTime || !activeQuest) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - activeQuestStartTime) / 1000);
      
      if (activeQuest.type === QuestType.TIMED && activeQuest.durationMinutes) {
        // Countdown
        const totalSeconds = activeQuest.durationMinutes * 60;
        const remainingSeconds = totalSeconds - elapsedSeconds;
        
        if (remainingSeconds <= 0) {
           setTimerDisplay("00:00");
           // Optional: Auto complete or alert could go here
        } else {
           const mins = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
           const secs = (remainingSeconds % 60).toString().padStart(2, '0');
           setTimerDisplay(`${mins}:${secs}`);
        }
      } else {
        // Stopwatch for non-timed active quests (if we enabled them)
        const mins = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
        const secs = (elapsedSeconds % 60).toString().padStart(2, '0');
        setTimerDisplay(`${mins}:${secs}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeQuestId, activeQuestStartTime, activeQuest]);

  const handleSubmitQuest = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuest: Quest = {
      id: Date.now().toString(),
      title: newQuestTitle,
      description: newQuestDesc,
      type: newQuestType,
      category: newQuestCategory,
      xpReward: newQuestType === QuestType.TIMED ? newQuestDuration * 5 : 100, // Dynamic XP calculation
      goldReward: 50,
      durationMinutes: newQuestType === QuestType.TIMED ? newQuestDuration : undefined,
      isCompleted: false
    };
    onAddQuest(newQuest);
    setIsModalOpen(false);
    // Reset form
    setNewQuestTitle("");
    setNewQuestDesc("");
  };

  return (
    <div className="h-full relative overflow-y-auto pr-2">
       {/* Header */}
       <div className="flex justify-between items-center mb-6">
         <h2 className="text-2xl font-bold text-white">Missões Ativas</h2>
         <div className="flex items-center gap-2">
           <button 
             onClick={() => setIsModalOpen(true)}
             className="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg shadow-purple-900/30 active:scale-95 transition-all"
           >
             <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Nova Missão</span>
           </button>
           
           <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg">
             <Filter className="w-4 h-4 text-gray-400 ml-2" />
             <select 
               className="bg-transparent text-sm text-white p-2 focus:outline-none cursor-pointer"
               value={filter}
               onChange={(e) => setFilter(e.target.value as any)}
             >
               <option value="ALL" className="bg-slate-900">Todas</option>
               <option value={QuestType.TIMED} className="bg-slate-900">Tempo</option>
               <option value={QuestType.RONDAMICA} className="bg-slate-900">Rondâmicas</option>
               <option value={QuestType.SOCIAL} className="bg-slate-900">Social</option>
               <option value={QuestType.STANDARD} className="bg-slate-900">Padrão</option>
             </select>
           </div>
         </div>
       </div>

       {/* Active Quest Banner */}
       {activeQuestId && activeQuest && (
         <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/40 to-slate-900 border border-blue-500/50 rounded-xl flex items-center justify-between shadow-lg shadow-blue-900/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 animate-pulse"></div>
            <div>
               <h4 className="text-blue-300 font-bold flex items-center gap-2">
                 <span className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></span> 
                 Missão em Progresso
               </h4>
               <p className="text-white font-bold text-lg mt-1">{activeQuest.title}</p>
               <p className="text-blue-200/70 text-xs">Mantenha o foco absoluto!</p>
            </div>
            <div className="flex flex-col items-end">
               <div className="text-3xl font-mono text-white font-bold tracking-widest bg-black/30 px-4 py-2 rounded-lg border border-white/10 flex items-center gap-3">
                  <Timer className={`w-6 h-6 ${activeQuest.type === QuestType.TIMED ? 'text-red-400 animate-pulse' : 'text-blue-400'}`} />
                  {timerDisplay}
               </div>
               {activeQuest.type === QuestType.TIMED && (
                 <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">Tempo Restante</span>
               )}
            </div>
         </div>
       )}

       {/* Quest Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
         {filteredQuests.map(quest => (
           <QuestCard 
             key={quest.id} 
             quest={quest} 
             onComplete={() => onAction(quest)} 
             isActive={activeQuestId === quest.id}
           />
         ))}
         
         {filteredQuests.length === 0 && (
           <div className="col-span-full py-20 text-center text-gray-500 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center">
             <p className="mb-4">Nenhuma missão encontrada.</p>
             <button 
               onClick={() => setIsModalOpen(true)}
               className="text-purple-400 hover:text-purple-300 text-sm font-bold flex items-center gap-1"
             >
               <Plus className="w-4 h-4" /> Criar a primeira
             </button>
           </div>
         )}
       </div>

       {/* Create Quest Modal */}
       {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
             <button 
               onClick={() => setIsModalOpen(false)}
               className="absolute top-4 right-4 text-gray-400 hover:text-white"
             >
               <X className="w-6 h-6" />
             </button>
             
             <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
               <Plus className="text-purple-500" /> Criar Nova Missão
             </h3>
             
             <form onSubmit={handleSubmitQuest} className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Título</label>
                 <input 
                   required
                   type="text" 
                   value={newQuestTitle} 
                   onChange={e => setNewQuestTitle(e.target.value)}
                   placeholder="Ex: Ler 10 páginas"
                   className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
                 />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Categoria</label>
                   <select 
                     value={newQuestCategory}
                     onChange={e => setNewQuestCategory(e.target.value as QuestCategory)}
                     className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
                   >
                     {Object.values(QuestCategory).map(cat => (
                       <option key={cat} value={cat}>{cat}</option>
                     ))}
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Tipo</label>
                   <select 
                     value={newQuestType}
                     onChange={e => setNewQuestType(e.target.value as QuestType)}
                     className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
                   >
                     <option value={QuestType.STANDARD}>Padrão</option>
                     <option value={QuestType.TIMED}>Cronometrada</option>
                     <option value={QuestType.RONDAMICA}>Rondâmica</option>
                   </select>
                 </div>
               </div>

               {newQuestType === QuestType.TIMED && (
                 <div className="animate-fade-in">
                   <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Duração (Minutos)</label>
                   <input 
                     type="number" 
                     min="1"
                     max="180"
                     value={newQuestDuration} 
                     onChange={e => setNewQuestDuration(Number(e.target.value))}
                     className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
                   />
                 </div>
               )}

               <div>
                 <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Descrição</label>
                 <textarea 
                   rows={3}
                   value={newQuestDesc} 
                   onChange={e => setNewQuestDesc(e.target.value)}
                   placeholder="Detalhes da missão..."
                   className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
                 />
               </div>

               <button 
                 type="submit"
                 className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-900/20 active:scale-95 transition-all mt-4"
               >
                 Adicionar ao Grimório
               </button>
             </form>
           </div>
         </div>
       )}
    </div>
  );
};

export default QuestsView;