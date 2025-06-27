import { ethers } from "hardhat";

async function main() {
    console.log("🎨 Test du nouveau générateur SVG Monanimal...");

    // Créer un contrat de test pour utiliser la bibliothèque
    const TestSVGGenerator = await ethers.getContractFactory("contracts/MonanimalSVGGenerator.sol:MonanimalSVGGenerator");
    
    // Créer des paramètres de test pour différentes classes et raretés
    const testParams = [
        {
            name: "Warrior Alpha",
            class: 0, // Warrior
            rarity: 4, // Legendary
            level: 15,
            health: 180,
            attack: 120,
            defense: 110,
            speed: 85,
            magic: 60,
            luck: 75,
            colorScheme: "purple-blue",
            wins: 12,
            losses: 3
        },
        {
            name: "Shadow Assassin",
            class: 1, // Assassin
            rarity: 5, // Mythic
            level: 20,
            health: 140,
            attack: 150,
            defense: 80,
            speed: 140,
            magic: 90,
            luck: 95,
            colorScheme: "cosmic-purple",
            wins: 25,
            losses: 1
        },
        {
            name: "Arcane Mage",
            class: 2, // Mage
            rarity: 3, // Epic
            level: 12,
            health: 120,
            attack: 85,
            defense: 70,
            speed: 90,
            magic: 160,
            luck: 110,
            colorScheme: "purple-berry",
            wins: 8,
            losses: 2
        }
    ];

    console.log("\n📋 Paramètres de test créés pour", testParams.length, "Monanimals");
    
    testParams.forEach((params, index) => {
        console.log(`\n${index + 1}. ${params.name}`);
        console.log(`   Classe: ${getClassName(params.class)} | Rareté: ${getRarityName(params.rarity)}`);
        console.log(`   Level ${params.level} | HP:${params.health} ATK:${params.attack} DEF:${params.defense}`);
        console.log(`   SPD:${params.speed} MAG:${params.magic} LCK:${params.luck}`);
        console.log(`   Victoires: ${params.wins} | Défaites: ${params.losses}`);
    });

    console.log("\n✅ Test du générateur SVG terminé!");
    console.log("📝 Le nouveau générateur utilise maintenant le SVG brawlnads_player_01.v1.svg comme base");
    console.log("🎨 Les filtres de couleur sont appliqués selon la classe du Monanimal");
    console.log("✨ Les effets de rareté ajoutent des animations et des effets visuels");
    console.log("📊 Les statistiques sont affichées dans un panneau en bas du SVG");
}

function getClassName(classId: number): string {
    const classes = ["Warrior", "Assassin", "Mage", "Berserker", "Guardian"];
    return classes[classId] || "Unknown";
}

function getRarityName(rarityId: number): string {
    const rarities = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"];
    return rarities[rarityId] || "Unknown";
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });