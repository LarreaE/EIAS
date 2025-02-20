import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View, ScrollView, ImageBackground, Dimensions } from "react-native";
import MedievalText from "./MedievalText";

interface Props {
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    visible: boolean,
}

const { width, height } = Dimensions.get('window'); // Get device dimensions

const ScrollModal: React.FC<Props> = ({ visible, setVisible }) => {
    const [selectedCurse, setSelectedCurse] = useState<number | null>(null);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => setVisible(false)}
        >
            <ImageBackground
                source={require('../assets/scroll.webp')}
                style={styles.background}
                resizeMode="cover"
            >
                <View style={styles.modalView}>
                <MedievalText style={styles.title}>El Blindaje Épico</MedievalText>
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <MedievalText style={styles.description}>Este Pergamino recoge la historia de la leyenda de la armadura épica: un artefacto de brillo dorado necesario para acceder a la tumba Espectral, lugar donde residen los 4 jinetes</MedievalText>
                        <MedievalText style={styles.description}>La armadura se perdió en la segunda Era, pero se conservan aún manuales de cómo se llegó a forjar. Cada una de las piezas necesarias para su construcción descansa en una tumba del Obituario. El problema es que la entrada permanece sellada por el rosetón de los 4 artefactos arcanos necesarios para desbloquearla.</MedievalText>
                        <MedievalText style={styles.description}>Los artefactos se perdieron a lo largo de la ciénaga, pero poco más se sabe. El único material disponible es un viejo manuscrito con un mapa de la zona. Sin embargo, a excepción de unos símbolos extraños, no incluye detalles relevantes. Nadie ha logrado comprender sus significados, pero podrían indicar el paradero de los artefactos.</MedievalText>
                    </ScrollView>

                    <TouchableOpacity style={styles.closeButton} onPress={() => {
                        setVisible(false);
                    }}>
                        <MedievalText style={styles.buttonText}>Close</MedievalText>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </Modal>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: width * 0.9, // 90% of screen width
        height: height * 0.85, // 85% of screen height
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    scrollViewContent: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        
        color: 'black',
        textAlign: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        width: '100%',
    },
    description: {
        fontSize: 20,
        color: 'gray',
        textAlign: 'center',
        marginBottom: 20,
        flexWrap: 'wrap',
    },
    closeButton: {
        backgroundColor: '#2196F3',
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        width: '60%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        
        fontSize: 16,
    },
});

export default ScrollModal;
