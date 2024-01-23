import React from 'react';
import { View, TextInput, Text, Image } from 'react-native';
import PressableBasic from '../../components/PressableBasic';
import { useAuth } from '../../contexts/AuthContext';
import commonStyles from '../../style/commonStyle';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { useState, useEffect } from 'react';
import { Colors } from '../../style/color';
import { SafeAreaView } from 'react-native-safe-area-context';
import BasicInput from '../../components/form/BasicInput';

function SignInScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={commonStyles.container}>
        <Image
            source={require('../../assets/images/main_logo_no_bg.png')}
            style={commonStyles.logo}
        />
        
        <View style={commonStyles.inputsContainer}>
          <BasicInput
            placeholder="Email"
            textContentType="emailAddress"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

          <BasicInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <PressableBasic
          text="Connexion"
          onPress={() => signIn({ email, password })}
        />
      {/* <PressableBasic 
        text="Inscription" 
        onPress={() => navigation.navigate('SignUp')}
      /> */}
    </SafeAreaView>
  );
}

export default SignInScreen;
