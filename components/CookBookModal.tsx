import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { Curses } from "../interfaces/Curse";

interface Props {
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    visible: boolean,
    curses: Curses[],
}
const CookBookModal: React.FC<Props> = ({visible,setVisible}) => {

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                setVisible(false);
            }}
        >
            <ScrollView>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setVisible(false)}
                    >
                      <Text>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
            </ScrollView>

              </Modal>
    );

};


const styles = StyleSheet.create({
container: {
    flex: 1,
},
background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},
openButton: {
    padding: 10,
    borderRadius: 10,
    width: 66,
    height: 66,
    alignItems: 'center',
},
textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
},
centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalView: {
    width: 300,
    height: 300,
    margin: 20,
    borderRadius: 20,
    padding: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
},
modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
},
closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
},
image: {
    width: '40%',
    height: '40%',
    color: 'black',
},
cookBookButton: {
    position: 'absolute',
    top: 50,
    left: 40,
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
},
filterModalView: {
    width: '110%',
    maxHeight: '80%',
    padding: 20,
},
scrollView: {
    height:300,
},
});

export default CookBookModal;
