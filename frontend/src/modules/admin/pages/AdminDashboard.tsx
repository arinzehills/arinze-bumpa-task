import { useState } from 'react'
import { useGet } from '@app/hooks/useGet'
import { ReusableTable, type TableColumn } from '@components/Table/ReusableTable'
import type { PaginatedResponse } from '@app/api/types/paginationResponse'

interface UserAchievement {
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

interface UserWithAchievements {
  id: number
  name: string
  email: string
  total_points: number
  badge: {
    id: number
    name: string
    description: string
  } | null
  achievements: UserAchievement[]
}

const userColumns: TableColumn<UserWithAchievements>[] = [
  {
    header: 'Name',
    key: 'name',
    align: 'left',
  },
  {
    header: 'Email',
    key: 'email',
    align: 'left',
  },
  {
    header: 'Points',
    key: 'total_points',
    align: 'center',
    render: (value) => <span className="font-semibold">{value}</span>,
  },
  {
    header: 'Badge',
    key: 'badge',
    align: 'center',
    render: (value) =>
      value ? (
        <span className="inline-block px-3 py-1 bg-brand-primary text-white rounded-full text-xs font-medium">
          {value.name}
        </span>
      ) : (
        <span className="text-text-muted">-</span>
      ),
  },
  {
    header: 'Achievements',
    key: 'achievements',
    align: 'center',
    render: (value) => (
      <span className="font-semibold">{value?.length || 0}</span>
    ),
  },
]

export const AdminDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 10

  const { data: usersResponse, isLoading, error } = useGet<
    PaginatedResponse<UserWithAchievements>
  >(
    `/admin/users/achievements?page=${currentPage}&limit=${limit}`,
    { autoFetch: true, cacheDuration: 30 * 1000 }
  )

  const users = usersResponse?.items || []
  const pagination = usersResponse?.pagination

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      {!isLoading && !error && pagination && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-bg-secondary border border-border-color rounded-lg p-6">
            <p className="text-text-muted text-sm mb-2">Total Users</p>
            <p className="text-3xl font-bold text-text-primary">
              {pagination.total}
            </p>
          </div>
          <div className="bg-bg-secondary border border-border-color rounded-lg p-6">
            <p className="text-text-muted text-sm mb-2">Current Page</p>
            <p className="text-3xl font-bold text-text-primary">
              {pagination.page} / {pagination.total_pages}
            </p>
          </div>
          <div className="bg-bg-secondary border border-border-color rounded-lg p-6">
            <p className="text-text-muted text-sm mb-2">Users on Page</p>
            <p className="text-3xl font-bold text-text-primary">{users.length}</p>
          </div>
        </div>
      )}

      {/* Table */}
      <ReusableTable
        title="Users & Achievements"
        columns={userColumns}
        data={users}
        pagination={pagination}
        isLoading={isLoading}
        error={error}
        onPageChange={setCurrentPage}
        emptyMessage="No users found"
      />
    </div>
  )
}