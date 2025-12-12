
import React, { useState } from 'react';
import { MOCK_CONTACTS, MOCK_MESSAGES, MOCK_GUILD, MOCK_FEED_POSTS, MOCK_RANKING } from '../constants';
import { ChatContact, Message, User, FeedPost, QuestCategory, ReactionType } from '../types';
import Avatar from '../components/Avatar';
import { Send, Users, Shield, Search, MoreVertical, MessageCircle, Filter, Trophy, Info, Swords, Check, CheckCheck, Crown } from 'lucide-react';

interface SocialViewProps {
  currentUser: User;
  onAddXp: (amount: number) => void;
}

const SocialView: React.FC<SocialViewProps> = ({ currentUser, onAddXp }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'dm' | 'guild'>('feed');
  
  // --- DM State ---
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');

  // --- Feed State ---
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(MOCK_FEED_POSTS);
  const [feedFilterCategory, setFeedFilterCategory] = useState<QuestCategory | 'ALL'>('ALL');
  const [feedFilterGuild, setFeedFilterGuild] = useState<'ALL' | 'MY_GUILD'>('ALL');

  const contacts = MOCK_CONTACTS;
  const activeContact = contacts.find(c => c.id === selectedContactId);

  // --- DM Logic ---
  const currentConversation = messages.filter(
    m => (m.senderEmail === activeContact?.email || m.receiverEmail === activeContact?.email)
  ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !activeContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderEmail: 'me@questlife.com', 
      receiverEmail: activeContact.email,
      content: inputMessage,
      timestamp: new Date(),
      isRead: false
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
  };

  // --- Feed Logic ---
  const handleReaction = (postId: string, reaction: ReactionType) => {
    setFeedPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const newCount = (post.reactions[reaction] || 0) + 1;
        
        // Reward Logic: If reaction reaches a threshold (e.g., 10), award extra XP to viewer just for fun/interaction (simulation)
        // In a real app, the author would get XP. Here we give the clicker a tiny bit of XP for engagement.
        if (Math.random() > 0.8) onAddXp(5); 

        return {
          ...post,
          reactions: { ...post.reactions, [reaction]: newCount }
        };
      }
      return post;
    }));
  };

  const handleMiniChallenge = () => {
    alert("Mini-Desafio Iniciado! Quest 'Duelo de Foco de 5min' adicionada ao grimório.");
    // In a real app, this would call onAddQuest from App.tsx
  };

  const filteredPosts = feedPosts.filter(post => {
    if (feedFilterCategory !== 'ALL' && post.category !== feedFilterCategory) return false;
    if (feedFilterGuild === 'MY_GUILD' && post.guildId !== MOCK_GUILD.id) return false;
    return true;
  });

  // --- Render Components ---

  const renderSidebar = () => (
    <div className="w-full md:w-72 lg:w-80 border-r border-white/10 flex flex-col bg-slate-900/50">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-white mb-4">Social Hub</h2>
        <div className="flex bg-black/40 p-1 rounded-lg mb-4">
          <button 
             onClick={() => setActiveTab('feed')}
             className={`flex-1 py-2 text-xs font-bold rounded transition-colors ${activeTab === 'feed' ? 'bg-quest-purple text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Feed
          </button>
          <button 
            onClick={() => setActiveTab('dm')}
            className={`flex-1 py-2 text-xs font-bold rounded transition-colors ${activeTab === 'dm' ? 'bg-quest-purple text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Chat
          </button>
          <button 
             onClick={() => setActiveTab('guild')}
             className={`flex-1 py-2 text-xs font-bold rounded transition-colors ${activeTab === 'guild' ? 'bg-quest-purple text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Guilda
          </button>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1 p-2 space-y-2">
        {activeTab === 'dm' && (
            <>
            <div className="px-2 pb-2 relative">
                <Search className="absolute left-5 top-2.5 w-4 h-4 text-gray-500" />
                <input 
                    type="text" 
                    placeholder="Buscar amigo..." 
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
            </div>
            {contacts.map(contact => (
            <div 
                key={contact.id}
                onClick={() => setSelectedContactId(contact.id)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${selectedContactId === contact.id ? 'bg-white/10 border border-purple-500/30' : 'hover:bg-white/5 border border-transparent'}`}
            >
                <div className="relative">
                <Avatar colorClass={contact.avatarColor} size="sm" hasBorder={false} />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
                    contact.status === 'online' ? 'bg-green-500' : 
                    contact.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'
                }`}></div>
                </div>
                <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-white text-sm truncate">{contact.name}</h3>
                    <span className="text-[10px] text-gray-500">12:30</span>
                </div>
                <p className="text-gray-400 text-xs truncate">{contact.lastMessage}</p>
                </div>
            </div>
            ))}
            </>
        )}

        {/* Ranking Widget (Visible on Feed or Guild) */}
        {(activeTab === 'feed' || activeTab === 'guild') && (
            <div className="p-4">
                <div className="bg-black/40 rounded-xl p-4 border border-white/5 relative group">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-yellow-500 font-bold flex items-center gap-2">
                            <Trophy className="w-4 h-4" /> Ranking Semanal
                        </h3>
                        <div className="relative">
                            <Info className="w-4 h-4 text-gray-500 cursor-help" />
                            {/* Tooltip */}
                            <div className="absolute right-0 bottom-6 w-48 bg-slate-800 text-xs text-gray-300 p-2 rounded shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                Pontos = XP × Dificuldade × Bônus de Velocidade
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {MOCK_RANKING.map((entry, idx) => (
                            <div key={entry.userId} className="flex items-center gap-3 text-sm">
                                <span className={`font-mono font-bold w-4 text-center ${idx < 3 ? 'text-yellow-400' : 'text-gray-500'}`}>{entry.rank}</span>
                                <div className="w-6 h-6 rounded-full overflow-hidden">
                                     <div className={`w-full h-full ${entry.avatarColor}`}></div>
                                </div>
                                <span className={`flex-1 truncate ${entry.userId === 'u1' ? 'text-purple-400 font-bold' : 'text-gray-300'}`}>{entry.name}</span>
                                {idx < 3 && <Crown className="w-3 h-3 text-yellow-500" />}
                                <span className="text-xs text-gray-500 font-mono">{entry.points}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );

  const renderFeed = () => (
    <div className="flex-1 flex flex-col bg-slate-900/30 overflow-hidden">
        {/* Feed Filter Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-4 overflow-x-auto bg-black/20">
            <div className="flex items-center gap-2 text-gray-400 text-sm font-bold min-w-fit">
                <Filter className="w-4 h-4" /> Filtros:
            </div>
            <select 
                value={feedFilterCategory}
                onChange={(e) => setFeedFilterCategory(e.target.value as any)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-white focus:outline-none"
            >
                <option value="ALL">Todas Categorias</option>
                {Object.values(QuestCategory).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select 
                value={feedFilterGuild}
                onChange={(e) => setFeedFilterGuild(e.target.value as any)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-white focus:outline-none"
            >
                <option value="ALL">Global</option>
                <option value="MY_GUILD">Minha Guilda</option>
            </select>
        </div>

        {/* Posts Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {filteredPosts.map(post => (
                <div key={post.id} className="bg-white/5 border border-white/5 rounded-xl p-5 hover:bg-white/[0.07] transition-colors">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-4">
                        <Avatar colorClass={post.authorAvatarColor} size="md" hasBorder={false} />
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <h4 className="font-bold text-white">{post.authorName}</h4>
                                <span className="text-xs text-gray-500">{post.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            {post.type === 'ACHIEVEMENT' ? (
                                <span className="text-xs font-bold text-yellow-400 flex items-center gap-1 mt-1">
                                    <Trophy className="w-3 h-3" /> Conquista Desbloqueada
                                </span>
                            ) : (
                                <span className="text-xs text-purple-400 bg-purple-900/20 px-2 py-0.5 rounded border border-purple-500/20 mt-1 inline-block">
                                    {post.category} • Rondâmica
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="mb-4">
                        {post.achievementCode && (
                            <div className="bg-gradient-to-r from-yellow-900/40 to-transparent border-l-4 border-yellow-500 p-3 mb-3">
                                <p className="text-yellow-200 font-mono text-sm tracking-widest">{post.achievementCode}</p>
                            </div>
                        )}
                        <p className="text-gray-200 text-sm leading-relaxed">{post.content}</p>
                    </div>

                    {/* Reactions Bar */}
                    <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                        {(['⚔️', '🛡️', '🔥', '👑', '💀'] as ReactionType[]).map(emoji => (
                            <button 
                                key={emoji}
                                onClick={() => handleReaction(post.id, emoji)}
                                className="flex items-center gap-1.5 bg-black/30 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/5 transition-all active:scale-95"
                            >
                                <span className="text-base">{emoji}</span>
                                <span className="text-xs font-bold text-gray-400">{post.reactions[emoji] || 0}</span>
                            </button>
                        ))}
                    </div>

                    {/* Comments Preview */}
                    <div className="bg-black/20 rounded-lg p-3 space-y-3">
                        {post.comments.length > 0 ? post.comments.map(c => (
                            <div key={c.id} className="text-xs">
                                <span className="font-bold text-gray-300">{c.authorName}: </span>
                                <span className="text-gray-400">{c.content}</span>
                            </div>
                        )) : (
                            <p className="text-xs text-gray-600 italic">Seja o primeiro a comentar...</p>
                        )}
                        
                        {/* Interactive Comment Input with Mini-Challenge */}
                        <div className="flex gap-2 mt-2 pt-2 border-t border-white/5">
                            <input 
                                type="text" 
                                placeholder="Escreva um comentário..."
                                className="flex-1 bg-transparent text-xs text-white focus:outline-none"
                            />
                            <button 
                                onClick={handleMiniChallenge}
                                title="Lançar Mini-Desafio (5min)"
                                className="text-xs bg-red-900/30 text-red-400 px-2 py-1 rounded border border-red-500/20 hover:bg-red-900/50 flex items-center gap-1"
                            >
                                <Swords className="w-3 h-3" /> Desafiar
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  const renderChatArea = () => {
    if (activeTab === 'guild') {
      return (
        <div className="flex-1 flex items-center justify-center flex-col bg-slate-900/30 p-8">
           <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-900 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/40 mb-4">
             <Shield className="w-10 h-10 text-white" />
           </div>
           <h2 className="text-2xl font-bold text-white">{MOCK_GUILD.name}</h2>
           <p className="text-gray-400 mt-2 max-w-md text-center">{MOCK_GUILD.description}</p>
           
           <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-lg">
             <div className="bg-black/40 p-4 rounded-xl text-center border border-white/5">
                <div className="text-2xl font-bold text-yellow-500">{MOCK_GUILD.level}</div>
                <div className="text-xs text-gray-400 uppercase tracking-widest">Nível</div>
             </div>
             <div className="bg-black/40 p-4 rounded-xl text-center border border-white/5">
                <div className="text-2xl font-bold text-blue-500">{MOCK_GUILD.members}</div>
                <div className="text-xs text-gray-400 uppercase tracking-widest">Membros</div>
             </div>
             <div className="bg-black/40 p-4 rounded-xl text-center border border-white/5">
                <div className="text-2xl font-bold text-green-500">Ativo</div>
                <div className="text-xs text-gray-400 uppercase tracking-widest">Status</div>
             </div>
           </div>
           <button className="mt-8 bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-bold">Entrar no Salão da Guilda</button>
        </div>
      );
    }

    if (!activeContact) {
      return (
        <div className="flex-1 flex items-center justify-center flex-col text-gray-500 bg-slate-900/30">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 opacity-50" />
          </div>
          <p>Selecione um contato para começar a conversar</p>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col bg-slate-900/30">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
          <div className="flex items-center gap-3">
             <Avatar colorClass={activeContact.avatarColor} size="sm" />
             <div>
               <h3 className="text-white font-bold">{activeContact.name}</h3>
               <span className="text-xs text-green-400 flex items-center gap-1">
                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
               </span>
             </div>
          </div>
          <button className="text-gray-400 hover:text-white">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentConversation.map(msg => {
            const isMe = msg.senderEmail === 'me@questlife.com';
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl p-3 ${
                  isMe 
                    ? 'bg-purple-600 text-white rounded-br-none' 
                    : 'bg-white/10 text-gray-200 rounded-bl-none'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                  <div className="flex items-center justify-end gap-1 mt-1 opacity-60">
                    <span className="text-[10px]">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {/* Read Indicator */}
                    {isMe && (
                        msg.isRead ? <CheckCheck className="w-3 h-3 text-blue-300" /> : <Check className="w-3 h-3" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="p-4 bg-black/40 border-t border-white/10">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button 
              onClick={handleSendMessage}
              className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-xl transition-all active:scale-95 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-full rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl">
      {renderSidebar()}
      {activeTab === 'feed' ? renderFeed() : renderChatArea()}
    </div>
  );
};

export default SocialView;
