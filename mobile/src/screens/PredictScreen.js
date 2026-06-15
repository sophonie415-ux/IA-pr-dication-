import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PredictorAPI from '../api/predictorAPI';
import styles from '../styles/styles';

const PredictScreen = () => {
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [showTeamsList, setShowTeamsList] = useState(false);
  const [filteredTeams, setFilteredTeams] = useState([]);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const teamsData = await PredictorAPI.getTeams();
      setTeams(teamsData);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleTeamInput = (text, isHome) => {
    if (isHome) {
      setHomeTeam(text);
    } else {
      setAwayTeam(text);
    }
    const filtered = teams.filter(team =>
      team.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredTeams(filtered);
    setShowTeamsList(true);
  };

  const selectTeam = (team, isHome) => {
    if (isHome) {
      setHomeTeam(team);
    } else {
      setAwayTeam(team);
    }
    setShowTeamsList(false);
  };

  const handlePredict = async () => {
    if (!homeTeam || !awayTeam) {
      Alert.alert('Erreur', 'Veuillez entrer les deux équipes');
      return;
    }

    if (homeTeam === awayTeam) {
      Alert.alert('Erreur', 'Les deux équipes doivent être différentes');
      return;
    }

    setLoading(true);
    try {
      const result = await PredictorAPI.predict(homeTeam, awayTeam);
      setPrediction(result);
      await PredictorAPI.savePrediction(result);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de faire la prédiction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
        <View style={styles.header}>
          <Ionicons name="football" size={40} color="#fff" />
          <Text style={styles.headerTitle}>Prédiction de Match</Text>
        </View>
      </LinearGradient>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>⚽ Équipe domicile</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Real Madrid"
            value={homeTeam}
            onChangeText={(text) => handleTeamInput(text, true)}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>⚽ Équipe extérieur</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Barcelona"
            value={awayTeam}
            onChangeText={(text) => handleTeamInput(text, false)}
            placeholderTextColor="#999"
          />
        </View>

        {showTeamsList && filteredTeams.length > 0 && (
          <FlatList
            data={filteredTeams}
            keyExtractor={(item) => item}
            scrollEnabled={false}
            style={styles.teamsList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.teamItem}
                onPress={() => {
                  if (!homeTeam) {
                    selectTeam(item, true);
                  } else if (!awayTeam) {
                    selectTeam(item, false);
                  }
                }}
              >
                <Text style={styles.teamItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        <TouchableOpacity
          style={styles.predictButton}
          onPress={handlePredict}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <>
              <Ionicons name="magic" size={20} color="#fff" />
              <Text style={styles.predictButtonText}>Prédire</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {prediction && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>📊 Résultats</Text>

          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.winnerBox}
          >
            <Text style={styles.winnerLabel}>🏆 Vainqueur probable</Text>
            <Text style={styles.winnerText}>{prediction.winner}</Text>
            <Text style={styles.confidenceText}>
              Confiance: {prediction.confidence}%
            </Text>
          </LinearGradient>

          <View style={styles.statsCard}>
            <Text style={styles.cardTitle}>📈 Probabilités</Text>
            <View style={styles.probItem}>
              <Text style={styles.probLabel}>
                {prediction.match.split(' vs ')[0]} gagne
              </Text>
              <Text style={styles.probValue}>{prediction.home_win_prob}%</Text>
            </View>
            <View style={styles.probItem}>
              <Text style={styles.probLabel}>
                {prediction.match.split(' vs ')[1]} gagne
              </Text>
              <Text style={styles.probValue}>{prediction.away_win_prob}%</Text>
            </View>
            <View style={styles.probItem}>
              <Text style={styles.probLabel}>Match nul</Text>
              <Text style={styles.probValue}>{prediction.draw_prob}%</Text>
            </View>
          </View>

          <View style={styles.statsCard}>
            <Text style={styles.cardTitle}>⚽ Score moyen</Text>
            <View style={styles.scoreRow}>
              <Text style={styles.teamName}>
                {prediction.match.split(' vs ')[0]}
              </Text>
              <Text style={styles.scoreValue}>
                {prediction.avg_home_goals}
              </Text>
            </View>
            <View style={styles.scoreRow}>
              <Text style={styles.teamName}>
                {prediction.match.split(' vs ')[1]}
              </Text>
              <Text style={styles.scoreValue}>
                {prediction.avg_away_goals}
              </Text>
            </View>
          </View>

          <View style={styles.statsCard}>
            <Text style={styles.cardTitle}>🎯 Top 3 scores exacts</Text>
            {prediction.top_3_scores.map((score, index) => {
              const percentage = (
                (prediction.top_3_frequencies[index] /
                  prediction.simulations) *
                100
              ).toFixed(1);
              return (
                <View key={index} style={styles.scoreItem}>
                  <Text style={styles.scoreRank}>{index + 1}.</Text>
                  <Text style={styles.scoreValue}>
                    {score[0]}-{score[1]}
                  </Text>
                  <Text style={styles.scorePercentage}>{percentage}%</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default PredictScreen;
