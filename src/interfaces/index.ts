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
  aliveStatus: 'ALIVE' | 'DEAD';
  paper?: boolean;

  imageUrl1?: string;
  imageUrl2?: string;

  franchises: { id: number; name: string }[]
  franchiseNames: string[]

  file1?: File;
  file2?: File;
  imageUrl1Input?: string;
  imageUrl2Input?: string;

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
  id: number
  name: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateGameModeDto {
  name: string
  description: string
  isActive: boolean
}

export interface UpdateGameModeDto {
  name?: string
  description?: string
  isActive?: boolean
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

export interface DailyOverview {
  date: string;
  totalUsersEver: number;
  totalNewUsers: number;
  totalInitiatedPlays: number;
  totalCompletedPlays: number;
  totalUncompletedPlays: number;
  playsByMode: Record<
    string,
    { initiated: number; completed: number; uncompleted: number }
  >;
}

export interface ModeStats {
  modeConfigId: number;
  modeName: string;
  initiatedPlays: number;
  completedPlays: number;
  uncompletedPlays: number;
  averageAttempts: number;
  uniqueUsers: number;
}
