import React, { useState, useEffect, useFocusEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import 'moment/locale/fr';
import PredictorAPI from '../api/predictorAPI';
import styles from '../styles/styles';

moment.locale('fr');

const HistoryScreen = ({ useFocusEffect: useFocus }) => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadPredictions();
    }, [])
  );

  const loadPredictions = async () => {
    try {
      const data = await PredictorAPI.getPredictions();
      setPredictions(data.reverse());
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePrediction = (index) => {
    Alert.alert(
      'Supprimer',
      'Êtes-vous sûr?',
      [
        { text: 'Annuler', onPress: () => {} },
        {
          text: 'Supprimer',
          onPress: async () => {
            const newPredictions = predictions.filter((_, i) => i !== index);
            setPredictions(newPredictions);
            await PredictorAPI.clearPredictions();
            for (const pred of newPredictions) {
              await PredictorAPI.savePrediction(pred);
            }
          },
        },
      ]
    );
  };

  const clearHistory = () => {
    Alert.alert(
      'Effacer tout',
      'Êtes-vous sûr de vouloir effacer tout l\'historique?',
      [
        { text: 'Annuler', onPress: () => {} },
        {
          text: 'Effacer',
          onPress: async () => {
            await PredictorAPI.clearPredictions();
            setPredictions([]);
          },
        },
      ]
    );
  };

  const renderHistoryItem = ({ item, index }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyContent}>
        <View style={styles.historyMatch}>
          <Text style={styles.historyTeam}>{item.match.split(' vs ')[0]}</Text>
          <Text style={styles.historyVs}>VS</Text>
          <Text style={styles.historyTeam}>{item.match.split(' vs ')[1]}</Text>
        </View>
        <View style={styles.historyDetails}>
          <Text style={styles.historyWinner}>🏆 {item.winner}</Text>
          <Text style={styles.historyTime}>
            {moment(item.savedAt).fromNow()}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deletePrediction(index)}
      >
        <Ionicons name="trash" size={20} color="#ff6b6b" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
        <View style={styles.header}>
          <Ionicons name="list" size={40} color="#fff" />
          <Text style={styles.headerTitle}>Historique</Text>
          <Text style={styles.headerSubtitle}>
            {predictions.length} prédictions
          </Text>
        </View>
      </LinearGradient>

      {predictions.length > 0 ? (
        <>
          <FlatList
            data={predictions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderHistoryItem}
            contentContainerStyle={styles.historyList}
          />
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearHistory}
          >
            <Ionicons name="trash" size={20} color="#fff" />
            <Text style={styles.clearButtonText}>Effacer tout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="clipboard-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Aucune prédiction</Text>
        </View>
      )}
    </View>
  );
};

export default HistoryScreen;
