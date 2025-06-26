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

    // Hooks pour lire les stats des Monanimals participants
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

    // Déterminer le résultat de la bataille après confirmation
    useEffect(() => {
        if (isDuelConfirmed && currentBattleParticipants && preBattleStats) {
            console.log('=== Battle confirmed, determining result ===')

            const determineBattleResult = async () => {
                try {
                    // Attendre un peu pour que les stats soient mises à jour sur la blockchain
                    await new Promise(resolve => setTimeout(resolve, 2000))

                    // Relire les stats après la bataille
                    const myStatsAfter = await refetchMyMonanimal()
                    const opponentStatsAfter = await refetchOpponentMonanimal()

                    if (myStatsAfter.data && opponentStatsAfter.data) {
                        const myWinsAfter = Number(myStatsAfter.data.wins)
                        const myLossesAfter = Number(myStatsAfter.data.losses)

                        console.log('=== Battle Result Analysis ===')
                        console.log('Pre-battle - My wins:', preBattleStats.myWins, 'My losses:', preBattleStats.myLosses)
                        console.log('Post-battle - My wins:', myWinsAfter, 'My losses:', myLossesAfter)

                        // Déterminer qui a gagné en comparant les changements de stats
                        const didIWin = myWinsAfter > preBattleStats.myWins
                        const didILose = myLossesAfter > preBattleStats.myLosses

                        // Transformer les données du contrat en format Monanimal
                        const transformContractToMonanimal = (contractData: any, id: number): Monanimal => ({
                            id,
                            name: contractData.name,
                            class: contractData.class.toString(),
                            rarity: contractData.rarity.toString(),
                            level: Number(contractData.level),
                            health: Number(contractData.stats.health),
                            attack: Number(contractData.stats.attack),
                            defense: Number(contractData.stats.defense),
                            speed: Number(contractData.stats.speed),
                            magic: Number(contractData.stats.magic),
                            luck: Number(contractData.stats.luck),
                            wins: Number(contractData.wins),
                            losses: Number(contractData.losses),
                            isKO: contractData.isKO,
                        })

                        const myMonanimal = transformContractToMonanimal(myStatsAfter.data, currentBattleParticipants.myMonanimalId)
                        const opponentMonanimal = transformContractToMonanimal(opponentStatsAfter.data, currentBattleParticipants.opponentId)

                        if (didIWin && !didILose) {
                            console.log('✅ Victory detected!')
                            setBattleResult({
                                won: true,
                                experience: 100,
                                message: 'Victory! Your Monanimal has won the battle!',
                                winner: myMonanimal,
                                loser: opponentMonanimal,
                                battleLog: [
                                    'Battle executed on blockchain',
                                    'Your Monanimal fought bravely',
                                    'Victory achieved!',
                                    'Stats updated on blockchain'
                                ],
                                rewards: {
                                    experience: 100,
                                    items: [],
                                },
                            })
                        } else if (didILose && !didIWin) {
                            console.log('❌ Defeat detected!')
                            setBattleResult({
                                won: false,
                                experience: 25,
                                message: 'Defeat! Your Monanimal was defeated in battle.',
                                winner: opponentMonanimal,
                                loser: myMonanimal,
                                battleLog: [
                                    'Battle executed on blockchain',
                                    'Your Monanimal fought bravely',
                                    'Unfortunately defeated...',
                                    'Stats updated on blockchain'
                                ],
                                rewards: {
                                    experience: 25,
                                    items: [],
                                },
                            })
                        } else {
                            console.log('⚠️ Unclear battle result, checking KO status')
                            // Si pas de changement dans wins/losses, vérifier le statut KO
                            const amIKO = myStatsAfter.data.isKO
                            const isOpponentKO = opponentStatsAfter.data.isKO

                            if (isOpponentKO && !amIKO) {
                                console.log('✅ Victory by KO detected!')
                                setBattleResult({
                                    won: true,
                                    experience: 100,
                                    message: 'Victory! Your opponent was knocked out!',
                                    winner: myMonanimal,
                                    loser: opponentMonanimal,
                                    battleLog: [
                                        'Battle executed on blockchain',
                                        'Opponent knocked out!',
                                        'Victory achieved!',
                                        'Stats updated on blockchain'
                                    ],
                                    rewards: {
                                        experience: 100,
                                        items: [],
                                    },
                                })
                            } else if (amIKO && !isOpponentKO) {
                                console.log('❌ Defeat by KO detected!')
                                setBattleResult({
                                    won: false,
                                    experience: 0,
                                    message: 'Defeat! Your Monanimal was knocked out!',
                                    winner: opponentMonanimal,
                                    loser: myMonanimal,
                                    battleLog: [
                                        'Battle executed on blockchain',
                                        'Your Monanimal was knocked out!',
                                        'Defeat...',
                                        'Stats updated on blockchain'
                                    ],
                                    rewards: {
                                        experience: 0,
                                        items: [],
                                    },
                                })
                            } else {
                                console.log('⚠️ Battle result unclear, showing neutral result')
                                setBattleResult({
                                    won: null,
                                    experience: 50,
                                    message: 'Battle completed! Check your Monanimal stats for details.',
                                    winner: null,
                                    loser: null,
                                    battleLog: [
                                        'Battle executed on blockchain',
                                        'Smart contract determined the outcome',
                                        'All stats updated',
                                        'Check Collection for details'
                                    ],
                                    rewards: {
                                        experience: 50,
                                        items: [],
                                    },
                                })
                            }
                        }
                    }
                } catch (error) {
                    console.error('❌ Error determining battle result:', error)
                    // En cas d'erreur, afficher un résultat neutre
                    setBattleResult({
                        won: null,
                        experience: 25,
                        message: 'Battle completed! Unable to determine result details.',
                        winner: null,
                        loser: null,
                        battleLog: [
                            'Battle executed on blockchain',
                            'Error reading detailed results',
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

            determineBattleResult()
        }
    }, [isDuelConfirmed, currentBattleParticipants, preBattleStats, refetchMyMonanimal, refetchOpponentMonanimal])

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

        // Capturer les stats avant la bataille pour pouvoir comparer après
        const capturePreBattleStats = async () => {
            try {
                // Lire les stats actuelles des deux Monanimals
                const myStats = await refetchMyMonanimal()
                const opponentStats = await refetchOpponentMonanimal()

                if (myStats.data && opponentStats.data) {
                    setPreBattleStats({
                        myWins: Number(myStats.data.wins),
                        myLosses: Number(myStats.data.losses),
                        opponentWins: Number(opponentStats.data.wins),
                        opponentLosses: Number(opponentStats.data.losses)
                    })
                    console.log('✅ Pre-battle stats captured:', {
                        myWins: Number(myStats.data.wins),
                        myLosses: Number(myStats.data.losses),
                        opponentWins: Number(opponentStats.data.wins),
                        opponentLosses: Number(opponentStats.data.losses)
                    })
                }
            } catch (error) {
                console.error('❌ Error capturing pre-battle stats:', error)
            }
        }

        capturePreBattleStats()

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
                gas: BigInt(2_500_000), // Limite de gas plus élevée pour éviter les "out of gas"
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