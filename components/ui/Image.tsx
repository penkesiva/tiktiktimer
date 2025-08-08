import Image from 'next/image'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
}

export function OptimizedImage({
  src,
  alt,
  width = 300,
  height = 200,
  className = '',
  priority = false,
  quality = 85
}: OptimizedImageProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-xl shadow-lg', className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        priority={priority}
        quality={quality}
      />
    </div>
  )
}

// Decorative image component for background/ambient images
export function DecorativeImage({
  src,
  alt,
  className = '',
  opacity = 0.1
}: {
  src: string
  alt: string
  className?: string
  opacity?: number
}) {
  return (
    <div className={cn('absolute inset-0 pointer-events-none', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover opacity-10"
        style={{ opacity }}
      />
    </div>
  )
}

// Hero image component for larger, prominent images
export function HeroImage({
  src,
  alt,
  className = '',
  height = 400
}: {
  src: string
  alt: string
  className?: string
  height?: number
}) {
  return (
    <div className={cn('relative overflow-hidden rounded-2xl shadow-2xl', className)} style={{ height }}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority
      />
    </div>
  )
}
