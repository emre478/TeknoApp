import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import Dashboard from '../Screens/TabScreens/Dashboard';
import Report from '../Screens/TabScreens/Report';
import Stock from '../Screens/TabScreens/Stock';
import GreenFinance from '../Screens/TabScreens/GreenFinance';
import Setting from '../Screens/TabScreens/Setting';
import {Image} from 'react-native';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
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
              style={{width: size, height: size, tintColor: color}}
            />
          );
        },
        tabBarActiveTintColor: '#66cdaa',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Raporlar" component={Report} />
      <Tab.Screen name="Stok" component={Stock} />
      <Tab.Screen name="Yeşil Finans" component={GreenFinance} />
      <Tab.Screen name="Ayarlar" component={Setting} />
    </Tab.Navigator>
  );
}
