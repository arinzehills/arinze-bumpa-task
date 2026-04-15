interface ProgressBarProps {
  value: number // 0-100
  max?: number
  label?: string
  showPercentage?: boolean
  color?: 'primary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export const ProgressBar = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = 'primary',
  size = 'md',
  animated = true,
}: ProgressBarProps) => {
  const percentage = Math.min((value / max) * 100, 100)

  const colorClasses = {
    primary: 'bg-brand-secondary',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
  }

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  return (
    <div>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-text-primary">{label}</span>}
          {showPercentage && (
            <span className="text-sm text-text-secondary">{Math.round(percentage)}%</span>
          )}
        </div>
      )}

      <div className={`w-full bg-bg-elevated rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-300 ${
            animated ? 'ease-out' : ''
          }`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  )
}