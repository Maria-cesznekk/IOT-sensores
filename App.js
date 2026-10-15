import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ListarSensoresScreen from './src/screens/ListarSensoresScreen';
import VisualizarSensorScreen from './src/screens/VisualizarSensorScreen';
import AtualizarStatusScreen from './src/screens/AtualizarStatusScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: '#fff',
          tabBarActiveTintColor: '#6200ee',
          tabBarInactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen 
          name="Listar" 
          component={ListarSensoresScreen} 
          options={{ title: 'Todos os Sensores' }}
        />
        <Tab.Screen 
          name="Visualizar" 
          component={VisualizarSensorScreen} 
          options={{ title: 'Procurar Sensor' }}
        />
        <Tab.Screen 
          name="Atualizar" 
          component={AtualizarStatusScreen} 
          options={{ title: 'Atualizar Status' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}