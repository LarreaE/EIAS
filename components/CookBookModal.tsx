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
    const [selectedCurse, setSelectedCurse] = useState<number | null>(null);

    if (!curses || curses.length === 0) {
        return <Text>Receiving Curses...</Text>;
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
                    <ScrollView>
                        {selectedCurse === null ? (
                            <View style={styles.listContainer}>
                                <Text style={styles.title}>Select a Curse</Text>
                                {curses.map((curse, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.curseButton}
                                        onPress={() => setSelectedCurse(index)}
                                    >
                                        <Text style={styles.curseButtonText}>{curse.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ) : (
                            <View style={styles.contentContainer}>
                                <Text style={styles.title}>{curses[selectedCurse].name}</Text>
                                <Text style={styles.description}>{curses[selectedCurse].description}</Text>

                                <View style={styles.tableContainer}>
                                    <View style={styles.tableRow}>
                                        <Text style={styles.tableHeader}>How to Inflict</Text>
                                        <Text style={styles.tableData}>{curses[selectedCurse].poison_effects}</Text>
                                    </View>
                                    <View style={styles.tableRow}>
                                        <Text style={styles.tableHeader}>How to Cure</Text>
                                        <Text style={styles.tableData}>{curses[selectedCurse].antidote_effects}</Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={styles.backButton}
                                    onPress={() => setSelectedCurse(null)}
                                >
                                    <Text style={styles.buttonText}>Back to List</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>

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
        height: height * 0.85, // 85% of screen height for better visibility
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    listContainer: {
        width: '100%',
        alignItems: 'center',
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
    curseButton: {
        backgroundColor: '#FFD700',
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
        width: '90%',
        alignItems: 'center',
    },
    curseButtonText: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
    },
    contentContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    tableContainer: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ffffff50',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
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
    backButton: {
        backgroundColor: '#2196F3',
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        width: '60%',
        alignItems: 'center',
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
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default CookBookModal;
