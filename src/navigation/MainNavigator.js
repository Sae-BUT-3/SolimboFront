import React, {useEffect, useState} from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../contexts/AuthContext";
import SignInScreen from "../screens/auth/SignInScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import TabNavigator from "./TabNavigator";
import { Colors } from "../style/color";
import {StyleSheet } from "react-native";
import SpotifyAuthScreen from "../screens/auth/SpotifyAuthScreen";
import ArtistScreen from "../screens/artist/ArtistScreen";

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
    
    const { isAuthenticated } = useAuth();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            {isAuthenticated ? ( // Vérifiez si l'utilisateur est authentifié
                <> 
                    <Stack.Screen name="TabNavigator" component={TabNavigator} />
                    <Stack.Screen name="Artist" component={ArtistScreen} />
                </>
            ) : (
                <> 
                    <Stack.Screen name="SignIn" component={SignInScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                    <Stack.Screen name="Spotify" component={SpotifyAuthScreen} />
                </>
            )}
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create(
    {
        container : {
            backgroundColor : Colors.Licorice,
        }
    }
) 

export default MainNavigator;
