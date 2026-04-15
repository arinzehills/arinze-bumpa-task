import { Icon } from '@iconify/react'

interface StoreCardProps {
  id: string
  name: string
  description: string
  icon: string
  onClick: () => void
}

export const StoreCard = ({ name, description, icon, onClick }: StoreCardProps) => {
  return (
    <div
      onClick={onClick}
      className="glass rounded-lg p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:border-brand-secondary border border-border-color flex flex-col items-center text-center"
    >
      <div className="mb-4 p-4 bg-brand-secondary/20 rounded-lg">
        <Icon icon={icon} width={40} height={40} className="text-brand-secondary" />
      </div>

      <h3 className="text-lg font-semibold text-text-primary mb-2">{name}</h3>
      <p className="text-sm text-text-secondary mb-4">{description}</p>

      <div className="mt-auto pt-2">
        <button className="text-brand-secondary hover:underline font-medium text-sm">
          Shop Now →
        </button>
      </div>
    </div>
  )
}