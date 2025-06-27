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
  const { startBattle, battleResult, isLoading: isBattling, clearResult } = useBattles(monanimals)
  
  const [showFighterSelector, setShowFighterSelector] = useState(false)
  const [showOpponentSelector, setShowOpponentSelector] = useState(false)
  const [selectedFighter, setSelectedFighter] = useState<Monanimal | null>(null)
  const [selectedOpponent, setSelectedOpponent] = useState<Monanimal | null>(null)
  const [showBattleResult, setShowBattleResult] = useState(false)

  // Afficher automatiquement le résultat quand il est disponible
  React.useEffect(() => {
    if (battleResult) {
      console.log('🎯 Battle result received, showing modal:', battleResult)
      setShowBattleResult(true)
    }
  }, [battleResult])

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
      .catch((error) => {
        console.error('Battle failed:', error)
        alert('Battle failed. Please try again.')
      })
  }

  const handleCloseBattleResult = () => {
    setShowBattleResult(false)
    setSelectedFighter(null)
    setSelectedOpponent(null)
    clearResult() // Nettoyer le résultat de bataille
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
      <div className="min-h-screen relative overflow-hidden tailwind-page monad-bg">
        {/* Monad Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{ backgroundColor: '#836EF9' }}></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-2000" style={{ backgroundColor: '#A0055D' }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto">
            <div className="bg-black/60 backdrop-blur-md border border-red-500/30 rounded-3xl p-8 text-center">
              <div className="text-6xl mb-6">🔒</div>
              <h2 className="text-3xl font-bold text-white mb-4">Access Denied</h2>
              <p className="text-gray-300 mb-8 text-lg">
                Connect your wallet to enter the legendary Battle Arena
              </p>
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <p className="text-red-400 text-sm">
                  🛡️ Secure wallet connection required
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
            ⚔️ BATTLE ARENA
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-px bg-gradient-to-r from-transparent via-red-400 to-transparent flex-1 max-w-xs"></div>
            <span className="text-red-400 text-sm font-mono tracking-widest">EPIC BATTLES AWAIT</span>
            <div className="h-px bg-gradient-to-r from-transparent via-red-400 to-transparent flex-1 max-w-xs"></div>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Test your Monanimals in epic battles and earn legendary rewards
          </p>
        </div>

        {/* Battle Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-black/60 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/50 transition-all duration-300 group">
            <div className="text-center">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🐉</div>
              <h3 className="text-purple-300 font-semibold mb-2 text-enhanced">AVAILABLE FIGHTERS</h3>
              <div className="text-3xl font-bold text-white text-enhanced">
                {loading ? (
                  <div className="animate-pulse bg-gray-600 h-8 w-16 mx-auto rounded"></div>
                ) : (
                  monanimals.length
                )}
              </div>
            </div>
          </div>

          <div className="bg-black/60 backdrop-blur-md border border-yellow-500/30 rounded-2xl p-6 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="text-center">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🏆</div>
              <h3 className="text-yellow-300 font-semibold mb-2 text-enhanced">TOTAL WINS</h3>
              <div className="text-3xl font-bold text-white text-enhanced">
                {loading ? (
                  <div className="animate-pulse bg-gray-600 h-8 w-16 mx-auto rounded"></div>
                ) : (
                  monanimals.reduce((total, m) => total + m.wins, 0)
                )}
              </div>
            </div>
          </div>

          <div className="bg-black/60 backdrop-blur-md border border-red-500/30 rounded-2xl p-6 hover:border-red-400/50 transition-all duration-300 group">
            <div className="text-center">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">💀</div>
              <h3 className="text-red-300 font-semibold mb-2 text-enhanced">TOTAL LOSSES</h3>
              <div className="text-3xl font-bold text-white text-enhanced">
                {loading ? (
                  <div className="animate-pulse bg-gray-600 h-8 w-16 mx-auto rounded"></div>
                ) : (
                  monanimals.reduce((total, m) => total + m.losses, 0)
                )}
              </div>
            </div>
          </div>

          <div className="bg-black/60 backdrop-blur-md border border-green-500/30 rounded-2xl p-6 hover:border-green-400/50 transition-all duration-300 group">
            <div className="text-center">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">📊</div>
              <h3 className="text-green-300 font-semibold mb-2 text-enhanced">WIN RATE</h3>
              <div className="text-3xl font-bold text-white text-enhanced">
                {loading ? (
                  <div className="animate-pulse bg-gray-600 h-8 w-16 mx-auto rounded"></div>
                ) : (() => {
                  const totalWins = monanimals.reduce((total, m) => total + m.wins, 0)
                  const totalLosses = monanimals.reduce((total, m) => total + m.losses, 0)
                  const totalBattles = totalWins + totalLosses
                  return totalBattles > 0 ? `${Math.round((totalWins / totalBattles) * 100)}%` : '0%'
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Battle Action */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-black/60 backdrop-blur-md border border-red-500/30 rounded-3xl overflow-hidden">
            <div className="bg-black/40 border-b border-red-500/30 p-6 text-center">
              <h2 className="text-2xl font-bold text-red-400 font-mono text-enhanced">
                ⚔️ READY FOR BATTLE?
              </h2>
            </div>

            <div className="p-8 text-center">
              {monanimals.length === 0 ? (
                <>
                  <div className="text-8xl mb-8">🐉</div>
                  <h2 className="text-4xl font-bold text-white mb-4 gaming-subtitle">No Fighters Available</h2>
                  <p className="text-gray-300 text-lg mb-8">
                    You need to mint at least one Monanimal before you can battle
                  </p>
                  <Badge className="bg-orange-600/20 text-orange-400 border-orange-500/30 text-sm font-bold px-4 py-2">
                    <span className="mr-2">⚠️</span>
                    MINT A MONANIMAL FIRST
                  </Badge>
                </>
              ) : (
                <>
                  <div className="text-8xl mb-8">🔥</div>
                  <h2 className="text-4xl font-bold text-white mb-4 gaming-subtitle">Choose Your Champion</h2>
                  <p className="text-gray-300 text-lg mb-8">
                    Select your strongest Monanimal and enter the arena for epic battles
                  </p>
                  <Button
                    onClick={handleStartBattle}
                    disabled={isBattling}
                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
                  >
                    {isBattling ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        BATTLE IN PROGRESS...
                      </>
                    ) : (
                      <>
                        <span className="mr-3">⚔️</span>
                        START BATTLE
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Top Fighters */}
        {monanimals.length > 0 && (
          <div className="bg-black/60 backdrop-blur-md border border-yellow-500/30 rounded-3xl overflow-hidden">
            <div className="bg-black/40 border-b border-yellow-500/30 p-6">
              <h2 className="text-2xl font-bold text-yellow-400 font-mono text-enhanced">
                👑 YOUR TOP FIGHTERS
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {monanimals
                  .sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses))
                  .slice(0, 3)
                  .map((monanimal, index) => (
                    <div key={monanimal.id} className="bg-black/60 backdrop-blur-md border border-gray-500/30 rounded-2xl p-6 hover:border-gray-400/50 transition-all duration-300 group">
                      <div className="text-center">
                        {/* Rank and Rarity Badges */}
                        <div className="flex justify-between items-start mb-4">
                          <Badge className={`${
                            index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black' :
                            index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-black' :
                            'bg-gradient-to-r from-orange-600 to-yellow-600 text-black'
                          } font-bold text-sm`}>
                            #{index + 1}
                          </Badge>
                          <Badge className="bg-cyan-600/20 text-cyan-400 border-cyan-500/30 text-xs">
                            {monanimal.rarity}
                          </Badge>
                        </div>

                        {/* NFT Image */}
                        <div 
                          className="w-20 h-20 mx-auto mb-4 rounded-xl bg-gray-600"
                          style={{ 
                            backgroundImage: `url(${monanimal.image})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center'
                          }}
                        />

                        {/* Fighter Info */}
                        <h3 className="text-white font-bold text-lg mb-2 text-enhanced">{monanimal.name}</h3>
                        <p className="text-gray-400 text-sm mb-4">
                          Level {monanimal.level} {monanimal.class}
                        </p>

                        {/* Win/Loss Stats */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-green-400 font-bold text-lg text-enhanced">
                              🏆 {monanimal.wins}
                            </div>
                            <div className="text-green-400 text-xs">WINS</div>
                          </div>
                          <div className="text-center">
                            <div className="text-red-400 font-bold text-lg text-enhanced">
                              ❌ {monanimal.losses}
                            </div>
                            <div className="text-red-400 text-xs">LOSSES</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/90 backdrop-blur-md border border-red-500/30 rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-black/60 border-b border-red-500/30 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-red-400 font-mono text-enhanced">
                🎯 CHOOSE OPPONENT FOR {selectedFighter?.name}
              </h2>
              <button
                onClick={handleCloseOpponentSelector}
                className="text-gray-400 hover:text-white transition-colors text-2xl"
              >
                ✕
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <OpponentSelector
                onSelectOpponent={handleSelectOpponent}
                userMonanimals={monanimals}
                selectedFighter={selectedFighter || undefined}
              />
            </div>
            
            {/* Modal Footer */}
            <div className="bg-black/60 border-t border-red-500/30 p-6 flex justify-between items-center">
              <div className="text-gray-300">
                {selectedOpponent ? (
                  <span>
                    Opponent: <span className="text-white font-bold text-enhanced">{selectedOpponent.name}</span>
                  </span>
                ) : (
                  <span>Please select an opponent</span>
                )}
              </div>
              
              <div className="flex gap-4">
                <Button
                  onClick={handleCloseOpponentSelector}
                  variant="outline"
                  className="border-gray-500/50 text-gray-400 hover:bg-gray-500/10 hover:border-gray-400"
                >
                  <span className="mr-2">↩️</span>
                  BACK
                </Button>
                <Button
                  onClick={handleConfirmBattle}
                  disabled={!selectedOpponent || isBattling}
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBattling ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      BATTLE IN PROGRESS...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">⚔️</span>
                      START COMBAT!
                    </>
                  )}
                </Button>
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