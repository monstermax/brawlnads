// hardhat.config.ts
import fs from "fs";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();


function getPrivateKey() {
    const filePath = '/tmp/devwal-evm.tst';

    if (!fs.readFileSync(filePath)) {
        throw new Error(`Wallet not found`);
    }

    return fs.readFileSync(filePath).toString().trim();
}

const privateKey = process.env.PRIVATE_KEY || getPrivateKey();


const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
            viaIR: true,
        },
    },
    networks: {
        hardhat: {
            chainId: 1337,
        },
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 1337,
        },
        monad_testnet: {
            url: process.env.MONAD_TESTNET_RPC || "https://testnet-rpc.monad.xyz",
            accounts: [privateKey],
            chainId: 10143, // Chain ID Monad testnet
            gasPrice: "auto",
            gas: 30000000, // 30M gas limit pour les contrats complexes
            blockGasLimit: 30000000,
        },
        monad_mainnet: {
            url: process.env.MONAD_MAINNET_RPC || "https://rpc.monad.xyz",
            accounts: [privateKey],
            chainId: 143, // Chain ID Monad mainnet
            gasPrice: "auto",
        },
    },
    sourcify: {
        enabled: true,
        apiUrl: "https://sourcify-api-monad.blockvision.org",
        browserUrl: "https://testnet.monadexplorer.com"
    },
    etherscan: {
        enabled: false
    },
    //gasReporter: {
    //  enabled: process.env.REPORT_GAS !== undefined,
    //  currency: "USD",
    //},
    paths: {
        sources: "./contracts",
        tests: "./tests",
        cache: "./cache",
        artifacts: "./artifacts",
    },
};


export default config;
