import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
    console.log("🔄 Migration vers BattleArenaOptimized...");

    // Obtenir le déployeur
    const [deployer] = await ethers.getSigners();
    console.log("Migration avec le compte:", deployer.address);
    console.log("Solde du compte:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

    // Charger la configuration existante
    const configPath = path.join(__dirname, "../frontend/src/config/contracts.json");
    let existingConfig;
    
    try {
        existingConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        console.log("✅ Configuration existante chargée");
    } catch (error) {
        console.error("❌ Erreur lors du chargement de la configuration:", error);
        process.exit(1);
    }

    const monanimalAddress = existingConfig.contracts.MonanimalNFT.address;
    const weaponAddress = existingConfig.contracts.WeaponNFT.address;
    const artifactAddress = existingConfig.contracts.ArtifactNFT.address;

    console.log("\n📋 Adresses des contrats existants:");
    console.log("MonanimalNFT:", monanimalAddress);
    console.log("WeaponNFT:", weaponAddress);
    console.log("ArtifactNFT:", artifactAddress);

    // Déployer BattleArenaOptimized
    console.log("\n⚔️ Déploiement de BattleArenaOptimized...");
    const BattleArenaOptimized = await ethers.getContractFactory("BattleArenaOptimized");
    const battleArenaOptimized = await BattleArenaOptimized.deploy(
        monanimalAddress,
        weaponAddress,
        artifactAddress
    );
    await battleArenaOptimized.waitForDeployment();
    const newArenaAddress = await battleArenaOptimized.getAddress();
    console.log("✅ BattleArenaOptimized déployé à:", newArenaAddress);

    // Transférer les ownerships vers le nouveau contrat
    console.log("\n🔐 Transfert des permissions...");
    
    try {
        // Récupérer les instances des contrats existants
        const MonanimalNFT = await ethers.getContractFactory("contracts/MonanimalNFT_Updated.sol:MonanimalNFT");
        const monanimalContract = MonanimalNFT.attach(monanimalAddress);
        
        const WeaponNFT = await ethers.getContractFactory("WeaponNFT");
        const weaponContract = WeaponNFT.attach(weaponAddress);
        
        const ArtifactNFT = await ethers.getContractFactory("ArtifactNFT");
        const artifactContract = ArtifactNFT.attach(artifactAddress);

        // Vérifier qui est le propriétaire actuel
        const monanimalOwner = await monanimalContract.owner();
        const weaponOwner = await weaponContract.owner();
        const artifactOwner = await artifactContract.owner();

        console.log("Propriétaire actuel MonanimalNFT:", monanimalOwner);
        console.log("Propriétaire actuel WeaponNFT:", weaponOwner);
        console.log("Propriétaire actuel ArtifactNFT:", artifactOwner);

        // Transférer les ownerships si le déployeur est le propriétaire
        if (monanimalOwner.toLowerCase() === deployer.address.toLowerCase()) {
            console.log("Transfert de l'ownership de MonanimalNFT...");
            await monanimalContract.transferOwnership(newArenaAddress);
            console.log("✅ MonanimalNFT ownership transféré");
        } else {
            console.log("⚠️ Le déployeur n'est pas le propriétaire de MonanimalNFT");
        }

        if (weaponOwner.toLowerCase() === deployer.address.toLowerCase()) {
            console.log("Transfert de l'ownership de WeaponNFT...");
            await weaponContract.transferOwnership(newArenaAddress);
            console.log("✅ WeaponNFT ownership transféré");
        } else {
            console.log("⚠️ Le déployeur n'est pas le propriétaire de WeaponNFT");
        }

        if (artifactOwner.toLowerCase() === deployer.address.toLowerCase()) {
            console.log("Transfert de l'ownership de ArtifactNFT...");
            await artifactContract.transferOwnership(newArenaAddress);
            console.log("✅ ArtifactNFT ownership transféré");
        } else {
            console.log("⚠️ Le déployeur n'est pas le propriétaire de ArtifactNFT");
        }

    } catch (error) {
        console.error("❌ Erreur lors du transfert des permissions:", error);
        console.log("⚠️ Vous devrez transférer manuellement les permissions");
    }

    // Mettre à jour la configuration
    const newConfig = {
        ...existingConfig,
        contracts: {
            ...existingConfig.contracts,
            BattleArena: {
                address: newArenaAddress,
                abi: "BattleArenaOptimized"
            }
        }
    };

    // Sauvegarder la nouvelle configuration
    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
    console.log("✅ Configuration frontend mise à jour");

    // Sauvegarder les informations de migration
    const migrationInfo = {
        timestamp: new Date().toISOString(),
        network: await ethers.provider.getNetwork(),
        deployer: deployer.address,
        oldBattleArena: existingConfig.contracts.BattleArena.address,
        newBattleArenaOptimized: newArenaAddress,
        gasOptimizations: [
            "Structure Battle simplifiée avec arrays fixes",
            "Suppression de l'historique des actions",
            "Algorithme de combat déterministe",
            "Calculs en mémoire au lieu de storage répété",
            "Types optimisés (uint32 pour timestamp)"
        ]
    };

    const migrationFile = path.join(__dirname, "../deployments", `migration-optimized-${Date.now()}.json`);
    fs.writeFileSync(migrationFile, JSON.stringify(migrationInfo, null, 2));

    console.log("\n🎉 Migration terminée avec succès!");
    console.log("================================");
    console.log("Ancien BattleArena:", existingConfig.contracts.BattleArena.address);
    console.log("Nouveau BattleArenaOptimized:", newArenaAddress);
    console.log("Économies de gas estimées: 60-80%");
    console.log("================================");
    
    console.log("\n📖 Prochaines étapes:");
    console.log("1. Testez le nouveau contrat avec quelques duels");
    console.log("2. Vérifiez que les fonctionnalités fonctionnent correctement");
    console.log("3. L'ancien contrat reste accessible si nécessaire");
    console.log("4. Informez les utilisateurs de la migration");

    console.log(`\n💾 Informations de migration sauvegardées: ${migrationFile}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Erreur lors de la migration:", error);
        process.exit(1);
    });