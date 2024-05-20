import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, Animated, Platform, RefreshControl, FlatList } from 'react-native';
import { Colors } from '../../style/color';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'; // Importation de FontAwesome5
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import Review from '../../components/review/Review';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/common/Loader';
import ErrorRequest from '../../components/common/ErrorRequest';
import Filter from '../../components/search/Filter';

const sorts =  ["Suivis uniquement","Par date", "Par like" ];
const ReviewScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route.params || null;
    const [reviews, setReviews] = useState([]);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState(false);

    const onRefresh = useCallback(() => {
      setRefreshing(true);
      setPage(0);
      loadReviews(0, true);
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadReviews(0, true);
        }, [])
    );

    const loadReviews = (newPage, reset = false) => {
        if (!reset) {
            setIsLoadingMore(true);
        }
        axiosInstance.get(`/reviews/oeuvre/${id}`, { params: { page: newPage + 1, pageSize: 100, orderByLike: false } })
            .then(response => {
                setReviews(reset ? response.data.data : [...reviews, ...response.data.data]);
                setCount(response.data.count);
                setIsLoading(false);
                setIsLoadingMore(false);
                setRefreshing(false);
            }).catch(e => {
                setError(e.response.data);
                setIsLoading(false);
                setIsLoadingMore(false);
                setRefreshing(false);
            });
    };

    const handleLoadMore = () => {
        if (!isLoadingMore && reviews.length < count) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadReviews(nextPage);
        }
    };

    if (error) {
        return <ErrorRequest err={error} />;
    }

    return (isLoading ? <Loader /> : (
        <View style={styles.container}>
            <Animated.View style={[styles.header]}>
                <Pressable onPress={() => { navigation.goBack() }}>
                    <FontAwesome5 name="chevron-left" size={25} color={Colors.White} style={{ paddingTop: 15 }} />
                </Pressable>
                <Text style={styles.title}>Reviews</Text>
                <Text />
            </Animated.View>
            <FlatList
                data={filter ? reviews.filter(review => review.made_by_friend) : reviews}
                keyExtractor={(item) => item.id_review.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Review data={item} />
                    </View>
                )}
                ListHeaderComponent={
                    <View style={styles.diplayContainer} horizontal={true}>
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
                            <FontAwesome name="filter" size={25} color={Colors.DarkSpringGreen} regular />
                            {sorts.map((item, index) => (
                                <Filter
                                    key={index}
                                    onPressHandler={() => { item === 'Suvis uniquement' ? setFilter(!filter) : handleSort(item === 'Like') }}
                                    text={item}
                                />
                            ))}
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    !isLoadingMore ? <Text style={{ color: Colors.White, fontSize: 20, textAlign: 'center', marginTop: 30 }}>Aucune critique, soyez le premier à rédiger une critique !</Text> : null
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[Colors.DarkSpringGreen]}
                        tintColor={Colors.DarkSpringGreen}
                        size='large'
                        title='Actualisation...'
                        titleColor={Colors.White}
                    />
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    isLoadingMore ? <Loader /> : null
                }
            />
        </View>
    ));
};

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
    itemContainer: {
        width: '100%',
        alignItems: 'center',
    },
});

export default ReviewScreen;
