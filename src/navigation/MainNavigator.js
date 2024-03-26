import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../contexts/AuthContext";

import SignInScreen from "../screens/auth/SignInScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import SpotifyAuthScreen from "../screens/auth/SpotifyAuthScreen";
import ConfirmUserScreen from "../screens/auth/ConfirmUserScreen";

import TabNavigator from "./TabNavigator";

import { Colors } from "../style/color";
import { StyleSheet } from "react-native";

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
                <Stack.Screen name="TabNavigator" component={TabNavigator} />
            ) : (
                <> 
                    <Stack.Screen name="SignIn" component={SignInScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                    <Stack.Screen name="Spotify" component={SpotifyAuthScreen} />
                    <Stack.Screen name="ConfirmUser" component={ConfirmUserScreen} />
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
