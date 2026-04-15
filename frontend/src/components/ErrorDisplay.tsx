import { AlertCircle } from 'lucide-react'

interface ErrorDisplayProps {
  title?: string
  message: string
  type?: 'inline' | 'card' | 'page'
  onRetry?: () => void
  retryText?: string
}

export const ErrorDisplay = ({
  title = 'Error',
  message,
  type = 'inline',
  onRetry,
  retryText = 'Try Again',
}: ErrorDisplayProps) => {
  const baseStyles = 'flex items-start gap-3'

  if (type === 'inline') {
    return (
      <div className={`${baseStyles} bg-error/10 border border-error/30 rounded-lg p-3 text-sm`}>
        <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          {title && <p className="font-medium text-error">{title}</p>}
          <p className="text-text-secondary">{message}</p>
        </div>
      </div>
    )
  }

  if (type === 'card') {
    return (
      <div className="glass rounded-lg p-6 border border-error/30">
        <div className={baseStyles}>
          <AlertCircle className="w-6 h-6 text-error flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-error mb-2">{title}</h3>
            <p className="text-text-secondary mb-4">{message}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-brand-secondary hover:underline font-medium text-sm"
              >
                {retryText}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // page type
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <AlertCircle className="w-16 h-16 text-error mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-error mb-2">{title}</h1>
        <p className="text-text-secondary mb-6">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-brand-secondary text-white rounded-lg hover:opacity-90"
          >
            {retryText}
          </button>
        )}
      </div>
    </div>
  )
}