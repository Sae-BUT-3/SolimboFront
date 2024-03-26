import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import commonStyles from '../../style/commonStyle';
import { Colors } from '../../style/color';

const BasicInput = ({ value, onChangeText, ...props }) => {
    const [focused, setFocused] = useState(false);

    const handleFocus = () => setFocused(true);
    const handleBlur = () => setFocused(false);

    return (
        <View>
            <TextInput
                {...props}
                value={value}
                onChangeText={onChangeText}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholderTextColor={Colors.BattleShipGray}
                style={[commonStyles.input, focused && commonStyles.inputFocused]}
            />
        </View>
    );
};

export default BasicInput;
