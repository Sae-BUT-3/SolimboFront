import React, { useState } from 'react';
import { View, Text } from 'react-native';
import PressableBasic from '../../../components/pressables/PressableBasic';
import BasicInput from '../../../components/form/BasicInput';
import commonStyles from '../../../style/commonStyle';

const ConfirmationCodeForm = ({ onSubmit, error }) => {
    const [code, setCode] = useState('');

    const handleSubmit = () => {
        onSubmit(code);
    };

    return (
        <View style={commonStyles.columnCenterContainer} >
            <BasicInput
                placeholder="Enter code"
                value={code}
                onChangeText={setCode}
                keyboardType="numeric"
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <PressableBasic text="Confirmer le code" onPress={handleSubmit} disabled={!code} />
        </View>
    );
};

export default ConfirmationCodeForm;