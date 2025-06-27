# Guide de Déploiement BrawlNads

## 🚀 Système de Déploiement Flexible

Le nouveau système de déploiement permet de déployer sélectivement les contrats selon vos besoins, sans avoir à créer de nouveaux scripts à chaque fois.

## 📋 Méthodes de Déploiement

### 1. Script Helper (Recommandé)

Le script helper simplifie l'utilisation avec une interface conviviale :

```bash
# Afficher l'aide
./scripts/deploy-helper.sh

# Déployer tous les contrats sur testnet
./scripts/deploy-helper.sh monad_testnet all

# Déployer seulement BattleArenaOptimized
./scripts/deploy-helper.sh monad_testnet battlearena

# Déployer plusieurs contrats spécifiques
./scripts/deploy-helper.sh monad_testnet weapon artifact

# Test local
./scripts/deploy-helper.sh hardhat battlearena
```

### 2. Variables d'Environnement (Direct)

Pour un contrôle plus fin, utilisez directement les variables d'environnement :

```bash
# Déployer tous les contrats
DEPLOY_ALL=true npx hardhat run scripts/deploy.ts --network monad_testnet

# Déployer seulement BattleArenaOptimized
DEPLOY_BATTLEARENA=true npx hardhat run scripts/deploy.ts --network monad_testnet

# Déployer MonanimalNFT et WeaponNFT
DEPLOY_MONANIMAL=true DEPLOY_WEAPON=true npx hardhat run scripts/deploy.ts --network monad_testnet

# Déployer WeaponNFT et ArtifactNFT
DEPLOY_WEAPON=true DEPLOY_ARTIFACT=true npx hardhat run scripts/deploy.ts --network monad_testnet
```

## 🔧 Variables d'Environnement Disponibles

| Variable | Description |
|----------|-------------|
| `DEPLOY_ALL=true` | Déploie tous les contrats |
| `DEPLOY_BATTLEARENA=true` | Déploie BattleArenaOptimized |
| `DEPLOY_MONANIMAL=true` | Déploie MonanimalNFT |
| `DEPLOY_WEAPON=true` | Déploie WeaponNFT |
| `DEPLOY_ARTIFACT=true` | Déploie ArtifactNFT |

## 🌐 Networks Supportés

| Network | Description | Chain ID |
|---------|-------------|----------|
| `hardhat` | Réseau local de test | 1337 |
| `monad_testnet` | Testnet Monad | 10143 |
| `monad_mainnet` | Mainnet Monad | 143 |

## 📁 Gestion des Configurations

### Configuration Existante
Le script charge automatiquement la configuration existante depuis `frontend/src/config/contracts.json` et réutilise les adresses des contrats déjà déployés.

### Déploiement Sélectif
- ✅ **Réutilise** les contrats existants si ils ne sont pas dans la sélection
- ✅ **Redéploie** seulement les contrats spécifiés
- ✅ **Met à jour** automatiquement la configuration frontend
- ✅ **Sauvegarde** les nouvelles adresses dans `/deployments/`

## 🔐 Gestion des Permissions

Le script gère automatiquement les permissions :
- Transfère l'ownership des NFT contracts vers BattleArena
- Seulement si les contrats ont été redéployés
- Gestion d'erreur gracieuse si les permissions échouent

## 📊 Exemples d'Usage Courants

### Migration vers BattleArenaOptimized
```bash
# Déployer seulement le nouveau BattleArena optimisé
./scripts/deploy-helper.sh monad_testnet battlearena
```

### Mise à jour des NFT Contracts
```bash
# Redéployer les contrats NFT
./scripts/deploy-helper.sh monad_testnet monanimal weapon artifact
```

### Déploiement Complet (Nouveau Projet)
```bash
# Déployer tout depuis zéro
./scripts/deploy-helper.sh monad_testnet all
```

### Test Local
```bash
# Test rapide sur hardhat (attention: MonanimalNFT peut être trop gros)
./scripts/deploy-helper.sh hardhat weapon artifact battlearena
```

## 📝 Logs et Suivi

### Fichiers Générés
- **Déploiement** : `/deployments/[network]-[timestamp].json`
- **Frontend** : `/frontend/src/config/contracts.json`

### Informations Sauvegardées
```json
{
  "network": { "name": "monad_testnet", "chainId": 10143 },
  "deployer": "0x...",
  "deploymentTime": "2025-01-27T02:30:00.000Z",
  "deployedContracts": ["BattleArenaOptimized"],
  "BattleArenaOptimized": "0x...",
  "MonanimalNFT": "0x...",
  "WeaponNFT": "0x...",
  "ArtifactNFT": "0x..."
}
```

## ⚠️ Points d'Attention

### Dépendances entre Contrats
- **BattleArena** nécessite les adresses de MonanimalNFT, WeaponNFT et ArtifactNFT
- Le script vérifie automatiquement ces dépendances
- Erreur claire si les dépendances manquent

### Limitations Réseau Local
- **MonanimalNFT** peut être trop volumineux pour le réseau `hardhat`
- Utilisez `monad_testnet` pour les tests complets
- Le réseau local convient pour WeaponNFT, ArtifactNFT et BattleArena

### Gestion des Erreurs
- ✅ Validation des paramètres
- ✅ Vérification des dépendances
- ✅ Gestion gracieuse des erreurs de permission
- ✅ Sauvegarde même en cas d'erreur partielle

## 🔄 Migration depuis l'Ancien Système

Si vous avez des contrats déployés avec l'ancien système :

1. **Sauvegardez** votre configuration actuelle
2. **Utilisez** le nouveau script pour redéployer sélectivement
3. **Vérifiez** que la configuration frontend est mise à jour
4. **Testez** les nouvelles adresses

## 🎯 Optimisations BattleArenaOptimized

Lors du déploiement de BattleArenaOptimized :
- **60-80% d'économies** de gas par rapport à BattleArena
- **Structure simplifiée** pour de meilleures performances
- **Compatibilité** avec l'interface frontend existante
- **Fonctionnalités core** préservées (duels, stats, récompenses)

---

**Note** : Ce système remplace les anciens scripts de déploiement et de migration. Il est plus flexible et maintenable pour les futures mises à jour.