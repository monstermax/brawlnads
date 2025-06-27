import { ethers } from "hardhat";

async function main() {
    console.log("🎨 Test du générateur SVG amélioré...");

    // Déployer le générateur de test
    const TestSVGGenerator = await ethers.getContractFactory("TestSVGGenerator_Improved");
    const generator = await TestSVGGenerator.deploy();
    await generator.waitForDeployment();

    console.log("✅ Générateur déployé");

    // Tester différentes créatures
    const creatures = [
        {
            name: "Epic Guardian",
            class: 4, // Guardian
            rarity: 3, // Epic
            level: 5,
            health: 158,
            attack: 124,
            defense: 168,
            speed: 106,
            magic: 118,
            luck: 110,
            colorScheme: "cosmic-purple",
            wins: 0,
            losses: 0
        },
        {
            name: "Shiny Warrior",
            class: 0, // Warrior
            rarity: 2, // Rare
            level: 3,
            health: 73,
            attack: 101,
            defense: 94,
            speed: 78,
            magic: 69,
            luck: 90,
            colorScheme: "purple-blue",
            wins: 0,
            losses: 0
        },
        {
            name: "Berserker",
            class: 3, // Berserker
            rarity: 0, // Common
            level: 1,
            health: 50,
            attack: 65,
            defense: 45,
            speed: 80,
            magic: 30,
            luck: 55,
            colorScheme: "default",
            wins: 0,
            losses: 0
        }
    ];

    for (let i = 0; i < creatures.length; i++) {
        const creature = creatures[i];
        console.log(`\n🧪 Test ${creature.name}...`);
        
        try {
            const svg = await generator.generateSVG(
                creature.name,
                creature.class,
                creature.rarity,
                creature.level,
                creature.health,
                creature.attack,
                creature.defense,
                creature.speed,
                creature.magic,
                creature.luck,
                creature.colorScheme,
                creature.wins,
                creature.losses
            );
            console.log(`✅ SVG généré pour ${creature.name}`);
            console.log(`📏 Taille: ${svg.length} caractères`);
            
            // Sauvegarder le SVG
            const fs = require('fs');
            const filename = `assets/improved_${creature.name.toLowerCase().replace(' ', '_')}.svg`;
            fs.writeFileSync(filename, svg);
            console.log(`💾 Sauvegardé: ${filename}`);
            
        } catch (error) {
            console.error(`❌ Erreur pour ${creature.name}:`, error);
        }
    }

    console.log("\n🎉 Test terminé !");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});