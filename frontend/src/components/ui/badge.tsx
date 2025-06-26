import React from 'react'
import type { BadgeProps } from '../../types'

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary': return 'badge-primary'
      case 'secondary': return 'badge-secondary'
      case 'success': return 'badge-success'
      case 'danger': return 'badge-danger'
      case 'warning': return 'badge-warning'
      case 'info': return 'badge-info'
      case 'light': return 'badge-light'
      case 'dark': return 'badge-dark'
      default: return 'badge-primary'
    }
  }

  const badgeClasses = [
    'badge',
    getVariantClass(),
    className
  ].filter(Boolean).join(' ')

  return (
    <span className={badgeClasses}>
      {children}
    </span>
  )
}

export default Badge
export { Badge }