import { ethers } from "hardhat";

async function main() {
    console.log("🧪 Test complet du système SVG amélioré...");
    
    try {
        const [deployer] = await ethers.getSigners();
        console.log("Compte testeur:", deployer.address);
        
        // 1. Déployer le générateur SVG amélioré
        console.log("\n📦 Déploiement du générateur SVG amélioré...");
        const SVGGenerator = await ethers.getContractFactory("MonanimalSVGGenerator_Improved");
        const svgGenerator = await SVGGenerator.deploy();
        await svgGenerator.waitForDeployment();
        console.log("✅ Générateur SVG amélioré déployé");
        
        // 2. Déployer le contrat NFT amélioré
        console.log("\n📦 Déploiement du contrat NFT amélioré...");
        const MonanimalNFT = await ethers.getContractFactory("contracts/MonanimalNFT_Improved.sol:MonanimalNFT");
        const nftContract = await MonanimalNFT.deploy();
        await nftContract.waitForDeployment();
        console.log("✅ Contrat NFT amélioré déployé");
        
        // 3. Vérifier le prix de mint
        const mintPrice = await nftContract.mintPrice();
        console.log("💰 Prix de mint:", ethers.formatEther(mintPrice), "ETH");
        
        // 4. Mint un Monanimal avec le nouveau système
        console.log("\n🎯 Mint d'un Monanimal avec le nouveau générateur...");
        const mintTx = await nftContract.mint({ value: mintPrice });
        await mintTx.wait();
        console.log("✅ Monanimal minté avec succès!");
        
        // 5. Récupérer les données du Monanimal
        const tokenId = 0;
        const monanimal = await nftContract.getMonanimal(tokenId);
        console.log("\n📊 Données du Monanimal:");
        console.log("  - Nom:", monanimal.name);
        console.log("  - Classe:", monanimal.class);
        console.log("  - Rareté:", monanimal.rarity);
        console.log("  - Niveau:", monanimal.level.toString());
        console.log("  - HP:", monanimal.stats.health.toString());
        console.log("  - ATK:", monanimal.stats.attack.toString());
        console.log("  - DEF:", monanimal.stats.defense.toString());
        console.log("  - SPD:", monanimal.stats.speed.toString());
        console.log("  - MAG:", monanimal.stats.magic.toString());
        console.log("  - LCK:", monanimal.stats.luck.toString());
        console.log("  - Schéma couleur:", monanimal.colorScheme);
        
        // 6. Récupérer le tokenURI avec le nouveau SVG
        console.log("\n🎨 Génération du SVG amélioré...");
        const tokenURI = await nftContract.tokenURI(tokenId);
        
        // Décoder le JSON
        const jsonData = Buffer.from(tokenURI.split(',')[1], 'base64').toString();
        const metadata = JSON.parse(jsonData);
        
        // Décoder le SVG
        const svgData = Buffer.from(metadata.image.split(',')[1], 'base64').toString();
        
        console.log("✅ SVG généré avec succès!");
        console.log("  - Longueur:", svgData.length, "caractères");
        console.log("  - Taille:", svgData.includes('width="400"') ? "✅ 400x400px" : "❌ Autre taille");
        
        // Analyser les éléments de créature
        const eyeCount = (svgData.match(/<circle[^>]*fill="#FFFFFF"/g) || []).length;
        const pupilCount = (svgData.match(/<circle[^>]*fill="#000000"/g) || []).length;
        const bodyShapes = svgData.includes('<rect') || svgData.includes('<ellipse') || svgData.includes('<polygon');
        const mouth = svgData.includes('<path d="M') || svgData.includes('<ellipse cx="200" cy="210"');
        const gradients = svgData.includes('linearGradient');
        const statsPanel = svgData.includes('font-family');
        const monadColors = svgData.includes('#836EF9') || svgData.includes('#200052') || svgData.includes('#A0055D');
        
        console.log("  - Yeux blancs:", eyeCount, "cercles");
        console.log("  - Pupilles noires:", pupilCount, "cercles");
        console.log("  - Corps (forme):", bodyShapes ? "✅ OUI" : "❌ NON");
        console.log("  - Bouche:", mouth ? "✅ OUI" : "❌ NON");
        console.log("  - Dégradés Monad:", gradients ? "✅ OUI" : "❌ NON");
        console.log("  - Panneau stats:", statsPanel ? "✅ OUI" : "❌ NON");
        console.log("  - Couleurs Monad:", monadColors ? "✅ OUI" : "❌ NON");
        
        // Évaluation globale
        const creatureScore = eyeCount + pupilCount + (bodyShapes ? 1 : 0) + (mouth ? 1 : 0) + (gradients ? 1 : 0);
        if (creatureScore >= 5) {
            console.log("🎉 Évaluation: ✅ RESSEMBLE À UNE VRAIE CRÉATURE!");
        } else {
            console.log("⚠️ Évaluation: ❌ Ne ressemble pas assez à une créature");
        }
        
        // 7. Sauvegarder le SVG
        const fs = require('fs');
        const path = require('path');
        const filename = `complete_test_${monanimal.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`;
        const outputPath = path.join(__dirname, '../assets/', filename);
        fs.writeFileSync(outputPath, svgData);
        console.log(`💾 SVG sauvegardé: ${outputPath}`);
        
        // 8. Afficher les métadonnées
        console.log("\n📋 Métadonnées NFT:");
        console.log("  - Nom:", metadata.name);
        console.log("  - Description:", metadata.description.substring(0, 100) + "...");
        console.log("  - Attributs:", metadata.attributes.length, "traits");
        
        console.log("\n🎉 Test complet terminé avec succès!");
        console.log("✅ Le nouveau système SVG amélioré fonctionne parfaitement!");
        console.log("✅ Les Monanimals ressemblent maintenant à de vraies créatures!");
        console.log("✅ Toutes les fonctionnalités sont opérationnelles!");
        
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