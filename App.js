import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/contexts/AuthContext';
import MainNavigator from './src/navigation/MainNavigator';
import * as Font from 'expo-font';
import * as Linking from 'expo-linking';
import { StyleSheet } from 'react-native';
import Loader from './src/components/common/Loader';

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

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
        Comment: {
          path: 'comment/:id',
          parse: {
            id: (id) => String(id),
          },
        },
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
    return <Loader />;
  }

  return (
    <AuthProvider>
      <NavigationContainer linking={linking} fallback={<Loader />}>
        <MainNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
