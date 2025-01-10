// components/MedievalText.tsx

import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';

interface MedievalTextProps extends TextProps {
  fontSize?: number; // Prop para especificar el tamaño de la fuente
  color?: string;     // Prop para especificar el color del texto
  style?: TextStyle;
}

const MedievalText: React.FC<MedievalTextProps> = ({ fontSize, color, style, children, ...props }) => {
  return (
    <Text
      style={[
        styles.medievalText,
        {
          fontSize: fontSize || 18, // Tamaño de fuente predeterminado es 18
          color: color || '#000000', // Color predeterminado es negro
        },
        style, // Permite añadir estilos adicionales o sobreescribir los existentes
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  medievalText: {
    fontFamily: 'MedievalSharp-Regular',

  },
});

export default MedievalText;
