import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useReadContracts } from 'wagmi'
import { formatEther } from 'viem'

import { CONTRACT_ADDRESSES, MONANIMAL_ABI } from '../config/web3'

import type { Monanimal, UseMonanimalsReturn } from '../types'


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

    // Lire tous les Monanimals en une seule fois
    const { data: monanimalData, error: monanimalError, refetch: refetchMonanimals } = useReadContracts({
        contracts: monanimalContracts,
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
    }, [address, tokenIds, tokenIdsError, monanimalData, monanimalError])

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

        if (!monanimalData) {
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

                    // Mapper les classes et raretés
                    const classNames = ['Warrior', 'Assassin', 'Mage', 'Berserker', 'Guardian']
                    const rarityNames = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic']

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
    }, [address, tokenIds, monanimalData])

    const mint = () => {
        if (mintPrice) {
            mintMonanimal({
                address: CONTRACT_ADDRESSES.MonanimalNFT,
                abi: MONANIMAL_ABI,
                functionName: 'mint',
                value: mintPrice,
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

