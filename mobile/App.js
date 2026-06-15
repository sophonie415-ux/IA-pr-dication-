import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import PredictScreen from './src/screens/PredictScreen';
import RankingScreen from './src/screens/RankingScreen';
import TeamsScreen from './src/screens/TeamsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerStyle: {
              backgroundColor: '#667eea',
              borderBottomColor: '#667eea',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 18,
            },
            tabBarActiveTintColor: '#667eea',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: {
              backgroundColor: '#f8f9fa',
              borderTopColor: '#e0e0e0',
              borderTopWidth: 1,
              paddingBottom: 5,
              paddingTop: 5,
            },
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'Prédire') {
                iconName = 'football';
              } else if (route.name === 'Classement') {
                iconName = 'trophy';
              } else if (route.name === 'Équipes') {
                iconName = 'people';
              } else if (route.name === 'Historique') {
                iconName = 'list';
              } else if (route.name === 'Paramètres') {
                iconName = 'settings';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen
            name="Prédire"
            component={PredictScreen}
            options={{
              title: '⚽ Prédiction',
            }}
          />
          <Tab.Screen
            name="Classement"
            component={RankingScreen}
            options={{
              title: '🏆 Classement',
            }}
          />
          <Tab.Screen
            name="Équipes"
            component={TeamsScreen}
            options={{
              title: '👥 Équipes',
            }}
          />
          <Tab.Screen
            name="Historique"
            component={HistoryScreen}
            options={{
              title: '📋 Historique',
            }}
          />
          <Tab.Screen
            name="Paramètres"
            component={SettingsScreen}
            options={{
              title: '⚙️ Paramètres',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
