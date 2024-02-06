import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, Image} from 'react-native';
import { Colors } from '../../style/color';
import pressableBasicStyle from '../../style/pressableBasicStyle';
import commonStyles from '../../style/commonStyle';
// import fonts from '../config/fonts';

/**
 * A basic pressable component.
 */
const PressableBasic = ({ label, ...props }) => {
    const [isPressed, setIsPressed] = useState(false);

    const handlePressIn = () => {
        setIsPressed(true);
    };

    const handlePressOut = () => {
        setIsPressed(false);
    };

    const handlePress = () => {
        props.onPress();
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

        <Text style={pressableBasicStyle.button_text}>{props.text}</Text>
        
        </Pressable>
    );
}

export default PressableBasic;