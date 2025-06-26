import React, { useState } from 'react'
import { useAllMonanimals } from '../hooks/useAllMonanimals'
import { useAccount } from 'wagmi'
import type { Monanimal } from '../types'

interface OpponentSelectorProps {
  onSelectOpponent: (opponent: Monanimal) => void
  userMonanimals: Monanimal[]
  selectedFighter?: Monanimal
}

export function OpponentSelector({ onSelectOpponent, userMonanimals, selectedFighter }: OpponentSelectorProps) {
  const { address } = useAccount()
  const { allMonanimals, loading } = useAllMonanimals()
  const [selectedOpponent, setSelectedOpponent] = useState<Monanimal | null>(null)

  // Filtrer les adversaires potentiels (exclure les Monanimals du joueur, celui sélectionné et les KO)
  const availableOpponents = allMonanimals.filter(monanimal => {
    // Exclure les Monanimals du joueur
    const isOwnedByUser = userMonanimals.some(owned => owned.id === monanimal.id)
    // Exclure le fighter sélectionné
    const isSelectedFighter = selectedFighter && selectedFighter.id === monanimal.id
    // Exclure les Monanimals KO (ils ne peuvent pas combattre)
    const isKO = monanimal.isKO
    
    return !isOwnedByUser && !isSelectedFighter && !isKO
  })

  const handleSelectOpponent = (opponent: Monanimal) => {
    setSelectedOpponent(opponent)
    onSelectOpponent(opponent)
  }

  const getRandomOpponent = () => {
    if (availableOpponents.length === 0) return null
    const randomIndex = Math.floor(Math.random() * availableOpponents.length)
    const randomOpponent = availableOpponents[randomIndex]
    handleSelectOpponent(randomOpponent)
    return randomOpponent
  }

  if (loading) {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Chargement des adversaires...</h5>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (availableOpponents.length === 0) {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Aucun adversaire disponible</h5>
          <p className="card-text">
            Il n'y a actuellement aucun Monanimal disponible pour combattre.
            Essayez de minter plus de Monanimals ou attendez que d'autres joueurs en créent.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Choisir un adversaire</h5>
        <p className="card-text">
          {availableOpponents.length} adversaire{availableOpponents.length > 1 ? 's' : ''} disponible{availableOpponents.length > 1 ? 's' : ''}
        </p>
        
        <div className="mb-3">
          <button 
            className="btn btn-primary me-2"
            onClick={getRandomOpponent}
          >
            🎲 Adversaire aléatoire
          </button>
          
          {selectedOpponent && (
            <span className="badge bg-success">
              Adversaire sélectionné: {selectedOpponent.name}
            </span>
          )}
        </div>

        <div className="row">
          {availableOpponents.slice(0, 6).map((opponent) => (
            <div key={opponent.id} className="col-md-4 mb-3">
              <div 
                className={`card h-100 ${selectedOpponent?.id === opponent.id ? 'border-primary' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleSelectOpponent(opponent)}
              >
                <img 
                  src={opponent.image} 
                  className="card-img-top" 
                  alt={opponent.name}
                  style={{ height: '150px', objectFit: 'cover' }}
                />
                <div className="card-body p-2">
                  <h6 className="card-title mb-1">{opponent.name}</h6>
                  <div className="d-flex justify-content-between">
                    <small className="text-muted">Lvl {opponent.level}</small>
                    <small className="text-muted">{opponent.class}</small>
                  </div>
                  <div className="row text-center mt-2">
                    <div className="col-4">
                      <small className="text-danger">❤️ {opponent.health}</small>
                    </div>
                    <div className="col-4">
                      <small className="text-warning">⚔️ {opponent.attack}</small>
                    </div>
                    <div className="col-4">
                      <small className="text-info">🛡️ {opponent.defense}</small>
                    </div>
                  </div>
                  <div className="row text-center">
                    <div className="col-4">
                      <small className="text-success">💨 {opponent.speed}</small>
                    </div>
                    <div className="col-4">
                      <small className="text-primary">✨ {opponent.magic}</small>
                    </div>
                    <div className="col-4">
                      <small className="text-secondary">🍀 {opponent.luck}</small>
                    </div>
                  </div>
                  {selectedOpponent?.id === opponent.id && (
                    <div className="mt-2">
                      <span className="badge bg-primary w-100">Sélectionné</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {availableOpponents.length > 6 && (
          <div className="text-center mt-3">
            <small className="text-muted">
              Et {availableOpponents.length - 6} autre{availableOpponents.length - 6 > 1 ? 's' : ''} adversaire{availableOpponents.length - 6 > 1 ? 's' : ''}...
            </small>
          </div>
        )}
      </div>
    </div>
  )
}