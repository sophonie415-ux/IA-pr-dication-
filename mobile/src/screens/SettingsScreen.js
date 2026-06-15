import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
  TextInput,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/styles';

const SettingsScreen = () => {
  const [apiUrl, setApiUrl] = useState('http://192.168.1.100:5000');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSaveSettings = async () => {
    try {
      await AsyncStorage.setItem('apiUrl', apiUrl);
      await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
      Alert.alert('Succès', 'Paramètres sauvegardés');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder');
    }
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Vider le cache',
      'Êtes-vous sûr?',
      [
        { text: 'Annuler', onPress: () => {} },
        {
          text: 'Vider',
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert('Succès', 'Cache vidé');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
        <View style={styles.header}>
          <Ionicons name="settings" size={40} color="#fff" />
          <Text style={styles.headerTitle}>Paramètres</Text>
        </View>
      </LinearGradient>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>🌐 Configuration API</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>URL du serveur</Text>
          <TextInput
            style={styles.settingInput}
            value={apiUrl}
            onChangeText={setApiUrl}
            placeholder="http://192.168.1.100:5000"
          />
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>🔔 Notifications</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Activer les notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#ccc', true: '#667eea' }}
          />
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>🎨 Apparence</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Mode sombre (Bientôt)</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            disabled
            trackColor={{ false: '#ccc', true: '#667eea' }}
          />
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>💾 Données</Text>
        <TouchableOpacity
          style={styles.settingButton}
          onPress={handleClearCache}
        >
          <Ionicons name="trash" size={20} color="#ff6b6b" />
          <Text style={styles.settingButtonText}>Vider le cache</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>ℹ️ À propos</Text>
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>Application</Text>
          <Text style={styles.aboutValue}>LaLiga AI Predictor</Text>
        </View>
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>Version</Text>
          <Text style={styles.aboutValue}>1.0.0</Text>
        </View>
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>Développeur</Text>
          <Text style={styles.aboutValue}>sophonie415-ux</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSaveSettings}
      >
        <Ionicons name="checkmark" size={20} color="#fff" />
        <Text style={styles.saveButtonText}>Sauvegarder les paramètres</Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

export default SettingsScreen;
