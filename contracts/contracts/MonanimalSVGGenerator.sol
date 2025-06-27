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
            '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
            _generateDefs(params),
            _generateBackground(params),
            _generateBody(params),
            _generateFace(params),
            _generateClassAccessories(params),
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
            _getAnimations(params.rarity),
            '</defs>'
        ));
    }

    function _getColorGradients(string memory colorScheme) internal pure returns (string memory) {
        if (keccak256(bytes(colorScheme)) == keccak256(bytes("purple-blue"))) {
            return string(abi.encodePacked(
                '<linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">',
                '<stop offset="0%" stop-color="#836EF9"/>',
                '<stop offset="100%" stop-color="#200052"/>',
                '</linearGradient>',
                '<radialGradient id="bgGradient" cx="50%" cy="50%" r="50%">',
                '<stop offset="0%" stop-color="#836EF9" stop-opacity="0.3"/>',
                '<stop offset="100%" stop-color="#200052" stop-opacity="0.1"/>',
                '</radialGradient>'
            ));
        } else if (keccak256(bytes(colorScheme)) == keccak256(bytes("purple-berry"))) {
            return string(abi.encodePacked(
                '<linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">',
                '<stop offset="0%" stop-color="#836EF9"/>',
                '<stop offset="100%" stop-color="#A0055D"/>',
                '</linearGradient>',
                '<radialGradient id="bgGradient" cx="50%" cy="50%" r="50%">',
                '<stop offset="0%" stop-color="#836EF9" stop-opacity="0.3"/>',
                '<stop offset="100%" stop-color="#A0055D" stop-opacity="0.1"/>',
                '</radialGradient>'
            ));
        } else if (keccak256(bytes(colorScheme)) == keccak256(bytes("cosmic-purple"))) {
            return string(abi.encodePacked(
                '<linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">',
                '<stop offset="0%" stop-color="#836EF9"/>',
                '<stop offset="50%" stop-color="#A0055D"/>',
                '<stop offset="100%" stop-color="#200052"/>',
                '</linearGradient>',
                '<radialGradient id="bgGradient" cx="50%" cy="50%" r="50%">',
                '<stop offset="0%" stop-color="#836EF9" stop-opacity="0.4"/>',
                '<stop offset="100%" stop-color="#0E100F" stop-opacity="0.2"/>',
                '</radialGradient>'
            ));
        }
        
        // Default purple gradient
        return string(abi.encodePacked(
            '<linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" stop-color="#836EF9"/>',
            '<stop offset="100%" stop-color="#200052"/>',
            '</linearGradient>',
            '<radialGradient id="bgGradient" cx="50%" cy="50%" r="50%">',
            '<stop offset="0%" stop-color="#836EF9" stop-opacity="0.2"/>',
            '<stop offset="100%" stop-color="#FBFAF9" stop-opacity="0.1"/>',
            '</radialGradient>'
        ));
    }

    function _getRarityFilters(uint256 rarity) internal pure returns (string memory) {
        if (rarity >= 4) { // Legendary or Mythic
            return string(abi.encodePacked(
                '<filter id="glow" x="-50%" y="-50%" width="200%" height="200%">',
                '<feGaussianBlur stdDeviation="4" result="coloredBlur"/>',
                '<feMerge>',
                '<feMergeNode in="coloredBlur"/>',
                '<feMergeNode in="SourceGraphic"/>',
                '</feMerge>',
                '</filter>',
                '<filter id="sparkle">',
                '<feGaussianBlur stdDeviation="2" result="coloredBlur"/>',
                '<feMerge>',
                '<feMergeNode in="coloredBlur"/>',
                '<feMergeNode in="SourceGraphic"/>',
                '</feMerge>',
                '</filter>'
            ));
        } else if (rarity >= 2) { // Rare or Epic
            return '<filter id="glow"><feGaussianBlur stdDeviation="2" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
        }
        return '';
    }

    function _getAnimations(uint256 rarity) internal pure returns (string memory) {
        if (rarity == 5) { // Mythic
            return string(abi.encodePacked(
                '<animateTransform id="rotate" attributeName="transform" type="rotate" values="0 200 200;360 200 200" dur="20s" repeatCount="indefinite"/>',
                '<animate id="pulse" attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite"/>'
            ));
        } else if (rarity == 4) { // Legendary
            return '<animate id="pulse" attributeName="opacity" values="0.9;1;0.9" dur="4s" repeatCount="indefinite"/>';
        }
        return '';
    }

    function _generateBackground(SVGParams memory params) internal pure returns (string memory) {
        return string(abi.encodePacked(
            '<rect width="400" height="400" fill="url(#bgGradient)"/>',
            _generateBackgroundElements(params.rarity)
        ));
    }

    function _generateBackgroundElements(uint256 rarity) internal pure returns (string memory) {
        if (rarity >= 4) {
            return string(abi.encodePacked(
                '<circle cx="80" cy="80" r="3" fill="#836EF9" opacity="0.6">',
                '<animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite"/>',
                '</circle>',
                '<circle cx="320" cy="120" r="2" fill="#A0055D" opacity="0.5">',
                '<animate attributeName="opacity" values="0.2;0.7;0.2" dur="3s" repeatCount="indefinite"/>',
                '</circle>',
                '<circle cx="350" cy="300" r="4" fill="#836EF9" opacity="0.4">',
                '<animate attributeName="opacity" values="0.1;0.6;0.1" dur="2.5s" repeatCount="indefinite"/>',
                '</circle>'
            ));
        }
        return '';
    }

    function _generateBody(SVGParams memory params) internal pure returns (string memory) {
        string memory bodyShape = _getBodyShape(params.class);
        string memory filter = params.rarity >= 2 ? ' filter="url(#glow)"' : '';
        
        return string(abi.encodePacked(
            '<g', filter, '>',
            bodyShape,
            '</g>'
        ));
    }

    function _getBodyShape(uint256 class) internal pure returns (string memory) {
        if (class == 0) { // Warrior - Robust body
            return string(abi.encodePacked(
                '<ellipse cx="200" cy="220" rx="70" ry="60" fill="url(#bodyGradient)" stroke="#0E100F" stroke-width="3"/>',
                '<ellipse cx="200" cy="200" rx="65" ry="55" fill="url(#bodyGradient)" stroke="#0E100F" stroke-width="3"/>'
            ));
        } else if (class == 1) { // Assassin - Sleek body
            return string(abi.encodePacked(
                '<ellipse cx="200" cy="210" rx="60" ry="65" fill="url(#bodyGradient)" stroke="#0E100F" stroke-width="3"/>',
                '<ellipse cx="200" cy="190" rx="55" ry="60" fill="url(#bodyGradient)" stroke="#0E100F" stroke-width="3"/>'
            ));
        } else if (class == 2) { // Mage - Mystical body
            return string(abi.encodePacked(
                '<circle cx="200" cy="210" r="65" fill="url(#bodyGradient)" stroke="#0E100F" stroke-width="3"/>',
                '<circle cx="200" cy="190" r="60" fill="url(#bodyGradient)" stroke="#0E100F" stroke-width="3"/>'
            ));
        } else if (class == 3) { // Berserker - Wild body
            return string(abi.encodePacked(
                '<ellipse cx="200" cy="220" rx="75" ry="55" fill="url(#bodyGradient)" stroke="#0E100F" stroke-width="3"/>',
                '<ellipse cx="200" cy="200" rx="70" ry="50" fill="url(#bodyGradient)" stroke="#0E100F" stroke-width="3"/>'
            ));
        } else { // Guardian - Sturdy body
            return string(abi.encodePacked(
                '<rect x="130" y="160" width="140" height="120" rx="20" fill="url(#bodyGradient)" stroke="#0E100F" stroke-width="3"/>',
                '<rect x="135" y="140" width="130" height="110" rx="15" fill="url(#bodyGradient)" stroke="#0E100F" stroke-width="3"/>'
            ));
        }
    }

    function _generateFace(SVGParams memory params) internal pure returns (string memory) {
        return string(abi.encodePacked(
            _generateEyes(params),
            _generateMouth(params),
            _generateNose(params)
        ));
    }

    function _generateEyes(SVGParams memory params) internal pure returns (string memory) {
        string memory eyeAnimation = params.rarity >= 4 ? '<animate attributeName="r" values="15;17;15" dur="3s" repeatCount="indefinite"/>' : '';
        
        return string(abi.encodePacked(
            // Left eye
            '<circle cx="175" cy="170" r="15" fill="#FFFFFF" stroke="#0E100F" stroke-width="2">',
            eyeAnimation,
            '</circle>',
            '<circle cx="175" cy="170" r="10" fill="#0E100F"/>',
            '<circle cx="177" cy="167" r="3" fill="#FFFFFF"/>',
            // Right eye
            '<circle cx="225" cy="170" r="15" fill="#FFFFFF" stroke="#0E100F" stroke-width="2">',
            eyeAnimation,
            '</circle>',
            '<circle cx="225" cy="170" r="10" fill="#0E100F"/>',
            '<circle cx="227" cy="167" r="3" fill="#FFFFFF"/>'
        ));
    }

    function _generateMouth(SVGParams memory params) internal pure returns (string memory) {
        if (params.class == 3) { // Berserker - Angry mouth
            return '<path d="M 180 200 Q 200 210 220 200" stroke="#0E100F" stroke-width="3" fill="none"/>';
        } else if (params.class == 1) { // Assassin - Mysterious mouth
            return '<line x1="185" y1="200" x2="215" y2="200" stroke="#0E100F" stroke-width="2"/>';
        } else { // Default friendly mouth
            return '<path d="M 180 200 Q 200 190 220 200" stroke="#0E100F" stroke-width="2" fill="none"/>';
        }
    }

    function _generateNose(SVGParams memory params) internal pure returns (string memory) {
        return string(abi.encodePacked(
            '<ellipse cx="195" cy="185" rx="2" ry="1" fill="#0E100F"/>',
            '<ellipse cx="205" cy="185" rx="2" ry="1" fill="#0E100F"/>'
        ));
    }

    function _generateClassAccessories(SVGParams memory params) internal pure returns (string memory) {
        if (params.class == 0) { // Warrior
            return string(abi.encodePacked(
                '<rect x="190" y="120" width="20" height="40" fill="#A0A0A0" stroke="#0E100F" stroke-width="2"/>',
                '<rect x="185" y="140" width="30" height="10" fill="#8B4513" stroke="#0E100F" stroke-width="1"/>'
            ));
        } else if (params.class == 1) { // Assassin
            return string(abi.encodePacked(
                '<path d="M 160 140 Q 200 120 240 140 L 240 180 Q 200 160 160 180 Z" fill="#200052" stroke="#0E100F" stroke-width="2" opacity="0.8"/>'
            ));
        } else if (params.class == 2) { // Mage
            return string(abi.encodePacked(
                '<polygon points="200,100 180,140 220,140" fill="#836EF9" stroke="#0E100F" stroke-width="2"/>',
                '<circle cx="190" cy="130" r="3" fill="#FFD700"/>',
                '<circle cx="210" cy="130" r="3" fill="#FFD700"/>',
                '<circle cx="200" cy="120" r="3" fill="#FFD700"/>'
            ));
        } else if (params.class == 3) { // Berserker
            return string(abi.encodePacked(
                '<path d="M 170 140 L 180 120 L 190 140" stroke="#A0055D" stroke-width="3" fill="none"/>',
                '<path d="M 210 140 L 220 120 L 230 140" stroke="#A0055D" stroke-width="3" fill="none"/>'
            ));
        } else { // Guardian
            return string(abi.encodePacked(
                '<rect x="170" y="130" width="60" height="20" fill="#C0C0C0" stroke="#0E100F" stroke-width="2"/>',
                '<circle cx="200" cy="140" r="8" fill="#836EF9" stroke="#0E100F" stroke-width="1"/>'
            ));
        }
    }

    function _generateRarityEffects(SVGParams memory params) internal pure returns (string memory) {
        if (params.rarity == 5) { // Mythic
            return string(abi.encodePacked(
                '<g filter="url(#sparkle)">',
                '<circle cx="150" cy="150" r="2" fill="#FFD700" opacity="0.8">',
                '<animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite"/>',
                '</circle>',
                '<circle cx="250" cy="180" r="1.5" fill="#FFD700" opacity="0.6">',
                '<animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite"/>',
                '</circle>',
                '<circle cx="180" cy="280" r="2.5" fill="#FFD700" opacity="0.7">',
                '<animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/>',
                '</circle>',
                '</g>'
            ));
        } else if (params.rarity == 4) { // Legendary
            return string(abi.encodePacked(
                '<circle cx="200" cy="200" r="80" fill="none" stroke="#FFD700" stroke-width="1" opacity="0.3">',
                '<animate attributeName="r" values="75;85;75" dur="4s" repeatCount="indefinite"/>',
                '</circle>'
            ));
        }
        return '';
    }

    function _generateStats(SVGParams memory params) internal pure returns (string memory) {
        return string(abi.encodePacked(
            '<rect x="10" y="320" width="380" height="70" fill="#0E100F" fill-opacity="0.8" rx="5"/>',
            '<text x="20" y="340" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="14" font-weight="bold">', params.name, '</text>',
            '<text x="20" y="355" fill="#836EF9" font-family="Arial, sans-serif" font-size="10">Level ', params.level.toString(), ' | ', _getClassName(params.class), ' | ', _getRarityName(params.rarity), '</text>',
            '<text x="20" y="370" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="9">HP:', params.health.toString(), ' ATK:', params.attack.toString(), ' DEF:', params.defense.toString(), '</text>',
            '<text x="20" y="382" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="9">SPD:', params.speed.toString(), ' MAG:', params.magic.toString(), ' LCK:', params.luck.toString(), '</text>',
            '<text x="280" y="370" fill="#A0055D" font-family="Arial, sans-serif" font-size="9">Wins: ', params.wins.toString(), '</text>',
            '<text x="280" y="382" fill="#A0055D" font-family="Arial, sans-serif" font-size="9">Losses: ', params.losses.toString(), '</text>'
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

