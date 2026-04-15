import { useState } from 'react'
import { useGet } from '@app/hooks/useGet'
import { Loader } from '@components/Loader'
import { ReusableTable } from '@components/Table/ReusableTable'
import { StatsCards } from './components/StatsCards'
import { userColumns } from './data/userColumns'
import type { PaginatedResponse } from '@app/api/types/paginationResponse'
import type { UserWithAchievements } from './types'

export const UsersManagement = () => {
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

  if (isLoading && !users.length) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Users Management
        </h2>
        <p className="text-text-secondary">Manage all users in the system</p>
      </div>

      {/* Stats Cards */}
      {!error && pagination && (
        <StatsCards users={users} pagination={pagination} />
      )}

      {/* Table */}
      <ReusableTable
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