const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name) 
    ? describe.skip
    : describe("FundMe", async function() {
        let fundMeUser, fundMeOwner, mockV3Aggregator, deployer, user, provider;

        beforeEach(async function() {
            [ deployer, user ] = await ethers.getSigners();
            provider = await ethers.getDefaultProvider();
            await deployments.fixture(["all"]);
            fundMeOwner = await ethers.getContract("FundMe", deployer);
            fundMeUser = await ethers.getContract("FundMe", user);
            mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
        });

        describe("constructor", async function() {
            it("Deployer should be Owner", async function() {
                const owner = await fundMeOwner.i_owner();
                assert.equal(owner.toString(), deployer.address);
            });

            it("PriceFeed address should be set", async function() {  
                const priceFeedAddress = await fundMeOwner.s_priceFeed();
                assert.equal(priceFeedAddress.toString(), mockV3Aggregator.address);
            });
        });

        describe("fund", async function() {
            it("Should fund Ether as User", async function() {
                const value = ethers.utils.parseEther("0.1");
                await fundMeUser.fund({ value });
                const funder = await fundMeUser.s_funders(0);
                assert.equal(funder, user.address);
                const fundedAmount = await fundMeUser.s_addressToAmountFunded(funder);
                assert.equal(fundedAmount.toString(), value.toString());
            });

            it("Should Fail because sending to less Ether", async function() {
                const value = ethers.utils.parseEther("0.00000000001");
                await expect(fundMeUser.fund({ value })).to.be.reverted;
            });
        });

        describe("withdraw", async function() {
            beforeEach(async function() {
                const value = ethers.utils.parseEther("0.1");
                await fundMeOwner.fund({ value });
            });

            it("Should withdraw as Owner", async function() {
                await fundMeOwner.withdraw();
                const fundMeBalance = (await fundMeOwner.getBalance()).toString();
                assert.equal(fundMeBalance, "0");
            });

            it("Should revert because trying withdraw as User", async function() {
                try {
                    await fundMeUser.withdraw();
                    throw new Error("Not reverted")
                }
                catch(err) {
                    assert.notEqual(err.toString(), "Error: Not reverted");
                }
            });
        });

        describe("receive", async function() {
            it("Should fund to Contract as User", async function() {
                const value = ethers.utils.parseEther("0.1");
                await user.sendTransaction({
                    to: fundMeUser.address,
                    value: value
                });
                const fundMeBalance = (await fundMeUser.getBalance()).toString();
                const fundMeFunders = await fundMeUser.s_funders(0);
                assert.equal(value, fundMeBalance);
                assert.equal(user.address, fundMeFunders.toString())
            });
        });
    });