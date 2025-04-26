import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

// Basit Ekranlar
function DashboardScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Dashboard</Text>
    </View>
  );
}

function ReportsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Raporlar</Text>
    </View>
  );
}

function StockScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Stok</Text>
    </View>
  );
}

function GreenFinanceScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Yeşil Finans</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Ayarlar</Text>
    </View>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconSource;

          
          if (route.name === 'Dashboard') {
            iconSource = require('../Assets/icon/layout.png');
          } else if (route.name === 'Raporlar') {
            iconSource = require('../Assets/icon/report.png');
          } else if (route.name === 'Stok') {
            iconSource = require('../Assets/icon/packages.png');
          } else if (route.name === 'Yeşil Finans') {
            iconSource = require('../Assets/icon/finance.png');
          } else if (route.name === 'Ayarlar') {
            iconSource = require('../Assets/icon/gear.png');
          }

          return (
            <Image
              source={iconSource}
              style={{ width: size, height: size, tintColor: color }}
              resizeMode="contain"
            />
          );
        },
        tabBarActiveTintColor: '#4caf50',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Raporlar" component={ReportsScreen} />
      <Tab.Screen name="Stok" component={StockScreen} />
      <Tab.Screen name="Yeşil Finans" component={GreenFinanceScreen} />
      <Tab.Screen name="Ayarlar" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
