const networkConfig = {
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    }
};

const developmentChains = ["hardhat", "localhost"];
const mockV3AggregatorArgs = {
    decimals: 8,
    initial_answer: 200000000000
}

module.exports = {
    networkConfig,
    developmentChains,
    mockV3AggregatorArgs
};