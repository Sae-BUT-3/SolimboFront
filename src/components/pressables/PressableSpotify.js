import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, Image} from 'react-native';
import { Colors } from '../../style/color';
import pressableBasicStyle from '../../style/pressableBasicStyle';
import commonStyles from '../../style/commonStyle';
import authStyle from '../../style/authStyle';
// import fonts from '../config/fonts';
import { Linking } from 'react-native';
import axiosInstance from '../../api/axiosInstance';


const PressableSpotify = ({ ...props }) => {
    const [isPressed, setIsPressed] = useState(false);
    const [spotifyAuthURL, setSpotifyAuthURL] = useState('');

    useEffect(() => {

        axiosInstance.get('/spotify/getAuthURL')
        .then((response) => {
            console.log("SpotifyURL",response.data)
            setSpotifyAuthURL(response.data)
        })
        .catch(error => {
            console.log("🚀 ~ file: App.js:33 ~ axios.get ~ error", error)
        });
        
    }, []);

    const handlePressIn = () => {
        setIsPressed(true);
    };

    const handlePressOut = () => {
        setIsPressed(false);
    };

    const handlePress = () => {
        Linking.openURL(spotifyAuthURL)
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