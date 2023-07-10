const { ethers } = require("hardhat");

async function withdraw() {
    const [deployer] = await ethers.getSigners();
    const fundMe = await ethers.getContract("FundMe", deployer);
    
    const txResponse = await fundMe.withdraw();
    await txResponse.wait(1);
}

withdraw()
    .then(() => process.exit(0))
    .catch((err) => {
    console.log(err);
    process.exit(1);
    });