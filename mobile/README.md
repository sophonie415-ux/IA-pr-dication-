# 📱 LaLiga AI Predictor Mobile

Application mobile React Native pour prédire les résultats des matchs LaLiga!

## 🎯 Fonctionnalités

✅ **Prédictions en temps réel** - Prédis les matchs LaLiga  
✅ **Classement des équipes** - Vois les stats d'attaque/défense  
✅ **Liste des équipes** - Parcours toutes les équipes LaLiga  
✅ **Historique** - Revois tes prédictions précédentes  
✅ **Paramètres** - Configure l'app selon tes besoins  
✅ **Interface moderne** - Design beau et responsive  

## 📋 Prérequis

- Node.js 14+
- npm ou yarn
- Expo CLI: `npm install -g expo-cli`
- Un téléphone Android ou iPhone

## 🚀 Installation

### 1. Cloner et installer
```bash
cd mobile
npm install
```

### 2. Configurer l'API

Dans `src/api/predictorAPI.js`, change l'URL:
```javascript
const API_BASE_URL = 'http://192.168.1.100:5000/api';
```

### 3. Lancer l'app

#### Sur Android:
```bash
npm run android
```

#### Sur iOS:
```bash
npm run ios
```

#### En mode développement:
```bash
npm start
```

Scanne le QR code avec Expo Go sur ton téléphone.

## 📋 Écrans de l'app

- **Prédiction** - Prédis un match
- **Classement** - Vois le classement LaLiga
- **Équipes** - Liste de toutes les équipes
- **Historique** - Tes prédictions précédentes
- **Paramètres** - Configuration de l'app

## 🔗 Connexion au serveur

Vérifie que ton serveur Flask tourne:
```bash
python main_web.py
```

Configure l'URL dans paramètres ou dans `predictorAPI.js`.

---

**Bon courage avec l'app! ⚽🤖**
