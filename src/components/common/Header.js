import React, {useState, useRef, useEffect} from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Colors } from '../../style/color';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Avatar from '@mui/material/Avatar';
import { useNavigation } from '@react-navigation/native';
import Tokenizer from '../../utils/Tokenizer';

const Header = ({scrollY}) =>{
    const [currentUser, setCurrentUser] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setCurrentUser(await Tokenizer.getCurrentUser());
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const navigation = useNavigation();
    const handleGoBack = () => {
        navigation.goBack();
    };

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100, 200],
        outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)', 'rgba(64, 64, 64, 1)'],
        extrapolate: 'clamp',
    });
    return(
        <Animated.View>
            <View style={[styles.header, { opacity: headerOpacity }]}>
                <Pressable onPress= {handleGoBack} style={styles.btnRetour}>
                    <ArrowBackIosNewIcon sx={{color: Colors.White }}/>
                </Pressable>
                <Pressable><Avatar src={currentUser?.photo}/></Pressable>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    header:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.Jet,
        position: 'relative',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        top: 0,
        left: 0,
        borderBottomColor: Colors.Onyx,
        right: 0,
        zIndex: 1, 
    },
    title:{
        fontSize: Platform.OS == 'web' ? 'xx-large' : 'large',
        color: Colors.White,
        fontWeight:'bold'
    },
    btnRetour:{
        borderRadius: Platform.OS == 'web' ? '100%' : null,
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
    }
})

export  default Header; 