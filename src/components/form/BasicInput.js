
import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import commonStyles from '../../style/commonStyle';
import { Colors } from '../../style/color';



const BasicInput = ({ label, ...props }) => {
    const [focused, setFocused] = useState(false);
    const [value, setValue] = useState('');
    
    const handleFocus = () => setFocused(true);
    const handleBlur = () => setFocused(false);
    const handleChangeText = (text) => setValue(text);
    
    return (
        <View>
            {/* <Text style={commonStyles.label}>{label}</Text> */}
            <TextInput
                {...props}
                value={value}
                onChangeText={handleChangeText}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholderTextColor={Colors.BattleShipGray}
                style={[commonStyles.input, focused && commonStyles.inputFocused]}
            />
        </View>
    );
};

export default BasicInput;