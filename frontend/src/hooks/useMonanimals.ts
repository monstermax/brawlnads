import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useReadContracts } from 'wagmi'
import { formatEther } from 'viem'

import { CONTRACT_ADDRESSES, MONANIMAL_ABI } from '../config/web3'

import type { Monanimal, UseMonanimalsReturn } from '../types'
import { createFallbackSVG } from '@/utils/svgUtils'


export function useMonanimals(): UseMonanimalsReturn {
    const { address } = useAccount()
    const [monanimals, setMonanimals] = useState<Monanimal[]>([])
    const [loading, setLoading] = useState(false)

    // Lire les Monanimals du joueur
    const { data: tokenIds, error: tokenIdsError, refetch: refetchTokenIds } = useReadContract({
        address: CONTRACT_ADDRESSES.MonanimalNFT,
        abi: MONANIMAL_ABI,
        functionName: 'getOwnerMonanimals',
        args: [address!],
        query: {
            enabled: !!address,
        },
    })

    // Lire le prix de mint
    const { data: mintPrice } = useReadContract({
        address: CONTRACT_ADDRESSES.MonanimalNFT,
        abi: MONANIMAL_ABI,
        functionName: 'mintPrice',
    })

    // Lire le prix de soins
    const { data: healingPrice } = useReadContract({
        address: CONTRACT_ADDRESSES.MonanimalNFT,
        abi: MONANIMAL_ABI,
        functionName: 'healingPrice',
    })

    // Hook pour mint
    const { writeContract: mintMonanimal, data: mintHash, isPending: isMinting } = useWriteContract()

    // Hook pour heal
    const { writeContract: healMonanimalContract, data: healHash, isPending: isHealing } = useWriteContract()

    // Attendre la confirmation de mint
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: mintHash,
    })

    // Attendre la confirmation de heal
    const { isLoading: isHealConfirming, isSuccess: isHealConfirmed } = useWaitForTransactionReceipt({
        hash: healHash,
    })

    // Préparer les appels pour lire les détails de chaque Monanimal
    const monanimalContracts = tokenIds?.map((tokenId) => ({
        address: CONTRACT_ADDRESSES.MonanimalNFT,
        abi: MONANIMAL_ABI,
        functionName: 'getMonanimal',
        args: [tokenId],
    })) || []

    // Préparer les appels pour lire les tokenURI de chaque Monanimal
    const tokenURIContracts = tokenIds?.map((tokenId) => ({
        address: CONTRACT_ADDRESSES.MonanimalNFT,
        abi: MONANIMAL_ABI,
        functionName: 'tokenURI',
        args: [tokenId],
    })) || []

    // Lire tous les Monanimals en une seule fois
    const { data: monanimalData, error: monanimalError, refetch: refetchMonanimals } = useReadContracts({
        contracts: monanimalContracts,
        query: {
            enabled: !!tokenIds && tokenIds.length > 0,
        },
    })

    // Lire tous les tokenURI en une seule fois
    const { data: tokenURIData, error: tokenURIError, refetch: refetchTokenURIs } = useReadContracts({
        contracts: tokenURIContracts,
        query: {
            enabled: !!tokenIds && tokenIds.length > 0,
        },
    })

    // Debug logs
    useEffect(() => {
        console.log('useMonanimals - address:', address)
        console.log('useMonanimals - tokenIds:', tokenIds)
        console.log('useMonanimals - tokenIdsError:', tokenIdsError)
        console.log('useMonanimals - monanimalData:', monanimalData)
        console.log('useMonanimals - monanimalError:', monanimalError)
        console.log('useMonanimals - tokenURIData:', tokenURIData)
        console.log('useMonanimals - tokenURIError:', tokenURIError)
    }, [address, tokenIds, tokenIdsError, monanimalData, monanimalError, tokenURIData, tokenURIError])

    // Traiter les données des Monanimals
    useEffect(() => {
        if (!address) {
            console.log('No address, clearing monanimals')
            setMonanimals([])
            setLoading(false)
            return
        }

        if (!tokenIds || tokenIds.length === 0) {
            console.log('No tokens found for this wallet')
            setMonanimals([])
            setLoading(false)
            return
        }

        if (!monanimalData || !tokenURIData) {
            setLoading(true)
            return
        }

        setLoading(true)

        try {
            console.log(`📦 Processing ${monanimalData.length} Monanimals from blockchain...`)

            const processedMonanimals: Monanimal[] = []

            monanimalData.forEach((result, index) => {
                if (result.status === 'success' && result.result) {
                    const tokenId = tokenIds[index]
                    const data = result.result as any
                    const tokenURIResult = tokenURIData[index]

                    // Mapper les classes et raretés
                    const classNames = ['Warrior', 'Assassin', 'Mage', 'Berserker', 'Guardian']
                    const rarityNames = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic']

                    // Extraire l'image du tokenURI on-chain
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
                        imageUrl = createFallbackSVG();
                    }

                    const monanimal: Monanimal = {
                        id: Number(tokenId),
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
                    console.error(`Error loading monanimal ${tokenIds[index]}:`, result.error)
                }
            })

            console.log(`✅ Processed ${processedMonanimals.length} Monanimals successfully`)
            setMonanimals(processedMonanimals)
        } catch (error) {
            console.error('Error processing monanimals:', error)
            setMonanimals([])
        }

        setLoading(false)
    }, [address, tokenIds, monanimalData, tokenURIData])

    const mint = () => {
        if (mintPrice) {
            mintMonanimal({
                address: CONTRACT_ADDRESSES.MonanimalNFT,
                abi: MONANIMAL_ABI,
                functionName: 'mint',
                value: mintPrice,
                gas: 500_000n, // 500k gas limit pour le mint avec SVG complexe
            })
        }
    }

    const healMonanimal = (monanimalId: number) => {
        console.log(`🏥 Healing Monanimal #${monanimalId}`)

        if (healingPrice) {
            healMonanimalContract({
                address: CONTRACT_ADDRESSES.MonanimalNFT,
                abi: MONANIMAL_ABI,
                functionName: 'healMonanimal',
                args: [BigInt(monanimalId)],
                value: healingPrice,
            })
        }
    }

    const refetch = () => {
        console.log('🔄 Refetching Monanimals data...')
        refetchTokenIds()
        refetchMonanimals()
        refetchTokenURIs()
    }

    // Refetch après confirmation de mint
    useEffect(() => {
        if (isConfirmed) {
            console.log('✅ Mint confirmed, refetching data...')
            setTimeout(() => refetch(), 1000) // Petit délai pour laisser la blockchain se mettre à jour
        }
    }, [isConfirmed])

    // Refetch après confirmation de heal
    useEffect(() => {
        if (isHealConfirmed) {
            console.log('✅ Heal confirmed, refetching data...')
            setTimeout(() => refetch(), 1000)
        }
    }, [isHealConfirmed])

    // Exposer les fonctions globalement
    useEffect(() => {
        window.refreshMonanimals = refetch
        window.healMonanimal = healMonanimal
        return () => {
            delete window.refreshMonanimals
            delete window.healMonanimal
        }
    }, [healingPrice])

    return {
        monanimals,
        loading,
        mint,
        isMinting: isMinting || isConfirming,
        isConfirmed,
        mintPrice: mintPrice ? formatEther(mintPrice) : '0.01',
        refetch,
    }
};

