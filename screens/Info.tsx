import React from 'react';
import EquipmentScreen from './Equipment';
import { createStackNavigator } from '@react-navigation/stack';
import StatsScreen from './Stats';
import Inventory from './Inventory';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Image, StyleSheet } from 'react-native';

type Props = {
  user: any;
};

const screenOptions = {
  tabBarStyle: {
    backgroundColor: 'transparent',  // Fondo transparente
    borderBottomWidth: 0, // Elimina cualquier borde inferior
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    elevation: 0,
  },
  headerShown: true,
  swipeEnabled: true,
};

const TopTab = createMaterialTopTabNavigator();

const AcolythScreen: React.FC<Props> = ({ user }) => {

  return (
    <TopTab.Navigator
      initialRouteName="AcolythEquipment"
      screenOptions={screenOptions}
    >
      <>
        <TopTab.Screen
          name="Equipment"
          options={{
            tabBarLabel: '',
            tabBarIcon: () => (
              <Image source={require('../assets/equipments_icon.webp')} style={styles.icon} />
            ),
          }}
        >
          {props => <EquipmentScreen {...props} user={user} />}
        </TopTab.Screen>
        <TopTab.Screen
          name="Stats"
          options={{
            tabBarLabel: '',
            tabBarIcon: () => (
              <Image source={require('../assets/stats_icon.webp')} style={styles.icon} />
            ),
          }}
        >
          {props => <StatsScreen {...props} user={user} />}
        </TopTab.Screen>
        <TopTab.Screen
          name="Inventory"
          options={{
            tabBarLabel: '',
            tabBarIcon: () => (
              <Image source={require('../assets/inventory_icon.webp')} style={styles.icon} />
            ),
          }}
        >
          {props => <Inventory {...props} user={user} />}
        </TopTab.Screen>
      </>
    </TopTab.Navigator>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginTop: -10,
    width: 66,
    height: 66,
    right: 20,
  }
});

export default AcolythScreen;