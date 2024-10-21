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
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
                                        {curses[selectedCurse].poison_effects.map((effect) => (
                                        <TouchableOpacity
                                            key={effect}
                                        >
                                            <Text style={styles.tableData}>{effect}</Text>
                                        </TouchableOpacity>
                                        ))}
                                    </View>
                                    <View style={styles.tableRow}>
                                        <Text style={styles.tableHeader}>How to Cure</Text>
                                        {curses[selectedCurse].antidote_effects.map((effect) => (
                                        <TouchableOpacity
                                            key={effect}
                                        >
                                            <Text style={styles.tableData}>{effect}</Text>
                                        </TouchableOpacity>
                                        ))}
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

                    <TouchableOpacity style={styles.closeButton} onPress={() => {
                        setVisible(false);
                        setSelectedCurse(null);
                    }}>
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
        height: height * 0.85, // 85% of screen height
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
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
    },
    tableHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFD700',
        textAlign: 'left',
        flex: 1,
        flexWrap: 'wrap', // Ensure long text in headers wraps
    },
    tableData: {
        fontSize: 16,
        color: 'white',
        flex: 1,
        width: '100%',
        flexWrap: 'wrap', // Ensure long text in headers wraps
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
