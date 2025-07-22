export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  lastAccess?: string;
}

export interface Franchise {
  id: string;
  name: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  charactersCount?: number;
}

export interface UpdateFranchiseDto {
  name?: string;
  imageUrl?: string;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  emojis: string[];
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  race: string[];
  ethnicity: string[];
  hair: string;
  aliveStatus: 'ALIVE' | 'DEAD' | 'UNKNOWN';
  isProtagonist: boolean;
  isAntagonist: boolean;

  imageUrl1?: string;
  imageUrl2?: string;

  file1?: File;
  file2?: File;
  imageUrl1Input?: string;
  imageUrl2Input?: string;

  franchiseNames: string[];
  franchiseId: string;
  franchise: Franchise;

  createdAt: string;
  updatedAt: string;
}

export interface CreateCharacterDto {
  name: string
  description: string
  emojis?: string[]
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  race?: string[]
  ethnicity?: string[]
  hair: string
  aliveStatus: 'ALIVE' | 'DEAD' | 'UNKNOWN'
  isProtagonist: boolean
  isAntagonist: boolean
  imageUrl1?: string
  imageUrl2?: string
  franchiseIds?: string[]
}

export interface UpdateCharacterDto {
  name?: string;
  description?: string;
  emojis?: string[];
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  race?: string[];
  ethnicity?: string[];
  hair?: string;
  aliveStatus?: 'ALIVE' | 'DEAD' | 'UNKNOWN';
  isProtagonist?: boolean;
  isAntagonist?: boolean;

  imageUrl1?: string;
  imageUrl2?: string;

  file1?: File;
  file2?: File;
  imageUrl1Input?: string;
  imageUrl2Input?: string;

  franchiseId?: string;
  franchise?: Franchise;
}

export interface GameMode {
  id: string;
  name: 'CHARACTERISTICS' | 'DESCRIPTION' | 'IMAGE' | 'EMOJI';
  description: string;
  isActive: boolean;
  scheduledFor: string;
  createdAt: string;
  updatedAt: string;
}

export interface GamePlay {
  id: string;
  userId: string;
  user: User;
  gameModeId: string;
  gameMode: GameMode;
  characterId: string;
  character: Character;
  attempts: number;
  completed: boolean;
  createdAt: string;
}

export interface Attempt {
  id: string;
  gamePlayId: string;
  gamePlay: GamePlay;
  guess: string;
  isCorrect: boolean;
  timestamp: string;
}

export interface AccessLog {
  id: string;
  endpoint: string;
  userId?: string;
  user?: User;
  gameMode?: string;
  method: string;
  statusCode: number;
  timestamp: string;
}

export interface KPI {
  totalUsers: number;
  activeUsers: number;
  dailyGames: number;
  totalAttempts: number;
  successRate: {
    [mode: string]: number;
  };
  topCharacters: {
    [mode: string]: Array<{ character: string; count: number }>;
  };
}
