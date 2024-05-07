import React, { useEffect, useState, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, Animated, Platform, ScrollView, RefreshControl } from 'react-native'; 
import { Provider as PaperProvider } from 'react-native-paper';
import { Colors } from '../../style/color';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'; // Importation de FontAwesome5
import { DataTable } from 'react-native-paper';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import Review from '../../components/review/Review';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/common/Loader';
import ErrorRequest from '../../components/common/ErrorRequest';
import Filter from '../../components/search/Filter';

const numberOfItemsPerPageList = [25 , 50, 100, 250];
const sorts =  ["Suivis uniquement","Par date", "Par like" ];
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
    const [filtre, setFiltre] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
      setRefreshing(true);
      updateReviews(page, itemsPerPage);
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }, []);

    useFocusEffect(
        useCallback(() => {
            updateReviews(page, itemsPerPage);
        }, [])
    );
    
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

    

    const handleSort = (like) => {
        updateReviews(page, itemsPerPage, like);
    }

    if (error) {
        return <ErrorRequest err={error} />;
    }

    return ( isLoading ? <Loader /> : (
                <PaperProvider>
                    <View style={styles.container}>
                        <Animated.View style={[styles.header]}>
                            <Pressable onPress={() => { navigation.goBack() }}>
                                <FontAwesome5 name="chevron-left" size={25} color={Colors.White} style={{paddingTop: 15}}/>
                            </Pressable>
                            <Text style={styles.title}>Reviews</Text>
                            <Text/>
                        </Animated.View>
                        <ScrollView
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }                       
                        >
                            <ScrollView style={styles.diplayContainer} horizontal={true}>
                                <View style={{display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap'}}>
                                    <FontAwesome name="filter" size={25} color={Colors.DarkSpringGreen} regular/>
                                    {sorts.map((item, index) => (
                                        <Filter
                                            key={index}
                                            onPressHandler={()=>{item === 'Suvis uniquement' ? setFiltre(!filtre) : handleSort(item === 'Like')}}
                                            text={item}
                                        />
                                    ))}
                                
                                </View>
                        </ScrollView>
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
                                {reviewsArtist?.filter(item => {
                                    if(filtre) 
                                        return item.made_by_friend
                                    return 1
                                }).map((item, index) => (
                                    <DataTable.Row key={index} style={{marginTop: 20, marginLeft: 0, borderBottomColor: Colors.Onyx}}>
                                        <DataTable.Cell>
                                            <Review data={item}/>
                                        </DataTable.Cell>
                                    </DataTable.Row>
                                ))}
                                { count > 25 && 
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
                                    style={{backgroundColor: Colors.Jet, color: Colors.White}}
                                    />
                                }
                            </DataTable>
                            : <Text style={{ color: Colors.White, fontSize: 20, textAlign: 'center', marginTop: 30 }}>Aucune critique, soyez le premier à rédiger une critique !</Text>
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
    diplayContainer: {
        padding: 15,
        paddingLeft: 20,
        backgroundColor: 'rgba(43, 43, 43, 0.3)',

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
