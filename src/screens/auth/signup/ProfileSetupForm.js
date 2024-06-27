import React, { useState } from 'react';
import { View, Text} from 'react-native';
import BasicInput from '../../../components/form/BasicInput';
import PressableBasic from '../../../components/pressables/PressableBasic';
import commonStyles from '../../../style/commonStyle';
import { Colors } from '../../../style/color';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axiosInstance from '../../../api/axiosInstance';
import { useTranslation } from 'react-i18next';

const ProfileSetUpForm = ({ onSubmit, errors }) => {
    const [pseudo, setPseudo] = useState('');
    const [alias, setAlias] = useState('');

    const [isCheckingPseudo, setIsCheckingPseudo] = useState(false);
    const [isPseudoAvailable, setIsPseudoAvailable] = useState(true);
    const [pseudoCheckTimeout, setPseudoCheckTimeout] = useState(null);

    const { t } = useTranslation();

    const checkPseudoAvailability = async (pseudo) => {
        setIsCheckingPseudo(true);
        try {
            const response = await axiosInstance.get(`/users/isUser?pseudo=${pseudo}`);
            setIsPseudoAvailable(!response.data.isUser);
        } catch (error) {
            //console.error('Erreur lors de la vérification de la disponibilité du pseudo', error);
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

    const handleSubmit = () => {
        if (isPseudoAvailable && pseudo.trim() !== '' && alias.trim() !== '') {
            onSubmit({ pseudo, alias });
        }
    }

    return (
        <View style={commonStyles.columnCenterContainer} >
            <BasicInput
                placeholder="Pseudo"
                value={pseudo}
                onChangeText={handlePseudoChange}
            />
            <BasicInput
                placeholder="Alias"
                value={alias}
                onChangeText={setAlias}
            />
            <PressableBasic text={t("auth.createaccount")} onPress={handleSubmit} disabled={!isPseudoAvailable || pseudo.trim() === '' || alias.trim() === ''} />
            {isCheckingPseudo ? (
                <Text>{t("auth.checkpseudoavailability")}</Text>
            ) : isPseudoAvailable ? null : (
                <View style={[commonStyles.row, ]}>
                    <FontAwesome5
                        name="exclamation-circle"
                        size={18}
                        color={Colors.CalPolyGreen}
                        style={{ marginRight: 5 }}
                    />
                    <Text style={commonStyles.textError}>
                        {t("auth.pseudoalreadyused")}
                    </Text>
                </View>
            )}
        </View>
    );
};

export default ProfileSetUpForm;