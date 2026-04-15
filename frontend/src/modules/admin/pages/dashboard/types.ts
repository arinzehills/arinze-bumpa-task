export interface UserAchievement {
  id: number
  achievement_id: number
  user_id: number
  unlocked_at: string
  achievement: {
    id: number
    name: string
    description: string
    points: number
  }
}

export interface UserWithAchievements {
  id: number
  name: string
  email: string
  user_type: 'admin' | 'user' | 'vendor'
  role?: 'admin' | 'super_admin' | string
  total_points: number
  badge: {
    id: number
    name: string
    description: string
  } | null
  achievements: UserAchievement[]
}