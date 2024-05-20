import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/contexts/AuthContext';
import MainNavigator from './src/navigation/MainNavigator';
import * as Font from 'expo-font';
import * as Linking from 'expo-linking';
import Loader from './src/components/common/Loader';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { Colors } from './src/style/color';

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const toastConfig = {
    success: (props) => (
        <BaseToast {...props} style={ {backgroundColor : Colors.Jet, borderLeftColor: Colors.SeaGreen} } text2Style={{color: Colors.White}} text1Style={{color: Colors.White}}/>
    ),
    error: (props) => (
      <ErrorToast
      {...props} style={{backgroundColor : Colors.Jet, borderLeftColor: Colors.Red}} text2Style={{color: Colors.White}} text1Style={{color: Colors.White}}/>
    ),
};

  const linking = {
    prefixes: [Linking.createURL('/'), 'solimbo://'],
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
        Setting: 'setting',
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
      try {
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
      } catch (error) {
        console.error('Error loading fonts', error);
      }
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <Loader/>
    );
  }

  return (
    <AuthProvider>
      <NavigationContainer linking={linking} fallback={<Loader/>}>
        <MainNavigator />        
        <Toast config={toastConfig} />
      </NavigationContainer>
    </AuthProvider>
  );
};


export default App;
