import React from 'react';
import { View, Button, SafeAreaView } from 'react-native';
import commonStyles from '../../style/commonStyle';

function SignUpScreen({ navigation }) {
    return (
        <SafeAreaView style={[commonStyles.safeAreaContainer ]}>

            <Button title="Connexion" onPress={() => navigation.navigate('SignIn')} />
        </SafeAreaView>
    );
}

export default SignUpScreen;