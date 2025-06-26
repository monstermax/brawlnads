import { useState, useEffect } from 'react'
import { useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Sword, Shield, Zap, Heart, Star, Trophy, Coins, Gamepad2, Sparkles, Crown, Wallet, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWalletConnection, useMonanimals, useWeapons, useArtifacts, useBattles, useGameStats } from './hooks/useWeb3.js'
import './App.css'

// Couleurs Monad
const monadColors = {
  purple: '#836EF9',
  blue: '#200052',
  berry: '#A0055D',
  offWhite: '#FBFAF9',
  black: '#0E100F'
}

// Données de démonstration (fallback si pas connecté)
const demoMonanimals = [
  {
    id: 1,
    name: "Legendary Mage #1",
    class: "Mage",
    rarity: "Legendary",
    level: 5,
    health: 140,
    attack: 90,
    defense: 90,
    speed: 92,
    magic: 140,
    luck: 91,
    wins: 12,
    losses: 3,
    isKO: false,
    image: "/src/assets/monanimal_mage_concept.png"
  },
  {
    id: 2,
    name: "Epic Warrior #2",
    class: "Warrior",
    rarity: "Epic",
    level: 3,
    health: 180,
    attack: 120,
    defense: 110,
    speed: 85,
    magic: 70,
    luck: 88,
    wins: 8,
    losses: 2,
    isKO: false,
    image: "/src/assets/monanimal_warrior_concept.png"
  },
  {
    id: 3,
    name: "Rare Assassin #3",
    class: "Assassin",
    rarity: "Rare",
    level: 4,
    health: 120,
    attack: 110,
    defense: 80,
    speed: 140,
    magic: 85,
    luck: 115,
    wins: 15,
    losses: 5,
    isKO: false,
    image: "/src/assets/monanimal_assassin_concept.png"
  }
]

function App() {
  const [activeTab, setActiveTab] = useState('collection')
  const [selectedMonanimal, setSelectedMonanimal] = useState(null)
  const [testMode, setTestMode] = useState(false) // Mode de test pour simuler une connexion
  const [selectedFighter1, setSelectedFighter1] = useState(null)
  const [selectedFighter2, setSelectedFighter2] = useState(null)

  // Hooks Web3
  const { address, isConnected, shortAddress } = useWalletConnection()
  const { connect, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()
  const { monanimals, loading: loadingMonanimals, mint, isMinting, mintPrice } = useMonanimals()
  const { weapons, forge, isForging, forgePrice } = useWeapons()
  const { artifacts, craft, isCrafting, craftPrice } = useArtifacts()
  const { battleInProgress, battleResult, startDuel, clearResult, duelFee, playerBattles } = useBattles()
  const gameStats = useGameStats()

  // Utiliser les données réelles si connecté, sinon les données de démo
  const displayMonanimals = isConnected ? monanimals : demoMonanimals
  const displayWeapons = isConnected ? weapons : [
    {
      id: 1,
      name: "Monad Crystal Staff",
      type: "Staff",
      rarity: "Mythic",
      attackBonus: 45,
      magicBonus: 60,
      durability: 95,
      maxDurability: 100
    },
    {
      id: 2,
      name: "Epic Iron Sword",
      type: "Sword",
      rarity: "Epic",
      attackBonus: 35,
      defenseBonus: 15,
      durability: 80,
      maxDurability: 100
    }
  ]

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Mythic': return 'from-yellow-400 to-orange-500'
      case 'Legendary': return 'from-purple-400 to-pink-500'
      case 'Epic': return 'from-purple-500 to-blue-500'
      case 'Rare': return 'from-blue-400 to-cyan-400'
      case 'Uncommon': return 'from-green-400 to-emerald-400'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  const connectWallet = () => {
    console.log('=== connectWallet called ===')
    console.log('connect function:', connect)
    console.log('injected connector:', injected())
    
    try {
      connect({ connector: injected() })
      console.log('✅ connect function called successfully')
    } catch (error) {
      console.error('❌ Error calling connect:', error)
    }
  }

  const handleMint = () => {
    if (isConnected) {
      mint()
    } else {
      connectWallet()
    }
  }

  const handleStartBattle = () => {
    console.log('=== handleStartBattle called ===')
    console.log('selectedFighter1:', selectedFighter1)
    console.log('selectedFighter2:', selectedFighter2)
    console.log('displayMonanimals:', displayMonanimals)
    console.log('isConnected:', isConnected)
    console.log('testMode:', testMode)
    
    // Utiliser les fighters sélectionnés si disponibles
    if (selectedFighter1 && selectedFighter2) {
      console.log('✅ Starting duel with selected fighters')
      console.log('Fighter 1 ID:', selectedFighter1.id, 'Name:', selectedFighter1.name)
      console.log('Fighter 2 ID:', selectedFighter2.id, 'Name:', selectedFighter2.name)
      startDuel(selectedFighter1.id, selectedFighter2.id, testMode || !isConnected)
      return
    }
    
    // Fallback: utiliser les premiers Monanimals disponibles
    if (displayMonanimals.length >= 2) {
      console.log('✅ Starting duel with first 2 available Monanimals')
      console.log('Fighter 1 ID:', displayMonanimals[0].id)
      console.log('Fighter 2 ID:', displayMonanimals[1].id)
      startDuel(displayMonanimals[0].id, displayMonanimals[1].id, testMode || !isConnected)
    } else if (displayMonanimals.length === 1) {
      console.log('✅ Testing duel with same Monanimal')
      startDuel(displayMonanimals[0].id, displayMonanimals[0].id, testMode || !isConnected)
    } else if (!isConnected || testMode) {
      console.log('✅ Using demo data for battle')
      startDuel(demoMonanimals[0].id, demoMonanimals[1].id, true)
    } else {
      console.log('❌ No Monanimals available for battle')
    }
  }

  // Effacer le résultat de bataille après 5 secondes
  useEffect(() => {
    if (battleResult) {
      const timer = setTimeout(() => {
        clearResult()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [battleResult, clearResult])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">BrawlNads</h1>
              <p className="text-sm text-purple-300">Monad NFT Battle Royale</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-purple-400 text-purple-300">
              Monad Testnet
            </Badge>
            {isConnected ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-sm">{shortAddress}</span>
                <Button 
                  onClick={() => disconnect()}
                  variant="outline"
                  size="sm"
                  className="border-purple-500 text-purple-300 hover:bg-purple-500/20"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button 
                onClick={connectWallet}
                disabled={isConnecting}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Wallet className="w-4 h-4 mr-2" />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!isConnected && !testMode ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="max-w-2xl mx-auto">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center"
              >
                <Crown className="w-16 h-16 text-white" />
              </motion.div>
              
              <h2 className="text-4xl font-bold text-white mb-4">
                Welcome to BrawlNads
              </h2>
              <p className="text-xl text-purple-200 mb-8">
                The ultimate NFT battle royale on Monad blockchain. Mint unique Monanimals, forge powerful weapons, and dominate the arena!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-black/40 border-purple-500/30">
                  <CardHeader className="text-center">
                    <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <CardTitle className="text-white">Mint Monanimals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-200 text-sm">
                      Create unique NFT creatures with randomized stats and Monad-inspired designs
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/40 border-purple-500/30">
                  <CardHeader className="text-center">
                    <Sword className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <CardTitle className="text-white">Forge Weapons</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-200 text-sm">
                      Craft powerful weapons and artifacts to enhance your fighters' abilities
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/40 border-purple-500/30">
                  <CardHeader className="text-center">
                    <Trophy className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <CardTitle className="text-white">Battle & Win</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-200 text-sm">
                      Engage in automated battles and climb the leaderboards for glory and rewards
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-black/40 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Game Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-400">{gameStats.totalMonanimals}</div>
                    <div className="text-purple-200 text-sm">Monanimals</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">{gameStats.totalBattles}</div>
                    <div className="text-purple-200 text-sm">Battles</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">{gameStats.totalPlayers}</div>
                    <div className="text-purple-200 text-sm">Players</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-400">{gameStats.topFighter}</div>
                    <div className="text-purple-200 text-sm">Top Fighter</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-3"
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </Button>
                
                <Button
                  onClick={() => setTestMode(true)}
                  size="lg"
                  variant="outline"
                  className="border-purple-500 text-purple-300 hover:bg-purple-500/20 text-lg px-8 py-3"
                >
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Test Mode (Demo)
                </Button>
              </div>
              
              <p className="text-purple-300 text-sm mt-4">
                Connect your wallet for real blockchain interactions, or use Test Mode to explore the interface
              </p>
            </div>
          </motion.div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-black/40 border border-purple-500/30">
              <TabsTrigger value="collection" className="data-[state=active]:bg-purple-600">
                Collection
              </TabsTrigger>
              <TabsTrigger value="battle" className="data-[state=active]:bg-purple-600">
                Battle Arena
              </TabsTrigger>
              <TabsTrigger value="forge" className="data-[state=active]:bg-purple-600">
                Forge
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="data-[state=active]:bg-purple-600">
                Leaderboard
              </TabsTrigger>
            </TabsList>

            <TabsContent value="collection" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">My Monanimals</h2>
                <Button 
                  onClick={handleMint}
                  disabled={isMinting}
                  className="bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isMinting ? 'Minting...' : `Mint New Monanimal (${mintPrice} MON)`}
                </Button>
              </div>
              
              {loadingMonanimals ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 mx-auto border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-purple-300 mt-4">Loading your Monanimals...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayMonanimals.map((monanimal) => (
                    <motion.div
                      key={monanimal.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card className="bg-black/40 border-purple-500/30 overflow-hidden cursor-pointer hover:border-purple-400/50 transition-colors">
                        <div className={`h-2 bg-gradient-to-r ${getRarityColor(monanimal.rarity)}`}></div>
                        
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-white text-lg">{monanimal.name}</CardTitle>
                              <CardDescription className="text-purple-300">
                                Level {monanimal.level} {monanimal.class}
                              </CardDescription>
                            </div>
                            <Badge className={`bg-gradient-to-r ${getRarityColor(monanimal.rarity)} text-white border-0`}>
                              {monanimal.rarity}
                            </Badge>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div className="aspect-square bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-lg flex items-center justify-center overflow-hidden">
                            {monanimal.image ? (
                              <img 
                                src={monanimal.image} 
                                alt={monanimal.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-purple-300 text-center">
                                <Sparkles className="w-12 h-12 mx-auto mb-2" />
                                <p className="text-sm">NFT Image</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4 text-red-400" />
                              <span className="text-white">{monanimal.health}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Sword className="w-4 h-4 text-orange-400" />
                              <span className="text-white">{monanimal.attack}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Shield className="w-4 h-4 text-blue-400" />
                              <span className="text-white">{monanimal.defense}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Zap className="w-4 h-4 text-yellow-400" />
                              <span className="text-white">{monanimal.speed}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-green-400">Wins: {monanimal.wins}</span>
                            <span className="text-red-400">Losses: {monanimal.losses}</span>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="flex-1 border-purple-500 text-purple-300 hover:bg-purple-500/20">
                              Equip
                            </Button>
                            <Button 
                              size="sm" 
                              className="flex-1 bg-purple-600 hover:bg-purple-700"
                              onClick={() => setSelectedMonanimal(monanimal)}
                            >
                              Battle
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="battle" className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Battle Arena</h2>
                <p className="text-purple-200 mb-8">Choose your fighters and enter the arena!</p>
                
                <AnimatePresence>
                  {battleInProgress && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="bg-black/60 rounded-lg p-8 mb-8"
                    >
                      <div className="text-white text-xl mb-4">Battle in Progress...</div>
                      <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-purple-300">Your Monanimal is fighting for glory!</p>
                    </motion.div>
                  )}
                  
                  {battleResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`bg-black/60 rounded-lg p-8 mb-8 border-2 ${
                        battleResult.won ? 'border-green-500' : 'border-red-500'
                      }`}
                    >
                      <div className={`text-2xl font-bold mb-4 ${
                        battleResult.won ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {battleResult.message}
                      </div>
                      <p className="text-white">Experience gained: +{battleResult.experience}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Fighter Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <Card className="bg-black/40 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-white">Fighter 1</CardTitle>
                      <CardDescription className="text-purple-300">
                        Select your first fighter
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedFighter1 ? (
                        <div className="text-center">
                          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-lg flex items-center justify-center overflow-hidden">
                            {selectedFighter1.image ? (
                              <img
                                src={selectedFighter1.image}
                                alt={selectedFighter1.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Sparkles className="w-8 h-8 text-purple-300" />
                            )}
                          </div>
                          <p className="text-white font-medium">{selectedFighter1.name}</p>
                          <p className="text-purple-300 text-sm">{selectedFighter1.class}</p>
                          <Button
                            onClick={() => setSelectedFighter1(null)}
                            variant="outline"
                            size="sm"
                            className="mt-2 border-purple-500 text-purple-300"
                          >
                            Change Fighter
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="w-20 h-20 mx-auto mb-4 bg-purple-900/20 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-500">
                            <Sword className="w-8 h-8 text-purple-400" />
                          </div>
                          <p className="text-purple-300 mb-4">No fighter selected</p>
                          <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                            {displayMonanimals.map((monanimal) => (
                              <Button
                                key={monanimal.id}
                                onClick={() => setSelectedFighter1(monanimal)}
                                variant="outline"
                                size="sm"
                                className="border-purple-500 text-purple-300 hover:bg-purple-500/20"
                                disabled={selectedFighter2?.id === monanimal.id}
                              >
                                {monanimal.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/40 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-white">Fighter 2</CardTitle>
                      <CardDescription className="text-purple-300">
                        Select your second fighter
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedFighter2 ? (
                        <div className="text-center">
                          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-lg flex items-center justify-center overflow-hidden">
                            {selectedFighter2.image ? (
                              <img
                                src={selectedFighter2.image}
                                alt={selectedFighter2.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Sparkles className="w-8 h-8 text-purple-300" />
                            )}
                          </div>
                          <p className="text-white font-medium">{selectedFighter2.name}</p>
                          <p className="text-purple-300 text-sm">{selectedFighter2.class}</p>
                          <Button
                            onClick={() => setSelectedFighter2(null)}
                            variant="outline"
                            size="sm"
                            className="mt-2 border-purple-500 text-purple-300"
                          >
                            Change Fighter
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="w-20 h-20 mx-auto mb-4 bg-purple-900/20 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-500">
                            <Shield className="w-8 h-8 text-purple-400" />
                          </div>
                          <p className="text-purple-300 mb-4">No fighter selected</p>
                          <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                            {displayMonanimals.map((monanimal) => (
                              <Button
                                key={monanimal.id}
                                onClick={() => setSelectedFighter2(monanimal)}
                                variant="outline"
                                size="sm"
                                className="border-purple-500 text-purple-300 hover:bg-purple-500/20"
                                disabled={selectedFighter1?.id === monanimal.id}
                              >
                                {monanimal.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                {/* Battle Button */}
                <Card className="bg-black/40 border-purple-500/30 max-w-md mx-auto">
                  <CardHeader>
                    <CardTitle className="text-white text-center">Quick Duel</CardTitle>
                    <CardDescription className="text-purple-300 text-center">
                      1v1 battle between selected fighters
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={handleStartBattle}
                      disabled={battleInProgress || (!selectedFighter1 && !selectedFighter2 && displayMonanimals.length === 0)}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      {battleInProgress ? 'Battle in Progress...' : `Start Duel (${duelFee} MON)`}
                    </Button>
                    {selectedFighter1 && selectedFighter2 && (
                      <p className="text-sm text-green-400 mt-2 text-center">
                        Ready to battle: {selectedFighter1.name} vs {selectedFighter2.name}
                      </p>
                    )}
                    {!selectedFighter1 && !selectedFighter2 && displayMonanimals.length > 0 && (
                      <p className="text-sm text-purple-300 mt-2 text-center">
                        Select fighters above or use auto-selection
                      </p>
                    )}
                    {displayMonanimals.length === 0 && (
                      <p className="text-sm text-purple-300 mt-2 text-center">
                        {isConnected ? 'You need Monanimals to battle' : 'Demo mode: Using sample Monanimals'}
                      </p>
                    )}
                  </CardContent>
                </Card>
                
                {/* Historique des batailles */}
                {playerBattles && playerBattles.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-white mb-4">Battle History</h3>
                    <Card className="bg-black/40 border-purple-500/30">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          {playerBattles.slice(-5).reverse().map((battleId, index) => (
                            <div key={battleId} className="flex items-center justify-between p-3 rounded-lg bg-purple-900/20">
                              <div className="text-white">
                                <span className="font-medium">Battle #{Number(battleId)}</span>
                              </div>
                              <div className="text-purple-300 text-sm">
                                On-chain battle
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="forge" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Forge & Craft</h2>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => forge()}
                    disabled={isForging}
                    className="bg-gradient-to-r from-orange-500 to-red-500"
                  >
                    <Sword className="w-4 h-4 mr-2" />
                    {isForging ? 'Forging...' : `Forge Weapon (${forgePrice} MON)`}
                  </Button>
                  <Button
                    onClick={() => craft()}
                    disabled={isCrafting}
                    className="bg-gradient-to-r from-blue-500 to-purple-500"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isCrafting ? 'Crafting...' : `Craft Artifact (${craftPrice} MON)`}
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayWeapons.map((weapon) => (
                  <Card key={weapon.id} className="bg-black/40 border-purple-500/30">
                    <div className={`h-2 bg-gradient-to-r ${getRarityColor(weapon.rarity)}`}></div>
                    
                    <CardHeader>
                      <CardTitle className="text-white text-lg">{weapon.name}</CardTitle>
                      <CardDescription className="text-purple-300">
                        {weapon.type} • {weapon.rarity}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-purple-300">Attack Bonus</span>
                          <span className="text-white">+{weapon.attackBonus}</span>
                        </div>
                        {weapon.magicBonus && (
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-300">Magic Bonus</span>
                            <span className="text-white">+{weapon.magicBonus}</span>
                          </div>
                        )}
                        {weapon.defenseBonus && (
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-300">Defense Bonus</span>
                            <span className="text-white">+{weapon.defenseBonus}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-purple-300">Durability</span>
                          <span className="text-white">{weapon.durability}/{weapon.maxDurability}</span>
                        </div>
                        <Progress 
                          value={(weapon.durability / weapon.maxDurability) * 100} 
                          className="h-2"
                        />
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1 border-purple-500 text-purple-300">
                          Repair
                        </Button>
                        <Button size="sm" className="flex-1 bg-purple-600">
                          Equip
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
              
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Top Fighters</CardTitle>
                  <CardDescription className="text-purple-300">
                    Most successful Monanimals in the arena
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {displayMonanimals
                      .sort((a, b) => b.wins - a.wins)
                      .map((monanimal, index) => (
                        <div key={monanimal.id} className="flex items-center space-x-4 p-3 rounded-lg bg-purple-900/20">
                          <div className="text-2xl font-bold text-purple-400">
                            #{index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium">{monanimal.name}</div>
                            <div className="text-purple-300 text-sm">
                              {monanimal.wins} wins • {monanimal.losses} losses
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-bold">
                              {Math.round((monanimal.wins / (monanimal.wins + monanimal.losses || 1)) * 100)}%
                            </div>
                            <div className="text-purple-300 text-sm">Win Rate</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}

export default App

