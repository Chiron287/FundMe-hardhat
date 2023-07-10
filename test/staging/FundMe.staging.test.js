const { ethers, getNamedAccounts, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { assert } = require("chai");

developmentChains.includes(network.name) 
    ? describe.skip
    : describe("FundMe", async function() {
        let fundMe, deployer;
        beforeEach(async function() {
            deployer = (await getNamedAccounts()).deployer;
            fundMe = await ethers.getContract("FundMe", deployer);
        });

        it("Should fund and withdraw", async function() {
            const value = ethers.utils.parseEther("0.1");
            await fundMe.fund({ value });
            await fundMe.withdraw();
            const endingBalance = await fundMe.getBalance();
            assert.equal(endingBalance.toString(), "0");
        });
    });