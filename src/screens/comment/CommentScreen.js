import React, { useState, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, Animated, Platform, RefreshControl, FlatList } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons'; // Importation de FontAwesome5
import { Colors } from '../../style/color';
import Comment from '../../components/comment/Comment';
import axiosInstance from '../../api/axiosInstance';
import Review from '../../components/review/Review';
import ErrorRequest from '../../components/common/ErrorRequest';
import Loader from '../../components/common/Loader';
import screenStyle from '../../style/screenStyle';

const CommentScreen = () => {
    const route = useRoute();
    const id = route.params?.id || null;
    const navigation = useNavigation();
    const scrollY = useRef(new Animated.Value(0)).current;
    const [review, setReview] = useState({});
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setPage(0);
        loadComments(0, true);
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadComments(0, true);
        }, [])
    );

    const loadComments = (newPage, reset = false) => {
        if (!reset) {
            setIsLoadingMore(true);
        }
        axiosInstance.get(`/review/${id}`, { params: { page: newPage + 1, pageSize: 100, orderByLike: false } })
            .then(response => {
                setReview(response.data);
                setComments(reset ? response.data.comments : [...comments, ...response.data.comments]);
                setCount(response.data.countComment);
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
        if (!isLoadingMore && comments.length < count && comments.length > 0) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadComments(nextPage);
        }
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleResponse = () => {
        navigation.navigate("response", { type: 'review', id: id });
    };

    if (error) {
        return <ErrorRequest err={error} />;
    }

    return (
        <View style={screenStyle.container}>
            {isLoading ? <Loader /> : (
                <>
                    <Animated.View>
                        <View style={screenStyle.header}>
                            <Pressable onPress={handleGoBack}>
                                <FontAwesome5 name="chevron-left" size={25} color={Colors.White} style={{ paddingTop: 15 }} />
                            </Pressable>
                            <Text style={screenStyle.title}>Commentaires</Text>
                            <Text />
                        </View>
                    </Animated.View>
                    <FlatList
                        contentContainerStyle={styles.contentContainer}
                        ListHeaderComponentStyle={{marginBottom: 30, borderBottomColor: Colors.Onyx, borderBottomWidth: 1}}
                        data={comments}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <Comment data={item} hide={false} />
                        )}
                        ListHeaderComponent={
                            <Review data={review} />
                        }
                        ListEmptyComponent={
                            <Text style={styles.noCommentText}>Aucun commentaire, soyez le premier à rédiger un commentaire !</Text>
                        }
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[Colors.DarkSpringGreen]}
                                tintColor={Colors.DarkSpringGreen}
                                size="large"
                                title="Actualisation..."
                                titleColor={Colors.White}
                            />
                        }
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={
                            isLoadingMore ? <Loader /> : null
                        }
                    />
                    <View style={styles.response}>
                        <Pressable onPress={handleResponse}>
                            <FontAwesome5 name="comment-medical" size={30} color={Colors.DarkSpringGreen} regular />
                        </Pressable>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    response: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(43, 43, 43, 0.5)',
        width: 50,
        height: 50,
        borderRadius: 25,
        padding: 10,
    },
    noCommentText: {
        color: Colors.White,
        fontSize: 20,
        textAlign: 'center',
        marginTop: 30,
    },
});

export default CommentScreen;
