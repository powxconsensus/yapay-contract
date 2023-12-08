// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20 {
    uint8 decimal;

    constructor(string memory _name, string memory _symbol, uint8 _decimal, uint256 _supply) ERC20(_name, _symbol) {
        decimal = _decimal;
        _mint(msg.sender, _supply * 10 ** _decimal);
    }

    function decimals() public view virtual override returns (uint8) {
        return decimal;
    }
}
