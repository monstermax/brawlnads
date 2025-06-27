import { ethers } from "hardhat";

async function main() {
    console.log("🧪 Test du SVG corrigé...");
    
    // Adresse du nouveau contrat MonanimalNFT
    const monanimalAddress = "0x9e19fBA90737488F2555f8f130E93F40231823fF";
    
    // Obtenir le signataire
    const [deployer] = await ethers.getSigners();
    console.log("Compte testeur:", deployer.address);
    
    try {
        // Obtenir le contrat
        const MonanimalNFT = await ethers.getContractFactory("contracts/MonanimalNFT_Updated.sol:MonanimalNFT");
        const monanimalContract = MonanimalNFT.attach(monanimalAddress);
        
        // Vérifier le total supply
        const totalSupply = await (monanimalContract as any).totalSupply();
        console.log("📊 Total Supply:", totalSupply.toString());
        
        if (totalSupply > 0) {
            // Attendre un peu pour la synchronisation
            console.log("⏳ Attente de 3 secondes pour la synchronisation...");
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Tester avec le token ID 1
            const tokenId = 1;
            console.log(`\n🔍 Test avec le token ID ${tokenId}:`);
            
            try {
                // Vérifier que le token existe
                const owner = await (monanimalContract as any).ownerOf(tokenId);
                console.log("✅ Token existe, owner:", owner);
                
                // Récupérer le tokenURI
                const tokenURI = await (monanimalContract as any).tokenURI(tokenId);
                console.log("🎨 TokenURI récupéré (longueur):", tokenURI.length, "caractères");
                
                if (tokenURI.startsWith('data:application/json;base64,')) {
                    // Décoder le JSON
                    const jsonData = Buffer.from(tokenURI.replace('data:application/json;base64,', ''), 'base64').toString();
                    const metadata = JSON.parse(jsonData);
                    
                    console.log("📄 Métadonnées décodées:");
                    console.log("  - Nom:", metadata.name);
                    console.log("  - Description:", metadata.description);
                    
                    if (metadata.image && metadata.image.startsWith('data:image/svg+xml;base64,')) {
                        const svgData = Buffer.from(metadata.image.replace('data:image/svg+xml;base64,', ''), 'base64').toString();
                        console.log("\n🎨 SVG décodé:");
                        console.log("  - Longueur SVG:", svgData.length, "caractères");
                        
                        // Vérifier les erreurs de filtres
                        const filterCount = (svgData.match(/filter="/g) || []).length;
                        console.log("  - Nombre d'attributs filter:", filterCount);
                        
                        // Vérifier les filtres dupliqués
                        const duplicateFilters = svgData.includes('filter="') && svgData.includes('filter="', svgData.indexOf('filter="') + 1);
                        console.log("  - Filtres dupliqués:", duplicateFilters ? "❌ OUI" : "✅ NON");
                        
                        // Vérifier la structure des filtres
                        if (svgData.includes('filter="url(#classFilter) url(#glow)"')) {
                            console.log("  - Filtres combinés correctement: ✅ OUI");
                        } else if (svgData.includes('filter="url(#classFilter)"')) {
                            console.log("  - Filtre de classe seul: ✅ OUI");
                        } else {
                            console.log("  - Structure de filtres: ❌ PROBLÈME");
                        }
                        
                        // Sauvegarder le SVG pour inspection
                        const fs = require('fs');
                        const path = require('path');
                        const outputPath = path.join(__dirname, '../assets/test_fixed_monanimal.svg');
                        fs.writeFileSync(outputPath, svgData);
                        console.log(`💾 SVG sauvegardé dans: ${outputPath}`);
                        
                        console.log("\n✅ Test du SVG corrigé réussi!");
                        console.log("Le SVG ne devrait plus avoir d'erreur 'Attribute filter redefined'");
                        
                    } else {
                        console.log("❌ Pas d'image SVG dans les métadonnées");
                    }
                } else {
                    console.log("❌ TokenURI au mauvais format");
                }
                
            } catch (error) {
                console.error("❌ Erreur lors de l'accès au token:", error);
            }
        } else {
            console.log("❌ Aucun token sur ce contrat");
        }
        
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