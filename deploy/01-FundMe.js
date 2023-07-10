const { networkConfig, developmentChains } = require("../helper-hardhat-config.js");
const { network, ethers } = require("hardhat");
const { verify } = require("../utils/verfiy");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const chainId = network.config.chainId;
    let ethUsdPriceFeedAddress;

    if(developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed;
    }

    console.log("Deploying FundMe Contract...");
    
    const args = [ethUsdPriceFeedAddress];
    console.log(args);

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations,
    });

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(fundMe.address, args);
    }

    console.log("Deployed");
}

module.exports.tags = ["all", "fundme"];