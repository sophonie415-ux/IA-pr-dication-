# =========================================================
# 💻 INTERFACE CLI (LIGNE DE COMMANDE)
# =========================================================

import os
from predictor import LaLigaAI
from api_handler import update_database
from config import API_KEY

def print_banner():
    """
    Affiche la bannière du robot
    """
    print("\n" + "="*50)
    print("        ⚽ LALIGA AI PREDICTOR BOT 🤖")
    print("="*50 + "\n")
    print("Bienvenue! Entrez deux équipes pour obtenir")
    print("une prédiction détaillée du match.\n")
    print("Commandes spéciales:")
    print("  • 'update'  - Mettre à jour les données")
    print("  • 'ranking' - Voir le classement")
    print("  • 'teams'   - Voir toutes les équipes")
    print("  • 'exit'    - Quitter")
    print("="*50 + "\n")

def check_api_key():
    """
    Vérifie que la clé API est configurée
    """
    if API_KEY == "YOUR_API_KEY":
        print("\n⚠️  ATTENTION: Clé API non configurée!")
        print("\n1. Allez sur: https://rapidapi.com/")
        print("2. Cherchez 'Football v1' ou 'api-football'")
        print("3. Copier votre clé API")
        print("4. Créer un fichier .env avec: API_KEY=votre_clé\n")
        return False
    return True

def format_prediction(result):
    """
    Formate les résultats de prédiction pour l'affichage
    
    Args:
        result: Dict de prédiction
    """
    print("\n" + "="*50)
    print("📊 RÉSULTATS DE LA PRÉDICTION")
    print("="*50)
    
    print(f"\n🏆 Vainqueur probable: {result['winner']}")
    print(f"📈 Confiance: {result['confidence']}%")
    
    print(f"\n📊 Probabilités:")
    print(f"  • {result['match'].split(' vs ')[0]} gagne: {result['home_win_prob']}%")
    print(f"  • {result['match'].split(' vs ')[1]} gagne: {result['away_win_prob']}%")
    print(f"  • Match nul: {result['draw_prob']}%")
    
    print(f"\n⚽ Score moyen attendu:")
    print(f"  • {result['match'].split(' vs ')[0]}: {result['avg_home_goals']} buts")
    print(f"  • {result['match'].split(' vs ')[1]}: {result['avg_away_goals']} buts")
    
    print(f"\n🎯 TOP 3 SCORES EXACTS:")
    for i, (score, freq) in enumerate(zip(result['top_3_scores'], result['top_3_frequencies']), 1):
        percentage = (freq / result['simulations']) * 100
        print(f"  {i}. {score[0]}-{score[1]} ({percentage:.1f}%)")
    
    print(f"\n💡 Simulations: {result['simulations']}")
    print("="*50 + "\n")

def show_ranking(ai):
    """
    Affiche le classement des équipes
    """
    ranking = ai.get_team_ranking()
    
    print("\n" + "="*50)
    print("🏅 CLASSEMENT DES ÉQUIPES")
    print("="*50)
    print(ranking.to_string(index=False))
    print("="*50 + "\n")

def show_teams(ai):
    """
    Affiche toutes les équipes
    """
    teams = ai.get_all_teams()
    
    print("\n" + "="*50)
    print(f"📋 ÉQUIPES ({len(teams)})")
    print("="*50)
    for i, team in enumerate(teams, 1):
        print(f"{i:2d}. {team}")
    print("="*50 + "\n")

def main():
    """
    Boucle principale du CLI
    """
    # Vérifications
    if not check_api_key():
        return
    
    print_banner()
    
    # Initialiser le prédicteur
    ai = LaLigaAI()
    
    if ai.data.empty:
        print("\n⚠️  Pas de données trouvées.")
        print("📥 Mise à jour nécessaire...\n")
        if update_database():
            ai = LaLigaAI()  # Recharger
        else:
            print("❌ Impossible de récupérer les données.")
            return
    
    # Boucle interactive
    while True:
        print("\n👉 Commande (ou 'help' pour l'aide):")
        home_input = input("> ").strip()
        
        if not home_input:
            continue
        
        if home_input.lower() == "exit":
            print("\n👋 À bientôt!\n")
            break
        
        if home_input.lower() == "help":
            print("\nCommandes disponibles:")
            print("  • équipe1 vs équipe2 - Prédire le match")
            print("  • update  - Mettre à jour les données")
            print("  • ranking - Voir le classement")
            print("  • teams   - Voir toutes les équipes")
            print("  • exit    - Quitter\n")
            continue
        
        if home_input.lower() == "update":
            update_database()
            ai = LaLigaAI()  # Recharger
            continue
        
        if home_input.lower() == "ranking":
            show_ranking(ai)
            continue
        
        if home_input.lower() == "teams":
            show_teams(ai)
            continue
        
        # Traiter comme prédiction
        if " vs " in home_input:
            try:
                home, away = home_input.split(" vs ")
                home = home.strip()
                away = away.strip()
            except:
                print("❌ Format invalide. Utilisez: 'équipe1 vs équipe2'")
                continue
        else:
            print("Équipe extérieur:")
            away = input("> ").strip()
        
        if not home or not away:
            print("❌ Les deux équipes sont nécessaires.")
            continue
        
        print("\n⏳ Analyse en cours...")
        result = ai.predict(home, away)
        format_prediction(result)

if __name__ == "__main__":
    main()
