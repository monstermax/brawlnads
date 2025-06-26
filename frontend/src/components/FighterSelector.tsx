import React from 'react'
import { Button } from './ui/button'
import MonanimalCard from './MonanimalCard'
import type { FighterSelectorProps } from '../types'

const FighterSelector: React.FC<FighterSelectorProps> = ({
  monanimals,
  selectedFighter,
  onSelectFighter,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  return (
    <div 
      className="modal d-block" 
      style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
      tabIndex={-1}
    >
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content" style={{ backgroundColor: '#1a1a1a', border: '1px solid #6c757d' }}>
          <div className="modal-header border-bottom border-secondary">
            <h5 className="modal-title text-white">Select Your Fighter</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          
          <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {monanimals.length === 0 ? (
              <div className="text-center py-5">
                <div className="text-muted">
                  <i className="fas fa-exclamation-triangle fa-3x mb-3"></i>
                  <h5>No Monanimals found in your collection</h5>
                  <p className="mb-0">You need to own at least one Monanimal to participate in battles</p>
                </div>
              </div>
            ) : (
              <div className="row g-3">
                {monanimals.map((monanimal) => (
                  <div key={monanimal.id} className="col-md-6 col-lg-4">
                    <div className={monanimal.isKO ? 'position-relative' : ''}>
                      <MonanimalCard
                        monanimal={monanimal}
                        onSelect={monanimal.isKO ? undefined : onSelectFighter}
                        isSelected={selectedFighter?.id === monanimal.id}
                        showActions={false}
                      />
                      {monanimal.isKO && (
                        <div
                          className="position-absolute top-50 start-50 translate-middle"
                          style={{
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            pointerEvents: 'none'
                          }}
                        >
                          <small className="text-white">
                            <i className="fas fa-ban me-1 text-danger"></i>
                            Cannot fight (KO)
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="modal-footer border-top border-secondary">
            <div className="me-auto text-muted">
              {selectedFighter ? (
                <span>
                  Selected: <span className="text-white fw-bold">{selectedFighter.name}</span>
                </span>
              ) : (
                <span>Please select a fighter to continue</span>
              )}
            </div>
            
            <div className="d-flex gap-2">
              <Button
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={onConfirm}
                disabled={!selectedFighter || isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Starting Battle...
                  </>
                ) : (
                  'Start Battle'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FighterSelector