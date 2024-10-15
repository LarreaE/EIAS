import React from 'react';
import { View, ScrollView, StyleSheet, Text, SafeAreaView, Image } from 'react-native';
import EquipmentScreen from './Equipment';
import { createStackNavigator } from '@react-navigation/stack';
import StatsScreen from './Stats';

type Props = {
  user: any;
};

const screenOptions = {
  tabBarStyle: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 0,
    height: 80,
    elevation: 0,
  },
  headerShown: false,
  swipeEnabled: true,
  tabBarScrollEnabled: false,
  shadowOpacity: 0,
  shadowRadius: 0,
};

const Stack = createStackNavigator();

const AcolythScreen: React.FC<Props> = ({user}) => {

  return (
        <Stack.Navigator
        initialRouteName="AcolythEquipment"
        >
          <>
          <Stack.Screen
            name="Equipment"
          >
            {props => <EquipmentScreen {...props} user={user} />}
          </Stack.Screen>
          <Stack.Screen
            name="Stats"
          >
            {props => <StatsScreen {...props} user={user} />}
          </Stack.Screen>
          <Stack.Screen
            name="Inventory"
          >
            {props => <InventoryScreen {...props} user={user} />}
          </Stack.Screen>
          </>
        </Stack.Navigator>
  );
};


export default AcolythScreen;