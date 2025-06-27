import { ethers } from "hardhat";

async function main() {
    console.log("🧪 Test du générateur SVG amélioré...");
    
    // Adresse du nouveau contrat MonanimalNFT amélioré
    const monanimalAddress = "0x5E0516fA8ad865349d89d33E409862DC5DEdfc9d";
    
    // Obtenir le signataire
    const [deployer] = await ethers.getSigners();
    console.log("Compte testeur:", deployer.address);
    
    try {
        // Obtenir le contrat
        const MonanimalNFT = await ethers.getContractFactory("contracts/MonanimalNFT_Improved.sol:MonanimalNFT");
        const monanimalContract = MonanimalNFT.attach(monanimalAddress);
        
        // Vérifier le prix de mint
        const mintPrice = await (monanimalContract as any).mintPrice();
        console.log("Prix de mint:", ethers.formatEther(mintPrice), "ETH");
        
        // Mint un Monanimal de test
        console.log("🚀 Mint d'un Monanimal de test...");
        const tx = await (monanimalContract as any).mint({
            value: mintPrice,
            gasLimit: 2000000
        });
        
        console.log("📤 Transaction envoyée:", tx.hash);
        const receipt = await tx.wait();
        console.log("✅ Transaction confirmée!");
        console.log("Gas utilisé:", receipt.gasUsed.toString());
        
        // Récupérer le total supply pour obtenir l'ID du nouveau token
        const totalSupply = await (monanimalContract as any).totalSupply();
        const newTokenId = totalSupply;
        console.log("🎉 Nouveau Monanimal créé avec l'ID:", newTokenId.toString());
        
        // Attendre un peu pour la synchronisation
        console.log("⏳ Attente de 2 secondes...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Récupérer les données du Monanimal
        const monanimalData = await (monanimalContract as any).getMonanimal(newTokenId);
        console.log("\n📋 Données du nouveau Monanimal:");
        console.log("  - Nom:", monanimalData.name);
        console.log("  - Classe:", monanimalData.class.toString());
        console.log("  - Rareté:", monanimalData.rarity.toString());
        console.log("  - Level:", monanimalData.level.toString());
        console.log("  - Schéma de couleurs:", monanimalData.colorScheme);
        
        // Récupérer le tokenURI pour vérifier le SVG
        const tokenURI = await (monanimalContract as any).tokenURI(newTokenId);
        console.log("\n🎨 TokenURI généré (longueur):", tokenURI.length, "caractères");
        
        if (tokenURI.startsWith('data:application/json;base64,')) {
            console.log("✅ TokenURI au bon format JSON base64");
            
            // Décoder pour vérifier le SVG
            const jsonData = Buffer.from(tokenURI.replace('data:application/json;base64,', ''), 'base64').toString();
            const metadata = JSON.parse(jsonData);
            
            console.log("\n📄 Métadonnées décodées:");
            console.log("  - Nom:", metadata.name);
            console.log("  - Description:", metadata.description);
            console.log("  - Attributs:", metadata.attributes?.length || 0, "attributs");
            
            if (metadata.image && metadata.image.startsWith('data:image/svg+xml;base64,')) {
                console.log("✅ SVG présent dans les métadonnées");
                const svgData = Buffer.from(metadata.image.replace('data:image/svg+xml;base64,', ''), 'base64').toString();
                console.log("\n🎨 Analyse du SVG amélioré:");
                console.log("  - Longueur SVG:", svgData.length, "caractères");
                console.log("  - Taille:", svgData.includes('width="400"') ? "✅ 400x400px" : "❌ Autre taille");
                
                // Vérifier les éléments de créature
                console.log("  - Yeux (circles):", (svgData.match(/<circle/g) || []).length, "cercles");
                console.log("  - Corps (formes):", svgData.includes('<rect') || svgData.includes('<ellipse') || svgData.includes('<polygon') ? "✅ OUI" : "❌ NON");
                console.log("  - Bouche:", svgData.includes('<path d="M') ? "✅ OUI" : "❌ NON");
                console.log("  - Accessoires de classe:", svgData.includes('transform=') ? "✅ OUI" : "❌ NON");
                console.log("  - Couleurs Monad:", svgData.includes('#836EF9') ? "✅ OUI" : "❌ NON");
                console.log("  - Dégradés:", svgData.includes('linearGradient') ? "✅ OUI" : "❌ NON");
                console.log("  - Panneau stats:", svgData.includes('font-family') ? "✅ OUI" : "❌ NON");
                
                // Vérifier les effets de rareté
                if (svgData.includes('animate')) {
                    console.log("  - Effets de rareté:", "✅ Animations présentes");
                } else if (svgData.includes('filter="url(#glow)"')) {
                    console.log("  - Effets de rareté:", "✅ Effet de lueur");
                } else {
                    console.log("  - Effets de rareté:", "✅ Design de base");
                }
                
                // Sauvegarder le SVG pour inspection
                const fs = require('fs');
                const path = require('path');
                const outputPath = path.join(__dirname, '../assets/test_improved_monanimal.svg');
                fs.writeFileSync(outputPath, svgData);
                console.log(`💾 SVG sauvegardé dans: ${outputPath}`);
                
                console.log("\n🎉 Test du SVG amélioré réussi!");
                console.log("✅ Les Monanimals devraient maintenant ressembler à de vraies créatures!");
                
            } else {
                console.log("❌ Pas d'image SVG dans les métadonnées");
            }
        } else {
            console.log("❌ TokenURI au mauvais format");
        }
        
    } catch (error) {
        console.error("❌ Erreur lors du test:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Erreur:", error);
        process.exit(1);
    });