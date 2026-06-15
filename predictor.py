# =========================================================
# 🧠 MOTEUR DE PRÉDICTION IA - AMÉLIORÉ
# =========================================================

import numpy as np
import pandas as pd
from collections import Counter
import os
from config import (
    DATA_FILE, SIMULATIONS, 
    MIN_MATCHES_FOR_STATS,
    DEFAULT_ATTACK_RATING,
    DEFAULT_DEFENSE_RATING
)

class LaLigaAI:
    """
    Système de prédiction pour LaLiga utilisant:
    - Distribution de Poisson
    - Statistiques d'attaque/défense
    - Simulations Monte Carlo
    """

    def __init__(self, data_file=DATA_FILE):
        """
        Initialise le prédicteur IA
        
        Args:
            data_file: Chemin vers le fichier CSV des matchs
        """
        self.data_file = data_file
        self.data = self._load_data()

    def _load_data(self):
        """
        Charge les données des matchs
        """
        if not os.path.exists(self.data_file):
            return pd.DataFrame(columns=["home", "away", "hg", "ag"])
        
        try:
            return pd.read_csv(self.data_file)
        except Exception as e:
            print(f"⚠️ Erreur lors du chargement: {e}")
            return pd.DataFrame(columns=["home", "away", "hg", "ag"])

    def team_stats(self, team):
        """
        Calcule les statistiques d'une équipe
        
        Args:
            team: Nom de l'équipe
            
        Returns:
            Tuple (attaque, défense)
        """
        if self.data.empty:
            return DEFAULT_ATTACK_RATING, DEFAULT_DEFENSE_RATING

        # Matchs à domicile
        home_matches = self.data[self.data["home"] == team]
        # Matchs à l'extérieur
        away_matches = self.data[self.data["away"] == team]

        # Buts marqués et encaissés
        goals_scored = home_matches["hg"].sum() + away_matches["ag"].sum()
        goals_conceded = home_matches["ag"].sum() + away_matches["hg"].sum()

        total_matches = len(home_matches) + len(away_matches)

        if total_matches < MIN_MATCHES_FOR_STATS:
            return DEFAULT_ATTACK_RATING, DEFAULT_DEFENSE_RATING

        attack = goals_scored / total_matches
        defense = goals_conceded / total_matches

        return attack, defense

    def simulate_match(self, home, away):
        """
        Simule un match unique
        
        Args:
            home: Équipe à domicile
            away: Équipe à l'extérieur
            
        Returns:
            Tuple (buts_domicile, buts_extérieur)
        """
        home_att, home_def = self.team_stats(home)
        away_att, away_def = self.team_stats(away)

        # Poisson distribution avec coefficients
        home_goals = np.random.poisson(home_att * away_def)
        away_goals = np.random.poisson(away_att * home_def)

        return home_goals, away_goals

    def predict(self, home, away, simulations=None):
        """
        Prédiction complète d'un match
        
        Args:
            home: Équipe à domicile
            away: Équipe à l'extérieur
            simulations: Nombre de simulations (défaut: SIMULATIONS)
            
        Returns:
            Dict avec prédictions et statistiques
        """
        if simulations is None:
            simulations = SIMULATIONS

        results = []
        for _ in range(simulations):
            results.append(self.simulate_match(home, away))

        counter = Counter(results)
        top_3 = counter.most_common(3)

        # Calcul des probabilités
        home_wins = sum(1 for h, a in results if h > a)
        away_wins = sum(1 for h, a in results if a > h)
        draws = sum(1 for h, a in results if h == a)

        total = len(results)
        home_win_prob = (home_wins / total) * 100
        away_win_prob = (away_wins / total) * 100
        draw_prob = (draws / total) * 100

        # Déterminer le vainqueur probable
        if home_wins > away_wins:
            winner = home
        elif away_wins > home_wins:
            winner = away
        else:
            winner = "Draw"

        # Score moyen attendu
        avg_home_goals = np.mean([h for h, a in results])
        avg_away_goals = np.mean([a for h, a in results])

        return {
            "match": f"{home} vs {away}",
            "winner": winner,
            "home_win_prob": round(home_win_prob, 2),
            "away_win_prob": round(away_win_prob, 2),
            "draw_prob": round(draw_prob, 2),
            "top_3_scores": [x[0] for x in top_3],
            "top_3_frequencies": [x[1] for x in top_3],
            "avg_home_goals": round(avg_home_goals, 2),
            "avg_away_goals": round(avg_away_goals, 2),
            "confidence": round(max(home_win_prob, away_win_prob, draw_prob), 2),
            "simulations": simulations
        }

    def get_all_teams(self):
        """
        Retourne la liste de toutes les équipes
        
        Returns:
            List des noms d'équipes
        """
        if self.data.empty:
            return []
        
        teams = set(self.data["home"].unique()) | set(self.data["away"].unique())
        return sorted(list(teams))

    def get_team_ranking(self):
        """
        Crée un classement basé sur les statistiques
        
        Returns:
            DataFrame avec classement
        """
        teams = self.get_all_teams()
        stats = []

        for team in teams:
            att, def_ = self.team_stats(team)
            stats.append({
                "Team": team,
                "Attack": round(att, 2),
                "Defense": round(def_, 2),
                "Rating": round(att - def_, 2)
            })

        df = pd.DataFrame(stats).sort_values("Rating", ascending=False)
        return df
