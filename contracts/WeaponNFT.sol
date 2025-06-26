// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract WeaponNFT is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIdCounter;

    // Types d'armes
    enum WeaponType { Sword, Axe, Bow, Staff, Dagger, Hammer, Spear, Wand }

    // Rareté des armes
    enum Rarity { Common, Uncommon, Rare, Epic, Legendary, Mythic }

    struct WeaponStats {
        uint256 attackBonus;
        uint256 defenseBonus;
        uint256 speedBonus;
        uint256 magicBonus;
        uint256 luckBonus;
        uint256 criticalChance; // Pourcentage de chance de critique
    }

    struct Weapon {
        string name;
        WeaponType weaponType;
        Rarity rarity;
        WeaponStats stats;
        uint256 durability;
        uint256 maxDurability;
        string material; // Pour la génération SVG
        bool isEquipped;
        uint256 equippedTo; // ID du Monanimal équipé
    }

    mapping(uint256 => Weapon) public weapons;
    mapping(address => uint256[]) public ownerWeapons;
    
    // Prix de forge et réparation
    uint256 public forgePrice = 0.005 ether;
    uint256 public repairPrice = 0.002 ether;
    
    // Événements
    event WeaponForged(uint256 indexed tokenId, address indexed owner, WeaponType weaponType, Rarity rarity);
    event WeaponRepaired(uint256 indexed tokenId, uint256 newDurability);
    event WeaponEquipped(uint256 indexed tokenId, uint256 indexed monanimalId);
    event WeaponUnequipped(uint256 indexed tokenId);

    constructor() ERC721("BrawlNads Weapons", "WEAPON") {}

    function forge() public payable {
        require(msg.value >= forgePrice, "Insufficient payment");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        // Génération aléatoire de l'arme
        (WeaponType weaponType, Rarity rarity, WeaponStats memory stats, string memory material) = _generateRandomWeapon(tokenId);
        
        string memory name = _generateWeaponName(weaponType, rarity, material, tokenId);
        uint256 maxDurability = 100 + uint256(rarity) * 50; // 100-350 selon la rareté
        
        weapons[tokenId] = Weapon({
            name: name,
            weaponType: weaponType,
            rarity: rarity,
            stats: stats,
            durability: maxDurability,
            maxDurability: maxDurability,
            material: material,
            isEquipped: false,
            equippedTo: 0
        });
        
        ownerWeapons[msg.sender].push(tokenId);
        _safeMint(msg.sender, tokenId);
        
        emit WeaponForged(tokenId, msg.sender, weaponType, rarity);
    }

    function _generateRandomWeapon(uint256 seed) private view returns (
        WeaponType weaponType,
        Rarity rarity,
        WeaponStats memory stats,
        string memory material
    ) {
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, seed, msg.sender)));
        
        // Génération du type d'arme
        weaponType = WeaponType(random % 8);
        
        // Génération de la rareté
        uint256 rarityRoll = (random >> 8) % 1000;
        if (rarityRoll < 400) rarity = Rarity.Common;
        else if (rarityRoll < 650) rarity = Rarity.Uncommon;
        else if (rarityRoll < 800) rarity = Rarity.Rare;
        else if (rarityRoll < 920) rarity = Rarity.Epic;
        else if (rarityRoll < 980) rarity = Rarity.Legendary;
        else rarity = Rarity.Mythic;
        
        // Génération des stats
        stats = _generateWeaponStats(weaponType, rarity, random);
        
        // Génération du matériau
        material = _generateMaterial(rarity, random);
    }

    function _generateWeaponStats(WeaponType weaponType, Rarity rarity, uint256 random) private pure returns (WeaponStats memory) {
        uint256 baseBonus = 10 + uint256(rarity) * 15; // 10-85 selon la rareté
        uint256 variance = 5; // ±5 de variance
        
        uint256 attackBonus = baseBonus + ((random >> 16) % variance);
        uint256 defenseBonus = baseBonus / 2 + ((random >> 24) % variance);
        uint256 speedBonus = baseBonus / 3 + ((random >> 32) % variance);
        uint256 magicBonus = baseBonus / 2 + ((random >> 40) % variance);
        uint256 luckBonus = baseBonus / 4 + ((random >> 48) % variance);
        uint256 criticalChance = 5 + uint256(rarity) * 3; // 5-20% selon la rareté
        
        // Bonus spécifiques au type d'arme
        if (weaponType == WeaponType.Sword) {
            attackBonus += 20;
            defenseBonus += 10;
        } else if (weaponType == WeaponType.Axe) {
            attackBonus += 30;
            criticalChance += 5;
        } else if (weaponType == WeaponType.Bow) {
            speedBonus += 25;
            criticalChance += 10;
        } else if (weaponType == WeaponType.Staff || weaponType == WeaponType.Wand) {
            magicBonus += 40;
            attackBonus -= 10;
        } else if (weaponType == WeaponType.Dagger) {
            speedBonus += 30;
            criticalChance += 15;
            attackBonus -= 5;
        } else if (weaponType == WeaponType.Hammer) {
            attackBonus += 35;
            speedBonus -= 15;
        } else if (weaponType == WeaponType.Spear) {
            attackBonus += 15;
            speedBonus += 15;
        }
        
        return WeaponStats(attackBonus, defenseBonus, speedBonus, magicBonus, luckBonus, criticalChance);
    }

    function _generateMaterial(Rarity rarity, uint256 random) private pure returns (string memory) {
        if (rarity == Rarity.Common) {
            string[3] memory materials = ["Iron", "Bronze", "Wood"];
            return materials[random % 3];
        } else if (rarity == Rarity.Uncommon) {
            string[3] memory materials = ["Steel", "Silver", "Copper"];
            return materials[random % 3];
        } else if (rarity == Rarity.Rare) {
            string[3] memory materials = ["Gold", "Platinum", "Crystal"];
            return materials[random % 3];
        } else if (rarity == Rarity.Epic) {
            string[3] memory materials = ["Mithril", "Adamant", "Obsidian"];
            return materials[random % 3];
        } else if (rarity == Rarity.Legendary) {
            string[3] memory materials = ["Monad Crystal", "Void Steel", "Starlight"];
            return materials[random % 3];
        } else {
            string[3] memory materials = ["Pure Monad", "Cosmic Essence", "Reality Shard"];
            return materials[random % 3];
        }
    }

    function _generateWeaponName(WeaponType weaponType, Rarity rarity, string memory material, uint256 tokenId) private pure returns (string memory) {
        string[8] memory typeNames = ["Sword", "Axe", "Bow", "Staff", "Dagger", "Hammer", "Spear", "Wand"];
        string[6] memory rarityPrefixes = ["", "Fine", "Rare", "Epic", "Legendary", "Mythic"];
        
        return string(abi.encodePacked(
            rarityPrefixes[uint256(rarity)],
            bytes(rarityPrefixes[uint256(rarity)]).length > 0 ? " " : "",
            material,
            " ",
            typeNames[uint256(weaponType)],
            " #",
            tokenId.toString()
        ));
    }

    function repairWeapon(uint256 tokenId) public payable {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(weapons[tokenId].durability < weapons[tokenId].maxDurability, "Weapon is already at full durability");
        require(msg.value >= repairPrice, "Insufficient payment");
        
        weapons[tokenId].durability = weapons[tokenId].maxDurability;
        emit WeaponRepaired(tokenId, weapons[tokenId].durability);
    }

    function equipWeapon(uint256 tokenId, uint256 monanimalId) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(!weapons[tokenId].isEquipped, "Weapon is already equipped");
        
        weapons[tokenId].isEquipped = true;
        weapons[tokenId].equippedTo = monanimalId;
        
        emit WeaponEquipped(tokenId, monanimalId);
    }

    function unequipWeapon(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(weapons[tokenId].isEquipped, "Weapon is not equipped");
        
        weapons[tokenId].isEquipped = false;
        weapons[tokenId].equippedTo = 0;
        
        emit WeaponUnequipped(tokenId);
    }

    function reduceDurability(uint256 tokenId, uint256 amount) external {
        require(msg.sender == owner(), "Only battle arena can reduce durability");
        
        if (weapons[tokenId].durability > amount) {
            weapons[tokenId].durability -= amount;
        } else {
            weapons[tokenId].durability = 0;
        }
    }

    function getWeapon(uint256 tokenId) public view returns (Weapon memory) {
        return weapons[tokenId];
    }

    function getOwnerWeapons(address owner) public view returns (uint256[] memory) {
        return ownerWeapons[owner];
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        Weapon memory weapon = weapons[tokenId];
        
        string memory svg = _generateWeaponSVG(weapon);
        string memory json = _generateWeaponMetadata(tokenId, weapon, svg);
        
        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(json))));
    }

    function _generateWeaponSVG(Weapon memory weapon) private pure returns (string memory) {
        string memory colors = _getWeaponColors(weapon.material, weapon.rarity);
        string memory shape = _getWeaponShape(weapon.weaponType);
        string memory effects = _getWeaponEffects(weapon.rarity);
        
        return string(abi.encodePacked(
            '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">',
            '<defs>',
            colors,
            effects,
            '</defs>',
            '<rect width="400" height="400" fill="url(#weaponBg)"/>',
            shape,
            _generateWeaponStats(weapon),
            '</svg>'
        ));
    }

    function _getWeaponColors(string memory material, Rarity rarity) private pure returns (string memory) {
        // Couleurs basées sur le matériau et la rareté
        if (keccak256(bytes(material)) == keccak256(bytes("Monad Crystal"))) {
            return '<linearGradient id="weaponBg"><stop offset="0%" stop-color="#836EF9"/><stop offset="100%" stop-color="#200052"/></linearGradient><linearGradient id="weaponColor"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#836EF9"/></linearGradient>';
        }
        return '<linearGradient id="weaponBg"><stop offset="0%" stop-color="#0E100F"/><stop offset="100%" stop-color="#FBFAF9"/></linearGradient><linearGradient id="weaponColor"><stop offset="0%" stop-color="#836EF9"/><stop offset="100%" stop-color="#A0055D"/></linearGradient>';
    }

    function _getWeaponShape(WeaponType weaponType) private pure returns (string memory) {
        if (weaponType == WeaponType.Sword) {
            return '<rect x="190" y="100" width="20" height="200" fill="url(#weaponColor)"/><rect x="180" y="300" width="40" height="20" fill="url(#weaponColor)"/>';
        } else if (weaponType == WeaponType.Bow) {
            return '<path d="M150 100 Q200 150 150 300 Q200 250 250 300 Q200 150 250 100" stroke="url(#weaponColor)" stroke-width="8" fill="none"/>';
        } else if (weaponType == WeaponType.Staff) {
            return '<rect x="195" y="50" width="10" height="300" fill="url(#weaponColor)"/><circle cx="200" cy="70" r="20" fill="url(#weaponColor)"/>';
        }
        // Autres formes d'armes...
        return '<rect x="180" y="150" width="40" height="100" fill="url(#weaponColor)"/>';
    }

    function _getWeaponEffects(Rarity rarity) private pure returns (string memory) {
        if (rarity == Rarity.Legendary || rarity == Rarity.Mythic) {
            return '<filter id="weaponGlow"><feGaussianBlur stdDeviation="4" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
        }
        return '';
    }

    function _generateWeaponStats(Weapon memory weapon) private pure returns (string memory) {
        return string(abi.encodePacked(
            '<text x="20" y="350" fill="white" font-size="12">', weapon.name, '</text>',
            '<text x="20" y="365" fill="white" font-size="10">ATK: +', weapon.stats.attackBonus.toString(), '</text>',
            '<text x="20" y="380" fill="white" font-size="10">DEF: +', weapon.stats.defenseBonus.toString(), '</text>',
            '<text x="120" y="365" fill="white" font-size="10">SPD: +', weapon.stats.speedBonus.toString(), '</text>',
            '<text x="120" y="380" fill="white" font-size="10">CRIT: ', weapon.stats.criticalChance.toString(), '%</text>',
            '<text x="220" y="365" fill="white" font-size="10">DUR: ', weapon.durability.toString(), '/', weapon.maxDurability.toString(), '</text>'
        ));
    }

    function _generateWeaponMetadata(uint256 tokenId, Weapon memory weapon, string memory svg) private pure returns (string memory) {
        return string(abi.encodePacked(
            '{"name":"', weapon.name, '",',
            '"description":"A powerful weapon for BrawlNads battles",',
            '"image":"data:image/svg+xml;base64,', Base64.encode(bytes(svg)), '",',
            '"attributes":[',
            '{"trait_type":"Type","value":"', _getWeaponTypeName(weapon.weaponType), '"},',
            '{"trait_type":"Rarity","value":"', _getWeaponRarityName(weapon.rarity), '"},',
            '{"trait_type":"Material","value":"', weapon.material, '"},',
            '{"trait_type":"Attack Bonus","value":', weapon.stats.attackBonus.toString(), '},',
            '{"trait_type":"Defense Bonus","value":', weapon.stats.defenseBonus.toString(), '},',
            '{"trait_type":"Speed Bonus","value":', weapon.stats.speedBonus.toString(), '},',
            '{"trait_type":"Magic Bonus","value":', weapon.stats.magicBonus.toString(), '},',
            '{"trait_type":"Critical Chance","value":', weapon.stats.criticalChance.toString(), '},',
            '{"trait_type":"Durability","value":"', weapon.durability.toString(), '/', weapon.maxDurability.toString(), '"},',
            '{"trait_type":"Equipped","value":', weapon.isEquipped ? 'true' : 'false', '}',
            ']}'
        ));
    }

    function _getWeaponTypeName(WeaponType weaponType) private pure returns (string memory) {
        string[8] memory names = ["Sword", "Axe", "Bow", "Staff", "Dagger", "Hammer", "Spear", "Wand"];
        return names[uint256(weaponType)];
    }

    function _getWeaponRarityName(Rarity rarity) private pure returns (string memory) {
        string[6] memory names = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"];
        return names[uint256(rarity)];
    }

    // Fonctions de support ERC721Enumerable
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // Fonctions d'administration
    function setForgePrice(uint256 _price) external onlyOwner {
        forgePrice = _price;
    }

    function setRepairPrice(uint256 _price) external onlyOwner {
        repairPrice = _price;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}

