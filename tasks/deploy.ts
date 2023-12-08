import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { DeploymentStore } from "../scripts/utils";
import { DIGI_CHAIN_ID } from "./constants";

//npx hardhat deploy:YaPayLocker --validators "0x4E27128CdEF7a3CFFdF800BE3Be6EE74639CB639" --network mumbai
task("deploy:YaPayLocker")
  .addParam("validators", "validators")
  .addOptionalParam("digichainid", "digi chain id")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const store = new DeploymentStore();
    let { digichainid, validators } = taskArguments;
    digichainid = digichainid ? digichainid : DIGI_CHAIN_ID;
    const chainid = await hre.getChainId();
    validators = validators.split(",");

    console.log("YaPayLocker: Contract Deployment Started ");
    const C1 = await hre.ethers.getContractFactory("YaPayLocker");
    const c1 = await C1.deploy(digichainid, chainid, validators);
    await c1.deployed();
    console.log("YaPayLocker: Contract deployed to: ", c1.address);

    await store.store(chainid, "YaPayLocker", {
      address: c1.address,
      blockNumber: 0,
    });

    console.log(`YaPayLocker: Verifying`);
    try {
      await hre.run("verify:verify", {
        address: c1.address,
        constructorArguments: [digichainid, chainid, validators],
      });
    } catch (err: any) {
      console.log("Error: While Verifying -- ", err.message);
      console.log(
        `npx hardhat verify ${c1.address} ${digichainid} ${chainid} ${JSON.stringify(validators)} --network ...`,
      );
    }
  });

//npx hardhat deploy:NonMinatableToken --name Yakeen --symbol YA --decimal 18 --network mumbai
task("deploy:NonMinatableToken")
  .addParam("name", "Name of the Token")
  .addParam("symbol", "Symbol of the Token")
  .addParam("decimal", "Decimal of the Token")
  .addOptionalParam("supply", "Decimal of the Token")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const chainid = await hre.getChainId();
    const store = new DeploymentStore();
    let { name, symbol, decimal, supply } = taskArguments;
    if (!supply) supply = "1000000000"; //10^9

    console.log("ERC20Token: Contract Deployment Started ");
    const C1 = await hre.ethers.getContractFactory("ERC20Token");
    const c1 = await C1.deploy(name, symbol, decimal, supply);
    await c1.deployed();
    console.log("ERC20Token: Contract deployed to: ", c1.address);

    await store.store(chainid, "ERC20Token", {
      address: c1.address,
      blockNumber: 0,
    });

    console.log(`ERC20Token: Verifying`);
    try {
      await hre.run("verify:verify", {
        address: c1.address,
        constructorArguments: [name, symbol, decimal, supply],
      });
    } catch (err: any) {
      console.log("Error: While Verifying -- ", err.message);
      console.log(`npx hardhat verify ${c1.address} ${name} ${symbol} ${decimal} ${supply} --network ...`);
    }
  });

//npx hardhat deploy:MinatableToken --name Yakeen --symbol YA --decimal 18 --network mumbai
task("deploy:MinatableToken")
  .addParam("name", "Name of the Token")
  .addParam("symbol", "Symbol of the Token")
  .addParam("decimal", "Decimal of the Token")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const chainid = await hre.getChainId();
    const store = new DeploymentStore();
    let { name, symbol, decimal } = taskArguments;

    console.log("ERC20MintableToken: Contract Deployment Started ");
    const C1 = await hre.ethers.getContractFactory("ERC20MintableToken");
    const c1 = await C1.deploy(name, symbol, decimal);
    await c1.deployed();
    console.log("ERC20MintableToken: Contract deployed to: ", c1.address);

    await store.store(chainid, "ERC20MintableToken", {
      address: c1.address,
      blockNumber: 0,
    });

    console.log(`ERC20MintableToken: Verifying`);
    try {
      await hre.run("verify:verify", {
        address: c1.address,
        constructorArguments: [name, symbol, decimal],
      });
    } catch (err: any) {
      console.log("Error: While Verifying -- ", err.message);
      console.log(`npx hardhat verify ${c1.address} ${name} ${symbol} ${decimal} --network ...`);
    }
  });
