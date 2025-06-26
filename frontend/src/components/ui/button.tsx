import React from 'react'
import type { ButtonProps } from '../../types'

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary': return 'btn-primary'
      case 'secondary': return 'btn-secondary'
      case 'success': return 'btn-success'
      case 'danger': return 'btn-danger'
      case 'warning': return 'btn-warning'
      case 'info': return 'btn-info'
      case 'light': return 'btn-light'
      case 'dark': return 'btn-dark'
      case 'outline': return 'btn-outline-primary'
      case 'ghost': return 'btn-link'
      default: return 'btn-primary'
    }
  }

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'btn-sm'
      case 'lg': return 'btn-lg'
      case 'md':
      default: return ''
    }
  }

  const buttonClasses = [
    'btn',
    getVariantClass(),
    getSizeClass(),
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
export { Button }