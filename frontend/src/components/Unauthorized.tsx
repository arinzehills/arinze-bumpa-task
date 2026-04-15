import { useNavigate } from 'react-router-dom'
import { Button } from '@components/Button'

export const Unauthorized = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-text-primary mb-4">403</h1>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Access Denied
        </h2>
        <p className="text-text-secondary mb-6">
          You don't have permission to access this page. Admin access required.
        </p>

        <div className="space-y-3">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="primary"
            fullWidth
          >
            Go to Dashboard
          </Button>
          <Button
            onClick={() => navigate('/')}
            variant="secondary"
            fullWidth
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized