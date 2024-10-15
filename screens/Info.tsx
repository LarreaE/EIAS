import React from 'react';
import EquipmentScreen from './Equipment';
import { createStackNavigator } from '@react-navigation/stack';
import StatsScreen from './Stats';
import Inventory from './Inventory';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

type Props = {
  user: any;
};

const screenOptions = {
  tabBarStyle: {
    backgroundColor: 'blue',
    position: 'relative',
  },
  headerShown: true,
  swipeEnabled: true,
};

const TopTab = createMaterialTopTabNavigator();

const AcolythScreen: React.FC<Props> = ({user}) => {

  return (
        <TopTab.Navigator
        initialRouteName="AcolythEquipment"
        screenOptions={screenOptions}
        >
          <>
          <TopTab.Screen
            name="Equipment"
          >
            {props => <EquipmentScreen {...props} user={user} />}
          </TopTab.Screen>
          <TopTab.Screen
            name="Stats"
          >
            {props => <StatsScreen {...props} user={user} />}
          </TopTab.Screen>
          <TopTab.Screen
            name="Inventory"
          >
            {props => <Inventory {...props} user={user} />}
          </TopTab.Screen>
          </>
        </TopTab.Navigator>
  );
};


export default AcolythScreen;
