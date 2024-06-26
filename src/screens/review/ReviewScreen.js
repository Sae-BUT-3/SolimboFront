import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, Animated, RefreshControl, FlatList } from 'react-native';
import { Colors } from '../../style/color';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'; // Import FontAwesome5
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import Review from '../../components/review/Review';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/common/Loader';
import ErrorRequest from '../../components/common/ErrorRequest';
import Filter from '../../components/search/Filter';
import screenStyle from '../../style/screenStyle';

const sorts = ["Suivis uniquement", "Par date", "Par like"];

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

    const handleSort = (orderByLike) => {
        axiosInstance.get(`/reviews/oeuvre/${id}`, { params: { page: 1, pageSize: 100, orderByLike: orderByLike } })
            .then(response => {
                setReviews(response.data.data);
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

    if (error) {
        return <ErrorRequest err={error} />;
    }

    return (
        <View style={screenStyle.container}>
            <Animated.View style={[screenStyle.header, {marginBottom: 0}]}>
                <Pressable onPress={() => navigation.goBack()}>
                    <FontAwesome5 name="chevron-left" size={25} color={Colors.White} style={{ paddingTop: 15 }} />
                </Pressable>
                <Text style={screenStyle.title}>Reviews</Text>
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
                    <View style={styles.diplayContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 10 }}>
                            <FontAwesome name="filter" size={25} color={Colors.DarkSpringGreen} />
                            {sorts.map((item, index) => (
                                <Filter
                                    key={index}
                                    onPressHandler={() => item === 'Suivis uniquement' ? setFilter(!filter) : handleSort(item === 'Par like')}
                                    text={item}
                                />
                            ))}
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Aucune critique, soyez le premier à rédiger une critique !</Text>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[Colors.DarkSpringGreen]}
                        tintColor={Colors.DarkSpringGreen}
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
    );
};

const styles = StyleSheet.create({
    diplayContainer: {
        padding: 15,
        paddingLeft: 20,
        backgroundColor: 'rgba(43, 43, 43, 0.3)',
        marginBottom: 30
    },
    itemContainer: {
        width: '100%',
        alignItems: 'center',
    },
    emptyText: {
        color: Colors.White,
        fontSize: 20,
        textAlign: 'center',
        marginTop: 30,
    },
});

export default ReviewScreen;
