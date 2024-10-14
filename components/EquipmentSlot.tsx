import { Text, View, Image } from "react-native";

interface Slot {
    imagePath: String;
    height: number;
    width: number;
    postionX: number;
    positionY: number;
}

const EquipmentSlot: React.FC<Slot> = ({imagePath}) => {

    return (
        <View>
            <Image
            source={imagePath}  // Ruta de la imagen de fondo
            resizeMode="cover"     
            >
                
            </Image>
        </View>
    );

};

export default EquipmentSlot;
