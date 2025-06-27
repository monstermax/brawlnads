// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MonanimalSVGGenerator_Improved.sol";

contract TestSVGGenerator_Improved {
    using MonanimalSVGGenerator_Improved for MonanimalSVGGenerator_Improved.SVGParams;

    function generateSVG(
        string memory name,
        uint256 classType,
        uint256 rarity,
        uint256 level,
        uint256 health,
        uint256 attack,
        uint256 defense,
        uint256 speed,
        uint256 magic,
        uint256 luck,
        string memory colorScheme,
        uint256 wins,
        uint256 losses
    ) public pure returns (string memory) {
        MonanimalSVGGenerator_Improved.SVGParams memory params = MonanimalSVGGenerator_Improved.SVGParams({
            name: name,
            class: classType,
            rarity: rarity,
            level: level,
            health: health,
            attack: attack,
            defense: defense,
            speed: speed,
            magic: magic,
            luck: luck,
            colorScheme: colorScheme,
            wins: wins,
            losses: losses
        });

        return MonanimalSVGGenerator_Improved.generateSVG(params);
    }
}