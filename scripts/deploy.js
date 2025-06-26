const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Déploiement des contrats BrawlNads sur Monad...");

  // Obtenir le déployeur
  const [deployer] = await ethers.getSigners();
  console.log("Déploiement avec le compte:", deployer.address);
  console.log("Solde du compte:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

  // Déployer MonanimalNFT
  console.log("\n📦 Déploiement de MonanimalNFT...");
  const MonanimalNFT = await ethers.getContractFactory("contracts/MonanimalNFT_Updated.sol:MonanimalNFT");
  const monanimalNFT = await MonanimalNFT.deploy();
  await monanimalNFT.waitForDeployment();
  const monanimalAddress = await monanimalNFT.getAddress();
  console.log("✅ MonanimalNFT déployé à:", monanimalAddress);

  // Déployer WeaponNFT
  console.log("\n⚔️ Déploiement de WeaponNFT...");
  const WeaponNFT = await ethers.getContractFactory("WeaponNFT");
  const weaponNFT = await WeaponNFT.deploy();
  await weaponNFT.waitForDeployment();
  const weaponAddress = await weaponNFT.getAddress();
  console.log("✅ WeaponNFT déployé à:", weaponAddress);

  // Déployer ArtifactNFT
  console.log("\n🔮 Déploiement de ArtifactNFT...");
  const ArtifactNFT = await ethers.getContractFactory("ArtifactNFT");
  const artifactNFT = await ArtifactNFT.deploy();
  await artifactNFT.waitForDeployment();
  const artifactAddress = await artifactNFT.getAddress();
  console.log("✅ ArtifactNFT déployé à:", artifactAddress);

  // Déployer BattleArena
  console.log("\n⚔️ Déploiement de BattleArena...");
  const BattleArena = await ethers.getContractFactory("BattleArena");
  const battleArena = await BattleArena.deploy(monanimalAddress, weaponAddress, artifactAddress);
  await battleArena.waitForDeployment();
  const arenaAddress = await battleArena.getAddress();
  console.log("✅ BattleArena déployé à:", arenaAddress);

  // Configuration des permissions
  console.log("\n🔧 Configuration des permissions...");
  
  // Donner les permissions à BattleArena pour modifier les Monanimals
  console.log("Configuration des permissions MonanimalNFT...");
  await monanimalNFT.transferOwnership(arenaAddress);
  console.log("✅ Ownership de MonanimalNFT transféré à BattleArena");

  // Donner les permissions à BattleArena pour modifier les armes
  console.log("Configuration des permissions WeaponNFT...");
  await weaponNFT.transferOwnership(arenaAddress);
  console.log("✅ Ownership de WeaponNFT transféré à BattleArena");

  // Donner les permissions à BattleArena pour modifier les artefacts
  console.log("Configuration des permissions ArtifactNFT...");
  await artifactNFT.transferOwnership(arenaAddress);
  console.log("✅ Ownership de ArtifactNFT transféré à BattleArena");

  // Sauvegarder les adresses des contrats
  const contractAddresses = {
    MonanimalNFT: monanimalAddress,
    WeaponNFT: weaponAddress,
    ArtifactNFT: artifactAddress,
    BattleArena: arenaAddress,
    network: await ethers.provider.getNetwork(),
    deployer: deployer.address,
    deploymentTime: new Date().toISOString()
  };

  console.log("\n📋 Résumé du déploiement:");
  console.log("================================");
  console.log("MonanimalNFT:", monanimalAddress);
  console.log("WeaponNFT:", weaponAddress);
  console.log("ArtifactNFT:", artifactAddress);
  console.log("BattleArena:", arenaAddress);
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);
  console.log("Deployer:", deployer.address);
  console.log("================================");

  // Sauvegarder dans un fichier
  const fs = require("fs");
  const path = require("path");
  
  const deploymentDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }
  
  const networkName = (await ethers.provider.getNetwork()).name || "unknown";
  const deploymentFile = path.join(deploymentDir, `${networkName}-${Date.now()}.json`);
  
  fs.writeFileSync(deploymentFile, JSON.stringify(contractAddresses, null, 2));
  console.log(`\n💾 Adresses sauvegardées dans: ${deploymentFile}`);

  // Créer le fichier de configuration pour le frontend
  const frontendConfig = {
    contracts: {
      MonanimalNFT: {
        address: monanimalAddress,
        abi: "MonanimalNFT" // Le frontend devra importer l'ABI
      },
      WeaponNFT: {
        address: weaponAddress,
        abi: "WeaponNFT"
      },
      ArtifactNFT: {
        address: artifactAddress,
        abi: "ArtifactNFT"
      },
      BattleArena: {
        address: arenaAddress,
        abi: "BattleArena"
      }
    },
    network: {
      name: networkName,
      chainId: Number((await ethers.provider.getNetwork()).chainId),
      rpcUrl: ethers.provider.connection?.url || "http://localhost:8545"
    }
  };

  const frontendConfigFile = path.join(__dirname, "../frontend/src/config/contracts.json");
  const frontendConfigDir = path.dirname(frontendConfigFile);
  
  if (!fs.existsSync(frontendConfigDir)) {
    fs.mkdirSync(frontendConfigDir, { recursive: true });
  }
  
  fs.writeFileSync(frontendConfigFile, JSON.stringify(frontendConfig, null, 2));
  console.log(`📱 Configuration frontend sauvegardée dans: ${frontendConfigFile}`);

  console.log("\n🎉 Déploiement terminé avec succès!");
  console.log("🎮 Vous pouvez maintenant utiliser BrawlNads!");
  
  // Instructions pour les utilisateurs
  console.log("\n📖 Instructions:");
  console.log("1. Mint votre premier Monanimal avec MonanimalNFT.mint()");
  console.log("2. Forgez des armes avec WeaponNFT.forge()");
  console.log("3. Craftez des artefacts avec ArtifactNFT.craft()");
  console.log("4. Équipez vos Monanimals et lancez des combats avec BattleArena!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur lors du déploiement:", error);
    process.exit(1);
  });

