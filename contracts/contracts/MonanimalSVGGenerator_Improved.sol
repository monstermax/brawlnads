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
            _generateCharacterHalo(params),
            _generateBody(params),
            _generateHead(params),
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
            _getColorGradients(params),
            _getRarityFilters(params.rarity),
            '</defs>'
        ));
    }

    function _getColorGradients(SVGParams memory params) internal pure returns (string memory) {
        // Dégradé de fond sombre élégant
        string memory bgGradient = string(abi.encodePacked(
            '<radialGradient id="bg" cx="50%" cy="30%" r="70%">',
            '<stop offset="0%" style="stop-color:#2a1a4a;stop-opacity:1" />',
            '<stop offset="70%" style="stop-color:#1a0d2e;stop-opacity:1" />',
            '<stop offset="100%" style="stop-color:#0d0515;stop-opacity:1" />',
            '</radialGradient>'
        ));

        // Dégradés de corps selon classe et rareté
        string memory bodyGradient;
        if (params.class == 0) { // Warrior - Violet/Rose
            if (params.rarity >= 3) {
                bodyGradient = string(abi.encodePacked(
                    '<radialGradient id="body" cx="50%" cy="40%" r="60%">',
                    '<stop offset="0%" style="stop-color:#ff6b9d;stop-opacity:1" />',
                    '<stop offset="70%" style="stop-color:#c44569;stop-opacity:1" />',
                    '<stop offset="100%" style="stop-color:#836EF9;stop-opacity:1" />',
                    '</radialGradient>'
                ));
            } else {
                bodyGradient = string(abi.encodePacked(
                    '<radialGradient id="body" cx="50%" cy="40%" r="60%">',
                    '<stop offset="0%" style="stop-color:#836EF9;stop-opacity:1" />',
                    '<stop offset="70%" style="stop-color:#5c2a6b;stop-opacity:1" />',
                    '<stop offset="100%" style="stop-color:#3d1a4a;stop-opacity:1" />',
                    '</radialGradient>'
                ));
            }
        } else if (params.class == 1) { // Assassin - Violet foncé
            bodyGradient = string(abi.encodePacked(
                '<radialGradient id="body" cx="50%" cy="40%" r="60%">',
                '<stop offset="0%" style="stop-color:#6a4c93;stop-opacity:1" />',
                '<stop offset="70%" style="stop-color:#4a2c5a;stop-opacity:1" />',
                '<stop offset="100%" style="stop-color:#2d1b3d;stop-opacity:1" />',
                '</radialGradient>'
            ));
        } else if (params.class == 2) { // Mage - Bleu mystique
            bodyGradient = string(abi.encodePacked(
                '<radialGradient id="body" cx="50%" cy="40%" r="60%">',
                '<stop offset="0%" style="stop-color:#4a90e2;stop-opacity:1" />',
                '<stop offset="70%" style="stop-color:#2e5c8a;stop-opacity:1" />',
                '<stop offset="100%" style="stop-color:#1a3a5c;stop-opacity:1" />',
                '</radialGradient>'
            ));
        } else if (params.class == 3) { // Berserker - Rouge/Violet
            bodyGradient = string(abi.encodePacked(
                '<radialGradient id="body" cx="50%" cy="40%" r="60%">',
                '<stop offset="0%" style="stop-color:#e74c3c;stop-opacity:1" />',
                '<stop offset="70%" style="stop-color:#a93226;stop-opacity:1" />',
                '<stop offset="100%" style="stop-color:#6b1f17;stop-opacity:1" />',
                '</radialGradient>'
            ));
        } else { // Guardian - Bleu/Violet
            bodyGradient = string(abi.encodePacked(
                '<radialGradient id="body" cx="50%" cy="40%" r="60%">',
                '<stop offset="0%" style="stop-color:#5a67d8;stop-opacity:1" />',
                '<stop offset="70%" style="stop-color:#4c51bf;stop-opacity:1" />',
                '<stop offset="100%" style="stop-color:#3c366b;stop-opacity:1" />',
                '</radialGradient>'
            ));
        }

        return string(abi.encodePacked(bgGradient, bodyGradient));
    }

    function _getRarityFilters(uint256 rarity) internal pure returns (string memory) {
        if (rarity >= 4) { // Legendary or Mythic
            return '<filter id="glow"><feGaussianBlur stdDeviation="6" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
        } else if (rarity >= 2) { // Rare or Epic
            return '<filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
        }
        return '';
    }

    function _generateBackground() internal pure returns (string memory) {
        return '<rect width="400" height="400" fill="url(#bg)"/>';
    }

    function _generateCharacterHalo(SVGParams memory params) internal pure returns (string memory) {
        // Halo coloré qui entoure tout le personnage comme dans vos screenshots
        if (params.rarity >= 2) {
            string memory haloColor;
            if (params.rarity >= 5) {
                haloColor = "#FFD700"; // Or pour Mythic
            } else if (params.rarity >= 4) {
                haloColor = "#ff6b9d"; // Rose pour Legendary
            } else if (params.rarity >= 3) {
                haloColor = "#836EF9"; // Violet pour Epic
            } else {
                haloColor = "#A0055D"; // Rose foncé pour Rare
            }

            return string(abi.encodePacked(
                // Halo principal - grand cercle coloré autour du personnage
                '<circle cx="200" cy="200" r="130" fill="', haloColor, '" opacity="0.15"/>',
                '<circle cx="200" cy="200" r="120" fill="', haloColor, '" opacity="0.1"/>',
                '<circle cx="200" cy="200" r="110" fill="', haloColor, '" opacity="0.08"/>',
                // Bordure animée
                '<circle cx="200" cy="200" r="125" fill="none" stroke="', haloColor, '" stroke-width="2" opacity="0.4">',
                '<animate attributeName="opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite"/>',
                '</circle>'
            ));
        }
        return '';
    }

    function _generateBody(SVGParams memory params) internal pure returns (string memory) {
        string memory filter = params.rarity >= 2 ? ' filter="url(#glow)"' : '';
        string memory stroke = ' stroke="#000" stroke-width="3"';
        
        if (params.class == 0 || params.class == 1 || params.class == 2 || params.class == 3) { // Classes rondes - Petit corps en bas
            return string(abi.encodePacked(
                '<ellipse cx="200" cy="280" rx="45" ry="25" fill="url(#body)"', stroke, filter, '/>'
            ));
        } else { // Guardian - Petit corps carré en bas
            return string(abi.encodePacked(
                '<rect x="160" y="260" width="80" height="40" fill="url(#body)" rx="8"', stroke, filter, '/>'
            ));
        }
    }

    function _generateHead(SVGParams memory params) internal pure returns (string memory) {
        string memory filter = params.rarity >= 2 ? ' filter="url(#glow)"' : '';
        string memory stroke = ' stroke="#000" stroke-width="3"';
        
        if (params.class == 0 || params.class == 1 || params.class == 2 || params.class == 3) { // Classes rondes - Grande tête ronde
            return string(abi.encodePacked(
                '<circle cx="200" cy="180" r="65" fill="url(#body)"', stroke, filter, '/>'
            ));
        } else { // Guardian - Grande tête carrée
            return string(abi.encodePacked(
                '<rect x="140" y="120" width="120" height="120" fill="url(#body)" rx="20"', stroke, filter, '/>'
            ));
        }
    }

    function _generateFace(SVGParams memory params) internal pure returns (string memory) {
        // Yeux expressifs positionnés sur la grande tête
        if (params.class == 4) { // Guardian - yeux sur tête carrée
            return string(abi.encodePacked(
                // Yeux blancs
                '<circle cx="175" cy="165" r="18" fill="#FFFFFF" stroke="#000" stroke-width="2"/>',
                '<circle cx="225" cy="165" r="18" fill="#FFFFFF" stroke="#000" stroke-width="2"/>',
                // Pupilles noires
                '<circle cx="175" cy="165" r="10" fill="#000000"/>',
                '<circle cx="225" cy="165" r="10" fill="#000000"/>',
                // Reflets brillants
                '<circle cx="178" cy="162" r="3" fill="#FFFFFF"/>',
                '<circle cx="228" cy="162" r="3" fill="#FFFFFF"/>',
                '<circle cx="180" cy="168" r="1.5" fill="#FFFFFF" opacity="0.7"/>',
                '<circle cx="230" cy="168" r="1.5" fill="#FFFFFF" opacity="0.7"/>',
                // Bouche
                '<ellipse cx="200" cy="190" rx="6" ry="4" fill="#000000"/>'
            ));
        } else { // Classes rondes - yeux sur tête ronde
            return string(abi.encodePacked(
                // Yeux blancs
                '<circle cx="175" cy="165" r="18" fill="#FFFFFF" stroke="#000" stroke-width="2"/>',
                '<circle cx="225" cy="165" r="18" fill="#FFFFFF" stroke="#000" stroke-width="2"/>',
                // Pupilles noires
                '<circle cx="175" cy="165" r="10" fill="#000000"/>',
                '<circle cx="225" cy="165" r="10" fill="#000000"/>',
                // Reflets brillants
                '<circle cx="178" cy="162" r="3" fill="#FFFFFF"/>',
                '<circle cx="228" cy="162" r="3" fill="#FFFFFF"/>',
                '<circle cx="180" cy="168" r="1.5" fill="#FFFFFF" opacity="0.7"/>',
                '<circle cx="230" cy="168" r="1.5" fill="#FFFFFF" opacity="0.7"/>',
                // Bouche
                '<ellipse cx="200" cy="200" rx="6" ry="4" fill="#000000"/>'
            ));
        }
    }

    function _generateMouth(uint256 /* class */) internal pure returns (string memory) {
        // Cette fonction n'est plus utilisée car la bouche est dans _generateFace
        return '';
    }

    function _generateClassAccessory(SVGParams memory params) internal pure returns (string memory) {
        if (params.class == 0) { // Warrior - Petit chapeau comme dans vos images
            return string(abi.encodePacked(
                '<rect x="185" y="110" width="30" height="12" fill="#8B4513" stroke="#000" stroke-width="1" rx="3"/>',
                '<circle cx="200" cy="116" r="2" fill="#FFD700"/>'
            ));
        } else if (params.class == 1) { // Assassin - Petit ornement discret
            return string(abi.encodePacked(
                '<circle cx="200" cy="115" r="3" fill="#200052" stroke="#000" stroke-width="1"/>',
                '<circle cx="200" cy="115" r="1.5" fill="#A0055D"/>'
            ));
        } else if (params.class == 2) { // Mage - Petit chapeau pointu
            return string(abi.encodePacked(
                '<polygon points="200,105 188,123 212,123" fill="#4a90e2" stroke="#000" stroke-width="1"/>',
                '<circle cx="200" cy="120" r="1.5" fill="#FFD700"/>'
            ));
        } else if (params.class == 3) { // Berserker - Petites cornes comme vos images
            return string(abi.encodePacked(
                '<polygon points="165,140 168,125 172,140" fill="#e74c3c" stroke="#000" stroke-width="1"/>',
                '<polygon points="228,140 231,125 235,140" fill="#e74c3c" stroke="#000" stroke-width="1"/>'
            ));
        } else { // Guardian - Petit ornement sur le dessus comme votre Epic Guardian
            return string(abi.encodePacked(
                '<rect x="190" y="110" width="20" height="8" fill="#5a67d8" stroke="#000" stroke-width="1" rx="2"/>',
                '<circle cx="200" cy="114" r="1.5" fill="#FFD700"/>'
            ));
        }
    }

    function _generateRarityEffects(SVGParams memory params) internal pure returns (string memory) {
        if (params.rarity == 5) { // Mythic - Particules scintillantes
            return string(abi.encodePacked(
                '<circle cx="130" cy="130" r="2" fill="#FFD700" opacity="0.8">',
                '<animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/>',
                '</circle>',
                '<circle cx="270" cy="150" r="1.5" fill="#FFD700" opacity="0.6">',
                '<animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite"/>',
                '</circle>',
                '<circle cx="150" cy="280" r="2" fill="#FFD700" opacity="0.7">',
                '<animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite"/>',
                '</circle>'
            ));
        } else if (params.rarity == 4) { // Legendary - Aura dorée
            return string(abi.encodePacked(
                '<circle cx="200" cy="200" r="90" fill="none" stroke="#FFD700" stroke-width="2" opacity="0.4">',
                '<animate attributeName="r" values="85;95;85" dur="3s" repeatCount="indefinite"/>',
                '</circle>'
            ));
        } else if (params.rarity == 3) { // Epic - Aura violette
            return string(abi.encodePacked(
                '<circle cx="200" cy="200" r="85" fill="none" stroke="#836EF9" stroke-width="1" opacity="0.3">',
                '<animate attributeName="r" values="80;90;80" dur="4s" repeatCount="indefinite"/>',
                '</circle>'
            ));
        }
        return '';
    }

    function _generateStats(SVGParams memory params) internal pure returns (string memory) {
        return string(abi.encodePacked(
            '<rect x="10" y="320" width="380" height="70" fill="#000000" fill-opacity="0.9" rx="8" stroke="#836EF9" stroke-width="1"/>',
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