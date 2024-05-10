import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { Colors } from '../../style/color';
import modalStyle from '../../style/modalStyle';

const MultilineInput = ({...props }) => {
    const [focused, setFocused] = useState(false);

    const handleFocus = () => setFocused(true);
    const handleBlur = () => setFocused(false);

    return (
        <TextInput
            {...props}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor={Colors.BattleShipGray}
            style={[modalStyle.input, focused && modalStyle.inputFocused]}
            multiline={true}
            cursorColor={Colors.DarkSpringGreen}
        />
    );
};

export default MultilineInput;
