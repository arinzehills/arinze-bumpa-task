import React from 'react'
import { Icon } from '@iconify/react'
import { Loader } from '@components/Loader'
import { Button } from '@components/Button'
import type { PaginationMeta } from '@app/api/types/paginationResponse'

export interface TableColumn<T = any> {
  header: string
  key: keyof T
  render?: (value: any, row: T) => React.ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface ReusableTableProps<T = any> {
  title?: string
  columns: TableColumn<T>[]
  data: T[]
  pagination?: PaginationMeta
  isLoading?: boolean
  error?: string | null
  onPageChange?: (page: number) => void
  onRowClick?: (row: T) => void
  emptyMessage?: string
}

export const ReusableTable = <T extends Record<string, any>>({
  title,
  columns,
  data,
  pagination,
  isLoading = false,
  error = null,
  onPageChange,
  onRowClick,
  emptyMessage = 'No data found',
}: ReusableTableProps<T>) => {
  const alignClass = (align?: string) => {
    switch (align) {
      case 'center':
        return 'text-center'
      case 'right':
        return 'text-right'
      default:
        return 'text-left'
    }
  }

  return (
    <div className="space-y-4">
      {title && (
        <div>
          <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-16">
          <Loader />
        </div>
      )}

      {/* Desktop Table */}
      {!isLoading && !error && (
        <>
          <div className="overflow-x-auto bg-bg-secondary rounded-lg border border-border-color hidden lg:block">
            <table className="w-full">
              <thead className="bg-bg-elevated border-b border-border-color">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={String(column.key)}
                      className={`px-6 py-4 text-sm font-semibold text-text-primary ${alignClass(
                        column.align
                      )}`}
                      style={{ width: column.width }}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((row, index) => (
                    <tr
                      key={index}
                      onClick={() => onRowClick?.(row)}
                      className="border-b border-border-color hover:bg-bg-elevated transition cursor-pointer"
                    >
                      {columns.map((column) => (
                        <td
                          key={String(column.key)}
                          className={`px-6 py-4 text-sm text-text-secondary ${alignClass(
                            column.align
                          )}`}
                        >
                          {column.render
                            ? column.render(row[column.key], row)
                            : row[column.key]}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-16 text-center text-text-muted"
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="space-y-4 lg:hidden">
            {data.length > 0 ? (
              data.map((row, index) => (
                <div
                  key={index}
                  onClick={() => onRowClick?.(row)}
                  className="bg-bg-secondary border border-border-color rounded-lg p-4 space-y-3 cursor-pointer hover:bg-bg-elevated transition"
                >
                  {columns.map((column) => (
                    <div key={String(column.key)} className="flex justify-between">
                      <span className="font-semibold text-text-primary">
                        {column.header}
                      </span>
                      <span className="text-text-secondary text-right">
                        {column.render
                          ? column.render(row[column.key], row)
                          : row[column.key]}
                      </span>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-text-muted">
                {emptyMessage}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination && data.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <div className="text-sm text-text-secondary">
                Showing {data.length} of {pagination.total} items
              </div>

              <div className="flex gap-2 items-center">
                <Button
                  onClick={() => onPageChange?.(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  variant="secondary"
                  size="md"
                >
                  <Icon icon="ph:caret-left" className="text-lg" />
                  Previous
                </Button>

                <div className="flex items-center px-4 py-2 text-text-primary font-medium min-w-max">
                  Page {pagination.page} of {pagination.total_pages}
                </div>

                <Button
                  onClick={() => onPageChange?.(pagination.page + 1)}
                  disabled={pagination.page === pagination.total_pages}
                  variant="secondary"
                  size="md"
                >
                  Next
                  <Icon icon="ph:caret-right" className="text-lg" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
