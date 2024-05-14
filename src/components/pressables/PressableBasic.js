import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Colors } from '../../style/color';
import pressableBasicStyle from '../../style/pressableBasicStyle';
import commonStyles from '../../style/commonStyle';

/**
 * A basic pressable component.
 */
const PressableBasic = ({ label, loading, ...props }) => {
    const [isPressed, setIsPressed] = useState(false);
    const disabled = props.disabled || false;

    const handlePressIn = () => {
        setIsPressed(true);
    };

    const handlePressOut = () => {
        setIsPressed(false);
    };

    const handlePress = () => {
        if (disabled || loading) {
            return;
        }
        props.onPress();
    }

    return (
        <Pressable
            style={[
                pressableBasicStyle.button,
                isPressed && pressableBasicStyle.buttonPressed,
                disabled && pressableBasicStyle.buttonDisabled
            ]}
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={Colors.primary} />
            ) : (
                <Text style={pressableBasicStyle.button_text}>{props.text}</Text>
            )}
        </Pressable>
    );
}

export default PressableBasic;