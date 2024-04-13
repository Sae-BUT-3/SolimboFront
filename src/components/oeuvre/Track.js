import React, {useState} from 'react';
import { StyleSheet, View, Text, Pressable, Platform} from 'react-native';
import { Colors } from '../../style/color';
import {useNavigation} from '@react-navigation/native'

const toCapitalCase = (mot) => {
    return mot.charAt(0).toUpperCase() + mot.slice(1);
}

const Track = ({data}) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <Pressable
            activeOpacity={1}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={[
            styles.container,
            isHovered ? styles.itemHovered : null
            ]}
        >
        </Pressable>
    )
}
const styles = StyleSheet.create({
    container: { 
        backgroundColor: Colors.Jet,
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginLeft: Platform.OS == 'web' ? 30 : 20,
        marginRight: Platform.OS == 'web' ? 0 : 20,
        borderRadius: 15,
        maxWidth: 200,
        shadowColor: Colors.Onyx,
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: Platform.OS === 'android' ? 3 : 0, 
        transition: 'background-color 0.3s ease',
        marginBottom: 30
    },
    item: {
        display:'flex',
        flexDirection: Platform.OS == 'web' ? 'columns' : 'row',
        overflow: 'hidden',
        gap: 5,
        alignItems: 'center',
        color: Colors.White,
        fontWeight: 'normal',
        
    },
    itemHovered: {
        backgroundColor: Colors.Onyx, // Fond avec effet de fondu
    },
 
});
export default Track