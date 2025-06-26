// Types pour les NFTs et le jeu
export interface Monanimal {
  id: number
  name: string
  class: string
  rarity: string
  level: number
  health: number
  attack: number
  defense: number
  speed: number
  magic: number
  luck: number
  wins: number
  losses: number
  isKO: boolean
  image?: string
}

export interface Weapon {
  id: number
  name: string
  type: string
  rarity: string
  material: string
  attackBonus: number
  defenseBonus?: number
  magicBonus?: number
  speedBonus?: number
  durability: number
  maxDurability: number
}

export interface Artifact {
  id: number
  name: string
  type: string
  rarity: string
  essence: string
  effectPower: number
  charges: number
  maxCharges: number
}

export interface Fighter {
  monanimalId: number
  weaponId?: number
  artifactId?: number
  owner: string
  totalHP: number
  totalAttack: number
  totalDefense: number
  totalSpeed: number
  totalMagic: number
  critChance?: number
  dodgeChance?: number
}

export interface Battle {
  battleId: number
  fighter1: Fighter
  fighter2: Fighter
  winner?: string
  rounds?: number
  startBlock?: number
  endBlock?: number
  isCompleted: boolean
}

export interface BattleResult {
  won: boolean | null
  experience: number
  message: string
  winner: Monanimal | null
  loser: Monanimal | null
  battleLog?: string[]
  rewards?: {
    experience?: number
    items?: string[]
  }
}

export interface GameStats {
  totalMonanimals: number
  totalBattles: number
  totalPlayers: number
  topFighter: string | null
}

// Types pour les hooks
export interface UseMonanimalsReturn {
  monanimals: Monanimal[]
  loading: boolean
  mint: () => void
  isMinting: boolean
  isConfirmed: boolean
  mintPrice: string
  refetch: () => void
}

export interface UseWeaponsReturn {
  weapons: Weapon[]
  forge: () => void
  isForging: boolean
  forgePrice: string
}

export interface UseArtifactsReturn {
  artifacts: Artifact[]
  craft: () => void
  isCrafting: boolean
  craftPrice: string
}

export interface UseBattlesReturn {
  battleInProgress: boolean
  battleResult: BattleResult | null
  startDuel: (monanimalId: number, opponentId: number) => void
  startBattle: (fighterId: number, opponentId?: number) => Promise<void>
  isStarting: boolean
  isLoading: boolean
  clearResult: () => void
  duelFee: string
  playerBattles: number[]
}

export interface UseBattlesHook {
  (userMonanimals?: Monanimal[]): UseBattlesReturn
}

export interface UseWalletReturn {
  address: string | undefined
  isConnected: boolean
  isConnecting: boolean
  shortAddress: string
}

// Types pour les composants
export interface MonanimalCardProps {
  monanimal: Monanimal
  onSelect?: (monanimal: Monanimal) => void
  isSelected?: boolean
  showActions?: boolean
}

export interface FighterSelectorProps {
  monanimals: Monanimal[]
  selectedFighter: Monanimal | null
  onSelectFighter: (monanimal: Monanimal) => void
  onClose: () => void
  onConfirm: () => void
  isLoading?: boolean
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
  className?: string
}

export interface BattleProgressProps {
  battleResult: BattleResult | null
  onClose: () => void
  isVisible: boolean
}


export interface BattleProgressProps {
  isVisible: boolean
  message?: string
}

export interface BattleResultProps {
  result: BattleResult | null
  onClose: () => void
}

// Types globaux pour les fonctions window
declare global {
  interface Window {
    refreshMonanimals?: () => void
    updateMonanimalStats?: (monanimalId: number, won: boolean) => void
    healMonanimal?: (monanimalId: number) => void
    refreshBlockchainMonanimals?: () => void
  }
}