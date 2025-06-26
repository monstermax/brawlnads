import React, { useState } from 'react'
import { useMonanimals } from '../hooks/useMonanimals'
import { useWallet } from '../hooks/useWallet'
import MonanimalCard from '../components/MonanimalCard'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import type { Monanimal } from '../types'

const Collection: React.FC = () => {
  const { isConnected } = useWallet()
  const { monanimals, loading, mint, isMinting, mintPrice } = useMonanimals()
  const [selectedRarity, setSelectedRarity] = useState<string>('All')
  const [selectedClass, setSelectedClass] = useState<string>('All')
  const [sortBy, setSortBy] = useState<string>('level')

  const rarities = ['All', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic']
  const classes = ['All', 'Warrior', 'Mage', 'Assassin', 'Archer', 'Paladin', 'Berserker', 'Guardian']

  const filteredMonanimals = monanimals
    .filter(monanimal => selectedRarity === 'All' || monanimal.rarity === selectedRarity)
    .filter(monanimal => selectedClass === 'All' || monanimal.class === selectedClass)
    .sort((a, b) => {
      switch (sortBy) {
        case 'level':
          return b.level - a.level
        case 'attack':
          return b.attack - a.attack
        case 'defense':
          return b.defense - a.defense
        case 'speed':
          return b.speed - a.speed
        case 'wins':
          return b.wins - a.wins
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const handleMonanimalSelect = (monanimal: Monanimal) => {
    // Pour l'instant, on ne fait rien, mais on pourrait ouvrir un modal de détails
    console.log('Selected monanimal:', monanimal)
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
                  Please connect your wallet to view your Monanimal collection
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="text-white mb-1">
                <i className="fas fa-dragon me-2 text-primary"></i>
                My Collection
              </h2>
              <p className="text-muted mb-0">
                {loading ? 'Loading...' : `${filteredMonanimals.length} of ${monanimals.length} Monanimals`}
              </p>
            </div>
            <Button
              variant="primary"
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
                  Mint New ({mintPrice} ETH)
                </>
              )}
            </Button>
          </div>

          {/* Filters */}
          <div className="card bg-dark mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label text-white">Rarity</label>
                  <select
                    className="form-select bg-dark text-white border-secondary"
                    value={selectedRarity}
                    onChange={(e) => setSelectedRarity(e.target.value)}
                  >
                    {rarities.map(rarity => (
                      <option key={rarity} value={rarity}>{rarity}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label text-white">Class</label>
                  <select
                    className="form-select bg-dark text-white border-secondary"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label text-white">Sort By</label>
                  <select
                    className="form-select bg-dark text-white border-secondary"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="level">Level</option>
                    <option value="attack">Attack</option>
                    <option value="defense">Defense</option>
                    <option value="speed">Speed</option>
                    <option value="wins">Wins</option>
                    <option value="name">Name</option>
                  </select>
                </div>
                <div className="col-md-3 d-flex align-items-end">
                  <Button
                    variant="outline"
                    className="w-100"
                    onClick={() => {
                      setSelectedRarity('All')
                      setSelectedClass('All')
                      setSortBy('level')
                    }}
                  >
                    <i className="fas fa-undo me-2"></i>
                    Reset Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Collection Grid */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-3">Loading your collection...</p>
            </div>
          ) : filteredMonanimals.length === 0 ? (
            <div className="text-center py-5">
              <div className="card bg-dark text-white">
                <div className="card-body py-5">
                  {monanimals.length === 0 ? (
                    <>
                      <i className="fas fa-dragon fa-3x text-muted mb-4"></i>
                      <h3 className="mb-3">No Monanimals Yet</h3>
                      <p className="text-muted mb-4">
                        Start your collection by minting your first Monanimal!
                      </p>
                      <Button
                        variant="primary"
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
                            Mint Your First Monanimal
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-filter fa-3x text-muted mb-4"></i>
                      <h3 className="mb-3">No Matches Found</h3>
                      <p className="text-muted mb-4">
                        Try adjusting your filters to see more Monanimals
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {filteredMonanimals.map((monanimal) => (
                <div key={monanimal.id} className="col-xl-3 col-lg-4 col-md-6">
                  <MonanimalCard
                    monanimal={monanimal}
                    onSelect={handleMonanimalSelect}
                    showActions={true}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Collection