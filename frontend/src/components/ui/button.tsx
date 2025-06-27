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
      case 'primary':
        return 'bg-gradient-to-r from-[#836EF9] to-[#A0055D] hover:from-[#A0055D] hover:to-[#836EF9] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300'
      case 'secondary':
        return 'bg-gray-600/80 hover:bg-gray-500/80 text-white font-semibold border border-gray-500/50 hover:border-gray-400/50 transition-all duration-300'
      case 'success':
        return 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
      case 'danger':
        return 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
      case 'warning':
        return 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
      case 'info':
        return 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
      case 'light':
        return 'bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold border border-gray-300 transition-all duration-300'
      case 'dark':
        return 'bg-gray-800 hover:bg-gray-700 text-white font-semibold transition-all duration-300'
      case 'outline':
        return 'bg-transparent border-2 border-[#836EF9] text-[#836EF9] hover:bg-[#836EF9] hover:text-white font-semibold transition-all duration-300'
      case 'ghost':
        return 'bg-transparent hover:bg-white/10 text-gray-300 hover:text-white font-semibold transition-all duration-300'
      default:
        return 'bg-gradient-to-r from-[#836EF9] to-[#A0055D] hover:from-[#A0055D] hover:to-[#836EF9] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300'
    }
  }

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'px-3 py-1.5 text-sm'
      case 'lg': return 'px-8 py-3 text-lg'
      case 'md':
      default: return 'px-6 py-2 text-base'
    }
  }

  const baseClasses = 'rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#836EF9]/50 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
  
  const buttonClasses = [
    baseClasses,
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