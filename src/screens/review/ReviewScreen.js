import React, { useEffect, useState, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, Animated, Platform, ScrollView } from 'react-native'; 
import { Provider as PaperProvider } from 'react-native-paper';
import { Colors } from '../../style/color';
import { FontAwesome5 } from '@expo/vector-icons'; // Importation de FontAwesome5
import { DataTable } from 'react-native-paper';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import Review from '../../components/common/Review';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';
import ErrorRequest from '../../components/ErrorRequest';
import Filter from '../../components/search/Filter';
import { SafeAreaView } from 'react-native-safe-area-context';

const numberOfItemsPerPageList = [15, 25 , 55, 100, 250];
const sorts =  ["Date", "Like", "Amis uniquement"];
const ReviewScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {id, type }= route.params || null;
    const [reviews, setReviews] = useState([]);
    const [reviewsArtist, setReviewsArtist] = useState([]);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);

    useCallback(() => {
        updateReviews(page, itemsPerPage);
    }, []);
    
    const updateReviews = (newPage, newItemsPerPage, orderByLike=false) => {
        axiosInstance.get(`/reviews/oeuvre/${id}`, { params: { page: newPage + 1, pageSize: newItemsPerPage, orderByLike: orderByLike } })
        .then(response => {
            setReviews(response.data.data);
            setCount(response.data.count)
            setIsLoading(false);
        }).catch(e => setError(e.response.data));

        if(type === 'artist'){
            axiosInstance.get(`/reviews/artist/${id}`, { params: { page: newPage + 1, pageSize: newItemsPerPage, orderByLike: orderByLike } })
            .then(response => {
                setReviewsArtist(response.data);
                setCount(count + reviewsArtist.length);
                setIsLoading(false);
            }).catch(e => setError(e.response.data));
        }
    }

    const handleChangePage = (newPage) => {
        setIsLoading(true);
        setPage(newPage);
        updateReviews(newPage, itemsPerPage);
    };

    const handleonItemsPerPageChange = (item) => {
        setIsLoading(true);
        onItemsPerPageChange(item);
        setPage(0); 
        updateReviews(0, item);
    }

    useEffect(() => {
        axiosInstance.get(`/reviews/oeuvre/${id}`, { params: { page: page + 1, pageSize: itemsPerPage, orderByLike: false } })
        .then(response => {
            setReviews(response.data.data);
            setCount(response.data.count);
            setIsLoading(false);
        }).catch(e => setError(e.response.data));

        if(type === 'artist'){
            axiosInstance.get(`/reviews/artist/${id}`, { params: { page: page + 1, pageSize: itemsPerPage, orderByLike: false } })
            .then(response => {
                setReviewsArtist(response.data);
                setIsLoading(false);
            }).catch(e => setError(e.response.data));
        }
    }, [])

    const scrollY = useRef(new Animated.Value(0)).current;
    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const handleSort = (like) => {
        updateReviews(page, itemsPerPage, like);
    }

    if (error) {
        return <ErrorRequest err={error} />;
    }

    return ( isLoading ? <Loader /> : (
                <PaperProvider>
                    <View style={styles.container}>
                        <Animated.View style={[styles.header, headerOpacity]}>
                            <Pressable onPress={() => { navigation.goBack() }}>
                                <FontAwesome5 name="arrow-left" size={25} color={Colors.SeaGreen}/>
                            </Pressable>
                            <Text style={styles.title}>Reviews</Text>
                            <Text/>
                        </Animated.View>
                        <ScrollView>
                            <View style={styles.diplayContainer}>
                                <View style={{display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap'}}>
                                    <FontAwesome5 name="filter" size={20} color={Colors.SeaGreen} regular/>
                                    {sorts.map((item, index) => (
                                        <Filter
                                            key={index}
                                            onPressHandler={()=>handleSort(item === 'Like')}
                                            text={item}
                                        />
                                    ))}
                                
                                </View>
                        </View>
                        {count > 0 ?
                            <DataTable>
                               {reviews.map((item, index) => (
                                    <DataTable.Row key={index} style={{marginTop: 20, marginLeft: 0, borderBottomColor: Colors.Onyx}}>
                                        <DataTable.Cell>
                                            <Review data={item}/>
                                        </DataTable.Cell>
                                    </DataTable.Row>
                                ))
                                }
                                {reviewsArtist?.map((item, index) => (
                                    <DataTable.Row key={index} style={{marginTop: 20, marginLeft: 0, borderBottomColor: Colors.Onyx}}>
                                        <DataTable.Cell>
                                            <Review data={item}/>
                                        </DataTable.Cell>
                                    </DataTable.Row>
                                ))}
                                <DataTable.Pagination
                                    page={page}
                                    numberOfPages={Math.ceil(count / itemsPerPage)}
                                    onPageChange={page => {handleChangePage(page)}}
                                    label={`${page * itemsPerPage + 1}-${Math.min((page + 1) * itemsPerPage, count)} à ${count}`}
                                    numberOfItemsPerPageList={numberOfItemsPerPageList}
                                    numberOfItemsPerPage={itemsPerPage}
                                    onItemsPerPageChange={handleonItemsPerPageChange}
                                    selectPageDropdownLabel={'Review par page'}
                                    showFastPaginationControls
                                    paginationControlRippleColor={Colors.White}
                                    dropdownItemRippleColor={Colors.White}
                                    selectPageDropdownRippleColor={Colors.Jet}
                                    style={{backgroundColor: Colors.Licorice, color: Colors.White}}
                                />
                            </DataTable>
                            : <Text style={{ color: Colors.White, fontSize: 20, textAlign: 'center' }}>Aucune critique, soyez le premier à rédiger une critique !</Text>
                        }
                        </ScrollView>
                </View>
            </PaperProvider>
        )
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
        marginBottom: Platform.OS === 'web' ? 30 : 15,
        marginTop: Platform.OS === 'web' ? 30 : 15

    },
    title: {
        fontSize: Platform.OS === 'web' ? 35 : 25,
        color: Colors.SeaGreen,
        fontWeight: 'bold'
    },
    diplayContainer: {
        display: "flex",
        alignItems: "flex-start",
        padding: 15,
    },
    filterButton: {
        marginRight: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,

        backgroundColor: 'transparent',
        shadowColor: Colors.Onyx,
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: Platform.OS === 'android' ? 3 : 0, 
        transition: 'background-color 0.3s ease'
      },
      filterText: {
        fontWeight: 'bold',
        color: Colors.White,
        fontSize: 17,
        margin: 10
      },
})

export default ReviewScreen;
