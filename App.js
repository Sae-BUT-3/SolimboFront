import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/contexts/AuthContext';
import MainNavigator from './src/navigation/MainNavigator';
import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import * as Linking from 'expo-linking';
import { Text } from 'react-native';
const prefix = Linking.createURL('/');
export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  // useEffect(() => {
  //   makeServer();

  //   // Nettoyez le serveur lorsque le composant est démonté
  //   return () => {
  //       shutdownServer();
  //   };
  // }, []);

  const linking = {
    prefixes: ["solimbo://"],
    config: {
      screens: {
        SignIn: 'signin',
        SignUp: 'signup',
        ConfirmUser: 'confirm-user',
        Spotify: 'spotify',
        User: 'user',
        Response: 'response',
        Discographie: 'discographie',
        Comment: 'comment',
        Review: 'review',
        Oeuvre: 'oeuvre',
        Artist: 'artist',
        navigate: {
          screens: {
            Search: 'search',
            Home: 'home',
            Activity: 'activity',
            Profile: 'profile',
          }
        }
      },
    },
  };

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'inter-regular': require('./src/assets/fonts/Inter-Regular.ttf'),
        'inter-bold': require('./src/assets/fonts/Inter-Bold.ttf'),
        'inter-medium': require('./src/assets/fonts/Inter-Medium.ttf'),
        'inter-light': require('./src/assets/fonts/Inter-Light.ttf'),
        'inter-thin': require('./src/assets/fonts/Inter-Thin.ttf'),
        'inter-extra-light': require('./src/assets/fonts/Inter-ExtraLight.ttf'),
        'inter-black': require('./src/assets/fonts/Inter-Black.ttf'),
        'inter-extra-bold': require('./src/assets/fonts/Inter-ExtraBold.ttf'),
        'inter-semi-bold': require('./src/assets/fonts/Inter-SemiBold.ttf'),
      });

      setFontsLoaded(true);
    };

    loadFonts();
  }, []);
  
  if (!fontsLoaded) {
    // Vous pouvez afficher un écran de chargement ici ou tout autre composant indiquant que les polices sont en cours de chargement.
    return null;
  }

 

  return (
    <AuthProvider>
      <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
        <MainNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}