import { useNavigate } from 'react-router-dom'
import { Button } from '@components/Button'
import { StoreCard } from '@components/StoreCard'

const PARTNER_STORES = [
  {
    id: '1',
    name: 'Bumpa',
    description: 'Shop quality products and earn rewards',
    icon: 'mdi:shopping-bag',
  },
  {
    id: '2',
    name: 'Jumia',
    description: 'Discover amazing deals and earn badges',
    icon: 'mdi:shopping',
  },
  {
    id: '3',
    name: 'Konga',
    description: 'Great products at competitive prices',
    icon: 'game-icons:shop',
  },
]

export const Landing = () => {
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate('/login')
  }

  const handleStoreClick = (storeId: string) => {
    navigate(`/e-commerce-store/${storeId}`)
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-bg-secondary/50 backdrop-blur border-b border-border-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-brand-secondary">Loyalty Rewards</div>
          <Button onClick={handleLogin} variant="primary" size="md">
            Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
            Earn Rewards on Every Purchase
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Shop from our partner stores and unlock exclusive achievements and badges. Every purchase brings you closer to amazing rewards.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleLogin}
              variant="primary"
              size="lg"
              fullWidth={false}
              className="min-w-[200px]"
            >
              Login to See Your Rewards
            </Button>
            <Button
              onClick={() => {
                document.getElementById('stores')?.scrollIntoView({ behavior: 'smooth' })
              }}
              variant="secondary"
              size="lg"
              fullWidth={false}
              className="min-w-[200px]"
            >
              Browse Stores
            </Button>
          </div>
        </div>
      </section>

      {/* Partner Stores Section */}
      <section
        id="stores"
        className="bg-bg-secondary/30 py-16 sm:py-24 border-t border-border-color"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Shop from Our Partners
            </h2>
            <p className="text-lg text-text-secondary">
              Click on any store below to start shopping and earning rewards
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PARTNER_STORES.map((store) => (
              <StoreCard
                key={store.id}
                id={store.id}
                name={store.name}
                description={store.description}
                icon={store.icon}
                onClick={() => handleStoreClick(store.id)}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-text-muted">
              More partner stores coming soon. Check back regularly for new opportunities to earn rewards!
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg-secondary border-t border-border-color py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-text-secondary text-sm">
          <p>&copy; 2024 Loyalty Rewards Program. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}