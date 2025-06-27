import { ethers } from "hardhat";

async function main() {
    console.log("🔍 Vérification des Monanimals sur les contrats...");

    // Obtenir le signeur
    const [signer] = await ethers.getSigners();
    const address = signer.address;
    console.log("Adresse du wallet:", address);

    // Adresses des contrats
    const oldContractAddress = "0x45df6a3644BD73c94207d53cf49d0Bae2fd0eFde";
    const newContractAddress = "0x283d26C980bA801D6b6d60261ED1978c88A51a53";

    // ABI minimal pour les fonctions nécessaires
    const minimalABI = [
        "function balanceOf(address owner) view returns (uint256)",
        "function getOwnerMonanimals(address owner) view returns (uint256[])",
        "function getMonanimal(uint256 tokenId) view returns (tuple(string name, uint8 class, uint8 rarity, tuple(uint256 health, uint256 attack, uint256 defense, uint256 speed, uint256 magic, uint256 luck) stats, uint256 level, uint256 experience, uint256 wins, uint256 losses, bool isKO, uint256 lastBattleTime, string colorScheme, uint256 weaponId, uint256 artifactId))"
    ];

    try {
        console.log("\n📊 Vérification de l'ancien contrat...");
        console.log("Adresse:", oldContractAddress);
        
        const oldContract = new ethers.Contract(oldContractAddress, minimalABI, signer);
        
        try {
            const oldBalance = await oldContract.balanceOf(address);
            console.log("Balance ancien contrat:", oldBalance.toString());
            
            if (oldBalance > 0) {
                const oldMonanimals = await oldContract.getOwnerMonanimals(address);
                console.log("IDs des Monanimals (ancien):", oldMonanimals.map(id => id.toString()));
                
                // Afficher les détails du premier Monanimal
                if (oldMonanimals.length > 0) {
                    const firstMon = await oldContract.getMonanimal(oldMonanimals[0]);
                    console.log("Premier Monanimal (ancien):", {
                        name: firstMon.name,
                        level: firstMon.level.toString(),
                        wins: firstMon.wins.toString(),
                        losses: firstMon.losses.toString()
                    });
                }
            }
        } catch (error) {
            console.log("❌ Erreur lors de la lecture de l'ancien contrat:", error.message);
        }

        console.log("\n📊 Vérification du nouveau contrat...");
        console.log("Adresse:", newContractAddress);
        
        const newContract = new ethers.Contract(newContractAddress, minimalABI, signer);
        
        try {
            const newBalance = await newContract.balanceOf(address);
            console.log("Balance nouveau contrat:", newBalance.toString());
            
            if (newBalance > 0) {
                const newMonanimals = await newContract.getOwnerMonanimals(address);
                console.log("IDs des Monanimals (nouveau):", newMonanimals.map(id => id.toString()));
                
                // Afficher les détails du premier Monanimal
                if (newMonanimals.length > 0) {
                    const firstMon = await newContract.getMonanimal(newMonanimals[0]);
                    console.log("Premier Monanimal (nouveau):", {
                        name: firstMon.name,
                        level: firstMon.level.toString(),
                        wins: firstMon.wins.toString(),
                        losses: firstMon.losses.toString()
                    });
                }
            }
        } catch (error) {
            console.log("❌ Erreur lors de la lecture du nouveau contrat:", error.message);
        }

    } catch (error) {
        console.error("❌ Erreur générale:", error);
    }

    console.log("\n📋 Résumé:");
    console.log("- Si vous voyez des Monanimals dans l'ancien contrat, ils sont perdus");
    console.log("- Si vous voyez des Monanimals dans le nouveau contrat, c'est normal");
    console.log("- Si le frontend affiche encore les anciens, c'est un problème de cache");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Erreur:", error);
        process.exit(1);
    });