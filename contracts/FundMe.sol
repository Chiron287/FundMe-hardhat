// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./PriceConverter.sol";

error FundMe__NotOwner();
error FundMe__CallFail();
error FundMe__ToFewEther();


/**@title A sample Funding Contract
 * @notice This contract is for creating a sample funding contract
 * @dev This implements price feeds as our library
 */
contract FundMe {
    using PriceConverter for uint256;

    mapping(address => uint256) public s_addressToAmountFunded;
    address[] public s_funders;

    address public immutable i_owner;
    uint256 private constant MINIMUM_USD = 50 * 10 ** 18;
    
    AggregatorV3Interface public s_priceFeed;

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function fund() public payable {
        if(msg.value.getConversionRate(s_priceFeed) < MINIMUM_USD) revert FundMe__ToFewEther();
        s_addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender);
    }

    function withdraw() public onlyOwner {
        address[] memory m_funders = s_funders;
        for (uint256 funderIndex=0; funderIndex < m_funders.length; funderIndex++){
            s_addressToAmountFunded[m_funders[funderIndex]] = 0;
        }
        s_funders = new address[](0);
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        if(!callSuccess) revert FundMe__CallFail();
    }

    function getBalance() public view returns(uint256){
        return address(this).balance;
    }
    
    modifier onlyOwner {
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    receive() external payable {
        fund();
    }

}