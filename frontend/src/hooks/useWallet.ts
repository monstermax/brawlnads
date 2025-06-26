import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import type { UseWalletReturn } from '../types'

export function useWallet(): UseWalletReturn & {
  connect: () => void
  disconnect: () => void
  isConnecting: boolean
} {
  const { address, isConnected, isConnecting } = useAccount()
  const { connect: wagmiConnect, isPending: isConnectPending } = useConnect()
  const { disconnect } = useDisconnect()

  const connect = () => {
    console.log('=== connectWallet called ===')
    console.log('wagmiConnect function:', wagmiConnect)
    console.log('injected connector:', injected())
    
    try {
      wagmiConnect({ connector: injected() })
      console.log('✅ connect function called successfully')
    } catch (error) {
      console.error('❌ Error calling connect:', error)
    }
  }

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''

  return {
    address,
    isConnected,
    isConnecting: isConnecting || isConnectPending,
    shortAddress,
    connect,
    disconnect,
  }
}