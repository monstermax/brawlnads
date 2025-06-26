import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { CONTRACT_ADDRESSES, MONANIMAL_ABI } from '../config/web3'
import type { Monanimal } from '../types'

export function useBlockchainMonanimals() {
  const { address } = useAccount()
  const [monanimals, setMonanimals] = useState<Monanimal[]>([])
  const [loading, setLoading] = useState(false)

  // Lire les Monanimals du joueur
  const { data: tokenIds, refetch: refetchTokenIds } = useReadContract({
    address: CONTRACT_ADDRESSES.MonanimalNFT,
    abi: MONANIMAL_ABI,
    functionName: 'getOwnerMonanimals',
    args: [address!],
    query: {
      enabled: !!address,
    },
  })

  // Lire les détails de tous les Monanimals en une seule fois
  const monanimalContracts = tokenIds?.map(tokenId => ({
    address: CONTRACT_ADDRESSES.MonanimalNFT,
    abi: MONANIMAL_ABI,
    functionName: 'getMonanimal',
    args: [tokenId],
  })) || []

  const { data: monanimalData, refetch: refetchMonanimals } = useReadContracts({
    contracts: monanimalContracts,
    query: {
      enabled: !!tokenIds && tokenIds.length > 0,
    },
  })

  // Transformer les données blockchain en objets Monanimal
  useEffect(() => {
    if (!tokenIds || !monanimalData || tokenIds.length !== monanimalData.length) {
      setMonanimals([])
      setLoading(false)
      return
    }

    console.log(`🔗 Processing ${tokenIds.length} Monanimals from blockchain...`)
    setLoading(true)

    try {
      const processedMonanimals: Monanimal[] = tokenIds.map((tokenId, index) => {
        const data = monanimalData[index]
        
        if (data.status !== 'success' || !data.result) {
          console.error(`Failed to load Monanimal #${tokenId}`)
          return null
        }

        const monanimalInfo = data.result as any
        const seed = Number(tokenId)

        return {
          id: Number(tokenId),
          name: `${monanimalInfo.rarity} ${monanimalInfo.class} #${tokenId}`,
          class: monanimalInfo.class,
          rarity: monanimalInfo.rarity,
          level: Number(monanimalInfo.level),
          health: Number(monanimalInfo.health),
          attack: Number(monanimalInfo.attack),
          defense: Number(monanimalInfo.defense),
          speed: Number(monanimalInfo.speed),
          magic: Number(monanimalInfo.magic),
          luck: Number(monanimalInfo.luck),
          wins: Number(monanimalInfo.wins),
          losses: Number(monanimalInfo.losses),
          isKO: Boolean(monanimalInfo.isKO),
          image: `data:image/svg+xml;base64,${btoa(`
            <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="bg${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#836EF9;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#200052;stop-opacity:1" />
                </linearGradient>
              </defs>
              <rect width="200" height="200" fill="url(#bg${seed})"/>
              <circle cx="100" cy="80" r="30" fill="#FFFFFF" opacity="0.9"/>
              <circle cx="85" cy="75" r="8" fill="#000"/>
              <circle cx="115" cy="75" r="8" fill="#000"/>
              <circle cx="87" cy="73" r="2" fill="#FFF"/>
              <circle cx="117" cy="73" r="2" fill="#FFF"/>
              <ellipse cx="100" cy="120" rx="40" ry="30" fill="#A0055D" opacity="0.8"/>
              <text x="100" y="160" text-anchor="middle" fill="white" font-size="12">${monanimalInfo.class}</text>
              <text x="100" y="175" text-anchor="middle" fill="#836EF9" font-size="10">#${tokenId}</text>
            </svg>
          `)}`
        } as Monanimal
      }).filter((m): m is Monanimal => m !== null)

      console.log(`✅ Processed ${processedMonanimals.length} Monanimals from blockchain`)
      setMonanimals(processedMonanimals)
    } catch (error) {
      console.error('Error processing blockchain Monanimals:', error)
      setMonanimals([])
    }

    setLoading(false)
  }, [tokenIds, monanimalData])

  const refetch = () => {
    console.log('🔄 Refetching blockchain Monanimals...')
    refetchTokenIds()
    refetchMonanimals()
  }

  return {
    monanimals,
    loading,
    refetch,
  }
}