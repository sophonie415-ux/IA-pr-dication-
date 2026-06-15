import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.100:5000/api';

const API_CONFIG = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

class PredictorAPI {
  constructor() {
    this.client = axios.create(API_CONFIG);
  }

  async predict(homeTeam, awayTeam) {
    try {
      const response = await this.client.post(`${API_BASE_URL}/predict`, {
        home: homeTeam,
        away: awayTeam,
      });
      return response.data;
    } catch (error) {
      console.error('Erreur prédiction:', error);
      throw error;
    }
  }

  async getTeams() {
    try {
      const response = await this.client.get(`${API_BASE_URL}/teams`);
      return response.data.teams || [];
    } catch (error) {
      console.error('Erreur récup��ration équipes:', error);
      return [];
    }
  }

  async getRanking() {
    try {
      const response = await this.client.get(`${API_BASE_URL}/ranking`);
      return response.data || [];
    } catch (error) {
      console.error('Erreur classement:', error);
      return [];
    }
  }

  async updateDatabase() {
    try {
      const response = await this.client.post(`${API_BASE_URL}/update`);
      return response.data;
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      throw error;
    }
  }

  async getStats() {
    try {
      const response = await this.client.get(`${API_BASE_URL}/stats`);
      return response.data;
    } catch (error) {
      console.error('Erreur stats:', error);
      return {};
    }
  }

  async savePrediction(prediction) {
    try {
      const predictions = await this.getPredictions();
      predictions.push({
        ...prediction,
        savedAt: new Date().toISOString(),
      });
      await AsyncStorage.setItem('predictions', JSON.stringify(predictions));
    } catch (error) {
      console.error('Erreur sauvegarde prédiction:', error);
    }
  }

  async getPredictions() {
    try {
      const data = await AsyncStorage.getItem('predictions');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erreur récupération prédictions:', error);
      return [];
    }
  }

  async clearPredictions() {
    try {
      await AsyncStorage.removeItem('predictions');
    } catch (error) {
      console.error('Erreur suppression prédictions:', error);
    }
  }
}

export default new PredictorAPI();
