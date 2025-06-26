require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
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
      url: process.env.MONAD_TESTNET_RPC_URL || "https://testnet-rpc.monad.xyz",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 10143, // Monad testnet chain ID
      gas: 6000000,
      maxFeePerGas: 30000000000, // 30 gwei
      maxPriorityFeePerGas: 10000000000, // 10 gwei
    },
    monad_mainnet: {
      url: process.env.MONAD_MAINNET_RPC_URL || "https://rpc.monad.xyz",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 143, // Monad mainnet chain ID
      gas: 8000000,
      maxFeePerGas: 200000000000, // 200 gwei
      maxPriorityFeePerGas: 100000000000, // 100 gwei
    },
  },
  etherscan: {
    apiKey: {
      monad_testnet: process.env.MONAD_EXPLORER_API_KEY || "dummy",
      monad_mainnet: process.env.MONAD_EXPLORER_API_KEY || "dummy",
    },
    customChains: [
      {
        network: "monad_testnet",
        chainId: 10143,
        urls: {
          apiURL: "https://https://testnet.monvision.io//api",
          browserURL: "https://https://testnet.monvision.io/"
        }
      },
      {
        network: "monad_mainnet",
        chainId: 143,
        urls: {
          apiURL: "https://explorer.monad.xyz/api",
          browserURL: "https://explorer.monad.xyz"
        }
      }
    ]
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  paths: {
    sources: "./contracts",
    tests: "./tests",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

