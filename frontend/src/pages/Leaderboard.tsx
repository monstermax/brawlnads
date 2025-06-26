import React from 'react'
import { useAllMonanimals } from '../hooks/useAllMonanimals'
import { useWallet } from '../hooks/useWallet'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import type { Monanimal } from '../types'

const Leaderboard: React.FC = () => {
  const { isConnected } = useWallet()
  const { allMonanimals, loading } = useAllMonanimals()


  // Calculer les statistiques pour le leaderboard
  const getLeaderboardData = () => {
    if (!allMonanimals.length) return []

    return allMonanimals
      .map(monanimal => ({
        ...monanimal,
        totalBattles: monanimal.wins + monanimal.losses,
        winRate: monanimal.wins + monanimal.losses > 0 
          ? Math.round((monanimal.wins / (monanimal.wins + monanimal.losses)) * 100)
          : 0,
        score: monanimal.wins * 3 - monanimal.losses // Score système : +3 pour victoire, -1 pour défaite
      }))
      .filter(monanimal => monanimal.totalBattles > 0) // Seulement ceux qui ont combattu
      .sort((a, b) => {
        // Trier par score, puis par taux de victoire, puis par nombre de victoires
        if (b.score !== a.score) return b.score - a.score
        if (b.winRate !== a.winRate) return b.winRate - a.winRate
        return b.wins - a.wins
      })
  }

  const leaderboardData = getLeaderboardData()

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${rank}`
    }
  }

  const getRankBadgeVariant = (rank: number) => {
    switch (rank) {
      case 1: return 'warning' as const
      case 2: return 'light' as const
      case 3: return 'dark' as const
      default: return 'secondary' as const
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'mythic': return 'text-danger'
      case 'legendary': return 'text-warning'
      case 'epic': return 'text-primary'
      case 'rare': return 'text-info'
      case 'uncommon': return 'text-success'
      default: return 'text-muted'
    }
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="text-white mb-3">
              <i className="fas fa-trophy me-3 text-warning"></i>
              Leaderboard
            </h1>
            <p className="text-muted lead">
              Les meilleurs combattants de BrawlNads
            </p>
            
          </div>

          {/* Stats globales */}
          <div className="row mb-5">
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card bg-dark text-white h-100">
                <div className="card-body text-center">
                  <i className="fas fa-users fa-2x text-primary mb-3"></i>
                  <h5 className="card-title">Total Fighters</h5>
                  <h3 className="text-primary">{loading ? '...' : allMonanimals.length}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card bg-dark text-white h-100">
                <div className="card-body text-center">
                  <i className="fas fa-fist-raised fa-2x text-danger mb-3"></i>
                  <h5 className="card-title">Active Fighters</h5>
                  <h3 className="text-danger">
                    {loading ? '...' : allMonanimals.filter(m => !m.isKO).length}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card bg-dark text-white h-100">
                <div className="card-body text-center">
                  <i className="fas fa-fire fa-2x text-warning mb-3"></i>
                  <h5 className="card-title">Total Battles</h5>
                  <h3 className="text-warning">
                    {loading ? '...' : leaderboardData.reduce((total, m) => total + m.totalBattles, 0)}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card bg-dark text-white h-100">
                <div className="card-body text-center">
                  <i className="fas fa-crown fa-2x text-success mb-3"></i>
                  <h5 className="card-title">Champion</h5>
                  <h6 className="text-success">
                    {loading ? '...' : leaderboardData.length > 0 ? leaderboardData[0].name : 'Aucun'}
                  </h6>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="card bg-dark text-white">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-list-ol me-2"></i>
                Classement des Fighters
              </h5>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted mt-3">Chargement du leaderboard...</p>
                </div>
              ) : leaderboardData.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-exclamation-triangle fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">Aucun combat enregistré</h5>
                  <p className="text-muted">
                    Les fighters apparaîtront ici après leurs premiers combats
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Rang</th>
                        <th>Fighter</th>
                        <th>Classe</th>
                        <th>Rareté</th>
                        <th>Level</th>
                        <th>Victoires</th>
                        <th>Défaites</th>
                        <th>Taux de victoire</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboardData.map((monanimal, index) => (
                        <tr key={monanimal.id} className={index < 3 ? 'table-warning' : ''}>
                          <td>
                            <Badge variant={getRankBadgeVariant(index + 1)}>
                              {getRankIcon(index + 1)}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <img 
                                src={monanimal.image} 
                                alt={monanimal.name}
                                className="rounded me-2"
                                style={{ width: '32px', height: '32px' }}
                              />
                              <div>
                                <div className="fw-bold">{monanimal.name}</div>
                                <small className="text-muted">#{monanimal.id}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <Badge variant="info">{monanimal.class}</Badge>
                          </td>
                          <td>
                            <span className={getRarityColor(monanimal.rarity)}>
                              {monanimal.rarity}
                            </span>
                          </td>
                          <td>
                            <Badge variant="primary">{monanimal.level}</Badge>
                          </td>
                          <td>
                            <span className="text-success fw-bold">
                              <i className="fas fa-trophy me-1"></i>
                              {monanimal.wins}
                            </span>
                          </td>
                          <td>
                            <span className="text-danger">
                              <i className="fas fa-times me-1"></i>
                              {monanimal.losses}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="progress me-2" style={{ width: '60px', height: '8px' }}>
                                <div 
                                  className={`progress-bar ${monanimal.winRate >= 70 ? 'bg-success' : monanimal.winRate >= 50 ? 'bg-warning' : 'bg-danger'}`}
                                  style={{ width: `${monanimal.winRate}%` }}
                                ></div>
                              </div>
                              <span className="small">{monanimal.winRate}%</span>
                            </div>
                          </td>
                          <td>
                            <span className={`fw-bold ${monanimal.score > 0 ? 'text-success' : monanimal.score < 0 ? 'text-danger' : 'text-muted'}`}>
                              {monanimal.score > 0 ? '+' : ''}{monanimal.score}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Légende du système de score */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card bg-secondary">
                <div className="card-body">
                  <h6 className="card-title">
                    <i className="fas fa-info-circle me-2"></i>
                    Système de Score
                  </h6>
                  <div className="row">
                    <div className="col-md-4">
                      <small className="text-success">
                        <i className="fas fa-plus me-1"></i>
                        <strong>+3 points</strong> par victoire
                      </small>
                    </div>
                    <div className="col-md-4">
                      <small className="text-danger">
                        <i className="fas fa-minus me-1"></i>
                        <strong>-1 point</strong> par défaite
                      </small>
                    </div>
                    <div className="col-md-4">
                      <small className="text-info">
                        <i className="fas fa-sort me-1"></i>
                        Classement par <strong>Score → Taux de victoire → Victoires</strong>
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard