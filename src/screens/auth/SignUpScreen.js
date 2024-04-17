import React from 'react';
import { View, Button } from 'react-native';
import commonStyles from '../../style/commonStyle';
import { SafeAreaView } from 'react-native-safe-area-context';

function SignUpScreen({ navigation }) {
    return (
        <SafeAreaView style={[commonStyles.safeAreaContainer ]}>

            <Button title="Connexion" onPress={() => navigation.navigate('SignIn')} />
        </SafeAreaView>
    );
}

export default SignUpScreen;