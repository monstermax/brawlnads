// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./MonanimalNFT.sol";
import "./WeaponNFT.sol";
import "./ArtifactNFT.sol";


contract BattleArenaOptimized is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _battleIdCounter;

    MonanimalNFT public monanimalContract;
    WeaponNFT public weaponContract;
    ArtifactNFT public artifactContract;

    // États de bataille (simplifiés)
    enum BattleState { Pending, Completed, Cancelled }

    // Types de bataille
    enum BattleType { Duel, Tournament }

    // Structure de bataille simplifiée
    struct Battle {
        uint256 battleId;
        BattleType battleType;
        uint256[2] participants; // Array fixe pour économiser du gas
        address[2] players;
        BattleState state;
        uint256 winner;
        uint256 prizePool;
        uint32 timestamp; // uint32 suffit pour timestamp
    }

    // Stats de combat en mémoire pour éviter les écritures répétées
    struct CombatStats {
        uint256 health;
        uint256 attack;
        uint256 defense;
        uint256 speed;
        uint256 luck;
    }

    mapping(uint256 => Battle) public battles;
    mapping(address => uint256[]) public playerBattles;
    mapping(uint256 => bool) public monanimalInBattle;

    uint256 public duelFee = 0.01 ether;
    uint256 public tournamentFee = 0.02 ether;

    // Événements simplifiés
    event BattleCreated(uint256 indexed battleId, uint256 participant1, uint256 participant2);
    event BattleCompleted(uint256 indexed battleId, uint256 winner, uint256 prizePool);

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

        // Vérifications KO (lecture groupée pour économiser du gas)
        MonanimalNFT.Monanimal memory myMon = monanimalContract.getMonanimal(myMonanimalId);
        MonanimalNFT.Monanimal memory oppMon = monanimalContract.getMonanimal(opponentMonanimalId);

        require(!myMon.isKO, "Your Monanimal is KO");
        require(!oppMon.isKO, "Opponent Monanimal is KO");

        uint256 battleId = _battleIdCounter.current();
        _battleIdCounter.increment();

        // Créer la bataille avec structure optimisée
        battles[battleId] = Battle({
            battleId: battleId,
            battleType: BattleType.Duel,
            participants: [myMonanimalId, opponentMonanimalId],
            players: [msg.sender, monanimalContract.ownerOf(opponentMonanimalId)],
            state: BattleState.Pending,
            winner: 0,
            prizePool: msg.value,
            timestamp: uint32(block.timestamp)
        });

        // Mise à jour des mappings
        playerBattles[msg.sender].push(battleId);
        playerBattles[battles[battleId].players[1]].push(battleId);

        monanimalInBattle[myMonanimalId] = true;
        monanimalInBattle[opponentMonanimalId] = true;

        emit BattleCreated(battleId, myMonanimalId, opponentMonanimalId);

        // Exécuter le combat immédiatement avec algorithme optimisé
        _executeBattleOptimized(battleId, myMon, oppMon);
    }

    function _executeBattleOptimized(
        uint256 battleId, 
        MonanimalNFT.Monanimal memory mon1, 
        MonanimalNFT.Monanimal memory mon2
    ) internal {
        // Calcul des stats totales UNE SEULE FOIS
        CombatStats memory stats1 = _calculateTotalStats(mon1);
        CombatStats memory stats2 = _calculateTotalStats(mon2);

        // Algorithme de combat simplifié et déterministe
        uint256 winner = _determineBattleWinner(battleId, stats1, stats2);

        // Finaliser la bataille
        _finalizeBattle(battleId, winner);
    }

    function _calculateTotalStats(MonanimalNFT.Monanimal memory mon) internal view returns (CombatStats memory) {
        uint256 totalHealth = mon.stats.health;
        uint256 totalAttack = mon.stats.attack;
        uint256 totalDefense = mon.stats.defense;
        uint256 totalSpeed = mon.stats.speed;
        uint256 totalLuck = mon.stats.luck;

        // Ajouter bonus d'arme si équipée
        if (mon.weaponId > 0) {
            WeaponNFT.Weapon memory weapon = weaponContract.getWeapon(mon.weaponId);
            totalAttack += weapon.stats.attackBonus;
            totalDefense += weapon.stats.defenseBonus;
            totalSpeed += weapon.stats.speedBonus;
            totalLuck += weapon.stats.luckBonus;
        }

        // Ajouter bonus d'artefact si équipé
        if (mon.artifactId > 0) {
            ArtifactNFT.Artifact memory artifact = artifactContract.getArtifact(mon.artifactId);
            totalHealth += artifact.stats.healthBonus;
            totalAttack += artifact.stats.attackBonus;
            totalDefense += artifact.stats.defenseBonus;
            totalSpeed += artifact.stats.speedBonus;
            totalLuck += artifact.stats.luckBonus;
        }

        return CombatStats(totalHealth, totalAttack, totalDefense, totalSpeed, totalLuck);
    }

    function _determineBattleWinner(
        uint256 battleId,
        CombatStats memory stats1, 
        CombatStats memory stats2
    ) internal view returns (uint256) {
        // Algorithme de combat optimisé basé sur un calcul de score
        uint256 seed = uint256(keccak256(abi.encodePacked(battleId, block.timestamp, block.prevrandao)));

        // Score de combat pondéré
        uint256 score1 = _calculateCombatScore(stats1, seed);
        uint256 score2 = _calculateCombatScore(stats2, seed >> 128);

        // Le plus haut score gagne
        return score1 >= score2 ? battles[battleId].participants[0] : battles[battleId].participants[1];
    }

    function _calculateCombatScore(CombatStats memory stats, uint256 randomSeed) internal pure returns (uint256) {
        // Formule de score optimisée qui simule un combat
        uint256 baseScore = (stats.attack * 3 + stats.health * 2 + stats.defense + stats.speed + stats.luck);

        // Facteur de chance (0-20% bonus/malus)
        uint256 luckFactor = (randomSeed % 200) + 900; // 900-1100 (90%-110%)

        return (baseScore * luckFactor) / 1000;
    }

    function _finalizeBattle(uint256 battleId, uint256 winnerId) internal {
        Battle storage battle = battles[battleId];
        battle.state = BattleState.Completed;
        battle.winner = winnerId;

        // Déterminer perdant
        uint256 loserId = winnerId == battle.participants[0] ? battle.participants[1] : battle.participants[0];

        // Libérer les Monanimals
        monanimalInBattle[battle.participants[0]] = false;
        monanimalInBattle[battle.participants[1]] = false;

        // Mise à jour des résultats (une seule transaction chacune)
        monanimalContract.updateBattleResult(winnerId, true);
        monanimalContract.updateBattleResult(loserId, false);

        // Ajouter expérience
        monanimalContract.addExperience(winnerId, 100);
        monanimalContract.addExperience(loserId, 25);

        emit BattleCompleted(battleId, winnerId, battle.prizePool);

        // Distribuer les prix
        _distributePrizes(battleId);
    }

    function _distributePrizes(uint256 battleId) internal {
        Battle storage battle = battles[battleId];
        address winnerOwner = monanimalContract.ownerOf(battle.winner);

        uint256 prize = (battle.prizePool * 90) / 100; // 90% au gagnant
        // 10% reste dans le contrat comme fees

        (bool success, ) = payable(winnerOwner).call{value: prize}("");
        require(success, "Prize transfer failed");
    }

    // Fonctions de lecture optimisées
    function getBattle(uint256 battleId) external view returns (Battle memory) {
        return battles[battleId];
    }

    function getPlayerBattles(address player) external view returns (uint256[] memory) {
        return playerBattles[player];
    }

    function getBattleInfo(uint256 battleId) external view returns (
        uint256[2] memory participants,
        address[2] memory players,
        uint256 winner,
        uint256 prizePool,
        BattleState state
    ) {
        Battle memory battle = battles[battleId];
        return (battle.participants, battle.players, battle.winner, battle.prizePool, battle.state);
    }

    // Fonctions d'administration
    function setFees(uint256 _duelFee, uint256 _tournamentFee) external onlyOwner {
        duelFee = _duelFee;
        tournamentFee = _tournamentFee;
    }

    function setContracts(address _monanimalContract, address _weaponContract, address _artifactContract) external onlyOwner {
        monanimalContract = MonanimalNFT(_monanimalContract);
        weaponContract = WeaponNFT(_weaponContract);
        artifactContract = ArtifactNFT(_artifactContract);
    }

    function withdraw() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    // Fonction d'urgence pour libérer des Monanimals bloqués
    function emergencyFreeMolanimal(uint256 monanimalId) external onlyOwner {
        monanimalInBattle[monanimalId] = false;
    }
}
