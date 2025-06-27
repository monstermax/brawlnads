import { ethers } from "hardhat";

async function main() {
    console.log("🧪 Test du générateur SVG amélioré (créatures)...");
    
    try {
        // Déployer le contrat de test amélioré
        console.log("📦 Déploiement du contrat de test amélioré...");
        const TestSVGGenerator = await ethers.getContractFactory("TestSVGGenerator_Improved");
        const testContract = await TestSVGGenerator.deploy();
        await testContract.waitForDeployment();
        
        console.log("✅ Contrat de test amélioré déployé");
        
        // Tester la génération SVG avec les nouvelles fonctions
        const testCases = [
            { func: "generateWarriorSVG", name: "Warrior Alpha", class: "Warrior" },
            { func: "generateTestSVG", name: "Shadow Assassin", class: "Assassin" },
            { func: "generateMageSVG", name: "Arcane Mage", class: "Mage" },
            { func: "generateBerserkerSVG", name: "Rage Berserker", class: "Berserker" },
            { func: "generateGuardianSVG", name: "Shield Guardian", class: "Guardian" }
        ];
        
        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            console.log(`\n🔍 Test ${i + 1}: ${testCase.name} (${testCase.class})`);
            
            try {
                // Générer le SVG
                const svgResult = await (testContract as any)[testCase.func]();
                
                console.log("✅ SVG généré avec succès");
                console.log("  - Longueur:", svgResult.length, "caractères");
                console.log("  - Taille:", svgResult.includes('width="400"') ? "✅ 400x400px" : "❌ Autre taille");
                
                // Analyser les éléments de créature
                const eyeCount = (svgResult.match(/<circle[^>]*fill="#FFFFFF"/g) || []).length;
                const pupilCount = (svgResult.match(/<circle[^>]*fill="#000000"/g) || []).length;
                const bodyShapes = svgResult.includes('<rect') || svgResult.includes('<ellipse') || svgResult.includes('<polygon');
                const mouth = svgResult.includes('<path d="M') || svgResult.includes('<ellipse cx="200" cy="210"');
                const accessories = svgResult.includes('transform=');
                const gradients = svgResult.includes('linearGradient');
                const statsPanel = svgResult.includes('font-family');
                
                console.log("  - Yeux blancs:", eyeCount, "cercles");
                console.log("  - Pupilles noires:", pupilCount, "cercles");
                console.log("  - Corps (forme):", bodyShapes ? "✅ OUI" : "❌ NON");
                console.log("  - Bouche:", mouth ? "✅ OUI" : "❌ NON");
                console.log("  - Accessoires de classe:", accessories ? "✅ OUI" : "❌ NON");
                console.log("  - Dégradés Monad:", gradients ? "✅ OUI" : "❌ NON");
                console.log("  - Panneau stats:", statsPanel ? "✅ OUI" : "❌ NON");
                
                // Vérifier les couleurs Monad
                const monadColors = svgResult.includes('#836EF9') || svgResult.includes('#200052') || svgResult.includes('#A0055D');
                console.log("  - Couleurs Monad:", monadColors ? "✅ OUI" : "❌ NON");
                
                // Vérifier les effets de rareté
                if (svgResult.includes('animate')) {
                    console.log("  - Effets de rareté:", "✅ Animations");
                } else if (svgResult.includes('filter="url(#glow)"')) {
                    console.log("  - Effets de rareté:", "✅ Effet de lueur");
                } else {
                    console.log("  - Effets de rareté:", "✅ Design de base");
                }
                
                // Sauvegarder le SVG pour inspection
                const fs = require('fs');
                const path = require('path');
                const filename = `improved_${testCase.name.toLowerCase().replace(' ', '_')}.svg`;
                const outputPath = path.join(__dirname, '../assets/', filename);
                fs.writeFileSync(outputPath, svgResult);
                console.log(`💾 SVG sauvegardé: ${outputPath}`);
                
                // Évaluation globale
                const creatureScore = eyeCount + pupilCount + (bodyShapes ? 1 : 0) + (mouth ? 1 : 0) + (accessories ? 1 : 0);
                if (creatureScore >= 4) {
                    console.log("🎉 Évaluation: ✅ RESSEMBLE À UNE CRÉATURE!");
                } else {
                    console.log("⚠️ Évaluation: ❌ Ne ressemble pas assez à une créature");
                }
                
            } catch (error) {
                console.error(`❌ Erreur pour ${testCase.name}:`, error);
            }
        }
        
        console.log("\n🎉 Test du générateur SVG amélioré terminé!");
        console.log("✅ Les nouveaux Monanimals devraient ressembler à de vraies créatures avec:");
        console.log("  - Yeux expressifs style grenouille Monad");
        console.log("  - Corps avec formes géométriques selon la classe");
        console.log("  - Bouches expressives selon la personnalité");
        console.log("  - Accessoires uniques par classe");
        console.log("  - Couleurs et dégradés Monad");
        console.log("  - Effets de rareté appropriés");
        console.log("📁 Vérifiez les fichiers SVG dans contracts/assets/");
        
    } catch (error) {
        console.error("❌ Erreur:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Erreur:", error);
        process.exit(1);
    });