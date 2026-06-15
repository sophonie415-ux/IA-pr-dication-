import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PredictorAPI from '../api/predictorAPI';
import styles from '../styles/styles';

const TeamsScreen = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const data = await PredictorAPI.getTeams();
      setTeams(data);
      setFilteredTeams(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text === '') {
      setFilteredTeams(teams);
    } else {
      const filtered = teams.filter(team =>
        team.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredTeams(filtered);
    }
  };

  const renderTeamItem = ({ item, index }) => (
    <View style={styles.teamCard}>
      <View style={styles.teamIndex}>
        <Text style={styles.teamIndexText}>{index + 1}</Text>
      </View>
      <Text style={styles.teamCardName}>{item}</Text>
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
          <Ionicons name="people" size={40} color="#fff" />
          <Text style={styles.headerTitle}>Équipes LaLiga</Text>
          <Text style={styles.headerSubtitle}>{teams.length} équipes</Text>
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#667eea" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une équipe..."
          value={searchText}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
      </View>

      <FlatList
        data={filteredTeams}
        keyExtractor={(item) => item}
        renderItem={renderTeamItem}
        contentContainerStyle={styles.teamsList}
        numColumns={2}
      />
    </View>
  );
};

export default TeamsScreen;
