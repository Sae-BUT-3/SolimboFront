import React, { useState }from 'react';
import { View, Text, Image, Platform, StyleSheet } from 'react-native';
import PressableBasic from '../../components/pressables/PressableBasic';
import { useAuth } from '../../contexts/AuthContext';
import commonStyles from '../../style/commonStyle';
import authStyle from '../../style/authStyle';
import { SafeAreaView } from 'react-native-safe-area-context';
import BasicInput from '../../components/form/BasicInput';
import PressableSpotify from '../../components/pressables/PressableSpotify';
import { useLinkTo } from '@react-navigation/native';
import { Snackbar } from 'react-native-paper';

function SignInScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const linkTo = useLinkTo();

  const handleSignIn = () => {
    const credentials = {
      email: email,
      password: password,
    };
    const res = signIn(credentials);
    setError(res)
  };
  const handleClose = () => {
    setError(null);
  };

  return (
    <SafeAreaView style={[commonStyles.safeAreaContainer, {justifyContent : 'normal'} ]}>
        
        <View style={[commonStyles.columnCenterContainer, authStyle.formContainer]}>
          <View style={commonStyles.columnCenterContainer}>
            <Image
                source={require('../../assets/images/main_logo_no_bg.png')}
                style={commonStyles.logo}
            />
          </View>
          <View style={commonStyles.columnCenterContainer}>

            <BasicInput
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Entrez votre email"
              textContentType="emailAddress"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <BasicInput
              placeholder="Entrez votre mot de passe"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <View style={commonStyles.columnCenterContainer}>
            <PressableBasic
            text="Connexion"

            onPress={handleSignIn}
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
        {error && (
            <Snackbar
              visible={error !== null}
              onDismiss={handleClose}
              action={{
                  label: 'Fermer',
                  onPress: handleClose
              }}
              duration={Snackbar.DURATION_LONG}
              elevation={3}
              style={{width: Platform.OS == 'web' ? 500 : 400}}
            >
              {error}
            </Snackbar>
        )}
    </SafeAreaView>
  );
}

export default SignInScreen;
