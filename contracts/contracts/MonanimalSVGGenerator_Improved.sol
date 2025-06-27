// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

library MonanimalSVGGenerator_Improved {
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
            '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">',
            _generateDefs(params),
            _generateBackground(),
            _generateBody(params),
            _generateFace(params),
            _generateClassAccessory(params),
            _generateRarityEffects(params),
            _generateStats(params),
            '</svg>'
        ));
    }

    function _generateDefs(SVGParams memory params) internal pure returns (string memory) {
        return string(abi.encodePacked(
            '<defs>',
            _getColorGradients(params.colorScheme),
            _getRarityFilters(params.rarity),
            '</defs>'
        ));
    }

    function _getColorGradients(string memory scheme) internal pure returns (string memory) {
        // Couleurs Monad selon le schéma
        if (keccak256(bytes(scheme)) == keccak256(bytes("purple-blue"))) {
            return string(abi.encodePacked(
                '<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">',
                '<stop offset="0%" style="stop-color:#836EF9;stop-opacity:1" />',
                '<stop offset="100%" style="stop-color:#200052;stop-opacity:1" />',
                '</linearGradient>',
                '<linearGradient id="body" x1="0%" y1="0%" x2="100%" y2="100%">',
                '<stop offset="0%" style="stop-color:#A0055D;stop-opacity:1" />',
                '<stop offset="100%" style="stop-color:#836EF9;stop-opacity:1" />',
                '</linearGradient>'
            ));
        } else if (keccak256(bytes(scheme)) == keccak256(bytes("cosmic-purple"))) {
            return string(abi.encodePacked(
                '<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">',
                '<stop offset="0%" style="stop-color:#200052;stop-opacity:1" />',
                '<stop offset="100%" style="stop-color:#836EF9;stop-opacity:1" />',
                '</linearGradient>',
                '<linearGradient id="body" x1="0%" y1="0%" x2="100%" y2="100%">',
                '<stop offset="0%" style="stop-color:#836EF9;stop-opacity:1" />',
                '<stop offset="100%" style="stop-color:#FBFAF9;stop-opacity:1" />',
                '</linearGradient>'
            ));
        }
        // Schéma par défaut
        return string(abi.encodePacked(
            '<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" style="stop-color:#836EF9;stop-opacity:1" />',
            '<stop offset="100%" style="stop-color:#FBFAF9;stop-opacity:1" />',
            '</linearGradient>',
            '<linearGradient id="body" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" style="stop-color:#836EF9;stop-opacity:1" />',
            '<stop offset="100%" style="stop-color:#200052;stop-opacity:1" />',
            '</linearGradient>'
        ));
    }

    function _getRarityFilters(uint256 rarity) internal pure returns (string memory) {
        if (rarity >= 4) { // Legendary or Mythic
            return '<filter id="glow"><feGaussianBlur stdDeviation="4" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
        } else if (rarity >= 2) { // Rare or Epic
            return '<filter id="glow"><feGaussianBlur stdDeviation="2" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
        }
        return '';
    }

    function _generateBackground() internal pure returns (string memory) {
        return '<rect width="400" height="400" fill="url(#bg)"/>';
    }

    function _generateBody(SVGParams memory params) internal pure returns (string memory) {
        string memory filter = params.rarity >= 2 ? ' filter="url(#glow)"' : '';
        
        if (params.class == 0) { // Warrior - Rectangle robuste
            return string(abi.encodePacked(
                '<rect x="150" y="150" width="100" height="120" fill="url(#body)" rx="15"', filter, '/>'
            ));
        } else if (params.class == 1) { // Assassin - Forme furtive
            return string(abi.encodePacked(
                '<ellipse cx="200" cy="210" rx="50" ry="70" fill="url(#body)"', filter, '/>'
            ));
        } else if (params.class == 2) { // Mage - Cercle mystique
            return string(abi.encodePacked(
                '<circle cx="200" cy="200" r="60" fill="url(#body)"', filter, '/>'
            ));
        } else if (params.class == 3) { // Berserker - Forme agressive
            return string(abi.encodePacked(
                '<polygon points="200,140 260,200 200,260 140,200" fill="url(#body)"', filter, '/>'
            ));
        } else { // Guardian - Forme défensive
            return string(abi.encodePacked(
                '<rect x="140" y="140" width="120" height="120" fill="url(#body)" rx="25"', filter, '/>'
            ));
        }
    }

    function _generateFace(SVGParams memory params) internal pure returns (string memory) {
        // Yeux style grenouille Monad - plus grands et expressifs
        return string(abi.encodePacked(
            // Yeux blancs
            '<circle cx="175" cy="180" r="18" fill="#FFFFFF" opacity="0.9"/>',
            '<circle cx="225" cy="180" r="18" fill="#FFFFFF" opacity="0.9"/>',
            // Pupilles noires
            '<circle cx="175" cy="180" r="10" fill="#000000"/>',
            '<circle cx="225" cy="180" r="10" fill="#000000"/>',
            // Reflets
            '<circle cx="178" cy="177" r="3" fill="#FFFFFF"/>',
            '<circle cx="228" cy="177" r="3" fill="#FFFFFF"/>',
            // Bouche selon la classe
            _generateMouth(params.class)
        ));
    }

    function _generateMouth(uint256 class) internal pure returns (string memory) {
        if (class == 0) { // Warrior - Sourire déterminé
            return '<path d="M 185 210 Q 200 220 215 210" stroke="#000" stroke-width="2" fill="none"/>';
        } else if (class == 1) { // Assassin - Sourire mystérieux
            return '<path d="M 190 210 Q 200 215 210 210" stroke="#000" stroke-width="2" fill="none"/>';
        } else if (class == 2) { // Mage - Sourire sage
            return '<ellipse cx="200" cy="210" rx="8" ry="4" fill="#000000"/>';
        } else if (class == 3) { // Berserker - Grimace
            return '<path d="M 185 215 Q 200 205 215 215" stroke="#000" stroke-width="3" fill="none"/>';
        } else { // Guardian - Sourire protecteur
            return '<path d="M 185 210 Q 200 218 215 210" stroke="#000" stroke-width="2" fill="none"/>';
        }
    }

    function _generateClassAccessory(SVGParams memory params) internal pure returns (string memory) {
        if (params.class == 0) { // Warrior - Épée simple
            return string(abi.encodePacked(
                '<rect x="280" y="120" width="8" height="60" fill="#C0C0C0" transform="rotate(15 284 150)"/>',
                '<rect x="276" y="110" width="16" height="15" fill="#8B4513" transform="rotate(15 284 117)"/>'
            ));
        } else if (params.class == 1) { // Assassin - Capuche
            return '<path d="M 160 140 Q 200 120 240 140 L 240 180 Q 200 160 160 180 Z" fill="#200052" opacity="0.7"/>';
        } else if (params.class == 2) { // Mage - Chapeau pointu
            return string(abi.encodePacked(
                '<polygon points="200,120 170,160 230,160" fill="#836EF9"/>',
                '<circle cx="185" cy="155" r="4" fill="#FFD700"/>',
                '<circle cx="215" cy="155" r="4" fill="#FFD700"/>'
            ));
        } else if (params.class == 3) { // Berserker - Cornes
            return string(abi.encodePacked(
                '<polygon points="170,150 175,130 180,150" fill="#A0055D"/>',
                '<polygon points="220,150 225,130 230,150" fill="#A0055D"/>'
            ));
        } else { // Guardian - Bouclier
            return string(abi.encodePacked(
                '<ellipse cx="120" cy="200" rx="25" ry="35" fill="#C0C0C0" stroke="#000" stroke-width="2"/>',
                '<circle cx="120" cy="200" r="10" fill="#836EF9"/>'
            ));
        }
    }

    function _generateRarityEffects(SVGParams memory params) internal pure returns (string memory) {
        if (params.rarity == 5) { // Mythic - Particules scintillantes
            return string(abi.encodePacked(
                '<circle cx="120" cy="120" r="2" fill="#FFD700" opacity="0.8">',
                '<animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite"/>',
                '</circle>',
                '<circle cx="280" cy="150" r="2" fill="#FFD700" opacity="0.6">',
                '<animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite"/>',
                '</circle>',
                '<circle cx="150" cy="300" r="2" fill="#FFD700" opacity="0.7">',
                '<animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/>',
                '</circle>'
            ));
        } else if (params.rarity == 4) { // Legendary - Aura dorée
            return string(abi.encodePacked(
                '<circle cx="200" cy="200" r="80" fill="none" stroke="#FFD700" stroke-width="1" opacity="0.3">',
                '<animate attributeName="r" values="75;85;75" dur="3s" repeatCount="indefinite"/>',
                '</circle>'
            ));
        }
        return '';
    }

    function _generateStats(SVGParams memory params) internal pure returns (string memory) {
        return string(abi.encodePacked(
            '<rect x="10" y="320" width="380" height="70" fill="#000000" fill-opacity="0.8" rx="5"/>',
            '<text x="20" y="340" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="14" font-weight="bold">', params.name, '</text>',
            '<text x="20" y="355" fill="#836EF9" font-family="Arial, sans-serif" font-size="11">Level ', params.level.toString(), ' | ', _getClassName(params.class), ' | ', _getRarityName(params.rarity), '</text>',
            '<text x="20" y="370" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="10">HP:', params.health.toString(), ' ATK:', params.attack.toString(), ' DEF:', params.defense.toString(), '</text>',
            '<text x="20" y="383" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="10">SPD:', params.speed.toString(), ' MAG:', params.magic.toString(), ' LCK:', params.luck.toString(), '</text>',
            '<text x="280" y="370" fill="#A0055D" font-family="Arial, sans-serif" font-size="10">Wins: ', params.wins.toString(), '</text>',
            '<text x="280" y="383" fill="#A0055D" font-family="Arial, sans-serif" font-size="10">Losses: ', params.losses.toString(), '</text>'
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