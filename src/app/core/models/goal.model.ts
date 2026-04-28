export interface Goal {
  id: string;
  title: string;
  notes?: string;
  targetDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
  progressPercentage: number;
  totalMissions: number;
  completedMissions: number;
  createdAt: string;
  todayMissions: Mission[];
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  missionDate: string;
  completed: boolean;
  completedAt?: string;
}

export interface GoalRequest {
  title: string;
  notes?: string;
  targetDate: string;
}