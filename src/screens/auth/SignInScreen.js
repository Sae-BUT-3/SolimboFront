import React from 'react';
import { View, Button, TextInput, Text } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

function SignInScreen({ navigation }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { signIn } = useAuth();

  return (
    <View>
        <Text>Email</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          defaultValue="user@gmail.com"
          textContentType="emailAddress"
        />
      <Text>Password</Text>
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        defaultValue="testpassword"
      />
      <Button title="Sign in" onPress={() => signIn({ email, password })} />
      <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />
    </View>
  );
}

export default SignInScreen;
