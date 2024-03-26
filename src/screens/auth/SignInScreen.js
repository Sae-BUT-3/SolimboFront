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
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();
const scopes = [
    'user-read-private',
    'user-read-email',
    'user-library-read',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'user-follow-read',
    'user-follow-modify',
    'user-library-read',
    'user-library-modify',
    'user-top-read',
    'user-read-recently-played',
    'ugc-image-upload'
]
// Endpoint
const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

function SignInScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirectUri = makeRedirectUri({
    scheme: 'solimbo',
    preferLocalhost: true,
  });
  
  const [request, response, promptAsync] = useAuthRequest(
  {
      clientId: process.env.CLIENT_ID,
      scopes,
      usePKCE: false, // To follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      redirectUri,
  },
  discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      navigation.navigate('ConfirmUser', { code, redirectUri });
    }
}, [response]);

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
            <PressableBasic
            text="Se connecter"
            onPress={() => signIn(email, password)}
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
            <PressableSpotify 
            actionOnClick={promptAsync}
            />
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
