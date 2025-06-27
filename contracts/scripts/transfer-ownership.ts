import { ethers } from "hardhat";

async function main() {
    console.log("🔐 Transfert d'ownership du MonanimalNFT au nouveau BattleArena...");
    
    // Adresses des contrats
    const monanimalAddress = "0x3Bc317a2708CCd8f1bd796be8940f9D271b478D6";
    const newBattleArenaAddress = "0x866d9ca06E31c707eB39376e2feD624C571c3e52";
    
    // Obtenir le signataire (deployer)
    const [deployer] = await ethers.getSigners();
    console.log("Compte deployer:", deployer.address);
    
    try {
        // Obtenir le contrat MonanimalNFT
        const MonanimalNFT = await ethers.getContractFactory("contracts/MonanimalNFT_Updated.sol:MonanimalNFT");
        const monanimalContract = MonanimalNFT.attach(monanimalAddress);
        
        // Vérifier l'owner actuel
        const currentOwner = await (monanimalContract as any).owner();
        console.log("Owner actuel du MonanimalNFT:", currentOwner);
        console.log("Deployer address:", deployer.address);
        console.log("Nouveau BattleArena:", newBattleArenaAddress);
        
        if (currentOwner.toLowerCase() === deployer.address.toLowerCase()) {
            console.log("✅ Le deployer est bien l'owner, procédure de transfert...");
            
            // Transférer l'ownership
            const tx = await (monanimalContract as any).transferOwnership(newBattleArenaAddress);
            console.log("📤 Transaction de transfert envoyée:", tx.hash);
            
            // Attendre la confirmation
            await tx.wait();
            console.log("✅ Transfert d'ownership confirmé!");
            
            // Vérifier le nouveau owner
            const newOwner = await (monanimalContract as any).owner();
            console.log("Nouveau owner:", newOwner);
            
            if (newOwner.toLowerCase() === newBattleArenaAddress.toLowerCase()) {
                console.log("🎉 Transfert d'ownership réussi!");
                console.log("Le BattleArena peut maintenant gérer les Monanimals pour les combats");
            } else {
                console.log("❌ Erreur: Le transfert n'a pas fonctionné correctement");
            }
        } else if (currentOwner.toLowerCase() === newBattleArenaAddress.toLowerCase()) {
            console.log("✅ L'ownership a déjà été transféré au nouveau BattleArena!");
        } else {
            console.log("❌ Le deployer n'est pas l'owner actuel");
            console.log("Owner actuel:", currentOwner);
            console.log("Il faut que l'owner actuel fasse le transfert");
        }
        
    } catch (error) {
        console.error("❌ Erreur lors du transfert d'ownership:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Erreur:", error);
        process.exit(1);
    });