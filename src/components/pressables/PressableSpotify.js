import React, { useState } from 'react';
import {Pressable, Text, Image} from 'react-native';
import pressableBasicStyle from '../../style/pressableBasicStyle';
import authStyle from '../../style/authStyle';

const PressableSpotify = ({ actionOnClick }) => {

    const [isPressed, setIsPressed] = useState(false);

    const handlePressIn = () => {
        setIsPressed(true);
    };

    const handlePressOut = () => {
        setIsPressed(false);
    };

    const handlePress = () => {
        actionOnClick()
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