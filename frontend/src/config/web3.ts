import { createConfig, http } from 'wagmi'
import { defineChain } from 'viem'
import { injected, metaMask } from 'wagmi/connectors'

// Configuration de la chaîne Monad Testnet
export const monadTestnet = defineChain({
    id: 10143,
    name: 'Monad Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Monad',
        symbol: 'MON',
    },
    rpcUrls: {
        default: {
            http: ['https://testnet-rpc.monad.xyz'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Monad Explorer',
            url: 'https://testnet.monvision.io',
        },
    },
    testnet: true,
})

// Configuration Wagmi
export const config = createConfig({
    chains: [monadTestnet],
    connectors: [
        injected(),
        metaMask(),
    ],
    transports: {
        [monadTestnet.id]: http(),
    },
})

// Adresses des contrats déployés sur Monad Testnet
export const CONTRACT_ADDRESSES = {
    MonanimalNFT: '0x45df6a3644BD73c94207d53cf49d0Bae2fd0eFde',
    WeaponNFT: '0xC10a2805C1610d81eA3037B041b6669CB4944251',
    ArtifactNFT: '0xbe7E187734C30F11e7E7D3bc00D84F27CFD0e345',
    BattleArena: '0xD6b48e9f3e7a3e233ECD3E1a493de5e9A764B80C',
} as const

// ABIs simplifiés pour l'interface
export const MONANIMAL_ABI = [
    {
        "inputs": [],
        "name": "mint",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "name": "getMonanimal",
        "outputs": [
            {
                "components": [
                    { "internalType": "string", "name": "name", "type": "string" },
                    { "internalType": "uint8", "name": "class", "type": "uint8" },
                    { "internalType": "uint8", "name": "rarity", "type": "uint8" },
                    {
                        "components": [
                            { "internalType": "uint256", "name": "health", "type": "uint256" },
                            { "internalType": "uint256", "name": "attack", "type": "uint256" },
                            { "internalType": "uint256", "name": "defense", "type": "uint256" },
                            { "internalType": "uint256", "name": "speed", "type": "uint256" },
                            { "internalType": "uint256", "name": "magic", "type": "uint256" },
                            { "internalType": "uint256", "name": "luck", "type": "uint256" }
                        ],
                        "internalType": "struct MonanimalNFT.MonanimalStats",
                        "name": "stats",
                        "type": "tuple"
                    },
                    { "internalType": "uint256", "name": "level", "type": "uint256" },
                    { "internalType": "uint256", "name": "experience", "type": "uint256" },
                    { "internalType": "uint256", "name": "wins", "type": "uint256" },
                    { "internalType": "uint256", "name": "losses", "type": "uint256" },
                    { "internalType": "bool", "name": "isKO", "type": "bool" },
                    { "internalType": "uint256", "name": "lastBattleTime", "type": "uint256" },
                    { "internalType": "string", "name": "colorScheme", "type": "string" },
                    { "internalType": "uint256", "name": "weaponId", "type": "uint256" },
                    { "internalType": "uint256", "name": "artifactId", "type": "uint256" }
                ],
                "internalType": "struct MonanimalNFT.Monanimal",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
        "name": "getOwnerMonanimals",
        "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "owner", "type": "address" },
            { "internalType": "uint256", "name": "index", "type": "uint256" }
        ],
        "name": "tokenOfOwnerByIndex",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "name": "tokenURI",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "mintPrice",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "name": "ownerOf",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "name": "healMonanimal",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "healingPrice",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
] as const

export const WEAPON_ABI = [
    {
        "inputs": [],
        "name": "forge",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "forgePrice",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
        "name": "getOwnerWeapons",
        "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "name": "getWeapon",
        "outputs": [
            {
                "components": [
                    { "internalType": "string", "name": "name", "type": "string" },
                    { "internalType": "uint8", "name": "weaponType", "type": "uint8" },
                    { "internalType": "uint8", "name": "rarity", "type": "uint8" },
                    { "internalType": "string", "name": "material", "type": "string" },
                    { "internalType": "uint256", "name": "attackBonus", "type": "uint256" },
                    { "internalType": "uint256", "name": "durability", "type": "uint256" }
                ],
                "internalType": "struct WeaponNFT.Weapon",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
] as const

export const ARTIFACT_ABI = [
    {
        "inputs": [],
        "name": "craft",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "craftPrice",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
        "name": "getOwnerArtifacts",
        "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "name": "getArtifact",
        "outputs": [
            {
                "components": [
                    { "internalType": "string", "name": "name", "type": "string" },
                    { "internalType": "uint8", "name": "artifactType", "type": "uint8" },
                    { "internalType": "uint8", "name": "rarity", "type": "uint8" },
                    { "internalType": "string", "name": "essence", "type": "string" },
                    { "internalType": "uint256", "name": "effectPower", "type": "uint256" },
                    { "internalType": "uint256", "name": "charges", "type": "uint256" }
                ],
                "internalType": "struct ArtifactNFT.Artifact",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
] as const

export const BATTLE_ARENA_ABI = [
    {
        "inputs": [
            { "internalType": "uint256", "name": "myMonanimalId", "type": "uint256" },
            { "internalType": "uint256", "name": "opponentMonanimalId", "type": "uint256" }
        ],
        "name": "createDuel",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256[]", "name": "monanimalIds", "type": "uint256[]" }],
        "name": "createTournament",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "battleId", "type": "uint256" }],
        "name": "getBattle",
        "outputs": [
            {
                "components": [
                    { "internalType": "uint256", "name": "battleId", "type": "uint256" },
                    { "internalType": "uint8", "name": "battleType", "type": "uint8" },
                    { "internalType": "uint256[]", "name": "participants", "type": "uint256[]" },
                    { "internalType": "address[]", "name": "players", "type": "address[]" },
                    { "internalType": "uint8", "name": "state", "type": "uint8" },
                    { "internalType": "uint256", "name": "winner", "type": "uint256" },
                    { "internalType": "uint256", "name": "prizePool", "type": "uint256" }
                ],
                "internalType": "struct BattleArena.Battle",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "player", "type": "address" }],
        "name": "getPlayerBattles",
        "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "duelFee",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
] as const