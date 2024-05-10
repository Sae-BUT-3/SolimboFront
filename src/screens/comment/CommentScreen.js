import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, Animated, Platform, ScrollView } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons'; // Importation de FontAwesome5
import {Provider as PaperProvider} from 'react-native-paper';
import { Colors } from '../../style/color';
import { DataTable } from 'react-native-paper';
import Comment from '../../components/comment/Comment';
import Tokenizer from '../../utils/Tokenizer';
import axiosInstance from '../../api/axiosInstance';
import Review from '../../components/review/Review';
import ErrorRequest from '../../components/common/ErrorRequest';
import Loader from '../../components/common/Loader';
import { RefreshControl } from 'react-native';

const numberOfItemsPerPageList = [25, 55, 100, 250];

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
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        updateComments(page, itemsPerPage);
        setTimeout(() => {
          setRefreshing(false);
        }, 2000);
    }, []);
    
    useFocusEffect(
        useCallback(() => {
          updateComments(page, itemsPerPage);
        }, [])
    );

   useEffect(() => {
        handleChangePage(0);
     }, [itemsPerPage]);

    useEffect(() => {
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

    const handleResponse = () =>{
        navigation.navigate("Response", {type: 'review', id: id});
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
                                <FontAwesome5 name="chevron-left" size={25} color={Colors.White} style={{paddingTop: 15}}/>
                            </Pressable>
                            <Text style={styles.title}>Commentaires</Text>
                            <Text/>
                        </View>
                    </Animated.View>
                    <ScrollView
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.DarkSpringGreen]}  tintColor={Colors.DarkSpringGreen} size='large' title='Actualisation...' titleColor={Colors.White}/>
                        }
                    >    
                    {count > 0 ? 
                        <DataTable>
                            <DataTable.Header  style={{marginBottom: 30, borderBottomColor: Colors.Onyx}}>
                                <Review data={review} />
                            </DataTable.Header>
                            {comments.map((item, index) => (
                                <DataTable.Row key={index} style={{borderBottomWidth: 0, marginBottom: 20}}>
                                    <DataTable.Cell>
                                        <Comment key={index} data={item} hide={false}/> 
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
                                style={{backgroundColor: Colors.Jet, color: Colors.White}}
                            />
                            </DataTable> 
                         :  <Text style={{ color: Colors.White, fontSize: 20, textAlign: 'center', marginTop: 30  }}>Aucun commentaire, soyez le premier à rédiger un commentaire !</Text> 
                        }
                    </ScrollView>
                    <View style={styles.response}>
                        <Pressable onPress={handleResponse}>
                            <FontAwesome5 name="comment-medical" size={30} color={Colors.DarkSpringGreen} regular/>
                        </Pressable> 
                    </View>
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
        padding: 30,
        position: 'relative',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: 'rgba(43, 43, 43, 0.3)',
    },
    title: {
        fontSize: Platform.OS === "web" ? 35 : 25,
        color: Colors.White,
        fontWeight: 'bold',
        paddingTop: 15,
    },
    response: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 20,
        left: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(43, 43, 43, 0.5)', 
        width: 50,
        height: 50,
        borderRadius: 25, 
        padding: 10, 
    }
    
});

export default CommentScreen;