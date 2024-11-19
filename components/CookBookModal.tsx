import React, { useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View, ScrollView, ImageBackground, Dimensions, Image } from "react-native";
import { Curses } from "../interfaces/Curse";
import MedievalText from "./MedievalText";


interface Props {
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    visible: boolean,
    curses: Curses[],
}

const { width, height } = Dimensions.get('window'); // Get device dimensions

const CookBookModal: React.FC<Props> = ({ visible, setVisible, curses }) => {
    const [selectedCurse, setSelectedCurse] = useState<number | null>(null);

    if (!curses || curses.length === 0) {
        return <MedievalText>Receiving Curses...</MedievalText>;
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => setVisible(false)}
        >
            <ImageBackground
                source={require('../assets/runa.png')}
                style={styles.background}
                resizeMode="cover"
            >
                <View style={styles.modalView}>
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        {selectedCurse === null ? (
                            <View style={styles.listContainer}>
                                <MedievalText style={styles.title}>Select a Curse</MedievalText>
                                {curses.map((curse, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.curseButton}
                                        onPress={() => setSelectedCurse(index)}
                                    >
                                        <MedievalText style={styles.curseButtonMedievalText}>{curse.name}</MedievalText>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ) : (
                            <View style={styles.contentContainer}>
                                <MedievalText style={styles.title}>{curses[selectedCurse].name}</MedievalText>
                                <MedievalText style={styles.description}>{curses[selectedCurse].description}</MedievalText>

                                <View style={styles.tableContainer}>
                                    <View style={styles.tableRow}>
                                        <MedievalText style={styles.tableHeader}>How to Inflict</MedievalText>
                                        {curses[selectedCurse].poison_effects.map((effect) => (
                                        <TouchableOpacity
                                            key={effect}
                                            style={styles.tableRow}
                                        >
                                            <MedievalText style={styles.tableData}>{effect}</MedievalText>
                                        </TouchableOpacity>
                                        ))}
                                    </View>
                                    <View style={styles.tableRow}>
                                        <MedievalText style={styles.tableHeader}>How to Cure</MedievalText>
                                        {curses[selectedCurse].antidote_effects.map((effect) => (
                                        <TouchableOpacity
                                            key={effect}
                                            style={styles.tableRow}
                                        >
                                            <MedievalText style={styles.tableData}>{effect}</MedievalText>
                                        </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={styles.backButton}
                                    onPress={() => setSelectedCurse(null)}
                                >
                                    <MedievalText style={styles.buttonMedievalText}>Back to List</MedievalText>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>

                    <TouchableOpacity style={styles.closeButton} onPress={() => {
                        setVisible(false);
                        setSelectedCurse(null);
                    }}>
                       <View style={styles.buttonContent}>
                            <Image
                            source={require('../assets/boton.png')} // Ruta al archivo de imagen
                            style={styles.buttonImage} // Estilo para la imagen del botón
                            resizeMode="contain" // Ajusta cómo se muestra la imagen
                            />
                            <MedievalText fontSize={16} color="#ffffff" style={styles.buttonText}>
                            Close
                            </MedievalText>
                        </View>
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
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    scrollViewContent: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContainer: {
        width: '100%',
        alignItems: 'center',
        flexWrap: 'wrap', // Flexwrap for curses list
    },
    title: {
        top:10,
        fontSize: 28,
        color: 'white',
        textAlign: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        width: '100%',
    },
    description: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
        flexWrap: 'wrap',
    },
    curseButton: {
        backgroundColor: 'lightgrey',
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
        width: '90%',
        alignItems: 'center',
    },
    curseButtonMedievalText: {
        fontSize: 18,
        color: '#000',
    },
    contentContainer: {
        width: '100%',
    },
    tableContainer: {
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)', // Slightly transparent white border
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        flexWrap: 'wrap', // Ensure table rows wrap
        width: '100%',
    },
    tableHeader: {
        fontSize: 18,
        color: '#FFD700',
        flexWrap: 'wrap', // Ensure long MedievalText in headers wraps
        width: '100%',
        textAlign: 'center',
    },
    tableData: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        alignContent: 'center',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        backgroundColor: '#A196F3',
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',

    },
    closeButton: {
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        width: '100%',
        height: '10%',
        alignItems: 'center',
    },
    buttonMedievalText: {
        color: 'white',
        fontSize: 16,
    },
    buttonContent: {
        width: '100%',
        height: '250%',
        bottom:'10%',
      },
      buttonImage: {
        width: '100%',
        height: '100%',
        resizeMode:'cover',
      },
      buttonText: {
        textAlign: 'center',
        bottom:'60%',
      },
});

export default CookBookModal;
