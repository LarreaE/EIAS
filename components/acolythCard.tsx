import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootStackParamList } from '../types/types';
import io from 'socket.io-client';

// definir tipo de datos de props
type Props = {
  name: string;
  is_active: boolean;
  avatar: string;
};

const AcolythCard: React.FC<Props> = ({ name, is_active, avatar }) => {
  return (
    <View>
      <View style={styles.container}>
        <Text style={[styles.text]}>{name}</Text>
        <Text style={[styles.text, is_active && styles.activeText]}>
          {is_active ? ' Dentro' : ' Fuera'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    padding: 20,
    margin: 20,
    borderStyle: "solid",
    borderColor: 'grey',
    borderBottomWidth: 1,
    backgroundColor: 'lightgrey',
    borderRadius: 30
  },
  text: {
    color: 'black',
  },
  activeText: {
    color: 'red',
  },
});

export default AcolythCard;
