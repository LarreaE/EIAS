import React, {useState, useEffect} from 'react';
import {SafeAreaView, Text, StyleSheet} from 'react-native';
import SplashScreen from './components/splashScreen.tsx';  // Importar SplashScreen

function App(): React.JSX.Element {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 3000); // 3 segundos

    return () => clearTimeout(timer);
  }, []);

  if (isSplashVisible) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>Your main app content goes here.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
