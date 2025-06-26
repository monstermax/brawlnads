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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="fas fa-dragon me-2 text-primary"></i>
          BrawlNads
        </Link>
        
        {/* Navigation toujours visible */}
        <div className="navbar-nav me-auto d-flex flex-row">
          <Link 
            className={`nav-link me-3 ${isActive('/') ? 'active text-primary' : 'text-light'}`} 
            to="/"
          >
            <i className="fas fa-home me-1"></i>
            Home
          </Link>
          <Link 
            className={`nav-link me-3 ${isActive('/collection') ? 'active text-primary' : 'text-light'}`} 
            to="/collection"
          >
            <i className="fas fa-dragon me-1"></i>
            Collection
          </Link>
          <Link
            className={`nav-link me-3 ${isActive('/battle') ? 'active text-primary' : 'text-light'}`}
            to="/battle"
          >
            <i className="fas fa-fist-raised me-1"></i>
            Battle
          </Link>
          <Link
            className={`nav-link me-3 ${isActive('/leaderboard') ? 'active text-primary' : 'text-light'}`}
            to="/leaderboard"
          >
            <i className="fas fa-trophy me-1"></i>
            Leaderboard
          </Link>
          <Link
            className={`nav-link me-3 ${isActive('/forge') ? 'active text-primary' : 'text-light'}`}
            to="/forge"
          >
            <i className="fas fa-hammer me-1"></i>
            Forge
          </Link>
        </div>
        
        <div className="d-flex align-items-center">
          <Badge variant="info" className="me-3">
            <i className="fas fa-network-wired me-1"></i>
            Monad Testnet
          </Badge>
          {isConnected ? (
            <div className="d-flex align-items-center gap-2">
              <Badge variant="success">
                <i className="fas fa-wallet me-1"></i>
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={disconnect}
              >
                <i className="fas fa-sign-out-alt me-1"></i>
                Disconnect
              </Button>
            </div>
          ) : (
            <Button 
              variant="primary" 
              size="sm"
              onClick={connect}
            >
              <i className="fas fa-wallet me-1"></i>
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar