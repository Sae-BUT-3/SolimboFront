import React, { useState } from 'react';
import { View, Text } from 'react-native';
import BasicInput from '../../../components/form/BasicInput';
import PressableBasic from '../../../components/pressables/PressableBasic';
import commonStyles from '../../../style/commonStyle';
import authStyle from '../../../style/authStyle';
import { Colors } from '../../../style/color';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const SignupForm = ({ onSubmit, errors }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const t = useTranslation();

    const handleSubmit = () => {
        onSubmit({ email, password });
    };

    return (
        <View style={[commonStyles.columnCenterContainer, authStyle.formContainer]}>
            <BasicInput
                placeholder="Email"
                textContentType="emailAddress"
                keyboardType="email-address"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />

            <BasicInput
                placeholder={t("auth.password")}
                secureTextEntry
                value={password}
                onChangeText={(text) => setPassword(text)}
            />

            <>
                {errors && 
                    <View style={[commonStyles.row]}>
                    <FontAwesome5 name="exclamation-circle" size={18} color={Colors.CalPolyGreen} style={{ marginRight: 5 }} />
                    <Text style={[commonStyles.textError] }>
                        {errors}
                    </Text>
                </View>
                }
            </>
            <PressableBasic text={t("common.confirm")} onPress={handleSubmit} />
        </View>
    );
};

export default SignupForm;