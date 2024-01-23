import React, { useState } from 'react';
import { Pressable, StyleSheet, Text} from 'react-native';
import { Colors } from '../style/color';
import pressableBasicStyle from '../style/pressableBasicStyle';
// import fonts from '../config/fonts';

/**
 * A basic pressable component.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.isPressed - Indicates whether the component is currently pressed.
 * @param {Function} props.onPress - The function to be called when the component is pressed.
 * @param {Object} props.style - The style object to be applied to the component.
 * @param {string} props.text - The text to be displayed inside the component.
 * @returns {JSX.Element} The rendered pressable component.
 */
function PressableBasic(props) {
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