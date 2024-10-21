import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View, ScrollView, ImageBackground, Dimensions } from "react-native";
import { Curses } from "../interfaces/Curse";

interface Props {
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    visible: boolean,
    curses: Curses[],
}

const { width, height } = Dimensions.get('window'); // Get device dimensions

const CookBookModal: React.FC<Props> = ({ visible, setVisible, curses }) => {
    const [index, setIndex] = useState(0);

    const nextIndex = () => {
        setIndex((prevIndex) => (prevIndex + 1) % curses.length);
    };

    const prevIndex = () => {
        setIndex((prevIndex) => (prevIndex - 1 + curses.length) % curses.length);
    };

    if (!curses[0]) {
        return <Text>Receiving Curses...</Text>;
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                setVisible(false);
            }}
        >
            <ImageBackground
                source={require('../assets/runa.png')}
                style={styles.background}
                resizeMode="cover"
            >
                <View style={styles.modalView}>
                    <ScrollView>
                        <View style={styles.contentContainer}>
                            <Text style={styles.title}>{curses[index].name}</Text>
                            <Text style={styles.description}>{curses[index].description}</Text>

                            <View style={styles.tableContainer}>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableHeader}>How to Inflict</Text>
                                    <Text style={styles.tableData}>{curses[index].poison_effects}</Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableHeader}>How to Cure</Text>
                                    <Text style={styles.tableData}>{curses[index].antidote_effects}</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={prevIndex}>
                            <Text style={styles.buttonText}>Back</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={nextIndex}>
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.closeButton} onPress={() => setVisible(false)}>
                        <Text style={styles.buttonText}>Close</Text>
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
        height: height * 0.8, // 80% of screen height
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    contentContainer: {
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 15,
    },
    description: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    tableContainer: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ffffff50',
        borderRadius: 10,
        padding: 10,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    tableHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFD700', // Gold color for headers
        textAlign: 'left',
    },
    tableData: {
        fontSize: 16,
        color: 'white',
        textAlign: 'right',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#2196F3',
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 10,
        width: '40%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    closeButton: {
        backgroundColor: '#2196F3',
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        width: '60%',
        alignItems: 'center',
    },
});

export default CookBookModal;
