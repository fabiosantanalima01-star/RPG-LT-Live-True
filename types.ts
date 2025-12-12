
export enum QuestType {
  STANDARD = 'STANDARD',
  RONDAMICA = 'RONDAMICA', // Dynamic/Random
  TIMED = 'TIMED',
  COLLECTION = 'COLLECTION',
  SOCIAL = 'SOCIAL',
  EXPLORATION = 'EXPLORATION'
}

export enum QuestCategory {
  ARCANUM = 'Arcanum', // Intellect/Magic
  FORTIS = 'Fortis',   // Strength
  NEXUS = 'Nexus',     // Social
  AURUM = 'Aurum',     // Financial
  VITALIS = 'Vitalis', // Health
  STUDIES = 'Estudos'  // Education
}

export interface User {
  id: string;
  name: string;
  heroName?: string; // Unlock at lvl 3
  level: number;
  xp: number;
  xpToNextLevel: number;
  gold: number;
  avatarColor: string;
  rankTitle: string;
  goals: string[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  category: QuestCategory;
  xpReward: number;
  goldReward: number;
  durationMinutes?: number; // For timed quests
  isCompleted: boolean;
  proofRequired?: boolean; // For Rondamica
}

export interface Message {
  id: string;
  senderEmail: string;
  receiverEmail: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface ChatContact {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
  status: 'online' | 'offline' | 'busy';
  lastMessage?: string;
}

export interface Guild {
  id: string;
  name: string;
  level: number;
  members: number;
  description: string;
}

// --- Social Feed Types ---

export type ReactionType = '⚔️' | '🛡️' | '🔥' | '👑' | '💀';

export interface Comment {
  id: string;
  authorName: string;
  content: string;
  timestamp: Date;
}

export interface FeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarColor: string;
  type: 'PROOF' | 'ACHIEVEMENT'; // Rondamica Proof or Level Up
  category?: QuestCategory; // For filtering
  guildId?: string; // For filtering
  content: string;
  imageUrl?: string; // For Proofs
  achievementCode?: string; // For Level 4 Achievement
  reactions: Record<ReactionType, number>;
  comments: Comment[];
  timestamp: Date;
}

export interface RankingEntry {
  userId: string;
  name: string;
  avatarColor: string;
  points: number;
  rank: number;
}
