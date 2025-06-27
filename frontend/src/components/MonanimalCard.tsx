import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { CONTRACT_ADDRESSES } from '../config/web3'
import type { MonanimalCardProps } from '../types'

const MonanimalCard: React.FC<MonanimalCardProps> = ({
  monanimal,
  onSelect,
  isSelected = false,
  showActions = true,
  disableImageModal = false,
}) => {
  const navigate = useNavigate()
  const [showImageModal, setShowImageModal] = useState(false)
  const getRarityConfig = (rarity: string) => {
    switch (rarity) {
      case 'Mythic': 
        return { 
          color: 'from-purple-500 to-pink-500', 
          border: 'border-purple-500/50',
          glow: 'shadow-purple-500/25',
          emoji: '🌟'
        }
      case 'Legendary': 
        return { 
          color: 'from-yellow-500 to-orange-500', 
          border: 'border-yellow-500/50',
          glow: 'shadow-yellow-500/25',
          emoji: '👑'
        }
      case 'Epic': 
        return { 
          color: 'from-blue-500 to-purple-500', 
          border: 'border-blue-500/50',
          glow: 'shadow-blue-500/25',
          emoji: '💎'
        }
      case 'Rare': 
        return { 
          color: 'from-pink-500 to-orange-500', 
          border: 'border-green-500/50',
          glow: 'shadow-green-500/25',
          emoji: '💚'
        }
      case 'Uncommon': 
        return { 
          color: 'from-cyan-500 to-green-500', 
          border: 'border-cyan-500/50',
          glow: 'shadow-cyan-500/25',
          emoji: '🔷'
        }
      default: 
        return { 
          color: 'from-gray-500 to-gray-600', 
          border: 'border-gray-500/50',
          glow: 'shadow-gray-500/25',
          emoji: '⚪'
        }
    }
  }

  const getClassEmoji = (className: string) => {
    switch (className) {
      case 'Warrior': return '⚔️'
      case 'Mage': return '🔮'
      case 'Assassin': return '🗡️'
      case 'Archer': return '🏹'
      case 'Paladin': return '🛡️'
      case 'Berserker': return '🪓'
      case 'Guardian': return '🛡️'
      default: return '⚔️'
    }
  }

  const rarityConfig = getRarityConfig(monanimal.rarity)

  const handleClick = () => {
    if (onSelect) {
      onSelect(monanimal)
    }
  }

  const handleHeal = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.healMonanimal) {
      window.healMonanimal(monanimal.id)
    }
  }

  const handleEquip = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate('/forge')
  }

  const handleBattle = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate('/battle')
  }

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!disableImageModal) {
      setShowImageModal(true)
    } else if (onSelect) {
      // Si la modal est désactivée et qu'on a une fonction onSelect, on sélectionne le fighter
      onSelect(monanimal)
    }
  }

  const getExplorerUrl = () => {
    // URL de l'explorer Monad pour ce NFT
    return `https://testnet.monvision.io/nft/${CONTRACT_ADDRESSES.MonanimalNFT}/${monanimal.id}`
  }

  return (
    <div
      className={`
        relative bg-black/60 backdrop-blur-md border rounded-2xl overflow-hidden cursor-default
        transition-all duration-300 transform hover:scale-105 hover:shadow-2xl
        ${isSelected ? 'border-cyan-400 shadow-cyan-400/50' : rarityConfig.border}
        ${monanimal.isKO ? 'border-red-500/50 opacity-75' : ''}
        ${rarityConfig.glow}
        group
      `}
      onClick={handleClick}
    >
      {/* Rarity Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${rarityConfig.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none -z-10`}></div>

      {/* Header */}
      <div className="relative p-4 border-b border-white/10">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg mb-1 truncate text-enhanced">
              {monanimal.name}
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-cyan-300 font-mono text-enhanced">LVL {monanimal.level}</span>
              <span className="text-gray-300">•</span>
              <span className="text-purple-300 text-enhanced">
                {getClassEmoji(monanimal.class)} {monanimal.class}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <Badge className={`bg-gradient-to-r ${rarityConfig.color} text-white border-0 text-xs font-bold`}>
              {rarityConfig.emoji} {monanimal.rarity}
            </Badge>
            {monanimal.isKO && (
              <Badge className="bg-red-600/20 text-red-400 border-red-500/30 text-xs">
                💀 KO
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* NFT Image */}
      <div className="relative p-4">
        <div
          className={`relative h-40 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl overflow-hidden border border-white/10 transition-all duration-300 ${
            disableImageModal && !onSelect ? 'cursor-default' : 'cursor-pointer hover:border-white/30'
          }`}
          onClick={handleImageClick}
        >
          {monanimal.image ? (
            <div
              className={`w-full h-full ${monanimal.isKO ? 'grayscale' : ''} transition-all duration-300 hover:scale-105`}
              style={{
                backgroundImage: `url(${monanimal.image})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300">
              <div className="text-center">
                <div className="text-4xl mb-2">🐾</div>
                <p className="text-xs">NFT Image</p>
              </div>
            </div>
          )}
          
          {/* Click indicator */}
          {!disableImageModal && (
            <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          )}
          
          {/* KO Overlay */}
          {monanimal.isKO && (
            <div className="absolute inset-0 bg-red-900/30 flex items-center justify-center">
              <div className="text-red-400 text-4xl animate-pulse">💀</div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-2 text-center">
            <div className="text-red-400 text-xs font-semibold mb-1">❤️ HEALTH</div>
            <div className="text-white font-bold">{monanimal.health}</div>
          </div>
          <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-2 text-center">
            <div className="text-yellow-400 text-xs font-semibold mb-1">⚔️ ATTACK</div>
            <div className="text-white font-bold">{monanimal.attack}</div>
          </div>
          <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-2 text-center">
            <div className="text-blue-400 text-xs font-semibold mb-1">🛡️ DEFENSE</div>
            <div className="text-white font-bold">{monanimal.defense}</div>
          </div>
          <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-2 text-center">
            <div className="text-purple-300 text-enhanced text-xs font-semibold mb-1">⚡ SPEED</div>
            <div className="text-white font-bold">{monanimal.speed}</div>
          </div>
        </div>

        {/* Win/Loss Record */}
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="text-center">
            <div className="text-green-400 font-bold text-lg">{monanimal.wins}</div>
            <div className="text-green-400 text-xs">WINS</div>
          </div>
          <div className="text-gray-300 text-2xl">VS</div>
          <div className="text-center">
            <div className="text-red-400 font-bold text-lg">{monanimal.losses}</div>
            <div className="text-red-400 text-xs">LOSSES</div>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="space-y-2 relative z-20">
            {monanimal.isKO ? (
              <button
                onClick={handleHeal}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-2 rounded-lg transition-all duration-300 px-4 cursor-pointer"
              >
                <span className="mr-2">💚</span>
                HEAL (0.005 MON)
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleEquip}
                  className="px-4 py-2 border border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300 rounded-lg font-semibold cursor-pointer"
                >
                  <span className="mr-1">⚙️</span>
                  EQUIP
                </button>
                <button
                  onClick={handleBattle}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold transition-all duration-300 rounded-lg cursor-pointer"
                >
                  <span className="mr-1">⚔️</span>
                  BATTLE
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-cyan-400 rounded-2xl pointer-events-none">
          <div className="absolute -top-2 -right-2 bg-cyan-400 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            ✓
          </div>
        </div>
      )}

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl -z-10"></div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#0E100F] via-[#200052] to-[#0E100F] border border-[#836EF9]/30 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#836EF9]/20">
              <h3 className="gaming-title text-xl">{monanimal.name} #{monanimal.id}</h3>
              <button
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                onClick={() => setShowImageModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Image */}
            <div className="p-6">
              <div className="aspect-square bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl overflow-hidden border border-white/10 mb-4">
                {monanimal.image ? (
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `url(${monanimal.image})`,
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center'
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🐾</div>
                      <p>No image available</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Explorer Link */}
              <div className="text-center">
                <a
                  href={getExplorerUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#836EF9] to-[#A0055D] hover:from-[#A0055D] hover:to-[#836EF9] text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View on Explorer
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MonanimalCard