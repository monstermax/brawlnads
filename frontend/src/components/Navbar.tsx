import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import { useWallet } from '../hooks/useWallet'
import { Button } from './ui/button'
import { Badge } from './ui/badge'


const Navbar: React.FC = () => {
  const { isConnected, address, connect, disconnect } = useWallet()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-black/80 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-50">
      <div className="container mx-auto px-4 text-white">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link className="flex items-center space-x-3 group" to="/">
            <div className="text-2xl group-hover:animate-pulse">🐉</div>
            <div className="flex flex-col">
              <span className="text-xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                BRAWLNADS
              </span>
              <span className="text-xs text-gray-400 font-mono -mt-1">MONAD EDITION</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded font-medium transition-all duration-300 ${
                isActive('/') 
                  ? 'bg-purple-600/40 text-purple-300 border border-purple-400/60' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="mr-2">🏠</span>
              Home
            </Link>
            <Link
              to="/collection"
              className={`px-4 py-2 rounded font-medium transition-all duration-300 ${
                isActive('/collection') 
                  ? 'bg-purple-600/40 text-purple-300 border border-purple-400/60' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="mr-2">💎</span>
              Collection
            </Link>
            <Link
              to="/battle"
              className={`px-4 py-2 rounded font-medium transition-all duration-300 ${
                isActive('/battle')
                  ? 'bg-red-600/40 text-red-300 border border-red-400/60'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="mr-2">⚔️</span>
              Battle
            </Link>
            <Link
              to="/leaderboard"
              className={`px-4 py-2 rounded font-medium transition-all duration-300 ${
                isActive('/leaderboard')
                  ? 'bg-yellow-600/40 text-yellow-300 border border-yellow-400/60'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="mr-2">🏆</span>
              Leaderboard
            </Link>
            <Link
              to="/forge"
              className={`px-4 py-2 rounded font-medium transition-all duration-300 ${
                isActive('/forge')
                  ? 'bg-orange-600/40 text-orange-300 border border-orange-400/60'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="mr-2">🔨</span>
              Forge
            </Link>
          </div>

          {/* Right Side - Network & Wallet */}
          <div className="flex items-center space-x-4">
            {/* Network Badge */}
            <Badge className="bg-cyan-600/20 text-cyan-400 border-cyan-500/30 font-mono text-xs hidden sm:flex">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></div>
              MONAD TESTNET
            </Badge>

            {/* Wallet Connection */}
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <Badge className="bg-green-600/20 text-green-400 border-green-500/30 font-mono">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </Badge>
                <Button
                  onClick={disconnect}
                  variant="outline"
                  size="sm"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition-all duration-300"
                >
                  <span className="mr-1">🔌</span>
                  <span className="hidden sm:inline">Disconnect</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={connect}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all duration-300 transform hover:scale-105"
              >
                <span className="mr-2">🚀</span>
                <span className="hidden sm:inline">Connect Wallet</span>
                <span className="sm:hidden">Connect</span>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex flex-wrap gap-2">
            <Link
              to="/"
              className={`px-3 py-1 rounded text-sm font-medium transition-all duration-300 ${
                isActive('/') 
                  ? 'bg-purple-600/40 text-purple-300 border border-purple-400/60' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              🏠 Home
            </Link>
            <Link
              to="/collection"
              className={`px-3 py-1 rounded text-sm font-medium transition-all duration-300 ${
                isActive('/collection') 
                  ? 'bg-purple-600/40 text-purple-300 border border-purple-400/60' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              💎 Collection
            </Link>
            <Link
              to="/battle"
              className={`px-3 py-1 rounded text-sm font-medium transition-all duration-300 ${
                isActive('/battle') 
                  ? 'bg-red-600/40 text-red-300 border border-red-400/60' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              ⚔️ Battle
            </Link>
            <Link
              to="/leaderboard"
              className={`px-3 py-1 rounded text-sm font-medium transition-all duration-300 ${
                isActive('/leaderboard') 
                  ? 'bg-yellow-600/40 text-yellow-300 border border-yellow-400/60' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              🏆 Leaderboard
            </Link>
            <Link
              to="/forge"
              className={`px-3 py-1 rounded text-sm font-medium transition-all duration-300 ${
                isActive('/forge') 
                  ? 'bg-orange-600/40 text-orange-300 border border-orange-400/60' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              🔨 Forge
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
