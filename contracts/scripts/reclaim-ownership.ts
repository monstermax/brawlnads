import { ethers } from "hardhat";

async function main() {
    console.log("🔄 Récupération de l'ownership depuis l'ancien BattleArena...");
    
    // Adresses des contrats
    const monanimalAddress = "0x3Bc317a2708CCd8f1bd796be8940f9D271b478D6";
    const oldBattleArenaAddress = "0xC21b1904850e47bF3E95D92C1Af7a162942d7b37";
    const newBattleArenaAddress = "0x866d9ca06E31c707eB39376e2feD624C571c3e52";
    
    // Obtenir le signataire (deployer)
    const [deployer] = await ethers.getSigners();
    console.log("Compte deployer:", deployer.address);
    
    try {
        // Obtenir l'ancien contrat BattleArena
        const BattleArena = await ethers.getContractFactory("BattleArenaOptimized");
        const oldBattleArenaContract = BattleArena.attach(oldBattleArenaAddress);
        
        // Obtenir le contrat MonanimalNFT
        const MonanimalNFT = await ethers.getContractFactory("contracts/MonanimalNFT_Updated.sol:MonanimalNFT");
        const monanimalContract = MonanimalNFT.attach(monanimalAddress);
        
        // Vérifier l'owner actuel
        const currentOwner = await (monanimalContract as any).owner();
        console.log("Owner actuel du MonanimalNFT:", currentOwner);
        
        if (currentOwner.toLowerCase() === oldBattleArenaAddress.toLowerCase()) {
            console.log("✅ L'ancien BattleArena est bien l'owner");
            
            // Vérifier si l'ancien BattleArena a une fonction pour transférer l'ownership
            try {
                // Essayer de récupérer l'ownership via l'ancien BattleArena
                console.log("🔄 Tentative de récupération de l'ownership...");
                
                // D'abord, essayons de voir si l'ancien BattleArena a une fonction transferOwnership
                const tx = await (oldBattleArenaContract as any).transferMonanimalOwnership(deployer.address);
                console.log("📤 Transaction de récupération envoyée:", tx.hash);
                
                await tx.wait();
                console.log("✅ Ownership récupéré!");
                
                // Vérifier le nouveau owner
                const newOwner = await (monanimalContract as any).owner();
                console.log("Nouveau owner:", newOwner);
                
                if (newOwner.toLowerCase() === deployer.address.toLowerCase()) {
                    console.log("🎉 Ownership récupéré avec succès!");
                    
                    // Maintenant transférer au nouveau BattleArena
                    console.log("🔄 Transfert au nouveau BattleArena...");
                    const transferTx = await (monanimalContract as any).transferOwnership(newBattleArenaAddress);
                    await transferTx.wait();
                    
                    const finalOwner = await (monanimalContract as any).owner();
                    if (finalOwner.toLowerCase() === newBattleArenaAddress.toLowerCase()) {
                        console.log("🎉 Transfert final réussi!");
                        console.log("Le nouveau BattleArena peut maintenant gérer les Monanimals");
                    }
                }
            } catch (error) {
                console.log("❌ L'ancien BattleArena n'a pas de fonction de transfert d'ownership");
                console.log("💡 Solution: Redéployer le MonanimalNFT et transférer l'ownership directement");
                
                // Alternative: redéployer le MonanimalNFT
                console.log("\n🔄 Redéploiement du MonanimalNFT...");
                const newMonanimalNFT = await MonanimalNFT.deploy();
                await newMonanimalNFT.waitForDeployment();
                const newMonanimalAddress = await newMonanimalNFT.getAddress();
                
                console.log("✅ Nouveau MonanimalNFT déployé à:", newMonanimalAddress);
                
                // Transférer l'ownership au nouveau BattleArena
                await newMonanimalNFT.transferOwnership(newBattleArenaAddress);
                console.log("✅ Ownership transféré au nouveau BattleArena");
                
                console.log("\n📝 IMPORTANT: Mettre à jour la configuration frontend avec la nouvelle adresse:");
                console.log("Nouvelle adresse MonanimalNFT:", newMonanimalAddress);
            }
        } else {
            console.log("❌ L'owner actuel n'est pas l'ancien BattleArena");
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