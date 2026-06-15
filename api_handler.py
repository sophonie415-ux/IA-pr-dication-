# =========================================================
# 📡 GESTIONNAIRE API - FOOTBALL DATA
# =========================================================

import requests
import pandas as pd
from config import HEADERS, FIXTURES_URL, LEAGUE_ID, SEASON, DATA_FILE
from datetime import datetime

class APIHandler:
    """
    Gère les appels API vers Football-API
    """

    @staticmethod
    def get_fixtures(league_id=LEAGUE_ID, season=SEASON):
        """
        Récupère tous les matchs d'une saison
        
        Args:
            league_id: ID de la ligue (140 = LaLiga)
            season: Année de la saison
            
        Returns:
            List des matchs ou None en cas d'erreur
        """
        try:
            params = {
                "league": league_id,
                "season": season
            }
            
            response = requests.get(FIXTURES_URL, headers=HEADERS, params=params)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get("response") is None:
                print("❌ Erreur API: Réponse invalide")
                return None
            
            return data["response"]
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Erreur API: {e}")
            return None

    @staticmethod
    def parse_fixtures(fixtures):
        """
        Parse les matchs bruts en dataframe
        
        Args:
            fixtures: List des matchs bruts
            
        Returns:
            DataFrame des matchs
        """
        matches = []
        
        for fixture in fixtures:
            try:
                home_team = fixture["teams"]["home"]["name"]
                away_team = fixture["teams"]["away"]["name"]
                home_goals = fixture["goals"]["home"]
                away_goals = fixture["goals"]["away"]
                
                # Ignorer les matchs non joués
                if home_goals is not None and away_goals is not None:
                    matches.append({
                        "home": home_team,
                        "away": away_team,
                        "hg": home_goals,
                        "ag": away_goals,
                        "date": fixture.get("fixture", {}).get("date", "")
                    })
            except (KeyError, TypeError):
                continue
        
        return pd.DataFrame(matches)

    @staticmethod
    def update_database(league_id=LEAGUE_ID, season=SEASON, output_file=DATA_FILE):
        """
        Met à jour la base de données CSV
        
        Args:
            league_id: ID de la ligue
            season: Année de la saison
            output_file: Fichier de sortie
            
        Returns:
            Bool: True si succès, False sinon
        """
        print(f"🔄 Récupération des données LaLiga {season}...")
        
        fixtures = APIHandler.get_fixtures(league_id, season)
        
        if fixtures is None:
            print("❌ Échec de la récupération")
            return False
        
        df = APIHandler.parse_fixtures(fixtures)
        
        if df.empty:
            print("⚠️ Aucun match trouvé")
            return False
        
        # Garder seulement les colonnes essentielles
        df_clean = df[["home", "away", "hg", "ag"]]
        df_clean.to_csv(output_file, index=False)
        
        print(f"✅ Base mise à jour: {len(df_clean)} matchs")
        print(f"📁 Fichier: {output_file}")
        print(f"📅 Dernière mise à jour: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        return True

# Fonction simple pour les appels directs
def update_database(league_id=LEAGUE_ID, season=SEASON):
    """
    Met à jour la base de données
    """
    return APIHandler.update_database(league_id, season)
