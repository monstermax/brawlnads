import React from 'react'

import { useWallet } from '../hooks/useWallet'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'


const Forge: React.FC = () => {
    const { isConnected } = useWallet()

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
                                Connect your wallet to access the legendary Forge
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
                        🔨 THE FORGE
                    </h1>
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent flex-1 max-w-xs"></div>
                        <span className="text-orange-400 text-sm font-mono tracking-widest">CRAFT YOUR DESTINY</span>
                        <div className="h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent flex-1 max-w-xs"></div>
                    </div>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Craft powerful weapons and artifacts for your Monanimals in the legendary forge
                    </p>
                </div>

                {/* Coming Soon Section */}
                <div className="max-w-6xl mx-auto">
                    <div className="bg-black/60 backdrop-blur-md border border-orange-500/30 rounded-3xl p-8 mb-8">
                        <div className="text-center mb-8">
                            <div className="text-8xl mb-6">🛠️</div>
                            <h2 className="text-4xl font-bold text-white mb-4 gaming-subtitle">Forge Under Construction</h2>
                            <p className="text-gray-300 text-lg mb-8">
                                The legendary forge is being prepared. Soon you'll be able to craft epic equipment:
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Craft Weapons */}
                            <div className="bg-black/60 backdrop-blur-md border border-red-500/30 rounded-2xl p-6 hover:border-red-400/50 transition-all duration-300 group">
                                <div className="text-center">
                                    <div className="text-5xl mb-4 group-hover:animate-bounce">⚔️</div>
                                    <h3 className="text-xl font-bold text-red-400 mb-3 font-mono">CRAFT WEAPONS</h3>
                                    <p className="text-gray-300 text-sm">
                                        Forge powerful weapons to boost your Monanimals' attack power and dominate battles
                                    </p>
                                </div>
                            </div>

                            {/* Create Artifacts */}
                            <div className="bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-300 group">
                                <div className="text-center">
                                    <div className="text-5xl mb-4 group-hover:animate-bounce">💎</div>
                                    <h3 className="text-xl font-bold text-cyan-400 mb-3 font-mono">CREATE ARTIFACTS</h3>
                                    <p className="text-gray-300 text-sm">
                                        Craft magical artifacts with special abilities and mystical effects for your collection
                                    </p>
                                </div>
                            </div>

                            {/* Upgrade Equipment */}
                            <div className="bg-black/60 backdrop-blur-md border border-green-500/30 rounded-2xl p-6 hover:border-green-400/50 transition-all duration-300 group">
                                <div className="text-center">
                                    <div className="text-5xl mb-4 group-hover:animate-bounce">⚙️</div>
                                    <h3 className="text-xl font-bold text-green-400 mb-3 font-mono">UPGRADE EQUIPMENT</h3>
                                    <p className="text-gray-300 text-sm">
                                        Enhance existing weapons and artifacts to unlock their true potential
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="text-center mb-6">
                            <Badge className="bg-orange-600/20 text-orange-400 border-orange-500/30 text-sm font-bold px-4 py-2">
                                <span className="mr-2">🕐</span>
                                UNDER DEVELOPMENT
                            </Badge>
                        </div>

                        {/* Action Button */}
                        <div className="text-center">
                            <Button
                                disabled
                                className="bg-gray-600/50 text-gray-400 cursor-not-allowed py-4 px-8 rounded-xl text-lg font-bold"
                            >
                                <span className="mr-3">🔨</span>
                                FORGE (COMING SOON)
                            </Button>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-black/60 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-purple-400 mb-3 font-mono">🎯 PLANNED FEATURES</h3>
                            <ul className="text-gray-300 space-y-2 text-sm">
                                <li>• Weapon crafting with rare materials</li>
                                <li>• Artifact creation system</li>
                                <li>• Equipment enhancement mechanics</li>
                                <li>• Special forge events and challenges</li>
                            </ul>
                        </div>

                        <div className="bg-black/60 backdrop-blur-md border border-yellow-500/30 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-yellow-400 mb-3 font-mono">⏰ DEVELOPMENT STATUS</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300 text-sm">Design Phase</span>
                                    <span className="text-green-400 text-sm">✅ Complete</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300 text-sm">Smart Contracts</span>
                                    <span className="text-yellow-400 text-sm">🔄 In Progress</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300 text-sm">Frontend Integration</span>
                                    <span className="text-gray-400 text-sm">⏳ Pending</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Forge