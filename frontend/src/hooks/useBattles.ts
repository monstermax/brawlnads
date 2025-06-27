import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { formatEther } from 'viem'
import { CONTRACT_ADDRESSES, BATTLE_ARENA_ABI, MONANIMAL_ABI } from '../config/web3'
import type { BattleResult, UseBattlesReturn, Monanimal } from '../types'

export function useBattles(userMonanimals: Monanimal[] = []): UseBattlesReturn {
    const { address } = useAccount()
    const [battleInProgress, setBattleInProgress] = useState(false)
    const [battleResult, setBattleResult] = useState<BattleResult | null>(null)
    const [currentBattleParticipants, setCurrentBattleParticipants] = useState<{ myMonanimalId: number, opponentId: number } | null>(null)
    const [preBattleStats, setPreBattleStats] = useState<{ myWins: number, myLosses: number, opponentWins: number, opponentLosses: number } | null>(null)

    // Lire le prix du duel
    const { data: duelFee } = useReadContract({
        address: CONTRACT_ADDRESSES.BattleArena,
        abi: BATTLE_ARENA_ABI,
        functionName: 'duelFee',
    })

    // Hook pour créer un duel
    const { writeContract: createDuel, data: duelHash, isPending: isStarting, error: duelError } = useWriteContract()

    // Attendre la confirmation du duel
    const { isLoading: isConfirming, isSuccess: isDuelConfirmed, error: confirmError } = useWaitForTransactionReceipt({
        hash: duelHash,
    })

    // Lire les batailles du joueur
    const { data: playerBattles, refetch: refetchBattles } = useReadContract({
        address: CONTRACT_ADDRESSES.BattleArena,
        abi: BATTLE_ARENA_ABI,
        functionName: 'getPlayerBattles',
        args: [address!],
        query: {
            enabled: !!address,
        },
    })

    // Note: Hooks pour lire les stats supprimés car non nécessaires avec BattleArenaOptimized

    // Debug logs pour les hooks de transaction
    useEffect(() => {
        console.log('=== Transaction Status ===')
        console.log('duelHash:', duelHash)
        console.log('isStarting:', isStarting)
        console.log('isConfirming:', isConfirming)
        console.log('isDuelConfirmed:', isDuelConfirmed)
        console.log('duelError:', duelError)
        console.log('confirmError:', confirmError)
    }, [duelHash, isStarting, isConfirming, isDuelConfirmed, duelError, confirmError])

    // Lire le résultat de la bataille depuis BattleArenaOptimized
    const { data: playerBattlesData, refetch: refetchPlayerBattles } = useReadContract({
        address: CONTRACT_ADDRESSES.BattleArena,
        abi: BATTLE_ARENA_ABI,
        functionName: 'getPlayerBattles',
        args: [address!],
        query: {
            enabled: !!address && isDuelConfirmed,
        },
    })

    // Hooks pour lire les vraies données des Monanimals
    const { data: myMonanimalData, refetch: refetchMyMonanimal } = useReadContract({
        address: CONTRACT_ADDRESSES.MonanimalNFT,
        abi: MONANIMAL_ABI,
        functionName: 'getMonanimal',
        args: [BigInt(currentBattleParticipants?.myMonanimalId || 0)],
        query: {
            enabled: !!currentBattleParticipants?.myMonanimalId,
        },
    })

    const { data: opponentMonanimalData, refetch: refetchOpponentMonanimal } = useReadContract({
        address: CONTRACT_ADDRESSES.MonanimalNFT,
        abi: MONANIMAL_ABI,
        functionName: 'getMonanimal',
        args: [BigInt(currentBattleParticipants?.opponentId || 0)],
        query: {
            enabled: !!currentBattleParticipants?.opponentId,
        },
    })

    // Hook pour lire le tokenURI et récupérer les SVG
    const { data: myTokenURI } = useReadContract({
        address: CONTRACT_ADDRESSES.MonanimalNFT,
        abi: MONANIMAL_ABI,
        functionName: 'tokenURI',
        args: [BigInt(currentBattleParticipants?.myMonanimalId || 0)],
        query: {
            enabled: !!currentBattleParticipants?.myMonanimalId,
        },
    })

    const { data: opponentTokenURI } = useReadContract({
        address: CONTRACT_ADDRESSES.MonanimalNFT,
        abi: MONANIMAL_ABI,
        functionName: 'tokenURI',
        args: [BigInt(currentBattleParticipants?.opponentId || 0)],
        query: {
            enabled: !!currentBattleParticipants?.opponentId,
        },
    })

    // Déterminer le résultat de la bataille après confirmation
    useEffect(() => {
        if (isDuelConfirmed && currentBattleParticipants) {
            console.log('=== Battle confirmed, determining winner ===')

            const determineBattleWinner = async () => {
                try {
                    // Attendre un peu pour que la transaction soit finalisée
                    await new Promise(resolve => setTimeout(resolve, 1500))

                    // Recharger les batailles du joueur pour obtenir la dernière bataille
                    const battlesResult = await refetchPlayerBattles()
                    
                    if (battlesResult.data && battlesResult.data.length > 0) {
                        // Prendre la dernière bataille (la plus récente)
                        const lastBattleId = battlesResult.data[battlesResult.data.length - 1]
                        console.log('📊 Reading battle result for battle ID:', lastBattleId.toString())

                        // Utiliser un hook temporaire pour lire la bataille
                        const { readContract } = await import('wagmi/actions')
                        const { config } = await import('../config/web3')
                        
                        const battleResult = await readContract(config, {
                            address: CONTRACT_ADDRESSES.BattleArena as `0x${string}`,
                            abi: BATTLE_ARENA_ABI,
                            functionName: 'getBattle',
                            args: [lastBattleId]
                        }) as any

                        console.log('🎯 Battle result:', battleResult)

                        const winnerId = Number(battleResult.winner)
                        const myMonanimalId = currentBattleParticipants.myMonanimalId
                        const opponentId = currentBattleParticipants.opponentId

                        const didIWin = winnerId === myMonanimalId
                        
                        console.log('🏆 Battle analysis:')
                        console.log('  Winner ID:', winnerId)
                        console.log('  My Monanimal ID:', myMonanimalId)
                        console.log('  Opponent ID:', opponentId)
                        console.log('  Did I win?', didIWin)

                        // Fonction pour extraire l'image SVG du tokenURI
                        const extractSVGFromTokenURI = (tokenURI: string) => {
                            try {
                                if (tokenURI && tokenURI.startsWith('data:application/json;base64,')) {
                                    const base64Data = tokenURI.replace('data:application/json;base64,', '')
                                    const jsonData = JSON.parse(atob(base64Data))
                                    return jsonData.image || null
                                }
                            } catch (error) {
                                console.error('Error extracting SVG:', error)
                            }
                            return null
                        }

                        // Récupérer les vraies données des Monanimals
                        console.log('📖 Fetching Monanimal data...')
                        const myData = await refetchMyMonanimal()
                        const opponentData = await refetchOpponentMonanimal()
                        
                        console.log('📊 My Monanimal data:', myData.data)
                        console.log('📊 Opponent Monanimal data:', opponentData.data)
                        console.log('🖼️ My TokenURI:', myTokenURI)
                        console.log('🖼️ Opponent TokenURI:', opponentTokenURI)

                        // Transformer les données du contrat en format Monanimal avec SVG
                        const transformContractToMonanimal = (contractData: any, id: number, tokenURI?: string): Monanimal => {
                            const image = tokenURI ? extractSVGFromTokenURI(tokenURI) : null
                            console.log(`🎨 Extracted image for Monanimal #${id}:`, image ? 'SVG found' : 'No SVG')
                            
                            return {
                                id,
                                name: contractData?.name || `Monanimal #${id}`,
                                class: contractData?.class?.toString() || 'Fighter',
                                rarity: contractData?.rarity?.toString() || 'Common',
                                level: Number(contractData?.level || 1),
                                health: Number(contractData?.stats?.health || 100),
                                attack: Number(contractData?.stats?.attack || 50),
                                defense: Number(contractData?.stats?.defense || 30),
                                speed: Number(contractData?.stats?.speed || 40),
                                magic: Number(contractData?.stats?.magic || 20),
                                luck: Number(contractData?.stats?.luck || 10),
                                wins: Number(contractData?.wins || 0),
                                losses: Number(contractData?.losses || 0),
                                isKO: contractData?.isKO || false,
                                image: image,
                            }
                        }

                        const myMonanimal = transformContractToMonanimal(myData.data, myMonanimalId, myTokenURI as string)
                        const opponentMonanimal = transformContractToMonanimal(opponentData.data, opponentId, opponentTokenURI as string)
                        
                        console.log('🏆 Final Monanimal objects:')
                        console.log('  My Monanimal:', myMonanimal)
                        console.log('  Opponent Monanimal:', opponentMonanimal)

                        if (didIWin) {
                            console.log('✅ Victory!')
                            setBattleResult({
                                won: true,
                                experience: 100,
                                message: `Victory! Your ${myMonanimal.name} has won the battle!`,
                                winner: myMonanimal,
                                loser: opponentMonanimal,
                                battleLog: [
                                    'Battle executed on blockchain',
                                    `Your ${myMonanimal.name} fought bravely`,
                                    `Opponent ${opponentMonanimal.name} was defeated`,
                                    'Victory achieved! 🎉'
                                ],
                                rewards: {
                                    experience: 100,
                                    items: [],
                                },
                            })
                        } else {
                            console.log('❌ Defeat!')
                            setBattleResult({
                                won: false,
                                experience: 25,
                                message: `Defeat! Your ${myMonanimal.name} was defeated.`,
                                winner: opponentMonanimal,
                                loser: myMonanimal,
                                battleLog: [
                                    'Battle executed on blockchain',
                                    `Your ${myMonanimal.name} fought bravely`,
                                    `Opponent ${opponentMonanimal.name} emerged victorious`,
                                    'Better luck next time! 💪'
                                ],
                                rewards: {
                                    experience: 25,
                                    items: [],
                                },
                            })
                        }
                    } else {
                        throw new Error('No battle data found')
                    }

                } catch (error) {
                    console.error('❌ Error determining battle winner:', error)
                    setBattleResult({
                        won: null,
                        experience: 25,
                        message: 'Battle completed! Unable to determine winner details.',
                        winner: null,
                        loser: null,
                        battleLog: [
                            'Battle transaction confirmed',
                            'Unable to fetch detailed results',
                            'Check Collection for updated stats'
                        ],
                        rewards: {
                            experience: 25,
                            items: [],
                        },
                    })
                } finally {
                    setBattleInProgress(false)
                    // Nettoyer les données temporaires
                    setCurrentBattleParticipants(null)
                    setPreBattleStats(null)

                    // Recharger les données des Monanimals
                    if (window.refreshMonanimals) {
                        console.log('🔄 Refreshing Monanimals data from blockchain...')
                        window.refreshMonanimals()
                    }
                }
            }

            determineBattleWinner()
        }
    }, [isDuelConfirmed, currentBattleParticipants, refetchPlayerBattles])

    const startDuel = (monanimalId: number, opponentId: number) => {
        console.log('=== startDuel called ===')
        console.log('monanimalId:', monanimalId)
        console.log('opponentId:', opponentId)
        console.log('duelFee:', duelFee)
        console.log('duelFee formatted:', duelFee ? formatEther(duelFee) : 'null')
        console.log('address:', address)
        console.log('CONTRACT_ADDRESSES.BattleArena:', CONTRACT_ADDRESSES.BattleArena)

        if (monanimalId === undefined || monanimalId === null) {
            console.error('❌ monanimalId is missing')
            return
        }

        if (opponentId === undefined || opponentId === null) {
            console.error('❌ opponentId is missing')
            return
        }

        // Vérifier si on a une adresse wallet
        if (!address) {
            console.error('❌ Wallet not connected')
            alert('Please connect your wallet first!')
            return
        }

        // Vérifier que le duelFee est chargé
        if (!duelFee) {
            console.error('❌ duelFee is not loaded')
            alert('Battle fee not loaded. Please try again.')
            return
        }

        console.log('✅ All parameters are valid, starting real blockchain duel...')
        setBattleInProgress(true)

        // Stocker les participants pour pouvoir déterminer le résultat plus tard
        setCurrentBattleParticipants({ myMonanimalId: monanimalId, opponentId })

        // Note: Pas besoin de capturer les stats pour BattleArenaOptimized
        console.log('🎯 Using BattleArenaOptimized - simplified battle flow')

        try {
            console.log('📤 Calling createDuel with params:', {
                address: CONTRACT_ADDRESSES.BattleArena,
                functionName: 'createDuel',
                args: [BigInt(monanimalId), BigInt(opponentId)],
                value: duelFee,
            })

            createDuel({
                address: CONTRACT_ADDRESSES.BattleArena,
                abi: BATTLE_ARENA_ABI,
                functionName: 'createDuel',
                args: [BigInt(monanimalId), BigInt(opponentId)],
                value: duelFee,
                gas: BigInt(900_000), // Limite de gas plus élevée pour éviter les "out of gas"
            })

            console.log('✅ createDuel function called successfully')

        } catch (error) {
            console.error('❌ Error calling createDuel:', error)
            setBattleInProgress(false)
            setCurrentBattleParticipants(null)
            alert('Failed to start battle. Please try again.')
        }
    }

    const startBattle = async (fighterId: number, opponentId?: number) => {
        console.log('=== startBattle called ===')
        console.log('fighterId:', fighterId)
        console.log('opponentId:', opponentId)
        console.log('userMonanimals:', userMonanimals)

        if (!address) {
            console.error('❌ Wallet not connected')
            alert('Please connect your wallet first!')
            return
        }

        // Vérifier que l'utilisateur possède bien ce Monanimal
        const ownedMonanimal = userMonanimals.find(m => m.id === fighterId)
        if (!ownedMonanimal) {
            console.error(`❌ User does not own Monanimal #${fighterId}`)
            alert(`You don't own Monanimal #${fighterId}. Please select one of your own Monanimals.`)
            return
        }

        console.log(`✅ Validated ownership of Monanimal #${fighterId}: ${ownedMonanimal.name}`)

        // Vérifier qu'un adversaire a été sélectionné
        if (!opponentId && opponentId !== 0) {
            console.error('❌ No opponent selected')
            alert('Please select an opponent first!')
            return
        }

        console.log(`🎯 Starting blockchain battle: ${ownedMonanimal.name} (#${fighterId}) vs Opponent #${opponentId}`)
        console.log(`💰 Battle fee: ${duelFee ? formatEther(duelFee) : 'Loading...'} ETH`)

        // Utiliser la vraie fonction startDuel (toujours blockchain maintenant)
        startDuel(fighterId, opponentId)
    }

    const clearResult = () => setBattleResult(null)

    return {
        battleInProgress: battleInProgress || isStarting || isConfirming,
        battleResult,
        startDuel,
        startBattle,
        isStarting,
        isLoading: battleInProgress || isStarting || isConfirming,
        clearResult,
        duelFee: duelFee ? formatEther(duelFee) : '0.01',
        playerBattles: playerBattles ? playerBattles.map(Number) : [],
    }
}