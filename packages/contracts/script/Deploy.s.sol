// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script, console} from "forge-std/Script.sol";
import {HarvestHorizons} from "src/HarvestHorizons.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying with deployer address", deployerAddress);

        HarvestHorizons harvestHorizons = new HarvestHorizons();
        string[] memory names = new string[](7);
        names[0] = "Carrot";
        names[1] = "Potato";
        names[2] = "Tomato";
        names[3] = "Carrot Seeds";
        names[4] = "Potato Seeds";
        names[5] = "Tomato Seeds";
        names[6] = "Coin";
        harvestHorizons.bulkCreateItems(names);

        console.log("Deployed deployerAddress at address: %s", address(harvestHorizons));
        vm.stopBroadcast();
    }
}
