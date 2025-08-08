import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'sport' | 'calm' | 'energy'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
          {
            'bg-gradient-to-r from-sport-500 to-sport-600 hover:from-sport-600 hover:to-sport-700 text-white focus-visible:ring-sport-500': variant === 'primary' || variant === 'sport',
            'bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-900 focus-visible:ring-gray-500': variant === 'secondary',
            'border border-gray-300 bg-white/80 backdrop-blur-sm hover:bg-gray-50/80 text-gray-900 focus-visible:ring-gray-500': variant === 'outline',
            'hover:bg-gray-100/80 text-gray-900': variant === 'ghost',
            'bg-gradient-to-r from-calm-500 to-calm-600 hover:from-calm-600 hover:to-calm-700 text-white focus-visible:ring-calm-500': variant === 'calm',
            'bg-gradient-to-r from-energy-500 to-energy-600 hover:from-energy-600 hover:to-energy-700 text-white focus-visible:ring-energy-500': variant === 'energy',
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 py-2': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button } 