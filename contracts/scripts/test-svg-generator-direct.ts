import { ethers } from "hardhat";

async function main() {
    console.log("🧪 Test direct du générateur SVG...");
    
    try {
        // Déployer le contrat de test SVG
        console.log("📦 Déploiement du contrat de test...");
        const TestSVGGenerator = await ethers.getContractFactory("TestSVGGenerator");
        const testContract = await TestSVGGenerator.deploy();
        await testContract.waitForDeployment();
        
        console.log("✅ Contrat de test déployé");
        
        // Tester la génération SVG avec les fonctions prédéfinies
        const testCases = [
            { func: "generateWarriorSVG", name: "Warrior Alpha" },
            { func: "generateTestSVG", name: "Shadow Assassin" },
            { func: "generateMageSVG", name: "Arcane Mage" }
        ];
        
        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            console.log(`\n🔍 Test ${i + 1}: ${testCase.name}`);
            
            try {
                // Générer le SVG
                const svgResult = await (testContract as any)[testCase.func]();
                
                console.log("✅ SVG généré avec succès");
                console.log("  - Longueur:", svgResult.length, "caractères");
                
                // Vérifier les erreurs de filtres
                const filterMatches = svgResult.match(/filter="/g);
                const filterCount = filterMatches ? filterMatches.length : 0;
                console.log("  - Nombre d'attributs filter:", filterCount);
                
                // Vérifier les filtres dupliqués sur le même élément
                const lines = svgResult.split('\n');
                let duplicateFound = false;
                for (const line of lines) {
                    const filterMatches = line.match(/filter="/g);
                    if (filterMatches && filterMatches.length > 1) {
                        duplicateFound = true;
                        console.log("  - Ligne avec filtres dupliqués:", line.trim());
                        break;
                    }
                }
                
                console.log("  - Filtres dupliqués:", duplicateFound ? "❌ OUI" : "✅ NON");
                
                // Vérifier la structure des filtres combinés
                if (svgResult.includes('filter="url(#classFilter) url(#glow)"')) {
                    console.log("  - Filtres combinés correctement: ✅ OUI");
                } else if (svgResult.includes('filter="url(#classFilter)"')) {
                    console.log("  - Filtre de classe seul: ✅ OUI");
                } else {
                    console.log("  - Structure de filtres: ❌ PROBLÈME");
                }
                
                // Sauvegarder le SVG pour inspection
                const fs = require('fs');
                const path = require('path');
                const outputPath = path.join(__dirname, `../assets/test_${testCase.name.toLowerCase().replace(' ', '_')}.svg`);
                fs.writeFileSync(outputPath, svgResult);
                console.log(`💾 SVG sauvegardé: ${outputPath}`);
                
            } catch (error) {
                console.error(`❌ Erreur pour ${testCase.name}:`, error);
            }
        }
        
        console.log("\n🎉 Test du générateur SVG terminé!");
        console.log("✅ Le problème des filtres dupliqués devrait être corrigé");
        console.log("📁 Vérifiez les fichiers SVG générés dans contracts/assets/");
        
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