// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract ArtifactNFT is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIdCounter;

    // Types d'artefacts
    enum ArtifactType { Ring, Amulet, Crown, Orb, Rune, Talisman, Gem, Scroll }

    // Rareté des artefacts
    enum Rarity { Common, Uncommon, Rare, Epic, Legendary, Mythic }

    // Effets spéciaux des artefacts
    enum SpecialEffect { 
        None,
        HealthRegeneration,
        ManaShield,
        DoubleDamage,
        CriticalStrike,
        SpeedBoost,
        Reflection,
        Vampirism,
        Immunity,
        TimeWarp,
        ElementalBurst,
        PhoenixRevive
    }

    struct ArtifactStats {
        uint256 healthBonus;
        uint256 attackBonus;
        uint256 defenseBonus;
        uint256 speedBonus;
        uint256 magicBonus;
        uint256 luckBonus;
    }

    struct Artifact {
        string name;
        ArtifactType artifactType;
        Rarity rarity;
        ArtifactStats stats;
        SpecialEffect specialEffect;
        uint256 effectPower; // Puissance de l'effet spécial (0-100)
        string essence; // Essence magique pour la génération SVG
        bool isEquipped;
        uint256 equippedTo; // ID du Monanimal équipé
        uint256 charges; // Nombre d'utilisations restantes pour certains effets
        uint256 maxCharges;
    }

    mapping(uint256 => Artifact) public artifacts;
    mapping(address => uint256[]) public ownerArtifacts;
    
    // Prix de craft et recharge
    uint256 public craftPrice = 0.008 ether;
    uint256 public rechargePrice = 0.003 ether;
    
    // Événements
    event ArtifactCrafted(uint256 indexed tokenId, address indexed owner, ArtifactType artifactType, Rarity rarity);
    event ArtifactRecharged(uint256 indexed tokenId, uint256 newCharges);
    event ArtifactEquipped(uint256 indexed tokenId, uint256 indexed monanimalId);
    event ArtifactUnequipped(uint256 indexed tokenId);
    event SpecialEffectTriggered(uint256 indexed tokenId, SpecialEffect effect, uint256 power);

    constructor() ERC721("BrawlNads Artifacts", "ARTIFACT") {}

    function craft() public payable {
        require(msg.value >= craftPrice, "Insufficient payment");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        // Génération aléatoire de l'artefact
        (ArtifactType artifactType, Rarity rarity, ArtifactStats memory stats, SpecialEffect effect, uint256 effectPower, string memory essence) = _generateRandomArtifact(tokenId);
        
        string memory name = _generateArtifactName(artifactType, rarity, essence, tokenId);
        uint256 maxCharges = _getMaxCharges(effect, rarity);
        
        artifacts[tokenId] = Artifact({
            name: name,
            artifactType: artifactType,
            rarity: rarity,
            stats: stats,
            specialEffect: effect,
            effectPower: effectPower,
            essence: essence,
            isEquipped: false,
            equippedTo: 0,
            charges: maxCharges,
            maxCharges: maxCharges
        });
        
        ownerArtifacts[msg.sender].push(tokenId);
        _safeMint(msg.sender, tokenId);
        
        emit ArtifactCrafted(tokenId, msg.sender, artifactType, rarity);
    }

    function _generateRandomArtifact(uint256 seed) private view returns (
        ArtifactType artifactType,
        Rarity rarity,
        ArtifactStats memory stats,
        SpecialEffect effect,
        uint256 effectPower,
        string memory essence
    ) {
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, seed, msg.sender)));
        
        // Génération du type d'artefact
        artifactType = ArtifactType(random % 8);
        
        // Génération de la rareté (plus rare que les armes)
        uint256 rarityRoll = (random >> 8) % 1000;
        if (rarityRoll < 300) rarity = Rarity.Common;
        else if (rarityRoll < 550) rarity = Rarity.Uncommon;
        else if (rarityRoll < 750) rarity = Rarity.Rare;
        else if (rarityRoll < 900) rarity = Rarity.Epic;
        else if (rarityRoll < 970) rarity = Rarity.Legendary;
        else rarity = Rarity.Mythic;
        
        // Génération des stats
        stats = _generateArtifactStats(artifactType, rarity, random);
        
        // Génération de l'effet spécial
        effect = _generateSpecialEffect(rarity, random);
        effectPower = 20 + uint256(rarity) * 15 + ((random >> 56) % 20); // 20-135
        
        // Génération de l'essence
        essence = _generateEssence(rarity, random);
    }

    function _generateArtifactStats(ArtifactType artifactType, Rarity rarity, uint256 random) private pure returns (ArtifactStats memory) {
        uint256 baseBonus = 5 + uint256(rarity) * 10; // 5-55 selon la rareté
        uint256 variance = 3; // ±3 de variance
        
        uint256 healthBonus = baseBonus + ((random >> 16) % variance);
        uint256 attackBonus = baseBonus + ((random >> 24) % variance);
        uint256 defenseBonus = baseBonus + ((random >> 32) % variance);
        uint256 speedBonus = baseBonus + ((random >> 40) % variance);
        uint256 magicBonus = baseBonus + ((random >> 48) % variance);
        uint256 luckBonus = baseBonus + ((random >> 56) % variance);
        
        // Bonus spécifiques au type d'artefact
        if (artifactType == ArtifactType.Ring) {
            luckBonus += 15;
            speedBonus += 10;
        } else if (artifactType == ArtifactType.Amulet) {
            defenseBonus += 20;
            healthBonus += 15;
        } else if (artifactType == ArtifactType.Crown) {
            magicBonus += 25;
            attackBonus += 10;
        } else if (artifactType == ArtifactType.Orb) {
            magicBonus += 30;
            healthBonus += 10;
        } else if (artifactType == ArtifactType.Rune) {
            attackBonus += 20;
            magicBonus += 15;
        } else if (artifactType == ArtifactType.Talisman) {
            defenseBonus += 15;
            luckBonus += 20;
        } else if (artifactType == ArtifactType.Gem) {
            magicBonus += 20;
            luckBonus += 15;
        } else if (artifactType == ArtifactType.Scroll) {
            magicBonus += 35;
            defenseBonus -= 5;
        }
        
        return ArtifactStats(healthBonus, attackBonus, defenseBonus, speedBonus, magicBonus, luckBonus);
    }

    function _generateSpecialEffect(Rarity rarity, uint256 random) private pure returns (SpecialEffect) {
        if (rarity == Rarity.Common) {
            SpecialEffect[3] memory effects = [SpecialEffect.None, SpecialEffect.HealthRegeneration, SpecialEffect.SpeedBoost];
            return effects[random % 3];
        } else if (rarity == Rarity.Uncommon) {
            SpecialEffect[4] memory effects = [SpecialEffect.HealthRegeneration, SpecialEffect.ManaShield, SpecialEffect.SpeedBoost, SpecialEffect.CriticalStrike];
            return effects[random % 4];
        } else if (rarity == Rarity.Rare) {
            SpecialEffect[5] memory effects = [SpecialEffect.ManaShield, SpecialEffect.DoubleDamage, SpecialEffect.CriticalStrike, SpecialEffect.Reflection, SpecialEffect.Vampirism];
            return effects[random % 5];
        } else if (rarity == Rarity.Epic) {
            SpecialEffect[4] memory effects = [SpecialEffect.DoubleDamage, SpecialEffect.Reflection, SpecialEffect.Vampirism, SpecialEffect.Immunity];
            return effects[random % 4];
        } else if (rarity == Rarity.Legendary) {
            SpecialEffect[4] memory effects = [SpecialEffect.Immunity, SpecialEffect.TimeWarp, SpecialEffect.ElementalBurst, SpecialEffect.PhoenixRevive];
            return effects[random % 4];
        } else {
            SpecialEffect[3] memory effects = [SpecialEffect.TimeWarp, SpecialEffect.ElementalBurst, SpecialEffect.PhoenixRevive];
            return effects[random % 3];
        }
    }

    function _generateEssence(Rarity rarity, uint256 random) private pure returns (string memory) {
        if (rarity == Rarity.Common || rarity == Rarity.Uncommon) {
            string[4] memory essences = ["Earth", "Water", "Fire", "Air"];
            return essences[random % 4];
        } else if (rarity == Rarity.Rare || rarity == Rarity.Epic) {
            string[4] memory essences = ["Lightning", "Ice", "Shadow", "Light"];
            return essences[random % 4];
        } else {
            string[4] memory essences = ["Monad Energy", "Cosmic Force", "Void Essence", "Pure Magic"];
            return essences[random % 4];
        }
    }

    function _getMaxCharges(SpecialEffect effect, Rarity rarity) private pure returns (uint256) {
        if (effect == SpecialEffect.None || effect == SpecialEffect.HealthRegeneration || effect == SpecialEffect.ManaShield) {
            return 0; // Effets passifs
        }
        return 3 + uint256(rarity) * 2; // 3-13 charges selon la rareté
    }

    function _generateArtifactName(ArtifactType artifactType, Rarity rarity, string memory essence, uint256 tokenId) private pure returns (string memory) {
        string[8] memory typeNames = ["Ring", "Amulet", "Crown", "Orb", "Rune", "Talisman", "Gem", "Scroll"];
        string[6] memory rarityPrefixes = ["", "Enchanted", "Rare", "Epic", "Legendary", "Mythic"];
        
        return string(abi.encodePacked(
            rarityPrefixes[uint256(rarity)],
            bytes(rarityPrefixes[uint256(rarity)]).length > 0 ? " " : "",
            essence,
            " ",
            typeNames[uint256(artifactType)],
            " #",
            tokenId.toString()
        ));
    }

    function rechargeArtifact(uint256 tokenId) public payable {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(artifacts[tokenId].charges < artifacts[tokenId].maxCharges, "Artifact is already fully charged");
        require(msg.value >= rechargePrice, "Insufficient payment");
        
        artifacts[tokenId].charges = artifacts[tokenId].maxCharges;
        emit ArtifactRecharged(tokenId, artifacts[tokenId].charges);
    }

    function equipArtifact(uint256 tokenId, uint256 monanimalId) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(!artifacts[tokenId].isEquipped, "Artifact is already equipped");
        
        artifacts[tokenId].isEquipped = true;
        artifacts[tokenId].equippedTo = monanimalId;
        
        emit ArtifactEquipped(tokenId, monanimalId);
    }

    function unequipArtifact(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(artifacts[tokenId].isEquipped, "Artifact is not equipped");
        
        artifacts[tokenId].isEquipped = false;
        artifacts[tokenId].equippedTo = 0;
        
        emit ArtifactUnequipped(tokenId);
    }

    function useSpecialEffect(uint256 tokenId) external returns (bool) {
        require(msg.sender == owner(), "Only battle arena can use special effects");
        
        Artifact storage artifact = artifacts[tokenId];
        
        if (artifact.specialEffect == SpecialEffect.None || 
            artifact.specialEffect == SpecialEffect.HealthRegeneration || 
            artifact.specialEffect == SpecialEffect.ManaShield) {
            return true; // Effets passifs toujours actifs
        }
        
        if (artifact.charges > 0) {
            artifact.charges--;
            emit SpecialEffectTriggered(tokenId, artifact.specialEffect, artifact.effectPower);
            return true;
        }
        
        return false; // Pas assez de charges
    }

    function getArtifact(uint256 tokenId) public view returns (Artifact memory) {
        return artifacts[tokenId];
    }

    function getOwnerArtifacts(address owner) public view returns (uint256[] memory) {
        return ownerArtifacts[owner];
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        Artifact memory artifact = artifacts[tokenId];
        
        string memory svg = _generateArtifactSVG(artifact);
        string memory json = _generateArtifactMetadata(tokenId, artifact, svg);
        
        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(json))));
    }

    function _generateArtifactSVG(Artifact memory artifact) private pure returns (string memory) {
        string memory colors = _getArtifactColors(artifact.essence, artifact.rarity);
        string memory shape = _getArtifactShape(artifact.artifactType);
        string memory effects = _getArtifactEffects(artifact.rarity, artifact.specialEffect);
        
        return string(abi.encodePacked(
            '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">',
            '<defs>',
            colors,
            effects,
            '</defs>',
            '<rect width="400" height="400" fill="url(#artifactBg)"/>',
            shape,
            _generateArtifactInfo(artifact),
            '</svg>'
        ));
    }

    function _getArtifactColors(string memory essence, Rarity rarity) private pure returns (string memory) {
        if (keccak256(bytes(essence)) == keccak256(bytes("Monad Energy"))) {
            return '<radialGradient id="artifactBg"><stop offset="0%" stop-color="#836EF9"/><stop offset="100%" stop-color="#200052"/></radialGradient><radialGradient id="artifactColor"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#836EF9"/></radialGradient>';
        } else if (keccak256(bytes(essence)) == keccak256(bytes("Fire"))) {
            return '<radialGradient id="artifactBg"><stop offset="0%" stop-color="#FF6B35"/><stop offset="100%" stop-color="#8B0000"/></radialGradient><radialGradient id="artifactColor"><stop offset="0%" stop-color="#FFD700"/><stop offset="100%" stop-color="#FF4500"/></radialGradient>';
        }
        return '<radialGradient id="artifactBg"><stop offset="0%" stop-color="#836EF9"/><stop offset="100%" stop-color="#0E100F"/></radialGradient><radialGradient id="artifactColor"><stop offset="0%" stop-color="#A0055D"/><stop offset="100%" stop-color="#836EF9"/></radialGradient>';
    }

    function _getArtifactShape(ArtifactType artifactType) private pure returns (string memory) {
        if (artifactType == ArtifactType.Ring) {
            return '<circle cx="200" cy="200" r="80" stroke="url(#artifactColor)" stroke-width="20" fill="none"/><circle cx="200" cy="200" r="20" fill="url(#artifactColor)"/>';
        } else if (artifactType == ArtifactType.Crown) {
            return '<polygon points="120,250 200,150 280,250 260,280 140,280" fill="url(#artifactColor)"/><circle cx="200" cy="170" r="15" fill="url(#artifactColor)"/>';
        } else if (artifactType == ArtifactType.Orb) {
            return '<circle cx="200" cy="200" r="60" fill="url(#artifactColor)" opacity="0.8"/><circle cx="200" cy="200" r="40" fill="url(#artifactColor)"/>';
        }
        // Autres formes d'artefacts...
        return '<rect x="150" y="150" width="100" height="100" fill="url(#artifactColor)" rx="20"/>';
    }

    function _getArtifactEffects(Rarity rarity, SpecialEffect effect) private pure returns (string memory) {
        if (rarity >= Rarity.Epic) {
            return '<filter id="artifactGlow"><feGaussianBlur stdDeviation="5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter><animateTransform attributeName="transform" type="rotate" values="0 200 200;360 200 200" dur="10s" repeatCount="indefinite"/>';
        }
        return '';
    }

    function _generateArtifactInfo(Artifact memory artifact) private pure returns (string memory) {
        return string(abi.encodePacked(
            '<text x="20" y="350" fill="white" font-size="12">', artifact.name, '</text>',
            '<text x="20" y="365" fill="white" font-size="10">Effect: ', _getEffectName(artifact.specialEffect), '</text>',
            '<text x="20" y="380" fill="white" font-size="10">Power: ', artifact.effectPower.toString(), '</text>',
            '<text x="220" y="365" fill="white" font-size="10">Charges: ', artifact.charges.toString(), '/', artifact.maxCharges.toString(), '</text>'
        ));
    }

    function _getEffectName(SpecialEffect effect) private pure returns (string memory) {
        if (effect == SpecialEffect.None) return "None";
        else if (effect == SpecialEffect.HealthRegeneration) return "Health Regen";
        else if (effect == SpecialEffect.ManaShield) return "Mana Shield";
        else if (effect == SpecialEffect.DoubleDamage) return "Double Damage";
        else if (effect == SpecialEffect.CriticalStrike) return "Critical Strike";
        else if (effect == SpecialEffect.SpeedBoost) return "Speed Boost";
        else if (effect == SpecialEffect.Reflection) return "Reflection";
        else if (effect == SpecialEffect.Vampirism) return "Vampirism";
        else if (effect == SpecialEffect.Immunity) return "Immunity";
        else if (effect == SpecialEffect.TimeWarp) return "Time Warp";
        else if (effect == SpecialEffect.ElementalBurst) return "Elemental Burst";
        else if (effect == SpecialEffect.PhoenixRevive) return "Phoenix Revive";
        return "Unknown";
    }

    function _generateArtifactMetadata(uint256 tokenId, Artifact memory artifact, string memory svg) private pure returns (string memory) {
        return string(abi.encodePacked(
            '{"name":"', artifact.name, '",',
            '"description":"A mystical artifact with special powers for BrawlNads battles",',
            '"image":"data:image/svg+xml;base64,', Base64.encode(bytes(svg)), '",',
            '"attributes":[',
            '{"trait_type":"Type","value":"', _getArtifactTypeName(artifact.artifactType), '"},',
            '{"trait_type":"Rarity","value":"', _getArtifactRarityName(artifact.rarity), '"},',
            '{"trait_type":"Essence","value":"', artifact.essence, '"},',
            '{"trait_type":"Special Effect","value":"', _getEffectName(artifact.specialEffect), '"},',
            '{"trait_type":"Effect Power","value":', artifact.effectPower.toString(), '},',
            '{"trait_type":"Health Bonus","value":', artifact.stats.healthBonus.toString(), '},',
            '{"trait_type":"Attack Bonus","value":', artifact.stats.attackBonus.toString(), '},',
            '{"trait_type":"Defense Bonus","value":', artifact.stats.defenseBonus.toString(), '},',
            '{"trait_type":"Speed Bonus","value":', artifact.stats.speedBonus.toString(), '},',
            '{"trait_type":"Magic Bonus","value":', artifact.stats.magicBonus.toString(), '},',
            '{"trait_type":"Luck Bonus","value":', artifact.stats.luckBonus.toString(), '},',
            '{"trait_type":"Charges","value":"', artifact.charges.toString(), '/', artifact.maxCharges.toString(), '"},',
            '{"trait_type":"Equipped","value":', artifact.isEquipped ? 'true' : 'false', '}',
            ']}'
        ));
    }

    function _getArtifactTypeName(ArtifactType artifactType) private pure returns (string memory) {
        string[8] memory names = ["Ring", "Amulet", "Crown", "Orb", "Rune", "Talisman", "Gem", "Scroll"];
        return names[uint256(artifactType)];
    }

    function _getArtifactRarityName(Rarity rarity) private pure returns (string memory) {
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
    function setCraftPrice(uint256 _price) external onlyOwner {
        craftPrice = _price;
    }

    function setRechargePrice(uint256 _price) external onlyOwner {
        rechargePrice = _price;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}

