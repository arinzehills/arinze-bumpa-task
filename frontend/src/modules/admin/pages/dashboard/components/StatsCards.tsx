import type { PaginationMeta } from '@app/api/types/paginationResponse'

interface StatsCardsProps {
  pagination?: PaginationMeta
}

export const StatsCards = ({ pagination }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-bg-secondary border border-border-color rounded-lg p-6">
        <p className="text-text-muted text-sm mb-2">Total Users</p>
        <p className="text-3xl font-bold text-text-primary">
          {pagination?.total || 0}
        </p>
      </div>
      <div className="bg-bg-secondary border border-border-color rounded-lg p-6">
        <p className="text-text-muted text-sm mb-2">Current Page</p>
        <p className="text-3xl font-bold text-text-primary">
          {pagination?.page || 0} / {pagination?.total_pages || 0}
        </p>
      </div>
      <div className="bg-bg-secondary border border-border-color rounded-lg p-6">
        <p className="text-text-muted text-sm mb-2">Users on Page</p>
        <p className="text-3xl font-bold text-text-primary">
          {pagination?.limit || 0}
        </p>
      </div>
    </div>
  )
}