# ⚽ LaLiga AI Predictor

Un système intelligent de prédiction de matchs de football pour la **LaLiga** utilisant l'IA, les statistiques et la simulation de Poisson.

## 🎯 Fonctionnalités

✅ **Prédiction de matchs** - Prédit le vainqueur probable et les 3 meilleurs scores  
✅ **Interface CLI** - Utilisation en ligne de commande  
✅ **Interface Web** - Dashboard interactif avec statistiques  
✅ **Base de données** - Historique des matchs et prédictions  
✅ **Statistiques d'équipes** - Attaque, défense, performance  
✅ **Mise à jour automatique** - Récupère les données en direct  

## 📋 Prérequis

- Python 3.8+
- Clé API RapidAPI (Football v1)
- pip

## 🚀 Installation

### 1. Cloner le repository
```bash
git clone https://github.com/sophonie415-ux/IA-pr-dication-.git
cd IA-pr-dication-
```

### 2. Créer un environnement virtuel
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 3. Installer les dépendances
```bash
pip install -r requirements.txt
```

### 4. Configurer les variables d'environnement
```bash
cp .env.example .env
# Éditer .env et ajouter votre clé API RapidAPI
```

## 💻 Utilisation

### Mode CLI (Ligne de commande)
```bash
python main_cli.py
```

Exemple d'interaction:
```
==============================
⚽ LALIGA AI PREDICTOR BOT 🤖
==============================

👉 Entrez les équipes (ou 'update' / 'exit')
Équipe domicile: Real Madrid
Équipe extérieur: Barcelona

⏳ Analyse en cours...

🏆 VAINQUEUR PROBABLE: Real Madrid
🎯 TOP 3 SCORES EXACTS:
  1. 2-1
  2. 2-0
  3. 1-0
```

### Mode Web (Dashboard)
```bash
python main_web.py
```

Accédez à: **http://localhost:5000**

## 📊 Structure du projet

```
IA-pr-dication-/
├── main_cli.py              # Interface en ligne de commande
├── main_web.py              # Application Flask
├── predictor.py             # Moteur de prédiction IA
├── database.py              # Gestion de la base de données
├── api_handler.py           # Gestion de l'API Football
├── config.py                # Configuration
├── templates/               # Templates HTML
│   ├── base.html
│   ├── index.html
│   ├── predict.html
│   └── stats.html
├── static/                  # Fichiers statiques
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── requirements.txt         # Dépendances
├── .env.example             # Configuration exemple
└── README.md                # Ce fichier
```

## 🔧 Configuration

### Obtenir une clé API RapidAPI

1. Aller sur [RapidAPI](https://rapidapi.com/)
2. Chercher "Football v1" ou "api-football"
3. S'inscrire et copier la clé API
4. Ajouter la clé dans le fichier `.env`

### Paramètres ajustables

Dans `config.py`:
```python
SIMULATIONS = 5000      # Nombre de simulations par prédiction
SEASON = 2025           # Saison LaLiga
LEAGUE_ID = 140         # ID LaLiga
```

## 🧠 Algorithme de prédiction

1. **Collecte des stats** - Buts marqués/concédés par équipe
2. **Calcul de coefficients** - Attaque et défense par match
3. **Simulation Poisson** - 5000 simulations de match
4. **Analyse des résultats** - Probabilités et top 3 scores

## 📈 Exemples d'utilisation

### Python directement
```python
from predictor import LaLigaAI

ai = LaLigaAI()
result = ai.predict("Real Madrid", "Barcelona")

print(f"Vainqueur: {result['winner']}")
print(f"Top 3 scores: {result['top_3_scores']}")
```

### Mettre à jour la base de données
```python
from api_handler import update_database

update_database(season=2025)
```

## 🐛 Dépannage

**Erreur: "Clé API invalide"**
- Vérifier le fichier `.env`
- Assurez-vous que la clé est correcte sur RapidAPI

**Erreur: "Pas d'équipe trouvée"**
- Vérifier l'orthographe du nom de l'équipe
- Mettre à jour la base de données: `python main_cli.py` → tapez `update`

**La prédiction semble incorrecte**
- Plus il y a de données historiques, meilleures sont les prédictions
- Vérifier que les données sont à jour

## 📝 Licence

Ce projet est open source sous la licence MIT.

## 👨‍💻 Auteur

Développé par **sophonie415-ux**

## 🤝 Support

Pour toute question ou problème, ouvrez une issue sur GitHub.

---

**Amusez-vous avec vos prédictions ! ⚽🤖**
