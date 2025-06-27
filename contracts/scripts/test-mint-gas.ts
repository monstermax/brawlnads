import { ethers } from "hardhat";

async function main() {
    console.log("🧪 Test du mint avec gas limit élevé...");
    
    // Adresse du contrat MonanimalNFT
    const monanimalAddress = "0xceeC6A38923CF5E7f88966B03298f239C121dFfF";
    
    // Obtenir le signataire
    const [deployer] = await ethers.getSigners();
    console.log("Compte testeur:", deployer.address);
    
    try {
        // Obtenir le contrat
        const MonanimalNFT = await ethers.getContractFactory("contracts/MonanimalNFT_Updated.sol:MonanimalNFT");
        const monanimalContract = MonanimalNFT.attach(monanimalAddress);
        
        // Vérifier le prix de mint
        const mintPrice = await (monanimalContract as any).mintPrice();
        console.log("Prix de mint:", ethers.formatEther(mintPrice), "ETH");
        
        // Vérifier le total supply avant
        const totalSupplyBefore = await (monanimalContract as any).totalSupply();
        console.log("Total supply avant mint:", totalSupplyBefore.toString());
        
        // Estimer le gas nécessaire
        console.log("🔍 Estimation du gas nécessaire...");
        const gasEstimate = await (monanimalContract as any).mint.estimateGas({
            value: mintPrice
        });
        console.log("Gas estimé:", gasEstimate.toString());
        
        // Mint avec gas limit de 2M
        console.log("🚀 Mint en cours avec gas limit de 2M...");
        const tx = await (monanimalContract as any).mint({
            value: mintPrice,
            gasLimit: 2_000_000 // 2M gas limit
        });
        
        console.log("📤 Transaction envoyée:", tx.hash);
        console.log("⏳ Attente de la confirmation...");
        
        const receipt = await tx.wait();
        console.log("✅ Transaction confirmée!");
        console.log("Gas utilisé:", receipt.gasUsed.toString());
        console.log("Block number:", receipt.blockNumber);
        
        // Vérifier le total supply après
        const totalSupplyAfter = await (monanimalContract as any).totalSupply();
        console.log("Total supply après mint:", totalSupplyAfter.toString());
        
        if (totalSupplyAfter > totalSupplyBefore) {
            const newTokenId = totalSupplyAfter;
            console.log("🎉 Nouveau Monanimal minté avec l'ID:", newTokenId.toString());
            
            // Récupérer les données du nouveau Monanimal
            const monanimalData = await (monanimalContract as any).getMonanimal(newTokenId);
            console.log("📋 Données du nouveau Monanimal:");
            console.log("  - Nom:", monanimalData.name);
            console.log("  - Classe:", monanimalData.class.toString());
            console.log("  - Rareté:", monanimalData.rarity.toString());
            console.log("  - Level:", monanimalData.level.toString());
            
            // Récupérer le tokenURI pour vérifier le SVG
            const tokenURI = await (monanimalContract as any).tokenURI(newTokenId);
            console.log("🎨 TokenURI généré (longueur):", tokenURI.length, "caractères");
            
            if (tokenURI.startsWith('data:application/json;base64,')) {
                console.log("✅ TokenURI au bon format JSON base64");
                
                // Décoder pour vérifier le SVG
                const jsonData = Buffer.from(tokenURI.replace('data:application/json;base64,', ''), 'base64').toString();
                const metadata = JSON.parse(jsonData);
                
                if (metadata.image && metadata.image.startsWith('data:image/svg+xml;base64,')) {
                    console.log("✅ SVG présent dans les métadonnées");
                    const svgData = Buffer.from(metadata.image.replace('data:image/svg+xml;base64,', ''), 'base64').toString();
                    console.log("🎨 SVG généré (longueur):", svgData.length, "caractères");
                    console.log("✅ Mint avec SVG artistique réussi!");
                } else {
                    console.log("❌ Pas de SVG dans les métadonnées");
                }
            } else {
                console.log("❌ TokenURI au mauvais format");
            }
        } else {
            console.log("❌ Le mint n'a pas créé de nouveau token");
        }
        
    } catch (error: any) {
        console.error("❌ Erreur lors du test de mint:", error);
        
        if (error.message.includes("out of gas")) {
            console.log("💡 Suggestion: Augmenter encore plus le gas limit");
        } else if (error.message.includes("insufficient funds")) {
            console.log("💡 Suggestion: Vérifier le solde du compte");
        } else {
            console.log("💡 Erreur inattendue, vérifier les logs détaillés");
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Erreur:", error);
        process.exit(1);
    });