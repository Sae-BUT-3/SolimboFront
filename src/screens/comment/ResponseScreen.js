import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Animated, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { Avatar, Provider as PaperProvider, TextInput } from 'react-native-paper';
import { Colors } from '../../style/color';
import { DataTable } from 'react-native-paper';
import Comment from '../../components/comment/Comment';
import Tokenizer from '../../utils/Tokenizer';
import axiosInstance from '../../api/axiosInstance';
import Review from '../../components/review/Review';
import ErrorRequest from '../../components/common/ErrorRequest';
import Loader from '../../components/common/Loader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import pressableBasicStyle from '../../style/pressableBasicStyle';
import Toast from 'react-native-toast-message';
import screenStyle from '../../style/screenStyle';

const ResponseScreen = () => {
    const route = useRoute();
    const { id, type } = route.params || {};
    const navigation = useNavigation();
    const scrollY = useRef(new Animated.Value(0)).current;
    const [currentUser, setUser] = useState({});
    const [data, setData] = useState(null);
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getData = async () => {
        setUser(await Tokenizer.getCurrentUser());
    };

    useEffect(() => {
        getData();
        const endpoint = type === 'review' ? `/review/${id}` : `/comment/${id}`;
        axiosInstance.get(endpoint, { params: { page: 1, pageSize: 1, orderByLike: false } })
            .then(response => {
                const responseData = type === 'review' ? response.data : response.data.comment;
                setData(responseData);
                setIsLoading(false);
            }).catch(e => setError(e.response.data));
    }, [id, type]);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const addComment = () => {
        if (comment.trim() !== '') {
            const endpoint = type === 'review' ? `/review/${id}/comment` : `/comment/${id}`;
            axiosInstance.put(endpoint, { description: comment })
                .then(() => {
                    Toast.show({
                        type: 'success',
                        text1: '✅ Votre commentaire a bien été posté.',
                        text1Style: { color: Colors.White }
                    });
                    handleGoBack();
                }).catch(() => {
                    Toast.show({
                        type: 'error',
                        text1: '❌ Votre commentaire n\'a pas pu être posté.',
                        text1Style: { color: Colors.White }
                    });
                    handleGoBack();
                });
        }
    };

    if (error) {
        return <ErrorRequest err={error} />;
    }

    return (
        <View style={screenStyle.container}>
            {isLoading ? <Loader /> : (
                <PaperProvider>
                    <Animated.View>
                        <View style={[screenStyle.header,{ marginBottom: 30}]}>
                            <Pressable onPress={handleGoBack}>
                                <FontAwesome5 name="chevron-left" size={30} color={Colors.White} />
                            </Pressable>
                        </View>
                    </Animated.View>
                    <KeyboardAwareScrollView
                        contentContainerStyle={styles.scrollView}
                        enableOnAndroid={true}
                        extraScrollHeight={Platform.OS === 'ios' ? 0 : 120}
                    >
                        <DataTable style={{ marginBottom: 30 }}>
                            <DataTable.Header style={{ borderBottomColor: Colors.Jet }}>
                                <View style={{ marginBottom: 30 }}>
                                    {type === 'review' ? <Review data={data} /> : <Comment data={data} hide={true} />}
                                </View>
                            </DataTable.Header>
                        </DataTable>
                        <View style={styles.commentSection}>
                            <View style={styles.userInfo}>
                                <Avatar.Image source={{ uri: currentUser.photo || require('../../assets/images/profil.png') }} size={64} accessibilityLabel={currentUser.pseudo} />
                                <Text style={styles.userAlias}>{'@' + currentUser.alias}</Text>
                            </View>
                            <TextInput
                                multiline
                                maxLength={1500}
                                placeholder={type === 'review' ? 'Rédiger un commentaire à la critique...' : `Réponse au commentaire de ${data.utilisateur.alias}...`}
                                value={comment}
                                onChangeText={setComment}
                                underlineColor={Colors.Onyx}
                                activeUnderlineColor={Colors.BattleShipGray}
                                textColor={Colors.White}
                                cursorColor={Colors.SeaGreen}
                                selectionColor={Colors.SeaGreen}
                                style={styles.input}
                            />
                            <Pressable style={[pressableBasicStyle.button, styles.commentButton]} onPress={addComment}>
                                <FontAwesome size={20} name='send-o' color={Colors.White} style={styles.sendIcon} />
                                <Text style={screenStyle.filterText}>Commenter</Text>
                            </Pressable>
                        </View>
                    </KeyboardAwareScrollView>
                </PaperProvider>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    commentSection: {
        backgroundColor: Colors.Jet,
        padding: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    userAlias: {
        color: Colors.SeaGreen,
        fontSize: 19,
        fontWeight: 'normal',
        marginLeft: 10,
    },
    input: {
        backgroundColor: Colors.Jet,
        fontSize: 18,
        padding: 10,
        marginBottom: 20,
    },
    commentButton: {
        width: 160,
    },
    sendIcon: {
        paddingRight: 10,
    },
});

export default ResponseScreen;
