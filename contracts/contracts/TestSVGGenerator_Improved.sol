// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MonanimalSVGGenerator_Improved.sol";

contract TestSVGGenerator_Improved {
    using MonanimalSVGGenerator_Improved for MonanimalSVGGenerator_Improved.SVGParams;

    function generateTestSVG() external pure returns (string memory) {
        MonanimalSVGGenerator_Improved.SVGParams memory params = MonanimalSVGGenerator_Improved.SVGParams({
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

        return MonanimalSVGGenerator_Improved.generateSVG(params);
    }

    function generateWarriorSVG() external pure returns (string memory) {
        MonanimalSVGGenerator_Improved.SVGParams memory params = MonanimalSVGGenerator_Improved.SVGParams({
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

        return MonanimalSVGGenerator_Improved.generateSVG(params);
    }

    function generateMageSVG() external pure returns (string memory) {
        MonanimalSVGGenerator_Improved.SVGParams memory params = MonanimalSVGGenerator_Improved.SVGParams({
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

        return MonanimalSVGGenerator_Improved.generateSVG(params);
    }

    function generateBerserkerSVG() external pure returns (string memory) {
        MonanimalSVGGenerator_Improved.SVGParams memory params = MonanimalSVGGenerator_Improved.SVGParams({
            name: "Rage Berserker",
            class: 3,        // Berserker
            rarity: 2,       // Rare
            level: 8,
            health: 100,
            attack: 140,
            defense: 60,
            speed: 110,
            magic: 40,
            luck: 80,
            colorScheme: "purple-gradient",
            wins: 15,
            losses: 5
        });

        return MonanimalSVGGenerator_Improved.generateSVG(params);
    }

    function generateGuardianSVG() external pure returns (string memory) {
        MonanimalSVGGenerator_Improved.SVGParams memory params = MonanimalSVGGenerator_Improved.SVGParams({
            name: "Shield Guardian",
            class: 4,        // Guardian
            rarity: 1,       // Uncommon
            level: 5,
            health: 150,
            attack: 70,
            defense: 130,
            speed: 60,
            magic: 50,
            luck: 70,
            colorScheme: "blue-purple",
            wins: 3,
            losses: 1
        });

        return MonanimalSVGGenerator_Improved.generateSVG(params);
    }
}