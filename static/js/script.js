// =========================================================
// 🔧 JAVASCRIPT - Interface Web
// =========================================================

// ✅ Charger les équipes au démarrage
window.addEventListener('DOMContentLoaded', function() {
    loadTeams();
});

// 📋 Charger la liste des équipes
function loadTeams() {
    fetch('/api/teams')
        .then(response => response.json())
        .then(data => {
            const datalist = document.getElementById('teams-list');
            datalist.innerHTML = '';
            
            data.teams.forEach(team => {
                const option = document.createElement('option');
                option.value = team;
                datalist.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erreur:', error);
            showAlert('Erreur lors du chargement des équipes', 'error');
        });
}

// 🎯 Prédire un match
function predictMatch() {
    const home = document.getElementById('home-team').value.trim();
    const away = document.getElementById('away-team').value.trim();
    
    if (!home || !away) {
        showAlert('Veuillez entrer les deux équipes', 'error');
        return;
    }
    
    // Afficher le spinner
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<div class="loading"></div> Analyse en cours...';
    resultsDiv.style.display = 'block';
    
    // Appel API
    fetch('/api/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({home, away})
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            showAlert(data.error, 'error');
            resultsDiv.style.display = 'none';
            return;
        }
        displayResults(data);
    })
    .catch(error => {
        console.error('Erreur:', error);
        showAlert('Erreur lors de la prédiction', 'error');
        resultsDiv.style.display = 'none';
    });
}

// 📊 Afficher les résultats
function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    
    // Vainqueur
    document.getElementById('winner').textContent = data.winner;
    document.getElementById('confidence').textContent = `Confiance: ${data.confidence}%`;
    
    // Probabilités
    const probaDiv = document.getElementById('probabilities');
    const teams = data.match.split(' vs ');
    probaDiv.innerHTML = `
        <div class="stat-item">
            <span class="stat-label">${teams[0]} gagne</span>
            <span class="stat-value">${data.home_win_prob}%</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">${teams[1]} gagne</span>
            <span class="stat-value">${data.away_win_prob}%</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Match nul</span>
            <span class="stat-value">${data.draw_prob}%</span>
        </div>
    `;
    
    // Score moyen
    const scoreDiv = document.getElementById('avg-score');
    scoreDiv.innerHTML = `
        <div class="stat-item">
            <span class="stat-label">${teams[0]}</span>
            <span class="stat-value">${data.avg_home_goals} buts</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">${teams[1]}</span>
            <span class="stat-value">${data.avg_away_goals} buts</span>
        </div>
    `;
    
    // Top 3 scores
    const topScoresDiv = document.getElementById('top-scores');
    let scoresHTML = '';
    data.top_3_scores.forEach((score, index) => {
        const percentage = ((data.top_3_frequencies[index] / data.simulations) * 100).toFixed(1);
        scoresHTML += `
            <div class="stat-item">
                <span class="stat-label">${index + 1}. ${score[0]}-${score[1]}</span>
                <span class="stat-value">${percentage}%</span>
            </div>
        `;
    });
    topScoresDiv.innerHTML = scoresHTML;
    
    resultsDiv.style.display = 'block';
}

// 🏆 Charger le classement
function loadRanking() {
    fetch('/api/ranking')
        .then(response => response.json())
        .then(data => {
            console.log('Classement:', data);
            showAlert('Classement chargé! Voir la console', 'success');
        })
        .catch(error => {
            console.error('Erreur:', error);
            showAlert('Erreur lors du chargement du classement', 'error');
        });
}

// 🔄 Mettre à jour la base de données
function updateDatabase() {
    showAlert('Mise à jour en cours...', 'info');
    
    fetch('/api/update', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            showAlert(data.error, 'error');
        } else {
            showAlert('Base de données mise à jour!', 'success');
            loadTeams();
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        showAlert('Erreur lors de la mise à jour', 'error');
    });
}

// 📢 Afficher une alerte
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        background: ${type === 'error' ? '#ff6b6b' : type === 'success' ? '#51cf66' : '#4dabf7'};
        color: white;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => alertDiv.remove(), 3000);
}

// ⌨️ Permettre Entrée pour prédire
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const awayInput = document.getElementById('away-team');
        if (document.activeElement === awayInput) {
            predictMatch();
        }
    }
});
