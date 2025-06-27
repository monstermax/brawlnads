import { ethers } from "hardhat";

async function main() {
    console.log("🧪 Test du nouveau SVG on-chain...");
    
    // Adresse du nouveau contrat MonanimalNFT déployé
    const monanimalAddress = "0x9e19fBA90737488F2555f8f130E93F40231823fF";
    
    // Obtenir le contrat
    const MonanimalNFT = await ethers.getContractFactory("contracts/MonanimalNFT_Updated.sol:MonanimalNFT");
    const monanimalContract = MonanimalNFT.attach(monanimalAddress);
    
    try {
        // Vérifier le total supply
        const totalSupply = await (monanimalContract as any).totalSupply();
        console.log(`📊 Total Supply: ${totalSupply}`);
        
        if (totalSupply > 0) {
            // Tester avec le premier token (ID 1)
            const tokenId = 1;
            console.log(`\n🔍 Test avec le token ID ${tokenId}:`);
            
            // Récupérer les données du Monanimal
            const monanimalData = await (monanimalContract as any).getMonanimal(tokenId);
            console.log("📋 Données du Monanimal:");
            console.log("  - Nom:", monanimalData.name);
            console.log("  - Classe:", monanimalData.class);
            console.log("  - Rareté:", monanimalData.rarity);
            console.log("  - Level:", monanimalData.level.toString());
            
            // Récupérer le tokenURI (contient le SVG)
            const tokenURI = await (monanimalContract as any).tokenURI(tokenId);
            console.log("\n🎨 TokenURI récupéré:");
            console.log("Longueur:", tokenURI.length, "caractères");
            
            if (tokenURI.startsWith('data:application/json;base64,')) {
                // Décoder le JSON
                const jsonData = Buffer.from(tokenURI.replace('data:application/json;base64,', ''), 'base64').toString();
                const metadata = JSON.parse(jsonData);
                
                console.log("\n📄 Métadonnées décodées:");
                console.log("  - Nom:", metadata.name);
                console.log("  - Description:", metadata.description);
                console.log("  - Attributs:", metadata.attributes?.length || 0, "attributs");
                
                if (metadata.image && metadata.image.startsWith('data:image/svg+xml;base64,')) {
                    const svgData = Buffer.from(metadata.image.replace('data:image/svg+xml;base64,', ''), 'base64').toString();
                    console.log("\n🎨 SVG décodé:");
                    console.log("  - Longueur SVG:", svgData.length, "caractères");
                    console.log("  - Contient 'brawlnads':", svgData.includes('brawlnads') ? "✅ OUI" : "❌ NON");
                    console.log("  - Contient 'feColorMatrix':", svgData.includes('feColorMatrix') ? "✅ OUI" : "❌ NON");
                    console.log("  - Contient 'animate':", svgData.includes('animate') ? "✅ OUI" : "❌ NON");
                    console.log("  - Taille:", svgData.includes('1024') ? "✅ 1024x1024" : "❌ Autre taille");
                    
                    // Sauvegarder le SVG pour inspection
                    const fs = require('fs');
                    const path = require('path');
                    const outputPath = path.join(__dirname, '../assets/test_onchain_monanimal.svg');
                    fs.writeFileSync(outputPath, svgData);
                    console.log(`💾 SVG sauvegardé dans: ${outputPath}`);
                    
                    // Afficher un aperçu du début du SVG
                    console.log("\n🔍 Aperçu du SVG (premiers 200 caractères):");
                    console.log(svgData.substring(0, 200) + "...");
                } else {
                    console.log("❌ Pas d'image SVG trouvée dans les métadonnées");
                }
            } else {
                console.log("❌ TokenURI n'est pas au format JSON base64 attendu");
                console.log("Format reçu:", tokenURI.substring(0, 50) + "...");
            }
        } else {
            console.log("❌ Aucun token minté sur ce contrat");
            console.log("💡 Mintez d'abord un Monanimal sur le frontend pour tester");
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