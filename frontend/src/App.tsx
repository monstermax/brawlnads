import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { config } from './config/web3'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Collection from './pages/Collection'
import BattleArena from './pages/BattleArena'
import Leaderboard from './pages/Leaderboard'
import Forge from './pages/Forge'

import './styles/App.css'
import './styles/gaming.css'


const queryClient = new QueryClient()


const App: React.FC = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="App min-h-screen monad-bg">
            <Navbar />
            <main className="relative">
              {/* Monad Background Effects */}
              <div className="fixed inset-0 bg-grid-pattern opacity-3 pointer-events-none"></div>
              <div className="fixed inset-0 scan-lines pointer-events-none"></div>

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/collection" element={<Collection />} />
                <Route path="/battle" element={<BattleArena />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/forge" element={<Forge />} />
              </Routes>
            </main>
          </div>
        </Router>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
