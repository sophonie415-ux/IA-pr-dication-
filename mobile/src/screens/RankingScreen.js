import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PredictorAPI from '../api/predictorAPI';
import styles from '../styles/styles';

const RankingScreen = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRanking();
  }, []);

  const loadRanking = async () => {
    try {
      const data = await PredictorAPI.getRanking();
      setRanking(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRanking();
    setRefreshing(false);
  };

  const renderRankingItem = ({ item, index }) => (
    <View style={styles.rankingItem}>
      <View style={styles.rankingRank}>
        <Text style={styles.rankingRankText}>{index + 1}</Text>
      </View>
      <View style={styles.rankingTeam}>
        <Text style={styles.rankingTeamName}>{item.Team}</Text>
      </View>
      <View style={styles.rankingStats}>
        <View style={styles.statBadge}>
          <Text style={styles.statBadgeLabel}>ATT</Text>
          <Text style={styles.statBadgeValue}>{item.Attack}</Text>
        </View>
        <View style={styles.statBadge}>
          <Text style={styles.statBadgeLabel}>DEF</Text>
          <Text style={styles.statBadgeValue}>{item.Defense}</Text>
        </View>
        <View style={[styles.statBadge, { backgroundColor: '#667eea' }]}>
          <Text style={styles.statBadgeLabel}>NOTE</Text>
          <Text style={styles.statBadgeValue}>{item.Rating}</Text>
        </View>
      </View>
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
          <Ionicons name="trophy" size={40} color="#fff" />
          <Text style={styles.headerTitle}>Classement LaLiga</Text>
        </View>
      </LinearGradient>

      <FlatList
        data={ranking}
        keyExtractor={(item) => item.Team}
        renderItem={renderRankingItem}
        contentContainerStyle={styles.rankingList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default RankingScreen;
