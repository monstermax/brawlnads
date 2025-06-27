import React from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import type { BattleProgressProps } from '../types'

const BattleProgress: React.FC<BattleProgressProps> = ({
  battleResult,
  onClose,
  isVisible,
}) => {
  if (!isVisible || !battleResult) return null

  const { won, winner, loser, battleLog, rewards, message } = battleResult

  const getRarityVariant = (rarity: string) => {
    switch (rarity) {
      case 'Mythic': return 'warning'
      case 'Legendary': return 'danger'
      case 'Epic': return 'primary'
      case 'Rare': return 'info'
      case 'Uncommon': return 'success'
      default: return 'secondary'
    }
  }

  const MonanimalBattleCard = ({ monanimal, isWinner, isLoser }: { monanimal: any, isWinner: boolean, isLoser: boolean }) => {
    const cardStyle = {
      backgroundColor: isLoser ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.8)',
      borderColor: isWinner ? '#ffd700' : isLoser ? '#6c757d' : 'rgba(108, 117, 125, 0.5)',
      borderWidth: isWinner ? '3px' : '1px',
      opacity: isLoser ? 0.6 : 1,
      transform: isWinner ? 'scale(1.02)' : isLoser ? 'scale(0.98)' : 'scale(1)',
      transition: 'all 0.3s ease',
      boxShadow: isWinner
        ? '0 0 20px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.3)'
        : isLoser
        ? '0 0 5px rgba(0, 0, 0, 0.5)'
        : 'none',
      position: 'relative' as const,
      margin: '10px',
      maxWidth: '400px',
    }

    const overlayStyle = isWinner ? {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.1), rgba(255, 255, 255, 0.1))',
      borderRadius: '0.375rem',
      pointerEvents: 'none' as const,
    } : {}

    return (
      <div className="col-md-6 mb-3 px-2 d-flex justify-content-center">
        <div className="card" style={cardStyle}>
          {isWinner && <div style={overlayStyle}></div>}
          
          {/* Crown for winner */}
          {isWinner && (
            <div 
              style={{
                position: 'absolute',
                top: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10,
                fontSize: '2rem',
                filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))'
              }}
            >
              👑
            </div>
          )}

          <div className="card-header d-flex justify-content-between align-items-center p-4">
            <div>
              <h5 className={`card-title mb-0 ${isLoser ? 'text-muted' : 'text-white'}`}>
                {monanimal.name || `Monanimal #${monanimal.id}`}
              </h5>
              <small className="text-muted">
                Level {monanimal.level || 1} {monanimal.class || 'Fighter'}
              </small>
            </div>
            <div className="d-flex gap-1">
              {isWinner && (
                <Badge variant="warning" className="winner-badge">
                  <i className="fas fa-crown me-1"></i>
                  WINNER
                </Badge>
              )}
              {isLoser && (
                <Badge variant="secondary">
                  <i className="fas fa-skull me-1"></i>
                  DEFEATED
                </Badge>
              )}
              <Badge variant={getRarityVariant(monanimal.rarity || 'Common')}>
                {monanimal.rarity || 'Common'}
              </Badge>
            </div>
          </div>
          
          <div className="card-body p-2">
            {/* NFT Image avec SVG support */}
            <div
              className="d-flex align-items-center justify-content-center mb-2"
              style={{
                height: '150px',
                backgroundColor: isLoser ? 'rgba(108, 117, 125, 0.1)' : 'rgba(108, 117, 125, 0.2)',
                borderRadius: '0.375rem',
                position: 'relative',
                padding: '5px',
                overflow: 'visible'
              }}
            >
              {monanimal.image ? (
                <div
                  style={{
                    width: '140px',
                    height: '140px',
                    backgroundImage: `url(${monanimal.image})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    filter: isLoser ? 'grayscale(80%) brightness(0.5)' : 'none'
                  }}
                />
              ) : (
                <div className={`text-center ${isLoser ? 'text-muted' : 'text-white'}`}>
                  <div
                    style={{
                      fontSize: '3rem',
                      filter: isWinner ? 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.6))' : 'none'
                    }}
                  >
                    🐾
                  </div>
                  <p className="small mb-0 mt-1">Monanimal #{monanimal.id}</p>
                </div>
              )}
              
              {/* Winner glow effect */}
              {isWinner && (
                <div
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, transparent 70%)',
                    borderRadius: '0.375rem',
                    animation: 'pulse 3s ease-in-out infinite',
                    pointerEvents: 'none',
                    zIndex: 1
                  }}
                ></div>
              )}
            </div>

            {/* Monanimal Info Card - Compacte */}
            <div
              className="card"
              style={{
                backgroundColor: isLoser ? 'rgba(108, 117, 125, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                border: `1px solid ${isWinner ? '#ffd700' : isLoser ? '#6c757d' : 'rgba(255, 255, 255, 0.2)'}`,
                borderRadius: '0.25rem'
              }}
            >
              <div className="card-body p-2">
                <h6 className={`card-title mb-1 ${isLoser ? 'text-muted' : 'text-white'} text-center`} style={{ fontSize: '0.9rem' }}>
                  {monanimal.name || `Monanimal #${monanimal.id}`}
                </h6>
                <p className="small text-muted mb-1 text-center" style={{ fontSize: '0.75rem' }}>
                  Level {monanimal.level || 1} {monanimal.class || 'Fighter'} | {monanimal.rarity || 'Common'}
                </p>
                <div className="row g-1 text-center">
                  <div className="col-6">
                    <small className={`${isLoser ? 'text-muted' : 'text-light'}`} style={{ fontSize: '0.7rem' }}>
                      HP: {monanimal.health || 100} | ATK: {monanimal.attack || 50}
                    </small>
                  </div>
                  <div className="col-6">
                    <small className={`${isLoser ? 'text-muted' : 'text-light'}`} style={{ fontSize: '0.7rem' }}>
                      DEF: {monanimal.defense || 30} | SPD: {monanimal.speed || 40}
                    </small>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-1">
                  <small className={isLoser ? 'text-muted' : 'text-success'} style={{ fontSize: '0.7rem' }}>
                    Wins: {monanimal.wins || 0}
                  </small>
                  <small className={isLoser ? 'text-muted' : 'text-danger'} style={{ fontSize: '0.7rem' }}>
                    Losses: {monanimal.losses || 0}
                  </small>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
          .fa-beat {
            animation: fa-beat 1s ease-in-out infinite;
          }
          @keyframes fa-beat {
            0%, 90% { transform: scale(1); }
            45% { transform: scale(1.25); }
          }
        `}
      </style>
      
      <div
        className="modal d-block"
        style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
        tabIndex={-1}
      >
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
          <div className="modal-content" style={{ backgroundColor: '#1a1a1a', border: '1px solid #6c757d' }}>
            <div className="modal-header border-bottom border-secondary">
              <h5 className="modal-title text-white">
                <i className="fas fa-trophy text-warning me-2"></i>
                Battle Results
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            
            <div className="modal-body" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
              {/* Battle Result Header */}
              <div className="text-center mb-4">
                <div 
                  className={`alert ${won === true ? 'alert-success border-success' : won === false ? 'alert-danger border-danger' : 'alert-info border-info'}`}
                  style={{ 
                    backgroundColor: won === true 
                      ? 'rgba(25, 135, 84, 0.1)' 
                      : won === false 
                      ? 'rgba(220, 53, 69, 0.1)' 
                      : 'rgba(13, 202, 240, 0.1)' 
                  }}
                >
                  <h3 className={`${won === true ? 'text-success' : won === false ? 'text-danger' : 'text-info'} mb-3`}>
                    <i className={`fas ${won === true ? 'fa-trophy' : won === false ? 'fa-skull' : 'fa-check-circle'} me-2`}></i>
                    {won === true ? 'VICTORY!' : won === false ? 'DEFEAT!' : 'BATTLE COMPLETED!'}
                  </h3>
                  <p className="text-white mb-0">{message}</p>
                </div>
              </div>

              {/* VS Section with both NFTs */}
              {winner && loser && (
                <div className="mb-4">
                  <div className="text-center mb-3">
                    <h4 className="text-white">
                      <span className="text-warning">⚔️</span> BATTLE RESULT <span className="text-warning">⚔️</span>
                    </h4>
                  </div>
                  
                  <div className="row">
                    <MonanimalBattleCard 
                      monanimal={winner} 
                      isWinner={true} 
                      isLoser={false} 
                    />
                    <MonanimalBattleCard 
                      monanimal={loser} 
                      isWinner={false} 
                      isLoser={true} 
                    />
                  </div>
                  
                  {/* VS divider */}
                  <div 
                    className="text-center"
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '60%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 20,
                      fontSize: '3rem',
                      color: '#ffd700',
                      textShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
                      fontWeight: 'bold'
                    }}
                  >
                    VS
                  </div>
                </div>
              )}

              {/* Battle Log */}
              {battleLog && battleLog.length > 0 && (
                <div className="mb-4">
                  <h6 className="text-white mb-3">
                    <i className="fas fa-scroll me-2"></i>
                    Battle Log
                  </h6>
                  <div className="card bg-dark border-secondary">
                    <div className="card-body">
                      {battleLog.map((log, index) => (
                        <div key={index} className="mb-2">
                          <div className="text-white small d-flex align-items-center">
                            <i className="fas fa-chevron-right text-warning me-2"></i>
                            {log}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Rewards */}
              {rewards && (
                <div className="mb-4">
                  <h6 className="text-white mb-3">
                    <i className="fas fa-gift me-2"></i>
                    Rewards
                  </h6>
                  <div className="card bg-dark border-success">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-6">
                          <div className="text-center">
                            <i className="fas fa-coins text-warning fa-2x mb-2"></i>
                            <div className="text-white">+{rewards.experience || 0} XP</div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center">
                            <i className={`fas ${won === true ? 'fa-trophy' : won === false ? 'fa-medal' : 'fa-star'} text-warning fa-2x mb-2`}></i>
                            <div className="text-white">
                              {won === true ? 'Victory!' : won === false ? 'Participation' : 'Battle Completed'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-footer border-top border-secondary">
              <Button
                variant="primary"
                onClick={onClose}
                className="w-100"
                style={{ 
                  background: won === true 
                    ? 'linear-gradient(45deg, #28a745, #20c997)' 
                    : won === false 
                    ? 'linear-gradient(45deg, #dc3545, #fd7e14)' 
                    : 'linear-gradient(45deg, #0d6efd, #6610f2)',
                  border: 'none'
                }}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BattleProgress