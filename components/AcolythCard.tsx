// AcolythCard.tsx
import React from 'react';
import { Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import MedievalText from './MedievalText';

type Props = {
  nickname: string;
  is_active: boolean;
  avatar: string;
  disease?: string | null;
  ethaziumCursed?: boolean;
  onPress?: () => void;
};

// Helper para decidir color e inicial de la enfermedad
function getDiseaseBadgeInfo(disease: string) {
  console.log(disease);
  
  switch (disease) {
    case 'PUTRID PLAGUE':
      return { color: 'purple', letter: 'P' };
    case 'EPIC WEAKNESS':
      return { color: 'blue', letter: 'E' };
    case 'MEDULAR APOCALYPSE':
      return { color: 'green', letter: 'M' };
    case 'EXHAUSTED':
        return { color: 'purple', letter: 'z' };
    default:
      return { color: 'transparent', letter: '' };
  }
}

const AcolythCard: React.FC<Props> = ({
  nickname,
  is_active,
  avatar,
  disease,
  ethaziumCursed,
  onPress,
}) => {
  // Borde según is_active
  const borderStyle = is_active ? styles.activeBorder : styles.inactiveBorder;

  // Determinar diseaseBadge
  let diseaseBadge = null;
  if (disease && disease !== null) {
    const { color, letter } = getDiseaseBadgeInfo(disease);
    diseaseBadge = (
      <View style={[styles.badge, { backgroundColor: color }]}>
        <MedievalText style={styles.badgeText}>{letter}</MedievalText>
      </View>
    );
  }

  // Determinar curseBadge (Ethazium)
  let curseBadge = null;
  if (ethaziumCursed) {
    curseBadge = (
      <View style={[styles.badge, { backgroundColor: 'red' }]}>
        <MedievalText style={styles.badgeText}>C</MedievalText>
      </View>
    );
  }
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
    <View style={styles.container}>
      <Image source={{ uri: avatar }} style={[styles.image, borderStyle]} />
      <View style={styles.infoColumn}>
        <MedievalText style={styles.text}>{nickname}</MedievalText>

        {/* Contenedor para los badges, estilo horizontal */}
        <View style={styles.badgesRow}>
          {diseaseBadge}
          {curseBadge}
        </View>
      </View>
    </View>
    </TouchableOpacity>
  );
};

export default AcolythCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    margin: 5,
    borderStyle: 'solid',
    borderColor: 'grey',
    borderBottomWidth: 1,
    backgroundColor: 'lightgrey',
    borderRadius: 30,
    alignItems: 'center',
    width: 280,
    height: 70,
  },
  infoColumn: {
    flexDirection: 'column',
  },
  text: {
    color: 'black',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 2,
  },
  activeBorder: {
    borderColor: 'green',
  },
  inactiveBorder: {
    borderColor: 'red',
  },
  badgesRow: {
    flexDirection: 'row',
    marginTop: 4, // Espacio entre nickname y badges
  },
  badge: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    marginRight: 5, // Espacio entre badges
  },
  badgeText: {
    color: '#FFF',
  },
});
