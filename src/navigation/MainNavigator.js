import React, {useEffect, useState} from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../contexts/AuthContext";

import SignInScreen from "../screens/auth/SignInScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import ConfirmUserScreen from "../screens/auth/ConfirmUserScreen";

import TabNavigator from "./TabNavigator";

import { Colors } from "../style/color";
import {StyleSheet } from "react-native";
import SpotifyAuthScreen from "../screens/auth/SpotifyAuthScreen";
import ArtistScreen from "../screens/artist/ArtistScreen";
import CommentScreen from "../screens/comment/CommentScreen";
import ReviewScreen from "../screens/review/ReviewScreen";
import OeuvreScreen from "../screens/oeuvre/OeuvreScreen";
import DiscograpyScreen from "../screens/artist/DicographyScreen";
import ResponseScreen from "../screens/comment/ResponseScreen";
import ProfileScreen from "../screens/ProfileScreen";

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
                    <Stack.Screen  name="Artist" component={ArtistScreen}  options={{ title:'Artiste | Solimbo'}}/>
                    <Stack.Screen  name="Oeuvre" component={OeuvreScreen}  options={{ title:'Oeuvre | Solimbo'}}/>
                    <Stack.Screen name="Review" component={ReviewScreen}  options={{ title:'Critique | Solimbo'}}/>
                    <Stack.Screen name="Comment" component={CommentScreen}  options={{ title:'Commentaire | Solimbo'}} />
                    <Stack.Screen name="Discographie" component={DiscograpyScreen} options={{ title:'Discographie | Solimbo'}}/>
                    <Stack.Screen name="Response" component={ResponseScreen} options={{ title:'Répondre un commentaire | Solimbo'}}/>
                    <Stack.Screen name="user" component={ProfileScreen} options={{ title:'Utilisateur | Solimbo'}}/>
                </>
            ) : (
                <> 
                    <Stack.Screen name="SignIn" component={SignInScreen}  options={{ title:'Connexion | Solimbo'}}/>
                    <Stack.Screen name="SignUp" component={SignUpScreen}  options={{ title:'Inscription | Solimbo'}}/>
                    <Stack.Screen name="Spotify" component={SpotifyAuthScreen}  options={{ title: 'Connexion avec Spotify | Solimbo'}}/>
                    <Stack.Screen name="ConfirmUser" component={ConfirmUserScreen} options={{ title: 'Confirmation inscription | Solimbo'}}/>
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
