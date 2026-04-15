import { Icon } from '@iconify/react'

interface LoaderProps {
  isCentralized?: boolean
}

export const Loader = ({ isCentralized = true }: LoaderProps) => {
  return (
    <div
      className={`${
        isCentralized ? 'h-[60vh] flex items-center justify-center' : ''
      }`}
    >
      <div className="bg-brand-primary text-white w-24 h-24 rounded-full flex flex-col items-center justify-center">
        <Icon icon="ph:spinner" className="animate-spin h-10 w-10" />
      </div>
    </div>
  )
}