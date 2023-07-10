const { ethers } = require("hardhat");

async function fund(sendValue) {
    const [deployer] = await ethers.getSigners();
    const fundMe = await ethers.getContract("FundMe", deployer);
    const value = ethers.utils.parseEther(sendValue);

    const txResponse = await fundMe.fund({ value });
    await txResponse.wait(1);
}

fund("0.1")
    .then(() => process.exit(0))
    .catch((err) => {
    console.log(err);
    process.exit(1);
    });