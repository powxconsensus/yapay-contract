// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

interface IWETH {
    function deposit() external payable;

    function transfer(address to, uint256 value) external returns (bool);

    function withdraw(uint256) external;

    function transferFrom(address src, address dst, uint256 wad) external returns (bool);

    function approve(address guy, uint256 wad) external returns (bool);
}
