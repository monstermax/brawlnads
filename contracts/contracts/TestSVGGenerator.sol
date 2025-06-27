// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MonanimalSVGGenerator.sol";

contract TestSVGGenerator {
    using MonanimalSVGGenerator for MonanimalSVGGenerator.SVGParams;

    function generateTestSVG() external pure returns (string memory) {
        MonanimalSVGGenerator.SVGParams memory params = MonanimalSVGGenerator.SVGParams({
            name: "Shadow Assassin",
            class: 1,        // Assassin
            rarity: 5,       // Mythic
            level: 20,
            health: 140,
            attack: 150,
            defense: 80,
            speed: 140,
            magic: 90,
            luck: 95,
            colorScheme: "cosmic-purple",
            wins: 25,
            losses: 1
        });

        return MonanimalSVGGenerator.generateSVG(params);
    }

    function generateWarriorSVG() external pure returns (string memory) {
        MonanimalSVGGenerator.SVGParams memory params = MonanimalSVGGenerator.SVGParams({
            name: "Warrior Alpha",
            class: 0,        // Warrior
            rarity: 4,       // Legendary
            level: 15,
            health: 180,
            attack: 120,
            defense: 110,
            speed: 85,
            magic: 60,
            luck: 75,
            colorScheme: "purple-blue",
            wins: 12,
            losses: 3
        });

        return MonanimalSVGGenerator.generateSVG(params);
    }

    function generateMageSVG() external pure returns (string memory) {
        MonanimalSVGGenerator.SVGParams memory params = MonanimalSVGGenerator.SVGParams({
            name: "Arcane Mage",
            class: 2,        // Mage
            rarity: 3,       // Epic
            level: 12,
            health: 120,
            attack: 85,
            defense: 70,
            speed: 90,
            magic: 160,
            luck: 110,
            colorScheme: "purple-berry",
            wins: 8,
            losses: 2
        });

        return MonanimalSVGGenerator.generateSVG(params);
    }
}