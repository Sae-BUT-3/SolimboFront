import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/contexts/AuthContext';
import MainNavigator from './src/navigation/MainNavigator';
import { shutdownServer, makeServer } from './src/mirage/config';
import axiosInstance from './src/api/axiosInstance';
import { useEffect, useState } from 'react';

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

  return (
    <AuthProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}