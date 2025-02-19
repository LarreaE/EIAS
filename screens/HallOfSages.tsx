import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, Text, Dimensions, TouchableOpacity, ToastAndroid } from 'react-native';
import AcolythCardInHall from '../components/acolyteCardHall.tsx';
import MedievalText from '../components/MedievalText.tsx';
import MapButton from '../components/MapButton.tsx';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList, StackNavigationProp } from '../types/types.ts';
import {
  AngeloDelivered,
  requestArtifacts,
  restoreObjects,
  searchValidated,
  sendAnimationMortimer,
  sendIsInHall,
  sendPlayAnimationAcolyte
} from '../sockets/emitEvents.tsx';
import { UserContext, UserContextType } from '../context/UserContext.tsx';
import { sendLocation } from '../sockets/emitEvents.tsx';
import socket from '../sockets/socketConnection.tsx';
import AnimatedCircles from '../components/Animations/AnimatedCircles.tsx';
import InverseAnimatedCircles from '../components/Animations/InverseAnimationCircles.tsx';
import FadeInArtefacts from '../components/Animations/FadeInArtefacts.tsx';
import Config from 'react-native-config';
import Spinner from '../components/Spinner.tsx';
import ValidateAngeloModal from '../components/ValidateAngeloModal.tsx';
import { clearAngeloDelivery, listenToAngeloDelivery, listenToArtifactsUpdates } from '../sockets/listenEvents.tsx';
import AngeloValidationResultModal from '../components/AngeloValidationResultModal.tsx';
import { trace } from 'console';

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HallOfSages'>;
const { width, height } = Dimensions.get('window');

interface User {
  _id: string;
  nickname: string;
  avatar: string;
  email: string;
  role: string;  // Aquí añadimos el rol del usuario
}

const HallOfSages: React.FC = () => {
  const navigation = useNavigation<MapScreenNavigationProp>();
  const context = useContext(UserContext) as UserContextType;
  const { userData, artifacts, setArtifacts, setIsHallInNeedOfMortimer } = context;

  const [usersInHall, setUsersInHall] = useState<User[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAnimatingMortimer, setIsAnimatingMortimer] = useState(false);
  const [isAnimatingFade, setIsAnimatingFade] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [mortimerInside, setMortimerInside] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Estado para AngeloValidationResultModal
  const [angeloResultVisible, setAngeloResultVisible] = useState(false);
  const [angeloIsSuccess, setAngeloIsSuccess] = useState(false);

  const isAngeloDelivered = userData?.playerData?.AngeloDelivered === true;


  useEffect(() => {
    // Registrar listeners con la función "showResultModal"
    listenToAngeloDelivery(
      (isSuccess) => {
        // Actualizamos estado
        setAngeloIsSuccess(isSuccess);
        setAngeloResultVisible(true);
      },
      () => setSpinner(false),
      userData.playerData.role,
    );

    return () => {
      clearAngeloDelivery();
    };
  }, [userData.playerData.role]);

  useEffect(() => {
    requestArtifacts();
    listenToArtifactsUpdates();
  
    socket.on('receive_artifacts', (artifacts) => {
      if (artifacts.length === 4) {
        console.log('artifacts set');
        setArtifacts(artifacts);
      }
      console.log('Artifacts received:', artifacts);
      setIsLoading(false);
    });
  
    return () => {
      socket.off('receive_artifacts');
    };
  },);

  useEffect(() => {
    sendIsInHall(currentUser.email, true);
  }, []);

  // Ejemplo de uso en un efecto o en una función
  const handleMortimerInside = (users) => {
    for (let i = 0; i < users.length; i++) {
      console.log(users[i].role);
      if (users[i].role === 'MORTIMER') {
        setMortimerInside(true);
        console.log('Mortimer is inside');
        return; // Interrumpe el bucle en cuanto lo encontramos
      }
    }
  };
  useEffect(() => {
    const handleUsersInHall = (users: User[]) => {
      console.log('Datos recibidos en send_users_in_hall:');
      setUsersInHall(users);
      // Detectar si Mortimer está
      handleMortimerInside(users);

      console.log('Mortimer status:' + mortimerInside);
      console.log(userData.playerData.angeloReduced);

    };

    socket.on('send_users_in_hall', handleUsersInHall);
    socket.on('AngeloDeliveredSuccesfully', () => {
      console.log('Angelo delivered to Mortimer and changed on DB');
      userData.playerData.AngeloDelivered = true;
    });

    if (userData.playerData.role === 'ACOLYTE') {
      socket.on('play_animation_all_acolytes', () => {
        console.log('Playing animation');
        handleStartAnimation();
      });
      socket.on('Validation_acolytes', (validation) => {
        console.log('validation arrived from server');
        if (validation === true) {
          validationOk();
        } else {
          validationNotOk();
        }
      });
    } else if (userData.playerData.role === 'MORTIMER') {
      socket.on('play_animation_all_mortimers', () => {
        console.log('Playing animation mortimer');
        handleStartAnimationMortimer();
      });
    }
  }, []);

  // Función para "entregar" a Angelo a Mortimer (por ejemplo, animación).
  const deliverAngeloToMortimer = () => {
    console.log('Angelo delivered to Mortimer...');
    setSpinner(true);
    AngeloDelivered();
  };

  const handleStartAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setSpinner(true);
      sendAnimationMortimer();
    }, 10000);
  };

  const handleStartAnimationMortimer = () => {
    setIsAnimatingMortimer(true);
    setIsHallInNeedOfMortimer(false);
    setTimeout(() => {
      setIsAnimatingMortimer(false);
      setIsAnimatingFade(true);
    }, 10000);
  };

  // Función que se ejecuta cuando se valida la búsqueda
  const handleValidateSearch = () => {
    console.log('search validated');
    setIsAnimatingFade(false);
    searchValidated(true);
  };

  // Función que se ejecuta cuando se reinicia la búsqueda
  const handleRestartSearch = () => {
    console.log('restart search');
    setIsAnimatingFade(false);
    searchValidated(false);
  };

  if (!userData || !userData.playerData || !userData.playerData.avatar || !userData.playerData.nickname) {
    return <MedievalText>Cargando...</MedievalText>;
  }

  const currentUser: User = {
    _id: userData.playerData._id,
    nickname: userData.playerData.nickname,
    avatar: userData.playerData.avatar,
    email: userData.playerData.email,
    role: userData.playerData.role,
  };

  const goToMap = () => {
    sendLocation('School', userData.playerData.email);
    sendIsInHall(currentUser.email, false);
    navigation.navigate('School');
    socket.off('send_users_in_hall');
    socket.off('play_animation_all_acolytes');
    socket.off('play_animation_all_mortimers');
    socket.off('Validation_acolytes');
  };

  const sendHallNotificationToMortimer = async () => {
    console.log('Sending obituario notification to Mortimer');
    try {
      const response = await fetch(`${Config.RENDER}/api/notifications/send-notification-obituario`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Server response:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const validationOk = () => {
    console.log('validation ok');
    setSpinner(false);
    userData.playerData.ArtifactsValidated = true;
    setArtifacts([]);
  };

  const validationNotOk = () => {
    console.log('validation  not ok');
    setSpinner(false);
    ToastAndroid.show('Validation refused', ToastAndroid.SHORT);
    restoreObjects();
    setArtifacts([]);
  };

  const giveArtifactsToMortimer = () => {
    console.log('Artifacts given to Mortimer:', artifacts);
    sendPlayAnimationAcolyte();
    // Lógica para enviar los artefactos
  };

  const filteredUsers = currentUser.role === 'ACOLYTE'
    ? usersInHall.filter(user => user.role !== 'VILLAIN')
    : usersInHall;

  const renderUsersInCircle = () => {
    const centerX = 200;
    const centerY = 200;
    const radius = 120;

    if (filteredUsers.length === 1) {
      return (
        <View key={filteredUsers[0]._id} style={styles.avatarContainer}>
          <AcolythCardInHall
            nickname={filteredUsers[0].nickname}
            avatar={filteredUsers[0].avatar}
          />
        </View>
      );
    }

    if (filteredUsers.length === 2) {
      return filteredUsers.map((user, index) => {
        const offset = 120;
        const x = index === 0 ? -offset : offset;

        return (
          <View
            key={user._id}
            style={[
              styles.avatarContainer,
              { transform: [{ translateX: x }, { translateY: 0 }] },
            ]}
          >
            <AcolythCardInHall nickname={user.nickname} avatar={user.avatar} />
          </View>
        );
      });
    }

    if (filteredUsers.length === 3) {
      const trianglePoints = [
        { x: 0, y: -radius },
        { x: -radius * Math.cos(Math.PI / 6), y: radius * Math.sin(Math.PI / 6) },
        { x: radius * Math.cos(Math.PI / 6), y: radius * Math.sin(Math.PI / 6) },
      ];

      return filteredUsers.map((user, index) => {
        const { x, y } = trianglePoints[index];
        return (
          <View
            key={user._id}
            style={[
              styles.avatarContainer,
              { transform: [{ translateX: x }, { translateY: y }] },
            ]}
          >
            <AcolythCardInHall nickname={user.nickname} avatar={user.avatar} />
          </View>
        );
      });
    }

    // Más de 3
    return filteredUsers.map((user, index) => {
      const angle = (2 * Math.PI * index) / filteredUsers.length;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      return (
        <View
          key={user._id}
          style={[
            styles.avatarContainer,
            { transform: [{ translateX: x - centerX }, { translateY: y - centerY }] },
          ]}
        >
          <AcolythCardInHall nickname={user.nickname} avatar={user.avatar} />
        </View>
      );
    });
  };

  return (
    <ImageBackground
      source={require('../assets/obituary.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.titleContainer}>
        <View style={styles.titleBackground} />
        <MedievalText style={styles.title}>Ancestral</MedievalText>
        <MedievalText style={styles.title}>Hall of Sages</MedievalText>
      </View>
{/* 
      {artifacts.length === 4 && filteredUsers.length >= 1 &&
        userData.playerData.ArtifactsValidated === false &&
        userData.playerData.role === 'ACOLYTE' &&
        mortimerInside === true && (
          <View style={styles.bellButton}>
            <MapButton
              onPress={sendHallNotificationToMortimer}
              iconImage={require('../assets/bell_icon.png')}
            />
          </View>
        )} */}

      {artifacts.length === 4 && filteredUsers.length >= 1 &&
        userData.playerData.ArtifactsValidated === false &&
        userData.playerData.role === 'ACOLYTE' && 
        mortimerInside === false && (
          <View style={styles.bellButton}>
            <MapButton
              onPress={sendHallNotificationToMortimer}
              iconImage={require('../assets/bell_icon.png')}
            />
          </View>
        )}

      <View style={styles.circleContainer}>{renderUsersInCircle()}</View>
      {/* Botón para dar artefactos a Mortimer (ya existente) */}
      {artifacts.length === 4 && filteredUsers.length >= 1 &&
        userData.playerData.ArtifactsValidated === false &&
        userData.playerData.role === 'ACOLYTE' &&
        mortimerInside === true && (
          <TouchableOpacity onPress={giveArtifactsToMortimer} style={styles.artifactsButton}>
            <MedievalText style={styles.buttonText}>Give Artifacts to Mortimer</MedievalText>
          </TouchableOpacity>
        )}

      {/* NUEVO: Botón para llamar a Angelo (si está reducido pero no está presente) */}
      {userData.playerData.angeloReduced === true &&
        userData.playerData.role === 'ACOLYTE' &&
        filteredUsers.length >= 1 &&
        mortimerInside === false && (
          <View style={styles.bellButton}>
            <MapButton
              onPress={sendHallNotificationToMortimer}
              iconImage={require('../assets/bell_icon.png')}
            />
          </View>
        )}

      {/* NUEVO: Botón para entregar a Angelo a Mortimer (si ambos dentro y AngeloReduced = true) */}
      {userData.playerData.angeloReduced === true &&
        userData.playerData.role === 'ACOLYTE' &&
        isAngeloDelivered === false &&
        mortimerInside === true && (
          <TouchableOpacity onPress={deliverAngeloToMortimer} style={styles.artifactsButton}>
            <MedievalText style={styles.buttonText}>Deliver Angelo to Mortimer</MedievalText>
          </TouchableOpacity>
        )}

      <MapButton
        onPress={goToMap}
        iconImage={require('../assets/school_icon.png')}
      />

      {isAnimating && <AnimatedCircles />}
      {spinner && <Spinner message='Waiting for validation...' />}
      {isAnimatingMortimer && <InverseAnimatedCircles />}
      {isAnimatingFade && (
        <FadeInArtefacts
          onValidateSearch={handleValidateSearch}
          onRestartSearch={handleRestartSearch}
        />
      )}
      {userData.playerData.role === 'MORTIMER' &&
        <ValidateAngeloModal
        />}
      {userData.playerData.role === 'ACOLYTE' &&
        <AngeloValidationResultModal
          visible={angeloResultVisible}
          isSuccess={angeloIsSuccess}
          onClose={() => setAngeloResultVisible(false)}
        />
      }


    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
  },
  titleContainer: {
    position: 'absolute',
    top: 130,
    alignItems: 'center',
  },
  titleBackground: {
    top: -100,
    position: 'absolute',
    backgroundColor: 'rgba(128, 128, 128, 0.7)',
    width: 220,
    height: 130,
    borderRadius: 10,
  },
  title: {
    top: -100,
    fontSize: 33,
    paddingHorizontal: 10,
    paddingVertical: 25,
    textAlign: 'center',
    color: 'white',
  },
  bellButton: {
    position: 'absolute',
    top: height * 0.5,
    width: width * 0.2,
    height: height * 0.3,
    overflow: 'hidden',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
  circleContainer: {
    position: 'absolute',
    top: 300,
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    position: 'absolute',
  },
  artifactsButton: {
    backgroundColor: 'lightgrey',
    padding: 10,
    borderRadius: 10,
    position: 'absolute',
    bottom: '22%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
  },
});

export default HallOfSages;
