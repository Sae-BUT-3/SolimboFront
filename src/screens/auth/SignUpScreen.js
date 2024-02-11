import React from 'react';
import { View, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../../style/commonStyle';

function SignUpScreen({ navigation }) {

    return (
        <SafeAreaView style={[commonStyles.safeAreaContainer ]}>

            <Button title="Connexion" onPress={() => navigation.navigate('SignIn')} />
        </SafeAreaView>
    );
}

export default SignUpScreen;