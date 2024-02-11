import React, { useState, useEffect } from 'react';
import {Pressable, Text, Image, Platform} from 'react-native';
import pressableBasicStyle from '../../style/pressableBasicStyle';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import authStyle from '../../style/authStyle';
import axiosInstance from '../../api/axiosInstance';
WebBrowser.maybeCompleteAuthSession();
const scopes = [
    'user-read-private',
    'user-read-email',
    'user-library-read',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'user-follow-read',
    'user-follow-modify',
    'user-library-read',
    'user-library-modify',
    'user-top-read',
    'user-read-recently-played',
    'ugc-image-upload'
]
// Endpoint
const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const PressableSpotify = ({ ...props }) => {
    const redirectUri = makeRedirectUri({
            scheme: 'solimbo://',
            preferLocalhost: true,
    })
    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: process.env.CLIENT_ID,
            scopes,
            // To follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
            // this must be set to false
            usePKCE: false,
            redirectUri
        },
        discovery
    );


    const [isPressed, setIsPressed] = useState(false);
    useEffect(() => {
        if (response?.type === 'success') {
            const { code } = response.params;
            axiosInstance.post("/users/authWithSpotify", {
                spotify_code: code,
                callback: redirectUri
            }).then(response => {
                console.log(response.data)
                console.log(response.data.confirmToken)
                if(response.data.confirmToken) {
                    //confirm
                }
                else {
                    //response.data.token
                    //login
                }
            }).catch(error => console.log("error /users/authWithSpotify",JSON.stringify(error)))
        }
    }, [response]);

    const handlePressIn = () => {
        setIsPressed(true);
    };

    const handlePressOut = () => {
        setIsPressed(false);
    };

    const handlePress = () => {
        promptAsync()
    }

    return (
        <Pressable
        style={[
            pressableBasicStyle.button,
            isPressed && pressableBasicStyle.buttonPressed,
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        >

        <Image
            source={require('../../assets/images/spotify-icon-2048x2048.png')}
            style={authStyle.spotifyLogo}
        />

        <Text style={pressableBasicStyle.button_text}>Se connecter avec Spotify</Text>
        
        </Pressable>
    );
}

export default PressableSpotify;