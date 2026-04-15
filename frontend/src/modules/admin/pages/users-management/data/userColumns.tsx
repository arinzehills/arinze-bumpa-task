import type { TableColumn } from '@components/Table/ReusableTable'
import type { UserWithAchievements } from '../types'

export const userColumns: TableColumn<UserWithAchievements>[] = [
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
    header: 'User Type',
    key: 'user_type',
    align: 'center',
    render: (value) => (
      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
        {value}
      </span>
    ),
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
        <span className="text-text-muted text-sm">-</span>
      ),
  },
  {
    header: 'Achievements',
    key: 'achievements',
    align: 'center',
    render: (value) => (
      <span className="font-semibold text-brand-primary">
        {value?.length || 0}
      </span>
    ),
  },
]