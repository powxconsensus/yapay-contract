import "hardhat-deploy-ethers";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import "solidity-coverage";
import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";
import { NetworkUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-contract-sizer";
import "./tasks/index";

dotenvConfig({ path: resolve(__dirname, "./.env") });

const chainIds = {
  ganache: 5777,
  goerli: 5,
  hardhat: 7545,
  kovan: 42,
  mainnet: 1,
  rinkeby: 4,
  bscTestnet: 97,
  bsc: 56,
  ropsten: 3,
  mumbai: 80001,
  avalanche: 43114,
  polygon: 137,
  fuji: 43113,
  arbitrum: 42161,
  arbitrum_rinkeby: 421611,
  fantom_testnet: 4002,
  optimism: 10,
  optimism_kovan: 69,
  fantom: 250,
  harmony: 1666600000,
  cronos: 25,
  aurora: 1313161554,
  kava: 2222,
  stardust: 588,
  moonbeam: 1284,
  mantleTestnet: 5001,
  scrollTestnet: 534353,
  lineaTestnet: 59140,
  arbitrumGoerli: 421613,
  sepolia: 11155111,
  base: 84531,
  dogechainTestnet: 568,
  x1: 195,
  mumbaiZkevm: 1442,
};

// Ensure that we have all the environment variables we need.
const mnemonic = process.env.MNEMONIC;
if (!mnemonic) {
  throw new Error("Please set your MNEMONIC in a .env file");
}

const private_key = process.env.PRIVATE_KEY;
if (!private_key) {
  throw new Error("Please set your PRIVATE_KEY in a .env file");
}

const infuraApiKey = process.env.INFURA_API_KEY;
if (!infuraApiKey) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
}
function getChainConfig(network: keyof typeof chainIds): NetworkUserConfig {
  let url = "";
  url = "https://" + network + ".infura.io/v3/" + infuraApiKey;
  if (network == "polygon") {
    url = "https://polygon-mainnet.g.alchemy.com/v2/hCz4x1BLpLDP3NoomXivfaqND37qCSgS";
  } else if (network == "mumbai") {
    // url = "https://polygon-mumbai.infura.io/v3/0697d0f434714dcbbabb42754694a199/";
    url = "https://polygon-mumbai-bor.publicnode.com";
    // url = "https://endpoints.omniatech.io/v1/matic/mumbai/public";
  } else if (network == "bsc") {
    url = "https://bsc-dataseed.binance.org/";
  } else if (network == "avalanche") {
    url = "https://api.avax.network/ext/bc/C/rpc";
  } else if (network == "arbitrum") {
    url = "https://arbitrum-mainnet.infura.io/v3/fd9c5dbc69de41048405e7072cda9bf9";
  } else if (network == "optimism") {
    url = "https://mainnet.optimism.io";
  } else if (network == "fantom") {
    url = "https://rpc.ankr.com/fantom";
  } else if (network == "mainnet") {
    url = "https://mainnet.infura.io/v3/0d73cc5bbe184146957a9d00764db99f";
  } else if (network == "harmony") {
    url = "https://api.harmony.one";
  } else if (network == "aurora") {
    url = "https://aurora-mainnet.infura.io/v3/fd9c5dbc69de41048405e7072cda9bf9";
  } else if (network == "cronos") {
    url = "https://cronos.w3node.com/a9bec89cdf9b13a5610c9723e1416f5ac888ef987d6a46fceaa4962710488ac7/api";
  } else if (network == "goerli") {
    url = "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
  } else if (network == "sepolia") {
    url = "https://rpc2.sepolia.org";
  } else if (network == "base") {
    url = "https://goerli.base.org";
  } else if (network == "dogechainTestnet") {
    url = "https://rpc-testnet.dogechain.dog";
  } else if (network == "mantleTestnet") {
    url = "https://rpc.testnet.mantle.xyz/";
  } else if (network == "scrollTestnet") {
    url = "https://alpha-rpc.scroll.io/l2";
  } else if (network == "arbitrumGoerli") {
    url = "https://goerli-rollup.arbitrum.io/rpc";
  } else if (network == "lineaTestnet") {
    url = "https://rpc.goerli.linea.build";
  } else if (network == "fuji") {
    url = "https://rpc.ankr.com/avalanche_fuji";
  } else if (network == "x1") {
    url = "https://testrpc.x1.tech";
  } else if (network == "mumbaiZkevm") {
    url = "https://rpc.public.zkevm-test.net";
  }
  return {
    accounts: [`${process.env.PRIVATE_KEY}`],
    chainId: chainIds[network],
    url,
  };
}

const config = {
  defaultNetwork: "hardhat",
  gasReporter: {
    currency: "USD",
    enabled: true,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    hardhat: {
      accounts: {
        private_key,
      },
      chainId: chainIds.hardhat,
      mining: {
        auto: true,
        interval: 100,
      },
      allowUnlimitedContractSize: true,
    },
    bscTestnet: {
      saveDeployments: true,
      accounts: [private_key],
      chainId: chainIds["bscTestnet"],
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
    },

    kovan: getChainConfig("kovan"),
    polygon: getChainConfig("polygon"),
    bsc: getChainConfig("bsc"),
    avalanche: getChainConfig("avalanche"),
    arbitrum: getChainConfig("arbitrum"),
    fantom: getChainConfig("fantom"),
    optimism: getChainConfig("optimism"),
    mainnet: getChainConfig("mainnet"),
    harmony: getChainConfig("harmony"),
    aurora: getChainConfig("aurora"),
    cronos: getChainConfig("cronos"),
    kava: getChainConfig("kava"),
    stardust: getChainConfig("stardust"),
    moonbeam: getChainConfig("moonbeam"),
    fuji: getChainConfig("fuji"),
    goerli: getChainConfig("goerli"),
    mumbai: getChainConfig("mumbai"),
    mantleTestnet: getChainConfig("mantleTestnet"),
    scrollTestnet: getChainConfig("scrollTestnet"),
    arbitrumGoerli: getChainConfig("arbitrumGoerli"),
    lineaTestnet: getChainConfig("lineaTestnet"),
    base: getChainConfig("base"),
    mumbaiZkevm: getChainConfig("mumbaiZkevm"),
    x1: getChainConfig("x1"),
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
    // deploy: "./deploy",
    deployments: "./deployments",
    // imports: "./imports",
  },
  solidity: {
    version: "0.8.18",
    settings: {
      evmVersion: "paris",
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/solidity-template/issues/31
        bytecodeHash: "none",
      },
      // You should disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  namedAccounts: {
    deployer: 0,
  },

  etherscan: {
    apiKey: {
      kovan: process.env.ETHERSCAN_API_KEY,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
      goerli: process.env.ETHERSCAN_API_KEY,
      polygon: process.env.POLYGONSCAN_API_KEY,
      bsc: process.env.BSC_ETHERSCAN_KEY,
      avalanche: "QAE2JD7XIBCYB6Z6GSKNJIHKZ8XGVYM8AI",
      opera: process.env.FTMSCAN_KEY,
      arbitrumOne: process.env.ARBITRUM_KEY,
      optimisticEthereum: process.env.OPTIMISM_KEY,
      mainnet: process.env.ETH_ETHERSCAN_KEY,
      aurora: process.env.AURORA_KEY,
      harmony: process.env.HARMONY_KEY,
      moonbeam: process.env.MOONBEAM_ETHERSCAN_KEY,
      kava: process.env.MOONBEAM_ETHERSCAN_KEY,
      avalancheFujiTestnet: "QAE2JD7XIBCYB6Z6GSKNJIHKZ8XGVYM8AI",
      ropsten: "FF9TZXKT2JWZ68M2EJH1FGCX13IB7ZKPUZ",
      sepolia: "12585f3cbbec4e18acf81cdc798f58a4",
      dogechainTestnet: "QAE2JD7XIBCYB6Z6GSKNJIHKZ8XGVYM8AI",
      mantleTestnet: "fa7e1f1c-058b-4070-93dc-0fa53c15c2c3",
      scrollTestnet: "QAE2JD7XIBCYB6Z6GSKNJIHKZ8XGVYM8AI",
      arbitrumGoerli: "6XEVXPKF5RMB577JNKKHWZ3M72Q7ZN1KN8",
      lineaTestnet: "N6YZUFXQEVHDJ3Z5SEMDIBWVKW96UBX4B8",
    },

    customChains: [
      {
        network: "cronos",
        chainId: 25,
        urls: {
          apiURL: "https://api.cronoscan.com/api",
          browserURL: "https://cronoscan.com/",
        },
      },
      {
        network: "kava",
        chainId: 2222,
        urls: {
          apiURL: "https://explorer.kava.io/api",
          browserURL: "https://explorer.kava.io/",
        },
      },
      {
        network: "moonbeam",
        chainId: 1284,
        urls: {
          apiURL: "https://api-moonbeam.moonscan.io/api/",
          browserURL: "https://moonscan.io/",
        },
      },
      {
        network: "dogechainTestnet",
        chainId: 568,
        urls: {
          apiURL: "https://explorer-testnet.dogechain.dog/api",
          browserURL: "https://explorer-testnet.dogechain.dog/",
        },
      },
      {
        network: "arbitrumGoerli",
        chainId: 421613,
        urls: {
          apiURL: "https://api-testnet.arbiscan.io/api",
          browserURL: "https://testnet.arbiscan.io/",
        },
      },
      {
        network: "scrollTestnet",
        chainId: 534353,
        urls: {
          apiURL: "https://blockscout.scroll.io/api",
          browserURL: "https://blockscout.scroll.io/",
        },
      },
      {
        network: "mantleTestnet",
        chainId: 5001,
        urls: {
          apiURL: "https://explorer.testnet.mantle.xyz//api",
          browserURL: "https://explorer.testnet.mantle.xyz//",
        },
      },
      {
        network: "lineaTestnet",
        chainId: 59140,
        urls: {
          apiURL: "https://api-testnet.lineascan.build/api",
          browserURL: "https://goerli.lineascan.build/address",
        },
      },
    ],
  },
};

export default config;
