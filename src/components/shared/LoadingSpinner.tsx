interface Props {
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }

export function LoadingSpinner({ size = 'md' }: Props) {
  return (
    <div className={`${sizeMap[size]} rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin`} />
  )
}
