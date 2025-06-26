// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract MonanimalNFT is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIdCounter;

    // Classes de Monanimals
    enum MonanimalClass { Warrior, Assassin, Mage, Berserker, Guardian }

    // Rareté des Monanimals
    enum Rarity { Common, Uncommon, Rare, Epic, Legendary, Mythic }

    struct MonanimalStats {
        uint256 health;
        uint256 attack;
        uint256 defense;
        uint256 speed;
        uint256 magic;
        uint256 luck;
    }

    struct Monanimal {
        string name;
        MonanimalClass class;
        Rarity rarity;
        MonanimalStats stats;
        uint256 level;
        uint256 experience;
        uint256 wins;
        uint256 losses;
        bool isKO;
        uint256 lastBattleTime;
        string colorScheme; // Pour la génération SVG
        uint256 weaponId;
        uint256 artifactId;
    }

    mapping(uint256 => Monanimal) public monanimals;
    mapping(address => uint256[]) public ownerMonanimals;
    
    // Prix de mint et healing
    uint256 public mintPrice = 0.01 ether;
    uint256 public healingPrice = 0.005 ether;
    
    // Événements
    event MonanimalMinted(uint256 indexed tokenId, address indexed owner, MonanimalClass class, Rarity rarity);
    event MonanimalLevelUp(uint256 indexed tokenId, uint256 newLevel);
    event MonanimalHealed(uint256 indexed tokenId);
    event MonanimalEquipped(uint256 indexed tokenId, uint256 weaponId, uint256 artifactId);

    constructor() ERC721("BrawlNads Monanimals", "BRAWL") {}

    function mint() public payable {
        require(msg.value >= mintPrice, "Insufficient payment");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        // Génération aléatoire des caractéristiques
        (MonanimalClass class, Rarity rarity, MonanimalStats memory stats, string memory colorScheme) = _generateRandomMonanimal(tokenId);
        
        string memory name = _generateName(class, rarity, tokenId);
        
        monanimals[tokenId] = Monanimal({
            name: name,
            class: class,
            rarity: rarity,
            stats: stats,
            level: 1,
            experience: 0,
            wins: 0,
            losses: 0,
            isKO: false,
            lastBattleTime: 0,
            colorScheme: colorScheme,
            weaponId: 0,
            artifactId: 0
        });
        
        ownerMonanimals[msg.sender].push(tokenId);
        _safeMint(msg.sender, tokenId);
        
        emit MonanimalMinted(tokenId, msg.sender, class, rarity);
    }

    function _generateRandomMonanimal(uint256 seed) private view returns (
        MonanimalClass class,
        Rarity rarity,
        MonanimalStats memory stats,
        string memory colorScheme
    ) {
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, seed, msg.sender)));
        
        // Génération de la classe (équiprobable)
        class = MonanimalClass(random % 5);
        
        // Génération de la rareté (avec probabilités décroissantes)
        uint256 rarityRoll = (random >> 8) % 1000;
        if (rarityRoll < 500) rarity = Rarity.Common;
        else if (rarityRoll < 750) rarity = Rarity.Uncommon;
        else if (rarityRoll < 900) rarity = Rarity.Rare;
        else if (rarityRoll < 970) rarity = Rarity.Epic;
        else if (rarityRoll < 995) rarity = Rarity.Legendary;
        else rarity = Rarity.Mythic;
        
        // Génération des stats basées sur la classe et la rareté
        stats = _generateStats(class, rarity, random);
        
        // Génération du schéma de couleurs Monad
        colorScheme = _generateColorScheme(random);
    }

    function _generateStats(MonanimalClass class, Rarity rarity, uint256 random) private pure returns (MonanimalStats memory) {
        uint256 baseMultiplier = 50 + uint256(rarity) * 20; // 50-170 selon la rareté
        uint256 variance = 20; // ±20% de variance
        
        uint256 health = baseMultiplier + ((random >> 16) % variance);
        uint256 attack = baseMultiplier + ((random >> 24) % variance);
        uint256 defense = baseMultiplier + ((random >> 32) % variance);
        uint256 speed = baseMultiplier + ((random >> 40) % variance);
        uint256 magic = baseMultiplier + ((random >> 48) % variance);
        uint256 luck = baseMultiplier + ((random >> 56) % variance);
        
        // Bonus spécifiques à la classe
        if (class == MonanimalClass.Warrior) {
            attack += 30;
            defense += 20;
        } else if (class == MonanimalClass.Assassin) {
            speed += 40;
            luck += 20;
        } else if (class == MonanimalClass.Mage) {
            magic += 50;
            health -= 10;
        } else if (class == MonanimalClass.Berserker) {
            attack += 40;
            defense -= 20;
        } else if (class == MonanimalClass.Guardian) {
            defense += 40;
            health += 30;
            speed -= 20;
        }
        
        return MonanimalStats(health, attack, defense, speed, magic, luck);
    }

    function _generateColorScheme(uint256 random) private pure returns (string memory) {
        string[6] memory schemes = [
            "purple-blue", // Monad Purple + Blue
            "purple-berry", // Monad Purple + Berry
            "blue-purple", // Monad Blue + Purple
            "berry-purple", // Monad Berry + Purple
            "purple-gradient", // Dégradé violet
            "cosmic-purple" // Violet cosmique
        ];
        return schemes[random % 6];
    }

    function _generateName(MonanimalClass class, Rarity rarity, uint256 tokenId) private pure returns (string memory) {
        string[5] memory classNames = ["Warrior", "Assassin", "Mage", "Berserker", "Guardian"];
        string[6] memory rarityPrefixes = ["", "Shiny", "Rare", "Epic", "Legendary", "Mythic"];
        
        return string(abi.encodePacked(
            rarityPrefixes[uint256(rarity)],
            bytes(rarityPrefixes[uint256(rarity)]).length > 0 ? " " : "",
            classNames[uint256(class)],
            " #",
            tokenId.toString()
        ));
    }

    function healMonanimal(uint256 tokenId) public payable {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(monanimals[tokenId].isKO, "Monanimal is not KO");
        require(msg.value >= healingPrice, "Insufficient payment");
        
        monanimals[tokenId].isKO = false;
        emit MonanimalHealed(tokenId);
    }

    function addExperience(uint256 tokenId, uint256 exp) external {
        // Cette fonction sera appelée par le contrat BattleArena
        require(msg.sender == owner(), "Only battle arena can add experience");
        
        monanimals[tokenId].experience += exp;
        
        // Vérifier si level up
        uint256 requiredExp = monanimals[tokenId].level * 100;
        if (monanimals[tokenId].experience >= requiredExp) {
            monanimals[tokenId].level++;
            monanimals[tokenId].experience -= requiredExp;
            
            // Bonus de stats au level up
            monanimals[tokenId].stats.health += 5;
            monanimals[tokenId].stats.attack += 3;
            monanimals[tokenId].stats.defense += 3;
            monanimals[tokenId].stats.speed += 2;
            monanimals[tokenId].stats.magic += 2;
            monanimals[tokenId].stats.luck += 1;
            
            emit MonanimalLevelUp(tokenId, monanimals[tokenId].level);
        }
    }

    function equipItems(uint256 tokenId, uint256 weaponId, uint256 artifactId) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        
        monanimals[tokenId].weaponId = weaponId;
        monanimals[tokenId].artifactId = artifactId;
        
        emit MonanimalEquipped(tokenId, weaponId, artifactId);
    }

    function updateBattleResult(uint256 tokenId, bool won) external {
        require(msg.sender == owner(), "Only battle arena can update results");
        
        if (won) {
            monanimals[tokenId].wins++;
        } else {
            monanimals[tokenId].losses++;
            monanimals[tokenId].isKO = true;
        }
        
        monanimals[tokenId].lastBattleTime = block.timestamp;
    }

    function getMonanimal(uint256 tokenId) public view returns (Monanimal memory) {
        return monanimals[tokenId];
    }

    function getOwnerMonanimals(address owner) public view returns (uint256[] memory) {
        return ownerMonanimals[owner];
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        Monanimal memory monanimal = monanimals[tokenId];
        
        string memory svg = _generateSVG(monanimal);
        string memory json = _generateMetadata(tokenId, monanimal, svg);
        
        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(json))));
    }

    function _generateSVG(Monanimal memory monanimal) private pure returns (string memory) {
        // Génération SVG basée sur les caractéristiques du Monanimal
        // Style inspiré des memes Monad avec grenouilles violettes
        
        string memory colors = _getColors(monanimal.colorScheme);
        string memory classShape = _getClassShape(monanimal.class);
        string memory rarityEffects = _getRarityEffects(monanimal.rarity);
        
        return string(abi.encodePacked(
            '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">',
            '<defs>',
            colors,
            rarityEffects,
            '</defs>',
            '<rect width="400" height="400" fill="url(#bg)"/>',
            classShape,
            _generateFace(monanimal),
            _generateStats(monanimal),
            '</svg>'
        ));
    }

    function _getColors(string memory scheme) private pure returns (string memory) {
        if (keccak256(bytes(scheme)) == keccak256(bytes("purple-blue"))) {
            return '<linearGradient id="bg"><stop offset="0%" stop-color="#836EF9"/><stop offset="100%" stop-color="#200052"/></linearGradient><linearGradient id="body"><stop offset="0%" stop-color="#836EF9"/><stop offset="100%" stop-color="#A0055D"/></linearGradient>';
        }
        // Autres schémas de couleurs...
        return '<linearGradient id="bg"><stop offset="0%" stop-color="#836EF9"/><stop offset="100%" stop-color="#FBFAF9"/></linearGradient><linearGradient id="body"><stop offset="0%" stop-color="#836EF9"/><stop offset="100%" stop-color="#200052"/></linearGradient>';
    }

    function _getClassShape(MonanimalClass class) private pure returns (string memory) {
        if (class == MonanimalClass.Warrior) {
            return '<rect x="150" y="150" width="100" height="100" fill="url(#body)" rx="20"/>';
        } else if (class == MonanimalClass.Mage) {
            return '<circle cx="200" cy="200" r="50" fill="url(#body)"/>';
        }
        // Autres formes selon la classe...
        return '<ellipse cx="200" cy="200" rx="60" ry="50" fill="url(#body)"/>';
    }

    function _getRarityEffects(Rarity rarity) private pure returns (string memory) {
        if (rarity == Rarity.Legendary || rarity == Rarity.Mythic) {
            return '<filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
        }
        return '';
    }

    function _generateFace(Monanimal memory monanimal) private pure returns (string memory) {
        // Yeux style grenouille Monad
        return string(abi.encodePacked(
            '<circle cx="180" cy="180" r="15" fill="white"/>',
            '<circle cx="220" cy="180" r="15" fill="white"/>',
            '<circle cx="180" cy="180" r="8" fill="black"/>',
            '<circle cx="220" cy="180" r="8" fill="black"/>',
            '<circle cx="182" cy="178" r="2" fill="white"/>',
            '<circle cx="222" cy="178" r="2" fill="white"/>'
        ));
    }

    function _generateStats(Monanimal memory monanimal) private pure returns (string memory) {
        return string(abi.encodePacked(
            '<text x="20" y="350" fill="white" font-size="12">Level: ', monanimal.level.toString(), '</text>',
            '<text x="20" y="365" fill="white" font-size="10">HP: ', monanimal.stats.health.toString(), '</text>',
            '<text x="20" y="380" fill="white" font-size="10">ATK: ', monanimal.stats.attack.toString(), '</text>',
            '<text x="120" y="365" fill="white" font-size="10">DEF: ', monanimal.stats.defense.toString(), '</text>',
            '<text x="120" y="380" fill="white" font-size="10">SPD: ', monanimal.stats.speed.toString(), '</text>'
        ));
    }

    function _generateMetadata(uint256 tokenId, Monanimal memory monanimal, string memory svg) private pure returns (string memory) {
        return string(abi.encodePacked(
            '{"name":"', monanimal.name, '",',
            '"description":"A unique Monanimal fighter in the BrawlNads battle royale",',
            '"image":"data:image/svg+xml;base64,', Base64.encode(bytes(svg)), '",',
            '"attributes":[',
            '{"trait_type":"Class","value":"', _getClassName(monanimal.class), '"},',
            '{"trait_type":"Rarity","value":"', _getRarityName(monanimal.rarity), '"},',
            '{"trait_type":"Level","value":', monanimal.level.toString(), '},',
            '{"trait_type":"Health","value":', monanimal.stats.health.toString(), '},',
            '{"trait_type":"Attack","value":', monanimal.stats.attack.toString(), '},',
            '{"trait_type":"Defense","value":', monanimal.stats.defense.toString(), '},',
            '{"trait_type":"Speed","value":', monanimal.stats.speed.toString(), '},',
            '{"trait_type":"Magic","value":', monanimal.stats.magic.toString(), '},',
            '{"trait_type":"Luck","value":', monanimal.stats.luck.toString(), '},',
            '{"trait_type":"Wins","value":', monanimal.wins.toString(), '},',
            '{"trait_type":"Losses","value":', monanimal.losses.toString(), '}',
            ']}'
        ));
    }

    function _getClassName(MonanimalClass class) private pure returns (string memory) {
        string[5] memory names = ["Warrior", "Assassin", "Mage", "Berserker", "Guardian"];
        return names[uint256(class)];
    }

    function _getRarityName(Rarity rarity) private pure returns (string memory) {
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
    function setMintPrice(uint256 _price) external onlyOwner {
        mintPrice = _price;
    }

    function setHealingPrice(uint256 _price) external onlyOwner {
        healingPrice = _price;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}

