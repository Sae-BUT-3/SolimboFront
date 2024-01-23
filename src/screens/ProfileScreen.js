import React from 'react';
import { Button, View, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

function ProfileScreen() {
    const { logout } = useAuth();

    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Profile Screen</Text>
        {/* Logout Button */}
        <Button title="Logout" onPress={logout} />

    </View>
}

export default ProfileScreen;