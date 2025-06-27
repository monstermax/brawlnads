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
    console.log('Selected monanimal:', monanimal)
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0E100F 0%, #200052 50%, #0E100F 100%)' }}>
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
                Connect your wallet to access your legendary Monanimal collection
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
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0E100F 0%, #200052 50%, #0E100F 100%)' }}>
      {/* Monad Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{ backgroundColor: '#836EF9' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-2000" style={{ backgroundColor: '#A0055D' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-8 animate-pulse animation-delay-4000" style={{ backgroundColor: '#200052' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 font-mono tracking-wide">
              💎 MY COLLECTION
            </h1>
            <div className="flex items-center gap-2">
              <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent flex-1 max-w-xs"></div>
              <span className="text-cyan-300 text-sm font-mono tracking-widest">
                {loading ? 'LOADING...' : `${filteredMonanimals.length} OF ${monanimals.length} MONANIMALS`}
              </span>
              <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent flex-1 max-w-xs"></div>
            </div>
          </div>
          
          <Button
            onClick={mint}
            disabled={isMinting}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/25"
          >
            {isMinting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                MINTING...
              </>
            ) : (
              <>
                <span className="mr-2">⚡</span>
                MINT NEW ({mintPrice} ETH)
              </>
            )}
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-black/60 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-purple-400 font-semibold mb-2 text-sm">🎭 RARITY</label>
              <select
                className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none transition-colors"
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
              >
                {rarities.map(rarity => (
                  <option key={rarity} value={rarity} className="bg-black">
                    {rarity}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-cyan-400 font-semibold mb-2 text-sm">⚔️ CLASS</label>
              <select
                className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                {classes.map(cls => (
                  <option key={cls} value={cls} className="bg-black">
                    {cls}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-yellow-400 font-semibold mb-2 text-sm">📊 SORT BY</label>
              <select
                className="w-full bg-black/50 border border-yellow-500/30 rounded-lg px-3 py-2 text-white focus:border-yellow-400 focus:outline-none transition-colors"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="level" className="bg-black">Level</option>
                <option value="attack" className="bg-black">Attack</option>
                <option value="defense" className="bg-black">Defense</option>
                <option value="speed" className="bg-black">Speed</option>
                <option value="wins" className="bg-black">Wins</option>
                <option value="name" className="bg-black">Name</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSelectedRarity('All')
                  setSelectedClass('All')
                  setSortBy('level')
                }}
                variant="outline"
                className="w-full border-gray-500/50 text-gray-300 hover:bg-gray-500/10 hover:border-gray-400 transition-all duration-300"
              >
                <span className="mr-2">🔄</span>
                RESET
              </Button>
            </div>
          </div>
        </div>

        {/* Collection Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="cyber-spinner mx-auto mb-6"></div>
            <h3 className="text-2xl font-bold text-white mb-2">Loading Collection...</h3>
            <p className="text-gray-300">Scanning the blockchain for your Monanimals</p>
          </div>
        ) : filteredMonanimals.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-black/60 backdrop-blur-md border border-purple-500/30 rounded-3xl p-12 max-w-2xl mx-auto">
              {monanimals.length === 0 ? (
                <>
                  <div className="text-8xl mb-8">🐉</div>
                  <h2 className="text-4xl font-bold text-white mb-4 font-mono tracking-wide">Empty Collection</h2>
                  <p className="text-gray-300 mb-8 text-lg">
                    Your legendary journey begins with your first Monanimal. 
                    Mint one now and start building your epic collection!
                  </p>
                  <Button
                    onClick={mint}
                    disabled={isMinting}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                  >
                    {isMinting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        MINTING YOUR FIRST MONANIMAL...
                      </>
                    ) : (
                      <>
                        <span className="mr-3">⚡</span>
                        MINT YOUR FIRST MONANIMAL
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-8xl mb-8">🔍</div>
                  <h2 className="text-4xl font-bold text-white mb-4 font-mono tracking-wide">No Matches Found</h2>
                  <p className="text-gray-300 mb-8 text-lg">
                    Try adjusting your filters to discover more Monanimals in your collection
                  </p>
                  <Button
                    onClick={() => {
                      setSelectedRarity('All')
                      setSelectedClass('All')
                      setSortBy('level')
                    }}
                    className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="mr-2">🔄</span>
                    RESET FILTERS
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Collection Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-black/60 backdrop-blur-md border border-purple-500/30 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">🐉</div>
                <div className="text-2xl font-bold text-purple-400">{filteredMonanimals.length}</div>
                <div className="text-xs text-gray-300">SHOWING</div>
              </div>
              <div className="bg-black/60 backdrop-blur-md border border-yellow-500/30 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">⭐</div>
                <div className="text-2xl font-bold text-yellow-400">
                  {filteredMonanimals.length > 0 ? Math.max(...filteredMonanimals.map(m => m.level)) : 0}
                </div>
                <div className="text-xs text-gray-300">MAX LVL</div>
              </div>
              <div className="bg-black/60 backdrop-blur-md border border-green-500/30 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">🏆</div>
                <div className="text-2xl font-bold text-green-400">
                  {filteredMonanimals.reduce((total, m) => total + m.wins, 0)}
                </div>
                <div className="text-xs text-gray-300">WINS</div>
              </div>
              <div className="bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">💎</div>
                <div className="text-2xl font-bold text-cyan-400">
                  {new Set(filteredMonanimals.map(m => m.rarity)).size}
                </div>
                <div className="text-xs text-gray-300">RARITIES</div>
              </div>
            </div>

            {/* Monanimals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMonanimals.map((monanimal) => (
                <div key={monanimal.id} className="gaming-card">
                  <MonanimalCard
                    monanimal={monanimal}
                    onSelect={handleMonanimalSelect}
                    showActions={true}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Collection