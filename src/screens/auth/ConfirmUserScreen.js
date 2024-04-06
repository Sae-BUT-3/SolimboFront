import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, View } from 'react-native';
import commonStyles from '../../style/commonStyle';
import axiosInstance from '../../api/axiosInstance';
import PressableBasic from '../../components/pressables/PressableBasic';
import BasicInput from '../../components/form/BasicInput';
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../style/color';
import FontAwsome5 from 'react-native-vector-icons/FontAwesome5';

function ConfirmUserScreen({ route, navigation }) {
    const [confirmtoken, setConfirmtoken] = useState('');
    const [user, setUser] = useState({});
    const { code, redirectUri } = route.params;
    const [pseudo, setPseudo] = useState('');
    const [isCheckingPseudo, setIsCheckingPseudo] = useState(false);
    const [isPseudoAvailable, setIsPseudoAvailable] = useState(true);
    const [pseudoCheckTimeout, setPseudoCheckTimeout] = useState(null);

    const { signInViaToken } = useAuth();

    useEffect(() => {
        axiosInstance.post('/users/authWithSpotify', {
            spotify_code: code,
            callback: redirectUri,
        })
        .then((response) => {
            console.log('authWithSpotify', response.data);
            if (response.data.confirmToken) {
                setConfirmtoken(response.data.confirmToken);
            } else if (response.data.token) {
                signInViaToken(response.data.token);
            } else {
                console.log('Erreur lors de la connexion de l utilisateur');
            }
        })
        .catch((error) =>
            console.log('error /users/authWithSpotify' + error, JSON.stringify(error))
        );
    }, []);
    
    useEffect(() => {
    if (confirmtoken) {
        axiosInstance
        .get('/users/getUserByConfirmToken?confirmToken=' + confirmtoken)
        .then((response) => {
            setUser(response.data);
            console.log('response /users/getUserByConfirmToken', response.data);
        })
        .catch((error) =>
            console.log(
            'error /users/getUserByConfirmToken',
            JSON.stringify(error)
            )
        );
    }
    }, [confirmtoken]);

    const checkPseudoAvailability = async (pseudo) => {
        console.log('checkPseudoAvailability', pseudo);
        setIsCheckingPseudo(true);
        try {
            const response = await axiosInstance.get(`/users/isUser?pseudo=${pseudo}`);
            setIsPseudoAvailable(!response.data.isUser);
        } catch (error) {
            // console.error('Erreur lors de la vérification de la disponibilité du pseudo', error);
        } finally {
            setIsCheckingPseudo(false);
        }
    };
    
    const handlePseudoChange = (newPseudo) => {
        setPseudo(newPseudo);
        clearTimeout(pseudoCheckTimeout);
        setIsPseudoAvailable(true);
        setPseudoCheckTimeout(setTimeout(() => checkPseudoAvailability(newPseudo), 500));
    };    

    const handleConfirmUser = async () => {
        if (isPseudoAvailable && pseudo.trim() !== '') {
            try {
                const userData = {
                    pseudo: pseudo.trim(),
                    alias: user.alias || pseudo.trim(),
                    bio: '',
                    confirmToken: confirmtoken
                };

                axiosInstance.post('/users/confirmUser', userData)
                .then((response) => {
                    console.log('confirmUser', response.data);
                    if (response.data.token) {
                        signInViaToken(response.data.token);
                    } else {
                        console.log('Erreur lors de la connexion post-inscription de l utilisateur');
                        navigation.navigate('SignIn');
                    }
                })
                .catch((error) =>
                    console.log('error /users/authWithSpotify')
                );

            } catch (error) {
                console.error('Erreur lors de la confirmation de l utilisateur', error);
            }
        } else {
            console.log('Veuillez saisir un pseudo disponible');
        }
    };

    return (
        <SafeAreaView style={[commonStyles.safeAreaContainer]}>
            {user ? (
                <View style={[commonStyles.columnCenterContainer]}>
                <View style={[commonStyles.centerW50percent]}>
                    <View style={[commonStyles.row]}>
                        <Text style={[commonStyles.text]}>Indiquez votre pseudo</Text>
                    </View>
                    <View style={[commonStyles.row]}>
                        <BasicInput
                            placeholder="Pseudo"
                            value={pseudo}
                            onChangeText={handlePseudoChange}
                        />
                    </View>
                    {isCheckingPseudo ? (
                    <Text>Vérification de la disponibilité du pseudo...</Text>
                    ) : isPseudoAvailable ? (
                        <Text style={{ color: 'red' }}></Text>
                    ) : 
                    <>
                        <View style={[commonStyles.row]}>
                            <FontAwsome5 name="exclamation-circle" size={18} color={Colors.CalPolyGreen} style={{ marginRight: 5 }} />
                            <Text style={[commonStyles.textError] }>
                                Ce pseudo est déjà pris
                            </Text>
                        </View>
                    </>
                    }
                    <PressableBasic
                        text="Continuer"
                        onPress={handleConfirmUser}
                    />
                </View>
                </View>
            ) : (
                <Text>Loading...</Text>
            )}
            </SafeAreaView>
        );
}

export default ConfirmUserScreen;