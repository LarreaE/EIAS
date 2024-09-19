// HomeScreen.tsx (si es TypeScript)
import React from 'react';
import { View, Text, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack'; // Importa los tipos de navegación
import { RootStackParamList } from '../types/types.ts'; // Importa los tipos que definas para tu stack

// Definir el tipo para el parámetro de navegación
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'black' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Home Again"
        onPress={() => navigation.navigate('Home')}
      />
      <Button
        title="Profile"
        onPress={() => navigation.navigate('Profile')}
      />
    </View>
  );
};

export default HomeScreen;
