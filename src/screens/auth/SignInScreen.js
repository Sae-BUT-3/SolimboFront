import React from 'react';
import { View, Text, Image } from 'react-native';
import PressableBasic from '../../components/pressables/PressableBasic';
import { useAuth } from '../../contexts/AuthContext';
import commonStyles from '../../style/commonStyle';
import authStyle from '../../style/authStyle';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BasicInput from '../../components/form/BasicInput';
import PressableSpotify from '../../components/pressables/PressableSpotify';
import { useLinkTo } from '@react-navigation/native';

function SignInScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const linkTo = useLinkTo();

  console.log('linkTo', linkTo); 

  return (
    <SafeAreaView style={[commonStyles.safeAreaContainer ]}>
        
        <View style={[commonStyles.columnCenterContainer, authStyle.formContainer]}>
          <View style={commonStyles.columnCenterContainer}>
            <Image
                source={require('../../assets/images/main_logo_no_bg.png')}
                style={commonStyles.logo}
            />
          </View>
          <View style={commonStyles.columnCenterContainer}>

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
          <View style={commonStyles.columnCenterContainer}>
            <PressableBasic
            text="Connexion"

            onPress={() => signIn({ email, password })}
            />
            <Text style={authStyle.textPasswordForgot}>Mot de passe oublié ? </Text>
          </View>

          <View style={authStyle.lineContainer} >
            <View
              style={authStyle.line}
            />
            <Text style={[commonStyles.text, authStyle.textOr ]}>OU</Text>
            <View
              style={authStyle.line}
            />
          </View>

          <View style={commonStyles.columnCenterContainer}>
            <PressableSpotify />
          </View>

        </View>

        <View style={commonStyles.row} >
          <Text style={[commonStyles.text, authStyle.noAccount]}>Pas encore de compte ? </Text>
          <Text style={commonStyles.textLink} 
            onPress={() => navigation.navigate('SignUp')}
          >S'inscire</Text>
        </View> 
    </SafeAreaView>
  );
}

export default SignInScreen;
