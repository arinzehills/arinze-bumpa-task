import type { PaginationMeta } from '@app/api/types/paginationResponse'
import type { UserWithAchievements } from '../types'

interface StatsCardsProps {
  users: UserWithAchievements[]
  pagination?: PaginationMeta
}

export const StatsCards = ({ users, pagination }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-bg-secondary border border-border-color rounded-lg p-6">
        <p className="text-text-muted text-sm mb-2">Total Users</p>
        <p className="text-3xl font-bold text-text-primary">
          {pagination?.total || 0}
        </p>
      </div>
      <div className="bg-bg-secondary border border-border-color rounded-lg p-6">
        <p className="text-text-muted text-sm mb-2">Admin Users</p>
        <p className="text-3xl font-bold text-blue-600">
          {users.filter((u) => u.user_type === 'admin').length}
        </p>
      </div>
      <div className="bg-bg-secondary border border-border-color rounded-lg p-6">
        <p className="text-text-muted text-sm mb-2">Regular Users</p>
        <p className="text-3xl font-bold text-green-600">
          {users.filter((u) => u.user_type === 'user').length}
        </p>
      </div>
      <div className="bg-bg-secondary border border-border-color rounded-lg p-6">
        <p className="text-text-muted text-sm mb-2">Vendors</p>
        <p className="text-3xl font-bold text-purple-600">
          {users.filter((u) => u.user_type === 'vendor').length}
        </p>
      </div>
    </div>
  )
}