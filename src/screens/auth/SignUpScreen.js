import React from 'react';
import { View, Button } from 'react-native';

function SignUpScreen({ navigation }) {

    return <View>

        <Button title="Sign In" onPress={() => navigation.navigate('SignIn')} />
        <Button title="Sign Up" onPress={() => alert('todo!')} />
    </View>
}

export default SignUpScreen;