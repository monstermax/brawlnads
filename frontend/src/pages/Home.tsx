import React from 'react'
import { useWallet } from '../hooks/useWallet'
import { useMonanimals } from '../hooks/useMonanimals'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'

const Home: React.FC = () => {
  const { isConnected, address, connect, disconnect } = useWallet()
  const { monanimals, loading, mint, isMinting, mintPrice } = useMonanimals()

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Hero Section */}
          <div className="jumbotron bg-dark text-white text-center py-5 mb-5 rounded">
            <div className="container">
              <h1 className="display-4 fw-bold mb-3">
                <i className="fas fa-dragon me-3 text-warning"></i>
                Welcome to BrawlNads
              </h1>
              <p className="lead mb-4">
                Collect, battle, and forge your way to victory with unique NFT creatures
              </p>
              
              {!isConnected ? (
                <div>
                  <p className="mb-4">Connect your wallet to start your adventure</p>
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={connect}
                  >
                    <i className="fas fa-wallet me-2"></i>
                    Connect Wallet
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="mb-4">
                    Connected: <Badge variant="success">{address?.slice(0, 6)}...{address?.slice(-4)}</Badge>
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <Button 
                      variant="warning" 
                      size="lg"
                      onClick={mint}
                      disabled={isMinting}
                    >
                      {isMinting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Minting...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-plus me-2"></i>
                          Mint Monanimal ({mintPrice} ETH)
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={disconnect}
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Disconnect
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Section */}
          {isConnected && (
            <div className="row mb-5">
              <div className="col-md-3 col-sm-6 mb-3">
                <div className="card bg-dark text-white h-100">
                  <div className="card-body text-center">
                    <i className="fas fa-dragon fa-2x text-primary mb-3"></i>
                    <h5 className="card-title">Monanimals</h5>
                    <h3 className="text-primary">{loading ? '...' : monanimals.length}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 mb-3">
                <div className="card bg-dark text-white h-100">
                  <div className="card-body text-center">
                    <i className="fas fa-sword fa-2x text-warning mb-3"></i>
                    <h5 className="card-title">Battles Won</h5>
                    <h3 className="text-warning">
                      {loading ? '...' : monanimals.reduce((total, m) => total + m.wins, 0)}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 mb-3">
                <div className="card bg-dark text-white h-100">
                  <div className="card-body text-center">
                    <i className="fas fa-trophy fa-2x text-success mb-3"></i>
                    <h5 className="card-title">Win Rate</h5>
                    <h3 className="text-success">
                      {loading ? '...' : (() => {
                        const totalWins = monanimals.reduce((total, m) => total + m.wins, 0)
                        const totalLosses = monanimals.reduce((total, m) => total + m.losses, 0)
                        const totalBattles = totalWins + totalLosses
                        return totalBattles > 0 ? `${Math.round((totalWins / totalBattles) * 100)}%` : '0%'
                      })()}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 mb-3">
                <div className="card bg-dark text-white h-100">
                  <div className="card-body text-center">
                    <i className="fas fa-star fa-2x text-info mb-3"></i>
                    <h5 className="card-title">Highest Level</h5>
                    <h3 className="text-info">
                      {loading ? '...' : monanimals.length > 0 ? Math.max(...monanimals.map(m => m.level)) : 0}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {isConnected && monanimals.length > 0 && (
            <div className="row">
              <div className="col-12">
                <div className="card bg-dark text-white">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="fas fa-bolt me-2"></i>
                      Quick Actions
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <div className="d-grid">
                          <Button variant="primary" size="lg">
                            <i className="fas fa-fist-raised me-2"></i>
                            Start Battle
                          </Button>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="d-grid">
                          <Button variant="warning" size="lg">
                            <i className="fas fa-hammer me-2"></i>
                            Forge Weapon
                          </Button>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="d-grid">
                          <Button variant="info" size="lg">
                            <i className="fas fa-gem me-2"></i>
                            View Collection
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home