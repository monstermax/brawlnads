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

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black'
      case 2: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-black'
      case 3: return 'bg-gradient-to-r from-orange-600 to-yellow-600 text-black'
      default: return 'bg-gray-600/50 text-gray-300'
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'mythic': return 'text-purple-400'
      case 'legendary': return 'text-yellow-400'
      case 'epic': return 'text-blue-400'
      case 'rare': return 'text-green-400'
      case 'uncommon': return 'text-cyan-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden tailwind-page monad-bg">
      {/* Monad Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{ backgroundColor: '#836EF9' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-2000" style={{ backgroundColor: '#A0055D' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-8 animate-pulse animation-delay-4000" style={{ backgroundColor: '#200052' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl gaming-title mb-4">
            🏆 LEADERBOARD
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent flex-1 max-w-xs"></div>
            <span className="text-yellow-400 text-sm font-mono tracking-widest">HALL OF CHAMPIONS</span>
            <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent flex-1 max-w-xs"></div>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            The best fighters in the BrawlNads universe
          </p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-black/60 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/50 transition-all duration-300 group">
            <div className="text-center">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">👥</div>
              <h3 className="text-purple-300 font-semibold mb-2 text-enhanced">TOTAL FIGHTERS</h3>
              <div className="text-3xl font-bold text-white text-enhanced">
                {loading ? (
                  <div className="animate-pulse bg-gray-600 h-8 w-16 mx-auto rounded"></div>
                ) : (
                  allMonanimals.length
                )}
              </div>
            </div>
          </div>

          <div className="bg-black/60 backdrop-blur-md border border-red-500/30 rounded-2xl p-6 hover:border-red-400/50 transition-all duration-300 group">
            <div className="text-center">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">⚔️</div>
              <h3 className="text-red-300 font-semibold mb-2 text-enhanced">ACTIVE FIGHTERS</h3>
              <div className="text-3xl font-bold text-white text-enhanced">
                {loading ? (
                  <div className="animate-pulse bg-gray-600 h-8 w-16 mx-auto rounded"></div>
                ) : (
                  allMonanimals.filter(m => !m.isKO).length
                )}
              </div>
            </div>
          </div>

          <div className="bg-black/60 backdrop-blur-md border border-orange-500/30 rounded-2xl p-6 hover:border-orange-400/50 transition-all duration-300 group">
            <div className="text-center">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🔥</div>
              <h3 className="text-orange-300 font-semibold mb-2 text-enhanced">TOTAL BATTLES</h3>
              <div className="text-3xl font-bold text-white text-enhanced">
                {loading ? (
                  <div className="animate-pulse bg-gray-600 h-8 w-16 mx-auto rounded"></div>
                ) : (
                  leaderboardData.reduce((total, m) => total + m.totalBattles, 0)
                )}
              </div>
            </div>
          </div>

          <div className="bg-black/60 backdrop-blur-md border border-green-500/30 rounded-2xl p-6 hover:border-green-400/50 transition-all duration-300 group">
            <div className="text-center">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">👑</div>
              <h3 className="text-green-300 font-semibold mb-2 text-enhanced">CHAMPION</h3>
              <div className="text-lg font-bold text-white text-enhanced">
                {loading ? (
                  <div className="animate-pulse bg-gray-600 h-6 w-20 mx-auto rounded"></div>
                ) : (
                  leaderboardData.length > 0 ? leaderboardData[0].name : 'Aucun'
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-black/60 backdrop-blur-md border border-yellow-500/30 rounded-3xl overflow-hidden">
          <div className="bg-black/40 border-b border-yellow-500/30 p-6">
            <h2 className="text-2xl font-bold text-yellow-400 font-mono text-enhanced">
              📊 FIGHTERS LEADERBOARD
            </h2>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-20">
                <div className="cyber-spinner mx-auto mb-6"></div>
                <h3 className="text-2xl font-bold text-white mb-2">Loading Leaderboard...</h3>
                <p className="text-gray-300">Scanning battle records...</p>
              </div>
            ) : leaderboardData.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-8xl mb-8">⚠️</div>
                <h2 className="text-4xl font-bold text-white mb-4 gaming-subtitle">No Battles Recorded</h2>
                <p className="text-gray-300 text-lg">
                  Fighters will appear here after their first battles
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left py-4 px-2 text-yellow-400 font-mono text-sm">RANK</th>
                      <th className="text-left py-4 px-2 text-yellow-400 font-mono text-sm">FIGHTER</th>
                      <th className="text-left py-4 px-2 text-yellow-400 font-mono text-sm">CLASS</th>
                      <th className="text-left py-4 px-2 text-yellow-400 font-mono text-sm">RARITY</th>
                      <th className="text-left py-4 px-2 text-yellow-400 font-mono text-sm">LVL</th>
                      <th className="text-left py-4 px-2 text-yellow-400 font-mono text-sm">WINS</th>
                      <th className="text-left py-4 px-2 text-yellow-400 font-mono text-sm">LOSSES</th>
                      <th className="text-left py-4 px-2 text-yellow-400 font-mono text-sm">WIN RATE</th>
                      <th className="text-left py-4 px-2 text-yellow-400 font-mono text-sm">SCORE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((monanimal, index) => (
                      <tr 
                        key={monanimal.id} 
                        className={`border-b border-gray-700/50 hover:bg-white/5 transition-colors ${
                          index < 3 ? 'bg-yellow-500/10' : ''
                        }`}
                      >
                        <td className="py-4 px-2">
                          <Badge className={`${getRankBadgeColor(index + 1)} font-bold text-sm`}>
                            {getRankIcon(index + 1)}
                          </Badge>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-800/50 border border-gray-600/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {monanimal.image ? (
                                <img
                                  src={monanimal.image}
                                  alt={monanimal.name}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <div className="text-gray-400 text-xs">🐾</div>
                              )}
                            </div>
                            <div>
                              <div className="text-white font-bold text-enhanced">{monanimal.name}</div>
                              <div className="text-gray-400 text-sm">#{monanimal.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <Badge className="bg-cyan-600/20 text-cyan-400 border-cyan-500/30 text-xs">
                            {monanimal.class}
                          </Badge>
                        </td>
                        <td className="py-4 px-2">
                          <span className={`${getRarityColor(monanimal.rarity)} font-semibold text-enhanced`}>
                            {monanimal.rarity}
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30 text-xs">
                            {monanimal.level}
                          </Badge>
                        </td>
                        <td className="py-4 px-2">
                          <span className="text-green-400 font-bold text-enhanced">
                            🏆 {monanimal.wins}
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <span className="text-red-400 font-bold text-enhanced">
                            ❌ {monanimal.losses}
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-300 ${
                                  monanimal.winRate >= 70 ? 'bg-green-500' : 
                                  monanimal.winRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${monanimal.winRate}%` }}
                              />
                            </div>
                            <span className="text-white text-sm font-mono text-enhanced">{monanimal.winRate}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <span className={`font-bold text-enhanced ${
                            monanimal.score > 0 ? 'text-green-400' : 
                            monanimal.score < 0 ? 'text-red-400' : 'text-gray-400'
                          }`}>
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

        {/* Score System Legend */}
        <div className="mt-8">
          <div className="bg-black/60 backdrop-blur-md border border-gray-500/30 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-300 mb-4 font-mono text-enhanced">
              ℹ️ SCORING SYSTEM
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-bold text-enhanced">+3 points</span>
                <span className="text-gray-300">per victory</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-400 font-bold text-enhanced">-1 point</span>
                <span className="text-gray-300">per defeat</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold text-enhanced">Ranking:</span>
                <span className="text-gray-300">Score → Win Rate → Wins</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard