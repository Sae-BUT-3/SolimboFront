import React from 'react';
import { SafeAreaView, Button, View, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import commonStyles from '../style/commonStyle';

function ProfileScreen() {
    const { logout } = useAuth();

    return (
        <SafeAreaView style={[commonStyles.safeAreaContainer ]}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={[commonStyles.text]} >Profile Screen</Text>
                {/* Logout Button */}
                <Button style={[commonStyles.pressable]}  title="Logout" onPress={logout} />
            </View>
        </SafeAreaView>
    )
}

export default ProfileScreen;