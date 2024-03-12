import React, { useState, useEffect }from 'react';
import { View, Text, Image } from 'react-native';
import PressableBasic from '../../components/pressables/PressableBasic';
import { useAuth } from '../../contexts/AuthContext';
import commonStyles from '../../style/commonStyle';
import authStyle from '../../style/authStyle';
import { SafeAreaView } from 'react-native-safe-area-context';
import BasicInput from '../../components/form/BasicInput';
import PressableSpotify from '../../components/pressables/PressableSpotify';
import Alert from '@mui/material/Alert';
import { useLinkTo } from '@react-navigation/native';

function SignInScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  navigation.setOptions({ title: 'Solimbo - Connexion' })
  const linkTo = useLinkTo();

  console.log('linkTo', linkTo); 
  const handleSignIn = () => {
    const credentials = {
      email: email,
      password: password,
    };
    const res = signIn(credentials);
    res.success ? setResponse(res.message) : setError(res.message)
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
        <View style={{ bottom: 0, padding: 2, position: 'fixed', margin:10, right:0 }}>
        {response ? <Alert severity="success"  onClose={() => {setResponse(null)}}>{response}</Alert> : null}
        {error ? <Alert severity="error"  onClose={() => {setError(null)}}>{error}</Alert> : null}
      </View> 
    </SafeAreaView>
  );
}

export default SignInScreen;
