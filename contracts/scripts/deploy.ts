import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

// Parse deployment flags from environment variables
const deployAll = process.env.DEPLOY_ALL === 'true';
const shouldDeployBattleArena = process.env.DEPLOY_BATTLEARENA === 'true' || deployAll;
const deployMonanimal = process.env.DEPLOY_MONANIMAL === 'true' || deployAll;
const deployWeapon = process.env.DEPLOY_WEAPON === 'true' || deployAll;
const deployArtifact = process.env.DEPLOY_ARTIFACT === 'true' || deployAll;

async function main() {
    console.log("🚀 Déploiement sélectif des contrats BrawlNads...");
    
    // Afficher les flags actifs
    console.log("📋 Flags de déploiement:");
    console.log("  DEPLOY_ALL:", deployAll);
    console.log("  DEPLOY_BATTLEARENA:", shouldDeployBattleArena);
    console.log("  DEPLOY_MONANIMAL:", deployMonanimal);
    console.log("  DEPLOY_WEAPON:", deployWeapon);
    console.log("  DEPLOY_ARTIFACT:", deployArtifact);

    // Obtenir le déployeur
    const [deployer] = await ethers.getSigners();
    console.log("\nDéploiement avec le compte:", deployer.address);
    console.log("Solde du compte:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

    const deployedContracts: Record<string, any> = {};

    // Charger la configuration existante si elle existe
    let existingConfig: any = {};
    const configPath = path.join(__dirname, "../../frontend/src/config/contracts.json");
    
    try {
        if (fs.existsSync(configPath)) {
            existingConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            console.log("✅ Configuration existante chargée");
        }
    } catch (error) {
        console.log("⚠️ Pas de configuration existante trouvée, création d'une nouvelle");
    }

    // Adresses par défaut (depuis la config existante ou vides)
    let arenaAddress = existingConfig.contracts?.BattleArena?.address || '';
    let weaponAddress = existingConfig.contracts?.WeaponNFT?.address || '';
    let artifactAddress = existingConfig.contracts?.ArtifactNFT?.address || '';
    let monanimalAddress = existingConfig.contracts?.MonanimalNFT?.address || '';

    // Déploiement conditionnel des contrats
    if (deployMonanimal) {
        console.log("\n🐾 Déploiement de MonanimalNFT...");
        deployedContracts['MonanimalNFT'] = await deployMonanimalNFT();
        monanimalAddress = deployedContracts['MonanimalNFT'].address;
    } else if (monanimalAddress) {
        console.log("📌 Utilisation de MonanimalNFT existant:", monanimalAddress);
    }

    if (deployWeapon) {
        console.log("\n⚔️ Déploiement de WeaponNFT...");
        deployedContracts['WeaponNFT'] = await deployWeaponNFT();
        weaponAddress = deployedContracts['WeaponNFT'].address;
    } else if (weaponAddress) {
        console.log("📌 Utilisation de WeaponNFT existant:", weaponAddress);
    }

    if (deployArtifact) {
        console.log("\n🔮 Déploiement de ArtifactNFT...");
        deployedContracts['ArtifactNFT'] = await deployArtifactNFT();
        artifactAddress = deployedContracts['ArtifactNFT'].address;
    } else if (artifactAddress) {
        console.log("📌 Utilisation de ArtifactNFT existant:", artifactAddress);
    }

    if (shouldDeployBattleArena) {
        if (!monanimalAddress || !weaponAddress || !artifactAddress) {
            console.error("❌ Impossible de déployer BattleArena sans les adresses des autres contrats");
            console.log("💡 Utilisez --all pour déployer tous les contrats ou assurez-vous que les autres contrats existent");
            process.exit(1);
        }
        
        console.log("\n⚔️ Déploiement de BattleArenaOptimized...");
        deployedContracts['BattleArenaOptimized'] = await deployBattleArena(monanimalAddress, weaponAddress, artifactAddress);
        arenaAddress = deployedContracts['BattleArenaOptimized'].address;
    } else if (arenaAddress) {
        console.log("📌 Utilisation de BattleArena existant:", arenaAddress);
    }

    // Configuration des permissions (seulement si les contrats ont été redéployés)
    if (deployedContracts['MonanimalNFT'] && arenaAddress) {
        console.log("\n🔐 Configuration des permissions MonanimalNFT...");
        try {
            await deployedContracts['MonanimalNFT'].contract.transferOwnership(arenaAddress);
            console.log("✅ Ownership de MonanimalNFT transféré à BattleArenaOptimized");
        } catch (error) {
            console.log("⚠️ Erreur lors du transfert d'ownership MonanimalNFT:", error);
        }
    }

    if (deployedContracts['WeaponNFT'] && arenaAddress) {
        console.log("🔐 Configuration des permissions WeaponNFT...");
        try {
            await deployedContracts['WeaponNFT'].contract.transferOwnership(arenaAddress);
            console.log("✅ Ownership de WeaponNFT transféré à BattleArenaOptimized");
        } catch (error) {
            console.log("⚠️ Erreur lors du transfert d'ownership WeaponNFT:", error);
        }
    }

    if (deployedContracts['ArtifactNFT'] && arenaAddress) {
        console.log("🔐 Configuration des permissions ArtifactNFT...");
        try {
            await deployedContracts['ArtifactNFT'].contract.transferOwnership(arenaAddress);
            console.log("✅ Ownership de ArtifactNFT transféré à BattleArenaOptimized");
        } catch (error) {
            console.log("⚠️ Erreur lors du transfert d'ownership ArtifactNFT:", error);
        }
    }

    // Résumé du déploiement
    console.log("\n📋 Résumé du déploiement:");
    console.log("================================");
    
    const contractsDeployed = Object.keys(deployedContracts);
    if (contractsDeployed.length === 0) {
        console.log("ℹ️ Aucun nouveau contrat déployé");
    } else {
        console.log("🆕 Nouveaux contrats déployés:");
        contractsDeployed.forEach(name => {
            console.log(`  ${name}: ${deployedContracts[name].address}`);
        });
    }

    console.log("\n📍 Configuration finale:");
    console.log("MonanimalNFT:", monanimalAddress || "❌ Non configuré");
    console.log("WeaponNFT:", weaponAddress || "❌ Non configuré");
    console.log("ArtifactNFT:", artifactAddress || "❌ Non configuré");
    console.log("BattleArenaOptimized:", arenaAddress || "❌ Non configuré");

    console.log("\nNetwork:", (await ethers.provider.getNetwork()).name);
    console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);
    console.log("Deployer:", deployer.address);
    console.log("================================");

    // Sauvegarder seulement si des contrats ont été déployés
    if (contractsDeployed.length > 0) {
        const deploymentDir = path.join(__dirname, "../deployments");
        if (!fs.existsSync(deploymentDir)) {
            fs.mkdirSync(deploymentDir, { recursive: true });
        }

        const networkName = (await ethers.provider.getNetwork()).name || "unknown";
        const deploymentFile = path.join(deploymentDir, `${networkName}-${Date.now()}.json`);

        const contractAddresses = {
            network: await ethers.provider.getNetwork(),
            deployer: deployer.address,
            deploymentTime: new Date().toISOString(),
            deployedContracts: contractsDeployed,
            BattleArenaOptimized: arenaAddress,
            MonanimalNFT: monanimalAddress,
            WeaponNFT: weaponAddress,
            ArtifactNFT: artifactAddress,
        };

        fs.writeFileSync(deploymentFile, JSON.stringify(contractAddresses, null, 2));
        console.log(`\n💾 Adresses sauvegardées dans: ${deploymentFile}`);
    }

    // Mettre à jour la configuration frontend
    const frontendConfig = {
        contracts: {
            MonanimalNFT: {
                address: monanimalAddress,
                abi: "MonanimalNFT",
            },
            WeaponNFT: {
                address: weaponAddress,
                abi: "WeaponNFT",
            },
            ArtifactNFT: {
                address: artifactAddress,
                abi: "ArtifactNFT",
            },
            BattleArena: {
                address: arenaAddress,
                abi: "BattleArenaOptimized",
            },
        },
        network: existingConfig.network || {
            name: (await ethers.provider.getNetwork()).name || "unknown",
            chainId: Number((await ethers.provider.getNetwork()).chainId),
            // @ts-ignore
            rpcUrl: ethers.provider.connection?.url || "http://localhost:8545"
        }
    };

    const frontendConfigFile = path.join(__dirname, "../../frontend/src/config/contracts.json");
    const frontendConfigDir = path.dirname(frontendConfigFile);

    if (!fs.existsSync(frontendConfigDir)) {
        fs.mkdirSync(frontendConfigDir, { recursive: true });
    }

    fs.writeFileSync(frontendConfigFile, JSON.stringify(frontendConfig, null, 2));
    console.log(`📱 Configuration frontend mise à jour: ${frontendConfigFile}`);

    console.log("\n🎉 Déploiement terminé avec succès!");
    
    if (contractsDeployed.length > 0) {
        console.log("🎮 Nouveaux contrats prêts à utiliser!");
    } else {
        console.log("📋 Configuration mise à jour avec les contrats existants");
    }

    // Instructions d'utilisation
    console.log("\n📖 Exemples d'utilisation:");
    console.log("  DEPLOY_ALL=true npx hardhat run scripts/deploy.ts --network monad_testnet");
    console.log("  DEPLOY_BATTLEARENA=true npx hardhat run scripts/deploy.ts --network monad_testnet");
    console.log("  DEPLOY_MONANIMAL=true DEPLOY_WEAPON=true npx hardhat run scripts/deploy.ts --network monad_testnet");
}


async function deployWeaponNFT() {
    // Déployer WeaponNFT
    console.log("\n⚔️ Déploiement de WeaponNFT...");
    const WeaponNFT = await ethers.getContractFactory("WeaponNFT");
    const weaponNFT = await WeaponNFT.deploy();
    await weaponNFT.waitForDeployment();
    const weaponAddress = await weaponNFT.getAddress();
    console.log("✅ WeaponNFT déployé à:", weaponAddress);
    return { address: weaponAddress, contract: weaponNFT };
}


async function deployArtifactNFT() {
    // Déployer ArtifactNFT
    console.log("\n🔮 Déploiement de ArtifactNFT...");
    const ArtifactNFT = await ethers.getContractFactory("ArtifactNFT");
    const artifactNFT = await ArtifactNFT.deploy();
    await artifactNFT.waitForDeployment();
    const artifactAddress = await artifactNFT.getAddress();
    console.log("✅ ArtifactNFT déployé à:", artifactAddress);
    return { address: artifactAddress, contract: artifactNFT };
}


async function deployBattleArena(monanimalAddress: string, weaponAddress: string, artifactAddress: string) {
    // Déployer BattleArenaOptimized
    console.log("\n⚔️ Déploiement de BattleArenaOptimized...");
    //const BattleArenaOptimized = await ethers.getContractFactory("BattleArena");
    const BattleArenaOptimized = await ethers.getContractFactory("BattleArenaOptimized");
    const battleArena = await BattleArenaOptimized.deploy(monanimalAddress, weaponAddress, artifactAddress);
    await battleArena.waitForDeployment();
    const arenaAddress = await battleArena.getAddress();
    console.log("✅ BattleArenaOptimized déployé à:", arenaAddress);
    return { address: arenaAddress, contract: battleArena };
}


async function deployMonanimalNFT() {
    // Déployer MonanimalNFT avec le générateur SVG amélioré
    console.log("\n📦 Déploiement de MonanimalNFT amélioré...");
    //const MonanimalNFT = await ethers.getContractFactory("contracts/MonanimalNFT.sol:MonanimalNFT");
    const MonanimalNFT = await ethers.getContractFactory("contracts/MonanimalNFT_Improved.sol:MonanimalNFT");
    const monanimalNFT = await MonanimalNFT.deploy();
    await monanimalNFT.waitForDeployment();
    const monanimalAddress = await monanimalNFT.getAddress();
    console.log("✅ MonanimalNFT amélioré déployé à:", monanimalAddress);
    return { address: monanimalAddress, contract: monanimalNFT };
}



main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Erreur lors du déploiement:", error);
        process.exit(1);
    });

