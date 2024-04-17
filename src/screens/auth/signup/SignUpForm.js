import React, { useState } from 'react';
import { View, Text } from 'react-native';
import BasicInput from '../../../components/form/BasicInput';
import PressableBasic from '../../../components/pressables/PressableBasic';
import commonStyles from '../../../style/commonStyle';
import authStyle from '../../../style/authStyle';
import { Colors } from '../../../style/color';
import FontAwsome5 from 'react-native-vector-icons/FontAwesome5';


const SignupForm = ({ onSubmit, errors }) => {
    const [email, setEmail] = useState('fakoc53768@sentrau.com');
    const [password, setPassword] = useState('test123456');

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
                placeholder="Mot de passe"
                secureTextEntry
                value={password}
                onChangeText={(text) => setPassword(text)}
            />

            <>
                {errors && 
                    <View style={[commonStyles.row]}>
                    <FontAwsome5 name="exclamation-circle" size={18} color={Colors.CalPolyGreen} style={{ marginRight: 5 }} />
                    <Text style={[commonStyles.textError] }>
                        {errors}
                    </Text>
                </View>
                }
            </>
            <PressableBasic text="Confirmer" onPress={handleSubmit} />
        </View>
    );
};

export default SignupForm;