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
      <div className="bg-gradient-to-br from-[#0E100F] via-[#200052] to-[#0E100F] border border-[#836EF9]/30 rounded-xl p-6">
        <h3 className="gaming-title text-xl mb-4">Chargement des adversaires...</h3>
        <div className="flex items-center justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-[#836EF9]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    )
  }

  if (availableOpponents.length === 0) {
    return (
      <div className="bg-gradient-to-br from-[#0E100F] via-[#200052] to-[#0E100F] border border-[#836EF9]/30 rounded-xl p-6">
        <h3 className="gaming-title text-xl mb-4">Aucun adversaire disponible</h3>
        <p className="text-gray-300">
          Il n'y a actuellement aucun Monanimal disponible pour combattre.
          Essayez de minter plus de Monanimals ou attendez que d'autres joueurs en créent.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-[#0E100F] via-[#200052] to-[#0E100F] border border-[#836EF9]/30 rounded-xl p-6">
      <h3 className="gaming-title text-xl mb-2">Choisir un adversaire</h3>
      <p className="text-gray-300 mb-6">
        {availableOpponents.length} adversaire{availableOpponents.length > 1 ? 's' : ''} disponible{availableOpponents.length > 1 ? 's' : ''}
      </p>
      
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <button
          className="bg-gradient-to-r from-[#836EF9] to-[#A0055D] hover:from-[#A0055D] hover:to-[#836EF9] text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#836EF9]/25"
          onClick={getRandomOpponent}
        >
          🎲 Adversaire aléatoire
        </button>
        
        {selectedOpponent && (
          <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg">
            Adversaire sélectionné: <span className="font-bold text-white">{selectedOpponent.name}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableOpponents.slice(0, 6).map((opponent) => (
          <div
            key={opponent.id}
            className={`bg-black/40 backdrop-blur-md border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              selectedOpponent?.id === opponent.id
                ? 'border-[#836EF9] shadow-lg shadow-[#836EF9]/25'
                : 'border-gray-700/50 hover:border-[#836EF9]/50'
            }`}
            onClick={() => handleSelectOpponent(opponent)}
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={opponent.image}
                alt={opponent.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
            <div className="p-3">
              <h4 className="font-bold text-white mb-2">{opponent.name}</h4>
              <div className="flex justify-between text-sm text-gray-400 mb-3">
                <span>Lvl {opponent.level}</span>
                <span>{opponent.class}</span>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-red-400">❤️ {opponent.health}</div>
                </div>
                <div className="text-center">
                  <div className="text-orange-400">⚔️ {opponent.attack}</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-400">🛡️ {opponent.defense}</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400">💨 {opponent.speed}</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-400">✨ {opponent.magic}</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-400">🍀 {opponent.luck}</div>
                </div>
              </div>
              
              {selectedOpponent?.id === opponent.id && (
                <div className="mt-3">
                  <div className="bg-[#836EF9] text-white text-center py-1 rounded-lg text-sm font-semibold">
                    Sélectionné
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {availableOpponents.length > 6 && (
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Et {availableOpponents.length - 6} autre{availableOpponents.length - 6 > 1 ? 's' : ''} adversaire{availableOpponents.length - 6 > 1 ? 's' : ''}...
          </p>
        </div>
      )}
    </div>
  )
}