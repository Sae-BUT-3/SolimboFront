import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import commonStyles from '../../style/commonStyle';
import { Colors } from '../../style/color';
import modalStyle from '../../style/modalStyle';

const MultilineInput = ({ value, onChangeText, ...props }) => {
    const [focused, setFocused] = useState(false);

    const handleFocus = () => setFocused(true);
    const handleBlur = () => setFocused(false);

    return (
        <TextInput
            {...props}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor={Colors.BattleShipGray}
            style={[modalStyle.input, focused && modalStyle.inputFocused]}
            multiline={true}
            numberOfLines={4}
        />
    );
};

export default MultilineInput;
