import React, {useEffect, useState} from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../contexts/AuthContext";

import SignInScreen from "../screens/auth/SignInScreen";
import SignUpScreen from "../screens/auth/signup/SignUpScreen";
import SpotifyAuthScreen from "../screens/auth/SpotifyAuthScreen";
import ConfirmUserScreen from "../screens/auth/ConfirmUserScreen";

import TabNavigator from "./TabNavigator";

import { Colors } from "../style/color";
import {StyleSheet } from "react-native";
import ArtistScreen from "../screens/artist/ArtistScreen";
import CommentScreen from "../screens/comment/CommentScreen";
import ReviewScreen from "../screens/review/ReviewScreen";
import OeuvreScreen from "../screens/oeuvre/OeuvreScreen";
import DiscograpyScreen from "../screens/artist/DicographyScreen";
import ResponseScreen from "../screens/comment/ResponseScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ModifyProfile from "../components/profile/Modify/ModifyProfile";
const Stack = createNativeStackNavigator();

const MainNavigator = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName={isAuthenticated ? "navigate" : "signin"}
        >
            <Stack.Screen name="navigate" component={TabNavigator} />
            <Stack.Screen  name="artist" component={ArtistScreen}  options={{ title:'Artiste | Solimbo'}}/>
            <Stack.Screen  name="oeuvre" component={OeuvreScreen}  options={{ title:'Oeuvre | Solimbo'}}/>
            <Stack.Screen name="review" component={ReviewScreen}  options={{ title:'Critique | Solimbo'}}/>
            <Stack.Screen name="comment" component={CommentScreen}  options={{ title:'Commentaire | Solimbo'}} />
            <Stack.Screen name="discographie" component={DiscograpyScreen} options={{ title:'Discographie | Solimbo'}}/>
            <Stack.Screen name="response" component={ResponseScreen} options={{ title:'Répondre un commentaire | Solimbo'}}/>
            <Stack.Screen name="user" component={ProfileScreen} options={{ title:'Utilisateur | Solimbo'}}/>
            <Stack.Screen name="signin" component={SignInScreen}  options={{ title:'Connexion | Solimbo'}}/>
            <Stack.Screen name="signup" component={SignUpScreen}  options={{ title:'Inscription | Solimbo'}}/>
            <Stack.Screen name="spotify" component={SpotifyAuthScreen}  options={{ title: 'Connexion avec Spotify | Solimbo'}}/>
            <Stack.Screen name="confirm-user" component={ConfirmUserScreen} options={{ title: 'Confirmation inscription | Solimbo'}}/>
            <Stack.Screen name="setting" component={ModifyProfile} options={{ title: 'Paramètres | Solimbo'}}/>
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
