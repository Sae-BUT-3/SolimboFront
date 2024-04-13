import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Animated, Platform, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons'; // Importation de FontAwesome5
import { Avatar, Provider as PaperProvider, TextInput } from 'react-native-paper';
import { Colors } from '../../style/color';
import { DataTable } from 'react-native-paper';
import Comment from '../../components/common/Comment';
import Tokenizer from '../../utils/Tokenizer';
import axiosInstance from '../../api/axiosInstance';
import Review from '../../components/common/Review';
import ErrorRequest from '../../components/ErrorRequest';
import Loader from '../../components/Loader';

const ResponseScreen = () => {
    const route = useRoute();
    const {id, type}  = route.params || null;
    const navigation = useNavigation();
    const scrollY = useRef(new Animated.Value(0)).current;
    const [currentUser, setUser] =  useState({});
    const [data, setData] = useState(null);
    const [comment, setText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null)
    

    const getData = async ()=>{
        setUser(await Tokenizer.getCurrentUser());
    }
    useEffect(() => {
        getData()
        if(type === 'review'){
            axiosInstance.get(`/review/${id}`, {params: {page: 1, pageSize: 1, orderByLike: false}})
            .then(response => {
            setData(response.data);
            setIsLoading(false);
            }).catch(e => setError(e.response.data));
        }else{
            axiosInstance.get(`/comment/${id}`, {params: {page: 1, pageSize: 1, orderByLike: false}})
            .then(response => {
              setData(response.data.comment);
              setIsLoading(false);
            }).catch(e => setError(e.response.data));
        }
    }, []);  
    
    const handleGoBack = () => {
        navigation.goBack();
    };

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100, 200],
        outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)', 'rgba(64, 64, 64, 1)'],
        extrapolate: 'clamp',
        
    });

    const handleScroll =  (event) => { 
        event.nativeEvent.contentOffset.y = scrollY
        event.useNativeDriver= true 
    };

    const addComment = () =>{
        console.log(type)
        if(comment !== ''){
            if(type === 'review'){
                axiosInstance.put(`/review/${id}/comment`, {description: comment})
                .then(response => {
                    handleGoBack()
                }).catch(e => setError(e.response.data));
            }else{
                axiosInstance.put(`/comment/${id}`, {description: comment})
                .then(response => {
                    handleGoBack()
                }).catch(e => setError(e.response.data));
            }
        }
    }

    if (error) {
        return <ErrorRequest err={error}/>;
    }

    return (
        <View style={styles.container}>
            {isLoading ? <Loader /> : (
            <PaperProvider>
                <Animated.View>
                    <View style={[styles.header, headerOpacity ]}>
                        <Pressable onPress={handleGoBack}>
                            <FontAwesome5 name="arrow-left" size={30} color={Colors.SeaGreen}/>
                        </Pressable>
                    </View>
                </Animated.View>
                <ScrollView
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >    
                    <DataTable>
                        <DataTable.Header  style={{marginBottom: 30, borderBottomColor: Colors.Onyx}}>
                            {type == "review" ?
                                <Review data={data} /> : <Comment data={data}/>
                            }
                        </DataTable.Header>
                    </DataTable>
                    <View style={{backgroundColor: Colors.Jet, display: 'flex', gap: 5, justifyContent:'flex-start', padding: 20}}>
                        <View style={{display: 'flex', flexDirection:'row', gap: 10, justifyContent: 'flex-start', alignItems: 'center'}}>
                            <Avatar.Image source={{ uri: currentUser.photo || require('../../assets/images/profil.png') }} size={64} accessibilityLabel={currentUser.pseudo} />
                            <Text style={{color: Colors.SeaGreen, fontSize: Platform.OS  === "web" ? 30 : 19, fontWeight: 'normal'}}>{'@' + currentUser.alias}</Text>
                        </View>
                        <TextInput
                            multiline
                            maxLength={1500}
                            placeholder={type === 'review'? 'Ajouter un commentaire...' : `Réponse au commentaire de `}
                            value={comment}
                            onChangeText={(text) => setText(text)}
                            underlineColor={Colors.Onyx}
                            activeUnderlineColor={Colors.Onyx}
                            textColor={Colors.White}
                            color={Colors.White}
                            cursorColor={Colors.SeaGreen}
                            selectionColor={Colors.SeaGreen}
                            style={{ backgroundColor: Colors.Jet, fontSize: 18, padding: 10, marginBottom: 20}}
                        />                                    
                        <Pressable style={styles.button} onPress={addComment}>
                            <Text style={styles.text}>Commenter</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </PaperProvider>
        )}
        </View>
    ) 
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Licorice,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingTop: 35,
        paddingLeft: 20,
        paddingBottom: 10,
        position: 'relative',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        marginBottom: Platform.OS === 'web' ? 30 : 20
    },
    text: {
        fontWeight: 'bold',
        color: Colors.White,
        fontSize: 17,
        textAlign: 'center'
    },
    button: {
        marginRight: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        width: 150,
        backgroundColor: Colors.SeaGreen,
        shadowColor: Colors.Onyx,
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: Platform.OS === 'android' ? 3 : 0, 
        transition: 'background-color 0.3s ease'
    },
});

export default ResponseScreen;