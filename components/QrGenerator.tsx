import React from 'react';
import { View , StyleSheet} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QRGenerator = (data:any) => {
    console.log(data.decodedToken.email);

    return (
        <View style={styles.container}>
            <QRCode
            value={data.decodedToken.email}
            />
        </View>
      );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default QRGenerator;

