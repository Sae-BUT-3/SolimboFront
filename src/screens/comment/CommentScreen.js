import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Animated, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons'; // Importation de FontAwesome5
import { Provider as PaperProvider } from 'react-native-paper';
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
    const [review, setReview] = useState(null);
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null)
    const [page, setPage] = useState(0);
    const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        axiosInstance.get(`/review/${id}`, {params: {page: page + 1, pageSize: itemsPerPage, orderByLike: false}})
        .then(response => {
          setReview(response.data);
          setComments(response.data.comments);
          setCount(response.data.countComment)
          setIsLoading(false);
        }).catch(e => setError(e.response.data));
    }, []);  
    
    const updateComments = () => {
        axiosInstance.get(`/review/${id}`, {params: {page: page + 1, pageSize: itemsPerPage, orderByLike: false}})
        .then(response => {
          setReview(response.data);
          setComments(response.data.comments);
          setIsLoading(false);
        }).catch(e => setError(e.response.data));
    }

    const handleChangePage = (newPage) => {
        setIsLoading(true);
        setPage(newPage);
        updateComments();
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100, 200],
        outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)', 'rgba(64, 64, 64, 1)'],
        extrapolate: 'clamp',
        
    });

    if (error) {
        return <ErrorRequest err={error}/>;
    }

    return (
        <View style={styles.container}>
            {isLoading ? (<Loader />) : (
                <PaperProvider>
                    <Animated.View>
                        <View style={[styles.header, { opacity: headerOpacity }]}>
                            <Pressable onPress={handleGoBack}>
                                <FontAwesome5 name="arrow-left" size={30} color={Colors.SeaGreen}/>
                            </Pressable>
                            <Text style={styles.title}>Commentaires</Text>
                            <Text/>
                        </View>
                    </Animated.View>
                    <Animated.ScrollView
                        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
                        scrollEventThrottle={16}
                    >                        
                        <DataTable>
                            <DataTable.Header  style={{margin: 'auto', borderBottomColor: Colors.Silver}}>
                                <Review data={review} />
                            </DataTable.Header>
                            {comments.length > 0 ?<>
                                {comments.map((item, index) => (
                                    <DataTable.Row key={index}  style={{margin: 'auto', borderBottom: 'none'}}>
                                        <DataTable.Cell>
                                            <Comment key={index} data={item} /> 
                                        </DataTable.Cell>
                                    </DataTable.Row>
                                )) }
                                <DataTable.Pagination
                                    page={page}
                                    numberOfPages={Math.ceil(count / itemsPerPage)}
                                    onPageChange={(page) => handleChangePage(page)}
                                    label={`${page * itemsPerPage + 1}-${Math.min((page + 1) * itemsPerPage, count)} à ${count}`}
                                    numberOfItemsPerPageList={numberOfItemsPerPageList}
                                    numberOfItemsPerPage={itemsPerPage}
                                    onItemsPerPageChange={onItemsPerPageChange}
                                    selectPageDropdownLabel={'Commentaire par page'}
                                    showFastPaginationControls
                                    paginationControlRippleColor={Colors.White}
                                    dropdownItemRippleColor={Colors.White}
                                    selectPageDropdownRippleColor={Colors.Jet}
                                    style={{backgroundColor: Colors.Jet, color: Colors.White}}
                                /></>
                                : <DataTable.Row  style={{margin: 'auto', borderBottom: 'none'}}>
                                    <DataTable.Cell>
                                        <Text style={{ color: Colors.White, fontSize: 20, textAlign: 'center'  }}>Aucun commentaire, soyez le premier à rédiger un commentaire !</Text>
                                    </DataTable.Cell>
                                </DataTable.Row>
                            }
                        </DataTable>
                    </Animated.ScrollView>
                </PaperProvider>
            )}
        </View>
    ) 
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Onyx,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.Jet,
        position: 'relative',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        marginBottom: 30
    },
    title: {
        fontSize: Platform.OS === "web" ? 35 : 25,
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