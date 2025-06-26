import React from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import type { MonanimalCardProps } from '../types'

const MonanimalCard: React.FC<MonanimalCardProps> = ({
  monanimal,
  onSelect,
  isSelected = false,
  showActions = true,
}) => {
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

  const handleClick = () => {
    if (onSelect) {
      onSelect(monanimal)
    }
  }

  const handleHeal = (e: React.MouseEvent) => {
    e.stopPropagation() // Empêcher la sélection de la carte
    if (window.healMonanimal) {
      window.healMonanimal(monanimal.id)
    }
  }

  return (
    <div
      className={`card h-100 ${isSelected ? 'border-primary border-3' : ''} ${monanimal.isKO ? 'border-danger' : ''}`}
      style={{
        cursor: 'pointer',
        backgroundColor: monanimal.isKO ? 'rgba(220, 53, 69, 0.1)' : 'rgba(0,0,0,0.8)',
        borderColor: isSelected ? '#0d6efd' : monanimal.isKO ? '#dc3545' : 'rgba(108, 117, 125, 0.5)',
        opacity: monanimal.isKO ? 0.8 : 1
      }}
      onClick={handleClick}
    >
      <div className="card-header d-flex justify-content-between align-items-center p-2">
        <div>
          <h6 className="card-title mb-0 text-white">{monanimal.name}</h6>
          <small className="text-muted">Level {monanimal.level} {monanimal.class}</small>
        </div>
        <div className="d-flex gap-1">
          {monanimal.isKO && (
            <Badge variant="danger">
              <i className="fas fa-skull me-1"></i>
              KO
            </Badge>
          )}
          <Badge variant={getRarityVariant(monanimal.rarity)}>
            {monanimal.rarity}
          </Badge>
        </div>
      </div>
      
      <div className="card-body p-3">
        <div 
          className="d-flex align-items-center justify-content-center mb-3"
          style={{ 
            height: '150px',
            backgroundColor: 'rgba(108, 117, 125, 0.2)',
            borderRadius: '0.375rem'
          }}
        >
          {monanimal.image ? (
            <img 
              src={monanimal.image} 
              alt={monanimal.name}
              className="img-fluid"
              style={{ maxHeight: '100%', maxWidth: '100%' }}
            />
          ) : (
            <div className="text-center text-muted">
              <i className="fas fa-image fa-2x mb-2"></i>
              <p className="small mb-0">NFT Image</p>
            </div>
          )}
        </div>
        
        <div className="row g-2 mb-3">
          <div className="col-6">
            <div className="d-flex align-items-center">
              <i className="fas fa-heart text-danger me-1"></i>
              <small className="text-white">{monanimal.health}</small>
            </div>
          </div>
          <div className="col-6">
            <div className="d-flex align-items-center">
              <i className="fas fa-sword text-warning me-1"></i>
              <small className="text-white">{monanimal.attack}</small>
            </div>
          </div>
          <div className="col-6">
            <div className="d-flex align-items-center">
              <i className="fas fa-shield text-info me-1"></i>
              <small className="text-white">{monanimal.defense}</small>
            </div>
          </div>
          <div className="col-6">
            <div className="d-flex align-items-center">
              <i className="fas fa-bolt text-warning me-1"></i>
              <small className="text-white">{monanimal.speed}</small>
            </div>
          </div>
        </div>
        
        <div className="d-flex justify-content-between mb-3">
          <small className="text-success">Wins: {monanimal.wins}</small>
          <small className="text-danger">Losses: {monanimal.losses}</small>
        </div>
        
        {showActions && (
          <div className="d-grid gap-2 d-md-flex">
            {monanimal.isKO ? (
              <Button
                size="sm"
                variant="success"
                className="w-100"
                onClick={handleHeal}
              >
                <i className="fas fa-heart me-1"></i>
                Heal (0.005 ETH)
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-fill"
                >
                  Equip
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  className="flex-fill"
                >
                  Battle
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MonanimalCard