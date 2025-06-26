import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { CONTRACT_ADDRESSES, MONANIMAL_ABI, WEAPON_ABI, ARTIFACT_ABI, BATTLE_ARENA_ABI } from '../lib/web3'

// Hook pour gérer les Monanimals
export function useMonanimals() {
  const { address } = useAccount()
  const [monanimals, setMonanimals] = useState([])
  const [loading, setLoading] = useState(false)

  // Lire les Monanimals du joueur - essayer d'abord getOwnerMonanimals
  const { data: tokenIds, error: tokenIdsError } = useReadContract({
    address: CONTRACT_ADDRESSES.MonanimalNFT,
    abi: MONANIMAL_ABI,
    functionName: 'getOwnerMonanimals',
    args: [address],
    enabled: !!address,
  })

  // Fallback: utiliser balanceOf si getOwnerMonanimals échoue
  const { data: balance } = useReadContract({
    address: CONTRACT_ADDRESSES.MonanimalNFT,
    abi: MONANIMAL_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address && !tokenIds,
  })

  // Debug logs
  useEffect(() => {
    console.log('useMonanimals - address:', address)
    console.log('useMonanimals - tokenIds:', tokenIds)
    console.log('useMonanimals - tokenIdsError:', tokenIdsError)
    console.log('useMonanimals - balance:', balance)
    console.log('useMonanimals - monanimals:', monanimals)
  }, [address, tokenIds, tokenIdsError, balance, monanimals])

  // Lire le prix de mint
  const { data: mintPrice } = useReadContract({
    address: CONTRACT_ADDRESSES.MonanimalNFT,
    abi: MONANIMAL_ABI,
    functionName: 'mintPrice',
  })

  // Hook pour mint
  const { writeContract: mintMonanimal, data: mintHash, isPending: isMinting } = useWriteContract()

  // Attendre la confirmation de mint
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: mintHash,
  })

  // Charger les détails des Monanimals
  useEffect(() => {
    const loadMonanimals = async () => {
      console.log('=== loadMonanimals called ===')
      console.log('address:', address)
      console.log('tokenIds:', tokenIds)
      console.log('tokenIdsError:', tokenIdsError)
      console.log('balance:', balance)

      if (!address) {
        console.log('No address, clearing monanimals')
        setMonanimals([])
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        let finalTokenIds = []

        // Essayer d'abord getOwnerMonanimals
        if (tokenIds && tokenIds.length > 0) {
          finalTokenIds = tokenIds
          console.log('✅ Using getOwnerMonanimals:', finalTokenIds)
        }
        // Fallback: utiliser balanceOf + tokenOfOwnerByIndex
        else if (balance && Number(balance) > 0) {
          console.log('⚠️ Fallback: using balanceOf + tokenOfOwnerByIndex, balance:', Number(balance))

          // Récupérer les tokens un par un
          for (let i = 0; i < Number(balance); i++) {
            try {
              // Cette partie nécessiterait un appel séparé pour chaque token
              // Pour l'instant, créons des tokens simulés basés sur le balance
              finalTokenIds.push(BigInt(i))
            } catch (error) {
              console.error(`Error getting token at index ${i}:`, error)
            }
          }
        }
        // Si aucune méthode ne fonctionne, créer des tokens de test
        else {
          console.log('⚠️ No tokens found, creating test tokens for connected wallet')
          // Créer 3 tokens de test pour le wallet connecté
          finalTokenIds = [BigInt(0), BigInt(1), BigInt(2)]
        }

        if (finalTokenIds.length > 0) {
          const monanimalPromises = finalTokenIds.map(async (tokenId: number) => {
            try {
              const classes = ['Warrior', 'Assassin', 'Mage', 'Berserker', 'Guardian']
              const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic']

              const randomClass = classes[Number(tokenId) % classes.length]
              const randomRarity = rarities[Number(tokenId) % rarities.length]

              return {
                id: Number(tokenId),
                name: `${randomRarity} ${randomClass} #${tokenId}`,
                class: randomClass,
                rarity: randomRarity,
                level: 1,
                health: 80 + (Number(tokenId) % 40),
                attack: 70 + (Number(tokenId) % 30),
                defense: 60 + (Number(tokenId) % 30),
                speed: 50 + (Number(tokenId) % 40),
                magic: 40 + (Number(tokenId) % 50),
                luck: 50 + (Number(tokenId) % 30),
                wins: 0,
                losses: 0,
                isKO: false,
                image: `data:image/svg+xml;base64,${btoa(`
                  <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#836EF9;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#200052;stop-opacity:1" />
                      </linearGradient>
                    </defs>
                    <rect width="200" height="200" fill="url(#bg)"/>
                    <circle cx="100" cy="80" r="30" fill="#FFFFFF" opacity="0.9"/>
                    <circle cx="85" cy="75" r="8" fill="#000"/>
                    <circle cx="115" cy="75" r="8" fill="#000"/>
                    <circle cx="87" cy="73" r="2" fill="#FFF"/>
                    <circle cx="117" cy="73" r="2" fill="#FFF"/>
                    <ellipse cx="100" cy="120" rx="40" ry="30" fill="#A0055D" opacity="0.8"/>
                    <text x="100" y="160" text-anchor="middle" fill="white" font-size="12">${randomClass}</text>
                    <text x="100" y="175" text-anchor="middle" fill="#836EF9" font-size="10">#${tokenId}</text>
                  </svg>
                `)}`
              }
            } catch (error) {
              console.error('Error loading monanimal:', error)
              return null
            }
          })

          const results = await Promise.all(monanimalPromises)
          setMonanimals(results.filter(Boolean))
        } else {
          setMonanimals([])
        }
      } catch (error) {
        console.error('Error in loadMonanimals:', error)
        setMonanimals([])
      }

      setLoading(false)
    }

    loadMonanimals()
  }, [address, tokenIds, balance])

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

  return {
    monanimals,
    loading,
    mint,
    isMinting: isMinting || isConfirming,
    isConfirmed,
    mintPrice: mintPrice ? formatEther(mintPrice) : '0.01',
    refetch: () => {
      // Forcer un rechargement en réinitialisant les données
      setMonanimals([])
      setLoading(true)
    },
  }
}

// Hook pour gérer les armes
export function useWeapons() {
  const { address } = useAccount()
  const [weapons, setWeapons] = useState([])

  // Lire les armes du joueur
  const { data: tokenIds } = useReadContract({
    address: CONTRACT_ADDRESSES.WeaponNFT,
    abi: WEAPON_ABI,
    functionName: 'getOwnerWeapons',
    args: [address],
    enabled: !!address,
  })

  // Lire le prix de forge
  const { data: forgePrice } = useReadContract({
    address: CONTRACT_ADDRESSES.WeaponNFT,
    abi: WEAPON_ABI,
    functionName: 'forgePrice',
  })

  const { writeContract: forgeWeapon, isPending: isForging } = useWriteContract()

  const forge = () => {
    if (forgePrice) {
      forgeWeapon({
        address: CONTRACT_ADDRESSES.WeaponNFT,
        abi: WEAPON_ABI,
        functionName: 'forge',
        value: forgePrice,
      })
    }
  }

  // Charger les détails des armes
  useEffect(() => {
    if (tokenIds && tokenIds.length > 0) {
      Promise.all(
        tokenIds.map(async (tokenId: number) => {
          try {
            return {
              id: Number(tokenId),
              name: `Weapon #${tokenId}`,
              type: 'Sword',
              rarity: 'Epic',
              material: 'Iron',
              attackBonus: 35,
              defenseBonus: 15,
              durability: 80,
              maxDurability: 100,
            }
          } catch (error) {
            console.error('Error loading weapon:', error)
            return null
          }
        })
      ).then((results) => {
        setWeapons(results.filter(Boolean))
      })
    }
  }, [tokenIds])

  return {
    weapons,
    forge,
    isForging,
    forgePrice: forgePrice ? formatEther(forgePrice) : '0.005',
  }
}

// Hook pour gérer les artefacts
export function useArtifacts() {
  const { address } = useAccount()
  const [artifacts, setArtifacts] = useState([])

  // Lire les artefacts du joueur
  const { data: tokenIds } = useReadContract({
    address: CONTRACT_ADDRESSES.ArtifactNFT,
    abi: ARTIFACT_ABI,
    functionName: 'getOwnerArtifacts',
    args: [address],
    enabled: !!address,
  })

  // Lire le prix de craft
  const { data: craftPrice } = useReadContract({
    address: CONTRACT_ADDRESSES.ArtifactNFT,
    abi: ARTIFACT_ABI,
    functionName: 'craftPrice',
  })

  const { writeContract: craftArtifact, isPending: isCrafting } = useWriteContract()

  const craft = () => {
    if (craftPrice) {
      craftArtifact({
        address: CONTRACT_ADDRESSES.ArtifactNFT,
        abi: ARTIFACT_ABI,
        functionName: 'craft',
        value: craftPrice,
      })
    }
  }

  // Charger les détails des artefacts
  useEffect(() => {
    if (tokenIds && tokenIds.length > 0) {
      Promise.all(
        tokenIds.map(async (tokenId: number) => {
          try {
            return {
              id: Number(tokenId),
              name: `Artifact #${tokenId}`,
              type: 'Ring',
              rarity: 'Rare',
              essence: 'Fire',
              effectPower: 50,
              charges: 3,
              maxCharges: 5,
            }
          } catch (error) {
            console.error('Error loading artifact:', error)
            return null
          }
        })
      ).then((results) => {
        setArtifacts(results.filter(Boolean))
      })
    }
  }, [tokenIds])

  return {
    artifacts,
    craft,
    isCrafting,
    craftPrice: craftPrice ? formatEther(craftPrice) : '0.008',
  }
}

// Hook pour gérer les batailles
export function useBattles() {
  const { address } = useAccount()
  const [battleInProgress, setBattleInProgress] = useState(false)
  const [battleResult, setBattleResult] = useState<null | { won: boolean | null, experience: number, message: string }>(null)

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
    args: [address],
    enabled: !!address,
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

    // Plus de mode test - uniquement blockchain
    if (!address) {
      console.error('❌ Wallet not connected')
      return
    }

    // Mode blockchain réel
    if (!duelFee) {
      console.error('❌ duelFee is not loaded')
      return
    }

    console.log('✅ All parameters are valid, starting real blockchain duel...')
    setBattleInProgress(true)

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
        gas: BigInt(1_500_000), // Limite de gas plus élevée pour éviter les "out of gas"
      })

      console.log('✅ createDuel function called successfully')
    } catch (error) {
      console.error('❌ Error calling createDuel:', error)
      setBattleInProgress(false)
    }
  }

  // Écouter la confirmation du duel
  useEffect(() => {
    if (isDuelConfirmed) {
      // Le duel a été créé et exécuté automatiquement sur la blockchain
      // Les résultats sont maintenant disponibles via refetchBattles()
      setBattleResult({
        won: null as boolean | null, // Le résultat sera lu depuis la blockchain
        experience: 0,
        message: 'Duel completed on blockchain! Check leaderboard for results.',
      })
      setBattleInProgress(false)
      refetchBattles() // Recharger les batailles pour obtenir les vrais résultats
    }
  }, [isDuelConfirmed, refetchBattles])

  return {
    battleInProgress: battleInProgress || isStarting || isConfirming,
    battleResult,
    startDuel,
    isStarting,
    clearResult: () => setBattleResult(null),
    duelFee: duelFee ? formatEther(duelFee) : '0.01',
    playerBattles: playerBattles || [],
  }
}

// Hook pour gérer la connexion wallet
export function useWalletConnection() {
  const { address, isConnected, isConnecting } = useAccount()

  return {
    address,
    isConnected,
    isConnecting,
    shortAddress: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '',
  }
}

// Hook pour les statistiques globales
export function useGameStats() {
  const [stats, setStats] = useState({
    totalMonanimals: 0,
    totalBattles: 0,
    totalPlayers: 0,
    topFighter: null as string | null,
  })

  useEffect(() => {
    // Simuler les statistiques pour la démo
    setStats({
      totalMonanimals: 1247,
      totalBattles: 3891,
      totalPlayers: 456,
      topFighter: 'Legendary Mage #1',
    })
  }, [])

  return stats
}

