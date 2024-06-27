import React, { useState } from 'react';
import { View, Text } from 'react-native';
import PressableBasic from '../../../components/pressables/PressableBasic';
import BasicInput from '../../../components/form/BasicInput';
import commonStyles from '../../../style/commonStyle';
import styles from './styles';
import { useTranslation } from 'react-i18next';

const ConfirmationCodeForm = ({ onSubmit, error }) => {
    const [code, setCode] = useState('');
    const { t } = useTranslation();
    const handleSubmit = () => {
        onSubmit(code);
    };

    return (
        <View style={commonStyles.columnCenterContainer} >
            <BasicInput
                placeholder={t("auth.entercode")}
                value={code}
                onChangeText={setCode}
                keyboardType="numeric"
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <PressableBasic text={t("auth.confirmcode")} onPress={handleSubmit} disabled={!code} />
        </View>
    );
};

export default ConfirmationCodeForm;