
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface Props {
    avatarUri: string
}

const MapMarker: React.FC<Props> = ({ avatarUri }) => {
  return (
    <View style={styles.markerContainer}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: avatarUri }}
          style={styles.avatar}
        />
      </View>
      <View style={styles.markerPointer} />
    </View>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff', // Border color for the avatar
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  markerPointer: {
    width: 10,
    height: 10,
    backgroundColor: '#4285F4', // Color for the pointer part of the marker
    borderRadius: 5,
    marginTop: -10,
  },
});

export default MapMarker;
