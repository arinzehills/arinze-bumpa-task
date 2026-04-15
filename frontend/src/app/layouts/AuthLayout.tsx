import { Outlet, useNavigate } from 'react-router-dom'

export const AuthLayout = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Header */}
      <header className="border-b border-border-color py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="text-xl font-semibold text-text-primary hover:opacity-80 transition-opacity"
          >
            Loyalty Rewards
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-color py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center text-text-muted text-sm">
          <p>&copy; 2024 Loyalty Rewards Program. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}