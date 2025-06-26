import { useState, useEffect } from 'react'
import { useReadContract, useReadContracts } from 'wagmi'
import { CONTRACT_ADDRESSES, MONANIMAL_ABI } from '../config/web3'
import type { Monanimal } from '../types'

export function useAllMonanimals() {
  const [allMonanimals, setAllMonanimals] = useState<Monanimal[]>([])
  const [loading, setLoading] = useState(false)

  // Lire le nombre total de tokens mintés
  const { data: totalSupply } = useReadContract({
    address: CONTRACT_ADDRESSES.MonanimalNFT,
    abi: MONANIMAL_ABI,
    functionName: 'totalSupply',
  })

  // Préparer les appels pour lire tous les Monanimals
  const allMonanimalContracts = totalSupply ? Array.from({ length: Number(totalSupply) }, (_, i) => ({
    address: CONTRACT_ADDRESSES.MonanimalNFT,
    abi: MONANIMAL_ABI,
    functionName: 'getMonanimal',
    args: [BigInt(i)],
  })) : []

  // Lire tous les Monanimals en une seule fois
  const { data: allMonanimalData, error: allMonanimalError } = useReadContracts({
    contracts: allMonanimalContracts,
    query: {
      enabled: !!totalSupply && Number(totalSupply) > 0,
    },
  })

  // Traiter les données de tous les Monanimals
  useEffect(() => {
    if (!totalSupply || Number(totalSupply) === 0) {
      console.log('No Monanimals minted yet')
      setAllMonanimals([])
      setLoading(false)
      return
    }

    if (!allMonanimalData) {
      setLoading(true)
      return
    }

    setLoading(true)

    try {
      console.log(`📦 Processing ${allMonanimalData.length} total Monanimals from blockchain...`)
      
      const processedMonanimals: Monanimal[] = []
      
      allMonanimalData.forEach((result, index) => {
        if (result.status === 'success' && result.result) {
          const tokenId = index
          const data = result.result as any
          
          // Mapper les classes et raretés
          const classNames = ['Warrior', 'Assassin', 'Mage', 'Berserker', 'Guardian']
          const rarityNames = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic']
          
          const monanimal: Monanimal = {
            id: tokenId,
            name: data.name,
            class: classNames[data.class] || 'Unknown',
            rarity: rarityNames[data.rarity] || 'Unknown',
            level: Number(data.level),
            health: Number(data.stats.health),
            attack: Number(data.stats.attack),
            defense: Number(data.stats.defense),
            speed: Number(data.stats.speed),
            magic: Number(data.stats.magic),
            luck: Number(data.stats.luck),
            wins: Number(data.wins),
            losses: Number(data.losses),
            isKO: Boolean(data.isKO), // Lire le vrai statut KO depuis le contrat !
            image: `data:image/svg+xml;base64,${btoa(`
              <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="bg${tokenId}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#836EF9;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#200052;stop-opacity:1" />
                  </linearGradient>
                </defs>
                <rect width="200" height="200" fill="url(#bg${tokenId})"/>
                <circle cx="100" cy="80" r="30" fill="#FFFFFF" opacity="0.9"/>
                <circle cx="85" cy="75" r="8" fill="#000"/>
                <circle cx="115" cy="75" r="8" fill="#000"/>
                <circle cx="87" cy="73" r="2" fill="#FFF"/>
                <circle cx="117" cy="73" r="2" fill="#FFF"/>
                <ellipse cx="100" cy="120" rx="40" ry="30" fill="#A0055D" opacity="0.8"/>
                <text x="100" y="160" text-anchor="middle" fill="white" font-size="12">${classNames[data.class]}</text>
                <text x="100" y="175" text-anchor="middle" fill="#836EF9" font-size="10">#${tokenId}</text>
              </svg>
            `)}`
          }
          
          processedMonanimals.push(monanimal)
        } else {
          console.error(`Error loading monanimal ${index}:`, result.error)
        }
      })
      
      console.log(`✅ Processed ${processedMonanimals.length} total Monanimals`)
      setAllMonanimals(processedMonanimals)
    } catch (error) {
      console.error('Error processing all monanimals:', error)
      setAllMonanimals([])
    }
    
    setLoading(false)
  }, [totalSupply, allMonanimalData])

  return {
    allMonanimals,
    loading,
    totalSupply: totalSupply ? Number(totalSupply) : 0,
  }
}