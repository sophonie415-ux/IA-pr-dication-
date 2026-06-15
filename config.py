# =========================================================
# ⚙️ CONFIGURATION GLOBALE
# =========================================================

import os
from dotenv import load_dotenv

load_dotenv()

# 🔑 API Configuration
API_KEY = os.getenv("API_KEY", "YOUR_API_KEY")
API_HOST = os.getenv("API_HOST", "api-football-v1.p.rapidapi.com")

HEADERS = {
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": API_HOST
}

# 💾 Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///laliga_predictor.db")
DATA_FILE = "matches.csv"

# 🎮 Application Settings
DEBUG = os.getenv("DEBUG", "False").lower() == "true"
PORT = int(os.getenv("PORT", 5000))
HOST = os.getenv("HOST", "0.0.0.0")

# ⚽ LaLiga Configuration
LEAGUE_ID = int(os.getenv("LEAGUE_ID", 140))  # LaLiga ID
SEASON = int(os.getenv("SEASON", 2025))
SIMULATIONS = int(os.getenv("SIMULATIONS", 5000))

# 📊 API Endpoints
FIXTURES_URL = "https://api-football-v1.p.rapidapi.com/v3/fixtures"
TEAMS_URL = "https://api-football-v1.p.rapidapi.com/v3/teams"
STANDINGS_URL = "https://api-football-v1.p.rapidapi.com/v3/standings"

# 🔍 Prediction Parameters
MIN_MATCHES_FOR_STATS = 3  # Nombre minimum de matchs pour calculer les stats
DEFAULT_ATTACK_RATING = 1.2
DEFAULT_DEFENSE_RATING = 1.2
