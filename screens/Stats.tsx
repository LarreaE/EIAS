import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image} from 'react-native';
import * as Progress from 'react-native-progress';  // Importar la librería de progreso

import { Modifier } from '../interfaces/Modifier';
import MedievalText from '../components/MedievalText';

type Props = {
  user: any;
};

const StatsScreen: React.FC<Props> = ({ user }) => {
  const player = user?.playerData || 'No player available';
  const [currentAttributes, setCurrentAttributes] = useState<Modifier>();

  useEffect(() => {
    if (player) calculateAllAttributes();
  }, [player]);

  const role = user?.playerData.role || 'No roll available';
  const userName = user?.playerData?.nickname || 'No name available';
  const image = user?.playerData?.avatar || 'No photo available'
  const calculateAllAttributes = () => {
    if(player) {
      const charisma =
        player.attributes?.charisma +
        player.equipment.helmet?.modifiers.charisma! +
        player.equipment.weapon.modifiers.charisma +
        player.equipment.armor.modifiers.charisma +
        player.equipment.shield?.modifiers.charisma! +
        player.equipment.artifact.modifiers.charisma +
        player.equipment.boot?.modifiers.charisma! +
        player.equipment.ring?.modifiers.charisma!;
      const constitution =
        player.attributes?.constitution +
        player.equipment.helmet?.modifiers.constitution! +
        player.equipment.weapon.modifiers.constitution +
        player.equipment.armor.modifiers.constitution +
        player.equipment.shield?.modifiers.constitution! +
        player.equipment.artifact.modifiers.constitution +
        player.equipment.boot?.modifiers.constitution! +
        player.equipment.ring?.modifiers.constitution!;
      const dexterity =
        player.attributes?.dexterity +
        player.equipment.helmet?.modifiers.dexterity! +
        player.equipment.weapon.modifiers.dexterity +
        player.equipment.armor.modifiers.dexterity +
        player.equipment.shield?.modifiers.dexterity! +
        player.equipment.artifact.modifiers.dexterity +
        player.equipment.boot?.modifiers.dexterity! +
        player.equipment.ring?.modifiers.dexterity!;
      const insanity =
        player.attributes?.insanity +
        player.equipment.helmet?.modifiers.insanity! +
        player.equipment.weapon.modifiers.insanity +
        player.equipment.armor.modifiers.insanity +
        player.equipment.shield?.modifiers.insanity! +
        player.equipment.artifact.modifiers.insanity +
        player.equipment.boot?.modifiers.insanity! +
        player.equipment.ring?.modifiers.insanity!;
      const intelligence =
        player.attributes?.intelligence +
        player.equipment.helmet?.modifiers.intelligence! +
        player.equipment.weapon.modifiers.intelligence +
        player.equipment.armor.modifiers.intelligence +
        player.equipment.shield?.modifiers.intelligence! +
        player.equipment.artifact.modifiers.intelligence +
        player.equipment.boot?.modifiers.intelligence! +
        player.equipment.ring?.modifiers.intelligence!;
      const strength =
        player.attributes?.strength +
        player.equipment.helmet?.modifiers.strength! +
        player.equipment.weapon.modifiers.strength +
        player.equipment.armor.modifiers.strength +
        player.equipment.shield?.modifiers.strength! +
        player.equipment.artifact.modifiers.strength +
        player.equipment.boot?.modifiers.strength! +
        player.equipment.ring?.modifiers.strength!;
      setCurrentAttributes({constitution, charisma, dexterity, intelligence, strength, insanity })
    }
  }

  return (
    <ImageBackground
      source={require('../assets/profile.png')}
      style={styles.background}
      resizeMode="cover"
    >
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.profilePhoto} />
      <MedievalText style={styles.header}>{role}</MedievalText>
      <MedievalText style={styles.header}>Name: {userName}</MedievalText>
      <MedievalText style={styles.header}></MedievalText>
      {currentAttributes ? (
        <View style={styles.statsContainer}>
          <StatBar label="Charisma" value={currentAttributes.charisma} />
          <StatBar label="Constitution" value={currentAttributes.constitution} />
          <StatBar label="Dexterity" value={currentAttributes.dexterity} />
          <StatBar label="Insanity" value={currentAttributes.insanity} />
          <StatBar label="Intelligence" value={currentAttributes.intelligence} />
          <StatBar label="Strength" value={currentAttributes.strength} />
        </View>
      ) : (
        <MedievalText style={styles.statLabel}>No stats available</MedievalText>
      )}
    </View>
    </ImageBackground>
  );
};

const StatBar: React.FC<{ label: string, value: number }> = ({ label, value }) => {
  return (
    <View style={styles.statRow}>
      <MedievalText style={styles.statLabel}>{label}</MedievalText>
      <Progress.Bar
        progress={value / 1000}
        width={150}
        color="#fcd34d"
        unfilledColor="#4b5563"
        borderWidth={1}
        borderColor="#fcd34d"
        style={styles.progressBar}  // Añadido estilo para margen
      />
      <MedievalText style={styles.statValue}>{value}</MedievalText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1a202c60',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    
    color: '#fcd34d',
    marginBottom: 20,
  },
  statsContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  space: {
    marginVertical: '10%'
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    justifyContent: 'space-between',
  },
  statLabel: {
    color: '#fcd34d',
    fontSize: 16,
    width: '30%',  // Ancho fijo para asegurar que las etiquetas estén alineadas
  },
  statValue: {
    color: '#fcd34d',
    fontSize: 16,
    width: 50,  // Ancho fijo para asegurar que los números tengan el mismo espacio
    textAlign: 'right',  // Alineación a la derecha para que siempre estén alineados
  },
  progressBar: {
    marginHorizontal: 10,  // Añadir margen horizontal entre la barra y el número
  },
  profilePhoto: {
    borderRadius: 50,
    width: 100,
    height: 100,
  }
});

export default StatsScreen;