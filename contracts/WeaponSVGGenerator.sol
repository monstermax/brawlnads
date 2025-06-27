// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

library WeaponSVGGenerator {
    using Strings for uint256;

    struct WeaponSVGParams {
        string name;
        uint256 weaponType; // 0=Sword, 1=Axe, 2=Bow, 3=Staff, 4=Dagger, 5=Hammer, 6=Spear, 7=Wand
        uint256 rarity; // 0=Common, 1=Uncommon, 2=Rare, 3=Epic, 4=Legendary, 5=Mythic
        string material;
        uint256 attackBonus;
        uint256 defenseBonus;
        uint256 speedBonus;
        uint256 magicBonus;
        uint256 criticalChance;
        uint256 durability;
        uint256 maxDurability;
    }

    function generateWeaponSVG(WeaponSVGParams memory params) internal pure returns (string memory) {
        return string(abi.encodePacked(
            '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">',
            _generateWeaponDefs(params),
            _generateWeaponBackground(params),
            _generateWeaponShape(params),
            _generateWeaponEffects(params),
            _generateWeaponInfo(params),
            '</svg>'
        ));
    }

    function _generateWeaponDefs(WeaponSVGParams memory params) internal pure returns (string memory) {
        return string(abi.encodePacked(
            '<defs>',
            _getWeaponColorGradients(params.material, params.rarity),
            _getWeaponFilters(params.rarity),
            '</defs>'
        ));
    }

    function _getWeaponColorGradients(string memory material, uint256 rarity) internal pure returns (string memory) {
        string memory baseColors = _getMaterialColors(material);
        string memory rarityGlow = _getRarityGlow(rarity);
        
        return string(abi.encodePacked(
            baseColors,
            rarityGlow,
            '<radialGradient id="weaponBg" cx="50%" cy="50%" r="50%">',
            '<stop offset="0%" stop-color="#0E100F" stop-opacity="0.9"/>',
            '<stop offset="100%" stop-color="#836EF9" stop-opacity="0.3"/>',
            '</radialGradient>'
        ));
    }

    function _getMaterialColors(string memory material) internal pure returns (string memory) {
        if (keccak256(bytes(material)) == keccak256(bytes("Monad Crystal"))) {
            return string(abi.encodePacked(
                '<linearGradient id="weaponColor" x1="0%" y1="0%" x2="100%" y2="100%">',
                '<stop offset="0%" stop-color="#FFFFFF"/>',
                '<stop offset="50%" stop-color="#836EF9"/>',
                '<stop offset="100%" stop-color="#200052"/>',
                '</linearGradient>'
            ));
        } else if (keccak256(bytes(material)) == keccak256(bytes("Pure Monad"))) {
            return string(abi.encodePacked(
                '<linearGradient id="weaponColor" x1="0%" y1="0%" x2="100%" y2="100%">',
                '<stop offset="0%" stop-color="#836EF9"/>',
                '<stop offset="25%" stop-color="#FFFFFF"/>',
                '<stop offset="50%" stop-color="#A0055D"/>',
                '<stop offset="75%" stop-color="#FFFFFF"/>',
                '<stop offset="100%" stop-color="#200052"/>',
                '</linearGradient>'
            ));
        } else if (keccak256(bytes(material)) == keccak256(bytes("Gold"))) {
            return string(abi.encodePacked(
                '<linearGradient id="weaponColor" x1="0%" y1="0%" x2="100%" y2="100%">',
                '<stop offset="0%" stop-color="#FFD700"/>',
                '<stop offset="100%" stop-color="#B8860B"/>',
                '</linearGradient>'
            ));
        } else if (keccak256(bytes(material)) == keccak256(bytes("Silver"))) {
            return string(abi.encodePacked(
                '<linearGradient id="weaponColor" x1="0%" y1="0%" x2="100%" y2="100%">',
                '<stop offset="0%" stop-color="#C0C0C0"/>',
                '<stop offset="100%" stop-color="#808080"/>',
                '</linearGradient>'
            ));
        } else {
            // Default iron/steel
            return string(abi.encodePacked(
                '<linearGradient id="weaponColor" x1="0%" y1="0%" x2="100%" y2="100%">',
                '<stop offset="0%" stop-color="#A0A0A0"/>',
                '<stop offset="100%" stop-color="#606060"/>',
                '</linearGradient>'
            ));
        }
    }

    function _getRarityGlow(uint256 rarity) internal pure returns (string memory) {
        if (rarity >= 4) {
            return string(abi.encodePacked(
                '<radialGradient id="rarityGlow" cx="50%" cy="50%" r="50%">',
                '<stop offset="0%" stop-color="#FFD700" stop-opacity="0.6"/>',
                '<stop offset="100%" stop-color="#FFD700" stop-opacity="0"/>',
                '</radialGradient>'
            ));
        } else if (rarity >= 2) {
            return string(abi.encodePacked(
                '<radialGradient id="rarityGlow" cx="50%" cy="50%" r="50%">',
                '<stop offset="0%" stop-color="#836EF9" stop-opacity="0.4"/>',
                '<stop offset="100%" stop-color="#836EF9" stop-opacity="0"/>',
                '</radialGradient>'
            ));
        }
        return '';
    }

    function _getWeaponFilters(uint256 rarity) internal pure returns (string memory) {
        if (rarity >= 4) {
            return string(abi.encodePacked(
                '<filter id="weaponGlow" x="-50%" y="-50%" width="200%" height="200%">',
                '<feGaussianBlur stdDeviation="3" result="coloredBlur"/>',
                '<feMerge>',
                '<feMergeNode in="coloredBlur"/>',
                '<feMergeNode in="SourceGraphic"/>',
                '</feMerge>',
                '</filter>'
            ));
        }
        return '';
    }

    function _generateWeaponBackground(WeaponSVGParams memory params) internal pure returns (string memory) {
        string memory rarityBg = params.rarity >= 2 ? '<circle cx="200" cy="200" r="150" fill="url(#rarityGlow)"/>' : '';
        
        return string(abi.encodePacked(
            '<rect width="400" height="400" fill="url(#weaponBg)"/>',
            rarityBg
        ));
    }

    function _generateWeaponShape(WeaponSVGParams memory params) internal pure returns (string memory) {
        string memory filter = params.rarity >= 4 ? ' filter="url(#weaponGlow)"' : '';
        string memory weaponPath = _getWeaponPath(params.weaponType);
        
        return string(abi.encodePacked(
            '<g', filter, '>',
            weaponPath,
            _generateWeaponDetails(params),
            '</g>'
        ));
    }

    function _getWeaponPath(uint256 weaponType) internal pure returns (string memory) {
        if (weaponType == 0) { // Sword
            return string(abi.encodePacked(
                '<rect x="195" y="80" width="10" height="200" fill="url(#weaponColor)" stroke="#0E100F" stroke-width="2"/>',
                '<polygon points="200,60 190,80 210,80" fill="url(#weaponColor)" stroke="#0E100F" stroke-width="2"/>',
                '<rect x="185" y="280" width="30" height="15" fill="#8B4513" stroke="#0E100F" stroke-width="1"/>',
                '<rect x="190" y="295" width="20" height="20" fill="#8B4513" stroke="#0E100F" stroke-width="1"/>'
            ));
        } else if (weaponType == 1) { // Axe
            return string(abi.encodePacked(
                '<rect x="195" y="150" width="10" height="180" fill="#8B4513" stroke="#0E100F" stroke-width="2"/>',
                '<path d="M 160 120 Q 200 100 240 120 L 240 160 Q 200 140 160 160 Z" fill="url(#weaponColor)" stroke="#0E100F" stroke-width="2"/>',
                '<rect x="190" y="320" width="20" height="20" fill="#8B4513" stroke="#0E100F" stroke-width="1"/>'
            ));
        } else if (weaponType == 2) { // Bow
            return string(abi.encodePacked(
                '<path d="M 150 100 Q 200 80 250 100 Q 250 200 200 220 Q 150 200 150 100" stroke="url(#weaponColor)" stroke-width="6" fill="none"/>',
                '<line x1="160" y1="160" x2="240" y2="160" stroke="#654321" stroke-width="2"/>',
                '<polygon points="240,160 250,155 250,165" fill="#654321"/>'
            ));
        } else if (weaponType == 3) { // Staff
            return string(abi.encodePacked(
                '<rect x="195" y="100" width="10" height="220" fill="#8B4513" stroke="#0E100F" stroke-width="2"/>',
                '<circle cx="200" cy="80" r="20" fill="url(#weaponColor)" stroke="#0E100F" stroke-width="2"/>',
                '<circle cx="200" cy="80" r="12" fill="#836EF9" opacity="0.7">',
                '<animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite"/>',
                '</circle>'
            ));
        } else if (weaponType == 4) { // Dagger
            return string(abi.encodePacked(
                '<rect x="195" y="120" width="10" height="120" fill="url(#weaponColor)" stroke="#0E100F" stroke-width="2"/>',
                '<polygon points="200,100 190,120 210,120" fill="url(#weaponColor)" stroke="#0E100F" stroke-width="2"/>',
                '<rect x="190" y="240" width="20" height="15" fill="#8B4513" stroke="#0E100F" stroke-width="1"/>'
            ));
        } else if (weaponType == 5) { // Hammer
            return string(abi.encodePacked(
                '<rect x="195" y="150" width="10" height="180" fill="#8B4513" stroke="#0E100F" stroke-width="2"/>',
                '<rect x="160" y="100" width="80" height="50" fill="url(#weaponColor)" stroke="#0E100F" stroke-width="2"/>',
                '<rect x="190" y="320" width="20" height="20" fill="#8B4513" stroke="#0E100F" stroke-width="1"/>'
            ));
        } else if (weaponType == 6) { // Spear
            return string(abi.encodePacked(
                '<rect x="195" y="120" width="10" height="200" fill="#8B4513" stroke="#0E100F" stroke-width="2"/>',
                '<polygon points="200,60 185,120 215,120" fill="url(#weaponColor)" stroke="#0E100F" stroke-width="2"/>',
                '<rect x="190" y="310" width="20" height="20" fill="#8B4513" stroke="#0E100F" stroke-width="1"/>'
            ));
        } else { // Wand
            return string(abi.encodePacked(
                '<rect x="195" y="120" width="10" height="160" fill="#8B4513" stroke="#0E100F" stroke-width="2"/>',
                '<circle cx="200" cy="100" r="15" fill="url(#weaponColor)" stroke="#0E100F" stroke-width="2"/>',
                '<polygon points="200,85 195,95 205,95" fill="#FFD700"/>',
                '<circle cx="200" cy="100" r="8" fill="#836EF9" opacity="0.8">',
                '<animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>',
                '</circle>'
            ));
        }
    }

    function _generateWeaponDetails(WeaponSVGParams memory params) internal pure returns (string memory) {
        if (params.rarity >= 3) {
            return string(abi.encodePacked(
                '<circle cx="180" cy="140" r="2" fill="#FFD700" opacity="0.8">',
                '<animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/>',
                '</circle>',
                '<circle cx="220" cy="180" r="1.5" fill="#FFD700" opacity="0.6">',
                '<animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite"/>',
                '</circle>'
            ));
        }
        return '';
    }

    function _generateWeaponEffects(WeaponSVGParams memory params) internal pure returns (string memory) {
        if (params.rarity == 5) { // Mythic
            return string(abi.encodePacked(
                '<g opacity="0.7">',
                '<animateTransform attributeName="transform" type="rotate" values="0 200 200;360 200 200" dur="15s" repeatCount="indefinite"/>',
                '<circle cx="200" cy="200" r="120" fill="none" stroke="#FFD700" stroke-width="1" opacity="0.3"/>',
                '<circle cx="200" cy="200" r="100" fill="none" stroke="#836EF9" stroke-width="1" opacity="0.4"/>',
                '</g>'
            ));
        } else if (params.rarity == 4) { // Legendary
            return string(abi.encodePacked(
                '<circle cx="200" cy="200" r="110" fill="none" stroke="#FFD700" stroke-width="1" opacity="0.4">',
                '<animate attributeName="r" values="105;115;105" dur="4s" repeatCount="indefinite"/>',
                '</circle>'
            ));
        }
        return '';
    }

    function _generateWeaponInfo(WeaponSVGParams memory params) internal pure returns (string memory) {
        return string(abi.encodePacked(
            '<rect x="10" y="320" width="380" height="70" fill="#0E100F" fill-opacity="0.9" rx="5"/>',
            '<text x="20" y="340" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="14" font-weight="bold">', params.name, '</text>',
            '<text x="20" y="355" fill="#836EF9" font-family="Arial, sans-serif" font-size="10">', _getWeaponTypeName(params.weaponType), ' | ', params.material, ' | ', _getWeaponRarityName(params.rarity), '</text>',
            '<text x="20" y="370" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="9">ATK: +', params.attackBonus.toString(), ' DEF: +', params.defenseBonus.toString(), ' SPD: +', params.speedBonus.toString(), '</text>',
            '<text x="20" y="382" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="9">MAG: +', params.magicBonus.toString(), ' CRIT: ', params.criticalChance.toString(), '% DUR: ', params.durability.toString(), '/', params.maxDurability.toString(), '</text>'
        ));
    }

    function _getWeaponTypeName(uint256 weaponType) internal pure returns (string memory) {
        if (weaponType == 0) return "Sword";
        if (weaponType == 1) return "Axe";
        if (weaponType == 2) return "Bow";
        if (weaponType == 3) return "Staff";
        if (weaponType == 4) return "Dagger";
        if (weaponType == 5) return "Hammer";
        if (weaponType == 6) return "Spear";
        if (weaponType == 7) return "Wand";
        return "Unknown";
    }

    function _getWeaponRarityName(uint256 rarity) internal pure returns (string memory) {
        if (rarity == 0) return "Common";
        if (rarity == 1) return "Uncommon";
        if (rarity == 2) return "Rare";
        if (rarity == 3) return "Epic";
        if (rarity == 4) return "Legendary";
        if (rarity == 5) return "Mythic";
        return "Unknown";
    }
}

