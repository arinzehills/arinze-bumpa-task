import { useAuthStore } from '@app/stores/useAuthStore'

export const Profile = () => {
  const { user } = useAuthStore()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Your Profile
        </h2>
      </div>

      {/* Profile Info Card */}
      <div className="bg-bg-secondary rounded-lg border border-border-color p-8">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-brand-primary flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-text-primary mb-4">
              {user?.name || 'User'}
            </h3>

            <div className="space-y-3">
              <div>
                <p className="text-text-muted text-sm">Email</p>
                <p className="text-text-primary font-medium">{user?.email}</p>
              </div>

              <div>
                <p className="text-text-muted text-sm">Total Points</p>
                <p className="text-2xl font-bold text-brand-primary">
                  {user?.total_points || 0}
                </p>
              </div>

              <div>
                <p className="text-text-muted text-sm">Current Badge</p>
                <p className="text-text-primary font-medium">
                  {user?.current_badge_name || 'No badge yet'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile