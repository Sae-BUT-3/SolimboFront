import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/contexts/AuthContext';
import MainNavigator from './src/navigation/MainNavigator';
import { shutdownServer, makeServer } from './src/mirage/config';
import axiosInstance from './src/api/axiosInstance';
import { useEffect, useState } from 'react';
import * as Font from 'expo-font';

export default function App() {
  
  // useEffect(() => {
  //   makeServer();

  //   // Nettoyez le serveur lorsque le composant est démonté
  //   return () => {
  //       shutdownServer();
  //   };
  // }, []);

  useEffect(() => {
    
    axiosInstance.get('/spotify/getAuthURL')
      .then((response) => {
        console.log(response.data)
        return response.data
      })
      .catch(error => {
        console.log("🚀 ~ file: App.js:33 ~ axios.get ~ error", error)
      });
      

  }, []);

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
    };

    loadFonts();
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}