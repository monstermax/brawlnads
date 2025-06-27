// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

library MonanimalSVGGenerator {
    using Strings for uint256;

    struct SVGParams {
        string name;
        uint256 class; // 0=Warrior, 1=Assassin, 2=Mage, 3=Berserker, 4=Guardian
        uint256 rarity; // 0=Common, 1=Uncommon, 2=Rare, 3=Epic, 4=Legendary, 5=Mythic
        uint256 level;
        uint256 health;
        uint256 attack;
        uint256 defense;
        uint256 speed;
        uint256 magic;
        uint256 luck;
        string colorScheme;
        uint256 wins;
        uint256 losses;
    }

    function generateSVG(SVGParams memory params) internal pure returns (string memory) {
        return string(abi.encodePacked(
            '<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">',
            _generateDefs(params),
            _generateBaseMonanimal(params),
            _generateClassOverlay(params),
            _generateRarityEffects(params),
            _generateStats(params),
            '</svg>'
        ));
    }

    function _generateDefs(SVGParams memory params) internal pure returns (string memory) {
        return string(abi.encodePacked(
            '<defs>',
            _getClassColorFilters(params.class),
            _getRarityFilters(params.rarity),
            _getAnimations(params.rarity),
            '</defs>'
        ));
    }

    function _getClassColorFilters(uint256 class) internal pure returns (string memory) {
        if (class == 0) { // Warrior - Rouge
            return string(abi.encodePacked(
                '<filter id="classFilter">',
                '<feColorMatrix type="matrix" values="1.2 0 0 0 0.1  0 0.8 0 0 0  0 0 0.8 0 0  0 0 0 1 0"/>',
                '</filter>'
            ));
        } else if (class == 1) { // Assassin - Violet foncé
            return string(abi.encodePacked(
                '<filter id="classFilter">',
                '<feColorMatrix type="matrix" values="0.9 0 0.2 0 0  0 0.7 0.3 0 0  0.1 0 1.1 0 0  0 0 0 1 0"/>',
                '</filter>'
            ));
        } else if (class == 2) { // Mage - Bleu
            return string(abi.encodePacked(
                '<filter id="classFilter">',
                '<feColorMatrix type="matrix" values="0.8 0 0 0 0  0 0.9 0.1 0 0  0.2 0.1 1.2 0 0  0 0 0 1 0"/>',
                '</filter>'
            ));
        } else if (class == 3) { // Berserker - Orange/Rouge
            return string(abi.encodePacked(
                '<filter id="classFilter">',
                '<feColorMatrix type="matrix" values="1.3 0.1 0 0 0.1  0.1 1.0 0 0 0  0 0 0.7 0 0  0 0 0 1 0"/>',
                '</filter>'
            ));
        } else { // Guardian - Vert
            return string(abi.encodePacked(
                '<filter id="classFilter">',
                '<feColorMatrix type="matrix" values="0.8 0 0 0 0  0.1 1.2 0.1 0 0  0 0.1 0.9 0 0  0 0 0 1 0"/>',
                '</filter>'
            ));
        }
    }

    function _getRarityFilters(uint256 rarity) internal pure returns (string memory) {
        if (rarity >= 4) { // Legendary or Mythic
            return string(abi.encodePacked(
                '<filter id="glow" x="-50%" y="-50%" width="200%" height="200%">',
                '<feGaussianBlur stdDeviation="8" result="coloredBlur"/>',
                '<feMerge>',
                '<feMergeNode in="coloredBlur"/>',
                '<feMergeNode in="SourceGraphic"/>',
                '</feMerge>',
                '</filter>',
                '<filter id="sparkle">',
                '<feGaussianBlur stdDeviation="4" result="coloredBlur"/>',
                '<feMerge>',
                '<feMergeNode in="coloredBlur"/>',
                '<feMergeNode in="SourceGraphic"/>',
                '</feMerge>',
                '</filter>'
            ));
        } else if (rarity >= 2) { // Rare or Epic
            return '<filter id="glow"><feGaussianBlur stdDeviation="4" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
        }
        return '';
    }

    function _getAnimations(uint256 rarity) internal pure returns (string memory) {
        if (rarity == 5) { // Mythic
            return string(abi.encodePacked(
                '<animateTransform id="rotate" attributeName="transform" type="rotate" values="0 512 512;360 512 512" dur="20s" repeatCount="indefinite"/>',
                '<animate id="pulse" attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite"/>'
            ));
        } else if (rarity == 4) { // Legendary
            return '<animate id="pulse" attributeName="opacity" values="0.9;1;0.9" dur="4s" repeatCount="indefinite"/>';
        }
        return '';
    }

    function _generateBaseMonanimal(SVGParams memory params) internal pure returns (string memory) {
        string memory combinedFilter;
        if (params.rarity >= 2) {
            combinedFilter = ' filter="url(#classFilter) url(#glow)"';
        } else {
            combinedFilter = ' filter="url(#classFilter)"';
        }
        
        return string(abi.encodePacked(
            '<g', combinedFilter, '>',
            _getBaseSVGPaths(),
            '</g>'
        ));
    }

    function _getBaseSVGPaths() internal pure returns (string memory) {
        // Retourne le SVG de base (version simplifiée pour éviter les limites de taille)
        return string(abi.encodePacked(
            '<path d="M0 0 C4.32593566 3.56889692 6.2500764 7.18937072 7.875 12.4375 C8.24117432 13.58085815 8.24117432 13.58085815 8.61474609 14.74731445 C14.74395673 34.6412124 19.04590533 55.40681458 22 76 C22.22429687 77.50796143 22.22429687 77.50796143 22.453125 79.04638672 C27.85720865 116.83420869 25.59140701 155.26437362 21 193" fill="#010002" transform="translate(718,37)"/>',
            '<path d="M0 0 C12.77069955 7.7613174 12.77069955 7.7613174 14.3203125 12.41015625 C13.19753906 13.05082031 12.07476562 13.69148438 10.91796875 14.3515625" fill="#6E4AD8" transform="translate(708,59)"/>',
            '<path d="M0 0 C0.91612061 0.40379883 1.83224121 0.80759766 2.77612305 1.22363281 C11.58186303 5.24709717 19.30281729 10.27148892 26.9375 16.1875" fill="#6C49D8" transform="translate(690.0625,507.8125)"/>',
            '<path d="M0 0 C0.62132812 0.49113281 1.24265625 0.98226562 1.8828125 1.48828125 C8.96785655 6.50584658 17.58815869 9.10478388 25.81640625 11.6796875" fill="#CF33C0" transform="translate(407.9921875,753.19921875)"/>'
        ));
    }

    function _generateClassOverlay(SVGParams memory params) internal pure returns (string memory) {
        if (params.class == 0) { // Warrior - Épée
            return string(abi.encodePacked(
                '<rect x="480" y="200" width="40" height="200" fill="#C0C0C0" stroke="#000" stroke-width="4" transform="rotate(15 500 300)"/>',
                '<rect x="470" y="180" width="60" height="40" fill="#8B4513" stroke="#000" stroke-width="2" transform="rotate(15 500 200)"/>'
            ));
        } else if (params.class == 1) { // Assassin - Capuche
            return string(abi.encodePacked(
                '<path d="M 400 100 Q 512 50 624 100 L 624 300 Q 512 250 400 300 Z" fill="#200052" stroke="#000" stroke-width="4" opacity="0.8"/>'
            ));
        } else if (params.class == 2) { // Mage - Chapeau
            return string(abi.encodePacked(
                '<polygon points="512,150 450,250 574,250" fill="#836EF9" stroke="#000" stroke-width="4"/>',
                '<circle cx="480" cy="230" r="8" fill="#FFD700"/>',
                '<circle cx="544" cy="230" r="8" fill="#FFD700"/>',
                '<circle cx="512" cy="200" r="8" fill="#FFD700"/>'
            ));
        } else if (params.class == 3) { // Berserker - Cornes
            return string(abi.encodePacked(
                '<path d="M 450 200 L 470 150 L 490 200" stroke="#A0055D" stroke-width="8" fill="none"/>',
                '<path d="M 534 200 L 554 150 L 574 200" stroke="#A0055D" stroke-width="8" fill="none"/>'
            ));
        } else { // Guardian - Bouclier
            return string(abi.encodePacked(
                '<rect x="400" y="250" width="120" height="80" fill="#C0C0C0" stroke="#000" stroke-width="4"/>',
                '<circle cx="460" cy="290" r="20" fill="#836EF9" stroke="#000" stroke-width="2"/>'
            ));
        }
    }

    function _generateRarityEffects(SVGParams memory params) internal pure returns (string memory) {
        if (params.rarity == 5) { // Mythic
            return string(abi.encodePacked(
                '<g>',
                '<circle cx="300" cy="300" r="4" fill="#FFD700" opacity="0.8">',
                '<animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite"/>',
                '</circle>',
                '<circle cx="700" cy="400" r="3" fill="#FFD700" opacity="0.6">',
                '<animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite"/>',
                '</circle>',
                '<circle cx="400" cy="600" r="5" fill="#FFD700" opacity="0.7">',
                '<animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/>',
                '</circle>',
                '</g>'
            ));
        } else if (params.rarity == 4) { // Legendary
            return string(abi.encodePacked(
                '<circle cx="512" cy="512" r="200" fill="none" stroke="#FFD700" stroke-width="2" opacity="0.3">',
                '<animate attributeName="r" values="190;210;190" dur="4s" repeatCount="indefinite"/>',
                '</circle>'
            ));
        }
        return '';
    }

    function _generateStats(SVGParams memory params) internal pure returns (string memory) {
        return string(abi.encodePacked(
            '<rect x="20" y="850" width="984" height="150" fill="#0E100F" fill-opacity="0.9" rx="10"/>',
            '<text x="40" y="890" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="28" font-weight="bold">', params.name, '</text>',
            '<text x="40" y="920" fill="#836EF9" font-family="Arial, sans-serif" font-size="20">Level ', params.level.toString(), ' | ', _getClassName(params.class), ' | ', _getRarityName(params.rarity), '</text>',
            '<text x="40" y="950" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="18">HP:', params.health.toString(), ' ATK:', params.attack.toString(), ' DEF:', params.defense.toString(), '</text>',
            '<text x="40" y="980" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="18">SPD:', params.speed.toString(), ' MAG:', params.magic.toString(), ' LCK:', params.luck.toString(), '</text>',
            '<text x="700" y="950" fill="#A0055D" font-family="Arial, sans-serif" font-size="18">Wins: ', params.wins.toString(), '</text>',
            '<text x="700" y="980" fill="#A0055D" font-family="Arial, sans-serif" font-size="18">Losses: ', params.losses.toString(), '</text>'
        ));
    }

    function _getClassName(uint256 class) internal pure returns (string memory) {
        if (class == 0) return "Warrior";
        if (class == 1) return "Assassin";
        if (class == 2) return "Mage";
        if (class == 3) return "Berserker";
        if (class == 4) return "Guardian";
        return "Unknown";
    }

    function _getRarityName(uint256 rarity) internal pure returns (string memory) {
        if (rarity == 0) return "Common";
        if (rarity == 1) return "Uncommon";
        if (rarity == 2) return "Rare";
        if (rarity == 3) return "Epic";
        if (rarity == 4) return "Legendary";
        if (rarity == 5) return "Mythic";
        return "Unknown";
    }
}

