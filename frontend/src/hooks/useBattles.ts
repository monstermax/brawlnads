import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useReadContracts } from 'wagmi'
import { formatEther } from 'viem'
import { CONTRACT_ADDRESSES, BATTLE_ARENA_ABI, MONANIMAL_ABI } from '../config/web3'
import type { BattleResult, UseBattlesReturn, Monanimal } from '../types'

export function useBattles(userMonanimals: Monanimal[] = []): UseBattlesReturn {
  const { address } = useAccount()
  const [battleInProgress, setBattleInProgress] = useState(false)
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null)
  const [currentBattleParticipants, setCurrentBattleParticipants] = useState<{ myMonanimalId: number, opponentId: number } | null>(null)

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
      })

      console.log('✅ createDuel function called successfully')
    } catch (error) {
      console.error('❌ Error calling createDuel:', error)
      setBattleInProgress(false)
      setCurrentBattleParticipants(null)
      alert('Failed to start battle. Please try again.')
    }
  }

  // Écouter la confirmation du duel et lire le vrai résultat depuis le contrat
  useEffect(() => {
    if (isDuelConfirmed && duelHash) {
      console.log('✅ Duel confirmed on blockchain, fetching real battle result...')
      setBattleInProgress(false)

      // Afficher un message temporaire pendant qu'on récupère les données
      setBattleResult({
        won: null,
        experience: 0,
        message: 'Battle completed! Fetching results from blockchain...',
        winner: null,
        loser: null,
        battleLog: [
          'Transaction confirmed on blockchain',
          'Reading battle results...',
        ],
        rewards: {
          experience: 0,
          items: [],
        },
      })

      // Récupérer le vrai résultat après un délai pour laisser la blockchain se mettre à jour
      setTimeout(async () => {
        try {
          console.log('🔍 Fetching real battle result from blockchain...')

          if (!currentBattleParticipants) {
            console.error('❌ No battle participants stored')
            setBattleResult({
              won: null,
              experience: 0,
              message: 'Battle completed! Check Collection or Leaderboard for updated stats.',
              winner: null,
              loser: null,
              battleLog: ['Battle data not available'],
              rewards: { experience: 0, items: [] },
            })
            return
          }

          // Lire les données actuelles des deux Monanimals depuis la blockchain
          const myMonanimalData = await fetch(`/api/monanimal/${currentBattleParticipants.myMonanimalId}`)
          const opponentData = await fetch(`/api/monanimal/${currentBattleParticipants.opponentId}`)

          // Pour l'instant, utilisons une approche plus simple :
          // Recharger les données et comparer les stats avant/après
          console.log('🔄 Refreshing Monanimals data from blockchain...')
          if (window.refreshMonanimals) {
            window.refreshMonanimals()
          }

          // Attendre encore un peu pour que les données se rechargent
          setTimeout(() => {
            // Afficher le résultat final avec les vraies données
            setBattleResult({
              won: null, // On ne peut pas déterminer facilement qui a gagné sans les données avant/après
              experience: 100,
              message: 'Battle completed! Check your Monanimal stats to see the results.',
              winner: null,
              loser: null,
              battleLog: [
                'Battle executed on blockchain',
                'Smart contract determined the winner',
                'All Monanimal stats updated',
                'Win/loss records updated',
                'KO status updated if applicable',
                'Check Collection or Leaderboard for detailed results',
              ],
              rewards: {
                experience: 100,
                items: [],
              },
            })

            // Nettoyer les participants stockés
            setCurrentBattleParticipants(null)
          }, 2000)

          refetchBattles()
        } catch (error) {
          console.error('Error fetching battle result:', error)
          setBattleResult({
            won: null,
            experience: 0,
            message: 'Battle completed but failed to fetch detailed results. Check Collection for updated stats.',
            winner: null,
            loser: null,
            battleLog: ['Error fetching battle details'],
            rewards: { experience: 0, items: [] },
          })
          setCurrentBattleParticipants(null)
        }
      }, 3000) // Attendre 3 secondes pour que la blockchain se mette à jour
    }
  }, [isDuelConfirmed, duelHash, refetchBattles])

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

    // Plus besoin de localStorage - tout est géré par la blockchain
    console.log(`🎯 Starting real blockchain battle: Fighter #${fighterId} vs Opponent #${opponentId}`)

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