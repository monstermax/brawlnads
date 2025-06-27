import { useState, useEffect } from 'react'
import { useReadContract, useReadContracts } from 'wagmi'
import { CONTRACT_ADDRESSES, MONANIMAL_ABI } from '../config/web3'
import type { Monanimal } from '../types'
import { createFallbackSVG } from '@/utils/svgUtils'

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

  // Préparer les appels pour lire tous les tokenURI
  const allTokenURIContracts = totalSupply ? Array.from({ length: Number(totalSupply) }, (_, i) => ({
    address: CONTRACT_ADDRESSES.MonanimalNFT,
    abi: MONANIMAL_ABI,
    functionName: 'tokenURI',
    args: [BigInt(i)],
  })) : []

  // Lire tous les Monanimals en une seule fois
  const { data: allMonanimalData, error: allMonanimalError } = useReadContracts({
    contracts: allMonanimalContracts,
    query: {
      enabled: !!totalSupply && Number(totalSupply) > 0,
    },
  })

  // Lire tous les tokenURI en une seule fois
  const { data: allTokenURIData, error: allTokenURIError } = useReadContracts({
    contracts: allTokenURIContracts,
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

    if (!allMonanimalData || !allTokenURIData) {
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
          const tokenURIResult = allTokenURIData[index]
          
          // Mapper les classes et raretés
          const classNames = ['Warrior', 'Assassin', 'Mage', 'Berserker', 'Guardian']
          const rarityNames = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic']
          
          // Extraire l'image du tokenURI on-chain (VOS vrais SVG)
          let imageUrl = ''
          if (tokenURIResult?.status === 'success' && tokenURIResult.result) {
            try {
              // Le tokenURI est un data URI JSON contenant les métadonnées
              const tokenURI = String(tokenURIResult.result)
              if (tokenURI.startsWith('data:application/json;base64,')) {
                const jsonData = atob(tokenURI.replace('data:application/json;base64,', ''))
                const metadata = JSON.parse(jsonData)
                imageUrl = metadata.image || ''
                console.log(`🎨 SVG on-chain récupéré pour Monanimal #${tokenId}`)
              }
            } catch (error) {
              console.error(`Erreur lors de l'extraction du SVG pour le token ${tokenId}:`, error)
            }
          }

          // Fallback vers SVG par défaut si pas de SVG on-chain
          if (!imageUrl) {
            console.warn(`⚠️ Pas de SVG on-chain pour le token ${tokenId}, utilisation du fallback`);

            imageUrl = createFallbackSVG(tokenId, data.class)
          }

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
            isKO: Boolean(data.isKO),
            image: imageUrl
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
  }, [totalSupply, allMonanimalData, allTokenURIData])

  return {
    allMonanimals,
    loading,
    totalSupply: totalSupply ? Number(totalSupply) : 0,
  }
}