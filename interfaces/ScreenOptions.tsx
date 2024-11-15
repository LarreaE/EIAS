import { MaterialTopTabNavigationOptions } from "@react-navigation/material-top-tabs";


export interface ScreenOptions extends MaterialTopTabNavigationOptions {
    tabBarStyle?: {
      backgroundColor: string;
      borderTopWidth: number;
      position: 'absolute' | 'relative';
      left: number;
      right: number;
      bottom: number;
      paddingBottom: number;
      height: number;
      elevation: number;
    };
    tabBarIndicatorStyle?: {
      height: number;
    };
    headerShown: boolean;
    swipeEnabled: boolean;
    tabBarScrollEnabled: boolean;
    shadowOpacity: number;
    shadowRadius: number;
  }