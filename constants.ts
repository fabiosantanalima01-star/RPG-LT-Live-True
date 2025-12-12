
import { Quest, QuestType, QuestCategory, ChatContact, Message, Guild, FeedPost, RankingEntry } from './types';

export const LEVEL_CURVE = {
  1: 100,
  2: 250,
  3: 500, // Hero Name Unlocks
  4: 1000,
  50: 470200
};

export const MOCK_QUESTS: Quest[] = [
  {
    id: '1',
    title: 'Sessão de Trabalho Profundo',
    description: 'Foque exclusivamente no seu projeto principal sem distrações.',
    type: QuestType.TIMED,
    category: QuestCategory.STUDIES,
    xpReward: 150,
    goldReward: 50,
    durationMinutes: 45,
    isCompleted: false
  },
  {
    id: '2',
    title: 'Calistenia Matinal',
    description: 'Complete 3 séries de flexões e agachamentos. Envie foto.',
    type: QuestType.RONDAMICA,
    category: QuestCategory.FORTIS,
    xpReward: 300,
    goldReward: 100,
    proofRequired: true,
    isCompleted: false
  },
  {
    id: '3',
    title: 'Doação para a Guilda',
    description: 'Doe 50 de ouro para o cofre da guilda.',
    type: QuestType.SOCIAL,
    category: QuestCategory.NEXUS,
    xpReward: 50,
    goldReward: 0,
    isCompleted: false
  }
];

export const MOCK_CONTACTS: ChatContact[] = [
  { id: 'u2', name: 'Lady Vex', email: 'vex@guild.com', avatarColor: 'bg-red-500', status: 'online', lastMessage: 'Pronto para a raid?' },
  { id: 'u3', name: 'IronClad', email: 'iron@guild.com', avatarColor: 'bg-blue-600', status: 'busy', lastMessage: 'Preciso de mais poções.' },
  { id: 'u4', name: 'Mystic', email: 'mystic@guild.com', avatarColor: 'bg-purple-500', status: 'offline', lastMessage: 'Vejo você amanhã.' },
];

export const MOCK_MESSAGES: Message[] = [
  { id: 'm1', senderEmail: 'vex@guild.com', receiverEmail: 'me@questlife.com', content: 'Ei! Você terminou a rondâmica diária?', timestamp: new Date(Date.now() - 3600000), isRead: true },
  { id: 'm2', senderEmail: 'me@questlife.com', receiverEmail: 'vex@guild.com', content: 'Ainda não, procurando um lugar para tirar a foto de prova.', timestamp: new Date(Date.now() - 1800000), isRead: true },
  { id: 'm3', senderEmail: 'vex@guild.com', receiverEmail: 'me@questlife.com', content: 'Haha, tenta o parque. A iluminação está épica agora.', timestamp: new Date(Date.now() - 900000), isRead: false },
];

export const MOCK_GUILD: Guild = {
  id: 'g1',
  name: 'Vanguarda Carmesim',
  level: 4,
  members: 28,
  description: 'Guerreiros da produtividade de elite. Check-ins diários obrigatórios.'
};

export const NEURO_TIPS = [
  "Multitarefa reduz o QI em até 15 pontos durante tarefas cognitivas.",
  "Trabalho profundo requer pelo menos 15 minutos para atingir o estado de fluxo.",
  "Dopamina é liberada na 'antecipação' da recompensa, não apenas na recompensa em si.",
  "Visualizar o processo é mais eficaz do que visualizar o resultado."
];

export const MOCK_FEED_POSTS: FeedPost[] = [
  {
    id: 'p1',
    authorId: 'u2',
    authorName: 'Lady Vex',
    authorAvatarColor: 'bg-red-500',
    type: 'PROOF',
    category: QuestCategory.FORTIS,
    guildId: 'g1',
    content: 'Corrida matinal de 5km concluída! A neblina estava intensa hoje. 🏃‍♀️💨',
    reactions: { '⚔️': 2, '🛡️': 0, '🔥': 8, '👑': 1, '💀': 0 },
    comments: [
        { id: 'c1', authorName: 'IronClad', content: 'Foco total! 🔥', timestamp: new Date() }
    ],
    timestamp: new Date(Date.now() - 7200000)
  },
  {
    id: 'p2',
    authorId: 'u3',
    authorName: 'IronClad',
    authorAvatarColor: 'bg-blue-600',
    type: 'ACHIEVEMENT',
    content: 'FINALMENTE! Alcancei o Nível 4 e me tornei um Guerreiro de Bronze.',
    achievementCode: 'GW4-BZD-713',
    reactions: { '⚔️': 10, '🛡️': 5, '🔥': 20, '👑': 5, '💀': 0 },
    comments: [],
    timestamp: new Date(Date.now() - 3600000)
  },
  {
    id: 'p3',
    authorId: 'u4',
    authorName: 'Mystic',
    authorAvatarColor: 'bg-purple-500',
    type: 'PROOF',
    category: QuestCategory.STUDIES,
    content: 'Resumo do livro "Hábitos Atômicos" finalizado. 2 horas de foco absoluto.',
    reactions: { '⚔️': 1, '🛡️': 1, '🔥': 3, '👑': 0, '💀': 0 },
    comments: [],
    timestamp: new Date(Date.now() - 1800000)
  }
];

export const MOCK_RANKING: RankingEntry[] = [
    { userId: 'u2', name: 'Lady Vex', avatarColor: 'bg-red-500', points: 12500, rank: 1 },
    { userId: 'u3', name: 'IronClad', avatarColor: 'bg-blue-600', points: 11200, rank: 2 },
    { userId: 'u4', name: 'Mystic', avatarColor: 'bg-purple-500', points: 9800, rank: 3 },
    { userId: 'u1', name: 'Você', avatarColor: 'bg-indigo-600', points: 4500, rank: 14 },
];
