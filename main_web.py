# =========================================================
# 🌐 APPLICATION WEB (FLASK)
# =========================================================

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from predictor import LaLigaAI
from api_handler import update_database
import json
from config import DEBUG, HOST, PORT, API_KEY

app = Flask(__name__)
CORS(app)

# Initialiser le prédicteur
ai = LaLigaAI()

# =========================================================
# 🔍 ROUTES API
# =========================================================

@app.route("/")
def index():
    """
    Page d'accueil
    """
    return render_template("index.html")

@app.route("/api/predict", methods=["POST"])
def predict():
    """
    API: Prédire un match
    """
    try:
        data = request.get_json()
        home = data.get("home", "").strip()
        away = data.get("away", "").strip()
        
        if not home or not away:
            return jsonify({"error": "Les deux équipes sont nécessaires"}), 400
        
        result = ai.predict(home, away)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/teams", methods=["GET"])
def get_teams():
    """
    API: Récupérer toutes les équipes
    """
    teams = ai.get_all_teams()
    return jsonify({"teams": teams}), 200

@app.route("/api/ranking", methods=["GET"])
def get_ranking():
    """
    API: Récupérer le classement
    """
    ranking = ai.get_team_ranking()
    return jsonify(ranking.to_dict(orient="records")), 200

@app.route("/api/update", methods=["POST"])
def api_update():
    """
    API: Mettre à jour la base de données
    """
    try:
        success = update_database()
        
        if success:
            global ai
            ai = LaLigaAI()  # Recharger
            return jsonify({"message": "Base de données mise à jour"}), 200
        else:
            return jsonify({"error": "Erreur lors de la mise à jour"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/stats", methods=["GET"])
def get_stats():
    """
    API: Récupérer les statistiques globales
    """
    teams = ai.get_all_teams()
    total_teams = len(teams)
    total_matches = len(ai.data) if not ai.data.empty else 0
    
    return jsonify({
        "total_teams": total_teams,
        "total_matches": total_matches,
        "api_configured": API_KEY != "YOUR_API_KEY"
    }), 200

# =========================================================
# ❌ GESTION D'ERREURS
# =========================================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint non trouvé"}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({"error": "Erreur serveur"}), 500

# =========================================================
# 🚀 LANCEMENT
# =========================================================

if __name__ == "__main__":
    print(f"\n🚀 Démarrage du serveur...")
    print(f"📍 http://{HOST}:{PORT}")
    print(f"🔧 Mode debug: {DEBUG}\n")
    
    app.run(host=HOST, port=PORT, debug=DEBUG)
