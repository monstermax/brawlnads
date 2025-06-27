// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./MonanimalNFT.sol";
import "./WeaponNFT.sol";
import "./ArtifactNFT.sol";


contract BattleArena is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _battleIdCounter;

    MonanimalNFT public monanimalContract;
    WeaponNFT public weaponContract;
    ArtifactNFT public artifactContract;

    // États de bataille
    enum BattleState { Pending, InProgress, Completed, Cancelled }

    // Types de bataille
    enum BattleType { Duel, Tournament, Royale }

    struct BattleAction {
        uint256 attacker;
        uint256 defender;
        string actionType; // "attack", "special", "defend", "item"
        uint256 damage;
        bool isCritical;
        bool isBlocked;
        string description;
    }

    struct Battle {
        uint256 battleId;
        BattleType battleType;
        uint256[] participants; // IDs des Monanimals participants
        address[] players; // Adresses des joueurs
        BattleState state;
        uint256 winner; // ID du Monanimal gagnant
        uint256 startTime;
        uint256 endTime;
        BattleAction[] actions; // Historique des actions
        uint256 entryFee;
        uint256 prizePool;
        bool replayGenerated;
    }

    struct CombatStats {
        uint256 currentHealth;
        uint256 maxHealth;
        uint256 attack;
        uint256 defense;
        uint256 speed;
        uint256 magic;
        uint256 luck;
        bool isAlive;
        uint256 weaponId;
        uint256 artifactId;
    }

    mapping(uint256 => Battle) public battles;
    mapping(uint256 => mapping(uint256 => CombatStats)) public battleStats; // battleId => monanimalId => stats
    mapping(address => uint256[]) public playerBattles;
    mapping(uint256 => bool) public monanimalInBattle; // Empêche les combats multiples simultanés

    uint256 public duelFee = 0.01 ether;
    uint256 public tournamentFee = 0.02 ether;
    uint256 public royaleFee = 0.05 ether;

    // Événements
    event BattleCreated(uint256 indexed battleId, BattleType battleType, uint256[] participants);
    event BattleStarted(uint256 indexed battleId);
    event BattleActionExecuted(uint256 indexed battleId, uint256 indexed actionIndex, BattleAction action);
    event BattleCompleted(uint256 indexed battleId, uint256 winner, uint256 prizePool);
    event PrizeDistributed(uint256 indexed battleId, address indexed player, uint256 amount);

    constructor(address _monanimalContract, address _weaponContract, address _artifactContract) {
        monanimalContract = MonanimalNFT(_monanimalContract);
        weaponContract = WeaponNFT(_weaponContract);
        artifactContract = ArtifactNFT(_artifactContract);
    }

    function createDuel(uint256 myMonanimalId, uint256 opponentMonanimalId) external payable nonReentrant {
        require(msg.value >= duelFee, "Insufficient entry fee");
        require(monanimalContract.ownerOf(myMonanimalId) == msg.sender, "Not owner of your Monanimal");
        require(!monanimalInBattle[myMonanimalId], "Your Monanimal is already in battle");
        require(!monanimalInBattle[opponentMonanimalId], "Opponent Monanimal is already in battle");
        
        MonanimalNFT.Monanimal memory myMon = monanimalContract.getMonanimal(myMonanimalId);
        MonanimalNFT.Monanimal memory oppMon = monanimalContract.getMonanimal(opponentMonanimalId);
        
        require(!myMon.isKO, "Your Monanimal is KO");
        require(!oppMon.isKO, "Opponent Monanimal is KO");

        uint256 battleId = _battleIdCounter.current();
        _battleIdCounter.increment();

        uint256[] memory participants = new uint256[](2);
        participants[0] = myMonanimalId;
        participants[1] = opponentMonanimalId;

        address[] memory players = new address[](2);
        players[0] = msg.sender;
        players[1] = monanimalContract.ownerOf(opponentMonanimalId);

        battles[battleId] = Battle({
            battleId: battleId,
            battleType: BattleType.Duel,
            participants: participants,
            players: players,
            state: BattleState.Pending,
            winner: 0,
            startTime: 0,
            endTime: 0,
            actions: new BattleAction[](0),
            entryFee: duelFee,
            prizePool: msg.value,
            replayGenerated: false
        });

        playerBattles[msg.sender].push(battleId);
        playerBattles[players[1]].push(battleId);

        monanimalInBattle[myMonanimalId] = true;
        monanimalInBattle[opponentMonanimalId] = true;

        emit BattleCreated(battleId, BattleType.Duel, participants);
        
        // Démarrer automatiquement le combat
        _startBattle(battleId);
    }

    function createTournament(uint256[] memory monanimalIds) external payable nonReentrant {
        require(msg.value >= tournamentFee * monanimalIds.length, "Insufficient entry fee");
        require(monanimalIds.length >= 4 && monanimalIds.length <= 16, "Tournament must have 4-16 participants");
        require(monanimalIds.length % 2 == 0, "Must have even number of participants");

        for (uint256 i = 0; i < monanimalIds.length; i++) {
            require(monanimalContract.ownerOf(monanimalIds[i]) == msg.sender, "Not owner of all Monanimals");
            require(!monanimalInBattle[monanimalIds[i]], "Monanimal already in battle");
            
            MonanimalNFT.Monanimal memory mon = monanimalContract.getMonanimal(monanimalIds[i]);
            require(!mon.isKO, "Monanimal is KO");
            
            monanimalInBattle[monanimalIds[i]] = true;
        }

        uint256 battleId = _battleIdCounter.current();
        _battleIdCounter.increment();

        address[] memory players = new address[](1);
        players[0] = msg.sender;

        battles[battleId] = Battle({
            battleId: battleId,
            battleType: BattleType.Tournament,
            participants: monanimalIds,
            players: players,
            state: BattleState.Pending,
            winner: 0,
            startTime: 0,
            endTime: 0,
            actions: new BattleAction[](0),
            entryFee: tournamentFee,
            prizePool: msg.value,
            replayGenerated: false
        });

        playerBattles[msg.sender].push(battleId);

        emit BattleCreated(battleId, BattleType.Tournament, monanimalIds);
        
        _startBattle(battleId);
    }

    function _startBattle(uint256 battleId) internal {
        Battle storage battle = battles[battleId];
        require(battle.state == BattleState.Pending, "Battle not pending");

        battle.state = BattleState.InProgress;
        battle.startTime = block.timestamp;

        // Initialiser les stats de combat pour tous les participants
        for (uint256 i = 0; i < battle.participants.length; i++) {
            uint256 monanimalId = battle.participants[i];
            _initializeCombatStats(battleId, monanimalId);
        }

        emit BattleStarted(battleId);

        // Exécuter le combat automatiquement
        _executeBattle(battleId);
    }

    function _initializeCombatStats(uint256 battleId, uint256 monanimalId) internal {
        MonanimalNFT.Monanimal memory mon = monanimalContract.getMonanimal(monanimalId);
        
        uint256 totalHealth = mon.stats.health;
        uint256 totalAttack = mon.stats.attack;
        uint256 totalDefense = mon.stats.defense;
        uint256 totalSpeed = mon.stats.speed;
        uint256 totalMagic = mon.stats.magic;
        uint256 totalLuck = mon.stats.luck;

        // Ajouter les bonus d'arme
        if (mon.weaponId > 0) {
            WeaponNFT.Weapon memory weapon = weaponContract.getWeapon(mon.weaponId);
            totalAttack += weapon.stats.attackBonus;
            totalDefense += weapon.stats.defenseBonus;
            totalSpeed += weapon.stats.speedBonus;
            totalMagic += weapon.stats.magicBonus;
            totalLuck += weapon.stats.luckBonus;
        }

        // Ajouter les bonus d'artefact
        if (mon.artifactId > 0) {
            ArtifactNFT.Artifact memory artifact = artifactContract.getArtifact(mon.artifactId);
            totalHealth += artifact.stats.healthBonus;
            totalAttack += artifact.stats.attackBonus;
            totalDefense += artifact.stats.defenseBonus;
            totalSpeed += artifact.stats.speedBonus;
            totalMagic += artifact.stats.magicBonus;
            totalLuck += artifact.stats.luckBonus;
        }

        battleStats[battleId][monanimalId] = CombatStats({
            currentHealth: totalHealth,
            maxHealth: totalHealth,
            attack: totalAttack,
            defense: totalDefense,
            speed: totalSpeed,
            magic: totalMagic,
            luck: totalLuck,
            isAlive: true,
            weaponId: mon.weaponId,
            artifactId: mon.artifactId
        });
    }

    function _executeBattle(uint256 battleId) internal {
        Battle storage battle = battles[battleId];
        
        if (battle.battleType == BattleType.Duel) {
            _executeDuel(battleId);
        } else if (battle.battleType == BattleType.Tournament) {
            _executeTournament(battleId);
        }
    }

    function _executeDuel(uint256 battleId) internal {
        Battle storage battle = battles[battleId];
        uint256 monanimal1 = battle.participants[0];
        uint256 monanimal2 = battle.participants[1];

        // Combat tour par tour jusqu'à ce qu'un Monanimal soit KO
        uint256 maxTurns = 50; // Limite pour éviter les boucles infinies
        uint256 turn = 0;

        while (battleStats[battleId][monanimal1].isAlive && 
               battleStats[battleId][monanimal2].isAlive && 
               turn < maxTurns) {

            // Déterminer l'ordre d'action basé sur la vitesse
            uint256 firstAttacker;
            uint256 secondAttacker;
            if (battleStats[battleId][monanimal1].speed >= battleStats[battleId][monanimal2].speed) {
                firstAttacker = monanimal1;
                secondAttacker = monanimal2;
            } else {
                firstAttacker = monanimal2;
                secondAttacker = monanimal1;
            }

            // Premier attaquant
            if (battleStats[battleId][firstAttacker].isAlive && battleStats[battleId][secondAttacker].isAlive) {
                _executeAttack(battleId, firstAttacker, secondAttacker);
            }

            // Deuxième attaquant (si encore vivant)
            if (battleStats[battleId][firstAttacker].isAlive && battleStats[battleId][secondAttacker].isAlive) {
                _executeAttack(battleId, secondAttacker, firstAttacker);
            }

            turn++;
        }

        // Déterminer le gagnant
        uint256 winner;
        if (battleStats[battleId][monanimal1].isAlive) {
            winner = monanimal1;
        } else if (battleStats[battleId][monanimal2].isAlive) {
            winner = monanimal2;
        } else {
            // Match nul - le plus rapide gagne
            winner = battleStats[battleId][monanimal1].speed >= battleStats[battleId][monanimal2].speed ? monanimal1 : monanimal2;
        }

        _completeBattle(battleId, winner);
    }

    function _executeTournament(uint256 battleId) internal {
        Battle storage battle = battles[battleId];
        uint256[] memory survivors = battle.participants;

        // Élimination successive jusqu'à un seul survivant
        while (survivors.length > 1) {
            uint256[] memory nextRound = new uint256[](survivors.length / 2);
            
            for (uint256 i = 0; i < survivors.length; i += 2) {
                uint256 winner = _executeTournamentMatch(battleId, survivors[i], survivors[i + 1]);
                nextRound[i / 2] = winner;
            }
            
            survivors = nextRound;
        }

        _completeBattle(battleId, survivors[0]);
    }

    function _executeTournamentMatch(uint256 battleId, uint256 monanimal1, uint256 monanimal2) internal returns (uint256) {
        // Combat simplifié pour le tournoi
        uint256 damage1 = _calculateDamage(battleId, monanimal1, monanimal2);
        uint256 damage2 = _calculateDamage(battleId, monanimal2, monanimal1);

        if (damage1 > damage2) {
            return monanimal1;
        } else if (damage2 > damage1) {
            return monanimal2;
        } else {
            // En cas d'égalité, le plus rapide gagne
            return battleStats[battleId][monanimal1].speed >= battleStats[battleId][monanimal2].speed ? monanimal1 : monanimal2;
        }
    }

    function _executeAttack(uint256 battleId, uint256 attackerId, uint256 defenderId) internal {
        uint256 damage = _calculateDamage(battleId, attackerId, defenderId);
        bool isCritical = _checkCritical(battleId, attackerId);
        bool isBlocked = _checkBlock(battleId, defenderId);

        if (isCritical) {
            damage = damage * 2;
        }

        if (isBlocked) {
            damage = damage / 2;
        }

        // Appliquer les dégâts
        CombatStats storage defenderStats = battleStats[battleId][defenderId];
        if (defenderStats.currentHealth > damage) {
            defenderStats.currentHealth -= damage;
        } else {
            defenderStats.currentHealth = 0;
            defenderStats.isAlive = false;
        }

        // Enregistrer l'action
        BattleAction memory action = BattleAction({
            attacker: attackerId,
            defender: defenderId,
            actionType: "attack",
            damage: damage,
            isCritical: isCritical,
            isBlocked: isBlocked,
            description: string(abi.encodePacked(
                "Monanimal #", _uint2str(attackerId), 
                " attacks Monanimal #", _uint2str(defenderId),
                " for ", _uint2str(damage), " damage"
            ))
        });

        battles[battleId].actions.push(action);
        emit BattleActionExecuted(battleId, battles[battleId].actions.length - 1, action);

        // Réduire la durabilité de l'arme
        if (battleStats[battleId][attackerId].weaponId > 0) {
            weaponContract.reduceDurability(battleStats[battleId][attackerId].weaponId, 1);
        }
    }

    function _calculateDamage(uint256 battleId, uint256 attackerId, uint256 defenderId) internal view returns (uint256) {
        CombatStats memory attackerStats = battleStats[battleId][attackerId];
        CombatStats memory defenderStats = battleStats[battleId][defenderId];

        uint256 baseDamage = attackerStats.attack;
        uint256 defense = defenderStats.defense;

        // Formule de dégâts avec variance aléatoire
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, attackerId, defenderId))) % 20;
        uint256 variance = 90 + random; // 90-110% de variance

        uint256 damage = (baseDamage * variance / 100);
        
        if (damage > defense) {
            damage -= defense / 2; // La défense réduit les dégâts de moitié
        } else {
            damage = damage / 4; // Dégâts minimums
        }

        return damage > 0 ? damage : 1; // Au moins 1 point de dégâts
    }

    function _checkCritical(uint256 battleId, uint256 attackerId) internal view returns (bool) {
        CombatStats memory stats = battleStats[battleId][attackerId];
        uint256 critChance = stats.luck / 10; // Base sur la chance
        
        // Bonus de critique de l'arme
        if (stats.weaponId > 0) {
            WeaponNFT.Weapon memory weapon = weaponContract.getWeapon(stats.weaponId);
            critChance += weapon.stats.criticalChance;
        }

        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, attackerId, "crit"))) % 100;
        return random < critChance;
    }

    function _checkBlock(uint256 battleId, uint256 defenderId) internal view returns (bool) {
        CombatStats memory stats = battleStats[battleId][defenderId];
        uint256 blockChance = stats.defense / 20; // Base sur la défense
        
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, defenderId, "block"))) % 100;
        return random < blockChance;
    }

    function _completeBattle(uint256 battleId, uint256 winnerId) internal {
        Battle storage battle = battles[battleId];
        battle.state = BattleState.Completed;
        battle.winner = winnerId;
        battle.endTime = block.timestamp;

        // Libérer les Monanimals du combat
        for (uint256 i = 0; i < battle.participants.length; i++) {
            monanimalInBattle[battle.participants[i]] = false;
        }

        // Mettre à jour les résultats des Monanimals
        for (uint256 i = 0; i < battle.participants.length; i++) {
            uint256 monanimalId = battle.participants[i];
            bool won = (monanimalId == winnerId);
            monanimalContract.updateBattleResult(monanimalId, won);
            
            if (won) {
                monanimalContract.addExperience(monanimalId, 100); // XP de victoire
            } else {
                monanimalContract.addExperience(monanimalId, 25); // XP de participation
            }
        }

        emit BattleCompleted(battleId, winnerId, battle.prizePool);

        // Distribuer les prix
        _distributePrizes(battleId);
    }

    function _distributePrizes(uint256 battleId) internal {
        Battle storage battle = battles[battleId];
        address winnerOwner = monanimalContract.ownerOf(battle.winner);
        
        uint256 prize = battle.prizePool * 90 / 100; // 90% au gagnant
        uint256 fee = battle.prizePool - prize; // 10% de frais

        payable(winnerOwner).transfer(prize);
        emit PrizeDistributed(battleId, winnerOwner, prize);
    }

    function getBattle(uint256 battleId) external view returns (Battle memory) {
        return battles[battleId];
    }

    function getBattleActions(uint256 battleId) external view returns (BattleAction[] memory) {
        return battles[battleId].actions;
    }

    function getPlayerBattles(address player) external view returns (uint256[] memory) {
        return playerBattles[player];
    }

    function _uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    // Fonctions d'administration
    function setFees(uint256 _duelFee, uint256 _tournamentFee, uint256 _royaleFee) external onlyOwner {
        duelFee = _duelFee;
        tournamentFee = _tournamentFee;
        royaleFee = _royaleFee;
    }

    function setContracts(address _monanimalContract, address _weaponContract, address _artifactContract) external onlyOwner {
        monanimalContract = MonanimalNFT(_monanimalContract);
        weaponContract = WeaponNFT(_weaponContract);
        artifactContract = ArtifactNFT(_artifactContract);
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Fonction d'urgence pour annuler une bataille bloquée
    function emergencyCancelBattle(uint256 battleId) external onlyOwner {
        Battle storage battle = battles[battleId];
        require(battle.state == BattleState.InProgress, "Battle not in progress");
        
        battle.state = BattleState.Cancelled;
        
        // Libérer les Monanimals
        for (uint256 i = 0; i < battle.participants.length; i++) {
            monanimalInBattle[battle.participants[i]] = false;
        }
        
        // Rembourser les frais
        for (uint256 i = 0; i < battle.players.length; i++) {
            payable(battle.players[i]).transfer(battle.entryFee);
        }
    }
}

