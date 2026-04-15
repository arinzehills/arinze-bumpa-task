import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@components/Button'

const STORE_DETAILS: Record<string, { name: string; description: string }> = {
  '1': { name: 'Bumpa', description: 'Quality products for everyday needs' },
  '2': { name: 'Jumia', description: 'Everything you need in one place' },
  '3': { name: 'Konga', description: 'Best deals and authentic products' },
}

export const EcommerceStore = () => {
  const { storeId } = useParams<{ storeId: string }>()
  const navigate = useNavigate()
  const store = storeId ? STORE_DETAILS[storeId] : null

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Store not found</h1>
          <Button onClick={() => navigate('/')} variant="primary">
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="bg-bg-secondary border-b border-border-color p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-brand-secondary hover:underline font-medium"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-text-primary">{store.name}</h1>
          <div />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="glass rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-text-primary mb-4">{store.name}</h2>
          <p className="text-lg text-text-secondary mb-8">{store.description}</p>

          <div className="bg-bg-elevated border border-border-color rounded-lg p-8 mb-8">
            <p className="text-text-muted mb-4">
              🛍️ Redirecting to {store.name} ecommerce store...
            </p>
            <p className="text-sm text-text-secondary">
              When you make purchases here, your achievements will be tracked automatically.
            </p>
          </div>

          <Button onClick={() => navigate('/')} variant="secondary">
            Back to Partner Stores
          </Button>
        </div>
      </main>
    </div>
  )
}