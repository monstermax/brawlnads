// scripts/verify.ts

import { run } from "hardhat";

import deploymentInfo from "../deployments/monad_testnet-1750889994117.json";


async function main() {
    console.log("🔍 Verifying contract on block explorer...");

    const contractNames = [
        'MonanimalNFT',
        'WeaponNFT',
        'ArtifactNFT',
        'BattleArena',
        'BattleArenaOptimized',
    ];

    for (const contractName of contractNames) {
        const contractAddress = deploymentInfo[contractName as keyof typeof deploymentInfo];

        try {
            await run("verify:verify", {
                address: contractAddress,
                constructorArguments: [],
            });

            console.log(`✅ Contract ${contractName} verified successfully!`);
            console.log(`📋 Contract address:`, contractAddress);

        } catch (error: any) {
            if (error.message.toLowerCase().includes("already verified")) {
                console.log("✅ Contract is already verified!");

            } else {
                console.error("❌ Verification failed:", error);
                throw error;
            }
        }
    }

}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

