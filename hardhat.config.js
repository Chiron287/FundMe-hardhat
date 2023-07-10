require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("hardhat-gas-reporter");
require("dotenv").config();
require('solidity-coverage');

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://rpc-url";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key";
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "key";

const SEPOLIA_DEPLOYER_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY || "0xkey";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
      hardhat: {
          chainId: 31337,
      },
      sepolia: {
          url: SEPOLIA_RPC_URL,
          accounts: [SEPOLIA_DEPLOYER_PRIVATE_KEY],
          chainId: 11155111,
          blockConfirmations: 6,
      },
  },
  solidity: {
      compilers: [
          {version: "0.8.8"},
          {version: "0.6.6"},
      ],
  },
  etherscan: {
      apiKey: ETHERSCAN_API_KEY,
      customChains: [],
  },
  gasReporter: {
      enabled: true,
      currency: "USD",
      outputFile: "gas-report.txt",
      noColors: true,
      //coinmarketcap: COINMARKETCAP_API_KEY,
  },
  namedAccounts: {
      deployer: {
          default: 0,
      },
      user: {
        default: 1,
      }
  },
}