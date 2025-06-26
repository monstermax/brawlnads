import React, { useState } from 'react'
import { useMonanimals } from '../hooks/useMonanimals'
import { useBattles } from '../hooks/useBattles'
import { useWallet } from '../hooks/useWallet'
import FighterSelector from '../components/FighterSelector'
import { OpponentSelector } from '../components/OpponentSelector'
import BattleProgress from '../components/BattleProgress'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import type { Monanimal } from '../types'

const BattleArena: React.FC = () => {
  const { isConnected } = useWallet()
  const { monanimals, loading } = useMonanimals()
  const { startBattle, battleResult, isLoading: isBattling } = useBattles(monanimals)
  
  const [showFighterSelector, setShowFighterSelector] = useState(false)
  const [showOpponentSelector, setShowOpponentSelector] = useState(false)
  const [selectedFighter, setSelectedFighter] = useState<Monanimal | null>(null)
  const [selectedOpponent, setSelectedOpponent] = useState<Monanimal | null>(null)
  const [showBattleResult, setShowBattleResult] = useState(false)

  const handleStartBattle = () => {
    if (monanimals.length === 0) {
      alert('You need at least one Monanimal to battle!')
      return
    }
    setShowFighterSelector(true)
  }

  const handleFighterSelect = (monanimal: Monanimal) => {
    setSelectedFighter(monanimal)
  }

  const handleConfirmFighter = () => {
    if (!selectedFighter) return
    
    setShowFighterSelector(false)
    setShowOpponentSelector(true)
  }

  const handleSelectOpponent = (opponent: Monanimal) => {
    setSelectedOpponent(opponent)
  }

  const handleConfirmBattle = () => {
    if (!selectedFighter || !selectedOpponent) return
    
    setShowOpponentSelector(false)
    
    // Démarrer la bataille de manière asynchrone
    startBattle(selectedFighter.id, selectedOpponent.id)
      .then(() => {
        setShowBattleResult(true)
      })
      .catch((error) => {
        console.error('Battle failed:', error)
        alert('Battle failed. Please try again.')
      })
  }

  const handleCloseBattleResult = () => {
    setShowBattleResult(false)
    setSelectedFighter(null)
  }

  const handleCloseFighterSelector = () => {
    setShowFighterSelector(false)
    setSelectedFighter(null)
  }

  const handleCloseOpponentSelector = () => {
    setShowOpponentSelector(false)
    setSelectedOpponent(null)
  }

  if (!isConnected) {
    return (
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="card bg-dark text-white">
              <div className="card-body py-5">
                <i className="fas fa-wallet fa-3x text-muted mb-4"></i>
                <h3 className="mb-3">Wallet Not Connected</h3>
                <p className="text-muted mb-4">
                  Please connect your wallet to access the Battle Arena
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="text-white mb-3">
              <i className="fas fa-fist-raised me-3 text-danger"></i>
              Battle Arena
            </h1>
            <p className="text-muted lead">
              Test your Monanimals in epic battles and earn rewards
            </p>
          </div>

          {/* Battle Stats */}
          <div className="row mb-5">
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card bg-dark text-white h-100">
                <div className="card-body text-center">
                  <i className="fas fa-dragon fa-2x text-primary mb-3"></i>
                  <h5 className="card-title">Available Fighters</h5>
                  <h3 className="text-primary">{loading ? '...' : monanimals.length}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card bg-dark text-white h-100">
                <div className="card-body text-center">
                  <i className="fas fa-trophy fa-2x text-warning mb-3"></i>
                  <h5 className="card-title">Total Wins</h5>
                  <h3 className="text-warning">
                    {loading ? '...' : monanimals.reduce((total, m) => total + m.wins, 0)}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card bg-dark text-white h-100">
                <div className="card-body text-center">
                  <i className="fas fa-skull fa-2x text-danger mb-3"></i>
                  <h5 className="card-title">Total Losses</h5>
                  <h3 className="text-danger">
                    {loading ? '...' : monanimals.reduce((total, m) => total + m.losses, 0)}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card bg-dark text-white h-100">
                <div className="card-body text-center">
                  <i className="fas fa-percentage fa-2x text-success mb-3"></i>
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
          </div>

          {/* Battle Action */}
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8">
              <div className="card bg-dark text-white">
                <div className="card-header text-center">
                  <h4 className="mb-0">
                    <i className="fas fa-swords me-2"></i>
                    Ready for Battle?
                  </h4>
                </div>
                <div className="card-body text-center py-5">
                  {monanimals.length === 0 ? (
                    <>
                      <i className="fas fa-dragon fa-4x text-muted mb-4"></i>
                      <h5 className="mb-3">No Fighters Available</h5>
                      <p className="text-muted mb-4">
                        You need to mint at least one Monanimal before you can battle
                      </p>
                      <Badge variant="warning">Mint a Monanimal first</Badge>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-fire fa-4x text-danger mb-4"></i>
                      <h5 className="mb-3">Choose Your Champion</h5>
                      <p className="text-muted mb-4">
                        Select your strongest Monanimal and enter the arena
                      </p>
                      <Button
                        variant="danger"
                        size="lg"
                        onClick={handleStartBattle}
                        disabled={isBattling}
                      >
                        {isBattling ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Battle in Progress...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-fist-raised me-2"></i>
                            Start Battle
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Top Fighters */}
          {monanimals.length > 0 && (
            <div className="row">
              <div className="col-12">
                <div className="card bg-dark text-white">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="fas fa-crown me-2 text-warning"></i>
                      Your Top Fighters
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      {monanimals
                        .sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses))
                        .slice(0, 3)
                        .map((monanimal, index) => (
                          <div key={monanimal.id} className="col-md-4 mb-3">
                            <div className="card bg-secondary h-100">
                              <div className="card-body text-center">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <Badge variant={index === 0 ? 'warning' : index === 1 ? 'light' : 'dark'}>
                                    #{index + 1}
                                  </Badge>
                                  <Badge variant="info">{monanimal.rarity}</Badge>
                                </div>
                                <h6 className="card-title text-white">{monanimal.name}</h6>
                                <p className="card-text text-muted small">
                                  Level {monanimal.level} {monanimal.class}
                                </p>
                                <div className="row text-center">
                                  <div className="col-6">
                                    <small className="text-success">
                                      <i className="fas fa-trophy me-1"></i>
                                      {monanimal.wins}W
                                    </small>
                                  </div>
                                  <div className="col-6">
                                    <small className="text-danger">
                                      <i className="fas fa-times me-1"></i>
                                      {monanimal.losses}L
                                    </small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showFighterSelector && (
        <FighterSelector
          monanimals={monanimals}
          selectedFighter={selectedFighter}
          onSelectFighter={handleFighterSelect}
          onClose={handleCloseFighterSelector}
          onConfirm={handleConfirmFighter}
          isLoading={isBattling}
        />
      )}

      {showOpponentSelector && (
        <div
          className="modal d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content" style={{ backgroundColor: '#1a1a1a', border: '1px solid #6c757d' }}>
              <div className="modal-header border-bottom border-secondary">
                <h5 className="modal-title text-white">
                  Choisir un adversaire pour {selectedFighter?.name}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseOpponentSelector}
                  aria-label="Close"
                ></button>
              </div>
              
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <OpponentSelector
                  onSelectOpponent={handleSelectOpponent}
                  userMonanimals={monanimals}
                  selectedFighter={selectedFighter || undefined}
                />
              </div>
              
              <div className="modal-footer border-top border-secondary">
                <div className="me-auto text-muted">
                  {selectedOpponent ? (
                    <span>
                      Adversaire: <span className="text-white fw-bold">{selectedOpponent.name}</span>
                    </span>
                  ) : (
                    <span>Veuillez sélectionner un adversaire</span>
                  )}
                </div>
                
                <div className="d-flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={handleCloseOpponentSelector}
                  >
                    Retour
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleConfirmBattle}
                    disabled={!selectedOpponent || isBattling}
                  >
                    {isBattling ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Bataille en cours...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-fist-raised me-2"></i>
                        Commencer le combat !
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBattleResult && (
        <BattleProgress
          battleResult={battleResult}
          onClose={handleCloseBattleResult}
          isVisible={showBattleResult}
        />
      )}
    </div>
  )
}

export default BattleArena