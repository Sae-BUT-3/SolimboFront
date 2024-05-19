import React, { useState } from 'react';
import { View, Text, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SignupForm from './SignUpForm';
import ProfileSetUpForm from './ProfileSetupForm';
import ConfirmationCodeForm from './ConfirmationCodeForm';

import axiosInstance from '../../../api/axiosInstance';

import commonStyles from '../../../style/commonStyle';
import authStyle from '../../../style/authStyle';

import ProgressIndicator from '../../../components/form/ProgressIndicator';

import { useAuth } from '../../../contexts/AuthContext';


function SignUpScreen({ navigation }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [confirmToken, setConfirmToken] = useState('');

    const { signInViaToken } = useAuth();

    const handleSignupSubmit = (data) => {
        setFormData({ ...formData, ...data });
        axiosInstance.post('/users/createUser', {
            email: data.email, password: data.password }
        )
        .then((response) => {
            if (response.status === 200) {
                setStep(2);
            } else {
                Alert.alert('Erreur lors de la création de compte', response.data.message);
            }
        })
        .catch((error) => {
            // status code
            if (error.response.status != 400){
                Alert.alert('Erreur lors de la création de compte', error.response.data.message );
            }
            else {
                Alert.alert('Erreur lors de la création de compte', "Une erreur a été détécté lors de la création de votre compte" );
            }
        });
    };

    const handleSubmitCode = (confirmToken) => {
        axiosInstance
        .get('/users/getUserByConfirmToken?confirmToken=' + confirmToken)
        .then((response) => {
            if (!response.data) {
                Alert.alert('Erreur lors de la création de compte', 'Code de confirmation invalide');
                return;
            }
            else {
                setConfirmToken(confirmToken);
                setStep(3);
                console.log('response /users/getUserByConfirmToken', response.data);
            }
        })
        .catch((error) => {
            Alert.alert('Erreur lors de la création de compte', 'Code de confirmation invalide');
            console.log(
            'error /users/getUserByConfirmToken',
            JSON.stringify(error)
            )
        });
    };
    
    const handleConfirmationSubmit = (data) => {
        setFormData({ ...formData, ...data });
        
        axiosInstance.post('/users/confirmUser', {
                pseudo: data.pseudo,
                alias: data.alias,
                bio: "",
                confirmToken: confirmToken,
            })
            .then((response) => {
                if (response.data) {
                    signInViaToken(response.data);
                }
            })
            .catch((error) => {
                Alert.alert('Erreur lors de la création de compte', error.response.data.message);
            });
    };

    return (
        <SafeAreaView style={[commonStyles.safeAreaContainer, {justifyContent : 'normal'} ]}>
            <View style={[commonStyles.columnCenterContainer, authStyle.formContainer]}>
                <View style={commonStyles.columnCenterContainer}>
                <Image
                    source={require('../../../assets/images/main_logo_no_bg.png')}
                    style={commonStyles.logo}
                />
                </View>


                <View style={[commonStyles.columnCenterContainer, authStyle.formContainer]}>
                    <View style={[commonStyles.row]} >
                        <ProgressIndicator isActive={step === 1} isCompleted={step > 1} />
                        <ProgressIndicator isActive={step === 2} isCompleted={step > 2} />
                        <ProgressIndicator isActive={step === 3} isCompleted={step > 3} />
                    </View>
                    
                    <View style={commonStyles.columnCenterContainer}>
                        {step === 1 && <SignupForm onSubmit={handleSignupSubmit} />}
                        {step === 2 && <ConfirmationCodeForm onSubmit={handleSubmitCode}  />}
                        {step === 3 && <ProfileSetUpForm onSubmit={handleConfirmationSubmit} />}
                    </View>
                </View>

            </View>
            <View style={commonStyles.row} >
                <Text style={[commonStyles.text, authStyle.noAccount]}>Déja un compte ? </Text>
                <Text style={commonStyles.textLink} 
                    onPress={() => navigation.navigate('signin')}
                >Se connecter</Text>
            </View>
        </SafeAreaView>
    );
}

export default SignUpScreen;