#!/bin/bash

# Script d'aide pour le déploiement des contrats BrawlNads
# Usage: ./scripts/deploy-helper.sh [network] [contracts...]

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction d'aide
show_help() {
    echo -e "${BLUE}🚀 Script de déploiement BrawlNads${NC}"
    echo ""
    echo "Usage: $0 [network] [contracts...]"
    echo ""
    echo "Networks disponibles:"
    echo "  hardhat      - Réseau local de test"
    echo "  monad_testnet - Testnet Monad"
    echo "  monad_mainnet - Mainnet Monad"
    echo ""
    echo "Contrats disponibles:"
    echo "  all          - Tous les contrats"
    echo "  battlearena  - BattleArenaOptimized uniquement"
    echo "  monanimal    - MonanimalNFT uniquement"
    echo "  weapon       - WeaponNFT uniquement"
    echo "  artifact     - ArtifactNFT uniquement"
    echo ""
    echo "Exemples:"
    echo "  $0 monad_testnet all"
    echo "  $0 monad_testnet battlearena"
    echo "  $0 hardhat weapon artifact"
    echo "  $0 monad_testnet monanimal weapon"
    echo ""
}

# Vérifier les arguments
if [ $# -lt 1 ]; then
    echo -e "${RED}❌ Erreur: Network requis${NC}"
    show_help
    exit 1
fi

NETWORK=$1
shift

# Vérifier le network
case $NETWORK in
    hardhat|monad_testnet|monad_mainnet)
        echo -e "${GREEN}✅ Network: $NETWORK${NC}"
        ;;
    *)
        echo -e "${RED}❌ Network invalide: $NETWORK${NC}"
        show_help
        exit 1
        ;;
esac

# Si aucun contrat spécifié, afficher l'aide
if [ $# -eq 0 ]; then
    echo -e "${YELLOW}⚠️ Aucun contrat spécifié${NC}"
    show_help
    exit 1
fi

# Construire les variables d'environnement
ENV_VARS=""

for contract in "$@"; do
    case $contract in
        all)
            ENV_VARS="DEPLOY_ALL=true"
            echo -e "${BLUE}📦 Déploiement de tous les contrats${NC}"
            break
            ;;
        battlearena)
            ENV_VARS="$ENV_VARS DEPLOY_BATTLEARENA=true"
            echo -e "${BLUE}⚔️ Déploiement de BattleArenaOptimized${NC}"
            ;;
        monanimal)
            ENV_VARS="$ENV_VARS DEPLOY_MONANIMAL=true"
            echo -e "${BLUE}🐾 Déploiement de MonanimalNFT${NC}"
            ;;
        weapon)
            ENV_VARS="$ENV_VARS DEPLOY_WEAPON=true"
            echo -e "${BLUE}⚔️ Déploiement de WeaponNFT${NC}"
            ;;
        artifact)
            ENV_VARS="$ENV_VARS DEPLOY_ARTIFACT=true"
            echo -e "${BLUE}🔮 Déploiement de ArtifactNFT${NC}"
            ;;
        *)
            echo -e "${RED}❌ Contrat invalide: $contract${NC}"
            show_help
            exit 1
            ;;
    esac
done

# Afficher la commande qui va être exécutée
echo ""
echo -e "${YELLOW}🔧 Commande à exécuter:${NC}"
echo "  $ENV_VARS npx hardhat run scripts/deploy.ts --network $NETWORK"
echo ""

# Demander confirmation
read -p "Continuer? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⏹️ Déploiement annulé${NC}"
    exit 0
fi

# Exécuter le déploiement
echo -e "${GREEN}🚀 Lancement du déploiement...${NC}"
echo ""

eval "$ENV_VARS npx hardhat run scripts/deploy.ts --network $NETWORK"

echo ""
echo -e "${GREEN}✅ Script terminé${NC}"