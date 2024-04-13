import React from 'react';
import { Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../../style/commonStyle';
import { Text } from 'react-native';
import { useEffect } from 'react';
import { Linking } from 'react-native';

function SpotifyAuthScreen({ navigation }) {
    useEffect(() => {
        const url = Linking.getInitialURL();
        handleOpenURL(url);
        Linking.addEventListener('url', handleOpenURL);
        return () => Linking.removeEventListener('url', handleOpenURL);
    }, []);
    
    const handleOpenURL = async (url) => {
        if (url) {
            const params = url.split('?')[1];
            const code = params.split('=')[1];
            // Votre logique pour gérer le code Spotify ici
            // Naviguer vers l'écran approprié en fonction de la logique
            navigation.navigate('ConfirmUser', { code });
        }
    };

    return (
        <SafeAreaView style={[commonStyles.safeAreaContainer ]}>
            <Text>Spotify Auth </Text>
            <Button title="Connexion" onPress={() => navigation.navigate('SignIn')} />
        </SafeAreaView>
    );
}

export default SpotifyAuthScreen;