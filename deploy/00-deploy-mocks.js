const { network } = require("hardhat");
const { developmentChains, mockV3AggregatorArgs } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    
    if(developmentChains.includes(network.name)) {
        log("Local Network detected! Deploying Mocks...");
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [mockV3AggregatorArgs.decimals, mockV3AggregatorArgs.initial_answer]
        });
        log("Mocks deployed");
        log("--------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]