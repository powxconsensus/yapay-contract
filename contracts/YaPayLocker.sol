// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IWETH.sol";

/**
 * @title YaPayLocker
 * @dev implements locking funds and minting dversion of it on digichain
 */
contract YaPayLocker {
    event Locked(
        string srcChainId,
        string dstChainId,
        uint256 nonce,
        address[] tokens,
        uint256[] amounts,
        address sender,
        address recipient
    );
    event UnLocked(
        uint8 txType,
        string srcChainId,
        string dstChainId,
        uint256 srcNonce,
        uint256 nonce,
        address[] tokens,
        uint256[] amounts,
        address sender,
        address recipient
    );

    string digiChainId;
    string chainId;
    address[] validators;
    using SafeERC20 for IERC20;
    address public constant ETH_ADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    uint256 nonce;
    mapping(uint256 => bool) public executed;

    constructor(string memory _digiChainId, string memory _chainId, address[] memory _validators) {
        chainId = _chainId;
        validators = _validators;
        digiChainId = _digiChainId;
    }

    function lock(address[] memory tokens, uint256[] memory amount, address recipient) public payable {
        // recipient and sender both should be registered on router chain
        for (uint256 idx = 0; idx < tokens.length; idx++) {
            if (ETH_ADDRESS == tokens[idx]) {
                require(amount[idx] == msg.value, "amount[idx] should be msg.value"); // eth locked here
            } else {
                require(msg.value == 0, "msg.value != 0");
                IERC20(tokens[idx]).safeTransferFrom(msg.sender, address(this), amount[idx]);
            }
        }
        emit Locked(chainId, digiChainId, ++nonce, tokens, amount, msg.sender, recipient);
    }

    function handleRequest(
        string memory srcChainId,
        string memory dstChainId,
        uint256 srcNonce,
        bytes memory payload,
        string[] memory sigs
    ) public {
        require(
            keccak256(abi.encodePacked(digiChainId)) == keccak256(abi.encodePacked(srcChainId)),
            "invalid srcChainId"
        );
        require(keccak256(abi.encodePacked(dstChainId)) == keccak256(abi.encodePacked(chainId)), "invalid dst chainId");

        require(!executed[srcNonce], "nonce already executed");
        executed[srcNonce] = true;

        // TODO: validate is msg using sigs
        //NOTE: in case of failure on digichain, sender and recipient will be same as funds will be refunded to depositor back

        (
            uint8 txType,
            address[] memory tokens,
            uint256[] memory amounts,
            address sender,
            address recipient,
            bytes memory message
        ) = abi.decode(payload, (uint8, address[], uint256[], address, address, bytes));
        require(tokens.length == amounts.length, "amounts and tokens length not same");

        // failed on digichain, unlocking funds
        if (txType == 2) {
            (string memory originChainId, uint256 originNonce) = abi.decode(message, (string, uint256));
            require(
                keccak256(abi.encodePacked(originChainId)) == keccak256(abi.encodePacked(srcChainId)),
                "invalid originChainId"
            );
        }
        for (uint256 idx = 0; idx < tokens.length; idx++) {
            if (ETH_ADDRESS == tokens[idx]) {
                require(address(this).balance >= amounts[idx], "Insufficient balance in native currency");
                payable(recipient).transfer(amounts[idx]);
            } else {
                IERC20(tokens[idx]).safeTransfer(recipient, amounts[idx]);
            }
        }
        emit UnLocked(txType, srcChainId, chainId, srcNonce, ++nonce, tokens, amounts, sender, recipient);
    }
}
