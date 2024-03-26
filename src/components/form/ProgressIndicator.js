
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../style/color';

const ProgressIndicator = ({isActive, isCompleted}) => {
    return (
        <View style={[styles.progressIndicator, isActive && styles.isActive  , isCompleted && styles.isCompleted]} />
    );
}

const styles = StyleSheet.create({
    progressIndicator: {
        width: 70,
        height: 10,
        marginHorizontal : 5,
        borderRadius: 30,
        backgroundColor: Colors.Jet,
    },
    isCompleted: {
        backgroundColor: Colors.CalPolyGreen,
    },
    isActive: {
        backgroundColor: Colors.DarkSpringGreen,
    },
});

export default ProgressIndicator;