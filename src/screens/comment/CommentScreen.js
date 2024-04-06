import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Animated, Platform, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons'; // Importation de FontAwesome5
import { Avatar, Provider as PaperProvider, Snackbar, TextInput } from 'react-native-paper';
import { Colors } from '../../style/color';
import { DataTable } from 'react-native-paper';
import Comment from '../../components/common/Comment';
import Tokenizer from '../../utils/Tokenizer';
import axiosInstance from '../../api/axiosInstance';
import Review from '../../components/common/Review';
import ErrorRequest from '../../components/ErrorRequest';
import Loader from '../../components/Loader';

const numberOfItemsPerPageList = [5, 10, 15 , 20, 25];

const CommentScreen = () => {
    const route = useRoute();
    const id  = route.params?.id || null;
    const navigation = useNavigation();
    const scrollY = useRef(new Animated.Value(0)).current;
    const [currentUser, setUser] =  useState({});
    const [review, setReview] = useState(null);
    const [comments, setComments] = useState([]);
    const [comment, setText] = useState('');
    const [response, setInfoResponse] = useState(null)
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null)
    const [page, setPage] = useState(0);
    const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);
    const [count, setCount] = useState(0);
    const [visible, setVisible] = useState(false);

    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => setVisible(false);

    const getData = async ()=>{
        setUser(await Tokenizer.getCurrentUser());
    }
   useEffect(() => {
        handleChangePage(0);
     }, [itemsPerPage]);

    useEffect(() => {
        getData()
        axiosInstance.get(`/review/${id}`, {params: {page: page + 1, pageSize: itemsPerPage, orderByLike: false}})
        .then(response => {
          setReview(response.data);
          setComments(response.data.comments);
          setCount(response.data.countComment)
          setIsLoading(false);
        }).catch(e => setError(e.response.data));
    }, []);  
    
    const updateComments = (newPage, newItemsPerPage) => {
        axiosInstance.get(`/review/${id}`, {params: {page: newPage + 1, pageSize: newItemsPerPage, orderByLike: false}})
        .then(response => {
          setReview(response.data);
          setComments(response.data.comments);
          setIsLoading(false);
        }).catch(e => setError(e.response.data));
    }

    const handleChangePage = (newPage) => {
        setIsLoading(true);
        setPage(newPage);
        updateComments(newPage, itemsPerPage);
    };

    const handleonItemsPerPageChange = (item) => {
        setIsLoading(true);
        onItemsPerPageChange(item); 
        setPage(0);
        updateComments(0, item);
      
    }

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
        if(comment !== ''){
            if(response == null){
                axiosInstance.put(`/review/${id}/comment`, {description: comment})
                .then(response => {
                    updateComments();
                    setText('')
                }).catch(e => setError(e.response.data));
            }else{
            axiosInstance.put(`/comment/${response.id_com}`, {description: comment})
            .then(response => {
                updateComments();
                setText('')
            }).catch(e => setError(e.response.data));
        }
        }
    }

    if (error) {
        return <ErrorRequest err={error}/>;
    }

    return (
        <View style={styles.container}>
            {isLoading ? (<Loader />) : (
                <PaperProvider>
                    <Animated.View>
                        <View style={[styles.header, headerOpacity ]}>
                            <Pressable onPress={handleGoBack}>
                                <FontAwesome5 name="arrow-left" size={30} color={Colors.SeaGreen}/>
                            </Pressable>
                            <Text style={styles.title}>Commentaires</Text>
                            <Text/>
                        </View>
                    </Animated.View>
                    <ScrollView
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >    
                    {count > 0 ? 
                        <DataTable>
                            <DataTable.Header  style={{marginBottom: 30, borderBottomColor: Colors.Onyx}}>
                                <Review data={review} />
                            </DataTable.Header>
                            {comments.map((item, index) => (
                                <DataTable.Row key={index} style={{borderBottomWidth: 0, marginBottom: 20}}>
                                    <DataTable.Cell>
                                        <Comment key={index} data={item} onToggleSnackBar={onToggleSnackBar} responseHandler={setInfoResponse} /> 
                                    </DataTable.Cell>
                                </DataTable.Row>
                            )) }
                            <DataTable.Pagination
                                page={page}
                                numberOfPages={Math.ceil(count / itemsPerPage)}
                                onPageChange={page => {handleChangePage(page)}}
                                label={`${page * itemsPerPage + 1}-${Math.min((page + 1) * itemsPerPage, count)} à ${count}`}
                                numberOfItemsPerPageList={numberOfItemsPerPageList}
                                numberOfItemsPerPage={itemsPerPage}
                                onItemsPerPageChange={handleonItemsPerPageChange}
                                selectPageDropdownLabel={'Commentaire par page'}
                                showFastPaginationControls
                                paginationControlRippleColor={Colors.White}
                                dropdownItemRippleColor={Colors.White}
                                selectPageDropdownRippleColor={Colors.White}
                                style={{backgroundColor: Colors.Jet, color: Colors.White}}
                            /></DataTable> 
                         :  <Text style={{ color: Colors.White, fontSize: 20, textAlign: 'center'  }}>Aucun commentaire, soyez le premier à rédiger un commentaire !</Text> 
                        }
                    </ScrollView>
                    <Snackbar
                        visible={response ?  true : false}
                        onDismiss={onDismissSnackBar}
                        duration={Snackbar.DURATION_LONG}
                        action={{
                        label: 'Fermer',
                        onPress: onDismissSnackBar
                    }}>{`Réponse au commentaire de  ${response?.utilisateur.alias}`}
                    </Snackbar>
                    <TextInput
                        multiline
                        maxLength={1500}
                        placeholder={`Ajouter un commentaire...`}
                        value={comment}
                        onChangeText={(text) => setText(text)}
                        underlineColor={Colors.Silver}
                        activeUnderlineColor={Colors.Silver}
                        textColor={Colors.White}
                        color={Colors.White}
                        selectionColor={Colors.SeaGreen}
                        style={{ backgroundColor: Colors.Silver, color: Colors.White, fontSize: 18, paddingHorizontal: 10,  paddingVertical: 5, borderRadius: 0  }}
                        left={
                            <TextInput.Affix text={
                                <Avatar.Image source={{ uri: currentUser.photo || require('../../assets/images/profil.png') }} size={64} accessibilityLabel={currentUser.pseudo} />
                            } />
                        }
                        right={
                            <TextInput.Icon icon="send" 
                                onPress={addComment}
                                style={{ fontSize: 30, color: Colors.SeaGreen, backgroundColor: 'transparent' }} 
                            />
                        }
                    />
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
        alignItems: 'center',
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
    title: {
        fontSize: Platform.OS === "web" ? 35 : 30,
        color: Colors.SeaGreen,
        fontWeight: 'bold'
    },
    sender: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        backgroundColor: Colors.Silver,
        padding: 10
    }
});

export default CommentScreen;