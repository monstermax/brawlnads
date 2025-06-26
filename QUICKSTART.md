# 🚀 Guide de Démarrage Rapide - BrawlNads

## Installation Express (5 minutes)

### 1. Prérequis
```bash
# Vérifier Node.js (version 18+)
node --version

# Installer pnpm (recommandé)
npm install -g pnpm
```

### 2. Installation
```bash
# Cloner et installer
git clone <repository-url>
cd brawlnads
pnpm install

# Frontend
cd frontend
pnpm install
```

### 3. Configuration Rapide
```bash
# Créer .env
echo "PRIVATE_KEY=your_private_key_here" > .env
echo "MONAD_TESTNET_RPC_URL=https://testnet-rpc.monad.xyz" >> .env
```

### 4. Lancement
```bash
# Terminal 1 - Frontend
cd frontend
pnpm dev

# Terminal 2 - Déploiement contrats (optionnel)
npx hardhat run scripts/deploy.js --network localhost
```

### 5. Accès
- **Frontend** : http://localhost:5173
- **Monad Testnet** : https://testnet.monvision.io

## 🎮 Première Utilisation

1. **Connecter Wallet** : Cliquez sur "Connect Wallet"
2. **Ajouter Monad Testnet** à votre wallet :
   - Network Name: Monad Testnet
   - RPC URL: https://testnet-rpc.monad.xyz
   - Chain ID: 10143
   - Currency Symbol: MON

3. **Obtenir des MON de test** : Utilisez le faucet Monad
4. **Mint votre premier Monanimal** : 0.01 MON
5. **Commencer à jouer** !

## 🔧 Commandes Utiles

```bash
# Développement
pnpm dev              # Lancer le frontend
pnpm build            # Build de production
pnpm preview          # Prévisualiser le build

# Smart Contracts
npx hardhat compile   # Compiler les contrats
npx hardhat test      # Lancer les tests
npx hardhat node      # Node local
npx hardhat deploy    # Déployer

# Utilitaires
pnpm lint             # Vérifier le code
pnpm format           # Formater le code
```

## 🐛 Résolution de Problèmes

### Erreur de connexion wallet
- Vérifiez que Monad Testnet est ajouté à votre wallet
- Assurez-vous d'avoir des MON de test

### Erreur de build
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
pnpm install
```

### Contrats non déployés
- Les contrats de démo fonctionnent sans déploiement
- Pour les vrais contrats, suivez le guide de déploiement

## 📞 Support

- **Issues** : Ouvrir une issue GitHub
- **Discord** : Rejoindre le serveur Monad
- **Documentation** : Voir README.md complet

---

**Prêt à dominer l'arène ? Let's BRAWL! 🐸⚔️**

