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

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
      tabIndex={-1}
    >
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
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
          
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {/* Battle Completed Message */}
            <div className="text-center mb-4">
              <div className="alert alert-info border-info" style={{ backgroundColor: 'rgba(13, 202, 240, 0.1)' }}>
                <h3 className="text-info mb-3">
                  <i className="fas fa-check-circle me-2"></i>
                  Battle Completed!
                </h3>
                <p className="text-white mb-0">{message}</p>
              </div>
            </div>

            {/* Winner/Loser sections only if we have the data */}
            {winner && loser && (
              <>
                {/* Winner Section */}
                <div className="text-center mb-4">
                  <div className="alert alert-warning border-warning" style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)' }}>
                    <h3 className="text-warning mb-3">
                      <i className="fas fa-crown me-2"></i>
                      {won ? 'Victory!' : 'Defeat!'}
                    </h3>
                    
                    <div className="card bg-dark border-warning mb-3">
                      <div className="card-body">
                        <h5 className="card-title text-white">{winner.name}</h5>
                        <div className="row text-center">
                          <div className="col-3">
                            <i className="fas fa-heart text-danger"></i>
                            <div className="text-white small">{winner.health}</div>
                          </div>
                          <div className="col-3">
                            <i className="fas fa-sword text-warning"></i>
                            <div className="text-white small">{winner.attack}</div>
                          </div>
                          <div className="col-3">
                            <i className="fas fa-shield text-info"></i>
                            <div className="text-white small">{winner.defense}</div>
                          </div>
                          <div className="col-3">
                            <i className="fas fa-bolt text-warning"></i>
                            <div className="text-white small">{winner.speed}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Defeated Section */}
                <div className="text-center mb-4">
                  <h6 className="text-muted">Defeated</h6>
                  <div className="card bg-dark border-secondary">
                    <div className="card-body">
                      <h6 className="card-title text-muted">{loser.name}</h6>
                      <div className="row text-center">
                        <div className="col-3">
                          <i className="fas fa-heart text-danger"></i>
                          <div className="text-muted small">{loser.health}</div>
                        </div>
                        <div className="col-3">
                          <i className="fas fa-sword text-warning"></i>
                          <div className="text-muted small">{loser.attack}</div>
                        </div>
                        <div className="col-3">
                          <i className="fas fa-shield text-info"></i>
                          <div className="text-muted small">{loser.defense}</div>
                        </div>
                        <div className="col-3">
                          <i className="fas fa-bolt text-warning"></i>
                          <div className="text-muted small">{loser.speed}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
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
                        <small className="text-muted">Turn {index + 1}:</small>
                        <div className="text-white small">{log}</div>
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
                          <i className="fas fa-trophy text-warning fa-2x mb-2"></i>
                          <div className="text-white">Victory</div>
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
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BattleProgress