import React, { useContext } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native';
import commonStyles from '../style/commonStyle';

function HomeScreen() {
    return (
        <SafeAreaView style={[commonStyles.safeAreaContainer ]}>
            <ScrollView >
                
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen;