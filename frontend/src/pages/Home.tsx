import React from 'react'
import { useWallet } from '../hooks/useWallet'
import { useMonanimals } from '../hooks/useMonanimals'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
    const { isConnected, address, connect, disconnect } = useWallet()
    const { monanimals, loading, mint, isMinting, mintPrice } = useMonanimals()

    return (
        <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0E100F 0%, #200052 50%, #0E100F 100%)' }}>
            {/* Monad-themed Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{ backgroundColor: '#836EF9' }}></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-2000" style={{ backgroundColor: '#A0055D' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-8 animate-pulse animation-delay-4000" style={{ backgroundColor: '#200052' }}></div>
            </div>

            {/* Monad Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-3"></div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="text-center py-20">
                    <div className="mb-8">
                        <h1 className="text-6xl md:text-8xl gaming-title mb-4">
                            BRAWLNADS
                        </h1>
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent flex-1 max-w-xs"></div>
                            <span className="text-cyan-400 text-sm font-mono tracking-widest">BUILT ON MONAD</span>
                            <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent flex-1 max-w-xs"></div>
                        </div>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Enter the <span className="text-purple-400 font-semibold">metaverse</span> of epic battles. 
                            Collect rare <span className="text-cyan-400 font-semibold">Monanimals NFTs</span>, 
                            forge legendary weapons, and dominate the arena in this 
                            <span className="text-pink-400 font-semibold"> Web3 gaming revolution</span>.
                        </p>
                    </div>

                    {/* Connection Status */}
                    {!isConnected ? (
                        <div className="space-y-6">
                            <div className="bg-black/30 backdrop-blur-md border border-purple-500/30 rounded-2xl p-8 max-w-md mx-auto">
                                <div className="text-purple-400 text-4xl mb-4">🔗</div>
                                <h3 className="text-2xl font-bold text-white mb-4">Connect to the Metaverse</h3>
                                <p className="text-gray-400 mb-6">Link your wallet to start your legendary journey</p>
                                <Button
                                    onClick={connect}
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                                >
                                    <span className="mr-2">🚀</span>
                                    CONNECT WALLET
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Connected Status */}
                            <div className="bg-black/30 backdrop-blur-md border border-green-500/30 rounded-2xl p-6 max-w-md mx-auto">
                                <div className="flex items-center justify-center gap-3 mb-4">
                                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-green-400 font-mono text-sm">CONNECTED</span>
                                </div>
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-mono">
                                    {address?.slice(0, 8)}...{address?.slice(-6)}
                                </Badge>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Button
                                    onClick={mint}
                                    disabled={isMinting}
                                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isMinting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                                            MINTING...
                                        </>
                                    ) : (
                                        <>
                                            <span className="mr-2">⚡</span>
                                            MINT MONANIMAL ({mintPrice} MON)
                                        </>
                                    )}
                                </Button>
                                <Button
                                    onClick={disconnect}
                                    variant="outline"
                                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 py-4 px-8 rounded-xl text-lg transition-all duration-300"
                                >
                                    <span className="mr-2">🔌</span>
                                    DISCONNECT
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats Dashboard */}
                {isConnected && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <div className="bg-black/60 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/50 transition-all duration-300 group">
                            <div className="text-center">
                                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🐉</div>
                                <h3 className="text-purple-300 font-semibold mb-2 text-enhanced">MONANIMALS</h3>
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
                                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">⚔️</div>
                                <h3 className="text-yellow-300 font-semibold mb-2 text-enhanced">VICTORIES</h3>
                                <div className="text-3xl font-bold text-white text-enhanced">
                                    {loading ? (
                                        <div className="animate-pulse bg-gray-600 h-8 w-16 mx-auto rounded"></div>
                                    ) : (
                                        monanimals.reduce((total, m) => total + m.wins, 0)
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-black/60 backdrop-blur-md border border-green-500/30 rounded-2xl p-6 hover:border-green-400/50 transition-all duration-300 group">
                            <div className="text-center">
                                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🏆</div>
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

                        <div className="bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-300 group">
                            <div className="text-center">
                                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">⭐</div>
                                <h3 className="text-cyan-300 font-semibold mb-2 text-enhanced">MAX LEVEL</h3>
                                <div className="text-3xl font-bold text-white text-enhanced">
                                    {loading ? (
                                        <div className="animate-pulse bg-gray-600 h-8 w-16 mx-auto rounded"></div>
                                    ) : (
                                        monanimals.length > 0 ? Math.max(...monanimals.map(m => m.level)) : 0
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                {isConnected && monanimals.length > 0 && (
                    <div className="bg-black/30 backdrop-blur-md border border-purple-500/30 rounded-3xl p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                                GAME MODES
                            </h2>
                            <p className="text-gray-400">Choose your path to glory</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Link to="/battle" className="group">
                                <div className="bg-gradient-to-br from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-2xl p-6 hover:border-red-400/50 transition-all duration-300 transform hover:scale-105">
                                    <div className="text-center">
                                        <div className="text-5xl mb-4 group-hover:animate-bounce">⚔️</div>
                                        <h3 className="text-xl font-bold text-red-400 mb-2">BATTLE ARENA</h3>
                                        <p className="text-gray-400 text-sm">Fight epic battles and climb the ranks</p>
                                    </div>
                                </div>
                            </Link>

                            <Link to="/forge" className="group">
                                <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-2xl p-6 hover:border-yellow-400/50 transition-all duration-300 transform hover:scale-105">
                                    <div className="text-center">
                                        <div className="text-5xl mb-4 group-hover:animate-bounce">🔨</div>
                                        <h3 className="text-xl font-bold text-yellow-400 mb-2">FORGE</h3>
                                        <p className="text-gray-400 text-sm">Craft legendary weapons and gear</p>
                                    </div>
                                </div>
                            </Link>

                            <Link to="/collection" className="group">
                                <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105">
                                    <div className="text-center">
                                        <div className="text-5xl mb-4 group-hover:animate-bounce">💎</div>
                                        <h3 className="text-xl font-bold text-purple-400 mb-2">COLLECTION</h3>
                                        <p className="text-gray-400 text-sm">Manage your NFT collection</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Call to Action for New Users */}
                {isConnected && monanimals.length === 0 && (
                    <div className="text-center py-12">
                        <div className="bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-3xl p-8 max-w-2xl mx-auto">
                            <div className="text-6xl mb-6">🚀</div>
                            <h2 className="text-3xl font-bold text-white text-enhanced mb-4">Ready to Begin?</h2>
                            <p className="text-gray-400 mb-8 text-lg">
                                Mint your first Monanimal NFT to start your journey in the BrawlNads universe!
                            </p>
                            <Button
                                onClick={mint}
                                disabled={isMinting}
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-4 px-12 rounded-xl text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
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
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home