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
    return (
      <div className="flex justify-center mb-4 px-2">
        <div className={`
          relative bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-md rounded-xl overflow-hidden
          transition-all duration-300 max-w-sm w-full
          ${isWinner ? 'border-2 border-yellow-400 shadow-2xl shadow-yellow-400/50 scale-105' : ''}
          ${isLoser ? 'border border-gray-600 opacity-60 scale-95' : ''}
          ${!isWinner && !isLoser ? 'border border-gray-700/50' : ''}
        `}>
          {/* Winner overlay */}
          {isWinner && (
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-white/5 pointer-events-none rounded-xl" />
          )}
          
          {/* Crown for winner */}
          {isWinner && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10 text-3xl animate-bounce">
              👑
            </div>
          )}

          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-700/50">
            <div>
              <h3 className={`font-bold ${isLoser ? 'text-gray-400' : 'text-white'}`}>
                {monanimal.name || `Monanimal #${monanimal.id}`}
              </h3>
              <p className="text-gray-400 text-sm">
                Level {monanimal.level || 1} {monanimal.class || 'Fighter'}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              {isWinner && (
                <Badge variant="warning" className="winner-badge">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                  WINNER
                </Badge>
              )}
              {isLoser && (
                <Badge variant="secondary">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  DEFEATED
                </Badge>
              )}
              <Badge variant={getRarityVariant(monanimal.rarity || 'Common')}>
                {monanimal.rarity || 'Common'}
              </Badge>
            </div>
          </div>
          
          {/* NFT Image */}
          <div className="p-2">
            <div className={`
              flex items-center justify-center h-40 rounded-lg relative overflow-visible
              ${isLoser ? 'bg-gray-800/20' : 'bg-gray-700/30'}
            `}>
              {monanimal.image ? (
                <div
                  className={`w-36 h-36 bg-contain bg-no-repeat bg-center ${isLoser ? 'filter grayscale brightness-50' : ''}`}
                  style={{
                    backgroundImage: `url(${monanimal.image})`,
                  }}
                />
              ) : (
                <div className={`text-center ${isLoser ? 'text-gray-400' : 'text-white'}`}>
                  <div className={`text-5xl ${isWinner ? 'animate-pulse' : ''}`}>
                    🐾
                  </div>
                  <p className="text-xs mt-1">Monanimal #{monanimal.id}</p>
                </div>
              )}
              
              {/* Winner glow effect */}
              {isWinner && (
                <div className="absolute inset-0 bg-gradient-radial from-yellow-400/15 via-transparent to-transparent rounded-lg animate-pulse pointer-events-none" />
              )}
            </div>

            {/* Stats Card */}
            <div className={`
              mt-2 rounded-lg p-3 border
              ${isWinner ? 'bg-yellow-400/5 border-yellow-400/30' : ''}
              ${isLoser ? 'bg-gray-800/20 border-gray-600' : ''}
              ${!isWinner && !isLoser ? 'bg-white/5 border-white/20' : ''}
            `}>
              <h4 className={`text-center font-bold mb-2 ${isLoser ? 'text-gray-400' : 'text-white'}`}>
                {monanimal.name || `Monanimal #${monanimal.id}`}
              </h4>
              <p className="text-center text-xs text-gray-400 mb-2">
                Level {monanimal.level || 1} {monanimal.class || 'Fighter'} | {monanimal.rarity || 'Common'}
              </p>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`text-center ${isLoser ? 'text-gray-400' : 'text-gray-200'}`}>
                  HP: {monanimal.health || 100} | ATK: {monanimal.attack || 50}
                </div>
                <div className={`text-center ${isLoser ? 'text-gray-400' : 'text-gray-200'}`}>
                  DEF: {monanimal.defense || 30} | SPD: {monanimal.speed || 40}
                </div>
              </div>
              
              {/* Win/Loss Record */}
              <div className="flex justify-between mt-2 text-xs">
                <span className={isLoser ? 'text-gray-400' : 'text-green-400'}>
                  Wins: {monanimal.wins || 0}
                </span>
                <span className={isLoser ? 'text-gray-400' : 'text-red-400'}>
                  Losses: {monanimal.losses || 0}
                </span>
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
          @keyframes bounce {
            0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
            40%, 43% { transform: translate3d(0,-30px,0); }
            70% { transform: translate3d(0,-15px,0); }
            90% { transform: translate3d(0,-4px,0); }
          }
          .animate-bounce { animation: bounce 2s infinite; }
        `}
      </style>
      
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-[#0E100F] via-[#200052] to-[#0E100F] border border-[#836EF9]/30 rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#836EF9]/20">
            <h2 className="gaming-title text-2xl flex items-center">
              <svg className="w-8 h-8 text-yellow-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd" />
              </svg>
              Battle Results
            </h2>
            <button
              type="button"
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              onClick={onClose}
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            {/* Battle Result Header */}
            <div className="text-center mb-6">
              <div className={`
                rounded-xl p-6 border-2
                ${won === true ? 'bg-green-500/10 border-green-500/30' : ''}
                ${won === false ? 'bg-red-500/10 border-red-500/30' : ''}
                ${won === null ? 'bg-blue-500/10 border-blue-500/30' : ''}
              `}>
                <h3 className={`text-3xl font-bold mb-3 flex items-center justify-center
                  ${won === true ? 'text-green-400' : ''}
                  ${won === false ? 'text-red-400' : ''}
                  ${won === null ? 'text-blue-400' : ''}
                `}>
                  {won === true && (
                    <svg className="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd" />
                    </svg>
                  )}
                  {won === false && (
                    <svg className="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  )}
                  {won === null && (
                    <svg className="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {won === true ? 'VICTORY!' : won === false ? 'DEFEAT!' : 'BATTLE COMPLETED!'}
                </h3>
                <p className="text-white text-lg">{message}</p>
              </div>
            </div>

            {/* VS Section with both NFTs */}
            {winner && loser && (
              <div className="mb-6 relative">
                <div className="text-center mb-6">
                  <h3 className="gaming-title text-xl">
                    <span className="text-yellow-400">⚔️</span> BATTLE RESULT <span className="text-yellow-400">⚔️</span>
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
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
                  
                  {/* VS divider */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:block">
                    <div className="bg-gradient-to-r from-[#836EF9] to-[#A0055D] text-white text-4xl font-bold px-4 py-2 rounded-full shadow-lg shadow-[#836EF9]/50">
                      VS
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Battle Log */}
            {battleLog && battleLog.length > 0 && (
              <div className="mb-6">
                <h3 className="text-white text-lg font-bold mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#836EF9]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  Battle Log
                </h3>
                <div className="bg-black/40 backdrop-blur-md border border-gray-700/50 rounded-xl p-4">
                  {battleLog.map((log, index) => (
                    <div key={index} className="mb-2 last:mb-0">
                      <div className="text-gray-300 text-sm flex items-center">
                        <svg className="w-3 h-3 text-yellow-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        {log}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rewards */}
            {rewards && (
              <div className="mb-6">
                <h3 className="text-white text-lg font-bold mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#836EF9]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
                    <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
                  </svg>
                  Rewards
                </h3>
                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-yellow-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                      <div className="text-white font-semibold">+{rewards.experience || 0} XP</div>
                    </div>
                    <div className="text-center">
                      <svg className={`w-12 h-12 mx-auto mb-2 ${won === true ? 'text-yellow-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd" />
                      </svg>
                      <div className="text-white font-semibold">
                        {won === true ? 'Victory!' : won === false ? 'Participation' : 'Battle Completed'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-6 border-t border-[#836EF9]/20 bg-black/20">
            <Button
              variant="primary"
              onClick={onClose}
              className="w-full"
              style={{ 
                background: won === true 
                  ? 'linear-gradient(45deg, #10b981, #059669)' 
                  : won === false 
                  ? 'linear-gradient(45deg, #ef4444, #dc2626)' 
                  : 'linear-gradient(45deg, #836EF9, #A0055D)',
                border: 'none'
              }}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default BattleProgress